import { gsap } from './gsap';

/**
 * Site-wide colour theming from a single picked colour.
 * Derives background surfaces (tinted, readable) and accent shades for the current
 * dark/light mode, then tweens every CSS variable to the new values.
 */
const KEY = 'theme-color';
const SURFACES = ['--color-surface', '--color-surface-2', '--color-surface-3']; // used as plain colours
const TRIPLETS = ['--primary-400', '--primary-500', '--primary-600', '--primary-700', '--accent', '--sky', '--on-primary']; // used as "r g b"
const ALL = [...SURFACES, ...TRIPLETS];

const DEFAULTS = {
  dark: {
    '--color-surface': [11, 11, 12], '--color-surface-2': [19, 19, 21], '--color-surface-3': [26, 26, 29],
    '--primary-400': [212, 240, 125], '--primary-500': [197, 232, 108], '--primary-600': [178, 214, 84], '--primary-700': [132, 168, 42],
    '--accent': [225, 245, 170], '--sky': [160, 220, 140], '--on-primary': [12, 14, 8],
  },
  light: {
    '--color-surface': [245, 244, 239], '--color-surface-2': [255, 255, 255], '--color-surface-3': [236, 235, 229],
    '--primary-400': [77, 110, 12], '--primary-500': [190, 226, 92], '--primary-600': [172, 208, 70], '--primary-700': [77, 110, 12],
    '--accent': [120, 160, 30], '--sky': [60, 130, 60], '--on-primary': [12, 14, 8],
  },
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export const rgbToHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

export function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255].map(Math.round);
}

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Theme variables for a picked colour in the given mode. */
export function buildTheme(hex, mode) {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  const neutral = s < 0.08;
  const tint = neutral ? 0 : Math.min(s, 1);
  const hue2 = (h + 22) % 360;
  let t;
  if (mode === 'dark') {
    const L = neutral ? clamp(l, 0.72, 0.9) : clamp(l, 0.55, 0.72);
    t = {
      '--color-surface': hslToRgb(h, tint * 0.28, 0.05),
      '--color-surface-2': hslToRgb(h, tint * 0.22, 0.085),
      '--color-surface-3': hslToRgb(h, tint * 0.2, 0.115),
      '--primary-400': hslToRgb(h, s, clamp(L + 0.08, 0, 0.88)),
      '--primary-500': hslToRgb(h, s, L),
      '--primary-600': hslToRgb(h, s, L - 0.07),
      '--primary-700': hslToRgb(h, s, L - 0.2),
      '--accent': hslToRgb(h, s * 0.8, clamp(L + 0.15, 0, 0.92)),
      '--sky': hslToRgb(hue2, s * 0.7, L),
    };
  } else {
    const L = neutral ? clamp(l, 0.15, 0.3) : clamp(l, 0.45, 0.66);
    t = {
      '--color-surface': hslToRgb(h, tint * 0.35, 0.955),
      '--color-surface-2': hslToRgb(h, tint * 0.5, 0.99),
      '--color-surface-3': hslToRgb(h, tint * 0.3, 0.915),
      '--primary-400': hslToRgb(h, s, neutral ? 0.2 : 0.25), // dark enough for small text on light surfaces
      '--primary-500': hslToRgb(h, s, L),
      '--primary-600': hslToRgb(h, s, L - 0.06),
      '--primary-700': hslToRgb(h, s, 0.3),
      '--accent': hslToRgb(h, s, 0.4),
      '--sky': hslToRgb(hue2, s * 0.7, 0.38),
    };
  }
  t['--on-primary'] = luminance(t['--primary-500']) > 0.4 ? [12, 14, 8] : [255, 255, 255];
  return t;
}

const modeNow = () => (document.documentElement.classList.contains('light') ? 'light' : 'dark');
let current = null; // the values currently painted, per variable
let tween = null;
let paintedMode = null; // dark/light mode the current values were built for

function paint(values) {
  const st = document.documentElement.style;
  for (const v of SURFACES) st.setProperty(v, `rgb(${values[v].map(Math.round).join(' ')})`);
  for (const v of TRIPLETS) st.setProperty(v, values[v].map(Math.round).join(' '));
}

function animateTo(target, duration, onComplete) {
  const from = current || DEFAULTS[modeNow()];
  paintedMode = modeNow();
  tween?.kill();
  if (duration <= 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    current = target;
    paint(target);
    onComplete?.();
    return;
  }
  const state = { p: 0 };
  tween = gsap.to(state, {
    p: 1,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      current = Object.fromEntries(ALL.map((v) => [v, from[v].map((a, i) => a + (target[v][i] - a) * state.p)]));
      paint(current);
    },
    onComplete,
  });
}

export const getPaletteColor = () => { try { return localStorage.getItem(KEY); } catch { return null; } };

/** Pick a colour: the whole site re-themes over `duration` seconds (default 2s). */
export function setPaletteColor(hex, duration = 2) {
  try { localStorage.setItem(KEY, hex); } catch { /* ignore */ }
  animateTo(buildTheme(hex, modeNow()), duration);
  window.dispatchEvent(new CustomEvent('palettechange', { detail: hex }));
}

/** Back to the default graphite + lime theme. */
export function resetPalette(duration = 2) {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  animateTo(DEFAULTS[modeNow()], duration, () => {
    ALL.forEach((v) => document.documentElement.style.removeProperty(v));
    current = null;
  });
  window.dispatchEvent(new CustomEvent('palettechange', { detail: null }));
}

/** Apply a saved colour on load and keep it in sync with the dark/light toggle. */
export function initPalette() {
  const saved = getPaletteColor();
  if (saved) animateTo(buildTheme(saved, modeNow()), 0);
  window.addEventListener('themechange', () => {
    const hex = getPaletteColor();
    if (!hex) { current = null; return; } // CSS defaults handle the plain dark/light switch
    if (modeNow() === paintedMode) return; // the toggle also fires once on load; nothing changed
    current = null; // start from the new mode's defaults
    animateTo(buildTheme(hex, modeNow()), 0.6);
  });
}
