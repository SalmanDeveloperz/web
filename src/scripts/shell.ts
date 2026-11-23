// A small POSIX-flavoured shell that runs in the hero terminal.
// Virtual filesystem built at compile time from src/data, pipes and && chains,
// tab completion, fish-style suggestions, reverse history search, and a few
// commands that read live data (GitHub API, the page's own performance).
import { themes, setTheme, currentTheme, cycleTheme } from './theme';

type FileNode = { c: string; href?: string };
export type ShellData = {
  user: string;
  host: string;
  home: string;
  email: string;
  resume: string;
  github: string;
  socials: Record<string, string>;
  files: Record<string, FileNode>;
  contrib: string[][];
  pods: string[][];
  build: { commit: string; at: string; astro: string };
  merged: number;
  orgs: number;
  started: string;
};

type Out = { html: string; text: string; err?: boolean };
type Live = { set: (html: string) => void; signal: AbortSignal };
type Ctx = { args: string[]; flags: Set<string>; opts: Record<string, string>; stdin: string | null; live: Live };
type Result = string | Out | void | Promise<string | Out | void>;
type Cmd = { help: string; usage?: string; run: (c: Ctx) => Result; hidden?: boolean };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const strip = (h: string) => h.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const linkify = (h: string) => h.replace(/(https?:\/\/[^\s<"')]+|\/(?:writing\/[a-z0-9-]+\/?|resume\.pdf|llms\.txt|rss\.xml))/g, (u) => `<a href="${u}" target="${u.startsWith('http') ? '_blank' : '_self'}" rel="noopener">${u}</a>`);
const html = (h: string, text?: string): Out => ({ html: h, text: text ?? strip(h) });
const fail = (t: string): Out => ({ html: `<span class="err">${esc(t)}</span>`, text: t, err: true });
const sp = (s: string, n: number) => (s.length >= n ? s.slice(0, n - 1) + ' ' : s.padEnd(n));
const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((res, rej) => {
    const t = setTimeout(res, ms);
    signal?.addEventListener('abort', () => { clearTimeout(t); rej(new DOMException('aborted', 'AbortError')); }, { once: true });
  });
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${(n / 1024).toFixed(1)} kB`);

const SECTIONS: Record<string, string> = {
  top: '#main', home: '#main', experience: '#trace', trace: '#trace', 'open-source': '#open-source', oss: '#open-source',
  ai: '#ai', ezvor: '#ezvor', pdf: '#pdf-scanner', 'pdf-scanner': '#pdf-scanner', projects: '#work', work: '#work',
  changelog: '#changelog', skills: '#skills', writing: '#writing', contact: '#contact',
};

export function boot(root: HTMLElement, data: ShellData) {
  const body = root.querySelector<HTMLElement>('[data-body]')!;
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const form = root.querySelector<HTMLFormElement>('[data-form]')!;
  const input = root.querySelector<HTMLInputElement>('[data-in]')!;
  const ps = root.querySelector<HTMLElement>('[data-ps]')!;
  const ghostPre = root.querySelector<HTMLElement>('[data-ghost-pre]')!;
  const ghost = root.querySelector<HTMLElement>('[data-ghost]')!;
  const title = root.querySelector<HTMLElement>('[data-title]')!;
  const clock = root.querySelector<HTMLElement>('[data-clock]');
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce';

  const HOME = data.home;
  let cwd = HOME;
  let busy: AbortController | null = null;
  let searching: { q: string; idx: number } | null = null;
  const loadedAt = performance.now();

  let history: string[] = [];
  try { history = JSON.parse(localStorage.getItem('term-history') || '[]'); } catch {}
  let hIdx = history.length;
  const saveHistory = () => { try { localStorage.setItem('term-history', JSON.stringify(history.slice(-200))); } catch {} };

  const aliases: Record<string, string> = {
    ll: 'ls -l', la: 'ls -a', l: 'ls', less: 'cat', more: 'cat', cls: 'clear', email: 'contact', cv: 'resume',
    exp: 'experience', skills: 'stack', fetch: 'neofetch', ai: 'agent', '?': 'ask', 'cd..': 'cd ..', quit: 'exit', logout: 'exit',
  };

  // ── filesystem ──────────────────────────────────────────────────────────
  const files = data.files;
  const dirs = new Set<string>(['/']);
  for (const p of Object.keys(files)) {
    const parts = p.split('/').filter(Boolean);
    for (let i = 1; i < parts.length; i++) dirs.add('/' + parts.slice(0, i).join('/'));
  }
  const pretty = (p: string) => (p === HOME ? '~' : p.startsWith(HOME + '/') ? '~' + p.slice(HOME.length) : p);
  const resolve = (p = '~') => {
    let path = p.startsWith('~') ? HOME + p.slice(1) : p.startsWith('/') ? p : `${cwd}/${p}`;
    const out: string[] = [];
    for (const seg of path.split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') out.pop();
      else out.push(seg);
    }
    path = '/' + out.join('/');
    return path;
  };
  const isDir = (p: string) => dirs.has(p);
  const isFile = (p: string) => p in files;
  const children = (dir: string) => {
    const base = dir === '/' ? '/' : dir + '/';
    const names = new Set<string>();
    for (const p of [...Object.keys(files), ...dirs]) {
      if (p !== dir && p.startsWith(base)) names.add(p.slice(base.length).split('/')[0]);
    }
    return [...names].sort((a, b) => Number(isDir(base + b)) * -1 + Number(isDir(base + a)) || a.localeCompare(b));
  };
  const walk = (dir: string): string[] => children(dir).flatMap((n) => { const p = (dir === '/' ? '' : dir) + '/' + n; return isDir(p) ? [p, ...walk(p)] : [p]; });

  // ── output ──────────────────────────────────────────────────────────────
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const promptHtml = (cmd: string) => `<p class="ln gap"><span class="pr">${esc(data.user)}@${esc(data.host)}</span><span class="pc">:${esc(pretty(cwd))}</span><span class="pd">$</span> <span class="cmd">${esc(cmd)}</span></p>`;
  const block = (cmd: string | null) => {
    const b = document.createElement('div');
    b.className = 'blk';
    b.innerHTML = (cmd === null ? '' : promptHtml(cmd)) + '<div class="out"></div>';
    log.appendChild(b);
    while (log.children.length > 400) log.firstElementChild?.remove();
    scroll();
    return b.querySelector<HTMLElement>('.out')!;
  };
  const updatePrompt = () => {
    ps.innerHTML = `<span class="pr">${esc(data.user)}@${esc(data.host)}</span><span class="pc">:${esc(pretty(cwd))}</span><span class="pd">$</span>`;
    title.textContent = `${data.user}@${data.host}: ${pretty(cwd)}`;
  };
  const table = (rows: string[][], head = true, cls: (r: number, c: number, v: string) => string = () => '') => {
    const w = rows[0].map((_, i) => Math.max(...rows.map((r) => (r[i] ?? '').length)) + 2);
    const lines = rows.map((r, ri) => r.map((v, ci) => {
      const cell = ci === r.length - 1 ? v : v.padEnd(w[ci]);
      const k = ri === 0 && head ? 'dim' : cls(ri, ci, v);
      return k ? `<span class="${k}">${esc(cell)}</span>` : esc(cell);
    }).join(''));
    return html(`<pre class="pre">${lines.join('\n')}</pre>`, rows.map((r) => r.map((v, i) => (i === r.length - 1 ? v : v.padEnd(w[i]))).join('')).join('\n'));
  };
  const statusClass = (v: string) => (/^(shipped|merged|running|active|ok|completed)$/i.test(v) ? 'ok' : /^(open|review|in review|pending)$/i.test(v) ? 'warn' : /^(closed|failed)$/i.test(v) ? 'err' : '');
  const go = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' });

  // ── GitHub (live, cached per tab) ───────────────────────────────────────
  type GhPr = { number: number; title: string; html_url: string; state: string; repository_url: string; pull_request?: { merged_at: string | null }; updated_at: string };
  const ghCache = async <T,>(key: string, url: string): Promise<T> => {
    try {
      const c = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (c && Date.now() - c.at < 10 * 60 * 1000) return c.v as T;
    } catch {}
    const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (r.status === 403 || r.status === 429) throw new Error('GitHub rate limit reached for your IP (60/hour). Try again later.');
    if (!r.ok) throw new Error(`GitHub API responded ${r.status}`);
    const v = await r.json();
    try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), v })); } catch {}
    return v as T;
  };
  const prs = async () => {
    const q = encodeURIComponent(`author:${data.github} is:pr -user:${data.github}`);
    const j = await ghCache<{ items: GhPr[]; total_count: number }>('gh-prs', `https://api.github.com/search/issues?q=${q}&per_page=100&sort=updated`);
    return j.items.map((p) => ({
      n: p.number,
      repo: p.repository_url.split('/repos/')[1],
      state: p.pull_request?.merged_at ? 'merged' : p.state,
      title: p.title,
      url: p.html_url,
      updated: p.updated_at.slice(0, 10),
    }));
  };

  // ── commands ────────────────────────────────────────────────────────────
  const commands: Record<string, Cmd> = {
    help: {
      help: 'list commands',
      run: () => {
        const groups: [string, string[]][] = [
          ['explore', ['ls', 'cd', 'cat', 'tree', 'find', 'grep', 'head', 'tail', 'wc', 'sort', 'pwd']],
          ['about me', ['whoami', 'neofetch', 'experience', 'projects', 'oss', 'stack', 'resume', 'contact', 'open']],
          ['live', ['gh', 'curl', 'ping', 'top', 'stats', 'date', 'uptime', 'ask', 'agent']],
          ['site', ['theme', 'goto', 'devtools', 'max', 'history', 'clear', 'man', 'uname']],
        ];
        const rows = groups.map(([g, cs]) => `<span class="dim">${esc(sp(g, 10))}</span>${cs.filter((c) => commands[c]).map((c) => `<button type="button" class="kw" data-run="${c}">${c}</button>`).join(' ')}`);
        return html(
          rows.join('<br>') +
            `<br><br><span class="dim">man &lt;cmd&gt; for details · pipes work: </span><button type="button" class="kw" data-run="grep -ri kubernetes ~ | head -5">grep -ri kubernetes ~ | head -5</button><br><span class="dim">tab completes · → accepts suggestion · ↑↓ history · ctrl+r search · ctrl+c stops · ctrl+l clears</span>`,
        );
      },
    },
    man: {
      help: 'manual for a command',
      usage: 'man <command>',
      run: ({ args }) => {
        const n = aliases[args[0]]?.split(' ')[0] ?? args[0];
        if (!n) return 'What manual page do you want?\nFor example, try `man gh`.';
        const c = commands[n];
        if (!c) return fail(`No manual entry for ${n}`);
        return html(`<b>${esc(n.toUpperCase())}(1)</b>\n\n<span class="dim">NAME</span>\n    ${esc(n)} - ${esc(c.help)}\n\n<span class="dim">SYNOPSIS</span>\n    ${esc(c.usage ?? n)}`.replace(/\n/g, '<br>'));
      },
    },
    ls: {
      help: 'list directory contents',
      usage: 'ls [-l] [-a] [path]',
      run: ({ args, flags }) => {
        const target = resolve(args[0] ?? '.');
        if (isFile(target)) return target.split('/').pop()!;
        if (!isDir(target)) return fail(`ls: cannot access '${args[0]}': No such file or directory`);
        let names = children(target);
        if (!flags.has('a')) names = names.filter((n) => !n.startsWith('.'));
        const base = target === '/' ? '' : target;
        if (flags.has('l')) {
          const rows = names.map((n) => {
            const p = `${base}/${n}`;
            const d = isDir(p);
            const size = d ? 4096 : files[p].c.length;
            return [d ? 'drwxr-xr-x' : '-rw-r--r--', data.user, String(size).padStart(5), data.build.at.slice(0, 10), d ? n + '/' : n];
          });
          return table([['MODE', 'OWNER', ' SIZE', 'MODIFIED', 'NAME'], ...rows], true, (_r, c, v) => (c === 4 && v.endsWith('/') ? 'dir' : ''));
        }
        return html(names.map((n) => (isDir(`${base}/${n}`) ? `<button type="button" class="dir" data-run="cd ${esc(pretty(`${base}/${n}`))} && ls">${esc(n)}/</button>` : `<button type="button" class="file" data-run="cat ${esc(pretty(`${base}/${n}`))}">${esc(n)}</button>`)).join('   '), names.map((n) => (isDir(`${base}/${n}`) ? n + '/' : n)).join('\n'));
      },
    },
    cd: {
      help: 'change directory',
      usage: 'cd [path]',
      run: ({ args }) => {
        const t = resolve(args[0] ?? '~');
        if (isFile(t)) return fail(`cd: not a directory: ${args[0]}`);
        if (!isDir(t)) return fail(`cd: no such file or directory: ${args[0]}`);
        cwd = t;
        updatePrompt();
      },
    },
    pwd: { help: 'print working directory', run: () => cwd },
    cat: {
      help: 'print a file',
      usage: 'cat <file>...',
      run: ({ args, stdin }) => {
        if (!args.length) return stdin ?? 'usage: cat <file>';
        const parts = args.map((a) => {
          const p = resolve(a);
          if (isDir(p)) return `cat: ${a}: Is a directory`;
          const f = files[p];
          if (!f) return `cat: ${a}: No such file or directory`;
          if (f.href && f.c.startsWith('%PDF')) return `${a}: PDF document. Run \`open ${a}\` to view it.`;
          return f.c;
        });
        const text = parts.join('\n');
        if (args.length === 1 && /^cat: /.test(text)) return fail(text);
        const h = esc(text)
          .replace(/^(#+ .*)$/gm, '<b class="hd">$1</b>')
          .replace(/^(\s*"[^"]+")(:)/gm, '<span class="key">$1</span>$2')
          .replace(/^([a-z_]+)(:\s)/gm, '<span class="key">$1</span>$2');
        return html(`<pre class="pre pw">${linkify(h)}</pre>`, text);
      },
    },
    head: {
      help: 'first lines of input or a file',
      usage: 'head [-n N] [file]',
      run: ({ args, opts, stdin }) => {
        const n = Number(opts.n ?? 10);
        const src = args[0] ? files[resolve(args[0])]?.c : stdin;
        if (src == null) return fail(`head: ${args[0] ?? 'no input'}: No such file`);
        return src.split('\n').slice(0, n).join('\n');
      },
    },
    tail: {
      help: 'last lines of input or a file',
      usage: 'tail [-n N] [file]',
      run: ({ args, opts, stdin }) => {
        const n = Number(opts.n ?? 10);
        const src = args[0] ? files[resolve(args[0])]?.c : stdin;
        if (src == null) return fail(`tail: ${args[0] ?? 'no input'}: No such file`);
        return src.split('\n').slice(-n).join('\n');
      },
    },
    wc: {
      help: 'count lines, words, characters',
      usage: 'wc [-l] [file]',
      run: ({ args, flags, stdin }) => {
        const src = args[0] ? files[resolve(args[0])]?.c : stdin;
        if (src == null) return fail('wc: no input');
        const l = src ? src.split('\n').length : 0;
        if (flags.has('l')) return String(l);
        return `${String(l).padStart(7)}${String(src.split(/\s+/).filter(Boolean).length).padStart(8)}${String(src.length).padStart(8)}`;
      },
    },
    sort: { help: 'sort lines', usage: 'sort [-r]', run: ({ stdin, flags }) => { const l = (stdin ?? '').split('\n').sort((a, b) => a.localeCompare(b)); return (flags.has('r') ? l.reverse() : l).join('\n'); } },
    uniq: { help: 'drop repeated lines', run: ({ stdin }) => (stdin ?? '').split('\n').filter((l, i, a) => l !== a[i - 1]).join('\n') },
    grep: {
      help: 'search text',
      usage: 'grep [-i] [-r] [-n] [-c] <pattern> [path]',
      run: ({ args, flags, stdin }) => {
        const [pat, path] = args;
        if (!pat) return fail('usage: grep [-i] [-r] <pattern> [path]');
        let re: RegExp;
        try { re = new RegExp(pat, flags.has('i') ? 'i' : ''); } catch { return fail(`grep: invalid pattern: ${pat}`); }
        const hl = (s: string) => esc(s).replace(new RegExp(esc(pat).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags.has('i') ? 'gi' : 'g'), (m) => `<mark>${m}</mark>`);
        const hits: { file?: string; n: number; line: string }[] = [];
        if (path || flags.has('r')) {
          const root = resolve(path ?? '.');
          const targets = isDir(root) ? walk(root).filter(isFile) : isFile(root) ? [root] : [];
          if (!targets.length) return fail(`grep: ${path}: No such file or directory`);
          for (const f of targets) files[f].c.split('\n').forEach((line, i) => re.test(line) && hits.push({ file: pretty(f), n: i + 1, line }));
        } else if (stdin != null) {
          stdin.split('\n').forEach((line, i) => re.test(line) && hits.push({ n: i + 1, line }));
        } else return fail('grep: no input. try: grep -ri kubernetes ~');
        if (flags.has('c')) return String(hits.length);
        if (!hits.length) return '';
        const text = hits.map((h) => `${h.file ? h.file + ':' : ''}${flags.has('n') ? h.n + ':' : ''}${h.line}`).join('\n');
        const h = hits.map((x) => `${x.file ? `<button type="button" class="file" data-run="cat ${esc(x.file)}">${esc(x.file)}</button><span class="dim">:</span>` : ''}${flags.has('n') ? `<span class="dim">${x.n}:</span>` : ''}${hl(x.line)}`).join('\n');
        return html(`<pre class="pre pw">${h}</pre>`, text);
      },
    },
    find: {
      help: 'find files by name',
      usage: 'find [path] [-name pattern]',
      run: ({ args, opts }) => {
        const root = resolve(args[0] ?? '.');
        if (!isDir(root)) return fail(`find: '${args[0]}': No such file or directory`);
        const glob = opts.name ? new RegExp('^' + opts.name.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i') : null;
        return [root, ...walk(root)].filter((p) => !glob || glob.test(p.split('/').pop()!)).map(pretty).join('\n');
      },
    },
    tree: {
      help: 'directory tree',
      usage: 'tree [path]',
      run: ({ args }) => {
        const root = resolve(args[0] ?? '.');
        if (!isDir(root)) return fail(`tree: ${args[0]}: not a directory`);
        const lines: string[] = [pretty(root)];
        let nd = 0, nf = 0;
        const rec = (dir: string, pre: string) => {
          const kids = children(dir).filter((n) => !n.startsWith('.'));
          kids.forEach((n, i) => {
            const p = (dir === '/' ? '' : dir) + '/' + n;
            const last = i === kids.length - 1;
            const d = isDir(p);
            d ? nd++ : nf++;
            lines.push(`${pre}${last ? '└── ' : '├── '}${d ? `<span class="dir">${esc(n)}/</span>` : `<button type="button" class="file" data-run="cat ${esc(pretty(p))}">${esc(n)}</button>`}`);
            if (d) rec(p, pre + (last ? '    ' : '│   '));
          });
        };
        rec(root, '');
        return html(`<pre class="pre">${lines.join('\n')}\n\n<span class="dim">${nd} directories, ${nf} files</span></pre>`);
      },
    },
    echo: { help: 'print text', run: ({ args }) => args.join(' ').replace(/\$USER/g, data.user).replace(/\$HOME/g, HOME).replace(/\$PWD/g, cwd).replace(/\$THEME/g, currentTheme().id) },
    whoami: { help: 'who is this', run: () => files[`${HOME}/about.md`].c.split('\n').slice(2, 4).join('\n') },
    id: { help: 'user identity', hidden: true, run: () => `uid=1000(${data.user}) gid=1000(engineers) groups=1000(engineers),27(open-source),998(jenkins),999(owasp)` },
    hostname: { help: 'host name', hidden: true, run: () => location.host },
    env: {
      help: 'environment variables',
      run: () => [`USER=${data.user}`, `HOME=${HOME}`, `PWD=${cwd}`, `SHELL=/bin/salsh`, `THEME=${currentTheme().id}`, `TZ=Asia/Karachi`, `LANG=en_US.UTF-8`, `EDITOR=vim`, `GITHUB=${data.github}`, `BUILD=${data.build.commit}`].join('\n'),
    },
    alias: { help: 'list aliases', run: () => Object.entries(aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n') },
    which: { help: 'locate a command', usage: 'which <cmd>', run: ({ args }) => (args.map((a) => (commands[a] ? `/usr/local/bin/${a}` : aliases[a] ? `${a}: aliased to ${aliases[a]}` : `${a} not found`)).join('\n')) },
    history: {
      help: 'command history',
      usage: 'history [-c]',
      run: ({ flags }) => {
        if (flags.has('c')) { history = []; hIdx = 0; saveHistory(); return 'history cleared'; }
        return history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n');
      },
    },
    clear: { help: 'clear the screen', run: () => { log.innerHTML = ''; } },
    date: {
      help: 'local time and mine',
      run: () => {
        const f = (tz?: string) => new Date().toLocaleString('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' });
        return html(`${esc(f())}  <span class="dim">you</span>\n${esc(f('Asia/Karachi'))}  <span class="dim">me, Lahore</span>`.replace(/\n/g, '<br>'));
      },
    },
    uptime: {
      help: 'how long you have been here',
      run: () => {
        const s = Math.round((performance.now() - loadedAt) / 1000);
        const [y, m] = data.started.split('-').map(Number);
        const months = (new Date().getFullYear() - y) * 12 + new Date().getMonth() + 1 - m;
        return ` ${new Date().toTimeString().slice(0, 8)} up ${Math.floor(s / 60)} min ${s % 60} s on this page,  career up ${Math.floor(months / 12)}y ${months % 12}m,  load average: ${(Math.random() * 0.3 + 0.1).toFixed(2)}`;
      },
    },
    uname: {
      help: 'system information',
      usage: 'uname [-a]',
      run: ({ flags }) => (flags.has('a') ? `SalOS ${location.host} ${data.build.commit} ${data.build.astro} built ${data.build.at.slice(0, 16).replace('T', ' ')} UTC ${navigator.platform || 'web'} browser` : 'SalOS'),
    },
    neofetch: {
      help: 'system info, but it’s me',
      run: () => {
        const art = [
          '   ▄▄▄▄▄▄▄▄▄   ', '  █ ▄▄▄▄▄▄▄ █  ', '  █ █     █ █  ', '  █ █ ▀▀▀▀▀ █  ', '  █ ▀▀▀▀▀█ █  ', '  █ ▀▀▀▀▀▀▀ █  ', '   ▀▀▀▀▀▀▀▀▀   ',
        ];
        const t = currentTheme();
        const rows: [string, string][] = [
          ['', `<b class="acc">${esc(data.user)}</b>@<b class="acc">${esc(data.host)}</b>`],
          ['', '<span class="dim">─────────────────────</span>'],
          ['OS', 'SalOS (Astro static, zero-JS by default)'],
          ['Role', 'Backend Software Engineer @ 9D'],
          ['Shell', 'salsh 2.0'],
          ['Upstream', `${data.merged} merged PRs · ${data.orgs} orgs`],
          ['Releases', 'Jenkins 2.565 · LTS 2.568.1 · 2.591'],
          ['Theme', `${t.name} (${t.mode})`],
          ['Viewport', `${innerWidth}×${innerHeight} @${devicePixelRatio}x`],
          ['Location', 'Lahore · UTC+5'],
          ['', [...'abcdef'].map((_, i) => `<span class="sw" style="background:var(--c${i})"></span>`).join('')],
        ];
        const out = rows.map((r, i) => `<span class="acc">${esc(art[i] ?? ' '.repeat(15))}</span>  ${r[0] ? `<span class="key">${esc(r[0].padEnd(10))}</span>${esc(r[1])}` : r[1]}`);
        return html(`<pre class="pre">${out.join('\n')}</pre>`);
      },
    },
    kubectl: {
      help: 'kubectl get contributions | pods',
      usage: 'kubectl get <contributions|pods>',
      run: ({ args }) => {
        if (args[0] !== 'get') return fail('usage: kubectl get <contributions|pods>');
        if (/^(contributions?|contrib)$/.test(args[1] ?? '')) return table(data.contrib, true, (_r, c, v) => (c === 2 ? statusClass(v) : ''));
        if (/^(pods?|po)$/.test(args[1] ?? '')) return table(data.pods, true, (_r, c, v) => (c === 2 ? statusClass(v) : ''));
        return fail(`error: the server doesn't have a resource type "${args[1] ?? ''}". try contributions or pods`);
      },
    },
    experience: { help: 'roles, newest first', run: () => (go('#trace'), commands.cat.run({ args: ['~/experience/README'], flags: new Set(), opts: {}, stdin: null, live: null! })) },
    projects: { help: 'what I built', run: () => (go('#work'), commands.ls.run({ args: ['~/projects'], flags: new Set(['l']), opts: {}, stdin: null, live: null! })) },
    oss: { help: 'open source summary', run: () => (go('#open-source'), commands.cat.run({ args: ['~/oss/README'], flags: new Set(), opts: {}, stdin: null, live: null! })) },
    stack: { help: 'skills by area', run: () => commands.cat.run({ args: ['~/skills.txt'], flags: new Set(), opts: {}, stdin: null, live: null! }) },
    resume: { help: 'open my résumé', run: () => (window.open(data.resume, '_blank', 'noopener'), 'opening resume.pdf…') },
    contact: {
      help: 'copy my email',
      run: () => {
        navigator.clipboard?.writeText(data.email).catch(() => {});
        return html(`${esc(data.email)} <span class="ok">copied to clipboard ✓</span><br><span class="dim">or</span> <button type="button" class="kw" data-run="sudo hire salman">sudo hire salman</button>`);
      },
    },
    open: {
      help: 'open a link or file',
      usage: `open <github|linkedin|x|medium|resume|file>`,
      run: ({ args }) => {
        const a = (args[0] || '').toLowerCase();
        const f = files[resolve(args[0] || '')];
        const url = data.socials[a] ?? (a === 'resume' || a === 'cv' ? data.resume : f?.href);
        if (!url) return `usage: open ${Object.keys(data.socials).join(' | ')} | resume | <file>`;
        if (url.startsWith('#')) { go(url); return `scrolling to ${url}`; }
        window.open(url, url.startsWith('/') && !url.endsWith('.pdf') ? '_self' : '_blank', 'noopener');
        return `opening ${url}…`;
      },
    },
    goto: {
      help: 'scroll to a section',
      usage: `goto <${Object.keys(SECTIONS).join('|')}>`,
      run: ({ args }) => {
        const h = SECTIONS[(args[0] || '').toLowerCase()];
        if (!h) return `usage: goto ${Object.keys(SECTIONS).filter((k, i, a) => a.indexOf(k) === i).join(' | ')}`;
        go(h);
        return `→ ${h}`;
      },
    },
    theme: {
      help: 'list or switch themes',
      usage: 'theme [name|next]',
      run: ({ args }) => {
        if (args[0] === 'next') { const t = cycleTheme(); return `theme → ${t.name}`; }
        if (args[0]) { const t = setTheme(args[0]); return t ? `theme → ${t.name}` : fail(`theme: unknown theme '${args[0]}'. try: ${themes.map((x) => x.id).join(', ')}`); }
        const cur = currentTheme().id;
        return html(themes.map((t) => `${t.id === cur ? '<span class="acc">●</span>' : '<span class="dim">○</span>'} <button type="button" class="kw" data-run="theme ${t.id}">${t.id.padEnd(9)}</button> <span class="dim">${t.mode}</span>`).join('<br>'));
      },
    },
    devtools: { help: 'open the developer tools panel', run: () => (dispatchEvent(new CustomEvent('devtools:open')), 'opening devtools · ctrl+` toggles it') },
    max: { help: 'maximize / restore the terminal', run: () => (toggleMax(), root.classList.contains('maxed') ? 'maximized · esc restores' : 'restored') },
    exit: { help: 'minimize the terminal', run: () => (setTimeout(() => root.classList.add('minimized'), 150), 'bye 👋 click the yellow dot to bring me back') },
    git: {
      help: 'git log | status',
      usage: 'git <log|status|remote>',
      run: ({ args, opts }) => {
        if (!args[0] || args[0] === 'log') {
          const n = Number(opts.n ?? 12);
          const lines = files[`${HOME}/changelog.log`].c.split('\n').slice(0, n);
          return html(`<pre class="pre">${lines.map((l) => esc(l).replace(/^(\S+)/, '<span class="warn">$1</span>').replace(/(feat|merge|win|chore|docs):/, '<span class="acc">$1:</span>')).join('\n')}</pre>`, lines.join('\n'));
        }
        if (args[0] === 'status') return `On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean\n(build ${data.build.commit})`;
        if (args[0] === 'remote') return `origin  https://github.com/${data.github}/web.git (fetch)\norigin  https://github.com/${data.github}/web.git (push)`;
        return fail(`git: '${args[0]}' is not a git command here. See 'man git'.`);
      },
    },
    gh: {
      help: 'live GitHub data',
      usage: 'gh pr list [--state merged|open|closed] [--repo org/name] [-L n] · gh pr view <n> · gh user',
      run: async ({ args, opts }) => {
        const sub = args.join(' ');
        if (sub.startsWith('pr list') || sub === 'pr' || sub === '') {
          let list = await prs();
          if (opts.state) list = list.filter((p) => p.state === opts.state);
          if (opts.repo) list = list.filter((p) => p.repo.toLowerCase().includes(opts.repo.toLowerCase()));
          const lim = Number(opts.L ?? opts.limit ?? 12);
          const rows = list.slice(0, lim).map((p) => ['#' + p.n, p.repo, p.state, p.title.length > 58 ? p.title.slice(0, 57) + '…' : p.title]);
          if (!rows.length) return 'no pull requests match';
          const t = table([['PR', 'REPO', 'STATE', 'TITLE'], ...rows], true, (_r, c, v) => (c === 2 ? statusClass(v) : ''));
          return html(t.html + `<span class="dim">showing ${rows.length} of ${list.length} · live from api.github.com · </span><button type="button" class="kw" data-run="gh pr list --state open">open only</button>`, t.text);
        }
        if (args[0] === 'pr' && args[1] === 'view') {
          const n = Number((args[2] || '').replace('#', ''));
          const p = (await prs()).find((x) => x.n === n);
          if (!p) return fail(`no pull request #${args[2]} by ${data.github}`);
          return html(`<b>${esc(p.title)}</b>\n<span class="${statusClass(p.state)}">${p.state}</span> · ${esc(p.repo)}#${p.n} · updated ${p.updated}\n${linkify(esc(p.url))}`.replace(/\n/g, '<br>'));
        }
        if (args[0] === 'user' || sub === 'api user') {
          const u = await ghCache<{ login: string; name: string; public_repos: number; followers: number; created_at: string; bio: string }>('gh-user', `https://api.github.com/users/${data.github}`);
          return table([['FIELD', 'VALUE'], ['login', u.login], ['name', u.name ?? ''], ['public repos', String(u.public_repos)], ['followers', String(u.followers)], ['joined', u.created_at.slice(0, 10)]]);
        }
        if (args[0] === 'status') {
          const list = await prs();
          const c = (s: string) => list.filter((p) => p.state === s).length;
          return html(`<span class="ok">${c('merged')} merged</span> · <span class="warn">${c('open')} open</span> · <span class="err">${c('closed')} closed</span> <span class="dim">in ${new Set(list.map((p) => p.repo.split('/')[0])).size} orgs, every external repo incl. friends’ projects · live</span>`);
        }
        return fail(`unknown gh command. usage: ${commands.gh.usage}`);
      },
    },
    curl: {
      help: 'fetch a URL',
      usage: 'curl [-I] <url>   e.g. curl /llms.txt',
      run: async ({ args, flags, live }) => {
        const u = args[0];
        if (!u) return 'curl: try `curl /llms.txt` or `curl https://api.github.com/zen`';
        const url = new URL(u.startsWith('http') || u.startsWith('/') ? u : `https://${u}`, location.href);
        const t0 = performance.now();
        const r = await fetch(url, { signal: live.signal, cache: 'no-store' }).catch((e) => { throw new Error(e.name === 'AbortError' ? 'aborted' : `curl: (7) ${url.host} is blocked: this site's security policy only allows itself and api.github.com`); });
        const ms = (performance.now() - t0).toFixed(0);
        if (flags.has('I')) return `HTTP ${r.status} ${r.statusText}\n${[...r.headers].map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n(${ms} ms)`;
        const txt = await r.text();
        const cut = txt.length > 6000 ? txt.slice(0, 6000) + `\n… ${txt.length - 6000} more bytes` : txt;
        return html(`<pre class="pre pw">${linkify(esc(cut))}</pre><span class="dim">${r.status} · ${kb(txt.length)} · ${ms} ms</span>`, cut);
      },
    },
    ping: {
      help: 'measure round-trip time',
      usage: 'ping [-c n] [host]',
      run: async ({ args, opts, live }) => {
        const host = args[0] || location.host;
        const n = Math.min(Number(opts.c ?? 4), 10);
        const self = host === location.host;
        const url = self ? '/favicon.svg' : `https://${host.replace(/^https?:\/\//, '')}/favicon.ico`;
        const lines = [`PING ${host}: HTTP round trips`];
        const times: number[] = [];
        for (let i = 0; i < n; i++) {
          const t0 = performance.now();
          try {
            await fetch(`${url}?ping=${Date.now()}`, { cache: 'no-store', mode: self ? 'same-origin' : 'no-cors', signal: live.signal });
            const ms = performance.now() - t0;
            times.push(ms);
            lines.push(`seq=${i} time=<span class="ok">${ms.toFixed(1)} ms</span>`);
          } catch (e) {
            if ((e as Error).name === 'AbortError') throw e;
            lines.push(`seq=${i} <span class="err">request timeout</span>`);
          }
          live.set(lines.join('<br>'));
          await sleep(700, live.signal);
        }
        const avg = times.reduce((a, b) => a + b, 0) / (times.length || 1);
        lines.push(`<span class="dim">--- ${esc(host)} ping statistics ---</span>`, `${n} sent, ${times.length} received, ${Math.round((1 - times.length / n) * 100)}% loss · min/avg/max ${Math.min(...times).toFixed(1)}/${avg.toFixed(1)}/${Math.max(...times).toFixed(1)} ms`);
        return html(lines.join('<br>'));
      },
    },
    stats: {
      help: 'real performance numbers for this page',
      run: () => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const bytes = res.reduce((a, r) => a + (r.transferSize || 0), nav?.transferSize ?? 0);
        const v = (window as unknown as { __vitals?: Record<string, number> }).__vitals ?? {};
        const rows = [
          ['METRIC', 'VALUE', 'BUDGET'],
          ['TTFB', nav ? `${nav.responseStart.toFixed(0)} ms` : 'n/a', '< 800 ms'],
          ['FCP', v.fcp ? `${v.fcp.toFixed(0)} ms` : 'n/a', '< 1800 ms'],
          ['LCP', v.lcp ? `${v.lcp.toFixed(0)} ms` : 'n/a', '< 2500 ms'],
          ['CLS', v.cls != null ? v.cls.toFixed(3) : 'n/a', '< 0.1'],
          ['DOM ready', nav ? `${nav.domContentLoadedEventEnd.toFixed(0)} ms` : 'n/a', ''],
          ['Transferred', kb(bytes), '< 500 kB'],
          ['Requests', String(res.length + 1), ''],
          ['DOM nodes', String(document.getElementsByTagName('*').length), '< 1500'],
        ];
        return table(rows);
      },
    },
    top: {
      help: 'live view of this page, ctrl+c to stop',
      run: async ({ live }) => {
        let frames = 0, fps = 0, last = performance.now();
        let raf = 0;
        const loop = (t: number) => { frames++; if (t - last >= 1000) { fps = (frames * 1000) / (t - last); frames = 0; last = t; } raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
        const started = Date.now();
        try {
          while (Date.now() - started < 60000) {
            const mem = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
            const res = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).slice().sort((a, b) => b.duration - a.duration).slice(0, 8);
            const up = Math.round((performance.now() - loadedAt) / 1000);
            const bar = (p: number) => `[${'|'.repeat(Math.round(p * 20)).padEnd(20)}]`;
            const head = [
              `top - ${new Date().toTimeString().slice(0, 8)} up ${Math.floor(up / 60)}:${String(up % 60).padStart(2, '0')},  1 user,  theme: ${currentTheme().id}`,
              `FPS  ${bar(Math.min(fps, 60) / 60)} <span class="ok">${fps.toFixed(0).padStart(3)}</span>     DOM nodes ${document.getElementsByTagName('*').length}     scroll ${Math.round((scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) * 100)}%`,
              mem ? `MEM  ${bar(mem.usedJSHeapSize / mem.jsHeapSizeLimit)} <span class="ok">${kb(mem.usedJSHeapSize)}</span> JS heap` : `MEM  <span class="dim">JS heap not exposed by this browser</span>`,
              '',
              `<span class="inv">${'PID'.padEnd(6)}${'TYPE'.padEnd(10)}${'TIME'.padStart(8)}${'SIZE'.padStart(11)}  RESOURCE</span>`,
              ...res.map((r, i) => `${String(1000 + i).padEnd(6)}${r.initiatorType.padEnd(10)}${(r.duration.toFixed(0) + 'ms').padStart(8)}${kb(r.transferSize || r.encodedBodySize).padStart(11)}  ${esc(r.name.replace(location.origin, '').slice(0, 44))}`),
              '',
              '<span class="dim">ctrl+c or q to quit</span>',
            ];
            live.set(`<pre class="pre">${head.join('\n')}</pre>`);
            await sleep(1000, live.signal);
          }
        } finally { cancelAnimationFrame(raf); }
        return html('<span class="dim">top exited after 60 s</span>');
      },
    },
    ask: {
      help: 'ask a question about my work (cited, no LLM)',
      usage: 'ask <question>',
      run: async ({ args }) => {
        const q = args.join(' ');
        if (!q) return 'usage: ask <question>   e.g. ask how do you keep LLMs safe';
        const { ask } = await import('./retrieve');
        const a = await ask(q);
        if (!a.sentence) return html(`no confident answer in my data. I’d rather say that than guess. <span class="dim">(${a.ms.toFixed(1)} ms, ${a.corpus} chunks)</span>`);
        const src = a.hits.map((h, i) => `<span class="dim">[${i + 1}]</span> ${h.chunk.href ? `<a href="${esc(h.chunk.href)}">${esc(h.chunk.title)}</a>` : esc(h.chunk.title)} <span class="dim">${h.score.toFixed(2)}</span>`).join('<br>');
        return html(`${esc(a.sentence)} <span class="dim">[1]</span><br>${src}<br><span class="dim">bm25 · ${a.corpus} chunks · ${a.ms.toFixed(1)} ms · no model call</span>`);
      },
    },
    agent: {
      help: 'run the LLM agent demo',
      run: () => {
        go('#ai');
        setTimeout(() => document.querySelector<HTMLButtonElement>('[data-scen="unknown"]')?.click(), reduce() ? 0 : 700);
        return 'scrolling to the agent · firing an unknown alert at tier 2…';
      },
    },
    sudo: {
      help: 'try: sudo hire salman',
      run: ({ args }) => {
        if (args.join(' ').startsWith('hire')) {
          setTimeout(() => (location.href = `mailto:${data.email}?subject=${encodeURIComponent('Let’s talk')}`), 900);
          return html('<span class="ok">[sudo] permission granted.</span> opening your mail client…');
        }
        return html(`<span class="err">${esc(data.user)} is not in the sudoers file.</span> This incident will be reported.<br><span class="dim">hint:</span> <button type="button" class="kw" data-run="sudo hire salman">sudo hire salman</button>`);
      },
    },
    rm: { help: 'read-only', hidden: true, run: ({ args }) => fail(`rm: cannot remove '${args.filter((a) => !a.startsWith('-')).join(' ') || '?'}': Read-only file system`) },
    touch: { help: 'read-only', hidden: true, run: () => fail('touch: Read-only file system') },
    mkdir: { help: 'read-only', hidden: true, run: () => fail('mkdir: Read-only file system') },
    mv: { help: 'read-only', hidden: true, run: () => fail('mv: Read-only file system') },
    vim: { help: 'editor', hidden: true, run: () => 'This filesystem is read-only. Try `cat`. (And yes, :q! would have worked.)' },
  };
  commands.vi = commands.nano = commands.emacs = commands.vim;

  // ── parsing & running ───────────────────────────────────────────────────
  const tokenize = (s: string) => {
    const out: string[] = [];
    let cur = '', q: string | null = null, any = false;
    for (const ch of s) {
      if (q) { if (ch === q) q = null; else cur += ch; continue; }
      if (ch === '"' || ch === "'") { q = ch; any = true; continue; }
      if (/\s/.test(ch)) { if (cur || any) out.push(cur); cur = ''; any = false; continue; }
      cur += ch;
    }
    if (cur || any) out.push(cur);
    return out;
  };
  const parseArgs = (tokens: string[]) => {
    const args: string[] = [], flags = new Set<string>(), opts: Record<string, string> = {};
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (/^--[a-z]/i.test(t)) { const [k, v] = t.slice(2).split('='); opts[k] = v ?? (tokens[i + 1] && !tokens[i + 1].startsWith('-') ? tokens[++i] : 'true'); }
      else if (/^-[a-zA-Z]+$/.test(t)) {
        const k = t.slice(1);
        if ((k === 'n' || k === 'c' || k === 'L') && tokens[i + 1] && /^\d+$/.test(tokens[i + 1])) opts[k] = tokens[++i];
        else if (k === 'name') opts.name = tokens[++i] ?? '';
        else [...k].forEach((f) => flags.add(f));
      } else if (/^-\d+$/.test(t)) opts.n = t.slice(1);
      else args.push(t);
    }
    return { args, flags, opts };
  };
  const splitTop = (s: string, sep: RegExp) => {
    const parts: string[] = [];
    let cur = '', q: string | null = null;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (q) { if (ch === q) q = null; cur += ch; continue; }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      const m = s.slice(i).match(sep);
      if (m && m.index === 0) { parts.push(cur); cur = ''; i += m[0].length - 1; continue; }
      cur += ch;
    }
    parts.push(cur);
    return parts.map((p) => p.trim());
  };
  const expandAlias = (seg: string) => {
    const [first, ...rest] = seg.split(/\s+/);
    return aliases[first] ? [aliases[first], ...rest].join(' ') : seg;
  };

  const runPipeline = async (line: string, out: HTMLElement, signal: AbortSignal): Promise<boolean> => {
    const stages = splitTop(line, /^\|(?!\|)/).map(expandAlias);
    let stdin: string | null = null;
    let last: Out | null = null;
    for (let i = 0; i < stages.length; i++) {
      const [name, ...rest] = tokenize(stages[i]);
      if (!name) continue;
      const cmd = commands[name.toLowerCase()];
      if (!cmd) {
        const near = Object.keys(commands).filter((k) => !commands[k].hidden).find((k) => k.startsWith(name.slice(0, 2).toLowerCase()));
        out.innerHTML = `<span class="err">salsh: command not found: ${esc(name)}</span>${near ? ` <span class="dim">did you mean</span> <button type="button" class="kw" data-run="${esc(near)}">${esc(near)}</button><span class="dim">?</span>` : ''} <span class="dim">· try</span> <button type="button" class="kw" data-run="help">help</button>`;
        return false;
      }
      const { args, flags, opts } = parseArgs(rest);
      const live: Live = { set: (h) => { out.innerHTML = h; scroll(); }, signal };
      let r = cmd.run({ args, flags, opts, stdin, live });
      if (r instanceof Promise) {
        out.innerHTML = '<span class="spin" aria-label="working"></span>';
        r = await r;
      }
      if (r === undefined) { last = null; stdin = ''; continue; }
      last = typeof r === 'string' ? { html: '', text: r } : r;
      stdin = last.text;
      if (last.err) break;
    }
    if (last) out.innerHTML = last.html || `<pre class="pre pw">${linkify(esc(last.text))}</pre>`;
    if (!out.innerHTML) out.remove();
    return !last?.err;
  };

  const execute = async (raw: string, { record = true } = {}) => {
    let line = raw.trim();
    if (!line) { block(''); return; }
    if (line === '!!') line = history[history.length - 1] ?? '';
    else if (/^!\d+$/.test(line)) line = history[Number(line.slice(1)) - 1] ?? '';
    if (record && line && history[history.length - 1] !== line) { history.push(line); saveHistory(); }
    hIdx = history.length;
    if (/^(clear|cls)$/.test(line)) { log.innerHTML = ''; return; }
    const chain = splitTop(line, /^(&&|;)/);
    const ops = [...line.matchAll(/&&|;/g)].map((m) => m[0]);
    busy = new AbortController();
    root.classList.add('busy');
    try {
      for (let i = 0; i < chain.length; i++) {
        if (!chain[i]) continue;
        const out = block(chain[i]);
        let ok = true;
        try { ok = await runPipeline(chain[i], out, busy.signal); }
        catch (e) {
          ok = false;
          out.innerHTML = (e as Error).name === 'AbortError' ? '<span class="dim">^C</span>' : `<span class="err">${esc((e as Error).message)}</span>`;
        }
        scroll();
        if (!ok && ops[i] === '&&') break;
        if (busy.signal.aborted) break;
      }
    } finally {
      busy = null;
      root.classList.remove('busy');
      scroll();
    }
  };

  // ── completion & suggestions ────────────────────────────────────────────
  const visibleCmds = () => [...Object.keys(commands).filter((k) => !commands[k].hidden), ...Object.keys(aliases)].sort();
  const complete = (value: string): { replace: string; options: string[] } | null => {
    const tokens = value.split(/\s+/);
    const cur = tokens[tokens.length - 1];
    const before = tokens.slice(0, -1).join(' ');
    const lead = before ? before + ' ' : '';
    if (tokens.length === 1) {
      const opts = visibleCmds().filter((c) => c.startsWith(cur));
      return { replace: cur, options: opts.map((o) => o + ' ') };
    }
    const cmd = tokens[0];
    const pick = (list: string[]) => ({ replace: cur, options: list.filter((x) => x.startsWith(cur)).map((x) => x + ' ') });
    if (cmd === 'theme') return pick([...themes.map((t) => t.id), 'next']);
    if (cmd === 'open') return pick([...Object.keys(data.socials), 'resume']);
    if (cmd === 'goto') return pick([...new Set(Object.keys(SECTIONS))]);
    if (cmd === 'man' || cmd === 'which') return pick(visibleCmds());
    if (cmd === 'kubectl') return pick(tokens.length === 2 ? ['get'] : ['contributions', 'pods']);
    if (cmd === 'git') return pick(['log', 'status', 'remote']);
    if (cmd === 'gh') return pick(tokens.length === 2 ? ['pr', 'status', 'user'] : ['list', 'view']);
    // paths
    const slash = cur.lastIndexOf('/');
    const dirPart = slash >= 0 ? cur.slice(0, slash + 1) : '';
    const namePart = slash >= 0 ? cur.slice(slash + 1) : cur;
    const dir = resolve(dirPart || '.');
    if (!isDir(dir)) return null;
    const base = dir === '/' ? '' : dir;
    const opts = children(dir).filter((n) => n.startsWith(namePart) && (namePart.startsWith('.') || !n.startsWith('.'))).map((n) => dirPart + n + (isDir(`${base}/${n}`) ? '/' : ' '));
    void lead;
    return { replace: cur, options: opts };
  };
  const commonPrefix = (a: string[]) => a.reduce((p, s) => { let i = 0; while (i < p.length && p[i] === s[i]) i++; return p.slice(0, i); }, a[0] ?? '');

  const suggestion = (v: string) => {
    if (!v || searching) return '';
    for (let i = history.length - 1; i >= 0; i--) if (history[i].startsWith(v) && history[i] !== v) return history[i].slice(v.length);
    if (!v.includes(' ')) { const c = visibleCmds().find((k) => k.startsWith(v) && k !== v); if (c) return c.slice(v.length); }
    return '';
  };
  const paintGhost = () => {
    ghostPre.textContent = input.value;
    ghost.textContent = input.selectionStart === input.value.length ? suggestion(input.value) : '';
  };

  // ── reverse history search ──────────────────────────────────────────────
  const searchFind = () => {
    if (!searching) return;
    const { q } = searching;
    let found = -1;
    for (let i = Math.min(searching.idx, history.length - 1); i >= 0; i--) if (history[i].includes(q)) { found = i; break; }
    if (found >= 0) searching.idx = found;
    ps.innerHTML = `<span class="dim">(reverse-i-search)\`${esc(q)}':</span>`;
    input.value = found >= 0 ? history[found] : '';
  };
  const endSearch = (keep: boolean) => {
    const v = input.value;
    searching = null;
    root.classList.remove('searching');
    updatePrompt();
    input.value = keep ? v : '';
  };

  // ── events ──────────────────────────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searching) endSearch(true);
    const v = input.value;
    input.value = '';
    paintGhost();
    if (busy) return;
    execute(v);
  });

  let tabTimes = 0;
  input.addEventListener('keydown', (e) => {
    if (searching) {
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'g')) { e.preventDefault(); endSearch(false); return; }
      if (e.ctrlKey && e.key === 'r') { e.preventDefault(); searching.idx--; searchFind(); return; }
      if (e.key === 'Backspace') { e.preventDefault(); searching.q = searching.q.slice(0, -1); searching.idx = history.length - 1; searchFind(); return; }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); searching.q += e.key; searchFind(); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { endSearch(true); return; }
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      if (busy) { e.preventDefault(); busy.abort(); return; }
      if (!window.getSelection()?.toString()) { e.preventDefault(); block(input.value + '^C').remove(); input.value = ''; paintGhost(); return; }
    }
    if (busy && e.key.toLowerCase() === 'q') { e.preventDefault(); busy.abort(); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); log.innerHTML = ''; return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'u') { e.preventDefault(); input.value = ''; paintGhost(); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'r') { e.preventDefault(); searching = { q: '', idx: history.length - 1 }; root.classList.add('searching'); searchFind(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (!history.length) return; hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx]; paintGhost(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] ?? ''; paintGhost(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'End') && input.selectionStart === input.value.length && ghost.textContent) {
      e.preventDefault(); input.value += ghost.textContent; paintGhost(); return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const c = complete(input.value);
      if (!c || !c.options.length) return;
      const head = input.value.slice(0, input.value.length - c.replace.length);
      if (c.options.length === 1) { input.value = head + c.options[0]; tabTimes = 0; }
      else {
        const pre = commonPrefix(c.options);
        if (pre.length > c.replace.length) input.value = head + pre;
        else if (++tabTimes >= 1) {
          const o = block(null);
          o.innerHTML = `<pre class="pre pw">${c.options.map((x) => esc(x.trim())).join('   ')}</pre>`;
          tabTimes = 0;
        }
      }
      paintGhost();
      return;
    }
    tabTimes = 0;
  });
  input.addEventListener('input', paintGhost);
  input.addEventListener('click', paintGhost);
  input.addEventListener('keyup', paintGhost);

  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-run]');
    if (t) {
      e.preventDefault();
      if (!busy) execute(t.dataset.run!);
      input.focus({ preventScroll: true });
      return;
    }
    const act = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act === 'reset') { log.innerHTML = ''; cwd = HOME; updatePrompt(); root.classList.remove('minimized', 'maxed'); motd(); return; }
    if (act === 'min') { root.classList.toggle('minimized'); root.classList.remove('maxed'); return; }
    if (act === 'max') { toggleMax(); return; }
    if ((e.target as HTMLElement).closest('[data-body]') && !(e.target as HTMLElement).closest('a,button') && !window.getSelection()?.toString()) input.focus({ preventScroll: true });
  });

  const toggleMax = () => {
    root.classList.toggle('maxed');
    root.classList.remove('minimized');
    document.documentElement.classList.toggle('term-maxed', root.classList.contains('maxed'));
    input.focus({ preventScroll: true });
    scroll();
  };
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('maxed')) toggleMax();
    if (e.key === '/' && !(e.target as HTMLElement).closest('input, textarea, [contenteditable]')) {
      const r = root.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) { e.preventDefault(); input.focus({ preventScroll: true }); }
    }
  });

  // live clock in the title bar
  if (clock) {
    const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi', hour12: false }); };
    tick();
    setInterval(tick, 1000);
  }

  // ── boot sequence ───────────────────────────────────────────────────────
  const motd = () => {
    const o = block(null);
    const last = new Date(Date.now() - 1000 * 60 * 37).toUTCString().slice(0, 22);
    o.innerHTML = `<span class="dim">Last login: ${esc(last)} on ttys001 · SalOS ${esc(data.build.commit)} · type</span> <button type="button" class="kw" data-run="help">help</button> <span class="dim">or press</span> <span class="kbd">/</span>`;
  };
  updatePrompt();
  motd();

  const intro = ['whoami', 'kubectl get contributions', 'cat now.json'];
  let introDone = false;
  const finishIntro = () => { introDone = true; };
  input.addEventListener('focus', finishIntro, { once: true });
  (async () => {
    for (const c of intro) {
      if (introDone || reduce()) { await execute(c, { record: false }); continue; }
      input.value = '';
      for (const ch of c) {
        if (introDone) break;
        input.value += ch;
        paintGhost();
        await sleep(28 + Math.random() * 30);
      }
      input.value = '';
      paintGhost();
      await execute(c, { record: false });
      if (!introDone) await sleep(260);
    }
    input.value = '';
    paintGhost();
  })();
}

export { esc };
