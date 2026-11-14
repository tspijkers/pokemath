// PokeMath — main game
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const app = document.getElementById('app');
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- save data ----------
// Each player has their own save. The old single save (from before profiles) is LEGACY_KEY.
const LEGACY_KEY = 'pokemath-save-v1';
const PROFILES = [
  { id: 'tommy', name: 'Tommy', pin: '0611', color: '#3b82f6' },
  { id: 'evan', name: 'Evan', pin: '1000', color: '#22c55e' },
  { id: 'user3', name: 'Kurtzes', pin: '6143', color: '#f97316' },
  { id: 'user4', name: 'User 4', pin: '0300', color: '#a855f7' },
  { id: 'user5', name: 'User 5', pin: '4000', color: '#ec4899' },
  { id: 'user6', name: 'User 6', pin: '5555', color: '#14b8a6' },
];
// One-time reset of every player's game on this device. Raise RESET_ROUND to wipe all games again.
const RESET_ROUND = '1';
try {
  if (localStorage.getItem('pokemath-reset-round') !== RESET_ROUND) {
    Object.keys(localStorage).filter((k) => k.startsWith('pokemath-save')).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem('pokemath-reset-round', RESET_ROUND);
  }
} catch (e) {}
let profile = null;
let SAVE_KEY = null;
let save = null;
const keyFor = (id) => `pokemath-save-v1:${id}`;
function readSave(key) {
  try { const s = JSON.parse(localStorage.getItem(key)); if (s && s.partner && DEX[s.partner.id]) return s; } catch (e) {}
  return null;
}
function loadSave() {
  if (!SAVE_KEY) return null;
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.partner && DEX[s.partner.id]) return upgradeSave(s);
  } catch (e) {}
  return null;
}
// Older saves only tracked the partner's rank. Give every caught Pokémon its own.
function upgradeSave(s) {
  if (!s.team) {
    s.team = {};
    for (const id of Object.keys(s.caught)) s.team[id] = { rank: 1, rounds: 0 };
    s.team[s.partner.id] = { rank: s.partner.level || 1, rounds: 0 };
  }
  for (const id of Object.keys(s.caught)) { s.caught[id] = 1; if (!s.team[id]) s.team[id] = { rank: 1, rounds: 0 }; }
  if (!s.active || !s.team[s.active]) s.active = s.partner.id;
  return s;
}
function persist() {
  if (!SAVE_KEY || !save) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
}
const caughtCount = () => Object.keys(save.caught).length;
// The Pokémon he's currently using for Train / Catch / Battle
const partnerMon = () => DEX[save.active];
const activeRank = () => save.team[save.active].rank;
const knownMoves = () => movesFor(save.active).slice(0, activeRank());
const groupBonus = (id) => GROUP_BONUS[LEVEL_OF[id]] || 1;

// ---------- learning stats (per player) ----------
// words / facts: { seen, wrong, streak } — "tricky" = missed at least once and not yet right 3 times in a row.
const MASTERED_STREAK = 3;
const statsOf = (s = save) => (s.stats ||= { words: {}, facts: {}, days: {} });
function recordItem(kind, key, firstTry) {
  if (!save) return;
  const it = (statsOf()[kind][key] ||= { seen: 0, wrong: 0, streak: 0 });
  it.seen++;
  if (firstTry) it.streak++; else { it.wrong++; it.streak = 0; }
  persist();
}
function trickyList(s, kind) {
  if (!s || !s.stats) return [];
  return Object.entries(s.stats[kind] || {})
    .filter(([, v]) => v.wrong > 0 && v.streak < MASTERED_STREAK)
    .sort((a, b) => b[1].wrong - a[1].wrong || a[1].streak - b[1].streak)
    .map(([key, v]) => ({ key, ...v }));
}
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// count a minute of play for the signed-in player while the app is open and visible
setInterval(() => {
  if (!save || !profile || document.visibilityState !== 'visible') return;
  const days = statsOf().days, k = todayKey();
  days[k] = (days[k] || 0) + 1;
  for (const d of Object.keys(days).sort().slice(0, -60)) delete days[d]; // keep ~2 months
  persist();
}, 60000);

// ---------- sound & voice ----------
const Sound = {
  ctx: null,
  init() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(freq, dur, type = 'triangle', when = 0, vol = 0.14) {
    const c = this.ctx; if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + when;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
  },
  tap() { this.tone(700, 0.05, 'triangle', 0, 0.06); },
  correct() { this.tone(660, 0.12); this.tone(990, 0.2, 'triangle', 0.1); },
  wrong() { this.tone(240, 0.18, 'square', 0, 0.05); this.tone(200, 0.22, 'square', 0.12, 0.05); },
  hit() { this.tone(160, 0.18, 'sawtooth', 0, 0.09); this.tone(90, 0.2, 'square', 0.05, 0.06); },
  win() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.22, 'triangle', i * 0.12)); },
  levelUp() { [523, 587, 659, 784, 880, 1047].forEach((f, i) => this.tone(f, 0.18, 'triangle', i * 0.09)); },
  wobble() { this.tone(330, 0.1, 'triangle', 0, 0.08); },
  sad() { [392, 349, 311, 262].forEach((f, i) => this.tone(f, 0.28, 'triangle', i * 0.22)); },
};
document.addEventListener('pointerdown', () => Sound.init(), { passive: true });

function speak(text, rate = 0.85) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate; u.pitch = 1.1;
    speechSynthesis.speak(u);
  } catch (e) {}
}

// ---------- screens ----------
let screenToken = 0;
let cleanups = [];
function show(html) {
  cleanups.forEach((f) => f()); cleanups = [];
  try { speechSynthesis.cancel(); } catch (e) {}
  screenToken++;
  app.innerHTML = html;
  window.scrollTo(0, 0);
  return screenToken;
}
const alive = (tok) => tok === screenToken;

app.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]');
  if (!go) return;
  Sound.tap();
  ({ menu: screenMenu, home: screenHome, train: screenTrain, catch: screenCatch, battle: screenBattle, dex: screenDex, reading: () => screenReading() })[go.dataset.go]();
});

const topbar = (title, back = 'home') => `<header class="topbar"><button class="home-btn" data-go="${back}" aria-label="Back">${back === 'reading' ? '🗺️' : '🏠'}</button><div class="topbar-title">${title}</div><div class="topbar-spacer"></div></header>`;

function modal(html, buttons) {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'modal-back';
    el.innerHTML = `<div class="modal">${html}<div class="modal-buttons">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-i="${i}">${b.label}</button>`).join('')}</div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-i]');
      if (!b) return;
      Sound.tap();
      el.remove();
      resolve(buttons[+b.dataset.i].value);
    });
  });
}

function confetti() {
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#ef4444', '#ffd43b', '#3b82f6', '#22c55e', '#a855f7', '#f97316'];
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.background = pick(colors);
    s.style.animationDelay = Math.random() * 0.6 + 's';
    s.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
    s.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}

// ---------- math problems ----------
const TRAIN_PROBLEMS = 6;   // problems to learn one new move
const ATTACK_PROBLEMS = 2;  // problems before each attack in Catch / Battle
// The kinds of problems depend on the chosen Level (see MATH_LEVELS in data.js).
const mathLevel = () => (save && MATH_LEVELS[save.mathLevel]) ? save.mathLevel : 1;
const OP_SIGN = { '+': '+', '-': '−', 'x': '×' };
const OP_WORD = { '+': 'plus', '-': 'minus', 'x': 'times' };
let lastProblem = null;
function makeProblem() {
  const cfg = MATH_LEVELS[mathLevel()];
  const ops = [];
  if (cfg.addSub) ops.push('+', '-');
  if (cfg.mul) ops.push('x');
  let p;
  // About 1 in 3 problems is a tricky fact this player missed before (if it fits the current level).
  const okFact = (a, op, b) => ops.includes(op) && (op === 'x' ? a <= cfg.mul && b <= cfg.mul : a <= cfg.addSub && b <= cfg.addSub && (op === '+' || b < a));
  const tricky = trickyList(save, 'facts').map((t) => t.key.match(/^(\d+)([+x-])(\d+)$/)).filter(Boolean)
    .map(([, a, op, b]) => ({ a: +a, op, b: +b })).filter((t) => okFact(t.a, t.op, t.b) && !(lastProblem && t.a === lastProblem.a && t.b === lastProblem.b && t.op === lastProblem.op));
  if (tricky.length && Math.random() < 0.33) {
    const t = pick(tricky);
    p = { ...t, ans: t.op === '+' ? t.a + t.b : t.op === '-' ? t.a - t.b : t.a * t.b };
    lastProblem = p;
    return p;
  }
  do {
    const op = pick(ops);
    if (op === '+') {
      const a = rand(1, cfg.addSub), b = rand(1, cfg.addSub);
      p = { a, b, op, ans: a + b };
    } else if (op === '-') {
      const a = rand(2, cfg.addSub), b = rand(1, a - 1);
      p = { a, b, op, ans: a - b };
    } else {
      const a = rand(1, cfg.mul), b = rand(1, cfg.mul);
      p = { a, b, op, ans: a * b };
    }
  } while (lastProblem && p.a === lastProblem.a && p.b === lastProblem.b && p.op === lastProblem.op);
  lastProblem = p;
  return p;
}

// Shows problems in `host` until `count` were answered right on the FIRST try.
// A missed problem is retried until right, then the exact same problem comes back
// (one problem later) and only counts once it is answered right the first time.
// Resolves with the number of wrong tries.
function solveProblems(host, { count = 5, title = '' } = {}) {
  return new Promise((resolve) => {
    let i = 0, mistakes = 0, input = '', p = makeProblem(), busy = false, missedThis = false;
    const comeback = []; // missed problems that must be answered right first time
    let isComeback = false;
    host.innerHTML = `
      <div class="quiz">
        <div class="quiz-head">
          <div class="quiz-title">${title}</div>
          <div class="dots">${Array.from({ length: count }, () => '<span class="dot"></span>').join('')}</div>
        </div>
        <div class="problem">
          <span class="eq"></span><span class="answer"></span>
          <button class="speak" aria-label="Read it to me">🔊</button>
        </div>
        <div class="feedback">&nbsp;</div>
        <div class="keypad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-k="${n}">${n}</button>`).join('')}
          <button data-k="del" class="k-del" aria-label="Erase">⌫</button>
          <button data-k="0">0</button>
          <button data-k="ok" class="k-ok" aria-label="Check">✓</button>
        </div>
      </div>`;
    const eq = $('.eq', host), ans = $('.answer', host), fb = $('.feedback', host), quiz = $('.quiz', host);
    const dots = $$('.dot', host);
    const render = () => {
      eq.textContent = `${p.a} ${OP_SIGN[p.op]} ${p.b} =`;
      quiz.classList.toggle('again', isComeback);
      ans.textContent = input || '?';
      ans.classList.toggle('empty', !input);
      dots.forEach((d, k) => { d.classList.toggle('done', k < i); d.classList.toggle('current', k === i); });
    };
    const check = () => {
      if (+input === p.ans) {
        busy = true;
        Sound.correct();
        fb.textContent = pick(PRAISE); fb.className = 'feedback good';
        ans.classList.add('right');
        recordItem('facts', `${p.a}${p.op}${p.b}`, !missedThis);
        if (missedThis) comeback.push(p); else i++;
        render();
        setTimeout(() => {
          if (i >= count && !comeback.length) { cleanup(); resolve(mistakes); return; }
          // the same problem comes back after one other problem (or right away if no new ones are needed)
          if (comeback.length && (!missedThis || i >= count)) { p = comeback.shift(); isComeback = true; }
          else { p = makeProblem(); isComeback = false; }
          input = ''; missedThis = false;
          ans.classList.remove('right');
          fb.innerHTML = '&nbsp;'; fb.className = 'feedback';
          busy = false; render();
        }, 750);
      } else {
        mistakes++; missedThis = true;
        Sound.wrong();
        fb.textContent = 'Not quite — try again!'; fb.className = 'feedback bad';
        quiz.classList.remove('shake'); void quiz.offsetWidth; quiz.classList.add('shake');
        input = ''; render();
      }
    };
    const press = (k) => {
      if (busy) return;
      if (k === 'del') input = input.slice(0, -1);
      else if (k === 'ok') { if (input) check(); return; }
      else if (input.length < 3) input += k;
      Sound.tap();
      render();
    };
    $('.keypad', host).addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) press(b.dataset.k);
    });
    $('.speak', host).addEventListener('click', () => speak(`${p.a} ${OP_WORD[p.op]} ${p.b}`));
    const onKey = (e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('del');
      else if (e.key === 'Enter') press('ok');
    };
    document.addEventListener('keydown', onKey);
    const cleanup = () => document.removeEventListener('keydown', onKey);
    cleanups.push(cleanup);
    render();
  });
}

// ---------- choose partner ----------
function screenChoose() {
  show(`
    <div class="screen choose">
      <h1 class="logo">Poke<span>Learn</span></h1>
      <p class="subtitle">Pick your partner Pokémon!</p>
      <div class="starter-grid">
        ${STARTERS.map((id) => {
          const m = DEX[id];
          return `<button class="starter-card t-${m.types[0]}" data-id="${id}">
            <div class="sprite bob">${monSVG(m)}</div>
            <div class="name">${m.name}</div>
            <div class="type-pill t-${m.types[0]}">${TYPE_LABEL[m.types[0]]}</div>
          </button>`;
        }).join('')}
      </div>
    </div>`);
  $$('.starter-card').forEach((card) => card.addEventListener('click', async () => {
    Sound.tap();
    const m = DEX[+card.dataset.id];
    const yes = await modal(
      `<div class="sprite modal-sprite bob">${monSVG(m)}</div><h2>Choose ${m.name}?</h2><p>${m.name} will be your partner!</p>`,
      [{ label: 'Not yet', value: false, cls: 'grey' }, { label: `Yes, ${m.name}!`, value: true, cls: 'green' }]
    );
    if (!yes) return;
    save = { partner: { id: m.id }, caught: { [m.id]: 1 }, team: { [m.id]: { rank: 1, rounds: 0 } }, active: m.id, mathLevel: save?.mathLevel || 1 };
    persist();
    Sound.win();
    confetti();
    screenMenu();
  }));
}

// ---------- start menu: Math or Reading ----------
function screenMenu() {
  if (!profile) return screenProfiles();
  if (!save) return screenChoose();
  ensureReading();
  show(`
    <div class="screen menu">
      <div class="menu-top"><button class="btn player-btn" id="switch-player" style="--pc:${profile.color}">👤 ${profile.name} <small>switch</small></button><button class="btn gear-btn" id="settings" aria-label="Settings">⚙️</button></div>
      <h1 class="logo">Poke<span>Learn</span></h1>
      <div class="sprite menu-buddy bob">${monSVG(partnerMon())}</div>
      <p class="subtitle">What do you want to do today?</p>
      <div class="menu-grid">
        <button class="menu-btn m-math" data-go="home"><span class="icon">🔢</span><span><span class="poke">Poke</span>Math</span><small>Level ${mathLevel()} · ${caughtCount()} Pokémon</small></button>
        <button class="menu-btn m-read" data-go="reading"><span class="icon">📖</span><span><span class="poke">Poke</span>Read</span><small>${badgeCount()} of ${JOURNEYS.length} badges</small></button>
      </div>
    </div>`);
  $('#settings').addEventListener('click', openSettings);
  $('#switch-player').addEventListener('click', () => { Sound.tap(); screenProfiles(); });
  showStickerPopups();
}

// ---------- who's playing? ----------
function profileSummary(p) {
  const s = readSave(keyFor(p.id));
  if (!s) return { s: null, text: 'New player' };
  const badges = s.reading ? s.reading.badges.filter(Boolean).length : 0;
  return { s, text: `${Object.keys(s.caught).length} Pokémon · ${badges} badge${badges === 1 ? '' : 's'}` };
}
function screenProfiles() {
  profile = null; SAVE_KEY = null; save = null;
  readingView = null; lastProblem = null;
  show(`
    <div class="screen profiles">
      <h1 class="logo">Poke<span>Learn</span></h1>
      <p class="subtitle">Who is playing?</p>
      <div class="profile-grid">
        ${PROFILES.map((p) => {
          const { s, text } = profileSummary(p);
          return `<button class="profile-card" data-id="${p.id}" style="--pc:${p.color}">
            <div class="profile-avatar">${s ? `<div class="sprite">${monSVG(DEX[s.active || s.partner.id])}</div>` : `<span>${p.name[0]}</span>`}</div>
            <div class="profile-name">${p.name}</div>
            <div class="profile-sub">${text}</div>
          </button>`;
        }).join('')}
      </div>
      <button class="btn grey small parent-btn" id="parent">👪 Parent</button>
    </div>`);
  $('#parent').addEventListener('click', () => { Sound.tap(); askPin(PARENT, () => screenParent()); });
  $('.profile-grid').addEventListener('click', (e) => {
    const c = e.target.closest('.profile-card');
    if (!c) return;
    Sound.tap();
    askPin(PROFILES.find((p) => p.id === c.dataset.id));
  });
}
function askPin(p, onOk = openProfile) {
  let code = '';
  const el = document.createElement('div');
  el.className = 'modal-back';
  el.innerHTML = `
    <div class="modal pin-modal" style="--pc:${p.color}">
      <div class="profile-avatar small"><span>${p.name[0]}</span></div>
      <h2>Hi ${p.name}!</h2>
      <p>Type your secret code</p>
      <div class="pin-dots">${[0, 1, 2, 3].map(() => '<span></span>').join('')}</div>
      <div class="keypad pin-pad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-k="${n}">${n}</button>`).join('')}
        <button data-k="back" class="k-del" aria-label="Back">✕</button><button data-k="0">0</button><button data-k="del" class="k-del" aria-label="Erase">⌫</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  const dots = [...el.querySelectorAll('.pin-dots span')], box = el.querySelector('.pin-modal');
  const draw = () => dots.forEach((d, i) => d.classList.toggle('on', i < code.length));
  const close = () => { el.remove(); document.removeEventListener('keydown', onKey); };
  const press = (k) => {
    if (k === 'back') { Sound.tap(); close(); return; }
    if (k === 'del') { code = code.slice(0, -1); Sound.tap(); draw(); return; }
    if (code.length >= 4) return;
    code += k; Sound.tap(); draw();
    if (code.length === 4) {
      if (code === p.pin) { setTimeout(() => { close(); onOk(p); }, 200); }
      else {
        setTimeout(() => {
          Sound.wrong();
          box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
          code = ''; draw();
        }, 200);
      }
    }
  };
  el.querySelector('.pin-pad').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) press(b.dataset.k); });
  el.addEventListener('click', (e) => { if (e.target === el) close(); });
  const onKey = (e) => { if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Escape') press('back'); };
  document.addEventListener('keydown', onKey);
}
// ---------- parent page ----------
const PARENT = { id: 'parent', name: 'Parent', pin: '2580', color: '#475569' };
const factLabel = (k) => k.replace(/^(\d+)([+x-])(\d+)$/, (_, a, op, b) => `${a} ${OP_SIGN[op]} ${b}`);
function screenParent(sel = PROFILES[0].id) {
  const p = PROFILES.find((x) => x.id === sel);
  const s = readSave(keyFor(p.id));
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const mins = days.map((d) => (s && s.stats && s.stats.days[todayKey(d)]) || 0);
  const maxMin = Math.max(10, ...mins);
  const tw = trickyList(s, 'words'), tf = trickyList(s, 'facts');
  const count = (kind, fn) => Object.values((s && s.stats && s.stats[kind]) || {}).filter(fn).length;
  const legends = s ? LEVEL_POKEMON[LEGENDARY_GROUP].filter((id) => s.caught[id]).length : 0;
  const tWon = s && s.reading && s.reading.tournaments ? s.reading.tournaments.filter((t) => t.won).length : 0;
  const chips = (list, label) => list.length
    ? list.slice(0, 12).map((t) => `<span class="tricky-chip"><b>${label(t.key)}</b> missed ${t.wrong}×${t.streak ? ` · ${t.streak}/${MASTERED_STREAK} right` : ''}</span>`).join('')
    : '<p class="muted">Nothing tricky yet 🎉</p>';
  show(`
    <div class="screen parent">
      <header class="topbar"><button class="home-btn" id="parent-exit" aria-label="Back">🏠</button><div class="topbar-title">👪 Parent page</div><div class="topbar-spacer"></div></header>
      <div class="parent-tabs">${PROFILES.map((x) => `<button class="parent-tab${x.id === sel ? ' on' : ''}" data-id="${x.id}" style="--pc:${x.color}">${x.name}</button>`).join('')}</div>
      ${!s ? `<div class="card parent-card"><h2>${p.name}</h2><p class="muted">${p.name} hasn't started a game yet.</p></div>` : `
      <div class="parent-grid">
        <div class="card parent-card">
          <h3>Progress</h3>
          <div class="stat-row"><span>Partner</span><b>${DEX[s.partner.id].name}</b></div>
          <div class="stat-row"><span>Pokémon caught</span><b>${Object.keys(s.caught).length} / ${DEX_COUNT}</b></div>
          <div class="stat-row"><span>PokeMath level</span><b>Level ${s.mathLevel || 1}</b></div>
          <div class="stat-row"><span>Reading badges</span><b>${s.reading ? s.reading.badges.filter(Boolean).length : 0} / ${JOURNEYS.length}</b></div>
          <div class="stat-row"><span>Tournaments won</span><b>${tWon} / ${TOURNAMENTS.length}</b></div>
          <div class="stat-row"><span>Legendary Pokémon</span><b>${legends}</b></div>
        </div>
        <div class="card parent-card">
          <h3>Time played (last 7 days): ${mins.reduce((a, b) => a + b, 0)} min</h3>
          <div class="week-bars">${days.map((d, i) => `<div class="week-bar"><div class="bar-val">${mins[i] || ''}</div><div class="bar" style="height:${Math.round((mins[i] / maxMin) * 100)}%"></div><div class="bar-day">${d.toLocaleDateString(undefined, { weekday: 'short' })}</div></div>`).join('')}</div>
        </div>
        <div class="card parent-card wide">
          <h3>📖 Tricky words <small>${tw.length} to practice · ${count('words', (v) => v.streak >= MASTERED_STREAK)} read well 3× in a row</small></h3>
          <div class="tricky-list">${chips(tw, (k) => k)}</div>
        </div>
        <div class="card parent-card wide">
          <h3>🔢 Tricky math facts <small>${tf.length} to practice · ${count('facts', (v) => v.streak >= MASTERED_STREAK)} answered right 3× in a row</small></h3>
          <div class="tricky-list">${chips(tf, factLabel)}</div>
        </div>
      </div>
      <div class="card parent-card wide parent-stickers">
        <h3>⭐ Stickers <small>${stickerCount(s)} of ${STICKERS.length}</small></h3>
        <div class="parent-sticker-row">${STICKERS.map((st) => `<div class="ps${earnedStickers(s)[st.id] ? ' got' : ''}" title="${st.name}: ${st.goal}">${stickerSVG(st, !!earnedStickers(s)[st.id])}</div>`).join('')}</div>
      </div>
      <p class="muted parent-note">Tricky items come back more often in stops, tournaments and math problems until they're answered right ${MASTERED_STREAK} times in a row.</p>`}
    </div>`);
  $('.parent-tabs').addEventListener('click', (e) => { const t = e.target.closest('.parent-tab'); if (t) { Sound.tap(); screenParent(t.dataset.id); } });
  $('#parent-exit').addEventListener('click', () => { Sound.tap(); screenProfiles(); });
}

async function openProfile(p) {
  profile = p;
  SAVE_KEY = keyFor(p.id);
  save = loadSave();
  // A game saved before profiles existed: ask once who it belongs to.
  const legacy = readSave(LEGACY_KEY);
  if (!save && legacy) {
    const badges = legacy.reading ? legacy.reading.badges.filter(Boolean).length : 0;
    const mine = await modal(
      `<div class="sprite modal-sprite bob">${monSVG(DEX[legacy.active || legacy.partner.id])}</div>
       <h2>Is this your game?</h2>
       <p>There is a game from before with ${DEX[legacy.partner.id].name}, ${Object.keys(legacy.caught).length} Pokémon and ${badges} reading badge${badges === 1 ? '' : 's'}.</p>`,
      [{ label: 'No, start new', value: false, cls: 'grey' }, { label: 'Yes, it is mine!', value: true, cls: 'green' }]
    );
    if (mine) {
      try { localStorage.setItem(SAVE_KEY, localStorage.getItem(LEGACY_KEY)); localStorage.removeItem(LEGACY_KEY); } catch (e) {}
      save = loadSave();
    }
  }
  Sound.levelUp();
  screenMenu();
}

// ---------- home ----------
function roundDots(n) {
  return `<span class="round-dots">${[0, 1, 2, 3].map((k) => `<span class="rdot${k < n ? ' on' : ''}"></span>`).join('')}</span>`;
}
function screenHome() {
  if (!save) return screenChoose();
  const m = partnerMon(), lvl = activeRank();
  const next = movesFor(m.id)[lvl];
  show(`
    <div class="screen home">
      <header class="home-top">
        <div class="home-left"><button class="home-btn" data-go="menu" aria-label="Menu">🏠</button><h1 class="logo small">Poke<span>Math</span></h1></div>
        <div class="top-buttons">
          <button class="btn dex-btn sticker-btn" id="stickers">⭐ Stickers <b>${stickerCount()}/${STICKERS.length}</b></button>
          <button class="btn dex-btn" data-go="dex">📖 My Pokémon <b>${caughtCount()}</b></button>
          <button class="btn level-btn lv-${mathLevel()}" id="level">🎯 Level ${mathLevel()}</button>
          <button class="btn gear-btn" id="settings" aria-label="Settings">⚙️</button>
        </div>
      </header>
      <div class="partner-card">
        <div class="sprite partner-sprite bob">${monSVG(m)}</div>
        <div class="partner-info">
          <div class="pname">${m.name}${m.id === save.partner.id ? ' <span class="partner-star" title="Your first partner">⭐</span>' : ''}</div>
          <div class="level">Rank ${lvl} <span class="stars">${'★'.repeat(lvl)}<span class="off">${'★'.repeat(5 - lvl)}</span></span></div>
          <div class="moves-label">Moves</div>
          <div class="moves">${knownMoves().map((mv) => `<span class="move-chip t-${mv.type}">${mv.name}</span>`).join('')}</div>
          ${next
            ? `<div class="next">Next move: <b>${next.name}</b></div>`
            : `<div class="next">🏆 Top rank — ${m.name} knows every move!</div>`}
          ${caughtCount() > 1 ? '<button class="btn blue switch-btn" id="switch">🔄 Switch Pokémon</button>' : ''}
        </div>
      </div>
      <div class="actions">
        <button class="action a-train" data-go="train"><span class="icon">💪</span><span>Train</span></button>
        <button class="action a-catch" data-go="catch"><span class="icon">${ballSVG()}</span><span>Catch</span></button>
        <button class="action a-battle" data-go="battle"><span class="icon">⚔️</span><span>Battle</span></button>
      </div>
    </div>`);
  $('#settings').addEventListener('click', openSettings);
  $('#level').addEventListener('click', openLevels);
  $('#switch')?.addEventListener('click', () => { Sound.tap(); screenDex(true); });
  $('#stickers').addEventListener('click', () => { Sound.tap(); screenStickers('home'); });
  showStickerPopups();
}

// Make a caught Pokémon the one used for Train / Catch / Battle
function useMon(id) {
  save.active = id;
  persist();
  Sound.levelUp();
  screenHome();
}

const caughtInLevel = (lv) => LEVEL_POKEMON[lv].filter((id) => save.caught[id]).length;

async function openLevels() {
  Sound.tap();
  const cur = mathLevel();
  const choice = await modal(
    `<h2>Pick a Level</h2><p>Each level has its own math and its own Pokémon to find.</p>`,
    [1, 2, 3, 4].map((lv) => ({
      value: lv,
      cls: `level-opt lv-${lv}${lv === cur ? ' current' : ''}`,
      label: `<span class="lv-num">${lv}</span><span class="lv-text"><b>Level ${lv}: ${MATH_LEVELS[lv].label}</b><small>${caughtInLevel(lv)} of ${LEVEL_POKEMON[lv].length} Pokémon caught${lv === cur ? ' · playing now' : ''}</small></span>`,
    })).concat([{ value: 0, cls: 'grey', label: 'Close' }])
  );
  if (!choice || choice === cur) return;
  save.mathLevel = choice;
  lastProblem = null;
  persist();
  Sound.levelUp();
  screenHome();
}

async function openSettings() {
  Sound.tap();
  const choice = await modal(
    `<div class="big-emoji">⚙️</div><h2>Settings</h2>
     <p>Playing as <b>${profile.name}</b>.</p>
     <p>Reset starts <b>${profile.name}'s</b> game over: a new partner, and all ranks, caught Pokémon and reading badges are erased. Other players are not affected.</p>`,
    [{ label: 'Close', value: 'close', cls: 'grey' }, { label: '👤 Switch user', value: 'switch', cls: 'blue' }, { label: '🔄 Reset game', value: 'reset', cls: 'red' }]
  );
  if (choice === 'switch') { screenProfiles(); return; }
  if (choice !== 'reset') return;
  const sure = await modal(
    `<h2>Are you sure?</h2><p>Everything in ${profile.name}'s game will be erased, and ${profile.name} will choose a new partner.</p>`,
    [{ label: 'No, keep playing', value: false, cls: 'green' }, { label: 'Yes, reset', value: true, cls: 'red' }]
  );
  if (!sure) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  save = null;
  screenChoose();
}

// ---------- train ----------
function screenTrain() {
  const tok = show(`
    <div class="screen train">
      ${topbar('Training')}
      <div class="split">
        <div class="stage"><div class="sprite stage-sprite bob">${monSVG(partnerMon())}</div></div>
        <div class="panel card"></div>
      </div>
    </div>`);
  const panel = $('.panel');
  const m = partnerMon();

  const intro = () => {
    const me = save.team[m.id], lvl = me.rank;
    if (lvl >= 5) {
      panel.innerHTML = `
        <div class="center-msg">
          <div class="big-emoji">🏆</div>
          <h2>${m.name} is at the top rank!</h2>
          <p>${m.name} knows all 5 moves. You can still practice for fun.</p>
          <div class="btn-row"><button class="btn grey" data-go="home">Home</button><button class="btn green" id="practice">Practice</button></div>
        </div>`;
      $('#practice').onclick = async () => {
        Sound.tap();
        await solveProblems(panel, { count: TRAIN_PROBLEMS, title: 'Practice' });
        if (!alive(tok)) return;
        Sound.win();
        panel.innerHTML = `<div class="center-msg"><div class="big-emoji">⭐</div><h2>Great practice!</h2>
          <div class="btn-row"><button class="btn grey" data-go="home">Home</button><button class="btn green" id="again">Again</button></div></div>`;
        $('#again').onclick = () => { Sound.tap(); intro(); $('#practice')?.click(); };
      };
      return;
    }
    const next = movesFor(m.id)[lvl];
    panel.innerHTML = `
      <div class="center-msg">
        <p class="kicker">Learning a new move</p>
        <h2 class="move-title t-${next.type}">${next.name}</h2>
        <p>Solve ${TRAIN_PROBLEMS} problems to learn it!</p>
        <button class="btn green big" id="start">Start training</button>
      </div>`;
    $('#start').onclick = () => { Sound.tap(); runRound(); };
  };

  const runRound = async () => {
    const me = save.team[m.id], next = movesFor(m.id)[me.rank];
    await solveProblems(panel, { count: TRAIN_PROBLEMS, title: `Learning <b class="t-text-${next.type}">${next.name}</b>` });
    if (!alive(tok)) return;
    {
      const learned = next;
      me.rank++;
      bumpCounter('trainings');
      me.rounds = 0;
      persist();
      Sound.levelUp();
      confetti();
      $('.stage-sprite').classList.add('jump');
      panel.innerHTML = `
        <div class="center-msg">
          <div class="big-emoji">🎉</div>
          <h2>${m.name} reached Rank ${me.rank}!</h2>
          <p>${m.name} learned <b class="t-text-${learned.type}">${learned.name}</b>!</p>
          <div class="btn-row"><button class="btn grey" data-go="home">Home</button>${me.rank < 5 ? '<button class="btn green" id="more">Keep training</button>' : ''}</div>
        </div>`;
      $('#more')?.addEventListener('click', () => { Sound.tap(); intro(); });
    }
  };
  intro();
}

// ---------- battle helpers ----------
function pickWild() {
  const ids = [];
  const weights = [];
  for (const id of LEVEL_POKEMON[mathLevel()]) {
    if (save.caught[id]) continue; // no double catches
    let w = 1;
    if (LEGENDARY.has(id)) w = 0.12;
    else if (FINAL_FORMS.has(id)) w = 0.5;
    ids.push(id); weights.push(w);
  }
  if (!ids.length) return null;
  let total = weights.reduce((a, b) => a + b, 0), x = Math.random() * total;
  for (let i = 0; i < ids.length; i++) { x -= weights[i]; if (x <= 0) return DEX[ids[i]]; }
  return DEX[ids[0]];
}
function makeFoe(mon, wild = false) {
  if (wild) {
    // Wild Pokémon have a random rank (1–5), independent of the player's Pokémon.
    const rank = rand(1, 5);
    const maxHp = 45 + 12 * rank + rand(0, 10);
    return { mon, level: rank, maxHp, hp: maxHp };
  }
  const L = activeRank();
  const maxHp = 50 + 10 * L + rand(0, 10);
  return { mon, level: Math.max(1, Math.min(5, L + rand(-1, 1))), maxHp, hp: maxHp };
}

function hpBox(name, level, hp, maxHp, catchLine) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const color = pct > 50 ? 'green' : pct > 25 ? 'yellow' : 'red';
  return `
    <div class="hp-name"><span>${name}</span><span class="hp-lv">${'★'.repeat(level)}</span></div>
    <div class="hp-bar"><div class="hp-fill ${color}" style="width:${pct}%"></div>${catchLine ? `<div class="catch-line" style="left:${(20 / maxHp) * 100}%"></div>` : ''}</div>
    <div class="hp-num">${Math.max(0, hp)} / ${maxHp} HP</div>`;
}

function battleShell(title, back = 'home') {
  return `
    <div class="screen battle-screen">
      ${topbar(title, back)}
      <div class="battle-layout">
        <div class="arena">
          <div class="foe-side">
            <div class="hpbox foe-hp"></div>
            <div class="sprite foe-sprite"></div>
          </div>
          <div class="ally-side">
            <div class="sprite ally-sprite"></div>
            <div class="hpbox ally-hp"></div>
          </div>
          <div class="fx"></div>
        </div>
        <div class="panel card"></div>
      </div>
    </div>`;
}

function say(panel, html, ms = 1600) {
  return new Promise((resolve) => {
    panel.innerHTML = `<div class="message">${html}<div class="tap-hint">tap to continue</div></div>`;
    let done = false;
    const finish = () => { if (done) return; done = true; resolve(); };
    panel.firstElementChild.addEventListener('click', finish);
    setTimeout(finish, ms);
  });
}

function floatText(sideEl, text, cls) {
  const s = document.createElement('div');
  s.className = `float-text ${cls}`;
  s.textContent = text;
  sideEl.appendChild(s);
  setTimeout(() => s.remove(), 1300);
}

function burst(sideEl, type) {
  const colors = { fire: ['#ff6a2b', '#ffd43b'], water: ['#5bb6f0', '#d7f0ff'], grass: ['#4fa24a', '#a8e6a0'], electric: ['#ffd43b', '#fff6a0'], normal: ['#ffffff', '#ffe08a'] }[type] || ['#fff', '#ddd'];
  const fx = document.createElement('div');
  fx.className = 'burst';
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    const a = (Math.PI * 2 * i) / 14, d = 60 + Math.random() * 50;
    p.style.setProperty('--dx', Math.cos(a) * d + 'px');
    p.style.setProperty('--dy', Math.sin(a) * d + 'px');
    p.style.background = colors[i % 2];
    fx.appendChild(p);
  }
  sideEl.appendChild(fx);
  setTimeout(() => fx.remove(), 800);
}

function retrigger(el, cls) {
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
}

// ---------- the battle ----------
// cfg: { mode: 'wild' | 'trainer', foes: [...], trainer?: name,
//        allyId?: Pokémon to use (default: the active one), ask?: (panel, move, tok) => mistakes,
//        title?, back?: 'home' | 'reading', onWin?: (panel, pm) => void, onRun?: () => void,
//        party?: ids he may switch between, foePower?: base hit size (tournaments; perfect answers still always win) }
async function runBattle(cfg) {
  const isWild = cfg.mode === 'wild';
  const tok = show(battleShell(cfg.title || (isWild ? 'Catch' : 'Battle'), cfg.back || 'home'));
  const panel = $('.panel'), foeSide = $('.foe-side'), allySide = $('.ally-side');
  const foeSprite = $('.foe-sprite'), allySprite = $('.ally-sprite');
  // The player's side: one Pokémon at a time, optionally a party to switch between.
  const party = cfg.party ? cfg.party.filter((id) => save.team[id]) : null;
  const hpOf = {};
  const maxHpFor = (id) => Math.round((70 + 10 * save.team[id].rank) * groupBonus(id));
  const stateOf = (id) => (hpOf[id] ||= { maxHp: maxHpFor(id), hp: maxHpFor(id) });
  let allyId, pm, allyRank, allyMoves, bonus, ally;
  const setAlly = (id) => { allyId = id; pm = DEX[id]; allyRank = save.team[id].rank; allyMoves = movesFor(id).slice(0, allyRank); bonus = groupBonus(id); ally = stateOf(id); };
  setAlly(cfg.allyId || save.active);
  const aliveOthers = () => (party || []).filter((id) => id !== allyId && stateOf(id).hp > 0);
  const teamHpLeft = () => (party ? party.reduce((sum, id) => sum + Math.max(0, stateOf(id).hp), 0) : ally.hp);
  const foes = cfg.foes.map((f) => ({ ...f, hp: f.maxHp }));
  let fi = 0;
  const foe = () => foes[fi];

  const drawFoe = () => {
    $('.foe-hp').innerHTML = hpBox(foe().mon.name, foe().level, foe().hp, foe().maxHp, isWild);
    $('.foe-hp').classList.toggle('catchable', isWild && foe().hp < 20);
  };
  const drawAlly = () => { $('.ally-hp').innerHTML = hpBox(pm.name, allyRank, ally.hp, ally.maxHp, false); };
  const setFoeSprite = () => { foeSprite.innerHTML = monSVG(foe().mon); foeSprite.className = 'sprite foe-sprite enter-right'; };
  // Who you're battling stays visible in the corner of the field (trainer battles only).
  const drawTrainerTag = () => {
    if (isWild) return;
    let tag = $('.trainer-tag');
    if (!tag) { tag = document.createElement('div'); tag.className = 'trainer-tag'; $('.arena').appendChild(tag); }
    tag.innerHTML = `<div class="sprite tag-face">${trainerSVG(cfg.trainer)}</div>
      <div class="tag-text"><b>${cfg.trainer}</b><span>${foes.map((f, i) => `<i class="tag-ball${i < fi ? ' out' : ''}"></i>`).join('')}</span></div>`;
  };

  allySprite.innerHTML = monSVG(pm);
  allySprite.className = 'sprite ally-sprite enter-left';
  drawAlly();

  if (isWild) {
    setFoeSprite(); drawFoe();
    await say(panel, `A wild <b>${foe().mon.name}</b> appeared! <span class="wild-rank">Rank ${foe().level} ${'★'.repeat(foe().level)}</span>`);
  } else {
    foeSprite.innerHTML = trainerSVG(cfg.trainer);
    foeSprite.className = 'sprite foe-sprite enter-right';
    $('.foe-hp').innerHTML = `<div class="hp-name"><span>${cfg.trainer}</span></div><div class="hp-num">${'⚪'.repeat(foes.length)} ${foes.length} Pokémon</div>`;
    await say(panel, `<b>${cfg.trainer}</b> wants to battle!${TRAINER_STYLE[cfg.trainer] === 'dog' ? ' Woof! 🐾' : ''}`, 1800);
    if (!alive(tok)) return;
    setFoeSprite(); drawFoe(); drawTrainerTag();
    await say(panel, `${cfg.trainer.split(' ').pop()} sends out <b>${foe().mon.name}</b>!`);
  }
  if (!alive(tok)) return;
  await say(panel, `Go, <b>${pm.name}</b>!`, 1100);

  while (alive(tok)) {
    // --- choose an action ---
    const action = await chooseAction();
    if (!alive(tok)) return;
    if (action === 'run') {
      await say(panel, 'You got away safely!', 1200);
      if (alive(tok)) (cfg.onRun || screenHome)();
      return;
    }
    if (action === 'catch') { await doCatch(); return; }
    if (action === 'switch') {
      const id = await pickPartyMember(false);
      if (!alive(tok)) return;
      if (id) await bringIn(id, true);
      continue;
    }

    // --- solve problems to power the move ---
    const move = action;
    const mistakes = cfg.ask
      ? await cfg.ask(panel, move, tok)
      : await solveProblems(panel, { count: ATTACK_PROBLEMS, title: `Power up <b class="t-text-${move.type}">${move.name}</b>!` });
    if (!alive(tok)) return;

    // --- our attack ---
    await say(panel, `${pm.name} used <b>${move.name}</b>!`, 900);
    if (!alive(tok)) return;
    retrigger(allySprite, 'lunge-right');
    await wait(260);
    Sound.hit();
    burst(foeSide, move.type);
    retrigger(foeSprite, 'hit');
    let dmg = Math.round(move.power * bonus) + rand(-2, 2);
    const before = foe().hp;
    foe().hp -= dmg;
    if (isWild) foe().hp = Math.max(foe().hp, Math.min(before, rand(4, 9))); // wild Pokémon never faint, so they can be caught
    floatText(foeSide, `-${before - foe().hp}`, 'dmg');
    drawFoe();
    await wait(700);
    if (!alive(tok)) return;

    if (!isWild && foe().hp <= 0) {
      foeSprite.classList.add('faint');
      await say(panel, `${foe().mon.name} is unable to battle!`, 1300);
      if (!alive(tok)) return;
      if (fi < foes.length - 1) {
        fi++;
        setFoeSprite(); drawFoe(); drawTrainerTag();
        await say(panel, `${cfg.trainer.split(' ').pop()} sends out <b>${foe().mon.name}</b>!`);
        if (!alive(tok)) return;
        continue;
      }
      return battleWon();
    }
    if (isWild && foe().hp < 20 && before >= 20) {
      await say(panel, `${foe().mon.name} is getting tired! Now you can throw a Poké Ball!`, 2000);
      if (!alive(tok)) return;
    }

    // --- they fight back ---
    const fm = FOE_MOVE[foe().mon.types[0]];
    let back;
    if (cfg.foePower) {
      // Tournament hits are real, but sized so perfect answers can never knock out the whole team:
      // spread the team's remaining HP over the most enemy hits that could still come (our weakest hit is 18+).
      const turnsLeft = Math.ceil(foe().hp / 18) + foes.slice(fi + 1).reduce((sum, f) => sum + Math.max(0, Math.ceil(f.hp / 18) - 1), 0);
      const safe = Math.floor((teamHpLeft() - 1) / Math.max(1, turnsLeft));
      back = Math.max(0, Math.min(cfg.foePower + rand(-2, 2), safe)) + 7 * Math.min(mistakes, 4);
    } else {
      // Stronger foes hit a little harder, but perfect answers always keep the player safe.
      back = (isWild ? 3 + foe().level : 4) + 7 * Math.min(mistakes, 4);
    }
    await say(panel, `${foe().mon.name} used <b>${fm}</b>!`, 900);
    if (!alive(tok)) return;
    retrigger(foeSprite, 'lunge-left');
    await wait(260);
    Sound.hit();
    burst(allySide, foe().mon.types[0]);
    retrigger(allySprite, 'hit');
    ally.hp = Math.max(0, ally.hp - back);
    floatText(allySide, back ? `-${back}` : 'Missed!', 'dmg');
    drawAlly();
    await wait(700);
    if (!alive(tok)) return;
    if (mistakes === 0 && !cfg.foePower) {
      await say(panel, `${pm.name} hardly felt it! Perfect ${cfg.ask ? 'reading' : 'math'}! ⭐`, 1300);
      if (!alive(tok)) return;
    }
    if (ally.hp <= 0) {
      allySprite.classList.add('faint');
      await say(panel, `${pm.name} is unable to battle!`, 1300);
      if (!alive(tok)) return;
      if (aliveOthers().length) {
        const id = await pickPartyMember(true);
        if (!alive(tok)) return;
        await bringIn(id, false);
        continue;
      }
      return battleLost();
    }
  }

  // Swap the Pokémon on the field (free: the other side doesn't get an extra attack).
  async function bringIn(id, recall) {
    if (recall) { await say(panel, `Come back, <b>${pm.name}</b>!`, 900); if (!alive(tok)) return; }
    setAlly(id);
    allySprite.innerHTML = monSVG(pm);
    allySprite.className = 'sprite ally-sprite enter-left';
    drawAlly();
    await say(panel, `Go, <b>${pm.name}</b>!`, 1000);
  }

  function pickPartyMember(forced) {
    return new Promise((resolve) => {
      const ids = aliveOthers().sort((a, b) => save.team[b].rank - save.team[a].rank || a - b);
      const el = document.createElement('div');
      el.className = 'modal-back';
      el.innerHTML = `<div class="modal fighter-modal"><h2>${forced ? 'Who goes next?' : 'Switch Pokémon'}</h2>
        <div class="fighter-grid">${ids.map((id) => { const st = stateOf(id); const pct = Math.round((st.hp / st.maxHp) * 100);
          return `<button class="fighter" data-id="${id}"><div class="sprite">${monSVG(DEX[id])}</div><b>${DEX[id].name}</b><span>${'★'.repeat(save.team[id].rank)}</span>
            <div class="mini-hp"><div style="width:${pct}%" class="${pct > 50 ? 'green' : pct > 25 ? 'yellow' : 'red'}"></div></div></button>`; }).join('')}</div>
        ${forced ? '' : '<div class="modal-buttons"><button class="btn grey" data-x="1">Keep ' + pm.name + '</button></div>'}</div>`;
      document.body.appendChild(el);
      el.addEventListener('click', (e) => {
        const f = e.target.closest('.fighter'), x = e.target.closest('[data-x]');
        if (!f && !x) return;
        Sound.tap(); el.remove(); resolve(f ? +f.dataset.id : null);
      });
    });
  }

  function chooseAction() {
    return new Promise((resolve) => {
      const canCatch = isWild && foe().hp < 20;
      panel.innerHTML = `
        <div class="choose-move">
          <div class="choose-title">What should ${pm.name} do?</div>
          <div class="move-grid">
            ${allyMoves.map((mv, i) => `<button class="move-btn t-${mv.type}" data-i="${i}"><span class="mv-name">${mv.name}</span><span class="mv-power">${'💥'.repeat(1 + Math.floor((mv.power - 20) / 6))}</span></button>`).join('')}
          </div>
          <div class="extra-row">
            ${isWild ? `<button class="btn catch-btn ${canCatch ? 'ready' : ''}" data-a="catch" ${canCatch ? '' : 'disabled'}>${ballSVG()} ${canCatch ? 'Throw Poké Ball!' : 'Catch when HP is under 20'}</button>` : ''}
            ${party && aliveOthers().length ? '<button class="btn blue switch-mon-btn" data-a="switch">🔄 Switch</button>' : ''}
            <button class="btn grey run-btn" data-a="run">🏃 Run</button>
          </div>
        </div>`;
      panel.querySelector('.choose-move').addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b || b.disabled) return;
        Sound.tap();
        if (b.dataset.a) resolve(b.dataset.a);
        else resolve(allyMoves[+b.dataset.i]);
      });
    });
  }

  async function doCatch() {
    const m = foe().mon;
    await say(panel, `You threw a Poké Ball!`, 700);
    if (!alive(tok)) return;
    const ball = document.createElement('div');
    ball.className = 'thrown-ball';
    ball.innerHTML = ballSVG();
    foeSide.appendChild(ball);
    await wait(650);
    foeSprite.classList.add('suck-in');
    await wait(500);
    for (let k = 0; k < 3; k++) {
      retrigger(ball, 'wobble');
      Sound.wobble();
      await wait(750);
      if (!alive(tok)) return;
    }
    ball.classList.add('caught');
    Sound.win();
    confetti();
    save.caught[m.id] = 1;
    const caughtRank = foe().level; // keeps the rank it had in the wild
    save.team[m.id] = { rank: caughtRank, rounds: 0 };
    persist();
    const left = LEVEL_POKEMON[mathLevel()].filter((id) => !save.caught[id]).length;
    panel.innerHTML = `
      <div class="center-msg">
        <div class="sprite modal-sprite bob">${monSVG(m)}</div>
        <h2>Gotcha! ${m.name} was caught!</h2>
        <p>${m.name} joined your team at Rank ${caughtRank} ${'★'.repeat(caughtRank)}. ${left ? `${left} more to find in Level ${mathLevel()}!` : `That was the last one in Level ${mathLevel()}! 🏆`}</p>
        <div class="btn-row"><button class="btn grey" data-go="home">Home</button><button class="btn blue" id="use-new">Use ${m.name}</button>${left ? '<button class="btn green" data-go="catch">Catch more</button>' : ''}</div>
      </div>`;
    $('#use-new').onclick = () => useMon(m.id);
  }

  function battleWon() {
    Sound.win();
    confetti();
    allySprite.classList.add('jump');
    if (cfg.onWin) return cfg.onWin(panel, pm);
    bumpCounter('battlesWon');
    panel.innerHTML = `
      <div class="center-msg">
        <div class="big-emoji">🏆</div>
        <h2>You beat ${cfg.trainer}!</h2>
        <p>${pm.name} and you make a great team!</p>
        <div class="btn-row"><button class="btn grey" data-go="home">Home</button><button class="btn green" data-go="battle">Battle again</button></div>
      </div>`;
  }

  function battleLost() {
    Sound.sad();
    allySprite.classList.add('faint');
    panel.innerHTML = `
      <div class="center-msg">
        <div class="big-emoji">😵</div>
        <h2>${pm.name} is too tired!</h2>
        <p>Careful ${cfg.ask ? 'reading' : 'math'} makes ${pm.name} stronger. Want to try again?</p>
        <div class="btn-row"><button class="btn grey" data-go="${cfg.back || 'home'}">${cfg.back === 'reading' ? 'Back' : 'Home'}</button><button class="btn green" id="retry">Try again</button></div>
      </div>`;
    $('#retry').onclick = () => { Sound.tap(); runBattle(cfg); };
  }
}

function screenCatch() {
  const mon = pickWild();
  if (mon) return runBattle({ mode: 'wild', foes: [makeFoe(mon, true)] });
  // every Pokémon in this Level is caught
  const lv = mathLevel(), nextLv = [1, 2, 3, 4].find((l) => l !== lv && caughtInLevel(l) < LEVEL_POKEMON[l].length);
  show(`
    <div class="screen">
      ${topbar('Catch')}
      <div class="card panel"><div class="center-msg">
        <div class="big-emoji">🏆</div>
        <h2>You caught all ${LEVEL_POKEMON[lv].length} Level ${lv} Pokémon!</h2>
        <p>${nextLv ? `Amazing! Try Level ${nextLv} to find new Pokémon.` : 'You caught every single Pokémon. You are a Pokémon Master!'}</p>
        <div class="btn-row"><button class="btn grey" data-go="home">Home</button>${nextLv ? '<button class="btn green" id="pick-level">Pick a Level</button>' : ''}</div>
      </div></div>
    </div>`);
  Sound.win();
  confetti();
  $('#pick-level')?.addEventListener('click', openLevels);
}

function screenBattle() {
  const n = activeRank() >= 3 ? 2 : 1;
  const foes = [];
  while (foes.length < n) {
    const mon = DEX[pick(LEVEL_POKEMON[mathLevel()])];
    if (foes.some((f) => f.mon.id === mon.id)) continue;
    foes.push(makeFoe(mon));
  }
  runBattle({ mode: 'trainer', foes, trainer: pick(TRAINER_NAMES) });
}

// ---------- collection ----------
function screenDex(picking = false, back = 'home') {
  show(`
    <div class="screen dex${picking ? ' picking' : ''}">
      ${topbar(picking ? 'Who do you want to use?' : `My Pokémon — ${caughtCount()} of ${DEX_COUNT}`, back)}
      <div class="dex-progress"><div style="width:${(caughtCount() / DEX_COUNT) * 100}%"></div></div>
      <div class="dex-tabs">
        <button class="dex-tab" data-lv="0">All</button>
        ${[1, 2, 3, 4].map((lv) => `<button class="dex-tab lv-${lv}" data-lv="${lv}">Level ${lv} <small>${caughtInLevel(lv)}/${LEVEL_POKEMON[lv].length}</small></button>`).join('')}
        <button class="dex-tab lv-5" data-lv="5">✨ Legendary Pokémon <small>${caughtInLevel(5)}/${LEVEL_POKEMON[5].length}</small></button>
      </div>
      <div class="dex-grid">
        ${Array.from({ length: DEX_COUNT }, (_, k) => {
          const m = DEX[k + 1], n = save.caught[m.id];
          return `<button class="dex-cell ${n ? 'have' : 'missing'}" data-id="${m.id}" data-lv="${LEVEL_OF[m.id]}" ${n ? '' : 'disabled'}>
            <span class="dex-lv lv-${LEVEL_OF[m.id]}">${LEVEL_OF[m.id] === LEGENDARY_GROUP ? '✨' : LEVEL_OF[m.id]}</span>
            <span class="dex-no">#${String(m.id).padStart(3, '0')}</span>
            ${m.id === save.partner.id ? '<span class="dex-star">⭐</span>' : ''}
            ${m.id === save.active ? '<span class="dex-using">Using</span>' : ''}
            <div class="sprite">${monSVG(m)}</div>
            <span class="dex-name">${n ? m.name : '???'}</span>
            ${n ? `<span class="dex-rank">${'★'.repeat(save.team[m.id].rank)}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
    </div>`);
  const filter = (lv) => {
    $$('.dex-tab').forEach((t) => t.classList.toggle('on', +t.dataset.lv === lv));
    $$('.dex-cell').forEach((cell) => { cell.hidden = (lv && +cell.dataset.lv !== lv) || (picking && cell.classList.contains('missing')); });
  };
  $('.dex-tabs').addEventListener('click', (e) => {
    const t = e.target.closest('.dex-tab');
    if (t) { Sound.tap(); filter(+t.dataset.lv); }
  });
  filter(picking ? 0 : mathLevel());
  $('.dex-grid').addEventListener('click', async (e) => {
    const c = e.target.closest('.dex-cell.have');
    if (!c) return;
    Sound.tap();
    const m = DEX[+c.dataset.id], me = save.team[m.id], using = m.id === save.active;
    const moves = movesFor(m.id);
    const go = await modal(`<div class="sprite modal-sprite bob">${monSVG(m)}</div><h2>${m.name}${m.id === save.partner.id ? ' ⭐' : ''}</h2>
      <div class="pill-row">${m.types.map((t) => `<span class="type-pill t-${t}">${TYPE_LABEL[t]}</span>`).join('')}</div>
      <p>Rank ${me.rank} <span class="stars">${'★'.repeat(me.rank)}<span class="off">${'★'.repeat(5 - me.rank)}</span></span> · ${LEVEL_OF[m.id] === LEGENDARY_GROUP ? 'Won in a PokeRead tournament ✨' : `Found in Level ${LEVEL_OF[m.id]}`}</p>
      <div class="moves modal-moves">${moves.map((mv, i) => `<span class="move-chip t-${mv.type}${i < me.rank ? '' : ' locked'}">${i < me.rank ? '' : '🔒 '}${mv.name}</span>`).join('')}</div>`,
      using ? [{ label: 'Close', value: 0, cls: 'grey' }, { label: '✅ Using now', value: 0, cls: 'green' }]
            : [{ label: 'Close', value: 0, cls: 'grey' }, { label: `Use ${m.name}`, value: 1, cls: 'green' }]);
    if (go) useMon(m.id);
  });
}

// ---------- start ----------
document.addEventListener('DOMContentLoaded', () => screenProfiles());

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
