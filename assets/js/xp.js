/* Experience: swipeable "merging deck". Cards overlap like a coverflow stack; as you swipe, the front card slides under the
   next one, which grows to the front (a shine sweeps across it) while a giant year number rolls like an odometer.
   Sideways gestures only: the page keeps scrolling vertically. Phones / portrait / short screens get the normal vertical list. */
(() => {
  const sec = document.getElementById('experience');
  if (!sec) return;
  const view = sec.querySelector('.xp__view'), track = document.getElementById('xpTrack');
  const cards = [...track.children], n = cards.length;
  const bar = document.getElementById('xpBar'), count = document.getElementById('xpCount'), hint = document.getElementById('xpHint');
  const yearBox = document.getElementById('xpYear'), yearList = document.createElement('ol'); yearBox.appendChild(yearList);
  cards.forEach(c => { const li = document.createElement('li'); li.textContent = c.dataset.y || ''; yearList.appendChild(li); });
  const reduce = false /* animations stay on for every device */;
  const mq = { matches: true };
  let on = false, cur = 0, target = 0, raf = 0, cw = 520;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad2 = k => String(k).padStart(2, '0');

  function measure() {
    const want = mq.matches && !reduce;
    if (want !== on) {
      on = want; sec.classList.toggle('xp--on', on);
      if (!on) { cards.forEach(c => { c.style.transform = ''; c.style.opacity = ''; c.style.filter = ''; c.style.zIndex = ''; c.style.removeProperty('--d'); c.style.removeProperty('--shine'); c.classList.remove('is-focus'); }); yearList.style.transform = ''; }
    }
    if (!on) return;
    cw = cards[0].getBoundingClientRect().width || 520;
    cur = target = clamp(target, 0, n - 1); render();
  }
  function render() {
    { const ed = view.querySelector('.swipe-edge'); if (ed) ed.classList.toggle('end', cur > n - 1 - 0.4); }
    const rowH = yearBox.getBoundingClientRect().height || 140;
    cards.forEach((c, i) => {
      const d = i - cur, ad = Math.abs(d), sg = Math.sign(d) || 0;
      const x = sg * (ad <= 1 ? ad * 0.60 : 0.60 + (ad - 1) * 0.30) * cw;       // cards overlap (merge) instead of sitting in a row
      const z = -ad * 150, ry = -clamp(d, -2.2, 2.2) * 22, sc = 1 - Math.min(ad, 2.6) * 0.085;
      c.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${(ad * 6).toFixed(1)}px,${z.toFixed(0)}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
      c.style.opacity = clamp(1 - Math.max(0, ad - 0.4) * 0.34, 0, 1).toFixed(3);
      c.style.filter = ad > 0.3 ? `blur(${(Math.min(ad, 2.4) * 1.1).toFixed(2)}px)` : '';
      c.style.zIndex = String(100 - Math.round(ad * 10));
      c.style.setProperty('--d', d.toFixed(3)); c.style.setProperty('--shine', (ad < 1 && ad > 0.01 ? 1 - ad : 0).toFixed(3));
      c.classList.toggle('is-focus', ad < 0.5);
    });
    yearList.style.transform = `translateY(${(-cur * rowH).toFixed(1)}px)`;
    const best = clamp(Math.round(cur), 0, n - 1);
    bar.style.transform = `scaleX(${clamp(cur / (n - 1), 0, 1)})`;
    count.textContent = pad2(best + 1) + ' / ' + pad2(n);
  }
  function loop() { raf = 0; if (!on) return; const d = target - cur; if (Math.abs(d) < 0.0006) { cur = target; render(); return; } cur += d * 0.09; render(); raf = requestAnimationFrame(loop); }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const goTo = i => { target = clamp(i, 0, n - 1); kick(); if (hint) hint.classList.add('done'); };

  window.HGesture(view, {
    px: () => Math.min(260, Math.max(170, cw * 0.62)),
    drag: d => { if (!on) return; target = clamp(target + d, -0.25, n - 1 + 0.25); kick(); },
    end: ex => { if (!on) return; target = clamp(Math.round(target + clamp(ex, -1.2, 1.2)), 0, n - 1); kick(); },
    step: s => goTo(Math.round(target) + s),
    onFirst: () => { if (hint) hint.classList.add('done'); }
  });
  cards.forEach((c, i) => c.addEventListener('click', () => { if (on && Math.abs(i - target) > 0.4) goTo(i); }));   // tap a side card to bring it forward
  document.getElementById('xpPrev').addEventListener('click', () => goTo(Math.round(target) - 1));
  document.getElementById('xpNext').addEventListener('click', () => goTo(Math.round(target) + 1));
  addEventListener('resize', () => requestAnimationFrame(measure));
  
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  addEventListener('load', measure);
  measure();
})();
