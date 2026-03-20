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
      { id:1,  name:'Ripe Mangoes',     emoji:'🥭', catId:1, price:8000,  unit:'kg',        stock:80,  desc:'Sweet, juicy Ugandan mangoes sourced from Luwero farms.', status:'Active' },
      { id:2,  name:'Avocados',          emoji:'🥑', catId:1, price:5000,  unit:'bunch (3)', stock:120, desc:'Creamy ripe avocados, perfectly sized.', status:'Active' },
      { id:3,  name:'Pineapples',        emoji:'🍍', catId:1, price:6000,  unit:'piece',     stock:60,  desc:'Fresh golden pineapples, naturally sweet.', status:'Active' },
      { id:4,  name:'Watermelon',        emoji:'🍉', catId:1, price:15000, unit:'piece',     stock:25,  desc:'Large, crisp watermelons — great for the whole family.', status:'Active' },
      { id:5,  name:'Passion Fruit',     emoji:'🍈', catId:1, price:7000,  unit:'dozen',     stock:45,  desc:'Tangy and sweet, freshly harvested.', status:'Active' },
      { id:6,  name:'Pawpaw (Papaya)',   emoji:'🍐', catId:1, price:6000,  unit:'piece',     stock:38,  desc:'Ripe, soft pawpaws rich in nutrients.', status:'Active' },
      { id:7,  name:'Tomatoes',          emoji:'🍅', catId:2, price:4000,  unit:'kg',        stock:200, desc:'Fresh red tomatoes, harvested within 48 hours.', status:'Active' },
      { id:8,  name:'Onions (Red)',       emoji:'🧅', catId:2, price:3500,  unit:'kg',        stock:150, desc:'Crisp red onions, great for cooking and salads.', status:'Active' },
      { id:9,  name:'Sukuma Wiki (Kale)', emoji:'🥬', catId:2, price:2000,  unit:'bunch',     stock:10,  desc:'Fresh kale, harvested daily. No wilting guaranteed.', status:'Active' },
      { id:10, name:'Carrots',           emoji:'🥕', catId:2, price:3000,  unit:'kg',        stock:90,  desc:'Sweet, fresh Ugandan carrots.', status:'Active' },
      { id:11, name:'Cabbage',           emoji:'🥦', catId:2, price:4000,  unit:'head',      stock:70,  desc:'Large, crisp cabbages.', status:'Active' },
      { id:12, name:'Irish Potatoes',    emoji:'🥔', catId:2, price:5000,  unit:'kg',        stock:180, desc:'Firm, quality Irish potatoes from Kabale.', status:'Active' },
      { id:13, name:'Bell Peppers',      emoji:'🫑', catId:2, price:6000,  unit:'kg',        stock:35,  desc:'Mixed colour bell peppers, sweet and crunchy.', status:'Active' },
      { id:14, name:'Maize Flour (Posho)',emoji:'🌽', catId:3, price:8000,  unit:'bag (1kg)', stock:200, desc:'Fine ground maize flour for posho.', status:'Active' },
      { id:15, name:'Beans — K132',      emoji:'🫘', catId:3, price:12000, unit:'bag (1kg)', stock:180, desc:'Popular K132 climbing beans, well-sorted.', status:'Active' },
      { id:16, name:'Rice (Local)',       emoji:'🍚', catId:3, price:10000, unit:'bag (1kg)', stock:5,   desc:'Clean local Ugandan rice, minimal breakage.', status:'Active' },
      { id:17, name:'Groundnuts (Raw)',   emoji:'🥜', catId:3, price:9000,  unit:'bag (1kg)', stock:120, desc:'Fresh raw groundnuts, great for paste or roasting.', status:'Active' },
      { id:18, name:'Soya Beans',        emoji:'🌿', catId:3, price:7000,  unit:'bag (1kg)', stock:95,  desc:'Premium soya beans, high-protein.', status:'Active' },
      { id:19, name:'Raw Honey',         emoji:'🍯', catId:4, price:35000, unit:'litre',     stock:30,  desc:'Pure raw honey from Mubende beekeepers.', status:'Active' },
      { id:20, name:'Fresh Eggs',        emoji:'🥚', catId:4, price:18000, unit:'tray (30)',  stock:50,  desc:'Free-range farm eggs, fresh daily.', status:'Active' },
      { id:21, name:'Dried Mukene',      emoji:'🐟', catId:4, price:15000, unit:'bag (1kg)', stock:0,   desc:'Sun-dried silver cyprinid fish.', status:'Active' },
      { id:22, name:'Simsim (Sesame)',   emoji:'🌰', catId:4, price:12000, unit:'bag (1kg)', stock:60,  desc:'Clean white sesame seeds.', status:'Active' },
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
      { email:'admin@kujaza.com', pass:'admin123', name:'Admin', role:'admin' },
      { email:'sarah@email.com',  pass:'pass123',  name:'Sarah Nakato', role:'customer', phone:'+256 701 111 222', orders:3, spent:89500, joined:'Jan 2026' },
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
    nextIds: { order:45, product:23, cat:5, rider:6, income:6, expense:7 }
  },

  // ── STATE ─────────────────────────────────────
  state: {
    currentUser: null,
    cart: [],
    activeCat: 'all',
    searchQ: '',
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
