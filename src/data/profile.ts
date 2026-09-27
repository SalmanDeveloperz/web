// Single source of truth for the whole site.
// Edit this file to update copy, links, experience, projects and contributions.
import { counts, allPrsUrl } from './github';
export { allPrsUrl };

export const profile = {
  name: 'Muhammad Salman',
  handle: 'SalmanDeveloperz',
  role: 'Backend Software Engineer',
  location: 'Lahore, Pakistan',
  timezone: 'PKT, UTC+5',
  email: 'chsalmanramzan422@gmail.com',
  site: 'https://salman-ch.netlify.app',
  resume: '/resume.pdf',
  availability: 'Open to backend and platform roles, remote or relocation',
  headline: 'I build backend services and fix the pipelines nobody wants to touch.',
  intro: [
    'Backend engineer at 9D Technologies, working in Python and FastAPI.',
    'In 2024 Google Summer of Code rejected me. I had no open source experience and didn’t know how Git really worked. A year later I was in the program, rebuilding FOSSology as microservices on Kubernetes. Since then my patches have shipped in official Jenkins releases.',
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com/SalmanDeveloperz', short: 'gh', handle: '@SalmanDeveloperz' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/msalman199/', short: 'in', handle: 'in/msalman199' },
    { name: 'X', url: 'https://x.com/sam_env', short: 'x', handle: '@sam_env' },
    { name: 'Medium', url: 'https://medium.com/@msamdev', short: 'md', handle: '@msamdev' },
    { name: 'Email', url: 'mailto:chsalmanramzan422@gmail.com', short: '@', handle: 'email' },
  ],
};

export const credentials = [
  {
    mark: 'GSoC', color: '#f9ab00', label: 'Google Summer of Code', title: 'Contributor', detail: 'FOSSology · microservices', year: '2025',
    proof: 'https://summerofcode.withgoogle.com/archive/2025/projects/MjOyiOj7',
  },
  {
    mark: 'LF', color: '#3b82f6', label: 'Linux Foundation', title: 'LiFT Scholar', detail: 'Kubernetes LFD259 + exam', year: '2025',
    proof: 'https://training.linuxfoundation.org/about/scholarships/',
  },
  {
    mark: 'JK', color: '#d24939', label: 'Jenkins', title: 'Code in releases', detail: 'Weekly 2.565 · LTS 2.568.1', year: '2026',
    proof: 'https://github.com/jenkinsci/docker/releases/tag/2.568.1',
  },
  {
    mark: 'OW', color: '#a78bfa', label: 'OWASP Nest', title: 'Collaborator', detail: 'Accessibility · GSoC 2026 mentor list', year: '2026',
    proof: 'https://github.com/OWASP/Nest/pull/3605',
  },
  {
    mark: 'DW', color: '#2ec4b6', label: 'Dev Weekends', title: 'Mentor', detail: 'Open source and GSoC guidance', year: 'now',
    proof: 'https://devweekends.com',
  },
];

export const metrics = [
  { value: '81%', label: 'less trace data', note: 'Tail sampling on Jenkins CI telemetry' },
  { value: '40%', label: 'faster builds', note: 'FOSSology, Make to CMake' },
  { value: '10+', label: 'services', note: 'FOSSology monolith split onto Kubernetes' },
  { value: `${counts.merged}`, label: 'merged upstream PRs', note: `Across ${counts.orgs} orgs, synced from GitHub at build` },
  { value: '2', label: 'Jenkins releases', note: 'Weekly 2.565 and LTS 2.568.1' },
];

// ── Career rendered as a distributed trace ──────────────────────────────
// start/end are "YYYY-MM". end: null means the span is still open.
export const traceWindow = { start: '2022-09', end: '2026-12' };

export type Span = {
  id: string;
  service: string;
  op: string;
  org: string;
  role: string;
  start: string;
  end: string | null;
  kind: 'work' | 'oss' | 'edu' | 'award';
  location?: string;
  summary: string;
  attrs: Record<string, string>;
  points?: string[];
  link?: string;
};

export const spans: Span[] = [
  {
    id: '9d',
    service: '9d-technologies',
    op: 'backend',
    org: '9D Technologies',
    role: 'Backend Software Engineer',
    start: '2026-08',
    end: null,
    kind: 'work',
    location: 'Lahore',
    summary: 'Backend work in Python and FastAPI, plus the CI/CD that tests and deploys it.',
    attrs: { stack: 'python, fastapi, postgres, github actions', status: 'active' },
    points: [
      'Built an authentication service in FastAPI: request validation, error handling, secure endpoint design.',
      'Wrote the REST endpoints for a task management platform’s reporting module, so reports generate themselves instead of being assembled by hand.',
      'Set up GitHub Actions pipelines that test and deploy the backend services.',
      'Built PDF Scanner Web, 31 document tools that run entirely in the browser.',
    ],
  },
  {
    id: 'jenkins',
    service: 'jenkins',
    op: 'contrib',
    org: 'Jenkins project',
    role: 'Open Source Contributor',
    start: '2026-01',
    end: null,
    kind: 'oss',
    summary:
      'Contributor to jenkinsci/jenkins, jenkinsci/docker and the theme manager plugin. Five PRs merged, and two of them ship in every official Docker image.',
    attrs: { repos: 'jenkins, docker, theme-manager-plugin', shipped: '2.565, LTS 2.568.1' },
    points: [
      'Closed an issue open since 2017: opt-in env var substitution for containerized Jenkins.',
      'Ported the same feature to Windows containers in PowerShell, with Pester tests.',
      'Fixed keyboard navigation and added ARIA roles in the core UI. I reported most of these bugs myself.',
    ],
    link: 'https://github.com/search?q=author%3ASalmanDeveloperz+org%3Ajenkinsci&type=pullrequests',
  },
  {
    id: 'owasp',
    service: 'owasp-nest',
    op: 'collab',
    org: 'OWASP Foundation',
    role: 'Collaborator, OWASP Nest',
    start: '2026-01',
    end: null,
    kind: 'oss',
    summary:
      'Got collaborator access after finding clipped and inconsistent keyboard focus indicators and helping fix them. Listed as a GSoC 2026 mentor. Also reported a security issue privately to the maintainers.',
    attrs: { repo: 'OWASP/Nest', access: 'collaborator' },
    link: 'https://github.com/OWASP/Nest',
  },
  {
    id: 'lift',
    service: 'linux-fdn',
    op: 'lift.scholar',
    org: 'Linux Foundation',
    role: 'LiFT Scholar',
    start: '2025-07',
    end: '2025-08',
    kind: 'award',
    summary: 'Full scholarship for the Kubernetes for Developers (LFD259) course and certification exam.',
    attrs: { cert: 'LFD259', track: 'kubernetes' },
  },
  {
    id: 'gsoc',
    service: 'fossology',
    op: 'gsoc.k8s',
    org: 'Google Summer of Code',
    role: 'Software Engineer (Open Source), FOSSology',
    start: '2025-02',
    end: '2025-09',
    kind: 'oss',
    location: 'Remote',
    summary:
      'Picked up a microservices branch that had been sitting since 2021 and made it run on 2025 infrastructure. FOSSology went from one monolithic deployment to 10+ services on Docker and Kubernetes.',
    attrs: { stack: 'kubernetes, docker, kustomize, cmake, postgres', weeks: '13' },
    points: [
      'Moved the build from Make to CMake. Builds got 40% faster, and a CI pipeline that had been failing for the team went green.',
      'Tracked a scheduler crash loop through PostgreSQL schema limits, container networking and init ordering, then fixed it.',
      'Wrote a Kustomize base with dev and prod overlays across 26 manifests.',
    ],
    link: 'https://summerofcode.withgoogle.com/archive/2025/projects/MjOyiOj7',
  },
  {
    id: 'fiverr',
    service: 'fiverr',
    op: 'freelance',
    org: 'Fiverr and direct clients',
    role: 'Freelance Software Engineer',
    start: '2023-10',
    end: '2025-01',
    kind: 'work',
    summary:
      'Full-stack apps and deployment work for 8 to 10 clients: Jenkins and GitHub Actions pipelines, Docker images, and AWS deploys on EC2 and S3.',
    attrs: { stack: 'react, node, docker, jenkins, aws', clients: '8-10' },
  },
  {
    id: 'hywiz',
    service: 'hywiz',
    op: 'intern',
    org: 'Hywiz Technologies',
    role: 'Software Engineer Intern',
    start: '2023-05',
    end: '2023-09',
    kind: 'work',
    summary:
      'Shipped product modules and REST APIs with React, Node.js and Express. Replaced a manual daily data export with MongoDB aggregation pipelines.',
    attrs: { stack: 'react, node, express, mongodb' },
  },
  {
    id: 'uaf',
    service: 'uaf',
    op: 'bs.cs',
    org: 'University of Agriculture, Faisalabad',
    role: 'BS Computer Science',
    start: '2022-09',
    end: '2026-06',
    kind: 'edu',
    summary:
      'Graduated with a 3.37/4.0 CGPA, on an 80% PEEF scholarship. Won 1st place university-wide at the Byte & Battle hackathon.',
    attrs: { cgpa: '3.37', scholarship: 'PEEF 80%' },
  },
];

// ── Open source ──────────────────────────────────────────────────────────
export type Contribution = {
  title: string;
  ref: string;
  url: string;
  status: 'merged' | 'open' | 'closed' | 'issue' | 'shipped' | 'private';
};

export type Org = {
  name: string;
  slug: string;
  blurb: string;
  highlight?: string;
  all?: string;
  items: Contribution[];
};

const gh = (repo: string, n: number, type: 'pull' | 'issues' = 'pull') =>
  `https://github.com/${repo}/${type}/${n}`;

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
      { title: 'Keyboard navigation for the theme picker, asked for by the maintainer', ref: 'theme-manager#350', url: gh('jenkinsci/theme-manager-plugin', 350), status: 'merged' },
      { title: 'Broken contributor profile link on jenkins.io', ref: 'jenkins.io#8629', url: gh('jenkins-infra/jenkins.io', 8629), status: 'merged' },
      { title: 'ARIA roles on dropdown menus for screen readers', ref: 'jenkins#26321', url: gh('jenkinsci/jenkins', 26321), status: 'open' },
      { title: 'Double-clicking the search placeholder blocked input', ref: 'jenkins#26418', url: gh('jenkinsci/jenkins', 26418), status: 'open' },
    ],
  },
  {
    name: 'FOSSology',
    slug: 'fossology',
    blurb: 'License compliance scanner. Microservices work, plus the copyright, nomos and cp2foss agents.',
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
    name: 'Python & data',
    slug: 'python',
    blurb: 'Time series ML toolkits, and the NumFOCUS community guide.',
    items: [
      { title: 'BoxCoxBiasAdjustedForecaster threw sporadic optimization bracket errors', ref: 'sktime#10316', url: gh('sktime/sktime', 10316), status: 'open' },
      { title: 'Tone and typo fixes in the DISCOVER Cookbook', ref: 'numfocus#73', url: gh('numfocus/DISCOVER-Cookbook', 73), status: 'merged' },
      { title: 'Re-enabled RDSTRegressor and RISTRegressor tests after verifying Ubuntu CI', ref: 'aeon#2599', url: gh('aeon-toolkit/aeon', 2599), status: 'closed' },
      { title: 'Example notebook: aeon distances with sklearn clusterers', ref: 'aeon#2511', url: gh('aeon-toolkit/aeon', 2511), status: 'closed' },
    ],
  },
  {
    name: 'Earlier work',
    slug: 'earlier',
    blurb: 'Where I started: Hacktoberfest 2024 and first PRs to other people’s code.',
    items: [
      { title: 'Reworked the testing framework docs and removed deprecated Nimut references', ref: 'TYPO3/tea#1480', url: gh('TYPO3BestPractices/tea', 1480), status: 'merged' },
      { title: 'LMPOP command with unit tests, in C++', ref: 'dragonfly#3925', url: gh('dragonflydb/dragonfly', 3925), status: 'closed' },
      { title: 'Contributor profile for the Meshery community', ref: 'meshery#12248', url: gh('meshery/meshery', 12248), status: 'merged' },
    ],
  },
];

// ── Projects ─────────────────────────────────────────────────────────────
export const ezvor = {
  name: 'Ezvor',
  tagline: 'From first commit to offer letter.',
  story:
    'When I was preparing for internships I kept three job boards open, bookmarked a roadmap I never finished, and solved problems on a separate site. None of it told me whether I was actually hireable. Ezvor puts all of it in one place and scores only work that a judge has verified.',
  live: 'https://ezvor.lovable.app',
  repo: 'https://github.com/ezvor/ezvor',
  principles: [
    { title: 'Only the judge counts', body: 'A problem counts only after the sandboxed execution backend accepts it. The client has no way to report its own progress.' },
    { title: 'The score is a pure function', body: 'The readiness engine makes no network calls and uses no AI. The same evidence always gives the same score, so it can be tested and can’t be gamed.' },
    { title: 'Deadlines come from the source', body: 'The status of GSoC, LFX and Outreachy is scraped from their own pages, so a closed program never shows as open.' },
  ],
  features: [
    { name: 'Readiness Engine', body: 'A score broken into pillars, with the next moves that would raise it most.' },
    { name: 'DSA Arena', body: '3,977 auto-graded problems in a Monaco editor, with hidden tests and runtime and memory feedback.' },
    { name: 'Opportunities', body: 'Open source programs and internships, each marked Open, Closed or Rolling.' },
    { name: 'Roadmaps', body: 'Interactive graph roadmaps with free resources on every node.' },
    { name: 'AI Advisor', body: 'A chat advisor with saved history, for questions a score can’t answer.' },
    { name: 'Compiler', body: 'A standalone compiler for quick throwaway code.' },
  ],
  stack: ['TanStack Start', 'React 19', 'TypeScript', 'Supabase', 'Postgres + RLS', 'Monaco', 'Firecrawl', 'Gemini', 'RAG'],
};

export const pdfScanner = {
  name: 'PDF Scanner Web',
  org: '9D Technologies',
  story:
    'Web version of PDF Scanner, an Android app with 50M+ installs and a 4.8★ rating. It covers what people usually open iLovePDF or CamScanner for. Everything runs in the browser, so files never leave the device and there’s no conversion server to run.',
  live: 'https://docs-scan.netlify.app/',
  repo: 'https://github.com/SalmanDeveloperz/PDF-Scanner',
  groups: [
    { name: 'Organize', n: 5, tools: 'Merge, split, reorder, extract, remove' },
    { name: 'Optimize', n: 5, tools: 'Compress, repair, OCR, flatten, PDF/A' },
    { name: 'Convert', n: 5, tools: 'Images, JPG, Word, Excel, PowerPoint' },
    { name: 'Edit & sign', n: 5, tools: 'Sign, watermark, edit, page numbers, crop' },
    { name: 'Security', n: 5, tools: 'Lock, unlock, redact, compare, metadata' },
    { name: 'Scan & OCR', n: 6, tools: 'Scan, searchable PDF, cleanup, receipts, rename' },
  ],
  stack: ['React 19', 'TypeScript', 'TanStack Start', 'Vite', 'Tailwind', 'Web Workers', 'In-browser OCR'],
};

export type Project = {
  name: string;
  kind: string;
  body: string;
  stack: string[];
  repo?: string;
  live?: string;
  metric?: string;
  featured?: boolean;
  note?: string;
  discussion?: string;
};

export const projects: Project[] = [
  {
    name: 'PoS-OTel: OpenTelemetry for Jenkins CI',
    kind: 'GSoC 2026 proof of concept',
    featured: true,
    body: 'During GSoC 2025 I spent whole afternoons matching container logs by hand, so this is the tool I wanted then. Jenkins sends traces over OTLP to a collector. Tail sampling keeps every failed build, every build over 30 seconds, and 20% of the rest. Jaeger stores the traces, and span metrics go to Prometheus and Grafana, with alert rules included. A pipeline simulator keeps the dashboards populated on day one.',
    note: 'I built this as the proof of concept for my GSoC 2026 proposal to Jenkins. The project wasn’t selected this year, but the stack runs on its own with one docker compose up.',
    stack: ['OpenTelemetry Collector', 'Jaeger', 'Prometheus', 'Grafana', 'Python', 'Docker Compose'],
    repo: 'https://github.com/SalmanDeveloperz/PoS-OTel',
    discussion: 'https://community.jenkins.io/t/gsoc-2026-opentelemetry-scaling-strategies/36647/3',
    metric: '−81% trace data',
  },
  {
    name: 'SigNoz AI SRE',
    kind: 'Hackathon',
    body: 'A watcher service that never calls the service it protects. It reacts to SigNoz alerts, applies known fixes through a control plane, and hands unknown failures to an LLM. Every action goes into an incident log.',
    stack: ['OpenTelemetry', 'SigNoz', 'Node.js', 'Postgres', 'AI SDK', 'Next.js'],
    repo: 'https://github.com/SalmanDeveloperz/signoz-ai-sre',
  },
  {
    name: 'FOSSology microservices',
    kind: 'GSoC 2025',
    body: 'The scheduler, database and agents split into 10+ Kubernetes services, with a Kustomize base and overlays. The repo holds the weekly reports and the final report.',
    stack: ['Kubernetes', 'Docker', 'Kustomize', 'CMake', 'PostgreSQL'],
    repo: 'https://github.com/SalmanDeveloperz/GSoC-2025',
    metric: '−40% build time',
  },
  {
    name: 'Stremo',
    kind: 'Web app',
    body: 'Streams public domain and Creative Commons films from the Internet Archive, from film noir to the silent era. No copyrighted content is hosted.',
    stack: ['TanStack Start', 'TypeScript', 'Supabase', 'Bun'],
    repo: 'https://github.com/ezvor/stremo',
    live: 'https://stremo.lovable.app',
  },
  {
    name: 'RevealX',
    kind: 'Browser extension',
    body: 'Shows what’s typed into a password field. Toggling the field’s type breaks on React and Vue because they re-render it, so this reads the value instead. It also handles shadow DOM and requests no permissions.',
    stack: ['JavaScript', 'Manifest V3'],
    repo: 'https://github.com/SalmanDeveloperz/revealX',
  },
  {
    name: 'AutoAccept',
    kind: 'Chrome extension',
    body: 'Adds an Accept All button to Facebook’s friend requests page and keeps working as infinite scroll loads more requests.',
    stack: ['JavaScript', 'Chrome Extension'],
    repo: 'https://github.com/SalmanDeveloperz/AutoAccept-Facebook-Friends',
  },
];

export const awards = [
  { year: 'Jul 2025', title: 'Linux Foundation LiFT Scholar', body: 'Full scholarship for the Kubernetes (LFD259) course and certification exam.' },
  { year: 'Mar 2025', title: 'Google Summer of Code 2025', body: 'Selected for FOSSology. Acceptance rate is under 5%.' },
  { year: 'Mar 2025', title: 'Byte & Battle Hackathon', body: '1st place university-wide and 3rd place at district level.' },
  { year: '2022–26', title: 'PEEF Scholarship', body: '80% fee scholarship from the Government of Punjab.' },
];

export const stack = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'C++'] },
  { group: 'Backend', items: ['FastAPI', 'Node.js', 'Express', 'REST', 'JWT', 'Socket.io'] },
  { group: 'Infra', items: ['Docker', 'Kubernetes', 'Kustomize', 'Jenkins', 'GitHub Actions', 'Linux', 'AWS'] },
  { group: 'Observability', items: ['OpenTelemetry', 'Prometheus', 'Grafana', 'Jaeger', 'SigNoz'] },
  { group: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase'] },
  { group: 'AI', items: ['OpenAI API', 'LangChain', 'Embeddings', 'RAG'] },
  { group: 'Testing', items: ['Postman', 'JMeter', 'Pester', 'PHPUnit'] },
  { group: 'Frontend', items: ['React', 'Tailwind', 'Accessibility'] },
];
