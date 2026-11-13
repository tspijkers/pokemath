// mons.js — cartoon drawings for all 151, built from simple shapes.
// Each Pokémon has a short description in MON_SPEC:
//   [shape, main color, belly color, 'features…', options]
// Features are space separated, arguments after ':' (e.g. 'ears:cat spots:#4a6aa0:3').

const P = r1;
function hexHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}
const shade = (hex, dl) => { const [h, s, l] = hexHsl(hex); return hsl(h, s, l + dl); };
const lerp = (a, b, t) => [P(a[0] + (b[0] - a[0]) * t), P(a[1] + (b[1] - a[1]) * t)];
const ell = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${P(cx)}" cy="${P(cy)}" rx="${P(rx)}" ry="${P(ry)}" fill="${fill}" ${S} ${extra}/>`;
const circ = (cx, cy, r, fill) => `<circle cx="${P(cx)}" cy="${P(cy)}" r="${P(r)}" fill="${fill}" ${S}/>`;
const flat = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${P(cx)}" cy="${P(cy)}" rx="${P(rx)}" ry="${P(ry)}" fill="${fill}" ${extra}/>`;
const poly = (pts, fill) => `<path d="M${pts.map((p) => `${P(p[0])} ${P(p[1])}`).join(' L')} Z" fill="${fill}" ${S}/>`;

function ear2(h, a, b, tipDeg, tipDist, fill, tipFill, innerFill) {
  let s = '';
  for (const sx of [-1, 1]) {
    const b1 = at(h, sx * a, 0.9), b2 = at(h, sx * b, 0.9), t = at(h, sx * tipDeg, tipDist);
    s += `<path d="M${b1} L${t} L${b2} Z" fill="${fill}" ${S}/>`;
    if (tipFill) s += `<path d="M${lerp(t, b1, 0.38)} L${t} L${lerp(t, b2, 0.38)} Z" fill="${tipFill}" ${S}/>`;
    if (innerFill) {
      const g = [(b1[0] + b2[0] + t[0]) / 3, (b1[1] + b2[1] + t[1]) / 3];
      const sh = (p) => [P(g[0] + (p[0] - g[0]) * 0.5), P(g[1] + (p[1] - g[1]) * 0.5 + 4)];
      s += `<path d="M${sh(b1)} L${sh(t)} L${sh(b2)} Z" fill="${innerFill}"/>`;
    }
  }
  return s;
}
function leaf(x, y, deg, len, w, fill, rib = true) {
  const a = (deg * Math.PI) / 180, dx = Math.sin(a), dy = -Math.cos(a), px = -dy, py = dx;
  const tx = x + dx * len, ty = y + dy * len, mx = x + dx * len * 0.5, my = y + dy * len * 0.5;
  let s = `<path d="M${P(x)} ${P(y)} Q${P(mx + px * w)} ${P(my + py * w)} ${P(tx)} ${P(ty)} Q${P(mx - px * w)} ${P(my - py * w)} ${P(x)} ${P(y)} Z" fill="${fill}" ${S}/>`;
  if (rib) s += `<path d="M${P(x)} ${P(y)} L${P(x + dx * len * 0.8)} ${P(y + dy * len * 0.8)}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`;
  return s;
}
const feet2 = (x, y, spread, col) => [-1, 1].map((sx) => ell(x + sx * spread, y, 15, 8, col)).join('');
const arms2 = (cx, cy, dx, col) => [-1, 1].map((sx) => { const x = P(cx + sx * dx); return ell(x, cy, 10, 15, col, `transform="rotate(${sx * -25} ${x} ${P(cy)})"`); }).join('');

// ---------------- body shapes ----------------
const SHAPES = {
  blob(L, c, o) {
    const rx = o.rx || 56, ry = o.ry || 52, cy = o.cy || (o.nofeet ? 122 : 128);
    L.body = ell(100, cy, rx, ry, c.main);
    L.bodyFront = flat(100, cy + ry * 0.58, rx * 0.5, ry * 0.3, c.belly);
    if (o.nofeet) L.float = true; else L.limbs = feet2(100, cy + ry - 3, rx * 0.45, c.main);
    L.head = { x: 100, y: cy - ry * 0.12, r: Math.min(rx, ry) * 0.85 };
    L.blobHead = true; L.box = { cx: 100, cy, rx, ry };
    L.tail = { x: 100 + rx * 0.8, y: cy + ry * 0.35 };
    L.hands = [[100 - rx, cy + ry * 0.1], [100 + rx, cy + ry * 0.1]];
  },
  biped(L, c, o) {
    let brx = 40, bry = 36, cy = 148, hr = o.hr || 40;
    if (o.tall) { brx = 34; bry = 42; cy = 144; hr = o.hr || 34; }
    if (o.big) { brx = 50; bry = 42; cy = 144; hr = o.hr || 38; }
    L.body = ell(100, cy, brx, bry, o.bodyCol || c.main);
    L.bodyFront = flat(100, cy + 6, brx * 0.62, bry * 0.7, c.belly);
    L.limbs = feet2(100, cy + bry - 2, brx * 0.55, c.main) + arms2(100, cy - 4, brx - 2, c.main);
    L.head = { x: 100, y: cy - bry - hr * 0.6, r: hr };
    L.box = { cx: 100, cy, rx: brx, ry: bry };
    L.tail = { x: 100 + brx * 0.7, y: cy + bry * 0.5 };
    L.hands = [[100 - brx - 5, cy + 9], [100 + brx + 5, cy + 9]];
  },
  quad(L, c, o) {
    const cx = 112, cy = 142, rx = 56, ry = 32, hr = o.hr || 36;
    L.body = ell(cx, cy, rx, ry, c.main);
    L.bodyFront = flat(cx - 8, cy + ry * 0.4, rx * 0.55, ry * 0.45, c.belly);
    L.limbs = [74, 96, 132, 154].map((x) => ell(x, cy + ry - 2, 11, 14, c.main)).join('');
    L.head = { x: 64, y: 104, r: hr };
    L.box = { cx, cy, rx, ry };
    L.tail = { x: cx + rx * 0.9, y: cy - ry * 0.2 };
  },
  bird(L, c, o) {
    const s = o.big ? 1.15 : 1, cy = 140;
    L.back = '';
    L.body = ell(100, cy, 40 * s, 36 * s, c.main);
    L.bodyFront = flat(100, cy + 8, 26 * s, 24 * s, c.belly);
    L.limbs = `<path d="M88 ${P(cy + 32 * s)} L86 190 M112 ${P(cy + 32 * s)} L114 190" stroke="#e8a030" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M78 191 L94 191 M106 191 L122 191" stroke="#e8a030" stroke-width="5" stroke-linecap="round"/>`;
    L.head = { x: 100, y: cy - 36 * s - 16, r: 30 * s };
    L.box = { cx: 100, cy, rx: 40 * s, ry: 36 * s };
    L.tail = { x: 126, y: 162 };
    L.mouth = 'beak';
    L.isBird = true;
  },
  ball(L, c, o) {
    const r = o.r || 56;
    const cy = o.cy || (o.feet ? 180 - r : 112);
    L.body = circ(100, cy, r, c.main);
    if (!o.nobelly) L.bodyFront = flat(100, cy + r * 0.45, r * 0.55, r * 0.32, c.belly);
    if (o.feet) L.limbs += feet2(100, cy + r - 2, r * 0.45, c.main); else L.float = true;
    if (o.arms) {
      L.limbs += arms2(100, cy + r * 0.1, r * 0.98, c.main);
      L.hands = [[100 - r - 6, cy + r * 0.3], [100 + r + 6, cy + r * 0.3]];
    }
    L.head = { x: 100, y: cy - r * 0.08, r: r * 0.88 };
    L.blobHead = true; L.box = { cx: 100, cy, rx: r, ry: r };
    L.tail = { x: 100 + r * 0.85, y: cy + r * 0.4 };
  },
  worm(L, c) {
    L.body = circ(160, 166, 18, c.main) + circ(134, 160, 24, c.main) +
      flat(134, 172, 14, 7, c.belly) + flat(160, 176, 10, 5, c.belly);
    L.limbs = [[124, 184], [146, 184], [168, 184]].map(([x, y]) => ell(x, y, 6, 5, c.belly)).join('');
    L.head = { x: 82, y: 122, r: 42 };
    L.box = { cx: 134, cy: 160, rx: 40, ry: 24 };
    L.tail = { x: 176, y: 160 };
  },
  cocoon(L, c) {
    L.body = `<path d="M100 34 C142 54 154 120 140 162 Q100 190 60 162 C46 120 58 54 100 34 Z" fill="${c.main}" ${S}/>`;
    L.bodyFront = `<path d="M62 150 Q100 166 138 150 M72 76 Q100 88 128 76" fill="none" stroke="${c.dark}" stroke-width="3"/>`;
    L.head = { x: 100, y: 116, r: 36 };
    L.blobHead = true; L.box = { cx: 100, cy: 120, rx: 46, ry: 60 };
    L.mouth = 'none';
  },
  mound(L, c) {
    L.back = flat(100, 184, 76, 14, '#8a5a2a');
    L.body = `<path d="M66 186 L66 94 A34 34 0 0 1 134 94 L134 186 Z" fill="${c.main}" ${S}/>`;
    L.limbs = `<path d="M30 192 Q40 166 64 174 Q82 156 100 170 Q118 156 136 174 Q160 166 170 192 Z" fill="#7a4a2a" ${S}/>` +
      circ(56, 180, 6, '#5a3a1a') + circ(146, 182, 5, '#5a3a1a') + circ(100, 184, 4, '#5a3a1a');
    L.head = { x: 100, y: 96, r: 34 };
    L.blobHead = true; L.box = { cx: 100, cy: 130, rx: 34, ry: 50 };
    L.mouth = 'nose';
  },
  crab(L, c, o) {
    let back = '';
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 3; i++) back += thickPath(`M${100 + sx * (24 + i * 10)} 150 Q${100 + sx * (60 + i * 6)} ${152 + i * 4} ${100 + sx * (66 + i * 4)} 184`, c.main, 6);
      const big = o.bigclaw && sx < 0;
      const cx = 100 + sx * (big ? 74 : 70), cy = big ? 58 : 66, rx = big ? 34 : 22, ry = big ? 38 : 26;
      back += thickPath(`M${100 + sx * 40} 118 L${100 + sx * 64} ${cy + ry * 0.6}`, c.main, 12);
      back += ell(cx, cy, rx, ry, c.main);
      back += `<path d="M${P(cx - sx * rx * 0.1)} ${P(cy - ry)} L${P(cx + sx * rx * 0.25)} ${P(cy - ry * 0.05)} L${P(cx + sx * rx * 0.75)} ${P(cy - ry * 0.85)}" fill="#a7dcff" ${S}/>`;
      back += ell(cx, cy + ry * 0.35, rx * 0.6, ry * 0.4, c.belly);
    }
    L.back = back;
    L.body = ell(100, 128, 58, 40, c.main);
    L.bodyFront = flat(100, 150, 36, 12, c.belly);
    L.head = { x: 100, y: 120, r: 42 };
    L.blobHead = true; L.box = { cx: 100, cy: 128, rx: 58, ry: 40 };
  },
  clam(L, c, o) {
    let spikes = '';
    if (o.spiky) for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i / 8) * Math.PI, x = 100 + Math.cos(a) * 64, y = 128 + Math.sin(a) * 82;
      const nx = Math.cos(a), ny = Math.sin(a);
      spikes += poly([[x - ny * 8, y + nx * 8], [x + nx * 24, y + ny * 24], [x + ny * 8, y - nx * 8]], '#d8d0e8');
    }
    L.back = spikes;
    L.body = `<path d="M36 130 Q34 44 100 44 Q166 44 164 130 Z" fill="${c.main}" ${S}/>` +
      `<path d="M60 124 Q60 66 80 52 M100 124 L100 46 M140 124 Q140 66 120 52" fill="none" stroke="${c.dark}" stroke-width="3"/>`;
    L.bodyFront = flat(100, 126, 50, 26, c.belly);
    L.limbs = `<path d="M34 128 Q100 210 166 128 Q100 150 34 128 Z" fill="${c.main}" ${S}/>`;
    L.head = { x: 100, y: 122, r: 34 };
    L.blobHead = true; L.box = { cx: 100, cy: 128, rx: 64, ry: 50 };
  },
  jelly(L, c, o) {
    const n = o.tent || 2;
    let back = '';
    for (let i = 0; i < n; i++) {
      const x = 100 + (i - (n - 1) / 2) * (n > 2 ? 16 : 30);
      back += thickPath(`M${x} 126 Q${x - 12} 150 ${x + 4} 166 Q${x + 14} 178 ${x} 192`, c.dark, 7);
    }
    L.back = back;
    L.body = `<path d="M46 124 A54 54 0 0 1 154 124 Q100 140 46 124 Z" fill="${c.main}" fill-opacity=".85" ${S}/>`;
    const gems = o.gems || 2;
    let g = '';
    const gx = gems === 3 ? [72, 100, 128] : [78, 122];
    gx.forEach((x, i) => { g += circ(x, gems === 3 && i === 1 ? 82 : 96, 11, '#e8453a') + flat(x - 3, (gems === 3 && i === 1 ? 82 : 96) - 4, 4, 3, '#fff'); });
    L.bodyFront = flat(84, 92, 14, 8, '#fff', 'opacity=".35"') + g;
    L.limbs = ell(100, 132, 22, 10, c.belly);
    L.head = { x: 100, y: 136, r: 22 };
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 110, rx: 54, ry: 40 };
    L.eyes = 'dots'; L.mouth = 'none'; L.cheeks = null;
  },
  rock(L, c, o) {
    const rr = [56, 50, 58, 52, 55, 49, 57, 53, 56, 50, 58, 51];
    const pts = rr.map((r, i) => { const a = (i / 12) * Math.PI * 2; return [100 + Math.cos(a) * r, 112 + Math.sin(a) * r * 0.9]; });
    let arms = '';
    const pairs = o.arms === 4 ? [[-20, 1], [30, 0.85]] : [[0, 1]];
    for (const [dy, s] of pairs) for (const sx of [-1, 1]) {
      arms += thickPath(`M${100 + sx * 48} ${112 + dy} Q${100 + sx * 74} ${108 + dy} ${100 + sx * 80} ${86 + dy}`, c.main, 13 * s);
      arms += circ(100 + sx * 82, 80 + dy, 14 * s, c.main);
    }
    L.back = arms;
    L.body = poly(pts, c.main);
    L.head = { x: 100, y: 108, r: 46 };
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 112, rx: 54, ry: 48 };
  },
  bell(L, c, o) {
    L.back = leaf(56, 140, -110, 44, 14, '#4fa24a') + leaf(144, 140, 110, 44, 14, '#4fa24a');
    if (o.lid) L.back += leaf(100, 52, -20, 56, 22, '#4fa24a') + thickPath('M130 60 Q170 40 168 90', '#7a5a2a', 5);
    else L.back += thickPath('M100 56 Q100 24 124 26 Q138 28 134 40', '#4fa24a', 7);
    L.body = `<path d="M54 64 C30 120 64 186 100 186 C136 186 170 120 146 64 Q100 84 54 64 Z" fill="${c.main}" ${S}/>`;
    L.bodyFront = ell(100, 66, 46, 12, '#f28aa0') + flat(100, 68, 36, 7, '#c0506a') +
      `<path d="M66 150 Q100 170 134 150" fill="none" stroke="${c.dark}" stroke-width="3"/>`;
    L.head = { x: 100, y: 112, r: 40 };
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 124, rx: 50, ry: 60 };
    L.mouth = 'none';
  },
  sprout(L, c) {
    L.back = thickPath('M100 96 Q86 130 100 150 Q112 166 100 180', '#4fa24a', 8) +
      leaf(98, 136, -70, 40, 13, '#4fa24a') + leaf(102, 146, 70, 40, 13, '#4fa24a');
    L.limbs = thickPath('M100 180 Q84 186 76 190', '#a0703a', 5) + thickPath('M100 180 Q116 186 124 190', '#a0703a', 5);
    L.body = `<path d="M70 70 C68 30 132 30 130 70 C130 96 112 104 100 104 C88 104 70 96 70 70 Z" fill="${c.main}" ${S}/>`;
    L.bodyFront = flat(100, 92, 13, 9, '#f28aa0') + flat(100, 94, 7, 4, '#c0506a');
    L.head = { x: 100, y: 64, r: 30 };
    L.blobHead = true; L.box = { cx: 100, cy: 140, rx: 20, ry: 40 };
    L.mouth = 'none';
  },
  seahorse(L, c) {
    L.back = thickPath('M108 150 Q122 180 100 186 Q84 186 88 172 Q92 164 100 170', c.main, 16) +
      `<path d="M126 98 Q150 104 146 128 Q138 118 128 120 Z" fill="${c.belly}" ${S}/>`;
    L.body = ell(108, 124, 28, 38, c.main);
    L.bodyFront = `<path d="M92 104 Q86 124 96 150" fill="none" stroke="${c.belly}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M88 112 L98 112 M86 124 L96 124 M88 136 L98 136" stroke="${shade(c.belly, -20)}" stroke-width="2.5"/>`;
    L.head = { x: 100, y: 72, r: 30 };
    L.headFront = `<path d="M74 80 L44 76 L42 90 L72 94 Z" fill="${c.main}" ${S}/>` + flat(43, 83, 4, 7, OL);
    L.float = true; L.box = { cx: 108, cy: 124, rx: 28, ry: 38 };
    L.tail = { x: 120, y: 150 };
    L.mouth = 'none';
  },
  egg(L, c) {
    L.body = ell(100, 120, 42, 52, c.main);
    L.head = { x: 100, y: 118, r: 38 };
    L.blobHead = true; L.box = { cx: 100, cy: 120, rx: 42, ry: 52 };
  },
  dome(L, c) {
    L.limbs = [70, 90, 110, 130].map((x) => thickPath(`M${x} 160 L${x + (x < 100 ? -6 : 6)} 182`, '#c9965a', 5)).join('');
    L.body = `<path d="M40 156 A60 62 0 0 1 160 156 Z" fill="${c.main}" ${S}/>` +
      `<path d="M70 104 Q100 92 130 104" fill="none" stroke="${c.dark}" stroke-width="3"/>`;
    L.bodyFront = `<path d="M44 156 Q100 182 156 156 Z" fill="#2d2a3e" ${S}/>`;
    L.head = { x: 100, y: 166, r: 34 };
    L.blobHead = true; L.box = { cx: 100, cy: 130, rx: 60, ry: 40 };
    L.eyes = 'glow'; L.mouth = 'none'; L.cheeks = null;
  },
  spiral(L, c, o) {
    let sp = '', d = '';
    for (let t = 0; t <= Math.PI * 5; t += 0.2) {
      const rr = 4 + t * 3, x = 116 + Math.cos(t) * rr, y = 96 + Math.sin(t) * rr;
      d += (d ? ' L' : 'M') + `${P(x)} ${P(y)}`;
    }
    if (o.spiky) for (let i = 0; i < 6; i++) {
      const a = -Math.PI * 0.9 + (i / 5) * Math.PI * 1.1, x = 116 + Math.cos(a) * 50, y = 96 + Math.sin(a) * 50;
      sp += poly([[x - Math.sin(a) * 8, y + Math.cos(a) * 8], [x + Math.cos(a) * 22, y + Math.sin(a) * 22], [x + Math.sin(a) * 8, y - Math.cos(a) * 8]], '#f2e3c0');
    }
    L.back = sp + [60, 76, 92, 108].map((x) => thickPath(`M${x} 160 Q${x - 6} 176 ${x + 4} 190`, c.main, 7)).join('');
    L.body = circ(116, 96, 54, c.belly) + `<path d="${d}" fill="none" stroke="${shade(c.belly, -30)}" stroke-width="4"/>`;
    L.limbs = ell(82, 146, 40, 28, c.main);
    L.head = { x: 82, y: 144, r: 30 };
    L.blobHead = true; L.box = { cx: 100, cy: 120, rx: 60, ry: 60 };
  },
  vines(L, c) {
    let v = '';
    const rng = rngFrom(114);
    for (let i = 0; i < 16; i++) {
      const a = rng() * Math.PI * 2, r0 = 20 + rng() * 30, x = 100 + Math.cos(a) * r0, y = 116 + Math.sin(a) * r0 * 0.9;
      v += `<path d="M${P(x - 18)} ${P(y + (rng() - 0.5) * 20)} Q${P(x)} ${P(y - 18)} ${P(x + 18)} ${P(y + (rng() - 0.5) * 20)}" fill="none" stroke="${c.belly}" stroke-width="5" stroke-linecap="round"/>`;
    }
    L.body = circ(100, 116, 58, c.main) + v;
    L.bodyFront = flat(100, 112, 40, 14, '#1d1d2e');
    L.limbs = feet2(100, 176, 22, '#e8453a');
    L.head = { x: 100, y: 116, r: 40 };
    L.blobHead = true; L.box = { cx: 100, cy: 116, rx: 58, ry: 58 };
    L.eyes = 'white'; L.mouth = 'none'; L.cheeks = null;
  },
  gas(L, c, o) {
    let aura = '';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      aura += flat(100 + Math.cos(a) * 52, 108 + Math.sin(a) * 50, 24, 22, c.belly, 'opacity=".55"');
    }
    L.back = aura;
    L.body = circ(100, 108, 46, c.main);
    L.head = { x: 100, y: 106, r: 44 };
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 108, rx: 46, ry: 46 };
  },
  sludge(L, c, o) {
    const w = o.wide ? 1.15 : 1;
    const X = (x) => P(100 + (x - 100) * w);
    L.body = `<path d="M${X(28)} 186 Q${X(30)} 152 ${X(50)} 140 Q${X(42)} 104 ${X(70)} 94 Q${X(78)} 58 ${X(108)} 60 Q${X(146)} 62 ${X(148)} 100 Q${X(174)} 114 ${X(164)} 148 Q${X(178)} 160 ${X(174)} 186 Z" fill="${c.main}" ${S}/>`;
    L.bodyFront = `<path d="M${X(60)} 160 q4 14 0 20 M${X(130)} 150 q4 16 -2 24" stroke="${c.dark}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      thickPath(`M${X(54)} 128 Q${X(34)} 108 ${X(40)} 86`, c.main, 14) + thickPath(`M${X(150)} 122 Q${X(172)} 102 ${X(164)} 80`, c.main, 14);
    L.head = { x: 104, y: 106, r: 40 };
    L.blobHead = true; L.box = { cx: 100, cy: 140, rx: 70, ry: 46 };
  },
  seal(L, c) {
    L.back = `<path d="M160 148 L192 128 L186 152 L194 172 Z" fill="${c.main}" ${S}/>`;
    L.body = ell(116, 152, 58, 30, c.main);
    L.bodyFront = flat(110, 164, 36, 12, c.belly);
    L.limbs = ell(84, 178, 16, 8, c.main) + ell(132, 180, 14, 7, c.main);
    L.head = { x: 70, y: 110, r: 34 };
    L.box = { cx: 116, cy: 152, rx: 58, ry: 30 };
    L.tail = { x: 166, y: 146 };
  },
  longneck(L, c) {
    L.body = ell(120, 152, 56, 30, c.main);
    L.bodyFront = flat(110, 166, 38, 10, c.belly);
    L.limbs = ell(78, 178, 18, 8, c.main) + ell(158, 178, 16, 7, c.main) + thickPath('M88 140 Q66 118 66 88', c.main, 20);
    L.head = { x: 64, y: 72, r: 28 };
    L.box = { cx: 120, cy: 152, rx: 56, ry: 30 };
    L.tail = { x: 172, y: 150 };
  },
  boulders(L, c) {
    const rocks = [[44, 176, 15], [72, 182, 18], [106, 180, 20], [138, 170, 21], [158, 144, 21], [148, 116, 21], [122, 100, 22]];
    L.body = rocks.map(([x, y, r]) => ell(x, y, r * 1.1, r, c.main) + `<path d="M${x - r * 0.4} ${y - r * 0.2} q${r * 0.3} ${r * 0.3} ${r * 0.6} 0" fill="none" stroke="${c.dark}" stroke-width="2.5"/>`).join('');
    L.head = { x: 92, y: 76, r: 32 };
    L.box = { cx: 110, cy: 150, rx: 60, ry: 30 };
  },
  ghost(L, c) {
    let d = 'M45 122 A55 55 0 0 1 155 122 L155 170';
    const n = 6, w = 110 / n;
    for (let i = 0; i < n; i++) d += ` Q${P(155 - w * i - w / 2)} ${i % 2 ? 158 : 184} ${P(155 - w * (i + 1))} 170`;
    L.body = `<path d="${d} Z" fill="${c.main}" ${S}/>`;
    L.head = { x: 100, y: 112, r: 46 };
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 130, rx: 55, ry: 45 };
  },
  star(L, c, o) {
    const star = (rot, R, r0, fill) => {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2 + rot, rr = i % 2 ? r0 : R;
        pts.push(`${P(100 + Math.cos(a) * rr)},${P(118 + Math.sin(a) * rr)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`;
    };
    if (o.double) L.back = star(Math.PI / 5, 74, 34, c.dark);
    L.body = star(0, 80, 36, c.main);
    L.bodyFront = `<path d="M100 98 L118 118 L100 138 L82 118 Z" fill="#f2d84a" ${S}/>` + circ(100, 118, 9, '#e8453a');
    L.head = { x: 100, y: 118, r: 34 };
    L.blobHead = true; L.float = true; L.box = { cx: 100, cy: 118, rx: 50, ry: 50 };
    L.eyes = 'none'; L.mouth = 'none'; L.cheeks = null;
  },
  serpent(L, c, o) {
    const d = 'M45 168 Q100 196 152 168 Q184 142 130 132 Q84 122 94 100';
    L.body = thickPath(d, c.main, 30);
    L.bodyFront = `<path d="${d}" fill="none" stroke="${c.belly}" stroke-width="9" stroke-linecap="round" stroke-dasharray="10 9"/>`;
    L.head = { x: 94, y: 80, r: o.hr || 34 };
    L.box = { cx: 110, cy: 160, rx: 60, ry: 25 };
    L.tail = { x: 45, y: 168 };
  },
  fish(L, c) {
    L.back = `<path d="M148 118 L194 80 L184 118 L194 156 Z" fill="${c.dark}" ${S}/>`;
    L.body = ell(96, 118, 62, 44, c.main);
    L.bodyFront = flat(92, 140, 40, 15, c.belly) + `<path d="M104 128 Q122 140 110 152 Z" fill="${c.dark}" ${S}/>`;
    L.head = { x: 82, y: 110, r: 40 };
    L.blobHead = true; L.float = true; L.box = { cx: 96, cy: 118, rx: 62, ry: 44 };
  },
  // ---- one-off drawings ----
  doduo(L, c, o) {
    const heads = o.n === 3 ? [[54, 74], [100, 46], [146, 74]] : [[66, 64], [134, 64]];
    let s = '';
    s += `<path d="M90 166 L86 190 M110 166 L114 190" stroke="#e8a030" stroke-width="6" stroke-linecap="round"/><path d="M76 191 L94 191 M106 191 L124 191" stroke="#e8a030" stroke-width="5" stroke-linecap="round"/>`;
    for (const [hx, hy] of heads) s += thickPath(`M${P(100 + (hx - 100) * 0.3)} 130 Q${P(hx + (100 - hx) * 0.2)} ${P(hy + 50)} ${hx} ${hy + 16}`, c.main, 10);
    s += ell(100, 144, 46, 30, c.main) + flat(100, 150, 30, 18, c.belly);
    for (const [hx, hy] of heads) {
      const h = { x: hx, y: hy, r: 22 };
      s += circ(hx, hy, 22, c.main) + drawFace(h, { eyes: 'normal', mouth: 'longbeak' });
    }
    L.body = s; L.head = null; L.box = { cx: 100, cy: 144, rx: 46, ry: 30 };
  },
  palm(L, c) {
    let s = '';
    for (const a of [-80, -45, 0, 45, 80]) s += leaf(100, 66, a, 64, 18, '#4fa24a');
    s += `<path d="M84 100 L80 176 L120 176 L116 100 Z" fill="${c.main}" ${S}/>`;
    s += `<path d="M84 120 L116 140 M116 120 L84 140 M82 150 L118 170 M118 150 L82 170" stroke="${c.dark}" stroke-width="3"/>`;
    s += ell(82, 182, 18, 9, c.main) + ell(118, 182, 18, 9, c.main);
    const faces = [[72, 92, 'angry'], [100, 74, 'normal'], [128, 92, 'sleepy']];
    for (const [x, y, e] of faces) s += circ(x, y, 21, '#f2d84a') + drawFace({ x, y, r: 21 }, { eyes: e, mouth: 'smile' });
    L.body = s; L.head = null; L.box = { cx: 100, cy: 140, rx: 20, ry: 40 };
  },
  porygon(L, c) {
    const blue = c.belly;
    L.body = poly([[150, 124], [176, 116], [180, 140], [154, 146]], blue) +
      poly([[96, 160], [104, 186], [120, 186], [116, 158]], blue) + poly([[132, 156], [138, 184], [154, 184], [150, 152]], blue) +
      poly([[76, 118], [146, 104], [164, 152], [92, 168]], c.main) +
      poly([[60, 66], [112, 56], [120, 102], [68, 112]], c.main) +
      poly([[60, 80], [30, 92], [64, 104]], blue) +
      circ(88, 80, 10, '#fff') + circ(90, 80, 4.5, OL);
    L.head = null; L.box = { cx: 116, cy: 136, rx: 46, ry: 30 };
  },
};

// ---------------- face ----------------
function drawFace(h, f) {
  let s = '';
  const st = f.eyes || 'normal', iris = f.iris;
  const er = h.r * 0.15, dx = h.r * 0.38, y = h.y - h.r * 0.05;
  const xs = [-1, 1].map((sx) => h.x + sx * dx);
  const hi = (ex, k = 1) => `<circle cx="${P(ex - er * 0.3)}" cy="${P(y - er * 0.45)}" r="${P(er * 0.4 * k)}" fill="#fff"/>`;
  switch (st) {
    case 'none': break;
    case 'sleepy':
      xs.forEach((ex) => (s += `<path d="M${P(ex - er * 1.2)} ${P(y)} Q${P(ex)} ${P(y + er * 1.1)} ${P(ex + er * 1.2)} ${P(y)}" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>`));
      break;
    case 'dots': xs.forEach((ex) => (s += `<circle cx="${P(ex)}" cy="${P(y)}" r="${P(Math.max(2.5, er * 0.55))}" fill="${OL}"/>`)); break;
    case 'one':
      s += circ(h.x, y, h.r * 0.42, '#fff') + `<circle cx="${P(h.x)}" cy="${P(y)}" r="${P(h.r * 0.16)}" fill="${OL}"/>` + `<circle cx="${P(h.x - h.r * 0.06)}" cy="${P(y - h.r * 0.07)}" r="${P(h.r * 0.05)}" fill="#fff"/>`;
      break;
    case 'compound':
      xs.forEach((ex) => (s += ell(ex, y, er * 1.7, er * 2, iris || '#e8453a') + flat(ex - er * 0.5, y - er * 0.8, er * 0.55, er * 0.4, '#fff', 'opacity=".8"')));
      break;
    case 'blank': xs.forEach((ex) => (s += ell(ex, y, er * 1.15, er * 1.35, '#fff'))); break;
    case 'white': xs.forEach((ex) => (s += ell(ex, y, er * 1.3, er * 1.4, '#fff') + `<circle cx="${P(ex)}" cy="${P(y)}" r="${P(er * 0.45)}" fill="${OL}"/>`)); break;
    case 'glow': xs.forEach((ex) => (s += `<circle cx="${P(ex)}" cy="${P(y)}" r="${P(er * 0.85)}" fill="${iris || '#ff4040'}"/><circle cx="${P(ex)}" cy="${P(y)}" r="${P(er * 0.35)}" fill="#ffd0d0"/>`)); break;
    case 'big':
      xs.forEach((ex) => {
        s += ell(ex, y, er * 1.35, er * 1.55, '#fff') + flat(ex, y + er * 0.15, er * 0.95, er * 1.15, iris || OL) +
          `<circle cx="${P(ex)}" cy="${P(y + er * 0.2)}" r="${P(er * 0.45)}" fill="${OL}"/><circle cx="${P(ex - er * 0.4)}" cy="${P(y - er * 0.4)}" r="${P(er * 0.38)}" fill="#fff"/>`;
      });
      break;
    default:
      xs.forEach((ex) => {
        if (st === 'red') s += flat(ex, y, er, er * 1.2, iris || '#c0392b') + flat(ex, y + er * 0.1, er * 0.5, er * 0.7, OL) + hi(ex, 0.8);
        else s += flat(ex, y, er, er * 1.2, OL) + hi(ex);
      });
  }
  if (st === 'angry' || f.brows) {
    [-1, 1].forEach((sx, i) => {
      const ex = xs[i];
      s += `<path d="M${P(ex + sx * er * 1.4)} ${P(y - er * 2.1)} L${P(ex - sx * er * 1.0)} ${P(y - er * 1.3)}" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>`;
    });
  }
  const my = h.y + h.r * (0.32 + (f.mouthDy || 0)), w = h.r * 0.22, x = h.x;
  const smile = `<path d="M${P(x - w)} ${P(my)} Q${P(x)} ${P(my + w * 0.9)} ${P(x + w)} ${P(my)}" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`;
  switch (f.mouth || 'smile') {
    case 'none': break;
    case 'beak': { const yy = h.y + h.r * 0.2, bw = h.r * 0.22; s += poly([[x - bw, yy], [x + bw, yy], [x, yy + bw * 1.4]], f.mouthCol || '#ffb02e'); break; }
    case 'longbeak': { const yy = h.y + h.r * 0.18, bw = h.r * 0.2; s += poly([[x - bw, yy], [x + bw, yy], [x, yy + h.r * 0.95]], f.mouthCol || '#f2a050'); break; }
    case 'duck': s += ell(x, h.y + h.r * 0.34, h.r * 0.44, h.r * 0.2, f.mouthCol || '#f6e08a') + `<path d="M${P(x - h.r * 0.36)} ${P(h.y + h.r * 0.34)} L${P(x + h.r * 0.36)} ${P(h.y + h.r * 0.34)}" stroke="${OL}" stroke-width="2.5"/>`; break;
    case 'teeth': s += smile + `<rect x="${P(x - 6)}" y="${P(my + w * 0.4)}" width="5.5" height="9" rx="1.5" fill="#fff" ${S}/><rect x="${P(x + 0.5)}" y="${P(my + w * 0.4)}" width="5.5" height="9" rx="1.5" fill="#fff" ${S}/>`; break;
    case 'fangs': s += smile + poly([[x - w * 0.7, my + w * 0.3], [x - w * 0.4, my + w * 0.3], [x - w * 0.55, my + w * 0.9]], '#fff') + poly([[x + w * 0.4, my + w * 0.3], [x + w * 0.7, my + w * 0.3], [x + w * 0.55, my + w * 0.9]], '#fff'); break;
    case 'grin': {
      const ww = w * 2;
      s += `<path d="M${P(x - ww)} ${P(my - 4)} Q${P(x)} ${P(my + ww * 0.8)} ${P(x + ww)} ${P(my - 4)} Q${P(x)} ${P(my + ww * 0.25)} ${P(x - ww)} ${P(my - 4)} Z" fill="#fff" ${S}/>`;
      for (const k of [-0.5, 0, 0.5]) s += `<path d="M${P(x + k * ww)} ${P(my + ww * 0.1)} L${P(x + k * ww)} ${P(my + ww * 0.45)}" stroke="${OL}" stroke-width="2"/>`;
      break;
    }
    case 'open': s += ell(x, my + w * 0.3, w * 0.8, w * 0.6, '#a03040') + flat(x, my + w * 0.6, w * 0.45, w * 0.25, '#f27a9a'); break;
    case 'tongue': s += ell(x, my + w * 0.2, w * 0.9, w * 0.5, '#a03040') + `<path d="M${P(x - 9)} ${P(my + 4)} Q${P(x - 12)} ${P(my + h.r * 0.95)} ${P(x)} ${P(my + h.r)} Q${P(x + 12)} ${P(my + h.r * 0.95)} ${P(x + 9)} ${P(my + 4)} Z" fill="#f27a9a" ${S}/>`; break;
    case 'tongueout': s += `<path d="M${P(x - 12)} ${P(my)} Q${P(x - 14)} ${P(my + 26)} ${P(x)} ${P(my + 28)} Q${P(x + 14)} ${P(my + 26)} ${P(x + 12)} ${P(my)} Z" fill="#f27a9a" ${S}/>`; break;
    case 'lips': s += ell(x, my + 2, w * 1.0, w * 0.5, f.mouthCol || '#f27a9a') + `<path d="M${P(x - w * 0.9)} ${P(my + 2)} L${P(x + w * 0.9)} ${P(my + 2)}" stroke="${OL}" stroke-width="2"/>`; break;
    case 'nose': s += ell(x, h.y + h.r * 0.32, h.r * 0.3, h.r * 0.2, f.mouthCol || '#f2a0b8'); break;
    default: s += smile;
  }
  if (f.cheeks) {
    const custom = f.cheeks !== '#ff7a8a';
    [-1, 1].forEach((sx) => {
      const cx = h.x + sx * h.r * 0.64, cy = h.y + h.r * 0.22;
      s += custom ? circ(cx, cy, h.r * 0.17, f.cheeks) : flat(cx, cy, h.r * 0.13, h.r * 0.09, f.cheeks, 'opacity=".55"');
    });
  }
  return s;
}

// ---------------- features ----------------
const handsOf = (L) => L.hands || [[L.box.cx - L.box.rx, L.box.cy], [L.box.cx + L.box.rx, L.box.cy]];
const FEAT = {
  ears(L, c, kind = 'pointy', col) {
    const h = L.head, f = c.main;
    let s = '';
    if (kind === 'pointy') s = ear2(h, 22, 54, 40, 1.55, f, null, col || c.belly);
    else if (kind === 'cat') s = ear2(h, 20, 52, 36, 1.5, f, null, col || '#5a3a2a');
    else if (kind === 'long') s = ear2(h, 12, 34, 20, 2.0, f, null, col || c.belly);
    else if (kind === 'big') s = ear2(h, 24, 72, 50, 2.05, f, null, col || c.belly);
    else if (kind === 'tipped') s = ear2(h, 20, 50, 36, 1.6, f, col || '#5a3a2a', null);
    else if (kind === 'bigtipped') s = ear2(h, 22, 66, 46, 2.15, f, col || '#3a2a2a', null);
    else if (kind === 'small') s = ear2(h, 30, 54, 42, 1.32, f, null, null);
    else if (kind === 'round') for (const sx of [-1, 1]) { const [ex, ey] = at(h, sx * 42, 1.0); s += circ(ex, ey, h.r * 0.32, f) + flat(ex, ey, h.r * 0.17, h.r * 0.17, col || c.belly); }
    else if (kind === 'fin') for (const sx of [-1, 1]) {
      const [bx, by] = at(h, sx * 72, 0.92);
      s += `<path d="M${bx} ${P(by - 10)} Q${P(bx + sx * 34)} ${P(by - 40)} ${P(bx + sx * 46)} ${P(by - 14)} Q${P(bx + sx * 32)} ${P(by - 4)} ${P(bx + sx * 44)} ${P(by + 12)} Q${P(bx + sx * 22)} ${P(by + 20)} ${bx} ${P(by + 8)} Z" fill="${col || '#f6f6ff'}" ${S}/>`;
    } else if (kind === 'fluffy') for (const sx of [-1, 1]) {
      const [bx, by] = at(h, sx * 62, 0.95), fc = col || '#eef3ff';
      s += circ(bx + sx * 8, by - 6, 12, fc) + circ(bx + sx * 20, by - 18, 11, fc) + circ(bx + sx * 28, by - 32, 9, fc);
    }
    L.headBack += s;
  },
  crest(L, c, col, long) {
    const h = L.head, len = long ? 2.15 : 1.6;
    for (const a of [-16, 0, 16]) {
      const b1 = at(h, a - 9, 0.9), b2 = at(h, a + 9, 0.9), t = at(h, a * 1.3 + (long ? 30 : 12), len);
      L.headBack += `<path d="M${b1} L${t} L${b2} Z" fill="${col || c.dark}" ${S}/>`;
    }
  },
  horn(L, c, col = '#f6e8c0', size = 1) {
    const h = L.head, k = +size;
    L.headBack += `<path d="M${at(h, -12, 0.9)} L${at(h, 0, 1.0 + 0.6 * k)} L${at(h, 12, 0.9)} Z" fill="${col}" ${S}/>`;
  },
  drillhorn(L, c) {
    const h = L.head;
    L.headBack += `<path d="M${at(h, -14, 0.9)} L${at(h, 0, 1.75)} L${at(h, 14, 0.9)} Z" fill="#f2ecd8" ${S}/>`;
    L.headBack += `<path d="M${lerp(at(h, -14, 0.9), at(h, 0, 1.75), 0.35)} L${lerp(at(h, 14, 0.9), at(h, 0, 1.75), 0.2)} M${lerp(at(h, -14, 0.9), at(h, 0, 1.75), 0.65)} L${lerp(at(h, 14, 0.9), at(h, 0, 1.75), 0.5)}" stroke="${OL}" stroke-width="2.5"/>`;
  },
  horns2(L, c, col = '#f6e8c0') {
    const h = L.head;
    for (const sx of [-1, 1]) L.headBack += `<path d="M${at(h, sx * 18, 0.9)} L${at(h, sx * 34, 1.55)} L${at(h, sx * 42, 0.9)} Z" fill="${col}" ${S}/>`;
  },
  bullhorns(L) {
    const h = L.head;
    for (const sx of [-1, 1]) { const [bx, by] = at(h, sx * 62, 0.9); L.headBack += thickPath(`M${bx} ${by} Q${P(bx + sx * 34)} ${P(by - 4)} ${P(bx + sx * 28)} ${P(by - 38)}`, '#e8dcc0', 9); }
  },
  antennae(L, c, col) {
    const h = L.head;
    for (const sx of [-1, 1]) {
      const [ax, ay] = at(h, sx * 22, 0.9), ex = P(ax + sx * 18), ey = P(ay - 34);
      L.headBack += `<path d="M${ax} ${ay} Q${P(ax + sx * 2)} ${P(ay - 22)} ${ex} ${ey}" fill="none" stroke="${OL}" stroke-width="3.5"/>` + circ(ex, ey, 6, col || c.dark);
    }
  },
  yantenna(L) {
    const [x, y] = at(L.head, 0, 0.9);
    L.headBack += thickPath(`M${x} ${y} L${x} ${y - 22} L${x - 14} ${y - 38} M${x} ${y - 22} L${x + 14} ${y - 38}`, '#e8453a', 6);
  },
  curl(L, c) {
    const [x, y] = at(L.head, 0, 0.92);
    L.headFront += thickPath(`M${x} ${y + 6} C${x - 4} ${y - 20} ${x + 22} ${y - 22} ${x + 18} ${y - 6} C${x + 15} ${y + 2} ${x + 6} ${y} ${x + 8} ${y - 6}`, c.main, 7);
  },
  tuft(L) {
    const h = L.head;
    for (const a of [-12, 0, 12]) {
      const b = at(h, a, 0.95), t = at(h, a * 2.4, 1.45);
      L.headBack += `<path d="M${b} Q${P(b[0] + a * 0.4)} ${P(t[1] + 8)} ${t}" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>`;
    }
  },
  leaves(L, c, col = '#4fa24a') {
    for (const a of [-55, -28, 0, 28, 55]) { const [x, y] = at(L.head, a * 0.3, 0.8); L.headBack += leaf(x, y, a, 54, 15, col); }
  },
  petals(L, c, col = '#d0603a') {
    for (const a of [-75, -38, 0, 38, 75]) { const [x, y] = at(L.head, a * 0.5, 0.7); L.headBack += leaf(x, y, a, 46, 24, col, false); }
  },
  bigflower(L, c, col = '#e8453a') {
    const h = L.head, cx = h.x, cy = h.y - h.r * 1.0;
    const petals = [];
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + Math.PI / 2; petals.push([cx + Math.cos(a) * 40, cy + Math.sin(a) * 14]); }
    petals.sort((a, b) => a[1] - b[1]);
    let s = '';
    for (const [x, y] of petals) s += ell(x, y, 30, 17, col) + circ(x - 8, y - 3, 4, '#fff') + circ(x + 8, y + 2, 3, '#fff');
    s += flat(cx, cy, 15, 6, '#5a2a5a');
    L.headBack += s;
  },
  bulb(L) {
    const b = L.box, x = b.cx + 6, y = b.cy - b.ry + 6;
    L.back += `<path d="M${x - 32} ${y + 10} C${x - 34} ${y - 30} ${x - 6} ${y - 52} ${x} ${y - 56} C${x + 6} ${y - 52} ${x + 34} ${y - 30} ${x + 32} ${y + 10} Z" fill="#4fa24a" ${S}/>`;
  },
  bud(L) {
    const b = L.box, x = b.cx + 4, y = b.cy - b.ry + 8;
    L.back += ell(x, y - 26, 17, 24, '#f28ab0') + `<path d="M${x} ${y - 48} L${x} ${y - 6} M${x - 9} ${y - 40} Q${x - 4} ${y - 20} ${x - 2} ${y - 6} M${x + 9} ${y - 40} Q${x + 4} ${y - 20} ${x + 2} ${y - 6}" stroke="#c0506a" stroke-width="2" fill="none"/>`;
    for (const a of [-70, -35, 35, 70]) L.back += leaf(x, y, a, 42, 13, '#4fa24a');
  },
  venusflower(L) {
    const b = L.box, x = b.cx + 4, y = b.cy - b.ry + 6;
    for (const a of [-80, -45, -10, 30, 70]) L.back += leaf(x, y - 4, a, 58, 17, '#3e9c50');
    L.back += thickPath(`M${x} ${y} L${x} ${y - 18}`, '#8a5a2a', 10);
    const petals = [];
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + Math.PI / 2; petals.push([x + Math.cos(a) * 30, y - 24 + Math.sin(a) * 12]); }
    petals.sort((a, b) => a[1] - b[1]);
    for (const [px, py] of petals) L.back += ell(px, py, 22, 13, '#f28ab0') + circ(px + 4, py, 3, '#fff');
    L.back += flat(x, y - 24, 10, 5, '#f2d84a');
  },
  mushroom(L, c, big) {
    const b = L.box;
    const cap = (x, y, rx, ry) => `<path d="M${x - 8} ${y + 8} L${x - 6} ${y - 4} L${x + 6} ${y - 4} L${x + 8} ${y + 8} Z" fill="#f6e8c0" ${S}/>` +
      `<path d="M${x - rx} ${y} Q${x - rx} ${y - ry * 1.4} ${x} ${y - ry * 1.4} Q${x + rx} ${y - ry * 1.4} ${x + rx} ${y} Z" fill="#e8453a" ${S}/>` +
      circ(x - rx * 0.4, y - ry * 0.6, rx * 0.16, '#f6d84a') + circ(x + rx * 0.35, y - ry * 0.85, rx * 0.13, '#f6d84a') + circ(x + rx * 0.1, y - ry * 0.35, rx * 0.1, '#f6d84a');
    if (big) L.headBack += cap(L.head.x + 30, L.head.y - L.head.r * 0.3, 80, 50);
    else L.back += cap(b.cx - 14, b.cy - b.ry + 6, 22, 18) + cap(b.cx + 22, b.cy - b.ry + 8, 20, 16);
  },
  shell(L) {
    const b = L.box;
    L.back += ell(b.cx, b.cy, b.rx + 10, b.ry + 8, '#b5743a') + `<ellipse cx="${b.cx}" cy="${b.cy}" rx="${b.rx + 3}" ry="${b.ry + 2}" fill="none" stroke="#f4e1a6" stroke-width="5"/>`;
  },
  cannons(L) {
    const b = L.box;
    for (const sx of [-1, 1]) {
      const x = P(b.cx + sx * (b.rx - 8)), y = P(b.cy - b.ry + 4);
      L.back += `<g transform="rotate(${sx * 18} ${x} ${y})"><rect x="${x - 9}" y="${y - 34}" width="18" height="38" rx="4" fill="#a8b0c0" ${S}/><ellipse cx="${x}" cy="${y - 34}" rx="9" ry="4" fill="${OL}"/></g>`;
    }
  },
  plates(L, c, col) {
    const b = L.box;
    for (const o of [-0.15, 0.2, 0.55]) {
      const y = b.cy + b.ry * o + 6, half = b.rx * 0.5 * Math.sqrt(1 - o * o);
      L.bodyFront += `<path d="M${P(b.cx - half)} ${P(y)} Q${P(b.cx)} ${P(y + 6)} ${P(b.cx + half)} ${P(y)}" fill="none" stroke="${col || shade(c.belly, -22)}" stroke-width="3"/>`;
    }
  },
  fluffytail(L, c, col, tip) {
    const T = L.tail, f = col || c.main;
    L.back += circ(T.x + 12, T.y - 8, 15, f) + circ(T.x + 26, T.y - 24, 18, f) + circ(T.x + 32, T.y - 46, 16, tip || f);
  },
  flametail(L, c) {
    const { x, y } = L.tail;
    L.back += thickPath(`M${P(x - 10)} ${P(y)} Q${P(x + 30)} ${P(y + 5)} ${P(x + 32)} ${P(y - 28)}`, c.main, 13) + flame(x + 32, y - 26, 13);
  },
  flamehead(L) {
    const h = L.head, [fx, fy] = at(h, 0, 0.85);
    L.headBack += flame(at(h, -32, 0.85)[0], at(h, -32, 0.85)[1], 11) + flame(at(h, 32, 0.85)[0], at(h, 32, 0.85)[1], 11) + flame(fx, fy, 18);
  },
  flamemane(L) {
    const h = L.head, b = L.box;
    L.back += flame(b.cx - 8, b.cy - b.ry + 6, 13) + flame(b.cx + 22, b.cy - b.ry + 8, 11);
    L.headBack += flame(...at(h, 10, 0.85), 16) + flame(...at(h, 50, 0.85), 14) + flame(...at(h, 90, 0.8), 12);
  },
  bolttail(L) {
    const { x, y } = L.tail;
    L.back += `<path d="M${P(x - 8)} ${P(y)} L${P(x + 18)} ${P(y - 14)} L${P(x + 10)} ${P(y - 22)} L${P(x + 34)} ${P(y - 44)} L${P(x + 26)} ${P(y - 50)} L${P(x + 52)} ${P(y - 76)} L${P(x + 16)} ${P(y - 52)} L${P(x + 24)} ${P(y - 46)} L${P(x - 2)} ${P(y - 28)} L${P(x + 4)} ${P(y - 22)} L${P(x - 16)} ${P(y - 10)} Z" fill="#ffd43b" ${S}/>`;
  },
  thintail(L) {
    const { x, y } = L.tail, ex = x + 44, ey = y - 50;
    L.back += `<path d="M${P(x - 6)} ${P(y)} Q${P(x + 50)} ${P(y + 4)} ${P(ex)} ${P(ey)}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
    L.back += `<path d="M${P(ex)} ${P(ey + 4)} L${P(ex - 8)} ${P(ey - 10)} L${P(ex)} ${P(ey - 10)} L${P(ex - 6)} ${P(ey - 26)} L${P(ex + 12)} ${P(ey - 6)} L${P(ex + 4)} ${P(ey - 6)} L${P(ex + 10)} ${P(ey + 6)} Z" fill="#f2c94a" ${S}/>`;
  },
  curltail(L, c, col) {
    const { x, y } = L.tail;
    L.back += thickPath(`M${P(x - 6)} ${P(y)} Q${P(x + 30)} ${P(y + 6)} ${P(x + 30)} ${P(y - 20)} Q${P(x + 30)} ${P(y - 36)} ${P(x + 16)} ${P(y - 32)} Q${P(x + 8)} ${P(y - 26)} ${P(x + 16)} ${P(y - 20)}`, col || c.main, 6);
  },
  longtail(L, c, col) {
    const { x, y } = L.tail;
    L.back += thickPath(`M${P(x - 8)} ${P(y)} Q${P(x + 40)} ${P(y + 10)} ${P(x + 48)} ${P(y - 30)} Q${P(x + 52)} ${P(y - 50)} ${P(x + 38)} ${P(y - 56)}`, col || c.main, 11);
  },
  tails(L, c, n = 3, col) {
    const T = L.tail, k = +n;
    for (let i = 0; i < k; i++) {
      const ang = 15 + (i / Math.max(1, k - 1)) * 85;
      L.back += leaf(T.x - 12, T.y + 4, ang, 60, 15, col || c.main, false);
    }
  },
  fintail(L, c, col) {
    const T = L.tail;
    L.back += `<path d="M${T.x - 6} ${T.y - 6} Q${T.x + 30} ${T.y - 42} ${T.x + 48} ${T.y - 16} Q${T.x + 30} ${T.y - 4} ${T.x + 48} ${T.y + 12} Q${T.x + 24} ${T.y + 22} ${T.x - 6} ${T.y + 6} Z" fill="${col || c.belly}" ${S}/>`;
  },
  birdtail(L, c, col) {
    const T = L.tail;
    for (const [dy, ang] of [[-6, 75], [0, 100], [6, 125]]) L.back += leaf(T.x - 6, T.y + dy, ang, 46, 9, col || c.dark, false);
  },
  wings(L, c, kind = 'bird', col) {
    const b = L.box;
    let s = '';
    for (const sx of [-1, 1]) {
      const bx = P(b.cx + sx * b.rx * 0.75), by = P(b.cy - b.ry * 0.45);
      if (kind === 'bird') {
        const wx = P(b.cx + sx * (b.rx + 14)), wy = by, w = col || c.belly;
        s += `<g transform="rotate(${sx * -28} ${wx} ${wy})">${ell(wx, wy, 34, 18, w)}${ell(wx + sx * 6, wy + 12, 26, 12, w)}</g>`;
      } else if (kind === 'bat') {
        s += poly([[bx, by - 6], [bx + sx * 76, by - 44], [bx + sx * 66, by + 8], [bx + sx * 52, by - 4], [bx + sx * 42, by + 20], [bx + sx * 26, by + 6], [bx, by + 12]], col || '#a070d0');
      } else if (kind === 'bug') {
        s += `<g opacity=".85">${ell(bx + sx * 30, by - 22, 32, 14, '#eaf6ff', `transform="rotate(${sx * -25} ${bx + sx * 30} ${by - 22})"`)}${ell(bx + sx * 26, by + 2, 24, 11, '#eaf6ff', `transform="rotate(${sx * -10} ${bx + sx * 26} ${by + 2})"`)}</g>`;
      } else if (kind === 'butterfly') {
        const w = col || '#f6f6ff';
        s += ell(bx + sx * 42, by - 30, 40, 32, w, `transform="rotate(${sx * -20} ${bx + sx * 42} ${by - 30})"`) + ell(bx + sx * 32, by + 14, 26, 22, w) +
          circ(bx + sx * 62, by - 46, 6, OL) + `<path d="M${bx} ${by} L${bx + sx * 60} ${by - 40} M${bx} ${by} L${bx + sx * 40} ${by + 18}" stroke="${OL}" stroke-width="2" opacity=".5"/>`;
      } else if (kind === 'dragon') {
        s += poly([[bx, by - 12], [bx + sx * 28, by - 72], [bx + sx * 74, by - 54], [bx + sx * 60, by - 34], [bx + sx * 68, by - 14], [bx + sx * 46, by - 8], [bx + sx * 42, by + 8], [bx, by + 6]], col || c.dark);
      } else if (kind === 'tiny') {
        s += ell(b.cx + sx * (b.rx * 0.75), b.cy - b.ry * 0.55, 17, 10, col || c.belly, `transform="rotate(${sx * -35} ${P(b.cx + sx * b.rx * 0.75)} ${P(b.cy - b.ry * 0.55)})"`);
      } else if (kind === 'spiky') {
        s += poly([[bx, by + 6], [bx + sx * 26, by - 48], [bx + sx * 34, by - 22], [bx + sx * 58, by - 56], [bx + sx * 60, by - 22], [bx + sx * 84, by - 36], [bx + sx * 68, by + 2], [bx + sx * 10, by + 18]], col || c.main);
      } else if (kind === 'flame') {
        s += `<g transform="rotate(${sx * 62} ${bx} ${by})">${flame(bx, by + 6, 26)}</g>`;
      }
    }
    L.back += s;
  },
  spots(L, c, col, n = 4) {
    const b = L.box, k = +n;
    for (let i = 0; i < k; i++) {
      const oy = (L.blobHead ? 0.25 : -0.3) + L.rng() * 0.5, ox = (L.rng() - 0.5) * 1.3 * Math.sqrt(1 - oy * oy);
      L.bodyFront += flat(b.cx + ox * b.rx, b.cy + oy * b.ry, 5 + L.rng() * 5, 4 + L.rng() * 4, col || c.dark, 'opacity=".85"');
    }
  },
  stripes(L, c, col) {
    const b = L.box;
    for (const o of (L.blobHead ? [0.4, 0.65] : [-0.35, 0.05, 0.45])) {
      const y = b.cy + b.ry * o, half = b.rx * Math.sqrt(1 - o * o) * 0.85;
      L.bodyFront += `<path d="M${P(b.cx - half)} ${P(y)} Q${P(b.cx)} ${P(y + 9)} ${P(b.cx + half)} ${P(y)}" fill="none" stroke="${col || c.dark}" stroke-width="7" stroke-linecap="round"/>`;
    }
  },
  backstripes(L, c, col) {
    const b = L.box;
    for (let i = 0; i < 3; i++) { const x = b.cx - 14 + i * 18; L.bodyFront += `<path d="M${x} ${b.cy - b.ry + 3} L${x + 6} ${b.cy - b.ry + 18}" stroke="${col || OL}" stroke-width="5" stroke-linecap="round"/>`; }
  },
  hood(L, c) {
    const h = L.head;
    L.headBack += ell(h.x, h.y + h.r * 0.3, h.r * 1.75, h.r * 1.3, c.main);
    for (const sx of [-1, 1]) L.headBack += `<path d="M${P(h.x + sx * h.r * 1.15)} ${P(h.y - 4)} q${sx * 16} 12 0 36 q${-sx * 14} -16 0 -36 Z" fill="#e8453a" stroke="#f2d96a" stroke-width="4"/>`;
  },
  spikes(L, c, col, n = 5) {
    const b = L.box, k = +n;
    for (let i = 0; i < k; i++) {
      const a = (-80 + (160 * i) / Math.max(1, k - 1)) * Math.PI / 180;
      const px = b.cx + Math.sin(a) * b.rx, py = b.cy - Math.cos(a) * b.ry, nx = Math.sin(a), ny = -Math.cos(a), tx = -ny, ty = nx;
      L.back += poly([[px - tx * 10, py - ty * 10], [px + nx * 22, py + ny * 22], [px + tx * 10, py + ty * 10]], col || c.dark);
    }
  },
  ghostspikes(L, c) {
    const h = L.head;
    for (const a of [-34, 0, 34]) L.headBack += poly([at(h, a - 15, 0.9), at(h, a * 1.3, 1.5), at(h, a + 15, 0.9)], c.main);
  },
  whiskers(L) {
    const h = L.head;
    for (const sx of [-1, 1]) for (const k of [-1, 1]) {
      const x1 = h.x + sx * h.r * 0.5, y1 = h.y + h.r * 0.25 + k * 4;
      L.over += `<path d="M${P(x1)} ${P(y1)} L${P(h.x + sx * h.r * 1.05)} ${P(y1 + k * 7 - 2)}" stroke="${OL}" stroke-width="2"/>`;
    }
  },
  coin(L) { const [x, y] = at(L.head, 0, 0.6); L.headFront += ell(x, y, 9, 11, '#f2c94a') + flat(x, y, 4, 6, '#fff3b0'); },
  gem(L, c, col = '#e8453a') {
    const h = L.head, y = h.y - h.r * 0.58;
    L.headFront += poly([[h.x, y - 10], [h.x + 8, y], [h.x, y + 10], [h.x - 8, y]], col);
  },
  orb(L, c, col = '#5aa0e0') { const h = L.head; L.over += circ(h.x, h.y + h.r * 1.05, 8, col); },
  star(L) {
    const h = L.head, cx = h.x, cy = h.y - h.r * 0.58, pts = [];
    for (let i = 0; i < 10; i++) { const a = (Math.PI * 2 * i) / 10 - Math.PI / 2, r = i % 2 ? 4 : 10; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    L.headFront += poly(pts, '#e8453a');
  },
  mustache(L, c) {
    const h = L.head;
    for (const sx of [-1, 1]) L.over += thickPath(`M${P(h.x + sx * 4)} ${P(h.y + h.r * 0.28)} Q${P(h.x + sx * h.r * 0.8)} ${P(h.y + h.r * 0.3)} ${P(h.x + sx * h.r * 1.1)} ${P(h.y + h.r * 1.0)}`, shade(c.main, -12), 4);
  },
  spoon(L) {
    const [hx, hy] = handsOf(L)[1];
    L.over += `<path d="M${hx} ${hy} L${hx + 8} ${hy - 36}" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M${hx} ${hy} L${hx + 8} ${hy - 36}" stroke="#c0c8d8" stroke-width="4" stroke-linecap="round"/>` + ell(hx + 9, hy - 44, 7, 10, '#c0c8d8');
  },
  ridges(L, c) { for (const a of [-26, 0, 26]) { const [x, y] = at(L.head, a, 0.95); L.headBack += ell(x, y, 8, 12, c.main); } },
  belt(L) {
    const b = L.box, y = b.cy + b.ry * 0.25, half = b.rx * 0.95 * Math.sqrt(1 - 0.0625);
    L.bodyFront += `<rect x="${P(b.cx - half)}" y="${P(y - 5)}" width="${P(half * 2)}" height="10" fill="${OL}"/><rect x="${P(b.cx - 8)}" y="${P(y - 7)}" width="16" height="14" rx="2" fill="#f2c94a" ${S}/>`;
  },
  arms4(L, c) {
    const b = L.box;
    for (const sx of [-1, 1]) { const x = P(b.cx + sx * (b.rx + 2)), y = P(b.cy - b.ry * 0.5); L.back += ell(x, y, 10, 18, c.main, `transform="rotate(${sx * 45} ${x} ${y})"`); }
  },
  pignose(L) {
    const h = L.head;
    L.headFront += ell(h.x, h.y + h.r * 0.22, h.r * 0.28, h.r * 0.2, '#f2c0b0') + flat(h.x - 5, h.y + h.r * 0.22, 2.5, 3.5, OL) + flat(h.x + 5, h.y + h.r * 0.22, 2.5, 3.5, OL);
    L.mouthDy = 0.22;
  },
  swirl(L) {
    const b = L.box, cx = b.cx, cy = b.cy + b.ry * 0.32, R = b.rx * 0.42;
    let d = '';
    for (let t = 0; t <= Math.PI * 4; t += 0.25) { const rr = R * (t / (Math.PI * 4)); d += (d ? ' L' : 'M') + `${P(cx + Math.cos(t) * rr)} ${P(cy + Math.sin(t) * rr)}`; }
    L.bodyFront = circ(cx, cy, R + 4, '#fff') + `<path d="${d}" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>`;
    L.head = { ...L.head, y: L.head.y - b.ry * 0.16 };
  },
  gloves(L, c, col = '#fff', big) { for (const [x, y] of handsOf(L)) L.limbs += circ(x, y, big ? 17 : 11, col); },
  stingers(L) { for (const [x, y] of handsOf(L)) L.limbs += poly([[x - 7, y - 4], [x + 7, y - 4], [x, y + 26]], '#f2f2f6'); },
  claws(L) { for (const [x, y] of handsOf(L)) L.limbs += poly([[x - 6, y + 4], [x - 3, y + 14], [x, y + 4]], '#fff') + poly([[x, y + 4], [x + 3, y + 14], [x + 6, y + 4]], '#fff'); },
  skull(L) {
    const h = L.head, r = h.r * 1.04, yb = h.y - h.r * 0.22;
    L.headBack += poly([at(h, -30, 0.9), at(h, -24, 1.4), at(h, -10, 0.95)], '#f2ecd8') + poly([at(h, 10, 0.95), at(h, 24, 1.4), at(h, 30, 0.9)], '#f2ecd8');
    L.headFront += `<path d="M${P(h.x - r)} ${P(yb + 6)} A${P(r)} ${P(r)} 0 0 1 ${P(h.x + r)} ${P(yb + 6)} L${P(h.x + r * 0.7)} ${P(yb)} L${P(h.x + r * 0.3)} ${P(yb + 8)} L${P(h.x)} ${P(yb)} L${P(h.x - r * 0.3)} ${P(yb + 8)} L${P(h.x - r * 0.7)} ${P(yb)} Z" fill="#f2ecd8" ${S}/>` +
      `<path d="M${P(h.x - 10)} ${P(h.y - h.r * 0.75)} L${P(h.x + 10)} ${P(h.y - h.r * 0.6)}" stroke="#c8bca0" stroke-width="3"/>`;
  },
  bone(L) {
    const [hx, hy] = handsOf(L)[1];
    L.over += `<rect x="${hx - 4}" y="${hy - 44}" width="8" height="48" rx="3" fill="#f2ecd8" ${S}/>` + circ(hx - 6, hy - 46, 7, '#f2ecd8') + circ(hx + 6, hy - 46, 7, '#f2ecd8');
  },
  pouch(L, c) {
    const b = L.box, y = b.cy + 4;
    L.bodyFront += circ(b.cx, y - 4, 14, c.main) + drawFace({ x: b.cx, y: y - 6, r: 14 }, { eyes: 'dots', mouth: 'none' }) +
      `<path d="M${b.cx - 26} ${y} Q${b.cx} ${y + 34} ${b.cx + 26} ${y} Q${b.cx} ${y + 12} ${b.cx - 26} ${y} Z" fill="${c.belly}" ${S}/>`;
  },
  eggpouch(L, c) {
    const b = L.box, y = b.cy + b.ry * 0.3;
    L.bodyFront += ell(b.cx, y - 6, 12, 15, '#fff') + `<path d="M${b.cx - 28} ${y} Q${b.cx} ${y + 26} ${b.cx + 28} ${y} Q${b.cx} ${y + 10} ${b.cx - 28} ${y} Z" fill="${c.main}" ${S}/>`;
  },
  ruff(L, c, col = '#fff') {
    const h = L.head;
    for (let i = -3; i <= 3; i++) L.headBack += circ(h.x + i * h.r * 0.28, h.y + h.r * 0.95 - Math.abs(i) * 3, h.r * 0.22, col);
  },
  pendulum(L) {
    const [hx, hy] = handsOf(L)[0];
    L.over += `<path d="M${hx} ${hy} L${hx - 4} ${hy + 30}" stroke="#c0c8d8" stroke-width="2"/>` + circ(hx - 4, hy + 36, 8, '#c0c8d8');
  },
  trunk(L, c) {
    const h = L.head;
    L.over += `<path d="M${P(h.x - 7)} ${P(h.y + h.r * 0.05)} Q${P(h.x - 10)} ${P(h.y + h.r * 0.8)} ${P(h.x)} ${P(h.y + h.r * 0.85)} Q${P(h.x + 10)} ${P(h.y + h.r * 0.8)} ${P(h.x + 7)} ${P(h.y + h.r * 0.05)} Z" fill="${shade(c.main, -6)}" ${S}/>`;
  },
  clown(L) {
    const h = L.head, b = L.box;
    for (const sx of [-1, 1]) { const [x, y] = at(h, sx * 38, 1.0); L.headBack += ell(x, y, 14, 18, '#5a8fd0', `transform="rotate(${sx * 30} ${x} ${y})"`); }
    L.bodyFront += circ(b.cx, b.cy - 6, 9, '#f28ab0');
    for (const [x, y] of handsOf(L)) L.limbs += circ(x, y, 10, '#fff');
  },
  scythes(L, c, col = '#e8f0e0') {
    handsOf(L).forEach(([hx, hy], i) => {
      const sx = i ? 1 : -1;
      L.limbs += `<path d="M${hx} ${hy} Q${hx + sx * 42} ${hy - 30} ${hx + sx * 18} ${hy - 72} Q${hx + sx * 26} ${hy - 30} ${hx - sx * 2} ${hy - 8} Z" fill="${col}" ${S}/>`;
    });
  },
  longhair(L, c, col = '#f2d84a') {
    const h = L.head;
    L.headBack += ell(h.x, h.y + h.r * 0.7, h.r * 1.25, h.r * 1.45, col);
    L.headFront += `<path d="M${P(h.x - h.r)} ${P(h.y - h.r * 0.05)} Q${P(h.x)} ${P(h.y - h.r * 1.6)} ${P(h.x + h.r)} ${P(h.y - h.r * 0.05)} Q${P(h.x)} ${P(h.y - h.r * 0.55)} ${P(h.x - h.r)} ${P(h.y - h.r * 0.05)} Z" fill="${col}" ${S}/>`;
  },
  pincers(L) {
    const h = L.head;
    for (const sx of [-1, 1]) {
      const b1 = at(h, sx * 14, 0.9), b2 = at(h, sx * 40, 0.9);
      L.headBack += `<path d="M${b1} Q${P(h.x + sx * h.r * 1.5)} ${P(h.y - h.r * 1.2)} ${P(h.x + sx * h.r * 0.3)} ${P(h.y - h.r * 2.1)} Q${P(h.x + sx * h.r * 1.0)} ${P(h.y - h.r * 1.0)} ${b2} Z" fill="#ece4d4" ${S}/>`;
      for (const t of [0.35, 0.6]) { const [x, y] = [h.x + sx * h.r * (1.1 - t * 0.7), h.y - h.r * (1.0 + t * 0.9)]; L.headBack += poly([[x, y], [x - sx * 12, y + 2], [x - sx * 2, y + 10]], '#ece4d4'); }
    }
  },
  mane(L, c, col) {
    const h = L.head, b = L.box;
    for (let i = 0; i < 10; i++) { const [x, y] = at(h, i * 36, 0.98); L.headBack += circ(x, y, h.r * 0.34, col || c.belly); }
    if (b.cx > h.x + 20) L.bodyFront += ell(b.cx - b.rx * 0.7, b.cy - 4, 18, 22, col || c.belly);
  },
  collar(L, c, col, spiky) {
    const h = L.head, f = col || c.belly;
    for (let i = -2; i <= 2; i++) {
      const x = h.x + i * h.r * 0.32, y = h.y + h.r * 0.88 - Math.abs(i) * 2;
      L.headBack += spiky ? poly([[x - 9, y - 6], [x, y + 18], [x + 9, y - 6]], f) : circ(x, y, h.r * 0.24, f);
    }
  },
  knobshell(L) {
    const b = L.box;
    L.bodyFront += `<path d="M${b.cx - b.rx * 0.8} ${b.cy - 2} Q${b.cx} ${b.cy - b.ry * 2.1} ${b.cx + b.rx * 0.8} ${b.cy - 2} Z" fill="#a8a8b8" ${S}/>`;
    for (const [dx, dy] of [[-24, -14], [0, -24], [24, -14], [-10, -2], [14, -4]]) L.bodyFront += circ(b.cx + dx, b.cy + dy, 6, '#d8d8e0');
  },
  craters(L, c) {
    const b = L.box;
    for (const [dx, dy, r] of [[-30, -28, 7], [32, -20, 6], [-34, 22, 5], [28, 30, 6]]) L.bodyFront += flat(b.cx + dx, b.cy + dy, r, r, shade(c.main, -14));
  },
  skullmark(L) {
    const b = L.box, x = b.cx, y = b.cy + b.ry * 0.5;
    L.bodyFront += `<path d="M${x - 14} ${y + 6} L${x + 14} ${y + 16} M${x + 14} ${y + 6} L${x - 14} ${y + 16}" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` + `<circle cx="${x}" cy="${y}" r="8" fill="#fff"/>` + flat(x - 3, y, 2, 2.5, OL) + flat(x + 3, y, 2, 2.5, OL);
  },
  gaspuffs(L) {
    const b = L.box;
    for (const [dx, dy, r] of [[-62, 30, 14], [66, -26, 12], [58, 38, 10]]) L.back += flat(b.cx + dx, b.cy + dy, r, r * 0.8, '#c8b8a0', 'opacity=".8"');
  },
  magnets(L) {
    const b = L.box;
    for (const sx of [-1, 1]) {
      const x = b.cx + sx * (b.rx + 4), y = b.cy;
      L.limbs += thickPath(`M${x} ${y - 14} Q${x + sx * 20} ${y - 14} ${x + sx * 20} ${y} Q${x + sx * 20} ${y + 14} ${x} ${y + 14}`, '#b0b8c8', 9) +
        `<rect x="${P(x - 5)}" y="${y - 19}" width="9" height="10" fill="#e8453a" ${S}/><rect x="${P(x - 5)}" y="${y + 9}" width="9" height="10" fill="#3b82f6" ${S}/>`;
    }
    L.back += `<rect x="${b.cx - 4}" y="${b.cy - b.ry - 14}" width="8" height="18" fill="#c0c8d8" ${S}/>` + ell(b.cx, b.cy - b.ry - 14, 9, 4, '#c0c8d8');
    for (const sx of [-1, 1]) L.back += `<rect x="${b.cx + sx * 26 - 3}" y="${b.cy + b.ry - 6}" width="6" height="16" fill="#c0c8d8" ${S} transform="rotate(${sx * -30} ${b.cx + sx * 26} ${b.cy + b.ry})"/>`;
  },
  leek(L) {
    const b = L.box, x = b.cx + b.rx + 2, y = b.cy + 12;
    L.over += thickPath(`M${x} ${y} L${x + 18} ${y - 70}`, '#6cc56c', 8) + thickPath(`M${x} ${y} L${x + 5} ${y - 18}`, '#f6f6e8', 8) + leaf(x + 18, y - 70, 20, 22, 8, '#4fa24a', false);
  },
  fuzz(L, c) {
    const b = L.box;
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2, x = b.cx + Math.cos(a) * b.rx, y = b.cy + Math.sin(a) * b.ry, nx = Math.cos(a), ny = Math.sin(a);
      L.back += `<path d="M${P(x - ny * 6)} ${P(y + nx * 6)} L${P(x + nx * 10)} ${P(y + ny * 10)} L${P(x + ny * 6)} ${P(y - nx * 6)} Z" fill="${c.main}" ${S}/>`;
    }
  },
  hands(L, c) {
    const b = L.box;
    for (const sx of [-1, 1]) {
      const x = b.cx + sx * (b.rx + 26), y = b.cy - 10;
      L.over += ell(x, y, 15, 12, c.main) + circ(x + sx * 6, y - 12, 6, c.main) + circ(x - sx * 2, y - 14, 6, c.main) + circ(x - sx * 10, y - 10, 5, c.main);
    }
  },
  shoulderpads(L, c, col) { const b = L.box; for (const sx of [-1, 1]) L.limbs += ell(b.cx + sx * (b.rx - 8), b.cy - b.ry + 10, 16, 10, col || c.belly); },
  topfin(L, c, col) {
    const f = col || c.belly;
    if (L.blobHead) {
      const b = L.box, y = b.cy - b.ry + 8;
      L.back += `<path d="M${b.cx - 34} ${y} Q${b.cx - 30} ${y - 40} ${b.cx - 4} ${y - 30} Q${b.cx + 16} ${y - 46} ${b.cx + 34} ${y} Z" fill="${f}" ${S}/>`;
    } else {
      const h = L.head;
      L.headBack += `<path d="M${at(h, -30, 0.9)} Q${at(h, -10, 1.7)} ${at(h, 10, 1.3)} Q${at(h, 30, 1.8)} ${at(h, 40, 0.9)} Z" fill="${f}" ${S}/>`;
    }
  },
  barbels(L, c, col) {
    const h = L.head;
    for (const sx of [-1, 1]) L.over += thickPath(`M${P(h.x + sx * h.r * 0.3)} ${P(h.y + h.r * 0.35)} Q${P(h.x + sx * h.r * 0.95)} ${P(h.y + h.r * 0.5)} ${P(h.x + sx * h.r * 0.85)} ${P(h.y + h.r * 1.0)} Q${P(h.x + sx * h.r * 0.75)} ${P(h.y + h.r * 1.25)} ${P(h.x + sx * h.r * 1.0)} ${P(h.y + h.r * 1.3)}`, col || c.belly, 4);
  },
  rocks(L) {
    const b = L.box;
    for (const [dx, dy, s] of [[-30, 18, 9], [26, 24, 8], [-6, 36, 7], [34, -6, 6]]) {
      const x = b.cx + dx, y = b.cy + dy;
      L.bodyFront += poly([[x - s, y], [x - s * 0.4, y - s], [x + s * 0.8, y - s * 0.6], [x + s, y + s * 0.4], [x, y + s]], '#c8c0b0');
    }
  },
  cracks(L) {
    const b = L.box;
    L.bodyFront += `<path d="M${b.cx - 30} ${b.cy - 30} L${b.cx - 18} ${b.cy - 22} L${b.cx - 10} ${b.cy - 32} L${b.cx} ${b.cy - 24}" fill="none" stroke="${OL}" stroke-width="2.5"/>` +
      circ(b.cx + 22, b.cy + 26, 4, '#e8a0b0') + circ(b.cx - 20, b.cy + 34, 3, '#e8a0b0');
  },
  pokebody(L, c) {
    const b = L.box, r = b.rx;
    L.bodyFront = `<path d="M${b.cx - r} ${b.cy} A${r} ${r} 0 0 0 ${b.cx + r} ${b.cy} Z" fill="${c.belly}" ${S}/><path d="M${b.cx - r} ${b.cy} L${b.cx + r} ${b.cy}" stroke="${OL}" stroke-width="5"/>`;
  },
};

// ---------------- the 151 ----------------
const MON_SPEC = {
  egg: ['egg', '#f6c8d0', '#ffe8ee', 'cracks', {}],
  2: ['quad', '#6cc5a8', '#9adcc4', 'bud spots:#3e9c80:4 ears:small eyes:red', {}],
  3: ['quad', '#5fb89a', '#9adcc4', 'venusflower spots:#3e9c80:4 ears:small eyes:red', { hr: 38 }],
  5: ['biped', '#e8573a', '#f7d08a', 'flametail horn:#e8573a:0.6 eyes:angry', {}],
  6: ['biped', '#f6923a', '#f7d58a', 'wings:dragon:#3aa0a0 flametail horns2:#f6923a', { big: 1 }],
  8: ['biped', '#8db7f0', '#f4e1a6', 'shell fluffytail:#eef3ff ears:fluffy plates', {}],
  9: ['biped', '#4a7bd0', '#f4e1a6', 'shell cannons plates ears:small', { big: 1 }],
  10: ['worm', '#9bd04a', '#f3e7a0', 'yantenna', {}],
  11: ['cocoon', '#7fbf3a', '#a8d870', 'eyes:sleepy nocheeks', {}],
  12: ['ball', '#6a6ad0', '#8a8ae0', 'wings:butterfly antennae:#2d2a3e eyes:compound:#e8453a', { r: 34, cy: 110, arms: 1 }],
  13: ['worm', '#d9a35a', '#f0c9a0', 'horn:#f6f6f6:0.9 mouth:nose:#f2a0b8', {}],
  14: ['cocoon', '#e8c23a', '#f6dc80', 'eyes:sleepy nocheeks', {}],
  15: ['biped', '#f2c94c', '#f6e090', 'stripes:#2d2a3e wings:bug antennae:#2d2a3e eyes:red mouth:none stingers', { tall: 1 }],
  16: ['bird', '#b8875a', '#f3dcb8', 'crest:#8a5a3a', {}],
  17: ['bird', '#b8875a', '#f3dcb8', 'crest:#e8453a:long birdtail:#e8453a', {}],
  18: ['bird', '#c99a6a', '#f3dcb8', 'crest:#f2c94a:long birdtail:#e8453a', { big: 1 }],
  19: ['quad', '#9a6ac0', '#f3e3c0', 'ears:round curltail:#9a6ac0 whiskers mouth:teeth', {}],
  20: ['quad', '#c9965a', '#f3e3c0', 'ears:round whiskers mouth:teeth curltail:#c9965a', {}],
  21: ['bird', '#b07a4a', '#f3dcb8', 'crest:#e8453a eyes:angry wings:bird:#c98a5a', {}],
  22: ['bird', '#b88a5a', '#f3dcb8', 'crest:#e8453a:long mouth:longbeak eyes:angry', {}],
  23: ['serpent', '#9b6ac8', '#f2d96a', 'eyes:normal', {}],
  24: ['serpent', '#8a5ac0', '#f2d96a', 'hood eyes:angry mouth:fangs', {}],
  26: ['biped', '#f39c3a', '#f7d8a0', 'ears:bigtipped:#5a3a2a thintail cheeks:#f2c94a', {}],
  27: ['biped', '#e8c86a', '#f6e8c0', 'plates:#d9b36a claws ears:small', {}],
  28: ['biped', '#d9b36a', '#f6e8c0', 'spikes:#8a5a2a:6 claws ears:small', {}],
  29: ['quad', '#9ab8e0', '#d8e6f6', 'ears:big spots:#4a6aa0:4 horn:#f6f6f6:0.4 whiskers', {}],
  30: ['biped', '#8fb5e0', '#e8eef6', 'ears:big spots:#4a6aa0:3 spikes:#4a6aa0:4', {}],
  31: ['biped', '#5a8fc8', '#f2e3b8', 'ears:pointy spikes:#3a5a90:5 horn:#d8e6f6:0.6', { big: 1 }],
  32: ['quad', '#c08ad0', '#ecd8f2', 'ears:big spots:#8a4aa0:4 horn:#f6f6f6:0.8 spikes:#8a4aa0:3', {}],
  33: ['quad', '#c07ad0', '#ecd8f2', 'ears:big horn:#f6f6f6:0.9 spikes:#8a4aa0:4 eyes:angry', {}],
  34: ['biped', '#9a5ac0', '#ecd8f2', 'ears:pointy horn:#f6f6f6:1 spikes:#6a3a90:5 eyes:angry', { big: 1 }],
  35: ['blob', '#f6b8c6', '#fbd8e0', 'ears:tipped:#8a5a3a curl wings:tiny:#fbd8e0', { rx: 50, ry: 50 }],
  36: ['blob', '#f6a8bc', '#fbd8e0', 'ears:tipped:#5a3a2a curl wings:tiny:#fbd8e0', { rx: 54, ry: 56 }],
  37: ['quad', '#d9774a', '#f2c8a0', 'ears:big tails:6:#e8874a curl', {}],
  38: ['quad', '#f2dca0', '#f8ecc8', 'ears:pointy tails:9:#f2dca0 collar:#f8ecc8 eyes:red', {}],
  39: ['ball', '#f6b8c6', '#fbd8e0', 'ears:big curl eyes:big:#3b9ef0', { feet: 1, arms: 1 }],
  40: ['blob', '#f6b8c6', '#ffffff', 'ears:long curl eyes:big:#3b9ef0', {}],
  41: ['ball', '#5a8fd0', '#8ab0e8', 'ears:long wings:bat:#a070d0 eyes:none mouth:fangs', { r: 34, cy: 104 }],
  42: ['ball', '#5a8fd0', '#8ab0e8', 'ears:pointy wings:bat:#a070d0 eyes:angry mouth:open', { r: 44 }],
  43: ['ball', '#4a6ad0', '#6a8ae0', 'leaves eyes:red:#e8453a', { feet: 1, r: 40 }],
  44: ['ball', '#4a5ab0', '#6a7ad0', 'petals:#d0603a mouth:open', { feet: 1, arms: 1, r: 44 }],
  45: ['ball', '#4a6ab0', '#6a8ad0', 'bigflower:#e8453a', { feet: 1, arms: 1, r: 44 }],
  46: ['quad', '#f2954a', '#f6c890', 'mushroom', {}],
  47: ['quad', '#f2853a', '#f6c890', 'mushroom:big eyes:blank', {}],
  48: ['ball', '#8a5ac0', '#a080d0', 'fuzz antennae:#8a5ac0 eyes:compound:#e8453a mouth:fangs', { feet: 1, r: 50 }],
  49: ['ball', '#b08ae0', '#d0b8f0', 'wings:butterfly:#c8a8f0 antennae:#8a5ac0 eyes:compound:#5a8fd0', { r: 32, arms: 1 }],
  50: ['mound', '#a06a3a', '#c08a5a', 'eyes:dots nocheeks', {}],
  51: ['multi', null, null, '', { parts: [[50, -46, 12, 0.66], [50, 46, 12, 0.66], [50, 0, -4, 0.72]] }],
  52: ['biped', '#f2e0b0', '#f8ecd0', 'ears:cat:#3a2a2a coin whiskers curltail:#a06a3a', { hr: 44 }],
  53: ['quad', '#f2e0b0', '#f8ecd0', 'ears:cat:#3a2a2a gem:#e8453a whiskers curltail:#f2e0b0 eyes:angry', {}],
  54: ['biped', '#f6d24a', '#f8e48a', 'mouth:duck:#f6e8c0 tuft eyes:dots', { hr: 44 }],
  55: ['biped', '#4a8ad0', '#7aaae0', 'mouth:duck:#f6e08a gem:#e8453a eyes:red', { tall: 1 }],
  56: ['ball', '#f2e0c8', '#f8ecd8', 'pignose ears:small eyes:angry mouth:none', { feet: 1, arms: 1, r: 46 }],
  57: ['ball', '#f2e0c8', '#f8ecd8', 'pignose ears:small eyes:angry mouth:fangs', { feet: 1, arms: 1, r: 52 }],
  58: ['quad', '#f2853a', '#f6e8c0', 'ears:pointy backstripes:#2d2a3e collar:#f6e8c0 fluffytail:#f6e8c0', {}],
  59: ['quad', '#f2853a', '#f6e8c0', 'ears:pointy backstripes:#2d2a3e mane:#f6e8c0 fluffytail:#f6e8c0', { hr: 40 }],
  60: ['ball', '#5a8fd0', '#ffffff', 'swirl fintail:#e8eef6 mouth:none', { feet: 1, r: 50 }],
  61: ['ball', '#4a7fd0', '#ffffff', 'swirl gloves:#ffffff mouth:none', { feet: 1, arms: 1, r: 52 }],
  62: ['ball', '#3a6ac0', '#ffffff', 'swirl gloves:#ffffff eyes:angry mouth:none', { feet: 1, arms: 1, r: 54 }],
  63: ['biped', '#f2c94a', '#c08a4a', 'ears:pointy eyes:sleepy shoulderpads:#a06a3a curltail:#f2c94a mouth:none', {}],
  64: ['biped', '#f2c94a', '#c08a4a', 'ears:pointy star mustache spoon eyes:angry shoulderpads:#a06a3a', { tall: 1 }],
  65: ['biped', '#f2c94a', '#c08a4a', 'ears:pointy mustache spoon eyes:angry shoulderpads:#a06a3a', { tall: 1 }],
  66: ['biped', '#a8b8c8', '#d8e0e8', 'ridges eyes:red', {}],
  67: ['biped', '#8a98b0', '#b0bcd0', 'ridges belt eyes:red', { big: 1 }],
  68: ['biped', '#7a8ab0', '#a8b4d0', 'ridges belt arms4 eyes:red mouth:none', { big: 1 }],
  69: ['sprout', '#f2d84a', '#4fa24a', '', {}],
  70: ['bell', '#f2d84a', '#4fa24a', 'eyes:angry', {}],
  71: ['bell', '#d8d84a', '#4fa24a', 'eyes:angry', { lid: 1 }],
  72: ['jelly', '#7ac0f0', '#5aa0e0', '', { gems: 2, tent: 2 }],
  73: ['jelly', '#5aa0e0', '#3a80d0', '', { gems: 3, tent: 6 }],
  74: ['rock', '#a8a090', '#c8c0b0', 'eyes:angry', { arms: 2 }],
  75: ['rock', '#9a9080', '#c0b8a8', 'eyes:angry rocks mouth:open', { arms: 4 }],
  76: ['ball', '#b0a080', '#d8cfb0', 'rocks eyes:angry mouth:open', { feet: 1, arms: 1, r: 56 }],
  77: ['quad', '#f6e8c0', '#fffaf0', 'flamemane flametail', {}],
  78: ['quad', '#f6e8c0', '#fffaf0', 'flamemane flametail horn:#f6f6f6:1', {}],
  79: ['quad', '#f2a0b8', '#f6e0c8', 'eyes:sleepy longtail:#f2a0b8 ears:small mouth:open', {}],
  80: ['biped', '#f2a0b8', '#f6e0c8', 'eyes:sleepy longtail:#f2a0b8 ears:small mouth:open', {}],
  81: ['ball', '#b0b8c8', '#d0d8e0', 'eyes:one magnets mouth:none nocheeks', { r: 34, cy: 104, nobelly: 1 }],
  82: ['multi', null, null, '', { parts: [[81, -42, 16, 0.78], [81, 42, 16, 0.78], [81, 0, -24, 0.78]] }],
  83: ['bird', '#b8875a', '#f3dcb8', 'leek brows', {}],
  84: ['doduo', '#b8875a', '#f3dcb8', '', { n: 2 }],
  85: ['doduo', '#a8784a', '#f3dcb8', '', { n: 3 }],
  86: ['seal', '#e8f0f8', '#ffffff', 'horn:#f6f6ff:0.5 mouth:tongueout', {}],
  87: ['seal', '#f2f6fa', '#ffffff', 'horn:#ffffff:0.8', {}],
  88: ['sludge', '#9a6ac8', '#b88ae0', 'mouth:open', {}],
  89: ['sludge', '#8a5ab8', '#a87ad0', 'mouth:open', { wide: 1 }],
  90: ['clam', '#8a6ad0', '#2d2a3e', 'eyes:white mouth:tongueout nocheeks', {}],
  91: ['clam', '#6a6aa0', '#2d2a3e', 'eyes:white mouth:none nocheeks', { spiky: 1 }],
  92: ['gas', '#2d2340', '#a070d0', 'eyes:white mouth:fangs nocheeks', {}],
  93: ['ghost', '#8a6ac8', '#a888d8', 'ghostspikes hands eyes:angry mouth:grin nocheeks', {}],
  94: ['blob', '#7a5ab8', '#9a7ad0', 'ears:pointy spikes:#7a5ab8:5 eyes:red:#e8453a mouth:grin nocheeks', { rx: 58, ry: 52 }],
  95: ['boulders', '#a8a8b0', '#c8c8d0', 'horn:#a8a8b0:0.6 eyes:angry nocheeks', {}],
  96: ['biped', '#f2c94a', '#8a5a3a', 'trunk eyes:sleepy mouth:none', { big: 1 }],
  97: ['biped', '#f2d84a', '#f2e8b0', 'ruff:#ffffff ears:pointy trunk pendulum eyes:sleepy mouth:none', { tall: 1 }],
  98: ['crab', '#e8653a', '#f6e0c0', '', {}],
  99: ['crab', '#e8553a', '#f6e0c0', 'eyes:angry', { bigclaw: 1 }],
  100: ['ball', '#e8453a', '#ffffff', 'pokebody eyes:angry mouth:none nocheeks', { r: 52 }],
  101: ['ball', '#ffffff', '#e8453a', 'pokebody eyes:angry mouth:grin nocheeks', { r: 56 }],
  102: ['multi', null, null, '', { parts: [['egg', -54, 30, 0.42], ['egg', 0, 34, 0.42], ['egg', 54, 30, 0.42], ['egg', -28, -6, 0.42], ['egg', 28, -6, 0.42], ['egg', 0, -42, 0.42]] }],
  103: ['palm', '#c9965a', '#4fa24a', '', {}],
  104: ['biped', '#b88a5a', '#f2e0b8', 'skull bone', {}],
  105: ['biped', '#a8784a', '#f2e0b8', 'skull bone eyes:angry', {}],
  106: ['biped', '#c9a07a', '#e8d0b0', 'eyes:angry mouth:none', { tall: 1 }],
  107: ['biped', '#c9a07a', '#a080c0', 'gloves:#e8453a:big eyes:angry mouth:none', {}],
  108: ['biped', '#f2a0b8', '#f6e0c8', 'mouth:tongue curltail:#f2a0b8', { big: 1 }],
  109: ['ball', '#8a6ac0', '#a88ad0', 'craters skullmark gaspuffs eyes:angry mouth:grin nocheeks', { r: 52, nobelly: 1 }],
  110: ['multi', null, null, '', { parts: [[109, 40, 26, 0.6], [109, -26, -12, 0.78]] }],
  111: ['quad', '#a8a8b8', '#c8c8d0', 'horn:#f6f6f6:0.8 spikes:#8a8a9a:5 eyes:angry', {}],
  112: ['biped', '#a8a8b8', '#d8d0c8', 'drillhorn plates:#b8b0a8 eyes:angry spikes:#8a8a9a:3', { big: 1 }],
  113: ['blob', '#f6c8d0', '#ffffff', 'eggpouch ears:round:#f6c8d0', { rx: 52, ry: 58 }],
  114: ['vines', '#3a5ab0', '#5a7ad0', '', {}],
  115: ['biped', '#a8845a', '#f2dca0', 'pouch ears:pointy', { big: 1 }],
  116: ['seahorse', '#6ab0e8', '#f2e8a0', '', {}],
  117: ['seahorse', '#4a90d8', '#f2e8a0', 'eyes:angry', {}],
  118: ['fish', '#f6f6f6', '#ffffff', 'spots:#f2853a:3 horn:#f6f6f6:0.8', {}],
  119: ['fish', '#f2853a', '#ffffff', 'spots:#ffffff:3 horn:#f6f6f6:1', {}],
  120: ['star', '#c9965a', '#e8c08a', '', {}],
  121: ['star', '#8a6ac0', '#a88ad0', '', { double: 1 }],
  122: ['biped', '#f2c8d0', '#ffffff', 'clown', { tall: 1 }],
  123: ['biped', '#8ad06a', '#e8f0c0', 'scythes:#e8f0e0 wings:bug eyes:angry mouth:none horn:#8ad06a:0.4', { tall: 1 }],
  124: ['biped', '#7a4ab0', '#d0444a', 'longhair:#f2d84a mouth:lips', { tall: 1, bodyCol: '#d0444a' }],
  125: ['biped', '#f2d84a', '#f6e8a0', 'stripes:#2d2a3e antennae:#f2d84a eyes:angry mouth:fangs', { big: 1 }],
  126: ['biped', '#f2853a', '#f2d84a', 'flamehead flametail mouth:lips:#f2d84a eyes:angry', {}],
  127: ['biped', '#b8a07a', '#d8c8a8', 'pincers eyes:angry mouth:teeth', {}],
  128: ['quad', '#c9965a', '#d8b080', 'bullhorns mane:#8a5a3a tails:3:#5a3a2a eyes:angry', {}],
  129: ['fish', '#f2753a', '#f6e8c0', 'topfin:#f6e08a barbels:#f6e08a eyes:white mouth:open', {}],
  130: ['serpent', '#3a7ad0', '#f2e3a0', 'topfin:#f6f6f6 barbels:#f6f6f6 horn:#3a7ad0:0.8 eyes:angry mouth:open nocheeks', { hr: 38 }],
  131: ['longneck', '#5aa0e0', '#f2e8c8', 'knobshell horn:#5aa0e0:0.5', {}],
  132: ['blob', '#c8a0e0', '#d8b8ec', 'eyes:dots nocheeks', { nofeet: 1, rx: 58, ry: 44 }],
  133: ['quad', '#b8875a', '#f2e0b8', 'ears:big collar:#f2e0b8 fluffytail:#b8875a:#f2e0b8', {}],
  134: ['quad', '#6ab0e8', '#d8f0ff', 'ears:fin:#f6f6ff ruff:#f6f6ff fintail:#4a90d8', {}],
  135: ['quad', '#f6d84a', '#f8eaa0', 'ears:big collar:#ffffff:spiky spikes:#f8eaa0:3', {}],
  136: ['quad', '#f2853a', '#f8e08a', 'ears:big collar:#f8e08a fluffytail:#f8e08a curl', {}],
  137: ['porygon', '#f2a0b8', '#5aa0e0', '', {}],
  138: ['spiral', '#6ab0e8', '#f2e3c0', '', {}],
  139: ['spiral', '#5aa0e0', '#f2e3c0', 'mouth:fangs', { spiky: 1 }],
  140: ['dome', '#b8823a', '#2d2a3e', '', {}],
  141: ['biped', '#b8823a', '#d8b070', 'scythes:#d8d0c0 eyes:red mouth:none', { tall: 1 }],
  142: ['bird', '#b8a8c8', '#d8d0e0', 'wings:dragon:#9a88b0 mouth:fangs eyes:angry', {}],
  143: ['blob', '#3a6a7a', '#f2e3c8', 'eyes:sleepy ears:small claws', { rx: 68, ry: 60 }],
  144: ['bird', '#6ab8e8', '#d8f0ff', 'crest:#3a7ad0:long birdtail:#6ab8e8 wings:bird:#8acaf0', { big: 1 }],
  145: ['bird', '#f6d84a', '#f8e8a0', 'crest:#2d2a3e wings:spiky:#f6d84a eyes:angry', { big: 1 }],
  146: ['bird', '#f6c84a', '#f8e08a', 'flamehead wings:flame birdtail:#f2853a eyes:angry', { big: 1 }],
  147: ['serpent', '#7ab0f0', '#ffffff', 'ears:fin:#ffffff', {}],
  148: ['serpent', '#4a8ad0', '#ffffff', 'ears:fin:#ffffff horn:#ffffff:0.6 orb:#5aa0e0', {}],
  149: ['biped', '#f2a84a', '#f2e3a0', 'antennae:#f2a84a wings:tiny:#3aa0a0 longtail:#f2a84a', { big: 1 }],
  150: ['biped', '#d8cce0', '#a87ac8', 'ears:small longtail:#a87ac8 eyes:red:#a050d0 mouth:none', { tall: 1 }],
  151: ['biped', '#f6c0d8', '#f8d8e8', 'ears:big longtail:#f6c0d8 eyes:big:#5aa0e0', { hr: 44 }],
};

// ---------------- builder ----------------
function buildMon(spec, seed) {
  const [shape, main, belly, featStr = '', o = {}] = spec;
  if (shape === 'multi') {
    const inner = o.parts.map(([ref, dx, dy, s]) => {
      const sub = buildMon(MON_SPEC[ref], hashStr(String(ref)));
      return `<g transform="translate(${P(dx + 100 * (1 - s))} ${P(dy + 100 * (1 - s) + 10)}) scale(${s})">${sub.inner}</g>`;
    }).join('');
    return { inner, float: false };
  }
  const c = { main, belly, dark: shade(main, -22) };
  const L = { back: '', headBack: '', body: '', bodyFront: '', limbs: '', headFront: '', over: '', eyes: 'normal', mouth: 'smile', cheeks: '#ff7a8a', rng: rngFrom(seed || 1) };
  SHAPES[shape](L, c, o);
  const feats = featStr.trim() ? featStr.trim().split(/\s+/) : [];
  if (L.isBird && !feats.some((f) => f.startsWith('wings'))) {
    const b = L.box;
    L.limbs += [-1, 1].map((sx) => ell(b.cx + sx * b.rx * 0.82, b.cy, 13, 26, c.dark, `transform="rotate(${sx * 14} ${P(b.cx + sx * b.rx * 0.82)} ${b.cy})"`)).join('');
  }
  if (L.isBird && !feats.some((f) => f.startsWith('birdtail'))) FEAT.birdtail(L, c);
  for (const f of feats) {
    const [name, ...args] = f.split(':');
    if (name === 'eyes') { L.eyes = args[0]; L.iris = args[1]; continue; }
    if (name === 'mouth') { L.mouth = args[0]; L.mouthCol = args[1]; continue; }
    if (name === 'nocheeks') { L.cheeks = null; continue; }
    if (name === 'cheeks') { L.cheeks = args[0]; continue; }
    if (name === 'brows') { L.brows = true; continue; }
    if (FEAT[name]) FEAT[name](L, c, ...args);
  }
  const h = L.head;
  const headShape = !h || L.blobHead ? '' : circ(h.x, h.y, h.r, c.main);
  const face = h ? drawFace(h, { eyes: L.eyes, iris: L.iris, mouth: L.mouth, mouthCol: L.mouthCol, cheeks: L.cheeks, brows: L.brows, mouthDy: L.mouthDy }) : '';
  const inner = L.back + (L.blobHead ? L.headBack : '') + L.body + L.bodyFront + L.limbs + (L.blobHead ? '' : L.headBack) + headShape + L.headFront + face + L.over;
  return { inner, float: !!L.float };
}

const _svgCache = {};
function monSVG(mon) {
  if (_svgCache[mon.id]) return _svgCache[mon.id];
  let inner, float = false;
  if (STARTER_ART[mon.id]) inner = STARTER_ART[mon.id]();
  else {
    let spec = MON_SPEC[mon.id];
    if (!spec) { const t = TYPE_HSL[mon.types[0]]; spec = ['blob', '#c8b8a8', '#ffffff', '', {}]; }
    ({ inner, float } = buildMon(spec, hashStr(mon.name)));
  }
  const shadow = float
    ? '<ellipse cx="100" cy="194" rx="36" ry="6" fill="rgba(0,0,0,.12)"/>'
    : '<ellipse cx="100" cy="192" rx="56" ry="8" fill="rgba(0,0,0,.14)"/>';
  const svg = `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" aria-label="${mon.name}" role="img">${shadow}<g class="mon-body${float ? ' floaty' : ''}">${inner}</g></svg>`;
  _svgCache[mon.id] = svg;
  return svg;
}
