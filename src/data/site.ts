// ─────────────────────────────────────────────────────────────────────────────
// Who I am, how to reach me, and the numbers on the front page.
// Edit freely. Every component reads from here.
// ─────────────────────────────────────────────────────────────────────────────
import { counts } from './github';

export const profile = {
  name: 'Muhammad Salman',
  short: 'Salman',
  handle: 'SalmanDeveloperz',
  role: 'Software Engineer',
  // The four lanes I work in. Each one links to the section that proves it.
  disciplines: [
    { label: 'backend', href: '#span-9d' },
    { label: 'ai / llm', href: '#ai' },
    { label: 'devops', href: '#pos-otel' },
    { label: 'full stack', href: '#ezvor' },
  ],
  location: 'Lahore, Pakistan',
  timezone: 'PKT, UTC+5',
  email: 'chsalmanramzan422@gmail.com',
  site: 'https://salman-ch.netlify.app',
  resume: '/resume.pdf',
  availability: 'Open to backend, platform and AI engineering roles · remote or relocation',
  headline: 'I build backend services and fix the pipelines nobody wants to touch.',
  intro: [
    'Software engineer at 9D Technologies. I build backend services in Python and FastAPI, the pipelines that ship them, and the telemetry that explains them when they break.',
    'GSoC 2025 at FOSSology: one monolith became 10+ services on Kubernetes, and builds got 40% faster. My code ships in official Jenkins releases, OWASP made me a collaborator on Nest, and lately I build LLM agents that are only allowed to do what they can prove.',
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com/SalmanDeveloperz', handle: '@SalmanDeveloperz' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/msalman199/', handle: 'in/msalman199' },
    { name: 'X', url: 'https://x.com/sam_env', handle: '@sam_env' },
    { name: 'Medium', url: 'https://medium.com/@msamdev', handle: '@msamdev' },
    { name: 'Email', url: 'mailto:chsalmanramzan422@gmail.com', handle: 'email' },
  ],
};

// ── now.json ─────────────────────────────────────────────────────────────────
// Shown in the hero terminal (`cat now.json`). Update this when things change.
// "in_review" fills itself from GitHub at build time.
export const now = {
  updated: '2026-09-28',
  shipping: 'auth + reporting services in FastAPI @ 9D',
  building: 'Ezvor: judge-verified readiness scores',
  exploring: 'agent guardrails: bounded tools, allowlists, traced calls',
  open_to: 'backend · platform · AI engineering',
};

// ── Credential cards under the hero ─────────────────────────────────────────
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
    mark: '1st', color: '#f5b544', label: 'Byte & Battle Hackathon', title: '1st place', detail: 'University-wide · 3rd at district level', year: '2025',
    proof: '#awards',
  },
  {
    mark: 'DW', color: '#2ec4b6', label: 'Dev Weekends', title: 'Mentor', detail: 'Open source and GSoC guidance', year: 'now',
    proof: 'https://devweekends.com',
  },
];

// ── Headline numbers. Each one links to where it came from. ─────────────────
// `n` animates from 0 on scroll; `suffix`/`prefix` stay fixed.
export const metrics = [
  { n: 81, suffix: '%', label: 'less trace data', note: 'Tail sampling on Jenkins CI telemetry', href: '#pos-otel' },
  { n: 40, suffix: '%', label: 'faster builds', note: 'FOSSology, Make to CMake', href: '#span-gsoc' },
  { n: 10, suffix: '+', label: 'services', note: 'One monolith, split onto Kubernetes', href: '#span-gsoc' },
  { n: counts.merged, suffix: '', label: 'merged upstream PRs', note: `Across ${counts.orgs} orgs, synced from GitHub`, href: '#open-source' },
  { n: 2, suffix: '', label: 'Jenkins releases', note: 'Weekly 2.565 and LTS 2.568.1', href: '#oss-jenkins' },
];
