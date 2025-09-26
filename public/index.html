// === Config ===
const CONTACT_EMAIL = "nortda85@gmail.com";
const YT_VIDEO_ID = "RXr7lQxxtzM"; // YouTube music ID
window.MUSIC_BPM = window.MUSIC_BPM || 100; // used for subtle beat effects (no audio analysis)

const REDUCE_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* Smooth logo scroll */
document.getElementById("logo")?.addEventListener(
  "click",
  () => {
    document
      .getElementById("home")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  },
  { passive: true }
);

/* Lazy reveal */
const io = new IntersectionObserver(
  (entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("loaded");
        obs.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll(".lazy-load").forEach((el) => io.observe(el));

/* Contact -> open mail client */
document.getElementById("contactForm")?.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!name || !email || !message) {
      showCustomMessageBox(
        "Validation Error",
        "Please fill out all required fields."
      );
      return;
    }
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      subject ? `Subject: ${subject}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    const mailto = `mailto:${encodeURIComponent(
      CONTACT_EMAIL
    )}?subject=${encodeURIComponent(
      subject || `New message from ${name}`
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  },
  { passive: false }
);

function showCustomMessageBox(title, message) {
  const box = document.createElement("div");
  box.className =
    "fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[1001] transition-opacity duration-300 opacity-0";
  box.innerHTML = `<div class="bg-slate-900/90 border border-slate-700 p-8 rounded-2xl shadow-xl text-center max-w-sm w-full font-inter transform -translate-y-3 transition-transform duration-300">
    <h4 class="text-2xl font-bold mb-4 text-white">${title}</h4>
    <p class="text-slate-300 mb-6">${message}</p>
    <button class="btn-ghost" style="border:1px solid rgba(148,163,184,.35)" aria-label="Close">OK</button>
  </div>`;
  document.body.appendChild(box);
  requestAnimationFrame(() => {
    box.classList.remove("opacity-0");
    box.firstElementChild.classList.remove("-translate-y-3");
  });
  box
    .querySelector("button")
    .addEventListener("click", () => document.body.removeChild(box));
}

/* Navbar shadow on scroll */
window.addEventListener(
  "scroll",
  () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) navbar.classList.add("shadow-lg");
    else navbar.classList.remove("shadow-lg");
  },
  { passive: true }
);

/* Smooth anchor scrolling + close mobile menu */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu?.classList.remove("open");
  });
});

/* Mobile menu */
document.getElementById("mobile-menu-button")?.addEventListener("click", () => {
  const mobileMenu = document.getElementById("mobile-menu");
  const isOpen = mobileMenu.classList.toggle("open");
  document
    .getElementById("mobile-menu-button")
    .setAttribute("aria-expanded", String(isOpen));
});

/* ---- Endless Credit Ticker (no seam) ---- */
(function setupTicker() {
  const inner = document.querySelector(".ticker__inner");
  const firstList = document.querySelector(".ticker__list");
  if (!inner || !firstList) return;

  // Ensure a leading and trailing gap symmetry
  const ensureDotSpacing = () => {
    const items = firstList.querySelectorAll("li");
    if (items[0] && !items[0].classList.contains("dot")) {
      const dot = document.createElement("li");
      dot.className = "dot";
      dot.textContent = "•";
      firstList.insertBefore(dot, items[0]);
    }
  };
  ensureDotSpacing();

  const rebuild = () => {
    // Clear clones
    inner.querySelectorAll(".ticker__list.clone").forEach((n) => n.remove());

    const listWidth = firstList.getBoundingClientRect().width;
    const viewportWidth = inner.parentElement.getBoundingClientRect().width;
    // We want at least 2x viewport width so the keyframe distance = listWidth
    let needWidth = viewportWidth * 2 + listWidth;
    let acc = listWidth;
    while (acc < needWidth) {
      const clone = firstList.cloneNode(true);
      clone.classList.add("clone");
      inner.appendChild(clone);
      acc += listWidth;
    }
    inner.style.setProperty("--ticker-w", `${listWidth}px`);
  };

  const ro = new ResizeObserver(() => rebuild());
  ro.observe(inner.parentElement);
  rebuild();
})();

/* ---- Starfield (with subtle beat flares) ---- */
(function starfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w,
    h,
    stars = [];
  const palette = [
    "#22d3ee",
    "#a78bfa",
    "#f472b6",
    "#14b8a6",
    "#60a5fa",
    "#22c55e",
  ];
  const STAR_COUNT = 160;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    if (stars.length === 0) init();
  }

  function init() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.2 + 0.2) * dpr,
      a: Math.random(),
      hue: palette[(Math.random() * palette.length) | 0],
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function render(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.tw += 0.015 + Math.random() * 0.003;
      const twinkle = (Math.sin(s.tw) + 1) / 2; // 0..1
      const alpha = 0.25 + twinkle * 0.55; // softer range
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(s.hue, alpha);
      ctx.arc(s.x, s.y, s.r * (0.8 + twinkle * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(render);
  }

  function hexToRgba(hex, a) {
    const v = hex.replace("#", "");
    const r = parseInt(v.substring(0, 2), 16);
    const g = parseInt(v.substring(2, 4), 16);
    const b = parseInt(v.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // "Beat" flares - subtle; triggered by our beat scheduler below
  function flareStars() {
    const n = 8 + ((Math.random() * 6) | 0);
    for (let i = 0; i < n; i++) {
      const s = stars[(Math.random() * stars.length) | 0];
      s.tw += Math.PI / 2; // quick brighten
      s.hue = palette[(Math.random() * palette.length) | 0];
    }
  }

  window.__starfieldFlare = flareStars; // expose to beat scheduler
  window.addEventListener("resize", resize, { passive: true });
  resize();
  init();
  requestAnimationFrame(render);
})();

/* ---- Beat Scheduler (BPM-based; does NOT analyze audio) ---- */
(function beatScheduler() {
  if (REDUCE_MOTION) return;
  const bpm = window.MUSIC_BPM || 100;
  const interval = 60_000 / bpm; // ms per beat
  let last = performance.now();

  const aboutCards = Array.from(document.querySelectorAll("#about .neon-card"));

  function tick(now) {
    if (now - last >= interval) {
      last = now;

      // Starfield subtle flare
      if (typeof window.__starfieldFlare === "function")
        window.__starfieldFlare();

      // One random About card gets a brief glow
      if (aboutCards.length) {
        const idx = (Math.random() * aboutCards.length) | 0;
        const card = aboutCards[idx];
        card.classList.add("card-beat");
        setTimeout(() => card.classList.remove("card-beat"), 170);
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ---- Lightweight Music UI (YouTube embed on demand) ---- */
(function musicUI() {
  const panel = document.getElementById("music-panel");
  const btn = document.getElementById("music-toggle");
  const muteBtn = document.getElementById("music-mute");
  const vol = document.getElementById("music-vol");
  const nudge = document.getElementById("music-nudge");
  if (!panel || !btn || !muteBtn || !vol) return;

  panel.classList.remove("hidden"); // show panel

  let player = null;
  let isMuted = true;
  let isPlaying = false;

  function loadYT(onReady) {
    if (window.YT && window.YT.Player) {
      onReady();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = onReady;
    document.body.appendChild(tag);
  }

  function ensurePlayer(cb) {
    if (player) return cb();
    loadYT(() => {
      player = new YT.Player("yt-sound", {
        height: "0",
        width: "0",
        videoId: YT_VIDEO_ID,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1 },
        events: {
          onReady: (e) => {
            player.setVolume(Math.round(parseFloat(vol.value) * 100));
            player.mute(); // start muted to satisfy autoplay rules
            isMuted = true;
            if (cb) cb();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              isPlaying = true;
              btn.classList.add("active");
              btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
              nudge.classList.add("hidden");
            }
            if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            ) {
              isPlaying = false;
              btn.classList.remove("active");
              btn.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
          },
        },
      });
    });
  }

  btn.addEventListener("click", () => {
    ensurePlayer(() => {
      if (!isPlaying) {
        // First user gesture -> unmute respecting volume slider
        if (isMuted) {
          player.unMute();
          isMuted = false;
          muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    });
  });

  muteBtn.addEventListener("click", () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      isMuted = false;
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else {
      player.mute();
      isMuted = true;
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
  });

  vol.addEventListener("input", () => {
    if (!player) return;
    player.setVolume(Math.round(parseFloat(vol.value) * 100));
  });

  // Inform the user they need to click once
  setTimeout(() => nudge.classList.remove("hidden"), 600);
})();

/* Utility: throttle */
function throttle(fn, wait = 100) {
  let t = 0;
  return (...args) => {
    const now = Date.now();
    if (now - t > wait) {
      t = now;
      fn(...args);
    }
  };
}
