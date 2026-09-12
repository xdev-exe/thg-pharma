import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'pure-3',
    slug: 'pure-3-high-potency-omega-3',
    name_ar: 'Pure-3 — أوميجا 3 ألماني عالي النقاوة والتركيز',
    name_en: 'Pure-3 — German High-Potency Ultra-Pure Omega-3',
    category: 'omega3',
    tags: ['all', 'omega3', 'vitamins'],
    tagline_ar: 'نقاء دوائي مطلق بدون رائحة أو طعم سمك نهائياً — 600 مجم أوميجا 3 يومياً',
    tagline_en: 'Absolute pharmaceutical purity with zero fishy aftertaste — 600 mg Omega-3 daily',
    badge_ar: 'الأكثر مبيعاً 🇩🇪',
    badge_en: 'Bestseller 🇩🇪',
    price: 2000,
    currency: 'EGP',
    inStock: true,
    packSize_ar: '60 كبسولة جيلاتينية',
    packSize_en: '60 softgel capsules',
    supplyDays: 30,
    servingBasis_ar: 'لكل جرعة يومية (كبسولتين)',
    servingBasis_en: 'Per daily dose (2 capsules)',
    shortDesc_ar: 'أوميجا 3 بحري عالي النقاء بتقنية التقطير الجزيئي الألماني الفائق. يمنحك 600 مجم أحماض دهنية أوميجا 3 (360 مجم EPA و 240 مجم DHA) مع فيتامين E وحمض الفوليك و B6 و B12 بدون أدنى رائحة أو طعم سمك مزعج.',
    shortDesc_en: 'German molecularly distilled marine Omega-3 of ultra-high purity. Delivers 600 mg pure Omega-3 fatty acids (360 mg EPA and 240 mg DHA) with Vitamin E, Folic Acid, B6 and B12 with absolutely zero fishy regurgitation or odor.',
    longDesc_ar: 'الاسم "Pure-3" مش مجرد اسم تجاري، ده معيار تصنيعي ألماني صارم. أكبر مشكلة بيواجهها مستخدمو الأوميجا 3 في السوق هي رداءة زيت السمك، الرائحة المنفرة، والارتجاع المزعج. في Pure-3 يتم استخدام التقطير الجزيئي المتقدم في ألمانيا لتنقية زيت السمك البحري بالكامل من المعادن الثقيلة والشوائب والروائح، مع الحفاظ على أعلى تركيز حيوي فعال: 360 مجم EPA لصحة الأوعية الدموية و 240 مجم DHA لكفاءة التركيز والذاكرة، مدعومة بمضادات أكسدة وفيتامينات B لطاقة وحيوية مستمرة.',
    longDesc_en: 'The name "Pure-3" represents an uncompromising German purity standard. The single greatest reason people stop taking Omega-3 is low-grade fish oil with unpleasant fishy burps and odor. Pure-3 undergoes multi-stage advanced molecular distillation in Germany to remove all heavy metals, contaminants, and fishy odors while securing exceptional potency: 360 mg EPA and 240 mg DHA in exact declared amounts, fortified with Vitamin E and B-vitamins for cognitive performance and cardiovascular stamina.',
    benefits_ar: [
      'نقاء استثنائي 100% بدون أي طعم أو رائحة أو ارتجاع سمكي على الإطلاق',
      '600 مجم أوميجا 3 معلنة بالأرقام الدقيقة: 360 مجم EPA + 240 مجم DHA',
      'دعم وظائف المخ، الحدة الذهنية، والذاكرة لكافة الأعمار',
      'تعزيز مرونة الأوعية الدموية وصحة الجهاز الدوري',
      'مدعم بفيتامين E كمضاد أكسدة لحماية الزيوت الحيوية، مع B6 و B12 وحمض الفوليك',
      'تصنيع ألماني حصري خاضع لمعايير الـ GMP الصيدلانية الأوروبية'
    ],
    benefits_en: [
      '100% ultra-purified formulation with zero fishy aftertaste or reflux',
      'Exact declared potency: 600 mg Omega-3 (360 mg EPA + 240 mg DHA)',
      'Supports brain clarity, focus, and long-term neural health',
      'Promotes vascular flexibility and cardiovascular resilience',
      'Enriched with protective Vitamin E antioxidant, plus Folic Acid, B6, and B12',
      'Manufactured under stringent European pharmaceutical GMP protocols in Germany'
    ],
    nutrients: [
      { name_ar: 'زيت سمك بحري نقي فائق الجودة', name_en: 'Ultra-Pure Marine Fish Oil', amount: '2,000 mg' },
      { name_ar: 'أحماض أوميجا 3 الدهنية الإجمالية', name_en: 'Total Omega-3 Fatty Acids', amount: '600 mg' },
      { name_ar: 'حمض إيكوسابنتاينويك (EPA)', name_en: 'Eicosapentaenoic Acid (EPA)', amount: '360 mg' },
      { name_ar: 'حمض دوكوساهكساينويك (DHA)', name_en: 'Docosahexaenoic Acid (DHA)', amount: '240 mg' },
      { name_ar: 'فيتامين E (مضاد أكسدة طبيعي)', name_en: 'Vitamin E (Natural Antioxidant)', amount: '20 mg' },
      { name_ar: 'حمض الفوليك (Folic Acid)', name_en: 'Folic Acid', amount: '600 µg' },
      { name_ar: 'فيتامين B6', name_en: 'Vitamin B6', amount: '6 mg' },
      { name_ar: 'فيتامين B12', name_en: 'Vitamin B12', amount: '6 µg' },
    ],
    usage_ar: 'تناول كبسولتين يومياً مع وجبة رئيسية ومع كوب وافر من الماء. تُبلع الكبسولة كاملة دون مضغ.',
    usage_en: 'Take two capsules daily with a main meal and plenty of water. Swallow whole without chewing.',
    warnings_ar: [
      'يحتوي على مستخلصات سمك بحري عالية النقاء',
      'غلاف الكبسولة مصنوع من جيلاتين بقري صيدلاني معتمد',
      'يُحفظ في مكان بارد وجاف تحت 25 درجة مئوية بعيداً عن الرطوبة وأشعة الشمس'
    ],
    warnings_en: [
      'Contains purified marine fish extracts',
      'Capsule shell is pharmaceutical-grade certified bovine gelatine',
      'Store in a cool dry place below 25°C away from direct sunlight'
    ],
    origin_ar: 'ألمانيا 🇩🇪 — استيراد رسمي حصري بواسطة THG 4 Pharma',
    origin_en: 'Germany 🇩🇪 — Official Exclusive Import by THG 4 Pharma',
    storage_ar: 'يُحفظ في عبوته الأصلية في مكان جاف ومعتم بدرجة حرارة لا تتعدى 25° م.',
    storage_en: 'Store in original packaging in a dry, dark place below 25°C.',
    faqs: [
      {
        question_ar: 'هل Pure-3 يسبب أي ارتجاع أو رائحة سمك في الفم؟',
        question_en: 'Does Pure-3 cause any fishy burps or aftertaste?',
        answer_ar: 'نهائياً. يتميز Pure-3 بعملية التقطير الجزيئي الألمانية الفائقة التي تزيل تماماً أي مركبات مسؤولة عن الرائحة أو الطعم غير المستحب، مما يجعله مريحاً جداً للمعدة.',
        answer_en: 'Not at all. Pure-3 uses advanced German molecular distillation that completely extracts any odor-causing compounds, ensuring complete stomach comfort and zero fishy reflux.'
      },
      {
        question_ar: 'كم كبسولة في العبوة ولمدة كم تكفي؟',
        question_en: 'How many capsules per box and how long does it last?',
        answer_ar: 'تحتوي العبوة على 60 كبسولة. مع الالتزام بالجرعة اليومية (كبسولتين يومياً)، تكفي العبوة 30 يوماً كاملاً.',
        answer_en: 'The box contains 60 capsules. At the recommended dose of two capsules per day, it is a full 30-day supply.'
      },
      {
        question_ar: 'ما الذي يميز هذا المنتج عن أنواع الأوميجا 3 الأخرى في الصيدليات؟',
        question_en: 'What sets this apart from common omega-3 supplements in pharmacies?',
        answer_ar: 'الكثير من المكملات تكتب "زيت سمك 1000 مجم" بدون توضيح كمية الـ EPA والـ DHA الفعلية. هنا كل رقم معلن بدقة صيدلانية (360 مجم EPA و 240 مجم DHA)، بالإضافة لنقاوة ألمانية خالية من الشوائب والمعادن الثقيلة.',
        answer_en: 'Many products merely label "fish oil 1000mg" without disclosing actual EPA/DHA contents. Here every milligram is declared with pharmaceutical precision, backed by genuine German purity.'
      }
    ],
    accentColor: '#00438E',
    icon: 'Fish',
    image: '/images/products/pure-3.webp',
    imageThumb: '/images/products/pure-3-thumb.webp',
    searchAliases: [
      'doppelherz', 'doppel herz', 'doppelherz aktiv', 'pure-3', 'pure 3', 'doppelherz pure 3',
      'دوبل هيرتز', 'دبل هيرتز', 'دوبلهيرتز', 'دوبل هيرتز بيور 3', 'بيور 3', 'اوميجا 3 دوبل هيرتز',
      'زيت سمك الماني', 'queisser pharma', 'omega 3 doppelherz', 'epa dha'
    ],
    isHero: true
  },
  {
    id: 'collagen-1000',
    slug: 'collagen-1000-q10-biotin-complex',
    name_ar: 'Collagen 1000 — كولاجين هيدروليزات مع كوانزيم Q10 وبيوتين',
    name_en: 'Collagen 1000 — Hydrolysed Collagen with CoQ10 & Biotin',
    category: 'beauty',
    tags: ['all', 'beauty'],
    tagline_ar: '1000 مجم كولاجين متحلل مضاف إليه إنزيم الطاقة Q10 والبيوتين في قرص واحد يومياً',
    tagline_en: '1,000 mg hydrolysed collagen boosted with cellular energizer CoQ10 and Biotin in one daily tablet',
    badge_ar: 'تركيبة Q10 الحصرية ✨',
    badge_en: 'Exclusive CoQ10 Formula ✨',
    price: 2000,
    currency: 'EGP',
    inStock: true,
    packSize_ar: '30 قرص مغلف',
    packSize_en: '30 coated tablets',
    supplyDays: 30,
    servingBasis_ar: 'لكل قرص يومي',
    servingBasis_en: 'Per daily tablet',
    shortDesc_ar: 'تركيبة ألمانية متطورة تدعم شباب البشرة ومرونة الأنسجة. تجمع بين 1000 مجم كولاجين هيدروليزات سريع الامتصاص، مع كوانزيم CoQ10 لمقاومة الأكسدة وتجديد طاقة الخلايا، وبيوتين بتركيز مكثف 500 ميكروجرام، وفيتامين C والنحاس والمنجنيز.',
    shortDesc_en: 'Advanced German formulation supporting dermal firmness and tissue elasticity. Combines 1,000 mg bio-available hydrolysed collagen, cellular CoQ10 for antioxidant cellular rejuvenation, high-potency Biotin 500 µg, plus Vitamin C, Copper, and Manganese.',
    longDesc_ar: 'الكولاجين وحده لا يكفي إذا كانت الخلايا تفتقر إلى الطاقة الحيوية للتجدد. تم تطوير Collagen 1000 بإضافة مكوّن كوانزيم Q10 (Coenzyme Q10) الحيوي مباشرة بعد جرعة البيوتين المكثفة (500 ميكروجرام). إنزيم Q10 يعمل داخل ميتوكوندريا خلايا الجلد كمحفز للطاقة ومضاد أكسدة استثنائي يحمي ألياف الكولاجين الجديدة من التكسر المبكر. ومع وجود فيتامين C الذي يحفز الجسم على بناء كولاجينه الطبيعي، تحصلين على تجدد عميق للمرونة والنضارة بقرص واحد يومياً.',
    longDesc_en: 'Collagen alone cannot achieve peak cellular vitality if tissue cells lack bio-energy. Collagen 1000 is specially formulated with Coenzyme Q10 alongside a potent 500 µg dose of Biotin. CoQ10 powers mitochondrial cellular renewal while serving as a formidable shield against oxidative collagen degradation. Coupled with Vitamin C which is biochemically essential for endogenous collagen synthesis, this one-a-day tablet works at the structural foundation of radiant, firm skin.',
    benefits_ar: [
      '1,000 مجم كولاجين هيدروليزات عالي التوافر الحيوي وسريع الامتصاص في كل قرص',
      'مدعم بإنزيم كوانزيم Q10 الحيوي لحماية الخلايا ومكافحة علامات التقدم بالسن',
      '500 ميكروجرام بيوتين عالي التركيز لنضارة البشرة ودعم حيوية الشعر',
      'فيتامين C بجرعة مدروسة لتنشيط تكوين الكولاجين الذاتي في الجسم',
      'عنصرا النحاس والمنجنيز لحماية النسيج الضام من التلف التأكسدي',
      'قرص واحد فقط يومياً لسهولة الالتزام التام'
    ],
    benefits_en: [
      '1,000 mg pure hydrolysed collagen peptides per single convenient tablet',
      'Fortified with Coenzyme Q10 to energize skin cells and combat environmental oxidative aging',
      '500 µg high-dose Biotin for optimal dermal tone and keratin support',
      'Vitamin C precisely measured to activate natural collagen synthesis pathways',
      'Copper and Manganese to maintain healthy connective tissue matrices',
      'One tablet a day — effortless consistency for visible results'
    ],
    nutrients: [
      { name_ar: 'كولاجين هيدروليزات نقي (Collagen Hydrolysate)', name_en: 'Pure Hydrolysed Collagen', amount: '1,000 mg' },
      { name_ar: 'بيوتين (فيتامين B7)', name_en: 'Biotin (Vitamin B7)', amount: '500 µg' },
      { name_ar: 'كوانزيم كيو 10 (Coenzyme Q10)', name_en: 'Coenzyme Q10', amount: '10 mg' },
      { name_ar: 'فيتامين C (حمض الأسكوربيك)', name_en: 'Vitamin C', amount: '40 mg' },
      { name_ar: 'نحاس (Copper)', name_en: 'Copper', amount: '0.3 mg' },
      { name_ar: 'منجنيز (Manganese)', name_en: 'Manganese', amount: '0.5 mg' },
    ],
    usage_ar: 'قرص واحد يومياً مع وجبة الطعام ومع كمية وفيرة من الماء. يُفضل تناوله في وقت ثابت يومياً.',
    usage_en: 'One tablet daily with food and plenty of water. Best taken at a consistent time every day.',
    warnings_ar: [
      'الكولاجين من مصدر حيواني نقي معتمد',
      'يُحفظ بعيداً عن متناول الأطفال',
      'يُحفظ في مكان جاف في درجة حرارة أقل من 25° مئوية'
    ],
    warnings_en: [
      'Collagen is derived from certified pure animal origin',
      'Keep out of reach of young children',
      'Store in a dry location below 25°C'
    ],
    origin_ar: 'ألمانيا 🇩🇪 — استيراد رسمي معتمد لدى THG 4 Pharma',
    origin_en: 'Germany 🇩🇪 — Certified Official Import by THG 4 Pharma',
    storage_ar: 'يُحفظ في العبوة الأصلية بعيداً عن الحرارة والرطوبة المباشرة.',
    storage_en: 'Keep in original blister pack away from direct humidity and heat.',
    faqs: [
      {
        question_ar: 'ما فائدة إضافة مادة كوانزيم Q10 في هذا المنتج؟',
        question_en: 'Why is Coenzyme Q10 added to this collagen formula?',
        answer_ar: 'مادة Q10 هي محرك الطاقة داخل خلايا البشرة. وجودها بجانب الكولاجين والبيوتين يمنح الخلايا الطاقة اللازمة لامتصاص الكولاجين واستخدامه، ويحمي أنسجة البشرة من التأكسد والإجهاد اليومي.',
        answer_en: 'CoQ10 is the cellular spark plug of skin tissue. Acting synergistically with collagen and biotin, it provides mitochondrial energy for tissue repair while neutralizing collagen-degrading free radicals.'
      },
      {
        question_ar: 'متى تظهر النتائج الملموسة للبشرة؟',
        question_en: 'When can noticeable results be expected?',
        answer_ar: 'بفضل النقاء العالي وتركيبة Q10 والبيوتين، يلاحظ أغلب العملاء تحسناً في رطوبة ونضارة البشرة ومرونتها خلال 4 إلى 8 أسابيع من الاستخدام اليومي المنتظم.',
        answer_en: 'Thanks to the bio-available formulation and CoQ10 synergy, most individuals report noticeable improvements in skin hydration, firmness, and bounce within 4 to 8 weeks of consistent daily use.'
      }
    ],
    accentColor: '#C8102E',
    icon: 'Sparkles',
    image: '/images/products/collagen-1000.webp',
    imageThumb: '/images/products/collagen-1000-thumb.webp',
    searchAliases: [
      'doppelherz', 'doppel herz', 'doppelherz aktiv', 'collagen 1000', 'doppelherz collagen',
      'دوبل هيرتز', 'دبل هيرتز', 'دوبلهيرتز', 'دوبل هيرتز كولاجين', 'كولاجين 1000 دوبل هيرتز',
      'كولاجين الماني', 'queisser pharma', 'كولاجين كيو 10', 'coq10'
    ]
  },
  {
    id: 'belle-hairnakin',
    slug: 'belle-hairnakin-silicon-biotin-beauty-matrix',
    name_ar: 'Belle Hairnakin — مصفوفة السيليكون والبيوتين للشعر والبشرة والأظافر',
    name_en: 'Belle Hairnakin — Advanced Silicon & Biotin Structural Matrix',
    category: 'beauty',
    tags: ['all', 'beauty', 'vitamins'],
    tagline_ar: '205 مجم سيليكون نقي مع 14 عنصراً غذائياً معلناً لقوة بصيلات الشعر وصلابة الأظافر',
    tagline_en: '205 mg elemental silicon with 14 active nutrients engineered for follicle density and nail resilience',
    badge_ar: 'تركيز سيليكون مضاعف 💎',
    badge_en: 'Double Silicon Strength 💎',
    price: 2000,
    currency: 'EGP',
    inStock: true,
    packSize_ar: '30 قرص',
    packSize_en: '30 tablets',
    supplyDays: 30,
    servingBasis_ar: 'لكل قرص',
    servingBasis_en: 'Per tablet',
    shortDesc_ar: 'تركيبة جمالية بنيوية متكاملة (Beauty From Within) تختلف جوهرياً عن مكملات الكولاجين العادية. تقودها جرعة قوية من تراب السيليكا توفر 205 مجم من عنصر السيليكون الحيوي، لبناء الروابط الكبريتية في الكيراتين وتقوية جذور الشعر ومقاومة التقصف والأظافر الهشة.',
    shortDesc_en: 'An ingestible structural beauty complex fundamentally distinct from ordinary collagen supplements. Driven by 500 mg siliceous earth providing 205 mg bio-active elemental silicon to fortify keratin cross-links, anchor hair roots, and eliminate brittle nails.',
    longDesc_ar: 'الكثير يخلط بين مكملات الكولاجين ومكملات تقوية الشعر. Belle Hairnakin صُمم خصيصاً كعلاج بنائي داخلي متكامل للشعر والأظافر. السر يكمن في عنصر "السيليكون" (Silicon) بتركيز 205 مجم المستخلص من 500 مجم سيليكا طبيعية. السيليكون هو المعدن المسؤول في جسم الإنسان عن تشبيك بروتينات الكيراتين وإعطاء الشعرة سماكتها ومقاومتها للسقوط، مع تدعيم الأظافر ومنع تكسرها. ويأتي ذلك مع 14 عنصراً معلناً بالأرقام: زنك وسيلينيوم وبيوتين ونحاس وموليبدينوم ومجموعة فيتامينات B كاملة، ليغنيكِ تماماً عن شراء 4 مكملات منفصلة.',
    longDesc_en: 'Many confuse general collagen supplements with dedicated structural hair therapy. Belle Hairnakin is specifically formulated as an architectural internal rebuild for hair shafts and nail beds. The anchor component is bio-active Silicon (205 mg derived from 500 mg purified siliceous earth). Silicon is the biological mineral responsible for keratin bridging, which imparts thickness, shaft diameter, and anchorage to hair follicles while banishing split nails. Combined with 14 precisely declared actives — Zinc, Selenium, Biotin, Copper, Molybdenum, and B-Complex vitamins — it replaces up to 4 separate beauty products.',
    benefits_ar: [
      '205 مجم سيليكون نقي — العنصر الأساسي لكثافة سمك الشعرة وقوة الأظافر',
      'تغذية عميقة لبصيلات الشعر من الداخل وإمدادها بمعادن الزنك والسيلينيوم',
      'بيوتين 175 ميكروجرام مع كولاجين هيدروليزات داعم لمرونة فروة الرأس',
      '14 عنصراً فعالاً معلناً بالمليجرام الدقيق على العلبة بدون غموض',
      'يغنيك تماماً عن شراء حبوب زنك وسيليكون وبيوتين منفصلة',
      'جودة صيدلانية ألمانية معتمدة للاستخدام اليومي الآمن'
    ],
    benefits_en: [
      '205 mg elemental bio-silicon — the definitive mineral for hair tensile strength and nail thickness',
      'Micro-nourishes hair papilla and root bulbs with bio-available Zinc and Selenium',
      'Synergistic 175 µg Biotin with hydrolysed collagen support for scalp tissue tone',
      '14 fully declared nutritional components stated down to the microgram',
      'Eliminates the need for multiple separate bottles of zinc, biotin, and silicon',
      'German pharmaceutical standard for consistent, safe daily supplementation'
    ],
    nutrients: [
      { name_ar: 'تراب السيليكا النقي (Siliceous Earth)', name_en: 'Pure Siliceous Earth', amount: '500 mg' },
      { name_ar: 'عنصر السيليكون الفعال (Elemental Silicon)', name_en: 'Elemental Bio-Silicon', amount: '205 mg' },
      { name_ar: 'كولاجين هيدروليزات (Collagen Hydrolysate)', name_en: 'Collagen Hydrolysate', amount: '30 mg' },
      { name_ar: 'بيوتين (Biotin)', name_en: 'Biotin', amount: '175 µg' },
      { name_ar: 'زنك (Zinc)', name_en: 'Zinc', amount: '2.5 mg' },
      { name_ar: 'سيلينيوم (Selenium)', name_en: 'Selenium', amount: '20 µg' },
      { name_ar: 'فيتامين C', name_en: 'Vitamin C', amount: '40 mg' },
      { name_ar: 'حمض البانتوثينيك (فيتامين B5)', name_en: 'Pantothenic Acid (B5)', amount: '3 mg' },
      { name_ar: 'نحاس (Copper)', name_en: 'Copper', amount: '0.5 mg' },
      { name_ar: 'منجنيز (Manganese)', name_en: 'Manganese', amount: '0.5 mg' },
      { name_ar: 'فيتامين B6', name_en: 'Vitamin B6', amount: '0.7 mg' },
      { name_ar: 'فيتامين B2', name_en: 'Vitamin B2', amount: '0.7 mg' },
      { name_ar: 'حمض الفوليك (Folic Acid)', name_en: 'Folic Acid', amount: '100 µg' },
      { name_ar: 'موليبدينوم (Molybdenum)', name_en: 'Molybdenum', amount: '12.5 µg' },
    ],
    usage_ar: 'قرص إلى قرصين يومياً مع وجبة رئيسية ومع كوب ماء وافر. تُبلع الأقراص دون مضغ.',
    usage_en: 'One to two tablets daily with a meal and water. Swallow without chewing.',
    warnings_ar: [
      'يحتوي على كولاجين من مصدر حيواني نقي',
      'لا تتجاوز الجرعة اليومية المقررة',
      'يُحفظ بعيداً عن الرطوبة وحرارة الشمس المباشرة'
    ],
    warnings_en: [
      'Contains collagen of certified animal origin',
      'Do not exceed the recommended daily intake',
      'Store away from humidity and direct thermal sources'
    ],
    origin_ar: 'ألمانيا 🇩🇪 — استيراد رسمي بواسطة THG 4 Pharma',
    origin_en: 'Germany 🇩🇪 — Official Import by THG 4 Pharma',
    storage_ar: 'يُحفظ في مكان جاف في درجة حرارة أقل من 25° م.',
    storage_en: 'Store dry at temperature below 25°C.',
    faqs: [
      {
        question_ar: 'ما الفرق الأساسي بين Belle Hairnakin و Collagen 1000؟',
        question_en: 'What is the key difference between Belle Hairnakin and Collagen 1000?',
        answer_ar: 'Collagen 1000 يركز على الكولاجين والـ Q10 لمرونة وترطيب البشرة. أما Belle Hairnakin فهو مخصص بشكل أدق للشعر والأظافر لأنه يعتمد على 205 مجم سيليكون مع الزنك والسيلينيوم، وهي العناصر المسؤولة عن بناء بنية الكيراتين وقوة جذور الشعر.',
        answer_en: 'Collagen 1000 targets skin firmness and dermal hydration with 1000mg collagen and CoQ10. Belle Hairnakin is an architectural hair and nail formula built around 205mg bio-active silicon, zinc, and selenium to consolidate keratin structure.'
      },
      {
        question_ar: 'هل يناسب حالات تساقط الشعر وضعف الأظافر؟',
        question_en: 'Is it suitable for hair shedding and brittle nails?',
        answer_ar: 'نعم، هذه هي غايته الأساسية؛ إمداد البصيلات والأظافر بالمغذيات الميكروية التي تفقدها مع الإجهاد اليومي ونقص المعادن.',
        answer_en: 'Yes, that is its primary purpose: supplying hair follicles and nail matrices with essential micro-minerals that prevent brittleness and weakness.'
      }
    ],
    accentColor: '#1B2D4A',
    icon: 'Feather',
    image: '/images/products/belle-hairnakin.webp',
    imageThumb: '/images/products/belle-hairnakin-thumb.webp',
    searchAliases: [
      'doppelherz', 'doppel herz', 'doppelherz aktiv', 'belle hairnakin', 'doppelherz belle',
      'دوبل هيرتز', 'دبل هيرتز', 'دوبلهيرتز', 'دوبل هيرتز بيل هيرناكن', 'بيل هيرناكن',
      'فيتامين شعر دوبل هيرتز', 'سيليكون للشعر', 'queisser pharma', 'hair skin nails'
    ]
  },
  {
    id: 'iron-direct',
    slug: 'iron-direct-micro-pellets-wild-berry',
    name_ar: 'Iron DIRECT — حديد مباشر ميكروبيليتس بطعم التوت البري',
    name_en: 'Iron DIRECT — Fast-Melt Wild Berry Iron Micropellets',
    category: 'vitamins',
    tags: ['all', 'vitamins'],
    tagline_ar: 'يعالج نقص الحديد والأنيميا بدون أي إمساك أو آلام بالمعدة — يذوب على اللسان بدون ماء',
    tagline_en: 'Effectively combats iron deficiency and anemia with zero constipation or gastric upset — melts on tongue without water',
    badge_ar: 'بدون إمساك أو ماء 🫐',
    badge_en: 'No Constipation • No Water 🫐',
    price: 2000,
    currency: 'EGP',
    inStock: true,
    packSize_ar: '30 كيس جرعة فردية',
    packSize_en: '30 single-dose sachets',
    supplyDays: 30,
    servingBasis_ar: 'لكل كيس يومي',
    servingBasis_en: 'Per single sachet',
    shortDesc_ar: 'ثورة في تناول مكملات الحديد. حبيبات ميكروبيليتس دقيقة تذوب مباشرة على اللسان خلال ثوانٍ بنكهة التوت البري اللذيذة دون الحاجة للماء. تركيبة لطيفة جداً على الجهاز الهضمي تمدك بـ 16 مجم حديد مع 80 مجم فيتامين C للامتصاص الأقصى، مع B6 و B12 وحمض الفوليك بدون أي إمساك أو طعم معدني.',
    shortDesc_en: 'A breakthrough in daily iron delivery. Micro-fine pellets dissolve directly on the tongue in seconds with a refreshing wild berry flavor — no glass of water required. Highly bio-available yet ultra-gentle on digestion: provides 16 mg gentle iron paired with 80 mg Vitamin C for optimized uptake, plus Folic Acid, B6, and B12 with zero constipation or metallic taste.',
    longDesc_ar: 'أكبر عائق يمنع الناس من علاج الأنيميا ونقص الحديد هو الآثار الجانبية للأقراص التقليدية: الإمساك الشديد، آلام المعدة، الغثيان، والطعم المعدني المقزز. تم تصميم Iron DIRECT بتقنية الحبيبات المجهرية الألمانية الفائقة (Micropellets) لحل هذه المشكلات جذرياً. تفتح الكيس وتضعه على لسانك مباشرة ليذوب بلذة بطعم التوت البري المنعش. يحتوي كل كيس على 16 مجم حديد مدمج معه 80 مجم فيتامين C الذي يضاعف امتصاص الحديد في الأمعاء، إلى جانب حمض الفوليك وفيتامينات B لتعويض الإرهاق وتجديد الهيموجلوبين بأمان تام وبدون أي أثر للإمساك.',
    longDesc_en: 'The number one reason patients abandon anemia therapy is gastrointestinal intolerance: severe constipation, abdominal cramping, nausea, and persistent metallic taste. Iron DIRECT resolves this through advanced German micropellet science. Simply pour the sachet onto your tongue — it dissolves instantly with a delightful wild berry flavor, requiring no water. Each sachet pairs 16 mg gentle iron with 80 mg Vitamin C to amplify uptake, along with Folic Acid and B-vitamins to conquer chronic fatigue and rebuild red blood cells with zero stomach irritation.',
    benefits_ar: [
      'بدون أي إمساك أو اضطرابات هضمية أو غثيان — لطيف للغاية على المعدة',
      'يذوب فوراً على اللسان بدون الحاجة لشرب ماء — راحة تامة في أي مكان وأي وقت',
      'طعم التوت البري اللذيذ بدون أي طعم معدني منفر على الإطلاق',
      '16 مجم حديد فعال مع 80 مجم فيتامين C الذي يعزز امتصاص الحديد لأقصى درجة',
      'مدعم بحمض الفوليك وفيتاميني B6 و B12 لمحاربة الإرهاق وتنشيط الدورة الدموية',
      'أكياس فردية معقمة سهلة الحمل في الحقيبة أو العمل'
    ],
    benefits_en: [
      'Zero constipation, nausea, or gastric heaviness — exceptionally well-tolerated',
      'Dissolves directly on the tongue without needing water — convenience on the go',
      'Delicious wild berry flavor with zero unpleasant metallic aftertaste',
      '16 mg elemental iron paired with 80 mg Vitamin C for maximized intestinal absorption',
      'Fortified with Folic Acid, B6, and B12 to eradicate sluggishness and bolster hemoglobin',
      'Individually sealed travel-ready daily sachets'
    ],
    nutrients: [
      { name_ar: 'حديد عضوي لطيف (Iron)', name_en: 'Bio-Available Iron', amount: '16 mg' },
      { name_ar: 'فيتامين C (معزز امتصاص الحديد)', name_en: 'Vitamin C (Absorption Booster)', amount: '80 mg' },
      { name_ar: 'حمض الفوليك (Folic Acid)', name_en: 'Folic Acid', amount: '200 µg' },
      { name_ar: 'فيتامين B6', name_en: 'Vitamin B6', amount: '1.4 mg' },
      { name_ar: 'فيتامين B12', name_en: 'Vitamin B12', amount: '2.5 µg' },
    ],
    usage_ar: 'كيس واحد يومياً. افتح الكيس وضع الحبيبات مباشرة على اللسان ودعها تذوب بلطف ثم ابتلعها. لا تحتاج إلى ماء.',
    usage_en: 'One sachet daily. Open sachet and tip micropellets directly onto the tongue; allow to dissolve and swallow. No water needed.',
    warnings_ar: [
      'لا يُستخدم في حالات فرط تراكم الحديد بالجسم (داء ترسب الأصبغة الدموية)',
      'يحتوي على سوربيتول كمحلي طبيعي لطيف',
      'يُحفظ بعيداً عن متناول الأطفال الصغار'
    ],
    warnings_en: [
      'Do not use if suffering from iron overload disorders (hemochromatosis)',
      'Contains sorbitol as a pleasant sweetener',
      'Keep strictly out of reach of young children'
    ],
    origin_ar: 'ألمانيا 🇩🇪 — استيراد رسمي بواسطة THG 4 Pharma',
    origin_en: 'Germany 🇩🇪 — Official Import by THG 4 Pharma',
    storage_ar: 'يُحفظ في مكان جاف ومعتم تحت 25° م.',
    storage_en: 'Store in a dry location below 25°C.',
    faqs: [
      {
        question_ar: 'هل فعلاً Iron DIRECT لا يسبب الإمساك الشائع مع حبوب الحديد؟',
        question_en: 'Does Iron DIRECT truly prevent the common constipation of iron pills?',
        answer_ar: 'نعم تماماً. صُمم هذا المنتج خصيصاً بنقاء ألماني عالي الامتصاص لتفادي ترسب الحديد غير الممتص في الأمعاء والذي يسبب الإمساك والغازات في الأدوية العادية.',
        answer_en: 'Yes, absolutely. Its high bio-availability and dual synergy with Vitamin C ensure rapid, clean mucosal uptake so unabsorbed iron does not linger in the gut to trigger constipation.'
      },
      {
        question_ar: 'هل طعمه مقبول للأطفال والبالغين؟',
        question_en: 'Is the taste palatable for adults and teenagers?',
        answer_ar: 'طعمه رائع بنكهة التوت البري الطبيعي المنعش، ويحبه الجميع لأنه يخلو تماماً من المذاق المعدني المعتاد في مكملات الحديد.',
        answer_en: 'It features a delicious natural wild berry taste that completely masks the metallic taste inherent to typical iron pills, making daily adherence effortless.'
      }
    ],
    accentColor: '#C8102E',
    icon: 'Zap',
    image: '/images/products/iron-direct.webp',
    imageThumb: '/images/products/iron-direct-thumb.webp',
    searchAliases: [
      'doppelherz', 'doppel herz', 'doppelherz aktiv', 'iron direct', 'doppelherz iron',
      'دوبل هيرتز', 'دبل هيرتز', 'دوبلهيرتز', 'دوبل هيرتز حديد', 'حديد دايركت دوبل هيرتز',
      'حديد ميكروبيليتس', 'حديد بدون امساك', 'queisser pharma', 'anemia'
    ]
  },
  {
    id: 'vital-materna-plus',
    slug: 'vital-materna-plus-maternal-nutrition',
    name_ar: 'Vital Materna PLUS — تغذية الأم والتخطيط للحمل والرضاعة',
    name_en: 'Vital Materna PLUS — Complete Maternal & Nursing Nutrition',
    category: 'women',
    tags: ['all', 'women', 'omega3', 'vitamins'],
    tagline_ar: '20 عنصراً غذائياً معلناً تشمل DHA وحمض الفوليك والحديد واليود لدعم الأم وجنينها',
    tagline_en: '20 comprehensive declared micronutrients including DHA, Folic Acid, Iron & Iodine for maternal health',
    badge_ar: 'نفد المخزون مؤقتاً ⏳',
    badge_en: 'Temporarily Sold Out ⏳',
    price: 1300,
    currency: 'EGP',
    inStock: false,
    packSize_ar: '30 كبسولة',
    packSize_en: '30 capsules',
    supplyDays: 30,
    servingBasis_ar: 'لكل جرعة (كبسولتين)',
    servingBasis_en: 'Per dose (2 capsules)',
    shortDesc_ar: 'التركيبة الألمانية الذهبية المتكاملة للأمهات خلال مراحل التخطيط للحمل، وأشهر الحمل، وفترة الرضاعة الطبيعية. تجمع بين 20 عنصراً ميكروياً دقيقاً في مقدمتها 252 مجم DHA لنمو مخ وبصر الجنين، 800 ميكروجرام حمض فوليك، وحديد عضوي ويود ومجموعة فيتامينات B كاملة.',
    shortDesc_en: 'The definitive German maternal nutrient system spanning pre-conception, pregnancy, and nursing. Synthesizes 20 active micronutrients led by 252 mg DHA for fetal neurological and visual development, 800 µg Folic Acid, bio-iron, Iodine, and a full B-complex spectrum.',
    longDesc_ar: 'في فترة الحمل والرضاعة، تتضاعف حاجة جسم الأم إلى مغذيات محددة لا يمكن إغفالها. بدلاً من تناول 4 أو 5 مكملات منفصلة، توفر تركيبة Vital Materna PLUS الألمانية نظاماً متكاملاً من 20 عنصراً حيوياً في جرعة واحدة: 252 مجم DHA من أنقى مصادر أوميجا 3 البحرية لتكوين مخ وشبكية الجنين، مع 800 ميكروجرام حمض الفوليك الضروري لنمو الأنبوب العصبي، و 28 مجم حديد لوقاية الأم من فقر الدم، و 300 ميكروجرام يود لوظائف الغدة الدرقية، إلى جانب فيتامين D3 والزنك والمغنيسيوم.',
    longDesc_en: 'During maternal planning, pregnancy, and lactation, maternal nutritional demands escalate drastically. Rather than juggling multiple loose pills, Vital Materna PLUS provides a coordinated 20-nutrient matrix: 252 mg maternal DHA for fetal brain and ocular architecture, 800 µg Folic Acid for neural tube support, 28 mg bio-iron to guard maternal blood volume, 300 µg Iodine for metabolic and thyroid balance, plus Vitamin D3, Magnesium, and Zinc.',
    benefits_ar: [
      '800 ميكروجرام حمض الفوليك لدعم النمو الصحي للجنين',
      '252 مجم DHA أوميجا 3 عالي النقاوة لتطور مخ وشبكية الجنين والرضيع',
      '28 مجم حديد عضوي للوقاية من أنيميا الحمل والرضاعة',
      '300 ميكروجرام يود لدعم التمثيل الغذائي وصحة الغدة الدرقية',
      '20 عنصراً ميكروياً معلناً تغنيكِ عن شراء مكملات متفرقة',
      'نقاء ألماني خاضع لأعلى درجات الفحص والرقابة الصيدلانية'
    ],
    benefits_en: [
      '800 µg Folic Acid in optimal bio-available form',
      '252 mg purified maternal DHA for fetal neural and visual growth',
      '28 mg gentle iron supporting healthy red cell mass',
      '300 µg Iodine for vital thyroid endocrine equilibrium',
      '20 fully disclosed micronutrients eliminating multi-bottle clutter',
      'Strict German pharmaceutical testing for absolute maternal safety'
    ],
    nutrients: [
      { name_ar: 'أحماض أوميجا 3 الدهنية (Omega-3)', name_en: 'Total Omega-3 Fatty Acids', amount: '352 mg' },
      { name_ar: 'حمض DHA النقي', name_en: 'Pure DHA', amount: '252 mg' },
      { name_ar: 'حمض EPA النقي', name_en: 'Pure EPA', amount: '58 mg' },
      { name_ar: 'حمض الفوليك (Folic Acid)', name_en: 'Folic Acid', amount: '800 µg' },
      { name_ar: 'حديد (Iron)', name_en: 'Iron', amount: '28 mg' },
      { name_ar: 'يود (Iodine)', name_en: 'Iodine', amount: '300 µg' },
      { name_ar: 'فيتامين C', name_en: 'Vitamin C', amount: '160 mg' },
      { name_ar: 'ماغنيسيوم (Magnesium)', name_en: 'Magnesium', amount: '120 mg' },
      { name_ar: 'زنك (Zinc)', name_en: 'Zinc', amount: '10 mg' },
      { name_ar: 'فيتامين D3', name_en: 'Vitamin D3', amount: '10 µg (400 IU)' },
      { name_ar: 'فيتامين E', name_en: 'Vitamin E', amount: '24 mg' },
      { name_ar: 'فيتامينات B المركبة (B1, B2, B6, B12, Niacin)', name_en: 'Complete B-Complex', amount: 'كاملة التركيبة' },
    ],
    usage_ar: 'كبسولة إلى كبسولتين يومياً مع وجبة طعام متوازنة ومع كمية كافية من الماء. لا يتم مضغها.',
    usage_en: 'One to two capsules daily with a wholesome meal and water. Do not chew.',
    warnings_ar: [
      'يحتوي على مشتقات أسماك بحرية نقية وصويا',
      'يحتوي على الحديد؛ يُحفظ دائماً بعيداً عن متناول الأطفال الصغار',
      'استشيري طبيبكِ الخاص أثناء الحمل لتأكيد الجرعة اليومية المناسبة لحالتكِ'
    ],
    warnings_en: [
      'Contains purified fish and soy derivatives',
      'Contains iron; store strictly out of reach of young children',
      'Consult your obstetrician to confirm exact daily regimen'
    ],
    origin_ar: 'ألمانيا 🇩🇪 — استيراد رسمي معتمد من THG 4 Pharma',
    origin_en: 'Germany 🇩🇪 — Official Import by THG 4 Pharma',
    storage_ar: 'يُحفظ في مكان جاف وبارد تحت 25° م.',
    storage_en: 'Store in a cool, dry place below 25°C.',
    faqs: [
      {
        question_ar: 'هل يمكنني حجز المنتج ومعرفة موعد وصول الشحنة القادمة؟',
        question_en: 'Can I join the waitlist to be alerted upon restock?',
        answer_ar: 'نعم، الشحنة الجديدة قيد الإجراءات الجمركية المبردة وسنوفر إشعاراً فورياً عبر واتساب لكل من يسجل في قائمة الانتظار.',
        answer_en: 'Yes, our next climate-controlled shipment is currently processing through clearance. Enter your details to get priority WhatsApp notification immediately upon arrival.'
      }
    ],
    accentColor: '#9B0D24',
    icon: 'Heart',
    image: '/images/products/vital-materna-plus.webp',
    imageThumb: '/images/products/vital-materna-plus-thumb.webp',
    searchAliases: [
      'doppelherz', 'doppel herz', 'doppelherz aktiv', 'vital materna', 'materna plus', 'doppelherz materna',
      'دوبل هيرتز', 'دبل هيرتز', 'دوبلهيرتز', 'دوبل هيرتز ماترنا', 'فايتال ماترنا دوبل هيرتز',
      'فيتامينات حمل دوبل هيرتز', 'queisser pharma', 'pregnancy vitamins'
    ]
  },
  {
    id: 'diavit',
    slug: 'diavit-metabolic-vitality-micronutrients',
    name_ar: 'DiaVit — فيتامينات ومعادن التوازن الأيضي والحيوية اليومية',
    name_en: 'DiaVit — Metabolic Vitality & Cellular Balance Micronutrients',
    category: 'vitamins',
    tags: ['all', 'vitamins'],
    tagline_ar: '14 عنصراً غذائياً معلناً يشمل الماغنيسيوم والكروميوم والسيلينيوم لحيوية ونشاط مستمر',
    tagline_en: '14 declared metabolic micronutrients featuring Magnesium, Chromium & Selenium for sustained vitality',
    badge_ar: 'نفد المخزون مؤقتاً ⏳',
    badge_en: 'Temporarily Sold Out ⏳',
    price: 1650,
    currency: 'EGP',
    inStock: false,
    packSize_ar: '30 قرص',
    packSize_en: '30 tablets',
    supplyDays: 30,
    servingBasis_ar: 'لكل قرص يومي',
    servingBasis_en: 'Per daily tablet',
    shortDesc_ar: 'تركيبة ألمانية متخصصة لدعم التوازن الأيضي والنشاط الحيوي اليومي. تمنحك 14 عنصراً أساسياً تشمل 200 مجم ماغنيسيوم، 200 مجم فيتامين C، 60 ميكروجرام كروميوم لتعزيز كفاءة استقلاب المغذيات، مع السيلينيوم والزنك ومجموعة فيتامينات B الكاملة.',
    shortDesc_en: 'Specialized German formula engineered for metabolic equilibrium and cellular vigor. Supplies 14 vital actives including 200 mg Magnesium, 200 mg Vitamin C, 60 µg Chromium to support nutrient metabolism, along with Selenium, Zinc, and complete B-Complex vitamins.',
    longDesc_ar: 'الحفاظ على طاقة الجسم والتمثيل الغذائي السليم يتطلب توازناً دقيقاً في المعادن الميكروية. يقدم DiaVit تركيبة صيدلانية متكاملة مطورة في ألمانيا لتعويض النقص الغذائي اليومي ودعم إنتاج الطاقة الخلوية ومقاومة الإجهاد التأكسدي. يبرز فيها عنصر الكروميوم الذي يساهم في التمثيل الغذائي الطبيعي للمغذيات الكبرى، والماغنيسيوم لتقليل التعب العضلي والعصبي، مع مضادات أكسدة قوية من فيتامين C و E والسيلينيوم والزنك في قرص يومي واحد مريح.',
    longDesc_en: 'Sustaining balanced metabolism and day-long stamina requires precise micronutrient calibration. DiaVit provides a coherent German formulation created to offset daily nutritional deficits, enhance cellular energy yield, and neutralize oxidative stress. Chromium is featured for its role in macronutrient breakdown, paired with 200 mg Magnesium to combat neuromuscular fatigue, alongside high-dose Vitamin C, Vitamin E, Selenium, and Zinc in a single daily tablet.',
    benefits_ar: [
      '200 مجم ماغنيسيوم و 200 مجم فيتامين C لدعم كفاءة الجهاز العصبي والعضلي',
      '60 ميكروجرام كروميوم للمساهمة في التمثيل الغذائي الطبيعي للمغذيات',
      'مجموعة فيتامينات B كاملة (B1, B2, B6, B12, فوليك، نياسين، بيوتين) لطاقة مستمرة',
      'سيلينيوم وزنك لدعم المناعة وحماية الخلايا من التلف التأكسدي',
      '14 عنصراً غذائياً معلناً بكل شفافية ودقة صيدلانية ألمانية',
      'قرص واحد يومياً يمنحك التوازن دون تعقيد'
    ],
    benefits_en: [
      '200 mg Magnesium and 200 mg Vitamin C reducing neuromuscular fatigue',
      '60 µg Chromium contributing to normal macronutrient metabolic balance',
      'Complete B-vitamin group (B1, B2, B6, B12, Folic, Niacin, Biotin) for ongoing vitality',
      'Selenium and Zinc providing robust immune and cellular antioxidant armor',
      '14 precisely declared micronutrients with German transparent labeling',
      'One tablet daily for steady daily wellness'
    ],
    nutrients: [
      { name_ar: 'ماغنيسيوم (Magnesium)', name_en: 'Magnesium', amount: '200 mg' },
      { name_ar: 'فيتامين C', name_en: 'Vitamin C', amount: '200 mg' },
      { name_ar: 'فيتامين E', name_en: 'Vitamin E', amount: '42 mg' },
      { name_ar: 'كروميوم (Chromium)', name_en: 'Chromium', amount: '60 µg' },
      { name_ar: 'سيلينيوم (Selenium)', name_en: 'Selenium', amount: '30 µg' },
      { name_ar: 'زنك (Zinc)', name_en: 'Zinc', amount: '5 mg' },
      { name_ar: 'نياسين (Niacin - B3)', name_en: 'Niacin (B3)', amount: '18 mg' },
      { name_ar: 'حمض البانتوثينيك (B5)', name_en: 'Pantothenic Acid (B5)', amount: '6 mg' },
      { name_ar: 'فيتامين B6', name_en: 'Vitamin B6', amount: '3 mg' },
      { name_ar: 'فيتامين B1', name_en: 'Vitamin B1', amount: '2 mg' },
      { name_ar: 'فيتامين B2', name_en: 'Vitamin B2', amount: '1.6 mg' },
      { name_ar: 'حمض الفوليك (Folic Acid)', name_en: 'Folic Acid', amount: '450 µg' },
      { name_ar: 'بيوتين (Biotin)', name_en: 'Biotin', amount: '150 µg' },
      { name_ar: 'فيتامين B12', name_en: 'Vitamin B12', amount: '9 µg' },
    ],
    usage_ar: 'قرص واحد يومياً مع وجبة طعام رئيسية ومع كمية كافية من الماء. يُبلع كاملاً دون مضغ.',
    usage_en: 'One tablet daily with a main meal and sufficient water. Swallow whole without chewing.',
    warnings_ar: [
      'مكمل غذائي عالي الجودة؛ لا يُعتبر بديلاً عن نظام غذائي متوازن ومتنوع',
      'يُحفظ بعيداً عن متناول الأطفال',
      'يُحفظ في مكان جاف في درجة حرارة أقل من 25° م'
    ],
    warnings_en: [
      'Quality food supplement; not a substitute for a diverse, balanced diet',
      'Keep out of reach of young children',
      'Store in a dry location below 25°C'
    ],
    origin_ar: 'ألمانيا 🇩🇪 — استيراد رسمي معتمد من THG 4 Pharma',
    origin_en: 'Germany 🇩🇪 — Official Import by THG 4 Pharma',
    storage_ar: 'يُحفظ في مكان جاف بعيداً عن مصادر الضوء والحرارة.',
    storage_en: 'Store in a dry location away from light and heat.',
    faqs: [
      {
        question_ar: 'ما الدور الذي يلعبه الكروميوم والماغنيسيوم في هذه التركيبة؟',
        question_en: 'What role do Chromium and Magnesium play in this formula?',
        answer_ar: 'الكروميوم عنصر دقيق أساسي يساهم في التمثيل الغذائي الفعال للكربوهيدرات والبروتينات والدهون، بينما يساعد الماغنيسيوم في استرخاء العضلات وإنتاج الطاقة الحيوية في الجسم.',
        answer_en: 'Chromium is an essential trace element that aids in normal macronutrient metabolism, while Magnesium supports muscle relaxation and bio-energetic cellular synthesis.'
      }
    ],
    accentColor: '#1B2D4A',
    icon: 'Activity',
    image: '/images/products/diavit.webp',
    imageThumb: '/images/products/diavit-thumb.webp',
    searchAliases: [
      'doppelherz', 'doppel herz', 'doppelherz aktiv', 'diavit', 'doppelherz diavit',
      'دوبل هيرتز', 'دبل هيرتز', 'دوبلهيرتز', 'دوبل هيرتز ديافيت', 'ديافيت دوبل هيرتز',
      'فيتامينات سكر المانية', 'queisser pharma', 'metabolic vitamins'
    ]
  }
];
