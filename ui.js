/* ============================================
   Still Sonic Media — ui.js
   Shared page behaviour for the gallery pages (concert, jimbo, scotland,
   tunisia, cleethorpes, florida, food). One copy instead of one per page.
   · Mobile menu (hamburger)
   · Lightbox: click a photo to view it full screen, arrows / Escape to move or close
   No dependencies; safe to load with  defer.
   ============================================ */
(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', function () {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  if (!lightbox || !lbImg) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var current = 0;

  function show(i) {
    current = i;
    var img = items[i].querySelector('img');
    lbImg.src = img.getAttribute('src');          // the full-size original
    lbImg.alt = img.alt || '';
  }
  function open(i) { show(i); lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function close() { lightbox.classList.remove('active'); document.body.style.overflow = ''; if (items[current]) items[current].focus && items[current].focus(); }
  function step(d) {
    // skip any photo hidden by a filter
    for (var n = 0; n < items.length; n++) {
      current = (current + d + items.length) % items.length;
      if (!items[current].classList.contains('is-filtered')) break;
    }
    show(current);
  }

  items.forEach(function (item, i) { item.addEventListener('click', function () { open(i); }); });
  var btnClose = document.getElementById('lbClose'), btnPrev = document.getElementById('lbPrev'), btnNext = document.getElementById('lbNext');
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev) btnPrev.addEventListener('click', function () { step(-1); });
  if (btnNext) btnNext.addEventListener('click', function () { step(1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
