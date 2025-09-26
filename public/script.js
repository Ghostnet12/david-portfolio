// === Config ===
const CONTACT_EMAIL = "nortda85@gmail.com";

// Smooth-scroll logo
document.getElementById("logo")?.addEventListener("click", () => {
  document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
});

// Reveal-on-scroll
const io = new IntersectionObserver(
  (entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("loaded");
        obs.unobserve(e.target);
      }
    }
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll(".lazy-load").forEach((el) => io.observe(el));

// Contact form -> mail client
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
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
});

// Simple modal
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
  box.querySelector("button").addEventListener("click", close);
  requestAnimationFrame(() => {
    box.classList.remove("opacity-0");
    box.querySelector("div").classList.remove("-translate-y-3");
  });
}

// Navbar shadow (passive)
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
document.getElementById("mobile-menu-button")?.addEventListener("click", () => {
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu) return;
  const isOpen = mobileMenu.classList.toggle("open");
  document
    .getElementById("mobile-menu-button")
    ?.setAttribute("aria-expanded", String(isOpen));
});

/* Hover tilt (motion-safe) — gentle neon vibe */
const ENABLE_TILT = !window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

if (ENABLE_TILT) {
  document.querySelectorAll(".neon-card").forEach((card) => {
    let rafId = null;

    card.addEventListener(
      "mousemove",
      (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
        const y = (e.clientY - r.top) / r.height - 0.5; // -0.5 .. 0.5

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `translateY(-4px) rotateX(${(-y * 5).toFixed(
            2
          )}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
        });
      },
      { passive: true }
    );

    card.addEventListener(
      "mouseleave",
      () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = ""; // resets to CSS state
      },
      { passive: true }
    );
  });
}

/* === Seamless credit ticker (desktop gap fix + even segment spacing) === */
(function setupTicker() {
  const inner = document.querySelector(".ticker__inner");
  const first = inner?.querySelector(".ticker__list");
  const shell = document.querySelector(".ticker");
  if (!inner || !first || !shell) return;

  const fill = () => {
    const segW = first.getBoundingClientRect().width || first.offsetWidth;

    // include trailing margin so segment spacing stays even
    const cs = getComputedStyle(first);
    const segMR = parseFloat(cs.marginRight) || 0;

    const containerW = shell.getBoundingClientRect().width || shell.offsetWidth;
    const needed = Math.max(2, Math.ceil(containerW / (segW + segMR)) + 2);
    const current = inner.querySelectorAll(".ticker__list").length;

    for (let i = current; i < needed; i++) {
      const clone = first.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      inner.appendChild(clone);
    }

    // animate one full segment width including margin
    const w = Math.ceil(segW + segMR);
    inner.style.setProperty("--ticker-w", `${w}px`);
  };

  fill();
  if (document.fonts?.ready) document.fonts.ready.then(fill).catch(() => {});
  let tid;
  const onResize = () => {
    clearTimeout(tid);
    tid = setTimeout(fill, 120);
  };
  window.addEventListener("load", fill, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
})();

/* === Starfield — twinkling, color-shifting to match card neon === */
(function starfield() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const palette = [
    "#22d3ee" /* sky */,
    "#60a5fa" /* blue */,
    "#818cf8" /* indigo */,
    "#a78bfa" /* purple */,
    "#f472b6" /* pink */,
    "#14b8a6" /* teal */,
    "#22c55e" /* green */,
    "#f59e0b" /* amber */,
    "#fde047" /* yellow */,
    "#94a3b8" /* slate */,
  ];

  let stars = [];
  let w = 0,
    h = 0,
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let running = !reduceMotion;

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
    draw(1); // fresh paint
  }

  function initStars() {
    const targetCount = Math.min(
      260,
      Math.max(90, Math.floor((w * h) / 18000))
    );
    stars = new Array(targetCount).fill(0).map(() => {
      const color = pick(palette);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.5, 1.8),
        a: rand(0.2, 0.85),
        da: rand(0.35, 0.9) * 0.012, // twinkle speed
        up: Math.random() < 0.5, // direction (fading up/down)
        color,
      };
    });
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      // update alpha
      if (running) {
        s.a += (s.up ? s.da : -s.da) * dt;
        if (s.a > 0.9) {
          s.a = 0.9;
          s.up = false;
        }
        if (s.a < 0.08) {
          s.a = 0.08;
          s.up = true;
          s.color = pick(palette); // change color as it reappears
          s.da = rand(0.35, 0.9) * 0.012;
        }
      }

      // neon glow
      ctx.save();
      ctx.globalAlpha = s.a;
      ctx.shadowBlur = 12;
      ctx.shadowColor = s.color;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let last = performance.now();
  function loop(t) {
    const dt = Math.min(2.5, (t - last) / (1000 / 60)); // normalize around 60fps
    last = t;
    draw(dt);
    if (running) raf = requestAnimationFrame(loop);
  }
  let raf = null;

  // Lifecycle
  resize();
  if (running) raf = requestAnimationFrame(loop);

  // Pause when tab hidden to save battery
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!reduceMotion) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });

  // Handle resizes
  let rid;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(rid);
      rid = setTimeout(resize, 120);
    },
    { passive: true }
  );
})();
