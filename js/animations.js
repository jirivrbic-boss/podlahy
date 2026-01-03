// Animations: scroll reveal, parallax hero

(function(){
  function setupReveal() {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('reveal-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    elements.forEach((el) => observer.observe(el));
  }

  function setupParallax() {
    const section = document.querySelector('[data-parallax]');
    if (!section) return;
    const bg = section.querySelector('.hero-bg');
    if (!bg) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (0 - rect.top) / (window.innerHeight)));
      const translate = progress * 40; // subtle parallax
      bg.style.transform = `translate3d(0, ${translate}px, 0) scale(1.02)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Expose
  window.Animations = { setupReveal, setupParallax };
})();


