// ─────────────────────────────────────────────────────────────────────────────
// Skills, each backed by where I actually used it. Click-through on the site.
// A skill with no `proof` doesn't belong in `lanes`; put it in `alsoUsed`.
// Links starting with # jump to a section on the page.
// ─────────────────────────────────────────────────────────────────────────────

export type Proof = { label: string; href: string };
export type Skill = { name: string; proof: Proof[] };
export type Lane = { id: string; title: string; blurb: string; skills: Skill[] };

const gh = (p: string) => `https://github.com/${p}`;

export const lanes: Lane[] = [
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'APIs, data, and the boring correctness that keeps them up.',
    skills: [
      { name: 'Python', proof: [{ label: 'FastAPI services at 9D', href: '#span-9d' }, { label: 'PoS-OTel pipeline simulator', href: gh('SalmanDeveloperz/PoS-OTel') }, { label: 'sktime#10316', href: gh('sktime/sktime/pull/10316') }] },
      { name: 'FastAPI', proof: [{ label: 'Auth service with validation and secure endpoints', href: '#span-9d' }, { label: 'Reporting module REST endpoints', href: '#span-9d' }] },
      { name: 'Node.js', proof: [{ label: 'SigNoz AI SRE: 3 services, routes → controllers → repos', href: gh('SalmanDeveloperz/signoz-ai-sre') }, { label: 'Hywiz product APIs', href: '#span-hywiz' }] },
      { name: 'PostgreSQL', proof: [{ label: 'FOSSology schema limits behind a crash loop', href: '#span-gsoc' }, { label: 'SigNoz control-plane state + incident log', href: gh('SalmanDeveloperz/signoz-ai-sre') }, { label: 'Ezvor with row-level security', href: '#ezvor' }] },
      { name: 'MongoDB', proof: [{ label: 'Aggregation pipelines replacing a manual export', href: '#span-hywiz' }] },
      { name: 'REST design', proof: [{ label: 'Master endpoint reference, SigNoz AI SRE', href: gh('SalmanDeveloperz/signoz-ai-sre') }, { label: 'Reporting endpoints at 9D', href: '#span-9d' }] },
    ],
  },
  {
    id: 'ai',
    title: 'AI / LLM',
    blurb: 'Models where judgment helps, rules where correctness matters.',
    skills: [
      { name: 'Tool-calling agents', proof: [{ label: 'Two read-only tools, maxSteps 4', href: '#ai' }, { label: 'investigate.js', href: gh('SalmanDeveloperz/signoz-ai-sre') }] },
      { name: 'Guardrails', proof: [{ label: 'Allowlist, timeout, shared safety check', href: '#ai' }, { label: 'Prompt-injection what-if', href: '#ai' }] },
      { name: 'Provider-agnostic LLMs', proof: [{ label: 'Gemini, Claude, GPT behind one interface', href: '#ai' }, { label: 'Ezvor model gateway with Gemini fallback', href: '#ezvor' }] },
      { name: 'Deterministic fallbacks', proof: [{ label: 'failuretwin-ai#12', href: gh('kaulastudies/failuretwin-ai/pull/12') }, { label: 'Ezvor’s AI-free readiness score', href: '#ezvor' }] },
      { name: 'LLM observability', proof: [{ label: 'gen_ai.* attributes and token cost on spans', href: gh('SalmanDeveloperz/signoz-ai-sre') }] },
      { name: 'RAG & retrieval', proof: [{ label: 'Ask my résumé: BM25, cited, in your browser', href: '#ask' }, { label: 'Ezvor stack', href: '#ezvor' }] },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & infra',
    blurb: 'Containers, pipelines, and telemetry that tells you why.',
    skills: [
      { name: 'Kubernetes', proof: [{ label: 'FOSSology: 10+ services', href: '#span-gsoc' }, { label: 'LFD259 scholarship', href: '#awards' }] },
      { name: 'Docker', proof: [{ label: 'jenkinsci/docker#2250', href: gh('jenkinsci/docker/pull/2250') }, { label: 'jenkinsci/docker#2365', href: gh('jenkinsci/docker/pull/2365') }] },
      { name: 'Jenkins', proof: [{ label: 'Core and Docker image PRs', href: '#oss-jenkins' }, { label: 'PoS-OTel', href: '#pos-otel' }] },
      { name: 'OpenTelemetry', proof: [{ label: 'Tail sampling, −81% trace data', href: '#pos-otel' }, { label: 'Agent traces in SigNoz', href: '#ai' }] },
      { name: 'Prometheus + Grafana', proof: [{ label: 'Provisioned dashboards and alert rules', href: gh('SalmanDeveloperz/PoS-OTel') }] },
      { name: 'Kustomize', proof: [{ label: 'Base + overlays, 26 manifests', href: '#span-gsoc' }] },
      { name: 'GitHub Actions', proof: [{ label: 'Test and deploy pipelines at 9D', href: '#span-9d' }, { label: 'Freelance client pipelines', href: '#span-fiverr' }] },
      { name: 'CMake', proof: [{ label: 'Make → CMake, 40% faster builds', href: '#span-gsoc' }] },
      { name: 'AWS', proof: [{ label: 'EC2 and S3 deploys for clients', href: '#span-fiverr' }] },
      { name: 'PowerShell', proof: [{ label: 'Windows parity with Pester tests', href: gh('jenkinsci/docker/pull/2365') }] },
    ],
  },
  {
    id: 'fullstack',
    title: 'Full stack',
    blurb: 'Interfaces that are fast, accessible, and do the work client-side.',
    skills: [
      { name: 'React + TypeScript', proof: [{ label: 'Ezvor', href: '#ezvor' }, { label: 'PDF Scanner Web', href: '#pdf-scanner' }] },
      { name: 'TanStack Start', proof: [{ label: 'Ezvor, Stremo, PDF Scanner', href: '#work' }] },
      { name: 'Supabase', proof: [{ label: 'Auth + Postgres with RLS in Ezvor', href: '#ezvor' }] },
      { name: 'Accessibility', proof: [{ label: 'Jenkins keyboard nav + ARIA', href: '#oss-jenkins' }, { label: 'OWASP Nest focus outlines', href: '#oss-owasp' }] },
      { name: 'In-browser processing', proof: [{ label: '31 PDF tools, zero uploads', href: '#pdf-scanner' }] },
      { name: 'Browser extensions', proof: [{ label: 'RevealX, AutoAccept', href: '#work' }] },
      { name: 'Astro', proof: [{ label: 'This site: ~25 KB, no framework runtime', href: 'https://github.com/SalmanDeveloperz/web' }] },
    ],
  },
];

export const alsoUsed = ['C++', 'Express', 'MySQL', 'Redis', 'JWT', 'Socket.io', 'LangChain', 'OpenAI API', 'Embeddings', 'Postman', 'JMeter', 'PHPUnit', 'Linux', 'Bash', 'Tailwind'];
