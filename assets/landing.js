/* Landing-page navigation and decorative Earth animation.
   Plot geometry and interactions remain in their original notebooks. */
(() => {
  'use strict';
  const menu = document.querySelector('#site-menu');
  const opener = document.querySelector('#menu-toggle');
  const closer = document.querySelector('#menu-close');
  opener.hidden = false;
  opener.addEventListener('click', () => {
    menu.showModal();
    opener.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  });
  closer.addEventListener('click', () => menu.close());
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = [...menu.querySelectorAll('button:not([disabled]), a[href]')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  menu.addEventListener('close', () => {
    opener.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
  menu.addEventListener('click', (event) => {
    const bounds = menu.getBoundingClientRect();
    if (event.target === menu && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) menu.close();
    const link = event.target.closest('a');
    if (!link) return;
    menu.close();
    if (link.hash && link.origin === location.origin) {
      const target = document.querySelector(link.hash);
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });

  const canvas = document.querySelector('#globe-canvas');
  const globe = canvas.parentElement;
  const control = document.querySelector('#motion-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let visible = true;
  let ready = false;
  let frame = 0;
  let lastTime = 0;
  let angle = .03;

  function updateControl() {
    const label = paused ? 'Play background animation' : 'Pause background animation';
    control.setAttribute('aria-label', label);
    control.title = label;
    control.firstElementChild.textContent = paused ? '\u25b6' : '\u275a\u275a';
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }
  function fallback() {
    ready = false;
    stop();
    globe.classList.remove('is-ready');
    control.hidden = true;
  }
  // A static local poster remains visible when WebGL or JavaScript is unavailable.
  try {
    // Supply premultiplied colors directly so the atmosphere does not depend
    // on the browser converting transparent pixels during compositing.
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;
    const vertexSource = `
      attribute vec2 position;
      varying vec2 point;
      void main() { point = position; gl_Position = vec4(position, 0.0, 1.0); }
    `;
    const fragmentSource = `
      precision mediump float;
      varying vec2 point;
      uniform sampler2D earth;
      uniform float rotation;
      void main() {
        vec2 p = point / 0.96;
        float r2 = dot(p, p);
        if (r2 > 1.0) {
          float halo = 0.32 * exp(-(sqrt(r2) - 1.0) * 90.0);
          gl_FragColor = vec4(vec3(0.39, 0.58, 0.87) * halo, halo);
          return;
        }
        vec3 normal = vec3(p, sqrt(1.0 - r2));
        float tilt = 0.28;
        vec3 geographic = vec3(normal.x, normal.y * cos(tilt) + normal.z * sin(tilt), normal.z * cos(tilt) - normal.y * sin(tilt));
        vec2 uv = vec2(atan(geographic.x, geographic.z) / 6.2831853 + 0.5 + rotation, acos(clamp(geographic.y, -1.0, 1.0)) / 3.1415927);
        vec3 color = texture2D(earth, uv).rgb;
        float light = 0.28 + 0.72 * max(0.0, dot(normal, normalize(vec3(-0.45, 0.65, 1.5))));
        float rim = pow(1.0 - normal.z, 3.0);
        color = color * light + vec3(0.13, 0.26, 0.48) * rim * 0.6;
        float alpha = 1.0 - smoothstep(0.997, 1.0, r2);
        gl_FragColor = vec4(color * alpha, alpha);
      }
    `;
    function shader(type, source) {
      const result = gl.createShader(type);
      gl.shaderSource(result, source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error('Globe shader unavailable');
      return result;
    }
    const program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const rotation = gl.getUniformLocation(program, 'rotation');
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program, 'earth'), 0);

    function draw() {
      gl.uniform1f(rotation, angle);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    function tick(time) {
      if (!ready || paused || !visible || document.hidden || menu.open) { stop(); return; }
      if (!lastTime) lastTime = time;
      // Cap drawing at 30 fps, and prevent a jump after a suspended tab.
      if (time - lastTime >= 1000 / 30) {
        angle += Math.min(time - lastTime, 100) / 240000;
        lastTime = time;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      stop();
      if (ready && !paused && visible && !document.hidden && !menu.open) frame = requestAnimationFrame(tick);
    }
    function resize() {
      const size = Math.min(1400, Math.round(globe.clientWidth * Math.min(devicePixelRatio || 1, 1.5)));
      canvas.width = canvas.height = size;
      gl.viewport(0, 0, size, size);
      if (ready) draw();
    }
    const map = new Image();
    map.onload = () => {
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, map);
        ready = true;
        resize();
        globe.classList.add('is-ready');
        control.hidden = false;
        updateControl();
        sync();
      } catch { fallback(); }
    };
    map.onerror = fallback;
    map.src = 'assets/landing/earth-map.png';
    control.addEventListener('click', () => { paused = !paused; updateControl(); sync(); });
    reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateControl(); sync(); });
    document.addEventListener('visibilitychange', sync);
    menu.addEventListener('close', sync);
    opener.addEventListener('click', sync);
    new ResizeObserver(resize).observe(globe);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(document.querySelector('.hero'));
    canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); fallback(); });
  } catch { fallback(); }
})();
