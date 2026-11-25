const KEY = 'torch';

/** Torch can only run with a real mouse and when the visitor hasn't asked for reduced motion. */
export const torchSupported = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 'intro' = first visit: lights off, prompt to turn the torch on
 * 'on'    = torch beam follows the cursor (cursor becomes a flashlight)
 * 'off'   = lights on, normal page
 */
export const getTorchMode = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : 'intro';
  } catch {
    return 'intro';
  }
};

export function setTorchMode(mode, origin) {
  try { localStorage.setItem(KEY, mode); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('torchchange', { detail: { mode, origin } }));
}
