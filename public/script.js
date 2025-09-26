// === Config ===
const CONTACT_EMAIL = "nortda85@gmail.com";
const YT_VIDEO_ID = "RXr7lQxxtzM"; // your music link ID
window.MUSIC_BPM = window.MUSIC_BPM || 100; // tweakable in console

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
    <button class="bg-white text-sky-600 px-6 py-3 rounded-lg hover:shadow-lg">OK</button>
  </div>`;
  document.body.appendChild(box);
  const close = () => document.body.removeChild(box);
  box
    .querySelector("button")
    .addEventListener("click", close, { passive: true });
  requestAnimationFrame(() => {
    box.classList.remove("opacity-0");
    box.querySelector("div").classList.remove("-translate-y-3");
  });
}

/* Navbar shadow */
window.addEventListener(
  "scroll",
  () => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    window.scrollY > 50
      ? navbar.classList.add("shadow-lg")
      : navbar.classList.remove("shadow-lg");
  },
  { passive: true }
);

/* In-page anchors & mobile menu */
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener(
    "click",
    (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const menu = document.getElementById("mobile-menu");
      const btn = document.getElementById("mobile-menu-button");
      if (menu?.classList.contains("open")) {
        menu.classList.remove("open");
        btn?.setAttribute("aria-expanded", "false");
      }
    },
    { passive: true }
  )
);
document.getElementById("mobile-menu-button")?.addEventListener(
  "click",
  () => {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;
    const isOpen = menu.classList.toggle("open");
    document
      .getElementById("mobile-menu-button")
      ?.setAttribute("aria-expanded", String(isOpen));
  },
  { passive: true }
);

/* Tiny hover tilt */
if (!REDUCE_MOTION) {
  document.querySelectorAll(".neon-card").forEach((card) => {
    let rafId = null;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `translateY(-4px) rotateX(${(-y * 4).toFixed(
          2
        )}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
      });
    };
    const onLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = "";
    };
    card.addEventListener("mousemove", onMove, { passive: true });
    card.addEventListener("mouseleave", onLeave, { passive: true });
  });
}

/* Seamless credit ticker */
(function setupTicker() {
  const inner = document.querySelector(".ticker__inner");
  const first = inner?.querySelector(".ticker__list");
  const shell = document.querySelector(".ticker");
  if (!inner || !first || !shell) return;
  const fill = () => {
    const segW = first.getBoundingClientRect().width || first.offsetWidth;
    const segMR = parseFloat(getComputedStyle(first).marginRight) || 0;
    const containerW = shell.getBoundingClientRect().width || shell.offsetWidth;
    const needed = Math.max(2, Math.ceil(containerW / (segW + segMR)) + 2);
    const current = inner.querySelectorAll(".ticker__list").length;
    for (let i = current; i < needed; i++) {
      const clone = first.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      inner.appendChild(clone);
    }
    inner.style.setProperty("--ticker-w", `${Math.ceil(segW + segMR)}px`);
  };
  fill();
  document.fonts?.ready.then(fill).catch(() => {});
  let tid;
  const onResize = () => {
    clearTimeout(tid);
    tid = setTimeout(fill, 100);
  };
  window.addEventListener("load", fill, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
})();

/* === Beat helper for sync triggers === */
const Beat = (() => {
  let player = null,
    ready = false,
    playing = false,
    beatOffset = 0;
  let bpm = Math.max(60, Math.min(180, window.MUSIC_BPM || 100));

  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

  const getTime = () => {
    if (!player || !ready) return 0;
    try {
      return player.getCurrentTime() || 0;
    } catch {
      return 0;
    }
  };
  const getBeatIndex = () => {
    if (!playing) return null;
    const t = getTime();
    const bps = bpm / 60;
    return Math.floor((t - beatOffset) * bps);
  };
  const getPulse = () => {
    if (!ready || !playing || !player) return 0;
    let t = 0;
    try {
      t = player.getCurrentTime() || 0;
    } catch {
      t = 0;
    }
    const period = 60 / bpm;
    let phase = (t - beatOffset) % period;
    if (phase < 0) phase += period;
    const x = phase / period; // 0..1
    const windowWidth = 0.18; // attack window
    const gain = 0.9;
    if (x > windowWidth) return 0;
    const normalized = 1 - x / windowWidth;
    return easeOutCubic(normalized) * gain;
  };

  const attach = (p) => {
    player = p;
    ready = !!p;
  };
  const onPlay = () => {
    playing = true;
    try {
      beatOffset = player.getCurrentTime() || 0;
    } catch {
      beatOffset = 0;
    }
  };
  const onPause = () => {
    playing = false;
  };
  const setBpm = (x) => {
    bpm = Math.max(60, Math.min(180, x | 0 || 100));
  };

  return { attach, onPlay, onPause, getPulse, getBeatIndex, setBpm };
})();

/* Starfield (adaptive + subtle beat pulse) */
(function starfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const palette = [
    "#22d3ee",
    "#60a5fa",
    "#818cf8",
    "#a78bfa",
    "#f472b6",
    "#14b8a6",
    "#22c55e",
    "#f59e0b",
    "#fde047",
    "#94a3b8",
  ];

  let stars = [],
    w = 0,
    h = 0,
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let quality = 1,
    running = quality > 0;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function pick(a) {
    return a[(Math.random() * a.length) | 0];
  }

  function resize() {
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
    draw(1);
  }

  function initStars() {
    const base = Math.min(260, Math.max(90, Math.floor((w * h) / 18000)));
    const count = Math.floor(base * quality);
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.5, 1.8),
      a: rand(0.2, 0.85),
      da: rand(0.35, 0.9) * 0.012,
      up: Math.random() < 0.5,
      color: pick(palette),
      bass: Math.random() < 0.35,
    }));
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    const pulse = Beat.getPulse();
    const baseBlur = quality > 0.8 ? 12 : quality > 0.5 ? 8 : 5;
    const blur = baseBlur * (1 + pulse * 0.25);

    for (const s of stars) {
      if (running) {
        s.a += (s.up ? s.da : -s.da) * dt;
        if (s.a > 0.9) {
          s.a = 0.9;
          s.up = false;
        }
        if (s.a < 0.08) {
          s.a = 0.08;
          s.up = true;
          s.color = s.color;
          s.da = rand(0.35, 0.9) * 0.012;
        }
      }
      let scale = 1,
        alpha = s.a;
      if (s.bass && pulse > 0) {
        scale = 1 + pulse * 0.12;
        alpha = Math.min(1, s.a + pulse * 0.15);
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = blur;
      ctx.shadowColor = s.color;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let last = performance.now(),
    raf = null,
    emaDt = 1;
  function loop(t) {
    const dt = Math.min(3, (t - last) / (1000 / 60));
    last = t;
    emaDt = emaDt * 0.9 + dt * 0.1;
    if (emaDt > 1.6 && quality > 0.5) {
      quality = Math.max(0.5, quality - 0.1);
      initStars();
    } else if (emaDt < 1.1 && quality < 1) {
      quality = Math.min(1, quality + 0.02);
      initStars();
    }
    draw(dt);
    if (running) raf = requestAnimationFrame(loop);
  }

  let scrollTimer = null;
  const onScroll = () => {
    if (!running) return;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    draw(0);
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }, 120);
  };

  resize();
  if (running) raf = requestAnimationFrame(loop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
  window.addEventListener(
    "resize",
    (() => {
      let rid;
      return () => {
        clearTimeout(rid);
        rid = setTimeout(resize, 100);
      };
    })(),
    { passive: true }
  );
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* === YouTube Background Music (autoplay @ ~7%, with nudge fallback) === */
(function music() {
  const panel = document.createElement("div");
  panel.id = "music-panel";
  panel.innerHTML = `
    <div id="yt-sound"></div>
    <button id="music-play" class="icon-btn" title="Play/Pause" aria-label="Play or pause">▶</button>
    <button id="music-mute" class="icon-btn" title="Mute/Unmute" aria-label="Mute or unmute">🔊</button>
    <span class="label">Vol</span><input id="music-vol" type="range" min="0" max="100" value="7" aria-label="Volume">
    <span id="music-nudge" hidden>Enable audio</span>
  `;
  document.body.appendChild(panel);

  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(api);

  let player = null,
    ready = false,
    playing = false;
  const volEl = document.getElementById("music-vol");
  const playBtn = document.getElementById("music-play");
  const muteBtn = document.getElementById("music-mute");
  const nudge = document.getElementById("music-nudge");

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("yt-sound", {
      width: 1,
      height: 1,
      videoId: YT_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        loop: 1,
        playlist: YT_VIDEO_ID,
        modestbranding: 1,
        rel: 0,
        mute: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          ready = true;
          try {
            player.unMute();
            player.setVolume(7);
            player.playVideo();
          } catch (e) {}
          setTimeout(checkAutoplayResult, 1500);
          Beat.attach(player);
        },
        onStateChange: (e) => {
          playing = e.data === YT.PlayerState.PLAYING;
          playBtn.textContent = playing ? "⏸" : "▶";
          if (playing) {
            Beat.onPlay();
            if (!isHidden(nudge)) hideNudge();
          } else {
            Beat.onPause();
          }
        },
      },
    });
  };

  function isHidden(el) {
    return el.hasAttribute("hidden");
  }
  function showNudge() {
    nudge.removeAttribute("hidden");
  }
  function hideNudge() {
    nudge.setAttribute("hidden", "");
  }

  function checkAutoplayResult() {
    if (!player) return;
    const state = player.getPlayerState?.();
    if (state !== YT.PlayerState.PLAYING) {
      showNudge();
      const unlock = () => {
        hideNudge();
        try {
          player.unMute();
          player.setVolume(7);
          player.playVideo();
        } catch (e) {}
        window.removeEventListener("pointerdown", unlock, { passive: true });
        window.removeEventListener("keydown", unlock, { passive: true });
        window.removeEventListener("scroll", unlock, { passive: true });
      };
      window.addEventListener("pointerdown", unlock, {
        once: true,
        passive: true,
      });
      window.addEventListener("keydown", unlock, { once: true, passive: true });
      window.addEventListener("scroll", unlock, { once: true, passive: true });
    }
  }

  // Controls
  playBtn.addEventListener(
    "click",
    () => {
      if (!ready) return;
      try {
        if (playing) {
          player.pauseVideo();
        } else {
          player.unMute();
          player.setVolume(parseInt(volEl.value, 10) || 7);
          player.playVideo();
        }
      } catch {}
    },
    { passive: true }
  );

  muteBtn.addEventListener(
    "click",
    () => {
      if (!ready) return;
      try {
        if (player.isMuted && player.isMuted()) {
          player.unMute();
          muteBtn.textContent = "🔊";
          muteBtn.classList.remove("active");
        } else {
          player.mute();
          muteBtn.textContent = "🔇";
          muteBtn.classList.add("active");
        }
      } catch {}
    },
    { passive: true }
  );

  volEl.addEventListener(
    "input",
    () => {
      if (!ready) return;
      try {
        player.setVolume(parseInt(volEl.value, 10) || 0);
      } catch {}
    },
    { passive: true }
  );
})();

/* === About cards: one-at-a-time random beat accent === */
(function cardsBeat() {
  if (REDUCE_MOTION) return;
  const cards = Array.from(document.querySelectorAll("#about .neon-card"));
  if (!cards.length) return;

  let lastBeat = null;
  let lastCardIndex = -1;
  const timers = new Map();

  const pickNext = () => {
    if (cards.length === 1) return 0;
    let i;
    do {
      i = (Math.random() * cards.length) | 0;
    } while (i === lastCardIndex);
    return i;
  };

  const tick = () => {
    const idx = Beat.getBeatIndex && Beat.getBeatIndex();
    if (typeof idx === "number" && idx !== lastBeat) {
      lastBeat = idx;
      const i = pickNext();
      lastCardIndex = i;
      const el = cards[i];
      // clear any existing timer on this card
      if (timers.has(el)) clearTimeout(timers.get(el));
      el.classList.add("card-beat");
      // keep it brief and subtle
      const dur = 160;
      const t = setTimeout(() => {
        el.classList.remove("card-beat");
      }, dur);
      timers.set(el, t);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
