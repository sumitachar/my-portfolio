import { gsap } from './gsap';

/** Redraw an SVG icon stroke by stroke (lucide icons are stroke-based). */
export function drawIcon(svg, { duration = 1.1, delay = 0 } = {}) {
  svg?.querySelectorAll('path, circle, rect, line, polyline, polygon').forEach((el) => {
    const len = el.getTotalLength?.() || 0;
    if (!len) return;
    gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration, delay, ease: 'power2.inOut', overwrite: true,
      onComplete: () => gsap.set(el, { clearProps: 'strokeDasharray,strokeDashoffset' }),
    });
  });
}
