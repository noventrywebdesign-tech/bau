var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Loader cleanup */
setTimeout(function () { var l = document.getElementById('loadReveal'); if (l) l.remove(); }, 1600);

/* Scroll reveal */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.rv, .rv-left, .rv-right').forEach(function (el) { revealObserver.observe(el); });

/* Counters (supports data-prefix / data-suffix) */
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    counterObserver.unobserve(entry.target);
    var el = entry.target;
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
    var start = null, dur = 1300;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(function (el) { counterObserver.observe(el); });

/* Timeline + process line-draw */
function lineDraw(trigger, fillId, widthPct) {
  var el = document.getElementById(trigger);
  var fill = document.getElementById(fillId);
  if (!el || !fill) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { fill.style.width = widthPct; obs.unobserve(entry.target); }
    });
  }, { threshold: 0.3 });
  obs.observe(el);
}
lineDraw('timelineLine', 'timelineFill', '100%');
lineDraw('processGrid', 'processFill', '100%');

/* Process step activation while scrolling */
(function () {
  var steps = document.querySelectorAll('.p-step');
  if (!steps.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add('on'); });
  }, { threshold: 0.5 });
  steps.forEach(function (s) { obs.observe(s); });
})();

/* Nav scroll state + mobile menu */
var nav = document.getElementById('siteNav');
if (nav) {
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });
}

var burger = document.getElementById('navBurger');
var navMobile = document.getElementById('navMobile');
if (burger && navMobile) {
  burger.addEventListener('click', function () {
    var open = navMobile.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  navMobile.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navMobile.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
  });
}

/* Hero parallax */
(function () {
  if (reduceMotion) return;
  var heroImg = document.querySelector('.hero-bg img');
  var hero = document.querySelector('.hero, .page-hero');
  if (!heroImg || !hero) return;
  window.addEventListener('scroll', function () {
    var h = hero.offsetHeight;
    if (window.scrollY > h) return;
    var maxShift = h * 0.07;
    var shift = Math.min(window.scrollY * 0.18, maxShift);
    heroImg.style.transform = 'translateY(' + shift + 'px)';
  }, { passive: true });
})();

/* Referenzen filter */
(function () {
  var filters = document.querySelectorAll('.ref-filter');
  var cards = document.querySelectorAll('.ref-card');
  if (!filters.length) return;
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (c) {
        var show = f === 'alle' || c.getAttribute('data-cat') === f;
        c.classList.toggle('show', show);
      });
    });
  });
})();

/* FAQ accordion */
document.querySelectorAll('.faq-item').forEach(function (item) {
  var q = item.querySelector('.faq-q');
  var a = item.querySelector('.faq-a');
  q.addEventListener('click', function () {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (o) {
      if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); o.querySelector('.faq-a').style.maxHeight = null; }
    });
    item.classList.toggle('open', !isOpen);
    q.setAttribute('aria-expanded', String(!isOpen));
    a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
  });
});

/* Contact form (demo — no backend) */
var contactForm = document.getElementById('contactForm');
var formSent = document.getElementById('formSent');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    contactForm.style.display = 'none';
    formSent.style.display = 'block';
  });
}

/* Gallery lightbox (simple) */
(function () {
  var links = document.querySelectorAll('.gallery-grid a[data-full]');
  if (!links.length) return;
  var box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:0;background:rgba(12,14,16,0.94);z-index:900;display:none;align-items:center;justify-content:center;padding:40px;cursor:zoom-out;';
  var img = document.createElement('img');
  img.style.cssText = 'max-width:100%;max-height:100%;box-shadow:0 30px 80px rgba(0,0,0,0.5);';
  box.appendChild(img);
  document.body.appendChild(box);
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      img.src = a.getAttribute('data-full');
      box.style.display = 'flex';
    });
  });
  box.addEventListener('click', function () { box.style.display = 'none'; });
})();
