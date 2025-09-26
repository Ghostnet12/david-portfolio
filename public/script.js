// === Config ===
const CONTACT_EMAIL = "nortda85@gmail.com"; // change if you prefer a different address

// Smooth scroll for logo
document.getElementById("logo")?.addEventListener("click", () => {
  document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
});

// Intersection Observer for lazy loading animations
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loaded");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);

document.querySelectorAll(".lazy-load").forEach((el) => observer.observe(el));

// Form submission handler: opens user's email client with a prefilled message
document
  .getElementById("contactForm")
  ?.addEventListener("submit", function (e) {
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

    const mailto =
      `mailto:${encodeURIComponent(CONTACT_EMAIL)}` +
      `?subject=${encodeURIComponent(subject || `New message from ${name}`)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });

// Custom message box function to replace alert()
function showCustomMessageBox(title, message) {
  const messageBox = document.createElement("div");
  messageBox.className =
    "fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[1001] transition-opacity duration-300 opacity-0";
  messageBox.innerHTML = `
    <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full font-inter transform -translate-y-5 transition-transform duration-300">
      <h4 class="text-2xl font-bold mb-4">${title}</h4>
      <p class="text-gray-600 mb-6">${message}</p>
      <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">OK</button>
    </div>
  `;
  document.body.appendChild(messageBox);

  const close = () => document.body.removeChild(messageBox);
  messageBox.querySelector("button").addEventListener("click", close);

  requestAnimationFrame(() => {
    messageBox.classList.remove("opacity-0");
    messageBox.querySelector("div").classList.remove("-translate-y-5");
  });
}

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add("shadow-lg");
  } else {
    navbar.classList.remove("shadow-lg");
  }
});

// Smooth scrolling for in-page navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Close mobile menu after clicking a link
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) {
        mobileMenu.style.maxHeight = "0px";
        mobileMenu.classList.remove("open");
      }
    }
  });
});

// Mobile menu toggle functionality
document.getElementById("mobile-menu-button")?.addEventListener("click", () => {
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu) return;

  const isOpen = mobileMenu.classList.contains("open");
  if (isOpen) {
    mobileMenu.style.maxHeight = "0px";
    mobileMenu.classList.remove("open");
  } else {
    // Set to scrollHeight for smooth expand
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
    mobileMenu.classList.add("open");
  }
});
