// PokeMath — main game
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const app = document.getElementById('app');
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- save data ----------
const SAVE_KEY = 'pokemath-save-v1';
let save = loadSave();
function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.partner && DEX[s.partner.id]) return s;
  } catch (e) {}
  return null;
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
}
const caughtCount = () => Object.keys(save.caught).length;
const partnerMon = () => DEX[save.partner.id];
const knownMoves = () => PARTNER_MOVES[save.partner.id].slice(0, save.partner.level);

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

function speak(text) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.1;
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
  ({ home: screenHome, train: screenTrain, catch: screenCatch, battle: screenBattle, dex: screenDex })[go.dataset.go]();
});

const topbar = (title) => `<header class="topbar"><button class="home-btn" data-go="home" aria-label="Home">🏠</button><div class="topbar-title">${title}</div><div class="topbar-spacer"></div></header>`;

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
// Addition: both numbers 1–9. Subtraction: numbers under 20, never below zero.
let lastProblem = null;
function makeProblem() {
  let p;
  do {
    if (Math.random() < 0.5) {
      const a = rand(1, 9), b = rand(1, 9);
      p = { a, b, op: '+', ans: a + b };
    } else {
      const a = rand(2, 19), b = rand(1, a - 1);
      p = { a, b, op: '-', ans: a - b };
    }
  } while (lastProblem && p.a === lastProblem.a && p.b === lastProblem.b && p.op === lastProblem.op);
  lastProblem = p;
  return p;
}

// Shows `count` problems in `host`. Wrong answers just try again.
// Resolves with the number of wrong tries.
function solveProblems(host, { count = 5, title = '' } = {}) {
  return new Promise((resolve) => {
    let i = 0, mistakes = 0, input = '', p = makeProblem(), busy = false;
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
      eq.textContent = `${p.a} ${p.op === '+' ? '+' : '−'} ${p.b} =`;
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
        i++; render();
        setTimeout(() => {
          if (i >= count) { cleanup(); resolve(mistakes); return; }
          p = makeProblem(); input = '';
          ans.classList.remove('right');
          fb.innerHTML = '&nbsp;'; fb.className = 'feedback';
          busy = false; render();
        }, 750);
      } else {
        mistakes++;
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
      else if (input.length < 2) input += k;
      Sound.tap();
      render();
    };
    $('.keypad', host).addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) press(b.dataset.k);
    });
    $('.speak', host).addEventListener('click', () => speak(`${p.a} ${p.op === '+' ? 'plus' : 'minus'} ${p.b}`));
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
      <h1 class="logo">Poke<span>Math</span></h1>
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
    save = { partner: { id: m.id, level: 1, rounds: 0 }, caught: { [m.id]: 1 } };
    persist();
    Sound.win();
    confetti();
    screenHome();
  }));
}

// ---------- home ----------
function roundDots(n) {
  return `<span class="round-dots">${[0, 1, 2, 3].map((k) => `<span class="rdot${k < n ? ' on' : ''}"></span>`).join('')}</span>`;
}
function screenHome() {
  if (!save) return screenChoose();
  const m = partnerMon(), lvl = save.partner.level;
  const next = PARTNER_MOVES[m.id][lvl];
  show(`
    <div class="screen home">
      <header class="home-top">
        <h1 class="logo small">Poke<span>Math</span></h1>
        <button class="btn dex-btn" data-go="dex">📖 My Pokémon <b>${caughtCount()}</b></button>
      </header>
      <div class="partner-card">
        <div class="sprite partner-sprite bob">${monSVG(m)}</div>
        <div class="partner-info">
          <div class="pname">${m.name}</div>
          <div class="level">Level ${lvl} <span class="stars">${'★'.repeat(lvl)}<span class="off">${'★'.repeat(5 - lvl)}</span></span></div>
          <div class="moves-label">Moves</div>
          <div class="moves">${knownMoves().map((mv) => `<span class="move-chip t-${mv.type}">${mv.name}</span>`).join('')}</div>
          ${next
            ? `<div class="next">Next move: <b>${next.name}</b></div>`
            : `<div class="next">🏆 Max level — ${m.name} knows every move!</div>`}
        </div>
      </div>
      <div class="actions">
        <button class="action a-train" data-go="train"><span class="icon">💪</span><span>Train</span></button>
        <button class="action a-catch" data-go="catch"><span class="icon">${ballSVG()}</span><span>Catch</span></button>
        <button class="action a-battle" data-go="battle"><span class="icon">⚔️</span><span>Battle</span></button>
      </div>
    </div>`);
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
    const lvl = save.partner.level;
    if (lvl >= 5) {
      panel.innerHTML = `
        <div class="center-msg">
          <div class="big-emoji">🏆</div>
          <h2>${m.name} is at max level!</h2>
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
    const next = PARTNER_MOVES[m.id][lvl];
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
    const next = PARTNER_MOVES[m.id][save.partner.level];
    await solveProblems(panel, { count: TRAIN_PROBLEMS, title: `Learning <b class="t-text-${next.type}">${next.name}</b>` });
    if (!alive(tok)) return;
    {
      const learned = next;
      save.partner.level++;
      save.partner.rounds = 0;
      persist();
      Sound.levelUp();
      confetti();
      $('.stage-sprite').classList.add('jump');
      panel.innerHTML = `
        <div class="center-msg">
          <div class="big-emoji">🎉</div>
          <h2>${m.name} grew to Level ${save.partner.level}!</h2>
          <p>${m.name} learned <b class="t-text-${learned.type}">${learned.name}</b>!</p>
          <div class="btn-row"><button class="btn grey" data-go="home">Home</button>${save.partner.level < 5 ? '<button class="btn green" id="more">Keep training</button>' : ''}</div>
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
  for (let id = 1; id <= DEX_COUNT; id++) {
    let w = 1;
    if (LEGENDARY.has(id)) w = 0.12;
    else if (FINAL_FORMS.has(id)) w = 0.5;
    if (!save.caught[id]) w *= 2.5;
    ids.push(id); weights.push(w);
  }
  let total = weights.reduce((a, b) => a + b, 0), x = Math.random() * total;
  for (let i = 0; i < ids.length; i++) { x -= weights[i]; if (x <= 0) return DEX[ids[i]]; }
  return DEX[ids[0]];
}
function makeFoe(mon) {
  const L = save.partner.level;
  const maxHp = 50 + 10 * L + rand(0, 10);
  return { mon, level: Math.max(1, Math.min(5, L + rand(-1, 1))), maxHp, hp: maxHp };
}

function hpBox(name, level, hp, maxHp, catchLine) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const color = pct > 50 ? 'green' : pct > 25 ? 'yellow' : 'red';
  return `
    <div class="hp-name"><span>${name}</span><span class="hp-lv">Lv ${level}</span></div>
    <div class="hp-bar"><div class="hp-fill ${color}" style="width:${pct}%"></div>${catchLine ? `<div class="catch-line" style="left:${(20 / maxHp) * 100}%"></div>` : ''}</div>
    <div class="hp-num">${Math.max(0, hp)} / ${maxHp} HP</div>`;
}

function battleShell(title) {
  return `
    <div class="screen battle-screen">
      ${topbar(title)}
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
// cfg: { mode: 'wild' | 'trainer', foes: [...], trainer?: name }
async function runBattle(cfg) {
  const isWild = cfg.mode === 'wild';
  const tok = show(battleShell(isWild ? 'Catch' : 'Battle'));
  const panel = $('.panel'), foeSide = $('.foe-side'), allySide = $('.ally-side');
  const foeSprite = $('.foe-sprite'), allySprite = $('.ally-sprite');
  const pm = partnerMon();
  const ally = { maxHp: 70 + 10 * save.partner.level };
  ally.hp = ally.maxHp;
  const foes = cfg.foes.map((f) => ({ ...f, hp: f.maxHp }));
  let fi = 0;
  const foe = () => foes[fi];

  const drawFoe = () => {
    $('.foe-hp').innerHTML = hpBox(foe().mon.name, foe().level, foe().hp, foe().maxHp, isWild);
    $('.foe-hp').classList.toggle('catchable', isWild && foe().hp < 20);
  };
  const drawAlly = () => { $('.ally-hp').innerHTML = hpBox(pm.name, save.partner.level, ally.hp, ally.maxHp, false); };
  const setFoeSprite = () => { foeSprite.innerHTML = monSVG(foe().mon); foeSprite.className = 'sprite foe-sprite enter-right'; };

  allySprite.innerHTML = monSVG(pm);
  allySprite.className = 'sprite ally-sprite enter-left';
  drawAlly();

  if (isWild) {
    setFoeSprite(); drawFoe();
    await say(panel, `A wild <b>${foe().mon.name}</b> appeared!`);
  } else {
    foeSprite.innerHTML = trainerSVG(cfg.trainer);
    foeSprite.className = 'sprite foe-sprite enter-right';
    $('.foe-hp').innerHTML = `<div class="hp-name"><span>${cfg.trainer}</span></div><div class="hp-num">${'⚪'.repeat(foes.length)} ${foes.length} Pokémon</div>`;
    await say(panel, `<b>${cfg.trainer}</b> wants to battle!${TRAINER_STYLE[cfg.trainer] === 'dog' ? ' Woof! 🐾' : ''}`, 1800);
    if (!alive(tok)) return;
    setFoeSprite(); drawFoe();
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
      if (alive(tok)) screenHome();
      return;
    }
    if (action === 'catch') { await doCatch(); return; }

    // --- solve problems to power the move ---
    const move = action;
    const mistakes = await solveProblems(panel, { count: ATTACK_PROBLEMS, title: `Power up <b class="t-text-${move.type}">${move.name}</b>!` });
    if (!alive(tok)) return;

    // --- our attack ---
    await say(panel, `${pm.name} used <b>${move.name}</b>!`, 900);
    if (!alive(tok)) return;
    retrigger(allySprite, 'lunge-right');
    await wait(260);
    Sound.hit();
    burst(foeSide, move.type);
    retrigger(foeSprite, 'hit');
    let dmg = move.power + rand(-2, 2);
    const before = foe().hp;
    foe().hp -= dmg;
    if (isWild) foe().hp = Math.max(foe().hp, Math.min(before, rand(4, 9))); // wild Pokémon never faint, so they can be caught
    floatText(foeSide, `-${before - foe().hp}`, 'dmg');
    drawFoe();
    await wait(700);
    if (!alive(tok)) return;

    if (!isWild && foe().hp <= 0) {
      foeSprite.classList.add('faint');
      await say(panel, `${foe().mon.name} fainted!`, 1300);
      if (!alive(tok)) return;
      if (fi < foes.length - 1) {
        fi++;
        setFoeSprite(); drawFoe();
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

    // --- they fight back (only hard if there were mistakes) ---
    const fm = FOE_MOVE[foe().mon.types[0]];
    const back = 4 + 7 * Math.min(mistakes, 4);
    await say(panel, `${foe().mon.name} used <b>${fm}</b>!`, 900);
    if (!alive(tok)) return;
    retrigger(foeSprite, 'lunge-left');
    await wait(260);
    Sound.hit();
    burst(allySide, foe().mon.types[0]);
    retrigger(allySprite, 'hit');
    ally.hp = Math.max(0, ally.hp - back);
    floatText(allySide, `-${back}`, 'dmg');
    drawAlly();
    await wait(700);
    if (!alive(tok)) return;
    if (mistakes === 0) {
      await say(panel, `${pm.name} hardly felt it! Perfect math! ⭐`, 1300);
      if (!alive(tok)) return;
    }
    if (ally.hp <= 0) return battleLost();
  }

  function chooseAction() {
    return new Promise((resolve) => {
      const canCatch = isWild && foe().hp < 20;
      panel.innerHTML = `
        <div class="choose-move">
          <div class="choose-title">What should ${pm.name} do?</div>
          <div class="move-grid">
            ${knownMoves().map((mv, i) => `<button class="move-btn t-${mv.type}" data-i="${i}"><span class="mv-name">${mv.name}</span><span class="mv-power">${'💥'.repeat(1 + Math.floor((mv.power - 20) / 6))}</span></button>`).join('')}
          </div>
          <div class="extra-row">
            ${isWild ? `<button class="btn catch-btn ${canCatch ? 'ready' : ''}" data-a="catch" ${canCatch ? '' : 'disabled'}>${ballSVG()} ${canCatch ? 'Throw Poké Ball!' : 'Catch when HP is under 20'}</button>` : ''}
            <button class="btn grey run-btn" data-a="run">🏃 Run</button>
          </div>
        </div>`;
      panel.querySelector('.choose-move').addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b || b.disabled) return;
        Sound.tap();
        if (b.dataset.a) resolve(b.dataset.a);
        else resolve(knownMoves()[+b.dataset.i]);
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
    const already = !!save.caught[m.id];
    save.caught[m.id] = (save.caught[m.id] || 0) + 1;
    persist();
    panel.innerHTML = `
      <div class="center-msg">
        <div class="sprite modal-sprite bob">${monSVG(m)}</div>
        <h2>Gotcha! ${m.name} was caught!</h2>
        <p>${already ? `You now have ${save.caught[m.id]} ${m.name}!` : `${m.name} was added to your collection. 📖`}</p>
        <div class="btn-row"><button class="btn grey" data-go="home">Home</button><button class="btn blue" data-go="dex">My Pokémon</button><button class="btn green" data-go="catch">Catch more</button></div>
      </div>`;
  }

  function battleWon() {
    Sound.win();
    confetti();
    allySprite.classList.add('jump');
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
        <p>Careful math makes ${pm.name} stronger. Want to try again?</p>
        <div class="btn-row"><button class="btn grey" data-go="home">Home</button><button class="btn green" id="retry">Try again</button></div>
      </div>`;
    $('#retry').onclick = () => { Sound.tap(); runBattle(cfg); };
  }
}

function screenCatch() {
  runBattle({ mode: 'wild', foes: [makeFoe(pickWild())] });
}

function screenBattle() {
  const n = save.partner.level >= 3 ? 2 : 1;
  const foes = [];
  while (foes.length < n) {
    const mon = DEX[rand(1, DEX_COUNT)];
    if (LEGENDARY.has(mon.id) || foes.some((f) => f.mon.id === mon.id)) continue;
    foes.push(makeFoe(mon));
  }
  runBattle({ mode: 'trainer', foes, trainer: pick(TRAINER_NAMES) });
}

// ---------- collection ----------
function screenDex() {
  show(`
    <div class="screen dex">
      ${topbar(`My Pokémon — ${caughtCount()} of ${DEX_COUNT}`)}
      <div class="dex-progress"><div style="width:${(caughtCount() / DEX_COUNT) * 100}%"></div></div>
      <div class="dex-grid">
        ${Array.from({ length: DEX_COUNT }, (_, k) => {
          const m = DEX[k + 1], n = save.caught[m.id];
          return `<button class="dex-cell ${n ? 'have' : 'missing'}" data-id="${m.id}" ${n ? '' : 'disabled'}>
            <span class="dex-no">#${String(m.id).padStart(3, '0')}</span>
            ${m.id === save.partner.id ? '<span class="dex-star">⭐</span>' : n > 1 ? `<span class="dex-count">×${n}</span>` : ''}
            <div class="sprite">${monSVG(m)}</div>
            <span class="dex-name">${n ? m.name : '???'}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="dex-footer"><button class="btn grey small" id="reset">Start over</button></div>
    </div>`);
  $('.dex-grid').addEventListener('click', (e) => {
    const c = e.target.closest('.dex-cell.have');
    if (!c) return;
    Sound.tap();
    const m = DEX[+c.dataset.id];
    modal(`<div class="sprite modal-sprite bob">${monSVG(m)}</div><h2>${m.name}</h2>
      <div class="pill-row">${m.types.map((t) => `<span class="type-pill t-${t}">${TYPE_LABEL[t]}</span>`).join('')}</div>
      <p>${m.id === save.partner.id ? 'Your partner! ⭐' : `You have caught ${save.caught[m.id]}.`}</p>`, [{ label: 'Close', value: 1, cls: 'green' }]);
  });
  $('#reset').addEventListener('click', async () => {
    Sound.tap();
    const ok = await modal('<h2>Start over?</h2><p>This erases your partner, levels and every Pokémon you caught.</p>',
      [{ label: 'Keep playing', value: false, cls: 'green' }, { label: 'Erase everything', value: true, cls: 'red' }]);
    if (!ok) return;
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    save = null;
    screenChoose();
  });
}

// ---------- start ----------
screenHome();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
