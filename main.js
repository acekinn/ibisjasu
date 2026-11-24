(() => {
  'use strict';

  /* ---------- 히어로 롤링 ---------- */
  const slides = [...document.querySelectorAll('.slide')];
  const dotsBox = document.getElementById('dots');
  const INTERVAL = 5500;
  let idx = 0, timer = null;

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `${i + 1}번 슬라이드`);
    b.addEventListener('click', () => { go(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  function go(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => {
      d.classList.toggle('on', i === idx);
      d.setAttribute('aria-selected', String(i === idx));
    });
  }
  const start = () => { stop(); timer = setInterval(() => go(idx + 1), INTERVAL); };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const restart = start;

  document.getElementById('prev').addEventListener('click', () => { go(idx - 1); restart(); });
  document.getElementById('next').addEventListener('click', () => { go(idx + 1); restart(); });

  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  // 터치 스와이프
  let sx = null;
  hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
    sx = null;
  });

  go(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();

  /* ---------- 헤더 / 모바일 메뉴 ---------- */
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- 스크롤 리빌 ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('in'));
  }

  /* ---------- 히어로 패럴랙스 (블롭이 천천히 따라 흐름) ---------- */
  const blobs = document.querySelectorAll('.hero-blob');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          blobs.forEach((b, i) => { b.style.marginTop = `${y * (0.12 + i * 0.07)}px`; });
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
