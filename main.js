document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const entryGate = document.getElementById("entry-gate");
  const openBtn = document.getElementById("open-btn");
  const mainContent = document.getElementById("main-content");
  const bgMusic = document.getElementById("bg-music");
  const audioBtn = document.getElementById("audio-btn");
  const audioIcon = document.getElementById("audio-icon");
  const canvas = document.getElementById("petals-canvas");
  const envelope = document.getElementById("envelope");
  
  // Audio state
  let isPlaying = false;

  // SVG paths for Sound On / Sound Off
  const soundOnPath = `M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z`;
  const soundOffPath = `M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6H4.51c-.88 0-1.704.507-1.938 1.354A9.01 9.01 0 002.25 12c0 .83.112 1.633.322 2.396C2.806 15.244 3.63 15.75 4.51 15.75H6.75l4.72 4.72a.75.75 0 001.28-.53V3.06a.75.75 0 00-1.28-.53L6.75 8.25z`;

  // 1. ENTRY GATE DISMISS (INTERACTIVE ENVELOPE OPENING)
  if (openBtn && envelope) {
    openBtn.addEventListener("click", () => {
      // Start envelope opening transition
      envelope.classList.add("open");
      
      // Attempt to play music on interaction
      playMusic();

      // Delay to let flaps open and card rise up
      setTimeout(() => {
        entryGate.classList.add("dismissed");
        document.body.classList.remove("no-scroll");
        mainContent.classList.add("visible");
        
        // Start Petals Canvas animation loop
        startPetalsAnimation();
        
        // Initialize Scroll Reveal Elements
        initScrollReveal();
      }, 2000);
    });
  }

  // Scroll indicator functionality
  const scrollIndicator = document.getElementById("scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      const target = document.getElementById("scratch-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // 2. AUDIO WIDGET LOGIC
  function playMusic() {
    bgMusic.play().then(() => {
      isPlaying = true;
      updateAudioIcon(true);
    }).catch(err => {
      console.log("Auto-play blocked by browser. Sound will wait for toggle.", err);
      isPlaying = false;
      updateAudioIcon(false);
    });
  }

  function toggleMusic() {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      updateAudioIcon(false);
    } else {
      bgMusic.play().then(() => {
        isPlaying = true;
        updateAudioIcon(true);
      }).catch(err => {
        console.error("Failed to play audio:", err);
      });
    }
  }

  function updateAudioIcon(playState) {
    if (playState) {
      audioIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="${soundOnPath}"></path>`;
      audioBtn.setAttribute("title", "Mute Music");
    } else {
      audioIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="${soundOffPath}"></path>`;
      audioBtn.setAttribute("title", "Play Music");
    }
  }

  audioBtn.addEventListener("click", toggleMusic);

  // 3. FALLING PETALS CANVAS ANIMATION
  let animationFrameId = null;
  const ctx = canvas.getContext("2d");
  const petalsArray = [];
  const maxPetals = 45;
  const petalColors = [
    "rgba(138, 79, 76, 0.6)",   // Regal Maroon
    "rgba(186, 122, 118, 0.65)", // Rose Gold Pink
    "rgba(212, 175, 55, 0.45)",   // Translucent Gold
    "rgba(232, 206, 115, 0.5)"   // Warm Gold
  ];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener("resize", () => {
    resizeCanvas();
  });
  
  resizeCanvas();

  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Spread initially
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 6; // Petal sizes
      this.speedY = Math.random() * 1.5 + 1.0;
      this.speedX = Math.random() * 1.0 - 0.5;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.swayAngle = Math.random() * Math.PI;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    }

    update() {
      this.y += this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * 0.6 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      
      // Draw organic curved petal shape
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-this.size, -this.size / 2, -this.size / 2, -this.size);
      ctx.quadraticCurveTo(0, -this.size * 1.5, this.size / 2, -this.size);
      ctx.quadraticCurveTo(this.size, -this.size / 2, 0, 0);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }

  function startPetalsAnimation() {
    for (let i = 0; i < maxPetals; i++) {
      petalsArray.push(new Petal());
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < petalsArray.length; i++) {
        petalsArray[i].update();
        petalsArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
  }

  // 4. WEDDING COUNTDOWN TIMER
  const targetDateStr = "November 15, 2026 19:00:00";
  const targetDate = new Date(targetDateStr).getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? "0" + d : d;
    hoursEl.textContent = h < 10 ? "0" + h : h;
    minutesEl.textContent = m < 10 ? "0" + m : m;
    secondsEl.textContent = s < 10 ? "0" + s : s;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. INTERACTIVE SCRATCH CARDS SYSTEM
  const initScratchCards = () => {
    const scratchConfigs = [
      { id: "scratch-month-canvas" },
      { id: "scratch-day-canvas" },
      { id: "scratch-year-canvas" }
    ];

    scratchConfigs.forEach(config => {
      const canvasEl = document.getElementById(config.id);
      if (!canvasEl) return;

      const sCtx = canvasEl.getContext("2d");
      let isDrawing = false;

      // Handle scaling properly
      const rect = canvasEl.getBoundingClientRect();
      canvasEl.width = rect.width || 190;
      canvasEl.height = rect.height || 250;

      const drawOverlay = () => {
        // Shimmer gradient matching wine red / rose gold colors
        const grad = sCtx.createLinearGradient(0, 0, canvasEl.width, canvasEl.height);
        grad.addColorStop(0, "#ba7a76"); 
        grad.addColorStop(1, "#8a4f4c"); 
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);

        // Gold border
        sCtx.strokeStyle = "#e8ce73";
        sCtx.lineWidth = 3;
        sCtx.strokeRect(6, 6, canvasEl.width - 12, canvasEl.height - 12);

        // Text banner overlay
        sCtx.fillStyle = "#ffffff";
        sCtx.font = "bold 13px 'Montserrat', sans-serif";
        sCtx.textAlign = "center";
        sCtx.textBaseline = "middle";
        sCtx.fillText("S C R A T C H", canvasEl.width / 2, canvasEl.height / 2);
      };

      drawOverlay();

      const getCoords = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const canvasRect = canvasEl.getBoundingClientRect();
        return {
          x: clientX - canvasRect.left,
          y: clientY - canvasRect.top
        };
      };

      const scratchAction = (e) => {
        if (!isDrawing) return;
        const coords = getCoords(e);
        
        sCtx.globalCompositeOperation = 'destination-out';
        sCtx.beginPath();
        sCtx.arc(coords.x, coords.y, 22, 0, Math.PI * 2);
        sCtx.fill();
        
        checkClearedPercent();
      };

      const checkClearedPercent = () => {
        const imgData = sCtx.getImageData(0, 0, canvasEl.width, canvasEl.height);
        const pixels = imgData.data;
        let cleared = 0;

        // Sample every 4th pixel to avoid freezing UI
        for (let i = 3; i < pixels.length; i += 16) {
          if (pixels[i] === 0) {
            cleared++;
          }
        }

        const totalSamples = pixels.length / 16;
        if (cleared / totalSamples > 0.40) { // 40% cleared
          canvasEl.style.opacity = "0";
          canvasEl.style.pointerEvents = "none";
          setTimeout(() => {
            canvasEl.style.display = "none";
          }, 500);
        }
      };

      // Mouse Events
      canvasEl.addEventListener("mousedown", (e) => {
        isDrawing = true;
        scratchAction(e);
      });
      canvasEl.addEventListener("mousemove", scratchAction);
      window.addEventListener("mouseup", () => {
        isDrawing = false;
      });

      // Mobile Touch Events
      canvasEl.addEventListener("touchstart", (e) => {
        isDrawing = true;
        scratchAction(e);
      });
      canvasEl.addEventListener("touchmove", (e) => {
        e.preventDefault(); // Prevents vertical scrolling while scratching card
        scratchAction(e);
      });
      canvasEl.addEventListener("touchend", () => {
        isDrawing = false;
      });
    });
  };

  // Initialize scratchable overlays immediately
  initScratchCards();

  // 6. SCROLL REVEAL TRIGGERS
  function initScrollReveal() {
    const revealElements = [
      document.querySelector("#hero .hero-card"),
      document.querySelector("#scratch-section"),
      document.querySelector("#countdown-section .cd-card"),
      document.querySelector("#gallery-section"),
      document.querySelector("#venue-section .venue-card"),
      document.querySelector("#footer-section")
    ];

    revealElements.forEach(el => {
      if (el) el.classList.add("reveal");
    });

    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: "0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      if (el) revealObserver.observe(el);
    });
  }
});
