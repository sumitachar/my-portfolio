const KEY = 'torch';

/** Torch can only run with a real mouse and when the visitor hasn't asked for reduced motion. */
export const torchSupported = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const getTorch = () => {
  try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; }
};

export function setTorch(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('torchchange', { detail: on }));
}
