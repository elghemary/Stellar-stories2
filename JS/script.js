// ===== STELLAR STORIES JAVASCRIPT =====

let currentScene = 1;
let totalScenes = 92; // will be overwritten on load to match actual .scene count
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
  14: "scene14.mp3",
  15: "scene15.mp3",
  16: "scene16.mp3",
  17: "scene17.mp3",
  18: "scene18.mp3",
  19: "scene19.mp3",
  20: "scene20.mp3",
  21: "scene21.mp3",
  22: "scene22.mp3",
  23: "scene23.mp3",
  24: "scene24.mp3",
  25: "scene25.mp3",
  26: "scene26.mp3",
  27: "scene27.mp3",
  28: "scene28.mp3",
  29: "scene29.mp3",
  30: "scene30.mp3",
  31: "scene31.mp3",
  32: "scene32.mp3",
  33: "scene33.mp3",
  34: "scene34.mp3",
  35: "scene35.mp3",
  36: "scene36.mp3",
  37: "scene37.mp3",
  38: "scene38.mp3",
  39: "scene39.mp3",
  40: "scene40.mp3",
  41: "scene41.mp3",
  42: "scene42.mp3",
  43: "scene43.mp3",
  44: "scene44.mp3",
  45: "scene45.mp3",
  46: "scene46.mp3",
  47: "scene47.mp3",
  48: "scene48.mp3",
  49: "scene49.mp3",
  50: "scene50.mp3",
  51: "scene51.mp3",
  52: "scene52.mp3",
  53: "scene53.mp3",
  54: "scene54.mp3",
  55: "scene55.mp3",
  56: "scene56.mp3",
  57: "scene57.mp3",
  58: "scene58.mp3",
  59: "scene59.mp3",
  60: "scene60.mp3",
  61: "scene61.mp3",
  62: "scene62.mp3",
  63: "scene63.mp3",
  64: "scene64.mp3",
  65: "scene65.mp3",
  66: "scene66.mp3",
  67: "scene67.mp3",
  68: "scene68.mp3",
  69: "scene69.mp3",
  70: "scene70.mp3",
  71: "scene71.mp3",
  72: "scene72.mp3",
  73: "scene73.mp3",
  74: "scene74.mp3",
  75: "scene75.mp3",
  76: "scene76.mp3",
  77: "scene77.mp3",
  78: "scene78.mp3",
  79: "scene79.mp3",
  80: "scene80.mp3",
  81: "scene81.mp3",
  82: "scene82.mp3",
  83: "scene83.mp3",
  84: "scene84.mp3",
  85: "scene85.mp3",
  86: "scene86.mp3",
  87: "scene87.mp3",
  88: "scene88.mp3",
  89: "scene89.mp3",
  90: "scene90.mp3",
  91: "scene91.mp3",
  92: "scene92.mp3",
  93: "scene93.mp3",
  94: "scene94.mp3",
  95: "scene95.mp3",
  96: "scene96.mp3",
  97: "scene97.mp3",
  98: "scene98.mp3",
  99: "scene99.mp3",
  100: "scene100.mp3",
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
      totalScenes = scenes.length;
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
    document.querySelectorAll(".scared-shake").forEach((el) =>
      el.classList.remove("scared-shake")
    );

    // Add a small shaking animation to the character in scene 21 (21st slide)
    const scenes = document.querySelectorAll("#scenes-container .scene");
    const activeScene = scenes[sceneNumber - 1];
    if (activeScene) {
      const char = activeScene.querySelector(".character");
      if (char && sceneNumber === 21) {
        char.classList.add("scared-shake");
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

// Remplacez complètement l'ancienne fonction par celle-ci
function exportProgress() {
  // 1. Demander le nom de l'utilisateur avec une boîte de dialogue
  const userName = prompt("Veuillez entrer votre nom et prénom pour le certificat :");

  // Si l'utilisateur annule ou ne met rien, on arrête la fonction
  if (!userName) {
    return;
  }

  // 2. On récupère les données de progression utiles
  const progressData = {
    visitedScenes: Array.from(visitedScenes),
    timeSpent: Date.now() - startTime,
    completionDate: new Date(), // On utilise directement l'objet Date
  };

  const { jsPDF } = window.jspdf;

  // 3. On crée un nouveau document PDF en format PAYSAGE
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // --- Début du Design du Certificat ---

  // Dimensions de la page A4 paysage : 297mm de large, 210mm de haut

  // 4. Ajout des logos (IMPORTANT : changez les chemins vers vos logos)
  // NOTE : Les images doivent exister dans votre projet !
  // Vous pouvez utiliser des formats comme PNG ou JPG.
  // doc.addImage(chemin_image, format, x, y, largeur, hauteur);
  doc.addImage("Images/Characters/happy_sun-removebg-preview.png", "PNG", 15, 15, 30, 30); // Logo en haut à gauche
  doc.addImage("Images/Characters/happy_earth-removebg-preview.png", "PNG", 252, 15, 30, 30); // Logo en haut à droite

  // 5. Titre du certificat
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#002B49"); // Bleu foncé
  doc.text("Certificat d'Explorateur Spatial", 148.5, 40, { align: "center" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#333333"); // Gris foncé
  doc.text("Ce certificat est fièrement décerné à :", 148.5, 70, { align: "center" });

  // 6. Nom de l'utilisateur
  doc.setFontSize(28);
  doc.setFont("times", "bolditalic");
  doc.setTextColor("#D4AF37"); // Couleur Or
  doc.text(userName, 148.5, 95, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#333333");
  doc.text("Pour avoir brillamment complété l'aventure Stellar Stories.", 148.5, 115, { align: "center" });

  // 7. Ligne de séparation
  doc.setDrawColor("#D4AF37");
  doc.setLineWidth(0.5);
  doc.line(40, 130, 257, 130);

  // 8. Ajout des données de progression
  const formattedDate = progressData.completionDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeSpentSeconds = Math.round(progressData.timeSpent / 1000);
  const formattedTime = `${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s`;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scènes visitées :", 80, 150, { align: "center" });
  doc.text("Temps de mission :", 148.5, 150, { align: "center" });
  doc.text("Date d'achèvement :", 215, 150, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.text(`${progressData.visitedScenes.length}`, 80, 160, { align: "center" });
  doc.text(formattedTime, 148.5, 160, { align: "center" });
  doc.text(formattedDate, 215, 160, { align: "center" });

  // 9. Cadre décoratif du certificat
  doc.setDrawColor("#002B49");
  doc.setLineWidth(1.5);
  doc.rect(5, 5, 287, 200); // Rectangle extérieur
  doc.setDrawColor("#D4AF37");
  doc.setLineWidth(0.5);
  doc.rect(8, 8, 281, 194); // Rectangle intérieur

  // --- Fin du Design ---

  // 10. Générer et télécharger le fichier PDF
  const fileName = `Certificat-Stellar-Stories-${userName.replace(" ", "_")}.pdf`;
  doc.save(fileName);
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

  // CME interaction setup (scene 11)
  try {
    const cmeTrigger = document.getElementById("cme-trigger");
    const cmeParticles = document.getElementById("cme-particles");

    if (cmeTrigger && cmeParticles) {
      // When user clicks the CME trigger, spawn particles
      cmeTrigger.addEventListener("click", function (e) {
        e.stopPropagation();
        spawnCMEParticles(cmeParticles, 24);
      });

      // Also support keyboard activation (Enter/Space)
      cmeTrigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          spawnCMEParticles(cmeParticles, 24);
        }
      });

      // Remove particles when mouse leaves the CME area
      cmeTrigger.addEventListener("mouseleave", function () {
        clearCMEParticles(cmeParticles);
      });

      // Also clear when clicking anywhere else
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
