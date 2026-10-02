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
