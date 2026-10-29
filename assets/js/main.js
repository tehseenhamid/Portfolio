(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = false /* animations stay on for every device */;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- Preloader ---------- */
  const countEl = $('#loaderCount'), barEl = $('#loaderBar'), loader = $('#loader');
  document.body.classList.add('is-loading');
  let n = 0, pageReady = document.readyState === 'complete';
  addEventListener('load', () => (pageReady = true));
  const tick = () => {
    n += pageReady ? Math.max(3, (100 - n) * 0.2) : Math.max(0.4, (86 - n) * 0.05);
    if (n >= 100) n = 100;
    countEl.textContent = Math.floor(n);
    barEl.style.width = n + '%';
    if (n < 100) requestAnimationFrame(tick);
    else setTimeout(start, 250);
  };
  requestAnimationFrame(tick);
  setTimeout(() => { if (!document.body.classList.contains('loaded')) start(); }, 6000); // never trap the visitor

  function start() {
    if (document.body.classList.contains('loaded')) return;
    loader.classList.add('done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('loaded');
    setTimeout(() => (loader.style.display = 'none'), 1100);
  }

  /* ---------- Scroll progress + nav ---------- */
  const prog = $('#progress'), nav = $('#nav'), links = $('#navLinks');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    nav.classList.toggle('stuck', y > 30);
    nav.classList.toggle('hide', y > lastY && y > 400 && !links.classList.contains('open') && !document.body.classList.contains('in-hs'));
    lastY = y;
    if (!reduce && y < innerHeight * 1.2) {
      const b = $('#heroBlock');
      if (b) b.style.translate = `0 ${y * 0.1}px`;
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger');
  const setMenu = open => {
    links.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active link ---------- */
  const navA = $$('a', links);
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'terminal', 'work', 'services', 'reviews', 'experience', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal').forEach(el => {
    const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    if (el.closest('.stats,.steps,.why__list,.now__grid')) el.style.transitionDelay = (sib % 4) * 90 + 'ms';
    io.observe(el);
  });

  /* ---------- Count up ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '';
    const t0 = performance.now(), d = reduce ? 1 : 1500;
    const step = t => {
      const p = Math.min(1, (t - t0) / d), v = Math.round(to * (1 - Math.pow(1 - p, 4)));
      el.textContent = v + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    cio.unobserve(el);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- Magnetic buttons + 3D tilt (mouse devices only) ---------- */
  if (fine && !reduce) {
    $$('[data-magnet]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => (el.style.transform = ''));
    });
    $$('.project__shot').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
      });
      el.addEventListener('mouseleave', () => (el.style.transform = ''));
    });
    // gentle parallax on the portrait
    const vis = $('#heroVisual'), img = $('#heroImg');
    if (vis && img) {
      vis.addEventListener('mousemove', e => {
        const r = vis.getBoundingClientRect();
        img.style.translate = `${((e.clientX - r.left) / r.width - .5) * -14}px 0`;
      });
      vis.addEventListener('mouseleave', () => (img.style.translate = ''));
    }
  }

  /* ---------- Project filters ---------- */
  const fbtn = $$('#filters button'), cards = $$('.project');
  fbtn.forEach(b => b.addEventListener('click', () => {
    fbtn.forEach(x => x.classList.toggle('is-active', x === b));
    const f = b.dataset.filter;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.cat.split(' ').includes(f);
      c.classList.toggle('hidden', !show);
      if (show) { c.classList.remove('in'); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('in'))); }
    });
  }));

  /* ---------- Real screenshot, else live preview of the real site ---------- */
  const fit = (shot, frame) => { frame.style.transform = `scale(${Math.max(shot.clientWidth / 1440, shot.clientHeight / 900)})`; };
  const toLive = shot => {
    if (shot.dataset.live) return;
    shot.dataset.live = '1';
    const img = $('img', shot); if (img) img.remove();
    const f = document.createElement('iframe');
    f.src = shot.dataset.url; f.title = 'Live preview of ' + shot.getAttribute('aria-label');
    f.loading = 'lazy'; f.tabIndex = -1; f.setAttribute('scrolling', 'no');
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    f.addEventListener('load', () => f.classList.add('ready'));
    shot.appendChild(f);
    const b = document.createElement('span'); b.className = 'badge'; b.textContent = 'Live preview';
    shot.appendChild(b);
    fit(shot, f);
    new ResizeObserver(() => fit(shot, f)).observe(shot);
  };
  $$('.project__shot').forEach(shot => {
    shot.dataset.name = $('h3', shot.closest('.project')).textContent;
    const img = $('img', shot);
    if (!img) return;
    img.addEventListener('error', () => toLive(shot));
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) toLive(shot);
  });

  /* ---------- Client reviews ---------- */
  const grid = $('#rvGrid');
  const mkCard = (r, sample) => {
    const c = document.createElement('article'); c.className = 'rv reveal in' + (sample ? ' rv--sample' : '');
    if (r.rating) {
      const st = document.createElement('div'); st.className = 'stars'; st.setAttribute('aria-label', r.rating + ' out of 5');
      for (let i = 1; i <= 5; i++) { const s = document.createElement('i'); if (i <= r.rating) s.className = 'on'; st.appendChild(s); }
      c.appendChild(st);
    }
    const q = document.createElement('blockquote'); q.textContent = '\u201C' + r.text + '\u201D';
    const f = document.createElement('footer'); const n = document.createElement('b'); n.textContent = r.name;
    const m = document.createElement(r.url ? 'a' : 'span');
    m.textContent = [r.business, r.date].filter(Boolean).join(' \u00B7 ');
    if (r.url) { m.href = r.url; m.target = '_blank'; m.rel = 'noopener'; }
    f.append(n, m); c.append(q, f);
    return c;
  };
  const cfg = window.SITE_CONFIG || {};
  const api = (cfg.apiBase || '').replace(/\/$/, '') + '/api/reviews';
  let live = false;                                   // becomes true when the reviews server answers
  const note = $('#rvEmpty');
  const refreshEmpty = () => { const n = grid.children.length; if (note) note.hidden = n > 0; grid.hidden = n === 0; };
  const fmt = iso => new Date(iso).toLocaleString('en', { month: 'short', year: 'numeric' });
  if (grid) {
    (Array.isArray(window.REVIEWS) ? window.REVIEWS : []).forEach(r => grid.appendChild(mkCard(r, false)));
    refreshEmpty();
    if (/^https?:$/.test(location.protocol)) {
      fetch(api, { headers: { Accept: 'application/json' } })
        .then(r => { if (!r.ok) throw new Error('no api'); return r.json(); })
        .then(rows => {
          live = true;
          rows.forEach(x => grid.appendChild(mkCard({ name: x.name, business: x.business || '', rating: x.rating || 0, text: x.review, date: fmt(x.created_at) }, false)));
          refreshEmpty();
          const n = $('#rnote'); if (n) n.textContent = 'Your review is published instantly.';
        }).catch(() => {});
    }
  }
  const rform = $('#rform');
  if (rform) rform.addEventListener('submit', async e => {
    e.preventDefault();
    const d = new FormData(rform);
    const item = { name: String(d.get('name')).trim(), business: String(d.get('business') || '').trim(), rating: +d.get('rating'), text: String(d.get('text')).trim() };
    const thanks = $('#rthanks'), btn = $('button[type=submit]', rform);
    const viaEmail = () => {
      const body = `New client review for the portfolio:\n\nName: ${item.name}\nBusiness / website: ${item.business}\nRating: ${item.rating}/5\n\n${item.text}`;
      thanks.textContent = 'Thank you! Please press send in your email app so your review reaches me.';
      thanks.hidden = false;
      location.href = `mailto:tehseenhamid1121@gmail.com?subject=${encodeURIComponent('New client review from ' + item.name)}&body=${encodeURIComponent(body)}`;
    };
    if (!live) return viaEmail();
    btn.disabled = true;
    try {
      const res = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name, business: item.business, rating: item.rating, review: item.text, website: d.get('website') || '' }) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) { thanks.textContent = out.error || 'Sorry, something went wrong. Please try again.'; thanks.hidden = false; btn.disabled = false; return; }
      if (out.published !== false) { grid.prepend(mkCard({ ...item, date: fmt(new Date().toISOString()) }, false)); refreshEmpty(); }
      thanks.textContent = out.published === false ? 'Thank you! Your review will appear once I have approved it.' : 'Thank you! Your review is now live on this page.';
      thanks.hidden = false; rform.reset();
    } catch (err) { viaEmail(); }
    btn.disabled = false;
  });

  /* ---------- Contact form -> mailto ---------- */
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(e.target);
    const body = `${d.get('msg')}\n\n— ${d.get('name')} (${d.get('email')})`;
    location.href = `mailto:tehseenhamid1121@gmail.com?subject=${encodeURIComponent('Portfolio enquiry from ' + d.get('name'))}&body=${encodeURIComponent(body)}`;
  });
})();
