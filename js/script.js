(() => {
  'use strict';

  /* ---------- Año en footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header con sombra al hacer scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navScrim = document.getElementById('navScrim');

  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
    primaryNav.inert = true;
    navScrim.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };
  const openNav = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-open');
    primaryNav.inert = false;
    navScrim.classList.add('is-open');
    document.body.classList.add('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });
  navScrim.addEventListener('click', closeNav);
  primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
  primaryNav.inert = true;

  /* ---------- Tabs del menú (accesibles, patrón WAI-ARIA) ---------- */
  const tabs = Array.from(document.querySelectorAll('#menuTabs [role="tab"]'));
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const menuTabsContainer = document.getElementById('menuTabs');

  function checkTabsOverflow() {
    if (!menuTabsContainer) return;
    const hasOverflow = menuTabsContainer.scrollWidth > menuTabsContainer.clientWidth + 2;
    menuTabsContainer.classList.toggle('has-overflow', hasOverflow);
  }
  checkTabsOverflow();
  document.fonts.ready.then(checkTabsOverflow);
  window.addEventListener('resize', checkTabsOverflow, { passive: true });
  menuTabsContainer.addEventListener('scroll', () => {
    const scrolledToEnd =
      menuTabsContainer.scrollLeft + menuTabsContainer.clientWidth >= menuTabsContainer.scrollWidth - 4;
    if (scrolledToEnd) {
      menuTabsContainer.classList.remove('has-overflow');
    } else if (menuTabsContainer.scrollWidth > menuTabsContainer.clientWidth + 2) {
      menuTabsContainer.classList.add('has-overflow');
    }
  }, { passive: true });

  function activateTab(tab) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(p => {
      const show = p.id === tab.getAttribute('aria-controls');
      if (show) {
        p.hidden = false;
        p.classList.add('is-active');
        p.style.animation = 'none';
        p.offsetHeight;
        p.style.animation = '';
      } else {
        p.classList.remove('is-active');
        p.hidden = true;
      }
    });
    requestAnimationFrame(() => {
      tab.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
      menuTabsContainer.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' });
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      let idx = null;
      if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') idx = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') idx = 0;
      if (e.key === 'End') idx = tabs.length - 1;
      if (idx !== null) {
        e.preventDefault();
        tabs[idx].focus();
        activateTab(tabs[idx]);
      }
    });
  });

  /* ---------- Lazy loading con fade-in ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lazyImages = document.querySelectorAll('.gallery-grid img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.onload = () => img.classList.add('is-loaded');
            img.onerror = () => {
              img.alt = 'Imagen no disponible';
              img.classList.add('is-loaded');
            };
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '300px' });
    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.add('is-loaded');
    });
  }

  /* ---------- Galería: lightbox moderno ---------- */
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxSpinner = document.getElementById('lightboxSpinner');
  const galleryLinks = galleryGrid ? Array.from(galleryGrid.querySelectorAll('a')) : [];
  let currentIdx = 0;
  let lastFocused = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });
  }

  function showSpinner() {
    if (lightboxSpinner) lightboxSpinner.classList.add('is-visible');
  }
  function hideSpinner() {
    if (lightboxSpinner) lightboxSpinner.classList.remove('is-visible');
  }

  function updateLightbox(idx, direction) {
    if (idx < 0 || idx >= galleryLinks.length) return;
    currentIdx = idx;
    const link = galleryLinks[idx];
    const fullSrc = link.getAttribute('href');
    const img = link.querySelector('img');

    showSpinner();
    lightboxImg.classList.remove('is-loaded', 'lb-enter');

    preloadImage(fullSrc).then(() => {
      lightboxImg.src = fullSrc;
      lightboxImg.alt = img ? img.alt : '';
      hideSpinner();
      requestAnimationFrame(() => {
        lightboxImg.classList.add('is-loaded', 'lb-enter');
      });
    });

    lightboxCaption.textContent = link.dataset.caption || '';
    lightboxCounter.textContent = (idx + 1) + ' / ' + galleryLinks.length;

    if (direction !== 'none') {
      const offset = direction === 'next' ? 20 : -20;
      lightboxImg.style.transform = 'translateX(' + offset + 'px)';
      requestAnimationFrame(() => {
        lightboxImg.style.transform = '';
      });
    }

    preloadImage(galleryLinks[(idx + 1) % galleryLinks.length].getAttribute('href'));
    preloadImage(galleryLinks[(idx - 1 + galleryLinks.length) % galleryLinks.length].getAttribute('href'));
  }

  function openLightbox(link) {
    lastFocused = document.activeElement;
    currentIdx = galleryLinks.indexOf(link);
    if (currentIdx === -1) currentIdx = 0;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.classList.add('nav-open');
    updateLightbox(currentIdx, 'none');
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImg.src = '';
      lightboxImg.classList.remove('is-loaded', 'lb-enter');
    }, 300);
    if (lastFocused) lastFocused.focus();
  }

  function goNext() {
    const next = (currentIdx + 1) % galleryLinks.length;
    updateLightbox(next, 'next');
  }
  function goPrev() {
    const prev = (currentIdx - 1 + galleryLinks.length) % galleryLinks.length;
    updateLightbox(prev, 'prev');
  }

  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      openLightbox(link);
    });
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', goPrev);
  lightboxNext.addEventListener('click', goNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* --- Teclado: Escape, ArrowLeft, ArrowRight --- */
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    if (e.key === 'Tab') {
      const focusable = lightbox.querySelectorAll(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* --- Swipe touch en mobile --- */
  const lightboxStage = document.getElementById('lightboxStage');
  if (lightboxStage) {
    lightboxStage.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = false;
    }, { passive: true });

    lightboxStage.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        isSwiping = true;
        lightboxImg.style.transition = 'none';
        lightboxImg.style.transform = 'translateX(' + (dx * 0.5) + 'px)';
      }
    }, { passive: true });

    lightboxStage.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      const dx = e.changedTouches[0].clientX - touchStartX;
      lightboxImg.style.transition = '';
      lightboxImg.style.transform = '';
      if (dx < -50) goNext();
      else if (dx > 50) goPrev();
    }, { passive: true });
  }

  /* ---------- Revelado al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Toast de feedback ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg, duration = 2000) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duration);
  }

  /* ---------- Copiar teléfono al clickear tel: links ---------- */
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (isTouchDevice) return;
      e.preventDefault();
      const number = link.href.replace('tel:', '');
      navigator.clipboard.writeText(number).then(() => {
        showToast('Número copiado al portapapeles');
      }).catch(() => {
        showToast('Número: ' + number);
      });
    });
  });

  /* ---------- Buscador del menú ---------- */
  const menuSearch = document.getElementById('menuSearch');
  const menuPanels = document.querySelectorAll('.menu-panel');
  const menuTabsAll = document.querySelectorAll('.menu-tab');

  if (menuSearch) {
    menuSearch.addEventListener('input', () => {
      const q = menuSearch.value.trim().toLowerCase();
      if (!q) {
        menuPanels.forEach(p => {
          p.hidden = !p.classList.contains('is-active');
        });
        document.querySelectorAll('.menu-item').forEach(item => item.style.display = '');
        return;
      }
      menuPanels.forEach(p => p.hidden = false);
      document.querySelectorAll('.menu-item').forEach(item => {
        const name = (item.querySelector('.menu-item-name')?.textContent || '').toLowerCase();
        const desc = (item.querySelector('.menu-item-desc')?.textContent || '').toLowerCase();
        item.style.display = (name.includes(q) || desc.includes(q)) ? '' : 'none';
      });
    });

    menuTabsAll.forEach(tab => {
      tab.addEventListener('click', () => { menuSearch.value = ''; });
    });
  }

  /* ---------- Scroll-spy: enlace activo según sección visible ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

  if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spyObserver.observe(s));
  }
})();
