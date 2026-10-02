import { initHero, heroMarkup } from "./features/landing/hero.js?v=20261002-landing";
import { initServices, servicesMarkup } from "./features/landing/services.js?v=20261002-landing";
import { aboutMarkup } from "./features/landing/about.js?v=20261002-landing";
import { contactMarkup } from "./features/landing/contact.js?v=20261002-landing";

const featureMarkup = {
  "features/landing/hero.html": heroMarkup,
  "features/landing/about.html": aboutMarkup,
  "features/landing/services.html": servicesMarkup,
  "features/landing/contact.html": contactMarkup,
};

function renderFeatures() {
  const features = document.getElementById("landing-features");
  if (!features) {
    console.warn("landing-features container not found");
    return;
  }

  for (const slot of [...features.querySelectorAll("[data-feature-src]")]) {
    const template = featureMarkup[slot.dataset.featureSrc];
    if (template) {
      slot.innerHTML = template;
    } else {
      slot.remove();
    }
  }

  features.setAttribute("aria-busy", "false");
}

function initLandingAnimations() {
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }
}

renderFeatures();
initLandingAnimations();
initHero();
initServices();
