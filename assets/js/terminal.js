/* Interactive terminal: type commands (or tap the buttons). Includes a Snake game and a matrix effect. */
(() => {
  const body = document.getElementById('termBody');
  const form = document.getElementById('termForm');
  const input = document.getElementById('termIn');
  const chips = document.getElementById('termChips');
  const win = document.getElementById('term');
  const stage = document.getElementById('termStage');
  const side = document.getElementById('termSide');
  if (!body || !form || !input) return;

  const reduce = false /* animations stay on for every device */;
  const PROMPT = 'tehseen@portfolio:~$';
  const PROJECTS = [
    { name: 'eco-mate-cleaning', title: 'Eco Mate Cleaning', tag: 'client', url: 'https://ecomatecleaning.com.au/' },
    { name: 'json-pest-control', title: 'Json Pest Control Melbourne', tag: 'client', url: 'https://jsonpestcontrolmelbourne.com.au/' },
    { name: 'bee-wasp-removal', title: 'Melbourne Wasp & Bee Removal', tag: 'client', url: 'https://beewaspsolutions.com.au/' },
    { name: 'jet-rental', title: 'Jet Rental', tag: 'web', url: 'https://tehseenhamid.github.io/jet-charter/' },
    { name: 'elite-wheels', title: 'Elite Wheels', tag: 'web', url: 'https://tehseenhamid.github.io/elite_wheels-car-rental/' },
    { name: 'xavier-car-rental', title: 'Xavier Car Rental', tag: 'web', url: 'https://tehseenhamid.github.io/XaviersCarRentalWebsite/' },
    { name: 'nova-ai', title: 'NOVA AI Frontend', tag: 'app', url: 'https://tehseenhamid.github.io/Ai_Chatbot/' },
    { name: 'abasyn-lms', title: 'Abasyn School LMS', tag: 'app', url: 'https://tehseenhamid.github.io/SchoolLMS/' },
    { name: 'sepal-school', title: 'SEPAL School Website', tag: 'web', url: 'https://tehseenhamid.github.io/School_Website/' },
    { name: 'abasyn-school', title: 'Abasyn School Website', tag: 'web', url: 'https://tehseenhamid.github.io/abasyn_school/' }
  ];
  const FILES = { 'about.md': 'about', 'skills.txt': 'skills', 'projects.txt': 'projects', 'experience.txt': 'experience', 'contact.txt': 'contact' };

  /* ---------- output helpers ---------- */
  let queue = Promise.resolve();
  let gen = 0;                                          // bumped by `clear` to cancel pending output
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const toBottom = () => { body.scrollTop = body.scrollHeight; };

  function lineEl(parts, cls) {
    const d = document.createElement('div'); d.className = 'tl-line' + (cls ? ' ' + cls : '');
    (Array.isArray(parts) ? parts : [parts]).forEach(p => {
      if (typeof p === 'string') { d.appendChild(document.createTextNode(p)); return; }
      const el = document.createElement(p.href ? 'a' : 'span');
      el.textContent = p.t; if (p.c) el.className = p.c;
      if (p.href) { el.href = p.href; if (/^https?:/.test(p.href)) { el.target = '_blank'; el.rel = 'noopener'; } }
      d.appendChild(el);
    });
    return d;
  }
  function out(lines, { delay = reduce ? 0 : 18 } = {}) {
    const g = gen;
    queue = queue.then(async () => {
      for (const l of lines) {
        if (g !== gen) return;
        const spec = (l && l.parts !== undefined) ? l : { parts: l };
        body.appendChild(lineEl(spec.parts, spec.cls)); toBottom();
        if (delay) await sleep(delay);
      }
    });
    return queue;
  }
  const echo = cmd => { body.appendChild(lineEl([{ t: PROMPT + ' ', c: 'tl-p' }, cmd])); toBottom(); };
  const blank = () => ({ parts: '' });
  const dim = t => ({ parts: [{ t, c: 'tl-dim' }] });
  const head = t => ({ parts: [{ t, c: 'tl-h' }] });
  const kv = (k, v, href) => ({ parts: [{ t: k.padEnd(12), c: 'tl-dim' }, href ? { t: v, href } : v] });

  /* ---------- commands ---------- */
  const COMMANDS = {
    help: () => out([
      head('Available commands'),
      kv('about', 'who I am'), kv('skills', 'my tech stack'), kv('projects', 'things I have built'),
      kv('open <n>', 'open a project, e.g. open 1'), kv('experience', 'where I have worked'), kv('contact', 'how to reach me'),
      kv('hire', 'start a project with me'), kv('ls / cat', 'browse files, e.g. cat about.md'), kv('matrix', 'code rain'),
      kv('studio', 'design your website colours'), kv('palette', 'open the quick-jump palette'), kv('snake', 'classic snake game'), kv('flappy', 'fly the bug through the firewalls'), kv('clear', 'clear the screen'),
      dim('Tip: press Tab to autocomplete, and the up arrow for history.')
    ]),
    whoami: () => out([{ parts: ['tehseen-hamid  ', { t: 'full stack, web & mobile developer', c: 'tl-o' }] }, dim('islamabad, pakistan · open to clients worldwide')]),
    about: () => out([
      head('About'),
      'Software Engineering student at COMSATS University Islamabad.',
      'I build complete web and mobile products: interface, API and database.',
      'Intern at Nexigo Solutions, builder of live client sites in Australia,',
      'and founder of Campuxly, an app and web platform for students and teachers.'
    ]),
    skills: () => out([
      head('Skills'),
      kv('frontend', 'HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind'),
      kv('mobile', 'Flutter, Dart, Firebase'),
      kv('backend', 'Node.js, Express, REST APIs, JWT'),
      kv('databases', 'MongoDB, MySQL, Firebase'),
      kv('cms', 'WordPress, Elementor Pro'),
      kv('tools', 'Git, GitHub, Postman, Figma, Vercel')
    ]),
    projects: () => out([
      head('Projects (' + PROJECTS.length + ')'),
      ...PROJECTS.map((p, i) => ({ parts: [{ t: String(i + 1).padStart(2, '0') + '  ', c: 'tl-o' }, { t: p.title, href: p.url }, { t: '  [' + p.tag + ']', c: 'tl-dim' }] })),
      dim('Type "open <number>" to visit one, for example: open 1')
    ]),
    open: args => {
      const q = (args[0] || '').toLowerCase();
      if (!q) return out([dim('usage: open <number|name>   (see: projects)')]);
      const p = /^\d+$/.test(q) ? PROJECTS[+q - 1] : PROJECTS.find(x => x.name.includes(q) || x.title.toLowerCase().includes(q));
      if (!p) return out([{ parts: [{ t: 'no such project: ' + q, c: 'tl-err' }] }]);
      window.open(p.url, '_blank', 'noopener');
      return out([{ parts: ['opening ', { t: p.title, href: p.url }, ' ...'] }]);
    },
    experience: () => out([
      head('Experience'),
      kv('2026 →', 'Founder & CEO, Campuxly'),
      kv('2026 →', 'Web Developer (freelance), Ecomate Cleaning, Australia'),
      kv('2025', 'Full Stack Web Developer Intern, Nexigo Solutions'),
      kv('2024-2025', 'IT Support & Web Coordinator Intern, SPS Education System'),
      kv('2022-2028', 'BS Computer Software Engineering, COMSATS Islamabad')
    ]),
    contact: () => out([
      head('Contact'),
      kv('email', 'tehseenhamid1121@gmail.com', 'mailto:tehseenhamid1121@gmail.com'),
      kv('phone', '+92 327 6099669', 'tel:+923276099669'),
      kv('whatsapp', 'wa.me/923276099669', 'https://wa.me/923276099669'),
      kv('linkedin', 'tehseen-hamid', 'https://www.linkedin.com/in/tehseen-hamid-088399322/'),
      kv('github', 'tehseenhamid', 'https://github.com/tehseenhamid')
    ]),
    hire: () => hire(),
    ls: () => out([{ parts: Object.keys(FILES).map(f => ({ t: f + '   ', c: 'tl-o' })) }, { parts: [{ t: 'projects/', c: 'tl-b' }] }]),
    cat: args => {
      const f = (args[0] || '').replace(/^\.?\//, '');
      if (!f) return out([dim('usage: cat <file>   (see: ls)')]);
      if (FILES[f]) return COMMANDS[FILES[f]]();
      return out([{ parts: [{ t: 'cat: ' + f + ': No such file or directory', c: 'tl-err' }] }]);
    },
    date: () => out([new Date().toString()]),
    echo: args => out([args.join(' ')]),
    history: () => out(hist.map((c, i) => String(i + 1).padStart(3) + '  ' + c)),
    neofetch: () => out([
      ...[' _____ _   _ ', '|_   _| | | |', '  | | | |_| |', '  | | |  _  |', '  |_| |_| |_|'].map(l => ({ parts: [{ t: l, c: 'tl-o' }] })),
      { parts: [{ t: 'tehseen', c: 'tl-o' }, '@', { t: 'portfolio', c: 'tl-o' }] }, dim('-----------------'),
      kv('role', 'Full Stack · Web · Mobile'), kv('stack', 'MERN · Next.js · Flutter'), kv('location', 'Islamabad, Pakistan'),
      kv('studying', 'BS Software Engineering'), kv('building', 'Campuxly'), kv('status', 'open to work')
    ]),
    sudo: args => {
      const a = args.join(' ');
      if (/^hire(\s|-)?(me|tehseen)?$/.test(a)) return hire(true);
      return out([{ parts: [{ t: 'tehseen is not in the sudoers file. This incident will be reported.', c: 'tl-err' }] }]);
    },
    studio: () => { window.open('studio.html', '_self'); return out([dim('opening the Design Studio ...')]); },
    palette: () => { const b = document.getElementById('cmdkHint'); if (b) b.click(); return out([dim('command palette opened (Ctrl K)')]); },
    matrix: () => { startMatrix(); return out([dim('wake up, neo ...  (press any key or tap to stop)')]); },
    snake: () => startSnake(),
    flappy: () => startFlappy(),
    clear: () => { gen++; body.textContent = ''; queue = Promise.resolve(); }
  };
  const ALIASES = { '?': 'help', ls: 'ls', dir: 'ls', 'hire-me': 'hire', cls: 'clear', projects: 'projects', work: 'projects', game: 'snake', play: 'snake', fly: 'flappy', bug: 'flappy', flap: 'flappy', cv: 'experience', email: 'contact' };

  function hire(sudo) {
    out([
      { parts: [{ t: sudo ? 'Permission granted.' : 'Great choice.', c: 'tl-o' }] },
      'Opening the contact section ...',
      dim('Call or WhatsApp +92 327 6099669 · tehseenhamid1121@gmail.com')
    ]).then(() => {
      setTimeout(() => { const c = document.getElementById('contact'); if (c) c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 500);
    });
  }

  /* ---------- input handling ---------- */
  const hist = []; let hi = 0; let busy = false;
  function run(raw) {
    const line = raw.trim();
    echo(line);
    if (!line) return;
    hist.push(line); hi = hist.length;
    if (/^rm\s+-rf\s+\/?\*?$/.test(line)) return out([{ parts: [{ t: 'Permission denied. Nice try.', c: 'tl-err' }] }]);
    const [c0, ...args] = line.split(/\s+/);
    const name = COMMANDS[c0.toLowerCase()] ? c0.toLowerCase() : ALIASES[c0.toLowerCase()];
    if (name && COMMANDS[name]) return COMMANDS[name](args);
    return out([{ parts: [{ t: 'command not found: ' + c0, c: 'tl-err' }, '   (type ', { t: 'help', c: 'tl-o' }, ')'] }]);
  }
  form.addEventListener('submit', e => { e.preventDefault(); if (busy) return; const v = input.value; input.value = ''; run(v); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi] || ''; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value.trim().toLowerCase(); if (!v) return;
      const m = Object.keys(COMMANDS).filter(c => c.startsWith(v));
      if (m.length === 1) input.value = m[0] + ' ';
      else if (m.length > 1) { echo(v); out([{ parts: m.map(x => ({ t: x + '   ', c: 'tl-o' })) }]); }
    } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); COMMANDS.clear(); }
  });
  win.addEventListener('click', e => { if (!e.target.closest('a,canvas,button') && !window.getSelection().toString()) input.focus({ preventScroll: true }); });
  if (chips) chips.addEventListener('click', e => {
    const b = e.target.closest('button[data-cmd]'); if (!b || busy) return;
    run(b.dataset.cmd); win.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  });

  const clock = document.getElementById('termClock');
  if (clock) { const tick = () => { clock.textContent = new Date().toLocaleTimeString('en', { hour12: false }); }; tick(); setInterval(tick, 1000); }

  /* ---------- boot sequence (starts when the terminal is first visible) ---------- */
  let booted = false;
  async function boot() {
    if (booted) return; booted = true;
    const steps = ['initialising portfolio v1.0 ...', 'loading projects ........ ok', 'loading skills .......... ok', 'connecting to clients ... ok'];
    for (const s of steps) { await out([dim('> ' + s)], { delay: 0 }); if (!reduce) await sleep(260); }
    await out([blank(), { parts: ['Hi, I\'m ', { t: 'Tehseen', c: 'tl-o' }, '. Type ', { t: 'help', c: 'tl-o' }, ' to see what I can do.'] }, blank()], { delay: reduce ? 0 : 40 });
  }
  new IntersectionObserver((es, ob) => { if (es.some(e => e.isIntersecting)) { boot(); ob.disconnect(); } }, { threshold: 0.35 }).observe(win);

  /* ---------- matrix rain ---------- */
  const mc = document.getElementById('matrix'); let mRun = false;
  function startMatrix() {
    if (!mc || mRun || reduce) return;
    mRun = true; const ctx = mc.getContext('2d');
    const size = 16; let W = mc.width = innerWidth, H = mc.height = innerHeight;
    const cols = Math.ceil(W / size); const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const glyphs = '01{}[]<>/=+*#$%&;:'.split('');
    mc.classList.add('on'); let alive = true;
    const stop = () => { alive = false; };
    const timer = setTimeout(stop, 9000);
    const onInput = () => { clearTimeout(timer); stop(); };
    ['keydown', 'pointerdown'].forEach(ev => addEventListener(ev, onInput, { once: true }));
    (function frame() {
      if (!alive) { mc.classList.remove('on'); setTimeout(() => ctx.clearRect(0, 0, W, H), 600); mRun = false; return; }
      ctx.fillStyle = 'rgba(15,14,13,.12)'; ctx.fillRect(0, 0, W, H);
      ctx.font = size + 'px "Space Mono", monospace';
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        ctx.fillStyle = Math.random() > .96 ? '#ece7dc' : '#f2490f';
        ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, y);
        if (y > H && Math.random() > .975) drops[i] = 0; drops[i] += 1;
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ---------- game host (side panel on wide screens, inline on small ones) ---------- */
  let current = null;
  function openGame(buttons, name) {
    if (current) return null;
    const useSide = !!side && matchMedia('(min-width:900px)').matches;
    const wrap = document.createElement('div'); wrap.className = 'term__game';
    const info = document.createElement('div'); info.className = 'term__ginfo';
    const cv = document.createElement('canvas');
    const pad = document.createElement('div'); pad.className = 'term__pad';
    buttons.forEach(([d, l, cls]) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.d = d; b.textContent = l; if (cls) b.className = cls; pad.appendChild(b); });
    const gt = document.createElement('div'); gt.className = 'term__gtabs';
    [['snake', 'Snake'], ['flappy', 'Flappy Bug'], ['exit', 'Exit']].forEach(([k, l]) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.g = k; b.textContent = l; b.className = (k === name ? 'on ' : '') + (k === 'exit' ? 'exit' : ''); gt.appendChild(b); });
    gt.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.g === 'exit') TermGames.close(); else if (b.dataset.g !== name) TermGames.open(b.dataset.g); });
    wrap.append(gt, info, cv, pad);
    let overlay = null;
    if (useSide) { side.appendChild(wrap); stage.classList.add('has-game'); }
    else { overlay = document.createElement('div'); overlay.className = 'term__overlay'; overlay.appendChild(wrap); document.body.appendChild(overlay); document.body.style.overflow = 'hidden'; }
    const avail = useSide ? Math.max(200, Math.min(side.clientWidth - 40, innerHeight * 0.6)) : Math.max(200, Math.min(innerWidth - 32, 380));
    const availH = useSide ? innerHeight * 0.7 : innerHeight - 190;
    input.blur();
    if (useSide) setTimeout(() => stage.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }), 50);
    const g = { name, wrap, info, cv, pad, avail, availH, overlay, useSide, stops: [], dpr: Math.min(2, devicePixelRatio || 1) };
    current = g; return g;
  }
  function closeGame(g, msg) {
    g.stops.forEach(f => f()); (g.overlay || g.wrap).remove(); if (g.overlay) document.body.style.overflow = ''; stage.classList.remove('has-game'); current = null; syncTabs();
    if (msg) { body.appendChild(lineEl([{ t: msg, c: 'tl-dim' }])); toBottom(); }
  }
  const getBest = k => { try { return +localStorage.getItem(k) || 0; } catch (e) { return 0; } };
  const setBest = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  const tabsEl = document.getElementById('termTabs');
  function syncTabs() { if (!tabsEl) return; [...tabsEl.children].forEach(b => b.classList.toggle('is-active', b.dataset.tab === (current ? current.name : 'terminal'))); }
  const TermGames = {
    open(name) { if (current) closeGame(current, null); (name === 'flappy' ? startFlappy : startSnake)(); syncTabs(); },
    close() { if (current) closeGame(current, null); syncTabs(); }
  };
  window.TermGames = TermGames;
  if (tabsEl) tabsEl.addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if (!b) return; if (b.dataset.tab === 'terminal') { TermGames.close(); input.focus({ preventScroll: true }); } else TermGames.open(b.dataset.tab); });

  /* ---------- snake ---------- */
  function startSnake() {
    const g = openGame([['up', 'UP'], ['left', 'LEFT'], ['down', 'DOWN'], ['right', 'RIGHT'], ['r', 'RESTART', 'restart'], ['q', 'QUIT', 'quit']], 'snake'); if (!g) return;
    const N = 20, px = Math.max(160, Math.floor(Math.min(g.avail, g.availH, 380) / N) * N), cell = px / N;
    const { cv, info, pad } = g, ctx = cv.getContext('2d');
    cv.width = cv.height = px * g.dpr; cv.style.width = cv.style.height = px + 'px'; cv.setAttribute('aria-label', 'Snake game'); ctx.scale(g.dpr, g.dpr);
    let best = getBest('snakeBest'), snake, dir, next, food, score, timer, over;
    const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }, OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
    function reset() { snake = [[10, 10], [9, 10], [8, 10]]; dir = next = 'right'; score = 0; over = false; placeFood(); clearInterval(timer); timer = setInterval(tick, 120); draw(); }
    function placeFood() { do { food = [(Math.random() * N) | 0, (Math.random() * N) | 0]; } while (snake.some(s => s[0] === food[0] && s[1] === food[1])); }
    const setDir = d => { if (d !== OPP[dir]) next = d; };
    function tick() {
      dir = next; const [dx, dy] = DIRS[dir], h = [snake[0][0] + dx, snake[0][1] + dy];
      if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || snake.some(s => s[0] === h[0] && s[1] === h[1])) { over = true; clearInterval(timer); return draw(); }
      snake.unshift(h);
      if (h[0] === food[0] && h[1] === food[1]) { score++; if (score > best) { best = score; setBest('snakeBest', best); } placeFood(); clearInterval(timer); timer = setInterval(tick, Math.max(65, 120 - score * 3)); } else snake.pop();
      draw();
    }
    function draw() {
      ctx.fillStyle = '#0f0e0d'; ctx.fillRect(0, 0, px, px); ctx.strokeStyle = 'rgba(236,231,220,.06)'; ctx.lineWidth = 1;
      for (let i = 1; i < N; i++) { ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, px); ctx.moveTo(0, i * cell); ctx.lineTo(px, i * cell); ctx.stroke(); }
      ctx.fillStyle = '#f2490f'; ctx.fillRect(food[0] * cell + 2, food[1] * cell + 2, cell - 4, cell - 4);
      snake.forEach((s, i) => { ctx.fillStyle = i ? '#ece7dc' : '#f2490f'; ctx.fillRect(s[0] * cell + 1, s[1] * cell + 1, cell - 2, cell - 2); if (!i) { ctx.fillStyle = '#0f0e0d'; ctx.fillRect(s[0] * cell + cell * .4, s[1] * cell + cell * .4, cell * .2, cell * .2); } });
      info.textContent = 'SNAKE · squash the bugs · score ' + score + ' · best ' + best;
      if (over) { ctx.fillStyle = 'rgba(15,14,13,.78)'; ctx.fillRect(0, 0, px, px); ctx.textAlign = 'center'; ctx.fillStyle = '#f2490f'; ctx.font = '700 ' + cell * 1.4 + 'px "Space Mono", monospace'; ctx.fillText('GAME OVER', px / 2, px / 2); ctx.fillStyle = '#ece7dc'; ctx.font = cell * .75 + 'px "Space Mono", monospace'; ctx.fillText('score ' + score + ' · tap or press Space', px / 2, px / 2 + cell * 1.7); }
    }
    const quit = () => closeGame(g, 'snake exited. final score ' + score + ' · best ' + best);
    function onKey(e) {
      const k = e.key.toLowerCase(), m = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
      if (m[k]) { e.preventDefault(); e.stopPropagation(); setDir(m[k]); }
      else if (k === 'q' || k === 'escape') { e.preventDefault(); quit(); }
      else if (k === 'r') { e.preventDefault(); reset(); }
      else if ((k === ' ' || k === 'enter') && over) { e.preventDefault(); reset(); }
    }
    addEventListener('keydown', onKey, true); g.stops.push(() => { clearInterval(timer); removeEventListener('keydown', onKey, true); });
    pad.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.d === 'r') reset(); else if (b.dataset.d === 'q') quit(); else if (over) reset(); else setDir(b.dataset.d); });
    let sx, sy;
    cv.addEventListener('touchstart', e => { const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; if (over) reset(); }, { passive: true });
    cv.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    cv.addEventListener('touchend', e => { const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return; setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')); }, { passive: true });
    cv.addEventListener('click', () => { if (over) reset(); });
    reset();
  }

  /* ---------- flappy bug: one tap / Space to flap, fly through the firewalls ---------- */
  function startFlappy() {
    const g = openGame([['flap', 'FLAP', 'big'], ['r', 'RESTART', 'restart'], ['q', 'QUIT', 'quit']], 'flappy'); if (!g) return;
    const W = 320, H = 440, cssW = Math.max(170, Math.min(g.avail, 340, Math.round(g.availH * W / H))), cssH = Math.round(cssW * H / W);
    const { cv, info, pad } = g, ctx = cv.getContext('2d');
    cv.width = W * g.dpr; cv.height = H * g.dpr; cv.style.width = cssW + 'px'; cv.style.height = cssH + 'px'; cv.setAttribute('aria-label', 'Flappy bug game'); ctx.scale(g.dpr, g.dpr);
    const GAP = 128, PW = 52, SPEED = 2.2, BX = 80, BS = 18, FLOOR = H - 22;
    let best = getBest('flappyBest'), y, vy, pipes, score, over, started, overAt = 0, raf = 0, running = true, last = 0, acc = 0, frames = 0;
    function reset() { y = H / 2 - 20; vy = 0; pipes = []; score = 0; over = false; started = false; frames = 0; }
    function flap() {
      if (over) { if (performance.now() - overAt > 450) reset(); return; }
      started = true; vy = -6.6;
    }
    function step() {
      frames++;
      if (!started) { y = H / 2 - 20 + Math.sin(frames / 14) * 7; return; }
      vy += 0.40; y += vy;
      if (!pipes.length || pipes[pipes.length - 1].x < W - 190) pipes.push({ x: W + 10, gy: 60 + Math.random() * (FLOOR - GAP - 110), scored: false });
      pipes.forEach(p => { p.x -= SPEED; if (!p.scored && p.x + PW < BX) { p.scored = true; score++; if (score > best) { best = score; setBest('flappyBest', best); } } });
      pipes = pipes.filter(p => p.x > -PW - 4);
      const hit = y < 0 || y + BS > FLOOR || pipes.some(p => BX + BS > p.x && BX < p.x + PW && (y < p.gy || y + BS > p.gy + GAP));
      if (hit) { over = true; overAt = performance.now(); }
    }
    function draw() {
      ctx.fillStyle = '#0f0e0d'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(236,231,220,.05)'; ctx.lineWidth = 1; for (let i = 0; i < W; i += 32) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      pipes.forEach(p => {
        ctx.fillStyle = '#ece7dc'; ctx.fillRect(p.x, 0, PW, p.gy); ctx.fillRect(p.x, p.gy + GAP, PW, FLOOR - p.gy - GAP);
        ctx.fillStyle = '#f2490f'; ctx.fillRect(p.x - 4, p.gy - 12, PW + 8, 12); ctx.fillRect(p.x - 4, p.gy + GAP, PW + 8, 12);
        ctx.fillStyle = 'rgba(15,14,13,.18)'; for (let yy = 6; yy < p.gy - 14; yy += 14) ctx.fillRect(p.x + 8, yy, PW - 16, 3);
        for (let yy = p.gy + GAP + 20; yy < FLOOR - 6; yy += 14) ctx.fillRect(p.x + 8, yy, PW - 16, 3);
      });
      ctx.fillStyle = '#f2490f'; ctx.fillRect(0, FLOOR, W, 3); ctx.fillStyle = 'rgba(236,231,220,.12)'; ctx.fillRect(0, FLOOR + 3, W, H - FLOOR);
      ctx.save(); ctx.translate(BX + BS / 2, y + BS / 2); ctx.rotate(Math.max(-.5, Math.min(.9, vy * .07)));
      ctx.fillStyle = '#f2490f'; ctx.fillRect(-BS / 2, -BS / 2, BS, BS); ctx.fillStyle = '#ece7dc'; ctx.fillRect(2, -5, 5, 5); ctx.fillStyle = '#0f0e0d'; ctx.fillRect(4, -3, 2, 2);
      ctx.fillStyle = 'rgba(236,231,220,.8)'; const fl = Math.sin(frames / 2) * 5; ctx.fillRect(-9, -4 + fl, 7, 3); ctx.restore();
      ctx.textAlign = 'center'; ctx.fillStyle = '#ece7dc'; ctx.font = '700 34px "Space Mono", monospace'; ctx.fillText(String(score), W / 2, 52);
      if (!started) { ctx.fillStyle = '#f2490f'; ctx.font = '700 15px "Space Mono", monospace'; ctx.fillText('TAP / SPACE TO FLAP', W / 2, H / 2 + 64); }
      if (over) { ctx.fillStyle = 'rgba(15,14,13,.78)'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#f2490f'; ctx.font = '700 30px "Space Mono", monospace'; ctx.fillText('GAME OVER', W / 2, H / 2 - 6); ctx.fillStyle = '#ece7dc'; ctx.font = '14px "Space Mono", monospace'; ctx.fillText('score ' + score + ' · best ' + best, W / 2, H / 2 + 22); ctx.fillText('tap or press Space to retry', W / 2, H / 2 + 46); }
      info.textContent = 'FLAPPY BUG · fly through the firewalls · best ' + best;
    }
    function frame(t) { if (!running) return; acc += Math.min(50, t - (last || t)); last = t; while (acc >= 16.67) { step(); acc -= 16.67; } draw(); raf = requestAnimationFrame(frame); }
    const quit = () => closeGame(g, 'flappy exited. score ' + score + ' · best ' + best);
    function onKey(e) {
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'arrowup' || k === 'w' || k === 'enter') { e.preventDefault(); e.stopPropagation(); if (!e.repeat) flap(); }
      else if (k === 'r') { e.preventDefault(); reset(); }
      else if (k === 'q' || k === 'escape') { e.preventDefault(); quit(); }
    }
    addEventListener('keydown', onKey, true);
    g.stops.push(() => { running = false; cancelAnimationFrame(raf); removeEventListener('keydown', onKey, true); });
    cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
    pad.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.d === 'q') quit(); else if (b.dataset.d === 'r') reset(); else flap(); });
    reset(); raf = requestAnimationFrame(frame);
  }
})();
