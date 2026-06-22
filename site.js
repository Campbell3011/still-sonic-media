/* ============================================
   Still Sonic Media — site.js
   Requires: gsap.min.js + ScrollTrigger.min.js
   loaded before this file.
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     HELPERS
  ------------------------------------------ */
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return gsap.utils.toArray(sel); }

  /* ------------------------------------------
     PAGE TRANSITION
  ------------------------------------------ */
  var overlay = document.createElement('div');
  overlay.className = 'ssm-overlay';

  var ssLogo = document.createElement('div');
  ssLogo.className = 'ssm-logo';
  ssLogo.textContent = 'SS';
  overlay.appendChild(ssLogo);

  document.body.appendChild(overlay);

  // Curtain reveal on load: overlay slides away, SS logo fades out
  gsap.set(overlay, { scaleY: 1, transformOrigin: 'top center' });
  gsap.set(ssLogo, { opacity: 1 });
  gsap.to(overlay, {
    scaleY: 0,
    duration: 0.72,
    ease: 'power3.inOut',
    delay: 0.05,
    clearProps: 'transform'
  });
  gsap.to(ssLogo, {
    opacity: 0,
    duration: 0.28,
    delay: 0.05
  });

  // Exit curtain: SS flashes in as overlay covers, then navigates
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto') === 0 ||
        href.indexOf('tel') === 0 || href.indexOf('http') === 0 ||
        link.target === '_blank') return;
    e.preventDefault();
    gsap.set(overlay, { transformOrigin: 'bottom center' });
    gsap.to(overlay, {
      scaleY: 1,
      duration: 0.52,
      ease: 'power3.inOut',
      onComplete: function () {
        window.location.href = href;
      }
    });
    gsap.to(ssLogo, {
      opacity: 1,
      duration: 0.28,
      delay: 0.18
    });
  }, true);

  /* ------------------------------------------
     CUSTOM CURSOR (mouse/trackpad devices only)
  ------------------------------------------ */
  if (window.matchMedia('(pointer: fine)').matches) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';

    var ring = document.createElement('div');
    ring.className = 'cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100, my = -100;
    var rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.08, overwrite: 'auto' });
    });

    // Ring follows with smooth lag
    gsap.ticker.add(function () {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      gsap.set(ring, { x: rx, y: ry });
    });

    // Expand + show VIEW label on gallery cards
    qsa('.gallery-item, .genre-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(ring, { scale: 2.6, duration: 0.38, ease: 'power2.out' });
        });
      el.addEventListener('mouseleave', function () {
        gsap.to(ring, { scale: 1, duration: 0.38, ease: 'power2.out' });
      });
    });

    // Shrink on nav links and buttons
    qsa('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to([dot, ring], { scale: 0.45, duration: 0.2, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to([dot, ring], { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
    });

    // Fade when cursor leaves window
    document.addEventListener('mouseleave', function () {
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
    });
    document.addEventListener('mouseenter', function () {
      gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
    });
  }

  /* ------------------------------------------
     SCROLL ANIMATIONS
  ------------------------------------------ */
  gsap.registerPlugin(ScrollTrigger);

  // --- Hero elements (index page) ---
  var heroEls = [
    '.hero-eyebrow',
    '.hero-title',
    '.hero-subtitle',
    '.hero-cta',
    '.hero-scroll'
  ].map(function (s) { return qs(s); }).filter(Boolean);

  if (heroEls.length) {
    gsap.fromTo(heroEls,
      { opacity: 0, y: 22 },
      {
        opacity: 1, y: 0,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.13,
        delay: 0.55
      }
    );
  }

  // --- Gallery page hero (concert/portrait/street/travel) ---
  var galleryHero = qs('.gallery-hero-title') || qs('.gallery-hero-eyebrow');
  if (galleryHero) {
    gsap.fromTo(
      ['.gallery-hero-eyebrow', '.gallery-hero-title', '.gallery-hero-subtitle'].map(function (s) { return qs(s); }).filter(Boolean),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.4 }
    );
  }

  // --- Section eyebrows + titles ---
  qsa('.section-eyebrow, .section-title').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- Genre cards (index page) ---
  var genreCards = qsa('.genre-card');
  if (genreCards.length) {
    gsap.fromTo(genreCards,
      { opacity: 0, y: 42 },
      {
        opacity: 1, y: 0,
        duration: 0.68,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.genres-grid',
          start: 'top 84%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // --- Gallery items (all pages) ---
  qsa('.gallery-item').forEach(function (item, i) {
    gsap.fromTo(item,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: (i % 3) * 0.07,
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- About stats (index page) ---
  qsa('.stat-item').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1, scale: 1,
        duration: 0.55,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

})();
