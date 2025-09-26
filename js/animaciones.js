
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const respectsMotion = () => !motionQuery.matches;

const revealTargets = document.querySelectorAll('[data-observer-target]');

const animations = {
  rise: [
    { opacity: 0, transform: 'translateY(28px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  'fade-up': [
    { opacity: 0, transform: 'translateY(24px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  'fade-right': [
    { opacity: 0, transform: 'translateX(-28px)' },
    { opacity: 1, transform: 'translateX(0)' }
  ],
  'fade-down': [
    { opacity: 0, transform: 'translateY(-24px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ]
};

if (revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add('is-visible');
        if (respectsMotion()) {
          const type = target.dataset.animate && animations[target.dataset.animate] ? target.dataset.animate : 'rise';
          const keyframes = animations[type];
          target.animate(keyframes, {
            duration: 560,
            easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
            fill: 'both'
          });
        }
        obs.unobserve(target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  revealTargets.forEach((node) => observer.observe(node));
}

// Parallax ligero en hero
const parallaxSections = document.querySelectorAll('[data-parallax-container]');
let parallaxRaf = null;

const updateParallax = () => {
  parallaxRaf = null;
  if (!respectsMotion()) return;
  parallaxSections.forEach((section) => {
    const media = section.querySelector('.hero-image');
    if (!media) return;
    const rect = section.getBoundingClientRect();
    const offset = rect.top * 0.08;
    media.style.transform = `scale(1.05) translateY(${offset}px)`;
  });
};

const onScroll = () => {
  if (parallaxRaf || !parallaxSections.length) return;
  parallaxRaf = requestAnimationFrame(updateParallax);
};

if (parallaxSections.length) {
  updateParallax();
  window.addEventListener('scroll', onScroll, { passive: true });
}

const motionChangeHandler = () => {
  if (!respectsMotion()) {
    parallaxSections.forEach((section) => {
      const media = section.querySelector('.hero-image');
      if (media) {
        media.style.transform = '';
      }
    });
  } else {
    updateParallax();
  }
};

if (typeof motionQuery.addEventListener === 'function') {
  motionQuery.addEventListener('change', motionChangeHandler);
} else if (typeof motionQuery.addListener === 'function') {
  motionQuery.addListener(motionChangeHandler);
}

// Contadores animados con requestAnimationFrame
const counters = document.querySelectorAll('[data-counter]');

if (counters.length) {
  const animateCounter = (element) => {
    const targetValue = Number(element.getAttribute('data-counter-target')) || 0;
    const suffix = element.getAttribute('data-counter-suffix') ?? '';
    const duration = 1800;
    const decimals = Number.isInteger(targetValue) ? 0 : 1;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = progress < 1 ? 1 - Math.pow(1 - progress, 3) : 1;
      const current = targetValue * eased;
      const valueNode = element.querySelector('.stat-chip__value');
      if (valueNode) {
        valueNode.textContent = `${current.toFixed(decimals)}${suffix}`;
      }
      if (progress < 1 && respectsMotion()) {
        requestAnimationFrame(step);
      } else if (valueNode) {
        valueNode.textContent = `${targetValue.toFixed(decimals)}${suffix}`;
      }
    };

    if (respectsMotion()) {
      requestAnimationFrame(step);
    } else {
      const valueNode = element.querySelector('.stat-chip__value');
      if (valueNode) {
        valueNode.textContent = `${targetValue}${suffix}`;
      }
    }
  };

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        if (target.dataset.animated) return;
        animateCounter(target);
        target.dataset.animated = 'true';
        obs.unobserve(target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}
