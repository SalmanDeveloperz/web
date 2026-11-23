// Build stamp, read by the terminal (`uname -a`) and the devtools panel.
// Netlify sets COMMIT_REF; locally we ask git.
import { execSync } from 'node:child_process';

let commit = process.env.COMMIT_REF?.slice(0, 7) ?? '';
if (!commit) {
  try { commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { commit = 'dev'; }
}

export const build = { commit, at: new Date().toISOString(), astro: 'Astro' };
