// ===== KUJAZA FRESHI — HOMEPAGE ENHANCEMENTS =====
// Hover filter, Recommendations, Stats counter, Seasonal, DYK Admin

// ─── HOVER FILTER ────────────────────────────────────────────
var _filterCloseTimer = null;

function _getFilterPanel() {
  // New structure: .filter-panel inside .filter-hover-zone
  return document.querySelector('.filter-panel') || document.getElementById('filter-sidebar');
}

function openFilterSidebar() {
  cancelFilterClose();
  var sb = _getFilterPanel();
  if (!sb) return;
  sb.classList.add('open');
  var btn = document.getElementById('filter-trigger-btn');
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-expanded','true'); }
  populateFsbCategories();
  updateFsbCount();
}

function closeFilterSidebar() {
  var sb = _getFilterPanel();
  if (sb) sb.classList.remove('open');
  var btn = document.getElementById('filter-trigger-btn');
  if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-expanded','false'); }
  cancelFilterClose();
}

function scheduleFilterClose() {
  _filterCloseTimer = setTimeout(closeFilterSidebar, 250);
}

function cancelFilterClose() {
  if (_filterCloseTimer) {
    clearTimeout(_filterCloseTimer);
    _filterCloseTimer = null;
  }
}

// Override the old toggle to work with hover
function toggleFilterSidebar() {
  var sb = document.getElementById('filter-sidebar');
  if (sb && sb.classList.contains('open')) closeFilterSidebar();
  else openFilterSidebar();
}

// ─── VIEW MODE (Grid / List) ─────────────────────────────────
var _viewMode = 'grid';
function setViewMode(mode, btn) {
  _viewMode = mode;
  document.querySelectorAll('.vt-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var grid = document.getElementById('product-grid');
  if (grid) {
    grid.classList.toggle('list-view', mode === 'list');
    grid.classList.toggle('grid-view', mode === 'grid');
  }
}

// ─── RECOMMENDATIONS ─────────────────────────────────────────
var _recoMode = 'popular';

function switchReco(mode, btn) {
  _recoMode = mode;
  document.querySelectorAll('.reco-tab').forEach(function(t){ t.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderRecommendations();
}

function renderRecommendations() {
  var grid = document.getElementById('reco-grid');
  if (!grid || !KF || !KF.data) return;

  var prods = KF.data.products.filter(function(p){ return p.status === 'Active' && p.stock > 0; });

  if (_recoMode === 'popular') {
    // Sort by most expensive (proxy for demand) and best sellers
    prods = prods.filter(function(p){ return p.badge === 'Best Seller' || p.stock > 50; })
              .sort(function(a,b){ return b.price - a.price; });
  } else if (_recoMode === 'deals') {
    prods = prods.filter(function(p){ return p.origPrice && p.origPrice > p.price; })
              .sort(function(a,b){
                var da = (a.origPrice-a.price)/a.origPrice;
                var db = (b.origPrice-b.price)/b.origPrice;
                return db - da;
              });
  } else if (_recoMode === 'fresh') {
    prods = prods.filter(function(p){ return p.badge === 'Fresh Today' || (p.tags||[]).includes('organic'); });
  } else if (_recoMode === 'organic') {
    prods = prods.filter(function(p){ return (p.tags||[]).includes('organic'); });
  }

  // Show up to 12 products in a horizontal scroll
  prods = prods.slice(0, 12);
  if (!prods.length) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);font-size:14px">No products in this category right now.</div>';
    return;
  }

  grid.innerHTML = prods.map(function(p) {
    var hasDisc = p.origPrice && p.origPrice > p.price;
    var discPct = hasDisc ? Math.round((1-p.price/p.origPrice)*100) : 0;
    var imgHtml = p.img
      ? '<img src="'+p.img+'" alt="'+p.name+'" class="reco-img" loading="lazy">'
      : '<div class="reco-img reco-img-placeholder"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".35"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg></div>';

    return '<div class="reco-card" onclick="openQuickView('+p.id+')">' +
      '<div class="reco-img-wrap">' +
        imgHtml +
        (hasDisc ? '<div class="reco-discount-tag">-'+discPct+'%</div>' : '') +
        (p.badge && !hasDisc ? '<div class="reco-badge-tag">'+p.badge+'</div>' : '') +
      '</div>' +
      '<div class="reco-card-body">' +
        '<div class="reco-cat">'+KF.catName(p.catId)+'</div>' +
        '<div class="reco-name">'+p.name+'</div>' +
        '<div class="reco-price-row">' +
          '<div class="reco-price">'+KF.fmt(p.price)+'</div>' +
          (hasDisc ? '<div class="reco-orig">'+KF.fmt(p.origPrice)+'</div>' : '') +
        '</div>' +
      '</div>' +
      '<button class="reco-add-btn" onclick="event.stopPropagation();addToCart('+p.id+')" '+(p.stock===0?'disabled':'')+'>'+
        (p.stock===0 ? 'Out of Stock' : '+ Add') +
      '</button>' +
    '</div>';
  }).join('');
}

function scrollReco(dir) {
  var grid = document.getElementById('reco-grid');
  if (grid) grid.scrollBy({ left: dir * 280, behavior: 'smooth' });
}

// ─── SEASONAL SPOTLIGHT ──────────────────────────────────────
function renderSeasonalSpotlight() {
  var el = document.getElementById('seasonal-products');
  if (!el || !KF || !KF.data) return;
  var seasonal = KF.data.products.filter(function(p){
    return p.status === 'Active' && p.stock > 0 && (p.tags||[]).includes('seasonal');
  }).slice(0, 4);
  el.innerHTML = seasonal.map(function(p) {
    var imgHtml = p.img
      ? '<img src="'+p.img+'" alt="'+p.name+'" style="width:100%;height:100%;object-fit:cover">'
      : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;background:rgba(255,255,255,.1)">'+p.emoji+'</div>';
    return '<div class="seasonal-card" onclick="openQuickView('+p.id+')">' +
      '<div class="seasonal-card-img">'+imgHtml+'</div>' +
      '<div class="seasonal-card-info">' +
        '<div class="seasonal-card-name">'+p.name+'</div>' +
        '<div class="seasonal-card-price">'+KF.fmt(p.price)+' / '+p.unit+'</div>' +
      '</div>' +
      '<button class="seasonal-add" onclick="event.stopPropagation();addToCart('+p.id+')" '+(p.stock===0?'disabled':'')+'>+</button>' +
    '</div>';
  }).join('');
}

// ─── ANIMATED STATS COUNTER ──────────────────────────────────
function animateStats() {
  var els = document.querySelectorAll('.ss-num[data-target]');
  els.forEach(function(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var duration = 1800;
    var start = Date.now();
    var suffix = el.getAttribute('data-suffix') || '';
    function tick() {
      var elapsed = Date.now() - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + (suffix || (el.getAttribute('data-target') === '22' ? '+' : target > 100 ? '+' : ''));
      if (progress < 1) requestAnimationFrame(tick);
    }
    tick();
  });
}

// Trigger stats animation when strip comes into view
function observeStats() {
  var strip = document.querySelector('.stats-strip');
  if (!strip) return;
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateStats();
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(strip);
  } else {
    animateStats(); // fallback for older browsers
  }
}

// ─── DYK ADMIN ───────────────────────────────────────────────
var _dykEditingId = null;
var _dykImgData   = null;

function renderDYKAdmin() {
  var tbody = document.getElementById('dyk-admin-tbody');
  var count = document.getElementById('dyk-admin-count');
  if (!tbody || !DYK) return;
  var facts = DYK.facts || [];
  if (count) count.textContent = facts.length;

  tbody.innerHTML = facts.map(function(f, idx) {
    return '<tr>' +
      '<td style="font-family:monospace;font-size:12px;color:var(--muted)">'+(idx+1)+'</td>' +
      '<td><strong>'+f.title+'</strong></td>' +
      '<td>'+f.food+'<br><small style="color:var(--muted)">ID: '+(f.productId||'—')+'</small></td>' +
      '<td>'+(f.img ? '<img src="'+f.img+'" style="width:48px;height:36px;object-fit:cover;border-radius:6px">' : '<span style="font-size:20px">'+f.icon+'</span>')+'</td>' +
      '<td style="font-size:11px;color:var(--muted);max-width:200px">'+(f.benefits||[]).slice(0,2).join(' · ')+'</td>' +
      '<td><span class="badge badge-green">Active</span></td>' +
      '<td><div class="tbl-actions">' +
        '<button class="btn-edit" onclick="editDYKFact('+idx+')">✏ Edit</button>' +
        '<button class="btn-del" onclick="deleteDYKFact('+idx+')">🗑</button>' +
      '</div></td>' +
    '</tr>';
  }).join('') || '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted)">No facts yet — add your first food fact!</td></tr>';
}

function openAddDYKFact() {
  _dykEditingId = null;
  _dykImgData   = null;
  var t = document.getElementById('dyk-modal-title'); if(t) t.textContent = 'Add Food Fact';
  ['dyk-title','dyk-food','dyk-tag','dyk-origin','dyk-fact','dyk-benefits','dyk-tip','dyk-img-url','dyk-img-path'].forEach(function(id){
    var el = document.getElementById(id); if(el) el.value='';
  });
  var icon = document.getElementById('dyk-icon'); if(icon) icon.value='💡';
  var col  = document.getElementById('dyk-color'); if(col) col.value='#2D6A30';
  var bg   = document.getElementById('dyk-bgcolor'); if(bg)  bg.value='#F0FDF4';
  var prev = document.getElementById('dyk-img-preview'); if(prev) prev.innerHTML='<span style="font-size:28px">📷</span>';
  populateDYKProductSelect();
  openModal('modal-dyk-fact');
}

function editDYKFact(idx) {
  var f = DYK.facts[idx];
  if (!f) return;
  _dykEditingId = idx;
  _dykImgData   = f.img || null;
  var t = document.getElementById('dyk-modal-title'); if(t) t.textContent = 'Edit: '+f.title;
  var set = function(id,v){ var el=document.getElementById(id); if(el) el.value=v||''; };
  set('dyk-title', f.title);
  set('dyk-food',  f.food);
  set('dyk-icon',  f.icon);
  set('dyk-tag',   f.tag);
  set('dyk-origin',f.origin||'');
  set('dyk-fact',  f.fact);
  set('dyk-benefits', (f.benefits||[]).join('\n'));
  set('dyk-tip',   (f.tip||'').replace(/^🌟 Pro Tip: /,''));
  var col  = document.getElementById('dyk-color');  if(col)  col.value  = f.color   || '#2D6A30';
  var bg   = document.getElementById('dyk-bgcolor'); if(bg)   bg.value   = f.bgColor || '#F0FDF4';
  var prev = document.getElementById('dyk-img-preview');
  if (prev) prev.innerHTML = f.img ? '<img src="'+f.img+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px">' : '<span style="font-size:28px">'+(f.icon||'📷')+'</span>';
  populateDYKProductSelect(f.productId);
  openModal('modal-dyk-fact');
}

function populateDYKProductSelect(selectedId) {
  var sel = document.getElementById('dyk-product-id');
  if (!sel || !KF || !KF.data) return;
  sel.innerHTML = '<option value="">None — no product link</option>' +
    KF.data.products.filter(function(p){return p.status==='Active';}).map(function(p){
      return '<option value="'+p.id+'" '+(selectedId===p.id?'selected':'')+'>'+p.name+' ('+KF.fmt(p.price)+'/'+p.unit+')</option>';
    }).join('');
}

function dykPreviewImg() {
  var fi = document.getElementById('dyk-img-file');
  if (!fi || !fi.files || !fi.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    _dykImgData = e.target.result;
    var prev = document.getElementById('dyk-img-preview');
    if (prev) prev.innerHTML = '<img src="'+e.target.result+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px">';
  };
  reader.readAsDataURL(fi.files[0]);
}

function dykLoadImgURL() {
  var url = (document.getElementById('dyk-img-url')||{}).value || '';
  if (!url.trim()) { toast('Enter an image URL','⚠️'); return; }
  _dykImgData = url.trim();
  var prev = document.getElementById('dyk-img-preview');
  if (prev) prev.innerHTML = '<img src="'+url+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px" onerror="this.style.display=\'none\'">';
  toast('Image loaded ✅');
}

function dykPreviewPath(path) {
  if (!path) return;
  _dykImgData = path;
  var prev = document.getElementById('dyk-img-preview');
  if (prev) prev.innerHTML = '<img src="'+path+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px">';
}

function saveDYKFact() {
  var title    = ((document.getElementById('dyk-title')||{}).value||'').trim();
  var food     = ((document.getElementById('dyk-food')||{}).value||'').trim();
  var icon     = ((document.getElementById('dyk-icon')||{}).value||'💡').trim();
  var tag      = ((document.getElementById('dyk-tag')||{}).value||'').trim();
  var origin   = ((document.getElementById('dyk-origin')||{}).value||'').trim();
  var factTxt  = ((document.getElementById('dyk-fact')||{}).value||'').trim();
  var benefTxt = ((document.getElementById('dyk-benefits')||{}).value||'').trim();
  var tip      = ((document.getElementById('dyk-tip')||{}).value||'').trim();
  var color    = ((document.getElementById('dyk-color')||{}).value||'#2D6A30').trim();
  var bgColor  = ((document.getElementById('dyk-bgcolor')||{}).value||'#F0FDF4').trim();
  var pid      = (document.getElementById('dyk-product-id')||{}).value;
  var productId = pid ? parseInt(pid) : null;

  if (!title || !food || !factTxt) { toast('Title, food name and fact text are required','⚠️'); return; }

  var benefits = benefTxt.split('\n').map(function(s){return s.trim();}).filter(Boolean);
  var tipFull  = tip ? '🌟 Pro Tip: ' + tip : '';

  var fact = {
    title: title,
    food: food,
    productId: productId,
    img: _dykImgData || null,
    color: color,
    bgColor: bgColor,
    icon: icon,
    origin: origin || '🌍 Uganda',
    fact: factTxt,
    benefits: benefits,
    tip: tipFull,
    tag: tag || food
  };

  if (_dykEditingId !== null && _dykEditingId !== undefined) {
    DYK.facts[_dykEditingId] = fact;
    toast('Food fact updated! 💡');
  } else {
    DYK.facts.push(fact);
    toast('Food fact added! 💡');
  }
  closeModal('modal-dyk-fact');
  renderDYKAdmin();
  // If widget is open, refresh current view
  if (DYK.open) renderDYKFact(DYK.current);
}

function deleteDYKFact(idx) {
  if (DYK.facts.length <= 1) { toast('Keep at least 1 fact','⚠️'); return; }
  if (!confirm('Delete this food fact?')) return;
  DYK.facts.splice(idx, 1);
  if (DYK.current >= DYK.facts.length) DYK.current = DYK.facts.length - 1;
  renderDYKAdmin();
  if (DYK.open) renderDYKFact(DYK.current);
  toast('Fact deleted','🗑');
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Render recommendations on page load
  renderRecommendations();
  renderSeasonalSpotlight();
  observeStats();

  // Keyboard close for filter
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeFilterSidebar();
  });
});

// Patch showSec to include DYK admin
var __prevShowSecEnh = typeof showSec === 'function' ? showSec : null;
function showSec(id) {
  if (id === 'dykadmin') {
    KF.state.activeAdminSection = id;
    document.querySelectorAll('.admin-section').forEach(function(s){ s.classList.remove('show'); });
    var sec = document.getElementById('asec-dykadmin');
    if (sec) sec.classList.add('show');
    document.querySelectorAll('.side-item[data-sec]').forEach(function(i){
      i.classList.toggle('active', i.dataset.sec === id);
    });
    renderDYKAdmin();
    return;
  }
  if (__prevShowSecEnh) __prevShowSecEnh(id);
}

// ─── HERO PRICE FILTER ───────────────────────────────────────
function filterByMaxPrice(max) {
  KF.state.maxPrice = max;
  KF.state.activeFilter = 'all';
  // update price range slider if it exists
  var pr = document.getElementById('price-range');
  if (pr) pr.value = max;
  var pl = document.getElementById('price-label');
  if (pl) pl.textContent = 'UGX ' + max.toLocaleString();
  if (typeof renderProductGrid === 'function') renderProductGrid();
  document.getElementById('shop-anchor').scrollIntoView({behavior:'smooth'});
}

// ─── BUILD YOUR BASKET ───────────────────────────────────────
var _bbBasket = {};  // { pid: qty }

function renderBuildBasket() {
  var grid = document.getElementById('bb-grid');
  if (!grid || !KF || !KF.data) return;

  // Show a curated selection: fruits, popular veg, and combos
  var featured = KF.data.products.filter(function(p) {
    return p.status === 'Active' && p.stock > 0 &&
           (p.catId === 1 || p.catId === 2) &&
           (p.price <= 20000);  // affordable basket items
  }).slice(0, 12);

  grid.innerHTML = featured.map(function(p) {
    var qty = _bbBasket[p.id] || 0;
    var imgHtml = p.img
      ? '<img src="'+p.img+'" alt="'+p.name+'" class="bb-card-img" loading="lazy">'
      : '<div class="bb-card-img bb-card-placeholder"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg></div>';

    return '<div class="bb-card '+(qty>0?'bb-selected':'')+'" id="bb-card-'+p.id+'">' +
      imgHtml +
      '<div class="bb-card-name">'+p.name+'</div>' +
      '<div class="bb-card-price">+'+KF.fmt(p.price)+'</div>' +
      '<div class="bb-card-ctrl">' +
        (qty > 0
          ? '<button class="bb-dec" onclick="adjustBB('+p.id+',-1)">−</button>' +
            '<span class="bb-qty">'+qty+'</span>' +
            '<button class="bb-inc" onclick="adjustBB('+p.id+',1)">+</button>'
          : '<button class="bb-add-btn" onclick="adjustBB('+p.id+',1)">+ Add</button>') +
      '</div>' +
    '</div>';
  }).join('');

  updateBBTotal();
}

function adjustBB(pid, delta) {
  _bbBasket[pid] = (_bbBasket[pid] || 0) + delta;
  if (_bbBasket[pid] <= 0) delete _bbBasket[pid];
  renderBuildBasket();
}

function updateBBTotal() {
  var total = 0, count = 0;
  Object.keys(_bbBasket).forEach(function(pid) {
    var p = KF.data.products.find(function(x){ return x.id === parseInt(pid); });
    if (p) { total += p.price * _bbBasket[pid]; count += _bbBasket[pid]; }
  });
  var tv = document.getElementById('bb-total'); if (tv) tv.textContent = KF.fmt(total);
  var cnt = document.getElementById('bb-count'); if (cnt) cnt.textContent = count;
}

function clearBasket() {
  _bbBasket = {};
  renderBuildBasket();
}

function checkoutBasket() {
  // Add all basket items to main cart
  var added = 0;
  Object.keys(_bbBasket).forEach(function(pid) {
    var qty = _bbBasket[pid];
    var p = KF.data.products.find(function(x){ return x.id === parseInt(pid); });
    if (p && p.stock > 0) {
      var ex = KF.state.cart.find(function(i){ return i.pid === p.id; });
      if (ex) ex.qty = Math.min(ex.qty + qty, p.stock);
      else KF.state.cart.push({ pid: p.id, qty: Math.min(qty, p.stock) });
      added++;
    }
  });
  if (typeof updateCartBadge === 'function') updateCartBadge();
  if (added > 0) {
    toast('🧺 '+added+' items from your basket added to cart!', '✅');
    showPage('page-checkout');
  } else {
    toast('Add some items to your basket first!', '⚠️');
  }
}

// Initialise build basket on page load
document.addEventListener('DOMContentLoaded', function() {
  renderBuildBasket();
});

// ─── OFFICE FRUIT DELIVERY ───────────────────────────────────
function orderOfficeBox(tier, price) {
  var msg = 'Hi Kujaza Freshi! I would like to order the ' + tier + ' Office Box (UGX ' + price.toLocaleString() + '/week). Please get back to me with more details.';
  var waUrl = 'https://wa.me/256766026401?text=' + encodeURIComponent(msg);
  window.open(waUrl, '_blank');
  toast('Opening WhatsApp to order ' + tier + ' Office Box 🍍', '✅');
}

// ─── PRICE CHIP FILTER ───────────────────────────────────────
function applyPriceChip(max, el) {
  // Update slider
  var pr = document.getElementById('price-range');
  if (pr) pr.value = max;
  // Call the main price filter
  if (typeof setPriceFilter === 'function') setPriceFilter(max);
  // Update chip active state
  document.querySelectorAll('.fsb-price-chip').forEach(function(c){ c.classList.remove('active'); });
  if (el) el.classList.add('active');
  updateFsbCount();
}

// ─── HERO TAB SWITCHER ───────────────────────────────────────
function switchHeroTab(tab, btn) {
  // Update tab buttons
  document.querySelectorAll('.htab').forEach(function(t){ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected','true'); }
  // Update panels
  document.querySelectorAll('.hero-panel').forEach(function(p){ p.classList.remove('active'); });
  var panel = document.getElementById('hpanel-' + tab);
  if (panel) {
    panel.classList.add('active');
  }
}

// ─── ENHANCED COUNTDOWN ──────────────────────────────────────
(function() {
  var s = 9953;
  setInterval(function() {
    s = s > 0 ? s - 1 : 86399;
    var h   = Math.floor(s / 3600);
    var m   = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    var pad = function(n){ return String(n).padStart(2,'0'); };
    var eh  = document.getElementById('cd-h');
    var em  = document.getElementById('cd-m');
    var es  = document.getElementById('cd-s');
    if (eh) eh.textContent = pad(h);
    if (em) em.textContent = pad(m);
    if (es) es.textContent = pad(sec);
    // Also keep old countdown element if still in DOM
    var old = document.getElementById('countdown');
    if (old) old.textContent = pad(h)+':'+pad(m)+':'+pad(sec);
  }, 1000);
})();
