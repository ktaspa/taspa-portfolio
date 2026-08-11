// =============================================
// KAPIL TASPA — main.js v5
// Background canvas: grid + particles only
// Blob frame: pure CSS keyframes
// =============================================

// ── Typing animation ──────────────────────────
const roles = ['Data Scientist', 'AI Builder', 'Founder', 'Product Engineer'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');

function typeLoop() {
  if (!typedEl) return;
  const cur = roles[roleIdx];
  typedEl.textContent = deleting ? cur.slice(0, --charIdx) : cur.slice(0, ++charIdx);
  if (!deleting && charIdx === cur.length) { deleting = true; setTimeout(typeLoop, 1900); return; }
  if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  setTimeout(typeLoop, deleting ? 40 : 76);
}
typeLoop();

// ── BACKGROUND CANVAS (grid + floating particles) ─
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx    = bgCanvas.getContext('2d');
const CYAN     = '0,194,255';
const GRID     = 60;

function resizeBg() {
  bgCanvas.width  = bgCanvas.offsetWidth;
  bgCanvas.height = bgCanvas.offsetHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

// Floating particles
const particles = Array.from({ length: 45 }, () => ({
  x:  Math.random() * 1600,
  y:  Math.random() * 900,
  r:  Math.random() * 1.5 + 0.4,
  vx: (Math.random() - 0.5) * 0.22,
  vy: (Math.random() - 0.5) * 0.22,
  a:  Math.random() * 0.32 + 0.06,
}));

function drawBackground() {
  const w = bgCanvas.width, h = bgCanvas.height;
  bgCtx.clearRect(0, 0, w, h);

  // Base dark gradient
  const bg = bgCtx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0,    '#060A0F');
  bg.addColorStop(0.45, '#081018');
  bg.addColorStop(1,    '#060A0F');
  bgCtx.fillStyle = bg;
  bgCtx.fillRect(0, 0, w, h);

  // Top-right cyan glow
  const g1 = bgCtx.createRadialGradient(w * 0.82, h * 0.08, 0, w * 0.82, h * 0.08, w * 0.5);
  g1.addColorStop(0,   `rgba(${CYAN}, 0.13)`);
  g1.addColorStop(0.5, `rgba(${CYAN}, 0.04)`);
  g1.addColorStop(1,   'transparent');
  bgCtx.fillStyle = g1;
  bgCtx.fillRect(0, 0, w, h);

  // Bottom-left blue glow
  const g2 = bgCtx.createRadialGradient(w * 0.08, h * 0.9, 0, w * 0.08, h * 0.9, w * 0.36);
  g2.addColorStop(0, 'rgba(0,80,180, 0.1)');
  g2.addColorStop(1, 'transparent');
  bgCtx.fillStyle = g2;
  bgCtx.fillRect(0, 0, w, h);

  // Grid lines
  bgCtx.strokeStyle = `rgba(${CYAN}, 0.042)`;
  bgCtx.lineWidth   = 1;
  for (let x = 0; x < w; x += GRID) {
    bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, h); bgCtx.stroke();
  }
  for (let y = 0; y < h; y += GRID) {
    bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(w, y); bgCtx.stroke();
  }

  // Floating particles
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(${CYAN}, ${p.a})`;
    bgCtx.fill();
  });
}

function animate() {
  drawBackground();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ── NAV scroll effect ─────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 40
    ? 'rgba(0,194,255,0.22)' : 'rgba(0,194,255,0.1)';
}, { passive: true });

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
  navLinks.forEach(l => {
    l.style.color = l.getAttribute('href') === `#${cur}` ? 'var(--cyan)' : '';
  });
}, { passive: true });

// ── Scroll reveal ─────────────────────────────
document.querySelectorAll(
  '.exp-card, .project-card, .contact-grid, .section-title, .section-label'
).forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Stagger cards
document.querySelectorAll('.project-card').forEach((c, i) => c.style.transitionDelay = `${i * 0.06}s`);
document.querySelectorAll('.exp-card').forEach((c, i) => c.style.transitionDelay = `${i * 0.07}s`);
