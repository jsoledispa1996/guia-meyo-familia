/* ============================================================
   MeYo Family – Global JS
   ============================================================ */

/* ---------- Mobile Menu ---------- */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    })
  );

  // Highlight active page
  const current = location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });
}

/* ---------- Toast Notification ---------- */
let toastTimer;
function showToast(msg, duration = 2200) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ---------- Copy Invite Code ---------- */
function initCopyCode() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ ¡Copiado!';
        btn.classList.add('copied');
        showToast('✅ Código copiado al portapapeles');
        setTimeout(() => {
          btn.textContent = '📋 Copiar código';
          btn.classList.remove('copied');
        }, 2500);
      });
    });
  });
}

/* ---------- Accordion ---------- */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body').classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        body.classList.add('open');
      }
    });
  });
}

/* ---------- Interactive Checklist ---------- */
function initChecklist() {
  document.querySelectorAll('.check-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const box = item.querySelector('.check-box');
      box.textContent = item.classList.contains('checked') ? '✓' : '';
      const allChecked = [...document.querySelectorAll('.check-item')]
        .every(i => i.classList.contains('checked'));
      if (allChecked) showToast('🎉 ¡Completaste todos los pasos!');
    });
  });
}

/* ---------- Scroll-reveal (lightweight) ---------- */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .feature-card, .rule-item, .accordion-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCopyCode();
  initAccordion();
  initChecklist();
  initScrollReveal();
});
