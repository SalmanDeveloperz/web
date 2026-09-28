# Updating the site

Everything on the page comes from the files in this folder. No component needs
touching for a normal update. Change a file, run `npm run dev`, check, push.
Netlify rebuilds on every push to `main`.

## The 60-second updates

| I just… | Edit | What to add |
| :--- | :--- | :--- |
| merged a PR | `open-source.ts` | an item under the right org. Status is synced from GitHub, so `'open'` is fine even if it merges later. |
| shipped / merged / won anything | `changelog.ts` | one line: `{ date, type, text, href }`. Order doesn't matter. |
| changed what I'm working on | `site.ts` → `now` | edit the strings, bump `updated`. Shows in the terminal (`cat now.json`). |
| started a new job | `experience.ts` | a new span at the top with `end: null`. Set the old one's `end`. |
| built a project | `projects.ts` | a card in `projects`. `featured: true` moves it into the wide slot. |
| learned a skill | `skills.ts` | a skill under a lane, with at least one `proof` link. No proof, put it in `alsoUsed`. |
| won an award | `awards.ts` | `{ year, title, body, badges? }`. |
| wrote a post | `../content/writing/` | a Markdown file. For Medium/dev.to posts set `external` and `publisher`. |
| new résumé | `../../public/resume.pdf` | replace the file, same name. |

## What updates itself

- **Merged PR count, org count, the monthly chart, PR status badges, `in_review`**
  come from the GitHub API at build time (`github.ts`). Don't type these by hand.
- **The career trace** re-lays itself out from `experience.ts` dates. Live spans
  grow every month without edits.
- **"Ask my résumé" and the terminal's `ask`** index every file here on each
  build (`/rag.json`), so new content is searchable automatically.
- **`/llms.txt`** is regenerated from the same data.

## Links

- Links starting with `#` jump within the page. Useful anchors:
  `#span-<id>` (a role in the trace, opens it), `#oss-<slug>`, `#ai`, `#ask`,
  `#ezvor`, `#pdf-scanner`, `#pos-otel`, `#work`, `#changelog`, `#skills`,
  `#awards`, `#contact`.
- Anything starting with `http` opens in a new tab.

## Rules I keep

- Every number links to its proof (`metrics[].href` in `site.ts`).
- Say "closed" when a PR was closed, not merged. Recruiters click.
- If a claim can't link to evidence, it doesn't go on the page.
