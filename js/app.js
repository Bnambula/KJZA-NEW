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
  renderPublicVouchers();
}

function renderCatPills() {
  const el = document.getElementById('cat-pills');
  if (!el) return;
  const { activeCat } = KF.state;
  el.innerHTML = `<button class="cat-pill ${activeCat==='all'?'active':''}" onclick="setCat('all')">🛒 All</button>` +
    KF.data.categories.map(c =>
      `<button class="cat-pill ${activeCat===c.id?'active':''}" onclick="setCat(${c.id})">${c.emoji} ${c.name}</button>`
    ).join('');
}

function renderProductGrid() {
  const { activeCat, searchQ, activeFilter, activeSort, maxPrice } = KF.state;
  let prods = KF.data.products.filter(p => {
    if (p.status !== 'Active') return false;
    if (activeCat !== 'all' && p.catId !== activeCat) return false;
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase()) && !KF.catName(p.catId).toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (activeFilter === 'discount' && !(p.origPrice && p.origPrice > p.price)) return false;
    if (activeFilter === 'organic'  && !(p.tags||[]).includes('organic'))  return false;
    if (activeFilter === 'fresh'    && p.badge !== 'Fresh Today') return false;
    if (activeFilter === 'seasonal' && !(p.tags||[]).includes('seasonal')) return false;
    if (activeFilter === 'premium'  && !(p.tags||[]).includes('premium'))  return false;
    if (activeFilter === 'instock'  && p.stock <= 0) return false;
    if (maxPrice && p.price > maxPrice) return false;
    return true;
  });
  if (activeSort === 'price-low')  prods = prods.slice().sort((a,b) => a.price - b.price);
  if (activeSort === 'price-high') prods = prods.slice().sort((a,b) => b.price - a.price);
  if (activeSort === 'discount')   prods = prods.slice().sort((a,b) => {
    const da = a.origPrice ? (a.origPrice-a.price)/a.origPrice : 0;
    const db = b.origPrice ? (b.origPrice-b.price)/b.origPrice : 0;
    return db - da;
  });
  if (activeSort === 'name') prods = prods.slice().sort((a,b) => a.name.localeCompare(b.name));
  const cntEl = document.getElementById('filter-count');
  if (cntEl) cntEl.textContent = prods.length + ' product' + (prods.length!==1?'s':'');
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  if (!prods.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)"><div style="font-size:48px;margin-bottom:12px">🔍</div><p>No products match your filters.</p></div>';
    return;
  }
  grid.innerHTML = prods.map(p => buildProductCard(p)).join('');
}

function buildProductCard(p) {
  const out = p.stock === 0;
  const low = p.stock > 0 && p.stock <= 12;
  const hasDiscount = p.origPrice && p.origPrice > p.price;
  const discPct = hasDiscount ? Math.round((1 - p.price/p.origPrice)*100) : 0;
  const badgeMap = {'Best Seller':'badge-orange','Fresh Today':'badge-green','Organic':'badge-green','Low Stock':'badge-yellow','Premium':'badge-blue','Imported':'badge-blue','Farm Fresh':'badge-green','Local':'badge-local','Staple':'badge-local','28% Off':'badge-orange','20% Off':'badge-orange','17% Off':'badge-orange','14% Off':'badge-orange','18% Off':'badge-orange'};
  const badgeClass = p.badge ? (badgeMap[p.badge]||'badge-orange') : '';
  return '<div class="pcard" onclick="openQuickView('+p.id+')">' +
    '<div class="pcard-box"><div class="box-frame">' +
    '<div class="box-top-strip"><span class="box-logo">Kujaza Fresh</span><span class="box-organic">🌱 Organic</span></div>' +
    '<div class="box-image-area ' + (p.img?'has-photo':'no-photo') + '">' +
    (p.img ? '<img src="'+p.img+'" alt="'+p.name+'" class="box-photo" loading="lazy">' : '<div class="box-emoji-display">'+p.emoji+'</div>') +
    (out ? '<div class="box-overlay-out">Out of Stock</div>' : '') +
    (hasDiscount ? '<div class="discount-ribbon">-'+discPct+'%</div>' : '') +
    (p.badge && !hasDiscount ? '<div class="prod-badge '+badgeClass+'">'+p.badge+'</div>' : '') +
    '</div><div class="box-wood-grain"></div><div class="box-side-left"></div><div class="box-side-right"></div>' +
    '</div></div>' +
    '<div class="pcard-body">' +
    '<div class="pcard-name">'+p.name+'</div>' +
    '<div class="pcard-cat">'+KF.catEmoji(p.catId)+' '+KF.catName(p.catId)+'</div>' +
    '<div class="pcard-price-row"><div class="pcard-price">'+KF.fmt(p.price)+' <small>/ '+p.unit+'</small></div>' +
    (hasDiscount ? '<div class="pcard-orig">'+KF.fmt(p.origPrice)+'</div>' : '') + '</div>' +
    '<div class="pcard-tags">'+(p.tags||[]).slice(0,2).map(function(t){return '<span class="ptag ptag-'+t+'">'+t+'</span>';}).join('')+'</div>' +
    '</div>' +
    '<div class="pcard-foot">' +
    '<span class="pcard-stock '+(out?'out':low?'low':'in')+'">'+(out?'✕ Out of stock':low?'⚠ '+p.stock+' left':'✓ In stock')+'</span>' +
    '<button class="add-btn" '+(out?'disabled':'')+' onclick="event.stopPropagation();addToCart('+p.id+')">+ Add</button>' +
    '</div></div>';
}

function setCat(c) { KF.state.activeCat = c; renderShop(); renderCatPills(); }
function filterSearch(q) { KF.state.searchQ = q; renderProductGrid(); }
function setFilter(f, btn) {
  KF.state.activeFilter = f;
  document.querySelectorAll('.fchip').forEach(function(c){ c.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderProductGrid();
}
function setSort(v) { KF.state.activeSort = v; renderProductGrid(); }
function setPriceFilter(v) {
  const val = parseInt(v);
  KF.state.maxPrice = val >= 40000 ? null : val;
  const lbl = document.getElementById('price-label');
  if (lbl) lbl.textContent = val >= 40000 ? 'Any' : KF.fmt(val);
  renderProductGrid();
}
function openQuickView(pid) {
  const p = KF.data.products.find(function(x){ return x.id === pid; });
  if (!p) return;
  const hasD = p.origPrice && p.origPrice > p.price;
  const disc = hasD ? Math.round((1-p.price/p.origPrice)*100) : 0;
  const out = p.stock === 0; const low = p.stock > 0 && p.stock <= 12;
  document.getElementById('qv-content').innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">' +
    '<div class="box-frame" style="max-width:220px;margin:0 auto">' +
    '<div class="box-top-strip"><span class="box-logo">Kujaza Fresh</span><span class="box-organic">🌱 Organic</span></div>' +
    '<div class="box-image-area '+(p.img?'has-photo':'no-photo')+'" style="height:190px">' +
    (p.img?'<img src="'+p.img+'" alt="'+p.name+'" class="box-photo">'+'</img>':'<div class="box-emoji-display" style="font-size:80px">'+p.emoji+'</div>') +
    (hasD?'<div class="discount-ribbon">-'+disc+'%</div>':'') +
    '</div><div class="box-wood-grain"></div><div class="box-side-left"></div><div class="box-side-right"></div></div>' +
    '<div>' +
    '<div style="font-size:11px;font-weight:800;color:var(--o2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px">'+KF.catEmoji(p.catId)+' '+KF.catName(p.catId)+'</div>' +
    '<h3 style="font-family:var(--font-h);font-size:22px;color:var(--g2);margin-bottom:8px">'+p.name+'</h3>' +
    '<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:10px;flex-wrap:wrap">' +
    '<div style="font-family:var(--font-h);font-size:26px;color:var(--o1)">'+KF.fmt(p.price)+'<span style="font-size:13px;font-family:var(--font-b);color:var(--muted);font-weight:400"> / '+p.unit+'</span></div>' +
    (hasD?'<div style="font-size:14px;color:var(--muted);text-decoration:line-through">'+KF.fmt(p.origPrice)+'</div><span class="badge badge-orange">Save '+disc+'%</span>':'') +
    '</div><p style="font-size:14px;color:var(--txt2);line-height:1.7;margin-bottom:14px">'+p.desc+'</p>' +
    '<div style="margin-bottom:14px">'+(p.tags||[]).map(function(t){return '<span class="ptag ptag-'+t+'" style="margin-right:6px">'+t+'</span>';}).join('')+'</div>' +
    '<div class="pcard-stock '+(out?'out':low?'low':'in')+'" style="margin-bottom:16px;font-size:14px">'+(out?'✕ Out of stock':low?'⚠ Only '+p.stock+' remaining':'✓ In stock')+'</div>' +
    '<button class="btn btn-primary btn-lg" style="width:100%" '+(out?'disabled':'')+' onclick="addToCart('+p.id+');closeModal('modal-quickview')">🛒 Add to Cart — '+KF.fmt(p.price)+'</button>' +
    '</div></div>';
  openModal('modal-quickview');
}
function subscribeNewsletter() {
  const email = document.getElementById('nl-email').value.trim();
  const out = document.getElementById('nl-msg');
  if (!email || !email.includes('@')) { out.innerHTML = '<div class="alert alert-err" style="font-size:13px">Please enter a valid email.</div>'; return; }
  KF.data.newsletter = KF.data.newsletter || [];
  if (KF.data.newsletter.find(function(n){return n.email===email;})) { out.innerHTML = '<div class="alert alert-ok" style="font-size:13px">Already subscribed! 🌿</div>'; return; }
  KF.data.newsletter.push({ email: email, date: new Date().toISOString().split('T')[0], status: 'Active' });
  document.getElementById('nl-email').value = '';
  out.innerHTML = '<div class="alert alert-ok" style="font-size:13px">✅ Subscribed! Fresh deals coming your way.</div>';
  setTimeout(function(){ out.innerHTML = ''; }, 4000);
}
function renderPublicVouchers() {
  const el = document.getElementById('public-vouchers');
  if (!el) return;
  el.innerHTML = (KF.data.vouchers||[]).filter(function(v){return v.active;}).map(function(v){
    return '<div class="voucher-card" onclick="copyVoucher(''+v.code+'')"><div class="vc-code">'+v.code+'</div><div class="vc-desc">'+v.desc+'</div><div class="vc-detail">Min order '+KF.fmt(v.minOrder)+' · Expires '+v.expiry+'</div><div class="vc-copy">📋 Tap to copy</div></div>';
  }).join('');
}
function copyVoucher(code) {
  if (navigator.clipboard) navigator.clipboard.writeText(code).catch(function(){});
  toast('Code ' + code + ' copied! 🎟', '🎉');
}

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

// ─── RECIPES ────────────────────────────────────────────────────

// Recipe ingredient definitions — each id matches a product in data.js
const RECIPES = {
  luwombo: {
    name: 'Luwombo',
    ingredients: [
      { id:43, qty:1, note:'1 whole chicken or 1kg beef' },
      { id:38, qty:2, note:'for wrapping (2 bunches)' },
      { id:45, qty:1, note:'ebinyebwa sauce base' },
      { id:11, qty:1, note:'2 large onions' },
      { id:10, qty:1, note:'3 ripe tomatoes' },
      { id:39, qty:1, note:'1 bunch' },
      { id:31, qty:1, note:'1 thumb fresh ginger' },
      { id:41, qty:1, note:'bilungo paste for flavour' },
      { id:32, qty:1, note:'to taste' },
      { id:46, qty:1, note:'1 teaspoon' },
      { id:47, qty:1, note:'for frying' },
      { id:21, qty:1, note:'to serve' },
    ]
  },
  nsenene: {
    name: 'Nsenene',
    ingredients: [
      { id:42, qty:1, note:'500g pre-cleaned nsenene' },
      { id:11, qty:1, note:'2 medium onions' },
      { id:39, qty:1, note:'1 bunch spring onions' },
      { id:32, qty:1, note:'2 fresh chilli peppers' },
      { id:7,  qty:1, note:'1 lemon, juice only' },
      { id:47, qty:1, note:'2 tablespoons' },
    ]
  },
  bilungo: {
    name: 'Bilungo Stew',
    ingredients: [
      { id:15, qty:1, note:'the eggplant / bilungo base — or use fresh' },
      { id:41, qty:1, note:'pre-made bilungo paste' },
      { id:10, qty:1, note:'4 large ripe tomatoes' },
      { id:11, qty:1, note:'2 onions' },
      { id:39, qty:1, note:'1 bunch spring onions' },
      { id:18, qty:1, note:'fresh dodo / African nightshade' },
      { id:45, qty:1, note:'ebinyebwa for richness' },
      { id:43, qty:1, note:'optional — chicken pieces' },
      { id:32, qty:1, note:'to taste' },
      { id:47, qty:1, note:'3 tablespoons cooking oil' },
      { id:21, qty:1, note:'matooke to serve' },
    ]
  }
};

function renderAllRecipeIngredients() {
  Object.keys(RECIPES).forEach(function(key) {
    renderRecipeIngredients(key);
  });
}

function renderRecipeIngredients(key) {
  var recipe = RECIPES[key];
  var el = document.getElementById(key + '-ingredients');
  if (!el) return;
  el.innerHTML = recipe.ingredients.map(function(ing) {
    var p = KF.data.products.find(function(x){ return x.id === ing.id; });
    if (!p) return '';
    var inStock = p.stock > 0;
    return '<div class="ingredient-row' + (inStock ? '' : ' ingredient-oos') + '">' +
      '<div class="ing-emoji">' + p.emoji + '</div>' +
      '<div class="ing-info">' +
        '<div class="ing-name">' + p.name + '</div>' +
        '<div class="ing-note">' + ing.note + '</div>' +
      '</div>' +
      '<div class="ing-right">' +
        '<div class="ing-price">' + KF.fmt(p.price) + '</div>' +
        (inStock
          ? '<button class="ing-add-btn" onclick="addToCart(' + p.id + ');this.textContent=\'✓\';this.style.background=\'var(--g3)\'" >+ Add</button>'
          : '<span class="ing-oos-tag">Soon</span>') +
      '</div>' +
    '</div>';
  }).join('');
}

function switchRecipe(key, btn) {
  // hide all recipe cards
  document.querySelectorAll('.recipe-card').forEach(function(c){ c.classList.remove('show'); });
  // deactivate all tabs
  document.querySelectorAll('.recipe-tab').forEach(function(t){ t.classList.remove('active'); });
  // show selected
  var card = document.getElementById('recipe-' + key);
  if (card) card.classList.add('show');
  if (btn) btn.classList.add('active');
}

function addRecipeToCart(key) {
  var recipe = RECIPES[key];
  var added = 0;
  recipe.ingredients.forEach(function(ing) {
    var p = KF.data.products.find(function(x){ return x.id === ing.id; });
    if (p && p.stock > 0) {
      var ex = KF.state.cart.find(function(i){ return i.pid === p.id; });
      if (ex) { ex.qty = Math.min(ex.qty + 1, p.stock); }
      else { KF.state.cart.push({ pid: p.id, qty: 1 }); }
      added++;
    }
  });
  updateCartUI();
  toast(added + ' ingredients from ' + recipe.name + ' added to cart! 🛒', '🍃');
}

