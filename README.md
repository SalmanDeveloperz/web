## My personal site. Its static, fast and boring where it matters 👀

Live: **[salman-ch.netlify.app](https://salman-ch.netlify.app)**

```
$ whoami
Software engineer · 9D Technologies · localhost
```

---

## Why I rewrote it

The old version was a Gatsby 3 template from 2021. It still built, barely, but it no longer described what I do. After GSoC, Jenkins releases and a few projects I actually care about, the site was two years behind.

So I threw it out and started from an empty folder. The rules I set:

1. **No framework runtime in the browser.** Plain HTML, a little CSS, small scripts that only wake up when their section is on screen. The home page ships ~36 KB of HTML, ~13 KB of CSS and ~5 KB of external JS after gzip, plus ~75 KB of self-hosted fonts.
2. **Nothing typed by hand that a machine can check.** PR counts and statuses come from the GitHub API at build time.
3. **Content is data.** Every word on the page lives in `src/data/`, split by topic. No CMS. See [`src/data/README.md`](src/data/README.md).
4. **Works without JavaScript.** Scripts only add behaviour on top. Turn JS off and every section still renders.

## What's on the page

| Thing | How it works |
| :--- | :--- |
| **Hero terminal** | A small shell. `help`, `ask <question>`, `neofetch`, `git log`, `now`, `agent`, `open x`, `sudo hire salman`. Tab completion and history. |
| **LLM agent replay** | Replays the control flow of [signoz-ai-sre](https://github.com/SalmanDeveloperz/signoz-ai-sre): rules for known failures, a tool-calling LLM for unknown ones, one safety check for both. Four scenarios including a prompt-injection what-if; switch Gemini / Claude / GPT. Data in `src/data/ai.ts`. |
| **Ask my résumé** | BM25 over `/rag.json`, which is generated from `src/data/` on every build. Runs in the browser, loads on first question, answers only with cited lines. No model call, nothing to hallucinate. |
| **Tail-sampling simulator** | Simulated CI traffic through the PoS-OTel policies. Toggles rewrite the collector YAML live. |
| **PDF drop test** | Drop a file: SHA-256, page count and PDF version computed in the tab with Web Crypto. Proves the zero-upload claim. |
| **Changelog** | `git log --graph` rendering of `src/data/changelog.ts`, filterable, with stable FNV-1a short hashes. |
| **Skills, with proof** | Click a skill, get the links that prove it. |
| **Experience as a trace** | Each role is a span in a Jaeger-style waterfall. Bars are positioned from start and end months, so it redraws itself as time passes. Rows are `<details>`, no JS needed. |
| **Open source** | Every PR row links out. Statuses are synced from GitHub on each build, then filterable (merged, in review, reported). |
| **Ezvor demo** | Sliders feed a weighted sum and an FNV-1a hash of the inputs. Same input, same score, same hash. That's the whole point of Ezvor's readiness engine. |
| **⌘K palette** | Keyboard menu for navigation, links and copying my email. `/` opens it too. |
| **For machines** | `/llms.txt`, `/rss.xml`, sitemap, and JSON-LD `Person` schema. |

## Stack

- [Astro 7](https://astro.build), static output
- TypeScript, strict
- Hand-written CSS with custom properties for light and dark themes. No Tailwind.
- Fonts: Geist, Geist Mono and Kalam, self-hosted via Fontsource, latin subsets preloaded
- Netlify for hosting, with security headers and redirects in `netlify.toml`

## Run it

Needs Node 22.12 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/ locally
```

In VS Code, press F5 and pick "Dev server".

## Where things live

```text
src/
├── data/
│   ├── site.ts         profile, links, now.json, credentials, metrics
│   ├── experience.ts   roles → the career trace
│   ├── open-source.ts  PRs and issues by org
│   ├── projects.ts     Ezvor, PDF Scanner, project cards
│   ├── ai.ts           AI principles + agent scenarios
│   ├── skills.ts       skills with proof links
│   ├── changelog.ts    dated progress log (edit this most)
│   ├── awards.ts       awards and scholarships
│   ├── github.ts       build-time PR sync, cached, with fallback
│   └── README.md       the update guide
├── components/         one file per section (Hero, Trace, OpenSource, ...)
├── content/writing/    blog posts in Markdown (external posts link out)
├── layouts/Base.astro  head, SEO, theme bootstrap
├── scripts/retrieve.ts BM25 retriever, loaded on demand
├── pages/              index, writing, 404, rss.xml, llms.txt, rag.json
└── styles/global.css   tokens, reset, shared primitives
public/                 resume.pdf, og.png, favicon, robots.txt
scripts/og.mjs          regenerates the 1200x630 social card
```

## Changing things

- **Anything on the page:** edit the matching file in `src/data/`. The guide in `src/data/README.md` has a table of which file to touch.
- **A new post:** add a Markdown file to `src/content/writing/`. For a post hosted elsewhere, set `external` and `publisher` in the frontmatter and it links out.
- **Résumé:** replace `public/resume.pdf`. `/resume` redirects to it.
- **Social card:** edit `scripts/og.mjs`, then run `node scripts/og.mjs`.

## The GitHub sync

`src/data/github.ts` runs once per build. It searches every PR I've opened outside my own repos, keeps the ones in upstream orgs, and works out:

- the merged count and org count shown on the page
- the live status of each PR listed in `profile.ts`

If the API is rate limited or down, the build doesn't fail. It falls back to the statuses written in `profile.ts` and shows "status from last sync".

Two optional Netlify settings:

- `GITHUB_TOKEN` as an environment variable, for a higher rate limit
- a daily build hook, so a PR that merges overnight shows as merged the next morning

## Deploy

Netlify builds on push. The settings are in `netlify.toml`: build with `npm run build`, publish `dist`.

## License

MIT. Take the code if it helps. The words and the résumé are mine.
