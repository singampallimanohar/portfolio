/* ==========================================================================
   PORTFOLIO JAVASCRIPT - Manohar Singampalli
   Features: Loader, Particles, Custom Cursor, Magnetic Buttons, Theme Toggle,
             Typing Effect, Scroll Reveal, Skill Filters, Project Filters,
             Counter Animation, GitHub Grid, Contact Form Validation,
             Ripple Effect, Scroll Progress, Back To Top
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. LOADING SCREEN
   -------------------------------------------------------------------------- */
(function initLoader() {
  const loader      = document.getElementById('loader');
  const fill        = document.getElementById('loader-fill');
  const percentText = document.getElementById('loader-percent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger scroll-reveal for already-visible elements
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
      }, 350);
    }
    fill.style.width        = progress + '%';
    percentText.textContent = Math.floor(progress) + '%';
  }, 80);
})();


/* --------------------------------------------------------------------------
   2. CANVAS PARTICLE ANIMATION
   -------------------------------------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Theme-aware colors
  function getParticleColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark
      ? ['rgba(56,189,248,', 'rgba(124,58,237,', 'rgba(6,214,160,']
      : ['rgba(2,132,199,', 'rgba(109,40,217,', 'rgba(5,150,105,'];
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 2 + 0.5;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.colorSet = getParticleColors();
      this.colorIdx = Math.floor(Math.random() * this.colorSet.length);
    }
    update() {
      // Subtle mouse repulsion
      const dx   = this.x - mouseX;
      const dy   = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.015;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.colorSet[this.colorIdx] + this.alpha + ')';
      ctx.fill();
    }
  }

  function buildParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  buildParticles();

  function drawConnections() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
          ctx.strokeStyle = isDark
            ? `rgba(56,189,248,${alpha})`
            : `rgba(2,132,199,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();


/* --------------------------------------------------------------------------
   3. CUSTOM MOUSE FOLLOWER
   -------------------------------------------------------------------------- */
(function initCursor() {
  const follower = document.getElementById('mouse-follower');
  const glow     = document.getElementById('cursor-glow');
  if (!follower || !glow) return;

  let fx = 0, fy = 0;    // follower position
  let gx = 0, gy = 0;    // glow position
  let mx = 0, my = 0;    // mouse position
  let isVisible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!isVisible) {
      follower.style.opacity = '1';
      glow.style.opacity     = '1';
      isVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    follower.style.opacity = '0';
    glow.style.opacity     = '0';
    isVisible = false;
  });

  // Hover expand effect for interactive elements
  const hoverTargets = 'a, button, .skill-card, .project-card, .service-card, .cert-card, .social-icon, .nav-logo';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('expand'));
    el.addEventListener('mouseleave', () => follower.classList.remove('expand'));
  });

  // Smooth animation loop
  function tick() {
    // Follower: fast trail
    fx += (mx - fx) * 0.18;
    fy += (my - fy) * 0.18;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';

    // Glow: slow drift
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';

    requestAnimationFrame(tick);
  }
  tick();
})();


/* --------------------------------------------------------------------------
   4. MAGNETIC BUTTON EFFECT
   -------------------------------------------------------------------------- */
(function initMagneticButtons() {
  const MAGNET_STRENGTH = 0.35;
  const MAGNET_RADIUS   = 80;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAGNET_RADIUS) {
        const px = dx * MAGNET_STRENGTH;
        const py = dy * MAGNET_STRENGTH;
        el.style.transform = `translate(${px}px, ${py}px) scale(1.05)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.15s ease';
    });
  });
})();


/* --------------------------------------------------------------------------
   5. RIPPLE EFFECT ON BUTTONS
   -------------------------------------------------------------------------- */
(function initRipple() {
  document.querySelectorAll('.btn, .filter-btn, .project-filter-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 2;

      ripple.className          = 'ripple';
      ripple.style.width        = size + 'px';
      ripple.style.height       = size + 'px';
      ripple.style.left         = (x - size / 2) + 'px';
      ripple.style.top          = (y - size / 2) + 'px';

      this.style.position       = 'relative';
      this.style.overflow       = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
})();


/* --------------------------------------------------------------------------
   6. DARK / LIGHT THEME TOGGLE
   -------------------------------------------------------------------------- */
(function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const html        = document.documentElement;

  // Restore from localStorage
  const saved = localStorage.getItem('ms-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('ms-theme', next);

      // Animate icon
      themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
      setTimeout(() => { themeToggle.style.transform = ''; }, 450);
    });
  }
})();


/* --------------------------------------------------------------------------
   7. STICKY NAVBAR – SCROLL & MOBILE MENU
   -------------------------------------------------------------------------- */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  // Scroll state toggle
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  });

  // Mobile hamburger toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      }
    });
  }
})();

// Active nav link tracker
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) {
      current = sec.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}


/* --------------------------------------------------------------------------
   8. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = percentage + '%';
  }, { passive: true });
})();


/* --------------------------------------------------------------------------
   9. SMOOTH SCROLL FOR ANCHOR LINKS
   -------------------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    const target   = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* --------------------------------------------------------------------------
   10. SCROLL REVEAL - INTERSECTION OBSERVER
   -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Observe all .reveal elements once loader is done (fired in loader callback)


/* --------------------------------------------------------------------------
   11. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('active', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* --------------------------------------------------------------------------
   12. TYPING EFFECT
   -------------------------------------------------------------------------- */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Full Stack Web Developer',
    'PHP Developer',
    'JavaScript Developer',
    'UI/UX Enthusiast'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function type() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(type, isDeleting ? 55 : 100);
  }

  setTimeout(type, 1200);
})();


/* --------------------------------------------------------------------------
   13. COUNTER ANIMATION (ABOUT SECTION STATS)
   -------------------------------------------------------------------------- */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-grid').forEach(el => counterObserver.observe(el));


/* --------------------------------------------------------------------------
   14. SKILL BAR PROGRESS ANIMATION
   -------------------------------------------------------------------------- */
const skillBarObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-progress-fill').forEach(bar => {
        const targetWidth = bar.getAttribute('data-width') || '0%';
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
      });
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-grid').forEach(el => skillBarObserver.observe(el));


/* --------------------------------------------------------------------------
   15. SKILLS FILTER
   -------------------------------------------------------------------------- */
(function initSkillFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category') || 'all';
        const show     = filter === 'all' || category.includes(filter);

        if (show) {
          card.style.animation = 'none';
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.85) translateY(20px)';
          card.style.display   = 'flex';
          // Force reflow
          card.offsetHeight;
          card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'scale(1) translateY(0)';
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.85) translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 320);
        }
      });
    });
  });
})();


/* --------------------------------------------------------------------------
   16. PROJECTS FILTER
   -------------------------------------------------------------------------- */
(function initProjectFilter() {
  const filterBtns   = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const show     = filter === 'all' || category.includes(filter);

        if (show) {
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.88) translateY(24px)';
          card.style.display   = 'flex';
          card.offsetHeight; // reflow
          card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'scale(1) translateY(0)';
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.88) translateY(24px)';
          setTimeout(() => { card.style.display = 'none'; }, 320);
        }
      });
    });
  });
})();


/* --------------------------------------------------------------------------
   17. FLIP AVATAR CARD (HERO)
   -------------------------------------------------------------------------- */
(function initAvatarCard() {
  const card = document.getElementById('hero-avatar-card');
  if (!card) return;

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
})();


/* --------------------------------------------------------------------------
   18. GITHUB CONTRIBUTION GRID GENERATOR
   -------------------------------------------------------------------------- */
(function generateGitHubGrid() {
  const grid = document.getElementById('github-grid');
  if (!grid) return;

  const WEEKS   = 52;
  const DAYS    = 7;
  const TOTAL   = WEEKS * DAYS;

  // Simulated activity with weighted random
  function getLevel() {
    const r = Math.random();
    if (r < 0.38) return 0;
    if (r < 0.58) return 1;
    if (r < 0.76) return 2;
    if (r < 0.90) return 3;
    return 4;
  }

  for (let i = 0; i < TOTAL; i++) {
    const day = document.createElement('div');
    day.className = `contrib-day level-${getLevel()}`;

    // Tooltip-style title
    const weekNum = Math.floor(i / DAYS);
    const dayNum  = i % DAYS;
    const days    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    day.title     = `${days[dayNum]}, Week ${weekNum + 1}`;

    grid.appendChild(day);
  }
})();


/* --------------------------------------------------------------------------
   19. CONTACT FORM VALIDATION & SUBMIT
   -------------------------------------------------------------------------- */
(function initContactForm() {
  const form      = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  const closeBtn  = document.getElementById('btn-close-success');
  const submitBtn = document.getElementById('btn-submit');

  if (!form) return;

  // Real-time validation
  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;
    let valid = true;
    if (input.required && !input.value.trim()) valid = false;
    if (input.type === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value)) valid = false;
    }
    group.classList.toggle('invalid', !valid);
    return valid;
  }

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => validateField(input));
    input.addEventListener('blur',  () => validateField(input));
  });

  // Form submit — real POST via fetch to FormSubmit.co
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all fields first
    let allValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
      if (!validateField(input)) allValid = false;
    });
    if (!allValid) return;

    // Loading state
    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    // Build form data as JSON for FormSubmit AJAX mode
    const data = {
      Name:    form.querySelector('#name').value.trim(),
      Email:   form.querySelector('#email').value.trim(),
      Subject: form.querySelector('#subject').value.trim(),
      Message: form.querySelector('#message').value.trim(),
      _subject: '📩 New Portfolio Contact — ' + form.querySelector('#subject').value.trim(),
      _captcha: 'false',
      _template: 'table',
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/singampallimanohar6@gmail.com', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data),
      });

      const json = await res.json();

      if (json.success === 'true' || json.success === true) {
        // Success — show overlay, reset form
        form.reset();
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));
        if (successEl) successEl.classList.add('active');
      } else {
        throw new Error('FormSubmit returned failure');
      }
    } catch (err) {
      alert('⚠️ Something went wrong. Please email me directly at singampallimanohar6@gmail.com');
      console.error('FormSubmit error:', err);
    } finally {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled  = false;
    }
  });

  // Close success overlay
  if (closeBtn && successEl) {
    closeBtn.addEventListener('click', () => successEl.classList.remove('active'));
  }
})();


/* --------------------------------------------------------------------------
   20. PARALLAX EFFECT FOR HERO BLOBS
   -------------------------------------------------------------------------- */
(function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY * 0.15;
        blobs.forEach((blob, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          blob.style.transform = `translateY(${sy * dir}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* --------------------------------------------------------------------------
   21. EXPERIENCE CARD SCROLL REVEAL (STAGGER)
   -------------------------------------------------------------------------- */
(function initExperienceReveal() {
  const cards = document.querySelectorAll('.experience-card');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 150);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(40px)';
    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    obs.observe(card);
  });
})();


/* --------------------------------------------------------------------------
   22. HOVER GLOW TRAIL ON SECTION CARDS (SERVICE, CERT)
   -------------------------------------------------------------------------- */
(function initCardGlowTrail() {
  const cards = document.querySelectorAll('.service-card, .cert-card, .experience-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, var(--card-bg-hover) 0%, var(--card-bg) 80%)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* --------------------------------------------------------------------------
   23. PROJECT CARD 3D TILT EFFECT
   -------------------------------------------------------------------------- */
(function initProjectTilt() {
  const cards  = document.querySelectorAll('.project-card');
  const FACTOR = 8; // degrees max

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -FACTOR;
      const rotY  = ((e.clientX - cx) / (rect.width  / 2)) *  FACTOR;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.175,0.885,0.32,1.275)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();


/* --------------------------------------------------------------------------
   24. ABOUT TIMELINE ITEM STAGGER REVEAL
   -------------------------------------------------------------------------- */
(function initTimelineReveal() {
  const items = document.querySelectorAll('.about-timeline-item');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 180);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => {
    item.style.opacity    = '0';
    item.style.transform  = 'translateX(-30px)';
    item.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    obs.observe(item);
  });
})();


/* --------------------------------------------------------------------------
   25. EDUCATION TIMELINE NODE STAGGER
   -------------------------------------------------------------------------- */
(function initEducationReveal() {
  const nodes = document.querySelectorAll('.timeline-node');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 220);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  nodes.forEach(node => {
    node.style.opacity    = '0';
    node.style.transform  = 'translateY(40px)';
    node.style.transition = 'opacity 0.75s ease, transform 0.75s ease';
    obs.observe(node);
  });
})();


/* --------------------------------------------------------------------------
   26. SERVICE CARD STAGGER ENTRANCE
   -------------------------------------------------------------------------- */
(function initServiceReveal() {
  const cards = document.querySelectorAll('.service-card');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'scale(1) translateY(0)';
        }, i * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.9) translateY(30px)';
    card.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    obs.observe(card);
  });
})();


/* --------------------------------------------------------------------------
   27. CERT CARD STAGGER ENTRANCE
   -------------------------------------------------------------------------- */
(function initCertReveal() {
  const cards = document.querySelectorAll('.cert-card');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'scale(1) translateY(0)';
        }, i * 150);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.88) translateY(30px)';
    card.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    obs.observe(card);
  });
})();


/* --------------------------------------------------------------------------
   28. PROJECT CARD STAGGER ENTRANCE
   -------------------------------------------------------------------------- */
(function initProjectReveal() {
  const cards = document.querySelectorAll('.project-card');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'scale(1) translateY(0)';
        }, i * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  cards.forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.88) translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(card);
  });
})();


/* --------------------------------------------------------------------------
   29. SKILL CARD STAGGER ENTRANCE
   -------------------------------------------------------------------------- */
(function initSkillReveal() {
  const cards = document.querySelectorAll('.skill-card');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'scale(1) translateY(0)';
        }, i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.88) translateY(25px)';
    card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    obs.observe(card);
  });
})();


/* --------------------------------------------------------------------------
   30. FOOTER LINKS HOVER UNDERLINE SLIDE EFFECT
   -------------------------------------------------------------------------- */
document.querySelectorAll('.footer-nav a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.paddingLeft = '6px';
  });
  link.addEventListener('mouseleave', () => {
    link.style.paddingLeft = '0px';
  });
});


/* --------------------------------------------------------------------------
   31. INIT ALL ON DOM READY
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Trigger nav highlight once
  updateActiveNavLink();

  // Observe all reveal elements (also called once loader finishes)
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Disable animations for users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.float-anim, .blob, .avatar-ring').forEach(el => {
      el.style.animation = 'none';
    });
  }

  /* -----------------------------------------------------------------------
     32. LAZY-LOAD IMAGE .loaded CLASS
     Adds `.loaded` so CSS opacity fade-in kicks in after image loads.
     ----------------------------------------------------------------------- */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded')); // graceful fail
    }
  });

  /* -----------------------------------------------------------------------
     33. MOBILE VIEWPORT HEIGHT FIX (--vh custom property)
     Fixes the iOS safari 100vh bug so full-screen hero looks correct.
     ----------------------------------------------------------------------- */
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);

  /* -----------------------------------------------------------------------
     34. NAV OVERLAY BACKDROP (tapping outside closes mobile menu)
     Creates a semi-transparent overlay behind the open drawer.
     ----------------------------------------------------------------------- */
  const overlay = document.createElement('div');
  overlay.id    = 'nav-overlay';
  Object.assign(overlay.style, {
    position:   'fixed',
    inset:      '0',
    background: 'rgba(5, 8, 22, 0.55)',
    zIndex:     '999',
    opacity:    '0',
    visibility: 'hidden',
    transition: 'opacity 0.35s ease, visibility 0.35s ease',
    backdropFilter: 'blur(2px)',
  });
  document.body.appendChild(overlay);

  const navLinks  = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');

  function openDrawer()  {
    overlay.style.opacity    = '1';
    overlay.style.visibility = 'visible';
  }
  function closeDrawer() {
    overlay.style.opacity    = '0';
    overlay.style.visibility = 'hidden';
    if (navLinks)  navLinks.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks && navLinks.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }
  overlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeDrawer));

  /* -----------------------------------------------------------------------
     35. SKILL CARD GLOW COLOUR SYNC ON HOVER
     Makes the neon glow behind each card match its icon colour.
     ----------------------------------------------------------------------- */
  const glowMap = {
    backend:  'rgba(55, 118, 171, 0.35)',   // Python blue
    mobile:   'rgba(2, 86, 155, 0.35)',     // Flutter blue
    frontend: 'rgba(227, 79, 38, 0.30)',    // HTML orange-ish (default)
    'ai-ml':  'rgba(6, 214, 160, 0.30)',    // accent teal
    tools:    'rgba(240, 80, 50, 0.30)',     // git red
  };

  document.querySelectorAll('.skill-card').forEach(card => {
    const cat   = card.getAttribute('data-category') || 'frontend';
    const color = glowMap[cat] || glowMap['frontend'];

    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 20px 50px -10px ${color}, 0 0 0 1px rgba(255,255,255,0.06)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  /* -----------------------------------------------------------------------
     36. SECTION ACTIVE HIGHLIGHT IN PROGRESS BAR COLOUR
     Smoothly changes scroll-progress bar colour as user scrolls sections.
     ----------------------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');
  const sectionGrads = [
    { id: 'home',           grad: 'linear-gradient(90deg, #38bdf8, #7c3aed)' },
    { id: 'about',          grad: 'linear-gradient(90deg, #06d6a0, #38bdf8)' },
    { id: 'skills',         grad: 'linear-gradient(90deg, #7c3aed, #38bdf8)' },
    { id: 'experience',     grad: 'linear-gradient(90deg, #38bdf8, #06d6a0)' },
    { id: 'projects',       grad: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
    { id: 'education',      grad: 'linear-gradient(90deg, #06d6a0, #7c3aed)' },
    { id: 'certifications', grad: 'linear-gradient(90deg, #38bdf8, #f59e0b)' },
    { id: 'services',       grad: 'linear-gradient(90deg, #7c3aed, #06d6a0)' },
    { id: 'github',         grad: 'linear-gradient(90deg, #06d6a0, #38bdf8)' },
    { id: 'contact',        grad: 'linear-gradient(90deg, #38bdf8, #7c3aed)' },
  ];

  if (progressBar) {
    window.addEventListener('scroll', () => {
      let currentGrad = sectionGrads[0].grad;
      sectionGrads.forEach(({ id, grad }) => {
        const sec = document.getElementById(id);
        if (sec && window.scrollY >= sec.offsetTop - 200) {
          currentGrad = grad;
        }
      });
      progressBar.style.background = currentGrad;
    }, { passive: true });
  }
});

