/* ============================================
   Still Sonic Media — ui.js
   Shared page behaviour, one copy for every page:
   · Mobile menu (hamburger), also closes with Escape
   · Lightbox: click a photo to view it full screen
       - arrows / swipe on phones to move, Escape or ✕ to close
       - "3 / 12" counter and the photo's caption
       - screen-reader labels; focus returns to the photo on close
       - skips photos hidden by a filter (homepage Featured)
   No dependencies; load with  defer.
   ============================================ */
(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    var setMenu = function (open) {
      burger.classList.toggle('open', open);
      navLinks.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    burger.addEventListener('click', function () { setMenu(!navLinks.classList.contains('open')); });
    navLinks.querySelectorAll('a').forEach(function (l) { l.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); burger.focus(); } });
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  if (!lightbox || !lbImg) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;
  var current = 0, lastFocus = null;

  // accessibility + extras, added here so no page markup needs changing
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Photo viewer');
  var btnClose = document.getElementById('lbClose'), btnPrev = document.getElementById('lbPrev'), btnNext = document.getElementById('lbNext');
  if (btnClose) btnClose.setAttribute('aria-label', 'Close');
  if (btnPrev) btnPrev.setAttribute('aria-label', 'Previous photo');
  if (btnNext) btnNext.setAttribute('aria-label', 'Next photo');
  var meta = document.createElement('div');
  meta.className = 'lightbox-meta';
  meta.innerHTML = '<span class="lightbox-caption"></span><span class="lightbox-count" aria-live="polite"></span>';
  lightbox.appendChild(meta);
  var capEl = meta.querySelector('.lightbox-caption'), countEl = meta.querySelector('.lightbox-count');

  function visible() { return items.filter(function (it) { return !it.classList.contains('is-filtered'); }); }
  function show(i) {
    current = i;
    var item = items[i], img = item.querySelector('img'), label = item.querySelector('.gallery-item-label');
    lbImg.src = img.getAttribute('src');          // the full-size original
    lbImg.alt = img.alt || '';
    capEl.textContent = label ? label.textContent : '';
    var vis = visible();
    countEl.textContent = (vis.indexOf(item) + 1) + ' / ' + vis.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (btnClose) btnClose.focus();
  }
  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(d) {
    for (var n = 0; n < items.length; n++) {         // skip photos hidden by a filter
      current = (current + d + items.length) % items.length;
      if (!items[current].classList.contains('is-filtered')) break;
    }
    show(current);
  }

  items.forEach(function (item, i) { item.addEventListener('click', function () { open(i); }); });
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev) btnPrev.addEventListener('click', function () { step(-1); });
  if (btnNext) btnNext.addEventListener('click', function () { step(1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {                         // keep Tab inside the viewer
      var f = [btnPrev, btnNext, btnClose].filter(Boolean);
      var i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // swipe left / right on touch screens
  var x0 = null, y0 = null;
  lightbox.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();   // swipe down to close
    x0 = y0 = null;
  }, { passive: true });
})();
