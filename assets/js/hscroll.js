/* Projects: "merge" carousel. Swipe / drag / Shift+scroll / arrows sideways to swap projects: the incoming project
   slides over the outgoing one, which drifts back, shrinks and fades, while an orange band sweeps across.
   The page itself keeps scrolling vertically as normal. Phones / portrait / short screens get a normal vertical list. */
(() => {
  const sec = document.getElementById('work');
  if (!sec) return;
  const view = sec.querySelector('.hs__viewport'), track = document.getElementById('projects');
  const bar = document.getElementById('hsBar'), count = document.getElementById('hsCount'), dotsBox = document.getElementById('hsDots');
  const prev = document.getElementById('hsPrev'), next = document.getElementById('hsNext'), ring = document.getElementById('hsRing'), hint = document.getElementById('hsHint');
  const reduce = false /* animations stay on for every device */;
  const mq = { matches: true };
  const veil = document.createElement('div'); veil.className = 'hs__veil'; veil.setAttribute('aria-hidden', 'true');
  const veilNum = document.createElement('span'); veil.appendChild(veilNum); view.appendChild(veil);
  const veil2 = document.createElement('div'); veil2.className = 'hs__veil2'; veil2.setAttribute('aria-hidden', 'true'); view.appendChild(veil2);
  let on = false, slides = [], target = 0, cur = 0, raf = 0, shownNum = '';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad2 = n => String(n).padStart(2, '0');
  const ease = x => x * x * (3 - 2 * x);

  function buildDots() {
    dotsBox.textContent = '';
    slides.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = pad2(i + 1); b.setAttribute('aria-label', 'Go to project ' + (i + 1)); b.addEventListener('click', () => goTo(i)); dotsBox.appendChild(b); });
  }
  function reset(s) { s.style.transform = ''; s.style.opacity = ''; s.style.visibility = ''; s.style.zIndex = ''; s.style.removeProperty('--d'); s.style.removeProperty('--w'); }

  function measure() {
    const want = mq.matches && !reduce;
    if (want !== on) { on = want; sec.classList.toggle('hs--on', on); if (!on) { veil.style.opacity = '0'; veil2.style.opacity = '0'; [...track.children].forEach(reset); } }
    slides = [...track.querySelectorAll('.project:not(.hidden)')];
    slides.forEach((s, i) => { s.dataset.n = pad2(i + 1); });
    buildDots();
    if (!on) return;
    target = clamp(target, 0, Math.max(0, slides.length - 1)); cur = target; render();
  }

  function render() {
    { const ed = view.querySelector('.swipe-edge'); if (ed) ed.classList.toggle('end', cur > last() - 0.4); }
    const n = slides.length; if (!n) return;
    const vel = clamp((target - cur) * 2.4, -3.2, 3.2);                                             // momentum skew
    slides.forEach((s, i) => {
      const d = i - cur, ad = Math.abs(d);
      if (ad >= 1) { s.style.visibility = 'hidden'; s.style.opacity = '0'; return; }
      s.style.visibility = 'visible';
      let x, sc, o, z, ry, w = 0;
      if (d > 0) { const e = ease(d); x = e * 100; sc = 1; ry = -e * 13; o = clamp(1.3 - e * 1.2, 0, 1); z = 3; w = clamp(e * 1.15, 0, 1); }
      else { const e = ease(-d); x = -e * 34; sc = 1 - e * 0.1; ry = e * 9; o = clamp(1 - e * 1.08, 0, 1); z = 2; }
      s.style.transform = `translate3d(${x.toFixed(2)}%,0,0) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(4)}) skewX(${(-vel).toFixed(2)}deg)`;
      s.style.opacity = o.toFixed(3); s.style.zIndex = z;
      s.style.setProperty('--d', d.toFixed(3)); s.style.setProperty('--w', w.toFixed(3));
    });
    const g = cur - Math.floor(cur), moving = n > 1 && g > 0.001 && g < 0.999 && cur >= 0 && cur < n - 1;
    if (moving) {
      const label = pad2(Math.floor(cur) + 2);
      if (label !== shownNum) { veilNum.textContent = label; shownNum = label; }
      veil.style.opacity = String(Math.min(1, Math.sin(Math.PI * g) * 2.4));
      veil.style.transform = `translate3d(${(112 - ease(g) * 150).toFixed(2)}vw,0,0) skewX(-12deg)`;
      veil2.style.opacity = String(Math.min(1, Math.sin(Math.PI * g) * 2));
      veil2.style.transform = `translate3d(${(124 - ease(clamp(g - .06, 0, 1)) * 160).toFixed(2)}vw,0,0) skewX(-12deg)`;
    } else { veil.style.opacity = '0'; veil2.style.opacity = '0'; }
    const best = clamp(Math.round(cur), 0, n - 1);
    count.textContent = pad2(best + 1) + ' / ' + pad2(n);
    bar.style.transform = `scaleX(${n > 1 ? clamp(cur / (n - 1), 0, 1) : 1})`;
    ring.style.transform = `rotate(${cur * 160}deg)`;
    [...dotsBox.children].forEach((b, i) => b.classList.toggle('on', i === best));
    prev.disabled = best === 0; next.disabled = best === n - 1;
  }
  function loop() { raf = 0; if (!on) return; const d = target - cur; if (Math.abs(d) < 0.0006) { cur = target; render(); return; } cur += d * 0.095; render(); raf = requestAnimationFrame(loop); }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const last = () => Math.max(0, slides.length - 1);
  function goTo(i) { if (!on) { if (slides[i]) slides[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); return; } target = clamp(i, 0, last()); kick(); if (hint) hint.classList.add('done'); }

  window.HGesture(view, {
    px: () => Math.min(460, Math.max(210, innerWidth * 0.5)),
    drag: d => { if (!on) return; target = clamp(target + d, -0.22, last() + 0.22); kick(); },
    end: ex => { if (!on) return; target = clamp(Math.round(target + clamp(ex, -1, 1)), 0, last()); kick(); },
    step: s => goTo(Math.round(target) + s),
    onFirst: () => { if (hint) hint.classList.add('done'); }
  });
  prev.addEventListener('click', () => goTo(Math.round(target) - 1));
  next.addEventListener('click', () => goTo(Math.round(target) + 1));
  addEventListener('resize', () => requestAnimationFrame(measure));
  
  document.getElementById('filters').addEventListener('click', () => setTimeout(() => { target = 0; measure(); }, 30));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  addEventListener('load', measure);
  measure();
})();
