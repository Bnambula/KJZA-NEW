// ===== KUJAZA FRESH — DATA STORE =====

const KF = {

  // ── INITIAL DATA ──────────────────────────────
  data: {
    categories: [
      { id: 1, name: 'Fresh Fruits',      emoji: '🍎' },
      { id: 2, name: 'Vegetables & Roots',emoji: '🥬' },
      { id: 3, name: 'Grains & Legumes',  emoji: '🌾' },
      { id: 4, name: 'Spices & Specials', emoji: '🍯' }
    ],
    products: [
      /* ── FRESH FRUITS ─────────────────────────────────────────── */
      { id:1,  name:'Pineapples (Enannsi)',   emoji:'🍍', img:'images/pineapple.jpg', catId:1, code:'PDT010001', price:6000,  origPrice:8000,  unit:'piece',     stock:60,  desc:'Sweet golden pineapples from Kayunga — harvested at peak ripeness, no artificial ripening.', status:'Active', badge:'20% Off',    tags:['seasonal','discount'] },
      { id:2,  name:'Mangoes (Emiyembe)',     emoji:'🥭', img:'images/mango.jpg',     catId:1, code:'PDT010002', price:8000,  origPrice:10000, unit:'kg',        stock:80,  desc:'Sun-kissed Ugandan mangoes from Luwero. Naturally sweet, juicy and farm-fresh.', status:'Active', badge:'Best Seller', tags:['organic','seasonal'] },
      { id:3,  name:'Passion Fruit',          emoji:'🍈', img:null,                   catId:1, code:'PDT010003', price:7000,  origPrice:null,  unit:'dozen',     stock:45,  desc:'Tangy Ugandan passion fruit, freshly harvested every morning from Wakiso farms.', status:'Active', badge:'Organic',    tags:['organic','seasonal'] },
      { id:4,  name:'Pawpaw (Papaya)',        emoji:'🍐', img:'images/papaya.jpg',    catId:1, code:'PDT010004', price:5000,  origPrice:null,  unit:'piece',     stock:38,  desc:'Ripe, soft pawpaws rich in Vitamin C and enzymes. Farm-fresh from Wakiso.', status:'Active', badge:'Fresh Today', tags:['organic'] },
      { id:5,  name:'Watermelon',             emoji:'🍉', img:null,                   catId:1, code:'PDT010005', price:15000, origPrice:null,  unit:'piece',     stock:20,  desc:'Large crisp watermelons — cold, sweet and perfect for the whole family.', status:'Active', badge:null,         tags:['seasonal'] },
      { id:6,  name:'Oranges (Citrus)',       emoji:'🍊', img:null,                   catId:1, code:'PDT010006', price:5000,  origPrice:6000,  unit:'bag (6)',   stock:70,  desc:'Fresh Ugandan oranges — sweet with a tart kick. Great for juice or eating fresh.', status:'Active', badge:'17% Off',    tags:['organic','discount'] },
      { id:7,  name:'Lemons',                 emoji:'🍋', img:null,                   catId:1, code:'PDT010007', price:3000,  origPrice:null,  unit:'bag (6)',   stock:55,  desc:'Zesty fresh lemons. Perfect for cooking, drinks and salad dressings.', status:'Active', badge:null,         tags:['organic'] },
      { id:8,  name:'Bananas (Sweet)',        emoji:'🍌', img:'images/bananas.jpg',   catId:1, code:'PDT010008', price:5000,  origPrice:null,  unit:'bunch',     stock:90,  desc:'Ripe sweet bananas from Mbarara. Ready to eat, bake or blend.', status:'Active', badge:'Fresh Today', tags:['organic'] },
      { id:9,  name:'Guavas',                 emoji:'🟢', img:null,                   catId:1, code:'PDT010009', price:4000,  origPrice:null,  unit:'kg',        stock:35,  desc:'Sweet pink-fleshed guavas, freshly picked. Rich in Vitamin C and fibre.', status:'Active', badge:'Organic',    tags:['organic','seasonal'] },

      /* ── FRESH VEGETABLES ─────────────────────────────────────── */
      { id:10, name:'Tomatoes',               emoji:'🍅', img:'images/tomatoes.jpg',  catId:2, code:'PDT020001', price:4000,  origPrice:5000,  unit:'kg',        stock:200, desc:'Fresh red tomatoes harvested within 48 hours. No chemicals — just sun and soil.', status:'Active', badge:'Farm Fresh', tags:['organic','discount'] },
      { id:11, name:'Onions (Red)',            emoji:'🧅', img:null,                   catId:2, code:'PDT020002', price:3500,  origPrice:null,  unit:'kg',        stock:150, desc:'Crisp red onions from Mukono. Great for cooking, stews and fresh salads.', status:'Active', badge:null,         tags:[] },
      { id:12, name:'Cabbage',                emoji:'🥦', img:null,                   catId:2, code:'PDT020003', price:4000,  origPrice:null,  unit:'head',      stock:70,  desc:'Large firm cabbages. Clean, fresh and great for stews, salads and stir-fries.', status:'Active', badge:null,         tags:[] },
      { id:13, name:'Carrots',                emoji:'🥕', img:null,                   catId:2, code:'PDT020004', price:3000,  origPrice:null,  unit:'kg',        stock:90,  desc:'Sweet, crisp Ugandan carrots — great raw, juiced or cooked.', status:'Active', badge:null,         tags:[] },
      { id:14, name:'Green Peppers',          emoji:'🫑', img:null,                   catId:2, code:'PDT020005', price:5000,  origPrice:null,  unit:'kg',        stock:40,  desc:'Fresh green peppers — mild, crunchy and perfect for stews and salads.', status:'Active', badge:null,         tags:['organic'] },
      { id:15, name:'Eggplant (Bilinganya)',  emoji:'🍆', img:'images/eggplant.jpg',  catId:2, code:'PDT020006', price:4500,  origPrice:null,  unit:'kg',        stock:35,  desc:'Deep purple eggplant from the farm. Great for stews, grilling and curries.', status:'Active', badge:'Organic',    tags:['organic'] },
      { id:16, name:'Pumpkin',                emoji:'🎃', img:'images/pumpkin.jpg',   catId:2, code:'PDT020007', price:8000,  origPrice:null,  unit:'piece',     stock:25,  desc:'Freshly harvested green pumpkins. Great for soups, stews and baby food.', status:'Active', badge:'Organic',    tags:['organic','seasonal'] },
      { id:17, name:'Spinach (Bbugga)',       emoji:'🥬', img:'images/vegetables.jpg',catId:2, code:'PDT020008', price:2500,  origPrice:null,  unit:'bunch',     stock:60,  desc:'Tender fresh spinach, picked at dawn. Rich in iron and perfect for cooking or salads.', status:'Active', badge:'Fresh Today', tags:['organic'] },
      { id:18, name:'Dodo (African Nightshade)',emoji:'🌿',img:null,                  catId:2, code:'PDT020009', price:2000,  origPrice:null,  unit:'bunch',     stock:45,  desc:'Fresh dodo — a beloved Ugandan leafy green. Nutritious and delicious in groundnut sauce.', status:'Active', badge:'Local',      tags:['organic','seasonal'] },
      { id:19, name:'Nakati (Bitter Tomato)', emoji:'🌱', img:null,                   catId:2, code:'PDT020010', price:2000,  origPrice:null,  unit:'bunch',     stock:30,  desc:'Fresh nakati — a traditional Ugandan vegetable. Rich in nutrients and full of flavour.', status:'Active', badge:'Local',      tags:['organic','seasonal'] },
      { id:20, name:'Cauliflower',            emoji:'🥦', img:'images/cauliflower.jpg',catId:2, code:'PDT020011',price:5000,  origPrice:7000,  unit:'head',      stock:40,  desc:'Large firm cauliflower heads, bright white. Perfect for soups and stir-fries.', status:'Active', badge:'28% Off',    tags:['discount','seasonal'] },

      /* ── ROOT CROPS & STAPLES ─────────────────────────────────── */
      { id:21, name:'Matooke (Green Bananas)',emoji:'🍌', img:null,                   catId:2, code:'PDT020012', price:12000, origPrice:null,  unit:'bunch',     stock:50,  desc:'Fresh matooke (green cooking bananas) — Uganda\'s staple food. Farm-harvested.', status:'Active', badge:'Staple',     tags:['organic'] },
      { id:22, name:'Sweet Potatoes',         emoji:'🍠', img:null,                   catId:2, code:'PDT020013', price:4000,  origPrice:null,  unit:'kg',        stock:100, desc:'Firm, sweet Ugandan sweet potatoes. Great roasted, boiled or mashed.', status:'Active', badge:null,         tags:['organic'] },
      { id:23, name:'Cassava (Muwogo)',       emoji:'🌾', img:null,                   catId:2, code:'PDT020014', price:5000,  origPrice:null,  unit:'kg',        stock:80,  desc:'Fresh cassava from Luwero. Boil, fry or dry for flour.', status:'Active', badge:null,         tags:['organic'] },
      { id:24, name:'Irish Potatoes',         emoji:'🥔', img:null,                   catId:2, code:'PDT020015', price:5000,  origPrice:null,  unit:'kg',        stock:180, desc:'Firm quality Irish potatoes from Kabale highlands. Clean, sorted, ready to cook.', status:'Active', badge:null,         tags:[] },

      /* ── GRAINS & LEGUMES ─────────────────────────────────────── */
      { id:25, name:'Maize (Corn) Flour',     emoji:'🌽', img:null,                   catId:3, code:'PDT030001', price:8000,  origPrice:null,  unit:'bag (1kg)', stock:200, desc:'Fine ground maize flour for posho. Stone-ground, no additives, 100% natural.', status:'Active', badge:null,         tags:[] },
      { id:26, name:'Sorghum Flour',          emoji:'🌾', img:null,                   catId:3, code:'PDT030002', price:9000,  origPrice:null,  unit:'bag (1kg)', stock:80,  desc:'Nutrient-rich sorghum flour. Used for porridge, local brew and baking.', status:'Active', badge:'Organic',    tags:['organic'] },
      { id:27, name:'Millet Flour (Bulo)',    emoji:'🟤', img:null,                   catId:3, code:'PDT030003', price:9000,  origPrice:null,  unit:'bag (1kg)', stock:70,  desc:'Traditional millet flour — the base of Ugandan millet bread (Kwon). Rich in iron.', status:'Active', badge:'Organic',    tags:['organic'] },
      { id:28, name:'Groundnuts (Peanuts)',   emoji:'🥜', img:null,                   catId:3, code:'PDT030004', price:9000,  origPrice:null,  unit:'bag (1kg)', stock:120, desc:'Fresh raw groundnuts from Lira. Great for making peanut paste, roasting or cooking.', status:'Active', badge:null,         tags:['organic'] },
      { id:29, name:'Beans — Mixed',          emoji:'🫘', img:null,                   catId:3, code:'PDT030005', price:12000, origPrice:14000, unit:'bag (1kg)', stock:180, desc:'Assorted Ugandan beans including K132, nambale and red kidney. High protein.', status:'Active', badge:'14% Off',    tags:['discount'] },
      { id:30, name:'Super Rice (Uganda)',     emoji:'🍚', img:null, catId:3, code:'PDT030006', price:5500,  origPrice:null,  unit:'bag (1kg)', stock:80,  desc:'Clean Uganda-grown super rice from Butaleja. Good texture, minimal breakage.', status:'Active', badge:null, tags:[] },
      { id:49, name:'Super Rice (Uganda) 5kg',emoji:'🍚', img:null, catId:3, code:'PDT030007', price:22000, origPrice:25000, unit:'bag (5kg)',  stock:60,  desc:'Uganda super rice — 5kg value pack.', status:'Active', badge:'12% Off', tags:['discount'] },
      { id:50, name:'Super Rice (Uganda) 10kg',emoji:'🍚',img:null, catId:3, code:'PDT030008', price:38000, origPrice:45000, unit:'bag (10kg)', stock:40,  desc:'Uganda super rice — 10kg family pack. Best value per kg.', status:'Active', badge:'16% Off', tags:['discount'] },
      { id:51, name:'Super Rice (Tanzania)',   emoji:'🍚', img:null, catId:3, code:'PDT030009', price:6000,  origPrice:null,  unit:'bag (1kg)', stock:70,  desc:'Premium Tanzania super rice — long grain, fluffy and aromatic.', status:'Active', badge:null, tags:[] },
      { id:52, name:'Basmati Rice',            emoji:'🍚', img:null, catId:3, code:'PDT030010', price:9000,  origPrice:null,  unit:'bag (1kg)', stock:50,  desc:'Imported Basmati rice — long grain, fragrant, perfect for pilau and special meals.', status:'Active', badge:'Premium', tags:['premium'] },
      { id:53, name:'Pakistani Rice',          emoji:'🍚', img:null, catId:3, code:'PDT030011', price:8000,  origPrice:null,  unit:'bag (1kg)', stock:45,  desc:'Premium Pakistani rice — popular for special occasions and biryani.', status:'Active', badge:null, tags:['premium'] },
      { id:54, name:'SWT Rice (1kg)',          emoji:'🍚', img:null, catId:3, code:'PDT030012', price:7500,  origPrice:null,  unit:'bag (1kg)', stock:60,  desc:'SWT fortified rice — nutrient-enriched, popular in Kampala households.', status:'Active', badge:null, tags:[] },
      { id:55, name:'SWT Rice (5kg)',          emoji:'🍚', img:null, catId:3, code:'PDT030013', price:30000, origPrice:35000, unit:'bag (5kg)', stock:35,  desc:'SWT fortified rice — 5kg value pack.', status:'Active', badge:'14% Off', tags:['discount'] },
      { id:56, name:'SWT Rice (10kg)',         emoji:'🍚', img:null, catId:3, code:'PDT030014', price:55000, origPrice:65000, unit:'bag (10kg)',stock:25,  desc:'SWT fortified rice — 10kg bulk pack. Best value for families.', status:'Active', badge:'15% Off', tags:['discount'] },

      /* ── SPICES, HONEY & SPECIALS ─────────────────────────────── */
      { id:31, name:'Fresh Ginger',           emoji:'🫚', img:null,                   catId:4, code:'PDT040001', price:4000,  origPrice:null,  unit:'kg',        stock:60,  desc:'Pungent fresh ginger root from Ugandan farms. Excellent for cooking, teas and medicine.', status:'Active', badge:'Organic',    tags:['organic'] },
      { id:32, name:'Hot Peppers (Chilli)',   emoji:'🌶️', img:null,                   catId:4, code:'PDT040002', price:3000,  origPrice:null,  unit:'kg',        stock:55,  desc:'Fiery fresh hot peppers — sun-dried or fresh. Adds real heat to any dish.', status:'Active', badge:null,         tags:['organic'] },
      { id:33, name:'Sugarcane',      emoji:'🎋', img:null,                   catId:4, code:'PDT040003', price:3000,  origPrice:null,  unit:'piece',     stock:40,  desc:'Fresh cut sugarcane — sweet, fibrous and great to chew. A classic Ugandan treat.', status:'Active', badge:'Local',      tags:['seasonal'] },
      { id:34, name:'Raw Honey',              emoji:'🍯', img:null,                   catId:4, code:'PDT040004', price:35000, origPrice:null,  unit:'litre',     stock:30,  desc:'Pure raw honey from Mubende beekeepers. Unfiltered, no additives. 100% natural.', status:'Active', badge:'Premium',    tags:['organic','premium'] },
      { id:35, name:'Free-Range Eggs',        emoji:'🥚', img:'images/eggs.jpg',      catId:4, code:'PDT040005', price:18000, origPrice:22000, unit:'tray (30)', stock:50,  desc:'Multi-coloured free-range eggs from pasture-raised chickens. Collected fresh daily.', status:'Active', badge:'18% Off',    tags:['discount','organic'] },
      { id:36, name:'Simsim (Sesame Seeds)', emoji:'🌰', img:null,                   catId:4, code:'PDT040006', price:12000, origPrice:null,  unit:'bag (1kg)', stock:60,  desc:'Clean white sesame seeds from Northern Uganda. Great for baking and oils.', status:'Active', badge:null,         tags:['organic'] },
      { id:37, name:'Dried Mukene (Fish)',      emoji:'🐟', img:null,  catId:4, code:'PDT040007', price:15000, origPrice:null,  unit:'bag (1kg)', stock:0,   desc:'Sun-dried silver cyprinid fish from Lake Victoria. Rich in protein and calcium.', status:'Active', badge:null,         tags:[] },
      { id:38, name:'Endagala (Plantain Leaves)',emoji:'🍃',img:null, catId:4, code:'PDT040008', price:3000,  origPrice:null,  unit:'bunch',     stock:50,  desc:'Fresh banana/plantain leaves — essential for wrapping Luwombo. Also great for serving and cooking.', status:'Active', badge:'Local',      tags:['organic','seasonal'] },
      { id:39, name:'Spring Onions',            emoji:'🌿', img:null,  catId:2, code:'PDT020016', price:2500,  origPrice:null,  unit:'bunch',     stock:80,  desc:'Fresh spring onions with tender green tops. A key ingredient in Ugandan stews and Luwombo.', status:'Active', badge:'Fresh Today', tags:['organic'] },
      { id:40, name:'Avocados',                  emoji:'🥑', img:'images/avocado.jpg', catId:1, code:'PDT010010', price:5000, origPrice:null, unit:'bunch (3)', stock:120, desc:'Creamy Fuerte avocados — Uganda-grown, buttery smooth inside. Perfect with Luwombo.', status:'Active', badge:'Fresh Today', tags:['organic'] },
      { id:41, name:'Ground Bilungo (Eggplant)', emoji:'🍆', img:null, catId:4, code:'PDT040009', price:5000,  origPrice:null,  unit:'jar (250g)',stock:35,  desc:'Traditionally smoked and dried eggplant (bilungo) paste — the secret flavour base of Ugandan Luwombo and stews.', status:'Active', badge:'Traditional', tags:['organic','seasonal'] },
      { id:42, name:'Nsenene (Grasshoppers)',    emoji:'🦗', img:null,  catId:4, code:'PDT040010', price:25000, origPrice:30000, unit:'bag (500g)',stock:20,  desc:'Seasonal fried nsenene (long-horned grasshoppers) — a beloved Ugandan delicacy. Crispy, salty and full of protein. Seasonal catch.', status:'Active', badge:'Seasonal',    tags:['seasonal','premium'] },
      { id:43, name:'Local Chicken (Enganda)',   emoji:'🍗', img:null,  catId:4, code:'PDT040011', price:28000, origPrice:null,  unit:'piece',     stock:30,  desc:'Free-range village chicken (Enganda) — farm-raised, full flavour. Perfect for Luwombo and soups. Requires longer cooking.', status:'Active', badge:'Farm Fresh',  tags:['organic'] },
      { id:48, name:'Exotic Chicken (Broiler)',  emoji:'🐔', img:null,  catId:4, code:'PDT040016', price:22000, origPrice:null,  unit:'piece',     stock:40,  desc:'Farm-raised broiler chicken — tender, cooks faster (30–40 mins). Great for quick stews, roasting and grilling.', status:'Active', badge:'Fast Cook',   tags:['organic'] },
      { id:44, name:'Beef (Stew Cuts)',          emoji:'🥩', img:null,  catId:4, code:'PDT040012', price:22000, origPrice:null,  unit:'kg',        stock:25,  desc:'Fresh beef stew cuts from local farms. Ideal for Luwombo, groundnut stew and soups.', status:'Active', badge:'Fresh',       tags:[] },
      { id:45, name:'Groundnut Paste (Ebinyebwa)',emoji:'🥜',img:null, catId:4, code:'PDT040013', price:12000, origPrice:null,  unit:'jar (250g)',stock:60,  desc:'Fresh-ground Ugandan groundnut paste — the heart of groundnut sauce (ebinyebwa). Thick and flavourful.', status:'Active', badge:'Local',      tags:['organic'] },
      { id:46, name:'Curry Powder',              emoji:'🟡', img:null,  catId:4, code:'PDT040014', price:4000,  origPrice:null,  unit:'packet',    stock:80,  desc:'Aromatic curry powder blend. Used in Ugandan-style chicken and vegetable stews.', status:'Active', badge:null,         tags:[] },
      { id:47, name:'Cooking Oil (Sunflower)',   emoji:'🫙', img:null,  catId:4, code:'PDT040015', price:15000, origPrice:18000, unit:'litre',     stock:100, desc:'Pure sunflower cooking oil. Light, clean taste. Essential in every Ugandan kitchen.', status:'Active', badge:'17% Off',    tags:['discount'] },
    ],
    orders: [
      { id:'KJZ032600001', customer:'Sarah Nakato',    zone:'Najjera',   items:[{name:'Tomatoes',qty:2,price:4000},{name:'Onions',qty:1,price:3500},{name:'Delivery fee',qty:1,price:5000}], total:16500, payment:'MTN Mobile Money', status:'Delivered',       riderId:1, date:'2026-03-10' },
      { id:'KJZ032600002', customer:'James Kato',      zone:'Bugolobi',  items:[{name:'Avocados',qty:3,price:5000},{name:'Eggs',qty:1,price:18000},{name:'Delivery fee',qty:1,price:4000}], total:37000, payment:'Cash on Delivery', status:'Delivered',       riderId:2, date:'2026-03-12' },
      { id:'KJZ032600003', customer:'Hotel Entebbe',   zone:'Entebbe',   items:[{name:'Tomatoes',qty:20,price:4000},{name:'Carrots',qty:10,price:3000},{name:'Delivery fee',qty:1,price:12500}], total:122500, payment:'Bank Transfer',   status:'Delivered',    riderId:1, date:'2026-03-13' },
      { id:'KJZ032600004', customer:'Miriam Apio',     zone:'Makindye',  items:[{name:'Mangoes',qty:2,price:8000},{name:'Honey',qty:1,price:35000},{name:'Delivery fee',qty:1,price:5000}], total:56000, payment:'Airtel Money',    status:'Delivered',       riderId:3, date:'2026-03-14' },
      { id:'KJZ032600005', customer:'Kampala School',  zone:'Kawempe',   items:[{name:'Posho',qty:10,price:8000},{name:'Beans',qty:10,price:12000},{name:'Delivery fee',qty:1,price:4000}], total:204000, payment:'Bank Transfer',  status:'Out for Delivery', riderId:2, date:'2026-03-16' },
      { id:'KJZ032600006', customer:'David Ssemanda',  zone:'Ntinda',    items:[{name:'Sukuma Wiki',qty:3,price:2000},{name:'Tomatoes',qty:1,price:4000},{name:'Delivery fee',qty:1,price:5000}], total:15000, payment:'MTN Mobile Money', status:'Pending',   riderId:null, date:'2026-03-16' },
      { id:'KJZ032600007', customer:'Grace Namutebi',  zone:'Wakiso',    items:[{name:'Pineapples',qty:5,price:6000},{name:'Passion Fruit',qty:2,price:7000},{name:'Delivery fee',qty:1,price:7500}], total:51500, payment:'Airtel Money', status:'Pending',  riderId:null, date:'2026-03-16' },
    ],
    riders: [
      { id:1, name:'Alex Mugisha',   phone:'+256 701 234 567', type:'Company Driver',   zone:'Najjera',  plate:'UBC 456X', status:'Available',  deliveries:47, rating:4.8 },
      { id:2, name:'Brian Ssali',    phone:'+256 772 345 678', type:'Company Driver',   zone:'Bugolobi', plate:'UAX 789K', status:'On Delivery', deliveries:38, rating:4.6 },
      { id:3, name:'Christine Aber', phone:'+256 756 890 123', type:'Outsourced Rider', zone:'Makindye', plate:'UBE 321Y', status:'Available',  deliveries:29, rating:4.7 },
      { id:4, name:'David Okello',   phone:'+256 703 456 789', type:'Outsourced Rider', zone:'Wakiso',   plate:'UAZ 654W', status:'Off Duty',   deliveries:55, rating:4.9 },
      { id:5, name:'Eva Nakyobe',    phone:'+256 789 012 345', type:'Company Driver',   zone:'Entebbe',  plate:'UAD 112E', status:'Available',  deliveries:22, rating:4.5 },
    ],
    zones: [
      { name:'Kawempe',    fee:3000, expressFee:6000, tier:1, eta:'15–25 min', expressEta:'10–15 min', hub:'Kawempe Hub' },
      { name:'Nakawa',     fee:3000, expressFee:6000, tier:1, eta:'15–25 min', expressEta:'10–15 min', hub:'Nakawa Hub' },
      { name:'Najjera',    fee:4000, expressFee:7000, tier:2, eta:'25–40 min', expressEta:'15–25 min', hub:'Kisaasi Hub' },
      { name:'Bugolobi',   fee:3000, expressFee:6000, tier:1, eta:'15–25 min', expressEta:'10–15 min', hub:'Bugolobi Hub' },
      { name:'Makindye',   fee:4000, expressFee:7000, tier:2, eta:'25–40 min', expressEta:'15–25 min', hub:'Makindye Hub' },
      { name:'Ndeeba',     fee:4000, expressFee:7000, tier:2, eta:'25–40 min', expressEta:'15–25 min', hub:'Ndeeba Hub' },
      { name:'Ntinda',     fee:4000, expressFee:7000, tier:2, eta:'25–40 min', expressEta:'15–25 min', hub:'Ntinda Hub' },
      { name:'Kisaasi',    fee:4000, expressFee:7000, tier:2, eta:'25–40 min', expressEta:'15–25 min', hub:'Kisaasi Hub' },
      { name:'Bukoto',     fee:4000, expressFee:7000, tier:2, eta:'25–40 min', expressEta:'15–25 min', hub:'Kisaasi Hub' },
      { name:'Bweyogerere',fee:5000, expressFee:9000, tier:3, eta:'40–60 min', expressEta:'25–35 min', hub:'Kireka Hub' },
      { name:'Wakiso',     fee:5000, expressFee:9000, tier:3, eta:'40–60 min', expressEta:'25–35 min', hub:'Wakiso Hub' },
      { name:'Mukono',     fee:5000, expressFee:9000, tier:3, eta:'40–60 min', expressEta:'25–35 min', hub:'Mukono Hub' },
      { name:'Entebbe',    fee:5000, expressFee:9000, tier:3, eta:'40–60 min', expressEta:'30–40 min', hub:'Entebbe Hub' },
      { name:'Kajjansi',   fee:4000, expressFee:7000, tier:2, eta:'25–40 min', expressEta:'15–20 min', hub:'Kajjansi Hub' },
      { name:'Kitende',    fee:5000, expressFee:9000, tier:3, eta:'40–60 min', expressEta:'25–35 min', hub:'Entebbe Hub' },
      { name:'Lubowa',     fee:5000, expressFee:9000, tier:3, eta:'40–60 min', expressEta:'25–35 min', hub:'Entebbe Hub' },
    ],
    users: [
      { email:'admin@kujaza.com',    pass:'admin123',  name:'Admin',           role:'admin' },
      { email:'sarah@email.com',     pass:'pass123',   name:'Sarah Nakato',    role:'customer',  phone:'+256 701 111 222', orders:3, spent:89500, joined:'Jan 2026' },
      { email:'hr@kujaza.com',       pass:'hr1234',    name:'Grace Namutebi',  role:'hr',        dept:'HR',        title:'HR Manager',       empId:'EJF260304' },
      { email:'accounts@kujaza.com', pass:'acc1234',   name:'Paul Kigongo',    role:'accounts',  dept:'Finance',   title:'Finance Officer',  empId:'EJF260305' },
      { email:'alex@kujaza.com',     pass:'staff123',  name:'Alex Mugisha',    role:'staff',     dept:'Operations',title:'Senior Driver',     empId:'EJF260301' },
      { email:'brian@kujaza.com',    pass:'staff123',  name:'Brian Ssali',     role:'staff',     dept:'Operations',title:'Driver',            empId:'EJF260302' },
      { email:'agnes@kujaza.com',    pass:'staff123',  name:'Agnes Nakamya',   role:'staff',     dept:'Operations',title:'Customer Care',     empId:'EJF260303' },
      { email:'inventory@kujaza.com', pass:'inv1234',   name:'Moses Opio',       role:'inventory', dept:'Operations',title:'Inventory Officer', empId:'EJF260306', modules:['inventory','products'] },
      { email:'cashier@kujaza.com',   pass:'cash1234',  name:'Lydia Atuhaire',   role:'cashier',   dept:'Finance',   title:'Cashier',           empId:'EJF260307', modules:['orders','finance','vouchers'] },
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
      { id:3, from:'HR Manager',       to:'Agnes Nakamya',  subject:'Customer Ticket TKT140300002 — Action Required', body:'Please follow up on the avocado quality complaint from James Kato. Resolve by EOD.',date:'2026-03-16', read:false },
    ],
    payslips: [
      { id:1, empId:'EJF260301', name:'Alex Mugisha',  month:'March 2026', basic:850000, allowances:120000, deductions:85000,  sacco:50000, net:835000  },
      { id:2, empId:'EJF260302', name:'Brian Ssali',   month:'March 2026', basic:750000, allowances:100000, deductions:75000,  sacco:40000, net:735000  },
      { id:3, empId:'EJF260303', name:'Agnes Nakamya', month:'March 2026', basic:650000, allowances:80000,  deductions:65000,  sacco:30000, net:635000  },
      { id:4, empId:'EJF260304', name:'Grace Namutebi',month:'March 2026', basic:1200000,allowances:200000, deductions:120000, sacco:80000, net:1200000 },
      { id:5, empId:'EJF260305', name:'Paul Kigongo',  month:'March 2026', basic:1000000,allowances:150000, deductions:100000, sacco:60000, net:990000  },
    ],
    b2bClients: [
      { id:1, name:'Hotel Entebbe', contact:'David Kaggwa', phone:'0772123456', type:'Hotel', items:'Tomatoes, Onions, Leafy Greens', frequency:'Weekly', volume:'50kg/week', status:'Active', creditDays:14, outstanding:0 },
      { id:2, name:'Kampala Primary School', contact:'Mrs Nakato', phone:'0700234567', type:'School', items:'Posho, Beans, Vegetables', frequency:'Weekly', volume:'100kg/week', status:'Active', creditDays:30, outstanding:85000 },
      { id:3, name:'Speke Resort Munyonyo', contact:'Chef Ibrahim', phone:'0756345678', type:'Hotel', items:'Mixed Vegetables, Fruits, Herbs', frequency:'Daily', volume:'30kg/day', status:'Active', creditDays:7, outstanding:0 },
    ],
    whatsappOrders: [
      { id:'WA-001', name:'Sarah K.', phone:'0701234567', msg:'Hi, I need 2kg tomatoes, 1kg onions and a bunch of dodo. Najjera area.', time:'09:14', status:'New', assigned:null },
      { id:'WA-002', name:'James M.', phone:'0772345678', msg:'Pls deliver 5 pineapples and 2kg mangoes to Ntinda. MTN money.', time:'09:31', status:'Processing', assigned:'Alex Mugisha' },
      { id:'WA-003', name:'Hotel Chef', phone:'0756012345', msg:'Weekly order: 20kg tomatoes, 10kg onions, 5kg carrots, 3kg ginger. Invoice to Hotel Entebbe account.', time:'08:00', status:'Confirmed', assigned:'Brian Ssali' },
    ],
    microHubs: [
      { id:1, name:'Ntinda / Nakawa Hub', zone:'Ntinda, Nakawa, Bugolobi', address:'Ntinda Trading Centre', capacity:'200kg', stock:'High', riders:2, status:'Active' },
      { id:2, name:'Kisaasi / Bukoto Hub', zone:'Najjera, Kisaasi, Bukoto', address:'Kisaasi Stage', capacity:'150kg', stock:'Medium', riders:2, status:'Active' },
      { id:3, name:'Kawempe Hub', zone:'Kawempe, Ndeeba, Makindye', address:'Kawempe Market', capacity:'200kg', stock:'High', riders:1, status:'Active' },
      { id:4, name:'Entebbe / Kajjansi Hub', zone:'Entebbe, Kajjansi, Kitende, Lubowa', address:'Kajjansi Town', capacity:'100kg', stock:'Medium', riders:1, status:'Active' },
      { id:5, name:'Bweyogerere / Kireka Hub', zone:'Bweyogerere, Mukono', address:'Kireka Stage', capacity:'100kg', stock:'Low', riders:1, status:'Active' },
    ],
    nextIds: { order:8, product:57, cat:5, rider:6, income:6, expense:7, feedback:4, notice:4, inbox:4, payslip:4, voucher:5 },
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
