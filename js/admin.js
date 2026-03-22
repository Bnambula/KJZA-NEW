// ===== KUJAZA FRESHI — ADMIN MODULE =====

// Helper — product thumbnail HTML (no emoji)
function prodThumb(p) {
  if (p.img) return '<img src="' + p.img + '" style="width:100%;height:100%;object-fit:cover">';
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>';
}

function initAdmin() {
  if (!KF.state.currentUser || KF.state.currentUser.role !== 'admin') {
    showPage('page-shop');
    toast('Admin access required', '🔒');
    return;
  }
  showAdminSection(KF.state.activeAdminSection);
}

function showAdminSection(id) {
  KF.state.activeAdminSection = id;
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('show'));
  document.getElementById('asec-' + id).classList.add('show');
  document.querySelectorAll('.side-item').forEach(i => i.classList.toggle('active', i.dataset.sec === id));
  const renders = {
    dashboard: renderDashboard, products: renderProducts, categories: renderCategories,
    inventory: renderInventory, orders: renderOrders, riders: renderRiders,
    delivery: renderDelivery, finance: renderFinance, reports: () => renderReport(KF.state.activeReport),
    customers: renderCustomers
  };
  if (renders[id]) renders[id]();
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
function renderDashboard() {
  const totalRev = KF.data.income.reduce((s, i) => s + i.amt, 0);
  const totalExp = KF.data.expenses.reduce((s, e) => s + e.amt, 0);
  const profit   = totalRev - totalExp;
  const today    = new Date().toISOString().split('T')[0];

  document.getElementById('dash-stats').innerHTML = [
    { label:'Total Revenue',   val: KF.fmt(totalRev), sub: 'This month', icon:'💰' },
    { label:'Total Expenses',  val: KF.fmt(totalExp), sub: 'This month', icon:'📉' },
    { label:'Net Profit',      val: KF.fmt(profit),   sub: ((profit/totalRev)*100).toFixed(1)+'% margin', icon:'📊' },
    { label:'Total Orders',    val: KF.data.orders.length, sub: KF.data.orders.filter(o=>o.date===today).length+' today', icon:'🛒' },
    { label:'Active Riders',   val: KF.data.riders.filter(r=>r.status!=='Off Duty').length, sub: 'of '+KF.data.riders.length+' total', icon:'🏍️' },
    { label:'Active Products', val: KF.data.products.filter(p=>p.status==='Active').length, sub: KF.data.products.filter(p=>p.stock===0).length+' out of stock', icon:'🥬' },
  ].map(s => `<div class="stat-card">
    <div class="sc-icon">${s.icon}</div>
    <div class="sc-lbl">${s.label}</div>
    <div class="sc-val">${s.val}</div>
    <div class="sc-sub">${s.sub}</div>
  </div>`).join('');

  document.getElementById('dash-orders').innerHTML = KF.data.orders.slice(0,6).map(o =>
    `<div class="fin-row">
      <div><strong style="font-size:14px">${o.id}</strong><br><span style="font-size:12px;color:var(--muted)">${o.customer} · ${o.zone}</span></div>
      <div style="text-align:right">${KF.fmt(o.total)}<br><span class="badge ${statusBadge(o.status)}">${o.status}</span></div>
    </div>`
  ).join('');

  const lowStock = KF.data.products.filter(p => p.stock <= 12 && p.status === 'Active');
  document.getElementById('dash-stock').innerHTML = lowStock.length
    ? lowStock.map(p => `<div class="fin-row"><span><span style="font-family:monospace;font-size:11px;color:var(--o1);margin-right:6px">${p.code||''}</span>${p.name}</span><span class="badge ${p.stock===0?'badge-red':'badge-amber'}">${p.stock===0?'Out of Stock':p.stock+' left'}</span></div>`).join('')
    : '<div style="color:var(--muted);font-size:13px;padding:12px 0">✓ All products well stocked</div>';
}

function statusBadge(s) {
  if (s==='Delivered') return 'badge-green';
  if (s==='Out for Delivery') return 'badge-blue';
  if (s==='Processing') return 'badge-purple';
  if (s==='Cancelled') return 'badge-red';
  return 'badge-amber';
}

// ─── PRODUCTS ───────────────────────────────────────────────────────────────
function renderProducts() {
  populateCatSelect('p-cat');
  document.getElementById('prod-tbody').innerHTML = KF.data.products.map(p =>
    `<tr>
      <td><div class="prod-tbl-cell">
        <div class="prod-tbl-thumb">${prodThumb(p)}</div>
        <div>
          <div class="prod-code-badge">${p.code||'—'}</div>
          <strong>${p.name}</strong>
          <div style="font-size:11px;color:var(--muted)">${(p.desc||'').substring(0,45)}…</div>
        </div>
      </div></td>
      <td>${KF.catEmoji(p.catId)} ${KF.catName(p.catId)}</td>
      <td><strong>${KF.fmt(p.price)}</strong><br><small class="text-muted">per ${p.unit}</small></td>
      <td>${p.stock}</td>
      <td><span class="badge ${p.status==='Active'?'badge-green':'badge-red'}">${p.status}</span></td>
      <td><div class="tbl-actions"><button class="btn-edit btn-sm" onclick="editProduct(${p.id})">✏ Edit</button><button class="btn-del btn-sm" onclick="delProduct(${p.id})">🗑 Delete</button></div></td>
    </tr>`
  ).join('');
}

// ─── PRODUCT IMAGE STATE ────────────────────────────────────────
var _productImageData = null; // holds base64 or URL

function _resetProductImageUI() {
  _productImageData = null;
  const prev = document.getElementById('p-img-preview');
  if (prev) { prev.innerHTML = '<div class="piu-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span>Click to upload photo</span><span style="font-size:11px;opacity:.7">JPG, PNG, WEBP · Max 5MB · or use URL below</span></div>'; }
  const urlEl = document.getElementById('p-img-url');
  const pathEl = document.getElementById('p-img-path');
  if (urlEl) urlEl.value = '';
  if (pathEl) pathEl.value = '';
  const fi = document.getElementById('p-img-file');
  if (fi) fi.value = '';
  // reset tags
  ['pt-organic','pt-seasonal','pt-discount','pt-premium','pt-fresh'].forEach(id => {
    const el = document.getElementById(id); if (el) el.checked = false;
  });
  const badgeEl = document.getElementById('p-badge');
  if (badgeEl) badgeEl.value = '';
  const origEl = document.getElementById('p-orig-price');
  if (origEl) origEl.value = '';
}

function _setProductImagePreview(src) {
  _productImageData = src;
  const prev = document.getElementById('p-img-preview');
  if (prev) prev.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" onerror="this.parentElement.innerHTML='<span style=color:var(--t2);font-size:12px>Image failed to load</span>'">`;
}

function handleProductImageFile() {
  const fi = document.getElementById('p-img-file');
  if (!fi || !fi.files || !fi.files[0]) return;
  const file = fi.files[0];
  if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5MB', '⚠️'); return; }
  const reader = new FileReader();
  reader.onload = e => _setProductImagePreview(e.target.result);
  reader.readAsDataURL(file);
}

function handleProductImageURL() {
  const urlEl = document.getElementById('p-img-url');
  const url = (urlEl && urlEl.value) ? urlEl.value.trim() : '';
  if (!url) { toast('Enter an image URL', '⚠️'); return; }
  _setProductImagePreview(url);
  toast('Image loaded from URL ✅');
}

function previewProductImagePath(path) {
  if (!path) return;
  _setProductImagePreview(path);
}

function openAddProduct() {
  KF.state.editingProduct = null;
  document.getElementById('pm-title').textContent = 'Add Product';
  clearForm(['p-name','p-emoji','p-price','p-stock','p-desc']);
  document.getElementById('p-status').value = 'Active';
  populateCatSelect('p-cat');
  _resetProductImageUI();
  openModal('modal-product');
}

function editProduct(id) {
  const p = KF.data.products.find(x => x.id === id);
  if (!p) return;
  KF.state.editingProduct = id;
  document.getElementById('pm-title').textContent = 'Edit: ' + p.name;
  document.getElementById('p-name').value  = p.name;
  document.getElementById('p-emoji').value = p.emoji || '';
  populateCatSelect('p-cat');
  document.getElementById('p-cat').value   = p.catId;
  document.getElementById('p-unit').value  = p.unit;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-stock').value = p.stock;
  document.getElementById('p-desc').value  = p.desc || '';
  document.getElementById('p-status').value = p.status;
  const origEl = document.getElementById('p-orig-price');
  if (origEl) origEl.value = p.origPrice || '';
  const badgeEl = document.getElementById('p-badge');
  if (badgeEl) badgeEl.value = p.badge || '';
  // set tags
  const tags = p.tags || [];
  ['pt-organic','pt-seasonal','pt-discount','pt-premium','pt-fresh'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = tags.includes(el.value);
  });
  // set image
  _productImageData = p.img || null;
  const prev = document.getElementById('p-img-preview');
  if (prev) {
    if (p.img) {
      prev.innerHTML = `<img src="${p.img}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`;
    } else {
      prev.innerHTML = `<div class="piu-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span>No image yet — add one below</span></div>`;
    }
  }
  const pathEl = document.getElementById('p-img-path');
  if (pathEl && p.img && !p.img.startsWith('data:') && !p.img.startsWith('http')) pathEl.value = p.img;
  openModal('modal-product');
}

function saveProduct() {
  const name  = document.getElementById('p-name').value.trim();
  const price = parseInt(document.getElementById('p-price').value);
  const stock = parseInt(document.getElementById('p-stock').value);
  if (!name || isNaN(price) || isNaN(stock)) { toast('Please fill Name, Price and Stock', '⚠️'); return; }

  // Collect tags from checkboxes
  const tags = [];
  ['pt-organic','pt-seasonal','pt-discount','pt-premium','pt-fresh'].forEach(id => {
    const el = document.getElementById(id); if (el && el.checked) tags.push(el.value);
  });

  const origPriceEl = document.getElementById('p-orig-price');
  const origPrice   = origPriceEl && origPriceEl.value ? parseInt(origPriceEl.value) : null;
  const badgeEl     = document.getElementById('p-badge');
  const badge       = badgeEl ? (badgeEl.value || null) : null;

  const data = {
    name,
    emoji:     document.getElementById('p-emoji').value || '📦',
    catId:     parseInt(document.getElementById('p-cat').value),
    unit:      document.getElementById('p-unit').value,
    price,
    origPrice: origPrice || null,
    stock,
    desc:      document.getElementById('p-desc').value || '',
    status:    document.getElementById('p-status').value,
    badge,
    tags,
    img:       _productImageData || null,
  };

  if (KF.state.editingProduct) {
    Object.assign(KF.data.products.find(x => x.id === KF.state.editingProduct), data);
    toast('Product updated! ✅');
  } else {
    KF.data.products.push({ id: KF.data.nextIds.product++, ...data });
    toast('Product added! ✅');
  }
  closeModal('modal-product');
  renderProducts();
  renderProductGrid();
}

function delProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  KF.data.products = KF.data.products.filter(p => p.id !== id);
  renderProducts();
  renderProductGrid();
  toast('Product deleted', '🗑');
}

function delProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  KF.data.products = KF.data.products.filter(p => p.id !== id);
  renderProducts();
  renderShop();
  toast('Product deleted', '🗑');
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
function renderCategories() {
  document.getElementById('cat-tbody').innerHTML = KF.data.categories.map(c => {
    const count = KF.data.products.filter(p => p.catId === c.id).length;
    return `<tr>
      <td style="font-size:32px;line-height:1">${c.emoji}</td>
      <td><strong>${c.name}</strong></td>
      <td>${count} product${count !== 1 ? 's' : ''}</td>
      <td><div class="tbl-actions"><button class="btn-edit btn-sm" onclick="editCat(${c.id})">✏ Edit</button><button class="btn-del btn-sm" onclick="delCat(${c.id})">🗑 Delete</button></div></td>
    </tr>`;
  }).join('');
}

function openAddCat() {
  KF.state.editingCat = null;
  clearForm(['cat-name','cat-emoji']);
  openModal('modal-cat');
}

function editCat(id) {
  const c = KF.data.categories.find(x => x.id === id);
  if (!c) return;
  KF.state.editingCat = id;
  document.getElementById('cat-name').value  = c.name;
  document.getElementById('cat-emoji').value = c.emoji;
  openModal('modal-cat');
}

function saveCat() {
  const name  = document.getElementById('cat-name').value.trim();
  const emoji = document.getElementById('cat-emoji').value.trim() || '📁';
  if (!name) { toast('Enter a category name', '⚠️'); return; }
  if (KF.state.editingCat) {
    Object.assign(KF.data.categories.find(x => x.id === KF.state.editingCat), { name, emoji });
    toast('Category updated!');
  } else {
    KF.data.categories.push({ id: KF.data.nextIds.cat++, name, emoji });
    toast('Category added!');
  }
  closeModal('modal-cat');
  renderCategories();
  renderShop();
}

function delCat(id) {
  if (KF.data.products.find(p => p.catId === id)) { toast('Remove products in this category first', '⚠️'); return; }
  if (!confirm('Delete this category?')) return;
  KF.data.categories = KF.data.categories.filter(c => c.id !== id);
  renderCategories();
  renderShop();
  toast('Category deleted', '🗑');
}

// ─── INVENTORY ──────────────────────────────────────────────────────────────
function renderInventory() {
  document.getElementById('inv-tbody').innerHTML = KF.data.products.map(p => {
    const pct = Math.min(100, Math.round((p.stock / 200) * 100));
    const col  = p.stock === 0 ? 'var(--t2)' : p.stock <= 12 ? 'var(--y2)' : 'var(--g2)';
    const status = p.stock === 0 ? 'badge-red' : p.stock <= 12 ? 'badge-amber' : 'badge-green';
    const statusText = p.stock === 0 ? 'Out of Stock' : p.stock <= 12 ? 'Low Stock' : 'In Stock';
    return `<tr>
      <td>${p.emoji} <strong>${p.name}</strong></td>
      <td>${KF.catEmoji(p.catId)} ${KF.catName(p.catId)}</td>
      <td><strong>${p.stock}</strong> <small class="text-muted">${p.unit}</small></td>
      <td><div class="stock-bar"><div class="stock-fill" style="width:${pct}%;background:${col}"></div></div></td>
      <td><span class="badge ${status}">${statusText}</span></td>
      <td><div class="inline-stock"><input type="number" id="inv-${p.id}" value="${p.stock}" min="0" style="width:80px"><button class="btn-edit btn-sm" onclick="updateStock(${p.id})">Update</button></div></td>
    </tr>`;
  }).join('');
}

function updateStock(id) {
  const val = parseInt(document.getElementById('inv-' + id).value);
  if (isNaN(val) || val < 0) { toast('Invalid stock value', '⚠️'); return; }
  KF.data.products.find(p => p.id === id).stock = val;
  renderInventory();
  renderProductGrid();
  toast('Stock updated!');
}

// ─── ORDERS ─────────────────────────────────────────────────────────────────
function renderOrders() {
  document.getElementById('orders-tbody').innerHTML = KF.data.orders.map(o => {
    const rider = o.riderId ? KF.data.riders.find(r => r.id === o.riderId) : null;
    return `<tr>
      <td><span class='id-chip id-chip-order'>${o.id}</span><br><small class='text-muted' style='font-size:11px'>${o.date}</small></td>
      <td>${o.customer}</td>
      <td>📍 ${o.zone}</td>
      <td style="font-size:12px;max-width:160px;overflow:hidden">${o.items.filter(i=>i.name!=='Delivery fee').map(i=>i.name+'×'+i.qty).join(', ')}</td>
      <td><strong>${KF.fmt(o.total)}</strong></td>
      <td style="font-size:12px">${o.payment}</td>
      <td><select onchange="updateOrderStatus('${o.id}',this.value)" style="font-size:12px;padding:5px 8px;border-radius:6px;min-width:140px">
        ${['Pending','Processing','Out for Delivery','Delivered','Cancelled'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
      </select></td>
      <td><span class="badge ${rider?'badge-green':'badge-amber'}">${rider?rider.name:'Unassigned'}</span></td>
    </tr>`;
  }).join('');
}

function updateOrderStatus(id, status) {
  const o = KF.data.orders.find(x => x.id === id);
  if (o) { o.status = status; toast(`${id} → ${status}`); }
}

// ─── RIDERS ─────────────────────────────────────────────────────────────────
function renderRiders() {
  populateZoneSelect('r-zone');
  document.getElementById('rider-grid').innerHTML = KF.data.riders.map(r =>
    `<div class="rider-card">
      <div class="rider-avatar">🏍️</div>
      <div class="rider-name">${r.name}</div>
      <div class="rider-meta">${r.type} · ${r.zone}</div>
      <div style="margin-bottom:10px"><span class="badge ${r.status==='Available'?'badge-green':r.status==='On Delivery'?'badge-blue':'badge-red'}">${r.status}</span></div>
      <div class="rider-stat">📞 ${r.phone}</div>
      <div class="rider-stat">🏍 ${r.plate}</div>
      <div class="rider-stat">📦 ${r.deliveries} deliveries · ⭐ ${r.rating}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100,(r.deliveries/60)*100)}%"></div></div>
      <div class="tbl-actions" style="margin-top:12px">
        <button class="btn-edit btn-sm" style="flex:1" onclick="editRider(${r.id})">✏ Edit</button>
        <button class="btn-del btn-sm" style="flex:1" onclick="delRider(${r.id})">🗑 Delete</button>
      </div>
    </div>`
  ).join('');
}

function openAddRider() {
  KF.state.editingRider = null;
  document.getElementById('rm-title').textContent = 'Add Rider';
  clearForm(['r-name','r-phone','r-plate']);
  openModal('modal-rider');
}

function editRider(id) {
  const r = KF.data.riders.find(x => x.id === id);
  if (!r) return;
  KF.state.editingRider = id;
  document.getElementById('rm-title').textContent = 'Edit Rider';
  document.getElementById('r-name').value   = r.name;
  document.getElementById('r-phone').value  = r.phone;
  document.getElementById('r-type').value   = r.type;
  document.getElementById('r-zone').value   = r.zone;
  document.getElementById('r-plate').value  = r.plate;
  document.getElementById('r-status').value = r.status;
  openModal('modal-rider');
}

function saveRider() {
  const name = document.getElementById('r-name').value.trim();
  if (!name) { toast('Enter rider name', '⚠️'); return; }
  const data = {
    name, phone: document.getElementById('r-phone').value,
    type:   document.getElementById('r-type').value,
    zone:   document.getElementById('r-zone').value,
    plate:  document.getElementById('r-plate').value,
    status: document.getElementById('r-status').value
  };
  if (KF.state.editingRider) {
    Object.assign(KF.data.riders.find(x => x.id === KF.state.editingRider), data);
    toast('Rider updated!');
  } else {
    KF.data.riders.push({ id: KF.data.nextIds.rider++, ...data, deliveries: 0, rating: 0 });
    toast('Rider added!');
  }
  closeModal('modal-rider');
  renderRiders();
}

function delRider(id) {
  if (!confirm('Remove this rider?')) return;
  KF.data.riders = KF.data.riders.filter(r => r.id !== id);
  renderRiders();
  toast('Rider removed', '🗑');
}

// ─── DELIVERY ALLOCATION ────────────────────────────────────────────────────
function renderDelivery() {
  const pending = KF.data.orders.filter(o => o.status === 'Pending' || o.status === 'Processing');
  const el = document.getElementById('alloc-list');
  if (!pending.length) {
    el.innerHTML = '<div style="padding:24px;color:var(--muted);text-align:center;font-size:14px">🎉 No pending deliveries to allocate right now.</div>';
    return;
  }
  el.innerHTML = pending.map(o =>
    `<div class="alloc-card">
      <div>
        <div style="font-size:22px;margin-bottom:4px">📦</div>
      </div>
      <div class="alloc-info">
        <div class="alloc-id">${o.id} — ${o.customer}</div>
        <div class="alloc-detail">📍 ${o.zone} · ${o.items.filter(i=>i.name!=='Delivery fee').length} items · ${KF.fmt(o.total)} · <span class="badge ${statusBadge(o.status)}">${o.status}</span></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <select id="rsel-${o.id}" style="font-size:13px;padding:7px 12px;border-radius:8px;min-width:180px">
          <option value="">Select rider...</option>
          ${KF.data.riders.filter(r=>r.status!=='Off Duty').map(r=>`<option value="${r.id}" ${o.riderId===r.id?'selected':''}>${r.name} (${r.zone})</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm" onclick="assignRider('${o.id}')">Assign →</button>
      </div>
    </div>`
  ).join('');
}

function assignRider(oid) {
  const sel = document.getElementById('rsel-' + oid);
  const rid = parseInt(sel.value);
  if (!rid) { toast('Select a rider first', '⚠️'); return; }
  const o = KF.data.orders.find(x => x.id === oid);
  o.riderId = rid;
  o.status  = 'Processing';
  const r = KF.data.riders.find(x => x.id === rid);
  if (r) { r.status = 'On Delivery'; r.deliveries++; }
  renderDelivery();
  toast(`Rider assigned to ${oid} ✓`);
}

// ─── FINANCE ────────────────────────────────────────────────────────────────
function renderFinance() {
  const totalInc = KF.data.income.reduce((s, i)  => s + i.amt, 0);
  const totalExp = KF.data.expenses.reduce((s, e) => s + e.amt, 0);
  const profit   = totalInc - totalExp;
  const margin   = totalInc ? ((profit / totalInc) * 100).toFixed(1) : 0;

  document.getElementById('fin-stats').innerHTML = [
    { label:'Total Income', val:KF.fmt(totalInc), icon:'📈', col:'var(--g2)' },
    { label:'Total Expenses', val:KF.fmt(totalExp), icon:'📉', col:'var(--t2)' },
    { label:'Net Profit', val:KF.fmt(profit), icon:'💰', col:profit>=0?'var(--g1)':'var(--t2)' },
    { label:'Profit Margin', val:margin+'%', icon:'📊', col:'var(--y2)' },
  ].map(s => `<div class="stat-card"><div class="sc-icon">${s.icon}</div><div class="sc-lbl">${s.label}</div><div class="sc-val" style="color:${s.col};font-size:22px">${s.val}</div></div>`).join('');

  document.getElementById('income-list').innerHTML = KF.data.income.map(i =>
    `<div class="fin-row">
      <div><strong style="font-size:13px">${i.desc}</strong><br><span style="font-size:11px;color:var(--muted)">${i.cat} · ${i.date}</span></div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="fin-val income">${KF.fmt(i.amt)}</span>
        <button class="btn-del btn-sm" onclick="delIncome(${i.id})" style="padding:4px 8px">✕</button>
      </div>
    </div>`
  ).join('');

  document.getElementById('expense-list').innerHTML = KF.data.expenses.map(e =>
    `<div class="fin-row">
      <div><strong style="font-size:13px">${e.desc}</strong><br><span style="font-size:11px;color:var(--muted)">${e.cat} · ${e.date}</span></div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="fin-val expense">(${KF.fmt(e.amt)})</span>
        <button class="btn-del btn-sm" onclick="delExpense(${e.id})" style="padding:4px 8px">✕</button>
      </div>
    </div>`
  ).join('');

  // P&L
  const byCat = {};
  KF.data.expenses.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amt; });
  document.getElementById('pnl-body').innerHTML =
    `<div class="fin-row"><span class="fin-label">Gross Revenue</span><span class="fin-val income">${KF.fmt(totalInc)}</span></div>` +
    Object.entries(byCat).map(([k,v]) =>
      `<div class="fin-row" style="padding-left:16px"><span class="fin-label">Less: ${k}</span><span class="fin-val" style="color:var(--t2)">(${KF.fmt(v)})</span></div>`
    ).join('') +
    `<div class="fin-row" style="border-top:2px solid var(--g4);margin-top:8px;padding-top:14px">
      <span><strong>Net Profit / (Loss)</strong></span>
      <span class="fin-val" style="font-size:18px;color:${profit>=0?'var(--g2)':'var(--t2)'}">${KF.fmt(profit)}</span>
    </div>
    <div class="fin-row"><span class="fin-label">Gross Margin</span><span class="fin-val">${margin}%</span></div>`;
}

function saveIncome() {
  const desc = document.getElementById('inc-desc').value.trim();
  const amt  = parseInt(document.getElementById('inc-amt').value);
  const date = document.getElementById('inc-date').value || new Date().toISOString().split('T')[0];
  if (!desc || isNaN(amt)) { toast('Fill all required fields', '⚠️'); return; }
  KF.data.income.push({ id: KF.data.nextIds.income++, desc, amt, date, cat: document.getElementById('inc-cat').value });
  closeModal('modal-income');
  renderFinance();
  toast('Income recorded!');
}

function saveExpense() {
  const desc = document.getElementById('exp-desc').value.trim();
  const amt  = parseInt(document.getElementById('exp-amt').value);
  const date = document.getElementById('exp-date').value || new Date().toISOString().split('T')[0];
  if (!desc || isNaN(amt)) { toast('Fill all required fields', '⚠️'); return; }
  KF.data.expenses.push({ id: KF.data.nextIds.expense++, desc, amt, date, cat: document.getElementById('exp-cat').value });
  closeModal('modal-expense');
  renderFinance();
  toast('Expense recorded!');
}

function delIncome(id)  { if(confirm('Delete this income entry?')){ KF.data.income   = KF.data.income.filter(i=>i.id!==id);  renderFinance(); toast('Entry deleted','🗑'); } }
function delExpense(id) { if(confirm('Delete this expense entry?')){ KF.data.expenses = KF.data.expenses.filter(e=>e.id!==id); renderFinance(); toast('Entry deleted','🗑'); } }

// ─── REPORTS ────────────────────────────────────────────────────────────────
function renderReport(type) {
  KF.state.activeReport = type;
  document.querySelectorAll('.rep-tab').forEach(t => t.classList.toggle('active', t.dataset.rep === type));
  const container = document.getElementById('report-content');

  if (type === 'sales') {
    const byZone = {};
    KF.data.orders.forEach(o => { byZone[o.zone] = (byZone[o.zone] || 0) + o.total; });
    const totalOrders = KF.data.orders.length;
    const totalRev    = KF.data.orders.reduce((s,o)=>s+o.total,0);
    container.innerHTML = `
      <h4 style="font-family:var(--font-h);font-size:20px;color:var(--g1);margin-bottom:20px">Sales Report — March 2026</h4>
      <div class="stats-row" style="margin-bottom:24px">
        ${[{l:'Total Orders',v:totalOrders},{l:'Gross Revenue',v:KF.fmt(totalRev)},{l:'Avg. Order Value',v:KF.fmt(Math.round(totalRev/totalOrders))},{l:'Delivered',v:KF.data.orders.filter(o=>o.status==='Delivered').length}].map(s=>`<div class="stat-card"><div class="sc-lbl">${s.l}</div><div class="sc-val" style="font-size:22px">${s.v}</div></div>`).join('')}
      </div>
      <h5 style="font-weight:700;color:var(--g1);margin-bottom:12px">Revenue by Zone</h5>
      ${Object.entries(byZone).sort((a,b)=>b[1]-a[1]).map(([z,v])=>`<div class="fin-row"><span>📍 ${z}</span><span class="fin-val income">${KF.fmt(v)}</span></div>`).join('')}
      <h5 style="font-weight:700;color:var(--g1);margin:20px 0 12px">Orders by Status</h5>
      ${['Pending','Processing','Out for Delivery','Delivered','Cancelled'].map(s=>{const n=KF.data.orders.filter(o=>o.status===s).length;return`<div class="fin-row"><span>${s}</span><span class="badge ${statusBadge(s)}">${n}</span></div>`;}).join('')}`;

  } else if (type === 'inventory') {
    const low = KF.data.products.filter(p => p.stock <= 12);
    container.innerHTML = `
      <h4 style="font-family:var(--font-h);font-size:20px;color:var(--g1);margin-bottom:20px">Inventory Report</h4>
      <div class="stats-row" style="margin-bottom:24px">
        ${[{l:'Total Products',v:KF.data.products.length},{l:'In Stock',v:KF.data.products.filter(p=>p.stock>12).length,c:'var(--g2)'},{l:'Low Stock',v:KF.data.products.filter(p=>p.stock>0&&p.stock<=12).length,c:'var(--y2)'},{l:'Out of Stock',v:KF.data.products.filter(p=>p.stock===0).length,c:'var(--t2)'}].map(s=>`<div class="stat-card"><div class="sc-lbl">${s.l}</div><div class="sc-val" style="font-size:22px;color:${s.c||'var(--g1)'}">${s.v}</div></div>`).join('')}
      </div>
      <h5 style="font-weight:700;color:var(--g1);margin-bottom:12px">Products Requiring Restock</h5>
      ${low.map(p=>`<div class="fin-row"><span>${p.emoji} ${p.name}</span><span class="badge ${p.stock===0?'badge-red':'badge-amber'}">${p.stock===0?'Out of Stock':p.stock+' remaining'}</span></div>`).join('') || '<p class="text-muted" style="padding:12px 0">All products well stocked ✓</p>'}`;

  } else if (type === 'riders') {
    container.innerHTML = `
      <h4 style="font-family:var(--font-h);font-size:20px;color:var(--g1);margin-bottom:20px">Rider Performance Report</h4>
      <div class="admin-table-wrap">
      <table><thead><tr><th>Rider</th><th>Type</th><th>Zone</th><th>Deliveries</th><th>Rating</th><th>Status</th></tr></thead><tbody>
      ${KF.data.riders.sort((a,b)=>b.deliveries-a.deliveries).map(r=>`<tr>
        <td><strong>${r.name}</strong><br><small class="text-muted">${r.phone}</small></td>
        <td>${r.type}</td><td>📍 ${r.zone}</td>
        <td><strong>${r.deliveries}</strong></td>
        <td>${r.rating ? '⭐ '+r.rating : '—'}</td>
        <td><span class="badge ${r.status==='Available'?'badge-green':r.status==='On Delivery'?'badge-blue':'badge-red'}">${r.status}</span></td>
      </tr>`).join('')}
      </tbody></table></div>`;

  } else if (type === 'financial') {
    const totalInc = KF.data.income.reduce((s,i)=>s+i.amt,0);
    const totalExp = KF.data.expenses.reduce((s,e)=>s+e.amt,0);
    const profit   = totalInc - totalExp;
    const byCat    = {};
    KF.data.expenses.forEach(e => { byCat[e.cat] = (byCat[e.cat]||0)+e.amt; });
    container.innerHTML = `
      <h4 style="font-family:var(--font-h);font-size:20px;color:var(--g1);margin-bottom:20px">Financial Summary — March 2026</h4>
      <div class="fin-row"><span class="fin-label" style="font-size:15px;font-weight:700">INCOME</span><span></span></div>
      ${KF.data.income.map(i=>`<div class="fin-row" style="padding-left:16px"><span class="fin-label">${i.desc} <em style="font-size:11px">(${i.cat})</em></span><span class="fin-val income">${KF.fmt(i.amt)}</span></div>`).join('')}
      <div class="fin-row" style="font-weight:700"><span>Total Income</span><span class="fin-val income">${KF.fmt(totalInc)}</span></div>
      <div class="fin-row" style="margin-top:12px"><span class="fin-label" style="font-size:15px;font-weight:700">EXPENSES</span><span></span></div>
      ${KF.data.expenses.map(e=>`<div class="fin-row" style="padding-left:16px"><span class="fin-label">${e.desc} <em style="font-size:11px">(${e.cat})</em></span><span class="fin-val expense">(${KF.fmt(e.amt)})</span></div>`).join('')}
      <div class="fin-row" style="font-weight:700"><span>Total Expenses</span><span class="fin-val expense">(${KF.fmt(totalExp)})</span></div>
      <div class="fin-row" style="border-top:3px solid var(--g4);margin-top:12px;padding-top:16px;font-size:17px">
        <span><strong>Net Profit</strong></span>
        <span class="fin-val" style="font-size:20px;color:${profit>=0?'var(--g2)':'var(--t2)'}">${KF.fmt(profit)}</span>
      </div>
      <div class="fin-row"><span class="fin-label">Gross Margin</span><span class="fin-val">${totalInc?((profit/totalInc)*100).toFixed(1):'0'}%</span></div>`;
  }
}

// ─── CUSTOMERS ──────────────────────────────────────────────────────────────
function renderCustomers() {
  const customers = KF.data.users.filter(u => u.role === 'customer');
  document.getElementById('cust-tbody').innerHTML = customers.length
    ? customers.map(u => `<tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || '—'}</td>
        <td>${u.orders || 0}</td>
        <td>${KF.fmt(u.spent || 0)}</td>
        <td>${u.joined || '—'}</td>
      </tr>`).join('')
    : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:32px">No registered customers yet</td></tr>';
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function populateCatSelect(id) {
  const sel = document.getElementById(id);
  if (sel) sel.innerHTML = KF.data.categories.map(c => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('');
}
function populateZoneSelect(id) {
  const sel = document.getElementById(id);
  if (sel) sel.innerHTML = KF.data.zones.map(z => `<option>${z.name}</option>`).join('');
}
function clearForm(ids) { ids.forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; }); }
