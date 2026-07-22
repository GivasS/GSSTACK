(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= HERO — floating particles ================= */
  var heroSection = document.querySelector('.hero-section');
  var gridPlane = document.getElementById('heroGridPlane');
  var parallaxText = document.getElementById('heroParallaxText');
  var canvas = document.getElementById('heroParticles');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var particles = [];

  function resizeCanvas() {
    if (!canvas || !heroSection) return;
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }

  function initParticles() {
    if (!canvas) return;
    var count = window.innerWidth < 768 ? 22 : 46;
    particles = Array.from({ length: count }, function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.35 + 0.08,
        alpha: Math.random() * 0.45 + 0.12
      };
    });
  }

  function drawParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#F000B8';
    particles.forEach(function (p) {
      if (!prefersReduced) p.y -= p.speed;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }

  if (canvas) {
    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener('resize', function () {
      resizeCanvas();
      initParticles();
    });
  }

  /* ================= NEON TRAIL SVG sizing ================= */
  function sizeTrailSvg() {
    var wrap = document.querySelector('.neon-trail-wrap');
    var svg = document.getElementById('servicesTrailSvg');
    var rect = document.getElementById('servicesTrailRect');
    if (!wrap || !svg || !rect) return;
    var w = wrap.offsetWidth + 28;
    var h = wrap.offsetHeight + 28;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    rect.setAttribute('width', Math.max(w - 30, 0));
    rect.setAttribute('height', Math.max(h - 30, 0));
  }

  sizeTrailSvg();
  window.addEventListener('resize', sizeTrailSvg);
  window.addEventListener('load', sizeTrailSvg);

  /* ================= SCROLL-DRIVEN UPDATES ================= */
  var servicesSection = document.querySelector('.neon-trail-wrap');
  var trailRect = document.getElementById('servicesTrailRect');
  var stockWrap = document.getElementById('stocksysMockup');
  var stockSection = document.getElementById('projetos');
  var featureItems = document.querySelectorAll('.feature-item');
  var processSection = document.getElementById('processo');
  var trackFill = document.getElementById('processTrackFill');
  var steps = document.querySelectorAll('.process-step');

  function clamp01(v) {
    return Math.min(Math.max(v, 0), 1);
  }

  function updateHero() {
    if (!heroSection) return;
    var heroHeight = heroSection.offsetHeight || 1;
    var progress = clamp01(window.scrollY / heroHeight);
    if (gridPlane) {
      var rot = 78 + progress * 10;
      gridPlane.style.transform = 'rotateX(' + rot + 'deg) translateY(' + progress * 120 + 'px)';
      gridPlane.style.opacity = String(1 - progress * 1.1);
    }
    if (parallaxText) {
      parallaxText.style.transform = 'translateY(' + progress * 70 + 'px)';
      parallaxText.style.opacity = String(1 - progress * 1.3);
    }
  }

  function updateServicesTrail() {
    if (!trailRect || !servicesSection) return;
    var rect = servicesSection.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = clamp01((vh - rect.top) / (rect.height + vh));
    var total = trailRect.getTotalLength ? trailRect.getTotalLength() : 2000;
    trailRect.style.strokeDasharray = total;
    trailRect.style.strokeDashoffset = String(total * (1 - progress));
  }

  function updateStockSys() {
    if (!stockWrap || !stockSection) return;
    var rect = stockSection.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = clamp01((vh * 0.85 - rect.top) / (rect.height * 0.7));
    var scale = 0.84 + progress * 0.16;
    var rotY = 14 - progress * 14;
    var rotX = 8 - progress * 8;
    stockWrap.style.transform = 'rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg) scale(' + scale + ')';
    var activeCount = Math.round(progress * featureItems.length);
    featureItems.forEach(function (el, i) {
      el.classList.toggle('is-active', i < activeCount);
    });
  }

  function updateProcess() {
    if (!processSection || !trackFill) return;
    var rect = processSection.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = clamp01((vh * 0.75 - rect.top) / (rect.height * 0.6));
    trackFill.style.width = progress * 100 + '%';
    steps.forEach(function (el, i) {
      var threshold = (i + 0.5) / steps.length;
      el.classList.toggle('active', progress >= threshold);
    });
  }

  var ticking = false;
  function onScrollUpdate() {
    updateHero();
    updateServicesTrail();
    updateStockSys();
    updateProcess();
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(onScrollUpdate);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScrollUpdate();

  /* ================= SERVICES — cascade reveal on view ================= */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
