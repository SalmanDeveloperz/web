// ─────────────────────────────────────────────────────────────────────────────
// Projects. Ezvor and PDF Scanner get their own sections; the rest render as
// cards. Set `featured: true` on one card to give it the wide slot with the
// interactive tail-sampling simulator.
// ─────────────────────────────────────────────────────────────────────────────

export const ezvor = {
  name: 'Ezvor',
  tagline: 'From first commit to offer letter.',
  story:
    'Preparing for internships, I had three job boards open, a roadmap I never finished, and a problem site that knew nothing about either. None of it could tell me whether I was hireable. Ezvor puts it in one place and scores only work a judge has verified.',
  live: 'https://ezvor.lovable.app',
  repo: 'https://github.com/ezvor/ezvor',
  principles: [
    { title: 'Only the judge counts', body: 'A problem counts only after the sandboxed execution backend accepts it. The client has no way to report its own progress.' },
    { title: 'The score is a pure function', body: 'The readiness engine makes no network calls and uses no AI. Same evidence, same score, so it can be tested and can’t be gamed.' },
    { title: 'Deadlines come from the source', body: 'GSoC, LFX and Outreachy status is scraped from their own pages, so a closed program never shows as open.' },
  ],
  features: [
    { name: 'Readiness Engine', body: 'A score broken into pillars, with the next moves that would raise it most.' },
    { name: 'DSA Arena', body: '3,977 auto-graded problems in a Monaco editor, with hidden tests and runtime and memory feedback.' },
    { name: 'Opportunities', body: 'Open source programs and internships, each marked Open, Closed or Rolling.' },
    { name: 'Roadmaps', body: 'Interactive graph roadmaps with free resources on every node.' },
    { name: 'AI Advisor', body: 'A chat advisor behind a model gateway with a Gemini fallback, for questions a score can’t answer.' },
    { name: 'Compiler', body: 'A standalone compiler for quick throwaway code.' },
  ],
  stack: ['TanStack Start', 'React 19', 'TypeScript', 'Supabase', 'Postgres + RLS', 'Monaco', 'Firecrawl', 'Gemini', 'RAG'],
};

export const pdfScanner = {
  name: 'PDF Scanner Web',
  org: '9D Technologies',
  story:
    'The web side of PDF Scanner, an Android app with 50M+ installs and a 4.8★ rating. It covers what people usually open iLovePDF or CamScanner for, except every byte stays on the device: no account, no upload, no conversion server to pay for.',
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
    body: 'During GSoC 2025 I spent whole afternoons matching container logs by hand. This is the tool I wanted then. Jenkins exports traces over OTLP to a collector that tail-samples them: every failed build and every build over 30 seconds is kept, plus 20% of the rest. Jaeger stores the traces, span metrics feed Prometheus and Grafana, and alert rules ship with it.',
    note: 'Built as the proof of concept for my GSoC 2026 proposal to Jenkins. The project wasn’t selected this year, but the stack stands on its own with one docker compose up.',
    stack: ['OpenTelemetry Collector', 'Jaeger', 'Prometheus', 'Grafana', 'Python', 'Docker Compose'],
    repo: 'https://github.com/SalmanDeveloperz/PoS-OTel',
    discussion: 'https://community.jenkins.io/t/gsoc-2026-opentelemetry-scaling-strategies/36647/3',
    metric: '−81% trace data',
  },
  {
    name: 'SigNoz AI SRE',
    kind: 'Self-healing infra · LLM agent',
    body: 'A watcher that never calls the service it protects. It reads SigNoz alerts, fixes known failures with plain rules, and hands unknown ones to an LLM with two read-only tools. Every model call is a span; every action lands in an audit log.',
    stack: ['OpenTelemetry', 'SigNoz', 'Vercel AI SDK', 'Gemini · Claude · GPT', 'Node.js', 'Postgres'],
    repo: 'https://github.com/SalmanDeveloperz/signoz-ai-sre',
    metric: 'see it run ↑',
  },
  {
    name: 'FOSSology microservices',
    kind: 'GSoC 2025',
    body: 'Scheduler, database and agents split into 10+ Kubernetes services, with a Kustomize base and overlays. The repo holds all 13 weekly reports and the final report.',
    stack: ['Kubernetes', 'Docker', 'Kustomize', 'CMake', 'PostgreSQL'],
    repo: 'https://github.com/SalmanDeveloperz/GSoC-2025',
    metric: '−40% build time',
  },
  {
    name: 'Stremo',
    kind: 'Web app',
    body: 'Streams public domain and Creative Commons films from the Internet Archive, from film noir to the silent era. SSR, Supabase auth, no copyrighted content hosted.',
    stack: ['TanStack Start', 'TypeScript', 'Supabase', 'Bun'],
    repo: 'https://github.com/ezvor/stremo',
    live: 'https://stremo.lovable.app',
  },
  {
    name: 'RevealX',
    kind: 'Browser extension',
    body: 'Shows what’s typed into a password field. Toggling the input’s type breaks on React and Vue, which re-render it back, so this reads the value instead. Handles shadow DOM and asks for zero permissions.',
    stack: ['JavaScript', 'Manifest V3', 'Shadow DOM'],
    repo: 'https://github.com/SalmanDeveloperz/revealX',
  },
  {
    name: 'AutoAccept',
    kind: 'Chrome extension',
    body: 'One-click Accept All on Facebook’s friend requests page, and it keeps working as infinite scroll loads more.',
    stack: ['JavaScript', 'Chrome Extension'],
    repo: 'https://github.com/SalmanDeveloperz/AutoAccept-Facebook-Friends',
  },
];
