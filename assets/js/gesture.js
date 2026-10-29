/* Sideways gestures for carousels. Vertical wheel / swipe is never captured: the page keeps scrolling normally.
   Moves only on: horizontal trackpad/wheel, Shift + wheel, mouse drag, horizontal touch swipe, and arrow keys. */
window.HGesture = function (view, o) {
  let idle = 0, down = null, vel = 0, firstDone = false, quiet = 0;
  const first = () => { if (!firstDone) { firstDone = true; if (o.onFirst) o.onFirst(); } };
  view.addEventListener('wheel', e => {
    const ax = Math.abs(e.deltaX), ay = Math.abs(e.deltaY);
    let d;
    if (e.shiftKey && ay > 0 && ax < ay) d = e.deltaY;          // Shift + scroll wheel
    else if (ax > ay * 1.2 && ax > 0) d = e.deltaX;             // horizontal trackpad / tilt wheel
    else return;                                                // vertical intent: let the page scroll
    e.preventDefault(); first(); o.drag(d / o.px());
    clearTimeout(idle); idle = setTimeout(() => o.end(0), 140);
  }, { passive: false });
  view.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('button,input,textarea,select')) return;
    down = { id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, lock: null, moved: false }; vel = 0;
  });
  view.addEventListener('pointermove', e => {
    if (!down || e.pointerId !== down.id) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (down.lock === null) { if (Math.abs(dx) > 7 || Math.abs(dy) > 7) down.lock = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'; else return; }
    if (down.lock !== 'x') return;
    if (!down.moved) { down.moved = true; try { view.setPointerCapture(e.pointerId); } catch (_) {} view.classList.add('dragging'); first(); }
    const step = e.clientX - down.lx; down.lx = e.clientX; vel = step; o.drag(-step / o.px());
  });
  const up = e => {
    if (!down || e.pointerId !== down.id) return;
    if (down.moved) { view.classList.remove('dragging'); quiet = performance.now() + 80; o.end(-vel / o.px() * 5); }
    down = null;
  };
  view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
  view.addEventListener('click', e => { if (performance.now() < quiet) { e.preventDefault(); e.stopPropagation(); } }, true);
  view.addEventListener('dragstart', e => e.preventDefault());
  view.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); first(); o.step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); first(); o.step(-1); }
  });
};
