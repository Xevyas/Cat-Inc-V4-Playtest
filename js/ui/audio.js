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
    dialogueVoices: Object.freeze([
      "Sounds/Voices/Kid voice var 1.wav",
      "Sounds/Voices/Kid voice var 2.wav",
      "Sounds/Voices/Kid voice var 3.wav"
    ]),
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
  let assignmentMeowIndex = 0;
  let lastDialogueVoiceIndex = -1;
  let dialogueVoiceAudio = null;
  let musicAudio = null;
  let radioRequested = false;
  let radioTrackIndex = -1;
  let radioDeck = [];
  let radioFailedTracks = 0;
  let radioPlaybackAttempt = 0;
  let radioFailureHandledAttempt = -1;

  function clampVolume(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(1, number));
  }

  function play(source, volume) {
    if (typeof root.Audio !== "function") return null;
    const audio = new root.Audio(source);
    audio.preload = "auto";
    audio.volume = clampVolume(volume);
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(function() {});
    return audio;
  }

  function playDialogueVoice(volume) {
    const choices = SOURCES.dialogueVoices.map(function(source, index) {
      return { source: source, index: index };
    }).filter(function(choice) {
      return choice.index !== lastDialogueVoiceIndex;
    });
    if (!choices.length) return;
    const selected = choices[Math.floor(Math.random() * choices.length)];
    lastDialogueVoiceIndex = selected.index;
    if (dialogueVoiceAudio) {
      dialogueVoiceAudio.pause();
      try { dialogueVoiceAudio.currentTime = 0; } catch (error) {}
    }
    dialogueVoiceAudio = play(selected.source, volume);
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
    advanceRadio(musicAudio ? musicAudio.volume : 0);
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
    if (promise && typeof promise.catch === "function") {
      promise.catch(function() { handleRadioFailure(attempt); });
    }
    return true;
  }

  function ensureMusic(volume) {
    if (typeof root.Audio !== "function") return null;
    if (!musicAudio) {
      musicAudio = new root.Audio();
      musicAudio.preload = "none";
      musicAudio.addEventListener("ended", function() {
        radioFailedTracks = 0;
        advanceRadio(musicAudio.volume);
      });
      musicAudio.addEventListener("error", function() {
        handleRadioFailure(radioPlaybackAttempt);
      });
    }
    musicAudio.volume = clampVolume(volume);
    return musicAudio;
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
    const value = clampVolume(volume);
    const audio = musicAudio ? ensureMusic(value) : null;
    if (!audio) return;
    audio.volume = value;
  }

  CatInc.audio = Object.freeze({
    sources: SOURCES,
    playCatAssignment: function(volume) {
      var meow = assignmentMeowIndex === 0 ? SOURCES.meowNormal : SOURCES.meowStrong;
      assignmentMeowIndex = assignmentMeowIndex === 0 ? 1 : 0;
      play(meow, volume);
    },
    playCatMeow: function(volume) {
      play(SOURCES.meowPurr, volume);
    },
    playBirdWingFlaps: function(volume) {
      play(SOURCES.birdWingFlaps, volume);
    },
    playExplorationReveal: function(volume) {
      play(SOURCES.explorationReveal, volume);
    },
    playRewardChest: function(volume) {
      play(SOURCES.rewardChest, volume);
    },
    playRepair: function(volume) {
      play(SOURCES.repair, volume);
    },
    playHandsawWood: function(volume) {
      play(SOURCES.handsawWood, volume);
    },
    playDialogueVoice: function(volume) {
      playDialogueVoice(volume);
    },
    startRadio: function(volume) {
      return startRadio(volume);
    },
    stopRadio: function() {
      stopRadio();
    },
    isRadioOn: function() {
      return radioRequested;
    },
    setMusicVolume: function(volume) {
      setMusicVolume(volume);
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
