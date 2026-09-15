(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};
  const SOURCES = Object.freeze({
    meowNormal: "Sounds/Meows/Meow Normal.mp3",
    meowPurr: "Sounds/Meows/Meow Purr.mp3",
    meowStrong: "Sounds/Meows/Meow Strong.mp3",
    birdWingFlaps: "Sounds/Bird/Bird Wing Flaps.mp3",
    explorationReveal: "Sounds/Other/Exploration Reveal.mp3",
    rewardChest: "Sounds/Other/Reward Chest.mp3",
    repair: "Sounds/Other/Repair.mp3",
    handsawWood: "Sounds/Other/Handsaw Wood.mp3",
    workFood: "Sounds/Other/Work Food.mp3",
    workRock: "Sounds/Other/Work Rock.mp3",
    buildPlace: "Sounds/Other/Build Place.mp3",
    uiClick: "Sounds/Other/UI Click.mp3",
    uiBackClose: "Sounds/Other/UI Back_Close.mp3",
    uiDeniedError: "Sounds/Other/UI Denied_Error.mp3",
    smallSuccess: "Sounds/Other/Small Success.mp3",
    bigReward: "Sounds/Other/Big Reward.mp3",
    dialogueBernardo: "Sounds/Other/Dialogue Bernardo.mp3",
    dialogueGeneric: "Sounds/Other/Dialogue Generic.mp3",
    eating: "Sounds/Other/Eating.mp3",
    radioPlaylist: Object.freeze([
      "Sounds/Radio/SunbeamsAndMeadows.ogg",
      "Sounds/Radio/Cattails.ogg",
      "Sounds/Radio/EveningDrive.ogg",
      "Sounds/Radio/GroovingOn.ogg",
      "Sounds/Radio/NeonAlley.ogg",
      "Sounds/Radio/Snowdrifts.ogg",
      "Sounds/Radio/ChillVibe3.ogg",
      "Sounds/Radio/ChillVibe4.ogg",
      "Sounds/Radio/5. Moonlight Lullaby.ogg",
      "Sounds/Radio/8. The Call of the Night.ogg",
      "Sounds/Radio/9. Uncertainty.ogg",
      "Sounds/Radio/10. Silence of Baba Yaga.ogg",
      "Sounds/Radio/11. Flash form the Past.ogg",
      "Sounds/Radio/12. Winning with a Sacrifice.ogg",
      "Sounds/Radio/16. Crest.ogg",
      "Sounds/Radio/18. Coherent.ogg"
    ])
  });
  const SHORT_EFFECT_KEYS = Object.freeze(Object.keys(SOURCES).filter(function(key) {
    return key !== "radioPlaylist";
  }));
  const RELATIVE_GAIN = Object.freeze({
    dialogueBernardo: 0.42,
    dialogueGeneric: 0.42,
    uiClick: 0.58,
    uiBackClose: 0.62,
    uiDeniedError: 0.62,
    smallSuccess: 0.72,
    handsawWood: 0.82,
    eating: 0.82,
    workFood: 0.82,
    workRock: 0.82,
    buildPlace: 0.88,
    bigReward: 1
  });

  let assignmentMeowIndex = 0;
  let musicAudio = null;
  let radioRequested = false;
  let radioTrackIndex = -1;
  let radioDeck = [];
  let radioFailedTracks = 0;
  let radioPlaybackAttempt = 0;
  let radioFailureHandledAttempt = -1;
  let audioContext = null;
  let effectsGain = null;
  let effectsVolume = 0.3;
  let musicSource = null;
  let musicGain = null;
  let nativeMusicVolumeSupported = null;
  let musicVolume = 0.3;
  let decodedCount = 0;
  let playCount = 0;
  let lastPlayed = null;
  const effectBuffers = new Map();
  const encodedPromises = new Map();
  const decodePromises = new Map();
  const preloadErrors = new Map();
  const activeGroups = new Map();
  let activeActivation = null;

  function clampVolume(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(1, number));
  }

  function ensureEffectsContext() {
    if (audioContext && audioContext.state !== "closed") return audioContext;
    const AudioContextCtor = root.AudioContext || root.webkitAudioContext;
    if (typeof AudioContextCtor !== "function") return null;
    try {
      try { audioContext = new AudioContextCtor({ latencyHint: "interactive" }); }
      catch (error) { audioContext = new AudioContextCtor(); }
      effectsGain = audioContext.createGain();
      effectsGain.gain.value = effectsVolume;
      effectsGain.connect(audioContext.destination);
    } catch (error) {
      audioContext = null;
      effectsGain = null;
    }
    return audioContext;
  }

  function fetchEffect(key) {
    if (encodedPromises.has(key)) return encodedPromises.get(key);
    if (typeof root.fetch !== "function") return Promise.resolve(null);
    const encoded = root.fetch(SOURCES[key], { cache: "force-cache" })
      .then(function(response) {
        if (!response.ok) throw new Error("Unable to preload " + SOURCES[key]);
        return response.arrayBuffer();
      })
      .catch(function(error) {
        encodedPromises.delete(key);
        preloadErrors.set(key, error && error.message ? error.message : String(error));
        return null;
      });
    encodedPromises.set(key, encoded);
    return encoded;
  }

  function preloadEncodedEffects() {
    if (typeof root.fetch !== "function") return Promise.resolve(false);
    return Promise.all(SHORT_EFFECT_KEYS.map(fetchEffect)).then(function(results) {
      return results.some(Boolean);
    });
  }

  function decodeEffect(context, key) {
    if (effectBuffers.has(key)) return Promise.resolve(effectBuffers.get(key));
    if (decodePromises.has(key)) return decodePromises.get(key);
    const pending = fetchEffect(key)
      .then(function(bytes) {
        if (!bytes) return null;
        const decodable = bytes && typeof bytes.slice === "function" ? bytes.slice(0) : bytes;
        return context.decodeAudioData(decodable);
      })
      .then(function(buffer) {
        if (!buffer) return null;
        if (!effectBuffers.has(key)) {
          effectBuffers.set(key, buffer);
          decodedCount += 1;
        }
        preloadErrors.delete(key);
        return buffer;
      })
      .catch(function(error) {
        preloadErrors.set(key, error && error.message ? error.message : String(error));
        return null;
      })
      .then(function(result) {
        decodePromises.delete(key);
        return result;
      });
    decodePromises.set(key, pending);
    return pending;
  }

  function preloadShortEffects() {
    return preloadEncodedEffects().then(function() {
      const context = audioContext && audioContext.state !== "closed" ? audioContext : null;
      if (!context) return false;
      return Promise.all(SHORT_EFFECT_KEYS.map(function(key) {
        return decodeEffect(context, key);
      })).then(function() { return effectBuffers.size > 0; });
    });
  }

  function resumeShortEffects() {
    const context = ensureEffectsContext();
    if (!context) return Promise.resolve(false);

    // Creating and starting a silent source inside the trusted activation stack
    // unlocks Web Audio on WebKit without coupling SFX to the Radio element.
    if ((context.state === "suspended" || context.state === "interrupted")
      && typeof context.createBuffer === "function") {
      try {
        const unlockSource = context.createBufferSource();
        unlockSource.buffer = context.createBuffer(1, 1, 22050);
        unlockSource.connect(context.destination);
        unlockSource.start(0);
      } catch (error) {}
    }
    const needsResume = context.state === "suspended" || context.state === "interrupted";
    const resumed = needsResume && typeof context.resume === "function" ? context.resume() : null;
    return Promise.resolve(resumed).then(function() {
      return preloadShortEffects().then(function() { return context.state !== "closed"; });
    }).catch(function() { return false; });
  }

  function stopGroup(group) {
    const active = activeGroups.get(group);
    if (!active) return;
    try { active.stop(); } catch (error) {}
    if (typeof active.pause === "function") active.pause();
    try { if (typeof active.currentTime === "number") active.currentTime = 0; } catch (error) {}
    activeGroups.delete(group);
  }

  function playHtmlFallback(key, relativeGain, group) {
    if (typeof root.Audio !== "function") return null;
    if (group) stopGroup(group);
    const audio = new root.Audio(SOURCES[key]);
    audio.preload = "auto";
    audio.volume = clampVolume(effectsVolume * relativeGain);
    if (group) activeGroups.set(group, audio);
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(function() {});
    return audio;
  }

  function markSpecializedActivation() {
    if (activeActivation) activeActivation.specialized = true;
  }

  function playEffect(key, volume, options) {
    if (!SOURCES[key] || key === "radioPlaylist") return null;
    effectsVolume = clampVolume(volume === undefined ? effectsVolume : volume);
    if (effectsGain) effectsGain.gain.value = effectsVolume;
    const config = options || {};
    playCount += 1;
    lastPlayed = key;
    const relativeGain = RELATIVE_GAIN[key] === undefined ? 0.78 : RELATIVE_GAIN[key];
    if (config.specialized !== false) markSpecializedActivation();
    const context = audioContext;
    const buffer = effectBuffers.get(key);
    if (!context || !effectsGain || !buffer || context.state === "closed") {
      return playHtmlFallback(key, relativeGain, config.group);
    }
    if (context.state === "suspended" || context.state === "interrupted") resumeShortEffects();
    if (config.group) stopGroup(config.group);
    const source = context.createBufferSource();
    const sourceGain = context.createGain();
    source.buffer = buffer;
    sourceGain.gain.value = relativeGain;
    source.connect(sourceGain);
    sourceGain.connect(effectsGain);
    if (config.group) {
      activeGroups.set(config.group, source);
      source.onended = function() {
        if (activeGroups.get(config.group) === source) activeGroups.delete(config.group);
      };
    }
    source.start(0);
    return source;
  }

  function playLoopingEffect(key, volume, durationMs) {
    if (!SOURCES[key] || key === "radioPlaylist") return null;
    effectsVolume = clampVolume(volume === undefined ? effectsVolume : volume);
    if (effectsGain) effectsGain.gain.value = effectsVolume;
    markSpecializedActivation();
    playCount += 1;
    lastPlayed = key;
    stopGroup("feeding");

    const totalMs = Math.max(420, Math.min(1800, Number(durationMs) || 900));
    const fadeMs = Math.min(260, Math.max(140, totalMs * 0.28));
    const relativeGain = RELATIVE_GAIN[key] === undefined ? 0.78 : RELATIVE_GAIN[key];
    const context = audioContext;
    const buffer = effectBuffers.get(key);
    if (context && effectsGain && buffer && context.state !== "closed") {
      if (context.state === "suspended" || context.state === "interrupted") resumeShortEffects();
      const source = context.createBufferSource();
      const sourceGain = context.createGain();
      const now = context.currentTime || 0;
      const fadeStart = now + (totalMs - fadeMs) / 1000;
      const stopAt = now + totalMs / 1000;
      source.buffer = buffer;
      source.loop = true;
      sourceGain.gain.value = relativeGain;
      if (typeof sourceGain.gain.setValueAtTime === "function") {
        sourceGain.gain.setValueAtTime(relativeGain, now);
        sourceGain.gain.setValueAtTime(relativeGain, fadeStart);
        sourceGain.gain.linearRampToValueAtTime(0, stopAt);
      }
      source.connect(sourceGain);
      sourceGain.connect(effectsGain);
      activeGroups.set("feeding", source);
      source.onended = function() {
        if (activeGroups.get("feeding") === source) activeGroups.delete("feeding");
      };
      source.start(0);
      source.stop(stopAt + 0.02);
      return source;
    }

    if (typeof root.Audio !== "function") return null;
    const audio = new root.Audio(SOURCES[key]);
    audio.preload = "auto";
    audio.loop = true;
    const fullVolume = clampVolume(effectsVolume * relativeGain);
    audio.volume = fullVolume;
    let fadeTimer = null;
    let stopTimer = null;
    const controller = {
      pause: function() { audio.pause(); },
      stop: function() {
        if (fadeTimer) root.clearInterval(fadeTimer);
        if (stopTimer) root.clearTimeout(stopTimer);
        audio.pause();
        try { audio.currentTime = 0; } catch (error) {}
        if (activeGroups.get("feeding") === controller) activeGroups.delete("feeding");
      }
    };
    activeGroups.set("feeding", controller);
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(function() {});
    stopTimer = root.setTimeout(function() {
      const steps = 8;
      let step = 0;
      fadeTimer = root.setInterval(function() {
        step += 1;
        audio.volume = clampVolume(fullVolume * (1 - step / steps));
        if (step >= steps) controller.stop();
      }, fadeMs / steps);
    }, totalMs - fadeMs);
    return controller;
  }

  function setEffectsVolume(volume) {
    effectsVolume = clampVolume(volume);
    if (effectsGain) effectsGain.gain.value = effectsVolume;
  }

  function eventControl(event) {
    if (!event || !event.target || typeof event.target.closest !== "function") return null;
    return event.target.closest("button, [role=button], [role=tab], [data-clavier-clic], input[type=button], input[type=submit]");
  }

  function isBackControl(control) {
    if (!control) return false;
    if (control.dataset && control.dataset.audioSemantic === "back") return true;
    const classes = String(control.className || "");
    const label = String(control.getAttribute && control.getAttribute("aria-label") || "")
      + " " + String(control.textContent || "");
    return /(?:^|\s)(?:explo-modal-close|book-learning-close|work-confirm-cancel|camp-prototype-placement-cancel|exploration-mobile-back|bird-skip-btn)(?:\s|$)/.test(classes)
      || /\b(?:close|back|cancel|dismiss|give up|leave)\b/i.test(label);
  }

  function isGenericControl(control) {
    if (!control || control.disabled || control.getAttribute("aria-disabled") === "true") return false;
    if (control.dataset && control.dataset.audioSemantic === "none") return false;
    return true;
  }

  function installActivationOwner() {
    const document = root.document;
    if (!document || typeof document.addEventListener !== "function") return;
    ["pointerdown", "touchstart", "keydown"].forEach(function(eventName) {
      document.addEventListener(eventName, resumeShortEffects, { capture: true, passive: true });
    });
    document.addEventListener("click", function(event) {
      resumeShortEffects();
      activeActivation = { event: event, specialized: false };
    }, true);
    document.addEventListener("click", function(event) {
      const activation = activeActivation;
      const control = eventControl(event);
      Promise.resolve().then(function() {
        if (activeActivation === activation) activeActivation = null;
        if (!activation || activation.specialized || !isGenericControl(control)) return;
        playEffect(isBackControl(control) ? "uiBackClose" : "uiClick", effectsVolume, { specialized: false });
      });
    }, false);
    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState === "visible") preloadEncodedEffects();
    });
  }

  function buildRadioDeck() {
    const length = SOURCES.radioPlaylist.length;
    const deck = Array.from({ length: length }, function(unused, index) { return index; });
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const value = deck[index];
      deck[index] = deck[swapIndex];
      deck[swapIndex] = value;
    }
    if (deck.length > 1 && deck[0] === radioTrackIndex) {
      const value = deck[0];
      deck[0] = deck[1];
      deck[1] = value;
    }
    return deck;
  }

  function chooseRadioTrack() {
    if (!SOURCES.radioPlaylist.length) return -1;
    if (!radioDeck.length) radioDeck = buildRadioDeck();
    return radioDeck.shift();
  }

  function handleRadioFailure(attempt) {
    if (!radioRequested || attempt !== radioPlaybackAttempt || radioFailureHandledAttempt === attempt) return;
    radioFailureHandledAttempt = attempt;
    radioFailedTracks += 1;
    advanceRadio(musicVolume);
  }

  function advanceRadio(volume) {
    if (!radioRequested || !SOURCES.radioPlaylist.length) return false;
    if (radioFailedTracks >= SOURCES.radioPlaylist.length) {
      stopRadio();
      return false;
    }
    radioTrackIndex = chooseRadioTrack();
    const audio = ensureMusic(volume);
    if (!audio || radioTrackIndex < 0) return false;
    audio.src = SOURCES.radioPlaylist[radioTrackIndex];
    audio.preload = "auto";
    const attempt = ++radioPlaybackAttempt;
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(function() { handleRadioFailure(attempt); });
    return true;
  }

  function ensureMusic(volume) {
    if (typeof root.Audio !== "function") return null;
    musicVolume = clampVolume(volume);
    if (!musicAudio) {
      musicAudio = new root.Audio();
      musicAudio.preload = "none";
      musicAudio.addEventListener("ended", function() {
        radioFailedTracks = 0;
        advanceRadio(musicVolume);
      });
      musicAudio.addEventListener("error", function() { handleRadioFailure(radioPlaybackAttempt); });
    }
    ensureMusicOutput();
    applyMusicVolume();
    return musicAudio;
  }

  function supportsNativeMusicVolume() {
    if (!musicAudio) return false;
    if (nativeMusicVolumeSupported !== null) return nativeMusicVolumeSupported;
    const original = clampVolume(musicAudio.volume);
    const probe = Math.abs(original - 0.473) < 0.001 ? 0.619 : 0.473;
    try {
      musicAudio.volume = probe;
      nativeMusicVolumeSupported = Math.abs(Number(musicAudio.volume) - probe) < 0.001;
      musicAudio.volume = original;
    } catch (error) {
      nativeMusicVolumeSupported = false;
      try { musicAudio.volume = original; } catch (restoreError) {}
    }
    return nativeMusicVolumeSupported;
  }

  function ensureMusicOutput() {
    if (!musicAudio || supportsNativeMusicVolume()) return false;
    if (musicGain) return true;
    const context = audioContext || ensureEffectsContext();
    if (!context || typeof context.createMediaElementSource !== "function") return false;
    try {
      musicSource = context.createMediaElementSource(musicAudio);
      musicGain = context.createGain();
      musicSource.connect(musicGain);
      musicGain.connect(context.destination);
      return true;
    } catch (error) {
      musicSource = null;
      musicGain = null;
      return false;
    }
  }

  function applyMusicVolume() {
    if (!musicAudio) return;
    if (musicGain) {
      musicGain.gain.value = musicVolume;
      musicAudio.volume = 1;
      return;
    }
    musicAudio.volume = musicVolume;
  }

  function startRadio(volume) {
    radioRequested = true;
    radioFailedTracks = 0;
    const audio = ensureMusic(volume);
    if (!audio) return false;
    if (!audio.src) return advanceRadio(volume);
    if (!audio.paused) return true;
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") {
      const attempt = radioPlaybackAttempt;
      promise.catch(function() { handleRadioFailure(attempt); });
    }
    return true;
  }

  function stopRadio() {
    radioRequested = false;
    radioFailedTracks = 0;
    if (musicAudio) musicAudio.pause();
  }

  function setMusicVolume(volume) {
    musicVolume = clampVolume(volume);
    if (musicAudio) {
      ensureMusicOutput();
      applyMusicVolume();
    }
  }

  CatInc.audio = Object.freeze({
    sources: SOURCES,
    shortEffectKeys: SHORT_EFFECT_KEYS,
    preloadShortEffects: preloadShortEffects,
    resumeShortEffects: resumeShortEffects,
    setEffectsVolume: setEffectsVolume,
    playSemantic: function(key, volume) { return playEffect(key, volume); },
    playCatAssignment: function(volume) {
      const meow = assignmentMeowIndex === 0 ? "meowNormal" : "meowStrong";
      assignmentMeowIndex = assignmentMeowIndex === 0 ? 1 : 0;
      playEffect(meow, volume);
    },
    playCatMeow: function(volume) { playEffect("meowPurr", volume); },
    playBirdWingFlaps: function(volume) { playEffect("birdWingFlaps", volume); },
    playExplorationReveal: function(volume) { playEffect("explorationReveal", volume); },
    playRewardChest: function(volume) { playEffect("rewardChest", volume); },
    playRepair: function(volume) { playEffect("repair", volume); },
    playHandsawWood: function(volume) { playEffect("handsawWood", volume); },
    playWorkFood: function(volume) { playEffect("workFood", volume); },
    playWorkRock: function(volume) { playEffect("workRock", volume); },
    playBuildPlace: function(volume) { playEffect("buildPlace", volume); },
    playDenied: function(volume) { playEffect("uiDeniedError", volume); },
    playSmallSuccess: function(volume) { playEffect("smallSuccess", volume); },
    playBigReward: function(volume) { playEffect("bigReward", volume); },
    playDialogueVoice: function(speakerId, volume) {
      playEffect(speakerId === "bernardo" ? "dialogueBernardo" : "dialogueGeneric", volume, { group: "dialogue" });
    },
    playEating: function(volume, options) {
      const config = options || {};
      return config.loop
        ? playLoopingEffect("eating", volume, config.durationMs)
        : playEffect("eating", volume, { group: "feeding" });
    },
    stopEating: function() { stopGroup("feeding"); },
    startRadio: startRadio,
    stopRadio: stopRadio,
    isRadioOn: function() { return radioRequested; },
    setMusicVolume: setMusicVolume,
    getShortEffectStatus: function() {
      return Object.freeze({
        backend: audioContext ? "web-audio" : "html-audio-fallback",
        contextState: audioContext ? audioContext.state : "unavailable",
        decoded: decodedCount,
        expected: SHORT_EFFECT_KEYS.length,
        playCount: playCount,
        lastPlayed: lastPlayed,
        preloadFailures: preloadErrors.size,
        preloadError: preloadErrors.size ? Array.from(preloadErrors.values())[0] : null,
        musicBackend: musicGain ? "web-audio-gain" : "html-audio-volume",
        musicVolume: musicVolume
      });
    }
  });
  installActivationOwner();
  preloadEncodedEffects();
})(typeof window !== "undefined" ? window : globalThis);
