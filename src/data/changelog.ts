// ─────────────────────────────────────────────────────────────────────────────
// The changelog. Append-only record of progress, rendered like `git log`.
// This is the file to touch most often: add one line when something ships,
// merges, or wins. Order doesn't matter, it's sorted by date on build.
//
//   date: 'YYYY-MM-DD' or 'YYYY-MM'
//   type: 'ship' | 'merge' | 'win' | 'role' | 'write'
// ─────────────────────────────────────────────────────────────────────────────

export type LogType = 'ship' | 'merge' | 'win' | 'role' | 'write';
export type LogEntry = { date: string; type: LogType; text: string; href?: string; ref?: string };

export const logTypes: Record<LogType, { label: string; verb: string }> = {
  ship: { label: 'shipped', verb: 'feat' },
  merge: { label: 'merged', verb: 'merge' },
  win: { label: 'won', verb: 'win' },
  role: { label: 'role', verb: 'chore' },
  write: { label: 'wrote', verb: 'docs' },
};

export const changelog: LogEntry[] = [
  { date: '2026-09', type: 'ship', text: 'PDF Scanner Web: 31 document tools, all in the browser, for 9D Technologies', href: 'https://docs-scan.netlify.app/' },
  { date: '2026-08-09', type: 'merge', text: 'Live LLM analysis path with the deterministic engine kept as fallback', ref: 'failuretwin-ai#12', href: 'https://github.com/kaulastudies/failuretwin-ai/pull/12' },
  { date: '2026-08', type: 'role', text: 'Joined 9D Technologies as a Backend Software Engineer' },
  { date: '2026-07-20', type: 'ship', text: 'SigNoz AI SRE: self-healing loop with a guarded LLM tier', href: 'https://github.com/SalmanDeveloperz/signoz-ai-sre' },
  { date: '2026-07-07', type: 'ship', text: 'Ezvor: career platform scored only on judge-verified work', href: 'https://ezvor.lovable.app' },
  { date: '2026-06-10', type: 'merge', text: 'Env var substitution for Windows containers, shipped in LTS 2.568.1', ref: 'jenkinsci/docker#2365', href: 'https://github.com/jenkinsci/docker/pull/2365' },
  { date: '2026-05-18', type: 'merge', text: 'Closed a 2017 issue: env var substitution in the official Jenkins image', ref: 'jenkinsci/docker#2250', href: 'https://github.com/jenkinsci/docker/pull/2250' },
  { date: '2026-03-17', type: 'ship', text: 'PoS-OTel: OpenTelemetry pipeline for Jenkins CI, 81% less trace data', href: 'https://github.com/SalmanDeveloperz/PoS-OTel' },
  { date: '2026-03-04', type: 'merge', text: 'Keyboard navigation scrolling in Jenkins core dropdowns', ref: 'jenkinsci/jenkins#26358', href: 'https://github.com/jenkinsci/jenkins/pull/26358' },
  { date: '2026-03-03', type: 'merge', text: 'Keyboard navigation for the Jenkins theme picker', ref: 'theme-manager#350', href: 'https://github.com/jenkinsci/theme-manager-plugin/pull/350' },
  { date: '2026-01-27', type: 'role', text: 'OWASP Nest collaborator, added to the GSoC 2026 mentor list', ref: 'OWASP/Nest#3605', href: 'https://github.com/OWASP/Nest/pull/3605' },
  { date: '2026-01-07', type: 'merge', text: 'Copyright agent URL regex fix in FOSSology', ref: 'fossology#3212', href: 'https://github.com/fossology/fossology/pull/3212' },
  { date: '2025-12-17', type: 'merge', text: 'First merge into the Jenkins project', ref: 'jenkins.io#8629', href: 'https://github.com/jenkins-infra/jenkins.io/pull/8629' },
  { date: '2025-09', type: 'win', text: 'Completed Google Summer of Code 2025 at FOSSology', href: 'https://summerofcode.withgoogle.com/archive/2025/projects/MjOyiOj7' },
  { date: '2025-07', type: 'win', text: 'Linux Foundation LiFT scholarship for Kubernetes LFD259' },
  { date: '2025-06-03', type: 'write', text: 'My Google Summer of Code 2025 journey', href: 'https://medium.com/@msamdev/my-google-summer-of-code-2025-journey-be42c1d27d7f' },
  { date: '2025-05', type: 'win', text: 'Selected for Google Summer of Code 2025, under 5% acceptance' },
  { date: '2025-05-29', type: 'merge', text: 'Four FOSSology fixes merged before GSoC began: nomos, tests, regex, logging', ref: 'fossology#2947', href: 'https://github.com/search?q=author%3ASalmanDeveloperz+repo%3Afossology%2Ffossology+is%3Amerged&type=pullrequests' },
  { date: '2025-03', type: 'win', text: 'Byte & Battle hackathon: 1st university-wide, 3rd at district level' },
  { date: '2024-12-26', type: 'merge', text: 'NumFOCUS DISCOVER Cookbook edits', ref: 'numfocus#73', href: 'https://github.com/numfocus/DISCOVER-Cookbook/pull/73' },
  { date: '2024-10-06', type: 'merge', text: 'Hacktoberfest: first merges into other people’s code', ref: 'TYPO3/tea#1480', href: 'https://github.com/TYPO3BestPractices/tea/pull/1480' },
  { date: '2023-10', type: 'role', text: 'Started freelancing: full-stack apps and CI/CD for 8 to 10 clients' },
  { date: '2023-05', type: 'role', text: 'Software Engineer Intern at Hywiz Technologies' },
];
