// Carousel and modal gallery for reference page

const Carousel = (() => {
  function init() {
    document.querySelectorAll('[data-carousel]').forEach((wrap) => {
      const track = wrap.querySelector('.carousel-track');
      const viewport = wrap.querySelector('.carousel-viewport');
      const prevBtn = wrap.querySelector('.carousel-prev');
      const nextBtn = wrap.querySelector('.carousel-next');
      if (!track || !viewport) return;

      const scrollOne = (dir) => {
        const slideWidth = track.querySelector('.carousel-slide')?.offsetWidth ?? 320;
        const gap = 16;
        const step = (slideWidth + gap) * dir;
        viewport.scrollBy({ left: step, behavior: 'smooth' });
      };
      prevBtn?.addEventListener('click', () => scrollOne(-1));
      nextBtn?.addEventListener('click', () => scrollOne(1));
    });
  }
  return { init };
})();

const Gallery = (() => {
  let modal, modalImg, modalCaption, closeBtn, prevBtn, nextBtn, currentImages = [], index = 0;

  function open(imagesArr, i) {
    currentImages = imagesArr;
    index = i;
    const img = currentImages[index];
    modalImg.src = img.dataset.full || img.src;
    modalImg.alt = img.alt || '';
    modalCaption.textContent = img.alt || '';
    modal.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('open');
    document.documentElement.style.overflow = '';
  }
  function prev() { open(currentImages, (index - 1 + currentImages.length) % currentImages.length); }
  function next() { open(currentImages, (index + 1) % currentImages.length); }

  function onKey(e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  function init() {
    modal = document.querySelector('#gallery-modal');
    if (!modal) return;
    modalImg = modal.querySelector('img');
    modalCaption = modal.querySelector('.modal-caption');
    closeBtn = modal.querySelector('[data-close]');
    prevBtn = modal.querySelector('[data-prev]');
    nextBtn = modal.querySelector('[data-next]');

    document.querySelectorAll('[data-gallery]').forEach((container) => {
      const images = Array.from(container.querySelectorAll('img'));
      images.forEach((img, i) => {
        img.addEventListener('click', () => open(images, i));
        img.style.cursor = 'zoom-in';
      });
    });

    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    window.addEventListener('keydown', onKey);
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
  Carousel.init();
  Gallery.init();
});


