export const heroMarkup = `
  <section class="landing-hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <span class="hero-kicker"><i></i> SATU KOTA, TERHUBUNG</span>
      <h1 id="hero-title">Masa depan kota dimulai dari <span class="typed-wrap"><span id="typed-word" aria-live="off">Bandar Lampung</span><i class="type-caret" aria-hidden="true"></i></span></h1>
      <p>
        Pantau kondisi kota, temukan layanan publik, dan ikut mengambil bagian
        dalam perubahan Bandar Lampung.
      </p>
      <div class="hero-actions">
        <a class="hero-primary" href="index.html?from=landing">
          Jelajahi dasbor <svg><use href="#i-arrow" /></svg>
        </a>
        <a class="hero-secondary" href="#layanan">
          Kenali layanan <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
    <a class="hero-scroll" href="#tentang">
      <span>GULIR UNTUK MENJELAJAH</span><i></i>
    </a>
  </section>
`;

export function initHero() {
  const typedWord = document.getElementById("typed-word");
  if (
    !typedWord ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const phrases = [
    "Bandar Lampung",
    "kota yang terhubung",
    "masa depan bersama",
  ];
  let phraseIndex = 0;

  function typePhrase() {
    const currentPhrase = phrases[phraseIndex];
    const nextPhrase = phrases[(phraseIndex + 1) % phrases.length];
    let characterIndex = currentPhrase.length;

    const erase = window.setInterval(() => {
      characterIndex -= 1;
      typedWord.textContent = currentPhrase.slice(0, characterIndex);

      if (characterIndex <= 0) {
        window.clearInterval(erase);
        phraseIndex = (phraseIndex + 1) % phrases.length;
        let nextIndex = 0;

        const write = window.setInterval(() => {
          nextIndex += 1;
          typedWord.textContent = nextPhrase.slice(0, nextIndex);

          if (nextIndex >= nextPhrase.length) {
            window.clearInterval(write);
            window.setTimeout(typePhrase, 1900);
          }
        }, 65);
      }
    }, 45);
  }

  window.setTimeout(typePhrase, 1900);
}
