// Retrieval corpus for "Ask my résumé" and the terminal's `ask` command.
// Built from the same data files as the page, so it can never drift from it.
// Fetched lazily by the browser only when someone asks a question.
import { profile, now, spans, openSource, projects, ezvor, pdfScanner, aiPrinciples, awards, lanes, changelog } from '../data/profile';

// `tags` boost ranking but are never quoted back as an answer.
type Chunk = { id: string; kind: string; title: string; text: string; href?: string; tags?: string };

export async function GET() {
  const c: Chunk[] = [];
  const push = (kind: string, title: string, text: string, href?: string, tags?: string) =>
    c.push({ id: `${kind}-${c.length}`, kind, title, text: text.replace(/\s+/g, ' ').trim(), href, tags });

  push('profile', `${profile.name}, ${profile.role}`, `${profile.headline} ${profile.intro.join(' ')} Based in ${profile.location}. ${profile.availability}.`, '#main');
  push('now', 'What I’m doing now', `Shipping ${now.shipping}. Building ${now.building}. Exploring ${now.exploring}. Open to ${now.open_to}.`);

  for (const s of spans) {
    push('experience', `${s.role} · ${s.org}`, `${s.summary} ${(s.points ?? []).join(' ')} Stack and details: ${Object.values(s.attrs).join(', ')}. From ${s.start} to ${s.end ?? 'present'}.`, `#span-${s.id}`);
  }
  for (const o of openSource) {
    for (const it of o.items) {
      push('open source', `${o.name} · ${it.ref}`, `${it.title}. ${o.blurb} Status: ${it.status}.${o.highlight ? ` ${o.highlight}.` : ''}`, it.url || `#oss-${o.slug}`);
    }
  }
  push('project', 'Ezvor', `${ezvor.story} ${ezvor.principles.map((p) => `${p.title}: ${p.body}`).join(' ')} Stack: ${ezvor.stack.join(', ')}.`, '#ezvor');
  for (const f of ezvor.features) push('project', `Ezvor · ${f.name}`, f.body, '#ezvor');
  push('project', pdfScanner.name, `${pdfScanner.story} Built at ${pdfScanner.org}. Tools: ${pdfScanner.groups.map((g) => `${g.name} (${g.tools})`).join('; ')}. Stack: ${pdfScanner.stack.join(', ')}.`, '#pdf-scanner');
  for (const p of projects) {
    push('project', p.name, `${p.body} ${p.note ?? ''} Stack: ${p.stack.join(', ')}.`, p.featured ? '#pos-otel' : p.repo);
  }
  for (const p of aiPrinciples) push('ai', `AI principle: ${p.title}`, p.body, '#ai', 'llm agent ai safe safety guardrail model signoz');
  for (const a of awards) push('award', `${a.title} (${a.year})`, `${a.body} ${(a.badges ?? []).join(', ')}`, '#awards');
  for (const l of lanes) {
    for (const s of l.skills) push('skill', `${s.name} (${l.title})`, `Proof of ${s.name}: ${s.proof.map((p) => p.label).join('; ')}.`, s.proof[0]?.href, l.title);
  }
  for (const e of changelog) push('changelog', `${e.date} · ${e.type}`, `${e.text}${e.ref ? ` (${e.ref})` : ''}.`, e.href);

  return new Response(JSON.stringify(c), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
