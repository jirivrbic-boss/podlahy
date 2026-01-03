// Simple slider and modal gallery for reference page

const Gallery = (() => {
  let modal, modalImg, modalCaption, closeBtn, prevBtn, nextBtn, images, index = 0;

  function open(i) {
    index = i;
    const img = images[index];
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
  function prev() { open((index - 1 + images.length) % images.length); }
  function next() { open((index + 1) % images.length); }

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
    images = Array.from(document.querySelectorAll('[data-gallery] img'));

    images.forEach((img, i) => {
      img.addEventListener('click', () => open(i));
      img.style.cursor = 'zoom-in';
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
  Gallery.init();
});


