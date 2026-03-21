// ===== KUJAZA FRESH — MAIN APP (v8 clean) =====

function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('show'); });
  var pg = document.getElementById(id);
  if (pg) pg.classList.add('show');
  window.scrollTo(0, 0);

  var isShop     = (id === 'page-shop');
  var isCheckout = (id === 'page-checkout');
  var isPublic   = isShop || isCheckout; // pages customers can use

  // Secondary nav and search — only on shop page
  var secNav     = document.getElementById('secondary-nav');
  var searchWrap = document.getElementById('nav-search-wrap');
  if (secNav)     secNav.style.display     = isShop ? '' : 'none';
  if (searchWrap) searchWrap.style.display = isShop ? '' : 'none';

  // Wishlist and Cart buttons — hidden on admin & staff portals
  var cartBtn     = document.querySelector('.nav-cart-btn');
  var wishlistBtn = document.querySelector('.nav-icon-btn[title="Wishlist"]');
  if (cartBtn)     cartBtn.style.display     = isPublic ? '' : 'none';
  if (wishlistBtn) wishlistBtn.style.display = isPublic ? '' : 'none';

  // Mobile bottom nav — only on public pages
  var mbn = document.getElementById('mobile-bottom-nav');
  if (mbn) mbn.style.display = isPublic ? '' : 'none';

  // Update navbar context label
  var adminBar = document.getElementById('navbar-context');
  if (adminBar) {
    if (id === 'page-admin') {
      adminBar.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>&nbsp; Admin Dashboard';
    } else if (id === 'page-staff') {
      adminBar.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>&nbsp; Staff Portal';
    }
    adminBar.style.display = isPublic ? 'none' : 'flex';
  }

  if (id === 'page-admin')    { if(typeof initAdmin==='function') initAdmin(); }
  if (id === 'page-checkout') { initCheckout(); }

  // Show/hide cart & wishlist based on page context
  var u = KF.state.currentUser;
  var isStaff = u && (u.role !== 'customer');
  // On shop page always show cart/wishlist for customers
  var hideShopUI = isStaff || (id !== 'page-shop' && id !== 'page-checkout');
  var cartBtn     = document.querySelector('.nav-cart-btn');
  var wishlistBtn = document.querySelector('.nav-icon-btn[title="Wishlist"]');
  if (cartBtn)     cartBtn.style.display     = (isStaff) ? 'none' : '';
  if (wishlistBtn) wishlistBtn.style.display = (isStaff) ? 'none' : '';
  var mbn = document.getElementById('mobile-bottom-nav');
  if (mbn) mbn.style.display = isStaff ? 'none' : '';
}

function toast(msg, icon) {
  icon = icon || '✅';
  var t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = '<span>' + icon + '</span>' + msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 3000);
}

function openModal(id) { var el=document.getElementById(id); if(el) el.classList.add('open'); }
function closeModal(id) { var el=document.getElementById(id); if(el) el.classList.remove('open'); }

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-bd')) {
    document.querySelectorAll('.modal-bd.open').forEach(function(m){ m.classList.remove('open'); });
  }
});

// ─── CART ───────────────────────────────────────────────────────
function openCart() {
  var d=document.getElementById('cart-drawer'), o=document.getElementById('overlay');
  if(d) d.classList.add('open');
  if(o) o.classList.add('open');
  renderCartDrawer();
}
function closeCart() {
  var d=document.getElementById('cart-drawer'), o=document.getElementById('overlay');
  if(d) d.classList.remove('open');
  if(o) o.classList.remove('open');
}
function renderCartDrawer() {
  var list=document.getElementById('cart-items');
  if(!list) return;
  var cart=KF.state.cart;
  if(!cart.length) {
    list.innerHTML='<div class="cart-empty"><div style="font-size:48px;margin-bottom:12px">🛒</div><p style="font-weight:700;margin-bottom:4px">Your cart is empty</p><p style="font-size:13px;color:var(--muted)">Add fresh produce to get started!</p></div>';
  } else {
    list.innerHTML=cart.map(function(i){
      var p=KF.data.products.find(function(x){return x.id===i.pid;});
      if(!p) return '';
      var img=p.img
        ? '<img src="'+p.img+'" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0">'
        : '<div style="width:44px;height:44px;background:var(--c4);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid var(--c3)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg></div>';
      return '<div class="cart-item">'+img+
        '<div class="cart-item-info"><div class="cart-item-name">'+p.name+'</div><div class="cart-item-price">'+KF.fmt(p.price*i.qty)+'</div></div>'+
        '<div class="qty-ctrl"><button class="qty-btn" onclick="changeQty('+p.id+',-1)">−</button><span class="qty-val">'+i.qty+'</span><button class="qty-btn" onclick="changeQty('+p.id+',1)">+</button></div>'+
        '<button class="remove-btn" onclick="removeFromCart('+p.id+')">✕</button></div>';
    }).join('');
  }
  var sub=KF.cartSubtotal();
  var tot=document.getElementById('cart-total');
  if(tot) tot.textContent=KF.fmt(sub);
}
function addToCart(pid) {
  var p=KF.data.products.find(function(x){return x.id===pid;});
  if(!p||p.stock===0){toast('Out of stock','⚠️');return;}
  var ex=KF.state.cart.find(function(i){return i.pid===pid;});
  if(ex){if(ex.qty>=p.stock){toast('Maximum stock reached','⚠️');return;}ex.qty++;}
  else{KF.state.cart.push({pid:pid,qty:1});}
  updateCartBadge();
  toast(p.name + ' added to cart');
}
function removeFromCart(pid) {
  KF.state.cart=KF.state.cart.filter(function(i){return i.pid!==pid;});
  updateCartBadge(); renderCartDrawer();
}
function changeQty(pid,delta) {
  var item=KF.state.cart.find(function(i){return i.pid===pid;});
  var p=KF.data.products.find(function(x){return x.id===pid;});
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0){removeFromCart(pid);return;}
  if(p&&item.qty>p.stock){item.qty=p.stock;toast('Maximum stock reached','⚠️');}
  updateCartBadge(); renderCartDrawer();
}
function updateCartBadge() {
  var n=KF.cartCount();
  var b=document.getElementById('cart-count'); if(b) b.textContent=n;
  var m=document.getElementById('mbn-cart-count'); if(m){m.textContent=n;m.style.display=n>0?'inline-flex':'none';}
}

// ─── AUTH ───────────────────────────────────────────────────────
function doLogin() {
  var em=document.getElementById('l-email').value.trim();
  var pw=document.getElementById('l-pass').value;
  var msg=document.getElementById('login-msg');
  var u=KF.data.users.find(function(u){return u.email===em&&u.pass===pw;});
  if(!u){msg.innerHTML='<div class="alert alert-err">Invalid email or password.</div>';return;}
  if(u.role!=='customer'){msg.innerHTML='<div class="alert alert-err">Staff &amp; admin: use the Help<span style="color:var(--o2)">.</span> link in the footer.</div>';return;}
  msg.innerHTML='';
  KF.state.currentUser=u;
  closeModal('modal-login');
  updateAuthUI();
  toast('Welcome back, '+u.name.split(' ')[0]+'! 🌿');
}
function doAdminLogin() {
  var em=document.getElementById('al-email').value.trim();
  var pw=document.getElementById('al-pass').value;
  var msg=document.getElementById('admin-login-msg');
  if(!msg)return;
  var u=KF.data.users.find(function(u){return u.email===em&&u.pass===pw;});
  if(!u||u.role==='customer'){msg.innerHTML='<div class="alert alert-err">Invalid credentials or insufficient access level.</div>';return;}
  msg.innerHTML='';
  KF.state.currentUser=u;
  closeModal('modal-admin-login');
  updateAuthUI();
  if(u.role==='admin'){
    showPage('page-admin');
    if(typeof showSec==='function') showSec('dashboard');
    toast('Welcome, '+u.name+' ⚙️','⚙️');
  } else {
    showPage('page-staff');
    if(typeof initStaffPortal==='function') initStaffPortal();
    toast('Welcome, '+u.name.split(' ')[0]+'! 👔','👔');
  }
}
function doSignup() {
  var fn=(document.getElementById('su-fn')||{}).value||'';
  var ln=(document.getElementById('su-ln')||{}).value||'';
  var em=(document.getElementById('su-em')||{}).value||'';
  var ph=(document.getElementById('su-ph')||{}).value||'';
  var pw=(document.getElementById('su-pw')||{}).value||'';
  var msg=document.getElementById('su-msg');
  fn=fn.trim();em=em.trim();
  if(!fn||!em||!pw){msg.innerHTML='<div class="alert alert-err">Please fill all required fields.</div>';return;}
  if(!em.includes('@')||!em.includes('.')){msg.innerHTML='<div class="alert alert-err">Please enter a valid email address.</div>';return;}
  if(KF.data.users.find(function(u){return u.email===em;})){msg.innerHTML='<div class="alert alert-err">Email already registered.</div>';return;}
  if(pw.length<6){msg.innerHTML='<div class="alert alert-err">Password must be at least 6 characters.</div>';return;}
  var u={email:em,pass:pw,name:fn+' '+ln,phone:ph.trim(),role:'customer',orders:0,spent:0,joined:new Date().toLocaleDateString('en-GB',{month:'short',year:'numeric'})};
  KF.data.users.push(u);
  KF.state.currentUser=u;
  closeModal('modal-signup');
  updateAuthUI();
  toast('Welcome to Kujaza Fresh, '+fn+'! 🎉');
}
function logout() {
  KF.state.currentUser=null;
  updateAuthUI();
  showPage('page-shop');
  toast('Signed out. See you soon! 👋','👋');
}
function updateAuthUI() {
  var u=KF.state.currentUser;
  var isStaff = u && (u.role!=='customer');
  var isAdmin  = u && u.role==='admin';
  // Auth buttons
  var ab=document.getElementById('auth-btn'); if(ab) ab.classList.toggle('hidden',!!u);
  var up=document.getElementById('user-pill'); if(up) up.classList.toggle('hidden',!u);
  var an=document.getElementById('nav-admin'); if(an) an.classList.toggle('hidden',!isAdmin);
  var un=document.getElementById('user-name'); if(u&&un) un.textContent=u.name.split(' ')[0];
  // Hide cart + wishlist for admin/staff (they don't shop)
  _applyNavbarContext(isStaff);
}

function _applyNavbarContext(isStaff) {
  var cartBtn     = document.querySelector('.nav-cart-btn');
  var wishlistBtn = document.querySelector('.nav-icon-btn[title="Wishlist"]');
  if (cartBtn)     cartBtn.style.display     = isStaff ? 'none' : '';
  if (wishlistBtn) wishlistBtn.style.display = isStaff ? 'none' : '';
  // Also hide the mobile bottom nav for staff/admin
  var mbn = document.getElementById('mobile-bottom-nav');
  if (mbn) mbn.style.display = isStaff ? 'none' : '';
}

// ─── SHOP ───────────────────────────────────────────────────────
function renderShop() { renderCatPills(); renderProductGrid(); renderPublicVouchers(); }
function renderCatPills() {
  var el=document.getElementById('cat-pills'); if(!el)return;
  var ac=KF.state.activeCat;
  el.innerHTML='<button class="cat-pill '+(ac==='all'?'active':'')+'" onclick="setCat(\'all\')">🛒 All</button>'+
    KF.data.categories.map(function(c){return '<button class="cat-pill '+(ac===c.id?'active':'')+'" onclick="setCat('+c.id+')">'+c.emoji+' '+c.name+'</button>';}).join('');
}
function renderProductGrid() {
  var s=KF.state;
  var prods=KF.data.products.filter(function(p){
    if(p.status!=='Active')return false;
    if(s.activeCat!=='all'&&p.catId!==s.activeCat)return false;
    if(s.searchQ){var q=s.searchQ.toLowerCase();if(!p.name.toLowerCase().includes(q)&&!KF.catName(p.catId).toLowerCase().includes(q))return false;}
    if(s.activeFilter==='discount'&&!(p.origPrice&&p.origPrice>p.price))return false;
    if(s.activeFilter==='organic'&&!(p.tags||[]).includes('organic'))return false;
    if(s.activeFilter==='seasonal'&&!(p.tags||[]).includes('seasonal'))return false;
    if(s.activeFilter==='premium'&&!(p.tags||[]).includes('premium'))return false;
    if(s.activeFilter==='instock'&&p.stock<=0)return false;
    if(s.activeFilter==='fresh'&&p.badge!=='Fresh Today')return false;
    if(s.maxPrice&&p.price>s.maxPrice)return false;
    return true;
  });
  if(s.activeSort==='price-low') prods=prods.slice().sort(function(a,b){return a.price-b.price;});
  if(s.activeSort==='price-high')prods=prods.slice().sort(function(a,b){return b.price-a.price;});
  if(s.activeSort==='discount')  prods=prods.slice().sort(function(a,b){var da=a.origPrice?(a.origPrice-a.price)/a.origPrice:0,db=b.origPrice?(b.origPrice-b.price)/b.origPrice:0;return db-da;});
  if(s.activeSort==='name')      prods=prods.slice().sort(function(a,b){return a.name.localeCompare(b.name);});
  var cnt=document.getElementById('filter-count'); if(cnt) cnt.textContent=prods.length+' product'+(prods.length!==1?'s':'');
  var grid=document.getElementById('product-grid'); if(!grid)return;
  if(!prods.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)"><div style="font-size:48px;margin-bottom:12px">🔍</div><p>No products match your filters.</p></div>';return;}
  grid.innerHTML=prods.map(function(p){return buildProductCard(p);}).join('');
}
function buildProductCard(p) {
  var out=p.stock===0, low=p.stock>0&&p.stock<=12;
  var hd=p.origPrice&&p.origPrice>p.price, dp=hd?Math.round((1-p.price/p.origPrice)*100):0;
  var bmap={'Best Seller':'badge-orange','Fresh Today':'badge-green','Organic':'badge-green','Low Stock':'badge-yellow',
    'New Arrival':'badge-green','Premium':'badge-blue','Imported':'badge-blue','Farm Fresh':'badge-green',
    'Local':'badge-local','Staple':'badge-local','Traditional':'badge-local','Seasonal':'badge-yellow',
    '28% Off':'badge-orange','20% Off':'badge-orange','17% Off':'badge-orange','14% Off':'badge-orange','18% Off':'badge-orange'};
  var bc=p.badge?(bmap[p.badge]||'badge-orange'):'';

  // Image: use uploaded photo OR clean placeholder (no emoji fallback)
  var ic = p.img
    ? '<img src="'+p.img+'" alt="'+p.name+'" class="box-photo" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling&&(this.nextElementSibling.style.display=\'flex\')">'
      + '<div class="box-img-placeholder" style="display:none"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".35"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg></div>'
    : '<div class="box-img-placeholder"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".35"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span style="font-size:11px;opacity:.5;margin-top:4px">'+p.code+'</span></div>';

  return '<div class="pcard" onclick="openQuickView('+p.id+')">'+
    '<div class="pcard-box"><div class="box-frame">'+
      '<div class="box-top-strip"><span class="box-logo">Kujaza Fresh</span><span class="box-organic">🌱 Fresh</span></div>'+
      '<div class="box-image-area '+(p.img?'has-photo':'no-photo')+'">'+ic+
        (out?'<div class="box-overlay-out">Out of Stock</div>':'')+
        (hd?'<div class="discount-ribbon">-'+dp+'%</div>':'')+
        (p.badge&&!hd?'<div class="prod-badge '+bc+'">'+p.badge+'</div>':'')+
      '</div><div class="box-wood-grain"></div><div class="box-side-left"></div><div class="box-side-right"></div>'+
    '</div></div>'+
    '<div class="pcard-body">'+
      '<div class="pcard-code" title="Product Code">'+p.code+'</div>'+
      '<div class="pcard-name">'+p.name+'</div>'+
      '<div class="pcard-cat">'+KF.catEmoji(p.catId)+' '+KF.catName(p.catId)+'</div>'+
      '<div class="pcard-price-row"><div class="pcard-price">'+KF.fmt(p.price)+' <small>/ '+p.unit+'</small></div>'+(hd?'<div class="pcard-orig">'+KF.fmt(p.origPrice)+'</div>':'')+
      '</div><div class="pcard-tags">'+(p.tags||[]).slice(0,2).map(function(t){return '<span class="ptag ptag-'+t+'">'+t+'</span>';}).join('')+'</div>'+
    '</div>'+
    '<div class="pcard-foot">'+
      '<span class="pcard-stock '+(out?'out':low?'low':'in')+'">'+(out?'✕ Out of stock':low?'⚠ '+p.stock+' left':'✓ In stock')+'</span>'+
      '<button class="add-btn" '+(out?'disabled':'')+' onclick="event.stopPropagation();addToCart('+p.id+')">+ Add</button>'+
    '</div></div>';
}
function setCat(c){KF.state.activeCat=c;renderShop();renderCatPills();}
function filterSearch(q){KF.state.searchQ=q;renderProductGrid();}
function setFilter(f,btn){
  KF.state.activeFilter=f;
  document.querySelectorAll('.fchip').forEach(function(c){c.classList.remove('active');});
  if(btn) btn.classList.add('active');
  else document.querySelectorAll('.fchip[data-filter="'+f+'"]').forEach(function(c){c.classList.add('active');});
  renderProductGrid();
}
function setSort(v){KF.state.activeSort=v;renderProductGrid();}
function setPriceFilter(v){
  var val=parseInt(v); KF.state.maxPrice=val>=40000?null:val;
  var lbl=document.getElementById('price-label'); if(lbl) lbl.textContent=val>=40000?'Any':KF.fmt(val);
  renderProductGrid();
}

// ─── QUICK VIEW ─────────────────────────────────────────────────
function openQuickView(pid) {
  var p=KF.data.products.find(function(x){return x.id===pid;}); if(!p)return;
  var hd=p.origPrice&&p.origPrice>p.price, disc=hd?Math.round((1-p.price/p.origPrice)*100):0;
  var out=p.stock===0, low=p.stock>0&&p.stock<=12;
  var imgHtml=p.img
    ?'<img src="'+p.img+'" alt="'+p.name+'" style="width:100%;height:220px;object-fit:cover;border-radius:12px;border:2px solid var(--c3)" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
     +'<div style="width:100%;height:220px;border-radius:12px;background:var(--c4);display:none;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--muted);font-size:13px;border:2px dashed var(--c2)"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span>'+p.code+'</span></div>'
    :'<div style="width:100%;height:220px;border-radius:12px;background:var(--c4);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--muted);font-size:13px;border:2px dashed var(--c2)"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span>No image uploaded</span><span style="font-size:11px">'+p.code+'</span></div>';
  var qv=document.getElementById('qv-content'); if(!qv)return;
  qv.innerHTML=
    '<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:24px;align-items:start">'+
    '<div>'+imgHtml+'</div>'+
    '<div>'+
      '<div style="font-size:11px;font-weight:800;color:var(--o2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px">'+KF.catEmoji(p.catId)+' '+KF.catName(p.catId)+'</div>'+
      '<h3 style="font-family:var(--font-h);font-size:22px;color:var(--g2);margin-bottom:8px">'+p.name+'</h3>'+
      '<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:10px;flex-wrap:wrap">'+
        '<div style="font-family:var(--font-h);font-size:26px;color:var(--o1)">'+KF.fmt(p.price)+'<span style="font-size:13px;font-family:var(--font-b);color:var(--muted);font-weight:400"> / '+p.unit+'</span></div>'+
        (hd?'<div style="font-size:14px;color:var(--muted);text-decoration:line-through">'+KF.fmt(p.origPrice)+'</div><span class="badge badge-orange">Save '+disc+'%</span>':'')+
      '</div>'+
      '<p style="font-size:14px;color:var(--txt2);line-height:1.7;margin-bottom:14px">'+p.desc+'</p>'+
      '<div style="margin-bottom:14px">'+(p.tags||[]).map(function(t){return '<span class="ptag ptag-'+t+'" style="margin-right:6px">'+t+'</span>';}).join('')+'</div>'+
      '<div class="pcard-stock '+(out?'out':low?'low':'in')+'" style="margin-bottom:16px;font-size:14px">'+(out?'✕ Out of stock':low?'⚠ Only '+p.stock+' remaining':'✓ In stock')+'</div>'+
      '<button class="btn btn-primary btn-lg" style="width:100%" '+(out?'disabled':'')+' id="qv-add-btn">🛒 Add to Cart — '+KF.fmt(p.price)+'</button>'+
    '</div></div>';
  // Attach the add button event separately to avoid quote escaping issues
  var addBtn=document.getElementById('qv-add-btn');
  if(addBtn&&!out) addBtn.addEventListener('click',function(){addToCart(pid);closeModal('modal-quickview');});
  openModal('modal-quickview');
}

// ─── CHECKOUT ───────────────────────────────────────────────────
var coCurrentStep=1;
function initCheckout(){coCurrentStep=1;renderCheckoutStep(1);buildZoneSelector();buildPayMethods();renderCheckoutSummary();}
function buildZoneSelector(){
  var el=document.getElementById('zone-grid'); if(!el)return;
  el.innerHTML=KF.data.zones.map(function(z){
    return '<div class="zone-card '+(KF.state.selectedZone===z.name?'selected':'')+'" onclick="selectZone(this,\''+z.name+'\')"><div class="zone-name">📍 '+z.name+'</div><div class="zone-fee">'+KF.fmt(z.fee)+' delivery fee</div></div>';
  }).join('');
}
function buildPayMethods(){
  var methods=[
    {id:'mtn',icon:'📱',name:'MTN Mobile Money',detail:'Dial *165# to confirm payment'},
    {id:'airtel',icon:'📱',name:'Airtel Money',detail:'Dial *185# to confirm payment'},
    {id:'cod',icon:'💵',name:'Cash on Delivery',detail:'Pay the rider when your order arrives'},
    {id:'bank',icon:'🏦',name:'Bank Transfer',detail:'Centenary Bank · Kujaza Fresh Ltd · A/C: 01234567'},
  ];
  var el=document.getElementById('pay-grid'); if(!el)return;
  el.innerHTML=methods.map(function(m){
    return '<div class="pay-card '+(KF.state.selectedPay===m.id?'selected':'')+'" onclick="selectPay(this,\''+m.id+'\',\''+m.detail+'\')"><div class="pay-icon">'+m.icon+'</div><div class="pay-name">'+m.name+'</div></div>';
  }).join('');
}
function selectZone(el,name){
  KF.state.selectedZone=name;
  document.querySelectorAll('.zone-card').forEach(function(c){c.classList.remove('selected');});
  el.classList.add('selected');
  renderCheckoutSummary();
}
function selectPay(el,id,detail){
  KF.state.selectedPay=id;
  document.querySelectorAll('.pay-card').forEach(function(c){c.classList.remove('selected');});
  el.classList.add('selected');
  var pd=document.getElementById('pay-detail'); if(pd) pd.innerHTML='<div class="alert alert-ok">📌 '+detail+'</div>';
}
function renderCheckoutSummary(){
  var el=document.getElementById('order-lines'); if(!el)return;
  if(!KF.state.cart.length){el.innerHTML='<p style="color:var(--muted);font-size:13px">Your cart is empty.</p>';return;}
  var zone=KF.data.zones.find(function(z){return z.name===KF.state.selectedZone;}), fee=zone?zone.fee:0;
  var sub=KF.cartSubtotal();
  el.innerHTML=KF.state.cart.map(function(i){
    var p=KF.data.products.find(function(x){return x.id===i.pid;}); if(!p)return'';
    return '<div class="order-line"><span>'+p.name+' × '+i.qty+'</span><span>'+KF.fmt(p.price*i.qty)+'</span></div>';
  }).join('')+
  (fee?'<div class="order-line"><span>Delivery — '+(KF.state.selectedZone||'Select zone')+'</span><span>'+KF.fmt(fee)+'</span></div>':'')+
  '<div class="order-line" style="font-weight:800;font-size:16px;border-top:2px solid var(--c3);padding-top:12px;margin-top:6px"><span>Total</span><span>'+KF.fmt(sub+fee)+'</span></div>';
}
function coNext(){
  if(coCurrentStep===1){
    if(!KF.state.selectedZone){toast('Please select a delivery zone','⚠️');return;}
    var ph=document.getElementById('co-ph'); if(!ph||!ph.value.trim()){toast('Please enter your phone number','⚠️');return;}
    renderCheckoutSummary(); renderCheckoutStep(2);
  } else if(coCurrentStep===2){ placeOrder(); }
}
function coPrev(){ if(coCurrentStep>1) renderCheckoutStep(coCurrentStep-1); }
function renderCheckoutStep(n){
  coCurrentStep=n;
  ['co-s1','co-s2','co-s3'].forEach(function(id,i){var el=document.getElementById(id);if(el) el.classList.toggle('hidden',i+1!==n);});
  ['step-1','step-2','step-3'].forEach(function(id,i){var el=document.getElementById(id);if(!el)return;el.className='co-step';if(i+1<n)el.classList.add('done');if(i+1===n)el.classList.add('active');});
}
function placeOrder(){
  var zone=KF.data.zones.find(function(z){return z.name===KF.state.selectedZone;}), fee=zone?zone.fee:0;
  var sub=KF.cartSubtotal();
  var now  = new Date();
  var mm   = String(now.getMonth()+1).padStart(2,'0');
  var yy   = String(now.getFullYear()).slice(2);
  var seq  = String(KF.data.nextIds.order++).padStart(6,'0');
  var oid  = 'KJZ' + mm + yy + seq;
  var fn=document.getElementById('co-fn'), ln=document.getElementById('co-ln');
  var cname=KF.state.currentUser?KF.state.currentUser.name:((fn?fn.value:'')+' '+(ln?ln.value:'')).trim()||'Guest';
  var order={id:oid,customer:cname,zone:KF.state.selectedZone,
    items:KF.state.cart.map(function(i){var p=KF.data.products.find(function(x){return x.id===i.pid;});return{name:p.name,qty:i.qty,price:p.price};}).concat([{name:'Delivery fee',qty:1,price:fee}]),
    total:sub+fee,payment:KF.state.selectedPay,status:'Pending',riderId:null,date:new Date().toISOString().split('T')[0]};
  KF.data.orders.unshift(order);
  KF.state.cart.forEach(function(i){var p=KF.data.products.find(function(x){return x.id===i.pid;});if(p)p.stock=Math.max(0,p.stock-i.qty);});
  if(KF.state.currentUser&&KF.state.currentUser.role==='customer'){KF.state.currentUser.orders=(KF.state.currentUser.orders||0)+1;KF.state.currentUser.spent=(KF.state.currentUser.spent||0)+order.total;}
  var pe=document.getElementById('placed-id'),pz=document.getElementById('placed-zone'),pt=document.getElementById('placed-total');
  if(pe)pe.textContent=oid; if(pz)pz.textContent=KF.state.selectedZone; if(pt)pt.textContent=KF.fmt(sub+fee);
  KF.state.cart=[]; updateCartBadge(); renderCheckoutStep(3);
}
function continueShopping(){KF.state.selectedZone=null;showPage('page-shop');renderShop();}

// ─── FEEDBACK ───────────────────────────────────────────────────
var currentRating=0;
function setRating(v){currentRating=v;document.querySelectorAll('.star').forEach(function(s){s.classList.toggle('active',parseInt(s.dataset.v)<=v);});}
function submitFeedback(){
  var name=(document.getElementById('rfb-name')||{}).value||'',
      email=(document.getElementById('rfb-email')||{}).value||'',
      msg=(document.getElementById('rfb-msg-txt')||{}).value||'',
      out=document.getElementById('rfb-msg');
  if(!name.trim()||!email.trim()||!msg.trim()){if(out)out.innerHTML='<div class="alert alert-err">Please fill all required fields.</div>';return;}
  if(!currentRating){if(out)out.innerHTML='<div class="alert alert-err">Please select a star rating.</div>';return;}
  KF.data.feedback=KF.data.feedback||[];
  KF.data.feedback.push({id:KF.data.nextIds.feedback++,name:name.trim(),email:email.trim(),rating:currentRating,msg:msg.trim(),date:new Date().toISOString().split('T')[0],status:'Pending',featured:false});
  document.getElementById('rfb-name').value='';document.getElementById('rfb-email').value='';document.getElementById('rfb-msg-txt').value='';
  currentRating=0;document.querySelectorAll('.star').forEach(function(s){s.classList.remove('active');});
  if(out)out.innerHTML='<div class="alert alert-ok">✅ Thank you! Your review will appear after approval.</div>';
  setTimeout(function(){if(out)out.innerHTML='';},4000);
}
function renderFeedbackReviews(){
  var el=document.getElementById('reviews-grid'); if(!el)return;
  var approved=(KF.data.feedback||[]).filter(function(f){return f.status==='Approved';});
  if(!approved.length){el.innerHTML='<div style="text-align:center;color:var(--muted);padding:24px;grid-column:1/-1">No reviews yet — be the first!</div>';return;}
  el.innerHTML=approved.map(function(f){
    return '<div class="review-card '+(f.featured?'featured':'')+'">'+(f.featured?'<div class="review-featured-tag">⭐ Featured</div>':'')+
      '<div class="review-stars">'+'★'.repeat(f.rating)+'☆'.repeat(5-f.rating)+'</div>'+
      '<p class="review-text">"'+f.msg+'"</p>'+
      '<div class="review-author"><div class="review-avatar">'+f.name.charAt(0)+'</div>'+
      '<div><div class="review-name">'+f.name+'</div><div class="review-date">'+f.date+'</div></div></div></div>';
  }).join('');
}

// ─── NEWSLETTER ─────────────────────────────────────────────────
function subscribeNewsletter(){
  var email=((document.getElementById('nl-email')||{}).value||'').trim();
  var out=document.getElementById('nl-msg');
  if(!email||!email.includes('@')){if(out)out.innerHTML='<div class="alert alert-err" style="font-size:13px">Please enter a valid email.</div>';return;}
  KF.data.newsletter=KF.data.newsletter||[];
  if(KF.data.newsletter.find(function(n){return n.email===email;})){if(out)out.innerHTML='<div class="alert alert-ok" style="font-size:13px">Already subscribed! 🌿</div>';return;}
  KF.data.newsletter.push({email:email,date:new Date().toISOString().split('T')[0],status:'Active'});
  document.getElementById('nl-email').value='';
  if(out)out.innerHTML='<div class="alert alert-ok" style="font-size:13px">✅ Subscribed! Fresh deals coming your way.</div>';
  setTimeout(function(){if(out)out.innerHTML='';},4000);
}

// ─── PUBLIC VOUCHERS ────────────────────────────────────────────
function renderPublicVouchers(){
  var el=document.getElementById('public-vouchers'); if(!el)return;
  el.innerHTML=(KF.data.vouchers||[]).filter(function(v){return v.active;}).map(function(v){
    return '<div class="voucher-card" onclick="copyVoucher(\''+v.code+'\')"><div class="vc-code">'+v.code+'</div><div class="vc-desc">'+v.desc+'</div><div class="vc-detail">Min order '+KF.fmt(v.minOrder)+' · Expires '+v.expiry+'</div><div class="vc-copy">📋 Tap to copy</div></div>';
  }).join('');
}
function copyVoucher(code){if(navigator.clipboard)navigator.clipboard.writeText(code).catch(function(){});toast('Code '+code+' copied! 🎟','🎉');}

// ─── RECIPES ────────────────────────────────────────────────────
var RECIPES={
  luwombo:{name:'Luwombo',ingredients:[{id:43,qty:1,note:'1 whole chicken or 1kg beef'},{id:38,qty:2,note:'plantain leaves for wrapping'},{id:45,qty:1,note:'ebinyebwa groundnut paste'},{id:11,qty:1,note:'2 large onions'},{id:10,qty:1,note:'3 ripe tomatoes'},{id:39,qty:1,note:'1 bunch spring onions'},{id:31,qty:1,note:'1 thumb fresh ginger'},{id:41,qty:1,note:'bilungo paste for flavour'},{id:32,qty:1,note:'chilli to taste'},{id:46,qty:1,note:'1 teaspoon curry powder'},{id:47,qty:1,note:'cooking oil'},{id:21,qty:1,note:'matooke to serve'}]},
  nsenene:{name:'Nsenene',ingredients:[{id:42,qty:1,note:'500g pre-cleaned nsenene'},{id:11,qty:1,note:'2 medium onions'},{id:39,qty:1,note:'1 bunch spring onions'},{id:32,qty:1,note:'2 fresh chilli peppers'},{id:7,qty:1,note:'1 lemon, juice only'},{id:47,qty:1,note:'2 tablespoons oil'}]},
  bilungo:{name:'Bilungo Stew',ingredients:[{id:41,qty:1,note:'bilungo paste'},{id:10,qty:1,note:'4 large ripe tomatoes'},{id:11,qty:1,note:'2 onions'},{id:39,qty:1,note:'1 bunch spring onions'},{id:18,qty:1,note:'fresh dodo / African nightshade'},{id:45,qty:1,note:'ebinyebwa for richness'},{id:43,qty:1,note:'optional chicken pieces'},{id:32,qty:1,note:'chilli to taste'},{id:47,qty:1,note:'cooking oil'},{id:21,qty:1,note:'matooke to serve'}]}
};
function renderAllRecipeIngredients(){Object.keys(RECIPES).forEach(function(k){renderRecipeIngredients(k);});}
function renderRecipeIngredients(key){
  var recipe=RECIPES[key], el=document.getElementById(key+'-ingredients'); if(!el)return;
  el.innerHTML=recipe.ingredients.map(function(ing){
    var p=KF.data.products.find(function(x){return x.id===ing.id;}); if(!p)return'';
    var ok=p.stock>0;
    return '<div class="ingredient-row'+(ok?'':' ingredient-oos')+'">' +
      '<div class="ing-img">'+(p.img?'<img src="'+p.img+'" style="width:36px;height:36px;object-fit:cover;border-radius:6px">':'<div style="width:36px;height:36px;background:var(--c4);border-radius:6px;border:1px solid var(--c3)"></div>')+'</div>' +
      '<div class="ing-info"><div class="ing-name">'+p.name+'</div><div class="ing-note">'+ing.note+'</div></div>' +
      '<div class="ing-right"><div class="ing-price">'+KF.fmt(p.price)+'</div>' +
      (ok?'<button class="ing-add-btn" onclick="addToCart('+p.id+');this.textContent=\'✓\';this.style.background=\'var(--g3)\'">+</button>':'<span class="ing-oos-tag">Soon</span>')+
      '</div></div>';
  }).join('');
}
function switchRecipe(key,btn){
  document.querySelectorAll('.recipe-card').forEach(function(c){c.classList.remove('show');});
  document.querySelectorAll('.recipe-tab').forEach(function(t){t.classList.remove('active');});
  var card=document.getElementById('recipe-'+key); if(card)card.classList.add('show');
  if(btn)btn.classList.add('active');
}
function addRecipeToCart(key){
  var recipe=RECIPES[key]; if(!recipe)return;
  var added=0;
  recipe.ingredients.forEach(function(ing){
    var p=KF.data.products.find(function(x){return x.id===ing.id;});
    if(p&&p.stock>0){var ex=KF.state.cart.find(function(i){return i.pid===p.id;});if(ex)ex.qty=Math.min(ex.qty+1,p.stock);else KF.state.cart.push({pid:p.id,qty:1});added++;}
  });
  updateCartBadge();
  toast(added+' ingredients from '+recipe.name+' added! 🛒','🍃');
}

// ─── EXPRESS DELIVERY ────────────────────────────────────────────
KF.state.deliveryType = 'standard';

function selectDeliveryType(type, el) {
  KF.state.deliveryType = type;
  document.querySelectorAll('.dt-card').forEach(function(c){ c.classList.remove('active'); });
  if (el) el.classList.add('active');
  updateDeliveryETA();
}

function updateDeliveryETA() {
  var zone = KF.data.zones.find(function(z){ return z.name === KF.state.selectedZone; });
  var etaEl = document.getElementById('delivery-eta-display');
  if (!etaEl) return;
  if (!zone) { etaEl.innerHTML = ''; return; }
  var isExpress = KF.state.deliveryType === 'express';
  var fee = isExpress ? zone.expressFee : zone.fee;
  var eta = isExpress ? zone.expressEta : zone.eta;
  etaEl.innerHTML = '<div class="delivery-eta-pill ' + (isExpress?'eta-express':'eta-std') + '">' +
    (isExpress ? '⚡ Express' : '🚚 Standard') + ' · Estimated arrival: <strong>' + eta + '</strong> · Fee: <strong>UGX ' + fee.toLocaleString() + '</strong>' +
    '</div>';
  // Update std/express price display
  var stdP = document.getElementById('dt-std-price');
  var expP = document.getElementById('dt-exp-price');
  if (stdP) stdP.textContent = 'UGX ' + zone.fee.toLocaleString();
  if (expP) expP.textContent = 'UGX ' + zone.expressFee.toLocaleString();
}

var _origSelectZone = selectZone;
selectZone = function(el, name) {
  _origSelectZone(el, name);
  updateDeliveryETA();
};

function openExpressDelivery() {
  showPage('page-checkout');
  setTimeout(function() {
    var expBtn = document.getElementById('dt-express');
    if (expBtn) selectDeliveryType('express', expBtn);
    document.querySelector('.co-page') && document.querySelector('.co-page').scrollIntoView({behavior:'smooth'});
  }, 100);
}

// Override placeOrder to include express delivery fee
var _origPlaceOrder = placeOrder;
placeOrder = function() {
  var zone = KF.data.zones.find(function(z){ return z.name===KF.state.selectedZone; });
  if (zone && KF.state.deliveryType === 'express') {
    var origFee = zone.fee;
    zone.fee = zone.expressFee;
    _origPlaceOrder();
    zone.fee = origFee;
  } else {
    _origPlaceOrder();
  }
};

// ─── PAYMENT: Add Visa ────────────────────────────────────────────
var _origBuildPayMethods = buildPayMethods;
buildPayMethods = function() {
  var methods = [
    { id:'mtn',    icon:'📱', name:'MTN Mobile Money',    detail:'Dial *165# to confirm payment' },
    { id:'airtel', icon:'📱', name:'Airtel Money',         detail:'Dial *185# to confirm payment' },
    { id:'visa',   icon:'💳', name:'Visa / Mastercard',    detail:'Secure card payment — Visa, Mastercard accepted' },
    { id:'cod',    icon:'💵', name:'Cash on Delivery',     detail:'Pay the rider when your order arrives' },
    { id:'bank',   icon:'🏦', name:'Bank Transfer',        detail:'Centenary Bank · Kujaza Fresh Ltd · A/C: 01234567' },
  ];
  var el = document.getElementById('pay-grid'); if(!el) return;
  el.innerHTML = methods.map(function(m){
    return '<div class="pay-card '+(KF.state.selectedPay===m.id?'selected':'')+'" onclick="selectPay(this,\''+m.id+'\',\''+m.detail+'\')">'+
      '<div class="pay-icon">'+m.icon+'</div><div class="pay-name">'+m.name+'</div></div>';
  }).join('');
};

// ─── FAQ TOGGLE ──────────────────────────────────────────────────
function toggleFaq(el) {
  var item = el.parentElement;
  var answer = item.querySelector('.faq-a');
  var arrow = item.querySelector('.faq-arrow');
  var isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(function(i){
    i.classList.remove('open');
    var a = i.querySelector('.faq-a'); if(a) a.style.maxHeight = '0';
    var ar = i.querySelector('.faq-arrow'); if(ar) ar.textContent = '▼';
  });
  if (!isOpen) {
    item.classList.add('open');
    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    if (arrow) arrow.textContent = '▲';
  }
}

// ─── PHONE VALIDATION ────────────────────────────────────────────
function validatePhone(input) {
  var v = input.value.replace(/[^0-9]/g,'');
  if (v.length > 10) v = v.slice(0,10);
  input.value = v;
  var valid = v.length === 10 && v.startsWith('07');
  input.style.borderColor = (v.length > 0 && !valid) ? 'var(--t2)' : '';
  return valid;
}
