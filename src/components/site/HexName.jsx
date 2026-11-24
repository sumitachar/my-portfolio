import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { hslToRgb, rgbToHex, setPaletteColor, resetPalette, getPaletteColor } from '../../lib/palette';

const SQRT3 = Math.sqrt(3);

/** Pointy-top hexagon outline around (cx, cy). */
const hexPoints = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = ((60 * k - 30) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

/**
 * Rasterise the text on a hidden canvas, then keep every honeycomb cell whose centre
 * lands inside a letter. Each kept cell gets a colour from a full spectrum: hue runs
 * left → right across the word, lightness top → bottom.
 */
function buildCells(text, width) {
  const s = width < 640 ? Math.max(width / 62, 4.5) : width / 118; // hexagon radius
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  ctx.font = '700 100px Geist, system-ui, sans-serif';
  const probe = ctx.measureText(text);
  const fontSize = (100 * width * 0.98) / probe.width;
  ctx.font = `700 ${fontSize}px Geist, system-ui, sans-serif`;
  const m = ctx.measureText(text);
  const ascent = m.actualBoundingBoxAscent;
  const descent = m.actualBoundingBoxDescent;
  const height = Math.ceil(ascent + descent + s * 2);

  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.font = `700 ${fontSize}px Geist, system-ui, sans-serif`;
  ctx.fillStyle = '#000';
  ctx.fillText(text, (width - m.width) / 2, s + ascent);
  const data = ctx.getImageData(0, 0, width, height).data;
  const inside = (x, y) => {
    const xi = Math.round(x), yi = Math.round(y);
    if (xi < 0 || yi < 0 || xi >= width || yi >= height) return false;
    return data[(yi * width + xi) * 4 + 3] > 110;
  };

  const w = s * SQRT3;
  const cells = [];
  for (let row = 0, y = s; y < height; row++, y += s * 1.5) {
    for (let x = w / 2 + (row % 2 ? w / 2 : 0); x < width; x += w) {
      if (!inside(x, y)) continue;
      const hue = (x / width) * 330;
      const light = 0.74 - 0.34 * (y / height);
      cells.push({ x, y, hex: rgbToHex(hslToRgb(hue, 0.92, light)) });
    }
  }
  return { cells, s, width, height };
}

/** The footer name, drawn in coloured hexagons. Click one to theme the whole site. */
export default function HexName({ text }) {
  const wrap = useRef(null);
  const svg = useRef(null);
  const [width, setWidth] = useState(0);
  const [fontReady, setFontReady] = useState(false);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(getPaletteColor);

  useEffect(() => {
    let alive = true;
    const done = () => alive && setFontReady(true);
    (document.fonts?.load('700 100px Geist') ?? Promise.resolve()).then(done, done);
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(wrap.current);
    const sync = (e) => setSelected(e.detail);
    window.addEventListener('palettechange', sync);
    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener('palettechange', sync);
    };
  }, []);

  const grid = useMemo(() => (width && fontReady ? buildCells(text, width) : null), [text, width, fontReady]);

  // hexagons pop in from random positions the first time the footer scrolls into view
  useGSAP(() => {
    if (!grid || prefersReducedMotion()) return;
    gsap.from(svg.current.querySelectorAll('[data-i]'), {
      scale: 0,
      opacity: 0,
      transformOrigin: '50% 50%',
      duration: 0.6,
      ease: 'back.out(2)',
      stagger: { amount: 1.2, from: 'random' },
      scrollTrigger: { trigger: svg.current, start: 'top 90%', once: true },
    });
  }, { dependencies: [grid], scope: wrap });

  // nearest hexagon to the pointer (so the small gaps between hexagons still count)
  const cellAt = (e) => {
    const r = svg.current.getBoundingClientRect();
    const k = grid.width / r.width;
    const x = (e.clientX - r.left) * k;
    const y = (e.clientY - r.top) * k;
    let best = null;
    let bestD = (grid.s * 1.1) ** 2;
    grid.cells.forEach((c, i) => {
      const d = (c.x - x) ** 2 + (c.y - y) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  };

  const pick = (i) => {
    const cell = grid.cells[i];
    setSelected(cell.hex);
    setPaletteColor(cell.hex, 2);
    if (prefersReducedMotion()) return;
    // ripple outward from the clicked hexagon
    svg.current.querySelectorAll('[data-i]').forEach((el) => {
      const c = grid.cells[el.dataset.i];
      const dist = Math.hypot(c.x - cell.x, c.y - cell.y);
      gsap.fromTo(el, { scale: 1 }, {
        scale: 0.35, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.in',
        transformOrigin: '50% 50%', delay: (dist / grid.width) * 0.9, overwrite: true,
      });
    });
  };

  const hovered = grid && hover != null ? grid.cells[hover] : null;
  const chosen = grid && selected ? grid.cells.find((c) => c.hex === selected) : null;
  const shown = hovered?.hex || selected;

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={wrap} className="w-full">
        {grid && (
          <svg
            ref={svg}
            viewBox={`0 0 ${grid.width} ${grid.height}`}
            width="100%"
            className={`block select-none ${hover != null ? 'cursor-pointer' : ''}`}
            role="img"
            aria-label={`${text}, drawn in coloured hexagons. Click a hexagon to set the site colour.`}
            onMouseMove={(e) => setHover(cellAt(e))}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => { const i = cellAt(e); if (i != null) pick(i); }}
          >
            {grid.cells.map((c, i) => (
              <polygon key={i} data-i={i} points={hexPoints(c.x, c.y, grid.s * 0.9)} fill={c.hex} />
            ))}
            {/* hover: lift the hexagon above its neighbours */}
            {hovered && (
              <polygon
                points={hexPoints(hovered.x, hovered.y, grid.s * 1.6)}
                fill={hovered.hex}
                stroke="var(--color-surface)"
                strokeWidth={grid.s * 0.25}
                pointerEvents="none"
              />
            )}
            {chosen && <circle cx={chosen.x} cy={chosen.y} r={grid.s * 0.32} fill="#fff" stroke="#000" strokeOpacity="0.4" pointerEvents="none" />}
          </svg>
        )}
        {!grid && <div className="h-[18vw]" />}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
        <span className="uppercase tracking-[0.25em] text-white/40">Click any colour in my name · the site follows</span>
        <span className="w-5 h-5 rounded-md border border-[var(--line-strong)]" style={{ background: shown || 'rgb(var(--primary-500))' }} />
        <span className="w-[68px] uppercase tracking-[0.1em] text-white/70">{shown || 'default'}</span>
        <label className="relative inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-white/60 hover:text-white hover:border-[var(--line-strong)] cursor-pointer transition-colors focus-within:border-primary-500">
          Custom
          <input
            type="color"
            aria-label="Choose any site colour"
            value={selected || '#c5e86c'}
            onChange={(e) => { setSelected(e.target.value); setPaletteColor(e.target.value, 2); }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        <button
          type="button"
          onClick={() => resetPalette(2)}
          disabled={!selected}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-white/60 hover:text-white hover:border-[var(--line-strong)] disabled:opacity-35 disabled:pointer-events-none transition-colors"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>
    </div>
  );
}
