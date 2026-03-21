// ===== KUJAZA FRESH — OPERATIONS MODULE =====
// WhatsApp Orders, B2B, Micro Hubs, User Access Roles
// Also fixes: recipe admin buttons, hero slide buttons, ticket assignment

// ─── WHATSAPP ORDERS ──────────────────────────────────────────
function renderWhatsappOrders() {
  var orders = KF.data.whatsappOrders || [];
  var newCount = orders.filter(function(o){ return o.status==='New'; }).length;
  var badge = document.getElementById('wa-badge');
  if (badge) badge.textContent = newCount;

  var stats = document.getElementById('wa-stats');
  if (stats) stats.innerHTML = [
    {icon:'📱', label:'Total WA Orders', val:orders.length, col:'var(--g2)'},
    {icon:'🆕', label:'New', val:newCount, col:'var(--o2)'},
    {icon:'⚙️', label:'Processing', val:orders.filter(function(o){return o.status==='Processing';}).length, col:'var(--y2)'},
    {icon:'✅', label:'Confirmed', val:orders.filter(function(o){return o.status==='Confirmed';}).length, col:'var(--g3)'},
  ].map(function(s){
    return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+'">'+s.val+'</div></div>';
  }).join('');

  var list = document.getElementById('wa-orders-list');
  if (!list) return;
  if (!orders.length) { list.innerHTML = '<div class="empty-state">📱 No WhatsApp orders yet.</div>'; return; }
  list.innerHTML = orders.map(function(o) {
    var statusCls = o.status==='New'?'badge-orange':o.status==='Processing'?'badge-yellow':'badge-green';
    return '<div class="wa-order-card '+(o.status==='New'?'wa-new':'') +'">' +
      '<div class="wa-order-head">' +
        '<div class="wa-order-id">' +
          '<span class="wa-id">'+o.id+'</span>' +
          '<span class="badge '+statusCls+'">'+o.status+'</span>' +
        '</div>' +
        '<div class="wa-time">🕐 '+o.time+'</div>' +
      '</div>' +
      '<div class="wa-customer">'+
        '<div class="wa-cname">👤 '+o.name+'</div>' +
        '<div class="wa-phone">📱 <a href="https://wa.me/256'+o.phone.replace(/^0/,'')+'" target="_blank" style="color:#25D366;font-weight:700">'+o.phone+'</a></div>' +
      '</div>' +
      '<div class="wa-msg">"'+o.msg+'"</div>' +
      '<div class="wa-actions">' +
        '<a href="https://wa.me/256'+o.phone.replace(/^0/,'')+'" target="_blank" class="btn-edit" style="text-decoration:none;background:#25D366;color:#fff;border-color:#25D366">💬 Reply</a>' +
        '<select onchange="assignWAOrder(\''+o.id+'\',this.value)" style="font-size:12px;padding:5px 8px;border-radius:6px;border:1.5px solid var(--c3)">' +
          '<option value="">Assign rider…</option>' +
          KF.data.riders.map(function(r){return '<option value="'+r.name+'" '+(o.assigned===r.name?'selected':'')+'>'+r.name+'</option>';}).join('') +
        '</select>' +
        '<select onchange="updateWAStatus(\''+o.id+'\',this.value)" style="font-size:12px;padding:5px 8px;border-radius:6px;border:1.5px solid var(--c3)">' +
          ['New','Processing','Confirmed','Dispatched','Delivered'].map(function(s){return '<option '+(o.status===s?'selected':'')+'>'+s+'</option>';}).join('') +
        '</select>' +
        '<button class="btn-del" onclick="deleteWAOrder(\''+o.id+'\')">✕</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function assignWAOrder(id, rider) {
  var o = (KF.data.whatsappOrders||[]).find(function(x){return x.id===id;});
  if (o) { o.assigned=rider; o.status=o.status==='New'?'Processing':o.status; renderWhatsappOrders(); toast('Order '+id+' assigned to '+rider,'✅'); }
}
function updateWAStatus(id, status) {
  var o = (KF.data.whatsappOrders||[]).find(function(x){return x.id===id;});
  if (o) { o.status=status; renderWhatsappOrders(); toast(id+' → '+status); }
}
function deleteWAOrder(id) {
  KF.data.whatsappOrders = (KF.data.whatsappOrders||[]).filter(function(x){return x.id!==id;});
  renderWhatsappOrders(); toast('Order removed','🗑');
}
function addManualWAOrder() {
  var name = prompt('Customer Name:');
  var phone = prompt('Phone (07XXXXXXXX):');
  var msg = prompt('Order details:');
  if (!name||!phone||!msg) return;
  KF.data.whatsappOrders = KF.data.whatsappOrders||[];
  var id = 'WA-'+String(KF.data.whatsappOrders.length+1).padStart(3,'0');
  KF.data.whatsappOrders.unshift({id:id,name:name,phone:phone,msg:msg,time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),status:'New',assigned:null});
  renderWhatsappOrders(); toast('Manual order added','📱');
}

// ─── B2B MANAGEMENT ───────────────────────────────────────────
function renderB2B() {
  var clients = KF.data.b2bClients||[];
  var stats = document.getElementById('b2b-stats');
  if (stats) {
    var totalOutstanding = clients.reduce(function(s,c){return s+c.outstanding;},0);
    stats.innerHTML = [
      {icon:'🏢',label:'B2B Clients',val:clients.length,col:'var(--g2)'},
      {icon:'✅',label:'Active',val:clients.filter(function(c){return c.status==='Active';}).length,col:'var(--g3)'},
      {icon:'💰',label:'Outstanding',val:KF.fmt(totalOutstanding),col:totalOutstanding>0?'var(--t2)':'var(--g3)'},
    ].map(function(s){return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+';font-size:'+(typeof s.val==='string'&&s.val.length>6?'16px':'22px')+'">'+s.val+'</div></div>';}).join('');
  }

  var tbody = document.getElementById('b2b-tbody');
  if (tbody) tbody.innerHTML = clients.map(function(c){
    return '<tr>'+
      '<td><strong>'+c.name+'</strong></td>'+
      '<td><span class="badge badge-blue">'+c.type+'</span></td>'+
      '<td>'+c.contact+'<br><small style="color:var(--muted)"><a href="https://wa.me/256'+c.phone.replace(/^0/,'') +'" target="_blank" style="color:#25D366">'+c.phone+'</a></small></td>'+
      '<td>'+c.frequency+'</td>'+
      '<td>'+c.volume+'</td>'+
      '<td>'+c.creditDays+' days</td>'+
      '<td class="'+(c.outstanding>0?'fin-exp':'fin-inc')+'">'+KF.fmt(c.outstanding)+'</td>'+
      '<td><span class="badge '+(c.status==='Active'?'badge-green':'badge-terra')+'">'+c.status+'</span></td>'+
      '<td><div class="tbl-actions">'+
        '<a href="https://wa.me/256'+c.phone.replace(/^0/,'')+'" target="_blank" class="btn-edit" style="text-decoration:none;background:#25D366;color:#fff;border-color:#25D366">💬 WhatsApp</a>'+
        '<button class="btn-del" onclick="delB2BClient('+c.id+')">Remove</button>'+
      '</div></td>'+
    '</tr>';
  }).join('')||'<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--muted)">No B2B clients yet</td></tr>';

  var standing = document.getElementById('b2b-standing-orders');
  if (standing) {
    var active = clients.filter(function(c){return c.status==='Active';});
    standing.innerHTML = active.length ? active.map(function(c){
      return '<div class="fin-row">' +
        '<div><strong>'+c.name+'</strong><br><span style="font-size:12px;color:var(--muted)">'+c.items.substring(0,60)+'…</span></div>' +
        '<div style="text-align:right"><span class="badge badge-blue">'+c.frequency+'</span><br><span style="font-size:12px;color:var(--muted)">'+c.volume+'</span></div>' +
      '</div>';
    }).join('') : '<p style="color:var(--muted);padding:12px;font-size:13px">No active standing orders</p>';
  }
}

function saveB2BClient() {
  var name = (document.getElementById('b2b-name')||{}).value||'';
  var contact = (document.getElementById('b2b-contact')||{}).value||'';
  var phone = (document.getElementById('b2b-phone')||{}).value||'';
  if (!name.trim()||!contact.trim()||!phone.trim()){toast('Fill required fields','⚠️');return;}
  KF.data.b2bClients = KF.data.b2bClients||[];
  KF.data.b2bClients.push({
    id:KF.data.b2bClients.length+1, name:name.trim(), type:(document.getElementById('b2b-type')||{}).value||'Other',
    contact:contact.trim(), phone:phone.trim(), email:(document.getElementById('b2b-email')||{}).value||'',
    frequency:(document.getElementById('b2b-freq')||{}).value||'Weekly',
    creditDays:parseInt((document.getElementById('b2b-credit')||{}).value)||0,
    items:(document.getElementById('b2b-items')||{}).value||'',
    volume:'TBD', outstanding:0, status:'Active'
  });
  closeModal('modal-b2bclient'); renderB2B(); toast(name+' added as B2B client 🏢');
}
function delB2BClient(id){ if(!confirm('Remove this client?'))return; KF.data.b2bClients=(KF.data.b2bClients||[]).filter(function(c){return c.id!==id;}); renderB2B(); toast('Client removed','🗑'); }

// ─── MICRO HUBS ──────────────────────────────────────────────
function renderHubs() {
  var hubs = KF.data.microHubs||[];
  var stats = document.getElementById('hubs-stats');
  if (stats) stats.innerHTML = [
    {icon:'🏪',label:'Total Hubs',val:hubs.length,col:'var(--g2)'},
    {icon:'✅',label:'Active',val:hubs.filter(function(h){return h.status==='Active';}).length,col:'var(--g3)'},
    {icon:'🏍️',label:'Total Hub Riders',val:hubs.reduce(function(s,h){return s+h.riders;},0),col:'var(--o2)'},
    {icon:'📦',label:'High Stock',val:hubs.filter(function(h){return h.stock==='High';}).length,col:'var(--g3)'},
  ].map(function(s){return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+'">'+s.val+'</div></div>';}).join('');

  var tbody = document.getElementById('hubs-tbody');
  if (!tbody) return;
  tbody.innerHTML = hubs.map(function(h){
    var stockCls = h.stock==='High'?'badge-green':h.stock==='Medium'?'badge-yellow':'badge-terra';
    return '<tr>'+
      '<td><strong>'+h.name+'</strong></td>'+
      '<td style="font-size:12px">'+h.zone+'</td>'+
      '<td style="font-size:12px">'+h.address+'</td>'+
      '<td>'+h.capacity+'</td>'+
      '<td><span class="badge '+stockCls+'">'+h.stock+'</span></td>'+
      '<td>'+h.riders+' rider'+(h.riders!==1?'s':'')+'</td>'+
      '<td><span class="badge '+(h.status==='Active'?'badge-green':'badge-terra')+'">'+h.status+'</span></td>'+
      '<td><div class="tbl-actions"><button class="btn-del" onclick="delHub('+h.id+')">Remove</button></div></td>'+
    '</tr>';
  }).join('')||'<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--muted)">No hubs configured</td></tr>';
}
function saveHub(){
  var name=(document.getElementById('hub-name')||{}).value||'';
  if(!name.trim()){toast('Enter hub name','⚠️');return;}
  KF.data.microHubs=KF.data.microHubs||[];
  KF.data.microHubs.push({id:KF.data.microHubs.length+1,name:name.trim(),zone:(document.getElementById('hub-zones')||{}).value||'',address:(document.getElementById('hub-addr')||{}).value||'',capacity:(document.getElementById('hub-cap')||{}).value||'100',stock:(document.getElementById('hub-stock')||{}).value||'Medium',riders:1,status:'Active'});
  closeModal('modal-hub');renderHubs();toast('Hub added 🏪');
}
function delHub(id){if(!confirm('Remove this hub?'))return;KF.data.microHubs=(KF.data.microHubs||[]).filter(function(h){return h.id!==id;});renderHubs();toast('Hub removed','🗑');}

// ─── USER ACCESS ROLES ───────────────────────────────────────
var ALL_MODULES = [
  {id:'dashboard',label:'Dashboard'},
  {id:'products',label:'Products'},
  {id:'categories',label:'Categories'},
  {id:'inventory',label:'Inventory'},
  {id:'orders',label:'Orders'},
  {id:'tickets',label:'Tickets'},
  {id:'riders',label:'Riders/Fleet'},
  {id:'delivery',label:'Delivery'},
  {id:'whatsapp',label:'WhatsApp Orders'},
  {id:'b2b',label:'B2B Management'},
  {id:'vendors',label:'Vendors'},
  {id:'finance',label:'Finance Ledger'},
  {id:'finstatements',label:'Financial Statements'},
  {id:'taxreturns',label:'Tax & URA'},
  {id:'payroll',label:'Payroll'},
  {id:'procurement',label:'Procurement'},
  {id:'hr',label:'HR Employees'},
  {id:'reports',label:'Reports'},
  {id:'customers',label:'Customers'},
  {id:'feedback',label:'Feedback'},
  {id:'vouchers',label:'Vouchers'},
  {id:'recipes',label:'Recipes'},
  {id:'heromgmt',label:'Hero Slides'},
];

var ROLE_DEFAULTS = {
  inventory: ['dashboard','inventory','products','categories'],
  cashier:   ['dashboard','orders','finance','vouchers','customers'],
  hr:        ['dashboard','hr','payroll','reports'],
  accounts:  ['dashboard','finance','finstatements','taxreturns','payroll','reports'],
  staff:     ['dashboard'],
};

function updateRoleModules() {
  var role = (document.getElementById('su2-role')||{}).value||'staff';
  var defaults = ROLE_DEFAULTS[role]||['dashboard'];
  var container = document.getElementById('su2-modules');
  if (!container) return;
  container.innerHTML = ALL_MODULES.map(function(m){
    var checked = defaults.indexOf(m.id)>=0;
    return '<label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;padding:4px 0">'+
      '<input type="checkbox" name="su2-mod" value="'+m.id+'" '+(checked?'checked':'')+' style="accent-color:var(--g2);width:14px;height:14px">'+
      m.label+
    '</label>';
  }).join('');
}

function renderUserRoles() {
  var users = (KF.data.users||[]).filter(function(u){return u.role!=='customer';});
  var tbody = document.getElementById('sysusers-tbody');
  if (tbody) tbody.innerHTML = users.map(function(u){
    var modules = u.modules ? u.modules.join(', ') : 'All modules';
    var roleBadge = {'admin':'badge-orange','hr':'badge-green','accounts':'badge-blue','inventory':'badge-yellow','cashier':'badge-yellow','staff':'badge-terra'}[u.role]||'badge-terra';
    return '<tr>'+
      '<td><strong>'+u.name+'</strong></td>'+
      '<td style="font-size:12px">'+u.email+'</td>'+
      '<td><span class="badge '+roleBadge+'">'+u.role+'</span></td>'+
      '<td>'+(u.dept||'—')+'</td>'+
      '<td style="font-size:11px;color:var(--muted);max-width:200px;overflow:hidden">'+modules+'</td>'+
      '<td><span class="badge badge-green">Active</span></td>'+
      '<td><div class="tbl-actions">'+
        (u.role!=='admin'?'<button class="btn-del" onclick="deactivateSysUser(\''+u.email+'\')">Revoke</button>':'<span style="color:var(--muted);font-size:12px">Protected</span>')+
      '</div></td>'+
    '</tr>';
  }).join('')||'<tr><td colspan="7" style="color:var(--muted);text-align:center;padding:24px">No system users</td></tr>';

  var rolesEl = document.getElementById('roles-list');
  if (rolesEl) rolesEl.innerHTML = Object.keys(ROLE_DEFAULTS).map(function(role){
    return '<div class="fin-row"><div><strong style="text-transform:capitalize">'+role+'</strong></div>' +
      '<div style="font-size:12px;color:var(--muted)">'+ROLE_DEFAULTS[role].join(' · ')+'</div></div>';
  }).join('');

  // Initialize module checkboxes
  setTimeout(updateRoleModules, 100);
}

function saveSysUser() {
  var name  = (document.getElementById('su2-name')||{}).value||'';
  var email = (document.getElementById('su2-email')||{}).value||'';
  var pass  = (document.getElementById('su2-pass')||{}).value||'';
  var role  = (document.getElementById('su2-role')||{}).value||'staff';
  var dept  = (document.getElementById('su2-dept')||{}).value||'Operations';
  if (!name.trim()||!email.trim()||!pass.trim()){toast('Fill all required fields','⚠️');return;}
  if (pass.length<6){toast('Password must be at least 6 characters','⚠️');return;}
  if (KF.data.users.find(function(u){return u.email===email;})){toast('Email already registered','⚠️');return;}
  var mods = [];
  document.querySelectorAll('input[name="su2-mod"]:checked').forEach(function(cb){mods.push(cb.value);});
  KF.data.users.push({email:email.trim(),pass:pass,name:name.trim(),role:role,dept:dept,modules:mods});
  closeModal('modal-sysuser');renderUserRoles();toast(name+' added as '+role,'👔');
}
function deactivateSysUser(email){
  if(!confirm('Revoke access for '+email+'?'))return;
  KF.data.users=KF.data.users.filter(function(u){return u.email!==email;});
  renderUserRoles();toast('Access revoked','🔒');
}

// ─── TICKET ASSIGNMENT TO EMPLOYEES ─────────────────────────
function renderTickets() {
  var emps = (KF.data.employees||[]).concat(
    KF.data.users.filter(function(u){return u.role==='staff'||u.role==='hr'||u.role==='accounts';}).map(function(u){return {name:u.name};})
  );
  document.getElementById('ticket-tbody').innerHTML = (KF.data.tickets||[]).map(function(t){
    return '<tr>'+
      '<td><strong style="color:var(--o1)">'+t.id+'</strong><br><small style="color:var(--muted)">'+t.date+'</small></td>'+
      '<td>'+t.by+'</td>'+
      '<td><span class="badge badge-yellow">'+t.cat+'</span></td>'+
      '<td>'+t.subj+'</td>'+
      '<td><span class="badge '+(t.status==='Resolved'?'badge-green':t.status==='In Progress'?'badge-blue':'badge-terra')+'">'+t.status+'</span></td>'+
      '<td>'+
        '<select onchange="assignTicketToEmp(\''+t.id+'\',this.value)" style="font-size:12px;padding:4px 8px;border-radius:6px;border:1.5px solid var(--c3);min-width:140px">'+
          '<option value="">'+(t.assigned||'Unassigned')+'</option>'+
          emps.map(function(e){return '<option value="'+e.name+'" '+(t.assigned===e.name?'selected':'')+'>'+e.name+'</option>';}).join('')+
        '</select>'+
      '</td>'+
      '<td><div class="tbl-actions">'+
        '<select onchange="updateTicket(\''+t.id+'\',this.value)" style="font-size:12px;padding:4px 8px;border-radius:6px;border:1.5px solid var(--c3)">'+
          ['Open','In Progress','Resolved','Closed'].map(function(s){return '<option '+(t.status===s?'selected':'')+'>'+s+'</option>';}).join('')+
        '</select>'+
      '</div></td>'+
    '</tr>';
  }).join('');
}

function assignTicketToEmp(id, empName) {
  var t = (KF.data.tickets||[]).find(function(x){return x.id===id;});
  if (t) {
    t.assigned = empName;
    t.status   = t.status==='Open'?'In Progress':t.status;
    // Add to their HR inbox
    KF.data.hrInbox = KF.data.hrInbox||[];
    KF.data.hrInbox.unshift({id:Date.now(),from:'Operations Manager',to:empName,subject:'Ticket '+id+' assigned to you',body:'Please handle: '+t.subj+'. Category: '+t.cat+'. Raised by: '+t.by+'.',date:new Date().toISOString().split('T')[0],read:false});
    renderTickets();
    toast(id+' assigned to '+empName,'🎫');
  }
}

// ─── RECIPE ADMIN BUTTONS FIX ────────────────────────────────
// These must be called from the HTML onclick - ensure they exist as window functions
window.openAddRecipeAdmin = function() {
  if (typeof KF.data.adminRecipes === 'undefined') { KF.data.adminRecipes = []; KF.data.nextRecipeId = 1; }
  KF.data.editingRecipeId = null;
  var t=document.getElementById('recipe-admin-form-title'); if(t) t.textContent='Add New Recipe';
  ['ra-title','ra-desc','ra-caption','ra-steps'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
  var prev=document.getElementById('ra-img-preview'); if(prev) prev.innerHTML='';
  openModal('modal-recipe-admin');
};
window.editRecipeAdmin = function(id) {
  var r=(KF.data.adminRecipes||[]).find(function(x){return x.id===id;});
  if(!r){toast('Recipe not found','⚠️');return;}
  KF.data.editingRecipeId=id;
  var t=document.getElementById('recipe-admin-form-title');if(t) t.textContent='Edit Recipe';
  var set=function(eid,v){var e=document.getElementById(eid);if(e)e.value=v||'';};
  set('ra-title',r.title);set('ra-desc',r.desc);set('ra-caption',r.caption);set('ra-steps',r.steps);
  var prev=document.getElementById('ra-img-preview');
  if(prev) prev.innerHTML=r.img?'<img src="'+r.img+'" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-top:8px">':'';
  openModal('modal-recipe-admin');
};
window.toggleRecipeVisible = function(id) {
  var r=(KF.data.adminRecipes||[]).find(function(x){return x.id===id;});
  if(r){r.active=!r.active;if(typeof renderAdminRecipes==='function')renderAdminRecipes();toast(r.title+' '+(r.active?'shown':'hidden'));}
};
window.delRecipeAdmin = function(id) {
  if(!confirm('Delete this recipe?'))return;
  KF.data.adminRecipes=(KF.data.adminRecipes||[]).filter(function(r){return r.id!==id;});
  if(typeof renderAdminRecipes==='function')renderAdminRecipes();toast('Recipe deleted','🗑');
};

// ─── HERO SLIDE BUTTONS FIX ──────────────────────────────────
window.openAddHeroSlide = function() {
  KF.data.editingHeroIdx=null;
  ['hs-heading','hs-sub','hs-btn','hs-bg'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
  var prev=document.getElementById('hs-img-preview');if(prev)prev.innerHTML='';
  openModal('modal-hero-slide');
};
window.editHeroSlide = function(idx) {
  var s=(KF.data.heroSlides||[])[idx];if(!s)return;
  KF.data.editingHeroIdx=idx;
  var set=function(id,v){var e=document.getElementById(id);if(e)e.value=v||'';};
  set('hs-heading',s.heading.replace(/<[^>]+>/g,''));set('hs-sub',s.sub);set('hs-btn',s.btnLabel);set('hs-bg',s.bg||'');
  var prev=document.getElementById('hs-img-preview');
  if(prev)prev.innerHTML=s.img?'<img src="'+s.img+'" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-top:8px">':'';
  openModal('modal-hero-slide');
};
window.delHeroSlide = function(idx) {
  if((KF.data.heroSlides||[]).length<=1){toast('Need at least 1 slide','⚠️');return;}
  if(!confirm('Delete this slide?'))return;
  KF.data.heroSlides.splice(idx,1);KF.data.heroCurrentSlide=0;
  if(typeof renderAdminHeroSlides==='function')renderAdminHeroSlides();
  if(typeof renderHeroDots==='function')renderHeroDots();
  if(typeof renderHeroSlide==='function')renderHeroSlide(0);
  toast('Slide deleted','🗑');
};
window.saveHeroSlide = function() {
  if(typeof _doSaveHero==='function'){
    var h=((document.getElementById('hs-heading')||{}).value||'').trim();
    var s=((document.getElementById('hs-sub')||{}).value||'').trim();
    var b=((document.getElementById('hs-btn')||{}).value||'Shop Now 🛒').trim();
    var bg=((document.getElementById('hs-bg')||{}).value||'').trim();
    if(!h){toast('Enter a heading','⚠️');return;}
    var fi=document.getElementById('hs-img-file');
    var ex=(KF.data.editingHeroIdx!=null)?(KF.data.heroSlides[KF.data.editingHeroIdx]||{}).img:null;
    if(fi&&fi.files&&fi.files[0]){var r=new FileReader();r.onload=function(e){_doSaveHero(h,s,b,bg,e.target.result);};r.readAsDataURL(fi.files[0]);}
    else{_doSaveHero(h,s,b,bg,ex);}
  }
};
window.saveRecipeAdmin = function() {
  if(typeof _doSaveRecipe==='function'){
    var title=((document.getElementById('ra-title')||{}).value||'').trim();
    var desc=((document.getElementById('ra-desc')||{}).value||'').trim();
    var steps=((document.getElementById('ra-steps')||{}).value||'').trim();
    var cap=((document.getElementById('ra-caption')||{}).value||'').trim();
    if(!title){toast('Enter a recipe title','⚠️');return;}
    var fi=document.getElementById('ra-img-file');
    var ex=KF.data.editingRecipeId?((KF.data.adminRecipes||[]).find(function(x){return x.id===KF.data.editingRecipeId;})||{}).img:null;
    if(fi&&fi.files&&fi.files[0]){var r=new FileReader();r.onload=function(e){_doSaveRecipe(title,desc,steps,cap,e.target.result);};r.readAsDataURL(fi.files[0]);}
    else{_doSaveRecipe(title,desc,steps,cap,ex);}
  }
};

// ─── FEEDBACK: Send to customer email notification ────────────
// (Simulated — real email would need server-side implementation)
function notifyCustomerFeedback(feedback, approved) {
  // In production this would send an email. For demo, show toast.
  if (approved) {
    toast('Feedback from '+feedback.name+' approved and customer notified ✅', '📧');
  }
}

// Override moderateFeedback to include notification
if (typeof moderateFeedback === 'function') {
  var _origModerateFeedback = moderateFeedback;
  window.moderateFeedback = function(id, status, featured) {
    _origModerateFeedback(id, status, featured);
    var f = (KF.data.feedback||[]).find(function(x){return x.id===id;});
    if (f && status === 'Approved') notifyCustomerFeedback(f, true);
  };
}
