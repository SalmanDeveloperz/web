// Machine-readable profile for AI agents and recruiters' tooling (https://llmstxt.org).
import { getCollection } from 'astro:content';
import { profile, now, spans, openSource, ezvor, pdfScanner, projects, awards, lanes, alsoUsed, aiPrinciples, changelog } from '../data/profile';

export async function GET() {
  const posts = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const site = profile.site;
  const L: string[] = [];

  L.push(`# ${profile.name}`, '');
  L.push(`> ${profile.role} in ${profile.location}. ${profile.intro.join(' ')}`, '');
  L.push(`Availability: ${profile.availability}.`);
  L.push(`Contact: ${profile.email}`);
  L.push(`Resume: ${site}${profile.resume}`, '');
  L.push(`Now: shipping ${now.shipping}; building ${now.building}; exploring ${now.exploring}. (updated ${now.updated})`, '');
  L.push(`Retrieval corpus of this site, as JSON: ${site}/rag.json`, '');

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

  L.push('## How I build with LLMs', '');
  for (const p of aiPrinciples) L.push(`- **${p.title}.** ${p.body} Proof: ${p.proof.href}`);

  L.push('', '## Projects', '');
  L.push(`- [${ezvor.name}](${ezvor.live}): ${ezvor.story} Code: ${ezvor.repo}`);
  L.push(`- [${pdfScanner.name}](${pdfScanner.live}): ${pdfScanner.story}`);
  for (const p of projects) L.push(`- [${p.name}](${p.live ?? p.repo}): ${p.body}`);

  L.push('', '## Awards', '');
  for (const a of awards) L.push(`- ${a.year}, ${a.title}: ${a.body}`);

  L.push('', '## Skills', '');
  for (const l of lanes) L.push(`- ${l.title}: ${l.skills.map((s) => s.name).join(', ')}`);
  L.push(`- Also: ${alsoUsed.join(', ')}`);

  L.push('', '## Changelog', '');
  for (const e of [...changelog].sort((a, b) => b.date.localeCompare(a.date))) L.push(`- ${e.date} [${e.type}] ${e.text}${e.href ? ` ${e.href}` : ''}`);

  L.push('', '## Writing', '');
  for (const p of posts) L.push(`- [${p.data.title}](${p.data.external ?? `${site}/writing/${p.id}/`}): ${p.data.description}`);

  L.push('', '## Links', '');
  for (const s of profile.socials) L.push(`- ${s.name}: ${s.url}`);

  return new Response(L.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
