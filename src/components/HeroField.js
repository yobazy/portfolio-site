import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Traveling-wave field from visuals-test/sketches/002-portal-waves
// (td/glsl/weather.frag). Clock is slowed and crests are remapped
// onto the site amber token so it reads as a surface, not a club look.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uWeather;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / max(uRes.y, 1.0);
  float t = uTime;
  vec2 p = vec2(uv.x * aspect, uv.y);

  p.x += 0.07 * sin(p.y * 4.2 + t * 1.3);
  p.y += 0.045 * sin(p.x * 5.5 - t * 0.9);
  p *= 0.52;

  float wA = sin(p.y * 28.0 - t * 7.4 + 1.15 * sin(p.x * 9.0 + t * 1.6));
  float wB = sin(p.y * 12.5 + p.x * 4.0 - t * 3.6);
  float wC = sin(p.x * 16.0 - p.y * 6.0 + t * 5.1);
  float field = wA * 0.52 + wB * 0.32 + wC * 0.28;

  float crest = pow(smoothstep(0.12, 0.95, field), 2.6);
  float ridge = pow(1.0 - abs(field), 10.0);
  float trough = pow(smoothstep(0.0, 1.0, -field), 1.4);

  vec3 deep = vec3(0.031, 0.031, 0.031);
  vec3 belly = vec3(0.145, 0.094, 0.016);
  vec3 hi = vec3(0.910, 0.643, 0.0);

  vec3 col = mix(deep, belly, 0.28 + 0.62 * crest);
  col = mix(col, deep * 0.7, trough * 0.55);
  col += hi * crest * 0.42 * uWeather;
  col += hi * ridge * 0.28 * uWeather;
  col *= 0.62 + 0.38 * uWeather;

  float vig = smoothstep(1.05, 0.38, length((uv - 0.5) * vec2(1.08, 1.0)));
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

const HeroField = ({ reduce = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

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
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uWeather = gl.getUniformLocation(program, 'uWeather');
    gl.uniform1f(uWeather, 0.82);

    let frame = 0;
    let running = true;
    const origin = performance.now();

    const draw = (time) => {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(uRes, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      if (reduce) draw(0.8);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    if (!reduce) {
      const tick = (now) => {
        if (!running) return;
        draw(((now - origin) / 1000) * 0.16);
        frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-visual-field"
      aria-hidden="true"
    />
  );
};

export default HeroField;
