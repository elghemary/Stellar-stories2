// ===== STELLAR STORIES JAVASCRIPT =====

let currentScene = 1;
const totalScenes = 18;
let isAutoPlaying = false;
let autoPlayTimer = null;

// ===== SCORING SYSTEM =====
let playerScore = 0;
let completedScenes = new Set(); // Track which scenes have been completed
let completedInteractions = new Set(); // Track which interactive elements have been used
const SCENE_POINTS = 1;
const INTERACTION_POINTS = 10;

// Audio mapping based on available files
const audioMap = {
  1: "scene1.m4a",
  2: "scene2.m4a",
  3: "scene3.m4a",
  4: "scene4.m4a",
  5: "scene5.m4a",
  6: "scene6.m4a",
  7: "scene8.m4a",
  8: "scene9.m4a",
  9: "scene11.m4a",
  10: "scene12.m4a",
  11: "scene13.m4a",
  12: "scene14.m4a",
  13: "scene16.mp3",
  14: "scene17.mp3",
  15: "scene19.mp3",
  16: "scene20.mp3",
  17: "scene 021.mp3",
  18: "scene 063 [last one].mp3",
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
  if (sceneNumber < 1 || sceneNumber > totalScenes) return;

  currentScene = sceneNumber;
  const container = document.getElementById("scenes-container");
  container.className = `scenes-container scene-${sceneNumber}`;

  // Award points for reaching this scene
  awardScenePoints(sceneNumber);

  updateProgress();
  playSceneAudio(sceneNumber);
  visitedScenes.add(sceneNumber);

  // Special scene effects
  if (sceneNumber === 6) {
    setTimeout(() => {
      const energyFill = document.getElementById("energy-fill");
      if (energyFill) energyFill.style.width = "100%";
    }, 500);
  }

  if (sceneNumber === 7) {
    setTimeout(triggerFlareEffect, 1000);
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
  const audioFile = audioMap[sceneNumber];

  if (audioFile) {
    audio.src = `Audios/${audioFile}`;
    audio.volume = (settings.volume / 100) * 0.8;
    audio.play().catch(console.log);
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
        if (isAutoPlaying) {
          setTimeout(toggleAutoPlay, timerDelay);
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

function changeMood(mood) {
  const moodBtns = document.querySelectorAll(".mood-btn");
  const sunChar = document.getElementById("mood-sun");

  moodBtns.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Award points for mood interaction
  awardInteractionPoints(`mood-${mood}`);

  switch (mood) {
    case "happy":
      sunChar.style.filter =
        "brightness(1.2) saturate(1.3) drop-shadow(0 0 20px #ffd700)";
      sunChar.style.animation = "sun-glow 2s ease-in-out infinite";
      break;
    case "stormy":
      sunChar.style.filter =
        "brightness(0.8) contrast(1.5) hue-rotate(20deg) drop-shadow(0 0 30px #ff4500)";
      sunChar.style.animation = "flare-intense 0.5s ease-in-out infinite";
      break;
    case "energetic":
      sunChar.style.filter =
        "brightness(1.5) saturate(2) drop-shadow(0 0 40px #ff8c00)";
      sunChar.style.animation =
        "character-float 1s ease-in-out infinite, pulse 1.5s ease-in-out infinite";
      break;
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
    Math.round((currentScene / totalScenes) * 100) + "%";
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

function exportProgress() {
  const progressData = {
    currentScene: currentScene,
    visitedScenes: Array.from(visitedScenes),
    timeSpent: Date.now() - startTime,
    interactions: interactionCount,
    settings: settings,
    completionDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(progressData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `stellar-stories-progress-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();
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
  // Settings modal event listeners
  document
    .getElementById("volume-slider")
    .addEventListener("input", function (e) {
      updateVolume(e.target.value);
    });

  document
    .getElementById("animation-speed")
    .addEventListener("change", function (e) {
      updateAnimationSpeed(e.target.value);
    });

  document
    .getElementById("auto-timer")
    .addEventListener("change", function (e) {
      updateAutoTimer(e.target.value);
    });

  document
    .getElementById("music-toggle")
    .addEventListener("click", toggleMusic);
  document
    .getElementById("audio-toggle")
    .addEventListener("click", toggleAudio);
  document
    .getElementById("reset-settings-btn")
    .addEventListener("click", resetSettings);

  // Modal close event listeners
  document
    .getElementById("close-settings")
    .addEventListener("click", hideSettings);
  document
    .getElementById("close-summary")
    .addEventListener("click", hideSummary);
  document.getElementById("close-about").addEventListener("click", hideAbout);

  // Summary modal event listeners
  document
    .getElementById("export-progress-btn")
    .addEventListener("click", exportProgress);
  document
    .getElementById("share-progress-btn")
    .addEventListener("click", shareProgress);

  // Close modals when clicking outside
  document
    .getElementById("settings-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) hideSettings();
    });

  document
    .getElementById("summary-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) hideSummary();
    });

  document
    .getElementById("about-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) hideAbout();
    });

  // Escape key to close modals
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideSettings();
      hideSummary();
      hideAbout();
    }
  });
});
