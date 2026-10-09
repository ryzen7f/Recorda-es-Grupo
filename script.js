// Navegação responsiva restaurada
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle && mainNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mainNav.classList.remove('is-open');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    mainNav.classList.toggle('is-open', !isOpen);
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
}

// Menu não é necessário nesta versão; as interações ficam concentradas no carrossel e nas animações.
const track = document.querySelector('#track');
const viewport = document.querySelector('#viewport');
const slides = Array.from(document.querySelectorAll('.slide'));
const previousButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');
const dotsContainer = document.querySelector('#dots');
const counter = document.querySelector('#counter');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = 0;
let autoplay = null;
let touchStart = 0;
const delay = 4500;

// Cria exatamente quatro indicadores, um para cada foto.
slides.forEach((slide, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Mostrar foto ${index + 1}`);
  dot.addEventListener('click', () => { showSlide(index); restartAutoplay(); });
  dotsContainer.appendChild(dot);
});
const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
function showSlide(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
    dot.setAttribute('aria-current', i === current ? 'true' : 'false');
  });
  counter.textContent = `${String(current + 1).padStart(2, '0')} / 04`;
}
function next() { showSlide(current + 1); }
function previous() { showSlide(current - 1); }
function stopAutoplay() { if (autoplay !== null) { clearInterval(autoplay); autoplay = null; } }
function startAutoplay() {
  stopAutoplay();
  if (!reducedMotion && !document.hidden) autoplay = setInterval(next, delay);
}
function restartAutoplay() { startAutoplay(); }
previousButton.addEventListener('click', () => { previous(); restartAutoplay(); });
nextButton.addEventListener('click', () => { next(); restartAutoplay(); });
viewport.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { next(); restartAutoplay(); }
  if (event.key === 'ArrowLeft') { previous(); restartAutoplay(); }
});
viewport.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].screenX; }, {passive:true});
viewport.addEventListener('touchend', event => {
  const difference = touchStart - event.changedTouches[0].screenX;
  if (Math.abs(difference) > 45) { difference > 0 ? next() : previous(); restartAutoplay(); }
}, {passive:true});
viewport.addEventListener('mouseenter', stopAutoplay);
viewport.addEventListener('mouseleave', startAutoplay);
viewport.addEventListener('focusin', stopAutoplay);
viewport.addEventListener('focusout', startAutoplay);
document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());
showSlide(0);
startAutoplay();

// Animação de entrada ao rolar a página.
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -30px 0px'});
  revealElements.forEach(element => observer.observe(element));
} else revealElements.forEach(element => element.classList.add('is-visible'));
