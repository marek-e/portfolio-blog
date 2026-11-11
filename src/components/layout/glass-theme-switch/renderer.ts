import {
  clamp,
  createMotion,
  daylight,
  hitKnob,
  isAtRest,
  knobGeometry,
  stepMotion,
} from './physics';
import { createPixelRaster } from './pixels';
import { fragmentSource, vertexSource } from './shaders';

export function createGlassRenderer(
  canvas: HTMLCanvasElement,
  initial: number,
  onPreview: (value: number) => void
) {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
  });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const names = [
    'resolution',
    'knobSize',
    'knobX',
    'knobRadius',
    'progress',
    'angle',
    'energy',
    'lift',
    'time',
  ] as const;
  const uniforms = Object.fromEntries(
    names.map((name) => [name, gl.getUniformLocation(program, name)])
  ) as Record<(typeof names)[number], WebGLUniformLocation | null>;
  const textures = ['pixels', 'bloom'].map((name, index) => {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, name), index);
    return texture;
  });
  const raster = createPixelRaster();
  const motion = createMotion(initial);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contrast = window.matchMedia('(prefers-contrast: more)');
  const IDLE_FRAME_MS = 1000 / 12;
  const SETTLE_MS = 800;
  let frame = 0;
  let idleTimer = 0;
  let restingSince = 0;
  let previousTime = 0;
  let lastPreview = -1;
  let visible = true;
  let disposed = false;
  let snap = true;
  let lastDragTime = 0;

  const preview = () => {
    const value = daylight(motion.progress);
    if (
      lastPreview !== value &&
      (value === 0 || value === 1 || Math.abs(lastPreview - value) > 0.0001)
    ) {
      lastPreview = value;
      onPreview(value);
    }
  };
  const draw = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden || contrast.matches) return;
    const dt = Math.min((time - previousTime) / 1000 || 1 / 60, 1 / 30);
    previousTime = time;
    if (motion.dragging && time - lastDragTime > 40) motion.velocity *= Math.exp(-dt * 18);
    stepMotion(motion, dt, (snap || reduced.matches) && !motion.dragging);
    if (reduced.matches) {
      motion.orbit = clamp(motion.progress);
      motion.velocity = 0;
      motion.hover = motion.hoverTarget;
      motion.press = motion.pressTarget;
    }
    const knob = knobGeometry(motion);
    raster.draw(
      clamp(motion.progress),
      reduced.matches ? 0 : motion.velocity,
      time / 1000,
      dt,
      snap || reduced.matches
    );
    snap = false;
    for (const [index, source] of [raster.sharp, raster.bloom].entries()) {
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, textures[index]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    }
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.knobSize, knob.halfX, knob.halfY);
    gl.uniform1f(uniforms.knobX, knob.x);
    gl.uniform1f(uniforms.knobRadius, knob.radius);
    gl.uniform1f(uniforms.progress, daylight(motion.progress));
    gl.uniform1f(uniforms.angle, knob.angle);
    gl.uniform1f(uniforms.energy, knob.energy);
    gl.uniform1f(uniforms.lift, knob.lift);
    gl.uniform1f(uniforms.time, reduced.matches ? 0 : time / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    preview();
    if (reduced.matches) return;
    restingSince = isAtRest(motion) ? restingSince || time : 0;
    if (restingSince && time - restingSince > SETTLE_MS)
      idleTimer = window.setTimeout(request, IDLE_FRAME_MS);
    else request();
  };
  const request = () => {
    clearTimeout(idleTimer);
    if (!frame && !disposed && visible && !document.hidden && !contrast.matches)
      frame = requestAnimationFrame(draw);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    frame = 0;
  };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    raster.resize(dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    request();
  };
  const visibility = () => {
    stop();
    previousTime = 0;
    if (document.hidden || contrast.matches) {
      if (!motion.dragging) stepMotion(motion, 0, true);
      if (contrast.matches) {
        onPreview(motion.target);
        lastPreview = -1;
      }
    } else request();
  };
  const preference = () => {
    snap = reduced.matches;
    visibility();
    request();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stop();
    else {
      previousTime = 0;
      request();
    }
  });
  intersection.observe(canvas.parentElement!);
  reduced.addEventListener('change', preference);
  contrast.addEventListener('change', preference);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('resize', resize);
  resize();

  return {
    getProgress: () => motion.progress,
    getTarget: () => motion.target,
    hitKnob: (x: number, y: number) => hitKnob(motion, x, y),
    hover(value: boolean) {
      motion.hoverTarget = value ? 1 : 0;
      request();
    },
    press() {
      motion.pressTarget = 1;
      request();
    },
    startDrag() {
      motion.dragging = true;
      motion.velocity = 0;
      request();
    },
    dragTo(next: number, velocity: number) {
      motion.progress = next;
      motion.velocity = velocity;
      lastDragTime = performance.now();
      request();
    },
    release(next: number, speed = 0, immediate = false, dragged = false) {
      motion.dragging = false;
      motion.pressTarget = 0;
      motion.target = next;
      motion.velocity = clamp(speed, -8, 8);
      motion.kick = dragged ? 0.6 : 1;
      snap = immediate || reduced.matches;
      if (snap || contrast.matches || !visible || document.hidden) {
        stepMotion(motion, 0, true);
        preview();
      }
      request();
    },
    setTarget(next: number) {
      if (!motion.dragging) {
        motion.target = next;
        if (!visible || document.hidden || contrast.matches) {
          stepMotion(motion, 0, true);
          preview();
          snap = true;
        }
        request();
      }
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      reduced.removeEventListener('change', preference);
      contrast.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('resize', resize);
      for (const texture of textures) gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

export type GlassRenderer = NonNullable<ReturnType<typeof createGlassRenderer>>;
