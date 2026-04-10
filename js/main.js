/**
 * Muhammad Raafay Khan — Portfolio
 * Navigation, copy-to-clipboard, scroll animations.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// =============================================================================
// Navigation
// =============================================================================

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}

const sections = document.querySelectorAll('main section[id], header[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let currentId = '';

  sections.forEach((section) => {
    if (section.offsetTop <= scrollY) {
      currentId = section.getAttribute('id') || '';
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${currentId}`);
  });
}

// =============================================================================
// Copy-to-clipboard
// =============================================================================

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      if (!value) return;

      const label = btn.querySelector('.copy-label');
      const originalLabel = label ? label.textContent : 'Copy';

      try {
        await navigator.clipboard.writeText(value);
        btn.classList.add('copied');
        if (label) label.textContent = 'Copied';
      } catch (err) {
        if (label) label.textContent = 'Press ⌘C';
      }

      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = originalLabel;
      }, 1800);
    });
  });
}

// =============================================================================
// Scroll animations (guarded for prefers-reduced-motion)
// =============================================================================

function initScrollAnimations() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${Math.min(index * 0.08, 0.4)}s`;
    observer.observe(item);
  });

  document.querySelectorAll('.stat').forEach((item, index) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${index * 0.08}s`;
    observer.observe(item);
  });
}

// =============================================================================
// Smooth scroll offset for sticky nav
// =============================================================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  });
});

// =============================================================================
// Utilities
// =============================================================================

function debounce(func, wait = 10) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// =============================================================================
// Boot
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCopyButtons();
  handleNavbarScroll();
  updateActiveNav();
});

window.addEventListener('scroll', debounce(handleNavbarScroll, 10), { passive: true });
window.addEventListener('scroll', debounce(updateActiveNav, 50), { passive: true });
