// PokeMath cartoon art — simple, original drawings made from shapes.
// The four partners are drawn by hand; every other creature is built
// from its type (colors + features like flames, leaves, wings…).

const OL = '#2d2a3e';
const S = `stroke="${OL}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const VIEWBOX = '-10 -20 220 220';

function hashStr(s) {
  let h = 2166136261;
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rngFrom(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;
const hsl = (h, s, l) => `hsl(${Math.round(h)},${Math.round(s)}%,${Math.round(Math.max(0, Math.min(100, l)))}%)`;

const TYPE_HSL = {
  normal: [35, 32, 74], fire: [22, 92, 62], water: [205, 80, 64], grass: [125, 45, 58],
  electric: [48, 100, 58], ice: [190, 70, 80], fighting: [18, 52, 56], poison: [280, 50, 66],
  ground: [38, 58, 62], flying: [228, 70, 80], psychic: [330, 80, 74], bug: [78, 58, 50],
  rock: [40, 24, 58], ghost: [258, 42, 60], dragon: [232, 68, 66],
};

const SHAPE_OVERRIDE = {
  serpent: [23, 24, 95, 130, 147, 148],
  fish: [116, 117, 118, 119, 129],
  ghost: [92, 93, 94],
  star: [120, 121],
  blob: [10, 11, 13, 14, 35, 36, 39, 40, 43, 44, 50, 51, 74, 81, 82, 88, 89, 90, 91, 100, 101, 102, 109, 110, 113, 114, 132, 137, 138, 139, 143],
  quad: [2, 3, 19, 20, 27, 29, 30, 32, 33, 37, 38, 46, 47, 52, 53, 58, 59, 77, 78, 79, 86, 87, 98, 99, 108, 111, 128, 131, 133, 134, 135, 136, 140],
  biped: [5, 6, 8, 9, 15, 26, 28, 31, 34, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 96, 97, 104, 105, 106, 107, 112, 115, 122, 123, 124, 125, 126, 127, 141, 149, 150, 151],
};
const SHAPE_OF = {};
for (const [shape, ids] of Object.entries(SHAPE_OVERRIDE)) ids.forEach((id) => (SHAPE_OF[id] = shape));
const BIRDS = new Set([16, 17, 18, 21, 22, 83, 84, 85, 142, 144, 145, 146]);

// ---------- small building blocks ----------
const at = (h, deg, dist) => {
  const a = (deg * Math.PI) / 180;
  return [r1(h.x + Math.sin(a) * h.r * dist), r1(h.y - Math.cos(a) * h.r * dist)];
};
function eyes(h, rng) {
  const er = h.r * (0.14 + rng() * 0.05), dx = h.r * 0.38, y = h.y - h.r * 0.05;
  let s = '';
  for (const sx of [-1, 1]) {
    const ex = r1(h.x + sx * dx);
    s += `<ellipse cx="${ex}" cy="${r1(y)}" rx="${r1(er)}" ry="${r1(er * 1.2)}" fill="${OL}"/>`;
    s += `<circle cx="${r1(ex - er * 0.3)}" cy="${r1(y - er * 0.45)}" r="${r1(er * 0.4)}" fill="#fff"/>`;
  }
  return s;
}
function smile(h) {
  const w = h.r * 0.22, y = h.y + h.r * 0.32;
  return `<path d="M${r1(h.x - w)} ${r1(y)} Q${r1(h.x)} ${r1(y + w * 0.9)} ${r1(h.x + w)} ${r1(y)}" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`;
}
function beak(h) {
  const y = h.y + h.r * 0.22, w = h.r * 0.2;
  return `<path d="M${r1(h.x - w)} ${r1(y)} L${r1(h.x + w)} ${r1(y)} L${r1(h.x)} ${r1(y + w * 1.4)} Z" fill="#ffb02e" ${S}/>`;
}
function cheeks(h) {
  return [-1, 1].map((sx) => `<ellipse cx="${r1(h.x + sx * h.r * 0.62)}" cy="${r1(h.y + h.r * 0.2)}" rx="${r1(h.r * 0.13)}" ry="${r1(h.r * 0.09)}" fill="#ff7a8a" opacity=".55"/>`).join('');
}
function flame(x, y, s) {
  const p = (k) => `M${r1(x)} ${r1(y)} C${r1(x - s * k)} ${r1(y - s * 0.4 * k)} ${r1(x - s * 0.35 * k)} ${r1(y - s * 1.4 * k)} ${r1(x)} ${r1(y - s * 2 * k)} C${r1(x + s * 0.35 * k)} ${r1(y - s * 1.3 * k)} ${r1(x + s * k)} ${r1(y - s * 0.4 * k)} ${r1(x)} ${r1(y)} Z`;
  return `<path d="${p(1)}" fill="#ff6a2b" ${S}/><path d="${p(0.55)}" fill="#ffd43b"/>`;
}
function thickPath(d, color, w) {
  return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w + 6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}
function earPair(h, baseA, baseB, tipDeg, tipDist, fill, tipFill) {
  let s = '';
  for (const sx of [-1, 1]) {
    const b1 = at(h, sx * baseA, 0.92), b2 = at(h, sx * baseB, 0.92), t = at(h, sx * tipDeg, tipDist);
    s += `<path d="M${b1} L${t} L${b2} Z" fill="${fill}" ${S}/>`;
    if (tipFill) {
      const m1 = [r1(t[0] + (b1[0] - t[0]) * 0.35), r1(t[1] + (b1[1] - t[1]) * 0.35)];
      const m2 = [r1(t[0] + (b2[0] - t[0]) * 0.35), r1(t[1] + (b2[1] - t[1]) * 0.35)];
      s += `<path d="M${m1} L${t} L${m2} Z" fill="${tipFill}" ${S}/>`;
    }
  }
  return s;
}

// ---------- body shapes ----------
function buildLayout(shape, rng, c) {
  const L = { back: '', headBack: '', body: '', bodyFront: '', limbs: '', headShape: '', headFront: '', head: null, blobHead: false, float: false, box: null, tail: null };
  const feet = (x, y, spread) => [-1, 1].map((sx) => `<ellipse cx="${r1(x + sx * spread)}" cy="${r1(y)}" rx="15" ry="8" fill="${c.main}" ${S}/>`).join('');
  if (shape === 'blob') {
    const rx = 52 + rng() * 10, ry = 48 + rng() * 8, cy = 128;
    L.body = `<ellipse cx="100" cy="${cy}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${c.main}" ${S}/>`;
    L.bodyFront = `<ellipse cx="100" cy="${r1(cy + ry * 0.58)}" rx="${r1(rx * 0.5)}" ry="${r1(ry * 0.3)}" fill="${c.belly}"/>`;
    L.limbs = feet(100, cy + ry - 3, rx * 0.45);
    L.head = { x: 100, y: cy - ry * 0.12, r: Math.min(rx, ry) * 0.85 };
    L.blobHead = true; L.box = { cx: 100, cy, rx, ry };
    L.tail = { x: 100 + rx * 0.8, y: cy + ry * 0.35 };
  } else if (shape === 'biped') {
    const brx = 38 + rng() * 8, bry = 34 + rng() * 6, cy = 148, hr = 36 + rng() * 7;
    L.body = `<ellipse cx="100" cy="${cy}" rx="${r1(brx)}" ry="${r1(bry)}" fill="${c.main}" ${S}/>`;
    L.bodyFront = `<ellipse cx="100" cy="${r1(cy + 6)}" rx="${r1(brx * 0.62)}" ry="${r1(bry * 0.7)}" fill="${c.belly}"/>`;
    L.limbs = feet(100, cy + bry - 2, brx * 0.55) + [-1, 1].map((sx) => `<ellipse cx="${r1(100 + sx * (brx - 2))}" cy="${cy - 4}" rx="10" ry="15" transform="rotate(${sx * -20} ${r1(100 + sx * (brx - 2))} ${cy - 4})" fill="${c.main}" ${S}/>`).join('');
    L.head = { x: 100, y: cy - bry - hr * 0.6, r: hr };
    L.box = { cx: 100, cy, rx: brx, ry: bry };
    L.tail = { x: 100 + brx * 0.7, y: cy + bry * 0.5 };
  } else if (shape === 'quad') {
    const cx = 112, cy = 142, rx = 54 + rng() * 6, ry = 30 + rng() * 5, hr = 34 + rng() * 6;
    L.body = `<ellipse cx="${cx}" cy="${cy}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${c.main}" ${S}/>`;
    L.bodyFront = `<ellipse cx="${cx - 8}" cy="${r1(cy + ry * 0.4)}" rx="${r1(rx * 0.55)}" ry="${r1(ry * 0.45)}" fill="${c.belly}"/>`;
    L.limbs = [74, 96, 132, 154].map((x) => `<ellipse cx="${x}" cy="${r1(cy + ry - 2)}" rx="11" ry="14" fill="${c.main}" ${S}/>`).join('');
    L.head = { x: 64, y: 102, r: hr };
    L.box = { cx, cy, rx, ry };
    L.tail = { x: cx + rx * 0.9, y: cy - ry * 0.2 };
  } else if (shape === 'serpent') {
    const d = 'M45 168 Q100 196 152 168 Q184 142 130 132 Q84 122 94 100';
    L.body = thickPath(d, c.main, 30);
    L.bodyFront = `<path d="${d}" fill="none" stroke="${c.belly}" stroke-width="9" stroke-linecap="round" stroke-dasharray="10 9"/>`;
    L.head = { x: 94, y: 80, r: 34 };
    L.box = { cx: 110, cy: 160, rx: 60, ry: 25 };
    L.tail = { x: 45, y: 168 };
  } else if (shape === 'fish') {
    L.back = `<path d="M148 118 L194 80 L184 118 L194 156 Z" fill="${c.dark}" ${S}/><path d="M74 80 Q100 42 128 82 Z" fill="${c.dark}" ${S}/>`;
    L.body = `<ellipse cx="96" cy="118" rx="62" ry="44" fill="${c.main}" ${S}/>`;
    L.bodyFront = `<ellipse cx="92" cy="140" rx="40" ry="17" fill="${c.belly}"/><path d="M100 128 Q118 140 106 152" fill="${c.dark}" ${S}/>`;
    L.head = { x: 82, y: 110, r: 40 };
    L.blobHead = true; L.float = true; L.box = { cx: 96, cy: 118, rx: 62, ry: 44 };
  } else if (shape === 'ghost') {
    let d = 'M45 122 A55 55 0 0 1 155 122 L155 170';
    const n = 6, w = 110 / n;
    for (let i = 0; i < n; i++) d += ` Q${r1(155 - w * i - w / 2)} ${i % 2 ? 158 : 184} ${r1(155 - w * (i + 1))} 170`;
    d += ' Z';
    L.body = `<path d="${d}" fill="${c.main}" ${S}/>`;
    L.limbs = [-1, 1].map((sx) => `<ellipse cx="${100 + sx * 62}" cy="132" rx="16" ry="11" transform="rotate(${sx * 30} ${100 + sx * 62} 132)" fill="${c.main}" ${S}/>`).join('');
    L.head = { x: 100, y: 112, r: 46 };
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 130, rx: 55, ry: 45 };
  } else if (shape === 'star') {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10 - Math.PI / 2, rr = i % 2 ? 36 : 80;
      pts.push(`${r1(100 + Math.cos(a) * rr)},${r1(118 + Math.sin(a) * rr)}`);
    }
    L.body = `<polygon points="${pts.join(' ')}" fill="${c.main}" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`;
    L.head = { x: 100, y: 118, r: 34 };
    L.headFront = `<path d="M100 76 L110 90 L100 104 L90 90 Z" fill="#ff4d6d" ${S}/>`;
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 118, rx: 50, ry: 50 };
  }
  return L;
}

// ---------- type features ----------
function addTypeFeature(t, L, c, rng, shape, mon) {
  const h = L.head, b = L.box;
  const acc = TYPE_HSL[t];
  const accMain = hsl(acc[0], acc[1], acc[2] - 4), accDark = hsl(acc[0], acc[1], acc[2] - 25);
  const hasBody = ['biped', 'quad', 'blob'].includes(shape);
  switch (t) {
    case 'fire':
      if (hasBody && !L.tailUsed) {
        const { x, y } = L.tail;
        L.back += thickPath(`M${r1(x - 10)} ${r1(y)} Q${r1(x + 30)} ${r1(y + 5)} ${r1(x + 32)} ${r1(y - 28)}`, c.main, 13);
        L.back += flame(x + 32, y - 26, 13);
        L.tailUsed = true;
      } else {
        const [fx, fy] = at(h, 0, 0.85);
        L.headBack += flame(fx, fy, 16);
      }
      break;
    case 'water': {
      const p1 = at(h, -28, 0.95), p2 = at(h, 28, 0.95);
      L.headBack += `<path d="M${p1} Q${r1(h.x)} ${r1(h.y - h.r * 1.75)} ${p2} Z" fill="${hsl(200, 85, 75)}" ${S}/>`;
      if (hasBody && !L.tailUsed && shape !== 'blob') {
        const { x, y } = L.tail;
        L.back += thickPath(`M${r1(x - 8)} ${r1(y)} C${r1(x + 35)} ${r1(y + 6)} ${r1(x + 38)} ${r1(y - 26)} ${r1(x + 22)} ${r1(y - 26)} C${r1(x + 12)} ${r1(y - 26)} ${r1(x + 12)} ${r1(y - 12)} ${r1(x + 22)} ${r1(y - 12)}`, hsl(200, 85, 75), 11);
        L.tailUsed = true;
      }
      break;
    }
    case 'grass':
      if (shape === 'quad' && !L.bulb) {
        const x = b.cx + 6, y = b.cy - b.ry + 6;
        L.back += `<path d="M${x - 32} ${y + 10} C${x - 34} ${y - 30} ${x - 6} ${y - 52} ${x} ${y - 56} C${x + 6} ${y - 52} ${x + 34} ${y - 30} ${x + 32} ${y + 10} Z" fill="hsl(125,48%,46%)" ${S}/>`;
        L.back += `<path d="M${x} ${y - 52} L${x} ${y + 4} M${x - 18} ${y - 30} Q${x - 10} ${y - 12} ${x - 4} ${y + 2} M${x + 18} ${y - 30} Q${x + 10} ${y - 12} ${x + 4} ${y + 2}" fill="none" stroke="hsl(125,45%,30%)" stroke-width="2.5"/>`;
        L.bulb = true;
      } else {
        const [tx, ty] = at(h, 8, 0.9);
        L.headBack += `<path d="M${tx} ${ty} Q${r1(tx + 26)} ${r1(ty - 28)} ${r1(tx + 6)} ${r1(ty - 48)} Q${r1(tx - 16)} ${r1(ty - 24)} ${tx} ${ty} Z" fill="hsl(125,55%,48%)" ${S}/>`;
        L.headBack += `<path d="M${tx} ${ty} Q${r1(tx + 6)} ${r1(ty - 24)} ${r1(tx + 6)} ${r1(ty - 44)}" fill="none" stroke="hsl(125,45%,30%)" stroke-width="2.5"/>`;
      }
      break;
    case 'electric':
      if (!L.ears && !BIRDS.has(mon.id) && shape !== 'star') {
        L.headBack += earPair(h, 18, 48, 34, 1.9, c.main, OL);
        L.ears = true;
      }
      if (hasBody && !L.tailUsed) {
        const { x, y } = L.tail;
        L.back += `<path d="M${r1(x - 8)} ${r1(y)} L${r1(x + 18)} ${r1(y - 14)} L${r1(x + 10)} ${r1(y - 22)} L${r1(x + 34)} ${r1(y - 44)} L${r1(x + 26)} ${r1(y - 50)} L${r1(x + 52)} ${r1(y - 76)} L${r1(x + 16)} ${r1(y - 52)} L${r1(x + 24)} ${r1(y - 46)} L${r1(x - 2)} ${r1(y - 28)} L${r1(x + 4)} ${r1(y - 22)} L${r1(x - 16)} ${r1(y - 10)} Z" fill="hsl(48,100%,58%)" ${S}/>`;
        L.tailUsed = true;
      } else if (!hasBody) {
        L.headFront += `<path d="M${r1(h.x - 8)} ${r1(h.y - h.r * 0.75)} l10 0 l-6 10 l10 0 l-16 18 l5 -13 l-9 0 Z" fill="#ffd43b" ${S}/>`;
      }
      break;
    case 'flying': {
      const wing = BIRDS.has(mon.id) ? c.belly : hsl(acc[0], 60, 86);
      for (const sx of [-1, 1]) {
        const wx = r1(b.cx + sx * (b.rx + 14)), wy = r1(b.cy - b.ry * 0.5);
        L.back += `<g transform="rotate(${sx * -28} ${wx} ${wy})"><ellipse cx="${wx}" cy="${wy}" rx="34" ry="18" fill="${wing}" ${S}/><ellipse cx="${r1(wx + sx * 6)}" cy="${r1(wy + 12)}" rx="26" ry="12" fill="${wing}" ${S}/></g>`;
      }
      L.wings = true;
      break;
    }
    case 'bug': {
      for (const sx of [-1, 1]) {
        const [ax, ay] = at(h, sx * 22, 0.9);
        const ex = r1(ax + sx * 18), ey = r1(ay - 34);
        L.headBack += `<path d="M${ax} ${ay} Q${r1(ax + sx * 2)} ${r1(ay - 22)} ${ex} ${ey}" fill="none" stroke="${OL}" stroke-width="3.5"/><circle cx="${ex}" cy="${ey}" r="6" fill="${accDark}" ${S}/>`;
      }
      if (hasBody) {
        const offs = L.blobHead ? [0.42, 0.66] : [-0.3, 0.1, 0.5];
        for (const o of offs) {
          const y = b.cy + b.ry * o, half = b.rx * Math.sqrt(1 - o * o) * 0.7;
          L.bodyFront += `<path d="M${r1(b.cx - half)} ${r1(y)} Q${r1(b.cx)} ${r1(y + 9)} ${r1(b.cx + half)} ${r1(y)}" fill="none" stroke="${c.dark}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
        }
      }
      break;
    }
    case 'poison': {
      const lo = L.blobHead ? 0.3 : -0.2, hi = 0.65;
      for (let i = 0; i < 4; i++) {
        const oy = lo + rng() * (hi - lo), ox = (rng() - 0.5) * 1.2 * Math.sqrt(1 - oy * oy);
        L.bodyFront += `<circle cx="${r1(b.cx + ox * b.rx)}" cy="${r1(b.cy + oy * b.ry)}" r="${r1(4 + rng() * 5)}" fill="hsl(285,45%,42%)" opacity=".75"/>`;
      }
      break;
    }
    case 'ground':
    case 'dragon':
    case 'rock':
      if (t === 'rock') {
        for (let i = 0; i < 3; i++) {
          const oy = (L.blobHead ? 0.35 : -0.1) + rng() * 0.4, ox = (rng() - 0.5) * 1.1 * Math.sqrt(1 - oy * oy);
          const x = b.cx + ox * b.rx, y = b.cy + oy * b.ry, s = 6 + rng() * 5;
          L.bodyFront += `<path d="M${r1(x - s)} ${r1(y)} L${r1(x - s * 0.4)} ${r1(y - s)} L${r1(x + s * 0.8)} ${r1(y - s * 0.6)} L${r1(x + s)} ${r1(y + s * 0.4)} L${r1(x)} ${r1(y + s)} Z" fill="hsl(40,10%,62%)" ${S}/>`;
        }
        break;
      }
      if (t === 'dragon' || shape === 'blob') {
        L.headBack += earPair(h, 14, 30, 24, 1.45, hsl(45, 80, 82), null);
      }
      if (shape !== 'fish' && shape !== 'star') {
        // spikes along the back
        const angles = shape === 'quad' ? [-40, -10, 20, 50] : [-75, -50, 50, 75];
        for (const a of angles) {
          const rad = (a * Math.PI) / 180;
          const px = b.cx + Math.sin(rad) * b.rx, py = b.cy - Math.cos(rad) * b.ry;
          const nx = Math.sin(rad), ny = -Math.cos(rad);
          const tx = -ny, ty = nx;
          L.back += `<path d="M${r1(px - tx * 10)} ${r1(py - ty * 10)} L${r1(px + nx * 20)} ${r1(py + ny * 20)} L${r1(px + tx * 10)} ${r1(py + ty * 10)} Z" fill="${t === 'dragon' ? hsl(45, 80, 80) : accDark}" ${S}/>`;
        }
      }
      break;
    case 'ghost':
      for (const a of [-30, 0, 30]) {
        const [bx1, by1] = at(h, a - 14, 0.9), [bx2, by2] = at(h, a + 14, 0.9), [tx, ty] = at(h, a * 1.3, 1.45);
        L.headBack += `<path d="M${bx1} ${by1} L${tx} ${ty} L${bx2} ${by2} Z" fill="${c.main}" ${S}/>`;
      }
      break;
    case 'psychic': {
      const y = h.y - h.r * 0.58;
      L.headFront += `<path d="M${r1(h.x)} ${r1(y - 10)} L${r1(h.x + 8)} ${r1(y)} L${r1(h.x)} ${r1(y + 10)} L${r1(h.x - 8)} ${r1(y)} Z" fill="#ff4d8d" ${S}/>`;
      break;
    }
    case 'fighting': {
      const x = h.x, y = h.y, r = h.r;
      L.headFront += `<path d="M${r1(x - r * 0.9)} ${r1(y - r * 0.38)} Q${r1(x)} ${r1(y - r * 0.5)} ${r1(x + r * 0.9)} ${r1(y - r * 0.38)} L${r1(x + r * 0.84)} ${r1(y - r * 0.56)} Q${r1(x)} ${r1(y - r * 0.7)} ${r1(x - r * 0.84)} ${r1(y - r * 0.56)} Z" fill="#ef4444" ${S}/>`;
      L.headFront += `<path d="M${r1(x + r * 0.86)} ${r1(y - r * 0.47)} l16 8 l-4 -14 Z" fill="#ef4444" ${S}/>`;
      break;
    }
    case 'ice':
      for (const a of [-26, 0, 26]) {
        const [bx, by] = at(h, a, 0.85), s = a === 0 ? 14 : 10;
        L.headBack += `<path d="M${bx} ${r1(by - s * 2.2)} L${r1(bx + s * 0.6)} ${by} L${bx} ${r1(by + s * 0.4)} L${r1(bx - s * 0.6)} ${by} Z" fill="hsl(190,90%,88%)" ${S}/>`;
      }
      break;
    case 'normal':
      if (!L.ears && !BIRDS.has(mon.id) && shape !== 'star' && shape !== 'fish') {
        if (rng() < 0.5) {
          for (const sx of [-1, 1]) {
            const [ex, ey] = at(h, sx * 42, 1.0);
            L.headBack += `<circle cx="${ex}" cy="${ey}" r="${r1(h.r * 0.32)}" fill="${c.main}" ${S}/><circle cx="${ex}" cy="${ey}" r="${r1(h.r * 0.17)}" fill="${c.belly}"/>`;
          }
        } else {
          L.headBack += earPair(h, 22, 56, 42, 1.55, c.main, c.belly);
        }
        L.ears = true;
      }
      if ((shape === 'quad' || shape === 'biped') && !L.tailUsed) {
        const { x, y } = L.tail;
        L.back += thickPath(`M${r1(x - 8)} ${r1(y)} Q${r1(x + 34)} ${r1(y - 2)} ${r1(x + 28)} ${r1(y - 34)}`, c.main, 11);
        L.tailUsed = true;
      }
      break;
  }
}

// ---------- hand-drawn partners ----------
const STARTER_ART = {
  25: () => `
    <path d="M136 150 L160 128 L150 120 L176 92 L166 86 L192 52 L146 88 L156 95 L130 120 L140 128 L124 140 Z" fill="#ffd43b" ${S}/>
    <path d="M124 140 L140 128 L130 120 L120 128 Z" fill="#9a6a2a" ${S}/>
    <path d="M72 78 L42 14 L94 62 Z" fill="#ffd43b" ${S}/><path d="M42 14 L52 36 L60 30 Z" fill="${OL}" ${S}/>
    <path d="M128 78 L158 14 L106 62 Z" fill="#ffd43b" ${S}/><path d="M158 14 L148 36 L140 30 Z" fill="${OL}" ${S}/>
    <ellipse cx="100" cy="145" rx="46" ry="42" fill="#ffd43b" ${S}/>
    <ellipse cx="78" cy="142" rx="10" ry="14" transform="rotate(25 78 142)" fill="#ffd43b" ${S}/>
    <ellipse cx="122" cy="142" rx="10" ry="14" transform="rotate(-25 122 142)" fill="#ffd43b" ${S}/>
    <ellipse cx="80" cy="184" rx="15" ry="7" fill="#ffd43b" ${S}/><ellipse cx="120" cy="184" rx="15" ry="7" fill="#ffd43b" ${S}/>
    <ellipse cx="100" cy="92" rx="50" ry="42" fill="#ffd43b" ${S}/>
    <ellipse cx="81" cy="86" rx="8" ry="9" fill="${OL}"/><circle cx="78" cy="83" r="3.2" fill="#fff"/>
    <ellipse cx="119" cy="86" rx="8" ry="9" fill="${OL}"/><circle cx="116" cy="83" r="3.2" fill="#fff"/>
    <ellipse cx="100" cy="97" rx="2.5" ry="2" fill="${OL}"/>
    <path d="M90 104 Q95 111 100 104 Q105 111 110 104" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="63" cy="103" r="10" fill="#f0524f" ${S}/><circle cx="137" cy="103" r="10" fill="#f0524f" ${S}/>`,
  4: () => `
    ${thickPath('M122 168 Q168 172 170 114', '#f7864a', 15)}
    ${flame(170, 116, 14)}
    <ellipse cx="100" cy="146" rx="40" ry="38" fill="#f7864a" ${S}/>
    <ellipse cx="100" cy="154" rx="26" ry="26" fill="#ffe0a3"/>
    <ellipse cx="64" cy="140" rx="10" ry="15" transform="rotate(20 64 140)" fill="#f7864a" ${S}/>
    <ellipse cx="136" cy="140" rx="10" ry="15" transform="rotate(-20 136 140)" fill="#f7864a" ${S}/>
    <ellipse cx="82" cy="183" rx="16" ry="8" fill="#f7864a" ${S}/><ellipse cx="118" cy="183" rx="16" ry="8" fill="#f7864a" ${S}/>
    <ellipse cx="100" cy="82" rx="44" ry="40" fill="#f7864a" ${S}/>
    <ellipse cx="82" cy="78" rx="8" ry="11" fill="${OL}"/><circle cx="79" cy="74" r="3.4" fill="#fff"/>
    <ellipse cx="118" cy="78" rx="8" ry="11" fill="${OL}"/><circle cx="115" cy="74" r="3.4" fill="#fff"/>
    <path d="M80 98 Q100 116 120 98" fill="#c23b3b" ${S}/>
    <circle cx="68" cy="94" r="6" fill="#ff7a8a" opacity=".5"/><circle cx="132" cy="94" r="6" fill="#ff7a8a" opacity=".5"/>`,
  7: () => `
    ${thickPath('M128 166 C166 172 176 140 156 134 C142 131 140 150 153 150', '#5bb6f0', 13)}
    <ellipse cx="100" cy="146" rx="50" ry="44" fill="#b5743a" ${S}/>
    <ellipse cx="100" cy="146" rx="44" ry="38" fill="none" stroke="#f4e1a6" stroke-width="6"/>
    <ellipse cx="100" cy="150" rx="33" ry="34" fill="#f4e1a6" ${S}/>
    <path d="M72 136 Q100 142 128 136 M68 154 Q100 160 132 154 M74 170 Q100 176 126 170" fill="none" stroke="#c9a85c" stroke-width="3"/>
    <ellipse cx="56" cy="140" rx="11" ry="15" transform="rotate(25 56 140)" fill="#5bb6f0" ${S}/>
    <ellipse cx="144" cy="140" rx="11" ry="15" transform="rotate(-25 144 140)" fill="#5bb6f0" ${S}/>
    <ellipse cx="80" cy="186" rx="16" ry="8" fill="#5bb6f0" ${S}/><ellipse cx="120" cy="186" rx="16" ry="8" fill="#5bb6f0" ${S}/>
    <circle cx="100" cy="82" r="42" fill="#5bb6f0" ${S}/>
    <ellipse cx="84" cy="80" rx="8" ry="10" fill="${OL}"/><circle cx="81" cy="76" r="3.4" fill="#fff"/>
    <ellipse cx="116" cy="80" rx="8" ry="10" fill="${OL}"/><circle cx="113" cy="76" r="3.4" fill="#fff"/>
    <path d="M86 100 Q100 112 114 100" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="70" cy="96" r="6" fill="#ff7a8a" opacity=".5"/><circle cx="130" cy="96" r="6" fill="#ff7a8a" opacity=".5"/>`,
  1: () => `
    <path d="M96 124 C90 82 120 62 130 54 C140 62 172 82 164 124 Z" fill="#4fa24a" ${S}/>
    <path d="M130 58 L130 120 M112 84 Q120 104 126 120 M148 84 Q140 104 134 120" fill="none" stroke="#2f6b2c" stroke-width="2.5"/>
    <ellipse cx="112" cy="146" rx="58" ry="32" fill="#6cc5a8" ${S}/>
    <ellipse cx="140" cy="140" rx="9" ry="6" fill="#3e9c80"/><ellipse cx="96" cy="152" rx="7" ry="5" fill="#3e9c80"/><ellipse cx="156" cy="156" rx="6" ry="4" fill="#3e9c80"/>
    ${[74, 96, 132, 154].map((x) => `<ellipse cx="${x}" cy="174" rx="12" ry="13" fill="#6cc5a8" ${S}/>`).join('')}
    <path d="M44 80 L40 56 L60 70 Z" fill="#6cc5a8" ${S}/><path d="M88 72 L98 50 L102 76 Z" fill="#6cc5a8" ${S}/>
    <ellipse cx="70" cy="104" rx="42" ry="35" fill="#6cc5a8" ${S}/>
    <ellipse cx="64" cy="82" rx="8" ry="5" fill="#3e9c80"/><ellipse cx="88" cy="86" rx="5" ry="4" fill="#3e9c80"/>
    <ellipse cx="54" cy="104" rx="9" ry="9" fill="#fff" ${S}/><circle cx="56" cy="105" r="5" fill="#c0392b"/><circle cx="55" cy="103" r="1.8" fill="#fff"/>
    <ellipse cx="86" cy="104" rx="9" ry="9" fill="#fff" ${S}/><circle cx="84" cy="105" r="5" fill="#c0392b"/><circle cx="83" cy="103" r="1.8" fill="#fff"/>
    <path d="M56 120 Q70 132 84 120" fill="#e86a6a" ${S}/>`,
};

// ---------- public ----------
const _svgCache = {};
function monSVG(mon) {
  if (_svgCache[mon.id]) return _svgCache[mon.id];
  let inner;
  let float = false;
  if (STARTER_ART[mon.id]) {
    inner = STARTER_ART[mon.id]();
  } else {
    const rng = rngFrom(hashStr(mon.name));
    const [t1, t2] = mon.types;
    const base = TYPE_HSL[t1];
    const hue = base[0] + (rng() - 0.5) * 26, sat = base[1], lit = base[2] + (rng() - 0.5) * 10;
    const c = { main: hsl(hue, sat, lit), belly: hsl(hue, sat * 0.55, Math.min(93, lit + 22)), dark: hsl(hue, sat, lit - 22) };
    let shape = SHAPE_OF[mon.id];
    if (!shape) {
      if (t1 === 'ghost') shape = 'ghost';
      else if (t1 === 'bug') shape = rng() < 0.6 ? 'blob' : 'quad';
      else { const r = rng(); shape = r < 0.4 ? 'biped' : r < 0.7 ? 'blob' : 'quad'; }
    }
    const L = buildLayout(shape, rng, c);
    float = L.float;
    addTypeFeature(t1, L, c, rng, shape, mon);
    if (t2) addTypeFeature(t2, L, c, rng, shape, mon);
    if (!L.ears && !BIRDS.has(mon.id) && rng() < 0.35 && shape !== 'star' && shape !== 'fish') {
      addTypeFeature('normal', L, c, rng, shape, mon);
    }
    if (BIRDS.has(mon.id)) {
      for (const a of [-14, 0, 14]) {
        const [bx, by] = at(L.head, a, 0.9), [tx, ty] = at(L.head, a * 1.8 + 6, 1.5);
        L.headBack += `<path d="M${bx} ${by} Q${r1((bx + tx) / 2 - 8)} ${r1((by + ty) / 2)} ${tx} ${ty} Q${r1((bx + tx) / 2 + 8)} ${r1((by + ty) / 2)} ${r1(bx + 6)} ${by} Z" fill="${c.dark}" ${S}/>`;
      }
    }
    const h = L.head;
    const headShape = L.blobHead ? '' : `<circle cx="${r1(h.x)}" cy="${r1(h.y)}" r="${r1(h.r)}" fill="${c.main}" ${S}/>`;
    const face = eyes(h, rng) + (BIRDS.has(mon.id) ? beak(h) : smile(h)) + cheeks(h);
    inner = L.back + (L.blobHead ? L.headBack : '') + L.body + L.bodyFront + L.limbs + (L.blobHead ? '' : L.headBack) + headShape + face + L.headFront;
  }
  const shadow = float
    ? '<ellipse cx="100" cy="194" rx="36" ry="6" fill="rgba(0,0,0,.12)"/>'
    : '<ellipse cx="100" cy="192" rx="56" ry="8" fill="rgba(0,0,0,.14)"/>';
  const svg = `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" aria-label="${mon.name}" role="img">${shadow}<g class="mon-body${float ? ' floaty' : ''}">${inner}</g></svg>`;
  _svgCache[mon.id] = svg;
  return svg;
}

function ballSVG(cls = '') {
  return `<svg class="ball ${cls}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#fff" stroke="${OL}" stroke-width="5"/><path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#ef4444" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/><line x1="5" y1="50" x2="95" y2="50" stroke="${OL}" stroke-width="7"/><circle cx="50" cy="50" r="13" fill="#fff" stroke="${OL}" stroke-width="6"/><circle cx="50" cy="50" r="5" fill="#fff" stroke="#ccc" stroke-width="2"/><ellipse cx="32" cy="27" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 32 27)"/></svg>`;
}

function dogSVG(name) {
  const fur = '#c98a4b', light = '#f3dcb8', ear = '#8a5a2b';
  return `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name}">
    <ellipse cx="100" cy="192" rx="50" ry="7" fill="rgba(0,0,0,.14)"/>
    ${thickPath('M128 168 Q160 168 162 128', fur, 12)}
    <ellipse cx="100" cy="148" rx="42" ry="40" fill="${fur}" ${S}/>
    <ellipse cx="100" cy="154" rx="24" ry="28" fill="${light}"/>
    <ellipse cx="82" cy="182" rx="13" ry="10" fill="${fur}" ${S}/><ellipse cx="118" cy="182" rx="13" ry="10" fill="${fur}" ${S}/>
    <path d="M70 116 Q100 128 130 116 L130 126 Q100 138 70 126 Z" fill="#ef4444" ${S}/>
    <circle cx="100" cy="136" r="7" fill="#ffd43b" ${S}/>
    <ellipse cx="100" cy="80" rx="42" ry="38" fill="${fur}" ${S}/>
    <ellipse cx="60" cy="86" rx="14" ry="30" transform="rotate(18 60 86)" fill="${ear}" ${S}/>
    <ellipse cx="140" cy="86" rx="14" ry="30" transform="rotate(-18 140 86)" fill="${ear}" ${S}/>
    <ellipse cx="100" cy="98" rx="22" ry="16" fill="${light}" ${S}/>
    <ellipse cx="84" cy="72" rx="6" ry="7" fill="${OL}"/><circle cx="82" cy="69" r="2.4" fill="#fff"/>
    <ellipse cx="116" cy="72" rx="6" ry="7" fill="${OL}"/><circle cx="114" cy="69" r="2.4" fill="#fff"/>
    <ellipse cx="100" cy="90" rx="8" ry="6" fill="${OL}"/>
    <path d="M100 96 L100 102 M90 102 Q100 110 110 102" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
    <path d="M95 106 Q100 118 105 106 Z" fill="#ff7a8a" ${S}/>
  </svg>`;
}

function trainerSVG(name) {
  const style = (typeof TRAINER_STYLE !== 'undefined' && TRAINER_STYLE[name]) || '';
  if (style === 'dog') return dogSVG(name);
  const rng = rngFrom(hashStr(name));
  const skins = ['#f9d4b4', '#e8b48f', '#c98d63', '#8d5a3b', '#f2c9a0'];
  const skin = skins[Math.floor(rng() * skins.length)];
  const shirt = hsl(rng() * 360, 70, 58), cap = hsl(rng() * 360, 75, 52);
  let hair = ['#3b2a20', '#7a4a20', '#e0b050', '#1d1d1d', '#a0442a'][Math.floor(rng() * 5)];
  if (style === 'grey') hair = '#cfd2d8';
  return `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name}">
    <ellipse cx="100" cy="192" rx="44" ry="7" fill="rgba(0,0,0,.14)"/>
    <rect x="80" y="146" width="16" height="40" rx="7" fill="#3b4a7a" ${S}/><rect x="104" y="146" width="16" height="40" rx="7" fill="#3b4a7a" ${S}/>
    <rect x="66" y="98" width="68" height="60" rx="22" fill="${shirt}" ${S}/>
    <rect x="52" y="104" width="16" height="44" rx="8" fill="${shirt}" ${S}/><rect x="132" y="104" width="16" height="44" rx="8" fill="${shirt}" ${S}/>
    <circle cx="60" cy="150" r="8" fill="${skin}" ${S}/><circle cx="140" cy="150" r="8" fill="${skin}" ${S}/>
    <ellipse cx="100" cy="66" rx="34" ry="36" fill="${hair}" ${S}/>
    <circle cx="100" cy="70" r="30" fill="${skin}" ${S}/>
    ${style === 'grey'
      ? `<path d="M68 66 Q66 34 100 34 Q134 34 132 66 Q122 48 100 50 Q78 48 68 66 Z" fill="${hair}" ${S}/>`
      : `<path d="M66 58 Q100 18 134 58 Z" fill="${cap}" ${S}/><path d="M100 54 L146 58 Q140 66 100 62 Z" fill="${cap}" ${S}/>`}
    <ellipse cx="89" cy="72" rx="4" ry="5" fill="${OL}"/><ellipse cx="111" cy="72" rx="4" ry="5" fill="${OL}"/>
    ${style === 'grey' ? `<circle cx="89" cy="72" r="9" fill="none" stroke="${OL}" stroke-width="2.5"/><circle cx="111" cy="72" r="9" fill="none" stroke="${OL}" stroke-width="2.5"/><path d="M98 72 L102 72" stroke="${OL}" stroke-width="2.5"/>` : ''}
    <path d="M90 86 Q100 94 110 86" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}
