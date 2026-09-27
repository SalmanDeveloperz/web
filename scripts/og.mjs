// Generates the 1200x630 social preview at public/og.png. Run: node scripts/og.mjs
import sharp from 'sharp';

const grid =
  Array.from({ length: 22 }, (_, i) => `<path d="M${i * 56} 0V630" stroke="#ffffff" stroke-opacity=".035"/>`).join('') +
  Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 56}H1200" stroke="#ffffff" stroke-opacity=".035"/>`).join('');

const tags = [
  ['GSoC 2025 · FOSSology', 300],
  ['Jenkins LTS 2.568.1', 262],
  ['LF LiFT Scholar', 222],
  ['OWASP Nest', 170],
];
let x = 80;
const chips = tags
  .map(([t, w]) => {
    const s = `<rect x="${x}" y="490" width="${w}" height="52" rx="10" fill="#0f1319" stroke="#283241"/><text x="${x + w / 2}" y="524" text-anchor="middle" font-family="Consolas,monospace" font-size="21" fill="#e6edf3">${t}</text>`;
    x += w + 16;
    return s;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><radialGradient id="g" cx="80%" cy="0%" r="70%"><stop offset="0" stop-color="#2ec4b6" stop-opacity=".28"/><stop offset="1" stop-color="#2ec4b6" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="#07090c"/>${grid}<rect width="1200" height="630" fill="url(#g)"/>
<text x="80" y="118" font-family="Consolas,monospace" font-size="24" fill="#2ec4b6">salman@lahore:~$ whoami</text>
<text x="1120" y="118" text-anchor="end" font-family="Consolas,monospace" font-size="22" fill="#4a5563">salman-ch.netlify.app</text>
<text x="80" y="236" font-family="Segoe UI,Arial,sans-serif" font-size="92" font-weight="700" fill="#e6edf3" letter-spacing="-3">Muhammad Salman</text>
<text x="80" y="304" font-family="Segoe UI,Arial,sans-serif" font-size="38" fill="#b3bfcc">Backend Software Engineer · Python, FastAPI, Kubernetes</text>
<text x="80" y="386" font-family="Segoe UI,Arial,sans-serif" font-size="30" fill="#7d8a99">I build backend services and fix the pipelines nobody wants to touch.</text>
${chips}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('ok');
