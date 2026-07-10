(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var effective = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', effective);
  toggle.setAttribute('aria-pressed', effective === 'dark' ? 'true' : 'false');

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
  });

  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  navToggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  var revealEls = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { observer.observe(el); });

  document.getElementById('year').textContent = new Date().getFullYear();

  // scroll progress bar + scroll-to-top button
  var progress = document.getElementById('scrollProgress');
  var scrollTopBtn = document.getElementById('scrollTop');
  var ticking = false;
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
    scrollTopBtn.classList.toggle('visible', scrollTop > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // hero cursor glow (mouse-capable devices only)
  var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hasFinePointer) {
    var heroSection = document.getElementById('heroSection');
    var heroGlow = document.getElementById('heroGlow');
    if (heroSection && heroGlow) {
      heroSection.addEventListener('mousemove', function (e) {
        var rect = heroSection.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        heroGlow.style.setProperty('--gx', x + '%');
        heroGlow.style.setProperty('--gy', y + '%');
      });
    }
  }

  // animated count-up stats
  var countEls = document.querySelectorAll('.count');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var elapsed = ts - start;
        var t = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        var value = Math.round(target * eased);
        el.textContent = value.toLocaleString() + suffix;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  countEls.forEach(function (el) { countObserver.observe(el); });

  // tilt effect on repo cards (mouse-capable devices only)
  if (hasFinePointer) {
    document.querySelectorAll('.repo-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateY = px * 10;
        var rotateX = py * -10;
        card.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
})();
