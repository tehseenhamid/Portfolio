/* Command palette: Ctrl/Cmd+K (or "/") to jump anywhere or run something. */
(() => {
  const box = document.getElementById('cmdk'), input = document.getElementById('cmdkIn'), list = document.getElementById('cmdkList'), hint = document.getElementById('cmdkHint');
  if (!box) return;
  const go = id => () => { const e = document.getElementById(id); if (e) e.scrollIntoView({ behavior: 'smooth' }); };
  const game = n => () => { go('terminal')(); setTimeout(() => window.TermGames && window.TermGames.open(n), 600); };
  const ext = u => () => window.open(u, '_blank', 'noopener');
  const ITEMS = [
    ['Go to About', 'section', go('about')], ['Go to Terminal', 'section', go('terminal')], ['Go to Projects', 'section', go('work')], ['Go to Services', 'section', go('services')],
    ['Open the Design Studio', 'page', () => { location.href = 'studio.html'; }], ['Go to Client reviews', 'section', go('reviews')], ['Go to Experience', 'section', go('experience')], ['Go to Contact', 'section', go('contact')],
    ['Play Snake', 'game', game('snake')], ['Play Flappy Bug', 'game', game('flappy')],
    ['Call +92 327 6099669', 'contact', () => { location.href = 'tel:+923276099669'; }], ['WhatsApp me', 'contact', ext('https://wa.me/923276099669')],
    ['Email tehseenhamid1121@gmail.com', 'contact', () => { location.href = 'mailto:tehseenhamid1121@gmail.com'; }],
    ['LinkedIn', 'link', ext('https://www.linkedin.com/in/tehseen-hamid-088399322/')], ['GitHub', 'link', ext('https://github.com/tehseenhamid')], ['Campuxly', 'link', ext('https://www.linkedin.com/company/campuxly/')],
    ['Eco Mate Cleaning', 'project', ext('https://ecomatecleaning.com.au/')], ['Json Pest Control Melbourne', 'project', ext('https://jsonpestcontrolmelbourne.com.au/')], ['Melbourne Wasp & Bee Removal', 'project', ext('https://beewaspsolutions.com.au/')],
    ['Jet Rental', 'project', ext('https://tehseenhamid.github.io/jet-charter/')], ['Elite Wheels', 'project', ext('https://tehseenhamid.github.io/elite_wheels-car-rental/')], ['Xavier Car Rental', 'project', ext('https://tehseenhamid.github.io/XaviersCarRentalWebsite/')],
    ['NOVA AI Frontend', 'project', ext('https://tehseenhamid.github.io/Ai_Chatbot/')], ['Abasyn School LMS', 'project', ext('https://tehseenhamid.github.io/SchoolLMS/')], ['SEPAL School Website', 'project', ext('https://tehseenhamid.github.io/School_Website/')], ['Abasyn School Website', 'project', ext('https://tehseenhamid.github.io/abasyn_school/')]
  ];
  let shown = [], sel = 0;
  function render() {
    const q = input.value.trim().toLowerCase();
    shown = ITEMS.filter(i => !q || (i[0] + ' ' + i[1]).toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.textContent = '';
    shown.forEach((it, i) => {
      const li = document.createElement('li'); li.setAttribute('role', 'option'); if (i === sel) li.className = 'on';
      const a = document.createElement('span'); a.textContent = it[0]; const b = document.createElement('small'); b.textContent = it[1];
      li.append(a, b); li.addEventListener('click', () => run(i)); li.addEventListener('mousemove', () => { sel = i; mark(); }); list.appendChild(li);
    });
    if (!shown.length) { const li = document.createElement('li'); li.textContent = 'No match'; list.appendChild(li); }
  }
  const mark = () => [...list.children].forEach((li, i) => li.classList.toggle('on', i === sel));
  function open() { box.hidden = false; input.value = ''; sel = 0; render(); setTimeout(() => input.focus(), 20); }
  function close() { box.hidden = true; }
  function run(i) { const it = shown[i]; if (!it) return; close(); setTimeout(it[2], 60); }
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); mark(); list.children[sel] && list.children[sel].scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); list.children[sel] && list.children[sel].scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
  });
  box.addEventListener('click', e => { if (e.target === box) close(); });
  addEventListener('keydown', e => {
    const typing = /input|textarea/i.test((document.activeElement || {}).tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); box.hidden ? open() : close(); }
    else if (e.key === 'Escape' && !box.hidden) close();
    else if (e.key === '/' && !typing && box.hidden) { e.preventDefault(); open(); }
  });
  if (hint) hint.addEventListener('click', () => (box.hidden ? open() : close()));
  if (hint) { const t = () => hint.classList.toggle('hide', scrollY > innerHeight * 0.8); addEventListener('scroll', t, { passive: true }); t(); }
})();
