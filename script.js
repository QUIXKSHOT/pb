document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const site = document.getElementById('site');
  const bg = document.getElementById('bgVideo');
  const playerGif = document.getElementById('playerGif');
  const bgMusic = document.getElementById('bgMusic');
  const playerContainer = document.querySelector('.player-container');

  let entered = false;

  function enterSite() {
    if (entered) return;
    entered = true;

    splash.setAttribute('aria-hidden', 'true');
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';

    site.classList.add('entered');
    site.removeAttribute('aria-hidden');

    if (bg) {
      bg.muted = true;
      const p = bg.play();
      if (p && p.catch) p.catch(() => {});
    }

    if (playerGif) {
      playerGif.style.opacity = '1';
    }

    if (bgMusic) {
      try { bgMusic.volume = 0.1; } catch (e) {}
      try { bgMusic.loop = true; } catch (e) {}
      const m = bgMusic.play();
      if (m && m.catch) m.catch(() => {});
    }
  }

  splash.addEventListener('click', enterSite);
  splash.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enterSite();
    }
  });

  if (playerContainer) {
    playerContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    playerContainer.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });
  }

  splash.addEventListener('focus', () => splash.classList.add('focused'));
  splash.addEventListener('blur', () => splash.classList.remove('focused'));

});

let flashingActive = false;

document.addEventListener('keydown', (e) => {
  if (
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) &&
    !flashingActive
  ) {
    flashingActive = true;

    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100%';
    flashOverlay.style.height = '100%';
    flashOverlay.style.display = 'flex';
    flashOverlay.style.justifyContent = 'center';
    flashOverlay.style.alignItems = 'center';
    flashOverlay.style.zIndex = '9999';
    flashOverlay.style.pointerEvents = 'none';

    const alertText = document.createElement('div');
    alertText.innerText = 'SKID ALERT';
    alertText.style.color = 'red';
    alertText.style.fontSize = '4rem';
    alertText.style.fontWeight = 'bold';
    alertText.style.textShadow = '0 0 10px #ff0000';
    alertText.style.opacity = '0';

    flashOverlay.appendChild(alertText);
    document.body.appendChild(flashOverlay);

    const flash = () => {
      if (!flashingActive) return;
      
      flashOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      alertText.style.opacity = '1';

      setTimeout(() => {
        if (!flashingActive) return;

        flashOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        alertText.style.opacity = '0';

        setTimeout(flash, 500);
      }, 500);
    };

    flash();

    window.addEventListener('beforeunload', () => {
      flashingActive = false;
    });
  }
});
