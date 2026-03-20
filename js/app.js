// ===== KUJAZA FRESH — MAIN APP =====

// ─── PAGE ROUTING ──────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('show'));
  document.getElementById(id).classList.add('show');
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const map = { 'page-shop': 'nav-shop', 'page-checkout': 'nav-checkout', 'page-admin': 'nav-admin' };
  if (map[id]) { const el = document.getElementById(map[id]); if (el) el.classList.add('active'); }
  window.scrollTo(0, 0);
  if (id === 'page-admin') initAdmin();
  if (id === 'page-checkout') initCheckout();
}

// ─── TOAST ─────────────────────────────────────────────────────────────────
function toast(msg, icon = '✅') {
  const t = document.getElementById('toast');
  t.innerHTML = `<span>${icon}</span>${msg}`;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── MODALS ─────────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-bd')) {
    document.querySelectorAll('.modal-bd.open').forEach(m => m.classList.remove('open'));
  }
});

// ─── AUTH ───────────────────────────────────────────────────────────────────
function doLogin() {
  const em = document.getElementById('l-email').value.trim();
  const pw = document.getElementById('l-pass').value;
  const u = KF.data.users.find(u => u.email === em && u.pass === pw);
  const msg = document.getElementById('login-msg');
  if (!u) { msg.innerHTML = '<div class="alert alert-err">Invalid email or password.</div>'; return; }
  if (u.role === 'admin') { msg.innerHTML = '<div class="alert alert-err">Use the admin login — click Help. in the footer.</div>'; return; }
  msg.innerHTML = '';
  KF.state.currentUser = u;
  closeModal('modal-login');
  updateAuthUI();
  toast('Welcome back, ' + u.name.split(' ')[0] + '! 🌿');
}

function doAdminLogin() {
  const em  = document.getElementById('al-email').value.trim();
  const pw  = document.getElementById('al-pass').value;
  const msg = document.getElementById('admin-login-msg');
  const u   = KF.data.users.find(u => u.email === em && u.pass === pw);
  if (!u || u.role === 'customer') {
    msg.innerHTML = '<div class="alert alert-err">Invalid credentials or insufficient access level.</div>';
    return;
  }
  msg.innerHTML = '';
  KF.state.currentUser = u;
  closeModal('modal-admin-login');
  updateAuthUI();
  if (u.role === 'admin') {
    showPage('page-admin');
    showSec('dashboard');
    toast('Welcome, ' + u.name + ' — Admin Dashboard ⚙️', '⚙️');
  } else {
    showPage('page-staff');
    initStaffPortal();
    toast('Welcome, ' + u.name.split(' ')[0] + '! Staff Portal loaded.', '👔');
  }
}

function doSignup() {
  const fn  = document.getElementById('su-fn').value.trim();
  const ln  = document.getElementById('su-ln').value.trim();
  const em  = document.getElementById('su-em').value.trim();
  const ph  = document.getElementById('su-ph').value.trim();
  const pw  = document.getElementById('su-pw').value;
  const msg = document.getElementById('su-msg');
  if (!fn || !em || !pw) { msg.innerHTML = '<div class="alert alert-err">Please fill all required fields.</div>'; return; }
  if (KF.data.users.find(u => u.email === em)) { msg.innerHTML = '<div class="alert alert-err">Email already registered.</div>'; return; }
  if (pw.length < 6) { msg.innerHTML = '<div class="alert alert-err">Password must be at least 6 characters.</div>'; return; }
  const u = { email: em, pass: pw, name: fn + ' ' + ln, phone: ph, role: 'customer', orders: 0, spent: 0, joined: new Date().toLocaleDateString('en-GB', { month:'short', year:'numeric' }) };
  KF.data.users.push(u);
  KF.state.currentUser = u;
  closeModal('modal-signup');
  updateAuthUI();
  toast('Welcome to Kujaza Fresh, ' + fn + '! 🎉');
}

function logout() {
  KF.state.currentUser = null;
  updateAuthUI();
  showPage('page-shop');
  toast('Signed out. See you soon! 👋', '👋');
}

function updateAuthUI() {
  const u = KF.state.currentUser;
  document.getElementById('auth-btn').classList.toggle('hidden', !!u);
  document.getElementById('user-pill').classList.toggle('hidden', !u);
  document.getElementById('nav-admin').classList.toggle('hidden', !(u && u.role === 'admin'));
  if (u) {
    document.getElementById('user-name').textContent = u.name.split(' ')[0];
  }
}

// ─── FEEDBACK ───────────────────────────────────────────────────────────────
let currentRating = 0;
function setRating(v) {
  currentRating = v;
  document.querySelectorAll('.star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.v) <= v);
  });
}
function submitFeedback() {
  const name = document.getElementById('rfb-name').value.trim();
  const email = document.getElementById('rfb-email').value.trim();
  const msg = document.getElementById('rfb-msg-txt').value.trim();
  const out = document.getElementById('rfb-msg');
  if (!name || !email || !msg) { out.innerHTML = '<div class="alert alert-err">Please fill all required fields.</div>'; return; }
  if (!currentRating) { out.innerHTML = '<div class="alert alert-err">Please select a star rating.</div>'; return; }
  KF.data.feedback.push({ id: KF.data.nextIds.feedback++, name, email, rating: currentRating, msg, date: new Date().toISOString().split('T')[0], status: 'Pending', featured: false });
  document.getElementById('rfb-name').value = '';
  document.getElementById('rfb-email').value = '';
  document.getElementById('rfb-msg-txt').value = '';
  currentRating = 0;
  document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
  out.innerHTML = '<div class="alert alert-ok">✅ Thank you! Your review has been submitted and will appear after approval.</div>';
  setTimeout(() => { out.innerHTML = ''; }, 4000);
}
function renderFeedbackReviews() {
  const el = document.getElementById('reviews-grid');
  if (!el) return;
  const approved = KF.data.feedback.filter(f => f.status === 'Approved');
  el.innerHTML = approved.map(f => `
    <div class="review-card ${f.featured ? 'featured' : ''}">
      ${f.featured ? '<div class="review-featured-tag">⭐ Featured</div>' : ''}
      <div class="review-stars">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</div>
      <p class="review-text">"${f.msg}"</p>
      <div class="review-author">
        <div class="review-avatar">${f.name.charAt(0)}</div>
        <div><div class="review-name">${f.name}</div><div class="review-date">${f.date}</div></div>
      </div>
    </div>`).join('');
}

// ─── SHOP ───────────────────────────────────────────────────────────────────
function renderShop() {
  renderCatPills();
  renderProductGrid();
}

function renderCatPills() {
  const el = document.getElementById('cat-pills');
  const { activeCat } = KF.state;
  el.innerHTML = `<button class="cat-pill ${activeCat === 'all' ? 'active' : ''}" onclick="setCat('all')">🛒 All</button>` +
    KF.data.categories.map(c =>
      `<button class="cat-pill ${activeCat === c.id ? 'active' : ''}" onclick="setCat(${c.id})">${c.emoji} ${c.name}</button>`
    ).join('');
}

function renderProductGrid() {
  const { activeCat, searchQ } = KF.state;
  const prods = KF.data.products.filter(p => {
    const catOk   = activeCat === 'all' || p.catId === activeCat;
    const searchOk = !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || KF.catName(p.catId).toLowerCase().includes(searchQ.toLowerCase());
    return catOk && searchOk && p.status === 'Active';
  });
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  if (!prods.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)"><div style="font-size:48px;margin-bottom:12px">🔍</div><p>No products found. Try a different search.</p></div>`;
    return;
  }
  const bgs = ['bg0','bg1','bg2','bg3'];
  grid.innerHTML = prods.map((p, idx) => {
    const out = p.stock === 0;
    const low = p.stock > 0 && p.stock <= 12;
    return `<div class="pcard">
      <div class="pcard-img ${bgs[idx % 4]}">
        <span>${p.emoji}</span>
        <div class="fresh-tag ${out ? 'out' : low ? 'low' : 'in'}">${out ? 'Out of Stock' : low ? 'Low Stock' : 'Fresh'}</div>
      </div>
      <div class="pcard-body">
        <div class="pcard-name">${p.name}</div>
        <div class="pcard-cat">${KF.catEmoji(p.catId)} ${KF.catName(p.catId)}</div>
        <div class="pcard-price">${KF.fmt(p.price)} <small>/ ${p.unit}</small></div>
      </div>
      <div class="pcard-foot">
        <span class="pcard-stock ${out ? 'out' : low ? 'low' : 'in'}">
          ${out ? '✕ Out of stock' : low ? '⚠ Only ' + p.stock + ' left' : '✓ In stock'}
        </span>
        <button class="add-btn" ${out ? 'disabled' : ''} onclick="addToCart(${p.id})">+ Add</button>
      </div>
    </div>`;
  }).join('');
}

function setCat(c) { KF.state.activeCat = c; renderShop(); }
function filterSearch(q) { KF.state.searchQ = q; renderProductGrid(); }

// ─── CART ───────────────────────────────────────────────────────────────────
function addToCart(pid) {
  const p = KF.data.products.find(x => x.id === pid);
  if (!p || p.stock === 0) return;
  const ex = KF.state.cart.find(i => i.pid === pid);
  if (ex) {
    if (ex.qty >= p.stock) { toast('Maximum available stock added!', '⚠️'); return; }
    ex.qty++;
  } else {
    KF.state.cart.push({ pid, qty: 1 });
  }
  updateCartUI();
  toast(`${p.emoji} ${p.name} added to cart`);
}

function removeFromCart(pid) {
  KF.state.cart = KF.state.cart.filter(i => i.pid !== pid);
  updateCartUI();
}

function changeQty(pid, delta) {
  const item = KF.state.cart.find(i => i.pid === pid);
  const p = KF.data.products.find(x => x.id === pid);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(pid); return; }
  if (item.qty > p.stock) { item.qty = p.stock; toast('Maximum stock reached', '⚠️'); }
  updateCartUI();
}

function updateCartUI() {
  // Badge
  const count = KF.cartCount();
  document.getElementById('cart-count').textContent = count;

  // Drawer items
  const list = document.getElementById('cart-items');
  if (!KF.state.cart.length) {
    list.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p style="font-weight:600;margin-bottom:4px">Your cart is empty</p><p style="font-size:13px">Add some fresh produce to get started!</p></div>`;
  } else {
    list.innerHTML = KF.state.cart.map(i => {
      const p = KF.data.products.find(x => x.id === i.pid);
      if (!p) return '';
      return `<div class="cart-item">
        <div class="cart-item-img">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${KF.fmt(p.price * i.qty)}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
          <span class="qty-val">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${p.id},1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${p.id})">✕</button>
      </div>`;
    }).join('');
  }

  // Totals
  const sub = KF.cartSubtotal();
  document.getElementById('cart-subtotal').textContent = KF.fmt(sub);
  document.getElementById('cart-total').textContent = KF.fmt(sub);
}

function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

// ─── CHECKOUT ───────────────────────────────────────────────────────────────
let coCurrentStep = 1;

function initCheckout() {
  coCurrentStep = 1;
  renderCheckoutStep(1);
  buildZoneSelector();
  buildPayMethods();
}

function buildZoneSelector() {
  document.getElementById('zone-grid').innerHTML = KF.data.zones.map(z =>
    `<div class="zone-card ${KF.state.selectedZone === z.name ? 'selected' : ''}" onclick="selectZone(this,'${z.name}')">
      <div class="zone-name">📍 ${z.name}</div>
      <div class="zone-fee">${KF.fmt(z.fee)} delivery fee</div>
    </div>`
  ).join('');
}

function buildPayMethods() {
  const methods = [
    { id:'mtn',    icon:'📱', name:'MTN Mobile Money', detail:'Dial *165# to confirm payment' },
    { id:'airtel', icon:'📱', name:'Airtel Money',      detail:'Dial *185# to confirm payment' },
    { id:'cod',    icon:'💵', name:'Cash on Delivery',  detail:'Pay the rider when your order arrives' },
    { id:'bank',   icon:'🏦', name:'Bank Transfer',     detail:'Centenary Bank | Kujaza Fresh Ltd | A/C: 01234567' },
  ];
  document.getElementById('pay-grid').innerHTML = methods.map(m =>
    `<div class="pay-card ${KF.state.selectedPay === m.id ? 'selected' : ''}" onclick="selectPay(this,'${m.id}','${m.detail}')">
      <div class="pay-icon">${m.icon}</div>
      <div class="pay-name">${m.name}</div>
    </div>`
  ).join('');
}

function selectZone(el, name) {
  KF.state.selectedZone = name;
  document.querySelectorAll('.zone-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function selectPay(el, id, detail) {
  KF.state.selectedPay = id;
  document.querySelectorAll('.pay-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('pay-detail').innerHTML =
    `<div class="alert alert-success">📌 ${detail}</div>`;
}

function coNext() {
  if (coCurrentStep === 1) {
    if (!KF.state.selectedZone) { toast('Please select a delivery zone', '⚠️'); return; }
    const ph = document.getElementById('co-ph');
    if (!ph || !ph.value) { toast('Please enter your phone number', '⚠️'); return; }
    renderOrderSummary();
    renderCheckoutStep(2);
  } else if (coCurrentStep === 2) {
    placeOrder();
    renderCheckoutStep(3);
  }
}

function coPrev() {
  if (coCurrentStep > 1) renderCheckoutStep(coCurrentStep - 1);
}

function renderCheckoutStep(n) {
  coCurrentStep = n;
  ['co-s1','co-s2','co-s3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', i + 1 !== n);
  });
  ['step-1','step-2','step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'co-step';
    if (i + 1 < n) el.classList.add('done');
    if (i + 1 === n) el.classList.add('active');
  });
}

function renderOrderSummary() {
  const zone = KF.data.zones.find(z => z.name === KF.state.selectedZone);
  const fee = zone ? zone.fee : 0;
  const sub = KF.cartSubtotal();
  const el = document.getElementById('order-lines');
  if (!el) return;
  el.innerHTML =
    KF.state.cart.map(i => {
      const p = KF.data.products.find(x => x.id === i.pid);
      return `<div class="order-line"><span>${p.emoji} ${p.name} × ${i.qty}</span><span>${KF.fmt(p.price * i.qty)}</span></div>`;
    }).join('') +
    `<div class="order-line"><span>Delivery fee — ${KF.state.selectedZone}</span><span>${KF.fmt(fee)}</span></div>` +
    `<div class="order-line"><span>Total</span><span>${KF.fmt(sub + fee)}</span></div>`;
}

function placeOrder() {
  const zone = KF.data.zones.find(z => z.name === KF.state.selectedZone);
  const fee = zone ? zone.fee : 0;
  const sub = KF.cartSubtotal();
  const oid = 'KF-' + String(KF.data.nextIds.order++).padStart(4, '0');
  const coName = document.getElementById('co-fn');
  const order = {
    id: oid,
    customer: KF.state.currentUser ? KF.state.currentUser.name : (coName ? coName.value + ' ' + (document.getElementById('co-ln').value||'') : 'Guest').trim() || 'Guest',
    zone: KF.state.selectedZone,
    items: [
      ...KF.state.cart.map(i => { const p = KF.data.products.find(x => x.id === i.pid); return { name: p.name, qty: i.qty, price: p.price }; }),
      { name: 'Delivery fee', qty: 1, price: fee }
    ],
    total: sub + fee,
    payment: KF.state.selectedPay,
    status: 'Pending',
    riderId: null,
    date: new Date().toISOString().split('T')[0]
  };
  KF.data.orders.unshift(order);
  KF.state.cart.forEach(i => {
    const p = KF.data.products.find(x => x.id === i.pid);
    if (p) p.stock = Math.max(0, p.stock - i.qty);
  });
  if (KF.state.currentUser && KF.state.currentUser.role === 'customer') {
    KF.state.currentUser.orders = (KF.state.currentUser.orders || 0) + 1;
    KF.state.currentUser.spent  = (KF.state.currentUser.spent  || 0) + order.total;
  }
  const pidEl    = document.getElementById('placed-id');
  const pzoneEl  = document.getElementById('placed-zone');
  const ptotalEl = document.getElementById('placed-total');
  if (pidEl)    pidEl.textContent    = oid;
  if (pzoneEl)  pzoneEl.textContent  = KF.state.selectedZone;
  if (ptotalEl) ptotalEl.textContent = KF.fmt(sub + fee);
  KF.state.cart = [];
  updateCartUI();
  renderProductGrid();
}

function continueShopping() {
  KF.state.selectedZone = null;
  showPage('page-shop');
}
