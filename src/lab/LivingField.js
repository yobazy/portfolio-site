import { useEffect, useRef } from 'react';

// Lab fork of HeroField: the same silk, plus two live inputs.
//
//   source  'none' | 'clip' | 'camera'   a video texture; bright parts of the
//                                       frame become a portal the field shows
//                                       through (ghosts' body-as-portal, keyed
//                                       on luminance instead of a model)
//   sound   boolean                      the mic drives the field: bass pumps
//                                       it, kicks punch it
//
// Everything else (pointer push, tap ripples, visibility pausing) matches the
// hero. Prototype only: src/lab is not shipped on the home page.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform vec4 uRipples[4];
uniform sampler2D uVideo;
uniform float uHasVideo;
uniform float uVideoAspect;
uniform float uKey;
uniform float uMirror;
uniform float uDrive;
uniform float uBeat;
uniform float uBass;
uniform float uMid;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Cover-fit the video to the canvas.
vec2 videoUv(vec2 uv) {
  float canvas = uRes.x / max(uRes.y, 1.0);
  vec2 p = uv;
  if (canvas > uVideoAspect) {
    float s = uVideoAspect / canvas;
    p.y = (p.y - 0.5) * s + 0.5;
  } else {
    float s = canvas / uVideoAspect;
    p.x = (p.x - 0.5) * s + 0.5;
  }
  if (uMirror > 0.5) p.x = 1.0 - p.x;
  return vec2(p.x, 1.0 - p.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * (0.16 + uDrive * 0.25);

  vec2 q = p;
  q.x += 0.08 * sin(p.y * 3.2 + t * 1.3);
  q.y += 0.06 * sin(p.x * 2.6 - t * 0.9);

  vec2 pp = vec2(uPointer.x * aspect, uPointer.y);
  vec2 dp = p - pp;
  float dl = length(dp);
  float push = exp(-dl * dl * 16.0) * uPointerOn;
  q += (dp / max(dl, 0.001)) * push * 0.14;

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

  // The beat pushes everything out from the middle, briefly.
  vec2 dc = p - vec2(aspect * 0.5, 0.5);
  q += normalize(dc + 1e-4) * uBeat * 0.05 * exp(-length(dc) * 1.5);

  float wA = sin(q.y * 9.0 - t * 7.4 + 1.15 * sin(q.x * 4.0 + t * 1.6));
  float wB = sin(q.y * 4.5 + q.x * 3.0 - t * 3.6);
  float wC = sin(q.x * 6.0 - q.y * 2.5 + t * 5.1);
  float field = wA * 0.5 + wB * 0.33 + wC * 0.27;

  float crest = pow(smoothstep(0.1 - uBass * 0.15, 0.95, field), 2.2 - uBass * 0.8);
  float ridge = pow(1.0 - abs(field), 8.0 - uMid * 3.0);
  float trough = pow(smoothstep(0.0, 1.0, -field), 1.4);

  vec3 deep = vec3(0.027, 0.031, 0.055);
  vec3 ink = vec3(0.094, 0.102, 0.243);
  vec3 glintC = vec3(0.769, 0.804, 1.0);

  float energy = 1.0 + uDrive * 0.9 + uBeat * 0.6;
  vec3 col = mix(deep, ink, 0.4 + 0.7 * crest);
  col = mix(col, deep * 0.85, trough * 0.45);
  col += glintC * ridge * 0.22 * energy;
  col += glintC * crest * 0.09 * energy;
  col += glintC * push * 0.32;
  col += glintC * glint * 0.22;

  float vig = smoothstep(1.25, 0.3, length((uv - 0.5) * vec2(1.08, 1.0)));
  col += ink * 0.5 * exp(-length((uv - vec2(0.25, 0.8)) * vec2(1.4, 2.0)) * 2.2);
  col = mix(deep, col, vig);

  if (uHasVideo > 0.5) {
    vec3 v = texture2D(uVideo, videoUv(uv)).rgb;
    float l = luma(v);
    // Body as portal: the bright figure is where the field shows through.
    float body = smoothstep(uKey - 0.08, uKey + 0.12, l);
    // Outside the body: the room, dark, with a trace of the footage.
    vec3 room = deep * 0.6 + v * 0.12;
    // A thin rim where the key turns over, in the glint colour.
    float rim = smoothstep(0.0, 0.25, body) * (1.0 - smoothstep(0.25, 0.6, body));
    col = mix(room, col * (0.85 + 0.3 * l), body) + glintC * rim * 0.35;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const TAP_MS = 350;
const TAP_PX = 12;

const LivingField = ({ video, sound = false, keyLevel = 0.32, mirror = false, className = 'hero-field', onLevels }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(video);
  videoRef.current = video;
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const keyRef = useRef(keyLevel);
  keyRef.current = keyLevel;
  const mirrorRef = useRef(mirror);
  mirrorRef.current = mirror;
  const levelsRef = useRef(onLevels);
  levelsRef.current = onLevels;
  const audio = useRef(null);

  // The mic: one analyser, three bands, a beat on bass onsets.
  useEffect(() => {
    if (!sound) {
      audio.current?.stop();
      audio.current = null;
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);
        const bins = new Uint8Array(analyser.frequencyBinCount);
        const hz = ctx.sampleRate / analyser.fftSize;
        const band = (lo, hi) => {
          let sum = 0;
          let n = 0;
          for (let i = Math.floor(lo / hz); i < Math.min(bins.length, Math.ceil(hi / hz)); i++) {
            sum += bins[i];
            n++;
          }
          return n ? sum / n / 255 : 0;
        };
        const state = { bass: 0, mid: 0, high: 0, drive: 0, beat: 0, floor: 0.05, peak: 0.2, last: 0 };
        audio.current = {
          read() {
            analyser.getByteFrequencyData(bins);
            const raw = { bass: band(35, 160), mid: band(300, 2000), high: band(4000, 12000) };
            // Normalise bass against its own recent range so a quiet room still swings.
            state.peak = Math.max(raw.bass, state.peak * 0.995, 0.08);
            state.floor = Math.min(raw.bass, state.floor * 1.005 + 0.0005);
            const bass = Math.min(1, Math.max(0, (raw.bass - state.floor) / Math.max(state.peak - state.floor, 0.05)));
            const onset = bass - state.last > 0.28;
            state.last = bass;
            state.beat = onset ? 1 : state.beat * 0.86;
            state.bass += (bass - state.bass) * 0.3;
            state.mid += (raw.mid - state.mid) * 0.2;
            state.high += (raw.high - state.high) * 0.2;
            state.drive += (Math.max(bass, raw.mid * 1.4) - state.drive) * 0.12;
            return state;
          },
          stop() {
            stream.getTracks().forEach((track) => track.stop());
            ctx.close();
          },
        };
      } catch {
        // No mic: the field just keeps moving on its own.
      }
    })();
    return () => {
      cancelled = true;
      audio.current?.stop();
      audio.current = null;
    };
  }, [sound]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
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

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));

    const u = (name) => gl.getUniformLocation(program, name);
    const U = {
      res: u('uRes'), time: u('uTime'), pointer: u('uPointer'), pointerOn: u('uPointerOn'), ripples: u('uRipples'),
      video: u('uVideo'), hasVideo: u('uHasVideo'), videoAspect: u('uVideoAspect'), key: u('uKey'), mirror: u('uMirror'),
      drive: u('uDrive'), beat: u('uBeat'), bass: u('uBass'), mid: u('uMid'),
    };
    gl.uniform1i(U.video, 0);

    const pointer = { x: 0.5, y: 0.5, on: 0 };
    const target = { x: 0.5, y: 0.5, on: 0 };
    const ripples = new Float32Array(16).fill(-1);
    let nextRipple = 0;
    let frame = 0;
    let running = true;
    let visible = true;
    const seconds = () => performance.now() / 1000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
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

      const v = videoRef.current;
      const ready = v && v.readyState >= 2 && v.videoWidth > 0;
      if (ready) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v);
        gl.uniform1f(U.videoAspect, v.videoWidth / v.videoHeight);
      }
      gl.uniform1f(U.hasVideo, ready ? 1 : 0);
      gl.uniform1f(U.key, keyRef.current);
      gl.uniform1f(U.mirror, mirrorRef.current ? 1 : 0);

      const levels = soundRef.current && audio.current ? audio.current.read() : { drive: 0, beat: 0, bass: 0, mid: 0 };
      gl.uniform1f(U.drive, levels.drive);
      gl.uniform1f(U.beat, levels.beat);
      gl.uniform1f(U.bass, levels.bass);
      gl.uniform1f(U.mid, levels.mid);
      levelsRef.current?.(levels);

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(U.res, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(U.time, seconds());
      gl.uniform2f(U.pointer, pointer.x, pointer.y);
      gl.uniform1f(U.pointerOn, pointer.on);
      gl.uniform4fv(U.ripples, ripples);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = window.requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && running && visible && !document.hidden) frame = window.requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    document.addEventListener('visibilitychange', start);
    start();

    const surface = canvas.parentElement;
    let down = null;
    const place = (event) => {
      const box = canvas.getBoundingClientRect();
      return { x: (event.clientX - box.left) / box.width, y: 1 - (event.clientY - box.top) / box.height };
    };
    const interactive = (event) => event.target instanceof Element && event.target.closest('a, button, input, select, label, [data-no-field]');
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
    };
    surface.addEventListener('pointermove', onMove, { passive: true });
    surface.addEventListener('pointerleave', onLeave);
    surface.addEventListener('pointerdown', onDown, { passive: true });
    surface.addEventListener('pointerup', onUp);
    surface.addEventListener('pointercancel', onLeave);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', start);
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerleave', onLeave);
      surface.removeEventListener('pointerdown', onDown);
      surface.removeEventListener('pointerup', onUp);
      surface.removeEventListener('pointercancel', onLeave);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default LivingField;
