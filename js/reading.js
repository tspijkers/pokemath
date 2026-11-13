// reading.js — Reading journeys: 5 regions × (4 stops of 5 words + a gym with all 20).
// Kindergarten words: Dolch pre-primer & primer sight words plus a few picture nouns.

// Maps are drawn in a 240×100 box. Each region's land is shaped like the real place it is based on
// (simplified): Kanto = Kantō, Johto = Kansai, Hoenn = Kyūshū, Sinnoh = Hokkaidō, Kalos = France.
const JOURNEYS = [
  {
    name: 'Kanto', color: '#22c55e', land: '#a6e08f', decor: '🌳', leader: 'Papa',
    badge: 'Fire Badge', shape: 'fire', badgeColor: '#f97316',
    stops: ['Sunny Path', 'Berry Woods', 'Pebble Bridge', 'Windy Hill'],
    outline: [[40, 12], [90, 6], [150, 8], [196, 10], [206, 30], [204, 46], [214, 60], [204, 66], [196, 80], [186, 92], [170, 96], [164, 84], [160, 70], [150, 62], [140, 64], [138, 76], [130, 90], [124, 80], [114, 80], [100, 80], [88, 78], [86, 92], [80, 98], [70, 94], [72, 80], [56, 74], [40, 68], [30, 50], [32, 28]],
    islands: [],
    lakes: [],
    nodes: [[56, 46], [94, 28], [132, 40], [176, 30], [184, 76]],
    decorAt: [[44, 26], [70, 60], [118, 20], [160, 22], [150, 50], [196, 52], [110, 62]],
    words: ['a', 'I', 'the', 'see', 'cat', 'can', 'go', 'is', 'dog', 'red', 'it', 'up', 'my', 'sun', 'big', 'we', 'to', 'and', 'run', 'one'],
  },
  {
    name: 'Johto', color: '#f97316', land: '#f4c98a', decor: '🍁', leader: 'Mama',
    badge: 'Water Badge', shape: 'water', badgeColor: '#0ea5e9',
    stops: ['Maple Trail', 'Lantern Lane', 'Lake Shore', 'Old Bridge'],
    outline: [[58, 14], [96, 8], [130, 12], [170, 6], [184, 20], [180, 42], [174, 58], [168, 72], [156, 86], [140, 96], [128, 88], [118, 74], [112, 60], [104, 52], [92, 50], [78, 48], [62, 46], [52, 32]],
    islands: [[[98, 62], [106, 58], [108, 70], [100, 74]]],
    lakes: [[150, 32, 6, 12]],
    nodes: [[70, 30], [104, 24], [128, 44], [166, 50], [148, 78]],
    decorAt: [[62, 20], [86, 40], [120, 18], [168, 22], [140, 60], [160, 64], [116, 34]],
    words: ['in', 'me', 'you', 'ball', 'look', 'two', 'here', 'said', 'car', 'not', 'down', 'blue', 'play', 'like', 'jump', 'little', 'yes', 'no', 'help', 'come'],
  },
  {
    name: 'Hoenn', color: '#0ea5e9', land: '#b7e889', decor: '🌴', leader: 'Opa',
    badge: 'Electric Badge', shape: 'electric', badgeColor: '#eab308',
    stops: ['Sandy Beach', 'Palm Grove', 'Coral Bay', 'Volcano Trail'],
    outline: [[96, 10], [116, 4], [140, 8], [152, 20], [158, 40], [158, 60], [150, 80], [140, 94], [132, 84], [130, 76], [124, 84], [120, 96], [108, 86], [106, 66], [96, 62], [86, 58], [78, 48], [88, 40], [82, 26], [90, 20]],
    islands: [[[170, 86], [178, 82], [182, 90], [174, 94]], [[60, 30], [66, 26], [70, 34], [62, 38]]],
    lakes: [],
    nodes: [[100, 24], [134, 18], [148, 46], [118, 54], [140, 70]],
    decorAt: [[118, 14], [92, 48], [146, 30], [130, 40], [112, 72], [150, 62], [104, 34]],
    words: ['he', 'she', 'hat', 'was', 'for', 'have', 'fish', 'they', 'this', 'eat', 'what', 'are', 'bed', 'all', 'at', 'yellow', 'on', 'three', 'under', 'make'],
  },
  {
    name: 'Sinnoh', color: '#6366f1', land: '#eef2f8', decor: '🌲', leader: 'Oma',
    badge: 'Rock Badge', shape: 'rock', badgeColor: '#a8956a',
    stops: ['Snowy Path', 'Pine Forest', 'Frozen Lake', 'Crystal Cave'],
    outline: [[140, 4], [152, 10], [168, 22], [186, 32], [204, 22], [200, 36], [212, 46], [222, 50], [210, 56], [190, 58], [172, 66], [156, 82], [148, 74], [136, 62], [124, 64], [112, 74], [104, 88], [94, 96], [88, 86], [98, 72], [104, 58], [98, 46], [108, 40], [120, 30], [130, 14]],
    islands: [],
    lakes: [],
    nodes: [[114, 48], [140, 24], [168, 38], [196, 48], [152, 62]],
    decorAt: [[128, 34], [150, 44], [180, 46], [136, 54], [104, 78], [160, 28], [120, 60]],
    words: ['do', 'did', 'get', 'ride', 'saw', 'so', 'be', 'brown', 'but', 'out', 'there', 'four', 'with', 'went', 'want', 'good', 'new', 'now', 'away', 'find'],
  },
  {
    name: 'Kalos', color: '#ec4899', land: '#cdeaa6', decor: '🌸', leader: 'Lucy',
    badge: 'Psychic Badge', shape: 'psychic', badgeColor: '#a855f7',
    stops: ['Flower Field', 'Castle Road', 'Rainbow Bridge', 'Starry Hill'],
    outline: [[118, 4], [134, 10], [152, 18], [168, 26], [162, 40], [160, 52], [168, 68], [158, 84], [140, 82], [130, 88], [118, 94], [100, 90], [102, 74], [100, 62], [92, 50], [78, 44], [64, 40], [70, 32], [88, 30], [96, 22], [106, 18]],
    islands: [[[178, 78], [184, 76], [186, 90], [180, 94]]],
    lakes: [],
    nodes: [[76, 38], [110, 26], [140, 34], [126, 60], [148, 74]],
    decorAt: [[124, 16], [96, 40], [150, 50], [112, 76], [134, 46], [90, 60], [156, 30]],
    words: ['where', 'who', 'white', 'that', 'into', 'our', 'funny', 'please', 'pretty', 'ran', 'black', 'ate', 'came', 'must', 'soon', 'too', 'well', 'will', 'am', 'say'],
  },
];
// Pictures that look alike are never shown together.
const PIC_CONFLICTS = [['big', 'little'], ['up', 'down'], ['yellow', 'sun'], ['yellow', 'funny'], ['brown', 'under'], ['brown', 'in']];

// ---------- pictures (original simple drawings, viewBox 0 0 100 100) ----------
const SK = `stroke="${OL}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const LIMB = `fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
const splash = (col) => {
  let s = '';
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; s += `<circle cx="${50 + Math.cos(a) * 28}" cy="${52 + Math.sin(a) * 28}" r="${9 + (i % 3) * 2}" fill="${col}" ${SK}/>`; }
  return s + `<circle cx="50" cy="52" r="30" fill="${col}" ${SK}/><circle cx="40" cy="42" r="6" fill="#fff" opacity=".35"/>`;
};
const dots = (n) => {
  const pos = { 1: [[50, 50]], 2: [[32, 50], [68, 50]], 3: [[22, 50], [50, 50], [78, 50]], 4: [[34, 34], [66, 34], [34, 66], [66, 66]] }[n];
  return pos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#a855f7" ${SK}/>`).join('');
};
const kidHead = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#f9d4b4" ${SK}/>`;
const greenApple = (x, y, r = 12) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#7ed957" ${SK}/><path d="M${x} ${y - r} q2 -7 6 -8" ${LIMB.replace('5', '3')}/>`;

const PIC = {
  cat: `<path d="M26 44 L28 16 L46 32 Z" fill="#f2a04a" ${SK}/><path d="M74 44 L72 16 L54 32 Z" fill="#f2a04a" ${SK}/>
    <circle cx="50" cy="56" r="29" fill="#f2a04a" ${SK}/><ellipse cx="40" cy="50" rx="3.5" ry="5" fill="${OL}"/><ellipse cx="60" cy="50" rx="3.5" ry="5" fill="${OL}"/>
    <path d="M46 60 L54 60 L50 65 Z" fill="#f28aa0" ${SK}/><path d="M50 65 Q45 71 41 67 M50 65 Q55 71 59 67" fill="none" ${SK}/>
    <path d="M30 60 L14 57 M30 65 L14 68 M70 60 L86 57 M70 65 L86 68" ${SK}/>`,
  dog: `<ellipse cx="24" cy="50" rx="10" ry="20" fill="#5a5a6a" ${SK}/><ellipse cx="76" cy="50" rx="10" ry="20" fill="#5a5a6a" ${SK}/>
    <circle cx="50" cy="52" r="27" fill="#ecdcc4" ${SK}/><ellipse cx="50" cy="66" rx="15" ry="11" fill="#fff6e8" ${SK}/>
    <ellipse cx="40" cy="46" rx="3.5" ry="5" fill="${OL}"/><ellipse cx="60" cy="46" rx="3.5" ry="5" fill="${OL}"/>
    <ellipse cx="50" cy="60" rx="6" ry="4.5" fill="${OL}"/><path d="M46 72 Q50 82 54 72 Z" fill="#f28aa0" ${SK}/>`,
  sun: Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${50 + Math.cos(a) * 30} ${50 + Math.sin(a) * 30} L${50 + Math.cos(a) * 44} ${50 + Math.sin(a) * 44}" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>`; }).join('') +
    `<circle cx="50" cy="50" r="23" fill="#ffd43b" ${SK}/><circle cx="42" cy="47" r="3" fill="${OL}"/><circle cx="58" cy="47" r="3" fill="${OL}"/><path d="M42 57 Q50 64 58 57" fill="none" ${SK}/>`,
  red: splash('#ef4444'), blue: splash('#3b82f6'), yellow: splash('#facc15'),
  brown: splash('#8b5a2b'), white: splash('#ffffff'), black: splash('#222233'),
  one: dots(1), two: dots(2), three: dots(3), four: dots(4),
  big: `<ellipse cx="58" cy="56" rx="30" ry="22" fill="#a8b0c0" ${SK}/>
    ${[38, 50, 66, 78].map((x) => `<rect x="${x - 5}" y="66" width="10" height="20" rx="3" fill="#a8b0c0" ${SK}/>`).join('')}
    <path d="M22 50 Q8 62 14 82" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M22 50 Q8 62 14 82" fill="none" stroke="#a8b0c0" stroke-width="7" stroke-linecap="round"/>
    <circle cx="28" cy="42" r="16" fill="#a8b0c0" ${SK}/><ellipse cx="38" cy="42" rx="9" ry="13" fill="#c8cfdc" ${SK}/><circle cx="24" cy="38" r="2.5" fill="${OL}"/>`,
  little: `<path d="M8 80 L92 80" stroke="#b5c4a0" stroke-width="4" stroke-linecap="round"/>
    <path d="M60 74 Q72 68 76 76" fill="none" ${SK}/><ellipse cx="54" cy="74" rx="9" ry="6" fill="#a8b0c0" ${SK}/>
    <circle cx="45" cy="71" r="5" fill="#a8b0c0" ${SK}/><circle cx="44" cy="65" r="3" fill="#f6b8c6" ${SK}/><circle cx="43" cy="71" r="1.2" fill="${OL}"/>`,
  up: `<path d="M50 10 L82 46 L63 46 L63 90 L37 90 L37 46 L18 46 Z" fill="#22c55e" ${SK}/>`,
  down: `<path d="M50 90 L82 54 L63 54 L63 10 L37 10 L37 54 L18 54 Z" fill="#22c55e" ${SK}/>`,
  run: `${kidHead(60, 20)}<path d="M58 30 L48 56 M55 38 L70 46 M55 38 L40 34 M48 56 L64 68 L72 84 M48 56 L36 70 L22 68" ${LIMB}/>
    <path d="M10 34 L24 34 M6 48 L20 48 M12 62 L24 62" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>`,
  jump: `${kidHead(50, 18)}<path d="M50 27 L50 52 M50 33 L34 18 M50 33 L66 18 M50 52 L40 62 L44 72 M50 52 L60 62 L56 72" ${LIMB}/>
    <path d="M14 92 L86 92" stroke="#b5c4a0" stroke-width="4" stroke-linecap="round"/><path d="M38 80 L36 86 M50 80 L50 87 M62 80 L64 86" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>`,
  ride: `<circle cx="26" cy="72" r="15" fill="none" stroke="${OL}" stroke-width="4"/><circle cx="74" cy="72" r="15" fill="none" stroke="${OL}" stroke-width="4"/>
    <path d="M26 72 L44 50 L66 50 L74 72 M44 50 L52 72 L66 50 M64 50 L62 40 L70 40" fill="none" stroke="#14b8a6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${kidHead(46, 16)}<path d="M46 25 L44 46 M45 32 L64 40 M44 46 L54 60 L52 72" ${LIMB}/>`,
  ball: `<circle cx="50" cy="50" r="34" fill="#fff" ${SK}/><path d="M50 16 Q30 50 50 84" fill="none" stroke="#f97316" stroke-width="8"/><path d="M50 16 Q70 50 50 84" fill="none" stroke="#14b8a6" stroke-width="8"/>
    <path d="M18 40 Q50 52 82 40" fill="none" stroke="#a855f7" stroke-width="7"/><circle cx="50" cy="50" r="34" fill="none" ${SK}/>`,
  car: `<path d="M12 64 L12 50 Q14 44 22 44 L32 44 L42 30 L66 30 L76 44 L86 46 Q90 48 90 54 L90 64 Z" fill="#22c55e" ${SK}/>
    <path d="M36 44 L45 34 L54 34 L54 44 Z M58 44 L58 34 L64 34 L71 44 Z" fill="#dff3ff" ${SK}/>
    <circle cx="30" cy="66" r="10" fill="#333" ${SK}/><circle cx="72" cy="66" r="10" fill="#333" ${SK}/><circle cx="30" cy="66" r="4" fill="#ccc"/><circle cx="72" cy="66" r="4" fill="#ccc"/>`,
  yes: `<circle cx="50" cy="50" r="38" fill="#22c55e" ${SK}/><path d="M30 52 L44 66 L72 36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
  no: `<circle cx="50" cy="50" r="38" fill="#6b7280" ${SK}/><path d="M34 34 L66 66 M66 34 L34 66" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`,
  eat: `<path d="M44 20 Q48 26 44 32 M56 20 Q60 26 56 32" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 50 L86 50 Q84 84 50 84 Q16 84 14 50 Z" fill="#14b8a6" ${SK}/><path d="M18 50 Q30 40 42 48 Q54 38 66 48 Q76 40 82 50 Z" fill="#fde68a" ${SK}/>
    <path d="M72 18 L60 44" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M72 18 L60 44" stroke="#d1d5db" stroke-width="4" stroke-linecap="round"/>`,
  hat: `<ellipse cx="50" cy="74" rx="40" ry="10" fill="#7c3aed" ${SK}/><path d="M28 74 L30 26 Q50 20 70 26 L72 74 Z" fill="#7c3aed" ${SK}/>
    <path d="M29 62 L71 62 L71 70 L29 70 Z" fill="#f472b6" ${SK}/>`,
  bed: `<rect x="10" y="30" width="12" height="54" rx="3" fill="#c08a4a" ${SK}/><rect x="78" y="52" width="12" height="32" rx="3" fill="#c08a4a" ${SK}/>
    <rect x="20" y="56" width="62" height="16" rx="4" fill="#fff" ${SK}/><ellipse cx="34" cy="52" rx="12" ry="7" fill="#fff" ${SK}/>
    <path d="M44 48 L80 48 L80 72 L44 72 Z" fill="#a855f7" ${SK}/>`,
  fish: `<path d="M70 50 L92 32 L88 50 L92 68 Z" fill="#f97316" ${SK}/><ellipse cx="46" cy="50" rx="30" ry="20" fill="#fb923c" ${SK}/>
    <path d="M42 32 Q50 22 58 32" fill="#f97316" ${SK}/><circle cx="30" cy="46" r="4" fill="${OL}"/><path d="M50 40 Q56 50 50 60" fill="none" ${SK}/>`,
  under: `<rect x="14" y="30" width="72" height="9" rx="2" fill="#c08a4a" ${SK}/><path d="M20 39 L20 86 M80 39 L80 86" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M20 39 L20 86 M80 39 L80 86" stroke="#c08a4a" stroke-width="4" stroke-linecap="round"/>
    ${greenApple(50, 74, 12)}`,
  in: `${greenApple(50, 42, 14)}<path d="M18 46 L82 46 L78 88 L22 88 Z" fill="#e8c38a" ${SK}/><path d="M18 46 L8 34 M82 46 L92 34" ${SK}/>`,
  funny: `<circle cx="50" cy="50" r="36" fill="#fdba74" ${SK}/><path d="M32 42 Q38 34 44 42 M56 42 Q62 34 68 42" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 54 Q50 82 70 54 Z" fill="#9f1239" ${SK}/><path d="M38 64 Q50 72 62 64 Q56 74 50 74 Q44 74 38 64 Z" fill="#fb7185"/>
    <path d="M22 44 Q18 52 24 56" fill="#7dd3fc" ${SK}/>`,
};
const hasPic = (w) => !!PIC[w];
const picSVG = (w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="picture">${PIC[w]}</svg>`;

function badgeSVG(shape, color, size = '') {
  const light = shade(color, 22), dark = shade(color, -18);
  let body = '';
  if (shape === 'fire') body = `<path d="M50 6 C60 26 80 34 78 60 A28 28 0 0 1 22 60 C20 44 32 36 34 22 C40 32 44 34 46 38 C48 26 46 16 50 6 Z" fill="${color}" ${SK}/><path d="M50 46 C56 56 64 60 62 72 A12 12 0 0 1 38 72 C38 62 46 58 50 46 Z" fill="#fde047" ${SK}/>`;
  else if (shape === 'water') body = `<path d="M50 6 C66 32 82 48 82 64 A32 32 0 0 1 18 64 C18 48 34 32 50 6 Z" fill="${color}" ${SK}/><path d="M30 66 Q40 56 50 66 Q60 76 70 66" fill="none" stroke="${light}" stroke-width="5" stroke-linecap="round"/>`;
  else if (shape === 'electric') body = `<path d="M58 4 L22 54 L46 54 L36 96 L78 40 L54 40 Z" fill="${color}" ${SK}/><path d="M54 16 L34 48" stroke="${light}" stroke-width="4" stroke-linecap="round"/>`;
  else if (shape === 'rock') body = `<path d="M20 70 L14 44 L30 22 L58 12 L80 26 L90 52 L80 80 L52 90 L30 86 Z" fill="${color}" ${SK}/><path d="M40 30 L50 48 L44 64 M62 44 L74 56 M30 60 L40 70" fill="none" stroke="${dark}" stroke-width="3.5" stroke-linecap="round"/>`;
  else {
    let d = '';
    for (let t = 0; t <= Math.PI * 4.2; t += 0.2) { const r = 4 + t * 2.6, x = 50 + Math.cos(t) * r, y = 50 + Math.sin(t) * r; d += (d ? ' L' : 'M') + `${x.toFixed(1)} ${y.toFixed(1)}`; }
    body = `<circle cx="50" cy="50" r="42" fill="${color}" ${SK}/><path d="${d}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  }
  return `<svg class="badge-svg ${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${body}<ellipse cx="36" cy="30" rx="8" ry="5" fill="#fff" opacity=".45" transform="rotate(-30 36 30)"/></svg>`;
}

// The young adventurer who walks the reading journey (an original character).
function heroSVG() {
  const skin = '#f9d9bd', hair = '#f6d158', hairD = '#d9a92e';
  return `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Adventurer">
    <ellipse cx="100" cy="192" rx="44" ry="7" fill="rgba(0,0,0,.14)"/>
    <rect x="58" y="96" width="30" height="50" rx="10" fill="#c2410c" ${S}/>
    <rect x="80" y="148" width="16" height="32" rx="6" fill="${skin}" ${S}/><rect x="104" y="148" width="16" height="32" rx="6" fill="${skin}" ${S}/>
    <path d="M76 178 L98 178 L98 190 L72 190 Q72 182 76 178 Z" fill="#16a34a" ${S}/><path d="M102 178 L124 178 Q128 182 128 190 L102 190 Z" fill="#16a34a" ${S}/>
    <path d="M74 140 L126 140 L128 162 L72 162 Z" fill="#a16207" ${S}/>
    <rect x="68" y="96" width="64" height="54" rx="20" fill="#14b8a6" ${S}/>
    <path d="M100 100 L100 146" stroke="#0f766e" stroke-width="3"/>
    <rect x="54" y="102" width="16" height="40" rx="8" fill="#14b8a6" ${S}/><rect x="130" y="102" width="16" height="40" rx="8" fill="#14b8a6" ${S}/>
    <circle cx="62" cy="146" r="8" fill="${skin}" ${S}/><circle cx="138" cy="146" r="8" fill="${skin}" ${S}/>
    <path d="M76 100 L84 140 M124 100 L116 140" stroke="#c2410c" stroke-width="6" stroke-linecap="round"/>
    <path d="M66 56 Q60 74 70 84 L72 66 Z M134 56 Q140 74 130 84 L128 66 Z" fill="${hair}" ${S}/>
    <circle cx="100" cy="68" r="31" fill="${skin}" ${S}/>
    <path d="M70 60 L76 72 L82 62 L88 74 L94 62 L100 72 L106 62 L112 74 L118 62 L124 72 L130 60 Q100 44 70 60 Z" fill="${hair}" ${S}/>
    <path d="M66 54 Q100 18 134 54 Q100 46 66 54 Z" fill="#fb923c" ${S}/><path d="M96 52 L150 56 Q146 64 100 62 Z" fill="#fb923c" ${S}/>
    <circle cx="100" cy="36" r="6" fill="#fff" ${S}/>
    <path d="M70 52 L64 46 M72 48 L70 40" stroke="${hairD}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="88" cy="74" rx="4.5" ry="6" fill="${OL}"/><ellipse cx="112" cy="74" rx="4.5" ry="6" fill="${OL}"/>
    <circle cx="86.5" cy="72" r="1.8" fill="#fff"/><circle cx="110.5" cy="72" r="1.8" fill="#fff"/>
    <circle cx="80" cy="84" r="5" fill="#ff7a8a" opacity=".45"/><circle cx="120" cy="84" r="5" fill="#ff7a8a" opacity=".45"/>
    <path d="M90 88 Q100 97 110 88" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

// Smooth closed outline through points (for coastlines)
function smoothClosed(pts) {
  const n = pts.length;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d + ' Z';
}
function regionMapSVG(J) {
  const waves = [[20, 20], [24, 80], [214, 16], [226, 84], [60, 92], [190, 30]].map(([x, y]) => `<path d="M${x - 6} ${y} q3 -3 6 0 t6 0" fill="none" stroke="#ffffff" stroke-width=".8" opacity=".7" stroke-linecap="round"/>`).join('');
  const route = J.nodes.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return `<svg class="map-svg" viewBox="0 0 240 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="100" fill="#7cc4f2"/>${waves}
    <path d="${smoothClosed(J.outline)}" fill="#e9dcb2" transform="translate(0 1.4)"/>
    <path d="${smoothClosed(J.outline)}" fill="${J.land}" stroke="#4b7a3a" stroke-width=".7"/>
    ${J.islands.map((pts) => `<path d="${smoothClosed(pts)}" fill="${J.land}" stroke="#4b7a3a" stroke-width=".7"/>`).join('')}
    ${J.lakes.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#7cc4f2" stroke="#4b7a3a" stroke-width=".6"/>`).join('')}
    <path d="${route}" fill="none" stroke="#7a5a2a" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>
    <path d="${route}" fill="none" stroke="#fff8e7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.1 6.5"/>
    <path d="${route}" fill="none" stroke="#fff8e7" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ---------- save ----------
function ensureReading() {
  if (!save.reading) save.reading = { stops: [0, 0, 0, 0, 0], badges: [false, false, false, false, false] };
  return save.reading;
}
const journeyUnlocked = (i) => i === 0 || save.reading.badges[i - 1];
const currentJourney = () => { const r = ensureReading(); const i = r.badges.findIndex((b) => !b); return i < 0 ? 4 : i; };
const badgeCount = () => (save && save.reading ? save.reading.badges.filter(Boolean).length : 0);
let readingView = null;

// ---------- map ----------
const pctX = (x) => (x / 240) * 100;
function screenReading(r) {
  ensureReading();
  if (r === undefined || r === null) r = readingView ?? currentJourney();
  if (!journeyUnlocked(r)) r = currentJourney();
  readingView = r;
  const J = JOURNEYS[r], done = save.reading.stops[r], badge = save.reading.badges[r];
  const state = (i) => {
    if (i < 4) return i < done ? 'done' : i === done ? 'next' : 'locked';
    return badge ? 'done' : done >= 4 ? 'next' : 'locked';
  };
  const buddyAt = badge ? 4 : Math.min(done, 4);
  const info = badge ? `🏅 You earned the ${J.badge}! ${r < 4 ? `Next: ${JOURNEYS[r + 1].name}!` : 'You finished every journey!'}`
    : done >= 4 ? `Gym Leader ${J.leader} is waiting! Read all 20 words to win the ${J.badge}.`
    : `Next stop: <b>${J.stops[done]}</b> — 5 new words`;
  show(`
    <div class="screen reading">
      <header class="topbar">
        <button class="home-btn" data-go="menu" aria-label="Menu">🏠</button>
        <div class="topbar-title">Reading Journey</div>
        <div class="badge-row">${JOURNEYS.map((j, i) => `<span class="badge-slot${save.reading.badges[i] ? ' got' : ''}">${save.reading.badges[i] ? badgeSVG(j.shape, j.badgeColor) : ''}</span>`).join('')}</div>
      </header>
      <div class="region-tabs">
        ${JOURNEYS.map((j, i) => `<button class="region-tab${i === r ? ' on' : ''}" data-r="${i}" style="--rc:${j.color}" ${journeyUnlocked(i) ? '' : 'disabled'}>${journeyUnlocked(i) ? '' : '🔒 '}${j.name}</button>`).join('')}
      </div>
      <div class="map card" style="--rc:${J.color}">
        ${regionMapSVG(J)}
        ${J.decorAt.map(([x, y]) => `<span class="map-decor" style="left:${pctX(x)}%;top:${y}%">${J.decor}</span>`).join('')}
        ${J.nodes.map(([x, y], i) => {
          const st = state(i), gym = i === 4;
          const label = gym ? `${J.name} Gym` : J.stops[i];
          const icon = gym ? (st === 'done' ? badgeSVG(J.shape, J.badgeColor) : '🏟️') : st === 'done' ? '⭐' : st === 'locked' ? '🔒' : i + 1;
          return `<button class="map-node ${st}${gym ? ' gym' : ''}" data-i="${i}" style="left:${pctX(x)}%;top:${y}%" ${st === 'locked' ? 'disabled' : ''}>
            <span class="node-icon">${icon}</span><span class="node-label">${label}</span></button>`;
        }).join('')}
        <div class="map-buddy sprite bob" style="left:${pctX(J.nodes[buddyAt][0])}%;top:${J.nodes[buddyAt][1]}%">${heroSVG()}</div>
      </div>
      <div class="map-info card">${info}</div>
    </div>`);
  $('.region-tabs').addEventListener('click', (e) => { const t = e.target.closest('.region-tab'); if (t && !t.disabled) { Sound.tap(); screenReading(+t.dataset.r); } });
  $('.map').addEventListener('click', (e) => {
    const n = e.target.closest('.map-node');
    if (!n || n.disabled) return;
    Sound.tap();
    const i = +n.dataset.i;
    if (i === 4) screenGym(r); else screenStop(r, i);
  });
}

// ---------- shared helpers ----------
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const conflicts = (a, b) => PIC_CONFLICTS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const sayWord = (w) => speak(w);
function wordsUpTo(r) { return JOURNEYS.slice(0, r + 1).flatMap((j) => j.words); }
const readTop = (title) => `<header class="topbar"><button class="home-btn" data-go="reading" aria-label="Map">🗺️</button><div class="topbar-title">${title}</div><div class="topbar-spacer"></div></header>`;
const wordBig = (w) => `<div class="read-word">${w}</div>`;

function pickWordOptions(target, pool) {
  const others = shuffle(pool.filter((w) => w !== target && w.toLowerCase() !== target.toLowerCase()));
  const close = others.filter((w) => w[0].toLowerCase() === target[0].toLowerCase() || Math.abs(w.length - target.length) <= 1);
  const picks = [...new Set([...close.slice(0, 1), ...others])].slice(0, 2);
  return shuffle([target, ...picks]);
}
function pickPicOptions(target, pool) {
  const cands = shuffle([...new Set([...pool, ...Object.keys(PIC)])].filter((w) => hasPic(w) && w !== target && !conflicts(w, target)));
  const picks = [];
  for (const w of cands) { if (picks.length === 2) break; if (!picks.some((p) => conflicts(p, w))) picks.push(w); }
  return shuffle([target, ...picks]);
}

// Learn new words: one card each, read aloud.
function learnWords(panel, words, tok) {
  return new Promise((resolve) => {
    let i = 0;
    const draw = () => {
      const w = words[i];
      panel.innerHTML = `
        <div class="learn">
          <div class="quiz-head"><div class="quiz-title">New word ${i + 1} of ${words.length}</div>
            <div class="dots">${words.map((_, k) => `<span class="dot${k < i ? ' done' : k === i ? ' current' : ''}"></span>`).join('')}</div></div>
          ${wordBig(w)}
          ${hasPic(w) ? `<div class="learn-pic">${picSVG(w)}</div>` : ''}
          <div class="btn-row"><button class="btn blue big" id="hear">🔊 Hear it</button><button class="btn green big" id="nextw">${i < words.length - 1 ? 'Next ▶' : "Let's read! ▶"}</button></div>
        </div>`;
      sayWord(w);
      $('#hear', panel).onclick = () => { Sound.tap(); sayWord(w); };
      $('#nextw', panel).onclick = () => {
        Sound.tap();
        if (!alive(tok)) return;
        if (++i >= words.length) resolve(); else draw();
      };
    };
    draw();
  });
}

// Quiz: every word must be read correctly. Missed words come back once more at the end.
function wordQuiz(panel, words, pool, title, tok, onProgress) {
  return new Promise((resolve) => {
    const queue = shuffle(words), repeated = new Set();
    let doneCount = 0, mistakes = 0;
    const next = () => {
      if (!alive(tok)) return;
      if (!queue.length) { resolve(mistakes); return; }
      const w = queue.shift();
      const type = hasPic(w) && Math.random() < 0.65 ? 'pic' : 'listen';
      const opts = type === 'pic' ? pickPicOptions(w, pool) : pickWordOptions(w, pool);
      let missed = false;
      panel.innerHTML = `
        <div class="rq">
          <div class="quiz-head"><div class="quiz-title">${title}</div><div class="rq-count">${doneCount} / ${words.length} ✓</div></div>
          ${type === 'pic'
            ? `<div class="rq-prompt">Read the word. Tap its picture!</div>${wordBig(w)}`
            : `<div class="rq-prompt">Listen, then tap the word!</div><button class="btn blue big rq-listen">🔊 Hear it</button>`}
          <div class="rq-options ${type}">
            ${opts.map((o) => `<button class="rq-opt" data-w="${o}">${type === 'pic' ? picSVG(o) : o}</button>`).join('')}
          </div>
          <div class="feedback">&nbsp;</div>
        </div>`;
      if (type === 'listen') { sayWord(w); $('.rq-listen', panel).onclick = () => { Sound.tap(); sayWord(w); }; }
      const box = $('.rq', panel), fb = $('.feedback', panel);
      $('.rq-options', panel).addEventListener('click', (e) => {
        const b = e.target.closest('.rq-opt');
        if (!b || b.disabled || box.dataset.busy) return;
        if (b.dataset.w === w) {
          box.dataset.busy = '1';
          Sound.correct();
          b.classList.add('right');
          fb.textContent = pick(PRAISE); fb.className = 'feedback good';
          if (type === 'listen') sayWord(w);
          if (missed && !repeated.has(w)) { repeated.add(w); queue.push(w); }
          else { doneCount++; onProgress && onProgress(doneCount); }
          setTimeout(next, 900);
        } else {
          missed = true; mistakes++;
          Sound.wrong();
          b.disabled = true; b.classList.add('wrong');
          fb.textContent = 'Not quite — try again!'; fb.className = 'feedback bad';
          box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
        }
      });
    };
    next();
  });
}

// ---------- a stop on the journey ----------
async function screenStop(r, s) {
  const J = JOURNEYS[r], words = J.words.slice(s * 5, s * 5 + 5);
  const tok = show(`
    <div class="screen read-stop">
      ${readTop(`${J.name} · ${J.stops[s]}`)}
      <div class="split">
        <div class="stage"><div class="sprite stage-sprite bob">${heroSVG()}</div></div>
        <div class="panel card"></div>
      </div>
    </div>`);
  const panel = $('.panel');
  await learnWords(panel, words, tok);
  if (!alive(tok)) return;
  await wordQuiz(panel, words, wordsUpTo(r), `${J.stops[s]}`, tok);
  if (!alive(tok)) return;
  const first = save.reading.stops[r] === s;
  save.reading.stops[r] = Math.max(save.reading.stops[r], s + 1);
  persist();
  Sound.levelUp();
  confetti();
  $('.stage-sprite').classList.add('jump');
  const gymNext = s === 3;
  panel.innerHTML = `
    <div class="center-msg">
      <div class="big-emoji">⭐</div>
      <h2>You read all 5 words!</h2>
      <p>${first ? (gymNext ? `Next up: the ${J.name} Gym!` : `On to ${J.stops[s + 1]}!`) : 'Great practice!'}</p>
      <div class="word-chips">${words.map((w) => `<span class="word-chip">${w}</span>`).join('')}</div>
      <div class="btn-row"><button class="btn green big" data-go="reading">Continue journey 🗺️</button></div>
    </div>`;
}

// ---------- the gym ----------
async function screenGym(r) {
  const J = JOURNEYS[r];
  const tok = show(`
    <div class="screen read-gym">
      ${readTop(`${J.name} Gym`)}
      <div class="split">
        <div class="stage gym-stage">
          <div class="sprite gym-leader bob">${trainerSVG(J.leader)}</div>
          <div class="gym-meter"><div class="gym-meter-fill" style="width:0%"></div><span>0 / 20</span></div>
        </div>
        <div class="panel card"></div>
      </div>
    </div>`);
  const panel = $('.panel');
  panel.innerHTML = `
    <div class="center-msg">
      <div class="gym-badge-preview">${badgeSVG(J.shape, J.badgeColor)}</div>
      <h2>Gym Leader ${J.leader}${TRAINER_STYLE[J.leader] === 'dog' ? ' 🐾' : ''}</h2>
      <p>Read all 20 ${J.name} words to win the <b>${J.badge}</b>!</p>
      <div class="btn-row"><button class="btn grey" data-go="reading">Not yet</button><button class="btn green big" id="go">I'm ready!</button></div>
    </div>`;
  await new Promise((res) => ($('#go').onclick = () => { Sound.tap(); res(); }));
  if (!alive(tok)) return;
  const meter = $('.gym-meter-fill'), meterTxt = $('.gym-meter span');
  await wordQuiz(panel, J.words, wordsUpTo(r), `Gym challenge`, tok, (n) => {
    meter.style.width = `${(n / J.words.length) * 100}%`;
    meterTxt.textContent = `${n} / ${J.words.length}`;
  });
  if (!alive(tok)) return;
  const first = !save.reading.badges[r];
  save.reading.badges[r] = true;
  persist();
  Sound.win();
  confetti();
  setTimeout(confetti, 900);
  panel.innerHTML = `
    <div class="center-msg">
      <div class="badge-win">${badgeSVG(J.shape, J.badgeColor)}</div>
      <h2>You won the ${J.badge}!</h2>
      <p>${first ? (r < 4 ? `Amazing reading! The road to ${JOURNEYS[r + 1].name} is open.` : 'You finished every journey. You are a Reading Champion!') : 'You read every word again. Super!'}</p>
      <div class="btn-row"><button class="btn grey" data-go="menu">Home</button><button class="btn green big" id="onward">${first && r < 4 ? `Go to ${JOURNEYS[r + 1].name} ▶` : 'Back to the map 🗺️'}</button></div>
    </div>`;
  $('#onward').onclick = () => { Sound.tap(); screenReading(first && r < 4 ? r + 1 : r); };
}
