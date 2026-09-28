// ─────────────────────────────────────────────────────────────────────────────
// Build-time GitHub sync. No need to edit.
//
// Pulls every PR I've authored outside my own repos, so counts, statuses, the
// monthly chart and "in_review" come from GitHub instead of being typed by hand.
//
//  - Cached on disk for 30 min, so `npm run dev` reloads don't burn the
//    60 req/hour unauthenticated limit.
//  - If the API fails, the last good cache is used; if there is none, the
//    hand-written statuses in open-source.ts and FALLBACK below are used.
//  - Set GITHUB_TOKEN in Netlify env vars for a higher rate limit.
// ─────────────────────────────────────────────────────────────────────────────
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const USER = 'SalmanDeveloperz';
const CACHE = 'node_modules/.cache/portfolio-github.json';
const TTL_MS = 30 * 60 * 1000;

// Orgs that count as "upstream" (excludes my own repos and friends' side projects).
const UPSTREAM = new Set([
  'jenkinsci', 'jenkins-infra', 'fossology', 'owasp', 'numfocus',
  'typo3bestpractices', 'sktime', 'aeon-toolkit', 'dragonflydb', 'meshery',
]);

export type PrState = 'merged' | 'open' | 'closed';
export type Pr = { repo: string; number: number; title: string; state: PrState; created: string; merged: string | null; url: string };

const FALLBACK = { merged: 28, total: 38, orgs: 7, fossologyCode: 5, fossologyDocs: 14, jenkins: 5 };

async function fromApi(): Promise<Pr[] | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'salman-portfolio-build' };
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const out: Pr[] = [];
  try {
    for (let page = 1; page <= 3; page++) {
      const q = encodeURIComponent(`author:${USER} is:pr -user:${USER}`);
      const res = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}`, {
        headers,
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { items: any[] };
      for (const i of json.items) {
        out.push({
          repo: String(i.repository_url).split('/repos/')[1],
          number: i.number,
          title: i.title,
          state: i.pull_request?.merged_at ? 'merged' : i.state === 'open' ? 'open' : 'closed',
          created: i.created_at,
          merged: i.pull_request?.merged_at ?? null,
          url: i.html_url,
        });
      }
      if (json.items.length < 100) break;
    }
    return out;
  } catch {
    return null;
  }
}

async function load(): Promise<{ prs: Pr[] | null; live: boolean }> {
  let cached: { at: number; prs: Pr[] } | null = null;
  try {
    cached = JSON.parse(await readFile(CACHE, 'utf8'));
  } catch {}
  if (cached && Date.now() - cached.at < TTL_MS) return { prs: cached.prs, live: true };
  const fresh = await fromApi();
  if (fresh) {
    try {
      await mkdir('node_modules/.cache', { recursive: true });
      await writeFile(CACHE, JSON.stringify({ at: Date.now(), prs: fresh }));
    } catch {}
    return { prs: fresh, live: true };
  }
  return { prs: cached?.prs ?? null, live: false };
}

const { prs, live } = await load();
const orgOf = (p: Pr) => p.repo.split('/')[0].toLowerCase();
const upstream = (prs ?? []).filter((p) => UPSTREAM.has(orgOf(p)));
const merged = upstream.filter((p) => p.state === 'merged');

export const synced = live;
export const syncedAt = new Date().toISOString();

export const counts = prs
  ? {
      merged: merged.length,
      total: upstream.length,
      orgs: new Set(merged.map(orgOf)).size,
      fossologyCode: merged.filter((p) => p.repo.toLowerCase() === 'fossology/fossology').length,
      fossologyDocs: merged.filter((p) => p.repo.toLowerCase() === 'fossology/gsoc').length,
      jenkins: merged.filter((p) => orgOf(p).startsWith('jenkins')).length,
    }
  : FALLBACK;

const byKey = new Map((prs ?? []).map((p) => [`${p.repo.toLowerCase()}#${p.number}`, p.state]));

/** Live state for a PR URL, or undefined if it isn't a PR we know about. */
export function liveState(url: string): PrState | undefined {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/i);
  return m ? byKey.get(`${m[1].toLowerCase()}#${m[2]}`) : undefined;
}

/** Open upstream PRs, as short refs, for now.json. */
export const inReview = upstream
  .filter((p) => p.state === 'open')
  .map((p) => `${p.repo.split('/')[1]}#${p.number}`);

/** Merged upstream PRs per month, oldest first, with gaps filled in. */
export type Month = { month: string; total: number; prs: { title: string; repo: string; url: string }[]; byOrg: Record<string, number> };
export const monthly: Month[] = (() => {
  if (!merged.length) return [];
  const map = new Map<string, Month>();
  for (const p of merged) {
    const m = (p.merged ?? p.created).slice(0, 7);
    const e = map.get(m) ?? { month: m, total: 0, prs: [], byOrg: {} };
    e.total++;
    e.prs.push({ title: p.title, repo: `${p.repo}#${p.number}`, url: p.url });
    const org = orgOf(p).startsWith('jenkins') ? 'jenkins' : orgOf(p);
    e.byOrg[org] = (e.byOrg[org] ?? 0) + 1;
    map.set(m, e);
  }
  const keys = [...map.keys()].sort();
  const [y0, m0] = keys[0].split('-').map(Number);
  const now = new Date();
  const out: Month[] = [];
  for (let y = y0, m = m0; y * 12 + m <= now.getFullYear() * 12 + now.getMonth() + 1; m === 12 ? (y++, (m = 1)) : m++) {
    const k = `${y}-${String(m).padStart(2, '0')}`;
    out.push(map.get(k) ?? { month: k, total: 0, prs: [], byOrg: {} });
  }
  return out;
})();

export const allPrsUrl = `https://github.com/search?q=${encodeURIComponent(`author:${USER} is:pr -user:${USER}`)}&type=pullrequests&s=created&o=desc`;
