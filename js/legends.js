// legends.js — drawings for the three ORIGINAL legendary creatures (tournaments 4–6).
// They are new designs that only share the "sea / land / sky" idea: Tidalon, Magmor and Skyvern.

const star4 = (x, y, r, fill) => `<path d="M${x} ${y - r} Q${x + r * 0.25} ${y - r * 0.25} ${x + r} ${y} Q${x + r * 0.25} ${y + r * 0.25} ${x} ${y + r} Q${x - r * 0.25} ${y + r * 0.25} ${x - r} ${y} Q${x - r * 0.25} ${y - r * 0.25} ${x} ${y - r} Z" fill="${fill}"/>`;
const happyEyes = (pts, r = 8) => pts.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${r * 0.8}" ry="${r}" fill="${OL}"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`).join('');

// Tidalon — a big, friendly teal ocean whale with glowing star spots, fin-wings and a water spout.
STARTER_ART[152] = () => `
  <path d="M100 58 Q92 40 80 34 M100 58 Q100 34 100 24 M100 58 Q108 40 120 34" fill="none" stroke="#7dd3fc" stroke-width="6" stroke-linecap="round"/>
  <circle cx="80" cy="32" r="6" fill="#bae6fd" ${S}/><circle cx="100" cy="22" r="7" fill="#bae6fd" ${S}/><circle cx="120" cy="32" r="6" fill="#bae6fd" ${S}/>
  <path d="M158 116 Q178 108 184 86 Q194 100 196 112 Q194 124 184 138 Q178 120 158 128 Z" fill="#14b8a6" ${S}/>
  <ellipse cx="150" cy="150" rx="26" ry="12" transform="rotate(30 150 150)" fill="#0d9488" ${S}/>
  <ellipse cx="94" cy="120" rx="72" ry="52" fill="#2dd4bf" ${S}/>
  <path d="M104 70 Q114 56 126 64 Q118 70 114 78 Z" fill="#0d9488" ${S}/>
  <ellipse cx="86" cy="146" rx="50" ry="22" fill="#ecfeff"/>
  <path d="M50 146 Q86 158 122 146" fill="none" stroke="#a5f3fc" stroke-width="3"/>
  ${star4(120, 96, 9, '#fde047')}${star4(142, 116, 7, '#fde047')}${star4(132, 78, 6, '#fef08a')}${star4(64, 82, 6, '#fef08a')}
  <ellipse cx="34" cy="146" rx="26" ry="12" transform="rotate(-30 34 146)" fill="#0d9488" ${S}/>
  ${happyEyes([[58, 112], [88, 108]], 9)}
  <path d="M56 128 Q72 142 90 126" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="44" cy="124" r="6" fill="#fb7185" opacity=".5"/><circle cx="102" cy="120" r="6" fill="#fb7185" opacity=".5"/>`;

// Magmor — a huge, gentle lava armadillo: rocky dome shell with glowing orange cracks.
STARTER_ART[153] = () => `
  ${[60, 88, 128, 156].map((x) => `<rect x="${x - 11}" y="150" width="22" height="34" rx="9" fill="#57534e" ${S}/>`).join('')}
  <path d="M170 150 Q190 150 192 130 Q182 140 172 138 Z" fill="#78716c" ${S}/>
  <path d="M34 156 Q34 64 108 62 Q182 64 182 156 Z" fill="#78716c" ${S}/>
  <path d="M56 156 Q58 96 108 92 M160 156 Q158 96 108 92 M108 64 L108 156" fill="none" stroke="#57534e" stroke-width="4"/>
  <path d="M74 88 L84 104 L78 116 L90 130 M136 84 L128 100 L138 112 L130 128 M100 120 L112 132 L104 146" fill="none" stroke="#fb923c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M74 88 L84 104 L78 116 L90 130 M136 84 L128 100 L138 112 L130 128 M100 120 L112 132 L104 146" fill="none" stroke="#fde047" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  ${[[86, 74], [130, 72], [150, 100], [66, 112]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="#a8a29e" ${S}/>`).join('')}
  <path d="M30 146 Q20 150 18 162" fill="none" stroke="#fb923c" stroke-width="5" stroke-linecap="round"/>
  <circle cx="40" cy="130" r="32" fill="#a8a29e" ${S}/>
  <path d="M10 126 L-2 118 L12 112 Z" fill="#e7e5e4" ${S}/>
  <ellipse cx="22" cy="138" rx="12" ry="9" fill="#d6d3d1" ${S}/><circle cx="17" cy="137" r="2" fill="${OL}"/><circle cx="26" cy="137" r="2" fill="${OL}"/>
  ${happyEyes([[34, 120], [56, 120]], 7)}
  <path d="M32 152 Q44 160 56 150" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="62" cy="140" r="6" fill="#fb923c" opacity=".7"/>`;

// Skyvern — a long purple serpent dragon coiling through clouds, with feathery wing tufts and golden horns.
STARTER_ART[154] = () => `
  ${[[36, 168, 18], [56, 176, 14], [150, 40, 16], [170, 48, 12], [180, 170, 16], [160, 178, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="#e0e7ff" stroke-width="3"/>`).join('')}
  <path d="M176 176 Q196 160 180 142 Q160 124 120 140 Q76 156 66 128 Q56 96 92 86 Q118 80 112 60" fill="none" stroke="${OL}" stroke-width="34" stroke-linecap="round"/>
  <path d="M176 176 Q196 160 180 142 Q160 124 120 140 Q76 156 66 128 Q56 96 92 86 Q118 80 112 60" fill="none" stroke="#a78bfa" stroke-width="28" stroke-linecap="round"/>
  <path d="M176 176 Q196 160 180 142 Q160 124 120 140 Q76 156 66 128 Q56 96 92 86 Q118 80 112 60" fill="none" stroke="#fbcfe8" stroke-width="8" stroke-linecap="round" stroke-dasharray="9 10"/>
  <path d="M150 126 Q160 98 186 100 Q176 110 182 120 Q168 118 162 132 Z" fill="#ede9fe" ${S}/>
  <path d="M62 112 Q36 96 26 116 Q38 114 40 126 Q52 116 64 124 Z" fill="#ede9fe" ${S}/>
  <circle cx="188" cy="176" r="12" fill="#ffffff" stroke="#c4b5fd" stroke-width="3"/>
  <path d="M96 40 Q86 20 96 10 Q100 24 106 30 Z M128 40 Q138 20 130 10 Q124 24 118 30 Z" fill="#facc15" ${S}/>
  <circle cx="112" cy="54" r="30" fill="#a78bfa" ${S}/>
  <ellipse cx="112" cy="68" rx="16" ry="11" fill="#ddd6fe" ${S}/>
  <path d="M96 70 Q80 74 74 86 M128 70 Q144 74 150 86" fill="none" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
  ${happyEyes([[100, 48], [124, 48]], 7)}
  <path d="M104 72 Q112 78 120 72" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="90" cy="60" r="5" fill="#f9a8d4" opacity=".7"/><circle cx="134" cy="60" r="5" fill="#f9a8d4" opacity=".7"/>`;
