(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  // Menu responsivo
  const menuButton = $('.menu-toggle');
  const navigation = $('.nav-links');
  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    $$('.nav-links a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // Filtros da galeria de projetos
  const filters = $$('.filter');
  const projectCards = $$('.project-card');
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach((card) => {
        const shouldHide = category !== 'todos' && card.dataset.category !== category;
        card.classList.toggle('hidden', shouldHide);
      });
    });
  });

  // Progresso de leitura e retorno ao topo
  const readingProgress = $('.reading-progress');
  const backToTop = $('.back-to-top');
  let scrollUpdatePending = false;
  const updateScrollUI = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0
      ? Math.max(0, Math.min(1, window.scrollY / scrollableHeight)) * 100
      : 0;
    if (readingProgress) readingProgress.style.width = `${progress}%`;
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 650);
    scrollUpdatePending = false;
  };
  window.addEventListener('scroll', () => {
    if (scrollUpdatePending) return;
    window.requestAnimationFrame(updateScrollUI);
    scrollUpdatePending = true;
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });
  updateScrollUI();
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Ampliação das imagens dos projetos
  const lightbox = $('#lightbox');
  const lightboxImage = $('.lightbox img');
  const lightboxCaption = $('.lightbox-caption');
  const lightboxClose = $('.lightbox-close');
  let previousFocus = null;

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  };
  const openLightbox = (image) => {
    if (!lightbox || !lightboxImage || !lightboxClose) return;
    previousFocus = document.activeElement;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || 'Imagem ampliada';
    if (lightboxCaption) lightboxCaption.textContent = image.alt || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  };
  $$('img[data-zoom]').forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Ampliar: ${image.alt}`);
    image.addEventListener('click', () => openLightbox(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox?.getAttribute('aria-hidden') === 'false') closeLightbox();
  });
})();
