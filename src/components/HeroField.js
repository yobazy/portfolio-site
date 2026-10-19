import { useEffect, useRef } from 'react';
import { fieldLook } from '../lib/fieldLook';

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// The field: a slow silk of indigo waves with leopard rosettes printed tone on
// tone into it. The pointer pushes the silk aside and lights it where it
// touches; a tap drops a ripple that travels out and fades. Descended from
// the portal-waves mode in ghosts-playground.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform vec4 uRipples[4];
uniform float uIntensity;
uniform float uRosette;
uniform float uPhase;
uniform float uPush;
uniform float uPointerGlow;
uniform float uBloom;
uniform vec3 uDeep;
uniform vec3 uInk;
uniform vec3 uInkDeep;
uniform vec3 uGlint;

vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

// Jittered cells, each holding a lobed ring broken into two to four spots.
float rosettes(vec2 p) {
  vec2 g = floor(p);
  vec2 f = fract(p);
  float v = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 h = hash2(g + o);
      vec2 c = o + 0.5 + (h - 0.5) * 0.7;
      vec2 d = f - c;
      float a = atan(d.y, d.x);
      float r = length(d) * (1.0 + 0.2 * sin(a * 3.0 + h.x * 6.2832));
      float ring = smoothstep(0.33, 0.26, r) - smoothstep(0.22, 0.15, r);
      float lobes = 2.0 + floor(h.y * 3.0);
      float gaps = smoothstep(0.3, 0.7, 0.5 + 0.5 * sin(a * lobes + h.x * 10.0));
      v = max(v, ring * gaps);
    }
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uPhase;

  vec2 q = p;
  q.x += 0.08 * sin(p.y * 3.2 + t * 1.3);
  q.y += 0.06 * sin(p.x * 2.6 - t * 0.9);

  // Pointer: push the silk away, and glint where it is.
  vec2 pp = vec2(uPointer.x * aspect, uPointer.y);
  vec2 dp = p - pp;
  float dl = length(dp);
  float push = exp(-dl * dl * 16.0) * uPointerOn;
  q += (dp / max(dl, 0.001)) * push * uPush;

  // Ripples: rings that travel out from a tap and fade.
  float glint = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 rp = uRipples[i];
    float age = uTime - rp.z;
    if (rp.z < 0.0 || age < 0.0 || age > 2.4) continue;
    vec2 rc = vec2(rp.x * aspect, rp.y);
    vec2 dr = p - rc;
    float r = length(dr);
    float radius = age * 0.42;
    float band = exp(-pow((r - radius) * 12.0, 2.0));
    float fade = exp(-age * 1.5);
    q += (dr / max(r, 0.001)) * band * fade * 0.06;
    glint += band * fade;
  }

  float wA = sin(q.y * 9.0 - t * 7.4 + 1.15 * sin(q.x * 4.0 + t * 1.6));
  float wB = sin(q.y * 4.5 + q.x * 3.0 - t * 3.6);
  float wC = sin(q.x * 6.0 - q.y * 2.5 + t * 5.1);
  float field = wA * 0.5 + wB * 0.33 + wC * 0.27;

  float crest = pow(smoothstep(0.1, 0.95, field), 2.2);
  float ridge = pow(1.0 - abs(field), 8.0);
  float trough = pow(smoothstep(0.0, 1.0, -field), 1.4);
  // Smaller and quieter on a tall screen, where a cell would be a hand wide.
  float cells = mix(8.0, 5.5, smoothstep(0.6, 1.4, aspect));
  float ros = uRosette > 0.0 ? rosettes(q * cells + vec2(0.0, t * 0.3)) * uRosette * mix(0.55, 1.0, smoothstep(0.6, 1.4, aspect)) : 0.0;

  vec3 deep = uDeep;
  vec3 ink = uInk;
  vec3 inkDeep = uInkDeep;
  vec3 glintC = uGlint;

  vec3 col = mix(deep, ink, 0.4 + 0.7 * crest);
  col = mix(col, deep * 0.85, trough * 0.45);
  col = mix(col, inkDeep, ros * 0.75 * (0.3 + 0.7 * crest));
  col += glintC * ridge * 0.22 * uIntensity;
  col += glintC * crest * 0.09 * uIntensity;
  col += glintC * push * uPointerGlow;
  col += glintC * glint * 0.22;

  float vig = smoothstep(1.25, 0.3, length((uv - 0.5) * vec2(1.08, 1.0)));
  // A soft indigo bloom high and left, where the field is otherwise quiet.
  col += ink * uBloom * exp(-length((uv - vec2(0.25, 0.8)) * vec2(1.4, 2.0)) * 2.2);
  col = mix(deep, col, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const TAP_MS = 350;
const TAP_PX = 12;

// `touchable` listens on the canvas's parent (the whole hero), so the copy on
// top doesn't block the field. Taps on links and buttons are left alone.
const HeroField = ({
  reduce = false,
  touchable = false,
  intensity = 0.9,
  rosette = 0,
  dprCap = 1.5,
  onRipple,
  className = 'hero-field',
}) => {
  const canvasRef = useRef(null);
  const rippleCallback = useRef(onRipple);
  rippleCallback.current = onRipple;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    // Nothing is compiled until the canvas is on screen, so a field below the
    // fold costs nothing on the way in.
    let teardown = null;
    let started = false;
    const gate = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        gate.disconnect();
        teardown = start();
      },
      { rootMargin: '200px' }
    );
    gate.observe(canvas);

    function start() {
      const gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'low-power',
      });

      if (!gl) return undefined;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return undefined;

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, 'aPos');
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      const u = (name) => gl.getUniformLocation(program, name);
      const uRes = u('uRes');
      const uTime = u('uTime');
      const uPointer = u('uPointer');
      const uPointerOn = u('uPointerOn');
      const uRipples = u('uRipples');
      const uIntensity = u('uIntensity');
      const uPhase = u('uPhase');
      const uPush = u('uPush');
      const uPointerGlow = u('uPointerGlow');
      const uBloom = u('uBloom');
      const uDeep = u('uDeep');
      const uInk = u('uInk');
      const uInkDeep = u('uInkDeep');
      const uGlint = u('uGlint');
      gl.uniform1f(u('uRosette'), rosette);

      // Pointer state, eased toward its target every frame so it trails.
      const pointer = { x: 0.5, y: 0.5, on: 0 };
      const target = { x: 0.5, y: 0.5, on: 0 };
      const ripples = new Float32Array(16).fill(-1);
      let nextRipple = 0;

      let frame = 0;
      let running = !reduce;
      let visible = true;
      // Shared clock: a field mounted later continues the same motion as the
      // ones already running.
      const origin = 0;
      const seconds = () => (performance.now() - origin) / 1000;
      // The waves advance by speed × elapsed, so a live speed change doesn't
      // jump the field to a different spot.
      let phase = 5 * fieldLook.speed;
      let last = null;

      const draw = (time) => {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform1f(uTime, time);
        if (last !== null) phase += (time - last) * fieldLook.speed;
        last = time;
        gl.uniform1f(uPhase, phase);
        gl.uniform1f(uIntensity, intensity * fieldLook.intensity);
        gl.uniform1f(uPush, fieldLook.push);
        gl.uniform1f(uPointerGlow, fieldLook.pointerGlow);
        gl.uniform1f(uBloom, fieldLook.bloom);
        gl.uniform3fv(uDeep, fieldLook.deep);
        gl.uniform3fv(uInk, fieldLook.ink);
        gl.uniform3fv(uInkDeep, fieldLook.inkDeep);
        gl.uniform3fv(uGlint, fieldLook.glint);
        gl.uniform2f(uPointer, pointer.x, pointer.y);
        gl.uniform1f(uPointerOn, pointer.on);
        gl.uniform4fv(uRipples, ripples);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
        const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
        const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        if (reduce) draw(5);
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      const tick = () => {
        if (!running || !visible || document.hidden) {
          frame = 0;
          return;
        }
        pointer.x += (target.x - pointer.x) * 0.1;
        pointer.y += (target.y - pointer.y) * 0.1;
        pointer.on += (target.on - pointer.on) * 0.08;
        draw(seconds());
        frame = window.requestAnimationFrame(tick);
      };
      const start = () => {
        if (!frame && running && visible && !document.hidden)
          frame = window.requestAnimationFrame(tick);
      };

      // Only render while on screen and while the tab is in front.
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
        },
        { threshold: 0.02 }
      );
      io.observe(canvas);
      document.addEventListener('visibilitychange', start);
      start();

      // Touch and pointer, on the hero rather than the canvas.
      const surface = touchable && !reduce ? canvas.parentElement : null;
      let down = null;
      const place = (event) => {
        const box = canvas.getBoundingClientRect();
        return {
          x: (event.clientX - box.left) / box.width,
          y: 1 - (event.clientY - box.top) / box.height,
        };
      };
      const interactive = (event) =>
        event.target instanceof Element &&
        event.target.closest('a, button, input, [data-no-field]');
      const onMove = (event) => {
        if (event.pointerType === 'touch' && !down) return;
        const at = place(event);
        target.x = at.x;
        target.y = at.y;
        target.on = 1;
      };
      const onLeave = () => {
        target.on = 0;
      };
      const onDown = (event) => {
        if (interactive(event)) return;
        down = { x: event.clientX, y: event.clientY, t: performance.now() };
        const at = place(event);
        target.x = at.x;
        target.y = at.y;
        target.on = 1;
      };
      const onUp = (event) => {
        if (!down) return;
        const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
        const held = performance.now() - down.t;
        down = null;
        if (event.pointerType === 'touch') target.on = 0;
        if (moved > TAP_PX || held > TAP_MS) return;
        const at = place(event);
        const slot = nextRipple * 4;
        ripples[slot] = at.x;
        ripples[slot + 1] = at.y;
        ripples[slot + 2] = seconds();
        nextRipple = (nextRipple + 1) % 4;
        rippleCallback.current?.(at);
      };
      const onCancel = () => {
        down = null;
        target.on = 0;
      };
      if (surface) {
        surface.addEventListener('pointermove', onMove, { passive: true });
        surface.addEventListener('pointerleave', onLeave);
        surface.addEventListener('pointerdown', onDown, { passive: true });
        surface.addEventListener('pointerup', onUp);
        surface.addEventListener('pointercancel', onCancel);
      }

      return () => {
        running = false;
        window.cancelAnimationFrame(frame);
        observer.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', start);
        if (surface) {
          surface.removeEventListener('pointermove', onMove);
          surface.removeEventListener('pointerleave', onLeave);
          surface.removeEventListener('pointerdown', onDown);
          surface.removeEventListener('pointerup', onUp);
          surface.removeEventListener('pointercancel', onCancel);
        }
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    }

    return () => {
      gate.disconnect();
      teardown?.();
    };
  }, [reduce, touchable, intensity, rosette, dprCap]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default HeroField;
