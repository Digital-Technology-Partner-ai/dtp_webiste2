import * as THREE from 'three';

/* ============================================================
   DTP ECOSYSTEM — immersive navigation hub
   Evolution of the spherical gallery experience into the
   Digital Technology Partner primary website surface.
   The visitor stands at the centre of the DTP ecosystem;
   destination nodes, an equator navigation ring and signal
   arcs map the business. Drag / scroll to orbit, click a
   node to travel into that section.
   ============================================================ */

const RADIUS = 30;
const NODE_W = 0.46;          // angular width at equator (rad)
const NODE_H = 0.28;          // angular height (rad)
const MINT = 0x05cc90;
const MINT_GLSL = 'vec3(0.020, 0.800, 0.565)';

/* ---------------- destination content ---------------- */

const DEFAULT_DESTINATIONS = [
  {
    id: 'why-dtp', title: 'WHY DTP', band: 'upper',
    desc: 'The case for one connected technology partner.',
    intro: 'Digital Technology Partner exists because technology change fails when it is delivered in fragments. We connect people, technology, data, AI and learning into one operating ecosystem — so transformation holds together.',
    blocks: [
      ['One ecosystem, not point solutions', 'Strategy, build and adoption are designed together, so every initiative reinforces the next rather than competing with it.'],
      ['Senior, hands-on partnership', 'You work directly with experienced practitioners who take ownership from first conversation to live operation.'],
      ['Outcomes that survive contact', 'We design for the day after go-live: operating rhythms, capability and support that keep value compounding.'],
    ],
  },
  {
    id: 'ai-foundry', title: 'AI FOUNDRY', band: 'upper',
    desc: 'Where AI capability is designed, built and proven.',
    intro: 'The AI Foundry is where ideas become working systems. We design, prototype and harden AI capability against real operational demands before it ever carries your name.',
    blocks: [
      ['Discover', 'Map the highest-value opportunities and the constraints that matter before any build begins.'],
      ['Build', 'Prototype rapidly, test against real workflows, and engineer for production from the start.'],
      ['Prove', 'Evaluate behaviour, safety and value in the open, so what ships is understood and trusted.'],
    ],
  },
  {
    id: 'agent-ecosystem', title: 'AGENT ECOSYSTEM', band: 'upper',
    desc: 'Connected agents working across the business.',
    intro: 'Individual AI tools create islands. We design ecosystems of agents that share context, hand off work cleanly and operate inside your governance — a connected digital workforce.',
    blocks: [
      ['Orchestration', 'Agents that route, escalate and collaborate, mirroring how your teams actually work.'],
      ['Shared context', 'Common memory and data foundations so every agent acts on the same truth.'],
      ['Governance by design', 'Permissions, observability and human oversight built in from the first line.'],
    ],
  },
  {
    id: 'use-cases', title: 'USE CASES', band: 'upper',
    desc: 'Practical applications, mapped to business value.',
    intro: 'AI earns its place through specific, measurable work. We focus on use cases where the value is clear, the data exists and the operational fit is real.',
    blocks: [
      ['Service and operations', 'Assistants and automations that remove friction from customer and back-office journeys.'],
      ['Knowledge and decisions', 'Faster routes from raw information to confident decisions for leaders and frontline teams.'],
      ['Learning and capability', 'AI-supported learning that builds skills inside the flow of work.'],
    ],
  },
  {
    id: 'process', title: 'PROCESS', band: 'upper',
    desc: 'How we move from idea to live operation.',
    intro: 'A clear, staged process keeps ambition honest. Every engagement moves through the same disciplined route — understand, design, build, embed — with decision points you control.',
    blocks: [
      ['Understand', 'Ground the work in your operations, data and people before proposing anything.'],
      ['Design and build', 'Shape the solution with the people who will use it, then build in tight, reviewable increments.'],
      ['Embed and evolve', 'Land the change, transfer capability and keep improving once it is live.'],
    ],
  },
  {
    id: 'case-studies', title: 'CASE STUDIES', band: 'lower',
    desc: 'Evidence from real engagements.',
    intro: 'The strongest argument for this way of working is the work itself. This destination will hold the engagements, outcomes and lessons we are able to share.',
    blocks: [
      ['Engagements', 'Selected projects across AI, data and digital operations.'],
      ['Outcomes', 'What changed, for whom, and how it was measured.'],
      ['Lessons', 'What we would repeat, and what we would do differently.'],
    ],
  },
  {
    id: 'insights', title: 'INSIGHTS', band: 'lower',
    desc: 'Thinking, news and perspectives from DTP.',
    intro: 'Perspectives from inside the work: what we are learning about AI, operations and organisational change as we build alongside our clients.',
    blocks: [
      ['Notes from the field', 'Short, practical observations from live engagements.'],
      ['Signal over noise', 'What actually matters in each wave of AI capability.'],
      ['In depth', 'Longer analysis for leaders shaping technology decisions.'],
    ],
  },
  {
    id: 'learning', title: 'LEARNING SOLUTIONS', band: 'lower',
    desc: 'Capability building for your teams.',
    intro: 'Technology only compounds when people grow with it. We design learning that builds durable capability — practical, contextual and embedded in real work.',
    blocks: [
      ['Leadership fluency', 'Equipping decision-makers to direct AI with confidence.'],
      ['Practitioner skills', 'Hands-on capability for the teams building and operating new systems.'],
      ['Working with AI', 'Helping every role find its new operating rhythm alongside intelligent tools.'],
    ],
  },
  {
    id: 'contact', title: 'CONTACT', band: 'lower',
    desc: 'Start the conversation.',
    intro: 'If this way of working resonates, the next step is a conversation. Reach us through the main Digital Technology Partner site while this experience is in development.',
    blocks: [
      ['Talk to us', 'Bring a problem, an ambition or a half-formed idea — that is where the best work starts.'],
      ['Current site', 'Our existing website remains live at digitaltechnologypartner.ai.'],
      ['What happens next', 'A short scoping conversation, an honest view on fit, and a clear proposed route.'],
    ],
  },
];

const DEFAULT_RING_ITEMS = [
  { label: 'HOME', id: null },
  { label: 'WHY DTP', id: 'why-dtp' },
  { label: 'AI FOUNDRY', id: 'ai-foundry' },
  { label: 'USE CASES', id: 'use-cases' },
  { label: 'CASE STUDIES', id: 'case-studies' },
  { label: 'INSIGHTS', id: 'insights' },
  { label: 'CONTACT', id: 'contact' },
];

function readJsonData(id, fallback) {
  const node = document.getElementById(id);
  if (!node) return fallback;
  try {
    const parsed = JSON.parse(node.textContent || '[]');
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

const DESTINATIONS = readJsonData('ecosystem-destinations', DEFAULT_DESTINATIONS);
const RING_ITEMS = readJsonData('ecosystem-ring-items', DEFAULT_RING_ITEMS);

/* ---------------- renderer / scene ---------------- */

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090d);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 140);
scene.add(camera);

const pivot = new THREE.Group();       // vertical look (x)
const sphereGroup = new THREE.Group(); // horizontal spin (y)
pivot.add(sphereGroup);
scene.add(pivot);

const nodesGroup = new THREE.Group();
const envGroup = new THREE.Group();
sphereGroup.add(nodesGroup, envGroup);

const dustGroup = new THREE.Group();   // world-level atmosphere, drifts independently
scene.add(dustGroup);

/* ---------------- node shaders ---------------- */

const VERT = /* glsl */ `
  uniform float uHover;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position * (1.0 - uHover * 0.045);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHover;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float bx = min(vUv.x, 1.0 - vUv.x);
    float by = min(vUv.y, 1.0 - vUv.y);
    float edge = 1.0 - smoothstep(0.0, 0.055, min(bx, by));
    vec3 col = tex.rgb * (1.0 + uHover * 0.22);
    col += ${MINT_GLSL} * edge * uHover * 0.5;
    float a = tex.a * uOpacity;
    a = max(a, edge * uHover * 0.3 * uOpacity);
    gl_FragColor = vec4(col, a);
  }
`;

/* ---------------- helpers ---------------- */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const nearestAngle = (target, current) =>
  current + Math.atan2(Math.sin(target - current), Math.cos(target - current));

function sph(radius, theta, lat) {
  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.sin(theta),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(theta)
  );
}

function curvedPanelGeometry(theta0, lat0, angW, angH, radius) {
  const wSegs = 20, hSegs = 14;
  const positions = [], uvs = [], indices = [];
  for (let j = 0; j <= hSegs; j++) {
    for (let i = 0; i <= wSegs; i++) {
      const u = i / wSegs, v = j / hSegs;
      const th = theta0 + (u - 0.5) * angW;
      const la = lat0 + (v - 0.5) * angH;
      const p = sph(radius, th, la);
      positions.push(p.x, p.y, p.z);
      uvs.push(1 - u, v); // viewed from inside the sphere: flip U
    }
  }
  for (let j = 0; j < hSegs; j++) {
    for (let i = 0; i < wSegs; i++) {
      const a = j * (wSegs + 1) + i;
      indices.push(a, a + wSegs + 1, a + 1, a + 1, a + wSegs + 1, a + wSegs + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

/* ---------------- node texture (canvas) ---------------- */

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function makeNodeTexture(dest, index) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 640;
  const x = c.getContext('2d');

  // navy glass panel
  const r = 10, inset = 6;
  x.beginPath();
  x.roundRect(inset, inset, c.width - inset * 2, c.height - inset * 2, r);
  x.fillStyle = 'rgba(11, 16, 26, 0.92)';
  x.fill();
  x.lineWidth = 2;
  x.strokeStyle = 'rgba(242, 241, 236, 0.16)';
  x.stroke();

  // corner brackets — quiet tech framing
  x.strokeStyle = 'rgba(5, 204, 144, 0.55)';
  x.lineWidth = 2;
  const L = 26, o = inset + 1;
  const corners = [
    [o, o, 1, 1], [c.width - o, o, -1, 1],
    [o, c.height - o, 1, -1], [c.width - o, c.height - o, -1, -1],
  ];
  for (const [cx, cy, sx, sy] of corners) {
    x.beginPath();
    x.moveTo(cx + sx * L, cy);
    x.lineTo(cx, cy);
    x.lineTo(cx, cy + sy * L);
    x.stroke();
  }

  // index
  x.fillStyle = '#05CC90';
  x.font = '500 40px "IBM Plex Mono", monospace';
  x.fillText(`0${index + 1}`, 64, 124);

  // title (wraps if needed)
  x.fillStyle = '#F2F1EC';
  x.font = '600 84px "Space Grotesk", sans-serif';
  const titleLines = wrapText(x, dest.title, 880);
  const titleY = titleLines.length > 1 ? 300 : 348;
  titleLines.forEach((ln, i) => x.fillText(ln, 64, titleY + i * 94));

  // descriptor
  x.fillStyle = '#9AA3AD';
  x.font = '300 33px "IBM Plex Sans", sans-serif';
  wrapText(x, dest.desc, 880).forEach((ln, i) => x.fillText(ln, 64, 520 + i * 44));

  // mint signature mark
  x.fillStyle = 'rgba(5, 204, 144, 0.85)';
  x.fillRect(64, 558, 56, 3);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

/* ---------------- build nodes ---------------- */

const nodes = [];

function buildNodes() {
  const upper = DESTINATIONS.filter(d => d.band === 'upper');
  const lower = DESTINATIONS.filter(d => d.band === 'lower');
  const place = (list, lat, offset) => {
    const slot = (Math.PI * 2) / list.length;
    list.forEach((dest, i) => {
      const theta = Math.PI + offset + i * slot;
      const index = DESTINATIONS.indexOf(dest);
      const effW = NODE_W / Math.cos(lat);
      const geo = curvedPanelGeometry(theta, lat, effW, NODE_H, RADIUS);
      const uniforms = {
        uMap: { value: makeNodeTexture(dest, index) },
        uHover: { value: 0 },
        uOpacity: { value: 0 },
      };
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.setScalar(1.45);
      nodesGroup.add(mesh);
      const node = { mesh, theta, lat, uniforms, dest, index, hover: 0, hoverT: 0 };
      mesh.userData.node = node;
      nodes.push(node);
    });
  };
  place(upper, 0.30, 0);
  place(lower, -0.30, Math.PI / 4);
}

/* ---------------- environment: graticule, ring, arcs, dust ---------------- */

const ambientMats = [];
const ambientFade = { v: 0 }; // 0 → hidden, 1 → resting state

function registerAmbient(mat, baseOpacity) {
  mat.transparent = true;
  mat.depthWrite = false;
  mat.opacity = 0;
  mat.userData.base = baseOpacity;
  ambientMats.push(mat);
  return mat;
}

function circlePoints(radius, lat, segments = 180) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    pts.push(sph(radius, (i / segments) * Math.PI * 2, lat));
  }
  return pts;
}

const arcs = [];
let pulsePoints = null;

function buildEnvironment() {
  // graticule — faint structural lines of the environment
  const latMat = registerAmbient(new THREE.LineBasicMaterial({ color: 0xf2f1ec }), 0.045);
  for (const lat of [-0.52, -0.26, 0.26, 0.52, 0.78]) {
    const geo = new THREE.BufferGeometry().setFromPoints(circlePoints(30.6, lat));
    envGroup.add(new THREE.Line(geo, latMat));
  }
  const lonMat = registerAmbient(new THREE.LineBasicMaterial({ color: 0xf2f1ec }), 0.035);
  for (let k = 0; k < 16; k++) {
    const theta = (k / 16) * Math.PI * 2;
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const la = -1.05 + (i / 40) * 2.1;
      pts.push(sph(30.6, theta, la));
    }
    envGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lonMat));
  }

  // equator ring + ticks — the navigation belt
  const ringMat = registerAmbient(new THREE.LineBasicMaterial({ color: MINT }), 0.30);
  envGroup.add(new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(circlePoints(29.8, 0, 256).slice(0, 256)), ringMat));

  const tickMat = registerAmbient(new THREE.LineBasicMaterial({ color: MINT }), 0.16);
  const tickPts = [];
  for (let k = 0; k < 120; k++) {
    const th = (k / 120) * Math.PI * 2;
    tickPts.push(sph(29.8, th, -0.013), sph(29.8, th, 0.013));
  }
  envGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tickPts), tickMat));

  // connection arcs between destinations — the ecosystem links
  const upperIdx = DESTINATIONS.map((d, i) => d.band === 'upper' ? i : -1).filter(i => i >= 0);
  const lowerIdx = DESTINATIONS.map((d, i) => d.band === 'lower' ? i : -1).filter(i => i >= 0);
  const pairs = [];
  upperIdx.forEach((v, i) => pairs.push([v, upperIdx[(i + 1) % upperIdx.length]]));
  lowerIdx.forEach((v, i) => pairs.push([v, lowerIdx[(i + 1) % lowerIdx.length]]));
  for (const li of lowerIdx) {
    const ln = nodes.find(n => n.index === li);
    let best = null, bestD = Infinity;
    for (const ui of upperIdx) {
      const un = nodes.find(n => n.index === ui);
      const d = Math.abs(Math.atan2(Math.sin(un.theta - ln.theta), Math.cos(un.theta - ln.theta)));
      if (d < bestD) { bestD = d; best = ui; }
    }
    pairs.push([li, best]);
  }

  const arcMat = registerAmbient(new THREE.LineBasicMaterial({ color: 0xf2f1ec }), 0.07);
  for (const [ia, ib] of pairs) {
    const na = nodes.find(n => n.index === ia);
    const nb = nodes.find(n => n.index === ib);
    const a = sph(1, na.theta, na.lat).normalize();
    const b = sph(1, nb.theta, nb.lat).normalize();
    const omega = Math.acos(clamp(a.dot(b), -1, 1));
    const pts = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const p = a.clone().multiplyScalar(Math.sin((1 - t) * omega) / Math.sin(omega))
        .add(b.clone().multiplyScalar(Math.sin(t * omega) / Math.sin(omega)))
        .multiplyScalar(30.3);
      pts.push(p);
    }
    envGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat));
    arcs.push({ pts, t: Math.random(), speed: 0.0009 + Math.random() * 0.0016 });
  }

  // signal pulses travelling along the arcs
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(arcs.length * 3), 3));
  const pulseMat = registerAmbient(new THREE.PointsMaterial({
    color: MINT, size: 0.42, sizeAttenuation: true,
  }), 0.8);
  pulsePoints = new THREE.Points(pulseGeo, pulseMat);
  pulsePoints.frustumCulled = false;
  envGroup.add(pulsePoints);

  // sparse ambient dust — atmosphere, not spectacle
  const dustGeo = new THREE.BufferGeometry();
  const dustArr = new Float32Array(340 * 3);
  for (let i = 0; i < 340; i++) {
    const dir = new THREE.Vector3().randomDirection();
    const r = 13 + 14 * Math.cbrt(Math.random());
    dir.multiplyScalar(r);
    dustArr.set([dir.x, dir.y, dir.z], i * 3);
  }
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustArr, 3));
  const dustMat = registerAmbient(new THREE.PointsMaterial({
    color: 0x9aa3ad, size: 0.09, sizeAttenuation: true,
  }), 0.32);
  dustGroup.add(new THREE.Points(dustGeo, dustMat));
}

/* ---------------- interaction state ---------------- */

const state = {
  curY: 0, curX: 0,
  tarY: 0, tarX: 0,
  velY: 0, velX: 0,
  dragging: false,
  locked: false,
};
const X_LIMIT = 0.45;
const SENS = 0.0026;
const tilt = { tx: 0, ty: 0, cx: 0, cy: 0 };
const mouseNdc = new THREE.Vector2(-2, -2);
const raycaster = new THREE.Raycaster();

let lastInteract = performance.now();
let hovered = null;
let currentNode = null;
let moved = 0;
let lastDx = 0, lastDy = 0;

window.DTP = {
  state, camera, nodes, openSection, closeSection,
  get hovered() { return hovered; },
  get currentNode() { return currentNode; },
};

/* ---------------- pointer / wheel ---------------- */

canvas.addEventListener('pointerdown', (e) => {
  if (state.locked) return;
  state.dragging = true;
  canvas.classList.add('dragging');
  canvas.setPointerCapture(e.pointerId);
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
  panelX(Math.min(e.clientX, window.innerWidth - 300));
  panelY(e.clientY);

  if (!state.dragging || state.locked) return;
  const dx = e.movementX ?? 0;
  const dy = e.movementY ?? 0;
  moved += Math.abs(dx) + Math.abs(dy);
  state.tarY -= dx * SENS;
  state.tarX = clamp(state.tarX - dy * SENS * 0.78, -X_LIMIT, X_LIMIT);
  lastDx = lastDx * 0.7 + (-dx * SENS) * 0.3;
  lastDy = lastDy * 0.7 + (-dy * SENS * 0.78) * 0.3;
  lastInteract = performance.now();
});

function endDrag() {
  if (!state.dragging) return;
  state.dragging = false;
  canvas.classList.remove('dragging');
  state.velY = clamp(lastDx * 0.9, -0.09, 0.09);
  state.velX = clamp(lastDy * 0.9, -0.05, 0.05);
  lastInteract = performance.now();
  if (moved < 6 && hovered && !state.locked) openSection(hovered);
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
  if (e.key !== 'Escape') return;
  if (menuOpen) closeMenu();
  else if (state.locked && currentNode) closeSection();
});

/* ---------------- hover panel ---------------- */

const nodePanel = document.getElementById('nodePanel');
const npIndex = nodePanel.querySelector('.np-index');
const npTitle = nodePanel.querySelector('.np-title');
const npDesc = nodePanel.querySelector('.np-desc');
const panelX = gsap.quickTo(nodePanel, 'x', { duration: 0.45, ease: 'power3' });
const panelY = gsap.quickTo(nodePanel, 'y', { duration: 0.45, ease: 'power3' });

function setHovered(node) {
  if (hovered === node) return;
  hovered = node;
  if (node) {
    npIndex.textContent = `DESTINATION 0${node.index + 1}`;
    npTitle.textContent = node.dest.title;
    npDesc.textContent = node.dest.desc;
    gsap.to(nodePanel, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
    canvas.classList.add('hovering');
  } else {
    gsap.to(nodePanel, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' });
    canvas.classList.remove('hovering');
  }
}

/* ---------------- equator ring nav (HTML projected into 3D) ---------------- */

const ringNav = document.getElementById('ringNav');
const ringEls = [];

function buildRingNav() {
  const slot = (Math.PI * 2) / RING_ITEMS.length;
  RING_ITEMS.forEach((item, i) => {
    const el = document.createElement('button');
    el.className = 'ring-item';
    el.textContent = item.label;
    el.addEventListener('click', () => {
      if (state.locked || menuOpen) return;
      if (item.id) {
        const node = nodes.find(n => n.dest.id === item.id);
        if (node) openSection(node);
      } else {
        // HOME — glide back to the resting view
        gsap.to(state, {
          tarY: nearestAngle(0, state.curY), tarX: 0,
          duration: 1.4, ease: 'power3.inOut',
        });
      }
    });
    ringNav.appendChild(el);
    ringEls.push({ el, anchor: sph(1, Math.PI + i * slot, 0.05), visible: false });
  });
}

const _v = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _camDir = new THREE.Vector3();

function updateRingNav() {
  camera.getWorldPosition(_camPos);
  camera.getWorldDirection(_camDir);
  for (const item of ringEls) {
    _v.copy(item.anchor).multiplyScalar(29.8).applyMatrix4(sphereGroup.matrixWorld);
    const toItem = _v.clone().sub(_camPos).normalize();
    const facing = toItem.dot(_camDir);
    const ndc = _v.project(camera);
    const behind = facing < 0.3 || ndc.z > 1;
    const alpha = behind ? 0 : clamp((facing - 0.3) / 0.3, 0, 1) * ambientFade.v;
    item.el.style.opacity = alpha.toFixed(3);
    item.el.style.pointerEvents = alpha > 0.4 ? 'auto' : 'none';
    if (!behind) {
      const x = (ndc.x + 1) / 2 * window.innerWidth;
      const y = (-ndc.y + 1) / 2 * window.innerHeight;
      item.el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }
}

/* ---------------- menu overlay ---------------- */

const menuOverlay = document.getElementById('menuOverlay');
const menuList = document.getElementById('menuList');
let menuOpen = false;

function buildMenu() {
  DESTINATIONS.forEach((dest, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.innerHTML = `<span class="mi-num">0${i + 1}</span><span class="mi-title">${dest.title}</span><span class="mi-desc">${dest.desc}</span>`;
    btn.addEventListener('click', () => {
      closeMenu();
      if (!state.locked) {
        const node = nodes.find(n => n.dest.id === dest.id);
        if (node) openSection(node);
      }
    });
    li.appendChild(btn);
    menuList.appendChild(li);
  });
  document.getElementById('menuBtn').addEventListener('click', openMenu);
  document.getElementById('menuClose').addEventListener('click', closeMenu);
}

function openMenu() {
  menuOpen = true;
  gsap.to(menuOverlay, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
  gsap.fromTo('.menu-list li', { y: 26, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.05, ease: 'power3.out', delay: 0.1 });
}
function closeMenu() {
  menuOpen = false;
  gsap.to(menuOverlay, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
}

/* ---------------- destination page entry ---------------- */

function openSection(node) {
  state.locked = true;
  currentNode = node;
  state.velY = 0; state.velX = 0;
  setHovered(null);
  canvas.classList.remove('hovering');

  const tY = nearestAngle(Math.PI - node.theta, state.curY);
  const tX = -node.lat;
  const others = nodes.filter(n => n !== node).map(n => n.uniforms.uOpacity);

  gsap.timeline({
    onComplete: () => {
      window.location.assign(node.dest.route || '/');
    },
  })
    .to(state, { curY: tY, curX: tX, tarY: tY, tarX: tX, duration: 1.2, ease: 'power3.inOut' }, 0)
    .to(camera.position, { z: -16, duration: 1.2, ease: 'power3.inOut' }, 0)
    .to(camera, {
      fov: 52, duration: 1.2, ease: 'power3.inOut',
      onUpdate: () => camera.updateProjectionMatrix(),
    }, 0)
    .to(ambientFade, { v: 0, duration: 0.7, ease: 'power2.out' }, 0)
    .to(others, { value: 0, duration: 0.7, ease: 'power2.out' }, 0)
    .to(node.uniforms.uHover, { value: 1, duration: 0.7, ease: 'power2.out' }, 0)
    .to(['.ui-footer', '.ui-header', '.ring-item'], { autoAlpha: 0, duration: 0.5 }, 0.1)
    .to('#scene', { autoAlpha: 0.35, duration: 0.55, ease: 'power2.inOut' }, 0.78);
}

function closeSection() {
  state.locked = false;
  currentNode = null;
  lastInteract = performance.now();
}

/* ---------------- boot ---------------- */

const loaderBar = document.getElementById('loaderBar');
gsap.to(loaderBar, { width: '82%', duration: 1.4, ease: 'power2.out' });

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function warmFonts() {
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('600 84px "Space Grotesk"'),
        document.fonts.load('500 40px "IBM Plex Mono"'),
        document.fonts.load('300 33px "IBM Plex Sans"'),
        document.fonts.ready,
      ]),
      delay(900),
    ]);
  } catch { /* fall back to system fonts */ }
}

async function boot() {
  await warmFonts();

  buildNodes();
  buildEnvironment();
  buildRingNav();
  buildMenu();

  gsap.killTweensOf(loaderBar);
  loaderBar.style.width = '100%';
  gsap.to('#loader', {
    autoAlpha: 0,
    pointerEvents: 'none',
    duration: 0.35,
    delay: 0.05,
    onComplete: () => gsap.set('#loader', { display: 'none' }),
  });

  const scales = nodes.map(n => n.mesh.scale);
  const ops = nodes.map(n => n.uniforms.uOpacity);
  gsap.to(scales, { x: 1, y: 1, z: 1, duration: 1.35, ease: 'power3.out', stagger: 0.055, delay: 0.12 });
  gsap.to(ops, { value: 1, duration: 1, ease: 'power2.out', stagger: 0.055, delay: 0.12 });
  gsap.to(ambientFade, { v: 1, duration: 1.2, ease: 'power2.inOut', delay: 0.18 });
  gsap.fromTo(['.ui-header', '.ui-footer'],
    { autoAlpha: 0, y: -10 },
    { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.28, stagger: 0.08 });
}
boot();

/* ---------------- frame loop ---------------- */

let lastT = performance.now();
const pulseAttr = () => pulsePoints && pulsePoints.geometry.attributes.position;
const _p = new THREE.Vector3();

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
      if (t - lastInteract > 4500) state.tarY += 0.00022 * dt; // idle drift
    }
    const ease = 1 - Math.pow(1 - 0.085, dt);
    state.curY += (state.tarY - state.curY) * ease;
    state.curX += (state.tarX - state.curX) * ease;
  }

  sphereGroup.rotation.y = state.curY;
  pivot.rotation.x = state.curX;

  // camera tilt toward cursor
  const tx = state.locked ? 0 : tilt.tx;
  const ty = state.locked ? 0 : tilt.ty;
  tilt.cx += (tx - tilt.cx) * 0.05 * dt;
  tilt.cy += (ty - tilt.cy) * 0.05 * dt;
  camera.rotation.x = -tilt.cy * 0.03;
  camera.rotation.y = -tilt.cx * 0.04;

  // ambient material fade
  for (const m of ambientMats) m.opacity = m.userData.base * ambientFade.v;

  // signal pulses along arcs
  const attr = pulseAttr();
  if (attr) {
    arcs.forEach((arc, i) => {
      arc.t = (arc.t + arc.speed * dt) % 1;
      const f = arc.t * (arc.pts.length - 1);
      const a = Math.floor(f);
      _p.copy(arc.pts[a]).lerp(arc.pts[Math.min(a + 1, arc.pts.length - 1)], f - a);
      attr.setXYZ(i, _p.x, _p.y, _p.z);
    });
    attr.needsUpdate = true;
  }

  // dust drift
  dustGroup.rotation.y += 0.00012 * dt;

  // hover raycast
  if (!state.locked) {
    raycaster.setFromCamera(mouseNdc, camera);
    const hits = raycaster.intersectObjects(nodesGroup.children);
    setHovered(hits.length ? hits[0].object.userData.node : null);
    for (const n of nodes) {
      n.hoverT = (n === hovered) ? 1 : 0;
      n.hover += (n.hoverT - n.hover) * 0.09 * dt;
      n.uniforms.uHover.value = n.hover;
    }
  }

  pivot.updateMatrixWorld(true);
  updateRingNav();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ---------------- resize ---------------- */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
