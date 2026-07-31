/* ============================================================
   URIPR EMERGENCIAS — main.js
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. Loader ─────────────────────────────────────────── */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('out');
      document.body.classList.add('loaded');
      // Hero bg scale-in
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg) heroBg.classList.add('loaded');
      // Trigger hero text animations
      ['hero-badge','hero-sub','hero-ctas','hero-trust'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('in');
      });
    }, 700);
  });

  /* ── 2. Navbar scroll ──────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── 3. Hamburger ──────────────────────────────────────── */
  const burger  = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');

  burger.addEventListener('click', () => {
    const open = mobMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  mobMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── 4. Scroll Reveal (IntersectionObserver) ───────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── 5. Stat counter animation ─────────────────────────── */
  const statEls = document.querySelectorAll('[data-count]');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target);
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => statObs.observe(el));

  function countUp(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix  || '';
    const prefix   = el.dataset.prefix  || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const dur      = 2000;
    const start    = performance.now();

    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    (function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      const val = ease(progress) * target;
      el.textContent = prefix + (decimals > 0
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString('es-MX')) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ── 6. Marquee fill ────────────────────────────────────── */
  const marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner) {
    const items = [
      'Paramédicos Certificados', 'Bomberos Capacitados', 'Traslados de Urgencia',
      'Atención Prehospitalaria', 'Radio Operación 24/7', 'Respuesta Inmediata',
      'Ciudad de México', 'Equipamiento de Alta Tecnología', '17 Años de Experiencia',
      'Seguridad y Confianza'
    ];
    const full = [...items, ...items, ...items, ...items];
    marqueeInner.innerHTML = full.map(t => `<span>${t}</span>`).join('');
  }

  /* ── 7. WhatsApp form ──────────────────────────────────── */
  const form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name     = (document.getElementById('f-name')    || {}).value?.trim() || '';
      const interest = (document.getElementById('f-interest') || {}).value         || '';
      const message  = (document.getElementById('f-msg')     || {}).value?.trim()  || '';

      if (!name || !message) {
        showFormError('Por favor completa tu nombre y el detalle del proyecto.');
        return;
      }

      const phone = '525522937489';
      const text  = encodeURIComponent(
        `Hola URIPR Emergencias 🚑\n\nSoy *${name}*.\nNecesito: *${interest}*.\n\n${message}`
      );
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }

  function showFormError(msg) {
    let err = document.getElementById('form-error');
    if (!err) {
      err = document.createElement('p');
      err.id = 'form-error';
      err.style.cssText = 'color:#f87171;font-size:13px;margin-top:12px;text-align:center;';
      form.appendChild(err);
    }
    err.textContent = msg;
    setTimeout(() => { if (err) err.textContent = ''; }, 4000);
  }

  /* ── 8. Footer year ─────────────────────────────────────── */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── 8b. Galería carousel ───────────────────────────────── */
  const track = document.getElementById('carouselTrack');
  if (track) {
    const slides   = Array.from(track.children);
    const prevBtn  = document.getElementById('carouselPrev');
    const nextBtn  = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');
    const carouselEl = document.getElementById('carousel');
    let index = 0;
    let autoplay = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir a la foto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplay = setInterval(next, 5000);
    }
    function stopAutoplay() {
      if (autoplay) clearInterval(autoplay);
      autoplay = null;
    }

    nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
    carouselEl.addEventListener('mouseenter', stopAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);

    /* Touch swipe */
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 40) prev();
      else if (dx < -40) next();
      startAutoplay();
    }, { passive: true });

    render();
    startAutoplay();
  }

  /* ── 9. Hero Canvas — Orbs + Sparks ────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  const heroEl = document.getElementById('hero');
  if (!canvas || !heroEl) return;

  const ctx = canvas.getContext('2d');
  let raf = null, orbs = [], sparks = [], W = 0, H = 0;

  function resizeCanvas() {
    W = canvas.width  = heroEl.offsetWidth;
    H = canvas.height = heroEl.offsetHeight;
    spawnOrbs();
    spawnSparks();
  }

  /* Large ambient orb */
  class Orb {
    constructor(cold) { this.reset(cold ?? true); }
    reset(cold) {
      this.r  = Math.random() * 300 + 180;
      this.x  = cold ? Math.random() * W : (Math.random() > 0.5 ? -this.r : W + this.r);
      this.y  = cold ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.38;
      this.vy = (Math.random() - 0.5) * 0.32;
      const palette = [
        [ 70,  97, 255, 0.05 ],
        [230,  57,  70, 0.04 ],
        [255, 255, 255, 0.018],
        [120, 160, 255, 0.03 ],
        [138, 160, 255, 0.028],
      ];
      const [r,g,b,a] = palette[Math.floor(Math.random() * palette.length)];
      this.color = `rgba(${r},${g},${b},${a})`;
    }
    tick() {
      this.x += this.vx; this.y += this.vy;
      if (this.x - this.r > W + 60 || this.x + this.r < -60 ||
          this.y - this.r > H + 60 || this.y + this.r < -60) this.reset(false);
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, this.color); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    }
  }

  /* Small glowing spark that floats upward */
  class Spark {
    constructor(initY) { this._init(initY !== undefined ? initY : null); }
    _init(startY) {
      this.x    = Math.random() * W;
      this.y    = startY !== null ? startY : H + 5;
      this.vx   = (Math.random() - 0.5) * 0.55;
      this.vy   = -(Math.random() * 0.65 + 0.28);
      this.size = Math.random() * 1.7 + 0.45;
      this.life  = startY !== null ? Math.random() : 1;
      this.decay = Math.random() * 0.003 + 0.0014;
      this.hue   = Math.random() < 0.5 ? (205 + Math.random() * 30) : (352 + Math.random() * 12);
    }
    tick() {
      this.x += this.vx; this.y += this.vy; this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this._init(null);
    }
    draw() {
      const a = this.life * 0.68;
      const r = this.size * 3.8;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
      g.addColorStop(0, `hsla(${this.hue},100%,86%,${a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    }
  }

  function spawnOrbs() {
    const count = W < 768 ? 5 : 10;
    orbs = Array.from({ length: count }, () => new Orb(true));
  }

  function spawnSparks() {
    const count = W < 768 ? 28 : 50;
    sparks = Array.from({ length: count }, () => new Spark(Math.random() * H));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';
    orbs.forEach(o => { o.tick(); o.draw(); });
    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(drawFrame);
  }

  const visObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { if (!raf) drawFrame(); }
    else { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  visObs.observe(heroEl);

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  /* ── 10. Cursor glow + sparks + mouse parallax ──────────── */
  let glowX = -999, glowY = -999;

  /* Parallax state */
  let pMouseX = 0, pMouseY = 0, pCurrX = 0, pCurrY = 0;
  const heroGridEl    = document.querySelector('.hero-grid');
  const heroContentEl = document.querySelector('.hero-content');
  const heroVigEl     = document.querySelector('.hero-vignette');

  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    glowX   = e.clientX - rect.left;
    glowY   = e.clientY - rect.top;
    pMouseX = (e.clientX - rect.left) / rect.width  - 0.5;
    pMouseY = (e.clientY - rect.top)  / rect.height - 0.5;
  });

  heroEl.addEventListener('mouseleave', () => {
    glowX = -999; glowY = -999;
    pMouseX = 0;  pMouseY = 0;
  });

  function drawFrameWithCursor() {
    /* Smooth parallax lerp */
    pCurrX += (pMouseX - pCurrX) * 0.04;
    pCurrY += (pMouseY - pCurrY) * 0.04;
    if (heroGridEl)    heroGridEl.style.transform    = `translate(${-pCurrX * 32}px, ${-pCurrY * 20}px)`;
    if (heroContentEl) heroContentEl.style.transform = `translate(${pCurrX  * 14}px, ${pCurrY  * 10}px)`;
    if (heroVigEl)     heroVigEl.style.transform     = `translate(${-pCurrX * 10}px, ${-pCurrY *  6}px)`;

    /* Canvas drawing */
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';

    orbs.forEach(o => { o.tick(); o.draw(); });
    sparks.forEach(s => { s.tick(); s.draw(); });

    /* Cursor spotlight */
    if (glowX > 0) {
      const cg = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 380);
      cg.addColorStop(0,   'rgba(70,97,255,0.12)');
      cg.addColorStop(0.4, 'rgba(70,97,255,0.045)');
      cg.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(glowX, glowY, 380, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(drawFrameWithCursor);
  }

  visObs.disconnect();
  const visObs2 = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { if (!raf) drawFrameWithCursor(); }
    else { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  visObs2.observe(heroEl);
  if (document.visibilityState === 'visible') drawFrameWithCursor();

}());
