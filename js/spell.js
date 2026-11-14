// spell.js — PokeSpell: the egg lab. 12 eggs, one per PokeRead region (egg 1 = Kanto words, …).
// Each egg: 4 warm-ups of 6 words (each adds cracks), then a final with all 24 words to hatch it.
// Spelling: hear the word, build it from letter tiles (with a few decoy letters). Same first-try rule.

const EGG_IDS = LEVEL_POKEMON[SPELL_GROUP];       // egg i hatches EGG_IDS[i]
const SPELL_DECOYS = 3;
// Only the CVC words (cat, bed, pin…) are used for spelling: 4 warm-ups of 3, then all 12 to hatch.
const SPELL_STOP = 3;
const spellWords = (i) => JOURNEYS[i].cvc;
const EGG_STYLE = {                                // egg colors/pattern hint at the type (no spoilers)
  normal: ['#fef3c7', '#d6b98c', 'spots'], fire: ['#fed7aa', '#f97316', 'flames'], water: ['#bae6fd', '#0ea5e9', 'waves'],
  dragon: ['#ddd6fe', '#7c3aed', 'zigzag'], bug: ['#d9f99d', '#65a30d', 'spots'], psychic: ['#fbcfe8', '#db2777', 'stars'],
  electric: ['#fef08a', '#eab308', 'zigzag'], ice: ['#e0f2fe', '#38bdf8', 'stars'], grass: ['#bbf7d0', '#16a34a', 'spots'],
};

function ensureSpell() {
  if (!save.spell) save.spell = { egg: 0, stage: 0, hatched: Array(EGG_IDS.length).fill(false) };
  return save.spell;
}
const eggsHatched = (s = save) => (s && s.spell ? s.spell.hatched.filter(Boolean).length : 0);

// An original egg drawing: type-colored pattern, cracks for each warm-up done.
function eggSVG(i, cracks = 0, locked = false) {
  const mon = DEX[EGG_IDS[i]];
  const [base, mark, pattern] = locked ? ['#e5e7eb', '#cbd5e1', 'spots'] : (EGG_STYLE[mon.types[0]] || EGG_STYLE.normal);
  let marks = '';
  if (pattern === 'spots') marks = [[38, 44, 7], [64, 58, 9], [44, 78, 6], [66, 34, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${mark}" opacity=".8"/>`).join('');
  if (pattern === 'waves') marks = [44, 62, 80].map((y) => `<path d="M24 ${y} q8 -6 16 0 t16 0 t16 0 t16 0" fill="none" stroke="${mark}" stroke-width="4" stroke-linecap="round"/>`).join('');
  if (pattern === 'zigzag') marks = [48, 72].map((y) => `<path d="M22 ${y} l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8" fill="none" stroke="${mark}" stroke-width="4" stroke-linejoin="round"/>`).join('');
  if (pattern === 'flames') marks = [[36, 70], [56, 58], [70, 76]].map(([x, y]) => `<path d="M${x} ${y} q-8 -10 0 -20 q2 8 6 10 q2 -6 0 -12 q10 10 2 22 z" fill="${mark}" opacity=".85"/>`).join('');
  if (pattern === 'stars') marks = [[38, 46], [62, 40], [52, 70], [70, 66], [34, 74]].map(([x, y]) => star4(x, y, 6, mark)).join('');
  const crackPaths = ['M50 14 L46 26 L54 34 L48 44', 'M24 50 L34 54 L30 64 L40 68', 'M78 46 L68 52 L74 62 L64 70', 'M46 92 L50 82 L44 74 L52 66'];
  const crk = crackPaths.slice(0, cracks).map((d) => `<path d="${d}" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="egg">
    <ellipse cx="50" cy="104" rx="30" ry="5" fill="rgba(0,0,0,.14)"/>
    <defs><clipPath id="eggclip${i}"><path d="M50 6 C78 6 90 46 90 66 C90 88 72 100 50 100 C28 100 10 88 10 66 C10 46 22 6 50 6 Z"/></clipPath></defs>
    <path d="M50 6 C78 6 90 46 90 66 C90 88 72 100 50 100 C28 100 10 88 10 66 C10 46 22 6 50 6 Z" fill="${base}"/>
    <g clip-path="url(#eggclip${i})">${marks}</g>
    <path d="M50 6 C78 6 90 46 90 66 C90 88 72 100 50 100 C28 100 10 88 10 66 C10 46 22 6 50 6 Z" fill="none" stroke="${OL}" stroke-width="3"/>
    <ellipse cx="34" cy="30" rx="8" ry="12" fill="#fff" opacity=".45" transform="rotate(20 34 30)"/>
    ${crk}
    ${locked ? `<text x="50" y="66" text-anchor="middle" font-size="26">🔒</text>` : ''}
  </svg>`;
}

// ---------- nests (original drawings) ----------
const NEST_BACK = (grey) => `<ellipse cx="50" cy="80" rx="44" ry="15" fill="${grey ? '#9ca3af' : '#a16207'}"/>
  <path d="M10 80 Q12 66 26 64 M90 80 Q88 66 74 64" fill="none" stroke="${grey ? '#6b7280' : '#78350f'}" stroke-width="3" stroke-linecap="round"/>`;
const NEST_FRONT = (grey) => {
  const c = grey ? '#d1d5db' : '#eab308', d = grey ? '#9ca3af' : '#a16207';
  let straws = '';
  for (let k = 0; k < 9; k++) { const x = 12 + k * 9.5; straws += `<path d="M${x} ${84 + (k % 2) * 3} q5 -7 11 -2" fill="none" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`; }
  return `<path d="M6 80 Q50 104 94 80 Q92 94 50 98 Q8 94 6 80 Z" fill="${c}" stroke="${d}" stroke-width="2.5"/>${straws}`;
};
const OPEN_SHELL = `<path d="M24 82 L24 62 L32 70 L40 58 L48 70 L56 58 L64 70 L72 60 L76 82 Z" fill="#fff7ed" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M70 42 L80 30 L84 40 L94 36 L88 48 Z" fill="#fff7ed" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round" transform="rotate(20 82 40)"/>`;
// One nest in the incubator. state: 'locked' | 'current' | 'waiting' | 'hatched'
function nestCell(k, state, cracks) {
  const id = EGG_IDS[k], J = JOURNEYS[k], grey = state === 'locked';
  const egg = state === 'hatched' ? '' : eggSVG(k, cracks, grey).replace('<svg ', '<svg x="22" y="6" width="56" height="62" ');
  const label = state === 'hatched' ? `<b>${DEX[id].name}</b>` : state === 'current' ? '<b>Warming up!</b>' : `<b>Egg ${k + 1}</b>`;
  return `<div class="nest ${state}">
    ${state === 'current' ? '<div class="nest-lamp">💡</div>' : ''}
    ${state === 'hatched' ? '<div class="nest-star">⭐</div>' : ''}
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${state === 'current' ? '<circle cx="50" cy="48" r="44" fill="#fde68a" opacity=".55"/>' : ''}
      ${NEST_BACK(grey)}${egg}${state === 'hatched' ? OPEN_SHELL : ''}${NEST_FRONT(grey)}
    </svg>
    <div class="nest-label">${label}<small>${J.name} words</small></div>
  </div>`;
}

// ---------- spelling with letter tiles ----------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
// Every word must be spelled right on the FIRST try; a missed word comes back (one word later).
function spellQuiz(panel, words, title, tok, onProgress) {
  return new Promise((resolve) => {
    const queue = shuffle(words), again = new Set();
    let done = 0, mistakes = 0;
    const next = () => {
      if (!alive(tok)) return;
      if (!queue.length) { resolve(mistakes); return; }
      const w = queue.shift(), letters = w.split('');
      const decoys = shuffle(ALPHABET.split('').filter((c) => !w.toLowerCase().includes(c))).slice(0, SPELL_DECOYS).map((c) => (w === 'I' ? c.toUpperCase() : c));
      const tiles = shuffle([...letters, ...decoys]).map((c, k) => ({ c, k, used: false }));
      let typed = [], missed = false, busy = false;
      const draw = () => {
        panel.innerHTML = `
          <div class="rq spell-q">
            <div class="quiz-head"><div class="quiz-title">${again.has(w) ? '🔁 This one again!' : title}</div><div class="rq-count">${done} / ${words.length} ✓</div></div>
            <div class="rq-prompt">Listen, then spell the word!</div>
            <div class="spell-top">
              ${hasPic(w) ? `<div class="spell-pic">${picSVG(w)}</div>` : ''}
              <div class="btn-row"><button class="btn blue big" id="sp-hear">🔊 Hear it</button><button class="btn blue big slow-btn" id="sp-slow">🐢 Slow</button></div>
            </div>
            <div class="spell-slots">${letters.map((_, i) => `<span class="slot${typed[i] ? ' filled' : ''}">${typed[i] ? typed[i].c : ''}</span>`).join('')}</div>
            <div class="spell-tiles">${tiles.map((t) => `<button class="tile" data-k="${t.k}" ${t.used ? 'disabled' : ''}>${t.c}</button>`).join('')}
              <button class="tile back" data-k="back" aria-label="Erase">⌫</button></div>
            <div class="feedback">&nbsp;</div>
          </div>`;
        $('#sp-hear', panel).onclick = () => { Sound.tap(); sayWord(w); };
        $('#sp-slow', panel).onclick = () => { Sound.tap(); sayWord(w, true); };
        $('.spell-tiles', panel).addEventListener('click', onTile);
      };
      const onTile = (e) => {
        const b = e.target.closest('.tile');
        if (!b || b.disabled || busy) return;
        Sound.tap();
        if (b.dataset.k === 'back') { const t = typed.pop(); if (t) t.used = false; draw(); return; }
        const t = tiles.find((x) => x.k === +b.dataset.k);
        t.used = true; typed.push(t); draw();
        if (typed.length === letters.length) check();
      };
      const check = () => {
        const box = $('.rq', panel), fb = $('.feedback', panel);
        if (typed.map((t) => t.c).join('') === w) {
          busy = true;
          Sound.correct(); sayWord(w);
          box.classList.add('spelled');
          fb.textContent = pick(PRAISE); fb.className = 'feedback good';
          recordItem('words', w, !missed);
          if (missed) { again.add(w); queue.splice(Math.min(1, queue.length), 0, w); }
          else { done++; onProgress && onProgress(done); }
          setTimeout(next, 1000);
        } else {
          missed = true; mistakes++;
          Sound.wrong();
          fb.textContent = 'Not quite — try again!'; fb.className = 'feedback bad';
          box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
          setTimeout(() => { typed.forEach((t) => (t.used = false)); typed = []; draw(); $('.feedback', panel).textContent = 'Not quite — try again!'; $('.feedback', panel).className = 'feedback bad'; }, 700);
        }
      };
      draw();
      sayWord(w);
    };
    next();
  });
}

// ---------- the lab ----------
function screenLab() {
  const sp = ensureSpell();
  const i = Math.min(sp.egg, EGG_IDS.length - 1), allDone = sp.hatched.every(Boolean);
  const J = JOURNEYS[i];
  const stageText = allDone ? 'You hatched every egg! 🎉' : sp.stage < 4
    ? `Warm-up ${sp.stage + 1} of 4 — spell ${SPELL_STOP} ${J.name} words`
    : `Ready to hatch! Spell all ${spellWords(i).length} ${J.name} words`;
  show(`
    <div class="screen lab">
      <header class="topbar">
        <div class="home-left"><button class="home-btn" data-go="menu" aria-label="Menu">🏠</button><h1 class="logo small">Poke<span>Spell</span></h1></div>
        <div style="flex:1"></div>
        <button class="btn dex-btn sticker-btn" id="lab-stickers">⭐ <b>${stickerCount()}/${STICKERS.length}</b></button>
        <button class="btn dex-btn" id="lab-dex">📖 My Pokémon <b>${caughtCount()}</b></button>
      </header>
      <div class="split">
        <div class="card lab-stage">
          <p class="kicker">${allDone ? 'The lab is full of friends!' : `Egg ${i + 1} of ${EGG_IDS.length} · ${J.name} words`}</p>
          <div class="big-nest">
            <div class="big-glow"></div>
            <svg class="big-nest-back" viewBox="0 0 100 100">${NEST_BACK(false)}</svg>
            <div class="big-egg ${sp.stage >= 4 && !allDone ? 'wobble-egg' : ''}">${allDone ? '<div class="big-emoji">🏆</div>' : eggSVG(i, sp.stage)}</div>
            <svg class="big-nest-front" viewBox="0 0 100 100">${NEST_FRONT(false)}</svg>
          </div>
          ${allDone ? '' : `<div class="warm-meter">${[0, 1, 2, 3].map((k) => `<span class="${k < sp.stage ? 'on' : ''}">🔥</span>`).join('')}<span class="${sp.stage >= 4 ? 'ready' : ''}">🐣</span></div>`}
        </div>
        <div class="card panel lab-panel">
          <h2>${allDone ? 'All eggs hatched!' : sp.stage < 4 ? 'Warm up the egg!' : 'It\'s wobbling!'}</h2>
          <p>${stageText}</p>
          ${allDone ? '' : `<button class="btn green big" id="warm">${sp.stage < 4 ? '🔥 Warm it up' : '🐣 Hatch it!'}</button>`}
          ${isTester() && !allDone && sp.stage < 4 ? '<button class="btn blue" id="hatch-now">🐣 Hatch now (tester)</button>' : ''}
          ${isTester() ? '<p class="tester-note">🔓 Tester: tap any egg to work on it.</p>' : ''}
          <div class="incubator">
            <div class="incubator-title">🥚 Egg incubator <small>${eggsHatched()} of ${EGG_IDS.length} hatched</small></div>
            <div class="nest-grid">${EGG_IDS.map((id, k) => nestCell(k, sp.hatched[k] ? 'hatched' : k === i && !allDone ? 'current' : k > i && !isTester() ? 'locked' : 'waiting', k === i ? sp.stage : 0)).join('')}</div>
          </div>
        </div>
      </div>
    </div>`);
  $('#lab-dex').addEventListener('click', () => { Sound.tap(); screenDex(false, 'lab'); });
  $('#lab-stickers').addEventListener('click', () => { Sound.tap(); screenStickers('lab'); });
  $('#warm')?.addEventListener('click', () => { Sound.tap(); sp.stage < 4 ? screenWarmUp(i, sp.stage) : screenHatch(i); });
  $('#hatch-now')?.addEventListener('click', () => { Sound.tap(); screenHatch(i); });
  if (isTester()) $$('.nest').forEach((n, k) => n.addEventListener('click', () => {
    if (sp.hatched[k] || k === sp.egg) return;
    Sound.tap(); sp.egg = k; sp.stage = 0; persist(); screenLab();
  }));
  showStickerPopups();
}

function labShell(title, i, cracks) {
  return show(`
    <div class="screen read-stop">
      <header class="topbar"><button class="home-btn" data-go="lab" aria-label="Lab">🥚</button><div class="topbar-title">${title}</div><div class="topbar-spacer"></div></header>
      <div class="split">
        <div class="stage"><div class="big-egg">${eggSVG(i, cracks)}</div></div>
        <div class="panel card"></div>
      </div>
    </div>`);
}

async function screenWarmUp(i, stage) {
  const J = JOURNEYS[i], words = spellWords(i).slice(stage * SPELL_STOP, stage * SPELL_STOP + SPELL_STOP);
  const tok = labShell(`🔥 Warm-up ${stage + 1} of 4`, i, stage);
  const panel = $('.panel');
  await spellQuiz(panel, words, `Warm-up ${stage + 1}`, tok);
  if (!alive(tok)) return;
  const sp = ensureSpell();
  if (sp.egg === i && sp.stage === stage) sp.stage++;
  persist();
  Sound.levelUp();
  $('.big-egg').innerHTML = eggSVG(i, sp.stage);
  retrigger($('.big-egg'), 'egg-crack');
  panel.innerHTML = `<div class="center-msg"><div class="big-emoji">🔥</div><h2>The egg is getting warmer!</h2>
    <p>${sp.stage < 4 ? `A new crack! ${4 - sp.stage} more warm-up${4 - sp.stage === 1 ? '' : 's'} to go.` : 'It\'s wobbling! Spell all the words to hatch it!'}</p>
    <div class="word-chips">${words.map((w) => `<span class="word-chip">${w}</span>`).join('')}</div>
    <div class="btn-row"><button class="btn green big" data-go="lab">Back to the lab 🥚</button></div></div>`;
}

async function screenHatch(i) {
  const J = JOURNEYS[i], id = EGG_IDS[i];
  const tok = labShell(`🐣 Hatch egg ${i + 1}`, i, 4);
  const panel = $('.panel');
  await spellQuiz(panel, spellWords(i), 'Hatching!', tok, () => retrigger($('.big-egg'), 'egg-crack'));
  if (!alive(tok)) return;
  const sp = ensureSpell();
  sp.hatched[i] = true;
  if (sp.egg === i) { sp.egg = Math.min(i + 1, EGG_IDS.length - 1); sp.stage = 0; }
  save.caught[id] = 1;
  save.team[id] = { rank: 1, rounds: 0 };
  persist();
  // hatch animation: shake, flash, reveal
  const stage = $('.big-egg');
  stage.classList.add('hatching');
  Sound.wobble(); await wait(500); Sound.wobble(); await wait(500);
  if (!alive(tok)) return;
  stage.classList.remove('hatching');
  stage.innerHTML = `<div class="sprite hatched-mon">${monSVG(DEX[id])}</div>`;
  Sound.win(); confetti(); setTimeout(confetti, 700);
  panel.innerHTML = `<div class="center-msg"><h2>🐣 It hatched!</h2>
    <div class="sprite modal-sprite bob">${monSVG(DEX[id])}</div>
    <p>Say hello to <b>${DEX[id].name}</b>! It joins your team at Rank 1. Train it in PokeMath!</p>
    <div class="btn-row"><button class="btn grey" data-go="lab">Lab 🥚</button><button class="btn green big" id="use-hatched">Use ${DEX[id].name}</button></div></div>`;
  $('#use-hatched').onclick = () => { Sound.tap(); useMon(id); };
}
