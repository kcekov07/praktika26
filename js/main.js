const root = document.documentElement;
const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const backToTop = document.querySelector('.back-to-top');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  root.classList.add('theme-light');
}

if (themeToggle) {
  themeToggle.setAttribute('aria-pressed', root.classList.contains('theme-light') ? 'true' : 'false');

  themeToggle.addEventListener('click', () => {
    root.classList.toggle('theme-light');
    const isLight = root.classList.contains('theme-light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  });
}

if (menuToggle && nav) {
  menuToggle.setAttribute('aria-expanded', 'false');

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

if (backToTop) {
  const toggleBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 420);
  };

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;

    const isOpen = item.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  button.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('.contact-form, form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      const hasValue = field.value.trim().length > 0;
      field.toggleAttribute('aria-invalid', !hasValue);
      if (!hasValue) isValid = false;
    });

    if (!isValid) {
      showToast('Моля, попълнете задължителните полета.');
      return;
    }

    showToast('Благодарим! Запитването е изпратено успешно.');
    form.reset();
  });
});

function showToast(message) {
  let toast = document.querySelector('.site-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.setAttribute('role', 'status');
    toast.style.position = 'fixed';
    toast.style.left = '50%';
    toast.style.bottom = '24px';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.padding = '0.9rem 1.1rem';
    toast.style.borderRadius = '14px';
    toast.style.background = 'linear-gradient(90deg, var(--accent2), var(--accent))';
    toast.style.color = '#fff';
    toast.style.fontWeight = '800';
    toast.style.boxShadow = '0 16px 40px rgba(0,0,0,.28)';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.style.zIndex = '1000';
    toast.style.transition = '.25s ease';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3200);
}
