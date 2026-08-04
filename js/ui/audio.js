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
    music: "Sounds/Music/Base Music Test.ogg"
  });
  let assignmentMeowIndex = 0;
  let lastDialogueVoiceIndex = -1;
  let dialogueVoiceAudio = null;
  let musicAudio = null;

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

  function ensureMusic(volume) {
    if (typeof root.Audio !== "function") return null;
    if (!musicAudio) {
      musicAudio = new root.Audio(SOURCES.music);
      musicAudio.preload = "auto";
      musicAudio.loop = true;
    }
    musicAudio.volume = clampVolume(volume);
    return musicAudio;
  }

  function startMusic(volume) {
    const audio = ensureMusic(volume);
    if (!audio || clampVolume(volume) <= 0) return;
    if (!audio.paused) return;
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") promise.catch(function() {});
  }

  function setMusicVolume(volume) {
    const value = clampVolume(volume);
    const audio = value > 0 || musicAudio ? ensureMusic(value) : null;
    if (!audio) return;
    audio.volume = value;
    if (value <= 0) {
      audio.pause();
      return;
    }
    startMusic(value);
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
    startMusic: function(volume) {
      startMusic(volume);
    },
    setMusicVolume: function(volume) {
      setMusicVolume(volume);
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
