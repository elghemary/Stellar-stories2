// ===== STELLAR STORIES JAVASCRIPT =====

let currentScene = 1;
let totalScenes = 35; // will be overwritten on load to match actual .scene count
let isAutoPlaying = false;
let autoPlayTimer = null;

// ===== SCORING SYSTEM =====
let playerScore = 0;
let completedScenes = new Set(); // Track which scenes have been completed
let completedInteractions = new Set(); // Track which interactive elements have been used
const SCENE_POINTS = 1;
const INTERACTION_POINTS = 10;

// Audio mapping based on actual files present in Audios/
const audioMap = {
  1: "scene1.mp3",
  2: "scene2.mp3",
  3: "scene3.mp3",
  4: "scene4.mp3",
  5: "scene5.mp3",
  6: "scene6.mp3",
  7: "scene7.mp3",
  8: "scene8.mp3",
  9: "scene9.mp3",
  10: "scene10.mp3",
  11: "scene11.mp3",
  12: "scene12.mp3",
  13: "scene13.mp3",
  18: "scene18.mp3",
  19: "scene19.mp3",
  20: "scene21.mp3",
  21: "scene22.mp3",
  25: "scene26.mp3",
  26: "scene27.mp3",
  27: "scene28.mp3",
  28: "scene29.mp3",
  29: "scene30.mp3",
  30: "scene31.mp3",
  31: "scene32.mp3",
  32: "scene33.mp3",
  33: "scene34.mp3",
  34: "scene35.mp3",
  35: "scene36.mp3",
  37: "scene37.mp3",
  38: "scene38.mp3",
};


// Initialize the story
window.addEventListener("DOMContentLoaded", function () {
  simulateLoading();
});

function simulateLoading() {
  const progressBar = document.getElementById("loading-progress");
  let progress = 0;

  const loadInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 100) progress = 100;

    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(startStory, 500);
    }
  }, 150);
}

function startStory() {
  document.getElementById("loading-screen").classList.add("hidden");
  document.getElementById("story-container").style.display = "flex";

  // Ensure totalScenes matches the number of scene elements in the HTML
  try {
    const scenes = document.querySelectorAll(".scene");
    if (scenes && scenes.length > 0) {
      // Normalize data-scene attributes to DOM order so behavior is deterministic
      scenes.forEach((s, idx) => {
        try {
          s.dataset.scene = String(idx + 1);
        } catch (err) {
          // ignore
        }
      });

      totalScenes = scenes.length;
      // Do not auto-populate audioMap defaults here. We want audio to play only
      // when an explicit mapping exists (in audioMap) or when the section sets
      // a per-section `data-audio` attribute. This avoids accidental audio on
      // slides that shouldn't play anything.
    }
  } catch (e) {
    // If DOM isn't ready for some reason, keep the existing totalScenes
    console.warn("Could not detect scenes automatically:", e);
  }

  // Initialize audio settings
  initializeAudio();

  // Initialize scoring system
  initializeScore();

  // Start background music
  const bgMusic = document.getElementById("background-music");
  bgMusic.volume = 0.3;
  bgMusic.play().catch(console.log);

  updateProgress();
  playSceneAudio(1);
}

// ===== SCORING FUNCTIONS =====

function initializeScore() {
  loadScoreFromStorage();
  updateScoreDisplay();
}

function loadScoreFromStorage() {
  const savedScore = localStorage.getItem("stellarStoriesScore");
  const savedCompletedScenes = localStorage.getItem(
    "stellarStoriesCompletedScenes"
  );
  const savedCompletedInteractions = localStorage.getItem(
    "stellarStoriesCompletedInteractions"
  );

  if (savedScore) {
    playerScore = parseInt(savedScore);
  }

  if (savedCompletedScenes) {
    completedScenes = new Set(JSON.parse(savedCompletedScenes));
  }

  if (savedCompletedInteractions) {
    completedInteractions = new Set(JSON.parse(savedCompletedInteractions));
  }
}

function saveScoreToStorage() {
  localStorage.setItem("stellarStoriesScore", playerScore.toString());
  localStorage.setItem(
    "stellarStoriesCompletedScenes",
    JSON.stringify([...completedScenes])
  );
  localStorage.setItem(
    "stellarStoriesCompletedInteractions",
    JSON.stringify([...completedInteractions])
  );
}

function updateScoreDisplay() {
  const scoreText = document.getElementById("score-text");
  if (scoreText) {
    scoreText.textContent = playerScore;

    // Add animation when score increases
    scoreText.parentElement.style.transform = "scale(1.1)";
    setTimeout(() => {
      scoreText.parentElement.style.transform = "scale(1)";
    }, 200);
  }
}

function awardScenePoints(sceneNumber) {
  if (!completedScenes.has(sceneNumber)) {
    completedScenes.add(sceneNumber);
    playerScore += SCENE_POINTS;
    updateScoreDisplay();
    saveScoreToStorage();

    // Show score notification
    showScoreNotification(
      `+${SCENE_POINTS} point for completing scene ${sceneNumber}!`
    );
  }
}

function awardInteractionPoints(interactionId) {
  if (!completedInteractions.has(interactionId)) {
    completedInteractions.add(interactionId);
    playerScore += INTERACTION_POINTS;
    updateScoreDisplay();
    saveScoreToStorage();

    // Show score notification
    showScoreNotification(
      `+${INTERACTION_POINTS} bonus points for interaction!`
    );
  }
}

function showScoreNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "score-notification";
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add("show"), 10);

  // Remove after delay
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 2000);
}

function resetScore() {
  playerScore = 0;
  completedScenes.clear();
  completedInteractions.clear();
  updateScoreDisplay();
  saveScoreToStorage();
}

function slideToScene(sceneNumber) {
  // Clamp requested scene number to valid range to avoid accidental wrap-around
  sceneNumber = Math.max(1, Math.min(totalScenes, Number(sceneNumber) || 1));

  currentScene = sceneNumber;
  const container = document.getElementById("scenes-container");
  container.className = `scenes-container scene-${sceneNumber}`;

  // Award points for reaching this scene
  awardScenePoints(sceneNumber);

  updateProgress();
  playSceneAudio(sceneNumber);
  visitedScenes.add(sceneNumber);

  // Clear any existing scared-shake classes in the scenes container
  try {
    // remove any per-element small shakes
    document.querySelectorAll(".scared-shake").forEach((el) =>
      el.classList.remove("scared-shake")
    );

  // also remove any full-screen shake applied to the story-stage wrapper
  const stage = document.getElementById('story-container') || document.querySelector('.story-stage');
  if (stage && stage.classList) stage.classList.remove('screen-shake');

    // Add a small shaking animation to characters for specific data-scene ids
    const scenes = document.querySelectorAll("#scenes-container .scene");
    const activeScene = scenes[sceneNumber - 1];
    if (activeScene) {
      // Resolve the canonical scene id from data-scene if available
      const canonicalId = activeScene.dataset && activeScene.dataset.scene ? parseInt(activeScene.dataset.scene, 10) : sceneNumber;

      const char = activeScene.querySelector(".character");
      // Add small shake for scenes that should tremble (data-scene 21 and 9)
      if (char && (canonicalId === 21 || canonicalId === 9)) {
        char.classList.add("scared-shake");
      }

      // For data-scene 9 we want the whole screen to tremble — add a screen-shake to the stage wrapper
      if (canonicalId === 9 && stage && stage.classList) {
        stage.classList.add('screen-shake');
      }
    }
  } catch (e) {
    // ignore if DOM not ready
  }

  // Special scene effects
  if (sceneNumber === 6) {
    setTimeout(() => {
      const energyFill = document.getElementById("energy-fill");
      if (energyFill) energyFill.style.width = "100%";
    }, 500);
  }

  if (sceneNumber === 8) {
    setTimeout(triggerFlareEffect, 400);
  }

  if (sceneNumber === 10) {
    setTimeout(startAuroraAnimation, 500);
  }

  if (sceneNumber === 18) {
    setTimeout(startCelebration, 1000);
  }
}

function nextScene() {
  if (currentScene < totalScenes) {
    slideToScene(currentScene + 1);
    trackInteraction();

    // If we reached the final scene while autoplaying, stop autoplay to avoid any further actions
    if (currentScene === totalScenes && isAutoPlaying) {
      isAutoPlaying = false;
      clearTimeout(autoPlayTimer);
      const playBtn = document.getElementById("play-btn");
      if (playBtn) playBtn.textContent = "▶️";
    }
  }
}

function previousScene() {
  if (currentScene > 1) {
    slideToScene(currentScene - 1);
    trackInteraction();
  }
}

function updateProgress() {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const progressPercent = (currentScene / totalScenes) * 100;

  progressFill.style.width = progressPercent + "%";
  progressText.textContent = `Scene ${currentScene} of ${totalScenes}`;

  // Update navigation buttons
  document.getElementById("prev-btn").style.opacity =
    currentScene > 1 ? "1" : "0.5";
  document.getElementById("next-btn").style.opacity =
    currentScene < totalScenes ? "1" : "0.5";
}

function playSceneAudio(sceneNumber) {
  if (!settings.audioEnabled) return;

  const audio = document.getElementById("scene-audio");

  // Try to resolve the scene's actual data-scene id from the DOM.
  // The UI uses DOM order for slides, while some scenes set custom data-scene
  // values. Use the active element's data-scene when available to pick audio.
  let resolvedId = null;
  try {
    const scenes = document.querySelectorAll('#scenes-container .scene');
    const idx = Number(sceneNumber) - 1;
    var active = scenes && scenes[idx] ? scenes[idx] : null;
    if (active && active.dataset && active.dataset.scene) {
      const parsed = parseInt(active.dataset.scene, 10);
      if (!isNaN(parsed)) resolvedId = parsed;
    }
  } catch (e) {
    console.warn('Could not resolve data-scene id for audio mapping:', e);
  }

  // Determine which audio file to play. Priority:
  // 1) explicit per-section `data-audio` (can be a filename or relative path)
  // 2) audioMap lookup by resolved data-scene id (or DOM index)
  // If neither exists, do not play any audio for this scene.
  let chosenFile = null;
  if (active && active.dataset && active.dataset.audio) {
    chosenFile = active.dataset.audio; // use exactly what's provided
  } else {
    const lookupKey = resolvedId || Number(sceneNumber);
    // Only use audioMap entry if it was explicitly set by the developer
    if (Object.prototype.hasOwnProperty.call(audioMap, lookupKey)) {
      chosenFile = audioMap[lookupKey];
    } else {
      // No explicit audio mapping — skip playing audio for this scene
      return;
    }
  }

  if (audio && chosenFile) {
    try {
      console.debug(`playSceneAudio: sceneNumber=${sceneNumber} resolvedId=${resolvedId} chosenFile=${chosenFile}`);
    } catch (e) {}

    // If chosenFile looks like a full path, use it; otherwise assume Audios/ folder
    const src = chosenFile.includes('/') ? chosenFile : `Audios/${chosenFile}`;
    audio.src = src;
    audio.volume = (settings.volume / 100) * 0.8;
    audio.play().catch((err) => {
      console.warn(`Audio play failed for ${src}:`, err);
    });
  }
}

function toggleAutoPlay() {
  isAutoPlaying = !isAutoPlaying;
  const playBtn = document.getElementById("play-btn");

  if (isAutoPlaying) {
    playBtn.textContent = "⏸️";
    const timerDelay = settings.autoTimer * 1000;
    autoPlayTimer = setTimeout(() => {
      if (currentScene < totalScenes) {
        nextScene();
        if (isAutoPlaying && currentScene < totalScenes) {
          setTimeout(toggleAutoPlay, timerDelay);
        }
        // If we reached the end, ensure autoplay is turned off
        if (currentScene === totalScenes) {
          isAutoPlaying = false;
          if (playBtn) playBtn.textContent = "▶️";
        }
      }
    }, timerDelay);
  } else {
    playBtn.textContent = "▶️";
    clearTimeout(autoPlayTimer);
  }
}

// Interactive Functions
function characterSpeak(character, message) {
  // Award points for character interaction
  const characterName = character.alt || "character";
  awardInteractionPoints(
    `character-${characterName.toLowerCase().replace(/\s+/g, "-")}`
  );

  // Add speaking animation
  character.style.transform = "scale(1.2)";
  character.style.filter = "brightness(1.3) drop-shadow(0 0 30px #ffd700)";

  // Create speech popup
  const popup = document.createElement("div");
  popup.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                 background: rgba(255,255,255,0.95); color: #333; padding: 2rem; 
                 border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                 z-index: 10000; max-width: 400px; text-align: center;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #ffd700; border: none; padding: 0.5rem 1rem; 
                               border-radius: 15px; cursor: pointer; font-weight: bold;">
                    Got it! ✨
                </button>
            </div>
        `;

  document.body.appendChild(popup);

  // Reset character after 3 seconds
  setTimeout(() => {
    character.style.transform = "";
    character.style.filter = "";
  }, 3000);
}

function changeMood(mood, btn) {
  // btn is expected to be the clicked element (this) passed from the HTML
  const moodBtns = document.querySelectorAll(".mood-btn");
  const sunChar = document.getElementById("mood-sun");
  const scene5Char = document.getElementById("scene5-sun");

  // Update active button
  moodBtns.forEach((b) => b.classList.remove("active"));
  if (btn && btn.classList) btn.classList.add("active");

  // Award points for mood interaction
  awardInteractionPoints(`mood-${mood}`);

  // Define mood -> image and style mapping
  const moods = {
    happy: {
      src: "Images/Characters/Sun_happy.png",
      filter: "brightness(1.2) saturate(1.3) drop-shadow(0 0 20px #ffd700)",
      animation: "sun-glow 2s ease-in-out infinite",
    },
    sneezy: {
      src: "Images/Characters/Sun_sneeze.png",
      filter: "brightness(0.95) contrast(1.05) drop-shadow(0 0 8px #ffb399)",
      animation: "",
    },
    angry: {
      // fallback to an angry sun asset if present in project
      src: "Images/Characters/angy sun from the front.png",
      filter: "brightness(0.8) contrast(1.5) hue-rotate(20deg) drop-shadow(0 0 30px #ff4500)",
      animation: "flare-intense 0.5s ease-in-out infinite",
    },
  };

  const data = moods[mood] || moods.happy;

  // Swap images if elements exist
  try {
    if (sunChar && data.src) {
      sunChar.src = data.src;
      sunChar.style.filter = data.filter || "";
      sunChar.style.animation = data.animation || "";
    }

    if (scene5Char && data.src) {
      scene5Char.src = data.src;
      scene5Char.style.filter = data.filter || "";
      scene5Char.style.animation = data.animation || "";
    }
  } catch (e) {
    console.warn("Could not change mood image:", e);
  }
  // Apply global mood class to body so all characters get consistent styles
  try {
    document.body.classList.remove("mood-happy", "mood-sneezy", "mood-angry");
    document.body.classList.add(`mood-${mood}`);
  } catch (e) {
    console.warn("Could not apply global mood class:", e);
  }
}

function showSunspotInfo() {
  // Award points for sunspot interaction
  awardInteractionPoints("sunspot-info");

  alert(
    "🌟 Sunspots are cooler regions on the Sun's surface!\n\n" +
      "• Temperature: ~3,700°C (vs 5,500°C surface)\n" +
      "• Caused by strong magnetic fields\n" +
      "• Can be larger than Earth!\n" +
      "• Follow an 11-year cycle"
  );
}

function triggerFlareEffect() {
  const flareEffect = document.getElementById("flare-effect");
  flareEffect.style.display = "block";

  // Screen shake effect
  document.body.style.animation = "shake 0.5s ease-in-out";

  setTimeout(() => {
    flareEffect.style.display = "none";
    document.body.style.animation = "";
  }, 2000);
}

function startAuroraAnimation() {
  const aurora = document.getElementById("aurora");
  aurora.style.display = "block";
}

function changeAuroraColor() {
  const aurora = document.getElementById("aurora");
  const colors = [
    "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.6) 25%, rgba(236,72,153,0.6) 50%, rgba(59,130,246,0.6) 75%, transparent 100%)",
    "linear-gradient(90deg, transparent 0%, rgba(236,72,153,0.8) 25%, rgba(139,69,19,0.6) 50%, rgba(255,215,0,0.6) 75%, transparent 100%)",
    "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.8) 25%, rgba(16,185,129,0.6) 50%, rgba(236,72,153,0.6) 75%, transparent 100%)",
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  aurora.style.background = randomColor;

  // Award points for aurora interaction
  awardInteractionPoints("aurora-colors");
}

function showPowerDemo() {
  // Award points for power grid interaction
  awardInteractionPoints("power-grid-demo");

  alert(
    "⚡ Power Grid Demo:\n\n" +
      "Solar storms can induce electric currents in power lines!\n" +
      "This can cause:\n" +
      "• Transformer damage\n" +
      "• Widespread blackouts\n" +
      "• Economic losses in billions\n\n" +
      "The 1989 Quebec blackout affected 6 million people!"
  );
}

function startCelebration() {
  const fireworks = document.getElementById("fireworks");

  // Create multiple fireworks
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const firework = document.createElement("div");
      firework.className = "firework";
      firework.style.left = Math.random() * 100 + "%";
      firework.style.top = Math.random() * 100 + "%";
      firework.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      firework.style.animationDelay = Math.random() * 2 + "s";

      fireworks.appendChild(firework);

      setTimeout(() => {
        firework.remove();
      }, 2000);
    }, i * 200);
  }
}

function restartStory() {
  currentScene = 1;
  slideToScene(1);
}

function shareStory() {
  if (navigator.share) {
    navigator.share({
      title: "Stellar Stories - Space Weather Adventure",
      text: "I just completed an amazing journey learning about space weather! 🌟",
      url: window.location.href,
    });
  } else {
    alert(
      "🌟 Share this amazing space weather adventure with your friends!\n\n" +
        "I just learned about solar flares, auroras, and how space weather affects Earth! 🚀"
    );
  }
}

// ===== SETTINGS & SUMMARY FUNCTIONS =====

// Settings and tracking variables
let settings = {
  volume: 70,
  animationSpeed: 1,
  musicEnabled: true,
  audioEnabled: true,
  autoTimer: 5,
};

let startTime = Date.now();
let interactionCount = 0;
let visitedScenes = new Set([1]);

function showSettings() {
  document.getElementById("settings-modal").classList.add("show");
  updateSettingsDisplay();
}

function hideSettings() {
  document.getElementById("settings-modal").classList.remove("show");
}

function updateSettingsDisplay() {
  document.getElementById("volume-slider").value = settings.volume;
  document.getElementById("volume-display").textContent = settings.volume + "%";
  document.getElementById("animation-speed").value = settings.animationSpeed;
  document.getElementById("auto-timer").value = settings.autoTimer;

  const musicToggle = document.getElementById("music-toggle");
  const audioToggle = document.getElementById("audio-toggle");

  if (settings.musicEnabled) musicToggle.classList.add("active");
  else musicToggle.classList.remove("active");

  if (settings.audioEnabled) audioToggle.classList.add("active");
  else audioToggle.classList.remove("active");
}

function updateVolume(value) {
  settings.volume = parseInt(value);
  document.getElementById("volume-display").textContent = value + "%";

  const bgMusic = document.getElementById("background-music");
  const sceneAudio = document.getElementById("scene-audio");

  if (bgMusic) bgMusic.volume = (settings.volume / 100) * 0.3;
  if (sceneAudio) sceneAudio.volume = (settings.volume / 100) * 0.8;

  saveSettings();
}

function updateAnimationSpeed(value) {
  settings.animationSpeed = parseFloat(value);
  document.documentElement.style.setProperty("--animation-speed", value);

  // Update scene transition speed
  const container = document.getElementById("scenes-container");
  if (container) {
    container.style.transition = `transform ${
      0.8 / settings.animationSpeed
    }s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  }

  saveSettings();
}

function toggleMusic() {
  settings.musicEnabled = !settings.musicEnabled;
  const toggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("background-music");

  if (settings.musicEnabled) {
    toggle.classList.add("active");
    bgMusic.play().catch(console.log);
  } else {
    toggle.classList.remove("active");
    bgMusic.pause();
  }

  saveSettings();
}

function toggleAudio() {
  settings.audioEnabled = !settings.audioEnabled;
  const toggle = document.getElementById("audio-toggle");

  if (settings.audioEnabled) {
    toggle.classList.add("active");
  } else {
    toggle.classList.remove("active");
  }

  saveSettings();
}

function updateAutoTimer(value) {
  settings.autoTimer = parseInt(value);
  saveSettings();
}

function resetSettings() {
  settings = {
    volume: 70,
    animationSpeed: 1,
    musicEnabled: true,
    audioEnabled: true,
    autoTimer: 5,
  };
  updateSettingsDisplay();
  updateVolume(70);
  updateAnimationSpeed(1);
  saveSettings();
}

function saveSettings() {
  localStorage.setItem("stellarStoriesSettings", JSON.stringify(settings));
}

function loadSettings() {
  const saved = localStorage.getItem("stellarStoriesSettings");
  if (saved) {
    settings = { ...settings, ...JSON.parse(saved) };
    updateVolume(settings.volume);
    updateAnimationSpeed(settings.animationSpeed);
  }
}

function showSummary() {
  document.getElementById("summary-modal").classList.add("show");
  updateSummaryDisplay();
}

function hideSummary() {
  document.getElementById("summary-modal").classList.remove("show");
}

function showAbout() {
  document.getElementById("about-modal").classList.add("show");
}

function hideAbout() {
  document.getElementById("about-modal").classList.remove("show");
}

function updateSummaryDisplay() {
  // Update stats
  document.getElementById("current-scene-stat").textContent = currentScene;
  document.getElementById("completion-stat").textContent =
    Math.round((currentScene / totalScenes) + 0.00001) + "%";
  document.getElementById("time-spent-stat").textContent = formatTime(
    Date.now() - startTime
  );
  document.getElementById("interactions-stat").textContent = interactionCount;

  // Update progress description
  const progressDesc = getProgressDescription();
  document.getElementById("progress-description").textContent = progressDesc;

  // Update scene progress list
  updateSceneProgressList();

  // Update achievements
  updateAchievements();
}

function getProgressDescription() {
  const progress = (currentScene / totalScenes) * 100;

  if (progress < 20)
    return "You've just begun your cosmic journey! Keep exploring to learn about space weather.";
  if (progress < 40)
    return "Great progress! You're learning about our Sun and its amazing energy.";
  if (progress < 60)
    return "Excellent! You've discovered Earth's protection and space weather effects.";
  if (progress < 80)
    return "Almost there! You're exploring how space weather impacts our daily lives.";
  if (progress < 100)
    return "Fantastic! You're nearly a space weather expert. Just a little more to go!";
  return "Congratulations! You've completed your space weather adventure and earned your certificate!";
}

function updateSceneProgressList() {
  const sceneList = document.getElementById("scene-progress-list");
  sceneList.innerHTML = "";

  for (let i = 1; i <= totalScenes; i++) {
    const sceneItem = document.createElement("div");
    sceneItem.className = "scene-item";
    sceneItem.textContent = `Scene ${i}`;

    if (visitedScenes.has(i)) {
      sceneItem.classList.add("visited");
    }
    if (i === currentScene) {
      sceneItem.classList.add("current");
    }

    sceneList.appendChild(sceneItem);
  }
}

function updateAchievements() {
  // Update achievements based on progress
  if (currentScene >= 2) {
    document.getElementById("achievement-sun").style.opacity = "1";
    document.getElementById("achievement-sun").classList.add("visited");
  }
  if (currentScene >= 9) {
    document.getElementById("achievement-earth").style.opacity = "1";
    document.getElementById("achievement-earth").classList.add("visited");
  }
  if (currentScene >= 7) {
    document.getElementById("achievement-flare").style.opacity = "1";
    document.getElementById("achievement-flare").classList.add("visited");
  }
  if (currentScene >= 10) {
    document.getElementById("achievement-aurora").style.opacity = "1";
    document.getElementById("achievement-aurora").classList.add("visited");
  }
  if (currentScene >= 18) {
    document.getElementById("achievement-complete").style.opacity = "1";
    document.getElementById("achievement-complete").classList.add("visited");
  }
}

function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Remplacez complètement l'ancienne fonction par celle-ci
async function exportProgress() {
  const userName = prompt("Enter your full name for the certificate:");
  if (!userName) return;

  const progressData = {
    visitedScenes: Array.from(window.visitedScenes || []),
    timeSpentMs: Date.now() - (window.startTime || Date.now()),
    completionDate: new Date(),
    score: window.playerScore || 0,
    interactions: window.interactionCount || 0,
    currentScene: window.currentScene || 1,
    totalScenes: window.totalScenes || 1,
  };

  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("Unable to generate certificate: jsPDF library not found.");
    return;
  }
  const { jsPDF } = window.jspdf;

  // Helper: fetch SVG and convert to PNG dataURL (returns null on failure)
  async function svgUrlToPngDataUrl(svgPath, w, h, backgroundColor = null) {
    try {
      const resp = await fetch(svgPath);
      if (!resp.ok) return null;
      const svgText = await resp.text();
      const blob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      return await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (backgroundColor) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/png");
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      });
    } catch (e) {
      console.warn("svg->png conversion failed:", e);
      return null;
    }
  }

  try {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Fill page with space-blue background (#07103a)
    doc.setFillColor(7, 16, 58); // RGB for #07103a
    doc.rect(0, 0, pageW, pageH, "F");

    // Try to add logo (convert SVG -> PNG). Use a moderate pixel size to keep quality.
    const logoPng = await svgUrlToPngDataUrl("Images/logo/logo.svg", 512, 512, null);
    if (logoPng) {
      // place top-left logo (mm): small and crisp
      doc.addImage(logoPng, "PNG", 10, 8, 34, 34);
    }

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(235, 235, 245); // light greyish
    doc.text("Certificat d'Explorateur Spatial", pageW / 2, 34, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 210, 230);
    doc.text("Ce certificat est fièrement décerné à :", pageW / 2, 52, { align: "center" });

    // Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(26);
    doc.setTextColor(255, 215, 0); // gold
    doc.text(userName, pageW / 2, 74, { align: "center" });

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(220, 228, 240);
    doc.text("Pour avoir complété l'aventure Stellar Quest et exploré les merveilles de l'espace.", pageW / 2, 92, { align: "center" });

    // Stats row
    const formattedDate = progressData.completionDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    const timeSpentSeconds = Math.round(progressData.timeSpentMs / 1000);
    const formattedTime = `${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s`;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 210, 230);
    doc.text("Scènes visitées", pageW * 0.25, 120, { align: "center" });
    doc.text("Temps de mission", pageW * 0.5, 120, { align: "center" });
    doc.text("Date d'achèvement", pageW * 0.75, 120, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(235, 235, 245);
    doc.text(String(progressData.visitedScenes.length || 0), pageW * 0.25, 130, { align: "center" });
    doc.text(formattedTime, pageW * 0.5, 130, { align: "center" });
    doc.text(formattedDate, pageW * 0.75, 130, { align: "center" });

    // Decorative frame / gold border
    doc.setDrawColor(212, 175, 55); // gold
    doc.setLineWidth(0.8);
    doc.rect(8, 6, pageW - 16, pageH - 12);

    // Signature area (right bottom)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 210, 230);
    doc.text("Officiel Stellar Quest", pageW - 40, pageH - 28, { align: "center" });
    // small line above signature
    doc.setDrawColor(200, 210, 230);
    doc.setLineWidth(0.4);
    doc.line(pageW - 65, pageH - 34, pageW - 15, pageH - 34);

    const fileName = `Certificate-Stellar-Quest-${userName.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);

    // feedback minimal UI approval
    alert("Certificate generated with logo and space-blue background. Certificate UI approved.");
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Unable to generate the certificate PDF.");
  }
}
function shareProgress() {
  const progress = Math.round((currentScene / totalScenes) * 100);
  const timeSpent = formatTime(Date.now() - startTime);

  const shareText =
    `🌟 I'm ${progress}% through my Stellar Stories space weather adventure!\n\n` +
    `📊 Progress: Scene ${currentScene} of ${totalScenes}\n` +
    `⏰ Time spent: ${timeSpent}\n` +
    `🎯 Interactions: ${interactionCount}\n\n` +
    `Join me in learning about space weather! 🚀✨`;

  if (navigator.share) {
    navigator.share({
      title: "Stellar Stories Progress",
      text: shareText,
      url: window.location.href,
    });
  } else {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert("Progress copied to clipboard! Share it with your friends! 🌟");
      })
      .catch(() => {
        alert(shareText);
      });
  }
}

// Enhanced tracking for interactions
function trackInteraction() {
  interactionCount++;
  visitedScenes.add(currentScene);
}

function initializeAudio() {
  const bgMusic = document.getElementById("background-music");
  const sceneAudio = document.getElementById("scene-audio");

  if (bgMusic) {
    bgMusic.volume = (settings.volume / 100) * 0.3;
    if (settings.musicEnabled) {
      bgMusic.play().catch(console.log);
    }
  }

  if (sceneAudio) {
    sceneAudio.volume = (settings.volume / 100) * 0.8;
  }

  // Start playing first scene audio if enabled
  if (settings.audioEnabled) {
    playSceneAudio(1);
  }
}

// Initialize settings on page load
window.addEventListener("DOMContentLoaded", function () {
  loadSettings();
});

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowLeft":
      previousScene();
      break;
    case "ArrowRight":
      nextScene();
      break;
    case " ":
      e.preventDefault();
      toggleAutoPlay();
      break;
  }
});

// Touch gestures for mobile
let startX = 0;
document.addEventListener("touchstart", function (e) {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", function (e) {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextScene();
    } else {
      previousScene();
    }
  }
});

// Add shake animation for flare effect
const shakeCSS = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;

const style = document.createElement("style");
style.textContent = shakeCSS;
document.head.appendChild(style);

// Add event listeners for settings and summary modals
window.addEventListener("DOMContentLoaded", function () {
  // helper to safely attach listeners only when element exists
  function safeOn(idOrEl, event, handler) {
    if (!idOrEl) return;
    let el = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
    if (el) el.addEventListener(event, handler);
  }

  safeOn("volume-slider", "input", function (e) {
    updateVolume(e.target.value);
  });

  safeOn("animation-speed", "change", function (e) {
    updateAnimationSpeed(e.target.value);
  });

  safeOn("auto-timer", "change", function (e) {
    updateAutoTimer(e.target.value);
  });

  safeOn("music-toggle", "click", toggleMusic);
  safeOn("audio-toggle", "click", toggleAudio);
  safeOn("reset-settings-btn", "click", resetSettings);

  safeOn("close-settings", "click", hideSettings);
  safeOn("close-summary", "click", hideSummary);
  safeOn("close-about", "click", hideAbout);

  safeOn("export-progress-btn", "click", exportProgress);
  safeOn("share-progress-btn", "click", shareProgress);

  // Close modals when clicking outside (only if modal exists)
  const settingsModal = document.getElementById("settings-modal");
  if (settingsModal)
    settingsModal.addEventListener("click", function (e) {
      if (e.target === this) hideSettings();
    });

  const summaryModal = document.getElementById("summary-modal");
  if (summaryModal)
    summaryModal.addEventListener("click", function (e) {
      if (e.target === this) hideSummary();
    });

  const aboutModal = document.getElementById("about-modal");
  if (aboutModal)
    aboutModal.addEventListener("click", function (e) {
      if (e.target === this) hideAbout();
    });

  // Escape key to close modals (global)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideSettings();
      hideSummary();
      hideAbout();
    }
  });

  // CME interaction setup safe guard
  try {
    const cmeTrigger = document.getElementById("cme-trigger");
    const cmeParticles = document.getElementById("cme-particles");

    if (cmeTrigger && cmeParticles) {
      cmeTrigger.addEventListener("click", function (e) {
        e.stopPropagation();
        spawnCMEParticles(cmeParticles, 24);
      });

      cmeTrigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          spawnCMEParticles(cmeParticles, 24);
        }
      });

      cmeTrigger.addEventListener("mouseleave", function () {
        clearCMEParticles(cmeParticles);
      });

      document.addEventListener("click", function (ev) {
        if (!cmeTrigger.contains(ev.target)) {
          clearCMEParticles(cmeParticles);
        }
      });
    }
  } catch (err) {
    console.warn("CME setup error:", err);
  }
});

// Create a red particle burst inside the provided container
function spawnCMEParticles(container, count = 20) {
  if (!container) return;

  // Clear existing particles first
  clearCMEParticles(container);

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    // Random trajectory angle and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 90; // px
    const tx = Math.cos(angle) * distance + "px";
    const ty = Math.sin(angle) * distance + "px";

    // Store CSS vars for the animation to pick up
    p.style.setProperty("--tx", tx);
    p.style.setProperty("--ty", ty);

    // Start position centered-ish
    p.style.left = 80 + Math.random() * 40 + "px"; // inside the particle container
    p.style.top = 20 + Math.random() * 60 + "px";

    container.appendChild(p);

    // Remove after animation completes
    p.addEventListener(
      "animationend",
      function () {
        p.remove();
      },
      { once: true }
    );
  }
}

function clearCMEParticles(container) {
  if (!container) return;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
