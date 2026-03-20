// ===== KUJAZA FRESH — DATA STORE =====

const KF = {

  // ── INITIAL DATA ──────────────────────────────
  data: {
    categories: [
      { id: 1, name: 'Fresh Fruits',     emoji: '🍎' },
      { id: 2, name: 'Fresh Vegetables', emoji: '🥬' },
      { id: 3, name: 'Dried Grains',     emoji: '🌾' },
      { id: 4, name: 'Other Produce',    emoji: '🍯' }
    ],
    products: [
      { id:1,  name:'Ripe Mangoes',      emoji:'🥭', img:'images/mango.jpg',       catId:1, price:8000,  origPrice:10000, unit:'kg',        stock:80,  desc:'Sun-kissed Ugandan mangoes from Luwero. Naturally sweet, no artificial ripening.', status:'Active', badge:'Best Seller', tags:['organic','seasonal'] },
      { id:2,  name:'Avocados',           emoji:'🥑', img:'images/avocado.jpg',     catId:1, price:5000,  origPrice:null,  unit:'bunch (3)', stock:120, desc:'Creamy Fuerte avocados — Uganda-grown, buttery smooth inside.', status:'Active', badge:'Fresh Today', tags:['organic'] },
      { id:3,  name:'Pineapples',         emoji:'🍍', img:'images/pineapple.jpg',   catId:1, price:6000,  origPrice:8000,  unit:'piece',     stock:60,  desc:'Golden sweet pineapples. Sourced from Kayunga farms, harvested at peak ripeness.', status:'Active', badge:'20% Off', tags:['seasonal','discount'] },
      { id:4,  name:'Watermelon',         emoji:'🍉', img:null,                     catId:1, price:15000, origPrice:null,  unit:'piece',     stock:25,  desc:'Large crisp watermelons — cold, sweet and great for the whole family.', status:'Active', badge:null, tags:['seasonal'] },
      { id:5,  name:'Passion Fruit',      emoji:'🍈', img:null,                     catId:1, price:7000,  origPrice:null,  unit:'dozen',     stock:45,  desc:'Tangy Ugandan passion fruit, freshly harvested every morning.', status:'Active', badge:null, tags:['organic','seasonal'] },
      { id:6,  name:'Pawpaw (Papaya)',    emoji:'🍐', img:'images/papaya.jpg',      catId:1, price:6000,  origPrice:null,  unit:'piece',     stock:38,  desc:'Ripe, soft pawpaws rich in Vitamin C. Farm-fresh from Wakiso.', status:'Active', badge:'Organic', tags:['organic'] },
      { id:7,  name:'Tomatoes',           emoji:'🍅', img:'images/tomatoes.jpg',    catId:2, price:4000,  origPrice:5000,  unit:'kg',        stock:200, desc:'Fresh red tomatoes harvested within 48 hours. No chemicals — just sun and soil.', status:'Active', badge:'Farm Fresh', tags:['organic','discount'] },
      { id:8,  name:'Onions (Red)',        emoji:'🧅', img:null,                    catId:2, price:3500,  origPrice:null,  unit:'kg',        stock:150, desc:'Crisp red onions from Mukono farmers. Great for cooking and fresh salads.', status:'Active', badge:null, tags:[] },
      { id:9,  name:'Sukuma Wiki (Kale)',  emoji:'🥬', img:'images/vegetables.jpg', catId:2, price:2000,  origPrice:null,  unit:'bunch',     stock:10,  desc:'Fresh kale harvested daily. No wilting guaranteed — packed and dispatched same morning.', status:'Active', badge:'Low Stock', tags:['organic'] },
      { id:10, name:'Carrots',            emoji:'🥕', img:null,                     catId:2, price:3000,  origPrice:null,  unit:'kg',        stock:90,  desc:'Sweet, crisp Ugandan carrots — great raw or cooked.', status:'Active', badge:null, tags:[] },
      { id:11, name:'Cauliflower',        emoji:'🥦', img:'images/cauliflower.jpg', catId:2, price:5000,  origPrice:7000,  unit:'head',      stock:40,  desc:'Large firm cauliflower heads, bright white and freshly cut. Perfect for soups and stir-fries.', status:'Active', badge:'28% Off', tags:['discount','seasonal'] },
      { id:12, name:'Irish Potatoes',     emoji:'🥔', img:null,                     catId:2, price:5000,  origPrice:null,  unit:'kg',        stock:180, desc:'Firm quality Irish potatoes from Kabale highlands. Clean, sorted and ready to cook.', status:'Active', badge:null, tags:[] },
      { id:13, name:'Eggplant',           emoji:'🍆', img:'images/eggplant.jpg',   catId:2, price:4500,  origPrice:null,  unit:'kg',        stock:35,  desc:'Deep purple eggplant, fresh from the farm with morning dew. Great for stews.', status:'Active', badge:'Organic', tags:['organic'] },
      { id:14, name:'Maize Flour (Posho)',emoji:'🌽', img:null,                     catId:3, price:8000,  origPrice:null,  unit:'bag (1kg)', stock:200, desc:'Fine ground maize flour for posho. Stone-ground, no additives.', status:'Active', badge:null, tags:[] },
      { id:15, name:'Beans — K132',       emoji:'🫘', img:null,                     catId:3, price:12000, origPrice:14000, unit:'bag (1kg)', stock:180, desc:'Popular K132 climbing beans, well-sorted and clean. High protein.', status:'Active', badge:'14% Off', tags:['discount'] },
      { id:16, name:'Rice (Local)',        emoji:'🍚', img:null,                    catId:3, price:10000, origPrice:null,  unit:'bag (1kg)', stock:5,   desc:'Clean local Ugandan rice, minimal breakage. Grown in Butaleja.', status:'Active', badge:'Low Stock', tags:[] },
      { id:17, name:'Groundnuts (Raw)',    emoji:'🥜', img:null,                    catId:3, price:9000,  origPrice:null,  unit:'bag (1kg)', stock:120, desc:'Fresh raw groundnuts — great for paste, roasting or snacking.', status:'Active', badge:null, tags:['organic'] },
      { id:18, name:'Soya Beans',         emoji:'🌿', img:null,                     catId:3, price:7000,  origPrice:null,  unit:'bag (1kg)', stock:95,  desc:'Premium soya beans, high-protein. Used for soya milk and cooking.', status:'Active', badge:null, tags:['organic'] },
      { id:19, name:'Raw Honey',          emoji:'🍯', img:null,                     catId:4, price:35000, origPrice:null,  unit:'litre',     stock:30,  desc:'Pure raw honey from Mubende beekeepers. Unfiltered, no additives.', status:'Active', badge:'Premium', tags:['organic','premium'] },
      { id:20, name:'Free-Range Eggs',    emoji:'🥚', img:'images/eggs.jpg',        catId:4, price:18000, origPrice:22000, unit:'tray (30)', stock:50,  desc:'Multi-coloured free-range eggs from pasture chickens. Collected fresh daily.', status:'Active', badge:'18% Off', tags:['discount','organic'] },
      { id:21, name:'Dried Mukene',       emoji:'🐟', img:null,                     catId:4, price:15000, origPrice:null,  unit:'bag (1kg)', stock:0,   desc:'Sun-dried silver cyprinid fish. Rich in protein and calcium.', status:'Active', badge:null, tags:[] },
      { id:22, name:'Simsim (Sesame)',    emoji:'🌰', img:null,                     catId:4, price:12000, origPrice:null,  unit:'bag (1kg)', stock:60,  desc:'Clean white sesame seeds. Great for baking and cooking oils.', status:'Active', badge:null, tags:['organic'] },
      { id:23, name:'Bananas (Sweet)',    emoji:'🍌', img:'images/bananas.jpg',     catId:1, price:5000,  origPrice:null,  unit:'bunch',     stock:90,  desc:'Ripe sweet bananas from Mbarara. Ready to eat or bake.', status:'Active', badge:'Fresh Today', tags:['organic'] },
      { id:24, name:'Red Apples',        emoji:'🍎', img:'images/apple.jpg',       catId:1, price:12000, origPrice:null,  unit:'bag (1kg)', stock:40,  desc:'Crisp, juicy red apples. A treat for the whole family.', status:'Active', badge:'Imported', tags:['premium'] },
      { id:25, name:'Pumpkin',           emoji:'🎃', img:'images/pumpkin.jpg',     catId:2, price:8000,  origPrice:null,  unit:'piece',     stock:25,  desc:'Freshly harvested green pumpkins. Great for soups, stews and baby food.', status:'Active', badge:'Organic', tags:['organic','seasonal'] },
    ],
    orders: [
      { id:'KF-0038', customer:'Sarah Nakato',    zone:'Najjera',   items:[{name:'Tomatoes',qty:2,price:4000},{name:'Onions',qty:1,price:3500},{name:'Delivery fee',qty:1,price:5000}], total:16500, payment:'MTN Mobile Money', status:'Delivered',       riderId:1, date:'2026-03-10' },
      { id:'KF-0039', customer:'James Kato',      zone:'Bugolobi',  items:[{name:'Avocados',qty:3,price:5000},{name:'Eggs',qty:1,price:18000},{name:'Delivery fee',qty:1,price:4000}], total:37000, payment:'Cash on Delivery', status:'Delivered',       riderId:2, date:'2026-03-12' },
      { id:'KF-0040', customer:'Hotel Entebbe',   zone:'Entebbe',   items:[{name:'Tomatoes',qty:20,price:4000},{name:'Carrots',qty:10,price:3000},{name:'Delivery fee',qty:1,price:12500}], total:122500, payment:'Bank Transfer',   status:'Delivered',    riderId:1, date:'2026-03-13' },
      { id:'KF-0041', customer:'Miriam Apio',     zone:'Makindye',  items:[{name:'Mangoes',qty:2,price:8000},{name:'Honey',qty:1,price:35000},{name:'Delivery fee',qty:1,price:5000}], total:56000, payment:'Airtel Money',    status:'Delivered',       riderId:3, date:'2026-03-14' },
      { id:'KF-0042', customer:'Kampala School',  zone:'Kawempe',   items:[{name:'Posho',qty:10,price:8000},{name:'Beans',qty:10,price:12000},{name:'Delivery fee',qty:1,price:4000}], total:204000, payment:'Bank Transfer',  status:'Out for Delivery', riderId:2, date:'2026-03-16' },
      { id:'KF-0043', customer:'David Ssemanda',  zone:'Ntinda',    items:[{name:'Sukuma Wiki',qty:3,price:2000},{name:'Tomatoes',qty:1,price:4000},{name:'Delivery fee',qty:1,price:5000}], total:15000, payment:'MTN Mobile Money', status:'Pending',   riderId:null, date:'2026-03-16' },
      { id:'KF-0044', customer:'Grace Namutebi',  zone:'Wakiso',    items:[{name:'Pineapples',qty:5,price:6000},{name:'Passion Fruit',qty:2,price:7000},{name:'Delivery fee',qty:1,price:7500}], total:51500, payment:'Airtel Money', status:'Pending',  riderId:null, date:'2026-03-16' },
    ],
    riders: [
      { id:1, name:'Alex Mugisha',   phone:'+256 701 234 567', type:'Company Driver',   zone:'Najjera',  plate:'UBC 456X', status:'Available',  deliveries:47, rating:4.8 },
      { id:2, name:'Brian Ssali',    phone:'+256 772 345 678', type:'Company Driver',   zone:'Bugolobi', plate:'UAX 789K', status:'On Delivery', deliveries:38, rating:4.6 },
      { id:3, name:'Christine Aber', phone:'+256 756 890 123', type:'Outsourced Rider', zone:'Makindye', plate:'UBE 321Y', status:'Available',  deliveries:29, rating:4.7 },
      { id:4, name:'David Okello',   phone:'+256 703 456 789', type:'Outsourced Rider', zone:'Wakiso',   plate:'UAZ 654W', status:'Off Duty',   deliveries:55, rating:4.9 },
      { id:5, name:'Eva Nakyobe',    phone:'+256 789 012 345', type:'Company Driver',   zone:'Entebbe',  plate:'UAD 112E', status:'Available',  deliveries:22, rating:4.5 },
    ],
    zones: [
      { name:'Kawempe',    fee:4000  }, { name:'Nakawa',    fee:4000  },
      { name:'Najjera',    fee:5000  }, { name:'Bugolobi',  fee:4000  },
      { name:'Makindye',   fee:5000  }, { name:'Ndeeba',    fee:5000  },
      { name:'Ntinda',     fee:5000  }, { name:'Wakiso',    fee:7500  },
      { name:'Mukono',     fee:10000 }, { name:'Entebbe',   fee:12500 },
      { name:'Kajjansi',   fee:8500  }, { name:'Kitende',   fee:10000 },
      { name:'Lubowa',     fee:10000 },
    ],
    users: [
      { email:'admin@kujaza.com',    pass:'admin123',  name:'Admin',           role:'admin' },
      { email:'sarah@email.com',     pass:'pass123',   name:'Sarah Nakato',    role:'customer',  phone:'+256 701 111 222', orders:3, spent:89500, joined:'Jan 2026' },
      { email:'hr@kujaza.com',       pass:'hr1234',    name:'Grace Namutebi',  role:'hr',        dept:'HR',        title:'HR Manager',       empId:'EMP-004' },
      { email:'accounts@kujaza.com', pass:'acc1234',   name:'Paul Kigongo',    role:'accounts',  dept:'Finance',   title:'Finance Officer',  empId:'EMP-005' },
      { email:'alex@kujaza.com',     pass:'staff123',  name:'Alex Mugisha',    role:'staff',     dept:'Operations',title:'Senior Driver',     empId:'EMP-001' },
      { email:'brian@kujaza.com',    pass:'staff123',  name:'Brian Ssali',     role:'staff',     dept:'Operations',title:'Driver',            empId:'EMP-002' },
      { email:'agnes@kujaza.com',    pass:'staff123',  name:'Agnes Nakamya',   role:'staff',     dept:'Operations',title:'Customer Care',     empId:'EMP-003' },
    ],
    income: [
      { id:1, desc:'Online B2C sales — March week 1', amt:1250000, date:'2026-03-08', cat:'Product Sales'  },
      { id:2, desc:'Hotel Entebbe — bulk supply',      amt:850000,  date:'2026-03-10', cat:'B2B Wholesale'  },
      { id:3, desc:'Kampala School standing order',    amt:600000,  date:'2026-03-13', cat:'B2B Wholesale'  },
      { id:4, desc:'Delivery fees collected',          amt:185000,  date:'2026-03-14', cat:'Delivery Fees'  },
      { id:5, desc:'Subscription boxes — March',       amt:320000,  date:'2026-03-15', cat:'Subscription'   },
    ],
    expenses: [
      { id:1, desc:'Farmer purchase — Wakiso produce',   amt:780000, date:'2026-03-08', cat:'Produce (COGS)' },
      { id:2, desc:'Rider fuel & weekly allowances',     amt:145000, date:'2026-03-10', cat:'Delivery'       },
      { id:3, desc:'Packaging materials (bags, crates)', amt:88000,  date:'2026-03-12', cat:'Packaging'      },
      { id:4, desc:'Facebook & Instagram ads',           amt:75000,  date:'2026-03-13', cat:'Marketing'      },
      { id:5, desc:'Cold storage electricity',           amt:60000,  date:'2026-03-14', cat:'Storage'        },
      { id:6, desc:'Admin & mobile data',                amt:35000,  date:'2026-03-15', cat:'Admin'          },
    ],
    feedback: [
      { id:1, name:'James Okello',   email:'james@email.com',  rating:5, msg:'Absolutely fresh avocados — best I have ever ordered online in Kampala!', date:'2026-03-10', status:'Approved',  featured:true  },
      { id:2, name:'Mary Atim',      email:'mary@email.com',   rating:4, msg:'Fast delivery to Najjera. The tomatoes were really fresh. Will order again.', date:'2026-03-12', status:'Approved',  featured:true  },
      { id:3, name:'Robert Mutebi',  email:'robert@email.com', rating:5, msg:'The weekly veggie box is great value. My family loves it!', date:'2026-03-14', status:'Approved',  featured:false },
      { id:4, name:'Annet Nambi',    email:'annet@email.com',  rating:3, msg:'Delivery was a bit late but produce quality was good. Hope timing improves.', date:'2026-03-15', status:'Pending', featured:false },
      { id:5, name:'Peter Ssenyonga',email:'peter@email.com',  rating:5, msg:'I supply a restaurant and Kujaza Fresh has been incredibly reliable for our weekly orders.', date:'2026-03-16', status:'Pending', featured:false },
    ],
    notices: [
      { id:1, title:'March Payroll Processed',        body:'Salaries for March 2026 have been processed and will reflect by 25th March. Check your payslip on the staff portal.', dept:'All Staff',   date:'2026-03-18', postedBy:'HR Manager',      priority:'high'   },
      { id:2, title:'New Delivery Route Guidelines',  body:'Riders please review the updated route map for Entebbe and Kitende zones. New protocols are effective 20th March.', dept:'Operations',   date:'2026-03-17', postedBy:'Operations Manager',priority:'normal' },
      { id:3, title:'SACCO Loan Applications Open',   body:'SACCO loan applications for Q2 2026 are now open. Maximum loan is UGX 2,000,000. Apply via the staff portal by 30th March.', dept:'All Staff', date:'2026-03-16', postedBy:'HR Manager', priority:'normal' },
    ],
    hrInbox: [
      { id:1, from:'HR Manager',       to:'Alex Mugisha',   subject:'Leave Application Approved',          body:'Your annual leave from 20–27 March has been approved. Enjoy your time off!',  date:'2026-03-18', read:false },
      { id:2, from:'Operations Manager',to:'Brian Ssali',   subject:'New Delivery Zone Assignment',         body:'You have been assigned Bugolobi zone effective from Monday 23rd March.',      date:'2026-03-17', read:true  },
      { id:3, from:'HR Manager',       to:'Agnes Nakamya',  subject:'Customer Ticket TKT-002 — Action Required', body:'Please follow up on the avocado quality complaint from James Kato. Resolve by EOD.',date:'2026-03-16', read:false },
    ],
    payslips: [
      { id:1, empId:'EMP-001', name:'Alex Mugisha',  month:'March 2026', basic:850000, allowances:120000, deductions:85000,  sacco:50000, net:835000  },
      { id:2, empId:'EMP-002', name:'Brian Ssali',   month:'March 2026', basic:750000, allowances:100000, deductions:75000,  sacco:40000, net:735000  },
      { id:3, empId:'EMP-003', name:'Agnes Nakamya', month:'March 2026', basic:650000, allowances:80000,  deductions:65000,  sacco:30000, net:635000  },
      { id:4, empId:'EMP-004', name:'Grace Namutebi',month:'March 2026', basic:1200000,allowances:200000, deductions:120000, sacco:80000, net:1200000 },
      { id:5, empId:'EMP-005', name:'Paul Kigongo',  month:'March 2026', basic:1000000,allowances:150000, deductions:100000, sacco:60000, net:990000  },
    ],
    nextIds: { order:45, product:26, cat:5, rider:6, income:6, expense:7, feedback:4, notice:4, inbox:4, payslip:4, voucher:5 },
    vouchers: [
      { id:1, code:'KUJAZA10',   desc:'10% off your first order',       type:'percent', value:10,    minOrder:20000, uses:0,   maxUses:500,  active:true,  expiry:'2026-06-30' },
      { id:2, code:'FRESH20',    desc:'UGX 20,000 off orders over 80k', type:'fixed',   value:20000, minOrder:80000, uses:12,  maxUses:200,  active:true,  expiry:'2026-04-30' },
      { id:3, code:'STUDENT15',  desc:'15% student discount',           type:'percent', value:15,    minOrder:15000, uses:89,  maxUses:1000, active:true,  expiry:'2026-12-31' },
      { id:4, code:'BULK30',     desc:'30% off bulk B2B orders',        type:'percent', value:30,    minOrder:200000,uses:5,   maxUses:50,   active:true,  expiry:'2026-06-30' },
    ],
    loyaltyMembers: [
      { email:'sarah@email.com', name:'Sarah Nakato',  points:450,  tier:'Silver', totalSpent:89500,  redeemed:50  },
      { email:'james@email.com', name:'James Kato',    points:120,  tier:'Bronze', totalSpent:37000,  redeemed:0   },
      { email:'miriam@email.com',name:'Miriam Apio',   points:780,  tier:'Gold',   totalSpent:156000, redeemed:200 },
    ],
    newsletter: [],
  },

  // ── STATE ─────────────────────────────────────
  state: {
    currentUser: null,
    cart: [],
    activeCat: 'all',
    searchQ: '',
    activeFilter: 'all',
    activeSort: 'default',
    maxPrice: null,
    selectedZone: null,
    selectedPay: 'mtn',
    activeAdminSection: 'dashboard',
    activeReport: 'sales',
    editingProduct: null,
    editingCat: null,
    editingRider: null,
  },

  // ── UTILS ─────────────────────────────────────
  fmt(n) { return 'UGX ' + Number(n).toLocaleString(); },
  catName(id) { const c = this.data.categories.find(c => c.id === id); return c ? c.name : '—'; },
  catEmoji(id) { const c = this.data.categories.find(c => c.id === id); return c ? c.emoji : ''; },
  cartTotal() {
    const sub = this.state.cart.reduce((s, i) => {
      const p = this.data.products.find(x => x.id === i.pid);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
    const zone = this.state.selectedZone ? this.data.zones.find(z => z.name === this.state.selectedZone) : null;
    return sub + (zone ? zone.fee : 0);
  },
  cartSubtotal() {
    return this.state.cart.reduce((s, i) => {
      const p = this.data.products.find(x => x.id === i.pid);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },
  cartCount() { return this.state.cart.reduce((s, i) => s + i.qty, 0); },
};
