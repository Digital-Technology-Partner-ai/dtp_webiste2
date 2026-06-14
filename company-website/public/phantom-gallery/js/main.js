import * as THREE from 'three';

/* ============================================================
   PHANTOM.LAND — spherical gallery recreation
   Camera sits at the centre of a sphere; project cards are
   curved patches on its inner surface. Drag / scroll to orbit
   with lenis-style eased inertia. Click a card to open it.
   ============================================================ */

const RADIUS = 30;
const CARD_W = 0.36;            // angular width at equator (rad)
const CARD_H = 0.23;            // angular height (rad)
const GAP = 0.085;              // angular gap between cards
const ROW_LATS = [0, 0.3665, -0.3665, 0.733, -0.733];

const TITLES = [
  'NEON DISTRICT', 'SOLAR ARCHIVE', 'ECHO CHAMBER', 'MIDNIGHT BLOOM',
  'STATIC FIELDS', 'VELVET ORBIT', 'CHROME GARDENS', 'PIXEL TIDES',
  'GHOST PROTOCOL', 'AURORA INDEX', 'TERRA FORMA', 'LUCID ENGINE',
  'PAPER PLANETS', 'MONO NO AWARE', 'HYPER REAL', 'DUST & SIGNAL',
  'ORBITAL DECAY', 'WAVEFORM CITY', 'NULL ISLAND', 'SOFT MACHINE',
  'KINETIC TYPE',
];
const CATS = [
  'WEBGL EXPERIENCE', 'BRAND FILM', 'INTERACTIVE INSTALLATION',
  'DIGITAL CAMPAIGN', 'AR EXPERIENCE', 'GENERATIVE IDENTITY',
  'GAME CINEMATIC',
];
const IMG_COUNT = 14;

/* ---------------- renderer / scene ---------------- */

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101014);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 120);
scene.add(camera);

// pivot handles vertical look (x), sphere handles horizontal spin (y)
const pivot = new THREE.Group();
const sphereGroup = new THREE.Group();
pivot.add(sphereGroup);
scene.add(pivot);

/* ---------------- shaders ---------------- */

const VERT = /* glsl */ `
  uniform float uHover;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // scaling towards the origin pulls the card closer to the camera
    vec3 p = position * (1.0 - uHover * 0.04);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHover;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 uv = (vUv - 0.5) * (1.0 - uHover * 0.06) + 0.5;
    vec4 tex = texture2D(uMap, uv);
    float g = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono = vec3(g) * 0.92;
    vec3 col = mix(mono, tex.rgb, uHover);
    col *= 0.94 + uHover * 0.06;
    gl_FragColor = vec4(col, uOpacity);
  }
`;

/* ---------------- curved card geometry ---------------- */

function curvedCardGeometry(theta0, lat0, angW, angH, radius) {
  const wSegs = 18, hSegs = 12;
  const positions = [], uvs = [], indices = [];
  for (let j = 0; j <= hSegs; j++) {
    for (let i = 0; i <= wSegs; i++) {
      const u = i / wSegs, v = j / hSegs;
      const th = theta0 + (u - 0.5) * angW;
      const la = lat0 + (v - 0.5) * angH;
      positions.push(
        radius * Math.cos(la) * Math.sin(th),
        radius * Math.sin(la),
        radius * Math.cos(la) * Math.cos(th)
      );
      // viewed from inside the sphere, so flip U to keep images un-mirrored
      uvs.push(1 - u, v);
    }
  }
  for (let j = 0; j < hSegs; j++) {
    for (let i = 0; i < wSegs; i++) {
      const a = j * (wSegs + 1) + i;
      const b = a + 1;
      const c = a + wSegs + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

/* ---------------- load textures, build cards ---------------- */

const cards = [];
const loaderBar = document.getElementById('loaderBar');
const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => {
  loaderBar.style.width = `${(loaded / total) * 100}%`;
};
manager.onLoad = () => init();

const texLoader = new THREE.TextureLoader(manager);
const textures = [];
for (let i = 1; i <= IMG_COUNT; i++) {
  const tex = texLoader.load(`img/p${i}.jpg`);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textures.push(tex);
}

function buildCards() {
  let idx = 0;
  ROW_LATS.forEach((lat, rowI) => {
    const effW = CARD_W / Math.cos(lat);
    const count = Math.floor((Math.PI * 2) / (effW + GAP));
    const slot = (Math.PI * 2) / count;
    const rowOffset = rowI * 0.37;
    for (let i = 0; i < count; i++) {
      const theta = i * slot + rowOffset;
      const geo = curvedCardGeometry(theta, lat, effW, CARD_H, RADIUS);
      const uniforms = {
        uMap: { value: textures[idx % IMG_COUNT] },
        uHover: { value: 0 },
        uOpacity: { value: 0 },
      };
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.setScalar(1.55);
      sphereGroup.add(mesh);
      const card = {
        mesh, theta, lat, uniforms,
        idx,
        title: TITLES[idx % TITLES.length],
        cat: CATS[idx % CATS.length],
        img: `img/p${(idx % IMG_COUNT) + 1}.jpg`,
        hover: 0, hoverT: 0,
      };
      mesh.userData.card = card;
      cards.push(card);
      idx++;
    }
  });
}

/* ---------------- interaction state ---------------- */

const state = {
  curY: 0, curX: 0,
  tarY: 0, tarX: 0,
  velY: 0, velX: 0,
  dragging: false,
  locked: false,
};
const X_LIMIT = 0.6;
const SENS = 0.0026;
const tilt = { tx: 0, ty: 0, cx: 0, cy: 0 };
const mouseNdc = new THREE.Vector2(-2, -2);
const raycaster = new THREE.Raycaster();

let lastInteract = performance.now();
let hovered = null;
let currentCard = null;
let downX = 0, downY = 0, moved = 0;
let lastDx = 0, lastDy = 0;

const tooltip = document.getElementById('tooltip');
const tooltipCat = tooltip.querySelector('.tooltip-cat');
const tooltipTitle = tooltip.querySelector('.tooltip-title');
const tipX = gsap.quickTo(tooltip, 'x', { duration: 0.4, ease: 'power3' });
const tipY = gsap.quickTo(tooltip, 'y', { duration: 0.4, ease: 'power3' });

function nearestAngle(target, current) {
  return current + Math.atan2(Math.sin(target - current), Math.cos(target - current));
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------------- pointer events ---------------- */

canvas.addEventListener('pointerdown', (e) => {
  if (state.locked) return;
  state.dragging = true;
  canvas.classList.add('dragging');
  canvas.setPointerCapture(e.pointerId);
  downX = e.clientX; downY = e.clientY;
  moved = 0;
  state.velY = 0; state.velX = 0;
  lastDx = 0; lastDy = 0;
  lastInteract = performance.now();
});

window.addEventListener('pointermove', (e) => {
  mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  tilt.tx = mouseNdc.x;
  tilt.ty = -mouseNdc.y;
  tipX(e.clientX);
  tipY(e.clientY);

  if (!state.dragging || state.locked) return;
  const dx = e.movementX ?? 0;
  const dy = e.movementY ?? 0;
  moved += Math.abs(dx) + Math.abs(dy);
  state.tarY -= dx * SENS;
  state.tarX -= dy * SENS * 0.78;
  state.tarX = clamp(state.tarX, -X_LIMIT, X_LIMIT);
  // smoothed velocity for release momentum
  lastDx = lastDx * 0.7 + (-dx * SENS) * 0.3;
  lastDy = lastDy * 0.7 + (-dy * SENS * 0.78) * 0.3;
  lastInteract = performance.now();
});

function endDrag(e) {
  if (!state.dragging) return;
  state.dragging = false;
  canvas.classList.remove('dragging');
  state.velY = clamp(lastDx * 0.9, -0.09, 0.09);
  state.velX = clamp(lastDy * 0.9, -0.05, 0.05);
  lastInteract = performance.now();

  // treat as a click if the pointer barely moved
  if (moved < 6 && hovered && !state.locked) openCard(hovered);
}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

canvas.addEventListener('wheel', (e) => {
  if (state.locked) return;
  e.preventDefault();
  state.tarY += (e.deltaY + e.deltaX) * 0.00045;
  lastInteract = performance.now();
}, { passive: false });

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.locked && currentCard) closeCard();
});

/* ---------------- hover ---------------- */

function setHovered(card) {
  if (hovered === card) return;
  hovered = card;
  if (card) {
    tooltipCat.textContent = card.cat;
    tooltipTitle.textContent = card.title;
    gsap.to(tooltip, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
    canvas.classList.add('hovering');
  } else {
    gsap.to(tooltip, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' });
    canvas.classList.remove('hovering');
  }
}

/* ---------------- detail page ---------------- */

const detail = document.getElementById('detail');
const detailTitle = document.getElementById('detailTitle');
const detailCat = document.getElementById('detailCat');
const detailImg = document.getElementById('detailImg');
const detailIndex = document.getElementById('detailIndex');
const detailHeader = detail.querySelector('.detail-header');
const detailBody = detail.querySelector('.detail-body');
const transitionOverlay = document.getElementById('transitionOverlay');
const backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', () => closeCard());

const galleryChrome = ['.ui-header', '.ui-footer'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let isTransitioning = false;

function prefersReducedMotion() {
  return reduceMotion.matches;
}

function openCard(card) {
  if (state.locked) return;
  state.locked = true;
  isTransitioning = true;
  currentCard = card;
  state.velY = 0; state.velX = 0;
  setHovered(null);
  canvas.classList.remove('hovering');

  detailTitle.textContent = card.title;
  detailCat.textContent = card.cat;
  detailImg.src = card.img;
  detailImg.alt = card.title;
  detailIndex.textContent =
    `${String(card.idx + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  detail.scrollTop = 0;

  const tY = nearestAngle(Math.PI - card.theta, state.curY);
  const tX = -card.lat;
  const others = cards.filter(c => c !== card).map(c => c.uniforms.uOpacity);
  const reduce = prefersReducedMotion();
  const zoomDuration = reduce ? 0.45 : 1.05;
  const zoomDepth = reduce ? -5.5 : -11.8;
  const targetFov = reduce ? 60 : 54;
  const bridgeStart = reduce ? 0.16 : 0.65;
  const bridgeDuration = reduce ? 0.2 : 0.35;
  const revealStart = bridgeStart + bridgeDuration + (reduce ? 0.04 : 0.12);
  const contentDuration = reduce ? 0.35 : 0.65;

  const tl = gsap.timeline({
    onComplete: () => {
      isTransitioning = false;
    },
  });
  tl.set(transitionOverlay, { autoAlpha: 0 }, 0)
    .set(detail, { visibility: 'hidden', clipPath: 'inset(100% 0 0 0)' }, 0)
    .set([detailHeader, detailCat, detailTitle, detailBody], { autoAlpha: 0 }, 0)
    .set(detailImg, { scale: 1.12 }, 0)
    .to(galleryChrome, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, 0)
    .to(state, { curY: tY, curX: tX, tarY: tY, tarX: tX, duration: zoomDuration, ease: 'power3.inOut' }, 0)
    .to(camera.position, { z: zoomDepth, duration: zoomDuration, ease: 'power3.inOut' }, 0)
    .to(camera, {
      fov: targetFov, duration: zoomDuration, ease: 'power3.inOut',
      onUpdate: () => camera.updateProjectionMatrix(),
    }, 0)
    .to(others, { value: 0.0, duration: reduce ? 0.25 : 0.65, ease: 'power2.out' }, 0)
    .to(card.uniforms.uHover, { value: 1, duration: reduce ? 0.25 : 0.65, ease: 'power2.out' }, 0)
    .to(transitionOverlay, { autoAlpha: 1, duration: bridgeDuration, ease: 'power2.inOut' }, bridgeStart)
    .set(detail, { visibility: 'visible', clipPath: 'inset(0% 0 0 0)' }, revealStart - 0.02)
    .to(transitionOverlay, { autoAlpha: 0, duration: reduce ? 0.3 : 0.5, ease: 'power2.out' }, revealStart)
    .fromTo(detailHeader, { y: -12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: contentDuration, ease: 'power3.out' }, revealStart + 0.06)
    .fromTo(detailCat, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: contentDuration, ease: 'power3.out' }, revealStart + 0.1)
    .fromTo(detailTitle, { y: 0, yPercent: 105, autoAlpha: 1 }, { y: 0, yPercent: 0, autoAlpha: 1, duration: reduce ? 0.45 : 0.8, ease: 'power3.out' }, revealStart + 0.12)
    .fromTo(detailImg, { scale: reduce ? 1.04 : 1.14 }, { scale: 1, duration: reduce ? 0.45 : 1.0, ease: 'power3.out' }, revealStart + 0.14)
    .fromTo(detailBody, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: contentDuration, ease: 'power3.out' }, revealStart + 0.22);
}

function closeCard() {
  const card = currentCard;
  if (!card || isTransitioning) return;
  isTransitioning = true;
  card.hover = 0;
  card.hoverT = 0;
  const allOps = cards.map(c => c.uniforms.uOpacity);
  const reduce = prefersReducedMotion();

  const tl = gsap.timeline({
    onComplete: () => {
      state.locked = false;
      currentCard = null;
      isTransitioning = false;
      lastInteract = performance.now();
    },
  });
  tl.to([detailHeader, detailCat, detailTitle, detailBody], { autoAlpha: 0, y: -10, duration: reduce ? 0.15 : 0.22, ease: 'power2.in' }, 0)
    .to(detailImg, { scale: reduce ? 1.02 : 1.06, duration: reduce ? 0.15 : 0.22, ease: 'power2.in' }, 0)
    .to(transitionOverlay, { autoAlpha: 1, duration: reduce ? 0.18 : 0.32, ease: 'power2.inOut' }, 0.08)
    .set(detail, { visibility: 'hidden', clipPath: 'inset(100% 0 0 0)' }, reduce ? 0.28 : 0.45)
    .set(camera.position, { z: 0 }, reduce ? 0.28 : 0.45)
    .set(camera, { fov: 70 }, reduce ? 0.28 : 0.45)
    .call(() => camera.updateProjectionMatrix(), null, reduce ? 0.28 : 0.45)
    .set(allOps, { value: 1 }, reduce ? 0.28 : 0.45)
    .set(card.uniforms.uHover, { value: 0 }, reduce ? 0.28 : 0.45)
    .to(transitionOverlay, { autoAlpha: 0, duration: reduce ? 0.25 : 0.45, ease: 'power2.out' }, reduce ? 0.34 : 0.55)
    .to(galleryChrome, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, reduce ? 0.42 : 0.66);
}

/* ---------------- intro ---------------- */

function init() {
  buildCards();

  // deterministic shuffled order so scale + opacity staggers stay in sync
  const order = [...cards];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const scales = order.map(c => c.mesh.scale);
  const ops = order.map(c => c.uniforms.uOpacity);

  gsap.to('#loader', { autoAlpha: 0, duration: 0.6, delay: 0.25 });
  gsap.to(scales, {
    x: 1, y: 1, z: 1,
    duration: 1.7, ease: 'power3.out',
    stagger: { each: 0.013 },
    delay: 0.4,
  });
  gsap.to(ops, {
    value: 1,
    duration: 1.3, ease: 'power2.out',
    stagger: { each: 0.013 },
    delay: 0.4,
  });
  gsap.fromTo(['.ui-header', '.ui-footer'],
    { autoAlpha: 0, y: -12 },
    { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out', delay: 1.1, stagger: 0.15 });
}

/* ---------------- frame loop ---------------- */

let lastT = performance.now();

function tick(t) {
  const dt = Math.min((t - lastT) / 16.667, 3);
  lastT = t;

  if (!state.locked) {
    if (!state.dragging) {
      state.tarY += state.velY * dt;
      state.tarX = clamp(state.tarX + state.velX * dt, -X_LIMIT, X_LIMIT);
      const decay = Math.pow(0.94, dt);
      state.velY *= decay;
      state.velX *= decay;
      if (t - lastInteract > 4500) state.tarY += 0.00025 * dt; // idle drift
    }
    const ease = 1 - Math.pow(1 - 0.085, dt);
    state.curY += (state.tarY - state.curY) * ease;
    state.curX += (state.tarX - state.curX) * ease;
  }

  sphereGroup.rotation.y = state.curY;
  pivot.rotation.x = state.curX;

  // subtle camera tilt toward the cursor
  const tiltTx = state.locked ? 0 : tilt.tx;
  const tiltTy = state.locked ? 0 : tilt.ty;
  tilt.cx += (tiltTx - tilt.cx) * 0.05 * dt;
  tilt.cy += (tiltTy - tilt.cy) * 0.05 * dt;
  camera.rotation.x = -tilt.cy * 0.035;
  camera.rotation.y = -tilt.cx * 0.045;

  // hover raycast + eased hover uniform
  if (!state.locked) {
    raycaster.setFromCamera(mouseNdc, camera);
    const hits = raycaster.intersectObjects(sphereGroup.children);
    setHovered(hits.length ? hits[0].object.userData.card : null);
    for (const c of cards) {
      c.hoverT = (c === hovered) ? 1 : 0;
      c.hover += (c.hoverT - c.hover) * 0.09 * dt;
      c.uniforms.uHover.value = c.hover;
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ---------------- resize ---------------- */

// debug handle for devtools inspection
window.PHANTOM = { state, camera, cards, sphereGroup, openCard, closeCard, get hovered() { return hovered; }, get currentCard() { return currentCard; } };

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
