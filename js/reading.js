// reading.js — Reading journeys: 5 regions × (4 stops of 5 words + a gym with all 20).
// Kindergarten words: Dolch pre-primer & primer sight words plus a few picture nouns.

// Maps are drawn in a 240×100 box. Each region's land is shaped like the real place it is based on
// (simplified): Kanto = Kantō, Johto = Kansai, Hoenn = Kyūshū, Sinnoh = Hokkaidō, Kalos = France.
const JOURNEYS = [
  {
    name: 'Kanto', color: '#22c55e', land: '#a6e08f', decor: '🌳', leader: 'Uncle Kev',
    badge: 'Fire Badge', shape: 'fire', badgeColor: '#f97316',
    stops: ['Sunny Path', 'Berry Woods', 'Pebble Bridge', 'Windy Hill'],
    outline: [[40, 12], [90, 6], [150, 8], [196, 10], [206, 30], [204, 46], [214, 60], [204, 66], [196, 80], [186, 92], [170, 96], [164, 84], [160, 70], [150, 62], [140, 64], [138, 76], [130, 90], [124, 80], [114, 80], [100, 80], [88, 78], [86, 92], [80, 98], [70, 94], [72, 80], [56, 74], [40, 68], [30, 50], [32, 28]],
    islands: [],
    lakes: [],
    nodes: [[56, 46], [94, 28], [132, 40], [176, 30], [184, 76]],
    decorAt: [[44, 26], [70, 60], [118, 20], [160, 22], [150, 50], [196, 52], [110, 62]],
    words: ['cat', 'bat', 'hat', 'mat', 'sat', 'tap', 'cap', 'map', 'nap', 'fan', 'can', 'pan', 'man', 'van', 'ran', 'bag', 'tag', 'wag', 'jam', 'dam'],
  },
  {
    name: 'Johto', color: '#f97316', land: '#f4c98a', decor: '🍁', leader: 'Aunt Carina',
    badge: 'Water Badge', shape: 'water', badgeColor: '#0ea5e9',
    stops: ['Maple Trail', 'Lantern Lane', 'Lake Shore', 'Old Bridge'],
    outline: [[58, 14], [96, 8], [130, 12], [170, 6], [184, 20], [180, 42], [174, 58], [168, 72], [156, 86], [140, 96], [128, 88], [118, 74], [112, 60], [104, 52], [92, 50], [78, 48], [62, 46], [52, 32]],
    islands: [[[98, 62], [106, 58], [108, 70], [100, 74]]],
    lakes: [[150, 32, 6, 12]],
    nodes: [[70, 30], [104, 24], [128, 44], [166, 50], [148, 78]],
    decorAt: [[62, 20], [86, 40], [120, 18], [168, 22], [140, 60], [160, 64], [116, 34]],
    words: ['bed', 'red', 'fed', 'led', 'leg', 'peg', 'beg', 'wet', 'net', 'pet', 'set', 'met', 'get', 'jet', 'let', 'pen', 'hen', 'ten', 'men', 'den'],
  },
  {
    name: 'Hoenn', color: '#0ea5e9', land: '#b7e889', decor: '🌴', leader: 'Uncle Dreis',
    badge: 'Electric Badge', shape: 'electric', badgeColor: '#eab308',
    stops: ['Sandy Beach', 'Palm Grove', 'Coral Bay', 'Volcano Trail'],
    outline: [[96, 10], [116, 4], [140, 8], [152, 20], [158, 40], [158, 60], [150, 80], [140, 94], [132, 84], [130, 76], [124, 84], [120, 96], [108, 86], [106, 66], [96, 62], [86, 58], [78, 48], [88, 40], [82, 26], [90, 20]],
    islands: [[[170, 86], [178, 82], [182, 90], [174, 94]], [[60, 30], [66, 26], [70, 34], [62, 38]]],
    lakes: [],
    nodes: [[100, 24], [134, 18], [148, 46], [118, 54], [140, 70]],
    decorAt: [[118, 14], [92, 48], [146, 30], [130, 40], [112, 72], [150, 62], [104, 34]],
    words: ['bit', 'hit', 'fit', 'sit', 'pit', 'lit', 'pin', 'win', 'bin', 'din', 'fin', 'tin', 'zip', 'tip', 'lip', 'rip', 'hip', 'nip', 'gig', 'wig'],
  },
  {
    name: 'Sinnoh', color: '#6366f1', land: '#eef2f8', decor: '🌲', leader: 'Aunt Mary Claire',
    badge: 'Rock Badge', shape: 'rock', badgeColor: '#a8956a',
    stops: ['Snowy Path', 'Pine Forest', 'Frozen Lake', 'Crystal Cave'],
    outline: [[140, 4], [152, 10], [168, 22], [186, 32], [204, 22], [200, 36], [212, 46], [222, 50], [210, 56], [190, 58], [172, 66], [156, 82], [148, 74], [136, 62], [124, 64], [112, 74], [104, 88], [94, 96], [88, 86], [98, 72], [104, 58], [98, 46], [108, 40], [120, 30], [130, 14]],
    islands: [],
    lakes: [],
    nodes: [[114, 48], [140, 24], [168, 38], [196, 48], [152, 62]],
    decorAt: [[128, 34], [150, 44], [180, 46], [136, 54], [104, 78], [160, 28], [120, 60]],
    words: ['hop', 'pot', 'hot', 'rot', 'not', 'dot', 'got', 'cot', 'top', 'mop', 'pop', 'log', 'dog', 'fog', 'jog', 'cob', 'rob', 'sob', 'bob', 'mob'],
  },
  {
    name: 'Kalos', color: '#ec4899', land: '#cdeaa6', decor: '🌸', leader: 'Aunt Olivia',
    badge: 'Psychic Badge', shape: 'psychic', badgeColor: '#a855f7',
    stops: ['Flower Field', 'Castle Road', 'Rainbow Bridge', 'Starry Hill'],
    outline: [[118, 4], [134, 10], [152, 18], [168, 26], [162, 40], [160, 52], [168, 68], [158, 84], [140, 82], [130, 88], [118, 94], [100, 90], [102, 74], [100, 62], [92, 50], [78, 44], [64, 40], [70, 32], [88, 30], [96, 22], [106, 18]],
    islands: [[[178, 78], [184, 76], [186, 90], [180, 94]]],
    lakes: [],
    nodes: [[76, 38], [110, 26], [140, 34], [126, 60], [148, 74]],
    decorAt: [[124, 16], [96, 40], [150, 50], [112, 76], [134, 46], [90, 60], [156, 30]],
    words: ['bug', 'hug', 'mug', 'jug', 'rug', 'run', 'fun', 'bun', 'sun', 'cup', 'tub', 'hub', 'nut', 'hut', 'mut', 'cut', 'bus', 'gum', 'hum', 'mud'],
  },
];
// Pictures that could be mixed up are never shown together.
const PIC_CONFLICTS = [['mat', 'rug'], ['cup', 'mug'], ['cup', 'jug'], ['mug', 'jug'], ['van', 'bus'], ['cap', 'hat'], ['nap', 'bed'], ['pot', 'pan'], ['win', 'cup'], ['win', 'mug'], ['can', 'jam']];

// ---------- pictures (original simple drawings, viewBox 0 0 100 100) ----------
const SK = `stroke="${OL}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const LIMB = `fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
const SKIN = '#f9d4b4';
const kidHead = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}" ${SK}/>`;
const person = (x, s = 1, shirt = '#3b82f6') => {
  const X = (v) => x + v * s, Y = (v) => 100 - (100 - v) * s;
  return `<path d="M${X(-6)} ${Y(66)} L${X(-7)} ${Y(92)} M${X(6)} ${Y(66)} L${X(7)} ${Y(92)}" ${LIMB}/>
    <rect x="${X(-13)}" y="${Y(34)}" width="${26 * s}" height="${34 * s}" rx="${8 * s}" fill="${shirt}" ${SK}/>
    <path d="M${X(-13)} ${Y(40)} L${X(-20)} ${Y(62)} M${X(13)} ${Y(40)} L${X(20)} ${Y(62)}" ${LIMB}/>
    <circle cx="${X(0)}" cy="${Y(22)}" r="${11 * s}" fill="${SKIN}" ${SK}/><path d="M${X(-11)} ${Y(20)} Q${X(0)} ${Y(4)} ${X(11)} ${Y(20)} Z" fill="#6b4423" ${SK}/>`;
};
const dotsGrid = (n) => {
  const pos = n === 10 ? [...Array(10)].map((_, i) => [18 + (i % 5) * 16, i < 5 ? 38 : 62]) : [[50, 50]];
  return pos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${n === 10 ? 7 : 26}" fill="#a855f7" ${SK}/>`).join('');
};
const steam = (x, y) => `<path d="M${x - 6} ${y} q4 -6 0 -12 M${x + 6} ${y} q4 -6 0 -12" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>`;

const PIC = {
  // ---- Kanto ----
  cat: `<path d="M26 44 L28 16 L46 32 Z" fill="#f2a04a" ${SK}/><path d="M74 44 L72 16 L54 32 Z" fill="#f2a04a" ${SK}/>
    <circle cx="50" cy="56" r="29" fill="#f2a04a" ${SK}/><ellipse cx="40" cy="50" rx="3.5" ry="5" fill="${OL}"/><ellipse cx="60" cy="50" rx="3.5" ry="5" fill="${OL}"/>
    <path d="M46 60 L54 60 L50 65 Z" fill="#f28aa0" ${SK}/><path d="M50 65 Q45 71 41 67 M50 65 Q55 71 59 67" fill="none" ${SK}/>
    <path d="M30 60 L14 57 M30 65 L14 68 M70 60 L86 57 M70 65 L86 68" ${SK}/>`,
  bat: `<path d="M44 46 L30 30 L22 40 L10 34 L14 52 L6 58 L22 62 L30 56 L44 60 Z" fill="#5b4a7a" ${SK}/><path d="M56 46 L70 30 L78 40 L90 34 L86 52 L94 58 L78 62 L70 56 L56 60 Z" fill="#5b4a7a" ${SK}/>
    <path d="M42 36 L44 24 L50 32 L56 24 L58 36 Z" fill="#5b4a7a" ${SK}/><ellipse cx="50" cy="52" rx="12" ry="18" fill="#5b4a7a" ${SK}/>
    <circle cx="45" cy="44" r="3" fill="#fff"/><circle cx="55" cy="44" r="3" fill="#fff"/><path d="M46 54 L48 58 L50 54 L52 58 L54 54" fill="none" stroke="#fff" stroke-width="2"/>`,
  hat: `<ellipse cx="50" cy="74" rx="40" ry="10" fill="#7c3aed" ${SK}/><path d="M28 74 L30 26 Q50 20 70 26 L72 74 Z" fill="#7c3aed" ${SK}/><path d="M29 62 L71 62 L71 70 L29 70 Z" fill="#f472b6" ${SK}/>`,
  mat: `<rect x="12" y="34" width="76" height="40" rx="4" fill="#14b8a6" ${SK}/><path d="M24 34 L24 74 M38 34 L38 74 M62 34 L62 74 M76 34 L76 74" stroke="#99f6e4" stroke-width="5"/>
    <path d="M12 40 L4 40 M12 48 L4 48 M12 56 L4 56 M12 64 L4 64 M88 40 L96 40 M88 48 L96 48 M88 56 L96 56 M88 64 L96 64" ${SK}/>`,
  tap: `<rect x="6" y="20" width="12" height="40" rx="3" fill="#cbd5e1" ${SK}/><path d="M18 30 L56 30 Q70 30 70 44 L70 52 L58 52 L58 44 Q58 42 56 42 L18 42 Z" fill="#cbd5e1" ${SK}/>
    <rect x="34" y="16" width="16" height="14" rx="3" fill="#94a3b8" ${SK}/><rect x="26" y="12" width="32" height="7" rx="3" fill="#94a3b8" ${SK}/>
    <path d="M64 60 Q70 70 64 76 Q58 70 64 60 Z M64 82 Q68 88 64 92 Q60 88 64 82 Z" fill="#38bdf8" ${SK}/>`,
  cap: `<path d="M18 62 Q18 26 52 26 Q80 26 80 62 Z" fill="#3b82f6" ${SK}/><path d="M80 62 L96 66 Q96 72 80 72 L18 70 L18 62 Z" fill="#1d4ed8" ${SK}/>
    <circle cx="50" cy="26" r="4" fill="#1d4ed8" ${SK}/><path d="M50 30 L50 62 M34 32 Q30 46 30 62 M66 32 Q70 46 70 62" fill="none" stroke="#1d4ed8" stroke-width="2.5"/>`,
  map: `<path d="M10 24 L36 16 L64 24 L90 16 L90 78 L64 86 L36 78 L10 86 Z" fill="#fef3c7" ${SK}/><path d="M36 16 L36 78 M64 24 L64 86" ${SK}/>
    <path d="M18 36 Q28 30 30 42 Q26 52 18 48 Z M70 40 Q82 36 82 50 Q74 60 68 52 Z" fill="#86efac" ${SK}/>
    <path d="M22 66 Q40 56 52 64 T74 64" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/><path d="M72 58 L80 68 M80 58 L72 68" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>`,
  nap: `<rect x="10" y="62" width="80" height="20" rx="6" fill="#bfdbfe" ${SK}/><ellipse cx="30" cy="58" rx="16" ry="8" fill="#fff" ${SK}/>
    ${kidHead(32, 50, 12)}<path d="M26 50 Q28 53 30 50 M35 50 Q37 53 39 50" fill="none" ${SK}/><path d="M40 60 L86 60 L86 74 L40 74 Z" fill="#f59e0b" ${SK}/>
    <text x="56" y="38" font-size="16" font-weight="900" fill="#6366f1" font-family="system-ui">z</text><text x="66" y="26" font-size="20" font-weight="900" fill="#6366f1" font-family="system-ui">Z</text>`,
  fan: `<path d="M50 62 L50 84" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M50 62 L50 84" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/><ellipse cx="50" cy="88" rx="22" ry="6" fill="#94a3b8" ${SK}/>
    <circle cx="50" cy="38" r="28" fill="#e0f2fe" ${SK}/>
    ${[0, 120, 240].map((a) => `<ellipse cx="50" cy="24" rx="7" ry="13" fill="#38bdf8" ${SK} transform="rotate(${a} 50 38)"/>`).join('')}<circle cx="50" cy="38" r="5" fill="#64748b" ${SK}/>`,
  can: `<rect x="28" y="22" width="44" height="60" rx="4" fill="#cbd5e1" ${SK}/><ellipse cx="50" cy="22" rx="22" ry="6" fill="#e2e8f0" ${SK}/>
    <rect x="28" y="38" width="44" height="28" fill="#22c55e" ${SK}/><path d="M28 30 L72 30 M28 74 L72 74" stroke="#94a3b8" stroke-width="2"/>`,
  pan: `<path d="M64 52 L94 40" stroke="${OL}" stroke-width="11" stroke-linecap="round"/><path d="M64 52 L94 40" stroke="#57534e" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="38" cy="58" rx="32" ry="16" fill="#44403c" ${SK}/><ellipse cx="38" cy="55" rx="26" ry="11" fill="#78716c"/><ellipse cx="34" cy="54" rx="8" ry="5" fill="#fde047" ${SK}/><ellipse cx="34" cy="54" rx="3" ry="2" fill="#f97316"/>`,
  man: person(50, 1, '#3b82f6'),
  van: `<path d="M8 68 L8 30 Q8 24 14 24 L66 24 Q74 24 78 32 L90 48 L92 68 Z" fill="#f97316" ${SK}/>
    <path d="M66 30 L74 30 L84 46 L66 46 Z" fill="#dff3ff" ${SK}/><rect x="16" y="30" width="18" height="14" rx="2" fill="#dff3ff" ${SK}/><rect x="40" y="30" width="18" height="14" rx="2" fill="#dff3ff" ${SK}/>
    <circle cx="26" cy="70" r="10" fill="#333" ${SK}/><circle cx="74" cy="70" r="10" fill="#333" ${SK}/><circle cx="26" cy="70" r="4" fill="#ccc"/><circle cx="74" cy="70" r="4" fill="#ccc"/>`,
  bag: `<path d="M36 36 Q36 16 50 16 Q64 16 64 36" fill="none" stroke="${OL}" stroke-width="5"/><path d="M20 36 L80 36 L86 88 L14 88 Z" fill="#f472b6" ${SK}/><path d="M40 36 L40 44 M60 36 L60 44" ${SK}/>`,
  tag: `<path d="M30 24 L84 24 L84 76 L30 76 L10 50 Z" fill="#fde047" ${SK}/><circle cx="26" cy="50" r="5" fill="#fff" ${SK}/>
    <path d="M26 50 Q14 30 4 30" fill="none" stroke="#ef4444" stroke-width="3"/><path d="M44 40 L74 40 M44 52 L74 52 M44 64 L62 64" stroke="#a16207" stroke-width="4" stroke-linecap="round"/>`,
  jam: `<rect x="26" y="14" width="48" height="14" rx="4" fill="#facc15" ${SK}/><path d="M24 28 L76 28 L76 82 Q76 88 70 88 L30 88 Q24 88 24 82 Z" fill="#be185d" ${SK}/>
    <rect x="30" y="46" width="40" height="24" rx="3" fill="#fff" ${SK}/><circle cx="42" cy="58" r="5" fill="#be185d"/><circle cx="56" cy="56" r="4" fill="#be185d"/><path d="M50 50 L52 46" stroke="#22c55e" stroke-width="3"/>`,
  // ---- Johto ----
  bed: `<rect x="10" y="30" width="12" height="54" rx="3" fill="#c08a4a" ${SK}/><rect x="78" y="52" width="12" height="32" rx="3" fill="#c08a4a" ${SK}/>
    <rect x="20" y="56" width="62" height="16" rx="4" fill="#fff" ${SK}/><ellipse cx="34" cy="52" rx="12" ry="7" fill="#fff" ${SK}/><path d="M44 48 L80 48 L80 72 L44 72 Z" fill="#a855f7" ${SK}/>`,
  red: (() => { let s = ''; for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; s += `<circle cx="${50 + Math.cos(a) * 28}" cy="${52 + Math.sin(a) * 28}" r="${9 + (i % 3) * 2}" fill="#ef4444" ${SK}/>`; } return s + `<circle cx="50" cy="52" r="30" fill="#ef4444" ${SK}/><circle cx="40" cy="42" r="6" fill="#fff" opacity=".35"/>`; })(),
  leg: `<path d="M44 6 L42 40 Q40 52 48 62 L50 74" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="M44 6 L42 40 Q40 52 48 62 L50 74" fill="none" stroke="${SKIN}" stroke-width="16" stroke-linecap="round"/>
    <path d="M38 70 L58 70 L60 80 L86 82 Q90 92 80 92 L38 92 Z" fill="#ef4444" ${SK}/>`,
  peg: `<path d="M40 10 L50 10 L54 90 L44 90 Z" fill="#d6a46a" ${SK}/><path d="M50 10 L60 10 L56 90 L46 90 Z" fill="#c08a4a" ${SK}/>
    <circle cx="50" cy="52" r="7" fill="#cbd5e1" ${SK}/><path d="M44 52 L56 52" stroke="#64748b" stroke-width="2"/>`,
  net: `<path d="M20 90 L50 50" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M20 90 L50 50" stroke="#c08a4a" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 50 Q58 82 80 70 Q88 54 74 30" fill="#ecfeff" fill-opacity=".8" ${SK}/>
    <path d="M56 58 L76 40 M60 68 L80 50 M64 44 L74 66 M70 38 L80 60" stroke="#94a3b8" stroke-width="1.5"/><ellipse cx="64" cy="38" rx="16" ry="12" fill="none" stroke="#64748b" stroke-width="4" transform="rotate(-35 64 38)"/>`,
  jet: `<path d="M50 6 Q56 12 56 26 L56 40 L90 58 L90 66 L56 56 L56 76 L68 86 L68 92 L50 86 L32 92 L32 86 L44 76 L44 56 L10 66 L10 58 L44 40 L44 26 Q44 12 50 6 Z" fill="#e2e8f0" ${SK}/>
    <path d="M47 16 Q50 12 53 16 L53 22 L47 22 Z" fill="#38bdf8"/>`,
  pen: `<path d="M24 82 L18 90 L28 86 Z" fill="${OL}"/><path d="M28 86 L18 76 L70 24 L80 34 Z" fill="#3b82f6" ${SK}/><path d="M70 24 L78 16 Q84 14 86 20 Q86 24 80 34 Z" fill="#1d4ed8" ${SK}/><path d="M24 80 L20 76" stroke="#fff" stroke-width="2"/>`,
  hen: `<path d="M74 40 L92 30 L88 54 Z" fill="#f2f2f2" ${SK}/><ellipse cx="54" cy="58" rx="28" ry="22" fill="#fafafa" ${SK}/>
    <circle cx="30" cy="38" r="14" fill="#fafafa" ${SK}/><path d="M24 24 Q26 18 30 24 Q32 16 36 24 Z" fill="#ef4444" ${SK}/><path d="M16 38 L8 42 L16 44 Z" fill="#f59e0b" ${SK}/>
    <path d="M24 46 Q22 54 27 52" fill="#ef4444" ${SK}/><circle cx="28" cy="35" r="2.5" fill="${OL}"/><path d="M44 58 Q56 50 66 60" fill="none" ${SK}/>
    <path d="M48 78 L46 92 M60 78 L62 92 M42 92 L50 92 M58 92 L66 92" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>`,
  ten: dotsGrid(10),
  men: person(32, 0.8, '#22c55e') + person(68, 0.95, '#3b82f6'),
  // ---- Hoenn ----
  sit: `<path d="M56 50 L80 50 L80 90 M56 50 L56 90 M80 50 L80 14" ${LIMB}/>
    ${kidHead(66, 18)}<path d="M66 27 L66 48 L46 50 L46 72 M66 34 L52 40" ${LIMB}/><path d="M40 72 L48 72" ${LIMB}/>`,
  lit: `<rect x="38" y="44" width="24" height="46" rx="3" fill="#fef3c7" ${SK}/><path d="M50 44 L50 36" stroke="${OL}" stroke-width="3"/>
    <path d="M50 8 C62 22 60 34 50 36 C40 34 38 22 50 8 Z" fill="#f97316" ${SK}/><path d="M50 20 C55 27 54 32 50 33 C46 32 45 27 50 20 Z" fill="#fde047"/>`,
  pin: `<path d="M50 62 L50 92" stroke="#64748b" stroke-width="4" stroke-linecap="round"/><path d="M28 62 L72 62 L64 50 L36 50 Z" fill="#ef4444" ${SK}/>
    <rect x="40" y="22" width="20" height="28" rx="2" fill="#ef4444" ${SK}/><ellipse cx="50" cy="20" rx="16" ry="7" fill="#ef4444" ${SK}/>`,
  win: `<path d="M30 16 L70 16 L68 44 Q66 60 50 62 Q34 60 32 44 Z" fill="#facc15" ${SK}/><path d="M30 22 Q14 22 16 34 Q18 46 32 44 M70 22 Q86 22 84 34 Q82 46 68 44" fill="none" stroke="${OL}" stroke-width="4"/>
    <rect x="44" y="62" width="12" height="14" fill="#facc15" ${SK}/><rect x="30" y="76" width="40" height="12" rx="2" fill="#a16207" ${SK}/><path d="M50 26 L53 33 L60 33 L54 38 L56 45 L50 41 L44 45 L46 38 L40 33 L47 33 Z" fill="#fff"/>`,
  bin: `<path d="M22 32 L78 32 L72 90 L28 90 Z" fill="#64748b" ${SK}/><rect x="16" y="22" width="68" height="10" rx="3" fill="#475569" ${SK}/><rect x="42" y="14" width="16" height="8" rx="2" fill="#475569" ${SK}/>
    <path d="M38 42 L40 82 M50 42 L50 82 M62 42 L60 82" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>`,
  fin: `<rect x="0" y="62" width="100" height="38" fill="#7dd3fc"/><path d="M30 66 Q48 40 58 14 Q64 40 78 66 Z" fill="#64748b" ${SK}/>
    <path d="M0 66 Q12 58 24 66 T48 66 T72 66 T100 66" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>`,
  zip: `<rect x="30" y="6" width="40" height="88" rx="4" fill="#fb923c" ${SK}/>
    ${[...Array(9)].map((_, i) => `<rect x="${i % 2 ? 50 : 44}" y="${10 + i * 7}" width="6" height="4" fill="#cbd5e1" stroke="${OL}" stroke-width="1"/>`).join('')}
    <path d="M50 74 L50 92" stroke="${OL}" stroke-width="2"/><rect x="42" y="72" width="16" height="12" rx="2" fill="#94a3b8" ${SK}/><rect x="45" y="84" width="10" height="12" rx="3" fill="#94a3b8" ${SK}/>`,
  lip: `<path d="M10 50 Q30 26 50 40 Q70 26 90 50 Q70 54 50 52 Q30 54 10 50 Z" fill="#f43f5e" ${SK}/><path d="M10 50 Q30 82 50 76 Q70 82 90 50 Q70 56 50 56 Q30 56 10 50 Z" fill="#fb7185" ${SK}/>`,
  rip: `<path d="M14 14 L46 14 L40 26 L50 36 L42 48 L52 58 L44 72 L50 88 L14 88 Z" fill="#fff" ${SK}/><path d="M58 18 L86 12 L90 84 L60 90 L54 74 L62 60 L52 50 L60 40 L50 30 L58 18 Z" fill="#fff" ${SK}/>
    <path d="M22 30 L36 30 M22 42 L34 42 M22 54 L36 54 M64 34 L80 34 M66 48 L82 48 M66 62 L82 62" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>`,
  wig: `<path d="M34 92 L66 92 L60 70 L40 70 Z" fill="#d6d3d1" ${SK}/>
    ${[[30, 40], [40, 28], [54, 24], [68, 30], [74, 44], [76, 60], [24, 56], [28, 70], [72, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#f472b6" ${SK}/>`).join('')}
    <ellipse cx="50" cy="56" rx="16" ry="18" fill="#e7e5e4" ${SK}/>`,
  // ---- Sinnoh ----
  hop: `<path d="M8 84 Q22 50 40 80 M52 80 Q66 46 84 76" fill="none" stroke="#9ca3af" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/>
    <ellipse cx="62" cy="58" rx="16" ry="12" fill="#f5f5f4" ${SK}/><ellipse cx="74" cy="24" rx="5" ry="14" fill="#f5f5f4" ${SK} transform="rotate(15 74 24)"/><ellipse cx="84" cy="26" rx="5" ry="14" fill="#f5f5f4" ${SK} transform="rotate(35 84 26)"/>
    <circle cx="78" cy="44" r="12" fill="#f5f5f4" ${SK}/><circle cx="81" cy="42" r="2" fill="${OL}"/><circle cx="88" cy="47" r="2" fill="#f472b6"/><circle cx="46" cy="56" r="5" fill="#fff" ${SK}/>`,
  pot: `<ellipse cx="50" cy="34" rx="34" ry="8" fill="#94a3b8" ${SK}/><rect x="44" y="20" width="12" height="8" rx="3" fill="#64748b" ${SK}/>
    <path d="M18 40 L82 40 L78 84 Q76 90 70 90 L30 90 Q24 90 22 84 Z" fill="#64748b" ${SK}/><path d="M18 48 L8 48 M82 48 L92 48" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>${steam(50, 16)}`,
  hot: `<rect x="40" y="10" width="20" height="62" rx="10" fill="#fff" ${SK}/><circle cx="50" cy="78" r="16" fill="#ef4444" ${SK}/><rect x="46" y="22" width="8" height="52" rx="4" fill="#ef4444"/>
    <path d="M70 30 q6 6 0 12 q-6 6 0 12 M80 24 q6 6 0 12 q-6 6 0 12 M20 30 q6 6 0 12 q-6 6 0 12" fill="none" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>`,
  dot: dotsGrid(1),
  top: `<path d="M50 90 L50 80" stroke="${OL}" stroke-width="4" stroke-linecap="round"/><path d="M14 46 Q50 34 86 46 L50 82 Z" fill="#a855f7" ${SK}/><path d="M14 46 Q50 58 86 46" fill="none" stroke="#fde047" stroke-width="5"/>
    <ellipse cx="50" cy="44" rx="36" ry="9" fill="#c084fc" ${SK}/><rect x="45" y="18" width="10" height="26" rx="3" fill="#c08a4a" ${SK}/>
    <path d="M6 30 Q14 22 22 26 M78 22 Q88 20 94 28" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>`,
  mop: `<path d="M62 8 L44 62" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M62 8 L44 62" stroke="#c08a4a" stroke-width="5" stroke-linecap="round"/><rect x="32" y="58" width="26" height="10" rx="3" fill="#64748b" ${SK}/>
    ${[26, 32, 38, 44, 50, 56, 62].map((x, i) => `<path d="M${x + 8} 68 Q${x + 4} 80 ${x - 2 + (i % 2) * 6} 92" fill="none" stroke="#e5e7eb" stroke-width="6" stroke-linecap="round"/>`).join('')}`,
  pop: `${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M50 50 L${50 + Math.cos(a * Math.PI / 180) * 42} ${50 + Math.sin(a * Math.PI / 180) * 42}" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>`).join('')}
    <path d="M50 22 L58 40 L78 36 L64 50 L78 64 L58 60 L50 78 L42 60 L22 64 L36 50 L22 36 L42 40 Z" fill="#fb7185" ${SK}/><path d="M50 78 Q46 88 52 96" fill="none" ${SK}/>`,
  log: `<path d="M22 30 L80 30 Q92 50 80 70 L22 70 Z" fill="#a16207" ${SK}/><path d="M34 40 L60 40 M30 58 L70 58" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="22" cy="50" rx="12" ry="20" fill="#e8c38a" ${SK}/><ellipse cx="22" cy="50" rx="6" ry="11" fill="none" stroke="#a16207" stroke-width="2.5"/><ellipse cx="22" cy="50" rx="2" ry="4" fill="#a16207"/>`,
  dog: `<ellipse cx="24" cy="50" rx="10" ry="20" fill="#5a5a6a" ${SK}/><ellipse cx="76" cy="50" rx="10" ry="20" fill="#5a5a6a" ${SK}/>
    <circle cx="50" cy="52" r="27" fill="#ecdcc4" ${SK}/><ellipse cx="50" cy="66" rx="15" ry="11" fill="#fff6e8" ${SK}/>
    <ellipse cx="40" cy="46" rx="3.5" ry="5" fill="${OL}"/><ellipse cx="60" cy="46" rx="3.5" ry="5" fill="${OL}"/><ellipse cx="50" cy="60" rx="6" ry="4.5" fill="${OL}"/><path d="M46 72 Q50 82 54 72 Z" fill="#f28aa0" ${SK}/>`,
  fog: `<path d="M20 52 Q12 52 12 42 Q12 32 24 32 Q26 18 42 20 Q52 10 64 20 Q80 18 82 32 Q92 34 90 44 Q88 52 78 52 Z" fill="#e5e7eb" ${SK}/>
    <path d="M10 64 L70 64 M24 74 L90 74 M8 84 L60 84" stroke="#9ca3af" stroke-width="5" stroke-linecap="round"/>`,
  cob: `<path d="M50 90 Q28 70 30 40 Q34 20 50 10 Q66 20 70 40 Q72 70 50 90 Z" fill="#facc15" ${SK}/>
    ${[...Array(5)].map((_, r) => [...Array(3)].map((_, c) => `<circle cx="${42 + c * 8}" cy="${26 + r * 11}" r="3.2" fill="#eab308"/>`).join('')).join('')}
    <path d="M50 90 Q20 80 18 46 Q32 64 46 70 Z M50 90 Q80 80 82 46 Q68 64 54 70 Z" fill="#4ade80" ${SK}/>`,
  sob: `<circle cx="50" cy="50" r="36" fill="#fdba74" ${SK}/><path d="M34 40 Q38 46 44 40 M56 40 Q62 46 66 40" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>
    <path d="M36 70 Q50 58 64 70" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>
    <path d="M36 46 Q32 58 36 64 Q40 58 36 46 Z M64 46 Q60 58 64 64 Q68 58 64 46 Z" fill="#38bdf8" ${SK}/>`,
  // ---- Kalos ----
  bug: `<path d="M34 40 L18 30 M34 54 L14 56 M36 68 L20 80 M66 40 L82 30 M66 54 L86 56 M64 68 L80 80" ${SK}/>
    <ellipse cx="50" cy="58" rx="22" ry="28" fill="#22c55e" ${SK}/><path d="M50 30 L50 86" ${SK}/><circle cx="50" cy="28" r="12" fill="#166534" ${SK}/>
    <path d="M44 18 Q38 6 30 8 M56 18 Q62 6 70 8" fill="none" ${SK}/><circle cx="40" cy="54" r="5" fill="#166534"/><circle cx="60" cy="66" r="5" fill="#166534"/><circle cx="58" cy="46" r="4" fill="#166534"/>`,
  hug: `<circle cx="36" cy="30" r="12" fill="${SKIN}" ${SK}/><circle cx="64" cy="30" r="12" fill="#e8b48f" ${SK}/>
    <path d="M26 42 L24 88 L48 88 L48 46 Z" fill="#f472b6" ${SK}/><path d="M74 42 L76 88 L52 88 L52 46 Z" fill="#3b82f6" ${SK}/>
    <path d="M28 54 Q50 66 70 54 M72 60 Q50 72 30 60" ${LIMB}/><path d="M50 6 Q44 0 40 6 Q38 12 50 20 Q62 12 60 6 Q56 0 50 6 Z" fill="#ef4444" ${SK}/>`,
  mug: `<rect x="22" y="30" width="44" height="54" rx="6" fill="#3b82f6" ${SK}/><path d="M66 42 Q86 42 86 56 Q86 70 66 70" fill="none" stroke="${OL}" stroke-width="9"/><path d="M66 42 Q86 42 86 56 Q86 70 66 70" fill="none" stroke="#3b82f6" stroke-width="5"/>
    <ellipse cx="44" cy="32" rx="18" ry="4" fill="#78350f"/>${steam(44, 22)}`,
  jug: `<path d="M30 20 L66 20 L76 10 L80 18 L70 30 Q82 50 76 76 Q74 90 60 90 L36 90 Q22 90 20 76 Q14 50 30 30 Z" fill="#e0f2fe" ${SK}/>
    <path d="M24 46 Q50 52 74 46 L76 76 Q74 88 60 88 L36 88 Q22 88 22 76 Z" fill="#fb923c" opacity=".8"/><path d="M28 34 Q8 40 14 60 Q18 70 24 68" fill="none" stroke="${OL}" stroke-width="5"/>`,
  rug: `<ellipse cx="50" cy="56" rx="44" ry="28" fill="#dc2626" ${SK}/><ellipse cx="50" cy="56" rx="32" ry="19" fill="#fde047" ${SK}/><ellipse cx="50" cy="56" rx="18" ry="10" fill="#2563eb" ${SK}/>`,
  run: `${kidHead(60, 20)}<path d="M58 30 L48 56 M55 38 L70 46 M55 38 L40 34 M48 56 L64 68 L72 84 M48 56 L36 70 L22 68" ${LIMB}/>
    <path d="M10 34 L24 34 M6 48 L20 48 M12 62 L24 62" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>`,
  bun: `<path d="M12 64 Q12 26 50 26 Q88 26 88 64 Z" fill="#e3a052" ${SK}/><rect x="12" y="64" width="76" height="14" rx="6" fill="#f2c27a" ${SK}/>
    ${[[34, 40], [50, 34], [66, 40], [42, 52], [60, 50]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.8" fill="#fff7e0"/>`).join('')}`,
  sun: Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${50 + Math.cos(a) * 30} ${50 + Math.sin(a) * 30} L${50 + Math.cos(a) * 44} ${50 + Math.sin(a) * 44}" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>`; }).join('') +
    `<circle cx="50" cy="50" r="23" fill="#ffd43b" ${SK}/><circle cx="42" cy="47" r="3" fill="${OL}"/><circle cx="58" cy="47" r="3" fill="${OL}"/><path d="M42 57 Q50 64 58 57" fill="none" ${SK}/>`,
  cup: `<ellipse cx="46" cy="82" rx="36" ry="8" fill="#e0f2fe" ${SK}/><path d="M18 40 L74 40 Q72 76 46 78 Q20 76 18 40 Z" fill="#f472b6" ${SK}/>
    <path d="M73 48 Q90 48 86 60 Q82 70 68 66" fill="none" stroke="${OL}" stroke-width="5"/><ellipse cx="46" cy="40" rx="28" ry="5" fill="#fde68a" ${SK}/>`,
  tub: `<path d="M8 44 L92 44 L86 70 Q82 80 70 80 L30 80 Q18 80 14 70 Z" fill="#fff" ${SK}/><path d="M24 80 L20 92 M76 80 L80 92" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
    ${[[24, 40, 9], [38, 34, 11], [54, 38, 9], [68, 32, 10], [80, 40, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e0f2fe" ${SK}/>`).join('')}
    <path d="M86 44 L86 16 Q86 10 80 10 L72 10" fill="none" stroke="${OL}" stroke-width="5"/>`,
  nut: `<path d="M24 46 Q24 86 50 92 Q76 86 76 46 Z" fill="#c08a4a" ${SK}/><path d="M18 46 Q18 22 50 20 Q82 22 82 46 Z" fill="#78350f" ${SK}/>
    <path d="M50 20 L52 8" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M28 34 L72 34 M24 42 L76 42" stroke="#a16207" stroke-width="2"/>`,
  hut: `<path d="M20 52 L80 52 L80 90 L20 90 Z" fill="#e8c38a" ${SK}/><path d="M8 56 L50 14 L92 56 Z" fill="#facc15" ${SK}/>
    <path d="M22 44 L30 50 M38 30 L44 40 M58 28 L56 40 M74 40 L70 48" stroke="#ca8a04" stroke-width="3" stroke-linecap="round"/><path d="M42 90 L42 66 Q50 58 58 66 L58 90 Z" fill="#78350f" ${SK}/>`,
  cut: `<path d="M6 70 L94 70" stroke="#9ca3af" stroke-width="3" stroke-dasharray="6 5"/>
    <circle cx="24" cy="30" r="12" fill="none" stroke="#ef4444" stroke-width="6"/><circle cx="24" cy="58" r="12" fill="none" stroke="#ef4444" stroke-width="6"/>
    <path d="M34 36 L90 56 L86 60 L32 42 Z M34 52 L90 34 L86 30 L32 46 Z" fill="#cbd5e1" ${SK}/><circle cx="42" cy="44" r="3" fill="${OL}"/>`,
  bus: `<rect x="6" y="20" width="88" height="54" rx="8" fill="#facc15" ${SK}/>
    ${[14, 34, 54].map((x) => `<rect x="${x}" y="28" width="16" height="16" rx="2" fill="#dff3ff" ${SK}/>`).join('')}<rect x="74" y="28" width="14" height="36" rx="2" fill="#dff3ff" ${SK}/>
    <path d="M6 52 L74 52" stroke="${OL}" stroke-width="3"/><circle cx="26" cy="76" r="9" fill="#333" ${SK}/><circle cx="74" cy="76" r="9" fill="#333" ${SK}/>`,
  gum: `<rect x="30" y="68" width="40" height="22" rx="4" fill="#ef4444" ${SK}/><rect x="44" y="72" width="12" height="6" rx="2" fill="#94a3b8" ${SK}/>
    <circle cx="50" cy="40" r="30" fill="#e0f2fe" fill-opacity=".7" ${SK}/>
    ${[[38, 34, '#f472b6'], [56, 30, '#facc15'], [46, 50, '#22c55e'], [62, 46, '#3b82f6'], [36, 52, '#a855f7'], [50, 22, '#fb923c']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${SK}/>`).join('')}`,
  mud: `<path d="M8 72 Q10 56 30 58 Q40 46 58 54 Q78 46 90 62 Q96 76 82 82 Q50 92 20 84 Q6 82 8 72 Z" fill="#78350f" ${SK}/>
    <ellipse cx="40" cy="68" rx="8" ry="3" fill="#a16207"/><ellipse cx="64" cy="66" rx="6" ry="2.5" fill="#a16207"/>
    <circle cx="26" cy="40" r="5" fill="#78350f" ${SK}/><circle cx="74" cy="34" r="6" fill="#78350f" ${SK}/><circle cx="54" cy="30" r="4" fill="#78350f" ${SK}/>`,
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
        <div class="home-left"><button class="home-btn" data-go="menu" aria-label="Menu">🏠</button><h1 class="logo small">Poke<span>Read</span></h1></div>
        <div style="flex:1"></div>
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

const ALL_WORDS = JOURNEYS.flatMap((j) => j.words);
const rime = (w) => w.slice(-2);
const journeyOf = (w) => JOURNEYS.findIndex((j) => j.words.includes(w));
// Order candidates: same word family (cat/bat/hat) first, then same journey, then the rest.
function rankByFamily(target, cands) {
  const score = (w) => (rime(w) === rime(target) ? 0 : journeyOf(w) === journeyOf(target) ? 1 : 2);
  return shuffle(cands).sort((x, y) => score(x) - score(y));
}
function pickWordOptions(target, pool) {
  const ranked = rankByFamily(target, pool.filter((w) => w !== target));
  return shuffle([target, ...ranked.slice(0, 2)]);
}
// Picture choices: always 3 pictures of words from the game.
function pickPicOptions(target) {
  const ranked = rankByFamily(target, ALL_WORDS.filter((w) => hasPic(w) && w !== target && !conflicts(w, target)));
  const picks = [];
  for (const w of ranked) { if (picks.length === 2) break; if (!picks.some((p) => conflicts(p, w))) picks.push(w); }
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
      const opts = type === 'pic' ? pickPicOptions(w) : pickWordOptions(w, pool);
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
