// ===== KUJAZA FRESH — COMPREHENSIVE FIXES & NEW FEATURES =====
// Fixes: Help. trigger, hero slideshow, recipe admin, responsive nav,
//        all dashboard tabs, filter responsiveness, mobile cart

// ── HERO SLIDESHOW DATA ──────────────────────────────────────────
if (!KF.data.heroSlides) {
  KF.data.heroSlides = [
    { id:1, heading:'Fresh Picked.<br><em>Delivered Today.</em>',  sub:'Fruits, vegetables, grains & more — sourced direct from Ugandan farms.', btnLabel:'Shop Fresh Now 🛒', img:null, bg:'linear-gradient(135deg,#0F2910 0%,#1A3F1C 55%,#0A4A35 100%)' },
    { id:2, heading:'Authentic<br><em>Ugandan Recipes.</em>',       sub:'Luwombo, Nsenene, Bilungo — cook the real thing with fresh ingredients.', btnLabel:'See Recipes 🍃', img:null, bg:'linear-gradient(135deg,#2D6A30 0%,#4A9450 50%,#1A3F1C 100%)' },
    { id:3, heading:'Farm to Door.<br><em>Same Day.</em>',          sub:'Order before noon, delivered to 13 zones across Greater Kampala today.',  btnLabel:'View Delivery Zones 📍', img:null, bg:'linear-gradient(135deg,#B84A0E 0%,#E8621A 55%,#7A2B12 100%)' },
  ];
  KF.data.heroCurrentSlide = 0;
  KF.data.heroInterval = null;
  KF.data.nextHeroId = 4;
}

// ── HERO SLIDESHOW RENDERER ──────────────────────────────────────
function renderHeroSlide(idx) {
  var slides = KF.data.heroSlides;
  if (!slides || !slides.length) return;
  if (idx === undefined) idx = KF.data.heroCurrentSlide || 0;
  var s = slides[idx % slides.length];
  KF.data.heroCurrentSlide = idx % slides.length;
  var hero = document.querySelector('.hero');
  if (!hero) return;
  hero.style.background = s.bg || 'linear-gradient(135deg,#0F2910 0%,#1A3F1C 55%,#0A4A35 100%)';
  var h1 = hero.querySelector('h1');
  var p  = hero.querySelector('p');
  var btn = hero.querySelector('.btn-hero-p');
  if (h1) h1.innerHTML = s.heading;
  if (p)  p.textContent = s.sub;
  if (btn) btn.textContent = s.btnLabel;
  // Update dots
  var dots = document.querySelectorAll('.hero-dot');
  dots.forEach(function(d,i){ d.classList.toggle('active', i === KF.data.heroCurrentSlide); });
}

function heroNext() { renderHeroSlide((KF.data.heroCurrentSlide + 1) % KF.data.heroSlides.length); }
function heroPrev() { renderHeroSlide((KF.data.heroCurrentSlide - 1 + KF.data.heroSlides.length) % KF.data.heroSlides.length); }
function heroGoTo(i) { renderHeroSlide(i); }

function startHeroSlideshow() {
  if (KF.data.heroInterval) clearInterval(KF.data.heroInterval);
  KF.data.heroInterval = setInterval(function(){ heroNext(); }, 5000);
  renderHeroDots();
  renderHeroSlide(0);
}

function renderHeroDots() {
  var wrap = document.getElementById('hero-dots');
  if (!wrap) return;
  wrap.innerHTML = KF.data.heroSlides.map(function(s, i){
    return '<button class="hero-dot' + (i===0?' active':'') + '" onclick="heroGoTo('+i+');resetHeroTimer()"></button>';
  }).join('');
}

function resetHeroTimer() {
  if (KF.data.heroInterval) clearInterval(KF.data.heroInterval);
  KF.data.heroInterval = setInterval(function(){ heroNext(); }, 5000);
}

// ── ADMIN: RECIPE MANAGEMENT ─────────────────────────────────────
if (!KF.data.adminRecipes) {
  KF.data.adminRecipes = [
    { id:1, title:'Luwombo', key:'luwombo', desc:"Uganda's royal steam stew. Tender meat steamed in banana leaves.", steps:'1. Prepare banana leaves\n2. Marinate meat\n3. Make groundnut sauce\n4. Wrap and steam 2 hrs\n5. Serve with matooke', img:null, caption:'Luwombo ready to steam', active:true },
    { id:2, title:'Nsenene', key:'nsenene', desc:'Fried grasshopper delicacy. Seasonal protein snack.', steps:'1. Clean nsenene\n2. Dry roast in pan\n3. Add oil and onions\n4. Fry until crispy\n5. Serve with lemon', img:null, caption:'Crispy fried nsenene', active:true },
    { id:3, title:'Bilungo Stew', key:'bilungo', desc:'Smoked eggplant sauce — deep, earthy and flavourful.', steps:'1. Char eggplant over flame\n2. Peel and mash into bilungo paste\n3. Fry onions, add tomatoes\n4. Add bilungo and dodo\n5. Simmer and serve', img:null, caption:'Bilungo stew on matooke', active:true },
  ];
  KF.data.nextRecipeId = 4;
  KF.data.editingRecipe = null;
}

function renderAdminRecipes() {
  var el = document.getElementById('asec-recipes');
  if (!el) return;
  var tbody = document.getElementById('recipe-admin-tbody');
  if (!tbody) return;
  tbody.innerHTML = (KF.data.adminRecipes || []).map(function(r) {
    return '<tr>' +
      '<td><strong>' + r.title + '</strong></td>' +
      '<td style="font-size:12px;max-width:200px;overflow:hidden">' + r.desc.substring(0,60) + '…</td>' +
      '<td>' + (r.img ? '<img src="'+r.img+'" style="width:50px;height:36px;object-fit:cover;border-radius:6px">' : '<span style="color:var(--muted);font-size:12px">No image</span>') + '</td>' +
      '<td>' + (r.caption || '') + '</td>' +
      '<td><span class="badge ' + (r.active ? 'badge-green' : 'badge-terra') + '">' + (r.active ? 'Visible' : 'Hidden') + '</span></td>' +
      '<td><div class="tbl-actions">' +
      '<button class="btn-edit" onclick="editRecipeAdmin('+r.id+')">✏ Edit</button>' +
      '<button class="btn-edit" style="background:var(--y5);color:var(--y1);border-color:var(--y3)" onclick="toggleRecipeVisibility('+r.id+')">' + (r.active ? 'Hide' : 'Show') + '</button>' +
      '<button class="btn-del" onclick="deleteRecipeAdmin('+r.id+')">🗑 Delete</button>' +
      '</div></td>' +
    '</tr>';
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">No recipes yet</td></tr>';
}

function openAddRecipeAdmin() {
  KF.data.editingRecipe = null;
  var el = document.getElementById('recipe-admin-form-title');
  if (el) el.textContent = 'Add New Recipe';
  ['ra-title','ra-desc','ra-caption','ra-steps'].forEach(function(id){ var e = document.getElementById(id); if(e) e.value=''; });
  var prev = document.getElementById('ra-img-preview');
  if (prev) prev.innerHTML = '';
  openModal('modal-recipe-admin');
}

function editRecipeAdmin(id) {
  var r = (KF.data.adminRecipes||[]).find(function(x){return x.id===id;});
  if (!r) return;
  KF.data.editingRecipe = id;
  var el = document.getElementById('recipe-admin-form-title');
  if (el) el.textContent = 'Edit Recipe';
  var set = function(eid, val){ var e = document.getElementById(eid); if(e) e.value = val||''; };
  set('ra-title', r.title);
  set('ra-desc', r.desc);
  set('ra-caption', r.caption);
  set('ra-steps', r.steps);
  var prev = document.getElementById('ra-img-preview');
  if (prev) prev.innerHTML = r.img ? '<img src="'+r.img+'" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-top:8px">' : '';
  openModal('modal-recipe-admin');
}

function saveRecipeAdmin() {
  var title = (document.getElementById('ra-title')||{}).value || '';
  var desc  = (document.getElementById('ra-desc')||{}).value || '';
  var steps = (document.getElementById('ra-steps')||{}).value || '';
  var caption = (document.getElementById('ra-caption')||{}).value || '';
  if (!title.trim()) { toast('Enter a recipe title','⚠️'); return; }
  // Handle image upload
  var fileInput = document.getElementById('ra-img-file');
  var savedImg = (KF.data.editingRecipe ? (KF.data.adminRecipes||[]).find(function(x){return x.id===KF.data.editingRecipe;})||{} : {}).img || null;
  if (fileInput && fileInput.files && fileInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      _saveRecipeData(title, desc, steps, caption, e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    _saveRecipeData(title, desc, steps, caption, savedImg);
  }
}

function _saveRecipeData(title, desc, steps, caption, img) {
  if (KF.data.editingRecipe) {
    var r = (KF.data.adminRecipes||[]).find(function(x){return x.id===KF.data.editingRecipe;});
    if (r) { r.title=title; r.desc=desc; r.steps=steps; r.caption=caption; if(img!==undefined) r.img=img; }
    toast('Recipe updated! 🍃');
  } else {
    KF.data.adminRecipes = KF.data.adminRecipes || [];
    var key = title.toLowerCase().replace(/[^a-z]/g,'');
    KF.data.adminRecipes.push({ id:KF.data.nextRecipeId++, title:title, key:key, desc:desc, steps:steps, caption:caption, img:img, active:true });
    toast('Recipe added! 🍃');
  }
  closeModal('modal-recipe-admin');
  renderAdminRecipes();
  // Sync recipe section on homepage
  syncRecipesFromAdmin();
}

function toggleRecipeVisibility(id) {
  var r = (KF.data.adminRecipes||[]).find(function(x){return x.id===id;});
  if (r) { r.active = !r.active; renderAdminRecipes(); syncRecipesFromAdmin(); toast(r.title + ' ' + (r.active?'shown':'hidden')); }
}

function deleteRecipeAdmin(id) {
  if (!confirm('Delete this recipe?')) return;
  KF.data.adminRecipes = (KF.data.adminRecipes||[]).filter(function(r){return r.id!==id;});
  renderAdminRecipes();
  syncRecipesFromAdmin();
  toast('Recipe deleted','🗑');
}

function syncRecipesFromAdmin() {
  // Rebuild the homepage recipe tabs from admin data
  var tabsWrap = document.querySelector('.recipe-tabs-wrap');
  if (!tabsWrap) return;
  var active = (KF.data.adminRecipes||[]).filter(function(r){return r.active;});
  if (!active.length) return;
  tabsWrap.innerHTML = active.map(function(r,i){
    return '<button class="recipe-tab' + (i===0?' active':'') + '" onclick="switchRecipeAdmin('+r.id+',this)">🍃 ' + r.title + '</button>';
  }).join('');
  // Show first recipe
  if (active.length) renderRecipeCard(active[0], 0);
}

function switchRecipeAdmin(id, btn) {
  var r = (KF.data.adminRecipes||[]).find(function(x){return x.id===id;});
  if (!r) return;
  document.querySelectorAll('.recipe-tab').forEach(function(t){t.classList.remove('active');});
  if (btn) btn.classList.add('active');
  renderRecipeCard(r, 0);
}

function renderRecipeCard(r, idx) {
  var container = document.querySelector('.recipe-card.show') || document.querySelector('.recipe-card');
  if (!container) return;
  // Update banner
  var nameEl = container.querySelector('.recipe-banner-name');
  var subEl  = container.querySelector('.recipe-banner-sub');
  var imgEl  = container.querySelector('.recipe-banner-emoji');
  if (nameEl) nameEl.textContent = r.title;
  if (subEl)  subEl.textContent  = r.desc.substring(0,50);
  // Update steps
  var stepsEl = container.querySelector('.recipe-steps');
  if (stepsEl && r.steps) {
    stepsEl.innerHTML = r.steps.split('\n').filter(Boolean).map(function(line){
      return '<li>' + line.replace(/^\d+\.\s*/,'') + '</li>';
    }).join('');
  }
}

// ── ADMIN: HERO SLIDE MANAGEMENT ────────────────────────────────
function renderAdminHeroSlides() {
  var el = document.getElementById('hero-slides-tbody');
  if (!el) return;
  el.innerHTML = (KF.data.heroSlides || []).map(function(s,i) {
    return '<tr>' +
      '<td><strong>#' + (i+1) + '</strong></td>' +
      '<td style="font-size:12px;max-width:200px">' + s.heading.replace(/<[^>]+>/g,'') + '</td>' +
      '<td style="font-size:12px">' + s.sub.substring(0,40) + '…</td>' +
      '<td>' + (s.img ? '<img src="'+s.img+'" style="width:60px;height:40px;object-fit:cover;border-radius:6px">' : '<span style="color:var(--muted);font-size:11px">Default BG</span>') + '</td>' +
      '<td><div class="tbl-actions">' +
      '<button class="btn-edit" onclick="editHeroSlide('+i+')">✏ Edit</button>' +
      '<button class="btn-del" onclick="deleteHeroSlide('+i+')">🗑</button>' +
      '</div></td>' +
    '</tr>';
  }).join('') || '<tr><td colspan="5" style="color:var(--muted);text-align:center;padding:20px">No slides</td></tr>';
}

function openAddHeroSlide() {
  KF.data.editingHeroSlide = null;
  ['hs-heading','hs-sub','hs-btn','hs-bg'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
  var prev=document.getElementById('hs-img-preview');if(prev)prev.innerHTML='';
  openModal('modal-hero-slide');
}

function editHeroSlide(idx) {
  var s = KF.data.heroSlides[idx];
  if (!s) return;
  KF.data.editingHeroSlide = idx;
  var set=function(id,v){var e=document.getElementById(id);if(e)e.value=v||'';};
  set('hs-heading', s.heading.replace(/<[^>]+>/g,''));
  set('hs-sub', s.sub);
  set('hs-btn', s.btnLabel);
  set('hs-bg', s.bg||'');
  var prev=document.getElementById('hs-img-preview');
  if(prev) prev.innerHTML = s.img ? '<img src="'+s.img+'" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-top:8px">' : '';
  openModal('modal-hero-slide');
}

function saveHeroSlide() {
  var heading = (document.getElementById('hs-heading')||{}).value||'';
  var sub     = (document.getElementById('hs-sub')||{}).value||'';
  var btnLabel= (document.getElementById('hs-btn')||{}).value||'Shop Now 🛒';
  var bg      = (document.getElementById('hs-bg')||{}).value||'';
  if (!heading.trim()) { toast('Enter a heading','⚠️'); return; }
  var fileInput = document.getElementById('hs-img-file');
  var existingImg = KF.data.editingHeroSlide !== null && KF.data.editingHeroSlide !== undefined ? (KF.data.heroSlides[KF.data.editingHeroSlide]||{}).img : null;
  if (fileInput && fileInput.files && fileInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e){ _saveHeroData(heading,sub,btnLabel,bg,e.target.result); };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    _saveHeroData(heading,sub,btnLabel,bg,existingImg);
  }
}

function _saveHeroData(heading,sub,btnLabel,bg,img) {
  var slide = { id: KF.data.nextHeroId++, heading:'<em>'+heading+'</em>', sub:sub, btnLabel:btnLabel, bg:bg||'linear-gradient(135deg,#0F2910 0%,#1A3F1C 55%,#0A4A35 100%)', img:img };
  if (KF.data.editingHeroSlide !== null && KF.data.editingHeroSlide !== undefined) {
    KF.data.heroSlides[KF.data.editingHeroSlide] = slide;
    toast('Slide updated!');
  } else {
    KF.data.heroSlides.push(slide);
    toast('Slide added!');
  }
  closeModal('modal-hero-slide');
  renderAdminHeroSlides();
  renderHeroDots();
  renderHeroSlide(KF.data.heroCurrentSlide);
}

function deleteHeroSlide(idx) {
  if (KF.data.heroSlides.length <= 1) { toast('Must have at least 1 slide','⚠️'); return; }
  if (!confirm('Delete this slide?')) return;
  KF.data.heroSlides.splice(idx,1);
  KF.data.heroCurrentSlide = 0;
  renderAdminHeroSlides();
  renderHeroDots();
  renderHeroSlide(0);
  toast('Slide deleted','🗑');
}

// ── DEFINITIVE showSec — replaces all previous versions ──────────
showSec = function(id) {
  KF.state.activeAdminSection = id;
  document.querySelectorAll('.admin-section').forEach(function(s){s.classList.remove('show');});
  var sec = document.getElementById('asec-'+id);
  if (!sec) { console.warn('Section not found: asec-'+id); return; }
  sec.classList.add('show');
  document.querySelectorAll('.side-item[data-sec]').forEach(function(i){
    i.classList.toggle('active', i.dataset.sec === id);
  });
  var map = {
    dashboard:    renderDashboard,
    products:     renderProducts,
    categories:   renderCategories,
    inventory:    renderInventory,
    orders:       renderOrders,
    tickets:      renderTickets,
    riders:       renderRiders,
    delivery:     renderDelivery,
    vendors:      renderVendors,
    finance:      renderFinance,
    procurement:  renderProcurement,
    hr:           renderHR,
    reports:      function(){ renderReport(KF.state.activeReport||'sales'); },
    customers:    renderCustomers,
    feedback:     renderAdminFeedback,
    vouchers:     renderVouchers,
    loyalty:      renderLoyalty,
    newsletter:   renderNewsletterAdmin,
    recipes:      renderAdminRecipes,
    heromgmt:     renderAdminHeroSlides,
  };
  if (map[id]) { try { map[id](); } catch(e) { console.error('Render error for '+id, e); } }
};

// ── MOBILE BOTTOM NAV FIX ───────────────────────────────────────
// Ensure all nav buttons work correctly
window.navToShop     = function(){ showPage('page-shop'); };
window.navToCheckout = function(){ showPage('page-checkout'); };
window.navToOffers   = function(){ showPage('page-shop'); setTimeout(function(){ var fb=document.getElementById('flash-bar');if(fb)fb.scrollIntoView({behavior:'smooth'}); },200); };
window.navToCart     = function(){ openCart(); };
window.navToSignIn   = function(){ openModal('modal-login'); };
window.navToAdmin    = function(){ openModal('modal-admin-login'); };

// ── FIX: Help. trigger on h5 element ────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Make sure Help. h5 element fires correctly
  var helpTrigger = document.querySelector('.help-trigger');
  if (helpTrigger) {
    helpTrigger.style.cursor = 'pointer';
    // Remove existing onclick and replace with addEventListener for reliability
    helpTrigger.removeAttribute('onclick');
    helpTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      openModal('modal-admin-login');
    });
  }

  // Fix all fchip filter buttons - ensure they pass event correctly
  document.querySelectorAll('.fchip').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var f = btn.getAttribute('data-filter') || btn.textContent.trim().toLowerCase().replace(/[^a-z]/g,'');
      // handled by inline onclick - just ensure active class updates
    });
  });

  // Start hero slideshow
  startHeroSlideshow();

  // Sync recipes from admin data
  syncRecipesFromAdmin();
});

// ── FIX: setFilter to handle null btn gracefully ─────────────────
var _origSetFilter = typeof setFilter === 'function' ? setFilter : null;
window.setFilter = function(f, btn) {
  KF.state.activeFilter = f;
  document.querySelectorAll('.fchip').forEach(function(c){ c.classList.remove('active'); });
  if (btn) {
    btn.classList.add('active');
  } else {
    // find the button by data-filter attribute or text
    document.querySelectorAll('.fchip').forEach(function(c){
      if (c.getAttribute('data-filter') === f) c.classList.add('active');
    });
  }
  if (typeof renderProductGrid === 'function') renderProductGrid();
};

// ── MOBILE RESPONSIVE NAV ───────────────────────────────────────
function toggleMobileMenu() {
  var menu = document.getElementById('mobile-nav-menu');
  if (menu) menu.classList.toggle('open');
}


// ── IMAGE PREVIEW HELPER ─────────────────────────────────────────
function previewImg(inputId, previewId) {
  var input = document.getElementById(inputId);
  var preview = document.getElementById(previewId);
  if (!input || !preview || !input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    preview.innerHTML = '<img src="'+e.target.result+'" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-top:10px;border:2px solid var(--c3)">';
  };
  reader.readAsDataURL(input.files[0]);
}

// ── MOBILE CART BADGE SYNC ───────────────────────────────────────
var _origUpdateCartUI = typeof updateCartUI === 'function' ? updateCartUI : null;
if (_origUpdateCartUI) {
  updateCartUI = function() {
    _origUpdateCartUI();
    var mbn = document.getElementById('mbn-cart-count');
    if (mbn) {
      var count = KF ? KF.cartCount() : 0;
      mbn.textContent = count;
      mbn.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  };
}
