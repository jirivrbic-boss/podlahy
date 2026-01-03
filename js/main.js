// Main interactions: mobile menu, smooth anchors, page transitions, utilities

function select(selector, scope) {
  return (scope || document).querySelector(selector);
}
function selectAll(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

// Mobile menu toggle
function setupMobileMenu() {
  const burger = select('.burger');
  const menu = select('#primary-menu');
  if (!burger || !menu) return;
  // ensure close button exists (mobile)
  if (!select('.menu-close', menu)) {
    const btn = document.createElement('button');
    btn.className = 'menu-close';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Zavřít menu');
    btn.innerHTML = '×';
    menu.appendChild(btn);
    btn.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    });
  }
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
}

// Smooth anchor scroll with offset for sticky header
function setupSmoothAnchors() {
  const header = select('.site-header');
  const offset = header ? header.offsetHeight + 8 : 0;
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = select(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

// Page transition between internal links
function setupPageTransitions() {
  const overlay = select('.page-transition');
  if (!overlay) return;
  window.addEventListener('pageshow', () => overlay.classList.remove('active'));
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const url = new URL(link.href, window.location.origin);
    const isSameOrigin = url.origin === window.location.origin;
    const isAnchor = link.getAttribute('href')?.startsWith('#');
    if (isSameOrigin && !isAnchor && !link.hasAttribute('data-no-transition')) {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = link.href; }, 250);
    }
  });
}

// Footer year
function setCurrentYear() {
  const year = select('#year');
  if (year) year.textContent = String(new Date().getFullYear());
}

// Lazyload fallback (modern browsers support loading="lazy")
function enhanceLazyImages() {
  const lazyImages = selectAll('img[loading="lazy"]');
  lazyImages.forEach((img) => {
    img.addEventListener('load', () => img.classList.add('loaded'));
  });
}

// Initialize animations hooks
function initAnimations() {
  if (window.Animations) {
    window.Animations.setupReveal();
    window.Animations.setupParallax();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupSmoothAnchors();
  setupPageTransitions();
  setCurrentYear();
  enhanceLazyImages();
  initAnimations();
  setupWeatherCheb();
  setupContactFormValidation();
  setupCookieBanner();
  setupMenuPillsRow();
  setupMobileSubmenus();
});

// Contact form validation
function setupContactFormValidation() {
  const form = select('#contact-form');
  if (!form) return;
  const status = select('#form-status');

  function setError(input, message) {
    input.setAttribute('aria-invalid', 'true');
    const small = input.closest('label')?.querySelector('.error');
    if (small) small.textContent = message || '';
  }
  function clearError(input) {
    input.removeAttribute('aria-invalid');
    const small = input.closest('label')?.querySelector('.error');
    if (small) small.textContent = '';
  }
  function isEmail(value) {
    return /.+@.+\..+/.test(value);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    let valid = true;

    const name = form.elements.namedItem('name');
    const phone = form.elements.namedItem('phone');
    const email = form.elements.namedItem('email');
    const message = form.elements.namedItem('message');
    const consent = form.elements.namedItem('consent');

    [name, phone, email, message].forEach((el) => clearError(el));

    if (!name.value || name.value.trim().length < 3) { setError(name, 'Uveďte celé jméno.'); valid = false; }
    if (!phone.value || phone.value.replace(/\D/g,'').length < 9) { setError(phone, 'Zadejte platné telefonní číslo.'); valid = false; }
    if (!email.value || !isEmail(email.value)) { setError(email, 'Zadejte platný e‑mail.'); valid = false; }
    if (!message.value || message.value.trim().length < 10) { setError(message, 'Stručně popište projekt (min. 10 znaků).'); valid = false; }
    if (!consent.checked) { consent.focus(); valid = false; }

    if (!valid) return;

    status.textContent = 'Děkujeme, zpráva byla odeslána. Ozveme se co nejdříve.';
    form.reset();
  });
}

// Mobile: toggle submenus (e.g., Služby) on tap
function setupMobileSubmenus() {
  if (!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) return;
  const parents = selectAll('.has-children > a');
  parents.forEach((link) => {
    link.addEventListener('click', (e) => {
      // prevent navigation, toggle submenu
      e.preventDefault();
      e.stopPropagation();
      const li = link.closest('.has-children');
      if (!li) return;
      const isOpen = li.classList.toggle('open');
      link.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

// Group weather + articles into one row (mobile menu)
function setupMenuPillsRow() {
  try {
    if (!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) return;
    const menu = select('#primary-menu');
    if (!menu) return;
    const weather = select('#weather-cheb', menu);
    const articles = select('a[href*="hokejkv.cz/archiv"]', menu);
    if (!weather || !articles) return;
    const liWeather = weather.closest('li');
    const liArticles = articles.closest('li');
    if (!liWeather || !liArticles || liWeather === liArticles) return;
    // Create row li and move content
    const row = document.createElement('li');
    row.className = 'menu-pills-row';
    // Move nodes
    row.appendChild(weather);
    row.appendChild(articles);
    // Insert at position of first pill and remove the other li
    menu.insertBefore(row, liWeather);
    liWeather.remove();
    liArticles.remove();
  } catch (_) { /* no-op */ }
}

// Simple cookie consent banner
function setupCookieBanner() {
  try {
    if (localStorage.getItem('cookieConsent')) return;
  } catch (e) {
    // ignore storage errors, still show banner
  }
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = [
    '<p>Používáme soubory cookies pro správné fungování webu a analýzu návštěvnosti. <a class="cookie-link" href="/zasady-cookies.html" data-no-transition>Zásady cookies</a></p>',
    '<div class="cookie-actions">',
    '  <button class="btn btn-ghost" data-consent="necessary">Pouze nezbytné</button>',
    '  <button class="btn btn-primary" data-consent="all">Povolit vše</button>',
    '</div>'
  ].join('');
  document.body.appendChild(banner);

  banner.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-consent]');
    if (!btn) return;
    const value = btn.getAttribute('data-consent') || 'necessary';
    try { localStorage.setItem('cookieConsent', value); } catch (err) {}
    banner.classList.add('hide');
    setTimeout(() => banner.remove(), 320);
  });
}


// Weather: Cheb current conditions via Open-Meteo
function setupWeatherCheb() {
  const el = select('#weather-cheb');
  if (!el) return;
  const latitude = 50.0741493;
  const longitude = 12.3726539;
  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${latitude}`
    + `&longitude=${longitude}`
    + '&current=temperature_2m,weather_code'
    + '&timezone=Europe%2FPrague';

  const codeToEmoji = (code) => {
    if (code == null) return 'ℹ️';
    if ([0].includes(code)) return '☀️';
    if ([1, 2].includes(code)) return '🌤️';
    if ([3].includes(code)) return '☁️';
    if ([45, 48].includes(code)) return '🌫️';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
    if ([56, 57, 66, 67].includes(code)) return '🌦️';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '🌨️';
    if ([95, 96, 99].includes(code)) return '⛈️';
    return '🌡️';
  };

  fetch(url, { cache: 'no-store' })
    .then((r) => r.json())
    .then((data) => {
      const current = data.current || data.current_weather || {};
      const t = (current.temperature_2m ?? current.temperature);
      const code = (current.weather_code ?? current.weathercode);
      const emoji = codeToEmoji(Number(code));
      if (typeof t === 'number') {
        const rounded = Math.round(t);
        el.textContent = `Cheb: ${rounded}°C ${emoji}`;
      } else {
        el.textContent = 'Cheb: data nedostupná';
      }
    })
    .catch(() => {
      el.textContent = 'Cheb: data nedostupná';
    });
}


