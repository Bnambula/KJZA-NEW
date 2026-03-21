// ===== KUJAZA FRESH — DID YOU KNOW? Food Facts Widget =====

var DYK = {
  current: 0,
  open: false,
  rotateTimer: null,

  // 30 food facts tied to products in the Kujaza Fresh catalogue
  facts: [
    {
      title: 'Tomatoes Are Actually Fruits!',
      food: 'Tomatoes',
      productId: 10,
      img: 'images/tomatoes.jpg',
      color: '#E8621A',
      bgColor: '#FFF5F0',
      icon: '🍅',
      origin: '🌍 Origin: Andes Mountains, South America',
      fact: 'Most people call tomatoes vegetables — but botanically, a tomato is a fruit. It develops from a flower and contains seeds. It was classified as a vegetable by the US Supreme Court in 1893 for trade tariff purposes, and the name has stuck ever since!',
      benefits: ['Rich in Lycopene — a powerful antioxidant', 'Excellent source of Vitamin C and K', 'Supports heart health and reduces cancer risk', 'Low in calories — great for weight management'],
      tip: '🌟 Pro Tip: Cooked tomatoes actually release MORE lycopene than raw ones. Try them in a groundnut stew!',
      tag: 'Fruit disguised as a vegetable'
    },
    {
      title: 'Avocados: The Butter Fruit',
      food: 'Avocados',
      productId: 40,
      img: 'images/avocado.jpg',
      color: '#2D6A30',
      bgColor: '#F0FDF4',
      icon: '🥑',
      origin: '🌍 Origin: Puebla, Mexico (10,000 years ago)',
      fact: 'The avocado is one of the few fruits that contains healthy fats — the same kind found in olive oil. Uganda grows some of the creamiest Fuerte avocados in East Africa, harvested from the cool highlands of Kabale and Mbale.',
      benefits: ['High in monounsaturated fats — great for the heart', 'Packed with potassium — more than bananas', 'Rich in folate — essential during pregnancy', 'Contains Vitamin E — great for skin health'],
      tip: '🌟 Pro Tip: Rub half a lemon on a cut avocado to stop it browning. Mash with tomatoes, onions and chilli for the best African guacamole.',
      tag: 'A fruit full of healthy fat'
    },
    {
      title: 'Pineapple Digests Your Food',
      food: 'Pineapples (Enannsi)',
      productId: 1,
      img: 'images/pineapple.jpg',
      color: '#D4A017',
      bgColor: '#FFFBEB',
      icon: '🍍',
      origin: '🌍 Origin: South America · Grown in Kayunga, Uganda',
      fact: 'Pineapple contains Bromelain — an enzyme that literally digests protein. That tingling sensation on your tongue when eating pineapple? That\'s the bromelain breaking down the proteins in your mouth! It\'s also why pineapple can tenderise meat.',
      benefits: ['Bromelain reduces inflammation and aids digestion', 'Very high in Vitamin C — boosts immunity', 'Contains manganese — important for bone health', 'Supports faster healing of wounds and bruises'],
      tip: '🌟 Pro Tip: Drink fresh pineapple juice after a heavy meat meal to help digestion. The bromelain works wonders on proteins.',
      tag: 'Nature\'s digestive enzyme'
    },
    {
      title: 'Bananas Are Herbs, Not Trees!',
      food: 'Bananas (Sweet)',
      productId: 8,
      img: 'images/bananas.jpg',
      color: '#D4A017',
      bgColor: '#FFFBEB',
      icon: '🍌',
      origin: '🌍 Origin: Papua New Guinea · Major crop across Uganda',
      fact: 'The banana "tree" is actually the world\'s largest herb. It has no woody stem — the trunk is made entirely of tightly wrapped leaf sheaths. Bananas are also technically berries, while strawberries are not! Uganda is one of the world\'s top banana producers.',
      benefits: ['Excellent source of potassium — supports heart rhythm', 'Natural energy booster — great pre-workout snack', 'Contains Vitamin B6 — supports brain health', 'Prebiotic fibre feeds healthy gut bacteria'],
      tip: '🌟 Pro Tip: The browner the banana, the sweeter and easier to digest it is. Ripe bananas are best for smoothies and baking.',
      tag: 'The world\'s largest herb'
    },
    {
      title: 'Ginger: Uganda\'s Super Spice',
      food: 'Fresh Ginger',
      productId: 31,
      img: null,
      color: '#B45309',
      bgColor: '#FFFBEB',
      icon: '🫚',
      origin: '🌍 Origin: Southeast Asia · Widely grown in Uganda',
      fact: 'Ginger has been used medicinally for over 5,000 years. The active compound — gingerol — is one of the most powerful anti-inflammatory substances known to science. Ugandan ginger is prized across East Africa for its high oil content and intense flavour.',
      benefits: ['Reduces nausea, morning sickness and motion sickness', 'Powerful anti-inflammatory — helps joint pain', 'Lowers blood sugar and improves heart disease risk factors', 'Fights infections — antibacterial properties'],
      tip: '🌟 Pro Tip: Boil fresh ginger slices with lemon and honey for Uganda\'s best cold remedy. Drink it hot before bed.',
      tag: '5,000 years of healing'
    },
    {
      title: 'Mangoes: The King of Fruits',
      food: 'Mangoes (Emiyembe)',
      productId: 2,
      img: 'images/mango.jpg',
      color: '#D97706',
      bgColor: '#FFFBEB',
      icon: '🥭',
      origin: '🌍 Origin: India · Grown in Luwero, Uganda',
      fact: 'Mangoes have been cultivated for over 4,000 years and are the most consumed fruit in the world by weight. India alone produces 40% of the world\'s mangoes. Ugandan mangoes from Luwero and Kiryandongo are naturally sweet because of the fertile volcanic soils.',
      benefits: ['Very high in Vitamin A — essential for eye health', 'Contains 20+ vitamins and minerals in one fruit', 'High in folate — critical for pregnancy', 'Quercetin and beta-carotene protect against cancer'],
      tip: '🌟 Pro Tip: Eating mango with milk makes a complete protein meal in many cultures. The skin is also edible and packed with antioxidants.',
      tag: 'The most eaten fruit on Earth'
    },
    {
      title: 'Pawpaw Heals Wounds Faster',
      food: 'Pawpaw (Papaya)',
      productId: 4,
      img: 'images/papaya.jpg',
      color: '#E8621A',
      bgColor: '#FFF5F0',
      icon: '🍐',
      origin: '🌍 Origin: Southern Mexico · Widely grown in Uganda',
      fact: 'Pawpaw (papaya) contains Papain — an enzyme so powerful it is used in meat tenderisers, wound healing creams and even laundry detergents. Traditional medicine across Uganda and Kenya has used green pawpaw leaves to treat malaria, stomach ulcers and skin conditions.',
      benefits: ['Papain enzyme fights intestinal parasites', 'Rich in Vitamin C — one medium papaya gives 224% daily value', 'Choline in papaya supports brain health and memory', 'Fermented papaya extract studied for anti-cancer properties'],
      tip: '🌟 Pro Tip: Unripe (green) papaya is excellent in salads and traditionally used to induce labour. Ripe papaya is one of the most digestible fruits.',
      tag: 'Nature\'s wound healer'
    },
    {
      title: 'Groundnuts Are Not Nuts!',
      food: 'Groundnut Paste (Ebinyebwa)',
      productId: 45,
      img: null,
      color: '#92400E',
      bgColor: '#FFF8F0',
      icon: '🥜',
      origin: '🌍 Origin: South America · A staple across Uganda',
      fact: 'Groundnuts (peanuts) are not actually nuts — they are legumes, in the same family as beans and lentils. Unlike tree nuts, groundnuts grow underground in pods. Uganda is the 9th largest groundnut producer in the world. Ebinyebwa (groundnut paste) is the soul of Ugandan cuisine.',
      benefits: ['High in protein — 25g of protein per 100g', 'Rich in niacin — supports brain function', 'Contains resveratrol — same antioxidant as red wine', 'Excellent source of healthy monounsaturated fats'],
      tip: '🌟 Pro Tip: Freshly ground ebinyebwa has far more nutrients than commercial peanut butter. Add a spoon to your morning porridge for a protein boost.',
      tag: 'A legume masquerading as a nut'
    },
    {
      title: 'Honey Never Expires',
      food: 'Raw Honey',
      productId: 34,
      img: null,
      color: '#D97706',
      bgColor: '#FFFBEB',
      icon: '🍯',
      origin: '🌍 Origin: Ancient Egypt · Mubende, Uganda bees',
      fact: 'Archaeologists found 3,000-year-old honey in Egyptian tombs — still perfectly edible. Honey is the only food that never spoils because its low moisture, high sugar content, and slightly acidic pH create a completely inhospitable environment for bacteria. Ugandan raw honey from Mubende forests is some of the purest in East Africa.',
      benefits: ['Natural antibacterial — can heal wounds and burns', 'Soothes sore throats and coughs (clinically proven)', 'Contains antioxidants that protect against cell damage', 'Boosts athletic performance as a natural energy source'],
      tip: '🌟 Pro Tip: Never give honey to babies under 1 year old. For adults, a spoonful of raw honey before bed improves sleep quality.',
      tag: 'The only food that never expires'
    },
    {
      title: 'Eggs Are Liquid Meat',
      food: 'Free-Range Eggs',
      productId: 35,
      img: 'images/eggs.jpg',
      color: '#D97706',
      bgColor: '#FFFBEB',
      icon: '🥚',
      origin: '🌍 Domesticated 8,000 years ago in Southeast Asia',
      fact: 'A single egg contains all 9 essential amino acids — making it the gold standard of protein quality. Nutritionists call eggs the most nutritionally complete food on earth. The yolk colour depends on the hen\'s diet — Ugandan free-range hens eating green plants and insects produce deep orange yolks with up to 5x more omega-3.',
      benefits: ['Complete protein with all essential amino acids', 'Rich in choline — critical for brain development', 'Lutein and zeaxanthin protect eyesight from aging', 'One egg has 77 calories but keeps you full for hours'],
      tip: '🌟 Pro Tip: The colour of the shell (white or brown) has zero effect on nutritional value — it only reflects the breed of hen. Free-range orange yolks = more nutrients.',
      tag: 'Nature\'s most complete food'
    },
    {
      title: 'Onions Are 89% Water',
      food: 'Onions (Red)',
      productId: 11,
      img: null,
      color: '#9D174D',
      bgColor: '#FDF2F8',
      icon: '🧅',
      origin: '🌍 Origin: Central Asia · Grown across Uganda',
      fact: 'Despite tasting so intense, onions are 89% water. The burning sensation in your eyes when you cut an onion is caused by syn-propanethial-S-oxide gas reacting with the water in your eyes to form sulphuric acid — your eyes then produce tears to dilute and wash it away.',
      benefits: ['Quercetin in onions is one of the most powerful antioxidants known', 'Naturally antibacterial — fights H. pylori stomach bacteria', 'Reduces bad cholesterol and blood pressure', 'Prebiotic fibres (inulin) feed healthy gut bacteria'],
      tip: '🌟 Pro Tip: Chill your onion in the fridge before cutting to reduce eye irritation by 60%. Red onions have twice the antioxidants of white onions.',
      tag: '89% water, 100% flavour'
    },
    {
      title: 'Carrots Were Originally Purple',
      food: 'Carrots',
      productId: 13,
      img: null,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      icon: '🥕',
      origin: '🌍 Origin: Afghanistan · Now popular across Uganda',
      fact: 'Wild carrots were purple or white — never orange. The familiar orange carrot was developed by Dutch farmers in the 17th century, reportedly to honour William of Orange. Orange colour comes from beta-carotene, which the body converts to Vitamin A. One medium carrot provides 210% of your daily Vitamin A requirement.',
      benefits: ['Beta-carotene converts to Vitamin A — critical for night vision', 'Reduces risk of heart disease and certain cancers', 'High in fibre — promotes digestive health', 'Falcarinol compound has demonstrated anti-cancer properties'],
      tip: '🌟 Pro Tip: Cooking carrots actually increases the availability of beta-carotene. Add a little fat (oil or butter) — beta-carotene is fat-soluble and absorbs much better.',
      tag: 'Originally purple, not orange'
    },
    {
      title: 'Cabbage Has More Vitamin C Than Orange',
      food: 'Cabbage',
      productId: 12,
      img: null,
      color: '#2D6A30',
      bgColor: '#F0FDF4',
      icon: '🥦',
      origin: '🌍 Origin: Mediterranean Europe · Grown widely in Uganda',
      fact: 'Raw cabbage has about 36mg of Vitamin C per 100g — more than an orange (53mg per 100g is close, but cabbage is cheaper and available year-round). Fermented cabbage (sauerkraut) has 200x more probiotics than most yogurts. Cabbage has been eaten by humans for at least 4,000 years.',
      benefits: ['Glucosinolates — compounds that actively fight cancer cells', 'Vitamin K reduces risk of bone fractures by 30%', 'Rich in gut-healing glutamine', 'Anti-inflammatory — reduces arthritis symptoms'],
      tip: '🌟 Pro Tip: The outer dark green leaves you often throw away actually have the highest concentration of nutrients. Try adding them to soups.',
      tag: 'Cheap, nutritious and overlooked'
    },
    {
      title: 'Sweet Potatoes Beat Irish Potatoes',
      food: 'Sweet Potatoes',
      productId: 22,
      img: null,
      color: '#EA580C',
      bgColor: '#FFF5F0',
      icon: '🍠',
      origin: '🌍 Origin: Peru · A major Ugandan staple crop',
      fact: 'Sweet potatoes are nutritionally far superior to regular (Irish) potatoes. They have a lower glycaemic index despite tasting sweeter, and contain dramatically more Vitamin A, Vitamin C, and antioxidants. Uganda is the second largest producer of sweet potatoes in Africa after Ethiopia.',
      benefits: ['One medium sweet potato has 400% of daily Vitamin A', 'Lower glycaemic index than regular potatoes — better for diabetics', 'Anthocyanins in purple-fleshed varieties fight cancer', 'High in potassium — reduces blood pressure naturally'],
      tip: '🌟 Pro Tip: Eating sweet potatoes with a source of fat (groundnut sauce, oil) dramatically increases Vitamin A absorption — it\'s fat-soluble.',
      tag: 'Uganda\'s nutritional powerhouse'
    },
    {
      title: 'Simsim (Sesame): Oldest Oilseed',
      food: 'Simsim (Sesame Seeds)',
      productId: 36,
      img: null,
      color: '#92400E',
      bgColor: '#FFF8F0',
      icon: '🌰',
      origin: '🌍 Origin: Africa · Northern Uganda is a major producer',
      fact: 'Sesame is the oldest oilseed crop known to humanity — over 5,500 years old. The phrase "Open Sesame!" from Ali Baba comes from the sesame pod bursting open when ripe. Uganda\'s northern region (Lira, Gulu) produces sesame of exceptional quality exported globally.',
      benefits: ['Highest sesamin content of any food — powerful antioxidant', 'Rich in calcium — more per gram than most dairy products', 'Zinc boosts immune function and testosterone', 'Lignans in sesame lower cholesterol significantly'],
      tip: '🌟 Pro Tip: Toasting sesame seeds for 2 minutes in a dry pan releases their oils and dramatically increases flavour and aroma. Sprinkle on salads and stews.',
      tag: 'Humanity\'s oldest cultivated oilseed'
    },
    {
      title: 'Watermelon Is 92% Water',
      food: 'Watermelon',
      productId: 5,
      img: null,
      color: '#BE123C',
      bgColor: '#FFF0F3',
      icon: '🍉',
      origin: '🌍 Origin: West Africa · Grown across Uganda',
      fact: 'Watermelon originated in the Kalahari Desert of Africa — one of the driest places on earth. Its 92% water content made it a crucial survival food. The rind is also edible and contains citrulline — an amino acid that relaxes blood vessels (similar to Viagra, but natural!).',
      benefits: ['Lycopene content is higher than tomatoes after ripening', 'Citrulline reduces muscle soreness after exercise', 'Keeps you hydrated — excellent on hot Kampala days', 'Almost no calories — excellent for weight loss'],
      tip: '🌟 Pro Tip: The redder the flesh, the higher the lycopene. Tap a watermelon — a deep hollow sound means it\'s ripe. A flat sound means underripe.',
      tag: 'Born in the desert, 92% water'
    },
    {
      title: 'Cassava Feeds 800 Million People',
      food: 'Cassava',
      productId: 23,
      img: null,
      color: '#92400E',
      bgColor: '#FFF8F0',
      icon: '🌽',
      origin: '🌍 Origin: Brazil · One of Uganda\'s most important crops',
      fact: 'Cassava is the third largest source of carbohydrates in the world after wheat and rice, feeding over 800 million people globally. It is the ultimate survival crop — drought resistant, pest resistant, and can stay in the ground for up to 3 years after maturity. Raw cassava contains cyanogenic compounds — cooking is essential.',
      benefits: ['Resistant starch feeds beneficial gut bacteria', 'Naturally gluten-free — safe for coeliac disease', 'Very high energy density — good for active people', 'Cassava leaves are rich in protein and iron'],
      tip: '🌟 Pro Tip: Never eat cassava raw — always cook thoroughly to neutralise the natural cyanogenic compounds. Boiling, roasting or fermenting makes it completely safe.',
      tag: 'Feeds 800 million people daily'
    },
    {
      title: 'Lemons Are a Hybrid Fruit',
      food: 'Lemons',
      productId: 7,
      img: null,
      color: '#D97706',
      bgColor: '#FFFBEB',
      icon: '🍋',
      origin: '🌍 Origin: Northeast India · Grown across Uganda',
      fact: 'Lemons do not exist in the wild — they are a hybrid of bitter orange and citron, created by humans. The seeds contain more Vitamin C than the juice. Sailors in the 1700s were given lemons to prevent scurvy (Vitamin C deficiency) — this is where the British nickname "Limeys" comes from.',
      benefits: ['Citric acid prevents kidney stones from forming', 'Vitamin C dramatically boosts iron absorption from food', 'D-Limonene in the peel is a powerful cancer-fighting compound', 'Alkalises the body despite tasting acidic'],
      tip: '🌟 Pro Tip: Squeeze lemon on spinach, beans or iron-rich foods — Vitamin C increases iron absorption by up to 300%. This simple habit fights anaemia.',
      tag: 'A fruit humans invented'
    },
    {
      title: 'Spinach (Bbugga): Popeye Was Right',
      food: 'Spinach (Bbugga)',
      productId: 17,
      img: 'images/vegetables.jpg',
      color: '#2D6A30',
      bgColor: '#F0FDF4',
      icon: '🥬',
      origin: '🌍 Origin: Ancient Persia · Grown widely in Uganda',
      fact: 'Popeye\'s spinach obsession was based on a printing error — a decimal point was misplaced in 1870s data, making spinach appear to have 10x more iron than it actually does. The error was only discovered in the 1930s. However, spinach genuinely IS remarkably nutritious — just not as iron-rich as claimed.',
      benefits: ['Extremely high in Vitamin K — essential for blood clotting', 'Lutein and zeaxanthin protect eyesight from macular degeneration', 'Nitrates in spinach lower blood pressure naturally', 'High folate content prevents neural tube defects in pregnancy'],
      tip: '🌟 Pro Tip: Cooking spinach reduces its oxalic acid content, making the iron and calcium much more bioavailable. Boil briefly, drain, and add to stews.',
      tag: 'Nutritious — despite the myth'
    },
    {
      title: 'Matooke: Uganda\'s National Fruit',
      food: 'Matooke',
      productId: 21,
      img: null,
      color: '#2D6A30',
      bgColor: '#F0FDF4',
      icon: '🍌',
      origin: '🌍 Origin: East Africa · Central to Ugandan culture',
      fact: 'Matooke (East African Highland Banana) is not a sweet banana — it\'s a cooking banana and Uganda\'s most important staple food. Uganda produces about 9.5 million tonnes of matoke per year — more than any other country. The banana is steamed in its own leaves, which impart a distinctive green, earthy flavour.',
      benefits: ['High in resistant starch — feeds healthy gut bacteria', 'Rich in potassium — protects heart and muscles', 'Contains serotonin — the "happiness" neurotransmitter', 'Low glycaemic index — good for diabetic patients'],
      tip: '🌟 Pro Tip: Green matooke has more resistant starch (great for gut health). As it ripens, the starch converts to sugars. Cook while still very green for maximum health benefits.',
      tag: 'Uganda\'s most important staple'
    },
    {
      title: 'Pumpkin Seeds Are Tiny Superfoods',
      food: 'Pumpkin',
      productId: 16,
      img: 'images/pumpkin.jpg',
      color: '#EA580C',
      bgColor: '#FFF5F0',
      icon: '🎃',
      origin: '🌍 Origin: North America · Grown across Uganda',
      fact: 'The seeds of pumpkins (often thrown away in Uganda) are among the most nutritious foods on earth. They are extremely high in zinc, magnesium, and tryptophan. The flesh is 92% water and one of the few orange vegetables — its colour comes entirely from beta-carotene.',
      benefits: ['Beta-carotene converts to Vitamin A for night vision and immune function', 'Pumpkin seeds have more zinc than any other plant food', 'Cucurbitacin compounds in pumpkin kill intestinal parasites', 'Very low in calories — excellent for weight management'],
      tip: '🌟 Pro Tip: Don\'t throw away pumpkin seeds! Rinse, dry and roast with a pinch of salt for 20 minutes at 180°C. A nutritional powerhouse snack.',
      tag: 'The seeds are the real treasure'
    },
    {
      title: 'Eggplant Contains Nicotine',
      food: 'Eggplant (Bilinganya)',
      productId: 15,
      img: 'images/eggplant.jpg',
      color: '#6B21A8',
      bgColor: '#FAF5FF',
      icon: '🍆',
      origin: '🌍 Origin: India · Popular across Uganda',
      fact: 'Eggplant (brinjal) contains a tiny amount of nicotine — about 100g of eggplant has the same nicotine as a person exposed to secondhand smoke for 3 hours. This is completely harmless. Eggplant is in the nightshade family along with tomatoes, peppers, and potatoes.',
      benefits: ['Nasunin in the purple skin is a potent brain-protecting antioxidant', 'Chlorogenic acid lowers bad cholesterol significantly', 'Very high in fibre — reduces constipation', 'Low calorie, high volume — excellent for weight loss'],
      tip: '🌟 Pro Tip: Charring eggplant over an open flame (as done to make bilungo) completely transforms its flavour to a deep, smoky complexity unavailable any other way.',
      tag: 'Contains harmless nicotine'
    },
    {
      title: 'Cauliflower Is a Mutant Flower',
      food: 'Cauliflower',
      productId: 20,
      img: 'images/cauliflower.jpg',
      color: '#6B7280',
      bgColor: '#F9FAFB',
      icon: '🥦',
      origin: '🌍 Origin: Cyprus (Mediterranean) · Now grown in Uganda',
      fact: 'Cauliflower is a flower — specifically a mutated flower that never opens. The white "head" is called the curd, which is a mass of undeveloped flower buds. The white colour is caused by the large leaves surrounding the curd blocking sunlight during growth (a process called blanching).',
      benefits: ['Sulforaphane — one of the most powerful known cancer preventives', 'High in choline — critical for brain development and memory', 'Excellent low-carb rice and flour substitute', 'Rich in Vitamin K for bone health'],
      tip: '🌟 Pro Tip: Grating raw cauliflower produces "cauli-rice" — a low-carb alternative with the same texture as rice when lightly steamed. Excellent for diabetics.',
      tag: 'A flower that never opened'
    },
    {
      title: 'Beans Are a Complete Plant Protein',
      food: 'Beans',
      productId: 29,
      img: null,
      color: '#92400E',
      bgColor: '#FFF8F0',
      icon: '🫘',
      origin: '🌍 Origin: Central America · Uganda\'s most eaten legume',
      fact: 'When you combine beans with maize (posho/ugali) — exactly as most Ugandans eat daily — you get a complete protein containing all 9 essential amino acids. This is why traditional Ugandan meals of beans and posho have sustained generations without meat. Beans also have a remarkable ability to fix nitrogen into soil, making the land more fertile after each harvest.',
      benefits: ['Highest plant source of folate — critical during pregnancy', 'Soluble fibre dramatically lowers cholesterol', 'Resistant starch feeds beneficial gut bacteria', 'Low glycaemic index — ideal for diabetics and weight management'],
      tip: '🌟 Pro Tip: Soak dried beans for 8+ hours and discard the soaking water before cooking. This removes 80% of the gas-causing oligosaccharides.',
      tag: 'Beans + posho = complete protein'
    },
    {
      title: 'Hot Chilli Releases Endorphins',
      food: 'Hot Peppers (Chilli)',
      productId: 32,
      img: null,
      color: '#DC2626',
      bgColor: '#FFF0F0',
      icon: '🌶️',
      origin: '🌍 Origin: Mexico · Grown across Uganda',
      fact: 'Eating hot chilli creates a genuine pain signal in your brain — and in response, your brain releases endorphins (the same chemicals as a "runner\'s high"). This is why eating spicy food can cause euphoria. Capsaicin (the active compound) also boosts metabolism by up to 8% for 30 minutes after eating.',
      benefits: ['Capsaicin boosts metabolism and helps burn fat', 'Powerful pain-relief properties — used in arthritis creams', 'Reduces blood clotting — natural heart attack prevention', 'Vitamin C content is higher than oranges by weight'],
      tip: '🌟 Pro Tip: Milk (not water) stops chilli burn — capsaicin is fat-soluble and the casein protein in milk literally washes it away. Cold water only spreads it.',
      tag: 'Pain that causes euphoria'
    },
    {
      title: 'Rice Feeds Half of Humanity',
      food: 'Super Rice (Uganda)',
      productId: 30,
      img: null,
      color: '#1E3A5F',
      bgColor: '#EFF6FF',
      icon: '🍚',
      origin: '🌍 Origin: China (9,000 years ago) · Grown in Uganda (Butaleja)',
      fact: 'Rice has been cultivated for 9,000 years and feeds more than half of humanity daily. There are over 40,000 varieties of rice. In Uganda, rice is grown primarily in the fertile plains of Butaleja and the shores of Lake Victoria. The phrase "have you eaten?" in many Asian languages literally means "have you eaten rice?"',
      benefits: ['Easily digestible — gentle on the stomach', 'Gluten-free — safe for people with coeliac disease', 'Provides sustained energy release', 'Brown/unpolished rice contains significantly more fibre and nutrients'],
      tip: '🌟 Pro Tip: Rinse rice thoroughly before cooking to remove surface starch — this gives you fluffy, non-sticky grains. Use a 1:1.5 ratio (rice to water) for perfect results.',
      tag: 'Feeds half the world since 7,000 BC'
    },
    {
      title: 'Sugarcane: The World\'s Largest Crop',
      food: 'Sugarcane',
      productId: 33,
      img: null,
      color: '#15803D',
      bgColor: '#F0FDF4',
      icon: '🎋',
      origin: '🌍 Origin: Papua New Guinea · Grown in Busoga, Uganda',
      fact: 'Sugarcane is the largest agricultural crop on Earth by weight — producing nearly 2 billion tonnes per year. Despite being 75% water, the raw cane juice (before processing) contains vitamins, minerals and antioxidants completely absent in refined white sugar. The Busoga sub-region of Uganda is famous for the sweetest sugarcane in East Africa.',
      benefits: ['Raw cane juice contains calcium, iron, magnesium and potassium', 'Glycolic acid in cane juice used in skincare products', 'Boosts kidney function and reduces kidney stones', 'Alkaline — raises pH despite its sweetness'],
      tip: '🌟 Pro Tip: Chewing raw sugarcane (instead of drinking refined juice) provides fibre that slows sugar absorption dramatically, making it much better for blood sugar.',
      tag: 'The world\'s heaviest harvested crop'
    }
  ],

  // Index to start with based on day of year (so it changes daily)
  getDailyIndex: function() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % DYK.facts.length;
  }
};

// ─── WIDGET CONTROL ──────────────────────────────────────────
function toggleDYK() {
  DYK.open = !DYK.open;
  var card = document.getElementById('dyk-card');
  var tab  = document.getElementById('dyk-tab');
  if (!card) return;
  card.classList.toggle('open', DYK.open);
  if (tab) tab.classList.toggle('active', DYK.open);
  if (DYK.open) {
    renderDYKFact(DYK.current);
    startDYKRotate();
  } else {
    stopDYKRotate();
  }
}

function dykNext() {
  DYK.current = (DYK.current + 1) % DYK.facts.length;
  renderDYKFact(DYK.current);
  resetDYKRotate();
}

function dykPrev() {
  DYK.current = (DYK.current - 1 + DYK.facts.length) % DYK.facts.length;
  renderDYKFact(DYK.current);
  resetDYKRotate();
}

function dykGoTo(idx) {
  DYK.current = idx;
  renderDYKFact(DYK.current);
  resetDYKRotate();
}

function startDYKRotate() {
  DYK.rotateTimer = setInterval(function() { dykNext(); }, 30000); // rotate every 30s
}
function stopDYKRotate()  { clearInterval(DYK.rotateTimer); DYK.rotateTimer = null; }
function resetDYKRotate() { stopDYKRotate(); startDYKRotate(); }

// ─── RENDER A FACT ───────────────────────────────────────────
function renderDYKFact(idx) {
  var f   = DYK.facts[idx];
  var body = document.getElementById('dyk-body');
  if (!body || !f) return;

  // Update date display
  var dateEl = document.getElementById('dyk-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' });
  }

  // Find product in catalogue for the Add to Cart link
  var product = KF && KF.data ? KF.data.products.find(function(p){ return p.id === f.productId; }) : null;
  var cartBtn = '';
  if (product && product.stock > 0) {
    cartBtn =
      '<div class="dyk-cart-row">' +
        '<div class="dyk-product-info">' +
          (product.img ? '<img src="'+product.img+'" class="dyk-prod-img" alt="'+product.name+'">' : '<div class="dyk-prod-img dyk-prod-placeholder">'+f.icon+'</div>') +
          '<div><div class="dyk-prod-name">'+product.name+'</div>' +
          '<div class="dyk-prod-price">UGX '+product.price.toLocaleString()+' / '+product.unit+'</div></div>' +
        '</div>' +
        '<button class="dyk-add-btn" onclick="dykAddToCart('+product.id+')">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
          'Add to Cart' +
        '</button>' +
      '</div>';
  } else if (product && product.stock === 0) {
    cartBtn = '<div class="dyk-out-stock">Currently out of stock — check back soon</div>';
  }

  // Render benefits list
  var benefits = (f.benefits || []).map(function(b) {
    return '<li>'+b+'</li>';
  }).join('');

  body.innerHTML =
    '<div class="dyk-fact-inner" style="--dyk-color:'+f.color+';--dyk-bg:'+f.bgColor+'">' +
      '<div class="dyk-food-header" style="background:'+f.bgColor+';border-color:'+f.color+'20">' +
        '<div class="dyk-food-icon-wrap" style="background:'+f.color+'18;border-color:'+f.color+'30">' +
          (f.img ? '<img src="'+f.img+'" class="dyk-food-img" alt="'+f.food+'" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'block\'">' : '') +
          '<div class="dyk-food-emoji" style="'+(f.img?'display:none':'')+'">'+f.icon+'</div>' +
        '</div>' +
        '<div class="dyk-food-meta">' +
          '<div class="dyk-food-tag" style="background:'+f.color+';color:#fff">'+f.tag+'</div>' +
          '<h4 class="dyk-fact-title">'+f.title+'</h4>' +
          '<div class="dyk-origin">'+f.origin+'</div>' +
        '</div>' +
      '</div>' +
      '<div class="dyk-fact-text">'+f.fact+'</div>' +
      '<div class="dyk-benefits"><div class="dyk-ben-title">Health Benefits</div><ul>'+benefits+'</ul></div>' +
      '<div class="dyk-tip">'+f.tip+'</div>' +
      cartBtn +
    '</div>';

  // Update dots
  var dotsEl = document.getElementById('dyk-dots');
  if (dotsEl) {
    dotsEl.innerHTML = DYK.facts.map(function(f, i) {
      return '<button class="dyk-dot'+(i===idx?' active':'')+'" onclick="dykGoTo('+i+')" title="Fact '+(i+1)+'"></button>';
    }).join('');
  }
}

// ─── ADD TO CART FROM DYK ────────────────────────────────────
function dykAddToCart(pid) {
  if (typeof addToCart === 'function') {
    addToCart(pid);
    // Show visual feedback on the button
    var btn = document.querySelector('.dyk-add-btn');
    if (btn) {
      var orig = btn.innerHTML;
      btn.innerHTML = '✓ Added!';
      btn.style.background = 'var(--g3)';
      btn.style.transform = 'scale(0.97)';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.transform = '';
      }, 1500);
    }
  }
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Start on today's fact
  DYK.current = DYK.getDailyIndex();

  // Pulse the tab after 3 seconds to attract attention
  setTimeout(function() {
    var tab = document.getElementById('dyk-tab');
    if (tab) {
      tab.classList.add('pulse');
      setTimeout(function() { tab.classList.remove('pulse'); }, 3000);
    }
  }, 3000);

  // Pulse again every 2 minutes
  setInterval(function() {
    if (!DYK.open) {
      var tab = document.getElementById('dyk-tab');
      if (tab) {
        tab.classList.add('pulse');
        setTimeout(function() { tab.classList.remove('pulse'); }, 2500);
      }
    }
  }, 120000);
});
