export function initServices() {
  const carousel = document.querySelector("[data-service-carousel]");
  if (!carousel) return;

  const viewport = carousel.querySelector("[data-service-viewport]");
  const track = carousel.querySelector("[data-service-track]");
  const slides = [...track.children];
  const count = carousel.querySelector("[data-service-count]");
  const previousButton = carousel.querySelector("[data-service-prev]");
  const nextButton = carousel.querySelector("[data-service-next]");
  const toggleButton = carousel.querySelector("[data-service-toggle]");
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  let index = 0;
  let direction = 1;
  let timer;
  let pointerInside = false;
  let focusInside = false;
  let manuallyPaused = motionPreference.matches;

  function visibleSlides() {
    return window.matchMedia("(max-width: 620px)").matches ? 1 : 2;
  }

  function lastIndex() {
    return Math.max(0, slides.length - visibleSlides());
  }

  function update() {
    index = Math.min(index, lastIndex());
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const step = slides[0].getBoundingClientRect().width + gap;
    track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(lastIndex() + 1).padStart(2, "0")}`;
  }

  function refreshTimer() {
    window.clearInterval(timer);
    if (
      manuallyPaused ||
      pointerInside ||
      focusInside ||
      motionPreference.matches ||
      document.hidden
    ) {
      return;
    }

    timer = window.setInterval(() => {
      if (index >= lastIndex()) direction = -1;
      else if (index <= 0) direction = 1;
      index += direction;
      update();
    }, 4200);
  }

  function moveBy(amount) {
    const totalPositions = lastIndex() + 1;
    index = (index + amount + totalPositions) % totalPositions;
    direction = amount > 0 ? 1 : -1;
    update();
    refreshTimer();
  }

  previousButton.addEventListener("click", () => moveBy(-1));
  nextButton.addEventListener("click", () => moveBy(1));
  toggleButton.addEventListener("click", () => {
    manuallyPaused = !manuallyPaused;
    if (!manuallyPaused) {
      pointerInside = false;
      focusInside = false;
    }
    toggleButton.setAttribute("aria-pressed", String(manuallyPaused));
    const label = manuallyPaused ? "Lanjutkan slideshow" : "Jeda slideshow";
    toggleButton.setAttribute("aria-label", label);
    toggleButton.title = label;
    refreshTimer();
  });

  carousel.addEventListener("mouseenter", () => {
    pointerInside = true;
    refreshTimer();
  });
  carousel.addEventListener("mouseleave", () => {
    pointerInside = false;
    refreshTimer();
  });
  carousel.addEventListener("focusin", (event) => {
    focusInside = true;
    const focusedSlide = event.target.closest(".service-feature");
    if (focusedSlide) {
      const focusedIndex = slides.indexOf(focusedSlide);
      if (focusedIndex < index) index = focusedIndex;
      else if (focusedIndex >= index + visibleSlides()) {
        index = focusedIndex - visibleSlides() + 1;
      }
      update();
    }
    refreshTimer();
  });
  carousel.addEventListener("focusout", (event) => {
    focusInside = carousel.contains(event.relatedTarget);
    refreshTimer();
  });
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveBy(-1);
    if (event.key === "ArrowRight") moveBy(1);
  });
  window.addEventListener("resize", update);
  document.addEventListener("visibilitychange", refreshTimer);
  motionPreference.addEventListener("change", refreshTimer);

  update();
  refreshTimer();

  carousel.querySelectorAll("[data-service-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const destination = new URL("index.html", window.location.href);
      destination.searchParams.set("view", button.dataset.serviceView);
      window.location.href = destination.href;
    });
  });
}
