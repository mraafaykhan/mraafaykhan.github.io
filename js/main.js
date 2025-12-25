/**
 * Personal Portfolio - Main JavaScript
 * Handles: Navigation, GitHub API, Scroll Animations
 */

// =============================================================================
// DOM Elements
// =============================================================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const projectsGrid = document.getElementById('projects-grid');
const sectionSubtitle = document.querySelector('.section-subtitle');

// =============================================================================
// Navigation
// =============================================================================

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Navbar background on scroll
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.95)';
  } else {
    navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.85)';
  }

  // Hide/show navbar on scroll
  if (window.scrollY > lastScrollY && window.scrollY > 300) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = window.scrollY;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.style.color = '#58a6ff';
        } else {
          link.style.color = '';
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// =============================================================================
// GitHub API - Fetch Repositories
// =============================================================================

const GITHUB_USERNAME = 'mraafaykhan';
const REPOS_TO_SHOW = 6;

async function fetchGitHubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPOS_TO_SHOW}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();

    // Filter out forks and sort by stars
    const filteredRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, REPOS_TO_SHOW);

    renderProjects(filteredRepos);

    if (sectionSubtitle) {
      sectionSubtitle.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    renderFallbackProjects();
  }
}

function renderProjects(repos) {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = repos.map(repo => `
    <article class="project-card fade-in">
      <div class="project-header">
        <svg class="project-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
        </svg>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View repository">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          ${repo.homepage ? `
          <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View live site">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
          ` : ''}
        </div>
      </div>
      <h3 class="project-title">${repo.name}</h3>
      <p class="project-description">${repo.description || 'No description available'}</p>
      <div class="project-tech">
        ${repo.language ? `<span class="project-tech-tag">${repo.language}</span>` : ''}
      </div>
      <div class="project-stats">
        <span class="project-stat">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
          </svg>
          ${repo.stargazers_count}
        </span>
        <span class="project-stat">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M21 3c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.323.861 2.433 2.05 2.832.168 4.295-2.021 4.764-4.998 5.391-1.709.36-3.642.775-5.052 2.085v-7.492c1.163-.413 2-1.511 2-2.816 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.305.837 2.403 2 2.816v12.367c-1.163.414-2 1.512-2 2.817 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.295-.824-2.388-1.973-2.808.27-3.922 2.57-4.408 5.437-5.012 3.038-.64 6.774-1.442 6.579-7.377 1.141-.425 1.957-1.514 1.957-2.803zm-16.8 0c0-.993.807-1.8 1.8-1.8s1.8.807 1.8 1.8-.807 1.8-1.8 1.8-1.8-.807-1.8-1.8zm3.6 18c0 .993-.807 1.8-1.8 1.8s-1.8-.807-1.8-1.8.807-1.8 1.8-1.8 1.8.807 1.8 1.8z"/>
          </svg>
          ${repo.forks_count}
        </span>
      </div>
    </article>
  `).join('');

  // Trigger animations after rendering
  setTimeout(() => {
    document.querySelectorAll('.project-card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100);
    });
  }, 100);
}

function renderFallbackProjects() {
  if (!projectsGrid) return;

  if (sectionSubtitle) {
    sectionSubtitle.textContent = 'Unable to load repositories. Visit my GitHub profile to see my work.';
  }

  projectsGrid.innerHTML = `
    <div class="project-card fade-in visible" style="grid-column: 1 / -1; text-align: center;">
      <p class="project-description">
        Check out my projects on
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer">GitHub</a>
      </p>
    </div>
  `;
}

// =============================================================================
// Scroll Animations
// =============================================================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with fade-in class
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Add fade-in to sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Add fade-in to timeline items
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  // Add fade-in to skill categories
  document.querySelectorAll('.skill-category').forEach((item, index) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${index * 0.05}s`;
    observer.observe(item);
  });

  // Add fade-in to highlight cards
  document.querySelectorAll('.highlight-card').forEach((item, index) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });
}

// =============================================================================
// Smooth Scroll for Anchor Links
// =============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// =============================================================================
// Typing Effect for Hero (Optional Enhancement)
// =============================================================================

function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// =============================================================================
// Initialize
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Fetch GitHub repos
  fetchGitHubRepos();

  // Initialize scroll animations
  initScrollAnimations();

  // Update active nav on load
  updateActiveNav();

  // Log a fun message
  console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold;');
  console.log('%cThanks for checking out my portfolio.', 'font-size: 14px;');
  console.log('%cFeel free to reach out: raafayrashid@gmail.com', 'font-size: 12px; color: #58a6ff;');
});

// =============================================================================
// Performance: Debounce scroll events
// =============================================================================

function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-intensive operations
window.addEventListener('scroll', debounce(updateActiveNav, 50));
