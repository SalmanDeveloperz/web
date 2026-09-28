// ─────────────────────────────────────────────────────────────────────────────
// Career, rendered as a distributed trace.
// Each role is a span. start/end are "YYYY-MM"; end: null means still running.
// Add a new role at the top. The trace re-lays itself out automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const traceWindow = { start: '2022-09', end: '2026-12' };

export type Span = {
  id: string; // also the anchor: #span-<id>
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
    summary: 'Own backend services end to end: Python and FastAPI APIs, the database work behind them, and the CI/CD that tests and ships them.',
    attrs: { stack: 'python, fastapi, postgres, github actions', status: 'active' },
    points: [
      'Built an authentication service in FastAPI: request validation, error handling, secure endpoint design.',
      'Wrote the REST endpoints for a task management platform’s reporting module, so reports generate themselves instead of being assembled by hand.',
      'Set up GitHub Actions pipelines that test and deploy the backend services on every change.',
      'Shipped PDF Scanner Web: 31 document tools that run entirely in the browser, zero server uploads.',
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
      'Contributor to Jenkins core, the official Docker images and the theme manager plugin. Five PRs merged; two of them ship inside every official Jenkins container.',
    attrs: { repos: 'jenkins, docker, theme-manager-plugin', shipped: '2.565, LTS 2.568.1' },
    points: [
      'Closed an issue open since 2017: opt-in env var substitution for containerized Jenkins.',
      'Brought the same feature to Windows containers in PowerShell, with Pester tests.',
      'Fixed keyboard traps and added ARIA roles in the core UI. I found and reported most of these bugs myself.',
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
      'Earned collaborator access after finding and helping fix broken keyboard focus indicators. Listed as a GSoC 2026 mentor. Reported a security issue to the maintainers through private disclosure.',
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
      'Revived a microservices branch that had been frozen since 2021 and made it run on 2025 infrastructure. FOSSology went from one monolithic deployment to 10+ services on Docker and Kubernetes.',
    attrs: { stack: 'kubernetes, docker, kustomize, cmake, postgres', weeks: '13' },
    points: [
      'Moved the build from Make to CMake. Builds got 40% faster, and a CI pipeline that had been red for the team went green.',
      'Traced a scheduler crash loop through PostgreSQL schema limits, container networking and init ordering, then fixed it.',
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
      'Shipped full-stack apps and the delivery plumbing behind them for 8 to 10 clients: Jenkins and GitHub Actions pipelines, Docker images, AWS deploys on EC2 and S3.',
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
      'Graduated with a 3.37/4.0 CGPA on an 80% PEEF merit scholarship. Won 1st place university-wide at the Byte & Battle hackathon.',
    attrs: { cgpa: '3.37', scholarship: 'PEEF 80%' },
  },
];
