// Build-time GitHub sync.
// Pulls every PR authored outside my own repos, so statuses and counts on the
// site come from GitHub instead of being typed by hand. Runs once per build.
// If the API is unreachable or rate limited, the site falls back to the
// hand-written statuses in profile.ts and the static counts below.
//
// Optional: set GITHUB_TOKEN in Netlify env vars to raise the rate limit.

const USER = 'SalmanDeveloperz';

// Orgs that count as "upstream" contributions (excludes my own and friends' repos).
const UPSTREAM = new Set([
  'jenkinsci',
  'jenkins-infra',
  'fossology',
  'owasp',
  'numfocus',
  'typo3bestpractices',
  'sktime',
  'aeon-toolkit',
  'dragonflydb',
  'meshery',
]);

export type PrState = 'merged' | 'open' | 'closed';
export type Pr = { repo: string; number: number; title: string; state: PrState; created: string; url: string };

const FALLBACK = { merged: 28, total: 38, orgs: 10, fossologyCode: 5, fossologyDocs: 14, jenkins: 5 };

async function fetchAll(): Promise<Pr[] | null> {
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

const prs = await fetchAll();
const upstream = (prs ?? []).filter((p) => UPSTREAM.has(p.repo.split('/')[0].toLowerCase()));

export const synced = prs !== null;
export const syncedAt = new Date().toISOString();

const orgOf = (p: Pr) => p.repo.split('/')[0].toLowerCase();
const merged = upstream.filter((p) => p.state === 'merged');

export const counts = synced
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

export const allPrsUrl = `https://github.com/search?q=${encodeURIComponent(`author:${USER} is:pr -user:${USER}`)}&type=pullrequests&s=created&o=desc`;
