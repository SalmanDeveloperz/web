// Machine-readable profile for AI agents and recruiters' tooling (https://llmstxt.org).
import { getCollection } from 'astro:content';
import { profile, spans, openSource, ezvor, pdfScanner, projects, awards, stack } from '../data/profile';

export async function GET() {
  const posts = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const site = profile.site;
  const L: string[] = [];

  L.push(`# ${profile.name}`, '');
  L.push(`> ${profile.role} in ${profile.location}. ${profile.intro}`, '');
  L.push(`Availability: ${profile.availability}.`);
  L.push(`Contact: ${profile.email}`);
  L.push(`Resume: ${site}${profile.resume}`, '');

  L.push('## Experience', '');
  for (const s of [...spans].sort((a, b) => b.start.localeCompare(a.start))) {
    L.push(`- **${s.role}**, ${s.org} (${s.start} to ${s.end ?? 'present'}): ${s.summary}`);
  }

  L.push('', '## Open source', '');
  for (const o of openSource) {
    L.push(`### ${o.name}${o.highlight ? ` (${o.highlight})` : ''}`);
    for (const i of o.items) L.push(`- [${i.status}] ${i.title}: ${i.url}`);
    L.push('');
  }

  L.push('## Projects', '');
  L.push(`- [${ezvor.name}](${ezvor.live}): ${ezvor.pitch} Code: ${ezvor.repo}`);
  L.push(`- [${pdfScanner.name}](${pdfScanner.live}): ${pdfScanner.pitch}`);
  for (const p of projects) L.push(`- [${p.name}](${p.live ?? p.repo}): ${p.body}`);

  L.push('', '## Awards', '');
  for (const a of awards) L.push(`- ${a.year}, ${a.title}: ${a.body}`);

  L.push('', '## Skills', '');
  for (const g of stack) L.push(`- ${g.group}: ${g.items.join(', ')}`);

  L.push('', '## Writing', '');
  for (const p of posts) L.push(`- [${p.data.title}](${p.data.external ?? `${site}/writing/${p.id}/`}): ${p.data.description}`);

  L.push('', '## Links', '');
  for (const s of profile.socials) L.push(`- ${s.name}: ${s.url}`);

  return new Response(L.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
