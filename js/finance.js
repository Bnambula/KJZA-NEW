// ===== KUJAZA FRESH — FINANCE, HR & PAYROLL MODULE =====
// GAAP | IASB IAS 1 | Uganda Revenue Authority compliant

// ─── UGANDA TAX CONSTANTS ────────────────────────────────────
var UG_TAX = {
  VAT_RATE:     0.18,   // 18% VAT
  CIT_RATE:     0.30,   // 30% Corporate Income Tax
  WHT_SERVICES: 0.06,   // 6% WHT on services
  WHT_GOODS:    0.06,   // 6% WHT on goods
  NSSF_EMP:     0.05,   // 5% NSSF employee contribution
  NSSF_ER:      0.10,   // 10% NSSF employer contribution
  LST_ANNUAL:   100000, // Local Service Tax (UGX 100,000/year for income > 1,000,000/mo)
  LST_THRESHOLD: 1000000,
  // PAYE thresholds (monthly, UGX) — Uganda ITA Schedule
  PAYE_BANDS: [
    { max: 235000,    rate: 0.00 },
    { max: 335000,    rate: 0.10 },
    { max: 410000,    rate: 0.20 },
    { max: Infinity,  rate: 0.30 }
  ]
};

function calcPAYE(grossMonthly) {
  // Uganda PAYE calculation per ITA Cap 340
  if (grossMonthly <= 235000) return 0;
  var tax = 0;
  var prev = 0;
  var bands = [
    { limit: 235000, rate: 0 },
    { limit: 335000, rate: 0.10 },
    { limit: 410000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];
  for (var i = 0; i < bands.length; i++) {
    var b = bands[i];
    var upper = Math.min(grossMonthly, b.limit);
    if (upper > prev) { tax += (upper - prev) * b.rate; }
    prev = b.limit;
    if (grossMonthly <= b.limit) break;
  }
  return Math.round(tax);
}

function calcLST(grossMonthly) {
  // LST: UGX 100,000/year = ~8,333/month for earners > 1M/month
  return grossMonthly >= UG_TAX.LST_THRESHOLD ? Math.round(100000/12) : 0;
}

// ─── FINANCIAL STATEMENTS ────────────────────────────────────
function updateStmtDates() {
  var period = document.getElementById('stmt-period');
  var from   = document.getElementById('stmt-from');
  var to     = document.getElementById('stmt-to');
  if (!period || !from || !to) return;
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth(); // 0-based

  if (period.value === 'monthly') {
    from.value = new Date(y, m, 1).toISOString().split('T')[0];
    to.value   = new Date(y, m+1, 0).toISOString().split('T')[0];
  } else if (period.value === 'quarterly') {
    var q = Math.floor(m / 3);
    from.value = new Date(y, q*3, 1).toISOString().split('T')[0];
    to.value   = new Date(y, q*3+3, 0).toISOString().split('T')[0];
  } else if (period.value === 'annual') {
    from.value = y + '-01-01';
    to.value   = y + '-12-31';
  }
  // custom: leave as-is
}

function generateFinStatement() {
  var type = (document.getElementById('stmt-type')||{}).value || 'income';
  var from = (document.getElementById('stmt-from')||{}).value || '2026-01-01';
  var to   = (document.getElementById('stmt-to')||{}).value   || '2026-12-31';
  var out  = document.getElementById('fin-stmt-output');
  if (!out) return;

  var income   = KF.data.income   || [];
  var expenses = KF.data.expenses || [];
  var fIncome  = income.filter(function(i){ return i.date >= from && i.date <= to; });
  var fExpense = expenses.filter(function(e){ return e.date >= from && e.date <= to; });
  var totalRev = fIncome.reduce(function(s,i){ return s+i.amt; }, 0);
  var totalExp = fExpense.reduce(function(s,e){ return s+e.amt; }, 0);
  var grossProfit = totalRev - totalExp;
  var vatPayable  = Math.round(totalRev * UG_TAX.VAT_RATE / (1 + UG_TAX.VAT_RATE));
  var netBeforeTax = grossProfit - vatPayable;
  var cit = Math.max(0, Math.round(netBeforeTax * UG_TAX.CIT_RATE));
  var netAfterTax = netBeforeTax - cit;

  var periodLabel = from + ' to ' + to;
  var html = '';

  if (type === 'income') {
    html = stmtHeader('STATEMENT OF COMPREHENSIVE INCOME', periodLabel) +
      stmtSection('Revenue') +
      fIncome.map(function(i){ return stmtLine(i.desc + ' <em>(' + i.cat + ')</em>', i.amt, false); }).join('') +
      stmtSubtotal('Total Revenue', totalRev) +
      stmtSection('Cost of Sales & Operating Expenses') +
      fExpense.map(function(e){ return stmtLine(e.desc + ' <em>(' + e.cat + ')</em>', e.amt, true); }).join('') +
      stmtSubtotal('Total Operating Expenses', totalExp) +
      stmtDivider() +
      stmtLine('Gross Profit / (Loss)', grossProfit, false, true) +
      stmtSection('Tax Computations (URA)') +
      stmtLine('VAT Payable (18% of Revenue — ITA Cap 340)', vatPayable, true) +
      stmtLine('Profit Before Tax', netBeforeTax, false) +
      stmtLine('Corporate Income Tax (30% — ITA Cap 340)', cit, true) +
      stmtDivider() +
      stmtLine('NET PROFIT AFTER TAX', netAfterTax, false, true) +
      stmtFooter();
  } else if (type === 'position') {
    var cash = Math.max(0, totalRev * 0.3);
    var receivables = Math.max(0, totalRev * 0.15);
    var inventory = KF.data.products.reduce(function(s,p){ return s + (p.price * p.stock * 0.7); }, 0);
    var totalCurrent = cash + receivables + inventory;
    var ppeNet = 8500000;
    var totalAssets = totalCurrent + ppeNet;
    var payables = Math.max(0, totalExp * 0.25);
    var taxPayable = vatPayable + cit;
    var totalLiabilities = payables + taxPayable;
    var equity = totalAssets - totalLiabilities;

    html = stmtHeader('STATEMENT OF FINANCIAL POSITION', 'As at ' + to) +
      stmtSection('ASSETS') +
      stmtSection('Current Assets') +
      stmtLine('Cash and Cash Equivalents', cash, false) +
      stmtLine('Trade Receivables', receivables, false) +
      stmtLine('Inventories (at cost)', inventory, false) +
      stmtSubtotal('Total Current Assets', totalCurrent) +
      stmtSection('Non-Current Assets') +
      stmtLine('Property, Plant & Equipment (net)', ppeNet, false) +
      stmtSubtotal('Total Non-Current Assets', ppeNet) +
      stmtLine('TOTAL ASSETS', totalAssets, false, true) +
      stmtDivider() +
      stmtSection('LIABILITIES') +
      stmtSection('Current Liabilities') +
      stmtLine('Trade Payables', payables, false) +
      stmtLine('Tax Payable (VAT + CIT)', taxPayable, false) +
      stmtSubtotal('Total Liabilities', totalLiabilities) +
      stmtSection('EQUITY') +
      stmtLine("Owner's Equity / Retained Earnings", equity, false, true) +
      stmtLine('TOTAL LIABILITIES & EQUITY', totalAssets, false, true) +
      stmtFooter();
  } else if (type === 'cashflow') {
    var opCash = grossProfit * 0.7;
    var invCash = -ppeNet * 0.1;
    var finCash = 0;
    html = stmtHeader("STATEMENT OF CASH FLOWS (INDIRECT METHOD)", periodLabel) +
      stmtSection('Operating Activities') +
      stmtLine('Profit Before Tax', netBeforeTax, false) +
      stmtLine('Add: Depreciation & Amortisation', 500000, false) +
      stmtLine('Changes in Working Capital', -200000, false) +
      stmtLine('Tax Paid', -cit, false) +
      stmtSubtotal('Net Cash from Operating Activities', opCash) +
      stmtSection('Investing Activities') +
      stmtLine('Purchase of Equipment', -400000, false) +
      stmtSubtotal('Net Cash from Investing Activities', -400000) +
      stmtSection('Financing Activities') +
      stmtLine('SACCO Loan Repayments', -150000, false) +
      stmtSubtotal('Net Cash from Financing Activities', -150000) +
      stmtDivider() +
      stmtLine('NET INCREASE IN CASH', opCash - 400000 - 150000, false, true) +
      stmtFooter();
  } else if (type === 'equity') {
    var openingEquity = totalRev * 2;
    html = stmtHeader("STATEMENT OF CHANGES IN EQUITY", periodLabel) +
      '<div class="tbl-wrap"><table><thead><tr>' +
      '<th>Item</th><th>Share Capital</th><th>Retained Earnings</th><th>Total Equity</th></tr></thead><tbody>' +
      '<tr><td>Opening Balance</td><td>'+KF.fmt(5000000)+'</td><td>'+KF.fmt(openingEquity)+'</td><td>'+KF.fmt(5000000+openingEquity)+'</td></tr>' +
      '<tr><td>Profit for the Period</td><td>—</td><td>'+KF.fmt(netAfterTax)+'</td><td>'+KF.fmt(netAfterTax)+'</td></tr>' +
      '<tr style="font-weight:800"><td>Closing Balance</td><td>'+KF.fmt(5000000)+'</td><td>'+KF.fmt(openingEquity+netAfterTax)+'</td><td>'+KF.fmt(5000000+openingEquity+netAfterTax)+'</td></tr>' +
      '</tbody></table></div>' + stmtFooter();
  } else if (type === 'payroll') {
    html = generatePayrollStatement(periodLabel);
  }

  out.innerHTML = '<div class="fin-stmt">' + html + '</div>';
}

function generatePayrollStatement(period) {
  var emps = KF.data.employees || [];
  if (!emps.length) return '<div class="empty-state">No employees found.</div>';
  var rows = '', totalBasic=0, totalGross=0, totalNSSF=0, totalPAYE=0, totalNet=0;
  emps.forEach(function(e) {
    var basic = e.salary || 0;
    var allow = (e.transport||0) + (e.housing||0) + (e.otherAllow||0);
    var gross = basic + allow;
    var nssf  = Math.round(gross * UG_TAX.NSSF_EMP);
    var paye  = calcPAYE(gross);
    var lst   = calcLST(gross);
    var net   = gross - nssf - paye - lst;
    totalBasic += basic; totalGross += gross; totalNSSF += nssf; totalPAYE += paye; totalNet += net;
    rows += '<tr><td>'+(e.empId||'—')+'</td><td><strong>'+e.name+'</strong></td><td>'+e.dept+'</td>' +
      '<td>'+KF.fmt(basic)+'</td><td>'+KF.fmt(allow)+'</td><td>'+KF.fmt(gross)+'</td>' +
      '<td>'+KF.fmt(nssf)+'</td><td>'+KF.fmt(paye)+'</td><td>'+KF.fmt(lst)+'</td><td>'+KF.fmt(net)+'</td></tr>';
  });
  return stmtHeader('PAYROLL STATEMENT', period) +
    '<div class="tbl-wrap"><table><thead><tr>' +
    '<th>EMP #</th><th>Employee</th><th>Dept</th><th>Basic</th><th>Allowances</th><th>Gross</th>' +
    '<th>NSSF (5%)</th><th>PAYE</th><th>Net Pay</th></tr></thead><tbody>' + rows +
    '<tr class="tbl-total"><td colspan="3"><strong>TOTALS</strong></td>' +
    '<td><strong>'+KF.fmt(totalBasic)+'</strong></td><td></td><td><strong>'+KF.fmt(totalGross)+'</strong></td>' +
    '<td><strong>'+KF.fmt(totalNSSF)+'</strong></td><td><strong>'+KF.fmt(totalPAYE)+'</strong></td>' +
    '<td><strong>'+KF.fmt(totalNet)+'</strong></td></tr>' +
    '</tbody></table></div>' +
    stmtSection('NSSF Summary') +
    stmtLine('Employee Contribution (5%)', totalNSSF, false) +
    stmtLine('Employer Contribution (10%)', Math.round(totalGross * UG_TAX.NSSF_ER), false) +
    stmtLine('Total NSSF Remittance', Math.round(totalGross * (UG_TAX.NSSF_EMP + UG_TAX.NSSF_ER)), false, true) +
    stmtFooter();
}

function stmtHeader(title, period) {
  return '<div class="stmt-header">' +
    '<div class="stmt-company">Kujaza Fresh Ltd</div>' +
    '<div class="stmt-company-sub">Plot 45, Kampala Road, Kampala, Uganda · TIN: 1012345678</div>' +
    '<div class="stmt-title">' + title + '</div>' +
    '<div class="stmt-period">For the period: ' + period + '</div>' +
    '<div class="stmt-note">Prepared in accordance with International Financial Reporting Standards (IFRS/IAS) and Uganda Revenue Authority requirements</div>' +
  '</div>';
}
function stmtSection(label) {
  return '<div class="stmt-section">' + label + '</div>';
}
function stmtLine(label, amount, isCost, isBold) {
  var cls = isBold ? 'stmt-line stmt-bold' : 'stmt-line';
  var amtCls = amount < 0 ? 'stmt-neg' : (isCost ? 'stmt-cost' : 'stmt-pos');
  var display = amount < 0 ? '(' + KF.fmt(Math.abs(amount)) + ')' : KF.fmt(amount);
  return '<div class="' + cls + '"><span class="stmt-label">' + label + '</span><span class="stmt-amt ' + amtCls + '">' + display + '</span></div>';
}
function stmtSubtotal(label, amount) {
  return '<div class="stmt-line stmt-subtotal"><span class="stmt-label">' + label + '</span><span class="stmt-amt">' + KF.fmt(amount) + '</span></div>';
}
function stmtDivider() {
  return '<div class="stmt-divider"></div>';
}
function stmtFooter() {
  var today = new Date().toLocaleDateString('en-GB', {day:'2-digit',month:'long',year:'numeric'});
  return '<div class="stmt-footer">' +
    '<div>Prepared by: Finance Department · Kujaza Fresh Ltd</div>' +
    '<div>Date: ' + today + ' · All amounts in Uganda Shillings (UGX)</div>' +
    '<div>These statements comply with IAS 1, IFRS SME standards, and Uganda Revenue Authority (URA) tax filing requirements</div>' +
  '</div>';
}

function printStatement() {
  var content = document.getElementById('fin-stmt-output') || document.getElementById('payroll-tbody');
  if (!content) { toast('Generate a statement first','⚠️'); return; }
  var win = window.open('','_blank');
  win.document.write('<html><head><title>Kujaza Fresh — Financial Statement</title><style>body{font-family:Arial,sans-serif;font-size:12px;padding:24px;color:#111}.stmt-header{text-align:center;margin-bottom:20px;border-bottom:2px solid #333;padding-bottom:12px}.stmt-company{font-size:18px;font-weight:700}.stmt-title{font-size:14px;font-weight:700;margin:8px 0}.stmt-note{font-size:10px;color:#666;font-style:italic}.stmt-section{font-weight:700;font-size:13px;margin:14px 0 6px;padding:4px 0;border-bottom:1px solid #ccc}.stmt-line{display:flex;justify-content:space-between;padding:3px 12px;font-size:12px}.stmt-bold{font-weight:700;background:#f5f5f5}.stmt-subtotal{display:flex;justify-content:space-between;padding:4px 12px;font-weight:700;border-top:1px solid #333;border-bottom:2px solid #333}.stmt-divider{border-top:2px solid #333;margin:8px 0}.stmt-footer{font-size:10px;color:#666;margin-top:20px;border-top:1px solid #ccc;padding-top:12px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{padding:5px 8px;border:1px solid #ddd;text-align:left}th{background:#f0f0f0}@media print{button{display:none}}</style></head><body>');
  win.document.write(content.innerHTML);
  win.document.write('<br><button onclick="window.print()" style="padding:8px 16px;background:#333;color:#fff;border:none;cursor:pointer">Print / Save as PDF</button>');
  win.document.write('</body></html>');
  win.document.close();
}

function exportStatementCSV() {
  var emps = KF.data.employees || [];
  if (!emps.length) { toast('No data to export','⚠️'); return; }
  var rows = [['EMP #','Name','Department','Basic Salary','Gross','NSSF','PAYE','Net Pay']];
  emps.forEach(function(e) {
    var basic = e.salary||0;
    var allow = (e.transport||0)+(e.housing||0)+(e.otherAllow||0);
    var gross = basic+allow;
    var nssf  = Math.round(gross*UG_TAX.NSSF_EMP);
    var paye  = calcPAYE(gross);
    var net   = gross-nssf-paye;
    rows.push([e.empId||'',e.name,e.dept,basic,gross,nssf,paye,net]);
  });
  downloadCSV(rows, 'kujaza_payroll.csv');
}

function downloadCSV(rows, filename) {
  var csv = rows.map(function(r){ return r.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(','); }).join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var url  = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
  toast('CSV exported!');
}

// ─── PAYROLL MODULE ────────────────────────────────────────────
function runPayroll() {
  var month = (document.getElementById('payroll-month')||{}).value;
  var emps  = KF.data.employees || [];
  var tbody = document.getElementById('payroll-tbody');
  var totDiv = document.getElementById('payroll-totals');
  if (!tbody) return;
  if (!emps.length) { tbody.innerHTML='<tr><td colspan="12" style="text-align:center;padding:24px;color:var(--muted)">No employees found. Add employees in the HR module first.</td></tr>'; return; }

  var totalBasic=0, totalAllow=0, totalGross=0, totalNSSF=0, totalPAYE=0, totalLST=0, totalNet=0;
  var empNSSF_ER = 0;

  tbody.innerHTML = emps.map(function(e) {
    var basic = e.salary || 0;
    var allow = (e.transport||0)+(e.housing||0)+(e.otherAllow||0);
    var gross = basic + allow;
    var nssf  = Math.round(gross * UG_TAX.NSSF_EMP);
    var paye  = calcPAYE(gross);
    var lst   = calcLST(gross);
    var net   = gross - nssf - paye - lst;
    totalBasic  += basic; totalAllow  += allow; totalGross += gross;
    totalNSSF   += nssf;  totalPAYE  += paye;  totalLST   += lst; totalNet += net;
    empNSSF_ER  += Math.round(gross * UG_TAX.NSSF_ER);
    return '<tr>' +
      '<td style="font-family:monospace;font-size:12px">'+(e.empId||'—')+'</td>' +
      '<td><strong>'+e.name+'</strong><br><small style="color:var(--muted)">'+e.role+'</small></td>' +
      '<td>'+e.dept+'</td>' +
      '<td>'+KF.fmt(basic)+'</td>' +
      '<td>'+KF.fmt(allow)+'</td>' +
      '<td><strong>'+KF.fmt(gross)+'</strong></td>' +
      '<td style="color:var(--t2)">'+KF.fmt(nssf)+'</td>' +
      '<td style="color:var(--t2)">'+KF.fmt(paye)+'</td>' +
      '<td style="color:var(--t2)">'+KF.fmt(lst)+'</td>' +
      '<td>—</td>' +
      '<td style="color:var(--g2);font-weight:800">'+KF.fmt(net)+'</td>' +
      '<td><span class="badge badge-green">Computed</span></td>' +
    '</tr>';
  }).join('');

  // Payroll stats
  var statsEl = document.getElementById('payroll-stats');
  if (statsEl) {
    statsEl.innerHTML = [
      {icon:'👔', label:'Employees', val:emps.length, col:'var(--g2)'},
      {icon:'💵', label:'Gross Payroll', val:KF.fmt(totalGross), col:'var(--g2)'},
      {icon:'🏛️', label:'Total PAYE', val:KF.fmt(totalPAYE), col:'var(--t2)'},
      {icon:'🏦', label:'Total NSSF (Employer)', val:KF.fmt(empNSSF_ER), col:'var(--o1)'},
      {icon:'✅', label:'Net Payroll', val:KF.fmt(totalNet), col:'var(--g2)'},
    ].map(function(s){
      return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+';font-size:18px">'+s.val+'</div></div>';
    }).join('');
  }

  if (totDiv) {
    totDiv.innerHTML =
      '<div class="fin-row" style="font-weight:800"><span>Total Gross Payroll</span><span>'+KF.fmt(totalGross)+'</span></div>'+
      '<div class="fin-row"><span style="padding-left:16px">Less: Employee NSSF (5%)</span><span style="color:var(--t2)">('+KF.fmt(totalNSSF)+')</span></div>'+
      '<div class="fin-row"><span style="padding-left:16px">Less: PAYE</span><span style="color:var(--t2)">('+KF.fmt(totalPAYE)+')</span></div>'+
      '<div class="fin-row"><span style="padding-left:16px">Less: Local Service Tax</span><span style="color:var(--t2)">('+KF.fmt(totalLST)+')</span></div>'+
      '<div class="fin-row" style="font-weight:800;border-top:2px solid var(--g4);padding-top:12px;margin-top:8px"><span>Net Payroll (Total Net Pay)</span><span style="color:var(--g2);font-size:18px">'+KF.fmt(totalNet)+'</span></div>'+
      '<div class="fin-row" style="color:var(--muted);font-size:12px;margin-top:8px"><span>Employer NSSF (10%) — separate remittance to NSSF Uganda</span><span>'+KF.fmt(empNSSF_ER)+'</span></div>';
  }

  toast('Payroll computed for ' + emps.length + ' employees ✅', '💵');
}

function printPayroll() {
  var el = document.getElementById('payroll-tbody');
  if (!el || !el.innerHTML.trim()) { toast('Run payroll first','⚠️'); return; }
  printStatement();
}

function exportPayrollCSV() { exportStatementCSV(); }

// ─── URA / TAX MODULE ─────────────────────────────────────────
function renderTaxReturns() {
  var income   = KF.data.income   || [];
  var expenses = KF.data.expenses || [];
  var totalRev = income.reduce(function(s,i){ return s+i.amt; }, 0);
  var totalExp = expenses.reduce(function(s,e){ return s+e.amt; }, 0);
  var profit   = totalRev - totalExp;
  var vat      = Math.round(totalRev * UG_TAX.VAT_RATE / (1+UG_TAX.VAT_RATE));
  var cit      = Math.max(0, Math.round(profit * UG_TAX.CIT_RATE));
  var wht      = Math.round(totalExp * UG_TAX.WHT_SERVICES * 0.3);
  var emps     = KF.data.employees || [];
  var totalGross = emps.reduce(function(s,e){ return s+(e.salary||0)+(e.transport||0)+(e.housing||0)+(e.otherAllow||0); }, 0);
  var totalPAYE  = emps.reduce(function(s,e){ var g=(e.salary||0)+(e.transport||0)+(e.housing||0)+(e.otherAllow||0); return s+calcPAYE(g); }, 0);

  // Stats
  var statsEl = document.getElementById('tax-stats');
  if (statsEl) statsEl.innerHTML = [
    {icon:'📊', label:'Total Revenue (Gross)', val:KF.fmt(totalRev), col:'var(--g2)'},
    {icon:'🏛️', label:'VAT Payable (18%)', val:KF.fmt(vat), col:'var(--t2)'},
    {icon:'🏢', label:'Corp. Income Tax (30%)', val:KF.fmt(cit), col:'var(--t2)'},
    {icon:'👔', label:'PAYE Payable', val:KF.fmt(totalPAYE), col:'var(--o1)'},
    {icon:'💰', label:'Net After Tax', val:KF.fmt(profit-cit), col:'var(--g2)'},
  ].map(function(s){
    return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+';font-size:18px">'+s.val+'</div></div>';
  }).join('');

  // VAT
  var vatEl = document.getElementById('vat-computation');
  if (vatEl) vatEl.innerHTML =
    '<div class="fin-row"><span class="fin-label">Total Sales (incl. VAT)</span><span>'+KF.fmt(totalRev)+'</span></div>'+
    '<div class="fin-row"><span class="fin-label">Output VAT (18/118 × Sales)</span><span style="color:var(--t2)">'+KF.fmt(vat)+'</span></div>'+
    '<div class="fin-row"><span class="fin-label">Input VAT (purchases)</span><span style="color:var(--g3)">'+KF.fmt(Math.round(totalExp*0.08))+'</span></div>'+
    '<div class="fin-row" style="font-weight:800;border-top:1px solid var(--c3);margin-top:8px;padding-top:10px"><span>VAT Payable to URA</span><span style="color:var(--t2)">'+KF.fmt(vat - Math.round(totalExp*0.08))+'</span></div>'+
    '<div style="font-size:11px;color:var(--muted);margin-top:8px">Due by 15th of following month · URA Form VAT 002</div>';

  // PAYE
  var payeEl = document.getElementById('paye-computation');
  if (payeEl) payeEl.innerHTML =
    '<div class="fin-row"><span class="fin-label">Total Employees</span><span>'+emps.length+'</span></div>'+
    '<div class="fin-row"><span class="fin-label">Total Gross Emoluments</span><span>'+KF.fmt(totalGross)+'</span></div>'+
    '<div class="fin-row" style="font-weight:800"><span>Total PAYE Remittable</span><span style="color:var(--t2)">'+KF.fmt(totalPAYE)+'</span></div>'+
    '<div style="font-size:11px;color:var(--muted);margin-top:8px">Due by 15th of following month · ITA Cap 340 Schedule 1</div>';

  // CIT
  var citEl = document.getElementById('cit-computation');
  if (citEl) citEl.innerHTML =
    '<div class="fin-row"><span class="fin-label">Accounting Profit Before Tax</span><span>'+KF.fmt(profit)+'</span></div>'+
    '<div class="fin-row"><span class="fin-label">Tax Adjustments (disallowable)</span><span>'+KF.fmt(0)+'</span></div>'+
    '<div class="fin-row"><span class="fin-label">Chargeable Income</span><span>'+KF.fmt(profit)+'</span></div>'+
    '<div class="fin-row" style="font-weight:800"><span>Income Tax @ 30% (ITA Cap 340)</span><span style="color:var(--t2)">'+KF.fmt(cit)+'</span></div>'+
    '<div class="fin-row"><span class="fin-label">Earnings After Tax (EAT)</span><span style="color:var(--g2);font-weight:800">'+KF.fmt(profit-cit)+'</span></div>'+
    '<div style="font-size:11px;color:var(--muted);margin-top:8px">Return due 31st March · URA Form CIT 001</div>';

  // WHT
  var whtEl = document.getElementById('wht-computation');
  if (whtEl) whtEl.innerHTML =
    '<div class="fin-row"><span class="fin-label">Payments to Contractors</span><span>'+KF.fmt(Math.round(totalExp*0.3))+'</span></div>'+
    '<div class="fin-row" style="font-weight:800"><span>WHT @ 6% (ITA s.119)</span><span style="color:var(--t2)">'+KF.fmt(wht)+'</span></div>'+
    '<div style="font-size:11px;color:var(--muted);margin-top:8px">Deduct at source &amp; remit to URA by 15th following month</div>';

  // URA Return Summary
  var uraEl = document.getElementById('ura-return-summary');
  if (uraEl) uraEl.innerHTML =
    '<div class="fin-row"><span>VAT Payable</span><span class="fin-exp">'+KF.fmt(vat)+'</span></div>'+
    '<div class="fin-row"><span>PAYE Payable</span><span class="fin-exp">'+KF.fmt(totalPAYE)+'</span></div>'+
    '<div class="fin-row"><span>Withholding Tax</span><span class="fin-exp">'+KF.fmt(wht)+'</span></div>'+
    '<div class="fin-row"><span>Corporate Income Tax</span><span class="fin-exp">'+KF.fmt(cit)+'</span></div>'+
    '<div class="fin-row" style="font-weight:800;font-size:16px;border-top:2px solid var(--t2);margin-top:8px;padding-top:12px"><span>Total Tax Payable to URA</span><span class="fin-exp">'+KF.fmt(vat+totalPAYE+wht+cit)+'</span></div>'+
    '<div class="fin-row" style="font-weight:800;font-size:16px"><span>Earnings After Tax (EAT)</span><span class="fin-inc">'+KF.fmt(profit-cit)+'</span></div>';
}

// ─── EMPLOYEE MANAGEMENT ─────────────────────────────────────
var _empPhotoData = null;

function previewEmpPhoto() {
  var fi = document.getElementById('emp-photo-file');
  if (!fi || !fi.files || !fi.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    _empPhotoData = e.target.result;
    var prev = document.getElementById('emp-photo-preview');
    if (prev) prev.innerHTML = '<img src="'+e.target.result+'" style="width:100%;height:100%;object-fit:cover">';
  };
  reader.readAsDataURL(fi.files[0]);
}

function generateEmpId() {
  var year = new Date().getFullYear().toString().slice(2);
  var seq  = String(KF.data.nextEmpNum || (KF.data.employees||[]).length + 1).padStart(4,'0');
  var id   = 'KF-EMP-' + year + seq;
  KF.data.nextEmpNum = (KF.data.nextEmpNum || (KF.data.employees||[]).length + 1) + 1;
  return id;
}

function openAddEmployee() {
  KF.state.editingEmployee = null;
  _empPhotoData = null;
  var t = document.getElementById('emp-modal-title'); if(t) t.textContent = 'Add New Employee';
  var banner = document.getElementById('emp-id-banner'); if(banner) banner.style.display='none';
  ['em-fn','em-ln','em-role','em-nin','em-tin','em-phone','em-email','em-work-email','em-nssf','em-bank','em-kin'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
  ['em-sal','em-transport','em-housing','em-other-allow'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='0';});
  var prev = document.getElementById('emp-photo-preview'); if(prev) prev.innerHTML='👤';
  openModal('modal-emp');
}

function saveEmployee() {
  var fn = (document.getElementById('em-fn')||{}).value||'';
  var ln = (document.getElementById('em-ln')||{}).value||'';
  var role = (document.getElementById('em-role')||{}).value||'';
  fn = fn.trim(); ln = ln.trim(); role = role.trim();
  if (!fn || !role) { toast('Full name and job title are required','⚠️'); return; }

  var empId = generateEmpId();
  var emp = {
    id:            KF.data.nextEmpId ? KF.data.nextEmpId++ : (KF.data.employees||[]).length + 1,
    empId:         empId,
    name:          fn + ' ' + ln,
    role:          role,
    dept:          (document.getElementById('em-dept')||{}).value || 'Operations',
    phone:         (document.getElementById('em-phone')||{}).value || '',
    email:         (document.getElementById('em-email')||{}).value || '',
    workEmail:     (document.getElementById('em-work-email')||{}).value || '',
    nin:           (document.getElementById('em-nin')||{}).value || '',
    tin:           (document.getElementById('em-tin')||{}).value || '',
    nssf:          (document.getElementById('em-nssf')||{}).value || '',
    bank:          (document.getElementById('em-bank')||{}).value || '',
    kin:           (document.getElementById('em-kin')||{}).value || '',
    dob:           (document.getElementById('em-dob')||{}).value || '',
    contract:      (document.getElementById('em-contract')||{}).value || 'Permanent',
    startDate:     (document.getElementById('em-start')||{}).value || new Date().toISOString().split('T')[0],
    salary:        parseInt((document.getElementById('em-sal')||{}).value)||0,
    transport:     parseInt((document.getElementById('em-transport')||{}).value)||0,
    housing:       parseInt((document.getElementById('em-housing')||{}).value)||0,
    otherAllow:    parseInt((document.getElementById('em-other-allow')||{}).value)||0,
    photo:         _empPhotoData || null,
    status:        'Active',
  };

  KF.data.employees = KF.data.employees || [];
  KF.data.employees.push(emp);
  closeModal('modal-emp');
  renderHR();

  // Show generated ID banner
  var banner = document.getElementById('emp-id-banner');
  var dispEl = document.getElementById('emp-id-display');
  if (banner && dispEl) { dispEl.textContent = empId; banner.style.display='flex'; }

  toast('Employee ' + emp.name + ' added — ID: ' + empId + ' ✅', '👔');
}

function renderHR() {
  var emps = KF.data.employees || [];
  var empTbody = document.getElementById('emp-tbody');
  if (empTbody) {
    empTbody.innerHTML = emps.map(function(e) {
      var photoHtml = e.photo
        ? '<img src="'+e.photo+'" style="width:36px;height:36px;object-fit:cover;border-radius:50%;border:2px solid var(--g4)">'
        : '<div style="width:36px;height:36px;border-radius:50%;background:var(--g7);display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid var(--c3)">👤</div>';
      return '<tr>'+
        '<td style="font-family:monospace;font-size:12px;color:var(--g2)"><strong>'+e.empId+'</strong></td>'+
        '<td>'+photoHtml+'</td>'+
        '<td><strong>'+e.name+'</strong><br><small style="color:var(--muted)">'+e.nin+'</small></td>'+
        '<td>'+e.role+'</td>'+
        '<td><span class="badge badge-blue">'+e.dept+'</span></td>'+
        '<td>'+KF.fmt(e.salary)+'</td>'+
        '<td>'+e.contract+'</td>'+
        '<td>'+e.startDate+'</td>'+
        '<td><span class="badge '+(e.status==='Active'?'badge-green':'badge-terra')+'">'+e.status+'</span></td>'+
        '<td><div class="tbl-actions">'+
          '<button class="btn-edit" onclick="viewEmpProfile('+e.id+')">👁 View</button>'+
          '<button class="btn-del" onclick="deactivateEmp('+e.id+')">Archive</button>'+
        '</div></td>'+
      '</tr>';
    }).join('') || '<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--muted)">No employees yet. Add your first employee.</td></tr>';
  }

  // HR Stats
  var statsEl = document.getElementById('hr-stats');
  if (statsEl) {
    var active = emps.filter(function(e){return e.status==='Active';});
    var totalPayroll = active.reduce(function(s,e){return s+(e.salary||0)+(e.transport||0)+(e.housing||0)+(e.otherAllow||0);},0);
    statsEl.innerHTML = [
      {icon:'👔',label:'Total Employees',val:emps.length,col:'var(--g2)'},
      {icon:'✅',label:'Active',val:active.length,col:'var(--g3)'},
      {icon:'📅',label:'On Leave',val:(KF.data.leaves||[]).filter(function(l){return l.status==='Approved';}).length,col:'var(--y2)'},
      {icon:'💵',label:'Monthly Payroll',val:KF.fmt(totalPayroll),col:'var(--o1)'},
    ].map(function(s){return '<div class="stat-card"><div class="sc-icon">'+s.icon+'</div><div class="sc-lbl">'+s.label+'</div><div class="sc-val" style="color:'+s.col+';font-size:'+(typeof s.val==='string'&&s.val.length>8?'16px':'22px')+'">'+s.val+'</div></div>';}).join('');
  }

  // Leave table
  var leaveTbody = document.getElementById('leave-tbody');
  if (leaveTbody) {
    leaveTbody.innerHTML = (KF.data.leaves||[]).map(function(l){
      return '<tr><td>'+l.emp+'</td><td>'+l.type+'</td><td>'+l.from+'</td><td>'+l.to+'</td><td>'+(l.days||'—')+'</td>'+
        '<td><span class="badge '+(l.status==='Approved'?'badge-green':l.status==='Pending'?'badge-yellow':'badge-terra')+'">'+l.status+'</span></td>'+
        '<td>'+(l.status==='Pending'?'<button class="btn-edit" onclick="approveLeaveAdmin('+l.id+')">✓ Approve</button>':'—')+'</td></tr>';
    }).join('') || '<tr><td colspan="7" style="color:var(--muted);text-align:center;padding:16px">No leave applications</td></tr>';
  }

  // SACCO table
  var saccoTbody = document.getElementById('sacco-tbody');
  if (saccoTbody) {
    saccoTbody.innerHTML = (KF.data.sacco||[]).map(function(s){
      var bal = s.loan-s.repaid;
      return '<tr><td>'+s.emp+'</td><td class="fin-inc">'+KF.fmt(s.savings)+'</td><td>'+(s.loan?KF.fmt(s.loan):'—')+'</td><td>'+(s.repaid?KF.fmt(s.repaid):'—')+'</td><td class="'+(bal>0?'fin-exp':'')+'">'+KF.fmt(Math.max(0,bal))+'</td><td><span class="badge '+(s.status==='Active'?'badge-green':s.status==='Cleared'?'badge-blue':'badge-terra')+'">'+s.status+'</span></td></tr>';
    }).join('') || '<tr><td colspan="6" style="color:var(--muted);text-align:center;padding:16px">No SACCO records</td></tr>';
  }
}

function approveLeaveAdmin(id) {
  var l = (KF.data.leaves||[]).find(function(x){return x.id===id;});
  if (l) { l.status='Approved'; renderHR(); toast(l.emp+"'s leave approved",'✅'); }
}

function deactivateEmp(id) {
  var e = (KF.data.employees||[]).find(function(x){return x.id===id;});
  if (e && confirm('Archive '+e.name+'? They will be removed from active payroll.')) {
    e.status='Archived'; renderHR(); toast(e.name+' archived','🗃️');
  }
}

function viewEmpProfile(id) {
  var e = (KF.data.employees||[]).find(function(x){return x.id===id;});
  if (!e) return;
  var gross = (e.salary||0)+(e.transport||0)+(e.housing||0)+(e.otherAllow||0);
  var nssf  = Math.round(gross*UG_TAX.NSSF_EMP);
  var paye  = calcPAYE(gross);
  var net   = gross-nssf-paye;
  var content = '<div style="display:grid;grid-template-columns:120px 1fr;gap:20px;margin-bottom:20px">'+
    '<div style="text-align:center">'+(e.photo?'<img src="'+e.photo+'" style="width:100px;height:100px;object-fit:cover;border-radius:12px">':'<div style="width:100px;height:100px;border-radius:12px;background:var(--g7);display:flex;align-items:center;justify-content:center;font-size:40px">👤</div>')+
    '<div style="font-family:monospace;font-size:13px;font-weight:700;color:var(--g2);margin-top:8px">'+e.empId+'</div></div>'+
    '<div>'+
      '<h3 style="font-family:var(--font-h);font-size:22px;color:var(--g2);margin-bottom:4px">'+e.name+'</h3>'+
      '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">'+e.role+' · '+e.dept+' · '+e.contract+'</div>'+
      '<div class="fin-row"><span>Phone</span><span>'+e.phone+'</span></div>'+
      '<div class="fin-row"><span>Email</span><span>'+e.email+'</span></div>'+
      '<div class="fin-row"><span>NIN</span><span style="font-family:monospace">'+e.nin+'</span></div>'+
      '<div class="fin-row"><span>TIN</span><span style="font-family:monospace">'+e.tin+'</span></div>'+
      '<div class="fin-row"><span>NSSF</span><span style="font-family:monospace">'+e.nssf+'</span></div>'+
      '<div class="fin-row"><span>Start Date</span><span>'+e.startDate+'</span></div>'+
    '</div></div>'+
    '<div style="background:var(--g7);border-radius:12px;padding:16px;margin-top:4px">'+
      '<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--g2);margin-bottom:10px">Compensation & Deductions</div>'+
      '<div class="fin-row"><span>Basic Salary</span><span>'+KF.fmt(e.salary)+'</span></div>'+
      '<div class="fin-row"><span>Transport Allowance</span><span>'+KF.fmt(e.transport||0)+'</span></div>'+
      '<div class="fin-row"><span>Housing Allowance</span><span>'+KF.fmt(e.housing||0)+'</span></div>'+
      '<div class="fin-row" style="font-weight:700"><span>Gross Pay</span><span>'+KF.fmt(gross)+'</span></div>'+
      '<div class="fin-row"><span>NSSF Deduction (5%)</span><span style="color:var(--t2)">('+KF.fmt(nssf)+')</span></div>'+
      '<div class="fin-row"><span>PAYE</span><span style="color:var(--t2)">('+KF.fmt(paye)+')</span></div>'+
      '<div class="fin-row" style="font-weight:800;font-size:16px;border-top:1px solid var(--g5);margin-top:6px;padding-top:10px"><span>Net Pay</span><span style="color:var(--g2)">'+KF.fmt(net)+'</span></div>'+
    '</div>';
  openInfoPage('_empprofile', e.name + ' — Employee Profile', content);
}

function exportEmployeeCSV() {
  var rows = [['EMP #','Name','Role','Dept','Phone','Email','NIN','TIN','Contract','Start Date','Basic Salary','Status']];
  (KF.data.employees||[]).forEach(function(e){
    rows.push([e.empId,e.name,e.role,e.dept,e.phone,e.email,e.nin,e.tin,e.contract,e.startDate,e.salary,e.status]);
  });
  downloadCSV(rows,'kujaza_employees.csv');
}

// ─── INFO PAGES ───────────────────────────────────────────────
var INFO_PAGES = {
  about: {
    title: 'About Kujaza Fresh',
    content: '<h3 style="font-family:var(--font-h);color:var(--g2);margin-bottom:12px">Our Story</h3><p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Kujaza Fresh was founded in Kampala, Uganda with a simple mission: to make farm-fresh produce accessible to every household and business across Greater Kampala. Our name — Kujaza, meaning "to fill up" in Swahili — captures our promise to fill your home with the freshest ingredients Uganda\'s farms can offer.</p><p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">We source directly from verified Ugandan farmers across 13 zones, eliminating middlemen and ensuring farmers earn fairly while customers receive produce that is genuinely fresh — often harvested within 24 hours of delivery.</p><h3 style="font-family:var(--font-h);color:var(--g2);margin-bottom:12px;margin-top:20px">Our Mission</h3><p style="line-height:1.8;color:var(--txt2)">To build Uganda\'s most trusted farm-to-door fresh produce platform, empowering local farmers and nourishing Ugandan homes and businesses with the best of what our land produces.</p>'
  },
  farmers: {
    title: 'Our Farmers',
    content: '<p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Kujaza Fresh works with over 120 verified Ugandan smallholder farmers across Wakiso, Mukono, Luwero, Kayunga, Kabale and other districts. We pay farmers within 5 business days and offer fair market prices above the Kampala wholesale rate.</p><h4 style="color:var(--g2);margin:16px 0 8px">Our Farmer Standards</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px"><li>Zero use of banned pesticides (WHO Class I &amp; II)</li><li>Produce graded and inspected before collection</li><li>Direct farm collection — no middlemen</li><li>Farmers receive GPS tracking of deliveries</li><li>Annual training on post-harvest handling</li></ul>'
  },
  quality: {
    title: 'Our Quality Promise',
    content: '<div style="background:var(--g7);border-radius:12px;padding:20px;margin-bottom:20px"><h3 style="font-family:var(--font-h);color:var(--g2);margin-bottom:8px">The Kujaza Freshness Guarantee</h3><p style="color:var(--txt2);line-height:1.8">If any produce in your order does not meet our quality standard — we will replace it free of charge or issue a full refund within 24 hours. No questions asked.</p></div><h4 style="color:var(--g2);margin-bottom:8px">Our Quality Process</h4><ol style="line-height:2.2;color:var(--txt2);padding-left:20px"><li>Farm inspection before collection</li><li>Temperature-controlled transportation</li><li>Quality grading at our facility</li><li>Same-day dispatch — never overnight storage</li><li>Customer quality check on delivery</li></ol>'
  },
  delivery: {
    title: 'Delivery Zones & Fees',
    content: '<p style="color:var(--txt2);margin-bottom:16px">We deliver across Greater Kampala and surrounding areas. Orders placed before <strong>12:00 noon</strong> are delivered same-day.</p><div class="tbl-wrap"><table><thead><tr><th>Zone</th><th>Delivery Fee</th><th>Est. Time</th></tr></thead><tbody><tr><td>Kawempe, Nakawa, Bugolobi</td><td>UGX 4,000</td><td>1–3 hrs</td></tr><tr><td>Najjera, Makindye, Ndeeba, Ntinda</td><td>UGX 5,000</td><td>1–4 hrs</td></tr><tr><td>Wakiso</td><td>UGX 7,500</td><td>2–4 hrs</td></tr><tr><td>Kajjansi</td><td>UGX 8,500</td><td>2–5 hrs</td></tr><tr><td>Mukono</td><td>UGX 10,000</td><td>3–5 hrs</td></tr><tr><td>Kitende, Lubowa</td><td>UGX 10,000</td><td>2–5 hrs</td></tr><tr><td>Entebbe</td><td>UGX 12,500</td><td>2–5 hrs</td></tr></tbody></table></div><p style="font-size:13px;color:var(--muted);margin-top:12px">Free delivery on orders above UGX 60,000 in Kawempe, Nakawa and Bugolobi zones.</p>'
  },
  returns: {
    title: 'Returns & Refunds Policy',
    content: '<h4 style="color:var(--g2);margin-bottom:12px">Our Commitment</h4><p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">We stand behind the freshness and quality of every item we deliver. If you are not satisfied, we will make it right.</p><h4 style="color:var(--g2);margin-bottom:8px">Eligibility</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px;margin-bottom:16px"><li>Report within <strong>24 hours</strong> of delivery via WhatsApp or ticket</li><li>Wilted, bruised or incorrect items qualify for full replacement or refund</li><li>Photo evidence requested for quality claims</li></ul><h4 style="color:var(--g2);margin-bottom:8px">Refund Process</h4><p style="line-height:1.8;color:var(--txt2)">Approved refunds are processed within 48 hours via the same payment method used (MTN Money, Airtel Money, or bank transfer). Cash on delivery refunds are processed as mobile money credits.</p>'
  },
  faq: {
    title: 'Frequently Asked Questions',
    content: '<div style="display:flex;flex-direction:column;gap:16px"><div style="border-left:3px solid var(--o2);padding-left:14px"><strong style="color:var(--g2)">How do I track my order?</strong><p style="color:var(--txt2);font-size:14px;margin-top:4px">Once your order is picked up by a rider, you will receive a WhatsApp message with their contact and estimated arrival time. You can also raise a ticket using your order number.</p></div><div style="border-left:3px solid var(--o2);padding-left:14px"><strong style="color:var(--g2)">Can I schedule a delivery for tomorrow?</strong><p style="color:var(--txt2);font-size:14px;margin-top:4px">Yes — add a delivery note with your preferred time. For standing orders (weekly or monthly), contact our B2B team.</p></div><div style="border-left:3px solid var(--o2);padding-left:14px"><strong style="color:var(--g2)">What payment methods do you accept?</strong><p style="color:var(--txt2);font-size:14px;margin-top:4px">MTN Mobile Money, Airtel Money, Cash on Delivery, and Bank Transfer to our Centenary Bank account.</p></div><div style="border-left:3px solid var(--o2);padding-left:14px"><strong style="color:var(--g2)">Do you deliver outside Kampala?</strong><p style="color:var(--txt2);font-size:14px;margin-top:4px">Currently we cover 13 zones across Greater Kampala, Wakiso, Mukono and Entebbe. Contact us for special arrangements.</p></div></div>'
  },
  contact: {
    title: 'Contact Us',
    content: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px"><div style="background:var(--g7);border-radius:12px;padding:20px"><h4 style="color:var(--g2);margin-bottom:10px">📱 WhatsApp / Phone</h4><p style="color:var(--txt2)">+256 700 000 000<br>+256 772 000 000</p><p style="font-size:13px;color:var(--muted);margin-top:8px">Mon–Sat: 7am–8pm<br>Sunday: 8am–5pm</p></div><div style="background:var(--o5);border-radius:12px;padding:20px"><h4 style="color:var(--o1);margin-bottom:10px">📧 Email</h4><p style="color:var(--txt2)">orders@kujazafresh.com<br>support@kujazafresh.com<br>b2b@kujazafresh.com</p></div><div style="background:var(--y5);border-radius:12px;padding:20px"><h4 style="color:var(--y1);margin-bottom:10px">📍 Office</h4><p style="color:var(--txt2)">Plot 45, Kampala Road<br>Kampala, Uganda</p></div><div style="background:var(--c4);border-radius:12px;padding:20px"><h4 style="color:var(--g2);margin-bottom:10px">🕐 Ordering Hours</h4><p style="color:var(--txt2)">Order by 12 noon for same-day delivery<br>7 days a week</p></div></div>'
  },
  terms: {
    title: 'Terms of Use',
    content: '<p style="color:var(--muted);font-size:12px;margin-bottom:16px">Last updated: March 2026</p><h4 style="color:var(--g2);margin-bottom:8px">1. Acceptance of Terms</h4><p style="line-height:1.8;color:var(--txt2);margin-bottom:12px">By accessing or using the Kujaza Fresh platform ("Service"), you agree to be bound by these Terms of Use. If you do not agree, please do not use our Service.</p><h4 style="color:var(--g2);margin-bottom:8px">2. Use of the Platform</h4><p style="line-height:1.8;color:var(--txt2);margin-bottom:12px">You agree to use Kujaza Fresh only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the Service.</p><h4 style="color:var(--g2);margin-bottom:8px">3. Orders and Payment</h4><p style="line-height:1.8;color:var(--txt2);margin-bottom:12px">All orders are subject to availability. Prices are in Uganda Shillings (UGX) and include applicable taxes. Payment must be completed before or upon delivery.</p><h4 style="color:var(--g2);margin-bottom:8px">4. Delivery</h4><p style="line-height:1.8;color:var(--txt2);margin-bottom:12px">Delivery times are estimates. Kujaza Fresh is not liable for delays due to circumstances beyond our control including traffic, weather, or force majeure events.</p><h4 style="color:var(--g2);margin-bottom:8px">5. Governing Law</h4><p style="line-height:1.8;color:var(--txt2)">These Terms are governed by the laws of the Republic of Uganda. Any disputes shall be subject to the jurisdiction of Ugandan courts.</p>'
  },
  privacy: {
    title: 'Privacy Policy',
    content: '<p style="color:var(--muted);font-size:12px;margin-bottom:16px">Last updated: March 2026 · Compliant with Uganda Data Protection &amp; Privacy Act 2019</p><h4 style="color:var(--g2);margin-bottom:8px">Information We Collect</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px;margin-bottom:12px"><li>Name, phone number, email address and delivery address</li><li>Order history and payment records</li><li>Device information and usage analytics</li></ul><h4 style="color:var(--g2);margin-bottom:8px">How We Use Your Information</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px;margin-bottom:12px"><li>To process and deliver your orders</li><li>To send order confirmations and delivery updates</li><li>To improve our service and personalise your experience</li><li>Marketing communications (you may opt out at any time)</li></ul><h4 style="color:var(--g2);margin-bottom:8px">Data Protection</h4><p style="line-height:1.8;color:var(--txt2);margin-bottom:12px">We do not sell your personal data to third parties. Your data is stored securely and accessed only by authorised Kujaza Fresh personnel.</p><h4 style="color:var(--g2);margin-bottom:8px">Your Rights</h4><p style="line-height:1.8;color:var(--txt2)">Under the Uganda Data Protection &amp; Privacy Act 2019, you have the right to access, correct or request deletion of your personal data. Contact privacy@kujazafresh.com.</p>'
  },
  cookies: {
    title: 'Cookie Policy',
    content: '<p style="line-height:1.8;color:var(--txt2);margin-bottom:12px">Kujaza Fresh uses essential session cookies to maintain your shopping cart and login state. We do not use third-party tracking cookies or advertising cookies.</p><h4 style="color:var(--g2);margin-bottom:8px">Types of Cookies Used</h4><div class="tbl-wrap"><table><thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead><tbody><tr><td>session_id</td><td>Maintains your login session</td><td>Session</td></tr><tr><td>cart_data</td><td>Saves your shopping cart</td><td>7 days</td></tr><tr><td>preferences</td><td>Remembers your settings</td><td>30 days</td></tr></tbody></table></div>'
  },
  refund: {
    title: 'Refund Policy',
    content: '<p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Kujaza Fresh offers a full refund or replacement on any produce that does not meet our quality standards.</p><h4 style="color:var(--g2);margin-bottom:8px">Refund Timeline</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px;margin-bottom:12px"><li>Report quality issues within 24 hours of delivery</li><li>Refund decision within 4 business hours</li><li>Mobile money refunds processed within 24 hours</li><li>Bank transfers processed within 2 business days</li></ul><h4 style="color:var(--g2);margin-bottom:8px">Non-Refundable Items</h4><p style="line-height:1.8;color:var(--txt2)">Delivery fees are non-refundable once the order has been dispatched unless the entire order is cancelled before dispatch.</p>'
  },
  compliance: {
    title: 'Regulatory Compliance',
    content: '<p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Kujaza Fresh Ltd operates in full compliance with Ugandan business and tax regulations.</p><div style="display:grid;gap:12px"><div style="background:var(--g7);border-radius:10px;padding:14px"><strong style="color:var(--g2)">URA Registration</strong><p style="font-size:13px;color:var(--txt2);margin-top:4px">Registered with Uganda Revenue Authority (URA). TIN: 1012345678. VAT registered.</p></div><div style="background:var(--g7);border-radius:10px;padding:14px"><strong style="color:var(--g2)">NSSF Compliance</strong><p style="font-size:13px;color:var(--txt2);margin-top:4px">All permanent employees registered with National Social Security Fund (NSSF Uganda). Monthly contributions remitted.</p></div><div style="background:var(--g7);border-radius:10px;padding:14px"><strong style="color:var(--g2)">Business Registration</strong><p style="font-size:13px;color:var(--txt2);margin-top:4px">Incorporated under the Companies Act, Uganda. Certificate of Incorporation: 123456789.</p></div><div style="background:var(--g7);border-radius:10px;padding:14px"><strong style="color:var(--g2)">Food Safety</strong><p style="font-size:13px;color:var(--txt2);margin-top:4px">Operating under Uganda National Bureau of Standards (UNBS) food safety guidelines.</p></div></div>'
  },
  b2b: {
    title: 'B2B & Bulk Orders',
    content: '<h3 style="font-family:var(--font-h);color:var(--g2);margin-bottom:12px">Supplying Hotels, Schools & Restaurants</h3><p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Kujaza Fresh is the preferred fresh produce supplier for over 50 businesses across Kampala. We offer weekly standing orders, custom quantity contracts, and dedicated account management.</p><h4 style="color:var(--g2);margin-bottom:8px">B2B Benefits</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px;margin-bottom:16px"><li>Volume discounts from 15% to 30%</li><li>Credit terms up to 30 days for verified businesses</li><li>Custom packaging and labelling</li><li>Dedicated account manager</li><li>Formal invoicing and receipts</li><li>NSSF-compliant supply agreements</li></ul><h4 style="color:var(--g2);margin-bottom:8px">Get Started</h4><p style="line-height:1.8;color:var(--txt2)">Email b2b@kujazafresh.com or call +256 700 000 001 with your weekly produce requirements. We will have a proposal ready within 24 hours.</p>'
  },
  vendor: {
    title: 'Become a Vendor Partner',
    content: '<h3 style="font-family:var(--font-h);color:var(--g2);margin-bottom:12px">List Your Produce on Kujaza Fresh</h3><p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Are you a farmer, farmer group, or produce trader? Partner with Kujaza Fresh to reach thousands of customers across Kampala.</p><h4 style="color:var(--g2);margin-bottom:8px">Vendor Requirements</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px;margin-bottom:16px"><li>Valid National ID or business registration</li><li>Consistent supply capacity (minimum 50kg/week per product)</li><li>Adherence to Kujaza quality standards</li><li>Mobile money account (MTN or Airtel)</li></ul><h4 style="color:var(--g2);margin-bottom:8px">Vendor Terms</h4><ul style="line-height:2;color:var(--txt2);padding-left:20px"><li>Commission: 6–10% per sale</li><li>Payouts within 5 business days</li><li>Free onboarding and quality training</li></ul>'
  },
  careers: {
    title: 'Careers at Kujaza Fresh',
    content: '<h3 style="font-family:var(--font-h);color:var(--g2);margin-bottom:12px">Join Our Growing Team</h3><p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Kujaza Fresh is a fast-growing Ugandan startup building the country\'s most trusted fresh produce platform. We are always looking for passionate, motivated people to join our team in Kampala.</p><h4 style="color:var(--g2);margin-bottom:8px">Open Positions</h4><ul style="line-height:2.2;color:var(--txt2);padding-left:20px"><li>Delivery Riders (Kampala &amp; zones) — Boda or motorcycle preferred</li><li>Customer Care Officer — strong phone and WhatsApp communication</li><li>Procurement Officer — experience in fresh produce markets</li><li>Finance Officer — CPA or accounting graduate</li><li>Digital Marketing Intern — social media, content creation</li></ul><p style="line-height:1.8;color:var(--txt2);margin-top:16px">Send your CV and cover letter to careers@kujazafresh.com with the job title in the subject line.</p>'
  },
  track: {
    title: 'Track Your Order',
    content: '<p style="line-height:1.8;color:var(--txt2);margin-bottom:16px">Once your order is placed, you will receive a WhatsApp confirmation. When your order is picked up by a rider, you will receive the rider\'s name and phone number.</p><div style="background:var(--y5);border:1.5px solid var(--y3);border-radius:12px;padding:16px;margin-bottom:16px"><strong style="color:var(--y1)">Track in real time:</strong><p style="font-size:14px;color:var(--txt2);margin-top:4px">Call or WhatsApp the rider directly using the number sent to you at dispatch.</p></div><p style="color:var(--txt2)">If you have not received an update within 2 hours of ordering, please <a onclick="openModal(\'modal-ticket\');closeModal(\'modal-infopage\')" style="color:var(--o2);font-weight:700;cursor:pointer">raise a support ticket</a> with your order number.</p>'
  }
};

function openInfoPage(key, customTitle, customContent) {
  var page = customContent ? { title: customTitle||key, content: customContent } : INFO_PAGES[key];
  if (!page) { toast('Page not available yet','⚠️'); return; }
  var t = document.getElementById('infopage-title');
  var c = document.getElementById('infopage-content');
  if (t) t.textContent = page.title;
  if (c) c.innerHTML = page.content;
  openModal('modal-infopage');
}
