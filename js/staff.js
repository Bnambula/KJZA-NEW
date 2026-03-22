// ===== KUJAZA FRESHI — STAFF PORTAL =====

// ─── INIT ───────────────────────────────────────────────────────
function initStaffPortal() {
  const u = KF.state.currentUser;
  if (!u) return;
  // Profile block
  document.getElementById('sp-avatar').textContent = u.name.charAt(0);
  document.getElementById('sp-name').textContent   = u.name;
  document.getElementById('sp-title').textContent  = (u.title || u.role) + (u.dept ? ' · ' + u.dept : '');
  document.getElementById('sp-empid').textContent  = u.empId || '—';
  document.getElementById('sp-welcome').textContent = 'Welcome, ' + u.name.split(' ')[0] + '!';
  document.getElementById('sp-welcome-sub').textContent = u.title + ' · ' + u.dept + ' — Kujaza Freshi Staff Portal';
  // Show role-specific sidebar links
  const hrLabel   = document.getElementById('sp-hr-label');
  const hrLink    = document.getElementById('sp-hrmgmt-link');
  const accLabel  = document.getElementById('sp-acc-label');
  const accLink   = document.getElementById('sp-accmgmt-link');
  if (u.role === 'hr') {
    hrLabel.style.display = ''; hrLink.classList.remove('hidden');
  }
  if (u.role === 'accounts') {
    accLabel.style.display = ''; accLink.classList.remove('hidden');
  }
  showStaff('sp-dash');
}

// ─── SECTION ROUTING ────────────────────────────────────────────
function showStaff(id) {
  document.querySelectorAll('.sp-section').forEach(s => s.classList.remove('show'));
  document.getElementById(id).classList.add('show');
  document.querySelectorAll('.side-item[data-ss]').forEach(i => i.classList.toggle('active', i.dataset.ss === id));
  const renders = {
    'sp-dash':    renderStaffDash,
    'sp-notices': renderNotices,
    'sp-inbox':   renderInbox,
    'sp-tickets': renderStaffTickets,
    'sp-leave':   renderStaffLeave,
    'sp-req':     renderStaffReq,
    'sp-sacco':   renderStaffSacco,
    'sp-payslip': renderPayslips,
    'sp-hrmgmt':  renderHRMgmt,
    'sp-accmgmt': renderAccMgmt,
  };
  if (renders[id]) renders[id]();
}

// ─── DASHBOARD ──────────────────────────────────────────────────
function renderStaffDash() {
  const u   = KF.state.currentUser;
  const myLeaves  = (KF.data.leaves  || []).filter(l => l.emp === u.name);
  const myReqs    = (KF.data.requisitions || []).filter(r => r.by && r.by.includes(u.name.split(' ')[0]));
  const mySlip    = (KF.data.payslips || []).find(p => p.empId === u.empId);
  const unread    = (KF.data.hrInbox || []).filter(m => m.to === u.name && !m.read).length;
  const myTickets = (KF.data.tickets || []).filter(t => t.assigned === u.name.split(' ')[0]);
  document.getElementById('sp-dash-stats').innerHTML = [
    { label:'My Leave Days (pending)', val: myLeaves.filter(l=>l.status==='Pending').length, icon:'📅', col:'var(--o2)' },
    { label:'My Requisitions',         val: myReqs.length,    icon:'📋', col:'var(--g3)'  },
    { label:'Unread HR Messages',      val: unread,           icon:'📬', col: unread>0?'var(--t2)':'var(--g3)' },
    { label:'Assigned Tickets',        val: myTickets.length, icon:'🎫', col:'var(--y2)'  },
    mySlip ? { label:'Last Net Pay', val: KF.fmt(mySlip.net), icon:'🧾', col:'var(--g2)' }
           : { label:'Payslip',      val: 'Not found',        icon:'🧾', col:'var(--muted)' },
  ].map(s => `<div class="stat-card"><div class="sc-icon">${s.icon}</div><div class="sc-lbl">${s.label}</div><div class="sc-val" style="font-size:${typeof s.val==='string'&&s.val.length>8?'18px':'26px'};color:${s.col}">${s.val}</div></div>`).join('');
  // Latest notices
  document.getElementById('sp-dash-notices').innerHTML = (KF.data.notices||[]).slice(0,3).map(n =>
    `<div class="fin-row"><div><strong style="font-size:13px">${n.title}</strong><br><span style="font-size:12px;color:var(--muted)">${n.date} · ${n.dept}</span></div>${n.priority==='high'?'<span class="badge badge-terra">Urgent</span>':''}</div>`
  ).join('') || '<p style="color:var(--muted);font-size:13px">No notices yet.</p>';
  // Inbox preview
  const myMsgs = (KF.data.hrInbox||[]).filter(m => m.to === u.name).slice(0,3);
  document.getElementById('sp-dash-inbox').innerHTML = myMsgs.map(m =>
    `<div class="fin-row"><div><strong style="font-size:13px">${m.subject}</strong><br><span style="font-size:12px;color:var(--muted)">From: ${m.from} · ${m.date}</span></div>${!m.read?'<span class="badge badge-orange">New</span>':''}</div>`
  ).join('') || '<p style="color:var(--muted);font-size:13px">No messages yet.</p>';
  // Update badge counts
  if (unread > 0) {
    const b = document.getElementById('sp-inbox-badge');
    if (b) { b.textContent = unread; b.classList.remove('hidden'); }
  }
}

// ─── NOTICES ────────────────────────────────────────────────────
function renderNotices() {
  const u = KF.state.currentUser;
  const notices = (KF.data.notices||[]).filter(n => n.dept === 'All Staff' || n.dept === u.dept);
  document.getElementById('notices-list').innerHTML = notices.length
    ? notices.map(n => `
        <div class="notice-card ${n.priority==='high'?'notice-high':''}">
          <div class="notice-head">
            <div>
              <div class="notice-title">${n.title}</div>
              <div class="notice-meta">📢 ${n.postedBy} · ${n.dept} · ${n.date}</div>
            </div>
            ${n.priority==='high'?'<span class="badge badge-terra">Urgent</span>':'<span class="badge badge-green">Notice</span>'}
          </div>
          <div class="notice-body">${n.body}</div>
        </div>`).join('')
    : '<div class="empty-state">📢 No notices for your department right now.</div>';
}

// ─── HR INBOX ───────────────────────────────────────────────────
function renderInbox() {
  const u = KF.state.currentUser;
  const msgs = (KF.data.hrInbox||[]).filter(m => m.to === u.name);
  document.getElementById('inbox-list').innerHTML = msgs.length
    ? msgs.map(m => {
        m.read = true; // mark as read on open
        return `<div class="inbox-card ${!m.read?'inbox-unread':''}">
          <div class="inbox-head">
            <div class="inbox-from">👤 ${m.from}</div>
            <div class="inbox-date">${m.date}</div>
          </div>
          <div class="inbox-subject">${m.subject}</div>
          <div class="inbox-body">${m.body}</div>
        </div>`;
      }).join('')
    : '<div class="empty-state">📬 Your inbox is empty.</div>';
  const b = document.getElementById('sp-inbox-badge');
  if (b) b.classList.add('hidden');
}

// ─── MY TICKETS ─────────────────────────────────────────────────
function renderStaffTickets() {
  const u = KF.state.currentUser;
  const firstName = u.name.split(' ')[0];
  const tickets = (KF.data.tickets||[]).filter(t => t.assigned === firstName);
  document.getElementById('sp-ticket-list').innerHTML = tickets.length
    ? tickets.map(t => `
        <div class="notice-card">
          <div class="notice-head">
            <div>
              <div class="notice-title">${t.id} — ${t.subj}</div>
              <div class="notice-meta">From: ${t.by} · Category: ${t.cat} · ${t.date}</div>
            </div>
            <span class="badge ${t.status==='Resolved'?'badge-green':t.status==='Open'?'badge-terra':'badge-blue'}">${t.status}</span>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
            <select onchange="updateMyTicket('${t.id}',this.value)" style="font-size:13px;padding:6px 10px;border-radius:8px;border:1.5px solid var(--c3)">
              ${['Open','In Progress','Resolved'].map(s=>`<option ${t.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
            <span style="font-size:12px;color:var(--muted)">Update status above when resolved</span>
          </div>
        </div>`).join('')
    : '<div class="empty-state">🎫 No tickets assigned to you right now.</div>';
}
function updateMyTicket(id, status) {
  const t = KF.data.tickets.find(x => x.id === id);
  if (t) { t.status = status; toast(id + ' updated to: ' + status); renderStaffTickets(); }
}

// ─── LEAVE ──────────────────────────────────────────────────────
function renderStaffLeave() {
  const u = KF.state.currentUser;
  const myLeaves = (KF.data.leaves||[]).filter(l => l.emp === u.name);
  document.getElementById('sp-leave-history').innerHTML = myLeaves.length
    ? myLeaves.map(l => `<div class="fin-row"><div><strong>${l.type} Leave</strong><br><span style="font-size:12px;color:var(--muted)">${l.from} → ${l.to} · ${l.days} day(s)</span></div><span class="badge ${l.status==='Approved'?'badge-green':l.status==='Pending'?'badge-yellow':'badge-terra'}">${l.status}</span></div>`).join('')
    : '<p style="color:var(--muted);font-size:13px">No leave applications yet.</p>';
}
function submitLeave() {
  const u    = KF.state.currentUser;
  const from = document.getElementById('sp-lv-from').value;
  const to   = document.getElementById('sp-lv-to').value;
  const msg  = document.getElementById('sp-leave-msg');
  if (!from || !to) { msg.innerHTML = '<div class="alert alert-err">Please select both dates.</div>'; return; }
  const days = Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
  KF.data.leaves.unshift({ id: KF.data.nextIds.inbox++, emp: u.name, type: document.getElementById('sp-lv-type').value, from, to, days, status: 'Pending' });
  msg.innerHTML = '<div class="alert alert-ok">✅ Leave application submitted! HR will review and notify you.</div>';
  setTimeout(() => { msg.innerHTML = ''; }, 4000);
  renderStaffLeave();
}

// ─── REQUISITION ────────────────────────────────────────────────
function renderStaffReq() {
  const u = KF.state.currentUser;
  const firstName = u.name.split(' ')[0];
  const myReqs = (KF.data.requisitions||[]).filter(r => r.by && r.by.includes(firstName));
  document.getElementById('sp-req-history').innerHTML = myReqs.length
    ? myReqs.map(r => `<div class="fin-row"><div><strong style="font-size:13px">${r.id}</strong> — ${r.item.substring(0,30)}…<br><span style="font-size:12px;color:var(--muted)">${KF.fmt(r.amt)} · ${r.date}</span></div><div style="text-align:right"><span class="badge ${r.deptApproval==='Approved'?'badge-green':'badge-yellow'}">${r.deptApproval==='Approved'?(r.finApproval==='Approved'?'✓ PO Issued':'Finance Review'):'Dept Review'}</span></div></div>`).join('')
    : '<p style="color:var(--muted);font-size:13px">No requisitions raised yet.</p>';
}
function submitRequisition() {
  const u    = KF.state.currentUser;
  const item = document.getElementById('sp-rq-item').value.trim();
  const just = document.getElementById('sp-rq-just').value.trim();
  const msg  = document.getElementById('sp-req-msg');
  if (!item || !just) { msg.innerHTML = '<div class="alert alert-err">Please fill all required fields.</div>'; return; }
  const amt = parseInt(document.getElementById('sp-rq-amt').value) || 0;
  const id  = 'REQ-' + String(KF.data.nextReqId++).padStart(3,'0');
  KF.data.requisitions.unshift({ id, item, by: u.name.split(' ')[0], amt, dept: u.dept, deptApproval:'Pending', finApproval:'Pending', po:null, date: new Date().toISOString().split('T')[0] });
  msg.innerHTML = '<div class="alert alert-ok">✅ Requisition ' + id + ' submitted! Awaiting dept head approval.</div>';
  setTimeout(() => { msg.innerHTML = ''; }, 4000);
  document.getElementById('sp-rq-item').value = '';
  document.getElementById('sp-rq-amt').value  = '';
  document.getElementById('sp-rq-just').value = '';
  renderStaffReq();
}

// ─── SACCO ──────────────────────────────────────────────────────
function renderStaffSacco() {
  const u  = KF.state.currentUser;
  const rec = (KF.data.sacco||[]).find(s => s.empId === u.empId || s.emp === u.name);
  const box = document.getElementById('sp-sacco-summary');
  if (rec) {
    const balance = rec.loan - rec.repaid;
    box.innerHTML = `
      <div class="stats-row">
        <div class="stat-card g"><div class="sc-icon">💵</div><div class="sc-lbl">Total Savings</div><div class="sc-val">${KF.fmt(rec.savings)}</div></div>
        <div class="stat-card ${rec.loan>0?'':'g'}"><div class="sc-icon">📤</div><div class="sc-lbl">Loan Taken</div><div class="sc-val">${rec.loan?KF.fmt(rec.loan):'None'}</div></div>
        <div class="stat-card ${balance>0?'t':'g'}"><div class="sc-icon">⏳</div><div class="sc-lbl">Loan Balance</div><div class="sc-val">${balance>0?KF.fmt(balance):'Cleared'}</div></div>
        <div class="stat-card"><div class="sc-icon">📊</div><div class="sc-lbl">Status</div><div class="sc-val" style="font-size:16px">${rec.status}</div></div>
      </div>`;
    document.getElementById('sp-sacco-record').innerHTML = `
      <div class="fin-row"><span class="fin-label">Savings</span><span class="fin-inc">${KF.fmt(rec.savings)}</span></div>
      <div class="fin-row"><span class="fin-label">Loan Amount</span><span>${rec.loan?KF.fmt(rec.loan):'—'}</span></div>
      <div class="fin-row"><span class="fin-label">Amount Repaid</span><span class="fin-inc">${rec.repaid?KF.fmt(rec.repaid):'—'}</span></div>
      <div class="fin-row"><span class="fin-label">Balance Outstanding</span><span class="${balance>0?'fin-exp':''}">${balance>0?KF.fmt(balance):'Cleared ✓'}</span></div>
      <div class="fin-row"><span class="fin-label">Status</span><span class="badge ${rec.status==='Active'?'badge-green':rec.status==='Cleared'?'badge-blue':'badge-terra'}">${rec.status}</span></div>`;
  } else {
    box.innerHTML = '<div class="empty-state">💰 No SACCO record found. Contact HR to be enrolled.</div>';
    document.getElementById('sp-sacco-record').innerHTML = '<p style="color:var(--muted);font-size:13px;padding:12px 0">No record yet.</p>';
  }
}
function submitLoan() {
  const u    = KF.state.currentUser;
  const amt  = parseInt(document.getElementById('sp-loan-amt').value);
  const purp = document.getElementById('sp-loan-purpose').value.trim();
  const msg  = document.getElementById('sp-sacco-msg');
  if (!amt || !purp) { msg.innerHTML = '<div class="alert alert-err">Please fill all required fields.</div>'; return; }
  if (amt > 2000000) { msg.innerHTML = '<div class="alert alert-err">Maximum loan amount is UGX 2,000,000.</div>'; return; }
  // Add as pending SACCO loan application (stored as leave for now with special flag)
  KF.data.hrInbox.unshift({ id: KF.data.nextIds.inbox++, from: u.name, to: 'Grace Namutebi', subject: 'SACCO Loan Application — ' + KF.fmt(amt), body: 'Purpose: ' + purp + '. Period: ' + document.getElementById('sp-loan-period').value, date: new Date().toISOString().split('T')[0], read: false, type: 'loan_application', status: 'Pending', empName: u.name, empId: u.empId, loanAmt: amt });
  msg.innerHTML = '<div class="alert alert-ok">✅ Loan application of ' + KF.fmt(amt) + ' submitted to HR for approval.</div>';
  setTimeout(() => { msg.innerHTML = ''; }, 5000);
  document.getElementById('sp-loan-amt').value     = '';
  document.getElementById('sp-loan-purpose').value = '';
}

// ─── PAYSLIPS ───────────────────────────────────────────────────
function renderPayslips() {
  const u     = KF.state.currentUser;
  const slips = (KF.data.payslips||[]).filter(p => p.empId === u.empId);
  const el    = document.getElementById('sp-payslip-list');
  if (!slips.length) { el.innerHTML = '<div class="empty-state">🧾 No payslips found. Contact HR if this is an error.</div>'; return; }
  el.innerHTML = slips.map(s => `
    <div class="payslip-card">
      <div class="ps-header">
        <div>
          <div class="ps-company">Kujaza Freshii Ltd</div>
          <div class="ps-period">Payslip — ${s.month}</div>
        </div>
        <div class="ps-emp">
          <div class="ps-emp-name">${s.name}</div>
          <div class="ps-emp-id">${s.empId}</div>
        </div>
      </div>
      <div class="ps-body">
        <div class="ps-col">
          <div class="ps-section-title">Earnings</div>
          <div class="fin-row"><span class="fin-label">Basic Salary</span><span class="fin-inc">${KF.fmt(s.basic)}</span></div>
          <div class="fin-row"><span class="fin-label">Allowances</span><span class="fin-inc">${KF.fmt(s.allowances)}</span></div>
          <div class="fin-row" style="font-weight:700"><span>Gross Pay</span><span class="fin-inc">${KF.fmt(s.basic + s.allowances)}</span></div>
        </div>
        <div class="ps-col">
          <div class="ps-section-title">Deductions</div>
          <div class="fin-row"><span class="fin-label">PAYE Tax</span><span class="fin-exp">(${KF.fmt(s.deductions)})</span></div>
          <div class="fin-row"><span class="fin-label">SACCO Savings</span><span class="fin-exp">(${KF.fmt(s.sacco)})</span></div>
          <div class="fin-row" style="font-weight:700"><span>Total Deductions</span><span class="fin-exp">(${KF.fmt(s.deductions + s.sacco)})</span></div>
        </div>
      </div>
      <div class="ps-net">
        <span>Net Pay</span>
        <span class="ps-net-val">${KF.fmt(s.net)}</span>
      </div>
      <div class="ps-footer">Paid via bank transfer · ${s.month} · Kujaza Freshii Ltd, Kampala</div>
    </div>`).join('');
}

// ─── HR MANAGEMENT (HR role) ─────────────────────────────────────
function renderHRMgmt() {
  // Leave pending
  const pending = (KF.data.leaves||[]).filter(l => l.status === 'Pending');
  document.getElementById('hr-leave-pending').innerHTML = pending.length
    ? pending.map(l => `<div class="fin-row"><div><strong>${l.emp}</strong> — ${l.type} (${l.days} days)<br><span style="font-size:12px;color:var(--muted)">${l.from} to ${l.to}</span></div><div style="display:flex;gap:8px"><button class="btn-edit" onclick="approveLeave(${l.id},'Approved')">✓ Approve</button><button class="btn-del" onclick="approveLeave(${l.id},'Rejected')">✕ Reject</button></div></div>`).join('')
    : '<p style="color:var(--muted);font-size:13px">No pending leave applications.</p>';
  // SACCO loans pending
  const loans = (KF.data.hrInbox||[]).filter(m => m.type === 'loan_application' && m.status === 'Pending');
  document.getElementById('hr-sacco-pending').innerHTML = loans.length
    ? loans.map(m => `<div class="fin-row"><div><strong>${m.empName}</strong> — ${KF.fmt(m.loanAmt)}<br><span style="font-size:12px;color:var(--muted)">${m.body}</span></div><div style="display:flex;gap:8px"><button class="btn-edit" onclick="approveLoan(${m.id},'Approved')">✓ Approve</button><button class="btn-del" onclick="approveLoan(${m.id},'Rejected')">✕ Reject</button></div></div>`).join('')
    : '<p style="color:var(--muted);font-size:13px">No pending loan applications.</p>';
  // Notices list
  document.getElementById('hr-notices').innerHTML = (KF.data.notices||[]).map(n =>
    `<div class="fin-row"><div><strong style="font-size:13px">${n.title}</strong><br><span style="font-size:12px;color:var(--muted)">${n.dept} · ${n.date}</span></div><span class="badge ${n.priority==='high'?'badge-terra':'badge-green'}">${n.priority==='high'?'Urgent':'Notice'}</span></div>`
  ).join('') || '<p style="color:var(--muted);font-size:13px">No notices posted yet.</p>';
}
function approveLeave(id, status) {
  const l = KF.data.leaves.find(x => x.id === id);
  if (l) { l.status = status; toast(l.emp + "'s leave " + status.toLowerCase(), status === 'Approved' ? '✅' : '❌'); renderHRMgmt(); }
}
function approveLoan(id, status) {
  const m = KF.data.hrInbox.find(x => x.id === id);
  if (m) {
    m.status = status;
    if (status === 'Approved') {
      const rec = KF.data.sacco.find(s => s.empId === m.empId || s.emp === m.empName);
      if (rec) rec.loan = (rec.loan || 0) + m.loanAmt;
      toast('Loan of ' + KF.fmt(m.loanAmt) + ' approved for ' + m.empName, '✅');
    } else {
      toast('Loan application rejected for ' + m.empName, '❌');
    }
    renderHRMgmt();
  }
}
function postNotice() {
  const title = document.getElementById('nt-title').value.trim();
  const body  = document.getElementById('nt-body').value.trim();
  if (!title || !body) { toast('Fill title and message', '⚠️'); return; }
  const u = KF.state.currentUser;
  KF.data.notices.unshift({ id: KF.data.nextIds.notice++, title, body, dept: document.getElementById('nt-dept').value, date: new Date().toISOString().split('T')[0], postedBy: u.name, priority: document.getElementById('nt-pri').value });
  closeModal('modal-notice');
  toast('Notice posted to all staff!', '📢');
  renderHRMgmt();
}

// ─── ACCOUNTS VIEW ───────────────────────────────────────────────
function renderAccMgmt() {
  const totalInc = KF.data.income.reduce((s,i) => s + i.amt, 0);
  const totalExp = KF.data.expenses.reduce((s,e) => s + e.amt, 0);
  const profit   = totalInc - totalExp;
  document.getElementById('acc-fin-stats').innerHTML = [
    { label:'Total Income',  val: KF.fmt(totalInc), col:'var(--g2)',  icon:'📈' },
    { label:'Total Expenses',val: KF.fmt(totalExp), col:'var(--t2)',  icon:'📉' },
    { label:'Net Profit',    val: KF.fmt(profit),   col: profit>=0?'var(--g2)':'var(--t2)', icon:'💰' },
    { label:'Margin',        val: totalInc ? ((profit/totalInc)*100).toFixed(1)+'%' : '0%', col:'var(--y2)', icon:'📊' },
  ].map(s => `<div class="stat-card"><div class="sc-icon">${s.icon}</div><div class="sc-lbl">${s.label}</div><div class="sc-val" style="font-size:20px;color:${s.col}">${s.val}</div></div>`).join('');
  document.getElementById('acc-income').innerHTML   = KF.data.income.map(i   => `<div class="fin-row"><div><strong style="font-size:13px">${i.desc}</strong><br><span style="font-size:11px;color:var(--muted)">${i.cat} · ${i.date}</span></div><span class="fin-inc">${KF.fmt(i.amt)}</span></div>`).join('');
  document.getElementById('acc-expenses').innerHTML = KF.data.expenses.map(e => `<div class="fin-row"><div><strong style="font-size:13px">${e.desc}</strong><br><span style="font-size:11px;color:var(--muted)">${e.cat} · ${e.date}</span></div><span class="fin-exp">(${KF.fmt(e.amt)})</span></div>`).join('');
  document.getElementById('acc-pnl').innerHTML = `
    <div class="fin-row"><span class="fin-label">Gross Revenue</span><span class="fin-inc">${KF.fmt(totalInc)}</span></div>
    <div class="fin-row"><span class="fin-label">Total Expenses</span><span class="fin-exp">(${KF.fmt(totalExp)})</span></div>
    <div class="fin-row" style="font-weight:800;font-size:16px;border-top:2px solid var(--g4);padding-top:14px"><span>Net Profit</span><span style="color:${profit>=0?'var(--g2)':'var(--t2)'}">${KF.fmt(profit)}</span></div>`;
}
