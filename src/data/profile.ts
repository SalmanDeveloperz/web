// Barrel file. Content lives in the topic files next to this one:
//
//   site.ts         who I am, links, now.json, credentials, headline numbers
//   experience.ts   roles, rendered as the career trace
//   open-source.ts  PRs and issues, grouped by org
//   projects.ts     Ezvor, PDF Scanner, and the project cards
//   ai.ts           AI principles and the agent-simulator scenarios
//   skills.ts       skills, each with proof links
//   changelog.ts    dated progress log (add to this one most often)
//   awards.ts       awards and scholarships
//   github.ts       build-time GitHub sync (no need to edit)
//
// See src/data/README.md for the update guide.

export * from './site';
export * from './experience';
export * from './open-source';
export * from './projects';
export * from './ai';
export * from './skills';
export * from './changelog';
export * from './awards';
export { allPrsUrl } from './github';

// Back-compat alias used by a few components.
export { lanes as stack } from './skills';
