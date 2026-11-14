// sentences.js — bonus "read a sentence" stops: after a region's gym badge, 5 short sentences built
// only from words learned so far. Each sentence matches one of 3 pictures; the wrong pictures swap in
// a look-alike word (cat ↔ bat), so every word has to be read.

const SENT_SMALL = ['cat', 'bat', 'hat', 'cap', 'fan', 'can', 'pan', 'bag', 'hen', 'pen', 'peg', 'net', 'pin', 'wig', 'pot', 'mop', 'top', 'dog', 'cob', 'bug', 'mug', 'bun', 'cup', 'nut', 'gum', 'rat', 'ham', 'jam', 'gem', 'pig', 'bib', 'fox', 'box', 'pup', 'cub', 'jug', 'yam', 'keg', 'pod', 'bud'];
const SENT_PLACES = {
  in: ['bag', 'van', 'bin', 'box', 'cup', 'mug', 'tub', 'pot', 'hat', 'cab', 'bus', 'jug'],
  on: ['mat', 'bed', 'rug', 'log', 'bus', 'van', 'box', 'cab'],
  under: ['bed', 'van', 'bus', 'cab', 'log'],
};
// sentence patterns and the words each one needs
const SENT_TEMPLATES = [
  { id: 'two', needs: ['I', 'see', 'a'], text: (x, y) => `I see a ${x}. I see a ${y}.` },
  { id: 'and', needs: ['I', 'see', 'a', 'and'], text: (x, y) => `I see a ${x} and a ${y}.` },
  { id: 'in', needs: ['the', 'is', 'in'], text: (x, y) => `The ${x} is in the ${y}.` },
  { id: 'on', needs: ['the', 'is', 'on'], text: (x, y) => `The ${x} is on the ${y}.` },
  { id: 'under', needs: ['the', 'is', 'under'], text: (x, y) => `The ${x} is under the ${y}.` },
];
const SENTENCES_PER_STOP = 5;

const sameFamilyFirst = (w, list) => shuffle(list).sort((a, b) => (b.slice(-2) === w.slice(-2)) - (a.slice(-2) === w.slice(-2)));

function makeSentence(learned, avoid) {
  const has = (w) => learned.has(w) && hasPic(w);
  const small = SENT_SMALL.filter(has);
  const usable = SENT_TEMPLATES.filter((t) => t.needs.every((w) => learned.has(w)) && (t.id === 'two' || t.id === 'and' ? small.length >= 3 : SENT_PLACES[t.id].some(has)));
  if (!usable.length || small.length < 3) return null;
  // newer patterns come up a bit more often
  const tpl = Math.random() < 0.6 ? usable[usable.length - 1] : pick(usable);
  for (let tries = 0; tries < 40; tries++) {
    const yList = tpl.id === 'two' || tpl.id === 'and' ? small : SENT_PLACES[tpl.id].filter(has);
    const y = pick(yList), x = pick(small.filter((w) => w !== y));
    if (!x || avoid.has(`${tpl.id}:${x}:${y}`)) continue;
    const x2 = sameFamilyFirst(x, small.filter((w) => w !== x && w !== y))[0];
    const y2 = sameFamilyFirst(y, yList.filter((w) => w !== y && w !== x && w !== x2))[0];
    if (!x2) continue;
    const options = [{ x, y, ok: true }, { x: x2, y }, y2 ? { x, y: y2 } : { x: sameFamilyFirst(x, small.filter((w) => w !== x && w !== y && w !== x2))[0], y }].filter((o) => o.x);
    if (options.length < 3) continue;
    avoid.add(`${tpl.id}:${x}:${y}`);
    return { tpl: tpl.id, text: tpl.text(x, y), options: shuffle(options) };
  }
  return null;
}

// A picture that combines two word drawings in the way the sentence describes.
function sceneSVG(rel, x, y) {
  const g = (w, tx, ty, s) => `<g transform="translate(${tx} ${ty}) scale(${s})">${PIC[w]}</g>`;
  let inner;
  if (rel === 'in') inner = g(x, 64, 16, 0.72) + g(y, 22, 52, 1.56);
  else if (rel === 'on') inner = `<path d="M10 192 L190 192" stroke="#b5c4a0" stroke-width="4" stroke-linecap="round"/>` + g(y, 22, 70, 1.56) + g(x, 62, 6, 0.76);
  else if (rel === 'under') inner = g(y, 18, 0, 1.64) + g(x, 70, 128, 0.62);
  else inner = g(x, 4, 52, 0.94) + g(y, 102, 52, 0.94);
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="picture">${inner}</svg>`;
}

const sentenceDone = (r) => !!(save.reading.sentences && save.reading.sentences[r]);

async function screenSentences(r) {
  const J = JOURNEYS[r];
  const learned = new Set(wordsUpTo(r));
  const avoid = new Set();
  const list = [];
  for (let i = 0; i < SENTENCES_PER_STOP; i++) { const s = makeSentence(learned, avoid); if (s) list.push(s); }
  const tok = show(`
    <div class="screen read-stop">
      ${readTop(`📜 ${J.name} · Sentence bonus`)}
      <div class="split">
        <div class="stage"><div class="sprite stage-sprite bob">${heroSVG()}</div></div>
        <div class="panel card"></div>
      </div>
    </div>`);
  const panel = $('.panel');
  panel.innerHTML = `<div class="center-msg"><div class="big-emoji">📜</div><h2>Read a sentence!</h2>
    <p>Read each sentence, then tap the picture that matches it. Read every word carefully!</p>
    <div class="btn-row"><button class="btn green big" id="go">Let's read! ▶</button></div></div>`;
  await new Promise((res) => ($('#go').onclick = () => { Sound.tap(); res(); }));
  if (!alive(tok)) return;

  // same rule as everywhere: a missed sentence comes back until it's read right the first time
  const queue = [...list];
  let done = 0;
  const again = new Set();
  await new Promise((resolve) => {
    const next = () => {
      if (!alive(tok)) return;
      if (!queue.length) { resolve(); return; }
      const q = queue.shift();
      let missed = false;
      panel.innerHTML = `
        <div class="rq sentence-q">
          <div class="quiz-head"><div class="quiz-title">${again.has(q) ? '🔁 This one again!' : 'Sentence bonus'}</div><div class="rq-count">${done} / ${list.length} ✓</div></div>
          <div class="read-sentence">${q.text}</div>
          <div class="rq-options pic scene-options">${q.options.map((o, i) => `<button class="rq-opt" data-i="${i}">${sceneSVG(q.tpl, o.x, o.y)}</button>`).join('')}</div>
          <div class="feedback">&nbsp;</div>
        </div>`;
      const box = $('.rq', panel), fb = $('.feedback', panel);
      $('.rq-options', panel).addEventListener('click', (e) => {
        const b = e.target.closest('.rq-opt');
        if (!b || b.disabled || box.dataset.busy) return;
        if (q.options[+b.dataset.i].ok) {
          box.dataset.busy = '1';
          Sound.correct(); b.classList.add('right');
          fb.textContent = pick(PRAISE); fb.className = 'feedback good';
          if (missed) { again.add(q); queue.splice(Math.min(1, queue.length), 0, q); } else done++;
          setTimeout(next, 1000);
        } else {
          missed = true;
          Sound.wrong(); b.disabled = true; b.classList.add('wrong');
          fb.textContent = 'Read it again slowly!'; fb.className = 'feedback bad';
          box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
        }
      });
    };
    next();
  });
  if (!alive(tok)) return;
  const first = !sentenceDone(r);
  save.reading.sentences ||= {};
  save.reading.sentences[r] = true;
  persist();
  Sound.levelUp(); confetti();
  $('.stage-sprite').classList.add('jump');
  panel.innerHTML = `<div class="center-msg"><div class="big-emoji">📜✨</div><h2>You read ${list.length} sentences!</h2>
    <p>${first ? 'Real reading, just like a book. Amazing!' : 'Great practice!'}</p>
    <div class="btn-row"><button class="btn grey" data-go="reading">Map 🗺️</button><button class="btn green big" id="more-sent">More sentences 📜</button></div></div>`;
  $('#more-sent').onclick = () => { Sound.tap(); screenSentences(r); };
}
