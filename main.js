/* ═══════════════════════════════════════════════════════════
   GREYMATT — main.js
   ═══════════════════════════════════════════════════════════ */

const PHONE = '254725462559'; // WhatsApp number (no +)

// ─── NAVBAR SCROLL ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ─── HAMBURGER MENU ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ─── QUICK ORDER MODAL ─────────────────────────────────────
function openOrder(productName) {
  document.getElementById('modalProduct').textContent = productName;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ─── SEND ORDER VIA WHATSAPP (MODAL) ───────────────────────
function sendWhatsApp() {
  const product  = document.getElementById('modalProduct').textContent;
  const name     = document.getElementById('modalName').value.trim();
  const phone    = document.getElementById('modalPhone').value.trim();
  const location = document.getElementById('modalLocation').value.trim();

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  const msg = `🛍️ *NEW ORDER — GREYMATT*\n\n` +
    `*Product:* ${product}\n` +
    `*Customer:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `*Location:* ${location || 'Not specified'}\n\n` +
    `_Sent via GREYMATT website_`;

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeModal();
}

// ─── MAIN ORDER FORM SUBMISSION ────────────────────────────
document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name     = document.getElementById('customerName').value.trim();
  const phone    = document.getElementById('customerPhone').value.trim();
  const email    = document.getElementById('customerEmail').value.trim();
  const product  = document.getElementById('productName').value.trim();
  const qty      = document.getElementById('productQty').value.trim();
  const location = document.getElementById('deliveryLocation').value.trim();
  const notes    = document.getElementById('orderNotes').value.trim();

  const msg = `🛍️ *NEW ORDER — GREYMATT*\n\n` +
    `*Product:* ${product}\n` +
    `*Quantity:* ${qty}\n` +
    `*Customer:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `${email ? `*Email:* ${email}\n` : ''}` +
    `*Delivery Location:* ${location}\n` +
    `${notes ? `*Notes:* ${notes}\n` : ''}\n` +
    `_Sent via GREYMATT website_`;

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  // Show success feedback
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '✅ Order Sent!';
  btn.style.background = '#25D366';
  setTimeout(() => {
    btn.innerHTML = '<span class="btn-text">Send Order via WhatsApp</span><span class="btn-icon">→</span>';
    btn.style.background = '';
    document.getElementById('orderForm').reset();
  }, 3000);
});

// ─── SCROLL REVEAL ANIMATION ───────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.6s ease both';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .section-header, .order-container').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});
