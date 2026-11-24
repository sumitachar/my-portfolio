const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
const esc = (c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c);

/**
 * "Decrypt" text into place: each character cycles through code glyphs before
 * settling on its final letter. Respects prefers-reduced-motion (sets text instantly).
 * Returns a cancel function.
 */
export function scramble(el, to, { speed = 1 } = {}) {
  if (!el) return () => {};
  clearTimeout(el._scrambleTimer);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = to;
    return () => {};
  }
  const from = el.textContent || '';
  const len = Math.max(from.length, to.length);
  const queue = Array.from({ length: len }, (_, i) => {
    const start = Math.floor((Math.random() * 14 + i * 1.2) / speed);
    return { from: from[i] || '', to: to[i] || '', start, end: start + Math.floor((Math.random() * 14 + 10) / speed), ch: '' };
  });
  let frame = 0;
  const tick = () => {
    let out = '';
    let done = 0;
    for (const q of queue) {
      if (frame >= q.end) {
        done++;
        out += esc(q.to);
      } else if (frame >= q.start) {
        if (!q.ch || Math.random() < 0.3) q.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        out += `<span class="scramble-glyph">${esc(q.ch)}</span>`;
      } else {
        out += esc(q.from);
      }
    }
    el.innerHTML = out;
    if (done === queue.length) {
      el.textContent = to;
      return;
    }
    frame++;
    el._scrambleTimer = setTimeout(tick, 32); // timer, not rAF: never freezes in background tabs
  };
  tick();
  return () => clearTimeout(el._scrambleTimer);
}
