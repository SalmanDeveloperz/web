// Single source of truth for the whole site.
// Edit this file to update copy, links, experience, projects and contributions.

export const profile = {
  name: 'Muhammad Salman',
  handle: 'SalmanDeveloperz',
  role: 'Backend & Infrastructure Engineer',
  location: 'Lahore, Pakistan',
  timezone: 'PKT · UTC+5',
  email: 'chsalmanramzan422@gmail.com',
  site: 'https://salman-ch.netlify.app',
  resume: '/resume.pdf',
  photo: '/salman.webp',
  availability: 'Open to Backend, Platform & Full Stack roles · remote or relocation',
  headline: 'I build backend services and fix the pipelines nobody wants to touch.',
  intro:
    'Backend engineer at 9D Technologies, writing FastAPI services and CI/CD. Google Summer of Code 2025 contributor at FOSSology, with code shipped in official Jenkins Weekly and LTS releases. I care about systems end to end: from the API contract down to the pod it runs in, and the trace that tells you why it broke.',
  socials: [
    { name: 'GitHub', url: 'https://github.com/SalmanDeveloperz', short: 'gh' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/msalman199/', short: 'in' },
    { name: 'X', url: 'https://x.com/sam_env', short: 'x' },
    { name: 'Medium', url: 'https://medium.com/@msamdev', short: 'md' },
    { name: 'Email', url: 'mailto:chsalmanramzan422@gmail.com', short: '@' },
  ],
};

export const credentials = [
  { label: 'Google Summer of Code', detail: "Contributor '25 · FOSSology" },
  { label: 'Linux Foundation', detail: 'LiFT Scholar 2025 · LFD259' },
  { label: 'Jenkins', detail: 'Shipped in Weekly & LTS' },
  { label: 'OWASP Nest', detail: 'Collaborator · GSoC 2026 mentor' },
  { label: 'Dev Weekends', detail: 'Community mentor' },
];

export const metrics = [
  { value: '81%', label: 'trace volume cut', note: 'tail sampling on Jenkins CI telemetry' },
  { value: '40%', label: 'faster CI', note: 'FOSSology Make → CMake migration' },
  { value: '10+', label: 'services on k8s', note: 'FOSSology monolith to microservices' },
  { value: '25+', label: 'merged OSS PRs', note: 'Jenkins, FOSSology, OWASP' },
  { value: '2', label: 'official releases', note: 'Jenkins Weekly 2.565 · LTS 2.568.1' },
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
    op: 'backend.engineer',
    org: '9D Technologies',
    role: 'Backend Software Engineer',
    start: '2026-08',
    end: null,
    kind: 'work',
    location: 'Lahore',
    summary:
      'Building authentication and reporting services in FastAPI, database work, and CI/CD pipelines with GitHub Actions. Shipped the web platform for PDF Scanner, a 31-tool in-browser document suite.',
    attrs: { stack: 'python · fastapi · postgres · gh-actions', status: 'active' },
    points: [
      'Auth and reporting services in Python and FastAPI',
      'CI/CD pipelines on GitHub Actions',
      'PDF Scanner web: 31 client-side PDF tools, zero uploads',
    ],
  },
  {
    id: 'jenkins',
    service: 'jenkins',
    op: 'oss.contributor',
    org: 'Jenkins project',
    role: 'Open Source Contributor',
    start: '2026-01',
    end: null,
    kind: 'oss',
    summary:
      'Contributing to Jenkins core and the official Docker images. Cross-platform environment variable substitution now ships in official Weekly and LTS releases. Fixed core accessibility and keyboard-navigation bugs.',
    attrs: { repos: 'jenkinsci/jenkins · jenkinsci/docker', shipped: '2.565 · LTS 2.568.1' },
    points: [
      'Closed a 2017-era issue: opt-in env-var substitution for containerized Jenkins',
      'Windows parity in PowerShell with new Pester tests',
      'Keyboard navigation and ARIA fixes in Jenkins core UI',
    ],
    link: 'https://github.com/search?q=author%3ASalmanDeveloperz+org%3Ajenkinsci&type=pullrequests',
  },
  {
    id: 'owasp',
    service: 'owasp-nest',
    op: 'oss.collaborator',
    org: 'OWASP Foundation',
    role: 'Collaborator · GSoC 2026 Mentor',
    start: '2026-01',
    end: null,
    kind: 'oss',
    summary:
      'Granted collaborator access on OWASP Nest after reporting accessibility bugs. Listed as a Google Summer of Code 2026 mentor. Reported a security issue to the maintainers.',
    attrs: { repo: 'OWASP/Nest', access: 'collaborator' },
    link: 'https://github.com/OWASP/Nest',
  },
  {
    id: 'lift',
    service: 'linux-foundation',
    op: 'scholarship.lift',
    org: 'Linux Foundation',
    role: 'LiFT Scholar',
    start: '2025-07',
    end: '2025-08',
    kind: 'award',
    summary:
      'Full scholarship for Kubernetes for Developers (LFD259), awarded by the Linux Foundation in July 2025.',
    attrs: { cert: 'LFD259', track: 'kubernetes' },
  },
  {
    id: 'gsoc',
    service: 'fossology',
    op: 'gsoc.microservices',
    org: 'Google Summer of Code',
    role: "GSoC '25 Contributor · FOSSology",
    start: '2025-02',
    end: '2025-09',
    kind: 'oss',
    location: 'Remote',
    summary:
      'Selected globally (sub-5% acceptance). Rebuilt FOSSology as a 10+ service Docker and Kubernetes architecture, replacing a legacy monolithic deployment. Migrated the build from Make to CMake, cutting CI time by 40%.',
    attrs: { stack: 'k8s · docker · kustomize · cmake · postgres', weeks: '13' },
    points: [
      'Fixed the scheduler CrashLoopBackOff that blocked the 2021 branch',
      'Kustomize base with dev and prod overlays across 26 manifests',
      'Authored Docker and k8s manifests for four missing agents',
    ],
    link: 'https://summerofcode.withgoogle.com/archive/2025/projects/MjOyiOj7',
  },
  {
    id: 'fiverr',
    service: 'fiverr',
    op: 'freelance.engineer',
    org: 'Fiverr & contracts',
    role: 'Freelance Software Engineer',
    start: '2023-10',
    end: '2025-01',
    kind: 'work',
    summary:
      'Delivered full-stack apps and DevOps automation for 8 to 10 clients: Jenkins and GitHub Actions pipelines, Docker containerization, and AWS deployments on EC2 and S3.',
    attrs: { stack: 'react · node · docker · jenkins · aws', clients: '8-10' },
  },
  {
    id: 'hywiz',
    service: 'hywiz',
    op: 'frontend.intern',
    org: 'Hywiz Technologies',
    role: 'Software Engineer Intern',
    start: '2023-05',
    end: '2023-09',
    kind: 'work',
    location: 'Burewala',
    summary: 'Built React components and integrated REST APIs for a production web application.',
    attrs: { stack: 'react · typescript · rest' },
  },
  {
    id: 'uaf',
    service: 'uaf',
    op: 'bs.computer-science',
    org: 'University of Agriculture, Faisalabad',
    role: 'BS Computer Science',
    start: '2022-09',
    end: '2026-06',
    kind: 'edu',
    summary:
      'Graduated with a CGPA of 3.37/4.0 on an 80% PEEF merit scholarship. 1st place university-wide at the Byte and Battle hackathon.',
    attrs: { cgpa: '3.37', scholarship: 'PEEF 80%' },
  },
];

// ── Open source ──────────────────────────────────────────────────────────
export type Contribution = {
  title: string;
  ref: string;
  url: string;
  status: 'merged' | 'open' | 'issue' | 'shipped' | 'private';
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
    blurb: 'The CI/CD server behind a large share of the world’s build pipelines.',
    highlight: 'Shipped in Weekly 2.565 and LTS 2.568.1',
    all: 'https://github.com/search?q=author%3ASalmanDeveloperz+org%3Ajenkinsci&type=pullrequests',
    items: [
      { title: 'Env-var substitution for containerized Jenkins, open since 2017', ref: 'docker#2250', url: gh('jenkinsci/docker', 2250), status: 'shipped' },
      { title: 'Windows parity: Invoke-EnvVarSubstitution + Pester tests', ref: 'docker#2365', url: gh('jenkinsci/docker', 2365), status: 'shipped' },
      { title: 'Keyboard navigation scrolling in core dropdowns', ref: 'jenkins#26358', url: gh('jenkinsci/jenkins', 26358), status: 'merged' },
      { title: 'Keyboard navigation for the theme picker, requested by the maintainer', ref: 'theme-manager#350', url: gh('jenkinsci/theme-manager-plugin', 350), status: 'merged' },
      { title: 'Fixed a broken contributor profile link on jenkins.io', ref: 'jenkins.io#8629', url: gh('jenkins-infra/jenkins.io', 8629), status: 'merged' },
      { title: 'ARIA roles for screen readers on dropdown menus', ref: 'jenkins#26321', url: gh('jenkinsci/jenkins', 26321), status: 'open' },
      { title: 'Search placeholder no longer blocks input on double click', ref: 'jenkins#26418', url: gh('jenkinsci/jenkins', 26418), status: 'open' },
    ],
  },
  {
    name: 'FOSSology',
    slug: 'fossology',
    blurb: 'Open source license compliance toolkit, used across the Linux Foundation ecosystem.',
    highlight: "19 merged PRs · GSoC '25",
    all: 'https://github.com/search?q=author%3ASalmanDeveloperz+org%3Afossology&type=pullrequests',
    items: [
      { title: 'Excluded invalid characters from the copyright agent URL regex', ref: '#3212', url: gh('fossology/fossology', 3212), status: 'merged' },
      { title: 'Modernized PHPUnit agent tests for the CMake migration', ref: '#3037', url: gh('fossology/fossology', 3037), status: 'merged' },
      { title: 'More debug logging for version control commands', ref: '#2958', url: gh('fossology/fossology', 2958), status: 'merged' },
      { title: 'Cut false positives on example domains and specific TLDs', ref: '#2955', url: gh('fossology/fossology', 2955), status: 'merged' },
      { title: 'nomos CLI no longer connects to the DB when not needed', ref: '#2947', url: gh('fossology/fossology', 2947), status: 'merged' },
    ],
  },
  {
    name: 'OWASP Nest',
    slug: 'owasp',
    blurb: 'OWASP’s gateway for discovering and joining security projects.',
    highlight: 'Collaborator · GSoC 2026 mentor',
    items: [
      { title: 'Reported a security issue to maintainers (responsible disclosure)', ref: 'private', url: 'https://github.com/OWASP/Nest/security', status: 'private' },
      { title: 'Added to MENTORS.md for Google Summer of Code 2026', ref: '#3605', url: gh('OWASP/Nest', 3605), status: 'merged' },
      { title: 'Clipped focus-visible outlines across Header and Footer', ref: '#3561', url: gh('OWASP/Nest', 3561, 'issues'), status: 'issue' },
      { title: 'Search bar hint text selectable via mouse and keyboard', ref: '#5602', url: gh('OWASP/Nest', 5602, 'issues'), status: 'issue' },
    ],
  },
  {
    name: 'sktime',
    slug: 'sktime',
    blurb: 'sktime, the unified framework for machine learning with time series.',
    items: [
      { title: 'Fixed sporadic optimization bracket errors in BoxCoxBiasAdjustedForecaster', ref: 'sktime#10316', url: gh('sktime/sktime', 10316), status: 'open' },
    ],
  },
];

// ── Projects ─────────────────────────────────────────────────────────────
export const ezvor = {
  name: 'Ezvor',
  tagline: 'Ship a serious engineering career, from first commit to offer letter.',
  pitch:
    'A career platform that measures real, verifiable work and gives one honest answer: are you hireable yet? It replaces ten open tabs with a single readiness score you cannot fake.',
  live: 'https://ezvor.lovable.app',
  repo: 'https://github.com/ezvor/ezvor',
  principles: [
    { title: 'Trust the judge, not the user', body: 'A problem counts only after the sandboxed execution backend returns accepted. The client cannot self-report progress.' },
    { title: 'Score is a pure function of evidence', body: 'The readiness engine has no network calls and no AI. Same evidence, same score: testable and impossible to nudge.' },
    { title: 'Live data, not stale bookmarks', body: 'Opportunity status for GSoC, LFX and Outreachy is scraped from source pages, so nobody applies to a closed program.' },
  ],
  features: [
    { name: 'Readiness Engine', body: 'Deterministic score with a pillar breakdown and highest-impact next moves.' },
    { name: 'DSA Arena', body: 'Monaco editor, multi-language judge, hidden tests, runtime and memory feedback.' },
    { name: 'Opportunities', body: 'GSoC, LFX, Outreachy and internships with live Open, Closed or Rolling status.' },
    { name: 'Roadmaps', body: 'Interactive graph roadmaps with free resources mapped to every node.' },
    { name: 'AI Advisor', body: 'Chat advisor with persistent history for what a score cannot answer.' },
    { name: 'Compiler', body: 'Standalone online compiler for quick throwaway code.' },
  ],
  stack: ['TanStack Start', 'React 19', 'TypeScript strict', 'Supabase + RLS', 'Postgres', 'Monaco', 'Firecrawl', 'Gemini', 'Tailwind v4'],
};

export const pdfScanner = {
  name: 'PDF Scanner Web',
  org: '9D Technologies',
  tagline: '31 PDF and document tools that run entirely in your browser.',
  pitch:
    'An iLovePDF and CamScanner class toolkit built as the web platform for PDF Scanner, an Android app with 50M+ installs and a 4.8★ rating. Every conversion, OCR pass and redaction happens client side: no account, no upload.',
  live: 'https://docs-scan.netlify.app/',
  repo: 'https://github.com/SalmanDeveloperz/PDF-Scanner',
  groups: [
    { name: 'Organize', n: 5, tools: 'Merge · Split · Reorder · Extract · Remove' },
    { name: 'Optimize', n: 5, tools: 'Compress · Repair · OCR · Flatten · PDF/A' },
    { name: 'Convert', n: 5, tools: 'Image · JPG · Word · Excel · PowerPoint' },
    { name: 'Edit & Sign', n: 5, tools: 'Sign · Watermark · Edit · Numbers · Crop' },
    { name: 'Security', n: 5, tools: 'Lock · Unlock · Redact · Compare · Metadata' },
    { name: 'Scan & OCR', n: 6, tools: 'Scan · Searchable PDF · Cleanup · Receipts · Rename' },
  ],
  stack: ['React 19', 'TypeScript', 'TanStack Start', 'Vite', 'Tailwind v4', 'Web Workers', 'In-browser OCR'],
};

export type Project = {
  name: string;
  kind: string;
  body: string;
  stack: string[];
  repo?: string;
  live?: string;
  metric?: string;
};

export const projects: Project[] = [
  {
    name: 'SigNoz AI SRE',
    kind: 'Self-healing infrastructure · hackathon',
    body: 'A watcher agent that never talks to the service it guards. It reads SigNoz alerts over OpenTelemetry, applies known fixes through a control plane, and hands unknown failures to an LLM investigator. Every action lands in a permanent incident log.',
    stack: ['OpenTelemetry', 'SigNoz', 'Node.js', 'Postgres', 'AI SDK', 'Next.js'],
    repo: 'https://github.com/SalmanDeveloperz/signoz-ai-sre',
    metric: 'zero-touch recovery',
  },
  {
    name: 'PoS-OTel',
    kind: 'CI/CD observability stack',
    body: 'Jenkins feeds traces into an OpenTelemetry Collector with tail sampling and span-to-metrics, then Jaeger, Prometheus and Grafana with provisioned dashboards and alert rules. A pipeline simulator keeps dashboards alive on day one.',
    stack: ['OpenTelemetry', 'Jaeger', 'Prometheus', 'Grafana', 'Docker Compose', 'Python'],
    repo: 'https://github.com/SalmanDeveloperz/PoS-OTel',
    metric: '−81% trace volume',
  },
  {
    name: 'FOSSology Microservices',
    kind: "GSoC '25 infrastructure",
    body: 'Scheduler, database and agents split into 10+ services on Kubernetes, with a Kustomize base and dev/prod overlays. Revived a 2021 branch, fixed CrashLoopBackOff and service discovery, and moved the build to CMake.',
    stack: ['Kubernetes', 'Docker', 'Kustomize', 'CMake', 'PostgreSQL', 'Linux'],
    repo: 'https://github.com/SalmanDeveloperz/GSoC-2025',
    metric: '−40% CI time',
  },
  {
    name: 'Stremo',
    kind: 'Streaming platform',
    body: 'Streams classic films and TV from public domain and Creative Commons archives on the Internet Archive. Curated collections from Film Noir to the Silent Era, with SSR and Supabase auth.',
    stack: ['TanStack Start', 'TypeScript', 'Supabase', 'Bun', 'Tailwind'],
    repo: 'https://github.com/ezvor/stremo',
    live: 'https://stremo.lovable.app',
  },
  {
    name: 'RevealX',
    kind: 'Browser extension',
    body: 'Reveals the value in any password field on demand without breaking React or Vue re-renders, which undo the naive type-toggle trick. Handles shadow roots and programmatic values. Requests zero permissions.',
    stack: ['JavaScript', 'MV3', 'Shadow DOM'],
    repo: 'https://github.com/SalmanDeveloperz/revealX',
  },
  {
    name: 'AutoAccept',
    kind: 'Chrome extension',
    body: 'Injects a one-click Accept All into Facebook’s Friends page, with infinite-scroll handling so it keeps working as more requests load.',
    stack: ['JavaScript', 'Chrome Extension'],
    repo: 'https://github.com/SalmanDeveloperz/AutoAccept-Facebook-Friends',
  },
];

export const awards = [
  { year: '2025', title: 'Google Summer of Code', body: 'Selected globally at FOSSology, a program with a sub-5% acceptance rate. One of a small number of Pakistani contributors in the 2025 cohort.' },
  { year: '2025', title: 'Linux Foundation LiFT Scholar', body: 'Full scholarship for the Kubernetes for Developers (LFD259) certification.' },
  { year: '2025', title: 'Byte and Battle Hackathon', body: '1st place university-wide and 3rd at district level in speed programming.' },
  { year: '2022', title: 'PEEF Scholarship', body: '80% merit scholarship from the Government of Punjab for academic standing.' },
];

export const stack = [
  { group: 'Backend', items: ['Python', 'FastAPI', 'Node.js', 'Express', 'TypeScript', 'REST', 'WebSockets'] },
  { group: 'Infrastructure', items: ['Kubernetes', 'Docker', 'Kustomize', 'Helm', 'AWS · EKS', 'Linux', 'Nginx'] },
  { group: 'CI/CD', items: ['Jenkins', 'GitHub Actions', 'CMake', 'Bash', 'PowerShell'] },
  { group: 'Observability', items: ['OpenTelemetry', 'Prometheus', 'Grafana', 'Jaeger', 'SigNoz'] },
  { group: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase'] },
  { group: 'AI & LLMOps', items: ['RAG', 'LangChain', 'Gemini', 'AI SDK', 'scikit-learn', 'pandas'] },
  { group: 'Frontend', items: ['React', 'TanStack', 'Tailwind', 'Angular', 'Accessibility'] },
];
