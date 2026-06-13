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

const RADIUS = 36;
const NODE_W = Math.PI * (23 / 180); // angular width at equator (rad)
const NODE_H = 0.28;          // angular height (rad)
const MINT = 0x05cc90;
const MINT_GLSL = 'vec3(0.020, 0.800, 0.565)';
const ACTIVE_ARC = Math.PI;
const SIGNAL_COUNT = 30;
const SIGNAL_REAR_RATIO = 0.70;
const SIGNAL_REAR_FADE = 0.19;
const SIGNAL_RANDOMNESS = 1;
const SIGNAL_START_PHASE = 0.90;
const SIGNAL_ENTRY_SPREAD = Math.PI * (220 / 180);
const SIGNAL_ENTRY_LAT = 0.62;
const SIGNAL_DEPTH_TRAVEL = 18;
const SIGNAL_MOTION_SPEED = 0.75;

function arcTheta(index, count, offset = 0) {
  if (count <= 1) return Math.PI + offset;
  return Math.PI + offset - ACTIVE_ARC / 2 + (index / (count - 1)) * ACTIVE_ARC;
}

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
    id: 'news', title: 'NEWS', band: 'upper',
    desc: 'Updates from DTP and the AI landscape.',
    intro: 'News from Digital Technology Partner: company updates, AI market movement and practical signals for leaders tracking what is changing now.',
    blocks: [
      ['Company updates', 'Announcements, launches and useful changes from inside DTP.'],
      ['Market signals', 'Relevant movement across AI, automation, data and digital transformation.'],
      ['Leader context', 'Short updates framed around what decision-makers need to know next.'],
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
  { label: 'PROCESS', id: 'process' },
  { label: 'NEWS', id: 'news' },
  { label: 'CASE STUDIES', id: 'case-studies' },
  { label: 'INSIGHTS', id: 'insights' },
  { label: 'LEARNING', id: 'learning' },
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

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 140);
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

const signalGroup = new THREE.Group(); // camera-space travel signals
scene.add(signalGroup);

const universeGroup = new THREE.Group(); // Why DTP star universe, used as distant background
universeGroup.position.set(0, 0, -42);
universeGroup.scale.setScalar(window.innerWidth < 760 ? 3.6 : 5.2);
scene.add(universeGroup);

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
  uniform sampler2D uDescMask;
  uniform float uHover;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float bx = min(vUv.x, 1.0 - vUv.x);
    float by = min(vUv.y, 1.0 - vUv.y);
    float edge = 1.0 - smoothstep(0.0, 0.055, min(bx, by));
    // tint the subtitle toward mint on hover, matching the card border colour
    float descMask = texture2D(uDescMask, vUv).a;
    vec3 base = mix(tex.rgb, ${MINT_GLSL}, descMask * uHover);
    vec3 col = base * (1.0 + uHover * 0.22);
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

  // card copy — hook title + outcome line, falling back to nav title/desc
  const cardTitle = dest.cardTitle || dest.title;
  const cardDesc = dest.cardDesc || dest.desc;

  // adaptive title sizing: short labels stay bold, longer hooks step down to breathe
  const titleSizes = [84, 68, 58, 50];
  let titlePx = titleSizes[0];
  let titleLines = [];
  for (const px of titleSizes) {
    x.font = `600 ${px}px "Space Grotesk", sans-serif`;
    titleLines = wrapText(x, cardTitle, 896);
    titlePx = px;
    if (titleLines.length <= 2) break;
  }
  const titleLH = Math.round(titlePx * 1.14);

  // outcome / support line
  x.font = '300 32px "IBM Plex Sans", sans-serif';
  const descLines = wrapText(x, cardDesc, 900);
  const descLH = 42;

  // vertically centre the title + desc block in the card body
  const gap = 36;
  const blockH = titleLines.length * titleLH + gap + descLines.length * descLH;
  const areaTop = 168, areaBot = 540;
  const blockTop = areaTop + Math.max(0, ((areaBot - areaTop) - blockH) / 2);

  x.fillStyle = '#F2F1EC';
  x.font = `600 ${titlePx}px "Space Grotesk", sans-serif`;
  titleLines.forEach((ln, i) => x.fillText(ln, 64, blockTop + titleLH * i + titlePx * 0.78));

  const descTop = blockTop + titleLines.length * titleLH + gap;
  const descFont = '300 32px "IBM Plex Sans", sans-serif';
  x.fillStyle = '#9AA3AD';
  x.font = descFont;
  descLines.forEach((ln, i) => x.fillText(ln, 64, descTop + descLH * i + 24));

  // mint signature mark
  x.fillStyle = 'rgba(5, 204, 144, 0.85)';
  x.fillRect(64, 566, 56, 3);

  // subtitle mask — same glyphs, white on transparent — lets the shader tint
  // just the subtitle mint on hover (matching the card border colour)
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = c.width; maskCanvas.height = c.height;
  const mx = maskCanvas.getContext('2d');
  mx.fillStyle = '#ffffff';
  mx.font = descFont;
  descLines.forEach((ln, i) => mx.fillText(ln, 64, descTop + descLH * i + 24));

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const descMask = new THREE.CanvasTexture(maskCanvas);
  descMask.anisotropy = tex.anisotropy;
  return { map: tex, descMask };
}

/* ---------------- build nodes ---------------- */

const nodes = [];

function buildNodes() {
  const upper = DESTINATIONS.filter(d => d.band === 'upper');
  const lower = DESTINATIONS.filter(d => d.band === 'lower');
  const place = (list, lat, offset) => {
    list.forEach((dest, i) => {
      const theta = arcTheta(i, list.length, offset);
      const index = DESTINATIONS.indexOf(dest);
      const effW = NODE_W / Math.cos(lat);
      const geo = curvedPanelGeometry(theta, lat, effW, NODE_H, RADIUS);
      const card = makeNodeTexture(dest, index);
      const uniforms = {
        uMap: { value: card.map },
        uDescMask: { value: card.descMask },
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
  place(upper, Math.PI * (18 / 180), 0);
  place(lower, -Math.PI * (18 / 180), 0);
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

function makeSignalTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const x = c.getContext('2d');
  x.clearRect(0, 0, 64, 64);
  x.shadowColor = 'rgba(5, 204, 144, 0.75)';
  x.shadowBlur = 18;
  x.fillStyle = 'rgba(5, 204, 144, 0.92)';
  x.fillRect(20, 20, 24, 24);
  x.shadowBlur = 0;
  x.strokeStyle = 'rgba(244, 241, 232, 0.26)';
  x.strokeRect(20.5, 20.5, 23, 23);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function angularDelta(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

function insideCardBoundary(theta, lat) {
  for (const node of nodes) {
    const halfW = (NODE_W / Math.cos(node.lat)) / 2;
    const halfH = NODE_H / 2;
    if (Math.abs(angularDelta(theta, node.theta)) <= halfW && Math.abs(lat - node.lat) <= halfH) {
      return true;
    }
  }
  return false;
}

function resetSignal(signal, phase = Math.random()) {
  const side = Math.random() < 0.5 ? -1 : 1;
  signal.startX = (Math.random() - 0.5) * 14;
  signal.startY = (Math.random() - 0.5) * 12;
  signal.startZ = -56 - Math.random() * 18;
  signal.endX = side * (24 + Math.random() * 24);
  signal.endY = signal.startY + (Math.random() - 0.5) * 18;
  signal.endZ = 10 + Math.random() * 12;
  signal.driftX = (Math.random() - 0.5) * 5 * SIGNAL_RANDOMNESS;
  signal.driftY = (Math.random() - 0.5) * 5 * SIGNAL_RANDOMNESS;
  signal.depthPhase = phase;
  signal.speed = (0.0014 + Math.random() * 0.0024) * SIGNAL_MOTION_SPEED;
}

const arcs = [];
const signalPulses = [];
let universeParticles = null;

/* ---------------- AI-core video backdrop ---------------- */
/* The supplied processor-landscape film wraps the viewer as a
   distant horizon band: graded toward the DTP mint, faded into
   darkness above and below, and parallax-coupled to the orbit
   so the gallery appears to hover above the inside of the
   machine. Renders first, behind every existing layer. */

const VIDEO_BACKDROP_SRC = '/ecosystem/video/ai-core-loop.mp4';
const VIDEO_BACKDROP_RADIUS = 92;
const VIDEO_BACKDROP_BASE_Y = -14;
const VIDEO_PARALLAX_ORBIT = 0.12;   // fraction of sphere orbit the horizon follows
const videoFade = { v: 0 };
const videoBackdropGroup = new THREE.Group();
let videoBackdropMat = null;
scene.add(videoBackdropGroup);

const VIDEO_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const VIDEO_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uRepeat;
  varying vec2 vUv;
  void main() {
    vec3 col = texture2D(uMap, vec2(vUv.x * uRepeat, vUv.y)).rgb;
    col = pow(col, vec3(1.18));
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, ${MINT_GLSL} * lum * 1.55, 0.22);
    col *= 0.6;
    float band = smoothstep(0.02, 0.24, vUv.y) * (1.0 - smoothstep(0.70, 0.985, vUv.y));
    gl_FragColor = vec4(col, uOpacity * band);
  }
`;

let videoBackdropEl = null;

function buildVideoBackdrop() {
  const video = document.createElement('video');
  videoBackdropEl = video;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.preload = 'auto';
  video.src = VIDEO_BACKDROP_SRC;

  const tex = new THREE.VideoTexture(video);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;

  videoBackdropMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: tex },
      uOpacity: { value: 0 },
      uRepeat: { value: 3.0 },
    },
    vertexShader: VIDEO_VERT,
    fragmentShader: VIDEO_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
  });

  // height keeps the film aspect-true across each mirrored 120° arc
  const arcPerCopy = (Math.PI * 2 * VIDEO_BACKDROP_RADIUS) / 3;
  const height = arcPerCopy / (784 / 470);
  const geo = new THREE.CylinderGeometry(
    VIDEO_BACKDROP_RADIUS, VIDEO_BACKDROP_RADIUS, height, 96, 1, true);
  const mesh = new THREE.Mesh(geo, videoBackdropMat);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;
  videoBackdropGroup.add(mesh);
  videoBackdropGroup.position.y = VIDEO_BACKDROP_BASE_Y;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = () => {
    if (reduceMotion) {
      video.currentTime = 0.1; // hold a single graded frame
      return;
    }
    video.play().catch(() => {
      window.addEventListener('pointerdown', () => video.play().catch(() => {}), { once: true });
    });
  };
  if (video.readyState >= 2) start();
  else video.addEventListener('canplay', start, { once: true });

  gsap.to(videoFade, { v: 1, duration: 2.8, ease: 'power2.inOut', delay: 0.5 });
}

const signalRaycaster = new THREE.Raycaster();
const signalNdc = new THREE.Vector2();
const signalWorld = new THREE.Vector3();

function buildUniverseBackground() {
  const mint = new THREE.Color(0x00e5a0);
  const blue = new THREE.Color(0x7c8bff);
  const ivory = new THREE.Color(0xf4f1e8);
  const amber = new THREE.Color(0xf4c84a);

  const particleCount = 860;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 0.8 + Math.random() * 3.8;
    const a = Math.random() * Math.PI * 2;
    const z = (Math.random() - 0.5) * 1.3;
    particlePositions[i * 3] = Math.cos(a) * r;
    particlePositions[i * 3 + 1] = Math.sin(a) * r * 0.64;
    particlePositions[i * 3 + 2] = z;

    const color = i % 13 === 0 ? amber : i % 7 === 0 ? blue : i % 5 === 0 ? ivory : mint;
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  universeParticles = new THREE.Points(
    particleGeometry,
    registerAmbient(new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }), 0.5)
  );
  universeGroup.add(universeParticles);
}

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

  // signal cubes enter the forward field from random angles rather than tracing tracks.
  const signalTexture = makeSignalTexture();
  const signalCount = SIGNAL_COUNT;
  for (let i = 0; i < signalCount; i++) {
    const mat = registerAmbient(new THREE.SpriteMaterial({
      map: signalTexture,
      color: MINT,
      transparent: true,
      opacity: 0.92,
      depthTest: true,
      depthWrite: false,
    }), 0.92);
    const sprite = new THREE.Sprite(mat);
    sprite.renderOrder = 4;
    sprite.scale.setScalar(0.82);
    signalGroup.add(sprite);
    const signal = {
      sprite,
      mat,
      depthFade: 1,
      scale: 0.82,
    };
    resetSignal(signal, (SIGNAL_START_PHASE + i / signalCount) % 1);
    signalPulses.push(signal);
  }

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

  buildUniverseBackground();
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
let infoNode = null;
let hoveredRingItem = null;
let pointerRingItem = null;
let currentNode = null;
let moved = 0;
let lastDx = 0, lastDy = 0;

window.DTP = {
  state, camera, nodes, universeGroup, openSection, closeSection,
  get videoBackdrop() { return videoBackdropEl; },
  get hovered() { return hovered; },
  get infoNode() { return infoNode; },
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
  const ringItemAtPointer = findRingItemAt(e.clientX, e.clientY);
  pointerRingItem = ringItemAtPointer;
  setRingHovered(ringItemAtPointer);

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

function setInfoNode(node) {
  if (infoNode === node) return;
  infoNode = node;
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

function setRingHovered(item) {
  if (hoveredRingItem === item) return;
  hoveredRingItem = item;
  setInfoNode(hoveredRingItem?.node || null);
}

/* ---------------- equator ring nav (HTML projected into 3D) ---------------- */

const ringNav = document.getElementById('ringNav');
const ringEls = [];
const ringPickMeshes = [];
const ringPickGeo = new THREE.SphereGeometry(0.28, 12, 8);
const ringPickMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0,
  depthTest: false,
  depthWrite: false,
});

function findRingItemAt(x, y) {
  if (state.locked || menuOpen) return null;
  return ringEls.find(item => {
    if (!item.visible) return false;
    const r = item.el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }) || null;
}

function buildRingNav() {
  RING_ITEMS.forEach((item, i) => {
    const theta = arcTheta(i, RING_ITEMS.length, 0);
    const beltLat = i % 2 === 0 ? 0.075 : -0.075;
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
    const pick = new THREE.Mesh(ringPickGeo, ringPickMat);
    pick.userData.ringIndex = i;
    pick.visible = false;
    pick.position.copy(sph(1, theta, beltLat)).multiplyScalar(29.8);
    sphereGroup.add(pick);
    ringPickMeshes.push(pick);
    const ringItem = {
      el,
      anchor: sph(1, theta, beltLat),
      pick,
      node: item.id ? nodes.find(n => n.dest.id === item.id) : null,
      visible: false,
    };
    el.addEventListener('pointerenter', () => {
      if (state.locked || menuOpen || !ringItem.visible) return;
      pointerRingItem = ringItem;
      setRingHovered(ringItem);
    });
    el.addEventListener('pointerleave', () => {
      if (pointerRingItem === ringItem) pointerRingItem = null;
      if (hoveredRingItem === ringItem) setRingHovered(null);
    });
    ringEls.push(ringItem);
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
    const isInteractive = alpha > 0.4;
    item.el.style.opacity = alpha.toFixed(3);
    item.el.style.pointerEvents = isInteractive ? 'auto' : 'none';
    item.visible = isInteractive;
    item.pick.visible = isInteractive;
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
  setInfoNode(null);
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
  buildVideoBackdrop();
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

  nodesGroup.updateMatrixWorld(true);

  // signal cubes travelling through space past the viewer
  for (const signal of signalPulses) {
    signal.depthPhase += signal.speed * dt;
    if (signal.depthPhase >= 1) resetSignal(signal, signal.depthPhase % 1);

    const eased = signal.depthPhase * signal.depthPhase * (3 - 2 * signal.depthPhase);
    _p.set(
      signal.startX + (signal.endX - signal.startX) * eased + Math.sin(eased * Math.PI * 2) * signal.driftX,
      signal.startY + (signal.endY - signal.startY) * eased + Math.cos(eased * Math.PI * 2) * signal.driftY,
      signal.startZ + (signal.endZ - signal.startZ) * eased
    );

    signal.sprite.position.copy(_p);
    signal.sprite.scale.setScalar(signal.scale * (0.36 + eased * 1.55));
    signal.sprite.getWorldPosition(signalWorld);
    signalWorld.project(camera);
    signalNdc.set(signalWorld.x, signalWorld.y);
    const insideVisibleCard = Math.abs(signalNdc.x) <= 1 && Math.abs(signalNdc.y) <= 1
      && (() => {
        signalRaycaster.setFromCamera(signalNdc, camera);
        return signalRaycaster.intersectObjects(nodesGroup.children, false).length > 0;
      })();
    const targetFade = insideVisibleCard ? SIGNAL_REAR_FADE : 1;
    signal.depthFade += (targetFade - signal.depthFade) * 0.16 * dt;
    const pastCameraFade = 1 - Math.max(0, eased - 0.82) / 0.18;
    signal.mat.opacity = signal.mat.userData.base * ambientFade.v * signal.depthFade * pastCameraFade;
  }

  // video horizon — lags the orbit, counter-shifts against tilt, breathes
  if (videoBackdropMat) {
    videoBackdropGroup.rotation.y = state.curY * VIDEO_PARALLAX_ORBIT + t * 0.00005;
    videoBackdropGroup.position.x = tilt.cx * 1.5;
    videoBackdropGroup.position.y = VIDEO_BACKDROP_BASE_Y
      + state.curX * 7 - tilt.cy * 1.2 + Math.sin(t * 0.00021) * 0.8;
    videoBackdropMat.uniforms.uOpacity.value = videoFade.v * (0.3 + 0.7 * ambientFade.v);
  }

  // dust drift
  dustGroup.rotation.y += 0.00012 * dt;
  universeGroup.rotation.y += (0.00018 + tilt.cx * 0.00003) * dt;
  universeGroup.rotation.x += ((-0.08 + tilt.cy * 0.025) - universeGroup.rotation.x) * 0.018 * dt;
  if (universeParticles) {
    universeParticles.rotation.z -= 0.00065 * dt;
    universeParticles.rotation.y += 0.00038 * dt;
  }

  // hover raycast
  if (!state.locked) {
    raycaster.setFromCamera(mouseNdc, camera);
    const ringHits = raycaster.intersectObjects(ringPickMeshes, false);
    setRingHovered(pointerRingItem || (ringHits.length ? ringEls[ringHits[0].object.userData.ringIndex] : null));

    const hits = raycaster.intersectObjects(nodesGroup.children);
    hovered = hits.length ? hits[0].object.userData.node : null;
    if (hovered) canvas.classList.add('hovering');
    else if (!infoNode) canvas.classList.remove('hovering');
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
  universeGroup.scale.setScalar(window.innerWidth < 760 ? 3.6 : 5.2);
});
