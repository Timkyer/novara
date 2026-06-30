/* ===========================
   NOVARA CONSULTING – SCRIPT
   =========================== */

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navList.classList.toggle('open');
  document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
});

navList.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navList.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Counter animation
const counters = document.querySelectorAll('.stat__number');
let animated = false;

function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !animated) {
    animated = true;
    animateCounters();
  }
}, { threshold: 0.3 });
if (statsSection) observer.observe(statsSection);

// Scroll reveal
const revealEls = document.querySelectorAll('.service-card, .team-card, .about__grid, .stat');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// Contact form validation
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'name', errorId: 'nameError', msg: 'Bitte geben Sie Ihren Namen ein.' },
      { id: 'email', errorId: 'emailError', msg: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', type: 'email' },
      { id: 'message', errorId: 'messageError', msg: 'Bitte schreiben Sie eine Nachricht.' },
    ];

    fields.forEach(({ id, errorId, msg, type }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(errorId);
      let fieldValid = input.value.trim().length > 0;
      if (type === 'email') fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if (!fieldValid) {
        error.textContent = msg;
        input.classList.add('error');
        valid = false;
      } else {
        error.textContent = '';
        input.classList.remove('error');
      }
    });

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Wird gesendet…';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = 'Nachricht senden';
        btn.disabled = false;
        document.getElementById('formSuccess').textContent = 'Vielen Dank! Wir melden uns bald bei Ihnen.';
        setTimeout(() => { document.getElementById('formSuccess').textContent = ''; }, 5000);
      }, 1200);
    }
  });

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errorEl = document.getElementById(input.id + 'Error');
      if (errorEl) errorEl.textContent = '';
    });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}, { passive: true });
