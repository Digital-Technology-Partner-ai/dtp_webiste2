const chips = Array.from(document.querySelectorAll('.chip'));
const switchBtn = document.getElementById('switchBtn');
const screens = Array.from(document.querySelectorAll('.screen'));
const layer = document.getElementById('transitionLayer');
const labChrome = document.getElementById('labChrome');
const runtimeStatus = document.getElementById('runtimeStatus');
const parts = Object.fromEntries(
  Array.from(layer.querySelectorAll('[data-part]')).map((el) => [el.dataset.part, el])
);
const terminalText = document.getElementById('terminalText');
const matrix = parts.matrix;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let selected = 'blackZoom';
let locked = false;

const matrixChars = '01101 DTP AI SYS FLOW SIGNAL MODEL OPS '.repeat(12);
for (let i = 0; i < 28; i++) {
  const span = document.createElement('span');
  span.textContent = matrixChars.slice(i, i + 120);
  matrix.appendChild(span);
}

runtimeStatus.textContent = 'JS ready';
runtimeStatus.classList.add('is-ready');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    if (locked) return;
    selected = chip.dataset.transition;
    chips.forEach((item) => item.classList.toggle('is-active', item === chip));
    runtimeStatus.textContent = `Previewing ${chip.textContent}`;
    runTransition(selected);
  });
});

switchBtn.addEventListener('click', () => {
  if (locked) return;
  runtimeStatus.textContent = `Previewing ${document.querySelector('.chip.is-active')?.textContent ?? 'transition'}`;
  runTransition(selected);
});

function activeScreen() {
  return screens[current];
}

function nextScreen() {
  return screens[(current + 1) % screens.length];
}

function setStyles(el, styles) {
  Object.assign(el.style, styles);
}

function play(el, keyframes, options) {
  const animation = el.animate(keyframes, {
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

function resetPartStyles() {
  Object.values(parts).forEach((part) => {
    part.removeAttribute('style');
  });
  Array.from(parts.tunnel.querySelectorAll('span')).forEach((panel) => {
    panel.removeAttribute('style');
  });
  Array.from(parts.matrix.querySelectorAll('span')).forEach((column) => {
    column.removeAttribute('style');
  });
}

function prepare(next) {
  locked = true;
  switchBtn.disabled = true;
  window.clearTimeout(window.transitionLabFailsafe);
  window.transitionLabFailsafe = window.setTimeout(() => complete(next), 2600);
  resetPartStyles();
  setStyles(layer, { opacity: '1', visibility: 'visible' });
  Object.values(parts).forEach((part) => setStyles(part, { opacity: '0' }));
  setStyles(labChrome, { opacity: '1' });
  setStyles(next, {
    opacity: '0',
    visibility: 'visible',
    transform: 'translateY(18px)',
    pointerEvents: 'none',
  });
}

function complete(next) {
  screens[current].classList.remove('is-active');
  current = screens.indexOf(next);
  next.classList.add('is-active');
  screens.forEach((screen, index) => {
    if (index !== current) {
      setStyles(screen, {
        opacity: '0',
        visibility: 'hidden',
        transform: 'translateY(18px)',
        pointerEvents: 'none',
        filter: '',
      });
    }
  });
  setStyles(next, {
    opacity: '1',
    visibility: 'visible',
    transform: 'translateY(0)',
    pointerEvents: 'auto',
    filter: '',
  });
  setStyles(layer, { opacity: '0', visibility: 'hidden' });
  setStyles(labChrome, { opacity: '1' });
      window.clearTimeout(window.transitionLabFailsafe);
      switchBtn.textContent = current === 0 ? 'Open AI Foundry' : 'Open Solutions';
      switchBtn.disabled = false;
      locked = false;
      runtimeStatus.textContent = 'JS ready';
    }

function swapScreens(next) {
  setStyles(activeScreen(), { opacity: '0', visibility: 'hidden', pointerEvents: 'none' });
  setStyles(next, {
    opacity: '1',
    visibility: 'visible',
    transform: 'translateY(0)',
    pointerEvents: 'auto',
  });
}

async function runTransition(kind) {
  const next = nextScreen();
  prepare(next);
  const reduce = reduceMotion.matches;
  const currentScreen = activeScreen();

  try {
    if (reduce) {
      await play(parts.blackout, [{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
      swapScreens(next);
      await play(parts.blackout, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
    } else {
      await transitions[kind](currentScreen, next);
    }
  } finally {
    complete(next);
  }
}

const transitions = {
  async blackZoom(currentScreen, next) {
    await Promise.all([
      play(currentScreen, [{ transform: 'translateY(0) scale(1)', opacity: 1 }, { transform: 'translateY(0) scale(1.045)', opacity: 1 }], { duration: 740, easing: 'cubic-bezier(.22,1,.36,1)' }),
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 220 }),
      wait(460).then(() => play(parts.blackout, [{ opacity: 0 }, { opacity: 1 }], { duration: 320 })),
      wait(740).then(() => play(parts.trace, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], { duration: 220 })),
    ]);
    swapScreens(next);
    await Promise.all([
      play(parts.trace, [{ opacity: 1, transform: 'scaleX(1)' }, { opacity: 0, transform: 'scaleX(.25)' }], { duration: 240 }),
      play(parts.blackout, [{ opacity: 1 }, { opacity: 0 }], { duration: 480 }),
      play(next, [{ opacity: 1, transform: 'translateY(22px) scale(.992)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 680, easing: 'cubic-bezier(.22,1,.36,1)' }),
      wait(220).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 350 })),
    ]);
  },

  async aperture(currentScreen, next) {
    await Promise.all([
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 }),
      play(currentScreen, [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(0) scale(1.035)' }], { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)' }),
      wait(180).then(() => play(parts.aperture, [{ opacity: 1, clipPath: 'circle(0% at 50% 50%)' }, { opacity: 1, clipPath: 'circle(145% at 50% 50%)' }], { duration: 620, easing: 'cubic-bezier(.65,0,.35,1)' })),
    ]);
    swapScreens(next);
    await Promise.all([
      play(parts.aperture, [{ opacity: 1, clipPath: 'circle(145% at 50% 50%)' }, { opacity: 1, clipPath: 'circle(0% at 50% 50%)' }], { duration: 620, easing: 'cubic-bezier(.65,0,.35,1)' }),
      play(next, [{ transform: 'translateY(0) scale(1.025)' }, { transform: 'translateY(0) scale(1)' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' }),
      wait(350).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 350 })),
    ]);
  },

  async morph(currentScreen, next) {
    const currentImage = currentScreen.querySelector('.hero-card img');
    const nextHero = next.querySelector('.hero-card');
    const from = currentImage.getBoundingClientRect();
    const to = nextHero.getBoundingClientRect();
    parts.morph.querySelector('img').src = currentImage.src;
    setStyles(parts.morph, {
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      opacity: '1',
    });
    await Promise.all([
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }),
      play(currentScreen, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0.35, transform: 'translateY(0) scale(.985)' }], { duration: 400 }),
      play(parts.blackout, [{ opacity: 0 }, { opacity: 0.82 }], { duration: 320 }),
      play(parts.morph, [
        { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
        { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` },
      ], { duration: 720, easing: 'cubic-bezier(.76,0,.24,1)' }),
    ]);
    setStyles(next.querySelector('.hero-card'), { opacity: '0' });
    swapScreens(next);
    await Promise.all([
      play(parts.blackout, [{ opacity: 0.82 }, { opacity: 0 }], { duration: 440 }),
      play(parts.morph, [{ opacity: 1 }, { opacity: 0 }], { duration: 240 }),
      wait(220).then(() => play(next.querySelector('.hero-card'), [{ opacity: 0 }, { opacity: 1 }], { duration: 200 })),
      wait(260).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 350 })),
    ]);
  },

  async circuit(currentScreen, next) {
    await Promise.all([
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 }),
      play(currentScreen, [{ filter: 'brightness(1)' }, { filter: 'brightness(.42)' }], { duration: 320 }),
      wait(150).then(() => play(parts.circuit, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], { duration: 500, easing: 'cubic-bezier(.65,0,.35,1)' })),
      wait(480).then(() => play(parts.blackout, [{ opacity: 0 }, { opacity: 1 }], { duration: 280 })),
    ]);
    swapScreens(next);
    await Promise.all([
      play(parts.circuit, [{ opacity: 1, transform: 'scaleX(1)' }, { opacity: 0, transform: 'scaleX(1.18)' }], { duration: 280 }),
      play(parts.blackout, [{ opacity: 1 }, { opacity: 0 }], { duration: 480 }),
      play(next, [{ opacity: 1, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 620, easing: 'cubic-bezier(.22,1,.36,1)' }),
      wait(320).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 350 })),
    ]);
  },

  async tunnel(currentScreen, next) {
    const panels = Array.from(parts.tunnel.querySelectorAll('span'));
    await Promise.all([
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }),
      play(parts.blackout, [{ opacity: 0 }, { opacity: 0.92 }], { duration: 260 }),
      wait(80).then(() => play(parts.tunnel, [{ opacity: 0 }, { opacity: 1 }], { duration: 180 })),
      ...panels.map((panel, index) => wait(160 + index * 45).then(() => play(panel, [
        { transform: 'translateZ(-420px) scale(.55)', opacity: 1 },
        { transform: 'translateZ(620px) scale(1.4)', opacity: 0 },
      ], { duration: 580, easing: 'cubic-bezier(.55,.06,.68,.19)' }))),
    ]);
    swapScreens(next);
    await Promise.all([
      play(next, [{ transform: 'translateY(0) scale(1.04)' }, { transform: 'translateY(0) scale(1)' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' }),
      play(parts.blackout, [{ opacity: 0.92 }, { opacity: 0 }], { duration: 520 }),
      wait(300).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 350 })),
    ]);
  },

  async terminal(currentScreen, next) {
    terminalText.textContent = '> ROUTE_HANDSHAKE\n> RESOLVE_SIGNAL\n> LOCK_CONTEXT\n> STREAM_READY';
    await Promise.all([
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 }),
      wait(50).then(() => play(parts.terminal, [{ opacity: 0 }, { opacity: 1 }], { duration: 220 })),
      wait(50).then(() => play(currentScreen, [{ opacity: 1 }, { opacity: 0.2 }], { duration: 250 })),
      wait(580).then(() => play(parts.blackout, [{ opacity: 0 }, { opacity: 1 }], { duration: 220 })),
    ]);
    swapScreens(next);
    await Promise.all([
      play(parts.terminal, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 }),
      play(parts.blackout, [{ opacity: 1 }, { opacity: 0 }], { duration: 420 }),
      play(next, [{ opacity: 1, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' }),
      wait(220).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 320 })),
    ]);
  },

  async packet(currentScreen, next) {
    await Promise.all([
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 }),
      play(currentScreen, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0.2, transform: 'translateY(0) scale(.94)' }], { duration: 420, easing: 'cubic-bezier(.55,.06,.68,.19)' }),
      wait(100).then(() => play(parts.packetLine, [{ opacity: 0 }, { opacity: 1 }], { duration: 180 })),
      wait(100).then(() => {
        setStyles(parts.packet, { transform: 'translate(-50%, -50%) translateX(-31vw)', opacity: '1' });
        return play(parts.packet, [
          { transform: 'translate(-50%, -50%) translateX(-31vw)', opacity: 1 },
          { transform: 'translate(-50%, -50%) translateX(31vw)', opacity: 1 },
        ], { duration: 580, easing: 'cubic-bezier(.65,0,.35,1)' });
      }),
      wait(500).then(() => play(parts.blackout, [{ opacity: 0 }, { opacity: 1 }], { duration: 280 })),
    ]);
    swapScreens(next);
    await Promise.all([
      play(parts.packet, [{ transform: 'translate(-50%, -50%) translateX(31vw) scale(1)', opacity: 1 }, { transform: 'translate(-50%, -50%) translateX(31vw) scale(46)', opacity: 0 }], { duration: 280 }),
      play(parts.packetLine, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 }),
      play(parts.blackout, [{ opacity: 1 }, { opacity: 0 }], { duration: 440 }),
      play(next, [{ opacity: 1, transform: 'translateY(0) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' }),
      wait(220).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 340 })),
    ]);
  },

  async matrix(currentScreen, next) {
    const columns = Array.from(parts.matrix.querySelectorAll('span'));
    await Promise.all([
      play(labChrome, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 }),
      wait(60).then(() => play(parts.matrix, [{ opacity: 0 }, { opacity: 1 }], { duration: 220 })),
      ...columns.map((column, index) => wait(80 + index * 12).then(() => play(column, [
        { transform: 'translateY(-70%)', opacity: 0.2 },
        { transform: 'translateY(70%)', opacity: 1 },
      ], { duration: 720, easing: 'linear' }))),
      wait(560).then(() => play(parts.blackout, [{ opacity: 0 }, { opacity: 1 }], { duration: 240 })),
    ]);
    swapScreens(next);
    await Promise.all([
      play(parts.matrix, [{ opacity: 1 }, { opacity: 0 }], { duration: 220 }),
      play(parts.blackout, [{ opacity: 1 }, { opacity: 0 }], { duration: 460 }),
      play(next, [{ opacity: 1, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)' }),
      wait(260).then(() => play(labChrome, [{ opacity: 0 }, { opacity: 1 }], { duration: 340 })),
    ]);
  },
};
