/* Design Studio: a client designs their own website (colours, fonts, every element, animations, sections, text)
   and sends the finished brief to Tehseen on WhatsApp. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const mk = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const WA = '923276099669', MAIL = 'tehseenhamid1121@gmail.com', KEY = 'tsStudio2';
  const pv = $('#pv'), stage = $('#stage'), tabsEl = $('#tabs'), body = $('#tabbody');

  /* ============================== data ============================== */
  const FONTS = [
    ['anton', 'Anton', '"Anton",Impact,sans-serif', 'Display', 0], ['bebas', 'Bebas Neue', '"Bebas Neue",Impact,sans-serif', 'Display', 0], ['oswald', 'Oswald', '"Oswald",sans-serif', 'Display', 1],
    ['montserrat', 'Montserrat', '"Montserrat",sans-serif', 'Sans', 1], ['poppins', 'Poppins', '"Poppins",sans-serif', 'Sans', 1], ['inter', 'Inter', '"Inter",sans-serif', 'Sans', 1],
    ['roboto', 'Roboto', '"Roboto",sans-serif', 'Sans', 1], ['dmsans', 'DM Sans', '"DM Sans",sans-serif', 'Sans', 1], ['raleway', 'Raleway', '"Raleway",sans-serif', 'Sans', 1],
    ['grotesk', 'Space Grotesk', '"Space Grotesk",sans-serif', 'Sans', 1], ['system', 'System UI', 'system-ui,-apple-system,"Segoe UI",sans-serif', 'Sans', 1],
    ['playfair', 'Playfair Display', '"Playfair Display",Georgia,serif', 'Serif', 1], ['lora', 'Lora', '"Lora",Georgia,serif', 'Serif', 1], ['merri', 'Merriweather', '"Merriweather",Georgia,serif', 'Serif', 1],
    ['georgia', 'Georgia', 'Georgia,"Times New Roman",serif', 'Serif', 1], ['dancing', 'Dancing Script', '"Dancing Script",cursive', 'Script', 1], ['pacifico', 'Pacifico', '"Pacifico",cursive', 'Script', 0],
    ['spacemono', 'Space Mono', '"Space Mono",monospace', 'Mono', 1], ['fira', 'Fira Code', '"Fira Code",monospace', 'Mono', 1]
  ];
  const FCATS = ['All', 'Sans', 'Serif', 'Display', 'Script', 'Mono'];
  const F = id => FONTS.find(f => f[0] === id) || FONTS[3];
  const fontStack = id => (id === 'hf' ? 'var(--hf)' : id === 'bf' ? 'var(--bf)' : F(id)[2]);
  const PRESETS = [
    ['Midnight Orange', '#f2490f', '#161514', '#f0e9da', '#161514', '#e7dfcd'], ['Ocean Fresh', '#0e7490', '#f59e0b', '#f0f9ff', '#0c2d3a', '#dbeefa'],
    ['Forest Clean', '#2f855a', '#ecc94b', '#f4faf5', '#16301f', '#dcefe2'], ['Royal Gold', '#5b21b6', '#d4a017', '#faf7ff', '#1e1038', '#ece5fa'],
    ['Berry Pop', '#c026d3', '#fb7185', '#fff7fb', '#3b0a45', '#fbe6f3'], ['Night Neon', '#22d3ee', '#a3e635', '#0b1220', '#e6f1ff', '#131c30'],
    ['Sunset', '#ef4444', '#f59e0b', '#fff8f1', '#3a1410', '#ffe9d6'], ['Mint Medical', '#0d9488', '#38bdf8', '#f2fbfa', '#0b2b29', '#d9f2ee'],
    ['Mono Minimal', '#111827', '#6b7280', '#ffffff', '#111827', '#f3f4f6'], ['Earth Warm', '#b45309', '#365314', '#fbf6ee', '#2b1a0a', '#f0e2cc'],
    ['Rose Studio', '#be185d', '#7c3aed', '#fff1f5', '#3b0a24', '#fde0ea'], ['Slate Pro', '#2563eb', '#0f172a', '#f8fafc', '#0f172a', '#e8eef7']
  ];
  const TOK = { p: 'Primary', a: 'Accent', bg: 'Background', tx: 'Text', sf: 'Surface' };
  const ENTR = [['none', 'None'], ['fade', 'Fade'], ['up', 'Rise'], ['down', 'Drop'], ['left', 'From left'], ['right', 'From right'], ['zoom', 'Zoom in'], ['pop', 'Pop'], ['flip', 'Flip'], ['rotate', 'Twist'], ['bounce', 'Bounce'], ['blur', 'Blur in'], ['wipe', 'Wipe'], ['skew', 'Swoosh']];
  const LOOPS = [['float', 'Float'], ['pulse', 'Pulse'], ['wiggle', 'Wiggle'], ['glow', 'Glow']];
  const ANIMS = ENTR.concat(LOOPS), ENTR_SET = new Set(ENTR.slice(1).map(a => a[0]));
  const AN_LABEL = id => (ANIMS.find(a => a[0] === id) || [0, id])[1];
  const HOVERS = [['none', 'None'], ['lift', 'Lift'], ['grow', 'Grow'], ['glow', 'Glow'], ['tilt', 'Tilt'], ['shine', 'Shine']];
  const SECS = [['hero', 'Hero'], ['ticker', 'Scrolling strip'], ['about', 'About'], ['services', 'Services'], ['stats', 'Numbers'], ['gallery', 'Gallery'], ['quotes', 'Testimonials'], ['pricing', 'Pricing'], ['faq', 'FAQ'], ['contact', 'Contact form'], ['band', 'Call-to-action band']];

  /* element catalogue: key | label | type | section label */
  const CAT = ('nav|Menu bar|bar|Menu;logo|Logo / brand name|text|Menu;navLinks|Menu links|text|Menu;navBtn|Menu button|btn|Menu;' +
    'heroSec|Hero section|sec|Hero;heroTag|Small label|text|Hero;heroTitle|Main headline|text|Hero;heroSub|Sub headline|text|Hero;btn1|Main button|btn|Hero;btn2|Second button|btn|Hero;heroImg|Hero picture|art|Hero;shapes|Floating shapes|art|Hero;' +
    'ticker|Scrolling strip|bar|Strip;' +
    'aboutSec|About section|sec|About;aboutImg|About picture|art|About;aboutText|About text|text|About;aboutList|Checklist|text|About;aboutBtn|About button|btn|About;' +
    'servicesSec|Services section|sec|Services;cards|Service cards|box|Services;cardTitle|Card titles|text|Services;cardText|Card text|text|Services;' +
    'statsSec|Numbers section|sec|Numbers;stats|Number boxes|box|Numbers;' +
    'gallerySec|Gallery section|sec|Gallery;gallery|Gallery tiles|art|Gallery;' +
    'quotesSec|Testimonials section|sec|Testimonials;quotes|Testimonial cards|box|Testimonials;' +
    'pricingSec|Pricing section|sec|Pricing;pricing|Pricing cards|box|Pricing;planBtn|Plan buttons|btn|Pricing;' +
    'faqSec|FAQ section|sec|FAQ;faq|FAQ items|box|FAQ;' +
    'contactSec|Contact section|sec|Contact;form|Contact form box|box|Contact;inputs|Form fields|box|Contact;formBtn|Send button|btn|Contact;' +
    'band|Call-to-action band|sec|Band;bandTitle|Band title|text|Band;bandBtn|Band button|btn|Band;' +
    'headings|Section titles (all)|text|All sections;subheads|Section intros (all)|text|All sections;footer|Footer|bar|Footer')
    .split(';').map(s => s.split('|'));
  const CATD = {}; CAT.forEach(c => { CATD[c[0]] = c; });
  const CTRL = { text: 'color ff fs fw al cs ls an', btn: 'color bg ff fs fw cs ls rad pad sh bd an hv', box: 'color bg ff fs al rad pad sh bd an hv', sec: 'bg color al pad an', art: 'bg rad sh bd an hv', bar: 'bg color ff fs fw cs ls pad sh bd an' };
  const DEF_AN = new Set('heroTag heroTitle heroSub btn1 btn2 heroImg aboutImg aboutText aboutList aboutBtn cards stats gallery quotes pricing faq form bandTitle bandBtn headings subheads'.split(' '));
  const HOVERABLE = new Set('btn1 btn2 navBtn aboutBtn cards pricing quotes gallery stats planBtn formBtn bandBtn faq'.split(' '));
  const SPREAD = new Set(['headings', 'subheads', 'cardTitle', 'cardText', 'planBtn', 'inputs', 'shapes']);
  const TG = {}; CAT.forEach(c => { TG[c[0]] = $$('[data-el="' + c[0] + '"]', pv); });
  const DEF_T = {}; $$('[data-tx]', pv).forEach(n => { DEF_T[n.dataset.tx] = n.textContent.trim(); });

  const DEFAULT = {
    c: { p: '#f2490f', a: '#161514', bg: '#f0e9da', tx: '#161514', sf: '#e7dfcd' }, hf: 'montserrat', bf: 'inter', scale: 100, hc: 'none',
    r: 12, dk: 1, mw: 1100, hero: 'center', btn: 'solid', card: 'raised', nav: 'solid', bgp: 'none', gc: 3,
    anim: 'up', dur: 0.8, stag: 0.12, hover: 'lift', reveal: 'scroll', shapes: 1, par: 1, tspd: 3,
    off: [], order: SECS.map(s => s[0]), el: {}, t: {}, info: { who: '', biz: '', phone: '', notes: '' }
  };
  const clone = o => JSON.parse(JSON.stringify(o));
  let S = clone(DEFAULT), selKey = null;

  /* ============================== colour maths ============================== */
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgb2hex = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  const hsl2rgb = (h, s, l) => { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0) * 255, f(8) * 255, f(4) * 255]; };
  const rgb2hsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s * 100, l * 100]; };
  const lum = h => { const [r, g, b] = hex2rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const readable = bg => (ratio(bg, '#ffffff') >= ratio(bg, '#111111') ? '#ffffff' : '#111111');
  const hslHex = (h, s, l) => rgb2hex(...hsl2rgb(h, s, l));
  const validHex = v => /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.test(v);
  const norm = v => { v = v.replace('#', ''); if (v.length === 3) v = v.split('').map(c => c + c).join(''); return '#' + v.toLowerCase(); };
  const rc = v => (TOK[v] ? S.c[v] : v);   // token or hex → real colour
  const colName = v => (TOK[v] ? TOK[v] : v === 'none' ? 'transparent' : v);

  /* ============================== state: save, undo, share ============================== */
  const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
  function merge(src) {
    const o = clone(DEFAULT); if (!src || typeof src !== 'object') return o;
    Object.keys(DEFAULT).forEach(k => { if (src[k] === undefined) return; if (k === 'c' || k === 'info') o[k] = Object.assign(o[k], src[k]); else if (k === 'el' || k === 't') o[k] = src[k] || {}; else o[k] = src[k]; });
    const known = SECS.map(s => s[0]); o.order = (o.order || []).filter(k => known.includes(k)); known.forEach(k => { if (!o.order.includes(k)) o.order.push(k); });
    o.off = (o.off || []).filter(k => known.includes(k)); return o;
  }
  let hist = [], hi = -1, saveT;
  const undoB = $('#undo'), redoB = $('#redo');
  function histUI() { undoB.disabled = hi <= 0; redoB.disabled = hi >= hist.length - 1; }
  function commit() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      const j = JSON.stringify(S); try { localStorage.setItem(KEY, j); } catch (e) { /* private mode */ }
      if (hist[hi] !== j) { hist = hist.slice(0, hi + 1); hist.push(j); if (hist.length > 80) hist.shift(); hi = hist.length - 1; }
      histUI(); briefUI();
    }, 320);
  }
  function jump(d) { clearTimeout(saveT); const n = hi + d; if (n < 0 || n >= hist.length) return; hi = n; S = merge(JSON.parse(hist[hi])); refreshAll(); try { localStorage.setItem(KEY, hist[hi]); } catch (e) { /* ignore */ } histUI(); }
  undoB.addEventListener('click', () => { flushNow(); jump(-1); }); redoB.addEventListener('click', () => jump(1));
  function flushNow() { if (saveT) { clearTimeout(saveT); const j = JSON.stringify(S); if (hist[hi] !== j) { hist = hist.slice(0, hi + 1); hist.push(j); hi = hist.length - 1; } histUI(); } }
  const shareUrl = () => location.href.split('#')[0] + '#d=' + enc(S);

  /* ============================== small UI factories ============================== */
  const regs = {};            // pane name → [sync fns]
  const reg = n => (regs[n] = regs[n] || []);
  function upd(fn, opts) { fn(); render(opts); Object.values(regs).forEach(a => a.forEach(f => f())); commit(); }
  function Seg(r, title, opts, get, set) {
    const w = mk('div', 'pf'); if (title) w.append(mk('div', 'pf__t', title)); const s = mk('div', 'seg');
    opts.forEach(([v, l]) => { const b = mk('button', null, l); b.type = 'button'; b.dataset.v = v; b.addEventListener('click', () => set(v)); s.append(b); }); w.append(s);
    r.push(() => $$('button', s).forEach(b => b.classList.toggle('on', String(b.dataset.v) === String(get())))); return w;
  }
  function Rng(r, title, min, max, step, get, set, fmt, isDef) {
    const w = mk('label', 'pf'), t = mk('div', 'pf__t', '<span>' + title + '</span><b></b>'), i = mk('input'); i.type = 'range'; i.min = min; i.max = max; i.step = step;
    i.addEventListener('input', () => set(+i.value)); w.append(t, i);
    r.push(() => { const v = get(); i.value = v; t.lastChild.textContent = (fmt ? fmt(v) : v) + (isDef && isDef() ? ' · default' : ''); }); return w;
  }
  function Tgl(r, title, get, set) {
    const w = mk('div', 'pf pf--row'), b = mk('button', 'sw'); b.type = 'button'; b.setAttribute('role', 'switch'); b.setAttribute('aria-label', title);
    w.append(mk('span', null, '<b style="font-size:.7rem">' + title + '</b>'), b); b.addEventListener('click', () => set(!get()));
    r.push(() => { b.classList.toggle('on', !!get()); b.setAttribute('aria-checked', !!get()); }); return w;
  }
  const H2 = t => mk('h2', null, t);
  const toast = (() => { const t = $('#toast'); let h; return m => { t.textContent = m; t.classList.add('show'); clearTimeout(h); h = setTimeout(() => t.classList.remove('show'), 2400); }; })();

  /* ============================== tabs ============================== */
  const TABS = [['colors', 'Colours'], ['fonts', 'Fonts'], ['element', 'Element'], ['motion', 'Motion'], ['layout', 'Layout'], ['content', 'Content'], ['send', 'Send']];
  const panes = {};
  TABS.forEach(([k, l]) => {
    const b = mk('button', 'tab', l); b.type = 'button'; b.dataset.k = k; b.setAttribute('role', 'tab'); b.addEventListener('click', () => showTab(k)); tabsEl.append(b);
    const p = mk('section', 'pane'); p.id = 'pane-' + k; p.hidden = true; body.append(p); panes[k] = p;
  });
  function showTab(k) {
    $$('.tab', tabsEl).forEach(b => { const on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); if (on) b.scrollIntoView({ inline: 'center', block: 'nearest' }); });
    Object.keys(panes).forEach(n => { panes[n].hidden = n !== k; }); body.scrollTop = 0; if (k === 'colors') requestAnimationFrame(drawMap);
  }

  /* ============================== COLOURS pane ============================== */
  let role = 'p', sat = 85, cv, ctx, loupe;
  function buildColors() {
    const P = panes.colors, r = reg('colors'); P.append(H2('Colours'));
    P.append(mk('p', 'note', 'Pick a ready palette, or choose every colour yourself from thousands of shades.'));
    const pr = mk('div'); pr.append(mk('div', 'sub', 'Start from a palette')); const pg = mk('div', 'presets');
    PRESETS.forEach((p, i) => {
      const b = mk('button', 'preset'); b.type = 'button'; const st = mk('i'); p.slice(1).forEach(c => { const s = mk('b'); s.style.background = c; st.append(s); }); b.append(st, mk('span', null, p[0]));
      b.addEventListener('click', () => upd(() => { [S.c.p, S.c.a, S.c.bg, S.c.tx, S.c.sf] = p.slice(1); })); pg.append(b);
      r.push(() => b.classList.toggle('on', p.slice(1).join() === [S.c.p, S.c.a, S.c.bg, S.c.tx, S.c.sf].join()));
    }); pr.append(pg); P.append(pr);

    const ro = mk('div'); ro.append(mk('div', 'sub', 'Choose what to colour')); const rg = mk('div', 'roles');
    Object.keys(TOK).forEach(k => {
      const b = mk('button', 'role', '<i></i><span>' + TOK[k] + '</span>'); b.type = 'button'; b.addEventListener('click', () => { role = k; Object.values(regs).forEach(a => a.forEach(f => f())); }); rg.append(b);
      r.push(() => { b.classList.toggle('on', role === k); b.firstChild.style.background = S.c[k]; });
    }); ro.append(rg); P.append(ro);

    const mp = mk('div'); mp.append(mk('div', 'sub', 'Colour map <small>36,000+ shades · click or drag</small>'));
    const mw = mk('div', 'map'); cv = mk('canvas'); cv.setAttribute('aria-label', 'Colour map: hue across, lightness down'); loupe = mk('div', 'map__loupe', '<i></i><span></span>'); loupe.hidden = true; mw.append(cv, loupe); mp.append(mw); P.append(mp);
    ctx = cv.getContext('2d');
    let drag = false;
    const pick = (e, set) => { const b = cv.getBoundingClientRect(), x = clamp(e.clientX - b.left, 0, b.width - 1), y = clamp(e.clientY - b.top, 0, b.height - 1), c = hslHex((x / b.width) * 360, sat, 96 - (y / b.height) * 90); loupe.hidden = false; loupe.style.left = x + 'px'; loupe.style.top = y + 'px'; loupe.firstChild.style.background = c; loupe.lastChild.textContent = c; if (set) upd(() => { S.c[role] = c; }); };
    cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); pick(e, true); });
    cv.addEventListener('pointermove', e => pick(e, drag)); cv.addEventListener('pointerup', () => { drag = false; }); cv.addEventListener('pointerleave', () => { if (!drag) loupe.hidden = true; });
    P.append(Rng(r, 'Saturation', 0, 100, 1, () => sat, v => { sat = v; drawMap(); Object.values(regs).forEach(a => a.forEach(f => f())); }, v => v + '%'));

    const hx = mk('div', 'hexrow'); const hl = mk('label', 'pf', '<div class="pf__t">Hex code</div>'), hi2 = mk('input'); hi2.type = 'text'; hi2.maxLength = 7; hi2.spellcheck = false; hi2.autocomplete = 'off'; hl.append(hi2);
    const nl = mk('label', 'pf', '<div class="pf__t">Pick</div>'), ni = mk('input'); ni.type = 'color'; ni.setAttribute('aria-label', 'System colour picker'); nl.append(ni); hx.append(hl, nl); P.append(hx);
    hi2.addEventListener('input', () => { if (validHex(hi2.value)) upd(() => { S.c[role] = norm(hi2.value); }); }); ni.addEventListener('input', () => upd(() => { S.c[role] = ni.value.toLowerCase(); }));
    r.push(() => { if (document.activeElement !== hi2) hi2.value = S.c[role]; ni.value = S.c[role]; });

    const qi = mk('div'); qi.append(mk('div', 'sub', 'Quick ideas')); const ch = mk('div', 'chips');
    [['comp', 'Complementary accent'], ['ana', 'Analogous accent'], ['tri', 'Triad accent'], ['rand', 'Random palette'], ['dark', 'Dark version'], ['light', 'Light version']].forEach(([t, l]) => {
      const b = mk('button', null, l); b.type = 'button'; b.addEventListener('click', () => upd(() => {
        const [h, s] = rgb2hsl(...hex2rgb(S.c.p));
        if (t === 'comp') S.c.a = hslHex(h + 180, s, 48); else if (t === 'ana') S.c.a = hslHex(h + 32, s, 48); else if (t === 'tri') S.c.a = hslHex(h + 120, s, 48);
        else if (t === 'rand') { const H = Math.random() * 360; S.c = { p: hslHex(H, 70, 46), a: hslHex(H + 140 + Math.random() * 60, 68, 52), bg: hslHex(H, 40, 96), tx: hslHex(H, 40, 11), sf: hslHex(H, 34, 90) }; }
        else if (t === 'dark') { S.c.bg = hslHex(h, 32, 8); S.c.tx = hslHex(h, 20, 94); S.c.sf = hslHex(h, 28, 14); S.c.p = hslHex(h, Math.max(60, s), 58); }
        else { S.c.bg = hslHex(h, 40, 96); S.c.tx = hslHex(h, 40, 11); S.c.sf = hslHex(h, 34, 90); S.c.p = hslHex(h, Math.max(60, s), 46); }
      })); ch.append(b);
    }); qi.append(ch); P.append(qi);
    const ct = mk('div', 'contrast'); P.append(ct);
    r.push(() => {
      const grade = x => (x >= 7 ? ['AAA', 'good'] : x >= 4.5 ? ['AA', 'good'] : x >= 3 ? ['Large text only', 'ok'] : ['Low', 'bad']);
      const r1 = ratio(S.c.tx, S.c.bg), r2 = ratio(readable(S.c.p), S.c.p), g1 = grade(r1), g2 = grade(r2);
      ct.innerHTML = '<span>Text on background</span><b>' + r1.toFixed(1) + ':1</b><em class="' + g1[1] + '">' + g1[0] + '</em><span>· Buttons</span><b>' + r2.toFixed(1) + ':1</b><em class="' + g2[1] + '">' + g2[0] + '</em>';
    });
  }
  function drawMap() {
    if (!cv) return; const b = cv.getBoundingClientRect(); if (b.width < 20) return;
    const w = Math.round(b.width), h = Math.round(b.height); cv.width = w; cv.height = h; const img = ctx.createImageData(w, h);
    for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) { const [a, g, bb] = hsl2rgb((x / w) * 360, sat, 96 - (y / h) * 90), i = (y * w + x) * 4; img.data[i] = a; img.data[i + 1] = g; img.data[i + 2] = bb; img.data[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
  }
  addEventListener('resize', () => requestAnimationFrame(drawMap));

  /* ============================== FONTS pane ============================== */
  let fTarget = 'hf', fCat = 'All';
  function buildFonts() {
    const P = panes.fonts, r = reg('fonts'); P.append(H2('Fonts'));
    P.append(mk('p', 'note', '19 fonts. Choose one for headings and one for body text. You can also set a different font on any single element.'));
    P.append(Seg(r, 'Change the font for', [['hf', 'Headings'], ['bf', 'Body text']], () => fTarget, v => { fTarget = v; Object.values(regs).forEach(a => a.forEach(f => f())); }));
    P.append(Seg(r, 'Style', FCATS.map(c => [c, c]), () => fCat, v => { fCat = v; fillFonts(); Object.values(regs).forEach(a => a.forEach(f => f())); }));
    const g = mk('div', 'fgrid'); P.append(g);
    function fillFonts() { g.innerHTML = ''; FONTS.filter(f => fCat === 'All' || f[3] === fCat).forEach(f => { const b = mk('button', 'fcard'); b.type = 'button'; b.dataset.id = f[0]; b.innerHTML = '<b style="font-family:' + f[2] + '">' + f[1] + '</b><small style="font-family:' + f[2] + '">The quick brown fox · 123</small>'; b.addEventListener('click', () => upd(() => { S[fTarget] = f[0]; })); g.append(b); }); }
    fillFonts();
    r.push(() => $$('.fcard', g).forEach(b => b.classList.toggle('on', b.dataset.id === S[fTarget])));
    P.append(Rng(r, 'Text size', 80, 130, 1, () => S.scale, v => upd(() => { S.scale = v; }), v => v + '%'));
    P.append(Seg(r, 'Headings', [['none', 'Normal case'], ['upper', 'UPPERCASE']], () => S.hc, v => upd(() => { S.hc = v; })));
    const pvw = mk('div', 'grp'); pvw.style.padding = '1rem'; pvw.innerHTML = '<div class="sub">Your pairing</div><div id="fpv"></div>'; P.append(pvw);
    r.push(() => { const h = F(S.hf), b = F(S.bf); $('#fpv', pvw).innerHTML = '<div style="font-family:' + h[2] + ';font-weight:' + (h[4] ? 700 : 400) + ';font-size:1.6rem;line-height:1.1;text-transform:' + (S.hc === 'upper' ? 'uppercase' : 'none') + '">Headline in ' + h[1] + '</div><p style="font-family:' + b[2] + ';margin-top:.5rem;font-size:.9rem">Body text in ' + b[1] + '. Clear, easy to read on every screen.</p>'; });
  }

  /* ============================== ELEMENT inspector ============================== */
  const insp = () => panes.element;
  let ir = [];
  const getO = () => S.el[selKey] || {};
  function setEl(p, v, replay) {
    upd(() => { const o = S.el[selKey] = S.el[selKey] || {}; if (v === '' || v == null) delete o[p]; else o[p] = v; if (!Object.keys(o).length) delete S.el[selKey]; }, replay ? { replay: [selKey] } : null);
  }
  function ColorField(title, prop, withNone) {
    const w = mk('div', 'pf'); w.append(mk('div', 'pf__t', title)); const s = mk('div', 'sws');
    const defs = ['p', 'a', 'bg', 'tx', 'sf', '#ffffff', '#000000'], btns = [];
    defs.forEach(v => { const b = mk('button'); b.type = 'button'; b.title = TOK[v] || v; b.dataset.v = v; b.addEventListener('click', () => setEl(prop, v)); s.append(b); btns.push(b); });
    const ci = mk('input'); ci.type = 'color'; ci.setAttribute('aria-label', title + ' custom colour'); ci.addEventListener('input', () => setEl(prop, ci.value.toLowerCase())); s.append(ci);
    if (withNone) { const n = mk('button', 'clr', 'None'); n.type = 'button'; n.addEventListener('click', () => setEl(prop, 'none')); s.append(n); btns.push(n); n.dataset.v = 'none'; }
    const d = mk('button', 'clr', 'Default'); d.type = 'button'; d.addEventListener('click', () => setEl(prop, '')); s.append(d); w.append(s);
    ir.push(() => { const v = getO()[prop]; btns.forEach(b => { b.classList.toggle('on', b.dataset.v === v); if (TOK[b.dataset.v] || /^#/.test(b.dataset.v)) b.style.background = rc(b.dataset.v); }); ci.value = v && v !== 'none' && validHex(rc(v)) ? rc(v) : '#888888'; d.classList.toggle('on', !v); });
    return w;
  }
  function OSeg(title, prop, opts, replay) {
    return Seg(ir, title, [['', 'Default']].concat(opts), () => getO()[prop] || '', v => setEl(prop, v, replay));
  }
  function ORng(title, prop, min, max, step, dflt, fmt, replay) {
    return Rng(ir, title, min, max, step, () => (getO()[prop] != null ? getO()[prop] : dflt()), v => setEl(prop, v, replay), fmt, () => getO()[prop] == null);
  }
  function buildInspect() {
    const P = insp(); P.innerHTML = ''; ir = []; regs.element = ir; P.append(H2('Element'));
    const sel = mk('select'); sel.setAttribute('aria-label', 'Choose an element'); sel.innerHTML = '<option value="">Choose an element…</option>';
    const groups = {}; CAT.forEach(c => { (groups[c[3]] = groups[c[3]] || []).push(c); });
    Object.keys(groups).forEach(g => { const og = mk('optgroup'); og.label = g; groups[g].forEach(c => { const o = mk('option'); o.value = c[0]; o.textContent = c[1]; og.append(o); }); sel.append(og); });
    sel.value = selKey || ''; sel.addEventListener('change', () => select(sel.value || null, true));
    const sw = mk('label', 'pf'); sw.append(mk('div', 'pf__t', 'Pick from the list, or click anything in the preview'), sel); P.append(sw);
    if (!selKey) { P.append(mk('div', 'empty', '<b>Nothing selected</b>Click any text, button, box, picture or section in the preview to change its colours, font, size, corners, shadow and animation.')); return; }
    const c = CATD[selKey], T = TG[selKey], o0 = getO(), ctr = CTRL[c[2]].split(' ');
    const head = mk('div', 'insp__head'); head.innerHTML = '<div><b>' + c[1] + '</b><small>' + (T.length > 1 ? T.length + ' items change together' : c[2] === 'sec' ? 'Whole section' : 'Single element') + '</small></div>';
    const hb = mk('div', 'btnrow'); hb.style.flex = 'none';
    const par = T[0].parentElement && T[0].parentElement.closest('[data-el]');
    if (par) { const b = mk('button', null, 'Parent'); b.type = 'button'; b.title = 'Select the box around this'; b.addEventListener('click', () => select(par.dataset.el, true)); hb.append(b); }
    const rs = mk('button', null, 'Reset'); rs.type = 'button'; rs.addEventListener('click', () => upd(() => { delete S.el[selKey]; }, { replay: [selKey] })); hb.append(rs); head.append(hb); P.append(head);
    const dis = Tgl(ir, 'Hide this element', () => !!getO().hide, v => setEl('hide', v ? 1 : '')); P.append(dis);
    const has = x => ctr.includes(x);
    const grp = (title, open, items) => { const items2 = items.filter(Boolean); if (!items2.length) return; const d = mk('details', 'grp'); d.open = open; d.append(mk('summary', null, title)); const dv = mk('div'); items2.forEach(i => dv.append(i)); d.append(dv); P.append(d); };

    // text edit (single element with its own text)
    const tn = T.length === 1 && T[0].dataset.tx ? T[0] : null;
    if (tn) { const k = tn.dataset.tx, long = tn.dataset.long, w = mk('label', 'pf'), i = mk(long ? 'textarea' : 'input'); if (!long) i.type = 'text'; w.append(mk('div', 'pf__t', 'Text'), i); i.addEventListener('input', () => { S.t[k] = i.value; if (i.value === DEF_T[k]) delete S.t[k]; render(); commit(); }); ir.push(() => { if (document.activeElement !== i) i.value = S.t[k] != null ? S.t[k] : DEF_T[k]; }); P.append(w); }
    else if (T.length > 1 && T.some(n => n.dataset.tx)) P.append(mk('p', 'note', 'These items each have their own words. Edit them in the Content tab.'));

    grp('Colours', true, [has('color') && ColorField(c[2] === 'btn' ? 'Text colour' : 'Text colour', 'color'), has('bg') && ColorField('Background', 'bg', true)]);
    grp('Text style', c[2] === 'text', [
      has('ff') && (() => { const w = mk('label', 'pf'), s = mk('select'); w.append(mk('div', 'pf__t', 'Font'), s); s.innerHTML = '<option value="">Default</option><option value="hf">Same as headings</option><option value="bf">Same as body text</option>' + FCATS.slice(1).map(cat => '<optgroup label="' + cat + '">' + FONTS.filter(f => f[3] === cat).map(f => '<option value="' + f[0] + '">' + f[1] + '</option>').join('') + '</optgroup>').join(''); s.addEventListener('change', () => setEl('ff', s.value)); ir.push(() => { s.value = getO().ff || ''; }); return w; })(),
      has('fs') && ORng('Size', 'fs', 50, 260, 1, () => 100, v => v + '%'),
      has('fw') && OSeg('Weight', 'fw', [['400', 'Regular'], ['700', 'Bold']]),
      has('al') && OSeg('Align', 'al', [['left', 'Left'], ['center', 'Centre'], ['right', 'Right']]),
      has('cs') && OSeg('Letters', 'cs', [['none', 'Normal'], ['uppercase', 'UPPER'], ['capitalize', 'Capitalised']]),
      has('ls') && ORng('Letter spacing', 'ls', -2, 16, 0.5, () => 0, v => v + 'px')
    ]);
    grp('Box', c[2] !== 'text', [
      has('rad') && ORng('Corner roundness', 'rad', 0, 60, 1, () => S.r, v => v + 'px'),
      has('pad') && ORng('Inner space', 'pad', 30, 280, 1, () => 100, v => v + '%'),
      has('sh') && OSeg('Shadow', 'sh', [['none', 'None'], ['soft', 'Soft'], ['hard', 'Hard'], ['glow', 'Glow']]),
      has('bd') && OSeg('Border', 'bd', [['none', 'None'], ['thin', 'Thin'], ['bold', 'Bold'], ['dash', 'Dashed']])
    ]);
    if (has('an')) {
      const d = mk('details', 'grp'); d.open = true; d.append(mk('summary', null, 'Animation & hover')); const dv = mk('div'); d.append(dv);
      const cur = () => (getO().an != null ? getO().an : DEF_AN.has(selKey) ? S.anim : 'none');
      const ag = mk('div', 'anims'), btns = [];
      ANIMS.forEach(([id, l]) => { const b = mk('button', 'anim', '<span class="ademo"><i data-a="' + id + '"></i></span>' + l); b.type = 'button'; b.dataset.id = id; b.addEventListener('click', () => setEl('an', id, true)); ag.append(b); btns.push(b); });
      ir.push(() => btns.forEach(b => b.classList.toggle('on', b.dataset.id === cur())));
      dv.append(mk('div', 'pf__t', 'Animation for this element'), ag);
      dv.append(ORng('Speed (seconds)', 'dur', 0.2, 2.5, 0.05, () => S.dur, v => v + 's', true));
      dv.append(ORng('Start delay (seconds)', 'dl', 0, 3, 0.05, () => 0, v => v + 's', true));
      if (has('hv')) dv.append(OSeg('When the mouse is over it', 'hv', HOVERS));
      const pl = mk('button', 'btnx btnx--ghost', 'Play animation'); pl.type = 'button'; pl.addEventListener('click', () => { replay([selKey]); T[0].scrollIntoView({ block: 'center', behavior: 'smooth' }); }); dv.append(pl);
      P.append(d);
    }
    ir.forEach(f => f());
  }
  function select(key, scroll) {
    selKey = key; $$('[data-sel]', pv).forEach(n => n.removeAttribute('data-sel')); if (key) TG[key].forEach(n => { n.dataset.sel = '1'; });
    buildInspect(); showTab('element'); if (key && scroll) { const n = TG[key].find(x => x.offsetParent !== null); if (n) n.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }

  /* ============================== MOTION pane ============================== */
  function buildMotion() {
    const P = panes.motion, r = reg('motion'); P.append(H2('Motion'));
    P.append(mk('p', 'note', 'This is the default animation for the whole site. To animate one thing differently, click it in the preview and use its Animation section.'));
    P.append(mk('div', 'sub', 'Entrance animation'));
    const g = mk('div', 'anims'), bs = [];
    ANIMS.forEach(([id, l]) => { const b = mk('button', 'anim', '<span class="ademo"><i data-a="' + id + '"></i></span>' + l); b.type = 'button'; b.dataset.id = id; b.addEventListener('click', () => upd(() => { S.anim = id; }, { replayAll: true })); g.append(b); bs.push(b); });
    r.push(() => bs.forEach(b => b.classList.toggle('on', b.dataset.id === S.anim))); P.append(g);
    P.append(Rng(r, 'Animation speed', 0.2, 2.5, 0.05, () => S.dur, v => upd(() => { S.dur = v; }, { replayAll: true }), v => v + 's'));
    P.append(Rng(r, 'Delay between items', 0, 0.6, 0.02, () => S.stag, v => upd(() => { S.stag = v; }, { replayAll: true }), v => v + 's'));
    P.append(Seg(r, 'Mouse-over effect for buttons and cards', HOVERS, () => S.hover, v => upd(() => { S.hover = v; })));
    P.append(Seg(r, 'When do things animate?', [['scroll', 'As you scroll to them'], ['load', 'All at once on load']], () => S.reveal, v => upd(() => { S.reveal = v; }, { replayAll: true })));
    P.append(Tgl(r, 'Floating background shapes', () => !!S.shapes, v => upd(() => { S.shapes = v ? 1 : 0; })));
    P.append(Tgl(r, 'Parallax (shapes move as you scroll)', () => !!S.par, v => upd(() => { S.par = v ? 1 : 0; })));
    P.append(Rng(r, 'Scrolling strip speed', 1, 10, 1, () => S.tspd, v => upd(() => { S.tspd = v; }), v => v + ' / 10'));
    const b = mk('button', 'btnx', 'Replay all animations'); b.type = 'button'; b.addEventListener('click', () => replay()); P.append(b);
  }

  /* ============================== LAYOUT pane ============================== */
  function buildLayout() {
    const P = panes.layout, r = reg('layout'); P.append(H2('Layout'));
    const set = (k, v) => upd(() => { S[k] = v; });
    P.append(Seg(r, 'Hero (top) layout', [['center', 'Centred'], ['left', 'Left'], ['split', 'Text + picture']], () => S.hero, v => set('hero', v)));
    P.append(Seg(r, 'Menu bar', [['solid', 'Solid'], ['glass', 'Glass'], ['dark', 'Dark'], ['centered', 'Centred']], () => S.nav, v => set('nav', v)));
    P.append(Seg(r, 'Button style', [['solid', 'Solid'], ['outline', 'Outline'], ['pill', 'Pill'], ['soft', 'Soft'], ['gradient', 'Gradient'], ['brutal', 'Bold']], () => S.btn, v => set('btn', v)));
    P.append(Seg(r, 'Card style', [['raised', 'Raised'], ['flat', 'Flat'], ['outlined', 'Outlined'], ['glass', 'Glass'], ['brutal', 'Bold']], () => S.card, v => set('card', v)));
    P.append(Rng(r, 'Corner roundness', 0, 40, 1, () => S.r, v => set('r', v), v => v + 'px'));
    P.append(Seg(r, 'Spacing', [[0.7, 'Compact'], [1, 'Normal'], [1.35, 'Airy']], () => S.dk, v => set('dk', v)));
    P.append(Seg(r, 'Page width', [[900, 'Narrow'], [1100, 'Normal'], [1300, 'Wide']], () => S.mw, v => set('mw', v)));
    P.append(Seg(r, 'Page background', [['none', 'Plain'], ['dots', 'Dots'], ['grid', 'Grid'], ['stripes', 'Stripes'], ['glow', 'Glow']], () => S.bgp, v => set('bgp', v)));
    P.append(Seg(r, 'Gallery columns', [[2, '2'], [3, '3'], [4, '4']], () => S.gc, v => set('gc', v)));
    P.append(mk('div', 'sub', 'Sections <small>switch on or off, and reorder</small>'));
    const ul = mk('ul', 'slist'); P.append(ul);
    r.push(() => {
      ul.innerHTML = '';
      S.order.forEach((k, i) => {
        const lab = SECS.find(s => s[0] === k)[1], off = S.off.includes(k), li = mk('li', off ? 'off' : '');
        const sw = mk('button', 'sw' + (off ? '' : ' on')); sw.type = 'button'; sw.setAttribute('role', 'switch'); sw.setAttribute('aria-checked', !off); sw.setAttribute('aria-label', 'Show ' + lab); sw.addEventListener('click', () => upd(() => { S.off = off ? S.off.filter(x => x !== k) : S.off.concat(k); }));
        const up = mk('button', 'mv', '↑'), dn = mk('button', 'mv', '↓'); up.type = dn.type = 'button'; up.disabled = i === 0; dn.disabled = i === S.order.length - 1; up.setAttribute('aria-label', 'Move ' + lab + ' up'); dn.setAttribute('aria-label', 'Move ' + lab + ' down');
        const mv = d => upd(() => { const a = S.order, j = i + d;[a[i], a[j]] = [a[j], a[i]]; }); up.addEventListener('click', () => mv(-1)); dn.addEventListener('click', () => mv(1));
        li.append(sw, mk('span', null, lab), up, dn); ul.append(li);
      });
    });
  }

  /* ============================== CONTENT pane ============================== */
  function buildContent() {
    const P = panes.content, r = reg('content'); P.append(H2('Content'));
    P.append(mk('p', 'note', 'Change any words on the sample site. Your business name, headlines, prices, everything.'));
    const bySec = {}, order = [];
    $$('[data-tx]', pv).forEach(n => { const s = (n.closest('[data-sec]') || {}).dataset; const lab = s ? s.slabel : 'Other'; if (!bySec[lab]) { bySec[lab] = []; order.push(lab); } bySec[lab].push(n); });
    order.forEach((lab, gi) => {
      const d = mk('details', 'grp'); d.open = gi === 1; d.append(mk('summary', null, lab)); const dv = mk('div'); d.append(dv);
      bySec[lab].forEach(n => {
        const k = n.dataset.tx, long = n.dataset.long, w = mk('label', 'pf'), i = mk(long ? 'textarea' : 'input'); if (!long) i.type = 'text'; else i.rows = 2;
        w.append(mk('div', 'pf__t', n.dataset.lb), i); i.addEventListener('input', () => { S.t[k] = i.value; if (i.value === DEF_T[k]) delete S.t[k]; render(); commit(); });
        r.push(() => { if (document.activeElement !== i) i.value = S.t[k] != null ? S.t[k] : DEF_T[k]; }); dv.append(w);
      }); P.append(d);
    });
    const b = mk('button', 'btnx btnx--ghost', 'Reset all text'); b.type = 'button'; b.addEventListener('click', () => upd(() => { S.t = {}; })); P.append(b);
  }

  /* ============================== BRIEF + SEND ============================== */
  const OL = { color: 'text colour', bg: 'background', ff: 'font', fs: 'size', fw: 'weight', al: 'align', cs: 'letters', ls: 'letter spacing', rad: 'corners', pad: 'inner space', sh: 'shadow', bd: 'border', an: 'animation', dur: 'speed', dl: 'delay', hv: 'hover', hide: 'hidden' };
  function elWords(o) {
    return Object.keys(o).map(p => {
      const v = o[p]; let t = v;
      if (p === 'color' || p === 'bg') t = colName(v) + (TOK[v] ? ' (' + rc(v) + ')' : ''); else if (p === 'ff') t = v === 'hf' ? 'heading font' : v === 'bf' ? 'body font' : F(v)[1]; else if (p === 'fs' || p === 'pad') t = v + '%';
      else if (p === 'rad' || p === 'ls') t = v + 'px'; else if (p === 'dur' || p === 'dl') t = v + 's'; else if (p === 'an') t = AN_LABEL(v); else if (p === 'hide') t = 'yes'; else if (p === 'fw') t = v === '700' ? 'bold' : 'regular';
      return OL[p] + ' ' + t;
    }).join(', ');
  }
  function briefText(full) {
    const i = S.info, c = S.c, L = [];
    L.push('New website design brief (from Tehseen Hamid Design Studio)'); if (i.who) L.push('Name: ' + i.who); if (i.biz) L.push('Business: ' + i.biz); if (i.phone) L.push('My WhatsApp: ' + i.phone);
    L.push('', 'COLOURS', 'Primary ' + c.p + ' · Accent ' + c.a + ' · Background ' + c.bg + ' · Text ' + c.tx + ' · Surface ' + c.sf);
    L.push('', 'FONTS', 'Headings: ' + F(S.hf)[1] + ' · Body: ' + F(S.bf)[1] + ' · Text size ' + S.scale + '%' + (S.hc === 'upper' ? ' · Uppercase headings' : ''));
    const dn = { 0.7: 'compact', 1: 'normal', 1.35: 'airy' }[S.dk] || S.dk;
    L.push('', 'STYLE', 'Hero: ' + S.hero + ' · Menu: ' + S.nav + ' · Buttons: ' + S.btn + ' · Cards: ' + S.card + ' · Corners ' + S.r + 'px · Spacing ' + dn + ' · Width ' + S.mw + 'px · Background ' + (S.bgp === 'none' ? 'plain' : S.bgp));
    L.push('', 'MOTION', 'Animation: ' + AN_LABEL(S.anim) + ' (' + S.dur + 's) · Mouse-over: ' + S.hover + ' · Floating shapes ' + (S.shapes ? 'on' : 'off') + ' · Parallax ' + (S.par ? 'on' : 'off') + ' · Animate ' + (S.reveal === 'scroll' ? 'on scroll' : 'on load'));
    L.push('', 'SECTIONS (top to bottom)', S.order.filter(k => !S.off.includes(k)).map(k => SECS.find(s => s[0] === k)[1]).join(' → ') + (S.off.length ? '\nLeft out: ' + S.off.map(k => SECS.find(s => s[0] === k)[1]).join(', ') : ''));
    const els = Object.keys(S.el);
    if (els.length) { L.push('', 'CHANGED ELEMENTS (' + els.length + ')'); els.slice(0, full ? 99 : 6).forEach(k => L.push('- ' + CATD[k][1] + ': ' + elWords(S.el[k]))); if (!full && els.length > 6) L.push('- …and ' + (els.length - 6) + ' more (see the link)'); }
    const ts = Object.keys(S.t);
    if (ts.length) { L.push('', 'MY TEXT'); const lab = {}; $$('[data-tx]', pv).forEach(n => { lab[n.dataset.tx] = n.dataset.lb; }); ts.slice(0, full ? 99 : 5).forEach(k => L.push('- ' + (lab[k] || k) + ': "' + String(S.t[k]).slice(0, full ? 140 : 60) + '"')); if (!full && ts.length > 5) L.push('- …and ' + (ts.length - 5) + ' more (see the link)'); }
    if (i.notes) L.push('', 'NOTES', i.notes);
    L.push('', 'Open my exact design: ' + shareUrl());
    return L.join('\n');
  }
  function waLink() { let t = briefText(true); if (encodeURIComponent(t).length > 3800) t = briefText(false); return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); }
  function mailLink() { return 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Website design brief' + (S.info.biz ? ' · ' + S.info.biz : '')) + '&body=' + encodeURIComponent(briefText(true)); }
  let sumEl, waB, mailB;
  function briefUI() {
    if (!sumEl) return; const sw = c => '<i style="background:' + c + '"></i>';
    sumEl.innerHTML = Object.keys(TOK).map(k => '<li><span>' + TOK[k] + '</span><b>' + sw(S.c[k]) + S.c[k] + '</b></li>').join('') +
      '<li><span>Fonts</span><b>' + F(S.hf)[1] + ' / ' + F(S.bf)[1] + '</b></li><li><span>Animation</span><b>' + AN_LABEL(S.anim) + '</b></li><li><span>Sections</span><b>' + (SECS.length - S.off.length) + ' of ' + SECS.length + '</b></li>' +
      '<li><span>Elements customised</span><b>' + Object.keys(S.el).length + '</b></li><li><span>Texts changed</span><b>' + Object.keys(S.t).length + '</b></li>';
    waB.href = waLink(); mailB.href = mailLink();
  }
  function buildSend() {
    const P = panes.send, r = reg('send'); P.append(H2('Send to Tehseen'));
    P.append(mk('p', 'note', 'Happy with your design? Send it to me and I will build it. Your exact design opens from the link in the message.'));
    const fields = [['who', 'Your name', 'text'], ['biz', 'Business or website name', 'text'], ['phone', 'Your WhatsApp number (optional)', 'text']];
    fields.forEach(([k, l]) => { const w = mk('label', 'pf'), i = mk('input'); i.type = 'text'; i.autocomplete = k === 'who' ? 'name' : 'off'; w.append(mk('div', 'pf__t', l), i); i.addEventListener('input', () => { S.info[k] = i.value; commit(); briefUI(); }); r.push(() => { if (document.activeElement !== i) i.value = S.info[k] || ''; }); P.append(w); });
    const nw = mk('label', 'pf'), ni = mk('textarea'); ni.rows = 3; ni.placeholder = 'Type of business, pages you need, websites you like…'; nw.append(mk('div', 'pf__t', 'Anything else I should know?'), ni); ni.addEventListener('input', () => { S.info.notes = ni.value; commit(); briefUI(); }); r.push(() => { if (document.activeElement !== ni) ni.value = S.info.notes || ''; }); P.append(nw);
    sumEl = mk('ul', 'summary'); P.append(sumEl);
    const row = mk('div', 'btnrow');
    waB = mk('a', 'btnx btnx--wa', 'Send on WhatsApp'); waB.target = '_blank'; waB.rel = 'noopener'; waB.href = '#';
    mailB = mk('a', 'btnx', 'Send by email'); mailB.href = '#';
    const cp = (label, fn, ghost) => { const b = mk('button', 'btnx' + (ghost ? ' btnx--ghost' : ''), label); b.type = 'button'; b.addEventListener('click', fn); return b; };
    const copy = (txt, msg) => { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast(msg), () => { const t = mk('textarea'); t.value = txt; document.body.append(t); t.select(); try { document.execCommand('copy'); toast(msg); } catch (e) { toast('Copy failed. Select and copy manually.'); } t.remove(); }); };
    row.append(waB, mailB); P.append(row);
    const row2 = mk('div', 'btnrow');
    row2.append(cp('Copy brief', () => copy(briefText(true), 'Brief copied'), 1), cp('Copy design link', () => copy(shareUrl(), 'Link copied. Anyone can open your design with it'), 1),
      cp('Download brief', () => { const a = mk('a'); a.href = URL.createObjectURL(new Blob([briefText(true)], { type: 'text/plain' })); a.download = 'website-design-brief.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 1)); P.append(row2);
    P.append(cp('Start over (reset everything)', () => { if (confirm('Reset all your design choices?')) { flushNow(); S = clone(DEFAULT); select(null); refreshAll(); commit(); toast('Reset'); showTab('colors'); } }, 1));
    waB.addEventListener('click', () => { briefUI(); }); mailB.addEventListener('click', () => { briefUI(); });
  }

  /* ============================== RENDER the sample website ============================== */
  function styleEl(n, key, o) {
    const st = n.style, A = CATD[key][2];
    st.color = o.color ? rc(o.color) : ''; st.background = o.bg ? (o.bg === 'none' ? 'transparent' : rc(o.bg)) : '';
    if (o.bg && o.bg !== 'none' && !o.color) st.color = readable(rc(o.bg));
    st.fontFamily = o.ff ? fontStack(o.ff) : ''; st.fontWeight = o.fw || ''; st.textAlign = o.al || ''; st.textTransform = o.cs || ''; st.letterSpacing = o.ls != null ? o.ls + 'px' : '';
    o.fs ? st.setProperty('--fk', o.fs / 100) : st.removeProperty('--fk'); o.pad ? st.setProperty('--pk', o.pad / 100) : st.removeProperty('--pk'); o.rad != null ? st.setProperty('--rr', o.rad + 'px') : st.removeProperty('--rr');
    const sh = { none: 'none', soft: '0 14px 34px -12px rgba(0,0,0,.45)', hard: '6px 6px 0 ' + S.c.a, glow: '0 0 30px ' + S.c.p }; st.boxShadow = o.sh ? sh[o.sh] : '';
    const bd = { none: 'none', thin: '1.5px solid ' + S.c.tx, bold: '3px solid ' + S.c.p, dash: '2px dashed ' + S.c.a }; st.border = o.bd ? bd[o.bd] : '';
    if (o.hide) n.dataset.hide = '1'; else n.removeAttribute('data-hide');
    const hv = o.hv || (HOVERABLE.has(key) ? S.hover : ''); if (hv && hv !== 'none') n.dataset.hv = hv; else n.removeAttribute('data-hv');
    void A;
  }
  let rq;
  function render(opts) {
    const c = S.c, st = pv.style; opts = opts || {};
    Object.keys(TOK).forEach(k => st.setProperty('--' + k, c[k])); st.setProperty('--pt', readable(c.p)); st.setProperty('--at', readable(c.a));
    const hf = F(S.hf), bf = F(S.bf); st.setProperty('--hf', hf[2]); st.setProperty('--bf', bf[2]); st.setProperty('--hw', hf[4] ? 700 : 400); st.setProperty('--hc', S.hc === 'upper' ? 'uppercase' : 'none');
    st.setProperty('--r', S.r + 'px'); st.setProperty('--dk', S.dk); st.setProperty('--mw', S.mw + 'px'); st.setProperty('--scale', S.scale / 100); st.setProperty('--tsp', Math.round(80 / S.tspd) + 's'); st.setProperty('--gc', S.gc);
    pv.dataset.hero = S.hero; pv.dataset.btn = S.btn; pv.dataset.card = S.card; pv.dataset.nav = S.nav; pv.dataset.bgp = S.bgp; pv.dataset.shapes = S.shapes ? 1 : 0; pv.dataset.par = S.par ? 1 : 0;
    SECS.forEach(([k]) => { const n = $('[data-sec="' + k + '"]', pv); if (!n) return; n.style.setProperty('--o', S.order.indexOf(k)); n.dataset.off = S.off.includes(k) ? '1' : '0'; });
    $$('[data-tx]', pv).forEach(n => { const v = S.t[n.dataset.tx] != null ? S.t[n.dataset.tx] : DEF_T[n.dataset.tx]; if (n.textContent !== v) n.textContent = v; });
    const seq = {}; let reset = false;
    CAT.forEach(([key, , , sec]) => {
      const o = S.el[key] || {}, T = TG[key], grp = T.length > 1, a = o.an != null ? o.an : DEF_AN.has(key) ? S.anim : 'none', dur = o.dur != null ? o.dur : S.dur;
      let base = o.dl != null ? o.dl : 0; if (o.dl == null && !grp && a !== 'none') { seq[sec] = seq[sec] || 0; base = seq[sec]++ * S.stag; }
      T.forEach((n, i) => {
        styleEl(n, key, o);
        const dl = base + (grp && !SPREAD.has(key) ? i * S.stag : 0), sig = a + '|' + dur + '|' + dl.toFixed(2) + '|' + S.reveal;
        if (a === 'none') { n.removeAttribute('data-an'); n.removeAttribute('data-ae'); n.classList.remove('in'); n.style.removeProperty('--dur'); n.style.removeProperty('--dl'); n._sig = sig; return; }
        n.dataset.an = a; if (ENTR_SET.has(a)) n.dataset.ae = '1'; else n.removeAttribute('data-ae'); n.style.setProperty('--dur', dur + 's'); n.style.setProperty('--dl', dl.toFixed(2) + 's');
        if (opts.replayAll || (opts.replay && opts.replay.includes(key)) || n._sig !== sig) { n.classList.remove('in'); reset = true; } n._sig = sig;
      });
    });
    if (reset) void pv.offsetWidth;
    cancelAnimationFrame(rq); rq = requestAnimationFrame(reveal);
  }
  function countUp(n) { const to = +n.dataset.n, suf = n.dataset.suf || '', t0 = performance.now(); (function f(t) { const k = clamp((t - t0) / 1100, 0, 1), e = 1 - Math.pow(1 - k, 3); n.textContent = Math.round(to * e) + (k >= 1 ? suf : ''); if (k < 1) requestAnimationFrame(f); })(t0); }
  function reveal() {
    const lim = stage.getBoundingClientRect().bottom - 24;
    $$('[data-an]:not(.in)', pv).forEach(n => {
      if (n.dataset.hide === '1') return;
      if (S.reveal === 'load' || n.getBoundingClientRect().top < lim) { n.classList.add('in'); $$('.num', n).forEach(countUp); }
    });
  }
  function replay(keys) {
    (keys ? keys.flatMap(k => TG[k]) : $$('[data-an]', pv)).forEach(n => n.classList.remove('in')); void pv.offsetWidth;
    if (keys) { const n = TG[keys[0]].find(x => x.offsetParent !== null); if (n) n.scrollIntoView({ block: 'center' }); }
    requestAnimationFrame(reveal);
  }
  function refreshAll() { render({ replayAll: true }); buildInspect(); Object.values(regs).forEach(a => a.forEach(f => f())); briefUI(); }

  /* ============================== preview interactions ============================== */
  let st2 = 0;
  stage.addEventListener('scroll', () => { if (st2) return; st2 = requestAnimationFrame(() => { st2 = 0; pv.style.setProperty('--sy', stage.scrollTop); reveal(); }); }, { passive: true });
  pv.addEventListener('click', e => { if (pv.dataset.edit !== '1') return; const n = e.target.closest('[data-el]'); if (!n) return; e.preventDefault(); select(n.dataset.el); });
  pv.addEventListener('mouseover', e => { if (pv.dataset.edit !== '1') return; $$('[data-hov]', pv).forEach(n => n.removeAttribute('data-hov')); const n = e.target.closest('[data-el]'); if (n) n.dataset.hov = '1'; });
  pv.addEventListener('mouseleave', () => $$('[data-hov]', pv).forEach(n => n.removeAttribute('data-hov')));
  $$('button', $('#dev')).forEach(b => b.addEventListener('click', () => { document.body.dataset.dev = b.dataset.d; $$('button', $('#dev')).forEach(x => x.classList.toggle('on', x === b)); setTimeout(reveal, 620); }));
  const em = $('#editMode'); let wasEdit = '1';
  const setEdit = on => { pv.dataset.edit = on ? '1' : '0'; em.setAttribute('aria-pressed', on); em.textContent = 'Click to edit: ' + (on ? 'on' : 'off'); };
  em.addEventListener('click', () => setEdit(pv.dataset.edit !== '1'));
  $('#replayAll').addEventListener('click', () => replay());
  const fsOn = on => { document.body.classList.toggle('fs', on); $('#fsExit').hidden = !on; if (on) { wasEdit = pv.dataset.edit; setEdit(false); } else setEdit(wasEdit === '1'); setTimeout(reveal, 300); };
  $('#fsBtn').addEventListener('click', () => fsOn(true)); $('#fsExit').addEventListener('click', () => fsOn(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('fs')) fsOn(false); });
  $('#goSend').addEventListener('click', () => { showTab('send'); });

  /* ============================== start ============================== */
  buildColors(); buildFonts(); buildInspect(); buildMotion(); buildLayout(); buildContent(); buildSend();
  let opened = false;
  try { const m = location.hash.match(/[#&]d=([^&]+)/); if (m) { S = merge(dec(m[1])); opened = true; } else { const j = localStorage.getItem(KEY); if (j) S = merge(JSON.parse(j)); } } catch (e) { S = clone(DEFAULT); }
  hist = [JSON.stringify(S)]; hi = 0;
  render({ replayAll: true }); Object.values(regs).forEach(a => a.forEach(f => f())); briefUI(); histUI();
  showTab('colors'); requestAnimationFrame(drawMap);
  if (opened) setTimeout(() => toast('Opened a shared design'), 600);
  window.Studio = { get state() { return S; }, select, showTab, render, briefText, waLink };
})();
