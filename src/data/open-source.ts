// ─────────────────────────────────────────────────────────────────────────────
// Open source, grouped by org. Statuses here are a fallback: at build time the
// GitHub sync (github.ts) overwrites them with the live PR state.
// To add a PR: push an item into the right org. `ref` is the short label.
// ─────────────────────────────────────────────────────────────────────────────
import { counts } from './github';

export type Contribution = {
  title: string;
  ref: string;
  url: string;
  status: 'merged' | 'open' | 'closed' | 'issue' | 'shipped' | 'private';
};

export type Org = {
  name: string;
  slug: string; // anchor: #oss-<slug>
  blurb: string;
  highlight?: string;
  all?: string;
  items: Contribution[];
};

const gh = (repo: string, n: number, type: 'pull' | 'issues' = 'pull') => `https://github.com/${repo}/${type}/${n}`;

export const openSource: Org[] = [
  {
    name: 'Jenkins',
    slug: 'jenkins',
    blurb: 'Core, the official Docker images, and the theme manager plugin.',
    highlight: 'Shipped in Weekly 2.565 and LTS 2.568.1',
    all: 'https://github.com/search?q=author%3ASalmanDeveloperz+org%3Ajenkinsci&type=pullrequests',
    items: [
      { title: 'Env var substitution for reference config files. The issue had been open since 2017.', ref: 'docker#2250', url: gh('jenkinsci/docker', 2250), status: 'shipped' },
      { title: 'Same feature on Windows: Invoke-EnvVarSubstitution plus 3 Pester tests', ref: 'docker#2365', url: gh('jenkinsci/docker', 2365), status: 'shipped' },
      { title: 'Off-screen dropdown items lost focus feedback during arrow-key navigation', ref: 'jenkins#26358', url: gh('jenkinsci/jenkins', 26358), status: 'merged' },
      { title: 'Keyboard navigation for the theme picker, requested by the maintainer', ref: 'theme-manager#350', url: gh('jenkinsci/theme-manager-plugin', 350), status: 'merged' },
      { title: 'Broken contributor profile link on jenkins.io', ref: 'jenkins.io#8629', url: gh('jenkins-infra/jenkins.io', 8629), status: 'merged' },
      { title: 'ARIA roles on dropdown menus for screen readers', ref: 'jenkins#26321', url: gh('jenkinsci/jenkins', 26321), status: 'open' },
      { title: 'Double-clicking the search placeholder blocked input', ref: 'jenkins#26418', url: gh('jenkinsci/jenkins', 26418), status: 'open' },
    ],
  },
  {
    name: 'FOSSology',
    slug: 'fossology',
    blurb: 'License compliance scanner. Microservices work, plus fixes in the copyright, nomos and cp2foss agents.',
    highlight: `${counts.fossologyCode} code PRs + ${counts.fossologyDocs} GSoC reports merged`,
    all: 'https://github.com/search?q=author%3ASalmanDeveloperz+org%3Afossology&type=pullrequests',
    items: [
      { title: 'Copyright agent URL regex matched invalid characters', ref: '#3212', url: gh('fossology/fossology', 3212), status: 'merged' },
      { title: 'PHPUnit agent tests updated for the CMake build', ref: '#3037', url: gh('fossology/fossology', 3037), status: 'merged' },
      { title: 'Debug logging for version control commands', ref: '#2958', url: gh('fossology/fossology', 2958), status: 'merged' },
      { title: 'False positives on example domains and reserved TLDs', ref: '#2955', url: gh('fossology/fossology', 2955), status: 'merged' },
      { title: 'nomos CLI opened a DB connection it never used', ref: '#2947', url: gh('fossology/fossology', 2947), status: 'merged' },
    ],
  },
  {
    name: 'OWASP Nest',
    slug: 'owasp',
    blurb: 'OWASP’s directory of security projects and chapters.',
    highlight: 'Collaborator since Jan 2026',
    items: [
      { title: 'Security issue, reported privately to the maintainers', ref: 'private', url: '', status: 'private' },
      { title: 'Added to MENTORS.md for GSoC 2026', ref: '#3605', url: gh('OWASP/Nest', 3605), status: 'merged' },
      { title: 'Focus outlines clipped and inconsistent across Header and Footer', ref: '#3561', url: gh('OWASP/Nest', 3561, 'issues'), status: 'issue' },
      { title: 'Search hint text could be selected with mouse and keyboard', ref: '#5602', url: gh('OWASP/Nest', 5602, 'issues'), status: 'issue' },
    ],
  },
  {
    name: 'Python, data & AI',
    slug: 'python',
    blurb: 'Time series ML, an LLM analysis engine, and the NumFOCUS community guide.',
    items: [
      { title: 'Live model-driven analysis, deterministic engine kept as the fallback, no secrets in the client bundle', ref: 'failuretwin-ai#12', url: gh('kaulastudies/failuretwin-ai', 12), status: 'merged' },
      { title: 'BoxCoxBiasAdjustedForecaster threw sporadic optimization bracket errors', ref: 'sktime#10316', url: gh('sktime/sktime', 10316), status: 'open' },
      { title: 'Tone and typo fixes in the DISCOVER Cookbook', ref: 'numfocus#73', url: gh('numfocus/DISCOVER-Cookbook', 73), status: 'merged' },
      { title: 'Re-enabled RDSTRegressor and RISTRegressor tests after verifying Ubuntu CI', ref: 'aeon#2599', url: gh('aeon-toolkit/aeon', 2599), status: 'closed' },
      { title: 'Example notebook: aeon distances with sklearn clusterers', ref: 'aeon#2511', url: gh('aeon-toolkit/aeon', 2511), status: 'closed' },
    ],
  },
  {
    name: 'Earlier work',
    slug: 'earlier',
    blurb: 'Where it started: Hacktoberfest 2024 and first PRs into other people’s code.',
    items: [
      { title: 'Reworked the testing framework docs and removed deprecated Nimut references', ref: 'TYPO3/tea#1480', url: gh('TYPO3BestPractices/tea', 1480), status: 'merged' },
      { title: 'LMPOP command with unit tests, in C++', ref: 'dragonfly#3925', url: gh('dragonflydb/dragonfly', 3925), status: 'closed' },
      { title: 'Contributor profile for the Meshery community', ref: 'meshery#12248', url: gh('meshery/meshery', 12248), status: 'merged' },
    ],
  },
];
