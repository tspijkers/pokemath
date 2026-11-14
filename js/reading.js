// reading.js — Reading journeys: 12 regions × (4 stops of 6 words + a gym with all 24),
// plus a 3-round tournament after every 2 badges.
// Kindergarten words: Dolch pre-primer & primer sight words plus a few picture nouns.

// Maps are drawn in a 240×100 box. Each region's land is shaped like the real place it is based on
// (simplified): Kanto = Kantō, Johto = Kansai, Hoenn = Kyūshū, Sinnoh = Hokkaidō, Kalos = France,
// Unova = New York, Alola = Hawaiʻi, Galar = Great Britain, Paldea = Iberia, Hisui = old Hokkaidō,
// Kitakami = Tōhoku, Orre = Arizona (a desert region, so its map has sand around it instead of sea).
// Each region: 12 CVC words + 12 sight words. Stops get 3 of each (6 words); the gym tests all 24.
const HOKKAIDO = [[140, 4], [152, 10], [168, 22], [186, 32], [204, 22], [200, 36], [212, 46], [222, 50], [210, 56], [190, 58], [172, 66], [156, 82], [148, 74], [136, 62], [124, 64], [112, 74], [104, 88], [94, 96], [88, 86], [98, 72], [104, 58], [98, 46], [108, 40], [120, 30], [130, 14]];
const JOURNEYS = [
  {
    name: 'Kanto', color: '#22c55e', land: '#a6e08f', decor: '🌳', leader: 'Uncle Kev',
    badge: 'Fire Badge', shape: 'fire', badgeColor: '#f97316',
    stops: ['Sunny Path', 'Berry Woods', 'Pebble Bridge', 'Windy Hill'],
    outline: [[40, 12], [90, 6], [150, 8], [196, 10], [206, 30], [204, 46], [214, 60], [204, 66], [196, 80], [186, 92], [170, 96], [164, 84], [160, 70], [150, 62], [140, 64], [138, 76], [130, 90], [124, 80], [114, 80], [100, 80], [88, 78], [86, 92], [80, 98], [70, 94], [72, 80], [56, 74], [40, 68], [30, 50], [32, 28]],
    islands: [], lakes: [],
    nodes: [[56, 46], [94, 28], [132, 40], [176, 30], [184, 76]],
    decorAt: [[44, 26], [70, 60], [118, 20], [160, 22], [150, 50], [196, 52], [110, 62]],
    cvc: ['cat', 'bat', 'hat', 'mat', 'cap', 'map', 'nap', 'fan', 'can', 'pan', 'van', 'bag'],
    sight: ['I', 'a', 'the', 'see', 'go', 'is', 'it', 'up', 'my', 'me', 'we', 'to'],
  },
  {
    name: 'Johto', color: '#f97316', land: '#f4c98a', decor: '🍁', leader: 'Aunt Carina',
    badge: 'Water Badge', shape: 'water', badgeColor: '#0ea5e9',
    stops: ['Maple Trail', 'Lantern Lane', 'Lake Shore', 'Old Bridge'],
    outline: [[58, 14], [96, 8], [130, 12], [170, 6], [184, 20], [180, 42], [174, 58], [168, 72], [156, 86], [140, 96], [128, 88], [118, 74], [112, 60], [104, 52], [92, 50], [78, 48], [62, 46], [52, 32]],
    islands: [[[98, 62], [106, 58], [108, 70], [100, 74]]], lakes: [[150, 32, 6, 12]],
    nodes: [[70, 30], [104, 24], [128, 44], [166, 50], [148, 78]],
    decorAt: [[62, 20], [86, 40], [120, 18], [168, 22], [140, 60], [160, 64], [116, 34]],
    cvc: ['bed', 'red', 'leg', 'peg', 'net', 'pet', 'jet', 'wet', 'pen', 'hen', 'ten', 'men'],
    sight: ['and', 'you', 'in', 'look', 'here', 'said', 'play', 'like', 'jump', 'help', 'come', 'one'],
  },
  {
    name: 'Hoenn', color: '#0ea5e9', land: '#b7e889', decor: '🌴', leader: 'Uncle Dreis',
    badge: 'Electric Badge', shape: 'electric', badgeColor: '#eab308',
    stops: ['Sandy Beach', 'Palm Grove', 'Coral Bay', 'Volcano Trail'],
    outline: [[96, 10], [116, 4], [140, 8], [152, 20], [158, 40], [158, 60], [150, 80], [140, 94], [132, 84], [130, 76], [124, 84], [120, 96], [108, 86], [106, 66], [96, 62], [86, 58], [78, 48], [88, 40], [82, 26], [90, 20]],
    islands: [[[170, 86], [178, 82], [182, 90], [174, 94]], [[60, 30], [66, 26], [70, 34], [62, 38]]], lakes: [],
    nodes: [[100, 24], [134, 18], [148, 46], [118, 54], [140, 70]],
    decorAt: [[118, 14], [92, 48], [146, 30], [130, 40], [112, 72], [150, 62], [104, 34]],
    cvc: ['sit', 'lit', 'pin', 'win', 'bin', 'fin', 'zip', 'lip', 'rip', 'wig', 'hit', 'tip'],
    sight: ['two', 'three', 'down', 'find', 'for', 'funny', 'little', 'make', 'where', 'yellow', 'blue', 'away'],
  },
  {
    name: 'Sinnoh', color: '#6366f1', land: '#eef2f8', decor: '🌲', leader: 'Aunt Mary Claire',
    badge: 'Rock Badge', shape: 'rock', badgeColor: '#a8956a',
    stops: ['Snowy Path', 'Pine Forest', 'Frozen Lake', 'Crystal Cave'],
    outline: HOKKAIDO, islands: [], lakes: [],
    nodes: [[114, 48], [140, 24], [168, 38], [196, 48], [152, 62]],
    decorAt: [[128, 34], [150, 44], [180, 46], [136, 54], [104, 78], [160, 28], [120, 60]],
    cvc: ['hop', 'pot', 'hot', 'dot', 'top', 'mop', 'pop', 'log', 'dog', 'fog', 'cob', 'sob'],
    sight: ['he', 'she', 'was', 'are', 'all', 'at', 'be', 'do', 'eat', 'have', 'they', 'this'],
  },
  {
    name: 'Kalos', color: '#ec4899', land: '#cdeaa6', decor: '🌸', leader: 'Aunt Olivia',
    badge: 'Psychic Badge', shape: 'psychic', badgeColor: '#a855f7',
    stops: ['Flower Field', 'Castle Road', 'Rainbow Bridge', 'Starry Hill'],
    outline: [[118, 4], [134, 10], [152, 18], [168, 26], [162, 40], [160, 52], [168, 68], [158, 84], [140, 82], [130, 88], [118, 94], [100, 90], [102, 74], [100, 62], [92, 50], [78, 44], [64, 40], [70, 32], [88, 30], [96, 22], [106, 18]],
    islands: [[[178, 78], [184, 76], [186, 90], [180, 94]]], lakes: [],
    nodes: [[76, 38], [110, 26], [140, 34], [126, 60], [148, 74]],
    decorAt: [[124, 16], [96, 40], [150, 50], [112, 76], [134, 46], [90, 60], [156, 30]],
    cvc: ['bug', 'hug', 'mug', 'rug', 'bun', 'sun', 'cup', 'tub', 'nut', 'hut', 'bus', 'gum'],
    sight: ['what', 'on', 'no', 'now', 'out', 'so', 'saw', 'say', 'too', 'who', 'will', 'with'],
  },
  {
    name: 'Unova', color: '#475569', land: '#d6dbe3', decor: '🏙️', leader: 'Uncle Jason',
    badge: 'Dark Badge', shape: 'dark', badgeColor: '#374151',
    stops: ['City Park', 'Harbor Pier', 'Skyline Bridge', 'Night Market'],
    outline: [[-4, -4], [244, -4], [244, 30], [212, 36], [176, 38], [146, 40], [128, 44], [116, 40], [108, 50], [94, 54], [84, 62], [68, 70], [46, 76], [24, 84], [-4, 92]],
    islands: [
      [[104, 44], [112, 46], [104, 72], [96, 76], [94, 68]],
      [[122, 60], [150, 52], [196, 48], [236, 44], [238, 52], [204, 62], [164, 70], [128, 74], [118, 68]],
      [[62, 84], [74, 80], [78, 90], [68, 96]],
    ],
    lakes: [],
    nodes: [[40, 44], [102, 58], [150, 62], [206, 54], [150, 20]],
    decorAt: [[22, 22], [70, 30], [196, 18], [228, 20], [180, 58], [120, 24], [30, 62]],
    cvc: ['rat', 'ham', 'jam', 'dad', 'sad', 'tag', 'wag', 'lap', 'ram', 'wax', 'tap', 'man'],
    sight: ['am', 'ate', 'black', 'brown', 'but', 'came', 'did', 'four', 'good', 'into', 'must', 'new'],
  },
  {
    name: 'Alola', color: '#f43f5e', land: '#b8e986', decor: '🌺', leader: 'Uncle Eddy',
    badge: 'Fairy Badge', shape: 'fairy', badgeColor: '#f472b6',
    stops: ['Coral Beach', 'Volcano Path', 'Flower Garden', 'Rainbow Lagoon'],
    outline: [[182, 58], [206, 50], [228, 60], [224, 84], [202, 94], [184, 84]],
    islands: [
      [[18, 42], [38, 30], [56, 36], [58, 52], [44, 62], [24, 58]],
      [[76, 52], [96, 44], [114, 50], [108, 64], [88, 68]],
      [[128, 30], [156, 22], [178, 32], [172, 50], [148, 56], [132, 48]],
    ],
    lakes: [],
    nodes: [[38, 46], [96, 56], [142, 40], [166, 40], [204, 72]],
    decorAt: [[28, 50], [50, 44], [104, 56], [158, 46], [140, 30], [196, 62], [214, 80]],
    cvc: ['web', 'vet', 'gem', 'den', 'fed', 'beg', 'set', 'let', 'met', 'get', 'led', 'yes'],
    sight: ['our', 'please', 'pretty', 'ride', 'soon', 'that', 'there', 'under', 'want', 'well', 'went', 'white'],
  },
  {
    name: 'Galar', color: '#16a34a', land: '#b5df9a', decor: '🏰', leader: 'Aunt Desiree',
    badge: 'Grass Badge', shape: 'grass', badgeColor: '#22c55e',
    stops: ['Castle Gate', 'Green Meadow', 'Misty Moor', 'Highland Pass'],
    outline: [[120, 2], [138, 8], [146, 20], [140, 32], [146, 46], [150, 56], [162, 66], [154, 76], [158, 84], [150, 90], [120, 92], [100, 94], [86, 96], [96, 84], [108, 78], [102, 72], [90, 68], [94, 58], [104, 52], [110, 42], [98, 30], [108, 24], [100, 16], [104, 6]],
    islands: [[[56, 40], [76, 34], [84, 50], [78, 66], [60, 70], [50, 56]]],
    lakes: [],
    nodes: [[112, 86], [136, 72], [124, 56], [126, 36], [122, 12]],
    decorAt: [[118, 26], [134, 18], [108, 66], [144, 60], [128, 80], [66, 52], [100, 88]],
    cvc: ['pig', 'big', 'dig', 'kid', 'lid', 'bib', 'rib', 'six', 'mix', 'fix', 'him', 'kit'],
    sight: ['after', 'again', 'an', 'any', 'as', 'ask', 'by', 'fly', 'from', 'give', 'going', 'had'],
  },
  {
    name: 'Paldea', color: '#d97706', land: '#f2d98b', decor: '🌻', leader: 'Uncle Jimmy',
    badge: 'Ice Badge', shape: 'ice', badgeColor: '#38bdf8',
    stops: ['Olive Grove', 'Sunny Plaza', 'Windmill Hill', 'Desert Road'],
    outline: [[64, 12], [92, 8], [150, 8], [172, 18], [178, 30], [166, 48], [170, 62], [156, 76], [140, 86], [114, 92], [96, 88], [86, 76], [82, 58], [78, 40], [70, 26]],
    islands: [[[192, 48], [204, 44], [206, 52], [196, 56]]],
    lakes: [],
    nodes: [[90, 30], [126, 22], [158, 34], [128, 60], [108, 80]],
    decorAt: [[110, 16], [146, 22], [100, 52], [150, 60], [124, 78], [88, 66], [140, 44]],
    cvc: ['fox', 'box', 'jog', 'rod', 'nod', 'cot', 'got', 'not', 'rob', 'lot', 'hog', 'cop'],
    sight: ['has', 'her', 'his', 'how', 'just', 'know', 'live', 'may', 'of', 'old', 'once', 'open'],
  },
  {
    name: 'Hisui', color: '#7c3aed', land: '#d9e6c8', decor: '🌾', leader: 'Aunt Nini',
    badge: 'Bug Badge', shape: 'bug', badgeColor: '#84cc16',
    stops: ['Old Village', 'Bamboo Path', 'Snowy Peak', 'Ancient Ruins'],
    outline: HOKKAIDO, islands: [], lakes: [],
    nodes: [[100, 82], [112, 50], [140, 24], [172, 40], [200, 50]],
    decorAt: [[128, 34], [150, 44], [180, 46], [136, 54], [104, 66], [160, 28], [120, 60]],
    cvc: ['pup', 'cub', 'rub', 'tug', 'cut', 'mud', 'jug', 'run', 'fun', 'hum', 'sub', 'dug'],
    sight: ['over', 'put', 'some', 'stop', 'take', 'thank', 'them', 'then', 'walk', 'were', 'when', 'think'],
  },
  {
    name: 'Kitakami', color: '#b45309', land: '#c9e3a8', decor: '🍎', leader: 'Aunt Becca',
    badge: 'Ghost Badge', shape: 'ghost', badgeColor: '#6d28d9',
    stops: ['Apple Orchard', 'Lantern Festival', 'Misty Pond', 'Mountain Trail'],
    outline: [[110, 6], [118, 4], [124, 14], [132, 12], [136, 2], [150, 4], [146, 14], [148, 24], [156, 34], [160, 44], [156, 52], [158, 60], [150, 70], [146, 82], [142, 96], [104, 96], [98, 80], [100, 64], [94, 52], [88, 40], [96, 36], [100, 24], [106, 14]],
    islands: [], lakes: [[132, 24, 3, 2.5], [126, 86, 4, 3]],
    nodes: [[118, 86], [134, 70], [116, 52], [142, 40], [122, 20]],
    decorAt: [[108, 40], [146, 52], [112, 70], [138, 84], [128, 34], [104, 88], [140, 16]],
    cvc: ['rag', 'yam', 'pal', 'sap', 'cab', 'pad', 'gap', 'zap', 'hem', 'keg', 'yet', 'wed'],
    sight: ['could', 'every', 'round', 'been', 'before', 'best', 'both', 'call', 'cold', 'does', 'fast', 'first'],
  },
  {
    name: 'Orre', color: '#c2410c', land: '#e9b97a', sea: '#f6e2bd', decor: '🌵', leader: 'Aunt Pheffy',
    badge: 'Fighting Badge', shape: 'fighting', badgeColor: '#dc2626',
    stops: ['Dusty Road', 'Canyon Edge', 'Cactus Valley', 'Sunset Mesa'],
    outline: [[84, 4], [170, 4], [170, 96], [124, 96], [80, 76], [80, 64], [76, 52], [82, 40], [80, 26], [76, 16], [84, 12]],
    islands: [], lakes: [[116, 9, 6, 2.5]],
    nodes: [[102, 78], [146, 80], [154, 50], [110, 44], [126, 18]],
    decorAt: [[94, 60], [160, 30], [130, 62], [96, 24], [150, 90], [140, 36], [116, 86]],
    cvc: ['dip', 'sip', 'hid', 'rim', 'bit', 'pit', 'pod', 'mom', 'rot', 'bud', 'sum', 'pun'],
    sight: ['five', 'found', 'gave', 'green', 'made', 'many', 'off', 'read', 'sing', 'sleep', 'tell', 'your'],
  },
];
// Stop i gets CVC words 3i..3i+2 and sight words 3i..3i+2; the gym uses all 24.
JOURNEYS.forEach((J) => { J.words = [0, 1, 2, 3].flatMap((i) => [...J.cvc.slice(i * 3, i * 3 + 3), ...J.sight.slice(i * 3, i * 3 + 3)]); });
const STOP_SIZE = 6;

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

// ---- more pictures: new CVC words and drawable sight words ----
const splash = (col) => {
  let s = '';
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; s += `<circle cx="${(50 + Math.cos(a) * 28).toFixed(1)}" cy="${(52 + Math.sin(a) * 28).toFixed(1)}" r="${9 + (i % 3) * 2}" fill="${col}" ${SK}/>`; }
  return s + `<circle cx="50" cy="52" r="30" fill="${col}" ${SK}/><circle cx="40" cy="42" r="6" fill="#fff" opacity=".35"/>`;
};
const countDots = (n) => {
  const layouts = { 1: [[50, 50]], 2: [[32, 50], [68, 50]], 3: [[22, 50], [50, 50], [78, 50]], 4: [[34, 34], [66, 34], [34, 66], [66, 66]], 6: [[24, 34], [50, 34], [76, 34], [24, 66], [50, 66], [76, 66]] };
  return layouts[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#a855f7" ${SK}/>`).join('');
};
Object.assign(PIC, {
  // Unova
  rat: `<path d="M74 66 Q96 70 92 50 Q90 40 82 44" fill="none" stroke="#f9a8d4" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="54" cy="62" rx="24" ry="16" fill="#9ca3af" ${SK}/><path d="M34 60 L12 66 L32 52 Z" fill="#9ca3af" ${SK}/>
    <circle cx="36" cy="46" r="8" fill="#9ca3af" ${SK}/><circle cx="36" cy="46" r="4" fill="#f9a8d4"/><circle cx="26" cy="58" r="2.5" fill="${OL}"/><circle cx="12" cy="66" r="3" fill="#f9a8d4"/>
    <path d="M46 76 L44 84 M62 76 L64 84" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`,
  ham: `<path d="M30 30 Q60 10 82 34 Q96 56 74 72 Q52 86 34 70 Q18 54 30 30 Z" fill="#f9a8b4" ${SK}/><path d="M38 38 Q60 26 74 40 Q82 54 70 62" fill="none" stroke="#fda4af" stroke-width="6"/>
    <path d="M34 70 L18 86" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M34 70 L18 86" stroke="#fff7ed" stroke-width="7" stroke-linecap="round"/><circle cx="14" cy="88" r="6" fill="#fff7ed" ${SK}/><circle cx="20" cy="92" r="5" fill="#fff7ed" ${SK}/>`,
  ram: `${[[30, 50], [44, 40], [60, 40], [74, 50], [66, 64], [38, 64], [52, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#f5f5f4" ${SK}/>`).join('')}
    <ellipse cx="52" cy="52" rx="16" ry="18" fill="#57534e" ${SK}/><circle cx="46" cy="48" r="2.5" fill="#fff"/><circle cx="58" cy="48" r="2.5" fill="#fff"/>
    <path d="M38 40 Q24 30 26 46 Q28 56 36 50" fill="none" stroke="#d6a46a" stroke-width="7" stroke-linecap="round"/><path d="M66 40 Q80 30 78 46 Q76 56 68 50" fill="none" stroke="#d6a46a" stroke-width="7" stroke-linecap="round"/>
    <path d="M42 80 L42 90 M62 80 L62 90" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
  // Alola
  web: `${[0, 45, 90, 135].map((a) => `<path d="M${(50 + Math.cos(a * Math.PI / 180) * 44).toFixed(1)} ${(50 + Math.sin(a * Math.PI / 180) * 44).toFixed(1)} L${(50 - Math.cos(a * Math.PI / 180) * 44).toFixed(1)} ${(50 - Math.sin(a * Math.PI / 180) * 44).toFixed(1)}" stroke="#64748b" stroke-width="2"/>`).join('')}
    ${[12, 24, 36].map((r) => `<polygon points="${[...Array(8)].map((_, i) => `${(50 + Math.cos(i * Math.PI / 4) * r).toFixed(1)},${(50 + Math.sin(i * Math.PI / 4) * r).toFixed(1)}`).join(' ')}" fill="none" stroke="#64748b" stroke-width="2"/>`).join('')}
    <path d="M70 16 L70 30" stroke="${OL}" stroke-width="1.5"/><circle cx="70" cy="34" r="6" fill="${OL}"/>`,
  gem: `<path d="M24 36 L38 18 L62 18 L76 36 L50 86 Z" fill="#22d3ee" ${SK}/><path d="M24 36 L76 36 M38 18 L44 36 L50 86 L56 36 L62 18" fill="none" ${SK}/><path d="M30 34 L38 22" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  yes: `<circle cx="50" cy="50" r="38" fill="#22c55e" ${SK}/><path d="M30 52 L44 66 L72 36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
  // Galar
  pig: `<path d="M24 30 L30 14 L42 26 Z M76 30 L70 14 L58 26 Z" fill="#f9a8d4" ${SK}/><circle cx="50" cy="52" r="32" fill="#f9a8d4" ${SK}/>
    <ellipse cx="50" cy="62" rx="14" ry="10" fill="#f472b6" ${SK}/><ellipse cx="45" cy="62" rx="2.5" ry="4" fill="${OL}"/><ellipse cx="55" cy="62" rx="2.5" ry="4" fill="${OL}"/>
    <circle cx="38" cy="44" r="3.5" fill="${OL}"/><circle cx="62" cy="44" r="3.5" fill="${OL}"/>`,
  big: `<ellipse cx="58" cy="56" rx="30" ry="22" fill="#a8b0c0" ${SK}/>${[38, 50, 66, 78].map((x) => `<rect x="${x - 5}" y="66" width="10" height="20" rx="3" fill="#a8b0c0" ${SK}/>`).join('')}
    <path d="M22 50 Q8 62 14 82" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/><path d="M22 50 Q8 62 14 82" fill="none" stroke="#a8b0c0" stroke-width="7" stroke-linecap="round"/>
    <circle cx="28" cy="42" r="16" fill="#a8b0c0" ${SK}/><ellipse cx="38" cy="42" rx="9" ry="13" fill="#c8cfdc" ${SK}/><circle cx="24" cy="38" r="2.5" fill="${OL}"/>`,
  dig: `<path d="M8 90 Q30 66 52 74 Q74 62 92 90 Z" fill="#a16207" ${SK}/><path d="M74 8 L50 64" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M74 8 L50 64" stroke="#c08a4a" stroke-width="4" stroke-linecap="round"/>
    <rect x="66" y="4" width="18" height="6" rx="3" fill="#c08a4a" ${SK}/><path d="M42 58 Q40 76 50 80 Q62 78 60 62 Z" fill="#94a3b8" ${SK}/><circle cx="72" cy="70" r="4" fill="#78350f"/><circle cx="30" cy="74" r="3" fill="#78350f"/>`,
  kid: person(50, 0.7, '#f97316'),
  bib: `<path d="M30 20 Q50 34 70 20 L76 30 Q80 80 50 88 Q20 80 24 30 Z" fill="#fff" ${SK}/><path d="M38 24 Q50 30 62 24" fill="none" stroke="#38bdf8" stroke-width="4"/>
    <circle cx="50" cy="58" r="12" fill="#fde047" ${SK}/><circle cx="46" cy="56" r="1.8" fill="${OL}"/><circle cx="54" cy="56" r="1.8" fill="${OL}"/><path d="M45 62 Q50 66 55 62" fill="none" stroke="${OL}" stroke-width="2"/>`,
  six: countDots(6),
  mix: `<path d="M14 50 L86 50 Q84 86 50 86 Q16 86 14 50 Z" fill="#fde68a" ${SK}/><ellipse cx="50" cy="50" rx="36" ry="8" fill="#fef3c7" ${SK}/>
    <path d="M38 50 Q50 42 62 50 Q50 58 38 50" fill="none" stroke="#d97706" stroke-width="3"/>
    <path d="M60 46 L80 10" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><ellipse cx="58" cy="46" rx="6" ry="10" fill="none" stroke="#64748b" stroke-width="3" transform="rotate(30 58 46)"/>
    <path d="M22 30 q4 -6 8 0 M84 34 q4 -6 8 0" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>`,
  fix: `<path d="M22 80 L64 38" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M22 80 L64 38" stroke="#c08a4a" stroke-width="6" stroke-linecap="round"/><rect x="54" y="18" width="34" height="16" rx="3" fill="#64748b" ${SK} transform="rotate(45 71 26)"/>
    <path d="M78 80 L40 42" stroke="${OL}" stroke-width="10" stroke-linecap="round"/><path d="M78 80 L40 42" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/><circle cx="34" cy="36" r="11" fill="#cbd5e1" ${SK}/><path d="M28 28 L36 36" stroke="#fff" stroke-width="5"/>`,
  // Paldea
  fox: `<path d="M18 22 L36 40 L28 50 Z M82 22 L64 40 L72 50 Z" fill="#f97316" ${SK}/>
    <path d="M22 40 Q50 24 78 40 L66 70 Q50 86 34 70 Z" fill="#f97316" ${SK}/><path d="M34 62 Q50 92 66 62 Q58 70 50 70 Q42 70 34 62 Z" fill="#fff" ${SK}/>
    <circle cx="40" cy="50" r="3.5" fill="${OL}"/><circle cx="60" cy="50" r="3.5" fill="${OL}"/><ellipse cx="50" cy="76" rx="4" ry="3" fill="${OL}"/>`,
  box: `<path d="M14 36 L50 24 L86 36 L50 48 Z" fill="#e8c38a" ${SK}/><path d="M14 36 L50 48 L50 90 L14 78 Z" fill="#d6a46a" ${SK}/><path d="M86 36 L50 48 L50 90 L86 78 Z" fill="#c08a4a" ${SK}/>
    <path d="M32 30 L68 42" stroke="#fef3c7" stroke-width="6"/>`,
  rod: `<path d="M10 90 L78 14" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M10 90 L78 14" stroke="#c08a4a" stroke-width="3.5" stroke-linecap="round"/><circle cx="24" cy="76" r="6" fill="#64748b" ${SK}/>
    <path d="M78 14 Q88 40 84 66" fill="none" stroke="#64748b" stroke-width="1.5"/><circle cx="84" cy="62" r="5" fill="#ef4444" ${SK}/><path d="M84 68 L84 80 Q84 86 78 84" fill="none" stroke="${OL}" stroke-width="2.5"/>
    <path d="M60 80 Q72 74 92 80" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>`,
  // Hisui
  pup: `<ellipse cx="54" cy="70" rx="22" ry="16" fill="#e7c9a0" ${SK}/><ellipse cx="22" cy="40" rx="7" ry="13" fill="#a16207" ${SK}/><ellipse cx="54" cy="40" rx="7" ry="13" fill="#a16207" ${SK}/>
    <circle cx="38" cy="44" r="18" fill="#e7c9a0" ${SK}/><ellipse cx="38" cy="52" rx="9" ry="6" fill="#fff6e8" ${SK}/><ellipse cx="38" cy="49" rx="3.5" ry="2.5" fill="${OL}"/>
    <circle cx="32" cy="40" r="2.5" fill="${OL}"/><circle cx="44" cy="40" r="2.5" fill="${OL}"/><path d="M74 66 Q86 56 82 48" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`,
  cub: `<circle cx="28" cy="28" r="11" fill="#92400e" ${SK}/><circle cx="72" cy="28" r="11" fill="#92400e" ${SK}/><circle cx="50" cy="54" r="32" fill="#92400e" ${SK}/>
    <ellipse cx="50" cy="66" rx="14" ry="10" fill="#d6a46a" ${SK}/><ellipse cx="50" cy="61" rx="5" ry="3.5" fill="${OL}"/><circle cx="38" cy="46" r="3.5" fill="${OL}"/><circle cx="62" cy="46" r="3.5" fill="${OL}"/>`,
  sub: `<rect x="0" y="0" width="100" height="100" fill="#bae6fd"/><ellipse cx="50" cy="60" rx="40" ry="18" fill="#facc15" ${SK}/><rect x="42" y="30" width="20" height="16" rx="3" fill="#facc15" ${SK}/>
    <path d="M52 30 L52 18 L60 18" fill="none" stroke="${OL}" stroke-width="3"/>${[30, 50, 70].map((x) => `<circle cx="${x}" cy="60" r="6" fill="#dff3ff" ${SK}/>`).join('')}
    <path d="M90 52 L98 44 L98 76 L90 68" fill="#facc15" ${SK}/><circle cx="20" cy="26" r="3" fill="#fff" ${SK}/><circle cx="26" cy="16" r="2" fill="#fff" ${SK}/>`,
  // drawable sight words
  blue: splash('#3b82f6'), yellow: splash('#facc15'), black: splash('#222233'), brown: splash('#8b5a2b'), white: splash('#ffffff'),
  one: countDots(1), two: countDots(2), three: countDots(3), four: countDots(4),
  down: `<path d="M50 90 L82 54 L63 54 L63 10 L37 10 L37 54 L18 54 Z" fill="#22c55e" ${SK}/>`,
  up: `<path d="M50 10 L82 46 L63 46 L63 90 L37 90 L37 46 L18 46 Z" fill="#22c55e" ${SK}/>`,
  jump: `${kidHead(50, 18)}<path d="M50 27 L50 52 M50 33 L34 18 M50 33 L66 18 M50 52 L40 62 L44 72 M50 52 L60 62 L56 72" ${LIMB}/>
    <path d="M14 92 L86 92" stroke="#b5c4a0" stroke-width="4" stroke-linecap="round"/><path d="M38 80 L36 86 M50 80 L50 87 M62 80 L64 86" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>`,
  ride: `<circle cx="26" cy="72" r="15" fill="none" stroke="${OL}" stroke-width="4"/><circle cx="74" cy="72" r="15" fill="none" stroke="${OL}" stroke-width="4"/>
    <path d="M26 72 L44 50 L66 50 L74 72 M44 50 L52 72 L66 50 M64 50 L62 40 L70 40" fill="none" stroke="#14b8a6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${kidHead(46, 16)}<path d="M46 25 L44 46 M45 32 L64 40 M44 46 L54 60 L52 72" ${LIMB}/>`,
  eat: `<path d="M44 20 Q48 26 44 32 M56 20 Q60 26 56 32" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 50 L86 50 Q84 84 50 84 Q16 84 14 50 Z" fill="#14b8a6" ${SK}/><path d="M18 50 Q30 40 42 48 Q54 38 66 48 Q76 40 82 50 Z" fill="#fca5a5" ${SK}/>
    <path d="M72 18 L60 44" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M72 18 L60 44" stroke="#d1d5db" stroke-width="4" stroke-linecap="round"/>`,
  under: `<rect x="14" y="30" width="72" height="9" rx="2" fill="#c08a4a" ${SK}/><path d="M20 39 L20 86 M80 39 L80 86" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><path d="M20 39 L20 86 M80 39 L80 86" stroke="#c08a4a" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="74" r="12" fill="#7ed957" ${SK}/><path d="M50 62 q2 -7 6 -8" fill="none" stroke="${OL}" stroke-width="3"/>`,
  stop: `<path d="M50 90 L50 70" stroke="${OL}" stroke-width="7"/><polygon points="36,8 64,8 84,28 84,52 64,72 36,72 16,52 16,28" fill="#ef4444" ${SK}/><polygon points="38,14 62,14 78,30 78,50 62,66 38,66 22,50 22,30" fill="none" stroke="#fff" stroke-width="3"/><rect x="30" y="34" width="40" height="12" rx="3" fill="#fff"/>`,
  open: `<rect x="22" y="10" width="56" height="84" rx="2" fill="#fef3c7" ${SK}/><path d="M22 10 L48 18 L48 98 L22 94 Z" fill="#a16207" ${SK}/><circle cx="42" cy="56" r="3" fill="#fde047" ${SK}/>
    <path d="M58 40 L72 30 M60 54 L76 54 M58 68 L72 78" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>`,
});
// Colors only compete with colors, numbers only with numbers.
const PIC_GROUPS = [['red', 'blue', 'yellow', 'black', 'brown', 'white', 'green'], ['one', 'two', 'three', 'four', 'five', 'six', 'ten']];
Object.assign(PIC, {
  green: splash('#22c55e'),
  five: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#a855f7" ${SK}/>`).join(''),
  yam: `<path d="M14 58 Q20 34 50 36 Q82 36 88 52 Q92 70 64 74 Q30 80 14 58 Z" fill="#c2410c" ${SK}/><path d="M86 50 L96 44" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
    <path d="M34 50 L38 52 M56 46 L60 48 M48 62 L52 64 M70 58 L74 60" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/>`,
  cab: `<path d="M8 70 L8 52 Q10 44 18 44 L28 44 L38 30 L66 30 L76 44 L88 46 Q94 48 94 56 L94 70 Z" fill="#facc15" ${SK}/><rect x="40" y="18" width="20" height="10" rx="2" fill="#fff" ${SK}/>
    <path d="M32 44 L41 34 L50 34 L50 44 Z M54 44 L54 34 L64 34 L71 44 Z" fill="#dff3ff" ${SK}/><path d="M10 56 L92 56" stroke="${OL}" stroke-width="2" stroke-dasharray="5 5"/>
    <circle cx="28" cy="72" r="10" fill="#333" ${SK}/><circle cx="74" cy="72" r="10" fill="#333" ${SK}/>`,
  zap: `<path d="M58 4 L24 54 L46 54 L36 96 L78 40 L54 40 Z" fill="#fde047" ${SK}/><path d="M14 20 L24 26 M84 70 L94 76 M12 70 L22 64 M86 18 L78 26" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>`,
  keg: `<path d="M26 14 Q20 50 26 86 L74 86 Q80 50 74 14 Z" fill="#b45309" ${SK}/><path d="M24 30 L76 30 M22 70 L78 70" stroke="#64748b" stroke-width="6"/>
    <path d="M38 14 Q34 50 38 86 M62 14 Q66 50 62 86" fill="none" stroke="#92400e" stroke-width="2.5"/><ellipse cx="50" cy="14" rx="24" ry="5" fill="#d97706" ${SK}/>`,
  pod: `<path d="M8 60 Q30 24 70 30 Q94 34 94 44 Q80 66 40 70 Q18 72 8 60 Z" fill="#4ade80" ${SK}/>${[30, 46, 62, 78].map((x, i) => `<circle cx="${x}" cy="${48 - i}" r="8" fill="#86efac" ${SK}/>`).join('')}
    <path d="M94 44 Q98 36 92 30" fill="none" stroke="#166534" stroke-width="3" stroke-linecap="round"/>`,
  bud: `<path d="M50 94 L50 46" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/><path d="M50 70 Q30 64 26 50 Q42 52 50 66 Z M50 78 Q70 72 74 58 Q58 60 50 74 Z" fill="#4ade80" ${SK}/>
    <path d="M50 8 Q66 22 62 40 Q56 50 50 50 Q44 50 38 40 Q34 22 50 8 Z" fill="#f472b6" ${SK}/><path d="M38 40 Q50 30 62 40 Q56 52 50 52 Q44 52 38 40 Z" fill="#22c55e" ${SK}/>`,
  mom: `<path d="M44 66 L43 92 M56 66 L57 92" ${LIMB}/><path d="M38 34 L62 34 L72 70 L28 70 Z" fill="#ec4899" ${SK}/>
    <path d="M38 40 L28 60 M62 40 L72 60" ${LIMB}/><path d="M36 24 Q34 46 30 50 Q40 48 42 30 M64 24 Q66 46 70 50 Q60 48 58 30" fill="#a16207" ${SK}/>
    <circle cx="50" cy="22" r="11" fill="${SKIN}" ${SK}/><path d="M39 20 Q50 4 61 20 Q50 14 39 20 Z" fill="#a16207" ${SK}/>`,
});
PIC_CONFLICTS.push(['cab', 'van'], ['cab', 'bus'], ['mom', 'man'], ['mom', 'men'], ['mom', 'kid'], ['zap', 'hot'], ['one', 'dot'], ['pup', 'dog'], ['mix', 'eat'], ['jump', 'run'], ['pig', 'ham'], ['web', 'net'], ['up', 'down'], ['kid', 'man'], ['kid', 'men'], ['cub', 'dog'], ['box', 'open']);

const hasPic = (w) => !!PIC[w];
const picSVG = (w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="picture">${PIC[w]}</svg>`;

function badgeSVG(shape, color, size = '') {
  const light = shade(color, 22), dark = shade(color, -18);
  let body = '';
  if (shape === 'fire') body = `<path d="M50 6 C60 26 80 34 78 60 A28 28 0 0 1 22 60 C20 44 32 36 34 22 C40 32 44 34 46 38 C48 26 46 16 50 6 Z" fill="${color}" ${SK}/><path d="M50 46 C56 56 64 60 62 72 A12 12 0 0 1 38 72 C38 62 46 58 50 46 Z" fill="#fde047" ${SK}/>`;
  else if (shape === 'water') body = `<path d="M50 6 C66 32 82 48 82 64 A32 32 0 0 1 18 64 C18 48 34 32 50 6 Z" fill="${color}" ${SK}/><path d="M30 66 Q40 56 50 66 Q60 76 70 66" fill="none" stroke="${light}" stroke-width="5" stroke-linecap="round"/>`;
  else if (shape === 'electric') body = `<path d="M58 4 L22 54 L46 54 L36 96 L78 40 L54 40 Z" fill="${color}" ${SK}/><path d="M54 16 L34 48" stroke="${light}" stroke-width="4" stroke-linecap="round"/>`;
  else if (shape === 'rock') body = `<path d="M20 70 L14 44 L30 22 L58 12 L80 26 L90 52 L80 80 L52 90 L30 86 Z" fill="${color}" ${SK}/><path d="M40 30 L50 48 L44 64 M62 44 L74 56 M30 60 L40 70" fill="none" stroke="${dark}" stroke-width="3.5" stroke-linecap="round"/>`;
  else if (shape === 'dark') body = `<circle cx="50" cy="50" r="42" fill="${color}" ${SK}/><path d="M60 22 A28 28 0 1 0 72 70 A22 22 0 1 1 60 22 Z" fill="#fde68a" ${SK}/><circle cx="30" cy="30" r="2.5" fill="#fff"/><circle cx="74" cy="38" r="2" fill="#fff"/>`;
  else if (shape === 'fairy') body = `<path d="M50 88 C20 66 10 50 14 34 C18 18 40 14 50 30 C60 14 82 18 86 34 C90 50 80 66 50 88 Z" fill="${color}" ${SK}/><path d="M50 40 L54 50 L64 52 L56 58 L58 68 L50 62 L42 68 L44 58 L36 52 L46 50 Z" fill="#fff"/>`;
  else if (shape === 'grass') body = `<path d="M50 8 C82 22 86 62 50 92 C14 62 18 22 50 8 Z" fill="${color}" ${SK}/><path d="M50 18 L50 84 M50 40 L36 30 M50 40 L64 30 M50 58 L34 48 M50 58 L66 48" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`;
  else if (shape === 'ice') body = `<circle cx="50" cy="50" r="42" fill="${color}" ${SK}/>${[0, 60, 120].map((a) => `<g transform="rotate(${a} 50 50)"><path d="M50 16 L50 84 M50 26 L42 18 M50 26 L58 18 M50 74 L42 82 M50 74 L58 82" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`).join('')}`;
  else if (shape === 'ghost') body = `<path d="M18 92 L18 44 A32 32 0 0 1 82 44 L82 92 L72 82 L61 92 L50 82 L39 92 L28 82 Z" fill="${color}" ${SK}/><ellipse cx="38" cy="46" rx="6" ry="9" fill="#fff"/><ellipse cx="62" cy="46" rx="6" ry="9" fill="#fff"/><ellipse cx="50" cy="66" rx="6" ry="5" fill="${dark}"/>`;
  else if (shape === 'fighting') body = `<rect x="22" y="58" width="46" height="34" rx="10" fill="${color}" ${SK}/><path d="M24 26 Q24 14 36 14 L68 14 Q84 14 84 30 L84 50 Q84 64 68 64 L32 64 Q22 64 22 52 Z" fill="${color}" ${SK}/><path d="M38 14 L38 40 M54 14 L54 40 M70 16 L70 40 M22 40 Q40 46 60 40" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><rect x="22" y="70" width="46" height="8" fill="#fff" ${SK}/>`;
  else if (shape === 'bug') body = `<path d="M34 30 Q26 14 18 16 M66 30 Q74 14 82 16" fill="none" ${SK}/><ellipse cx="50" cy="56" rx="34" ry="36" fill="${color}" ${SK}/><path d="M50 22 L50 92" ${SK}/><circle cx="50" cy="26" r="13" fill="${dark}" ${SK}/><circle cx="34" cy="52" r="6" fill="${dark}"/><circle cx="66" cy="52" r="6" fill="${dark}"/><circle cx="36" cy="74" r="5" fill="${dark}"/><circle cx="64" cy="74" r="5" fill="${dark}"/>`;
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
    <rect width="240" height="100" fill="${J.sea || '#7cc4f2'}"/>${J.sea ? '' : waves}
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
  const n = JOURNEYS.length;
  if (!save.reading) save.reading = { stops: Array(n).fill(0), badges: Array(n).fill(false), v: 2 };
  const R = save.reading;
  if (R.v !== 2) { // switched to 24-word regions: keep badges, finished regions stay finished, others start their stops again
    R.badges = [...Array(n)].map((_, i) => !!R.badges[i]);
    R.stops = R.badges.map((b) => (b ? 4 : 0));
    R.v = 2;
  }
  while (R.badges.length < n) R.badges.push(false);
  while (R.stops.length < n) R.stops.push(0);
  return save.reading;
}
const journeyUnlocked = (i) => i === 0 || save.reading.badges[i - 1];
const currentJourney = () => { const r = ensureReading(); const i = r.badges.findIndex((b) => !b); return i < 0 ? JOURNEYS.length - 1 : i; };
const badgeCount = () => (save && save.reading ? save.reading.badges.filter(Boolean).length : 0);
let readingView = null;

// ---------- all regions overview (6 chapters: 2 regions + a tournament each) ----------
function openRegionPicker(current) {
  const el = document.createElement('div');
  el.className = 'modal-back';
  const regionCard = (i) => {
    const j = JOURNEYS[i], open = journeyUnlocked(i), won = save.reading.badges[i], stops = Math.min(4, save.reading.stops[i] || 0);
    return `<button class="rp-card${i === current ? ' here' : ''}" data-r="${i}" style="--rc:${j.color}" ${open ? '' : 'disabled'}>
      <span class="rp-icon">${won ? badgeSVG(j.shape, j.badgeColor) : open ? '🗺️' : '🔒'}</span>
      <span class="rp-text"><b>${j.name}</b><small>${won ? j.badge : open ? `${stops} of 4 stops` : 'Locked'}</small></span></button>`;
  };
  const tourneyCard = (t) => {
    const open = tourneyOpen(t), won = tourneyState(t).won, prize = TOURNAMENTS[t].prize;
    return `<button class="rp-card tourney" data-t="${t}" ${open ? '' : 'disabled'}>
      <span class="rp-icon">${won ? '🏆' : open ? '⚔️' : '🔒'}</span>
      <span class="rp-text"><b>Tournament ${t + 1}</b><small>${won ? (prize ? `Won ${DEX[prize].name}!` : 'Champion!') : open ? 'Open!' : 'Needs both badges'}</small></span></button>`;
  };
  el.innerHTML = `<div class="modal region-picker"><h2>All regions</h2>
    <div class="rp-chapters">${TOURNAMENTS.map((T, t) => `<div class="rp-chapter"><div class="rp-label">Chapter ${t + 1}</div>${regionCard(T.regions[0])}${regionCard(T.regions[1])}${tourneyCard(t)}</div>`).join('')}</div>
    <div class="modal-buttons"><button class="btn grey" data-x="1">Close</button></div></div>`;
  document.body.appendChild(el);
  el.addEventListener('click', (e) => {
    const c = e.target.closest('.rp-card'), x = e.target.closest('[data-x]');
    if ((!c || c.disabled) && !x && e.target !== el) return;
    Sound.tap(); el.remove();
    if (c && !c.disabled) { if (c.dataset.t !== undefined) screenTournament(+c.dataset.t); else screenReading(+c.dataset.r); }
  });
}

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
  const tIdx = (r - 1) / 2, tourneyReady = badge && r % 2 === 1 && tourneyOpen(tIdx) && !tourneyState(tIdx).won;
  const info = tourneyReady ? `🏆 <b>Tournament ${tIdx + 1}</b> is open! Win it for a big prize.` : badge ? `🏅 You earned the ${J.badge}! ${r < JOURNEYS.length - 1 ? `Next: ${JOURNEYS[r + 1].name}!` : 'You finished every journey!'}`
    : done >= 4 ? `Gym Leader ${J.leader} is waiting! Read all ${J.words.length} words to win the ${J.badge}.`
    : `Next stop: <b>${J.stops[done]}</b> — ${STOP_SIZE} new words`;
  show(`
    <div class="screen reading">
      <header class="topbar">
        <div class="home-left"><button class="home-btn" data-go="menu" aria-label="Menu">🏠</button><h1 class="logo small">Poke<span>Read</span></h1></div>
        <div style="flex:1"></div>
        <button class="btn dex-btn sticker-btn" id="read-stickers">⭐ <b>${stickerCount()}/${STICKERS.length}</b></button>
        <button class="btn dex-btn" id="read-dex">📖 My Pokémon <b>${caughtCount()}</b></button>
        <div class="badge-row">${JOURNEYS.map((j, i) => `<span class="badge-slot${save.reading.badges[i] ? ' got' : ''}">${save.reading.badges[i] ? badgeSVG(j.shape, j.badgeColor) : ''}</span>`).join('')}</div>
      </header>
      <div class="region-nav" style="--rc:${J.color}">
        <button class="nav-arrow" id="prev-r" ${r > 0 ? '' : 'disabled'} aria-label="Previous region">◀</button>
        <button class="region-current" id="all-regions">
          <span class="rc-name">${J.name}</span>
          <span class="rc-sub">Chapter ${Math.floor(r / 2) + 1} · Region ${r + 1} of ${JOURNEYS.length} · <u>All regions</u></span>
        </button>
        <button class="nav-arrow" id="next-r" ${r < JOURNEYS.length - 1 && journeyUnlocked(r + 1) ? '' : 'disabled'} aria-label="Next region">▶</button>
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
        ${badge ? `<button class="sentence-btn${sentenceDone(r) ? ' done' : ''}" id="sentences">📜 Sentence bonus${sentenceDone(r) ? ' ✅' : ''}</button>` : ''}
      </div>
      ${badge && r === JOURNEYS.length - 1 && !tourneyReady ? `<div class="map-info card">${info}</div>` : `<button class="map-info card go" id="next-step">${info} <span class="go-arrow">▶</span></button>`}
    </div>`);
  $('#prev-r').addEventListener('click', () => { Sound.tap(); screenReading(r - 1); });
  $('#next-r').addEventListener('click', () => { Sound.tap(); screenReading(r + 1); });
  $('#all-regions').addEventListener('click', () => { Sound.tap(); openRegionPicker(r); });
  $('#read-dex').addEventListener('click', () => { Sound.tap(); screenDex(false, 'reading'); });
  $('#read-stickers').addEventListener('click', () => { Sound.tap(); screenStickers('reading'); });
  $('#sentences')?.addEventListener('click', (e) => { e.stopPropagation(); Sound.tap(); screenSentences(r); });
  showStickerPopups();
  $('#next-step')?.addEventListener('click', () => {
    Sound.tap();
    if (tourneyReady) screenTournament(tIdx);
    else if (badge) screenReading(r + 1);
    else if (done >= 4) screenGym(r);
    else screenStop(r, done);
  });
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
// Reading words are spoken slowly so a kindergartner can hear each sound; the 🐢 button is extra slow.
const READ_RATE = 0.55, SLOW_RATE = 0.3;
const sayWord = (w, slow = false) => speak(w, slow ? SLOW_RATE : READ_RATE);
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
  const group = PIC_GROUPS.find((g) => g.includes(target));
  const inAnyGroup = (w) => PIC_GROUPS.some((g) => g.includes(w));
  const ok = (w) => hasPic(w) && w !== target && !conflicts(w, target) && (group ? group.includes(w) : !inAnyGroup(w));
  const ranked = rankByFamily(target, ALL_WORDS.filter(ok));
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
          <div class="btn-row"><button class="btn blue big" id="hear">🔊 Hear it</button><button class="btn blue big slow-btn" id="hear-slow" aria-label="Say it slowly">🐢 Slow</button><button class="btn green big" id="nextw">${i < words.length - 1 ? 'Next ▶' : "Let's read! ▶"}</button></div>
        </div>`;
      sayWord(w);
      $('#hear', panel).onclick = () => { Sound.tap(); sayWord(w); };
      $('#hear-slow', panel).onclick = () => { Sound.tap(); sayWord(w, true); };
      $('#nextw', panel).onclick = () => {
        Sound.tap();
        if (!alive(tok)) return;
        if (++i >= words.length) resolve(); else draw();
      };
    };
    draw();
  });
}

// Quiz: every word must be read right on the FIRST try. A missed word is retried until right,
// then comes back (one word later) until it is read right the first time.
function wordQuiz(panel, words, pool, title, tok, onProgress, onAnswer) {
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
            ? `<div class="rq-prompt">${repeated.has(w) ? '🔁 This one again! ' : ''}Read the word. Tap its picture!</div>${wordBig(w)}`
            : `<div class="rq-prompt">${repeated.has(w) ? '🔁 This one again! ' : ''}Listen, then tap the word!</div><div class="btn-row"><button class="btn blue big rq-listen">🔊 Hear it</button><button class="btn blue big slow-btn rq-slow" aria-label="Say it slowly">🐢 Slow</button></div>`}
          <div class="rq-options ${type}">
            ${opts.map((o) => `<button class="rq-opt" data-w="${o}">${type === 'pic' ? picSVG(o) : o}</button>`).join('')}
          </div>
          <div class="feedback">&nbsp;</div>
        </div>`;
      if (type === 'listen') {
        sayWord(w);
        $('.rq-listen', panel).onclick = () => { Sound.tap(); sayWord(w); };
        $('.rq-slow', panel).onclick = () => { Sound.tap(); sayWord(w, true); };
      }
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
          onAnswer && onAnswer(true);
          recordItem('words', w, !missed);
          if (missed) { repeated.add(w); queue.splice(Math.min(1, queue.length), 0, w); }
          else { doneCount++; onProgress && onProgress(doneCount); }
          setTimeout(next, 900);
        } else {
          missed = true; mistakes++;
          Sound.wrong();
          onAnswer && onAnswer(false);
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
  const J = JOURNEYS[r], words = J.words.slice(s * STOP_SIZE, s * STOP_SIZE + STOP_SIZE);
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
  const learned = new Set(wordsUpTo(r));
  const review = trickyList(save, 'words').map((t) => t.key).filter((w) => learned.has(w) && !words.includes(w)).slice(0, 2);
  await wordQuiz(panel, [...words, ...review], wordsUpTo(r), `${J.stops[s]}${review.length ? ' + review' : ''}`, tok);
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
      <h2>You read all ${words.length} words!</h2>
      <p>${first ? (gymNext ? `Next up: the ${J.name} Gym!` : `On to ${J.stops[s + 1]}!`) : 'Great practice!'}</p>
      <div class="word-chips">${words.map((w) => `<span class="word-chip">${w}</span>`).join('')}</div>
      <div class="btn-row"><button class="btn green big" data-go="reading">Continue journey 🗺️</button></div>
    </div>`;
}

// ---------- the gym ----------
const typeName = (J) => J.badge.replace(' Badge', '');
const LEADER_START = ["Let's see how well you read!", 'Welcome to my gym! Ready?', 'My team and I are ready. Are you?'];
const LEADER_GOOD = ['Nice reading!', 'Wow, you are good!', 'My team is impressed!', 'Keep going!', 'Great job!', "You're a reading star!", "That's right!"];
const LEADER_OOPS = ['Hmm, look again!', 'Sound it out slowly!', 'Almost! Try again!', 'You can do it!'];
// Two original companion creatures per gym type (drawn with the creature builder).
const GYM_CREW = {
  fire: [['ball', '#f97316', '#fde68a', 'flamehead', { feet: 1, r: 42 }], ['bird', '#ef4444', '#fde68a', 'crest:#f59e0b', {}]],
  water: [['fish', '#38bdf8', '#e0f2fe', 'topfin:#bae6fd', {}], ['ball', '#0ea5e9', '#e0f2fe', 'ears:fin fintail:#bae6fd', { feet: 1, r: 44 }]],
  electric: [['ball', '#fde047', '#fef9c3', 'antennae:#f59e0b', { feet: 1, r: 40 }], ['bird', '#facc15', '#fef3c7', 'crest:#f59e0b', {}]],
  rock: [['quad', '#a8956a', '#e7dcc0', 'spikes:#78716c:4', {}], ['blob', '#9ca3af', '#d1d5db', 'eyes:angry spikes:#6b7280:5', {}]],
  psychic: [['biped', '#f0abfc', '#fae8ff', 'gem:#a855f7 ears:pointy', { tall: 1 }], ['ball', '#c084fc', '#f3e8ff', 'gem:#f472b6 curl', { r: 42, feet: 1 }]],
  dark: [['quad', '#374151', '#6b7280', 'ears:pointy eyes:red', {}], ['bird', '#1f2937', '#4b5563', 'crest:#111827 eyes:angry', {}]],
  fairy: [['ball', '#fbcfe8', '#ffffff', 'wings:butterfly:#fdf2f8 antennae:#f472b6', { r: 34 }], ['blob', '#f5d0fe', '#ffffff', 'ears:round wings:tiny:#ffffff', { nofeet: 1, rx: 46, ry: 40 }]],
  grass: [['ball', '#4ade80', '#dcfce7', 'leaves', { feet: 1, r: 40 }], ['quad', '#86efac', '#dcfce7', 'ears:round curl', {}]],
  ice: [['blob', '#bae6fd', '#f0f9ff', 'ears:small spikes:#7dd3fc:5', {}], ['bird', '#7dd3fc', '#e0f2fe', 'crest:#e0f2fe', {}]],
  bug: [['worm', '#facc15', '#fef9c3', 'antennae:#365314', {}], ['ball', '#a3e635', '#ecfccb', 'wings:bug antennae:#365314', { r: 34, cy: 104 }]],
  ghost: [['ghost', '#c4b5fd', '#ede9fe', 'mouth:smile', {}], ['gas', '#134e4a', '#5eead4', 'eyes:white mouth:smile nocheeks', {}]],
  fighting: [['biped', '#fb923c', '#fed7aa', 'gloves:#ffffff belt eyes:angry', {}], ['ball', '#f87171', '#fee2e2', 'gloves:#ffffff:big eyes:angry', { feet: 1, arms: 1, r: 44 }]],
};
function crewSVG(shape, i) {
  const spec = (GYM_CREW[shape] || GYM_CREW.fire)[i];
  const { inner, float } = buildMon(spec, hashStr(shape + i));
  const shadow = float ? '<ellipse cx="100" cy="194" rx="36" ry="6" fill="rgba(0,0,0,.12)"/>' : '<ellipse cx="100" cy="192" rx="56" ry="8" fill="rgba(0,0,0,.14)"/>';
  return `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${shape} companion">${shadow}<g class="mon-body${float ? ' floaty' : ''}">${inner}</g></svg>`;
}

async function screenGym(r) {
  const J = JOURNEYS[r];
  const tok = show(`
    <div class="screen read-gym">
      ${readTop(`${J.name} Gym`)}
      <div class="split">
        <div class="stage gym-stage" style="--gc:${J.badgeColor}">
          <div class="gym-arena">
            <div class="gym-floor"></div>
            <div class="sprite gym-crew crew-l bob">${crewSVG(J.shape, 0)}</div>
            <div class="sprite gym-leader">${trainerSVG(J.leader)}</div>
            <div class="sprite gym-crew crew-r bob">${crewSVG(J.shape, 1)}</div>
            <div class="leader-bubble">My ${typeName(J)} team is ready! Can you read all ${J.words.length} words?</div>
          </div>
          <div class="gym-meter"><div class="gym-meter-fill" style="width:0%"></div><span>0 / ${J.words.length}</span></div>
        </div>
        <div class="panel card"></div>
      </div>
    </div>`);
  const panel = $('.panel');
  panel.innerHTML = `
    <div class="center-msg">
      <div class="gym-badge-preview">${badgeSVG(J.shape, J.badgeColor)}</div>
      <h2>Gym Leader ${J.leader}</h2>
      <p>Read all ${J.words.length} ${J.name} words to win the <b>${J.badge}</b>!</p>
      <div class="btn-row"><button class="btn grey" data-go="reading">Not yet</button><button class="btn green big" id="go">I'm ready!</button></div>
    </div>`;
  await new Promise((res) => ($('#go').onclick = () => { Sound.tap(); res(); }));
  if (!alive(tok)) return;
  const meter = $('.gym-meter-fill'), meterTxt = $('.gym-meter span');
  const bubble = $('.leader-bubble'), crew = $$('.gym-crew');
  const say = (t) => { bubble.textContent = t; retrigger(bubble, 'pop-in'); };
  say(pick(LEADER_START));
  const gymMistakes = await wordQuiz(panel, J.words, wordsUpTo(r), `Gym challenge`, tok, (n) => {
    meter.style.width = `${(n / J.words.length) * 100}%`;
    meterTxt.textContent = `${n} / ${J.words.length}`;
    if (n === Math.ceil(J.words.length / 2)) say('Halfway there! My team is getting nervous!');
  }, (ok) => {
    if (ok) { say(pick(LEADER_GOOD)); retrigger(pick(crew), 'hop'); }
    else { say(pick(LEADER_OOPS)); crew.forEach((c) => retrigger(c, 'wiggle')); }
  });
  if (!alive(tok)) return;
  if (gymMistakes === 0) bumpCounter('perfectGyms');
  say(`You did it! You earned the ${J.badge}!`);
  crew.forEach((c) => c.classList.add('jump'));
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
      <p>${first ? (r < JOURNEYS.length - 1 ? `Amazing reading! The road to ${JOURNEYS[r + 1].name} is open.` : 'You finished every journey. You are a Reading Champion!') : 'You read every word again. Super!'}</p>
      <div class="btn-row"><button class="btn grey" data-go="menu">Home</button><button class="btn green big" id="onward">${first && r < JOURNEYS.length - 1 ? `Go to ${JOURNEYS[r + 1].name} ▶` : 'Back to the map 🗺️'}</button></div>
    </div>`;
  $('#onward').onclick = () => { Sound.tap(); screenReading(first && r < JOURNEYS.length - 1 ? r + 1 : r); };
  if (r % 2 === 1 && tourneyOpen((r - 1) / 2) && !tourneyState((r - 1) / 2).won) {
    $('.center-msg .btn-row', panel).insertAdjacentHTML('beforebegin', `<p class="tourney-open">🏆 You have 2 badges. <b>Tournament ${(r - 1) / 2 + 1}</b> is open!</p>`);
    $('.center-msg .btn-row', panel).insertAdjacentHTML('beforeend', `<button class="btn blue big" id="to-tourney">🏆 Tournament</button>`);
    $('#to-tourney').onclick = () => { Sound.tap(); screenTournament((r - 1) / 2); };
  }
}

// ---------- tournaments: after every 2 badges ----------
// Quarter final = 1st region's gym leader, semi final = 2nd region's gym leader, final = the champion.
// Each attack needs 3 reading questions from the 48 words of those two regions.
const TOURNAMENTS = [
  { regions: [0, 1], champion: 'Oliver', prize: 145 },          // Zapdos
  { regions: [2, 3], champion: 'Hayden', prize: 146 },          // Moltres
  { regions: [4, 5], champion: 'Lob', prize: 144 },             // Articuno
  { regions: [6, 7], champion: 'Korrina', prize: null },        // prize still to be chosen
  { regions: [8, 9], champion: 'Tommy The Great', prize: null },
  { regions: [10, 11], champion: 'Leon', prize: null },
];
const ROUND_NAMES = ['Quarter Final', 'Semi Final', 'Final'];
const TOURNEY_QUESTIONS = 3;
const TOURNEY_FOES = [1, 2, 3];      // Pokémon per trainer: quarter, semi, final
const TOURNEY_HIT = [14, 17, 20];    // how hard their Pokémon hit (perfect answers still always win)
// Pokémon the gym leaders use, by badge type (from the 151; legendaries excluded).
const TYPE_TEAMS = {
  fire: [4, 5, 37, 38, 58, 59, 77, 78, 126, 136], water: [7, 8, 54, 55, 60, 61, 86, 98, 99, 116, 118, 120, 134],
  electric: [25, 26, 81, 82, 100, 101, 125, 135], rock: [74, 75, 76, 95, 111, 112, 138, 140, 141, 142],
  psychic: [63, 64, 65, 79, 80, 96, 97, 122], dark: [52, 53, 19, 20, 92, 93], fairy: [35, 36, 39, 40, 113],
  grass: [1, 2, 43, 44, 69, 70, 102, 114], ice: [87, 91, 124, 131], bug: [10, 12, 13, 15, 46, 48, 49, 123, 127],
  ghost: [92, 93, 94], fighting: [56, 57, 62, 66, 67, 68, 106, 107],
};
const CHAMPION_TEAM = [3, 6, 9, 59, 65, 68, 94, 112, 130, 131, 143, 149];

function tourneyState(t) {
  const R = ensureReading();
  if (!R.tournaments) R.tournaments = [];
  while (R.tournaments.length < TOURNAMENTS.length) R.tournaments.push({ round: 0, won: false });
  return R.tournaments[t];
}
const tourneyOpen = (t) => TOURNAMENTS[t].regions.every((r) => save.reading.badges[r]);
const tourneyOpponent = (t, round) => {
  const T = TOURNAMENTS[t];
  if (round < 2) { const J = JOURNEYS[T.regions[round]]; return { name: J.leader, team: TYPE_TEAMS[J.shape] || CHAMPION_TEAM, color: J.badgeColor }; }
  return { name: T.champion, team: CHAMPION_TEAM, color: '#f59e0b' };
};
const trophySVG = () => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30 16 L70 16 L68 44 Q66 60 50 62 Q34 60 32 44 Z" fill="#facc15" ${SK}/><path d="M30 22 Q14 22 16 34 Q18 46 32 44 M70 22 Q86 22 84 34 Q82 46 68 44" fill="none" stroke="${OL}" stroke-width="4"/><rect x="44" y="62" width="12" height="14" fill="#facc15" ${SK}/><rect x="30" y="76" width="40" height="12" rx="2" fill="#a16207" ${SK}/><path d="M50 26 L53 33 L60 33 L54 38 L56 45 L50 41 L44 45 L46 38 L40 33 L47 33 Z" fill="#fff"/></svg>`;

function screenTournament(t) {
  const T = TOURNAMENTS[t], st = tourneyState(t);
  const prize = T.prize ? DEX[T.prize] : null;
  const regionNames = T.regions.map((r) => JOURNEYS[r].name).join(' & ');
  const rows = ROUND_NAMES.map((rn, i) => {
    const o = tourneyOpponent(t, i);
    const state = i < st.round ? 'done' : i === st.round ? 'next' : 'locked';
    return `<div class="bracket-row ${state}" style="--oc:${o.color}">
      <div class="bracket-avatar sprite">${trainerSVG(o.name)}</div>
      <div class="bracket-text"><small>${rn}</small><b>${o.name}</b></div>
      <div class="bracket-state">${state === 'done' ? '✅' : state === 'next' ? '⚔️' : '🔒'}</div>
    </div>`;
  }).join('');
  show(`
    <div class="screen tourney">
      ${readTop(`🏆 Tournament ${t + 1}`)}
      <div class="split">
        <div class="card tourney-prize">
          <p class="kicker">${st.won ? 'You won this prize!' : 'Win the final to earn'}</p>
          <div class="prize-art${st.won ? '' : ' hidden-prize'}">${prize ? monSVG(prize) : trophySVG()}</div>
          <h2>${prize ? (st.won ? prize.name : '???') : 'Champion Trophy'}</h2>
          <p>${prize ? (st.won ? `${prize.name} is on your team at Rank 5!` : 'A Legendary Pokémon!') : 'A shiny champion trophy!'}</p>
        </div>
        <div class="card panel tourney-panel">
          <p class="kicker">Words from ${regionNames}</p>
          <div class="bracket">${rows}</div>
          <div class="btn-row"><button class="btn green big" id="start-round">${st.won && st.round === 0 ? 'Play again' : `Start ${ROUND_NAMES[st.round]}`} ⚔️</button></div>
          <p class="tourney-note">Quarter final: 1 Pokémon · Semi final: 2 · Final: 3. Pick who goes first and switch after each attack. Every attack needs ${TOURNEY_QUESTIONS} words read correctly!</p>
        </div>
      </div>
    </div>`);
  $('#start-round').onclick = () => { Sound.tap(); pickFighter(t); };
}

// Choose one of your Pokémon for the next battle
async function pickFighter(t) {
  const st = tourneyState(t);
  const ids = Object.keys(save.team).map(Number).sort((a, b) => save.team[b].rank - save.team[a].rank || a - b);
  const choice = await new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'modal-back';
    el.innerHTML = `<div class="modal fighter-modal"><h2>Who goes first?</h2><p>${ROUND_NAMES[st.round]} vs ${tourneyOpponent(t, st.round).name} (${TOURNEY_FOES[st.round]} Pokémon). You can switch after each attack.</p>
      <div class="fighter-grid">${ids.map((id) => `<button class="fighter" data-id="${id}"><div class="sprite">${monSVG(DEX[id])}</div><b>${DEX[id].name}</b><span>${'★'.repeat(save.team[id].rank)}</span></button>`).join('')}</div>
      <div class="modal-buttons"><button class="btn grey" data-x="1">Cancel</button></div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      const f = e.target.closest('.fighter'), x = e.target.closest('[data-x]');
      if (!f && !x) return;
      Sound.tap(); el.remove(); resolve(f ? +f.dataset.id : null);
    });
  });
  if (choice) startTourneyBattle(t, choice);
}

function startTourneyBattle(t, allyId) {
  const T = TOURNAMENTS[t], st = tourneyState(t), round = st.round;
  const opp = tourneyOpponent(t, round);
  const allyRank = save.team[allyId].rank;
  const rank = Math.min(5, allyRank + (round === 2 ? 1 : 0));
  // Quarter final: 1 Pokémon, semi final: 2, final: 3 (all different).
  const picks = shuffle(opp.team).slice(0, TOURNEY_FOES[round]);
  const foes = picks.map((id) => { const maxHp = 50 + 8 * allyRank + 6 * round + rand(0, 8); return { mon: DEX[id], level: rank, maxHp, hp: maxHp }; });
  const words = T.regions.flatMap((r) => JOURNEYS[r].words);
  runBattle({
    mode: 'trainer', trainer: opp.name, foes, allyId, back: 'reading',
    party: Object.keys(save.team).map(Number), foePower: TOURNEY_HIT[round],
    title: `🏆 ${ROUND_NAMES[round]}`,
    ask: (panel, move, tok) => {
      const tricky = shuffle(trickyList(save, 'words').map((t) => t.key).filter((w) => words.includes(w))).slice(0, 1);
      const rest = shuffle(words.filter((w) => !tricky.includes(w))).slice(0, TOURNEY_QUESTIONS - tricky.length);
      return wordQuiz(panel, shuffle([...tricky, ...rest]), words, `Read to power up <b>${move.name}</b>!`, tok);
    },
    onRun: () => screenTournament(t),
    onWin: (panel, pm) => tourneyRoundWon(t, round, panel, pm),
  });
}

function tourneyRoundWon(t, round, panel, pm) {
  const T = TOURNAMENTS[t], st = tourneyState(t);
  const opp = tourneyOpponent(t, round);
  if (round < 2) {
    st.round = round + 1;
    persist();
    panel.innerHTML = `<div class="center-msg"><div class="big-emoji">🎉</div><h2>You beat ${opp.name}!</h2>
      <p>${pm.name} wins the ${ROUND_NAMES[round]}! Next: the ${ROUND_NAMES[round + 1]}.</p>
      <div class="btn-row"><button class="btn green big" id="onward">Continue 🏆</button></div></div>`;
    $('#onward').onclick = () => { Sound.tap(); screenTournament(t); };
    return;
  }
  // won the final
  const firstWin = !st.won;
  st.won = true; st.round = 0;
  const prize = T.prize ? DEX[T.prize] : null;
  const newPrize = prize && !save.caught[prize.id];
  if (newPrize) { save.caught[prize.id] = 1; save.team[prize.id] = { rank: 5, rounds: 0 }; }
  persist();
  Sound.levelUp(); setTimeout(confetti, 600); setTimeout(confetti, 1400);
  panel.innerHTML = `<div class="center-msg">
      <h2>🏆 Tournament ${t + 1} Champion!</h2>
      <div class="prize-reveal">${prize ? monSVG(prize) : trophySVG()}</div>
      <p>${newPrize ? `You won the Legendary <b>${prize.name}</b>! It joins your team at Rank 5 ★★★★★` : prize ? `You beat ${opp.name} again. Amazing reading!` : (firstWin ? 'You won the Champion Trophy!' : 'Champion again. Amazing reading!')}</p>
      <div class="btn-row"><button class="btn grey" data-go="reading">Map 🗺️</button>${newPrize ? `<button class="btn green big" id="use-prize">Use ${prize.name}</button>` : ''}</div>
    </div>`;
  $('#use-prize')?.addEventListener('click', () => { Sound.tap(); useMon(prize.id); });
}
