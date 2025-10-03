
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const updateMotionPreference = () => {
  document.body.dataset.motion = prefersReducedMotion.matches ? 'reduced' : 'full';
};

updateMotionPreference();
if (typeof prefersReducedMotion.addEventListener === 'function') {
  prefersReducedMotion.addEventListener('change', updateMotionPreference, { passive: true });
} else if (typeof prefersReducedMotion.addListener === 'function') {
  prefersReducedMotion.addListener(updateMotionPreference);
}

const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.querySelector('[data-nav-container]');
const focusableNavItems = () => Array.from(navLinksContainer?.querySelectorAll('a, button') ?? []);

const closeNavigation = () => {
  if (!navToggle || !navLinksContainer) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navLinksContainer.classList.remove('is-open');
};

const openNavigation = () => {
  if (!navToggle || !navLinksContainer) return;
  navToggle.setAttribute('aria-expanded', 'true');
  navLinksContainer.classList.add('is-open');
};

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    closeNavigation();
  } else {
    openNavigation();
    focusableNavItems()[0]?.focus({ preventScroll: true });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNavigation();
  }
});

document.addEventListener('click', (event) => {
  if (!navLinksContainer || !navToggle) return;
  if (event.target === navToggle || navToggle.contains(event.target)) return;
  if (navLinksContainer.contains(event.target)) return;
  closeNavigation();
});

navLinksContainer?.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof Element && target.tagName === 'A') {
    closeNavigation();
  }
});

// Scrollspy para secciones mediante IntersectionObserver
const sectionObserverTargets = document.querySelectorAll('[data-section]');
const navLinks = document.querySelectorAll('[data-scroll-link]');

if (sectionObserverTargets.length && navLinks.length) {
  const sectionMap = new Map();
  navLinks.forEach((link) => {
    if (!(link instanceof HTMLElement)) return;
    const key = link.dataset.scrollLink;
    if (!key) return;
    sectionMap.set(key, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const key = entry.target.getAttribute('data-section');
        if (!key) return;
        const link = sectionMap.get(key);
        if (!link) return;
        navLinks.forEach((navLink) => {
          const isTarget = navLink === link;
          navLink.classList.toggle('is-active', isTarget);
          if (navLink instanceof HTMLElement && navLink.dataset.scrollLink) {
            if (isTarget) {
              navLink.setAttribute('aria-current', 'page');
            } else {
              navLink.removeAttribute('aria-current');
            }
          }
        });
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0.25 }
  );

  sectionObserverTargets.forEach((section) => observer.observe(section));
}

// Ver más / Ver menos con animación de altura
const animateHeight = (element, expand) => {
  if (prefersReducedMotion.matches) {
    element.style.height = '';
    element.hidden = !expand;
    return;
  }

  const start = expand ? 0 : element.scrollHeight;
  const end = expand ? element.scrollHeight : 0;
  if (expand) {
    element.hidden = false;
  }

  const animation = element.animate(
    [
      { height: `${start}px` },
      { height: `${end}px` }
    ],
    {
      duration: 320,
      easing: 'cubic-bezier(0.33, 1, 0.68, 1)'
    }
  );

  animation.onfinish = () => {
    element.style.height = '';
    if (!expand) {
      element.hidden = true;
    }
  };
};

const readmoreBlocks = document.querySelectorAll('[data-readmore-container]');

readmoreBlocks.forEach((container) => {
  const button = container.querySelector('.readmore-toggle');
  const content = container.querySelector('.readmore-content');
  if (!(button instanceof HTMLButtonElement) || !(content instanceof HTMLElement)) return;

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', (!isExpanded).toString());
    animateHeight(content, !isExpanded);
    button.textContent = isExpanded ? 'Ver más' : 'Ver menos';
  });
});

// Botón volver arriba
const topButton = document.querySelector('.btn-top');
const toggleTopButton = () => {
  if (!topButton) return;
  const shouldShow = window.scrollY > 320;
  topButton.classList.toggle('is-visible', shouldShow);
};

toggleTopButton();
window.addEventListener('scroll', toggleTopButton, { passive: true });

topButton?.addEventListener('click', () => {
  if (prefersReducedMotion.matches) {
    window.scrollTo(0, 0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
