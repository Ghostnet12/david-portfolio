// === Config ===
const CONTACT_EMAIL = "nortda85@gmail.com";

// Prefer-reduced-motion?
const REDUCE_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Smooth-scroll logo (passive)
document.getElementById("logo")?.addEventListener(
  "click",
  () => {
    document
      .getElementById("home")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  },
  { passive: true }
);

// Reveal-on-scroll with single observer
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

// Contact -> mail client; small sync work only
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

// Lightweight modal
function showCustomMessageBox(title, message) {
  const box = document.createElement("div");
  box.className =
    "fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[1001] transition-opacity duration-300 opacity-0";
  box.innerHTML = `
    <div class="bg-slate-900/90 border border-slate-700 p-8 rounded-2xl shadow-xl text-center max-w-sm w-full font-inter transform -translate-y-3 transition-transform duration-300">
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

// Navbar shadow (passive scroll)
window.addEventListener(
  "scroll",
  () => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add("shadow-lg");
    else navbar.classList.remove("shadow-lg");
  },
  { passive: true }
);

// In-page anchors + close mobile menu
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener(
    "click",
    (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      const mobileMenu = document.getElementById("mobile-menu");
      const btn = document.getElementById("mobile-menu-button");
      if (mobileMenu?.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    },
    { passive: true }
  )
);

// Mobile menu toggle
document.getElementById("mobile-menu-button")?.addEventListener(
  "click",
  () => {
    const mobileMenu = document.getElementById("mobile-menu");
    if (!mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle("open");
    document
      .getElementById("mobile-menu-button")
      ?.setAttribute("aria-expanded", String(isOpen));
  },
  { passive: true }
);

/* Hover tilt — rAF-batched, motion-safe */
const ENABLE_TILT = !REDUCE_MOTION;
if (ENABLE_TILT) {
  document.querySelectorAll(".neon-card").forEach((card) => {
    let rafId = null;

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // tiny tilt only; rest handled by CSS hover transform
        card.style.transform = `translateY(-4px) rotateX(${(-y * 4).toFixed(
          2
        )}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
      });
    };

    const onLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = ""; // reset to CSS state
    };

    card.addEventListener("mousemove", onMove, { passive: true });
    card.addEventListener("mouseleave", onLeave, { passive: true });
  });
}

/* === Seamless credit ticker (kept lean) === */
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

/* === Starfield — adaptive quality for smooth scroll === */
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

  let stars = [];
  let w = 0,
    h = 0,
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  // Quality scaler (1 = full, lower = fewer stars/blur)
  let quality = REDUCE_MOTION ? 0 : 1;
  let running = quality > 0;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
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
    }));
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    const blur = quality > 0.8 ? 12 : quality > 0.5 ? 8 : 5;

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
          s.color = pick(palette);
          s.da = rand(0.35, 0.9) * 0.012;
        }
      }
      ctx.save();
      ctx.globalAlpha = s.a;
      ctx.shadowBlur = blur;
      ctx.shadowColor = s.color;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // rAF loop with simple FPS monitor to adapt quality
  let last = performance.now();
  let raf = null;
  let emaDt = 1; // smoothed frame cost in "60fps units"
  function loop(t) {
    const dt = Math.min(3, (t - last) / (1000 / 60));
    last = t;
    // Exponential moving average of frame cost
    emaDt = emaDt * 0.9 + dt * 0.1;

    // If things get heavy, gracefully reduce star quality; recover slowly
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

  // Pause during scroll bursts to avoid jank on low-end devices
  let scrollTimer = null;
  const onScroll = () => {
    if (!running) return;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    // draw once (no twinkle update) to keep background visible
    draw(0);
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }, 120);
  };

  // Lifecycle
  resize();
  if (running) raf = requestAnimationFrame(loop);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!REDUCE_MOTION) {
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
