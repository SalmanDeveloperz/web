// Generates public/og.png and public/salman.webp. Run: node scripts/og.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const photo = await sharp('scripts/assets/salman.jpg').resize(480, 480, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toBuffer();
await sharp(photo).toFile('public/salman.webp');
const avatar = await sharp(photo).resize(220, 220).png().toBuffer();
const mask = Buffer.from('<svg width="220" height="220"><rect width="220" height="220" rx="44" fill="#fff"/></svg>');
const rounded = await sharp(avatar).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();

const grid = Array.from({ length: 22 }, (_, i) => `<path d="M${i * 56} 0V630" stroke="#ffffff" stroke-opacity=".035"/>`).join('') +
  Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 56}H1200" stroke="#ffffff" stroke-opacity=".035"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><radialGradient id="g" cx="80%" cy="0%" r="70%"><stop offset="0" stop-color="#2ec4b6" stop-opacity=".28"/><stop offset="1" stop-color="#2ec4b6" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="#07090c"/>${grid}<rect width="1200" height="630" fill="url(#g)"/>
<text x="80" y="118" font-family="Consolas,monospace" font-size="24" fill="#2ec4b6">salman@lahore:~$ whoami</text>
<text x="80" y="232" font-family="Segoe UI,Arial,sans-serif" font-size="84" font-weight="700" fill="#e6edf3" letter-spacing="-3">Muhammad Salman</text>
<text x="80" y="300" font-family="Segoe UI,Arial,sans-serif" font-size="38" fill="#b3bfcc">Backend &amp; Infrastructure Engineer</text>
<text x="80" y="380" font-family="Segoe UI,Arial,sans-serif" font-size="30" fill="#7d8a99">I build backend services and fix the pipelines</text>
<text x="80" y="422" font-family="Segoe UI,Arial,sans-serif" font-size="30" fill="#7d8a99">nobody wants to touch.</text>
${["GSoC '25 · FOSSology", 'Jenkins LTS 2.568.1', 'LF LiFT Scholar', 'OWASP Nest'].map((t, i) => {
  const w = [290, 280, 230, 170][i]; const x = [80, 386, 682, 928][i];
  return `<rect x="${x}" y="490" width="${w}" height="52" rx="10" fill="#0f1319" stroke="#283241"/><text x="${x + w / 2}" y="524" text-anchor="middle" font-family="Consolas,monospace" font-size="21" fill="#e6edf3">${t}</text>`;
}).join('')}
<text x="1120" y="118" text-anchor="end" font-family="Consolas,monospace" font-size="22" fill="#4a5563">salman-ch.netlify.app</text>
</svg>`;
await sharp(Buffer.from(svg)).composite([{ input: rounded, left: 900, top: 170 }]).png().toFile('public/og.png');
console.log('ok');
