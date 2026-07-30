const root = document.documentElement;
const loadingScreen = document.querySelector('.loading-screen');
const themeToggle = document.querySelector('[data-theme-toggle]');
const navToggle = document.querySelector('.menu-toggle');
const drawer = document.querySelector('.drawer');
const navLinks = document.querySelector('.nav-links');
const faqItems = document.querySelectorAll('.faq-item');
const backToTop = document.querySelector('.back-to-top');
const chatToggle = document.querySelector('.chat-toggle');
const chatWidget = document.querySelector('.chat-widget');
const formHandlers = document.querySelectorAll('[data-submit-toast]');
const toast = document.querySelector('.toast');
const searchInput = document.querySelector('[data-search]');
const cardsToSearch = document.querySelectorAll('[data-searchable]');
const testimonialTrack = document.querySelector('.testimonial-grid');
const counters = document.querySelectorAll('[data-count]');
const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal-content img');
const galleryImages = document.querySelectorAll('.gallery-card img');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function initTheme() {
  const saved = localStorage.getItem('aliens-theme');
  const nextTheme = saved === 'dark' ? 'dark' : 'light';
  root.setAttribute('data-theme', nextTheme);
  themeToggle?.setAttribute('aria-label', `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} mode`);
}

function toggleTheme() {
  const active = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', active);
  localStorage.setItem('aliens-theme', active);
  themeToggle?.setAttribute('aria-label', `Switch to ${active === 'dark' ? 'light' : 'dark'} mode`);
}

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach((item) => {
    const top = item.getBoundingClientRect().top;
    if (top < window.innerHeight - 70) item.classList.add('active');
  });
}

// initial reveal for hero and key elements
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(revealOnScroll, 120);
});

function setupFaq() {
  faqItems.forEach((item) => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach((entry) => entry.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
}

function setupBackToTop() {
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 500 ? 'grid' : 'none';
    document.querySelector('.header')?.classList.toggle('scrolled', window.scrollY > 12);
  });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupChat() {
  chatToggle?.addEventListener('click', () => chatWidget.classList.toggle('open'));
}

function setupForms() {
  formHandlers.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Thanks! Your request is on the way.');
      form.reset();
    });
  });
}

function setupSearch() {
  searchInput?.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    cardsToSearch.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

function setupCarousel() {
  const cards = Array.from(testimonialTrack?.children || []);
  if (!cards.length) return;
  cards.forEach((card, index) => {
    card.style.display = index === 0 ? 'block' : 'none';
  });
  let index = 0;
  setInterval(() => {
    cards[index].style.display = 'none';
    index = (index + 1) % cards.length;
    cards[index].style.display = 'block';
  }, 4000);
}

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.textContent.includes('%') ? '%' : counter.textContent.includes('+') ? '+' : '';
    const duration = 1200;
    const startTime = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      counter.textContent = `${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else counter.textContent = `${target}${suffix}`;
    };
    requestAnimationFrame(step);
  });
}

function setupGalleryModal() {
  galleryImages.forEach((img) => {
    img.addEventListener('click', () => {
      modalImage.src = img.src;
      modal.classList.add('open');
    });
  });
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('open');
  });
}

navToggle?.addEventListener('click', () => {
  if (!drawer) return;
  const isHidden = drawer.getAttribute('aria-hidden') === 'true';
  drawer.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
  if (isHidden) drawer.querySelector('a')?.focus();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) drawer?.setAttribute('aria-hidden', 'true');
});

initTheme();
revealOnScroll();
setupFaq();
setupBackToTop();
setupChat();
setupForms();
setupSearch();
setupCarousel();
animateCounters();
setupGalleryModal();
window.addEventListener('scroll', revealOnScroll);
themeToggle?.addEventListener('click', toggleTheme);
document.querySelector('.header')?.classList.toggle('scrolled', window.scrollY > 12);
setTimeout(() => loadingScreen?.classList.add('hidden'), 800);
