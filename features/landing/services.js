export const servicesMarkup = `
  <section class="services-section" id="layanan">
    <div class="section-index" data-aos="fade-up">
      02 <span>/ YANG BISA DILAKUKAN</span>
    </div>
    <div class="services-heading" data-aos="fade-up" data-aos-delay="100">
      <h2>Layanan kota,<br /><em>lebih dekat.</em></h2>
      <p>
        Dari perjalanan harian hingga laporan lingkungan, semua berawal dari satu
        tempat.
      </p>
    </div>
    <div
      class="service-carousel"
      data-service-carousel
      role="region"
      aria-label="Galeri layanan kota"
    >
      <div class="service-carousel-controls">
        <span data-service-count aria-live="polite">01 / 03</span>
        <button type="button" data-service-prev aria-label="Layanan sebelumnya" title="Layanan sebelumnya">
          <svg class="carousel-arrow carousel-arrow-back"><use href="#i-arrow" /></svg>
        </button>
        <button type="button" data-service-next aria-label="Layanan berikutnya" title="Layanan berikutnya">
          <svg class="carousel-arrow"><use href="#i-arrow" /></svg>
        </button>
      </div>
      <div class="service-carousel-viewport" data-service-viewport tabindex="0">
        <div class="landing-services" data-service-track>
          <article class="service-feature service-traffic" data-aos="fade-up">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1100&q=85"
              alt="Jalan perkotaan dengan lalu lintas"
              loading="lazy"
            />
            <span class="service-number">01 / MOBILITAS</span>
            <div>
              <h3>Lalu lintas & transportasi</h3>
              <p>Pantau kepadatan, rute bus, dan pilihan perjalanan di kota.</p>
              <button type="button" data-service-view="smart-traffic" aria-label="Buka layanan lalu lintas dan transportasi">
                <svg><use href="#i-arrow" /></svg>
              </button>
            </div>
          </article>
          <article class="service-feature service-environment" data-aos="fade-up" data-aos-delay="100">
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=85"
              alt="Lanskap hijau dan alam"
              loading="lazy"
            />
            <span class="service-number">02 / LINGKUNGAN</span>
            <div>
              <h3>Lingkungan & energi</h3>
              <p>Kenali kualitas udara, ruang hijau, air, sampah, dan energi.</p>
              <button type="button" data-service-view="green-city" aria-label="Buka layanan lingkungan">
                <svg><use href="#i-arrow" /></svg>
              </button>
            </div>
          </article>
          <article class="service-feature service-map" data-aos="fade-up" data-aos-delay="180">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85"
              alt="Pemandangan gedung kota dari atas"
              loading="lazy"
            />
            <span class="service-number">03 / EKSPLORASI</span>
            <div>
              <h3>Peta fasilitas kota</h3>
              <p>Temukan fasilitas publik dan titik layanan di sekitar Anda.</p>
              <button type="button" data-service-view="city-map" aria-label="Buka peta fasilitas kota">
                <svg><use href="#i-arrow" /></svg>
              </button>
            </div>
          </article>
          <article class="service-feature service-report" data-aos="fade-up" data-aos-delay="260">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85"
              alt="Warga berdiskusi dan bekerja bersama"
              loading="lazy"
            />
            <span class="service-number">04 / RUANG WARGA</span>
            <div>
              <h3>Laporan & informasi warga</h3>
              <p>Sampaikan masalah di lingkungan dan ikuti informasi penting kota.</p>
              <button type="button" data-service-view="citizen-report" aria-label="Buka layanan laporan warga">
                <svg><use href="#i-arrow" /></svg>
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
`;

export function initServices() {
  const carousel = document.querySelector("[data-service-carousel]");
  if (!carousel) return;

  const viewport = carousel.querySelector("[data-service-viewport]");
  const track = carousel.querySelector("[data-service-track]");
  const slides = [...track.children];
  const count = carousel.querySelector("[data-service-count]");
  const previousButton = carousel.querySelector("[data-service-prev]");
  const nextButton = carousel.querySelector("[data-service-next]");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let direction = 1;
  let timer;
  let pointerInside = false;
  let focusInside = false;

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
    if (pointerInside || focusInside || motionPreference.matches || document.hidden) {
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
