// One place that knows about themes and display preferences. The nav menu,
// the terminal (`theme`), the command palette and devtools all go through it.
// The first paint is handled by the inline script in Base.astro.

export type Mode = 'light' | 'dark';
export type Theme = { id: string; name: string; mode: Mode; swatch: [string, string] };

export const themes: Theme[] = [
  { id: 'paper', name: 'Paper', mode: 'light', swatch: ['#ffffff', '#0f5c4a'] },
  { id: 'sepia', name: 'Sepia', mode: 'light', swatch: ['#f6f1e7', '#9a3b14'] },
  { id: 'ink', name: 'Ink', mode: 'dark', swatch: ['#0e1012', '#5cc9a3'] },
  { id: 'midnight', name: 'Midnight', mode: 'dark', swatch: ['#0a0f1c', '#8ab4ff'] },
  { id: 'phosphor', name: 'Phosphor', mode: 'dark', swatch: ['#050906', '#3cf08a'] },
  { id: 'contrast', name: 'High contrast', mode: 'dark', swatch: ['#000000', '#ffd60a'] },
];

const doc = () => document.documentElement;
const legacy: Record<string, string> = { light: 'paper', dark: 'ink' };

export const currentTheme = (): Theme => themes.find((t) => t.id === doc().dataset.theme) ?? themes[0];

export function findTheme(q: string): Theme | undefined {
  const k = (legacy[q.toLowerCase()] ?? q).toLowerCase();
  return themes.find((t) => t.id === k || t.name.toLowerCase() === k || t.name.toLowerCase().startsWith(k));
}

const syncMeta = () => {
  const bg = getComputedStyle(doc()).getPropertyValue('--bg').trim();
  document.querySelector('meta[data-theme-color]')?.setAttribute('content', bg || '#ffffff');
};

export function setTheme(id: string, opts: { persist?: boolean; animate?: boolean } = {}): Theme | undefined {
  const t = findTheme(id);
  if (!t) return undefined;
  const apply = () => {
    doc().dataset.theme = t.id;
    doc().dataset.mode = t.mode;
    syncMeta();
  };
  const vt = (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || doc().dataset.motion === 'reduce';
  if (opts.animate !== false && vt && !reduce) vt.call(document, apply);
  else apply();
  if (opts.persist !== false) { try { localStorage.setItem('theme', t.id); } catch {} }
  dispatchEvent(new CustomEvent('themechange', { detail: t }));
  return t;
}

export function cycleTheme(): Theme {
  const i = themes.findIndex((t) => t.id === currentTheme().id);
  return setTheme(themes[(i + 1) % themes.length].id)!;
}

export function toggleMode(): Theme {
  return setTheme(currentTheme().mode === 'light' ? 'ink' : 'paper')!;
}

// Display preferences: font scale, reduced motion, custom accent.
export type Prefs = { scale?: number; motion?: 'reduce' | ''; accent?: string };

export function getPrefs(): Prefs {
  try { return JSON.parse(localStorage.getItem('prefs') || '{}'); } catch { return {}; }
}

export function setPrefs(patch: Prefs): Prefs {
  const p = { ...getPrefs(), ...patch };
  if (p.scale && p.scale !== 1) doc().style.setProperty('--font-scale', String(p.scale));
  else { doc().style.removeProperty('--font-scale'); delete p.scale; }
  if (p.motion) doc().dataset.motion = p.motion;
  else { delete doc().dataset.motion; delete p.motion; }
  if (p.accent) { doc().style.setProperty('--accent', p.accent); doc().style.setProperty('--term-accent', p.accent); }
  else { doc().style.removeProperty('--accent'); doc().style.removeProperty('--term-accent'); delete p.accent; }
  try { localStorage.setItem('prefs', JSON.stringify(p)); } catch {}
  dispatchEvent(new CustomEvent('prefschange', { detail: p }));
  return p;
}

export function resetPrefs() {
  try { localStorage.removeItem('prefs'); } catch {}
  setPrefs({ scale: 1, motion: '', accent: '' });
}

if (typeof document !== 'undefined') syncMeta();
