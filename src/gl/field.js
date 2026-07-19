/*
 * Hero effects engine — a single WebGL2 scene, no dependencies.
 *
 * Three-pass pipeline per frame, all scoped to the hero canvas:
 *   1. "paint": pointer velocity is splatted into a low-res ping-pong
 *      buffer that decays each frame (Lusion's ScreenPaint idea) —
 *      values are packed around 0.5 so a plain RGBA8 target suffices.
 *   2. "scene": a CPU-simulated particle constellation (points + the
 *      lines joining near neighbours) rendered into an offscreen target.
 *   3. "composite": the scene is drawn to the canvas, UV-warped by the
 *      paint gradient, with a faint accent glow where paint is fresh.
 *
 * Perf contract (mirrors lusion.co's evidenced strategy): devicePixelRatio
 * clamped to 1.5, total pixel budget capped, paint buffer at quarter
 * resolution, rAF stopped entirely by the owner when the hero is
 * offscreen. The owner also decides when NOT to run this at all
 * (reduced motion, no WebGL2) — this module never touches those APIs.
 */

const POINTER_SPLAT_RADIUS = 0.11;
const PAINT_DISSIPATION = 0.965;
const DISTORT_STRENGTH = 0.055;
const MAX_DPR = 1.5;
const MAX_PIXELS = 2560 * 1440;
const LINK_DIST = 0.16; // in aspect-corrected UV space
const MAX_LINKS = 480;

// Certification monogram ball-physics (Tier 4) — hand-rolled like Lusion's
// balloons. Three certification wordmarks display together in a vertical
// stack — AWS / SFCC / GenAI — each in its brand color ("GenAI" is split:
// grey Gen + electric-blue AI). Phones stay clean.
const MONO_ROWS = [
  { parts: [{ text: 'AWS', color: [1.0, 0.6, 0.0] }] }, // #ff9900
  { parts: [{ text: 'SFCC', color: [0.0, 0.631, 0.878] }] }, // #00a1e0
  {
    parts: [
      { text: 'Gen', color: [0.294, 0.333, 0.388] }, // #4b5563 dark grey
      { text: 'AI', color: [0.161, 0.475, 1.0] }, // #2979ff electric blue
    ],
  },
];
const MONO_MIN_WIDTH = 640; // CSS px; below this the monogram is skipped
const MONO_MAX_BALLS = 720;
const MONO_MIN_FONT = 24; // px; below this the letters are mush — skip
const MONO_FADE_FRAMES = 120; // reveal fades back to watercolor over ~2s
const MONO_WASH = 0.63; // how far the resting color washes toward the paper
const MONO_SPRING = 0.05;
const MONO_DAMPING = 0.9;
const MOUSE_RADIUS_PX = 110;

/* Critically-damped-ish second-order smoothing (t3ssel8r / Lusion style):
 * the pointer the shaders see trails the real one with physical weight. */
class SecondOrder {
  constructor(f = 1.6, zeta = 0.7, r = 1.4) {
    const pi2f = 2 * Math.PI * f;
    this.k1 = zeta / (Math.PI * f);
    this.k2 = 1 / (pi2f * pi2f);
    this.k3 = (r * zeta) / pi2f;
    this.x = { x: 0, y: 0 };
    this.xd = { x: 0, y: 0 };
    this.y = { x: 0, y: 0 };
    this.yd = { x: 0, y: 0 };
  }
  reset(x, y) {
    this.x = { x, y };
    this.y = { x, y };
    this.xd = { x: 0, y: 0 };
    this.yd = { x: 0, y: 0 };
  }
  update(dt, tx, ty) {
    const xd = { x: (tx - this.x.x) / dt, y: (ty - this.x.y) / dt };
    this.x = { x: tx, y: ty };
    const k2 = Math.max(this.k2, (dt * dt) / 2 + (dt * this.k1) / 2, dt * this.k1);
    this.y.x += dt * this.yd.x;
    this.y.y += dt * this.yd.y;
    this.yd.x += (dt * (this.x.x + this.k3 * xd.x - this.y.x - this.k1 * this.yd.x)) / k2;
    this.yd.y += (dt * (this.x.y + this.k3 * xd.y - this.y.y - this.k1 * this.yd.y)) / k2;
    this.xd = xd;
    return this.y;
  }
}

const QUAD_VS = `#version 300 es
layout(location=0) in vec2 p;
out vec2 v_uv;
void main(){ v_uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const PAINT_FS = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 o;
uniform sampler2D u_prev;
uniform vec2 u_pointer;    // uv
uniform vec2 u_vel;        // uv/frame, pre-scaled
uniform float u_aspect;
uniform float u_radius;
uniform float u_dissipation;
void main(){
  vec4 prev = texture(u_prev, v_uv);
  vec2 packed = (prev.rg - 0.5) * u_dissipation;
  float energy = prev.b * u_dissipation;
  vec2 d = v_uv - u_pointer; d.x *= u_aspect;
  float splat = exp(-dot(d, d) / (u_radius * u_radius));
  packed += u_vel * splat;
  energy += length(u_vel) * splat * 4.0;
  o = vec4(clamp(packed + 0.5, 0.0, 1.0), clamp(energy, 0.0, 1.0), 1.0);
}`;

const POINT_VS = `#version 300 es
layout(location=0) in vec2 a_pos;   // clip space
layout(location=1) in vec2 a_data;  // x: size px, y: mix(0=muted,1=accent)
uniform float u_dpr;
out float v_mix;
void main(){
  v_mix = a_data.y;
  gl_PointSize = a_data.x * u_dpr;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const POINT_FS = `#version 300 es
precision highp float;
in float v_mix; out vec4 o;
uniform vec3 u_colA; uniform vec3 u_colB; uniform float u_alpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float disc = smoothstep(0.5, 0.32, d);
  if (disc <= 0.0) discard;
  vec3 col = mix(u_colB, u_colA, v_mix);
  float a = disc * u_alpha * (0.55 + 0.45 * v_mix);
  o = vec4(col * a, a); // premultiplied
}`;

const LINE_VS = `#version 300 es
layout(location=0) in vec2 a_pos;
layout(location=1) in float a_fade;
out float v_fade;
void main(){ v_fade = a_fade; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const LINE_FS = `#version 300 es
precision highp float;
in float v_fade; out vec4 o;
uniform vec3 u_colB; uniform float u_alpha;
void main(){ float a = v_fade * u_alpha; o = vec4(u_colB * a, a); }`; // premultiplied

const BALL_VS = `#version 300 es
layout(location=0) in vec2 a_corner;       // unit quad [-1,1]
layout(location=1) in vec3 a_inst;         // center.xy (css px), radius (css px)
layout(location=2) in vec3 a_color;        // per-ball current color
layout(location=3) in float a_alpha;       // watercolor translucency
uniform vec2 u_size;                       // css px
out vec2 v_p;
out vec3 v_color;
out float v_alpha;
void main(){
  v_p = a_corner;
  v_color = a_color;
  v_alpha = a_alpha;
  vec2 px = a_inst.xy + a_corner * a_inst.z;
  vec2 clip = vec2(px.x / u_size.x * 2.0 - 1.0, 1.0 - px.y / u_size.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}`;

const BALL_FS = `#version 300 es
precision highp float;
in vec2 v_p; in vec3 v_color; in float v_alpha; out vec4 o;
void main(){
  float r2 = dot(v_p, v_p);
  float edge = fwidth(r2) * 1.5;
  float disc = 1.0 - smoothstep(1.0 - edge, 1.0, r2);
  if (disc <= 0.0) discard;
  // Fake sphere ("matcap on a budget"): normal from disc, fixed key light
  vec3 n = vec3(v_p, sqrt(max(0.0, 1.0 - r2)));
  vec3 l = normalize(vec3(-0.35, 0.55, 0.75));
  float diff = max(0.0, dot(n, l));
  float spec = pow(max(0.0, dot(n, normalize(l + vec3(0.0, 0.0, 1.0)))), 42.0);
  float rim = pow(1.0 - n.z, 2.2) * 0.35;
  vec3 col = v_color * (0.42 + 0.62 * diff) + vec3(spec * 0.5 * v_alpha) + v_color * rim;
  float a = disc * v_alpha;
  o = vec4(col * a, a); // premultiplied
}`;

const COMPOSITE_FS = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 o;
uniform sampler2D u_scene;
uniform sampler2D u_paint;
uniform vec3 u_colA;
uniform float u_distort;
void main(){
  vec4 paint = texture(u_paint, v_uv);
  vec2 offset = (paint.rg - 0.5) * u_distort;
  vec4 scene = texture(u_scene, v_uv - offset); // already premultiplied
  float glow = paint.b * paint.b * 0.22;
  o = vec4(scene.rgb + u_colA * glow, min(scene.a + glow, 1.0));
}`;

function compile(gl, vsSrc, fsSrc) {
  const mk = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
    }
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vsSrc));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) || 'program link failed');
  }
  return p;
}

function deleteTarget(gl, t) {
  if (!t) return;
  gl.deleteTexture(t.tex);
  gl.deleteFramebuffer(t.fbo);
}

function makeTarget(gl, w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fbo, w, h };
}

function hexToRgb(hex) {
  const h = hex.replace('#', '').trim();
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

/* Measure a row's rendered width at a given font size. */
function rowWidth(ctx, parts, fontPx) {
  // Weight 650 keeps the counters (the hole of an e) open enough to
  // survive dot-sampling; tracking separates neighbouring glyphs
  ctx.font = `650 ${fontPx}px "Sora Variable", Sora, Inter, sans-serif`;
  ctx.letterSpacing = `${Math.round(fontPx * 0.07)}px`;
  return parts.reduce((w, p) => w + ctx.measureText(p.text).width, 0);
}

/* Rasterize one row (possibly multi-colored parts) centered in a
 * sub-region and grid-sample filled cells into {x, y, color} targets
 * (css px, canvas-relative). Step adapts to keep the count bounded. */
function sampleRow(sub, parts, fontPx, cap) {
  const c = document.createElement('canvas');
  c.width = Math.max(2, Math.round(sub.w));
  c.height = Math.max(2, Math.round(sub.h));
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  ctx.font = `650 ${fontPx}px "Sora Variable", Sora, Inter, sans-serif`;
  ctx.letterSpacing = `${Math.round(fontPx * 0.07)}px`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  // Draw parts left-to-right, centered as a whole; remember each part's
  // x-extent so every sampled dot inherits its part's brand color
  const widths = parts.map((p) => ctx.measureText(p.text).width);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = (c.width - total) / 2;
  const bounds = [];
  for (let i = 0; i < parts.length; i++) {
    ctx.textAlign = 'left';
    ctx.fillText(parts[i].text, x, c.height / 2);
    bounds.push({ until: x + widths[i], color: parts[i].color });
    x += widths[i];
  }
  const img = ctx.getImageData(0, 0, c.width, c.height).data;
  // Coverage sampling per cell: a 3x3 sub-grid must show enough ink for a
  // dot. Single-point sampling loses thin features (the crossbar of a
  // lowercase e reads as o); any-hit sampling inflates stroke edges and
  // closes the counters. Requiring ~1/3 coverage catches crossbars at any
  // grid phase while keeping strokes their true width.
  const inked = (x, y) => {
    const cx = Math.min(c.width - 1, Math.max(0, x | 0));
    const cy = Math.min(c.height - 1, Math.max(0, y | 0));
    return img[(cy * c.width + cx) * 4 + 3] > 100 ? 1 : 0;
  };
  let step = Math.max(4, Math.round(fontPx / 14));
  for (let attempt = 0; attempt < 4; attempt++) {
    const d = step * 0.32;
    const targets = [];
    for (let y = step / 2; y < c.height; y += step) {
      for (let px = step / 2; px < c.width; px += step) {
        let cover = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            cover += inked(px + ox * d, y + oy * d);
          }
        }
        if (cover >= 3) {
          const part = bounds.find((b) => px <= b.until) ?? bounds[bounds.length - 1];
          targets.push({ x: sub.x + px, y: sub.y + y, color: part.color });
        }
      }
    }
    if (targets.length <= cap) return targets;
    step = Math.round(step * 1.3);
  }
  return [];
}

export function createField(canvas, { particleCount = 220, onContextLost } = {}) {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl || gl.isContextLost()) return null;

  // GPU reset / driver eviction: stop cleanly and tell the owner so the CSS
  // fallback can take over — a dead canvas must not stay in charge
  const handleContextLost = (e) => {
    e.preventDefault();
    onContextLost?.();
  };
  canvas.addEventListener('webglcontextlost', handleContextLost);

  const progs = {
    paint: compile(gl, QUAD_VS, PAINT_FS),
    point: compile(gl, POINT_VS, POINT_FS),
    line: compile(gl, LINE_VS, LINE_FS),
    ball: compile(gl, BALL_VS, BALL_FS),
    composite: compile(gl, QUAD_VS, COMPOSITE_FS),
  };
  const uniCache = new Map();
  const uni = (p, n) => {
    let m = uniCache.get(p);
    if (!m) uniCache.set(p, (m = new Map()));
    let loc = m.get(n);
    if (loc === undefined) m.set(n, (loc = gl.getUniformLocation(p, n)));
    return loc;
  };

  // Fullscreen triangle
  const quadVao = gl.createVertexArray();
  gl.bindVertexArray(quadVao);
  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // Particle state (CPU sim — at ~220 particles this is cheaper to run and
  // far cheaper to ship than a GPGPU ping-pong would be)
  const P = particleCount;
  const pos = new Float32Array(P * 2); // clip space
  const vel = new Float32Array(P * 2);
  const meta = new Float32Array(P * 2); // size px, accent mix
  const seed = new Float32Array(P * 2);
  for (let i = 0; i < P; i++) {
    pos[i * 2] = Math.random() * 2 - 1;
    pos[i * 2 + 1] = Math.random() * 2 - 1;
    const accent = Math.random() < 0.28 ? 1 : Math.random() * 0.25;
    meta[i * 2] = 1.5 + Math.random() * 2.6 + accent * 1.4;
    meta[i * 2 + 1] = accent;
    seed[i * 2] = Math.random() * 1000;
    seed[i * 2 + 1] = Math.random() * 1000;
  }

  const pointVao = gl.createVertexArray();
  gl.bindVertexArray(pointVao);
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const metaBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, metaBuf);
  gl.bufferData(gl.ARRAY_BUFFER, meta, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

  // Line segments rebuilt per frame: [x, y, fade] per vertex
  const lineData = new Float32Array(MAX_LINKS * 2 * 3);
  const lineVao = gl.createVertexArray();
  gl.bindVertexArray(lineVao);
  const lineBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
  gl.bufferData(gl.ARRAY_BUFFER, lineData.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 12, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 12, 8);
  gl.bindVertexArray(null);

  // Monogram balls: unit quad instanced with [cx, cy, radius, shade]
  const ballVao = gl.createVertexArray();
  gl.bindVertexArray(ballVao);
  const ballQuadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, ballQuadBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const ballInstBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, ballInstBuf);
  gl.bufferData(gl.ARRAY_BUFFER, MONO_MAX_BALLS * 7 * 4, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 28, 0);
  gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 28, 12);
  gl.vertexAttribDivisor(2, 1);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 28, 24);
  gl.vertexAttribDivisor(3, 1);
  gl.bindVertexArray(null);

  /* Ball sim state (css px space). Populated by rebuildMonogram(). */
  let balls = null;
  const ballInstData = new Float32Array(MONO_MAX_BALLS * 7);

  /* The headline's measured rect (css px, canvas-relative), fed by the
   * owner. The monogram lives in whatever space remains to its right and
   * vertically centers on the text band — DOM drives the scene. */
  let textBounds = null;

  function setTextBounds(b) {
    if (
      !textBounds ||
      Math.abs(b.right - textBounds.right) > 24 ||
      Math.abs(b.top - textBounds.top) > 24 ||
      Math.abs((b.badgeRight || 0) - (textBounds.badgeRight || 0)) > 24 ||
      Math.abs(b.cy - textBounds.cy) > 24
    ) {
      textBounds = b;
      monoW = -1; // force a monogram rebuild on the next resize()
    }
  }

  function rebuildMonogram(cssW, cssH) {
    // Never build from a guess: without measured text bounds the region
    // could be wrong, and a later correction would retarget balls
    // mid-assembly — the swerve reads as jank
    if (cssW < MONO_MIN_WIDTH || !textBounds) {
      balls = null;
      return;
    }
    // Preferred: the space right of the measured headline. Fallback for
    // narrow screens: the band above the headline (right of the badge) —
    // the stack relocates rather than disappearing.
    let region = null;
    const sideX0 = Math.max(cssW * 0.55, textBounds.right + 40);
    const sideAvail = cssW * 0.96 - sideX0;
    if (sideAvail >= 230) {
      const w = Math.min(sideAvail, 640);
      const h = Math.min(cssH * 0.5, 430, w * 1.05);
      region = {
        x: sideX0 + (sideAvail - w) / 2,
        // Center the stack on the hero's content band, not the headline
        // alone — it reads as a full-height companion column
        y: Math.min(Math.max(cssH * 0.46 - h / 2, 90), Math.max(cssH * 0.94 - h, 90)),
        w,
        h,
      };
    } else {
      const bandTop = 74; // clear the fixed nav (64px) plus breathing room
      const bandH = textBounds.top - 14 - bandTop;
      if (bandH < 80) {
        balls = null;
        return;
      }
      const x0 = Math.max(cssW * 0.35, (textBounds.badgeRight || 0) + 28);
      const w = cssW * 0.96 - x0;
      if (w < 200) {
        balls = null;
        return;
      }
      region = { x: x0, y: bandTop, w, h: Math.min(bandH, 170) };
    }

    // Always a vertical 3-stack: AWS on top, SFCC, then GenAI. The GenAI
    // row gets a larger height share — lowercase letterforms need more
    // dot-resolution than caps to stay readable — and each row fits its
    // own font to its band
    const gapV = region.h * 0.06;
    const usable = region.h - 2 * gapV;
    const weights = [0.3, 0.3, 0.4];
    const subs = [];
    const fonts = [];
    let yCursor = region.y;
    for (let i = 0; i < MONO_ROWS.length; i++) {
      const h = usable * weights[i];
      let f = Math.floor(h * 0.92);
      const wpx = rowWidth(measureCtx, MONO_ROWS[i].parts, f);
      if (wpx > region.w * 0.94) f = Math.floor((f * region.w * 0.94) / wpx);
      subs.push({ x: region.x, y: yCursor, w: region.w, h });
      fonts.push(f);
      yCursor += h + gapV;
    }
    if (Math.min(...fonts) < MONO_MIN_FONT) {
      balls = null;
      return;
    }
    const targets = MONO_ROWS.flatMap((row, i) =>
      sampleRow(subs[i], row.parts, fonts[i], Math.floor(MONO_MAX_BALLS / 3)).map((t) => ({
        ...t,
        font: fonts[i],
      }))
    );
    if (targets.length < 30) {
      balls = null;
      return;
    }
    const prev = balls;
    const n = Math.min(targets.length, MONO_MAX_BALLS);
    balls = {
      n,
      x: new Float32Array(n),
      y: new Float32Array(n),
      vx: new Float32Array(n),
      vy: new Float32Array(n),
      tx: new Float32Array(n),
      ty: new Float32Array(n),
      r: new Float32Array(n),
      cr: new Float32Array(n),
      cg: new Float32Array(n),
      cb: new Float32Array(n),
      e: new Float32Array(n), // reveal energy: 1 = brand color, 0 = watercolor
    };
    // Small balls keep the letterforms readable (dot-matrix look); slight
    // per-ball luminance jitter keeps the dots organic
    for (let i = 0; i < n; i++) {
      const t = targets[i];
      balls.tx[i] = t.x;
      balls.ty[i] = t.y;
      const lum = 0.88 + Math.random() * 0.24;
      balls.cr[i] = Math.min(1, t.color[0] * lum);
      balls.cg[i] = Math.min(1, t.color[1] * lum);
      balls.cb[i] = Math.min(1, t.color[2] * lum);
      const sizeScale = Math.max(0.6, Math.min(1, (t.font || 90) / 90));
      balls.r[i] = (1.8 + Math.random() * 0.6) * sizeScale;
      if (prev && i < prev.n) {
        // Resize: carry positions over so the letters re-flow, not re-drop
        balls.x[i] = prev.x[i];
        balls.y[i] = prev.y[i];
        balls.vx[i] = prev.vx[i];
        balls.vy[i] = prev.vy[i];
        balls.e[i] = prev.e[i];
      } else {
        // First build (or extra balls): scatter above so letters assemble
        balls.x[i] = region.x + Math.random() * region.w;
        balls.y[i] = -cssH * (0.1 + Math.random() * 0.5);
      }
    }
  }

  let sceneRT = null;
  let paintA = null;
  let paintB = null;
  let width = 0;
  let height = 0;
  let aspect = 1;
  let cssW = 0;
  let cssH = 0;
  const measureCtx = document.createElement('canvas').getContext('2d');

  const pointerSmooth = new SecondOrder();
  const pointer = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, active: false };
  let colA = [0.64, 0.9, 0.21];
  let colB = [0.53, 0.55, 0.6];
  let paperCol = [0.93, 0.95, 0.96];
  let alpha = 1;
  let raf = 0;
  let last = 0;
  let destroyed = false;

  let monoW = -1;
  let monoH = -1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // Rebuild the monogram only on meaningful size changes (or when the
    // width crosses the enable gate) — a rasterize + getImageData per 1px
    // drag tick would be pure waste
    const crossedGate = rect.width >= MONO_MIN_WIDTH !== monoW >= MONO_MIN_WIDTH;
    if (monoW < 0 || crossedGate || Math.abs(rect.width - monoW) > 48 || Math.abs(rect.height - monoH) > 48) {
      rebuildMonogram(rect.width, rect.height);
      monoW = rect.width;
      monoH = rect.height;
    }
    cssW = rect.width;
    cssH = rect.height;
    let dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    if (rect.width * rect.height * dpr * dpr > MAX_PIXELS) {
      dpr = Math.sqrt(MAX_PIXELS / (rect.width * rect.height));
    }
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (w === width && h === height) return;
    width = w;
    height = h;
    aspect = w / h;
    canvas.width = w;
    canvas.height = h;
    deleteTarget(gl, sceneRT);
    deleteTarget(gl, paintA);
    deleteTarget(gl, paintB);
    sceneRT = makeTarget(gl, w, h);
    paintA = makeTarget(gl, Math.max(1, w >> 2), Math.max(1, h >> 2));
    paintB = makeTarget(gl, Math.max(1, w >> 2), Math.max(1, h >> 2));
    // Neutral paint = 0.5 (no displacement)
    for (const t of [paintA, paintB]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.clearColor(0.5, 0.5, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function step(dt, t) {
    const sm = pointer.active
      ? pointerSmooth.update(dt, pointer.x, pointer.y)
      : pointerSmooth.y;
    for (let i = 0; i < P; i++) {
      const ix = i * 2;
      // Lazy drift: two incommensurate sine fields approximate curl noise
      const sx = seed[ix];
      const sy = seed[ix + 1];
      let ax = Math.sin(t * 0.00014 + sy + pos[ix + 1] * 1.7) * 0.000014;
      let ay = Math.cos(t * 0.00011 + sx + pos[ix] * 1.4) * 0.000014;
      if (pointer.active) {
        // Repulsion from the smoothed pointer (clip space, aspect-corrected)
        const cx = sm.x * 2 - 1;
        const cy = 1 - sm.y * 2;
        let dx = (pos[ix] - cx) * aspect;
        const dy = pos[ix + 1] - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 0.14) {
          const f = (0.14 - d2) * 0.0022;
          const inv = 1 / Math.sqrt(d2 + 1e-5);
          ax += dx * inv * f;
          ay += dy * inv * f;
        }
      }
      vel[ix] = (vel[ix] + ax * dt) * 0.986;
      vel[ix + 1] = (vel[ix + 1] + ay * dt) * 0.986;
      pos[ix] += vel[ix] * dt;
      pos[ix + 1] += vel[ix + 1] * dt;
      if (pos[ix] > 1.05) pos[ix] = -1.05;
      else if (pos[ix] < -1.05) pos[ix] = 1.05;
      if (pos[ix + 1] > 1.05) pos[ix + 1] = -1.05;
      else if (pos[ix + 1] < -1.05) pos[ix + 1] = 1.05;
    }

    // Monogram ball physics: spring to glyph target, pointer repulsion,
    // pairwise separation — the Lusion balloons recipe, hand-rolled
    if (balls) {
      const { n, x, y, vx, vy, tx, ty, r, e } = balls;
      const mpx = pointer.x * cssW;
      const mpy = pointer.y * cssH;
      const mr2 = MOUSE_RADIUS_PX * MOUSE_RADIUS_PX;
      for (let i = 0; i < n; i++) {
        // Reveal energy drains back to the watercolor state over ~2s
        e[i] = Math.max(0, e[i] - dt / MONO_FADE_FRAMES);
        let ax = (tx[i] - x[i]) * MONO_SPRING;
        let ay = (ty[i] - y[i]) * MONO_SPRING;
        if (pointer.active) {
          const dx = x[i] - mpx;
          const dy = y[i] - mpy;
          const d2 = dx * dx + dy * dy;
          if (d2 < mr2) {
            e[i] = 1; // touched: the true certification color reveals
            const d = Math.sqrt(d2 + 1e-4);
            const f = ((MOUSE_RADIUS_PX - d) / MOUSE_RADIUS_PX) * 3.2;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        vx[i] = (vx[i] + ax * dt) * MONO_DAMPING;
        vy[i] = (vy[i] + ay * dt) * MONO_DAMPING;
      }
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = x[j] - x[i];
          const dy = y[j] - y[i];
          const minD = r[i] + r[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < minD * minD) {
            const d = Math.sqrt(d2);
            const push = ((minD - d) / d) * 0.32;
            const px2 = dx * push;
            const py2 = dy * push;
            x[i] -= px2;
            y[i] -= py2;
            x[j] += px2;
            y[j] += py2;
          }
        }
      }
      for (let i = 0; i < n; i++) {
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
      }
    }

    // Neighbour links (n² scan is ~24k float ops at 220 particles)
    let links = 0;
    const maxD2 = LINK_DIST * LINK_DIST;
    for (let i = 0; i < P && links < MAX_LINKS; i++) {
      for (let j = i + 1; j < P && links < MAX_LINKS; j++) {
        const dx = (pos[i * 2] - pos[j * 2]) * aspect * 0.5;
        const dy = (pos[i * 2 + 1] - pos[j * 2 + 1]) * 0.5;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD2) {
          const fade = (1 - Math.sqrt(d2) / LINK_DIST) * 0.16;
          const o = links * 6;
          lineData[o] = pos[i * 2];
          lineData[o + 1] = pos[i * 2 + 1];
          lineData[o + 2] = fade;
          lineData[o + 3] = pos[j * 2];
          lineData[o + 4] = pos[j * 2 + 1];
          lineData[o + 5] = fade;
          links++;
        }
      }
    }
    return links;
  }

  function frame(now) {
    if (destroyed) return;
    raf = requestAnimationFrame(frame);
    // No lower clamp: at 240Hz dt≈0.25 per frame × 4 frames = real-time speed
    const dt = Math.min(3, last ? (now - last) / 16.667 : 1);
    last = now;
    const links = step(dt, now);

    gl.disable(gl.DEPTH_TEST);

    // 1. paint update (ping-pong)
    const vx = (pointer.x - pointer.px) * 0.9;
    const vy = (pointer.y - pointer.py) * 0.9;
    pointer.px = pointer.x;
    pointer.py = pointer.y;
    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, paintB.fbo);
    gl.viewport(0, 0, paintB.w, paintB.h);
    gl.useProgram(progs.paint);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, paintA.tex);
    gl.uniform1i(uni(progs.paint, 'u_prev'), 0);
    gl.uniform2f(uni(progs.paint, 'u_pointer'), pointer.x, 1 - pointer.y);
    gl.uniform2f(uni(progs.paint, 'u_vel'), pointer.active ? vx : 0, pointer.active ? -vy : 0);
    gl.uniform1f(uni(progs.paint, 'u_aspect'), aspect);
    gl.uniform1f(uni(progs.paint, 'u_radius'), POINTER_SPLAT_RADIUS);
    gl.uniform1f(uni(progs.paint, 'u_dissipation'), PAINT_DISSIPATION);
    gl.bindVertexArray(quadVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const tmp = paintA;
    paintA = paintB;
    paintB = tmp;

    // 2. scene into offscreen target — premultiplied-over, so alpha is
    // applied exactly once through the RT chain
    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneRT.fbo);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    if (links > 0) {
      gl.useProgram(progs.line);
      gl.uniform3fv(uni(progs.line, 'u_colB'), colB);
      gl.uniform1f(uni(progs.line, 'u_alpha'), alpha);
      gl.bindVertexArray(lineVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, lineData, 0, links * 6);
      gl.drawArrays(gl.LINES, 0, links * 2);
    }
    gl.useProgram(progs.point);
    gl.uniform1f(uni(progs.point, 'u_dpr'), cssW ? width / cssW : 1);
    gl.uniform3fv(uni(progs.point, 'u_colA'), colA);
    gl.uniform3fv(uni(progs.point, 'u_colB'), colB);
    gl.uniform1f(uni(progs.point, 'u_alpha'), alpha);
    gl.bindVertexArray(pointVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);
    gl.drawArrays(gl.POINTS, 0, P);

    if (balls) {
      const m = balls.n;
      for (let i = 0; i < m; i++) {
        const en = balls.e[i];
        // Resting look is a watercolor wash toward the paper tone; touch
        // reveals the true brand color, then it fades back
        const k = MONO_WASH * (1 - en); // 0 when fully revealed
        ballInstData[i * 7] = balls.x[i];
        ballInstData[i * 7 + 1] = balls.y[i];
        ballInstData[i * 7 + 2] = balls.r[i];
        ballInstData[i * 7 + 3] = balls.cr[i] * (1 - k) + paperCol[0] * k;
        ballInstData[i * 7 + 4] = balls.cg[i] * (1 - k) + paperCol[1] * k;
        ballInstData[i * 7 + 5] = balls.cb[i] * (1 - k) + paperCol[2] * k;
        ballInstData[i * 7 + 6] = 0.58 + 0.42 * en;
      }
      gl.useProgram(progs.ball);
      gl.uniform2f(uni(progs.ball, 'u_size'), cssW, cssH);
      gl.bindVertexArray(ballVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, ballInstBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, ballInstData, 0, m * 7);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, m);
    }

    // 3. composite with distortion — output is premultiplied (matching the
    // canvas's premultipliedAlpha default), no blending needed
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(progs.composite);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneRT.tex);
    gl.uniform1i(uni(progs.composite, 'u_scene'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, paintA.tex);
    gl.uniform1i(uni(progs.composite, 'u_paint'), 1);
    gl.uniform3fv(uni(progs.composite, 'u_colA'), colA);
    gl.uniform1f(uni(progs.composite, 'u_distort'), DISTORT_STRENGTH);
    gl.bindVertexArray(quadVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  resize();

  return {
    start() {
      if (destroyed || raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    resize,
    setTextBounds,
    /* x, y in [0,1] canvas-relative coords */
    setPointer(x, y, active) {
      if (active && !pointer.active) {
        pointer.px = x;
        pointer.py = y;
        pointerSmooth.reset(x, y);
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = active;
    },
    setColors({ accent, muted, paper, alpha: a = 1 }) {
      colA = hexToRgb(accent);
      colB = hexToRgb(muted);
      if (paper) paperCol = hexToRgb(paper);
      alpha = a;
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      // Free GL resources explicitly but do NOT loseContext(): a canvas only
      // ever gets one WebGL2 context, so losing it would leave any later
      // createField() on this canvas (StrictMode/HMR remount) permanently dead
      if (!gl.isContextLost()) {
        deleteTarget(gl, sceneRT);
        deleteTarget(gl, paintA);
        deleteTarget(gl, paintB);
        for (const p of Object.values(progs)) gl.deleteProgram(p);
        for (const b of [quadBuf, posBuf, metaBuf, lineBuf, ballQuadBuf, ballInstBuf]) gl.deleteBuffer(b);
        for (const v of [quadVao, pointVao, lineVao, ballVao]) gl.deleteVertexArray(v);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      sceneRT = paintA = paintB = null;
    },
  };
}
