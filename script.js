/* ============================================
   NUVE PRESENTATION WEBSITE — SCRIPT
   ============================================ */

// --- Section Management ---
const sections = document.querySelectorAll('.section');
const navDotsContainer = document.getElementById('navDots');
const navUp = document.getElementById('navUp');
const navDown = document.getElementById('navDown');
let currentSection = 0;
let isScrolling = false;

// Build nav dots
sections.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => scrollToSection(i));
  navDotsContainer.appendChild(dot);
});

// Update active dot and arrow states
function updateNav(index) {
  currentSection = index;
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  navUp.disabled = index === 0;
  navDown.disabled = index === sections.length - 1;
}

// Scroll to section
function scrollToSection(index) {
  if (index < 0 || index >= sections.length) return;
  sections[index].scrollIntoView({ behavior: 'smooth' });
  updateNav(index);
}

// Arrow click handlers
navUp.addEventListener('click', () => scrollToSection(currentSection - 1));
navDown.addEventListener('click', () => scrollToSection(currentSection - 1 >= 0 ? currentSection - 1 : 0));

// Fix: navDown should go forward
navDown.onclick = () => scrollToSection(currentSection + 1);

// --- Intersection Observer for active section tracking ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
      const index = Array.from(sections).indexOf(entry.target);
      if (index !== -1) updateNav(index);
    }
  });
}, { threshold: 0.35 });

sections.forEach(section => observer.observe(section));

// --- Scroll-triggered animations ---
const animateElements = document.querySelectorAll(
  '.pillar-card, .audience-card, .mission-block, .feature-item, .content-card, .fp-item'
);

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const parent = entry.target.parentElement;
      const siblings = parent ? Array.from(parent.children) : [];
      const siblingIndex = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${siblingIndex * 0.08}s`;
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateElements.forEach(el => {
  el.classList.add('animate-on-scroll');
  animObserver.observe(el);
});

// --- Expo URL Loading ---
function loadExpoUrl() {
  const url = document.getElementById('expoUrlInput').value.trim();
  if (!url) return;

  // Load into all iframes
  const mainFrame = document.getElementById('expoFrame');
  const clones = document.querySelectorAll('.expo-iframe-clone');

  [mainFrame, ...clones].forEach(iframe => {
    iframe.src = url;
    iframe.classList.add('loaded');
    // Hide placeholder
    const placeholder = iframe.parentElement.querySelector('.iframe-placeholder');
    if (placeholder) placeholder.style.display = 'none';
  });
}

// --- Feature pillar preview clicks ---
document.querySelectorAll('.fp-item[data-target]').forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// --- Keyboard navigation ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    scrollToSection(currentSection + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    scrollToSection(currentSection - 1);
  }
});

// --- Generate Expo QR codes ---
function generateExpoQR() {
  // Deep link that opens in Expo Go / dev client on mobile
  const expoUrl = 'https://expo.dev/preview/update?projectId=537513c8-f101-4f71-aa14-4f93e6898d9f&group=0b2237c7-4a42-4c26-83a7-23d657235c72&qr=1';
  const targets = document.querySelectorAll('.qr-target');
  if (typeof qrcode === 'undefined') return;

  targets.forEach(target => {
    const qr = qrcode(0, 'M');
    qr.addData(expoUrl);
    qr.make();

    const svg = qr.createSvgTag({ cellSize: 3, margin: 2, scalable: true });
    target.innerHTML = svg;
    target.style.border = 'none';
    target.style.background = '#fff';
    target.style.padding = '8px';

    // Style the SVG to fill the container
    const svgEl = target.querySelector('svg');
    if (svgEl) {
      svgEl.style.width = '100%';
      svgEl.style.height = '100%';
      svgEl.style.borderRadius = '8px';
    }
  });
}

window.addEventListener('load', generateExpoQR);

// --- Scale iframes to fit iPhone mockup screens ---
function scaleIframes() {
  const screens = document.querySelectorAll('.iphone-screen');
  screens.forEach(screen => {
    const iframe = screen.querySelector('iframe');
    if (!iframe) return;
    const iframeW = 390;
    const iframeH = 844;
    const screenW = screen.offsetWidth;
    const screenH = screen.offsetHeight;
    const scale = Math.min(screenW / iframeW, screenH / iframeH);
    iframe.style.transform = `scale(${scale})`;
  });
}

window.addEventListener('resize', scaleIframes);
window.addEventListener('load', scaleIframes);
scaleIframes();

// --- Initialize ---
updateNav(0);
