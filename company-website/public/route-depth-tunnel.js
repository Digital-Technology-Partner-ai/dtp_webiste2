(() => {
  const LINK_SELECTOR = 'a[data-depth-tunnel-link]';
  const STORAGE_KEY = 'dtpDepthTunnelArrival';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let overlay;
  let running = false;

  function createOverlay() {
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'dtp-depth-tunnel';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="dtp-depth-tunnel__scan"></div>
      ${Array.from({ length: 9 }, () => '<div class="dtp-depth-tunnel__frame"></div>').join('')}
      <div class="dtp-depth-tunnel__label">signal transfer</div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function animate(element, keyframes, options) {
    const animation = element.animate(keyframes, {
      duration: 300,
      easing: 'ease',
      fill: 'forwards',
      ...options,
    });
    return animation.finished.catch(() => {});
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function isLoopbackHost(hostname) {
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  }

  function isAllowedDestination(link, url) {
    if (url.origin === window.location.origin) return true;
    if (!link.hasAttribute('data-depth-tunnel-cross-origin')) return false;
    return url.protocol === window.location.protocol &&
      isLoopbackHost(url.hostname) &&
      isLoopbackHost(window.location.hostname);
  }

  function setActive(active) {
    const tunnel = createOverlay();
    tunnel.classList.toggle('is-active', active);
    if (active) {
      document.documentElement.classList.remove('dtp-depth-tunnel-preload');
    } else {
      document.documentElement.classList.remove('dtp-depth-tunnel-arrival', 'dtp-depth-tunnel-preload');
    }
  }

  async function runExit() {
    const tunnel = createOverlay();
    const frames = Array.from(tunnel.querySelectorAll('.dtp-depth-tunnel__frame'));
    const scan = tunnel.querySelector('.dtp-depth-tunnel__scan');
    const label = tunnel.querySelector('.dtp-depth-tunnel__label');

    setActive(true);

    if (reduceMotion) {
      await animate(tunnel, [{ opacity: 0 }, { opacity: 1 }], { duration: 180 });
      return;
    }

    await Promise.all([
      animate(tunnel, [{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'cubic-bezier(.22,1,.36,1)' }),
      animate(scan, [
        { opacity: 0, transform: 'scaleX(0.18)' },
        { opacity: 1, transform: 'scaleX(1)' },
      ], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' }),
      animate(label, [
        { opacity: 0, transform: 'translateX(-50%) translateY(10px)' },
        { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
      ], { duration: 300, delay: 120 }),
      ...frames.map((frame, index) => animate(frame, [
        { opacity: 0, transform: 'translateZ(-760px) scale(0.38)' },
        { opacity: 0.9, transform: 'translateZ(700px) scale(1.32)' },
        { opacity: 0, transform: 'translateZ(1080px) scale(1.6)' },
      ], {
        duration: 780,
        delay: index * 58,
        easing: 'cubic-bezier(.55,.06,.68,.19)',
      })),
    ]);

    await animate(tunnel, [{ opacity: 1 }, { opacity: 1 }], { duration: 80 });
  }

  async function navigate(url) {
    if (running) return;
    running = true;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
      await runExit();
      window.location.assign(url);
    } catch {
      window.location.assign(url);
    }
  }

  async function runArrival() {
    const tunnel = createOverlay();
    const frames = Array.from(tunnel.querySelectorAll('.dtp-depth-tunnel__frame'));
    const scan = tunnel.querySelector('.dtp-depth-tunnel__scan');
    const label = tunnel.querySelector('.dtp-depth-tunnel__label');

    setActive(true);
    frames.forEach((frame) => {
      frame.style.opacity = '0';
      frame.style.transform = 'translateZ(-760px) scale(0.38)';
    });
    scan.style.opacity = '0';
    label.style.opacity = '0';

    if (reduceMotion) {
      await animate(tunnel, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 });
      setActive(false);
      return;
    }

    await wait(120);
    await animate(tunnel, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 520,
      easing: 'cubic-bezier(.22,1,.36,1)',
    });

    setActive(false);
  }

  document.addEventListener('click', async (event) => {
    const link = event.target instanceof Element ? event.target.closest(LINK_SELECTOR) : null;
    if (!link || running) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const url = new URL(link.href, window.location.href);
    if (!isAllowedDestination(link, url)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    navigate(url.href);
  }, true);

  window.DTPDepthTunnel = { navigate };

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    running = false;
    if (overlay) setActive(false);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  });

  if (window.sessionStorage.getItem(STORAGE_KEY) === '1') {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.requestAnimationFrame(() => {
      wait(90).then(runArrival);
    });
  }
})();
