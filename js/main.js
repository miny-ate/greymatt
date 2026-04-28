/* ═══════════════════════════════════════════════════════════
   GREYMATT — main.js (Firebase Edition)
   ═══════════════════════════════════════════════════════════ */

const PHONE         = '254725462559';
const ADMIN_PASSWORD = '********'; // 

// ─── NAVBAR SCROLL ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ─── HAMBURGER ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target))
    mobileMenu.classList.remove('open');
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
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ─── WHATSAPP ORDER (MODAL) ─────────────────────────────────
function sendWhatsApp() {
  const product  = document.getElementById('modalProduct').textContent;
  const name     = document.getElementById('modalName').value.trim();
  const phone    = document.getElementById('modalPhone').value.trim();
  const location = document.getElementById('modalLocation').value.trim();
  if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
  const msg = `🛍️ *NEW ORDER — GREYMATT*\n\n*Product:* ${product}\n*Customer:* ${name}\n*Phone:* ${phone}\n*Location:* ${location || 'Not specified'}\n\n_Sent via GREYMATT website_`;
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  closeModal();
}

// ─── MAIN ORDER FORM ────────────────────────────────────────
document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name     = document.getElementById('customerName').value.trim();
  const phone    = document.getElementById('customerPhone').value.trim();
  const email    = document.getElementById('customerEmail').value.trim();
  const product  = document.getElementById('productName').value.trim();
  const qty      = document.getElementById('productQty').value.trim();
  const location = document.getElementById('deliveryLocation').value.trim();
  const notes    = document.getElementById('orderNotes').value.trim();
  const msg = `🛍️ *NEW ORDER — GREYMATT*\n\n*Product:* ${product}\n*Quantity:* ${qty}\n*Customer:* ${name}\n*Phone:* ${phone}\n${email ? `*Email:* ${email}\n` : ''}*Delivery Location:* ${location}\n${notes ? `*Notes:* ${notes}\n` : ''}\n_Sent via GREYMATT website_`;
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '✅ Order Sent!';
  btn.style.background = '#25D366';
  setTimeout(() => {
    btn.innerHTML = '<span class="btn-text">Send Order via WhatsApp</span><span class="btn-icon">→</span>';
    btn.style.background = '';
    document.getElementById('orderForm').reset();
  }, 3000);
});

// ─── SCROLL REVEAL ──────────────────────────────────────────
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


/* ═══════════════════════════════════════════════════════════
   FIREBASE PRODUCT MANAGEMENT
   ═══════════════════════════════════════════════════════════ */

// Firebase is loaded via CDN scripts in index.html
// db is initialized after Firebase loads (see bottom of index.html)

let db; // assigned after Firebase init

// ─── INITIALIZE & LISTEN ───────────────────────────────────
function initFirebase() {
  // db is set globally from index.html after Firebase init
  db = window._greyDB;
  if (!db) { console.error('Firebase DB not ready'); return; }
  listenToProducts();
}

// ─── REAL-TIME LISTENER ─────────────────────────────────────
function listenToProducts() {
  const { collection, onSnapshot, orderBy, query } = window.firestoreApi;
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snapshot) => {
    renderProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => {
    console.error('Firestore error:', err);
    showStatus('⚠️ Could not load products. Check Firebase config.', 'error');
  });
}

// ─── RENDER ALL PRODUCTS FROM FIREBASE ─────────────────────
function renderProducts(products) {
  // Clear previous firebase cards
  document.querySelectorAll('.firebase-product-card').forEach(el => el.remove());

  const sections = {
    watches:    document.getElementById('watches'),
    shoes:      document.getElementById('shoes'),
    electrical: document.getElementById('electrical'),
    clothing:   document.getElementById('clothing'),
    stationery: document.getElementById('stationery'),
  };

  const isAdmin = document.getElementById('adminFormBox').style.display === 'block';

  products.forEach(p => {
    const grid = sections[p.category]?.querySelector('.product-grid');
    if (!grid) return;

    const card = document.createElement('div');
    card.className = 'product-card firebase-product-card';
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="product-img-wrap">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''}
        <div class="img-placeholder" style="${p.image ? 'display:none' : 'display:flex'}">📷</div>
        ${isAdmin ? `
        <div class="admin-card-controls">
          <button onclick="editProduct('${p.id}')" title="Edit">✏️</button>
          <button onclick="deleteProduct('${p.id}', '${p.name}')" title="Delete">🗑️</button>
        </div>` : ''}
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc-text">${p.description || ''}</p>
        <div class="product-footer">
          <span class="product-price">KSh ${Number(p.price).toLocaleString()}</span>
          <button class="add-to-order" onclick="openOrder('${p.name}')">Order</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── ADD / UPDATE PRODUCT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('adminProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!db) { showStatus('Firebase not ready.', 'error'); return; }

    const { collection, addDoc, doc, updateDoc, serverTimestamp } = window.firestoreApi;

    const name     = document.getElementById('ap-name').value.trim();
    const desc     = document.getElementById('ap-desc').value.trim();
    const price    = document.getElementById('ap-price').value.trim();
    const category = document.getElementById('ap-category').value;
    const image    = document.getElementById('ap-image').value.trim();
    const editId   = document.getElementById('ap-submit').dataset.editId || '';

    if (!name || !price || !category) {
      showStatus('⚠️ Please fill Name, Price and Category.', 'error');
      return;
    }

    const btn = document.getElementById('ap-submit');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
      if (editId) {
        // UPDATE existing product
        await updateDoc(doc(db, 'products', editId), { name, description: desc, price: Number(price), category, image });
        showStatus(`✅ "${name}" updated successfully!`, 'success');
        delete btn.dataset.editId;
        btn.textContent = 'Add Product';
      } else {
        // ADD new product
        await addDoc(collection(db, 'products'), {
          name, description: desc, price: Number(price), category, image,
          createdAt: serverTimestamp()
        });
        showStatus(`✅ "${name}" added successfully!`, 'success');
      }
      this.reset();
    } catch (err) {
      console.error(err);
      showStatus('❌ Error saving product. Check console.', 'error');
    } finally {
      btn.disabled = false;
      if (!editId) btn.textContent = 'Add Product';
    }
  });
});

// ─── EDIT PRODUCT ───────────────────────────────────────────
async function editProduct(id) {
  if (!db) return;
  const { doc, getDoc } = window.firestoreApi;
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) { showStatus('Product not found.', 'error'); return; }
  const p = snap.data();
  document.getElementById('ap-name').value     = p.name;
  document.getElementById('ap-desc').value     = p.description || '';
  document.getElementById('ap-price').value    = p.price;
  document.getElementById('ap-category').value = p.category;
  document.getElementById('ap-image').value    = p.image || '';
  const btn = document.getElementById('ap-submit');
  btn.textContent      = 'Update Product';
  btn.dataset.editId   = id;
  document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth' });
}

// ─── DELETE PRODUCT ─────────────────────────────────────────
async function deleteProduct(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  if (!db) return;
  const { doc, deleteDoc } = window.firestoreApi;
  try {
    await deleteDoc(doc(db, 'products', id));
    showStatus(`🗑️ "${name}" deleted.`, 'success');
  } catch (err) {
    console.error(err);
    showStatus('❌ Error deleting product.', 'error');
  }
}

// ─── ADMIN LOGIN / LOGOUT ───────────────────────────────────
function adminLogin() {
  const entered = document.getElementById('adminPasswordInput').value;
  if (entered === ADMIN_PASSWORD) {
    document.getElementById('adminLoginBox').style.display  = 'none';
    document.getElementById('adminFormBox').style.display   = 'block';
    document.getElementById('adminLoggedIn').style.display  = 'block';
    // Re-render to show edit/delete buttons
    listenToProducts();
  } else {
    showStatus('❌ Wrong password.', 'error');
  }
}

function adminLogout() {
  document.getElementById('adminLoginBox').style.display  = 'block';
  document.getElementById('adminFormBox').style.display   = 'none';
  document.getElementById('adminLoggedIn').style.display  = 'none';
  document.getElementById('adminPasswordInput').value     = '';
  document.getElementById('adminPanel').style.display     = 'none';
  listenToProducts();
}

function toggleAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  if (panel.style.display === 'block') panel.scrollIntoView({ behavior: 'smooth' });
}

// ─── STATUS MESSAGE ─────────────────────────────────────────
function showStatus(msg, type = 'success') {
  const el = document.getElementById('adminStatus');
  el.textContent = msg;
  el.className = `admin-status ${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}
