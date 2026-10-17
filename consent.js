/* ============================================
   Still Sonic Media — Cookie consent + Google Analytics
   Loaded on every public page:  <script src="consent.js?v=1" defer></script>

   · Google Analytics only loads AFTER a visitor presses "Accept".
     Until then nothing is sent and no analytics cookies are set (UK GDPR / PECR).
   · The choice is remembered in this browser. A "Cookies" link is added to
     every footer so people can change their mind.
   · Tracks two key actions once accepted:
       book_click      — any click on a link to the Book page
       generate_lead   — a successful enquiry from the booking form
         (book.html calls  window.ssmTrack('generate_lead')  on success)
   To change the Analytics ID, edit GA_ID below.
   ============================================ */
(function () {
  var GA_ID = 'G-GQ900SQ106';
  var KEY = 'ssm-cookie-consent';     // 'granted' | 'denied'
  var loaded = false;

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function loadAnalytics() {
    if (loaded) return; loaded = true;
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  /* Send an event only if the visitor has accepted */
  window.ssmTrack = function (name, params) {
    if (getChoice() === 'granted') { loadAnalytics(); gtag('event', name, params || {}); }
  };

  /* ---------- banner ---------- */
  var css = '' +
    '.ssm-consent{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:99995;max-width:560px;margin:0 auto;background:#15120f;border:1px solid #2e2821;' +
    'box-shadow:0 18px 50px rgba(0,0,0,.5);padding:1.25rem 1.4rem;color:#f7f2ea;font-family:"Redaction35",Georgia,serif;transform:translateY(20px);opacity:0;transition:transform .35s,opacity .35s}' +
    '.ssm-consent.show{transform:none;opacity:1}' +
    '.ssm-consent p{font-size:.92rem;line-height:1.6;color:#cfc6b8;margin:0 0 1rem}' +
    '.ssm-consent .k{font-family:"Space Mono",monospace;font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:#c8a97e;display:block;margin-bottom:.5rem}' +
    '.ssm-consent .row{display:flex;gap:.6rem;flex-wrap:wrap}' +
    '.ssm-consent button{font-family:"Space Mono",monospace;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;padding:.8rem 1.2rem;min-height:44px;cursor:pointer;border:1px solid #c8a97e;transition:background .2s,color .2s}' +
    '.ssm-consent .yes{background:#c8a97e;color:#0f0d0b}.ssm-consent .yes:hover{background:#f7f2ea;border-color:#f7f2ea}' +
    '.ssm-consent .no{background:none;color:#c8a97e}.ssm-consent .no:hover{color:#f7f2ea;border-color:#f7f2ea}' +
    '.ssm-consent button:focus-visible{outline:1px solid #f7f2ea;outline-offset:3px}' +
    '.ssm-cookie-link{background:none;border:none;padding:0;cursor:pointer;color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;opacity:.8}' +
    '.ssm-cookie-link:hover{color:#c8a97e;opacity:1}' +
    '@media (prefers-reduced-motion:reduce){.ssm-consent{transition:none}}';

  function showBanner() {
    if (document.querySelector('.ssm-consent')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('div');
    box.className = 'ssm-consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Cookie choice');
    box.innerHTML = '<span class="k">Cookies</span>' +
      '<p>Can I use Google Analytics cookies to see which pages people visit? It helps me improve the site. Nothing is shared or sold.</p>' +
      '<div class="row"><button type="button" class="yes">Accept</button><button type="button" class="no">No thanks</button></div>';
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add('show'); });
    function close(v) {
      setChoice(v);
      if (v === 'granted') loadAnalytics();
      box.classList.remove('show'); setTimeout(function () { box.remove(); }, 350);
    }
    box.querySelector('.yes').addEventListener('click', function () { close('granted'); });
    box.querySelector('.no').addEventListener('click', function () { close('denied'); });
  }

  /* "Cookies" link in the footer to reopen the choice */
  function addFooterLink() {
    var f = document.querySelector('footer');
    if (!f) return;
    var existing = f.querySelector('.ssm-cookie-link');      // the footer already has a Cookies button
    if (existing) { existing.addEventListener('click', showBanner); return; }
    if (!document.querySelector('style[data-ssm-consent]')) {
      var st = document.createElement('style'); st.setAttribute('data-ssm-consent', ''); st.textContent = css; document.head.appendChild(st);
    }
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ssm-cookie-link'; b.textContent = 'Cookies';
    b.addEventListener('click', showBanner);
    f.appendChild(b);
  }

  /* Book clicks, from any page */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a && /(^|\/)book\.html/.test(a.getAttribute('href'))) window.ssmTrack('book_click', { link_text: (a.textContent || '').trim().slice(0, 60) });
  }, true);

  function init() {
    var c = getChoice();
    if (c === 'granted') loadAnalytics();
    else if (c !== 'denied') setTimeout(showBanner, 800);
    addFooterLink();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
