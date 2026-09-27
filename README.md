# salman-ch.netlify.app

Personal site of **Muhammad Salman**, backend and infrastructure engineer.

## Highlights

- **Interactive terminal** in the hero: `help`, `projects`, `oss`, `open x`, `sudo hire salman`, with tab completion and history.
- **Career as a distributed trace**: experience rendered as a Jaeger-style span waterfall with expandable attributes.
- **⌘K command palette**: keyboard navigation, copy email, open links, toggle theme. `/` also opens it.
- **Machine-readable profile**: `/llms.txt` for AI agents, `/rss.xml` for writing, JSON-LD `Person` schema, sitemap.
- Light and dark themes (follows the OS, remembers your choice, `?theme=dark` forces one).
- Static HTML with no framework runtime, and it works without JavaScript.

## Live GitHub data

At build time `src/data/github.ts` fetches every PR I've authored outside my own repos. The merged count, the FOSSology and Jenkins numbers, and each PR's status badge come from that fetch. If GitHub is unreachable, the site falls back to the statuses written in `profile.ts`. Setting `GITHUB_TOKEN` in Netlify's environment variables raises the API rate limit. A Netlify build hook on a daily schedule keeps statuses fresh.

## Editing content

| What | Where |
| :--- | :--- |
| Name, headline, links, metrics, experience, open source, projects, awards, stack | `src/data/profile.ts` |
| Blog posts (Markdown) | `src/content/writing/*.md` |
| Résumé PDF | `public/resume.pdf` |
| Portrait | `scripts/assets/salman.jpg`, then run `node scripts/og.mjs` |

`node scripts/og.mjs` regenerates `public/salman.webp` and the 1200×630 social preview `public/og.png`.

## Develop

Requires Node 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npm run preview
```

Netlify settings live in `netlify.toml`: build `npm run build`, publish `dist`.

## License

MIT
