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
