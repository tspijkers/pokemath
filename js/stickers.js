// stickers.js — the sticker book: 25 achievements across collecting, math, reading and playing.
// Each sticker has a test that looks at the player's save, so progress made before the
// sticker book existed counts too (except for counters that only start now: battles won,
// training sessions and perfect gyms).

const firstTryRight = (s, kind) => Object.values((s.stats && s.stats[kind]) || {}).reduce((n, v) => n + Math.max(0, v.seen - v.wrong), 0);
const playDays = (s) => Object.keys((s.stats && s.stats.days) || {}).filter((d) => s.stats.days[d] > 0).sort();
function dayStreak(s) {
  const days = new Set(playDays(s));
  let best = 0, run = 0, prev = null;
  for (const d of [...days].sort()) {
    const t = new Date(d + 'T12:00:00');
    run = prev && (t - prev) / 86400000 === 1 ? run + 1 : 1;
    best = Math.max(best, run); prev = t;
  }
  return best;
}
const counter = (s, k) => (s.counters && s.counters[k]) || 0;
const badgesWon = (s) => (s.reading ? s.reading.badges.filter(Boolean).length : 0);
const mastered = (s) => ['words', 'facts'].reduce((n, k) => n + Object.values((s.stats && s.stats[k]) || {}).filter((v) => v.wrong > 0 && v.streak >= MASTERED_STREAK).length, 0);

const STICKERS = [
  // collecting
  { id: 'partner', icon: '🤝', color: '#f59e0b', name: 'First Friend', goal: 'Choose your partner Pokémon', test: (s) => true },
  { id: 'catch1', icon: '🎯', color: '#ef4444', name: 'Gotcha!', goal: 'Catch your first Pokémon', test: (s) => Object.keys(s.caught).length >= 2 },
  { id: 'catch10', icon: '📦', color: '#ef4444', name: 'Collector', goal: 'Have 10 Pokémon', test: (s) => Object.keys(s.caught).length >= 10 },
  { id: 'catch25', icon: '🧺', color: '#ef4444', name: 'Super Collector', goal: 'Have 25 Pokémon', test: (s) => Object.keys(s.caught).length >= 25 },
  { id: 'catch50', icon: '🎒', color: '#ef4444', name: 'Pokémon Pro', goal: 'Have 50 Pokémon', test: (s) => Object.keys(s.caught).length >= 50 },
  { id: 'rank5', icon: '💪', color: '#f97316', name: 'Full Power', goal: 'Get a Pokémon to Rank 5', test: (s) => Object.values(s.team || {}).some((t) => t.rank >= 5) },
  { id: 'legend', icon: '✨', color: '#eab308', name: 'Legend Hunter', goal: 'Win a Legendary Pokémon', test: (s) => LEVEL_POKEMON[LEGENDARY_GROUP].some((id) => s.caught[id]) },
  // math
  { id: 'math10', icon: '➕', color: '#3b82f6', name: 'Math Starter', goal: 'Get 10 math problems right the first time', test: (s) => firstTryRight(s, 'facts') >= 10 },
  { id: 'math100', icon: '🧮', color: '#3b82f6', name: 'Math Whiz', goal: 'Get 100 math problems right the first time', test: (s) => firstTryRight(s, 'facts') >= 100 },
  { id: 'math500', icon: '🧠', color: '#3b82f6', name: 'Math Master', goal: 'Get 500 math problems right the first time', test: (s) => firstTryRight(s, 'facts') >= 500 },
  { id: 'times', icon: '✖️', color: '#3b82f6', name: 'Times Tables', goal: 'Play PokeMath Level 3 (×)', test: (s) => (s.mathLevel || 1) >= 3 },
  { id: 'train10', icon: '🏋️', color: '#3b82f6', name: 'Hard Worker', goal: 'Finish 10 training sessions', test: (s) => counter(s, 'trainings') >= 10 },
  { id: 'battle1', icon: '🥊', color: '#6366f1', name: 'Trainer Beater', goal: 'Win a PokeMath trainer battle', test: (s) => counter(s, 'battlesWon') >= 1 },
  { id: 'battle10', icon: '🏅', color: '#6366f1', name: 'Battle Champ', goal: 'Win 10 PokeMath trainer battles', test: (s) => counter(s, 'battlesWon') >= 10 },
  // reading
  { id: 'stop1', icon: '📖', color: '#16a34a', name: 'First Words', goal: 'Finish your first reading stop', test: (s) => !!s.reading && (s.reading.stops.some((n) => n > 0) || badgesWon(s) > 0) },
  { id: 'read100', icon: '🔤', color: '#16a34a', name: 'Word Explorer', goal: 'Read 100 words right the first time', test: (s) => firstTryRight(s, 'words') >= 100 },
  { id: 'read500', icon: '🐛', color: '#16a34a', name: 'Bookworm', goal: 'Read 500 words right the first time', test: (s) => firstTryRight(s, 'words') >= 500 },
  { id: 'badge1', icon: '🎖️', color: '#0d9488', name: 'First Badge', goal: 'Win a gym badge', test: (s) => badgesWon(s) >= 1 },
  { id: 'badge6', icon: '🏵️', color: '#0d9488', name: 'Badge Collector', goal: 'Win 6 gym badges', test: (s) => badgesWon(s) >= 6 },
  { id: 'badge12', icon: '👑', color: '#0d9488', name: 'All Badges', goal: 'Win all 12 gym badges', test: (s) => badgesWon(s) >= 12 },
  { id: 'perfectGym', icon: '💯', color: '#0d9488', name: 'Perfect Gym', goal: 'Win a gym without a single mistake', test: (s) => counter(s, 'perfectGyms') >= 1 },
  { id: 'tourney', icon: '🏆', color: '#ca8a04', name: 'Tournament Champion', goal: 'Win a tournament', test: (s) => !!(s.reading && s.reading.tournaments && s.reading.tournaments.some((t) => t.won)) },
  // playing
  { id: 'days3', icon: '📅', color: '#a855f7', name: 'Practice Pal', goal: 'Play on 3 different days', test: (s) => playDays(s).length >= 3 },
  { id: 'streak5', icon: '🔥', color: '#a855f7', name: 'On a Roll', goal: 'Play 5 days in a row', test: (s) => dayStreak(s) >= 5 },
  { id: 'tricky10', icon: '🦁', color: '#a855f7', name: 'Tricky Tamer', goal: 'Master 10 tricky words or math facts', test: (s) => mastered(s) >= 10 },
];

function stickerSVG(st, got = true) {
  const col = got ? st.color : '#cbd5e1';
  let edge = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; edge += `<circle cx="${(50 + Math.cos(a) * 40).toFixed(1)}" cy="${(50 + Math.sin(a) * 40).toFixed(1)}" r="9" fill="#fff"/>`; }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g filter="drop-shadow(0 2px 2px rgba(0,0,0,.18))">${edge}<circle cx="50" cy="50" r="42" fill="#fff"/></g>
    <circle cx="50" cy="50" r="36" fill="${col}"/>
    <circle cx="50" cy="50" r="30" fill="#fff" opacity=".25"/>
    <text x="50" y="62" text-anchor="middle" font-size="34" ${got ? '' : 'opacity=".5"'}>${got ? st.icon : '❔'}</text>
    <ellipse cx="36" cy="28" rx="10" ry="5" fill="#fff" opacity=".5" transform="rotate(-30 36 28)"/>
  </svg>`;
}

// ---- earning ----
const earnedStickers = (s = save) => (s && s.stickers) || {};
const stickerCount = (s = save) => Object.keys(earnedStickers(s)).length;
let stickerQueue = [];
// Checks every sticker; newly earned ones are stored and queued for a pop-up on a calm screen.
function checkStickers() {
  if (!save) return;
  save.stickers ||= {};
  let added = false;
  for (const st of STICKERS) {
    if (save.stickers[st.id]) continue;
    let ok = false;
    try { ok = st.test(save); } catch (e) {}
    if (ok) { save.stickers[st.id] = todayKey(); stickerQueue.push(st); added = true; }
  }
  if (added) persist();
}
function bumpCounter(k, by = 1) {
  if (!save) return;
  save.counters ||= {};
  save.counters[k] = (save.counters[k] || 0) + by;
  persist();
}
// Show waiting sticker pop-ups (called from the start page, PokeMath home and the reading map).
async function showStickerPopups() {
  checkStickers();
  if (!stickerQueue.length || document.querySelector('.modal-back')) return;
  const list = stickerQueue; stickerQueue = [];
  Sound.levelUp(); confetti();
  await modal(
    `<h2>${list.length === 1 ? 'New sticker!' : `${list.length} new stickers!`}</h2>
     <div class="new-stickers">${list.slice(0, 8).map((st) => `<div class="new-sticker"><div class="sticker-art pop">${stickerSVG(st)}</div><b>${st.name}</b><small>${st.goal}</small></div>`).join('')}</div>
     ${list.length > 8 ? `<p>…and ${list.length - 8} more in your sticker book!</p>` : ''}`,
    [{ label: 'Yay! ⭐', value: 1, cls: 'green' }]
  );
}

// ---- the book ----
function screenStickers(back = 'home') {
  checkStickers();
  const got = earnedStickers();
  show(`
    <div class="screen stickers">
      ${topbar(`⭐ Sticker book — ${stickerCount()} of ${STICKERS.length}`, back)}
      <div class="dex-progress"><div style="width:${(stickerCount() / STICKERS.length) * 100}%"></div></div>
      <div class="sticker-grid">
        ${STICKERS.map((st) => `<button class="sticker-cell${got[st.id] ? ' got' : ''}" data-id="${st.id}">
          <div class="sticker-art">${stickerSVG(st, !!got[st.id])}</div>
          <b>${got[st.id] ? st.name : '???'}</b><small>${st.goal}</small></button>`).join('')}
      </div>
    </div>`);
  $('.sticker-grid').addEventListener('click', (e) => {
    const c = e.target.closest('.sticker-cell');
    if (!c) return;
    Sound.tap();
    const st = STICKERS.find((x) => x.id === c.dataset.id), when = got[st.id];
    modal(`<div class="sticker-art big">${stickerSVG(st, !!when)}</div><h2>${when ? st.name : 'Not yet!'}</h2>
      <p>${st.goal}</p>${when ? `<p class="muted">Earned on ${new Date(when + 'T12:00:00').toLocaleDateString()}</p>` : '<p class="muted">Keep playing to earn this sticker!</p>'}`,
      [{ label: 'Close', value: 1, cls: 'green' }]);
  });
}
