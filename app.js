const header = document.querySelector(".site-header");
const contactForm = document.querySelector(".contact-form");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt]");
const parallaxStage = document.querySelector("[data-parallax]");
const themeToggle = document.querySelector(".theme-toggle");
const carousel = document.querySelector("[data-carousel]");
const frames = [...document.querySelectorAll(".project-frame")];
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");

const whatsappNumber = "919145933905";
let activeFrame = 0;

document.documentElement.classList.add("js");

const setHeaderState = () => {
  header.dataset.elevated = window.scrollY > 8 ? "true" : "false";
};

const setTheme = (theme) => {
  const dark = theme === "dark";
  document.body.classList.toggle("dark-mode", dark);
  themeToggle.setAttribute("aria-pressed", String(dark));
  localStorage.setItem("jahanvi-theme-v2", theme);
};

const updateCarousel = () => {
  frames.forEach((frame, index) => {
    frame.classList.remove("active", "prev-slide", "next-slide");

    if (index === activeFrame) {
      frame.classList.add("active");
      return;
    }

    const previous = (activeFrame - 1 + frames.length) % frames.length;
    const next = (activeFrame + 1) % frames.length;

    if (index === previous) frame.classList.add("prev-slide");
    if (index === next) frame.classList.add("next-slide");
  });
};

const moveCarousel = (direction) => {
  activeFrame = (activeFrame + direction + frames.length) % frames.length;
  updateCarousel();
};

setHeaderState();
updateCarousel();
setTheme(localStorage.getItem("jahanvi-theme-v2") || "light");

window.addEventListener("scroll", setHeaderState, { passive: true });

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
});

prevButton.addEventListener("click", () => moveCarousel(-1));
nextButton.addEventListener("click", () => moveCarousel(1));

carousel.addEventListener("pointerenter", () => {
  carousel.dataset.paused = "true";
});

carousel.addEventListener("pointerleave", () => {
  carousel.dataset.paused = "false";
});

window.setInterval(() => {
  if (carousel.dataset.paused !== "true") moveCarousel(1);
}, 4300);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 13;
    const rotateX = ((0.5 - y / rect.height)) * 13;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

window.addEventListener(
  "pointermove",
  (event) => {
    if (!parallaxStage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    parallaxStage.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
  },
  { passive: true }
);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const whatsapp = formData.get("whatsapp").trim();
  const status = contactForm.querySelector(".form-status");

  const text = [
    "Hello Jahanvi Studio, I want to create a premium website.",
    `Name: ${name}`,
    `Email: ${email}`,
    `WhatsApp: ${whatsapp}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  status.innerHTML = `Your details are ready. <a href="${whatsappUrl}" target="_blank" rel="noreferrer">Continue on WhatsApp</a>.`;
  contactForm.reset();
});
