(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const FRAME_DT_MAX = 0.05;

  // Shared mini-game runtime: one active session at a time, one managed
  // requestAnimationFrame loop per animation id and compositor-driven cursors.
  // Game rules and rewards stay in their own controllers; this module only owns
  // the session/animation lifecycle and receives its environment explicitly.
  function createController(options) {
    const documentRef = options.document;
    const requestFrame = options.requestAnimationFrame;
    const cancelFrame = options.cancelAnimationFrame;
    const now = options.now;
    const onSessionOpen = options.onSessionOpen;
    const onSessionClose = options.onSessionClose;
    const render = options.render;

    const state = {
      actif: null,
      generation: 0,
      animations: new Map(),
      layoutVersion: 0,
      renduEnAttente: false
    };

    function isActive(id) {
      return id ? state.actif === id : state.actif !== null;
    }

    function openSession(id) {
      if (!id || state.actif) return false;
      state.actif = id;
      state.generation += 1;
      state.layoutVersion += 1;
      state.renduEnAttente = false;
      if (documentRef.body) {
        documentRef.body.classList.add("mini-game-runtime-active");
        documentRef.body.dataset.activeMiniGame = id;
      }
      onSessionOpen(id);
      return true;
    }

    function releaseAnimation(id, animation) {
      if (animation.raf !== null) cancelFrame(animation.raf);
      animation.raf = null;
      animation.effets.forEach(function(effet) { effet.cancel(); });
      animation.effets = [];
      if (state.animations.get(id) === animation) state.animations.delete(id);
    }

    function stopAnimation(id) {
      const animation = state.animations.get(id);
      if (animation) releaseAnimation(id, animation);
    }

    function startAnimation(id, callback) {
      if (!isActive(id) || typeof callback !== "function") return false;
      stopAnimation(id);
      const generation = state.generation;
      const animation = {
        raf: null,
        effets: [],
        last: now(),
        layoutVersion: -1
      };

      function frame(timestamp) {
        animation.raf = null;
        if (!isActive(id) || generation !== state.generation) {
          releaseAnimation(id, animation);
          return;
        }
        const dt = Math.min(FRAME_DT_MAX, Math.max(0, (timestamp - animation.last) / 1000));
        const layoutChanged = animation.layoutVersion !== state.layoutVersion;
        animation.last = timestamp;
        animation.layoutVersion = state.layoutVersion;
        const continuer = callback(dt, { layoutChanged: layoutChanged, timestamp: timestamp });
        if (continuer === false || !isActive(id) || generation !== state.generation) {
          releaseAnimation(id, animation);
          return;
        }
        if (state.animations.get(id) === animation) animation.raf = requestFrame(frame);
      }

      animation.raf = requestFrame(frame);
      state.animations.set(id, animation);
      return true;
    }

    function closeSession(id) {
      stopAnimation(id);
      if (!isActive(id)) return;
      onSessionClose(id);
      state.actif = null;
      state.generation += 1;
      if (documentRef.body) {
        documentRef.body.classList.remove("mini-game-runtime-active");
        delete documentRef.body.dataset.activeMiniGame;
      }
      const renduRequis = state.renduEnAttente;
      state.renduEnAttente = false;
      requestFrame(function() {
        // One clean foreground refresh replaces every skipped background render.
        if (renduRequis || !isActive()) render();
      });
    }

    function resetClocks() {
      state.layoutVersion += 1;
      const maintenant = now();
      state.animations.forEach(function(animation) {
        animation.last = maintenant;
      });
    }

    function cursorTransform(largeurPiste, pourcentage) {
      const x = Math.max(0, Math.min(100, pourcentage)) / 100 * Math.max(0, largeurPiste || 0);
      return "translate3d(" + x.toFixed(2) + "px, 0, 0) translateX(-50%)";
    }

    function positionCursor(cursor, largeurPiste, pourcentage) {
      if (!cursor) return;
      cursor.style.transform = cursorTransform(largeurPiste, pourcentage);
    }

    // #324: Firefox repaints the whole page whenever script moves a cursor, even through
    // `transform`. A constant-speed cursor is therefore a Web Animations effect the
    // compositor plays. It belongs to the runtime animation `id` (started first), which
    // cancels it with the frame loop; the frame loop reads the position back from the
    // effect's own clock, so the judged position is the displayed one.
    function animateCursor(id, cursor, cursorOptions) {
      const animation = state.animations.get(id);
      const vitesse = Number(cursorOptions && cursorOptions.vitesse);
      if (!animation || !cursor || typeof cursor.animate !== "function" || !(vitesse > 0)) return null;
      const dureeMs = 100 / vitesse * 1000;
      const rebond = cursorOptions.rebond === true;
      const effet = cursor.animate(cursorOptions.images(), {
        duration: dureeMs,
        iterations: Infinity,
        direction: rebond ? "alternate" : "normal",
        easing: "linear"
      });
      animation.effets.push(effet);
      return {
        pourcentage: function() {
          const progression = Math.max(0, Number(effet.currentTime) || 0) / dureeMs;
          const cycle = Math.floor(progression);
          const fraction = progression - cycle;
          return (rebond && cycle % 2 === 1 ? 1 - fraction : fraction) * 100;
        },
        actualiserImages: function() {
          if (effet.effect && typeof effet.effect.setKeyframes === "function") effet.effect.setKeyframes(cursorOptions.images());
        }
      };
    }

    // Bouncing track cursor (Catch a Cat, Bird). `onFrame(pourcentage)` returns false to
    // stop. Browsers without Web Animations keep the scripted per-frame cursor.
    function animateTrackCursor(id, cursor, vitesse, onFrame) {
      const track = cursor ? cursor.closest(".bird-track") : null;
      let largeurPiste = track ? track.clientWidth : 0;
      let pourcentage = 0;
      let direction = 1;
      let curseur = null;
      positionCursor(cursor, largeurPiste, pourcentage);
      const demarre = startAnimation(id, function(dt, frameInfo) {
        if (frameInfo.layoutChanged && track) {
          largeurPiste = track.clientWidth;
          if (curseur) curseur.actualiserImages();
        }
        if (curseur) {
          pourcentage = curseur.pourcentage();
        } else {
          pourcentage += direction * vitesse * dt;
          if (pourcentage >= 100) { pourcentage = 100; direction = -1; }
          if (pourcentage <= 0) { pourcentage = 0; direction = 1; }
          positionCursor(cursor, largeurPiste, pourcentage);
        }
        return onFrame(pourcentage);
      });
      if (!demarre) return false;
      curseur = animateCursor(id, cursor, {
        vitesse: vitesse,
        rebond: true,
        images: function() {
          return [
            { transform: cursorTransform(largeurPiste, 0) },
            { transform: cursorTransform(largeurPiste, 100) }
          ];
        }
      });
      return true;
    }

    return Object.freeze({
      state: state,
      isActive: isActive,
      openSession: openSession,
      stopAnimation: stopAnimation,
      startAnimation: startAnimation,
      closeSession: closeSession,
      resetClocks: resetClocks,
      cursorTransform: cursorTransform,
      positionCursor: positionCursor,
      animateCursor: animateCursor,
      animateTrackCursor: animateTrackCursor
    });
  }

  CatInc.miniGameRuntime = Object.freeze({
    FRAME_DT_MAX: FRAME_DT_MAX,
    createController: createController
  });
})(typeof window !== "undefined" ? window : globalThis);
