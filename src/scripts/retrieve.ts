// Tiny BM25 retriever over /rag.json. Runs entirely in the browser.
// No embeddings, no model call: every answer is a cited span of real text,
// so there is nothing to hallucinate. Loaded on demand.

export type Chunk = { id: string; kind: string; title: string; text: string; href?: string; tags?: string };
export type Hit = { chunk: Chunk; score: number; terms: string[] };
export type Answer = { query: string; tokens: string[]; hits: Hit[]; sentence: string | null; ms: number; corpus: number };

const STOP = new Set(
  'a an and are as at be but by can did do does for from had has have how i if in into is it its me my of on or our so than that the their them then there these they this to was we were what when where which who why will with you your about any ever much many tell use used using know known knew experience experienced done worked working work give show like'.split(' '),
);

// Query expansion: the words recruiters type vs. the words in my data.
const SYN: Record<string, string[]> = {
  k8s: ['kubernetes'], kube: ['kubernetes'], otel: ['opentelemetry'], observability: ['opentelemetry', 'trace', 'telemetry'],
  llm: ['model', 'agent', 'ai'], llms: ['model', 'agent', 'ai'], ai: ['llm', 'model', 'agent'], genai: ['llm', 'ai'], gpt: ['llm', 'model'],
  claude: ['anthropic', 'llm'], gemini: ['llm', 'model'], agents: ['agent'], safe: ['guardrail', 'safety', 'allowlist'], safely: ['guardrail', 'safety'],
  safety: ['guardrail', 'allowlist'], ci: ['pipeline', 'build'], cd: ['pipeline', 'deploy'], devops: ['pipeline', 'docker', 'kubernetes'],
  backend: ['api', 'fastapi', 'service'], api: ['endpoint', 'rest'], frontend: ['react', 'interface'], fullstack: ['react', 'api'],
  gsoc: ['google', 'summer', 'code'], oss: ['open', 'source'], contributions: ['merged', 'pr'], prs: ['pr', 'merged'],
  job: ['engineer', 'role'], current: ['now', 'present'], currently: ['now', 'present'],
  win: ['won', 'place', 'award'], hackathon: ['battle', 'byte'], python: ['fastapi'], rag: ['retrieval', 'bm25'], production: ['shipped', 'release', 'live'],
  prod: ['production', 'shipped'], ship: ['shipped', 'release'], fastest: ['faster', 'build'],
};

const stem = (t: string) => {
  if (t.length > 5 && t.endsWith('ing')) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith('ed')) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
  return t;
};

export const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9#+]+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);

type Index = { chunks: Chunk[]; docs: Map<string, number>[]; lens: number[]; avg: number; df: Map<string, number> };
let index: Promise<Index> | null = null;

export function loadIndex(): Promise<Index> {
  index ??= fetch('/rag.json')
    .then((r) => r.json() as Promise<Chunk[]>)
    .then((chunks) => {
      const df = new Map<string, number>();
      const docs = chunks.map((c) => {
        const tf = new Map<string, number>();
        // Titles count double: they're the densest signal.
        for (const t of [...tokenize(c.title), ...tokenize(c.title), ...tokenize(c.text), ...tokenize(c.tags ?? '')]) tf.set(t, (tf.get(t) ?? 0) + 1);
        for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
        return tf;
      });
      const lens = docs.map((d) => [...d.values()].reduce((a, b) => a + b, 0));
      return { chunks, docs, lens, avg: lens.reduce((a, b) => a + b, 0) / lens.length, df };
    });
  return index;
}

export async function ask(query: string, k = 3): Promise<Answer> {
  const ix = await loadIndex();
  const t0 = performance.now();
  const base = tokenize(query);
  const tokens = [...new Set(base.flatMap((t) => [t, ...(SYN[t] ?? []).map(stem)]))];
  const N = ix.chunks.length;
  const k1 = 1.2;
  const b = 0.75;
  const scored: Hit[] = ix.docs.map((tf, i) => {
    let score = 0;
    const terms: string[] = [];
    for (const t of tokens) {
      const f = tf.get(t);
      if (!f) continue;
      const n = ix.df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      // Expanded synonyms weigh less than words the user actually typed.
      const w = base.includes(t) ? 1 : 0.6;
      score += w * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * ix.lens[i]) / ix.avg)));
      terms.push(t);
    }
    return { chunk: ix.chunks[i], score, terms };
  });
  const hits = scored.filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
  // Answer = the best sentence from the top hits, scored by the idf of the
  // query terms it contains (rare words matter more than common ones).
  let sentence: string | null = null;
  if (hits[0] && hits[0].score > 1.5) {
    const idf = (t: string) => Math.log(1 + (N - (ix.df.get(t) ?? 0) + 0.5) / ((ix.df.get(t) ?? 0) + 0.5));
    let best = 0;
    hits.slice(0, 2).forEach((h, rank) => {
      for (const s of h.chunk.text.split(/(?<=[.!?])\s+/)) {
        const st = new Set(tokenize(s));
        const v = tokens.reduce((a, t) => a + (st.has(t) ? idf(t) : 0), 0) * (rank === 0 ? 1 : 0.55) + Math.min(s.length, 160) / 400;
        if (v > best) { best = v; sentence = s; }
      }
    });
  }
  return { query, tokens, hits, sentence, ms: performance.now() - t0, corpus: N };
}

export const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Wrap matched terms in <mark>, safely. */
export function highlight(text: string, terms: string[]): string {
  const set = new Set(terms);
  return text
    .split(/(\s+)/)
    .map((w) => {
      const t = stem(w.toLowerCase().replace(/[^a-z0-9#+]/g, ''));
      return t && set.has(t) ? `<mark>${escapeHtml(w)}</mark>` : escapeHtml(w);
    })
    .join('');
}
