/* The Tower — LOADOUT engine. Written from scratch 2026-09-07.
   Five independent turntable clips (pre-extracted WebP frames) scrubbed on canvases, with code-driven
   3D swipes between drinks. Dev contract: ?jump=<scrollY> lands pre-scrolled + settled, ?flat pins the
   film to a fixed height for one tall capture, ?jank logs rAF deltas; window.__ready fires when the
   first chapter (or the jumped-to chapter) is decoded. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  var Q = new URLSearchParams(location.search);
  var JUMP = Q.get('jump'), FLAT = Q.has('flat'), JANK = Q.has('jank'), NOLENIS = Q.has('nolenis'), NOBLUR = Q.has('noblur'), NODRAW = Q.has('nodraw'), KEEPALL = Q.has('keepall');
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (JUMP !== null) { try { history.scrollRestoration = 'manual'; } catch (e) {} }
  document.documentElement.classList.remove('no-js');
  if (FLAT) document.documentElement.classList.add('flat');
  if (RM) document.documentElement.classList.add('rm');

  var DRINKS = [
    { id: '01', accent: '#FF3B6B' },
    { id: '02', accent: '#6B7BFF' },
    { id: '03', accent: '#B5F02A' },
    { id: '04', accent: '#FF2D55' },
    { id: '05', accent: '#D9B48F' }
  ];
  var N = DRINKS.length;
  var FR = window.FRAMES || {};
  var TURN = 1, SWIPE = 0.45, UNIT = TURN + SWIPE;

  var film = $('#film'), stage = $('#stage'), head = $('#top'), loadbar = $('#loadbar i'), loadwrap = $('#loadbar');
  var slots = $$('.slot'), titles = $$('.title'), huds = $$('.hud'), dots = $$('.dot'), counter = $('#cur');
  var lightmark = $('#lightmark');
  var root = document.documentElement;
  var hasGsap = typeof gsap !== 'undefined';

  if (!FLAT) film.style.height = 'calc(' + (N * UNIT * 100) + 'vh + 100vh)';

  /* ---------- frame store + loader (concurrency-capped pump, priority by chapter) ---------- */
  var store = DRINKS.map(function (d) {
    var n = FR[d.id] || 0, imgs = new Array(n);
    return { n: n, imgs: imgs, loaded: 0, bitmaps: new Map(), decoding: new Set(), center: -999 };
  });
  var queue = [], inflight = 0, MAXF = 8;
  function src(i, f) { return 'frames/' + DRINKS[i].id + '/f_' + String(f + 1).padStart(3, '0') + '.webp'; }
  function enqueue(i, front) {
    var st = store[i], items = [];
    for (var f = 0; f < st.n; f++) if (!st.imgs[f]) items.push([i, f]);
    queue = queue.filter(function (q) { return q[0] !== i; });
    queue = front ? items.concat(queue) : queue.concat(items);
    pump();
  }
  function pump() {
    while (inflight < MAXF && queue.length) {
      var q = queue.shift(), i = q[0], f = q[1], st = store[i];
      if (st.imgs[f]) continue;
      var im = new Image(); im.decoding = 'async';
      st.imgs[f] = im; inflight++;
      im.onload = (function (i, f) { return function () { inflight--; store[i].loaded++; onLoaded(i); pump(); }; })(i, f);
      im.onerror = (function (i, f) { return function () { inflight--; store[i].imgs[f] = null; pump(); }; })(i, f);
      im.src = src(i, f);
    }
  }
  function onLoaded(i) {
    if (i === 0 && loadbar) {
      var pct = store[0].n ? store[0].loaded / store[0].n : 1;
      loadbar.style.width = (pct * 100).toFixed(1) + '%';
      if (pct >= 1) loadwrap.classList.add('done');
    }
    if (i === curVis) { ensureBitmaps(i, Math.round(lastFrame[i] || 0)); }
  }
  function ready(i) { var st = store[i]; return st.n === 0 || st.loaded >= st.n * 0.9; }

  /* ImageBitmap sliding window — decode off-thread around the playhead; every draw is a GPU blit.
     Budgeted: at most BUDGET new decodes per call (the tick calls it every frame), nearest-first, so a chapter's
     window fills over ~10 frames instead of landing as one 15-bitmap allocation burst (that burst was a 150 ms frame). */
  var B_AHEAD = 14, B_KEEP = 22, BUDGET = 3;
  function ensureBitmaps(i, center) {
    var st = store[i];
    if (!st.n || !window.createImageBitmap) return;
    st.center = center;
    st.bitmaps.forEach(function (b, k) { if (k < center - B_KEEP || k > center + B_KEEP) { b.close(); st.bitmaps.delete(k); } });
    var budget = BUDGET;
    for (var d = 0; d <= B_AHEAD && budget > 0; d++) {
      var cands = d === 0 ? [center] : [center + d, center - d];
      for (var c = 0; c < cands.length && budget > 0; c++) {
        var f = cands[c];
        if (f < 0 || f >= st.n || st.bitmaps.has(f) || st.decoding.has(f)) continue;
        var im = st.imgs[f]; if (!im || !im.complete || !im.naturalWidth) continue;
        st.decoding.add(f); budget--;
        (function (f) {
          createImageBitmap(im).then(function (b) {
            st.decoding.delete(f);
            if (Math.abs(f - st.center) > B_KEEP) { b.close(); return; }
            st.bitmaps.set(f, b);
            if (f === Math.round(lastFrame[i]) && slots[i].classList.contains('is-vis')) draw(i, lastFrame[i], true);
          }).catch(function () { st.decoding.delete(f); });
        })(f);
      }
    }
  }
  /* nearest DECODED frame — never an HTMLImageElement, which would force a synchronous decode on the main thread */
  function nearest(st, idx) {
    if (!window.createImageBitmap) { var im = st.imgs[idx]; return (im && im.complete && im.naturalWidth) ? im : null; }
    for (var d = 1; d <= 30; d++) {
      var a = st.bitmaps.get(idx - d); if (a) return a;
      var b = st.bitmaps.get(idx + d); if (b) return b;
    }
    return null;
  }

  /* ---------- canvases ---------- */
  var DPR = Math.min(1.5, window.devicePixelRatio || 1);
  var lastFrame = [], drawn = [];
  slots.forEach(function (sl, i) {
    var cv = $('canvas', sl); sl._cv = cv; sl._ctx = cv.getContext('2d', { alpha: false, desynchronized: true });
    lastFrame[i] = 0; drawn[i] = -1;
  });
  function size() {
    var w = Math.round(window.innerWidth * DPR), h = Math.round(stage.clientHeight * DPR);
    slots.forEach(function (sl, i) { if (sl._cv.width !== w || sl._cv.height !== h) { sl._cv.width = w; sl._cv.height = h; drawn[i] = -1; } });
  }
  function draw(i, f, force) {
    var st = store[i], sl = slots[i];
    if (!st.n || NODRAW) return false;
    var idx = clamp(Math.round(f), 0, st.n - 1);
    if (!force && drawn[i] === idx) return true;
    var img = st.bitmaps.get(idx) || nearest(st, idx);
    if (!img) return false;
    var cv = sl._cv, ctx = sl._ctx, iw = img.width, ih = img.height, cw = cv.width, ch = cv.height;
    var sc = Math.max(cw / iw, ch / ih), dw = iw * sc, dh = ih * sc;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    drawn[i] = idx;
    if (!sl.classList.contains('is-live')) sl.classList.add('is-live');
    return true;
  }

  /* ---------- transforms ---------- */
  function outXf(sl, s) {
    var e = smooth(s);
    sl.style.transform = 'translate3d(' + (-e * 58) + 'vw,0,0) rotateY(' + (-e * 44) + 'deg) scale(' + (1 - 0.22 * e) + ')';
    sl.style.opacity = String(1 - e);
    sl.style.filter = (!NOBLUR && e > 0.02) ? 'blur(' + (e * 6).toFixed(1) + 'px)' : '';
  }
  function inXf(sl, s) {
    var e = 1 - smooth(s);
    sl.style.transform = 'translate3d(' + (e * 58) + 'vw,0,0) rotateY(' + (e * 44) + 'deg) scale(' + (1 - 0.22 * e) + ')';
    sl.style.opacity = String(1 - e);
    sl.style.filter = (!NOBLUR && e > 0.02) ? 'blur(' + (e * 6).toFixed(1) + 'px)' : '';
  }
  function restXf(sl) { sl.style.transform = ''; sl.style.opacity = ''; sl.style.filter = ''; }
  /* names and HUDs swap in two non-overlapping halves: out during the first half of the swipe, in during the second */
  function textOut(el, s, dx, dy) { var e = smooth(s * 2); el.style.transform = 'translate3d(' + (-dx * e) + 'px,' + (dy * e) + 'px,0)'; el.style.opacity = String(1 - e); }
  function textIn(el, s, dx, dy) { var e = 1 - smooth((s - 0.5) * 2); el.style.transform = 'translate3d(' + (dx * e) + 'px,' + (dy * e) + 'px,0)'; el.style.opacity = String(1 - e); }
  function textRest(el) { el.style.transform = ''; el.style.opacity = ''; }

  /* ---------- chapter bookkeeping ---------- */
  var cur = -1, curVis = 0, accentTween = null;
  function setVisual(k) {
    if (k === curVis && cur !== -1) return;
    curVis = k; cur = k;
    counter.textContent = DRINKS[k].id;
    dots.forEach(function (d, j) { d.classList.toggle('is-on', j === k); d.setAttribute('aria-selected', j === k ? 'true' : 'false'); });
    if (hasGsap) {
      if (accentTween) accentTween.kill();
      accentTween = gsap.to(root, { '--accent': DRINKS[k].accent, duration: 0.55, ease: 'power2.out' });
      var bars = $$('.bar i', huds[k]);
      gsap.killTweensOf(bars);
      gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'steps(5)', stagger: 0.07 });
    } else {
      root.style.setProperty('--accent', DRINKS[k].accent);
    }
    enqueue(k, true); if (k + 1 < N) enqueue(k + 1, false);
  }

  /* ---------- the render ---------- */
  var U = 0, uT = 0, settled = false, scrolledOnce = false;
  function progress() {
    var r = film.getBoundingClientRect(), H = stage.clientHeight;
    return clamp(-r.top / Math.max(1, r.height - H), 0, 1);
  }
  function render() {
    var i = Math.min(N - 1, Math.floor(U / UNIT)), local = U - i * UNIT;
    var turn = Math.min(1, local / TURN);
    var s = local > TURN ? Math.min(1, (local - TURN) / SWIPE) : 0;
    var last = i === N - 1;
    var vis = (!last && s > 0.5) ? i + 1 : i;
    if (vis !== curVis || cur === -1) setVisual(vis);
    if (U > 0.002 && !scrolledOnce) { scrolledOnce = true; stage.classList.add('scrolled'); }

    for (var k = 0; k < N; k++) {
      var sl = slots[k], t = titles[k], h = huds[k], on = false;
      if (k === i) {
        on = true;
        var f = turn * Math.max(0, store[k].n - 1);
        lastFrame[k] = f; ensureBitmaps(k, Math.round(f)); draw(k, f);
        if (turn > 0.5 && !last) ensureBitmaps(k + 1, 0);   /* warm the next cup early, a few frames a tick */
        if (!last) { outXf(sl, s); textOut(t, s, 110, 0); textOut(h, s, 0, 30); }
        else { restXf(sl); textRest(t); textRest(h); }
      } else if (k === i + 1 && s > 0) {
        on = true;
        lastFrame[k] = 0; ensureBitmaps(k, 0); draw(k, 0);
        inXf(sl, s); textIn(t, s, 110, 0); textIn(h, s, 0, 30);
      }
      if (on !== sl.classList.contains('is-vis')) { sl.classList.toggle('is-vis', on); t.classList.toggle('is-vis', on); h.classList.toggle('is-vis', on); }
      if (!on) { restXf(sl); textRest(t); textRest(h); }
    }
    /* handoff: the last chapter's swipe fades the whole stage into the page black */
    stage.style.opacity = last ? String(1 - smooth(s)) : '';
    headTheme();
  }
  /* the fixed header takes the theme of whichever section is under it (film/lineup/board/footer dark, story/visit light) */
  var themed = $$('[data-theme]');
  function headTheme() {
    var y = 40, light = false;
    for (var k = 0; k < themed.length; k++) {
      var r = themed[k].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { light = themed[k].getAttribute('data-theme') === 'light'; break; }
    }
    head.classList.toggle('on-light', light);
  }
  function tick() {
    uT = progress() * N * UNIT;
    U += (uT - U) * (settled ? 0.12 : 1);
    if (Math.abs(uT - U) < 0.0004) U = uT;
    render();
  }

  /* ---------- reduced motion / flat: posters + crossfades only ---------- */
  function renderStatic() {
    var i = FLAT ? 0 : Math.min(N - 1, Math.round(progress() * N * UNIT / UNIT));
    if (i !== curVis || cur === -1) setVisual(i);
    for (var k = 0; k < N; k++) {
      var on = k === i;
      slots[k].classList.toggle('is-vis', on); titles[k].classList.toggle('is-vis', on); huds[k].classList.toggle('is-vis', on);
    }
    headTheme();
  }

  /* ---------- selector ---------- */
  var lenis = null;
  function chapterY(k) {
    var H = stage.clientHeight, top = film.offsetTop, span = film.offsetHeight - H;
    return top + (k * UNIT) / (N * UNIT) * span + 2;
  }
  function goTo(k) {
    k = clamp(k, 0, N - 1); var y = chapterY(k);
    if (lenis) lenis.scrollTo(y, { duration: 1.1, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else window.scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
  }
  $('.arrow.prev').addEventListener('click', function () { goTo(curVis - 1); });
  $('.arrow.next').addEventListener('click', function () { goTo(curVis + 1); });
  $$('[data-go]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); goTo(+el.getAttribute('data-go')); });
  });
  window.addEventListener('keydown', function (e) {
    var r = film.getBoundingClientRect();
    if (r.top > 0 || r.bottom < stage.clientHeight) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(curVis + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(curVis - 1); }
  });
  $$('.nav a, .lockup').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (!id || id.charAt(0) !== '#') return;
      var el = $(id); if (!el) return; e.preventDefault();
      var y = id === '#film' ? 0 : el.offsetTop - 0;
      if (lenis) lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
    });
  });

  /* ---------- content reveals (no pins anywhere, so no ordering hazards) ---------- */
  function reveals() {
    if (!hasGsap || RM || FLAT || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    $$('.reveal').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    var cards = $$('.card');
    cards.forEach(function (c, j) { var tw = gsap.getTweensOf(c)[0]; if (tw) tw.delay(j * 0.06); });
  }

  /* ---------- boot ---------- */
  function boot() {
    size();
    window.addEventListener('resize', function () { size(); if (!RM && !FLAT) { slots.forEach(function (s, i) { drawn[i] = -1; }); render(); } });

    if (RM || FLAT) {
      renderStatic();
      window.addEventListener('scroll', renderStatic, { passive: true });
      finish(0);
      return;
    }

    for (var q = 0; q < N; q++) enqueue(q, false);   /* everything, in order — 61 frames each, ~1.4 MB a drink */
    ensureBitmaps(0, 0);

    if (hasGsap && !NOLENIS && JUMP === null && typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    if (hasGsap) gsap.ticker.add(tick); else (function raf() { tick(); requestAnimationFrame(raf); })();
    reveals();

    var target = 0;
    if (JUMP !== null) {
      window.scrollTo(0, +JUMP || 0);
      target = Math.min(N - 1, Math.floor(progress() * N * UNIT / UNIT));
      enqueue(target, true);
    }
    finish(target);
  }
  function finish(target) {
    var t0 = performance.now();
    (function wait() {
      var ok = (RM || FLAT) ? true : ready(target) && (target === 0 ? ready(0) : true);
      if (ok || performance.now() - t0 > 30000) {
        if (!ok) console.warn('[loadout] ready timeout — frames still loading');
        if (!RM && !FLAT) {
          if (JUMP !== null) { window.scrollTo(0, +JUMP || 0); U = uT = progress() * N * UNIT; }
          settled = true; render();
          if (JUMP !== null) { if (typeof ScrollTrigger !== 'undefined' && hasGsap) ScrollTrigger.update(); render(); }
        }
        window.__ready = true;
        return;
      }
      setTimeout(wait, 100);
    })();
  }

  if (JANK) {
    var lastT = performance.now(), maxD = 0, deltas = [];
    (function meter() { var now = performance.now(); var d = now - lastT; lastT = now; deltas.push(d); if (d > maxD) maxD = d; requestAnimationFrame(meter); })();
    setInterval(function () { deltas.sort(function (a, b) { return a - b; }); var p95 = deltas[Math.floor(deltas.length * 0.95)] || 0; console.log('[jank] max ' + maxD.toFixed(1) + 'ms p95 ' + p95.toFixed(1) + 'ms n=' + deltas.length); maxD = 0; deltas = []; }, 2000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
