// ===== KUJAZA FRESH — FIXES & FEATURES =====

// ─── HELP. TRIGGER — runs immediately, capture phase ────────────
(function attachHelp() {
  function doAttach() {
    var triggers = document.querySelectorAll('.help-trigger, .help-dot');
    triggers.forEach(function(el) {
      el.style.cursor = 'pointer';
      el.removeAttribute('onclick');
      el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openModal('modal-admin-login');
      }, true);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doAttach);
  } else {
    doAttach();
  }
})();

window.openAdminLogin = function() { openModal('modal-admin-login'); };

// ─── DOMContentLoaded INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initHeroSlides();
  startHeroSlideshow();
  if (typeof renderAllRecipeIngredients === 'function') renderAllRecipeIngredients();
  if (typeof renderFeedbackReviews === 'function') renderFeedbackReviews();
  initRecipeAdmin();
  buildCombos();
  startCountdown();
  var today = new Date().toISOString().split('T')[0];
  ['inc-date','exp-date','lv-from','lv-to','sp-lv-from','sp-lv-to'].forEach(function(id) {
    var e = document.getElementById(id); if (e && !e.value) e.value = today;
  });
});

// ─── COUNTDOWN ──────────────────────────────────────────────────
function startCountdown() {
  var s = 9953;
  setInterval(function() {
    s = s > 0 ? s - 1 : 86399;
    var h = String(Math.floor(s/3600)).padStart(2,'0');
    var m = String(Math.floor((s%3600)/60)).padStart(2,'0');
    var sec = String(s%60).padStart(2,'0');
    var el = document.getElementById('countdown');
    if (el) el.textContent = h+':'+m+':'+sec;
  }, 1000);
}

// ─── COMBO BASKETS ──────────────────────────────────────────────
function buildCombos() {
  var combos = [
    { name:'Ugandan Veggie Box',     emoji:'🥗', img:null,                  price:28000, orig:35000, desc:'Tomatoes, onions, dodo, nakati, pumpkin, carrots',    save:20 },
    { name:'Tropical Fruit Basket',  emoji:'🧺', img:'images/market.jpg',   price:38000, orig:50000, desc:'Mangoes, pineapple, passion fruit, bananas, pawpaw',  save:24 },
    { name:'Ugandan Staples Bundle', emoji:'🌾', img:null,                  price:45000, orig:55000, desc:'Beans, maize flour, millet, groundnuts, sorghum',     save:18 },
    { name:'Student Essentials',     emoji:'🎓', img:null,                  price:18000, orig:22000, desc:'Matooke, tomatoes, onions, dodo, maize flour 1kg',    save:18 },
    { name:'Spice & Flavour Box',    emoji:'🌶', img:null,                  price:20000, orig:25000, desc:'Ginger, chilli, simsim, spring onions, fresh herbs',   save:20 },
    { name:'Farm Fresh Breakfast',   emoji:'🥚', img:'images/eggs.jpg',     price:32000, orig:38000, desc:'Eggs (tray), bananas, pawpaw, honey, fresh ginger',   save:16 },
  ];
  var grid = document.getElementById('combos-grid');
  if (!grid) return;
  grid.innerHTML = combos.map(function(c) {
    var imgArea = c.img
      ? '<img src="'+c.img+'" alt="'+c.name+'" class="box-photo" loading="lazy">'
      : '<div class="box-emoji-display" style="font-size:52px">'+c.emoji+'</div>';
    return '<div class="pcard" style="cursor:default">'+
      '<div class="pcard-box"><div class="box-frame">'+
        '<div class="box-top-strip"><span class="box-logo">Kujaza Fresh</span><span class="box-organic">🌱 Value Box</span></div>'+
        '<div class="box-image-area '+(c.img?'has-photo':'no-photo')+'" style="height:140px">'+imgArea+
          '<div class="discount-ribbon">Save '+c.save+'%</div>'+
        '</div>'+
        '<div class="box-wood-grain"></div><div class="box-side-left"></div><div class="box-side-right"></div>'+
      '</div></div>'+
      '<div class="pcard-body">'+
        '<div class="pcard-name">'+c.name+'</div>'+
        '<div class="pcard-cat">🧺 Basket Combo</div>'+
        '<div class="pcard-price-row">'+
          '<div class="pcard-price">UGX '+c.price.toLocaleString()+' <small>/ box</small></div>'+
          '<div class="pcard-orig">UGX '+c.orig.toLocaleString()+'</div>'+
        '</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:4px">'+c.desc+'</div>'+
      '</div>'+
      '<div class="pcard-foot">'+
        '<span class="badge badge-green" style="font-size:10px">Value Deal</span>'+
        '<button class="add-btn" onclick="toast(\''+c.emoji+' '+c.name.replace(/'/g,'&#39;')+' added!\',\'✅\')">+ Add</button>'+
      '</div></div>';
  }).join('');
}

// ─── IMAGE PREVIEW HELPER ───────────────────────────────────────
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

// ─── HERO SLIDESHOW ─────────────────────────────────────────────
function initHeroSlides() {
  if (!KF.data.heroSlides) {
    KF.data.heroSlides = [
      { heading:'Fresh Picked.<br><em>Delivered Today.</em>',           sub:'Fruits, vegetables, grains & more — sourced direct from Ugandan farms. Same-day delivery across 13 zones.', btnLabel:'Shop Fresh Now 🛒', img:null, bg:'linear-gradient(135deg,#0F2910 0%,#1A3F1C 55%,#0A4A35 100%)' },
      { heading:'Authentic Ugandan<br><em>Recipes & Ingredients.</em>', sub:'Luwombo, Nsenene, Bilungo — cook the real thing. Every ingredient available on Kujaza Fresh.',            btnLabel:'See Recipes 🍃',   img:null, bg:'linear-gradient(135deg,#2D6A30 0%,#4A9450 50%,#1A3F1C 100%)' },
      { heading:'Farm to Door.<br><em>Same Day Delivery.</em>',         sub:'Order before noon, delivered to your door today. Serving Greater Kampala & 13 zones.',                       btnLabel:'View Zones 📍',    img:'images/market.jpg', bg:'linear-gradient(135deg,#B84A0E 0%,#E8621A 55%,#7A2B12 100%)' },
    ];
  }
  if (KF.data.heroCurrentSlide === undefined) KF.data.heroCurrentSlide = 0;
  if (!KF.data.nextHeroId) KF.data.nextHeroId = KF.data.heroSlides.length + 1;
  renderHeroDots();
  renderHeroSlide(0);
}

function renderHeroSlide(idx) {
  var slides = KF.data.heroSlides;
  if (!slides || !slides.length) return;
  idx = ((idx % slides.length) + slides.length) % slides.length;
  KF.data.heroCurrentSlide = idx;
  var s = slides[idx];
  var hero = document.querySelector('.hero');
  if (hero) {
    if (s.img) {
      hero.style.backgroundImage = 'linear-gradient(rgba(10,20,10,.55),rgba(10,20,10,.55)),url(' + s.img + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    } else {
      hero.style.backgroundImage = 'none';
      hero.style.background = s.bg;
    }
  }
  var h1 = document.querySelector('.hero h1');            if (h1) h1.innerHTML = s.heading;
  var hp = document.querySelector('.hero-left > p');      if (hp) hp.textContent = s.sub;
  var hb = document.querySelector('.btn-hero-p');         if (hb) hb.textContent = s.btnLabel;
  document.querySelectorAll('.hero-dot').forEach(function(d,i){ d.classList.toggle('active', i===idx); });
}

function heroNext() { renderHeroSlide(KF.data.heroCurrentSlide + 1); }
function heroPrev() { renderHeroSlide(KF.data.heroCurrentSlide - 1); }
function heroGoTo(i) { renderHeroSlide(i); }

function startHeroSlideshow() {
  if (KF.data.heroInterval) clearInterval(KF.data.heroInterval);
  KF.data.heroInterval = setInterval(heroNext, 5000);
}
function resetHeroTimer() {
  if (KF.data.heroInterval) clearInterval(KF.data.heroInterval);
  KF.data.heroInterval = setInterval(heroNext, 5000);
}

function renderHeroDots() {
  var wrap = document.getElementById('hero-dots');
  if (!wrap) return;
  wrap.innerHTML = (KF.data.heroSlides||[]).map(function(s,i) {
    return '<button class="hero-dot'+(i===0?' active':'')+'" onclick="heroGoTo('+i+');resetHeroTimer()"></button>';
  }).join('');
}

// ─── RECIPE ADMIN DATA INIT ─────────────────────────────────────
function initRecipeAdmin() {
  if (!KF.data.adminRecipes) {
    KF.data.adminRecipes = [
      { id:1, title:'Luwombo',      desc:"Uganda's royal steam stew — tender meat in banana leaves with groundnut sauce.", steps:"1. Wilt plantain leaves over flame for 30 seconds until pliable\n2. Cut chicken/beef into pieces, season with onions, ginger, bilungo and salt\n3. Mix ebinyebwa paste with warm water into thick sauce, add spring onions and tomatoes\n4. Lay banana leaf flat, add meat, spoon sauce over generously, fold and tie\n5. Stack parcels in pot over boiling water, cover tightly, steam 1.5-2 hours\n6. Open at table and serve with matooke, rice or sweet potatoes", img:null, caption:'Luwombo parcels ready to steam', active:true },
      { id:2, title:'Nsenene',      desc:'Fried grasshopper delicacy — crispy, salty and packed with protein.', steps:"1. Remove wings and hind legs, rinse in salted water, pat completely dry\n2. Heat dry pan on medium, add nsenene and stir constantly for 5 minutes\n3. Add splash of oil, sliced onions, garlic, chilli and salt\n4. Stir-fry 8-10 minutes until crispy and golden brown\n5. Remove from heat, squeeze fresh lemon juice over top\n6. Toss with spring onions and serve warm", img:null, caption:'Crispy fried nsenene — a seasonal Ugandan delicacy', active:true },
      { id:3, title:'Bilungo Stew', desc:'Smoked eggplant sauce — deep, earthy flavour unlike anything else.', steps:"1. Char whole eggplants directly on open flame until completely blackened\n2. Cool, peel off charred skin, mash flesh into smooth bilungo paste with salt and garlic\n3. Fry onions and spring onions in oil until golden, about 8 minutes\n4. Add tomatoes and cook down for 8 minutes until soft\n5. Stir in bilungo paste, add dodo/spinach and groundnut paste dissolved in water\n6. Add chicken pieces if using, simmer 20 minutes, serve over matooke or rice", img:null, caption:'Bilungo stew served over matooke', active:true },
    ];
    KF.data.nextRecipeId = 4;
  }
}

function renderAdminRecipes() {
  var tbody = document.getElementById('recipe-admin-tbody');
  if (!tbody) return;
  var rows = (KF.data.adminRecipes||[]);
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">No recipes yet. Add one!</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(function(r) {
    return '<tr>' +
      '<td><strong>'+r.title+'</strong></td>' +
      '<td style="font-size:12px;max-width:180px">'+r.desc.substring(0,60)+'…</td>' +
      '<td>'+(r.img ? '<img src="'+r.img+'" style="width:50px;height:36px;object-fit:cover;border-radius:6px">' : '<span style="color:var(--muted);font-size:12px">No photo</span>')+'</td>' +
      '<td style="font-size:12px">'+(r.caption||'—')+'</td>' +
      '<td><span class="badge '+(r.active?'badge-green':'badge-terra')+'">'+(r.active?'Visible':'Hidden')+'</span></td>' +
      '<td><div class="tbl-actions">' +
        '<button class="btn-edit" onclick="editRecipeAdmin('+r.id+')">✏ Edit</button>' +
        '<button class="btn-edit" style="background:var(--y5);color:var(--y1);border-color:var(--y3)" onclick="toggleRecipeVisible('+r.id+')">'+(r.active?'Hide':'Show')+'</button>' +
        '<button class="btn-del" onclick="delRecipeAdmin('+r.id+')">🗑</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function openAddRecipeAdmin() {
  KF.data.editingRecipeId = null;
  var t = document.getElementById('recipe-admin-form-title'); if (t) t.textContent = 'Add New Recipe';
  ['ra-title','ra-desc','ra-caption','ra-steps'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=''; });
  var prev = document.getElementById('ra-img-preview'); if (prev) prev.innerHTML = '';
  openModal('modal-recipe-admin');
}

function editRecipeAdmin(id) {
  var r = (KF.data.adminRecipes||[]).find(function(x){ return x.id===id; });
  if (!r) return;
  KF.data.editingRecipeId = id;
  var t = document.getElementById('recipe-admin-form-title'); if (t) t.textContent = 'Edit Recipe';
  var set = function(eid,v){ var e=document.getElementById(eid); if(e) e.value = v||''; };
  set('ra-title', r.title); set('ra-desc', r.desc); set('ra-caption', r.caption); set('ra-steps', r.steps);
  var prev = document.getElementById('ra-img-preview');
  if (prev) prev.innerHTML = r.img ? '<img src="'+r.img+'" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-top:8px">' : '';
  openModal('modal-recipe-admin');
}

function saveRecipeAdmin() {
  var title = ((document.getElementById('ra-title')||{}).value||'').trim();
  var desc  = ((document.getElementById('ra-desc')||{}).value||'').trim();
  var steps = ((document.getElementById('ra-steps')||{}).value||'').trim();
  var cap   = ((document.getElementById('ra-caption')||{}).value||'').trim();
  if (!title) { toast('Enter a recipe title','⚠️'); return; }
  var fi = document.getElementById('ra-img-file');
  var existingImg = KF.data.editingRecipeId
    ? ((KF.data.adminRecipes||[]).find(function(x){ return x.id===KF.data.editingRecipeId; })||{}).img
    : null;
  if (fi && fi.files && fi.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e){ _doSaveRecipe(title, desc, steps, cap, e.target.result); };
    reader.readAsDataURL(fi.files[0]);
  } else {
    _doSaveRecipe(title, desc, steps, cap, existingImg);
  }
}

function _doSaveRecipe(title, desc, steps, cap, img) {
  if (KF.data.editingRecipeId) {
    var r = (KF.data.adminRecipes||[]).find(function(x){ return x.id===KF.data.editingRecipeId; });
    if (r) { r.title=title; r.desc=desc; r.steps=steps; r.caption=cap; if(img!==undefined) r.img=img; }
    toast('Recipe updated! 🍃');
  } else {
    KF.data.adminRecipes = KF.data.adminRecipes || [];
    KF.data.adminRecipes.push({ id:KF.data.nextRecipeId++, title:title, desc:desc, steps:steps, caption:cap, img:img||null, active:true });
    toast('Recipe added! 🍃');
  }
  closeModal('modal-recipe-admin');
  renderAdminRecipes();
}

function toggleRecipeVisible(id) {
  var r = (KF.data.adminRecipes||[]).find(function(x){ return x.id===id; });
  if (r) { r.active = !r.active; renderAdminRecipes(); toast(r.title+' '+(r.active?'shown':'hidden')); }
}
function delRecipeAdmin(id) {
  if (!confirm('Delete this recipe?')) return;
  KF.data.adminRecipes = (KF.data.adminRecipes||[]).filter(function(r){ return r.id!==id; });
  renderAdminRecipes(); toast('Recipe deleted','🗑');
}

// ─── HERO SLIDE ADMIN ───────────────────────────────────────────
function renderAdminHeroSlides() {
  var el = document.getElementById('hero-slides-tbody'); if (!el) return;
  el.innerHTML = (KF.data.heroSlides||[]).map(function(s,i) {
    return '<tr>' +
      '<td><strong>#'+(i+1)+'</strong></td>' +
      '<td style="font-size:12px;max-width:200px">'+s.heading.replace(/<[^>]+>/g,'')+'</td>' +
      '<td style="font-size:12px;color:var(--muted)">'+s.sub.substring(0,40)+'…</td>' +
      '<td>'+(s.img ? '<img src="'+s.img+'" style="width:60px;height:40px;object-fit:cover;border-radius:6px">' : '<span style="font-size:11px;color:var(--muted)">Gradient BG</span>')+'</td>' +
      '<td><div class="tbl-actions">' +
        '<button class="btn-edit" onclick="editHeroSlide('+i+')">✏ Edit</button>' +
        '<button class="btn-del" onclick="delHeroSlide('+i+')">🗑</button>' +
      '</div></td>' +
    '</tr>';
  }).join('') || '<tr><td colspan="5" style="color:var(--muted);text-align:center;padding:20px">No slides</td></tr>';
}

function openAddHeroSlide() {
  KF.data.editingHeroIdx = null;
  ['hs-heading','hs-sub','hs-btn','hs-bg'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=''; });
  var prev=document.getElementById('hs-img-preview'); if(prev) prev.innerHTML='';
  openModal('modal-hero-slide');
}
function editHeroSlide(idx) {
  var s = KF.data.heroSlides[idx]; if (!s) return;
  KF.data.editingHeroIdx = idx;
  var set=function(id,v){ var e=document.getElementById(id); if(e) e.value=v||''; };
  set('hs-heading', s.heading.replace(/<[^>]+>/g,''));
  set('hs-sub',     s.sub);
  set('hs-btn',     s.btnLabel);
  set('hs-bg',      s.bg||'');
  var prev=document.getElementById('hs-img-preview');
  if(prev) prev.innerHTML = s.img ? '<img src="'+s.img+'" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-top:8px">' : '';
  openModal('modal-hero-slide');
}
function saveHeroSlide() {
  var heading = ((document.getElementById('hs-heading')||{}).value||'').trim();
  var sub     = ((document.getElementById('hs-sub')||{}).value||'').trim();
  var btnLbl  = ((document.getElementById('hs-btn')||{}).value||'Shop Now 🛒').trim();
  var bg      = ((document.getElementById('hs-bg')||{}).value||'').trim();
  if (!heading) { toast('Enter a heading','⚠️'); return; }
  var fi = document.getElementById('hs-img-file');
  var existImg = (KF.data.editingHeroIdx!==null && KF.data.editingHeroIdx!==undefined)
    ? (KF.data.heroSlides[KF.data.editingHeroIdx]||{}).img : null;
  if (fi && fi.files && fi.files[0]) {
    var reader=new FileReader();
    reader.onload=function(e){ _doSaveHero(heading,sub,btnLbl,bg,e.target.result); };
    reader.readAsDataURL(fi.files[0]);
  } else { _doSaveHero(heading,sub,btnLbl,bg,existImg); }
}
function _doSaveHero(heading,sub,btnLabel,bg,img) {
  var slide = { heading:heading, sub:sub, btnLabel:btnLabel, bg:bg||'linear-gradient(135deg,#0F2910 0%,#1A3F1C 100%)', img:img||null };
  if (KF.data.editingHeroIdx!==null && KF.data.editingHeroIdx!==undefined) {
    KF.data.heroSlides[KF.data.editingHeroIdx] = slide; toast('Slide updated!');
  } else { KF.data.heroSlides.push(slide); toast('Slide added!'); }
  closeModal('modal-hero-slide');
  renderAdminHeroSlides(); renderHeroDots(); renderHeroSlide(KF.data.heroCurrentSlide);
}
function delHeroSlide(idx) {
  if (KF.data.heroSlides.length <= 1) { toast('Need at least 1 slide','⚠️'); return; }
  if (!confirm('Delete this slide?')) return;
  KF.data.heroSlides.splice(idx,1); KF.data.heroCurrentSlide=0;
  renderAdminHeroSlides(); renderHeroDots(); renderHeroSlide(0); toast('Slide deleted','🗑');
}

// ─── DEFINITIVE showSec ─────────────────────────────────────────
function showSec(id) {
  KF.state.activeAdminSection = id;
  document.querySelectorAll('.admin-section').forEach(function(s){ s.classList.remove('show'); });
  var sec = document.getElementById('asec-'+id);
  if (!sec) { console.warn('Section missing: asec-'+id); return; }
  sec.classList.add('show');
  document.querySelectorAll('.side-item[data-sec]').forEach(function(i){
    i.classList.toggle('active', i.dataset.sec===id);
  });
  var fn = {
    dashboard: renderDashboard, products: renderProducts, categories: renderCategories,
    inventory: renderInventory, orders: renderOrders, tickets: renderTickets,
    riders: renderRiders, delivery: renderDelivery, vendors: renderVendors,
    finance: renderFinance, procurement: renderProcurement,
    hr: typeof renderHR==='function' ? renderHR : null,
    payroll: function(){ if(typeof runPayroll==='function'){var m=document.getElementById('payroll-month');if(m&&!m.value){var now=new Date();m.value=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');}runPayroll();}},
    finstatements: function(){ if(typeof updateStmtDates==='function') updateStmtDates(); },
    taxreturns: typeof renderTaxReturns==='function' ? renderTaxReturns : null,
    reports: function(){ renderReport(KF.state.activeReport||'sales'); },
    customers: renderCustomers, feedback: renderAdminFeedback,
    vouchers: renderVouchers, loyalty: renderLoyalty, newsletter: renderNewsletterAdmin,
    recipes: renderAdminRecipes, heromgmt: renderAdminHeroSlides,
    whatsapp:  typeof renderWhatsappOrders==='function' ? renderWhatsappOrders  : null,
    b2b:       typeof renderB2B==='function'            ? renderB2B             : null,
    hubs:      typeof renderHubs==='function'           ? renderHubs            : null,
    userroles: typeof renderUserRoles==='function'      ? renderUserRoles       : null,
    tickets:   typeof renderTickets==='function'        ? renderTickets         : null,
  };
  if (fn[id]) { try { fn[id](); } catch(e){ console.error('showSec render error ['+id+']:', e); } }
}

// Alias for backward compatibility
var updateCartUI = typeof updateCartBadge === 'function' ? updateCartBadge : function(){};

// ─── MOBILE MENU TOGGLE ──────────────────────────────────────
function toggleMobileMenu() {
  var menu = document.getElementById('hamburger');
  var nav  = document.querySelector('.nav-center');
  if (nav) {
    nav.classList.toggle('open');
    if (menu) {
      var isOpen = nav.classList.contains('open');
      menu.setAttribute('aria-expanded', isOpen);
    }
  }
}
// Close mobile menu when a page link is clicked
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-link').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var nav = document.querySelector('.nav-center');
      if (nav) nav.classList.remove('open');
    });
  });
});
