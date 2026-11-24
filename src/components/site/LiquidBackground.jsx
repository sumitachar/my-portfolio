import { useEffect, useRef } from 'react';

/*
 * WebGL liquid-glass background (fixed, full page; softens below the hero).
 *
 * - Surface: an iridescent, crystal-like liquid made from domain-warped noise.
 * - Ripples: every cursor movement drops a ring that expands outward like water,
 *   then fades. The ripple height field gives a surface normal that refracts the
 *   liquid underneath, adds a specular glint on the crests and splits colour slightly
 *   at the edges (chromatic aberration), like light through glass.
 */

const DROPS = 32; // ripples alive at once

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uLight;
uniform float uDim;   // 0 at the top of the page → 1 below the hero (softer, for readable text)
uniform vec4 uDrops[${DROPS}]; // xy = position (0-1), z = birth time, w = strength

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

// height of all ripples at point p (aspect-corrected space)
float ripples(vec2 p, float aspect) {
  float h = 0.0;
  for (int i = 0; i < ${DROPS}; i++) {
    vec4 d = uDrops[i];
    if (d.w <= 0.0) continue;
    float age = uTime - d.z;
    if (age < 0.0 || age > 3.2) continue;
    float radius = age * 0.32;                       // ring expands outward
    float dist = length(p - vec2(d.x * aspect, d.y));
    float x = dist - radius;
    float packet = exp(-x * x * 160.0);               // width of the wave band
    float fade = exp(-age * 1.6) * d.w;
    h += sin(x * 34.0) * packet * fade;
  }
  return h;
}

// the iridescent liquid surface
vec3 surface(vec2 q, float t, float light) {
  vec2 w = vec2(fbm(q + t * 0.035), fbm(q + vec2(5.2, 1.3) - t * 0.03));
  float n = fbm(q + 2.4 * w + t * 0.02);
  float ridge = pow(1.0 - abs(fbm(q * 2.2 + w * 3.0)), 7.0);
  vec3 iri = 0.5 + 0.5 * cos(6.2831 * (n * 1.5 + w.x * 0.7 + vec3(0.6, 0.72, 0.86)));

  vec3 col;
  if (light > 0.5) {
    vec3 base = mix(vec3(0.58, 0.54, 0.97), vec3(0.45, 0.64, 1.0), clamp(q.x * 0.35 + n * 0.6, 0.0, 1.0));
    col = mix(base, iri * vec3(1.0, 0.6, 1.05), 0.4);
    col += ridge * vec3(1.0, 0.95, 1.0) * 0.45;
  } else {
    vec3 base = mix(vec3(0.03, 0.03, 0.08), vec3(0.13, 0.08, 0.3), clamp(n + 0.45, 0.0, 1.0));
    col = base + iri * vec3(0.38, 0.26, 0.8) * (0.3 + n);
    col += ridge * vec3(0.6, 0.55, 1.0) * 0.5;
  }
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // ripple normal from the height field
  float e = 1.5 / uRes.y;
  float h = ripples(p, aspect);
  float hx = ripples(p + vec2(e, 0.0), aspect) - h;
  float hy = ripples(p + vec2(0.0, e), aspect) - h;
  vec3 normal = normalize(vec3(-hx, -hy, e * 2.2));
  vec2 refr = normal.xy * 0.022;

  // refraction
  vec2 q = p * 1.5;
  float t = uTime;
  vec3 col = surface(q + refr, t, uLight);
  // cheap chromatic split: tint along the ripple slope
  col += vec3(refr.x, refr.y * 0.3, -refr.x) * 1.6;

  // specular glint on the ripple crests
  vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));
  float spec = pow(max(dot(normal, lightDir), 0.0), 60.0);
  col += spec * (uLight > 0.5 ? 0.55 : 0.4) * vec3(1.0, 0.97, 1.0);
  col += abs(h) * (uLight > 0.5 ? 0.05 : 0.04);

  // soft bright core (like light behind glass)
  float core = exp(-length(p - vec2(aspect * 0.62, 0.68)) * 3.2);
  col += core * (uLight > 0.5 ? vec3(0.35, 0.3, 0.4) : vec3(0.12, 0.08, 0.25));

  col = clamp(col, 0.0, 1.0);
  // below the hero, soften toward the page colour so content stays readable
  vec3 page = uLight > 0.5 ? vec3(0.96, 0.96, 0.985) : vec3(0.039, 0.039, 0.071);
  col = mix(col, page, uDim * (uLight > 0.5 ? 0.45 : 0.5));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return; // CSS gradient fallback shows instead

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uLight = gl.getUniformLocation(prog, 'uLight');
    const uDrops = gl.getUniformLocation(prog, 'uDrops');
    const uDim = gl.getUniformLocation(prog, 'uDim');

    const drops = new Float32Array(DROPS * 4);
    let head = 0;
    let last = null;
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(window.innerWidth * dpr * 0.7));
      canvas.height = Math.max(1, Math.round(window.innerHeight * dpr * 0.7));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // drop a ripple every ~5% of the screen the cursor travels; faster moves make stronger rings
    const addDrop = (clientX, clientY) => {
      const x = clientX / window.innerWidth;
      const y = 1 - clientY / window.innerHeight;
      const t = now();
      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y);
        if (dist < 0.07 && t - last.t < 0.3) return;
        const speed = Math.min(1.0, 0.45 + dist / Math.max(t - last.t, 0.016) * 0.08);
        drops.set([x, y, t, speed], head * 4);
      } else {
        drops.set([x, y, t, 0.8], head * 4);
      }
      head = (head + 1) % DROPS;
      last = { x, y, t };
    };
    const onMove = (e) => addDrop(e.clientX, e.clientY);
    const onTouch = (e) => e.touches[0] && addDrop(e.touches[0].clientX, e.touches[0].clientY);
    const onDown = (e) => { last = null; addDrop(e.clientX, e.clientY); drops[((head - 1 + DROPS) % DROPS) * 4 + 3] = 1.6; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    // full-page background: soften a little once you scroll past the hero
    let dim = 0;
    const onScroll = () => { dim = Math.min(1, window.scrollY / (window.innerHeight * 0.8)); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const draw = (t) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uLight, document.documentElement.classList.contains('light') ? 1 : 0);
      gl.uniform4fv(uDrops, drops);
      gl.uniform1f(uDim, dim);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const cleanup = () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('scroll', onScroll);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(8);
      window.addEventListener('scroll', () => draw(8), { passive: true });
      const mo = new MutationObserver(() => draw(8));
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => { mo.disconnect(); cleanup(); };
    }

    let frame;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return;
      draw(now());
    };
    render();
    return () => { cancelAnimationFrame(frame); cleanup(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-screen w-full pointer-events-none bg-gradient-to-br from-primary-500/30 via-accent/20 to-sky-400/20"
    />
  );
}
