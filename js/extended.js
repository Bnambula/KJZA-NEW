// ===== KUJAZA FRESH — EXTENDED ADMIN (Tickets, Procurement, Vendors, HR, SACCO) =====

// ── SEED DATA ──────────────────────────────────────────────────
Object.assign(KF.data, {
  tickets: [
    { id:'TKT-001', by:'Sarah Nakato',  cat:'Delivery',       subj:'Order arrived late',         status:'Resolved', assigned:'Agnes', pri:'Normal', date:'2026-03-10' },
    { id:'TKT-002', by:'James Kato',    cat:'Product Quality', subj:'Avocados were overripe',     status:'In Progress', assigned:'Brian', pri:'Urgent', date:'2026-03-14' },
    { id:'TKT-003', by:'Hotel Entebbe', cat:'Order Issue',     subj:'Missing 5kg tomatoes',       status:'Open',     assigned:null,   pri:'Urgent', date:'2026-03-16' },
    { id:'TKT-004', by:'Staff — Alex',  cat:'Staff Request',  subj:'Request for fuel allowance',  status:'Open',     assigned:null,   pri:'Normal', date:'2026-03-16' },
  ],
  requisitions: [
    { id:'REQ-001', item:'500kg Tomatoes — Wakiso farms',  by:'Alex M.',  amt:600000,  dept:'Operations', deptApproval:'Approved', finApproval:'Approved', po:'PO-001', date:'2026-03-08' },
    { id:'REQ-002', item:'Packaging bags & crates x200',   by:'Brian S.', amt:145000,  dept:'Operations', deptApproval:'Approved', finApproval:'Pending',  po:null,     date:'2026-03-14' },
    { id:'REQ-003', item:'Motorbike servicing — 3 bikes',  by:'Christine',amt:180000,  dept:'Operations', deptApproval:'Pending',  finApproval:'Pending',  po:null,     date:'2026-03-15' },
  ],
  vendors: [
    { id:1, name:'Wakiso Fresh Farms',  contact:'Moses Okello', phone:'+256 701 111 222', commission:8,  payout:1450000, status:'Active' },
    { id:2, name:'Mubende Honey Co.',   contact:'Jane Asiimwe', phone:'+256 772 333 444', commission:10, payout:320000,  status:'Active' },
    { id:3, name:'Luwero Grain Traders',contact:'Paul Kigongo', phone:'+256 756 555 666', commission:6,  payout:870000,  status:'Active' },
  ],
  employees: [
    { id:1, name:'Alex Mugisha',    role:'Senior Driver',     dept:'Operations', salary:850000,  status:'Active' },
    { id:2, name:'Brian Ssali',     role:'Driver',            dept:'Operations', salary:750000,  status:'Active' },
    { id:3, name:'Agnes Nakamya',   role:'Customer Care',     dept:'Operations', salary:650000,  status:'Active' },
    { id:4, name:'Grace Namutebi',  role:'Finance Officer',   dept:'Finance',    salary:1200000, status:'Active' },
    { id:5, name:'David Okello',    role:'Procurement Mgr',   dept:'Procurement',salary:1000000, status:'Active' },
  ],
  leaves: [
    { id:1, emp:'Agnes Nakamya', type:'Annual',  from:'2026-03-20', to:'2026-03-27', days:5, status:'Approved' },
    { id:2, emp:'Brian Ssali',   type:'Sick',    from:'2026-03-15', to:'2026-03-16', days:2, status:'Approved' },
  ],
  sacco: [
    { id:1, emp:'Alex Mugisha',   savings:350000, loan:0,       repaid:0,      status:'Active' },
    { id:2, emp:'Brian Ssali',    savings:220000, loan:500000,  repaid:100000, status:'Active' },
    { id:3, emp:'Agnes Nakamya',  savings:180000, loan:300000,  repaid:300000, status:'Cleared' },
  ],
  nextTicketId: 5, nextReqId: 4, nextVendorId: 4, nextEmpId: 6, nextLeaveId: 3, nextSaccoId: 4,
});

// ── TICKETS ─────────────────────────────────────────────────────
function renderTickets() {
  document.getElementById('ticket-tbody').innerHTML = KF.data.tickets.map(t =>
    `<tr>
      <td><strong style="color:var(--o1)">${t.id}</strong><br><small style="color:var(--muted)">${t.date}</small></td>
      <td>${t.by}</td>
      <td><span class="badge badge-yellow">${t.cat}</span></td>
      <td>${t.subj}</td>
      <td><span class="badge ${t.status==='Resolved'?'badge-green':t.status==='In Progress'?'badge-blue':'badge-terra'}">${t.status}</span></td>
      <td>${t.assigned||'<em style="color:var(--muted)">Unassigned</em>'}</td>
      <td><div class="tbl-actions">
        <select onchange="updateTicket('${t.id}',this.value)" style="font-size:12px;padding:4px 8px;border-radius:6px;border:1.5px solid var(--c3)">
          ${['Open','In Progress','Resolved','Closed'].map(s=>`<option ${t.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div></td>
    </tr>`
  ).join('');
}
function saveTicket() {
  const subj = document.getElementById('tk-subj').value.trim();
  if(!subj) { toast('Enter a subject','⚠️'); return; }
  const id = 'TKT-00' + KF.data.nextTicketId++;
  KF.data.tickets.unshift({ id, by:document.getElementById('tk-name').value||'Customer', cat:document.getElementById('tk-cat').value, subj, status:'Open', assigned:null, pri:document.getElementById('tk-pri').value, date:new Date().toISOString().split('T')[0] });
  closeModal('modal-ticket'); renderTickets(); toast('Ticket '+id+' submitted!','🎫');
}
function updateTicket(id, status) { const t = KF.data.tickets.find(x=>x.id===id); if(t){t.status=status; toast(id+' → '+status); } }

// ── PROCUREMENT ─────────────────────────────────────────────────
function renderProcurement() {
  document.getElementById('req-tbody').innerHTML = KF.data.requisitions.map(r =>
    `<tr>
      <td><strong style="color:var(--o1)">${r.id}</strong><br><small style="color:var(--muted)">${r.date}</small></td>
      <td>${r.item}</td>
      <td>${r.by} <span class="badge badge-yellow" style="font-size:10px">${r.dept}</span></td>
      <td><strong>${KF.fmt(r.amt)}</strong></td>
      <td><span class="badge ${r.deptApproval==='Approved'?'badge-green':'badge-terra'}">${r.deptApproval}</span>
          ${r.deptApproval==='Pending'?`<button class="btn-edit" style="margin-left:6px;font-size:10px" onclick="approveReq('${r.id}','dept')">Approve</button>`:''}</td>
      <td><span class="badge ${r.finApproval==='Approved'?'badge-green':'badge-terra'}">${r.finApproval}</span>
          ${r.finApproval==='Pending'&&r.deptApproval==='Approved'?`<button class="btn-edit" style="margin-left:6px;font-size:10px" onclick="approveReq('${r.id}','fin')">Approve</button>`:''}</td>
      <td>${r.po?`<span class="badge badge-green">✓ ${r.po}</span>`:`<span class="badge badge-terra">Pending</span>`}</td>
    </tr>`
  ).join('');
}
function approveReq(id, level) {
  const r = KF.data.requisitions.find(x=>x.id===id);
  if(!r) return;
  if(level==='dept') r.deptApproval='Approved';
  if(level==='fin')  { r.finApproval='Approved'; r.po='PO-'+String(KF.data.nextReqId+100).padStart(3,'0'); toast('PO generated: '+r.po,'📦'); }
  renderProcurement();
  if(level==='dept') toast('Dept approval granted for '+id,'✅');
}
function saveReq() {
  const item = document.getElementById('rq-item').value.trim();
  const amt = parseInt(document.getElementById('rq-amt').value);
  if(!item||isNaN(amt)) { toast('Fill required fields','⚠️'); return; }
  const id = 'REQ-00'+KF.data.nextReqId++;
  KF.data.requisitions.unshift({ id, item, by:document.getElementById('rq-by').value||'Staff', amt, dept:document.getElementById('rq-dept').value, deptApproval:'Pending', finApproval:'Pending', po:null, date:new Date().toISOString().split('T')[0] });
  closeModal('modal-req'); renderProcurement(); toast('Requisition '+id+' submitted!','📝');
}

// ── VENDORS ─────────────────────────────────────────────────────
function renderVendors() {
  document.getElementById('vendor-tbody').innerHTML = KF.data.vendors.map(v =>
    `<tr>
      <td><strong>${v.name}</strong></td>
      <td>${v.contact}<br><small style="color:var(--muted)">${v.phone}</small></td>
      <td>${KF.data.products.filter(p=>p.catId).length}</td>
      <td>${v.commission}%</td>
      <td class="fin-inc"><strong>${KF.fmt(v.payout)}</strong></td>
      <td><span class="badge ${v.status==='Active'?'badge-green':v.status==='Pending Review'?'badge-yellow':'badge-terra'}">${v.status}</span></td>
      <td><div class="tbl-actions"><button class="btn-edit" onclick="toast('Editing ${v.name}…')">Edit</button><button class="btn-del" onclick="delVendor(${v.id})">Delete</button></div></td>
    </tr>`
  ).join('');
}
function saveVendor() {
  const name = document.getElementById('vn-name').value.trim();
  if(!name) { toast('Enter vendor name','⚠️'); return; }
  KF.data.vendors.push({ id:KF.data.nextVendorId++, name, contact:document.getElementById('vn-contact').value, phone:document.getElementById('vn-phone').value, commission:parseFloat(document.getElementById('vn-comm').value)||8, payout:0, status:document.getElementById('vn-status').value });
  closeModal('modal-vendor'); renderVendors(); toast('Vendor added!','🤝');
}
function delVendor(id) { if(!confirm('Remove this vendor?')) return; KF.data.vendors = KF.data.vendors.filter(v=>v.id!==id); renderVendors(); toast('Vendor removed','🗑'); }

// ── HR ───────────────────────────────────────────────────────────
function renderHR() {
  document.getElementById('emp-tbody').innerHTML = KF.data.employees.map(e =>
    `<tr><td><strong>${e.name}</strong></td><td>${e.role}</td><td>${e.dept}</td><td>${KF.fmt(e.salary)}</td><td><span class="badge badge-green">${e.status}</span></td></tr>`
  ).join('');
  document.getElementById('leave-tbody').innerHTML = KF.data.leaves.map(l =>
    `<tr><td>${l.emp}</td><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td><span class="badge ${l.status==='Approved'?'badge-green':'badge-yellow'}">${l.status}</span></td></tr>`
  ).join('');
  document.getElementById('sacco-tbody').innerHTML = KF.data.sacco.map(s =>
    `<tr><td>${s.emp}</td><td class="fin-inc">${KF.fmt(s.savings)}</td><td>${s.loan?KF.fmt(s.loan):'—'}</td><td>${s.repaid?KF.fmt(s.repaid):'—'}</td><td>${s.loan?KF.fmt(s.loan-s.repaid):'—'}</td><td><span class="badge ${s.status==='Active'?'badge-green':s.status==='Cleared'?'badge-blue':'badge-terra'}">${s.status}</span></td></tr>`
  ).join('');
}
function saveEmployee() {
  const name = document.getElementById('em-name').value.trim();
  if(!name) { toast('Enter employee name','⚠️'); return; }
  KF.data.employees.push({ id:KF.data.nextEmpId++, name, role:document.getElementById('em-role').value, dept:document.getElementById('em-dept').value, salary:parseInt(document.getElementById('em-sal').value)||0, status:'Active' });
  closeModal('modal-emp'); renderHR(); toast('Employee added!','👔');
}
function saveLeave() {
  const emp = document.getElementById('lv-name').value.trim();
  if(!emp) { toast('Enter employee name','⚠️'); return; }
  KF.data.leaves.unshift({ id:KF.data.nextLeaveId++, emp, type:document.getElementById('lv-type').value, from:document.getElementById('lv-from').value, to:document.getElementById('lv-to').value, days:parseInt(document.getElementById('lv-days').value)||1, status:'Pending' });
  closeModal('modal-leave'); renderHR(); toast('Leave application submitted!','📅');
}
function saveSacco() {
  const emp = document.getElementById('sc-emp').value.trim();
  if(!emp) { toast('Enter employee name','⚠️'); return; }
  KF.data.sacco.push({ id:KF.data.nextSaccoId++, emp, savings:parseInt(document.getElementById('sc-sav').value)||0, loan:parseInt(document.getElementById('sc-loan').value)||0, repaid:0, status:'Active' });
  closeModal('modal-sacco'); renderHR(); toast('SACCO entry saved!','💰');
}

// showSec is now managed by fixes.js

// ── FEEDBACK ADMIN ───────────────────────────────────────────────
function renderAdminFeedback() {
  const pending  = (KF.data.feedback||[]).filter(f => f.status === 'Pending');
  const approved = (KF.data.feedback||[]).filter(f => f.status === 'Approved');
  const rejected = (KF.data.feedback||[]).filter(f => f.status === 'Rejected');
  // Stats
  document.getElementById('fb-stats').innerHTML = [
    { label:'Total Submissions', val: KF.data.feedback.length, icon:'⭐', col:'var(--o2)' },
    { label:'Pending Review',    val: pending.length,           icon:'⏳', col:'var(--y2)' },
    { label:'Approved',          val: approved.length,          icon:'✅', col:'var(--g3)' },
    { label:'Featured',          val: (KF.data.feedback||[]).filter(f=>f.featured).length, icon:'🌟', col:'var(--o1)' },
  ].map(s=>`<div class="stat-card"><div class="sc-icon">${s.icon}</div><div class="sc-lbl">${s.label}</div><div class="sc-val" style="color:${s.col}">${s.val}</div></div>`).join('');
  // Pending
  document.getElementById('fb-pending').innerHTML = pending.length
    ? pending.map(f => `
        <div class="fb-review-row">
          <div class="fb-stars">${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}</div>
          <div class="fb-info">
            <div class="fb-name">${f.name} <span class="fb-email">&lt;${f.email}&gt;</span> · <span style="color:var(--muted);font-size:12px">${f.date}</span></div>
            <div class="fb-msg">"${f.msg}"</div>
          </div>
          <div class="fb-actions">
            <button class="btn-edit" onclick="moderateFeedback(${f.id},'Approved',false)">✓ Approve</button>
            <button class="btn-edit" style="background:var(--y5);color:var(--y1);border-color:var(--y4)" onclick="moderateFeedback(${f.id},'Approved',true)">🌟 Feature</button>
            <button class="btn-del"  onclick="moderateFeedback(${f.id},'Rejected',false)">✕ Reject</button>
          </div>
        </div>`).join('')
    : '<div class="empty-state">⏳ No pending reviews — you are all caught up!</div>';
  // Approved
  document.getElementById('fb-approved').innerHTML = approved.length
    ? approved.map(f => `
        <div class="fb-review-row">
          <div class="fb-stars approved-stars">${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}</div>
          <div class="fb-info">
            <div class="fb-name">${f.name} · <span style="color:var(--muted);font-size:12px">${f.date}</span> ${f.featured?'<span class="badge badge-orange" style="margin-left:6px">🌟 Featured</span>':''}</div>
            <div class="fb-msg">"${f.msg}"</div>
          </div>
          <div class="fb-actions">
            <button class="btn-edit" style="font-size:11px" onclick="toggleFeatured(${f.id})">${f.featured?'Unfeature':'Feature'}</button>
            <button class="btn-del"  style="font-size:11px" onclick="moderateFeedback(${f.id},'Rejected',false)">Remove</button>
          </div>
        </div>`).join('')
    : '<div class="empty-state">No approved reviews yet.</div>';
}

function moderateFeedback(id, status, featured) {
  const f = (KF.data.feedback||[]).find(x => x.id === id);
  if (!f) return;
  f.status   = status;
  f.featured = featured;
  renderAdminFeedback();
  renderFeedbackReviews();
  toast(status === 'Approved' ? (featured ? 'Review featured on homepage! 🌟' : 'Review approved ✅') : 'Review rejected', status==='Approved'?'✅':'❌');
}
function toggleFeatured(id) {
  const f = (KF.data.feedback||[]).find(x => x.id === id);
  if (f) { f.featured = !f.featured; renderAdminFeedback(); renderFeedbackReviews(); toast(f.featured ? 'Review featured! 🌟' : 'Feature removed', '⭐'); }
}

// ── PATCH DASHBOARD to include tickets & procurement ────────────
const _origRenderDashboard = renderDashboard;
function renderDashboard() {
  _origRenderDashboard();
  // open tickets
  const openTkts = (KF.data.tickets||[]).filter(t=>t.status==='Open');
  const dtEl = document.getElementById('dash-tickets');
  if(dtEl) dtEl.innerHTML = openTkts.length
    ? openTkts.map(t=>`<div class="fin-row"><span><strong>${t.id}</strong> — ${t.subj.substring(0,30)}…</span><span class="badge ${t.pri==='Urgent'?'badge-terra':'badge-yellow'}">${t.pri}</span></div>`).join('')
    : '<p style="color:var(--muted);font-size:13px;padding:8px 0">No open tickets ✓</p>';
  // pending reqs
  const pendReqs = (KF.data.requisitions||[]).filter(r=>r.deptApproval==='Pending'||r.finApproval==='Pending');
  const dpEl = document.getElementById('dash-proc');
  if(dpEl) dpEl.innerHTML = pendReqs.length
    ? pendReqs.map(r=>`<div class="fin-row"><span><strong>${r.id}</strong> ${r.item.substring(0,28)}…</span><span class="badge badge-yellow">${r.deptApproval==='Pending'?'Dept Review':'Finance Review'}</span></div>`).join('')
    : '<p style="color:var(--muted);font-size:13px;padding:8px 0">No pending requisitions ✓</p>';
}

// ── PATCH renderReport to add tickets tab ───────────────────────
const _origRenderReport = renderReport;
function renderReport(type, btn) {
  KF.state.activeReport = type;
  document.querySelectorAll('.rep-tab').forEach(t=>t.classList.toggle('active',t.dataset.rep===type));
  if(type==='tickets') {
    const container = document.getElementById('report-content');
    const open = KF.data.tickets.filter(t=>t.status==='Open').length;
    const resolved = KF.data.tickets.filter(t=>t.status==='Resolved').length;
    container.innerHTML = `
      <h4 style="font-family:var(--font-h);font-size:20px;color:var(--g2);margin-bottom:20px">Ticket Report</h4>
      <div class="stats-row" style="margin-bottom:20px">
        ${[{l:'Total Tickets',v:KF.data.tickets.length},{l:'Open',v:open,c:'var(--t2)'},{l:'In Progress',v:KF.data.tickets.filter(t=>t.status==='In Progress').length,c:'#1D4ED8'},{l:'Resolved',v:resolved,c:'var(--g3)'}].map(s=>`<div class="stat-card"><div class="sc-lbl">${s.l}</div><div class="sc-val" style="font-size:22px;color:${s.c||'var(--ink)'}">${s.v}</div></div>`).join('')}
      </div>
      <table><thead><tr><th>Ticket</th><th>Category</th><th>Subject</th><th>Priority</th><th>Status</th></tr></thead><tbody>
      ${KF.data.tickets.map(t=>`<tr><td><strong>${t.id}</strong></td><td>${t.cat}</td><td>${t.subj}</td><td><span class="badge ${t.pri==='Urgent'?'badge-terra':'badge-yellow'}">${t.pri}</span></td><td><span class="badge ${t.status==='Resolved'?'badge-green':t.status==='Open'?'badge-terra':'badge-blue'}">${t.status}</span></td></tr>`).join('')}
      </tbody></table>`;
  } else {
    _origRenderReport(type);
  }
}

// ── VOUCHERS ADMIN ───────────────────────────────────────────────
function renderVouchers() {
  document.getElementById('voucher-tbody').innerHTML = (KF.data.vouchers||[]).map(function(v) {
    var disc = v.type === 'percent' ? v.value + '%' : KF.fmt(v.value);
    return '<tr>' +
      '<td><strong style="font-family:monospace;letter-spacing:1px;font-size:14px;color:var(--g2)">' + v.code + '</strong></td>' +
      '<td style="font-size:13px">' + v.desc + '</td>' +
      '<td><span class="badge ' + (v.type==='percent'?'badge-green':'badge-orange') + '">' + (v.type==='percent'?'Percent':'Fixed') + '</span></td>' +
      '<td><strong>' + disc + '</strong></td>' +
      '<td>' + KF.fmt(v.minOrder) + '</td>' +
      '<td>' + v.uses + ' / ' + v.maxUses + '</td>' +
      '<td>' + v.expiry + '</td>' +
      '<td><span class="badge ' + (v.active?'badge-green':'badge-terra') + '">' + (v.active?'Active':'Inactive') + '</span></td>' +
      '<td><div class="tbl-actions">' +
      '<button class="btn-edit" onclick="toggleVoucher(' + v.id + ')">' + (v.active?'Deactivate':'Activate') + '</button>' +
      '<button class="btn-del" onclick="delVoucher(' + v.id + ')">Delete</button>' +
      '</div></td>' +
      '</tr>';
  }).join('');
}

function saveVoucher() {
  var code = (document.getElementById('vc-code').value || '').trim().toUpperCase();
  var val  = parseFloat(document.getElementById('vc-val').value);
  var desc = (document.getElementById('vc-desc').value || '').trim();
  if (!code || !val || !desc) { toast('Fill all required fields', '⚠️'); return; }
  KF.data.vouchers = KF.data.vouchers || [];
  KF.data.vouchers.push({
    id: KF.data.nextIds.voucher++, code: code, desc: desc,
    type: document.getElementById('vc-type').value,
    value: val, minOrder: parseInt(document.getElementById('vc-min').value)||0,
    uses: 0, maxUses: parseInt(document.getElementById('vc-max').value)||100,
    active: true, expiry: document.getElementById('vc-exp').value || '2026-12-31'
  });
  closeModal('modal-voucher');
  renderVouchers();
  if (typeof renderPublicVouchers === 'function') renderPublicVouchers();
  toast('Voucher ' + code + ' created! 🎟');
}

function toggleVoucher(id) {
  var v = (KF.data.vouchers||[]).find(function(x){return x.id===id;});
  if (v) { v.active = !v.active; renderVouchers(); if(typeof renderPublicVouchers==='function') renderPublicVouchers(); toast(v.code + ' ' + (v.active?'activated':'deactivated')); }
}

function delVoucher(id) {
  if (!confirm('Delete this voucher?')) return;
  KF.data.vouchers = (KF.data.vouchers||[]).filter(function(v){return v.id!==id;});
  renderVouchers();
  if (typeof renderPublicVouchers === 'function') renderPublicVouchers();
  toast('Voucher deleted', '🗑');
}

// ── LOYALTY ADMIN ────────────────────────────────────────────────
function renderLoyalty() {
  var members = KF.data.loyaltyMembers || [];
  var totalPts = members.reduce(function(s,m){return s+m.points;},0);
  var goldCount = members.filter(function(m){return m.tier==='Gold';}).length;
  document.getElementById('loyalty-stats').innerHTML = [
    {label:'Total Members',val:members.length,icon:'🏅',col:'var(--o2)'},
    {label:'Gold Tier',val:goldCount,icon:'🥇',col:'var(--y2)'},
    {label:'Total Points Active',val:totalPts,icon:'⭐',col:'var(--g3)'},
    {label:'Points Redeemed',val:members.reduce(function(s,m){return s+m.redeemed;},0),icon:'🎁',col:'var(--t2)'},
  ].map(function(s){return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+';font-size:22px">'+s.val+'</div></div>';}).join('');

  document.getElementById('loyalty-tbody').innerHTML = members.map(function(m) {
    var tierBadge = m.tier==='Gold'?'badge-yellow':m.tier==='Silver'?'badge-blue':'badge-terra';
    return '<tr>' +
      '<td><strong>' + m.name + '</strong><br><small style="color:var(--muted)">' + m.email + '</small></td>' +
      '<td><span class="badge ' + tierBadge + '">' + (m.tier==='Gold'?'🥇 ':m.tier==='Silver'?'🥈 ':'🥉 ') + m.tier + '</span></td>' +
      '<td><strong style="color:var(--o2)">' + m.points + ' pts</strong></td>' +
      '<td>' + m.redeemed + ' pts</td>' +
      '<td>' + KF.fmt(m.totalSpent) + '</td>' +
      '<td><button class="btn-edit" onclick="addPoints(\'' + m.email + '\', 50)">+50 pts</button></td>' +
      '</tr>';
  }).join('');
}

function addPoints(email, pts) {
  var m = (KF.data.loyaltyMembers||[]).find(function(x){return x.email===email;});
  if (!m) return;
  m.points += pts;
  m.tier = m.points >= 600 ? 'Gold' : m.points >= 300 ? 'Silver' : 'Bronze';
  renderLoyalty();
  toast(pts + ' points added to ' + m.name, '⭐');
}

// ── NEWSLETTER ADMIN ─────────────────────────────────────────────
function renderNewsletterAdmin() {
  var subs = KF.data.newsletter || [];
  document.getElementById('nl-stats').innerHTML = [
    {label:'Total Subscribers',val:subs.length,icon:'📧',col:'var(--g2)'},
    {label:'Active',val:subs.filter(function(s){return s.status==='Active';}).length,icon:'✅',col:'var(--g3)'},
  ].map(function(s){return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+'">' +s.val+'</div></div>';}).join('');
  document.getElementById('nl-tbody').innerHTML = subs.length
    ? subs.map(function(s){
        return '<tr><td>'+s.email+'</td><td>'+s.date+'</td><td><span class="badge badge-green">'+s.status+'</span></td><td><button class="btn-del" onclick="removeSubscriber(\''+s.email+'\')">Remove</button></td></tr>';
      }).join('')
    : '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:24px">No subscribers yet. Share the website!</td></tr>';
}

function removeSubscriber(email) {
  KF.data.newsletter = (KF.data.newsletter||[]).filter(function(s){return s.email!==email;});
  renderNewsletterAdmin();
  toast('Subscriber removed', '🗑');
}

// showSec patch moved to fixes.js
