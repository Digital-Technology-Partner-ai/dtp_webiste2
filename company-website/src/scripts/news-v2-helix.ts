import { gsap } from 'gsap';
// The project currently imports Three without local type declarations in several pages.
// @ts-ignore
import * as THREE from 'three';

type NewsItem = {
  id: string;
  slug: string;
  url: string;
  index: number;
  title: string;
  category: string;
  pubDateLabel: string;
  pubDateIso: string;
  description: string;
  tags: string[];
  author: string;
  source: string;
};

const page = document.querySelector<HTMLElement>('[data-news-v2-page]');
const dataEl = document.getElementById('news-v2-data');

if (page && dataEl?.textContent) {
  const items = JSON.parse(dataEl.textContent) as NewsItem[];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(
        canvas.getContext('webgl2') || canvas.getContext('webgl')
      );
    } catch {
      return false;
    }
  })();

  if (items.length === 0) {
    page.classList.add('is-reduced');
  } else if (reducedMotion || !hasWebGL) {
    page.classList.add(reducedMotion ? 'is-reduced' : 'is-no-webgl');
    setupStaticList(items);
  } else {
    setupHelix(items);
  }
}

function byId<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T | null;
}

function setupStaticList(items: NewsItem[]) {
  setupCursor();
  document.querySelectorAll<HTMLElement>('[data-news-v2-static-open]').forEach((card) => {
    card.addEventListener('click', () => {
      const index = Number(card.dataset['newsV2StaticOpen']);
      navigateToArticle(items, index);
    });
  });
}

function navigateToArticle(items: NewsItem[], index: number) {
  const item = items[index];
  if (!item) return;
  window.location.href = item.url || `/news/${item.slug}/`;
}

function setupHelix(items: NewsItem[]) {
  setupCursor();

  const glRoot = byId<HTMLDivElement>('newsV2Gl');
  const preloader = byId<HTMLDivElement>('newsV2Preloader');
  const preloaderCount = byId<HTMLDivElement>('newsV2PreloaderCount');
  const preloaderBar = byId<HTMLSpanElement>('newsV2PreloaderBar');
  const hero = byId<HTMLDivElement>('newsV2Hero');
  const workLabel = byId<HTMLDivElement>('newsV2WorkLabel');
  const workIndexEl = byId<HTMLSpanElement>('newsV2WorkIndex');
  const workTitleEl = byId<HTMLElement>('newsV2WorkTitle');
  const scrollHint = byId<HTMLParagraphElement>('newsV2ScrollHint');
  const toolbar = byId<HTMLDivElement>('newsV2Toolbar');

  if (
    !glRoot ||
    !preloader ||
    !preloaderCount ||
    !preloaderBar ||
    !hero ||
    !workLabel ||
    !workIndexEl ||
    !workTitleEl ||
    !scrollHint ||
    !toolbar
  ) {
    page?.classList.add('is-no-webgl');
    setupStaticList(items);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 80);
  camera.position.set(0, 0, 8.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  glRoot.appendChild(renderer.domElement);

  const count = items.length;
  const angleStep = count < 5 ? 0.92 : 0.62;
  const total = Math.max(count * angleStep, Math.PI * 2.2);
  const half = total / 2;
  const radius = innerWidth < 760 ? 4.7 : 5.4;
  const pitch = innerWidth < 760 ? 0.72 : 0.92;
  const planeW = innerWidth < 760 ? 2.95 : 3.42;
  const planeH = innerWidth < 760 ? 1.9 : 2.18;
  const spacing = planeW + 0.88;
  const totalW = Math.max(count * spacing, spacing * 6);
  const halfW = totalW / 2;
  const linearFactor = totalW / total;

  const geometry = new THREE.PlaneGeometry(planeW, planeH, 24, 32);
  const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  let realProgress = 1;

  const vertexShader = `
    uniform float uVel;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float wave = sin(uv.y * 3.14159265);
      pos.z -= wave * uVel * 1.35;
      pos.x += wave * uVel * 0.4;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uMap;
    uniform float uVel;
    uniform float uHover;
    uniform float uDim;
    uniform float uAlpha;
    varying vec2 vUv;

    void main() {
      float blur = clamp(abs(uVel), 0.0, 1.0) * 0.055;
      vec4 acc = vec4(0.0);
      for (int i = 0; i < 5; i++) {
        float t = float(i) / 4.0 - 0.5;
        acc += texture2D(uMap, vUv + vec2(uVel * 0.012, t * blur));
      }
      acc /= 5.0;

      vec3 col = mix(acc.rgb, acc.rgb + vec3(0.03, 0.05, 0.04), uHover);
      col *= uDim;

      vec2 r = vec2(0.045, 0.034);
      vec2 q = abs(vUv - 0.5) - (vec2(0.5) - r);
      float d = length(max(q / r, 0.0));
      float roundedAlpha = 1.0 - step(1.0, d);

      gl_FragColor = vec4(col, acc.a * roundedAlpha * uAlpha);
    }
  `;

  items.forEach((item, index) => {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMap: { value: createCardTexture(item, index) },
        uVel: { value: 0 },
        uHover: { value: 0 },
        uDim: { value: 1 },
        uAlpha: { value: 1 },
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {
      index,
      hover: 0,
      hoverTarget: 0,
      intro: 0,
      focus: 0,
      theta: 0,
      listX: 0,
    };
    scene.add(mesh);
    meshes.push(mesh);
  });

  const wrap = (value: number, range: number) => ((value % range) + range) % range;
  const lerp = THREE.MathUtils.lerp;
  const layoutState = { progress: 0 };
  const pointer = new THREE.Vector2(-10, -10);
  const raycaster = new THREE.Raycaster();
  const timer = new THREE.Timer();
  timer.connect(document);
  const focusPos = new THREE.Vector3(1.35, 0, 3.05);

  let focusScale = 1.18;
  let scrollTarget = 0;
  let scrollCurrent = 0;
  let smoothVel = 0;
  let started = false;
  let dragging = false;
  let dragMoved = 0;
  let downTime = 0;
  let lastX = 0;
  let lastY = 0;
  let hovered: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;
  let currentItem = -1;
  let currentView = 'spiral';
  let hintDismissed = false;
  let isNavigating = false;

  window.addEventListener(
    'wheel',
    (event) => {
      if (!started || isNavigating) return;
      scrollTarget += event.deltaY * 0.0016;
      dismissHint();
    },
    { passive: true }
  );

  function updatePointerPosition(event: PointerEvent) {
    pointer.x = (event.clientX / innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  }

  window.addEventListener('pointerdown', (event) => {
    if (!started || isNavigating) return;
    if (event.button !== undefined && event.button !== 0) return;
    updatePointerPosition(event);
    dragging = true;
    dragMoved = 0;
    lastX = event.clientX;
    lastY = event.clientY;
    downTime = performance.now();
  });

  window.addEventListener('pointermove', (event) => {
    updatePointerPosition(event);
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    dragMoved += Math.abs(dx) + Math.abs(dy);
    const delta = layoutState.progress > 0.5 ? -dx * 0.012 : dx * 0.008 - dy * 0.011;
    scrollTarget += delta;
    if (dragMoved > 8) dismissHint();
  });

  window.addEventListener('pointerup', (event) => {
    if (!dragging) return;
    updatePointerPosition(event);
    dragging = false;
    const isClick = dragMoved < 7 && performance.now() - downTime < 350;
    if (isClick) updateHover();
    if (isClick && hovered && !isNavigating) {
      isNavigating = true;
      navigateToArticle(items, hovered.userData.index);
    }
  });

  document.querySelectorAll<HTMLButtonElement>('[data-news-v2-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextView = button.dataset['newsV2View'] || 'spiral';
      if (nextView === currentView || isNavigating) return;
      currentView = nextView;
      document.querySelectorAll('[data-news-v2-view]').forEach((viewButton) => {
        viewButton.classList.toggle('is-active', viewButton === button);
      });
      gsap.to(layoutState, {
        progress: currentView === 'list' ? 1 : 0,
        duration: 1.25,
        ease: 'expo.inOut',
      });
    });
  });

  function dismissHint() {
    if (hintDismissed) return;
    hintDismissed = true;
    gsap.to(scrollHint, { autoAlpha: 0, duration: 0.45, overwrite: true });
  }

  function updateFocusTransform() {
    const narrow = camera.aspect < 0.9;
    focusPos.set(narrow ? 0 : 1.35, narrow ? 1.35 : 0, narrow ? 5.35 : 3.05);
    focusScale = narrow ? 1.14 : 1.12;
  }

  function setHovered(mesh: typeof hovered) {
    if (hovered === mesh) return;
    if (hovered) hovered.userData.hoverTarget = 0;
    hovered = mesh;
    if (hovered) hovered.userData.hoverTarget = 1;
    byId<HTMLDivElement>('newsV2CursorRing')?.classList.toggle(
      'is-hover',
      Boolean(hovered && !isNavigating)
    );
  }

  function updateHover() {
    if (!started) {
      setHovered(null);
      return;
    }
    if (isNavigating) return;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(meshes);
    setHovered(hits.length ? hits[0].object as typeof hovered : null);
  }

  function updateWorkLabel() {
    let best = 0;
    let bestDist = Infinity;
    for (const mesh of meshes) {
      const u = mesh.userData;
      const distance = layoutState.progress > 0.5 ? Math.abs(u.listX) : Math.abs(u.theta);
      if (distance < bestDist) {
        bestDist = distance;
        best = u.index;
      }
    }
    if (best === currentItem) return;
    const bestItem = items[best];
    if (!bestItem) return;
    currentItem = best;
    workIndexEl!.textContent = String(best + 1).padStart(2, '0');
    workTitleEl!.textContent = bestItem.title;
    gsap.fromTo(
      workTitleEl!,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
    );
  }

  function tick() {
    requestAnimationFrame(tick);
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);

    if (started && !dragging && !isNavigating && layoutState.progress < 0.5) {
      scrollTarget += dt * 0.018;
    }

    scrollCurrent += (scrollTarget - scrollCurrent) * (1 - Math.pow(0.0015, dt));
    const velocity = scrollTarget - scrollCurrent;
    smoothVel += (velocity - smoothVel) * 0.08;
    const velClamped = THREE.MathUtils.clamp(smoothVel, -0.9, 0.9);
    const linearScroll = scrollCurrent * linearFactor;
    const p = layoutState.progress;

    for (const mesh of meshes) {
      const u = mesh.userData;
      const theta = wrap(u.index * angleStep - scrollCurrent + half, total) - half;
      u.theta = theta;

      const sx = -Math.sin(theta) * radius;
      const sy = -theta * pitch;
      const sz = Math.cos(theta) * radius - radius;
      const sRotY = -theta;

      const lx = wrap(u.index * spacing - linearScroll + halfW, totalW) - halfW;
      u.listX = lx;

      let px = lerp(sx, lx, p);
      let py = lerp(sy, 0, p);
      let pz = lerp(sz, 0, p);
      let rotY = lerp(sRotY, 0, p);

      u.hover += (u.hoverTarget - u.hover) * 0.1;
      let scale = (u.intro || 0) * (1 + u.hover * 0.05);

      const focus = u.focus || 0;
      if (focus > 0) {
        px = lerp(px, focusPos.x, focus);
        py = lerp(py, focusPos.y, focus);
        pz = lerp(pz, focusPos.z, focus);
        rotY = lerp(rotY, 0, focus);
        scale = lerp(scale, focusScale, focus);
      }

      mesh.position.set(px, py, pz);
      mesh.rotation.y = rotY;
      mesh.scale.setScalar(Math.max(scale, 0.0001));

      const depthDim = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(sz, -radius * 2, 0, 0.34, 1),
        0.34,
        1
      );

      mesh.material.uniforms.uDim.value = lerp(lerp(depthDim, 1, p) + u.hover * 0.05, 1, focus);
      mesh.material.uniforms.uVel.value = velClamped;
      mesh.material.uniforms.uHover.value = u.hover;
    }

    camera.position.x += (pointer.x * 0.32 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.22 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    updateHover();
    if (started && !isNavigating) updateWorkLabel();
    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.position.z = camera.aspect < 0.9 ? 11.4 : 8.6;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    updateFocusTransform();
  }

  window.addEventListener('resize', onResize);
  onResize();
  tick();

  let displayed = 0;
  let introPlayed = false;

  function preloaderTick() {
    if (introPlayed) return;
    displayed += (realProgress * 100 - displayed) * 0.06;
    if (realProgress >= 1 && displayed > 99.2) displayed = 100;
    preloaderCount!.textContent = String(Math.round(displayed));
    preloaderBar!.style.transform = `scaleX(${displayed / 100})`;
    if (displayed >= 100) {
      playIntro();
      return;
    }
    requestAnimationFrame(preloaderTick);
  }

  preloaderTick();
  window.setTimeout(() => {
    realProgress = 1;
  }, 4500);

  function playIntro() {
    if (introPlayed) return;
    introPlayed = true;
    scrollCurrent = scrollTarget - 2.2;

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onStart: () => {
        started = true;
      },
    });

    tl.to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      onComplete: () => preloader!.remove(),
    });

    meshes.forEach((mesh, index) => {
      tl.to(mesh.userData, { intro: 1, duration: 1.2, ease: 'expo.out' }, 0.45 + index * 0.045);
    });

    tl.fromTo(
      hero,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8 },
      0.72
    )
      .to(workLabel, { opacity: 1, duration: 0.7 }, 0.9)
      .to(scrollHint, { opacity: 1, duration: 0.7 }, 1.05);
  }
}

type DetailScene = {
  meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[];
  layoutState: { progress: number };
  getScrollCurrent: () => number;
  setScrollTarget: (value: number) => void;
  linearFactor: number;
  uiOut: HTMLElement[];
};

function createDetailController(items: NewsItem[], scene: DetailScene | null) {
  const detail = byId<HTMLElement>('newsV2Detail');
  const back = byId<HTMLButtonElement>('newsV2DetailBack');
  const num = byId<HTMLElement>('newsV2DetailNum');
  const meta = byId<HTMLElement>('newsV2DetailMeta');
  const title = byId<HTMLElement>('newsV2DetailTitle');
  const desc = byId<HTMLElement>('newsV2DetailDesc');
  const tags = byId<HTMLElement>('newsV2DetailTags');
  const body = byId<HTMLElement>('newsV2DetailBody');

  let openState = false;
  let transitioning = false;
  let activeIndex = -1;

  function populate(index: number) {
    const item = items[index];
    if (!item || !num || !meta || !title || !desc || !tags || !body) return;
    num.textContent = `${String(index + 1).padStart(2, '0')} / ${items.length}`;
    meta.textContent = `${item.category} / ${item.pubDateLabel}`;
    title.textContent = item.title;
    desc.textContent = item.description;
    tags.innerHTML = '';
    item.tags.slice(0, 6).forEach((tag) => {
      const span = document.createElement('span');
      span.textContent = `#${tag}`;
      tags.appendChild(span);
    });
    const source = document.querySelector<HTMLElement>(`[data-news-v2-body="${CSS.escape(item.id)}"]`);
    body.innerHTML = source?.innerHTML || `<p>${item.description}</p>`;
  }

  function open(index: number) {
    if (!detail || openState || transitioning) return;
    const item = items[index];
    if (!item) return;

    activeIndex = index;
    populate(index);
    openState = true;
    transitioning = true;
    detail.classList.add('is-open');
    detail.setAttribute('aria-hidden', 'false');
    history.pushState({ newsV2: index }, '', `#signal-${String(index + 1).padStart(2, '0')}`);

    if (!scene) {
      gsap.fromTo(
        detail,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.25, onComplete: () => { transitioning = false; } }
      );
      gsap.fromTo(
        ['.news-v2-detail__head', '.news-v2-detail__reader', '.news-v2-detail__back', '.news-v2-detail__num'],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
      return;
    }

    const mesh = scene.meshes[index];
    const timeline = gsap.timeline({
      onComplete: () => {
        transitioning = false;
      },
    });

    const u = mesh.userData;
    const offset = scene.layoutState.progress > 0.5 ? u.listX / scene.linearFactor : u.theta;
    const scrollProxy = { value: scene.getScrollCurrent() };

    timeline.to(scrollProxy, {
      value: scene.getScrollCurrent() + offset,
      duration: 0.9,
      ease: 'power3.inOut',
      onUpdate: () => {
        scene.setScrollTarget(scrollProxy.value);
      },
    }, 0);

    timeline.to(u, { focus: 1, duration: 1.05, ease: 'power3.inOut' }, 0.12);
    scene.meshes.forEach((other) => {
      if (other === mesh) return;
      timeline.to(other.material.uniforms.uAlpha, { value: 0, duration: 0.55, ease: 'power2.out' }, 0.05);
    });
    timeline.to(scene.uiOut, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 0);
    timeline.fromTo('.news-v2-detail__head', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.62);
    timeline.fromTo(['.news-v2-detail__reader', '.news-v2-detail__back', '.news-v2-detail__num'], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: 'power2.out' }, 0.76);
  }

  function close() {
    if (!detail || !openState || transitioning) return;
    transitioning = true;

    if (!scene) {
      gsap.to(detail, {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: () => {
          openState = false;
          transitioning = false;
          activeIndex = -1;
          detail.classList.remove('is-open');
          detail.setAttribute('aria-hidden', 'true');
          gsap.set(detail, { clearProps: 'all' });
        },
      });
      return;
    }

    const mesh = scene.meshes[activeIndex];
    const timeline = gsap.timeline({
      onComplete: () => {
        openState = false;
        transitioning = false;
        activeIndex = -1;
        detail.classList.remove('is-open');
        detail.setAttribute('aria-hidden', 'true');
      },
    });

    timeline.to(['.news-v2-detail__head', '.news-v2-detail__reader', '.news-v2-detail__back', '.news-v2-detail__num'], {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in',
    }, 0);
    timeline.to(mesh.userData, { focus: 0, duration: 0.95, ease: 'power3.inOut' }, 0.18);
    scene.meshes.forEach((other) => {
      if (other === mesh) return;
      timeline.to(other.material.uniforms.uAlpha, { value: 1, duration: 0.65, ease: 'power2.out' }, 0.38);
    });
    timeline.to(scene.uiOut, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0.62);
  }

  back?.addEventListener('click', () => {
    if (openState) history.back();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && openState) history.back();
  });

  window.addEventListener('popstate', (event) => {
    const state = event.state as { newsV2?: number } | null;
    if (openState && (!state || state.newsV2 == null)) close();
    if (!openState && state && state.newsV2 != null) open(state.newsV2);
  });

  if (location.hash.startsWith('#signal-')) {
    history.replaceState(null, '', location.pathname);
  }

  return {
    open,
    isOpen: () => openState,
    activeMesh: () => (scene && activeIndex >= 0 ? scene.meshes[activeIndex] : null),
  };
}

function createCardTexture(item: NewsItem, index: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 620;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const panelX = 30;
  const panelY = 26;
  const panelW = 900;
  const panelH = 568;

  ctx.fillStyle = 'rgba(8, 12, 19, 0.56)';
  ctx.fillRect(panelX, panelY, panelW, panelH);

  ctx.strokeStyle = 'rgba(242, 241, 236, 0.24)';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  ctx.strokeStyle = 'rgba(242, 241, 236, 0.045)';
  ctx.lineWidth = 1;
  for (let y = panelY + 24; y < panelY + panelH; y += 16) {
    ctx.beginPath();
    ctx.moveTo(panelX + 18, y);
    ctx.lineTo(panelX + panelW - 18, y);
    ctx.stroke();
  }

  const tag = item.category.toUpperCase();
  ctx.fillStyle = 'rgba(5, 204, 144, 0.22)';
  drawRoundRect(ctx, 78, 72, 84, 44, 8);
  ctx.fillStyle = '#05cc90';
  ctx.font = '700 22px Space Grotesk, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(tag, 104, 95);

  ctx.fillStyle = 'rgba(242, 241, 236, 0.72)';
  ctx.font = '28px IBM Plex Sans, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(item.pubDateLabel, panelX + panelW - 54, 95);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#f2f1ec';
  ctx.font = '700 42px Space Grotesk, sans-serif';
  ctx.textBaseline = 'alphabetic';
  drawWrappedText(ctx, item.title, 78, 210, 800, 52, 5);

  ctx.fillStyle = 'rgba(5, 204, 144, 0.5)';
  ctx.fillRect(78, 526, 78, 4);
  ctx.fillStyle = 'rgba(242, 241, 236, 0.34)';
  ctx.font = '22px IBM Plex Sans, sans-serif';
  ctx.fillText(String(index + 1).padStart(2, '0'), 78, 492);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  let line = '';
  let lineCount = 0;

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      const isLastLine = lineCount === maxLines - 1;
      ctx.fillText(isLastLine ? truncateText(ctx, line, maxWidth) : line, x, y + lineCount * lineHeight);
      if (isLastLine) return;
      line = word;
      lineCount += 1;
    } else {
      line = next;
    }
  }

  if (line && lineCount < maxLines) {
    ctx.fillText(truncateText(ctx, line, maxWidth), x, y + lineCount * lineHeight);
  }
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let value = text;
  while (value.length > 0 && ctx.measureText(`${value}...`).width > maxWidth) {
    value = value.slice(0, -1);
  }
  return `${value.trim()}...`;
}

function setupCursor() {
  const cursor = byId<HTMLDivElement>('newsV2Cursor');
  const ring = byId<HTMLDivElement>('newsV2CursorRing');
  if (!cursor || !ring || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dotX = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3' });
  const dotY = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3' });

  window.addEventListener('mousemove', (event) => {
    dotX(event.clientX);
    dotY(event.clientY);
    ringX(event.clientX);
    ringY(event.clientY);
  });

  document.querySelectorAll('[data-news-v2-cursor]').forEach((element) => {
    element.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    element.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
}
