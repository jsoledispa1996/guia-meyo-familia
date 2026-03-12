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

  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    })
  );

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
        const original = btn.innerHTML;
        btn.textContent = '✓ ¡Copiado!';
        btn.classList.add('copied');
        showToast('✅ Código copiado al portapapeles');
        setTimeout(() => {
          btn.innerHTML = original;
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

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body').classList.remove('open');
      });

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
      if (allChecked) {
        showToast('🎉 ¡Completaste todos los pasos!');
        launchConfetti();
      }
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

/* ============================================================
   NEW: Onboarding & Animation Features
   ============================================================ */

/* ---------- Typing Effect (Hero subtitle) ---------- */
function initTypingEffect() {
  const el = document.getElementById('typing-target');
  if (!el) return;

  const lines = JSON.parse(el.dataset.lines || '[]');
  if (!lines.length) return;

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(cursor);

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const current = lines[lineIndex];
    if (isDeleting) {
      el.firstChild && el.firstChild.nodeType === 3
        ? (el.firstChild.textContent = current.slice(0, --charIndex))
        : (charIndex = 0);
    } else {
      const textNode = el.firstChild && el.firstChild.nodeType === 3
        ? el.firstChild : el.insertBefore(document.createTextNode(''), cursor);
      textNode.textContent = current.slice(0, ++charIndex);
    }

    if (!isDeleting && charIndex === current.length) {
      if (lines.length === 1) return; // single line — stop
      pauseTimer = setTimeout(() => { isDeleting = true; requestAnimationFrame(type); }, 1800);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
    }

    const speed = isDeleting ? 40 : 65;
    pauseTimer = setTimeout(() => requestAnimationFrame(type), speed);
  }

  // small delay before starting
  setTimeout(type, 500);
}

/* ---------- Animated Progress Line Fill ---------- */
function initProgressFill() {
  // Fill lines before the active step
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;

  const steps = [...bar.querySelectorAll('.progress-step')];
  const lines = [...bar.querySelectorAll('.progress-line')];
  const activeIdx = steps.findIndex(s => s.classList.contains('active'));

  lines.forEach((line, i) => {
    if (i < activeIdx) {
      setTimeout(() => line.classList.add('filled'), 300 + i * 200);
    }
  });
}

/* ---------- Onboarding Modal (First Visit) ---------- */
function initOnboardingModal() {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) return;

  const isIndex  = (location.pathname.split('/').pop() || 'index.html') === 'index.html';
  const seen     = localStorage.getItem('meyo_onboarding_seen');

  // Show only on index.html for first-time visitors
  if (!isIndex || seen) return;

  const modal    = overlay.querySelector('.onboarding-modal');
  const closeBtn = overlay.querySelector('.onboarding-dismiss');
  const ctaBtn   = overlay.querySelector('.onboarding-cta');

  function openModal() {
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    localStorage.setItem('meyo_onboarding_seen', '1');
    // Show the floating help button after dismiss
    const fab = document.getElementById('float-new-btn');
    if (fab) fab.classList.remove('hidden');
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  ctaBtn.addEventListener('click', () => {
    closeModal();
    window.location.href = 'bienvenida.html';
  });

  // Delay modal slightly for a smoother experience
  setTimeout(openModal, 900);
}

/* ---------- Floating "¿Eres Nuevo?" Button ---------- */
function initFloatingBtn() {
  const fab = document.getElementById('float-new-btn');
  if (!fab) return;

  const isIndex = (location.pathname.split('/').pop() || 'index.html') === 'index.html';
  const seen    = localStorage.getItem('meyo_onboarding_seen');

  // Hide on non-index pages or if modal hasn't been seen yet (modal handles it)
  if (!isIndex) { fab.classList.add('hidden'); return; }
  if (!seen)    { fab.classList.add('hidden'); } // modal will reveal it after close

  fab.addEventListener('click', () => {
    // Re-open the onboarding overlay if it exists
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    } else {
      window.location.href = 'bienvenida.html';
    }
  });
}

/* ---------- Confetti Launcher ---------- */
function launchConfetti() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
  }
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const colors = ['#7c3aed','#a855f7','#f0c040','#10b981','#f97316','#c026d3'];
  const pieces = Array.from({ length: 120 }, () => ({
    x:  Math.random() * canvas.width,
    y: -20 - Math.random() * 80,
    r:  4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy: 2.5 + Math.random() * 3,
    vx: (Math.random() - .5) * 4,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - .5) * 6,
    shape: Math.random() > .5 ? 'circle' : 'rect',
  }));

  let animId;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotSpeed;
      p.vy  += 0.06; // gravity
      if (p.y < canvas.height + 20) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height);
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      }
      ctx.restore();
    });
    if (alive) animId = requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.remove(); }
  }

  draw();
  setTimeout(() => { cancelAnimationFrame(animId); canvas.remove(); }, 4000);
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCopyCode();
  initAccordion();
  initChecklist();
  initScrollReveal();
  initTypingEffect();
  initProgressFill();
  initOnboardingModal();
  initFloatingBtn();
});
