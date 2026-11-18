(function(root) {
  "use strict";

  // Shared fog layer for every fog in the game: the standard game approach of
  // one WebGL 1 fragment shader per layer. Drifting fog only changes a few
  // uniforms instead of repainting filtered, masked or animated page content.
  // Callers keep their CSS/SVG fog as the fallback for when WebGL is missing,
  // lost or cannot read the fog art (see `supported()`).
  //
  // Two kinds share the same lifecycle, loop and fallback:
  // - "grid" (Exploration map): a visibility texture with one texel per cell.
  //   A covered cell is always fully opaque; the soft organic edge lives only
  //   inside revealed cells, so no hidden pixel can ever show.
  // - "cover": up to two drifting copies of one fog image filling the host
  //   like CSS `background-size: cover` on an oversized, transformed layer
  //   (Camp neighbour gardens, Perks backdrop). The host owns shape and mask.

  const CatInc = root.CatInc = root.CatInc || {};

  const VERTEX_SHADER = [
    "attribute vec2 aPosition;",
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = vec2(aPosition.x * .5 + .5, .5 - aPosition.y * .5);",
    "  gl_Position = vec4(aPosition, 0., 1.);",
    "}"
  ].join("\n");

  const PRECISION = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif"
  ].join("\n");

  // Every coordinate stays small (grid cells, wrapped offsets) so mediump-only
  // mobile GPUs render the same image.
  const GRID_FRAGMENT_SHADER = [
    PRECISION,
    "varying vec2 vUv;",
    "uniform sampler2D uVisibility;",
    "uniform sampler2D uFog;",
    "uniform sampler2D uNoise;",
    "uniform vec2 uGrid;",
    "uniform vec2 uDrift;",
    "uniform vec2 uEdgeDrift;",
    "uniform float uFogReady;",
    "float covered(vec2 cell) {",
    "  if (cell.x < 0. || cell.y < 0. || cell.x >= uGrid.x || cell.y >= uGrid.y) return 0.;",
    "  return 1. - texture2D(uVisibility, (cell + .5) / uGrid).r;",
    "}",
    "float mirrored(float x) { float m = mod(x, 2.); return m < 1. ? m : 2. - m; }",
    // Warm parchment tint of the shared slate fog art.
    "vec3 tint(vec3 c) {",
    "  return clamp(vec3(dot(c, vec3(.315, .62, .116)) + .27, dot(c, vec3(.324, .637, .119)) + .18, dot(c, vec3(.33, .649, .121)) + .02), 0., 1.);",
    "}",
    "void main() {",
    "  vec2 g = vUv * uGrid;",
    "  vec2 c = floor(g);",
    "  vec2 f = g - c;",
    "  float fog = 1.;",
    "  if (covered(c) < .5) {",
    "    float d = 9.;",
    "    if (covered(c + vec2(-1., 0.)) > .5) d = min(d, f.x);",
    "    if (covered(c + vec2(1., 0.)) > .5) d = min(d, 1. - f.x);",
    "    if (covered(c + vec2(0., -1.)) > .5) d = min(d, f.y);",
    "    if (covered(c + vec2(0., 1.)) > .5) d = min(d, 1. - f.y);",
    "    if (covered(c + vec2(-1., -1.)) > .5) d = min(d, length(f));",
    "    if (covered(c + vec2(1., -1.)) > .5) d = min(d, length(vec2(1. - f.x, f.y)));",
    "    if (covered(c + vec2(-1., 1.)) > .5) d = min(d, length(vec2(f.x, 1. - f.y)));",
    "    if (covered(c + vec2(1., 1.)) > .5) d = min(d, length(1. - f));",
    "    float n = texture2D(uNoise, g * .14 + uEdgeDrift).r * 2. - 1.;",
    "    fog = 1. - smoothstep(0., .14, d - .03 - .05 * n);",
    "  }",
    "  if (fog <= 0.) { gl_FragColor = vec4(0.); return; }",
    "  vec3 color = vec3(.769, .682, .529);",
    "  if (uFogReady > .5) {",
    // Same composition as the former SVG: the strip drifting right, plus a
    // slower, slightly taller copy at 25 %. Mirrored repeats keep joins seamless.
    "    vec3 primary = texture2D(uFog, vec2(mirrored(vUv.x - uDrift.x), vUv.y)).rgb;",
    "    vec3 secondary = texture2D(uFog, vec2(mirrored(vUv.x - uDrift.y), (vUv.y * uGrid.y + .3) / (uGrid.y + .6))).rgb;",
    "    color = tint(mix(primary, secondary, .25));",
    "  }",
    "  gl_FragColor = vec4(color * fog, fog);",
    "}"
  ].join("\n");

  // A layer box overscans the host by `inset` on every side (CSS `inset: -k`),
  // then translates by a fraction of its own size and scales about its centre
  // (CSS `translate(...) scale(...)`). uCover maps it to the image like
  // `background: center / cover no-repeat`. Output is premultiplied, with the
  // second layer composited over the first.
  const COVER_FRAGMENT_SHADER = [
    PRECISION,
    "varying vec2 vUv;",
    "uniform sampler2D uFog;",
    "uniform float uFogReady;",
    "uniform vec2 uCover;",
    "uniform vec3 uLayerA;",
    "uniform vec2 uShiftA;",
    "uniform vec3 uLayerB;",
    "uniform vec2 uShiftB;",
    "vec4 layer(vec3 settings, vec2 shift) {",
    "  if (settings.y <= 0.) return vec4(0.);",
    "  vec2 r = (vUv + settings.x) / (1. + 2. * settings.x);",
    "  vec2 q = .5 + (r - .5 - shift) / settings.z;",
    "  if (q.x < 0. || q.y < 0. || q.x > 1. || q.y > 1.) return vec4(0.);",
    "  vec4 art = texture2D(uFog, .5 + (q - .5) * uCover);",
    "  float alpha = settings.y * art.a;",
    "  return vec4(art.rgb * alpha, alpha);",
    "}",
    "void main() {",
    "  if (uFogReady < .5) { gl_FragColor = vec4(0.); return; }",
    "  vec4 under = layer(uLayerA, uShiftA);",
    "  vec4 over = layer(uLayerB, uShiftB);",
    "  gl_FragColor = over + under * (1. - over.a);",
    "}"
  ].join("\n");

  // Tileable smooth value noise for the map frontier, built once on the CPU.
  function buildNoise(size) {
    const data = new Uint8Array(size * size);
    function hash(x, y, salt) {
      let h = Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263) ^ salt;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    }
    function lattice(px, py, period, salt) {
      const x = px / size * period, y = py / size * period;
      const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      const a = hash(ix % period, iy % period, salt), b = hash((ix + 1) % period, iy % period, salt);
      const c = hash(ix % period, (iy + 1) % period, salt), d = hash((ix + 1) % period, (iy + 1) % period, salt);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const value = (lattice(x, y, 8, 11) * .5 + lattice(x, y, 16, 23) * .25 + lattice(x, y, 32, 37) * .125) / .875;
        data[y * size + x] = Math.round(value * 255);
      }
    }
    return data;
  }

  // CSS `animation-direction: alternate` along a linear path, from the wall
  // clock so remounts never jump. A negative CSS delay is a positive offset.
  function coverPose(layer, now, moving) {
    const rest = layer.rest || {x: 0, y: 0, scale: 1};
    if (!moving || !layer.periodMs) return {x: rest.x || 0, y: rest.y || 0, scale: rest.scale || 1};
    const from = layer.from || rest, to = layer.to || rest;
    const phase = ((now + (layer.offsetMs || 0)) % (2 * layer.periodMs)) / layer.periodMs;
    let progress = phase < 1 ? phase : 2 - phase;
    if (layer.reverse) progress = 1 - progress;
    const scaleFrom = from.scale || 1, scaleTo = to.scale || 1;
    return {
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress,
      scale: scaleFrom + (scaleTo - scaleFrom) * progress
    };
  }

  function createFogLayer(options) {
    const settings = Object.assign({
      kind: "grid",
      textureUrl: "",
      // grid: drift periods of the two strips.
      periodsMs: [90000, 140000],
      // cover: up to two layers {inset, opacity, periodMs, offsetMs, reverse,
      // from, to, rest}; positions are fractions of the layer box.
      layers: [],
      framesPerSecond: 24,
      motion: true,
      maxPixelRatio: 2,
      // Soft fog art gains nothing above its own resolution; caps GPU fill.
      maxCanvasSide: Infinity,
      // Optional extra pause signal from the caller (e.g. an active scroll).
      isPaused: null,
      onAvailabilityChange: null,
      // Called once the fog art is on the GPU (cover hosts swap layers then).
      onReady: null
    }, options || {});
    const cover = settings.kind === "cover";
    const documentRef = root.document;
    const reducedMotionQuery = root.matchMedia ? root.matchMedia("(prefers-reduced-motion: reduce)") : null;

    let canvas = null;
    let gl = null;
    let available = null;
    let disabled = false;
    let lost = false;
    // The fog art could not reach the GPU (load error, or a tainted image such
    // as Chromium direct-file play): the caller then keeps its static fog.
    let textureBroken = false;
    let program = null;
    let uniforms = null;
    let visibilityTexture = null;
    let fogTexture = null;
    let noiseTexture = null;
    let fogImage = null;
    let fogUploadedWidth = 0;
    let fogReady = false;
    let grid = {columns: 1, rows: 1, data: new Uint8Array([0])};
    let onScreen = false;
    let timer = 0;
    let frame = 0;

    function notify() {
      if (typeof settings.onAvailabilityChange === "function") settings.onAvailabilityChange();
    }

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || "Fog shader failed");
      return shader;
    }

    function makeTexture(unit, filter, wrap) {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      return texture;
    }

    // Creates every GPU resource; also used after a context restoration.
    function setupGl() {
      try {
        program = gl.createProgram();
        gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, cover ? COVER_FRAGMENT_SHADER : GRID_FRAGMENT_SHADER));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Fog program failed");
        gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        const uniform = function(name) { return gl.getUniformLocation(program, name); };
        fogTexture = makeTexture(1, gl.LINEAR, gl.CLAMP_TO_EDGE);
        gl.uniform1i(uniform("uFog"), 1);
        if (cover) {
          uniforms = {
            fogReady: uniform("uFogReady"), cover: uniform("uCover"),
            layerA: uniform("uLayerA"), shiftA: uniform("uShiftA"),
            layerB: uniform("uLayerB"), shiftB: uniform("uShiftB")
          };
        } else {
          visibilityTexture = makeTexture(0, gl.NEAREST, gl.CLAMP_TO_EDGE);
          noiseTexture = makeTexture(2, gl.LINEAR, gl.REPEAT);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 128, 128, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, buildNoise(128));
          uniforms = {
            fogReady: uniform("uFogReady"), grid: uniform("uGrid"),
            drift: uniform("uDrift"), edgeDrift: uniform("uEdgeDrift")
          };
          gl.uniform1i(uniform("uVisibility"), 0);
          gl.uniform1i(uniform("uNoise"), 2);
        }
        fogUploadedWidth = 0;
        if (canvas) gl.viewport(0, 0, canvas.width, canvas.height);
        uploadGrid();
        uploadFog();
        return true;
      } catch (error) {
        return false;
      }
    }

    function init() {
      if (available !== null) return;
      available = false;
      if (!documentRef || disabled) return;
      canvas = documentRef.createElement("canvas");
      canvas.className = "fog-layer-canvas";
      canvas.setAttribute("aria-hidden", "true");
      // The layer always fills its host; the host owns placement.
      canvas.style.cssText = cover
        ? "position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none"
        : "display:block;width:100%;height:100%;pointer-events:none";
      const attributes = {alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power"};
      try {
        gl = canvas.getContext("webgl", attributes) || canvas.getContext("experimental-webgl", attributes);
      } catch (error) {
        gl = null;
      }
      if (!gl || !setupGl()) { gl = null; return; }
      available = true;
      canvas.addEventListener("webglcontextlost", function(event) {
        event.preventDefault();
        lost = true;
        fogReady = false;
        stop();
        notify();
      });
      canvas.addEventListener("webglcontextrestored", function() {
        lost = !setupGl();
        notify();
      });
      if (settings.textureUrl && root.Image) {
        const image = new root.Image();
        image.onload = function() { fogImage = image; uploadFog(); redraw(); };
        image.onerror = textureFailed;
        image.src = settings.textureUrl;
      }
      if (root.ResizeObserver) new root.ResizeObserver(function() { redraw(); }).observe(canvas);
      if (root.IntersectionObserver) {
        new root.IntersectionObserver(function(entries) {
          onScreen = entries[entries.length - 1].isIntersecting;
          if (onScreen) redraw();
          wake();
        }).observe(canvas);
      } else {
        onScreen = true;
      }
      documentRef.addEventListener("visibilitychange", wake);
      if (reducedMotionQuery && reducedMotionQuery.addEventListener) {
        reducedMotionQuery.addEventListener("change", function() { redraw(); wake(); });
      }
    }

    function uploadGrid() {
      if (cover || !gl || lost) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, visibilityTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, grid.columns, grid.rows, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, grid.data);
      gl.uniform2f(uniforms.grid, grid.columns, grid.rows);
    }

    // The art is downscaled once to roughly the displayed width: WebGL 1 has no
    // mipmaps for this non-power-of-two image, and this keeps the drift crisp.
    function uploadFog() {
      if (!gl || lost) return;
      if (!fogImage) { gl.uniform1f(uniforms.fogReady, 0); return; }
      const wanted = Math.max(256, Math.min(fogImage.naturalWidth, canvas.width || fogImage.naturalWidth));
      if (fogUploadedWidth && Math.abs(wanted - fogUploadedWidth) / fogUploadedWidth < .25) return;
      const scaled = documentRef.createElement("canvas");
      scaled.width = wanted;
      scaled.height = Math.max(1, Math.round(fogImage.naturalHeight * wanted / fogImage.naturalWidth));
      const context = scaled.getContext("2d");
      context.imageSmoothingQuality = "high";
      context.drawImage(fogImage, 0, 0, scaled.width, scaled.height);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fogTexture);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scaled);
      } catch (error) {
        textureFailed();
        return;
      }
      gl.uniform1f(uniforms.fogReady, 1);
      fogUploadedWidth = wanted;
      if (!fogReady) {
        fogReady = true;
        if (typeof settings.onReady === "function") settings.onReady();
      }
    }

    function textureFailed() {
      if (textureBroken) return;
      textureBroken = true;
      fogReady = false;
      stop();
      notify();
    }

    function fitCanvas() {
      const ratio = Math.min(settings.maxPixelRatio, root.devicePixelRatio || 1);
      let width = canvas.clientWidth * ratio;
      let height = canvas.clientHeight * ratio;
      const longest = Math.max(width, height);
      if (longest > settings.maxCanvasSide) {
        width *= settings.maxCanvasSide / longest;
        height *= settings.maxCanvasSide / longest;
      }
      width = Math.max(1, Math.round(width));
      height = Math.max(1, Math.round(height));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        uploadFog();
      }
    }

    function drawCover(now) {
      const boxAspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      const artAspect = fogImage ? fogImage.naturalWidth / Math.max(1, fogImage.naturalHeight) : 1;
      if (boxAspect > artAspect) gl.uniform2f(uniforms.cover, 1, artAspect / boxAspect);
      else gl.uniform2f(uniforms.cover, boxAspect / artAspect, 1);
      const animate = moving();
      [[uniforms.layerA, uniforms.shiftA], [uniforms.layerB, uniforms.shiftB]].forEach(function(slots, index) {
        const layer = settings.layers[index];
        if (!layer) { gl.uniform3f(slots[0], 0, 0, 1); return; }
        const pose = coverPose(layer, now, animate);
        gl.uniform3f(slots[0], layer.inset || 0, layer.opacity == null ? 1 : layer.opacity, pose.scale);
        gl.uniform2f(slots[1], pose.x, pose.y);
      });
    }

    function draw() {
      if (!gl || lost || textureBroken || !canvas.isConnected || !canvas.clientWidth) return;
      fitCanvas();
      if (textureBroken) return;
      const now = Date.now();
      if (cover) {
        drawCover(now);
      } else {
        const periods = settings.periodsMs;
        gl.uniform2f(uniforms.drift, (now % periods[0]) / periods[0] * 2, (now % periods[1]) / periods[1] * 2);
        const seconds = (now % 1000000) / 1000;
        gl.uniform2f(uniforms.edgeDrift, (seconds * .004) % 1, (seconds * .0015) % 1);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function moving() {
      return settings.motion && !(reducedMotionQuery && reducedMotionQuery.matches);
    }

    function canAnimateNow() {
      return onScreen && !documentRef.hidden
        && !(documentRef.body && documentRef.body.classList.contains("mini-game-runtime-active"))
        && !(typeof settings.isPaused === "function" && settings.isPaused());
    }

    // One self-pausing loop at a modest cadence. Off screen, in a hidden tab,
    // under a mini-game or while the caller pauses it, it only checks back
    // twice a second.
    function loop() {
      timer = 0;
      if (!gl || lost || textureBroken || !canvas.isConnected || !moving()) return;
      if (!canAnimateNow()) { timer = root.setTimeout(loop, 500); return; }
      frame = root.requestAnimationFrame(function() {
        frame = 0;
        draw();
        if (!timer) timer = root.setTimeout(loop, 1000 / settings.framesPerSecond);
      });
    }

    function wake() {
      if (!timer && !frame) loop();
    }

    function stop() {
      if (timer) root.clearTimeout(timer);
      if (frame) root.cancelAnimationFrame(frame);
      timer = 0;
      frame = 0;
    }

    function redraw() {
      if (available) draw();
    }

    return {
      // True while the WebGL path can render; otherwise use the static fallback.
      supported: function() {
        init();
        return Boolean(available && !lost && !disabled && !textureBroken);
      },
      // True once the fog art is on the GPU: a cover host may hide its CSS fog.
      ready: function() {
        return this.supported() && fogReady;
      },
      // Places the persistent canvas in `host` and renders it immediately.
      // grid: `revealed` lists {column, row} with row 0 at the top, so covered
      // cells are opaque from the first frame. cover: only `host` is used.
      mount: function(host, columns, rows, revealed) {
        if (!this.supported() || !host) return false;
        if (!cover) {
          const data = new Uint8Array(columns * rows);
          revealed.forEach(function(cell) {
            if (cell.column >= 0 && cell.column < columns && cell.row >= 0 && cell.row < rows) data[cell.row * columns + cell.column] = 255;
          });
          grid = {columns: columns, rows: rows, data: data};
        }
        if (canvas.parentNode !== host) host.appendChild(canvas);
        uploadGrid();
        draw();
        wake();
        return true;
      },
      // Rollback / test switch: callers fall back to their static fog.
      disable: function() {
        disabled = true;
        fogReady = false;
        stop();
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        notify();
      },
      // Renders one frame: alpha top row first, plus the raw RGBA (bottom row first).
      sampleAlpha: function() {
        if (!this.supported() || !canvas.isConnected) return null;
        draw();
        const width = canvas.width, height = canvas.height;
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        const alpha = new Uint8Array(width * height);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) alpha[y * width + x] = pixels[((height - 1 - y) * width + x) * 4 + 3];
        }
        return {width: width, height: height, alpha: alpha, pixels: pixels};
      },
      canvas: function() { return canvas; }
    };
  }

  CatInc.createFogLayer = createFogLayer;
})(typeof window !== "undefined" ? window : globalThis);
