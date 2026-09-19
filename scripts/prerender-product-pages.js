import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://thg4pharma.com';
const distDir = path.join(__dirname, '..', 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[Prerender] Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

const products = [
  {
    id: 'pure-3',
    slug: 'pure-3-high-potency-omega-3',
    nameAr: 'Pure-3 — أوميجا 3 ألماني عالي النقاوة والتركيز (Doppelherz)',
    nameEn: 'Pure-3 — German High-Potency Ultra-Pure Omega-3 (Doppelherz)',
    shortDescAr: 'أوميجا 3 بحري عالي النقاء بتقنية التقطير الجزيئي الألماني الفائق 600 مجم EPA و DHA بدون أي رائحة أو طعم سمك نهائياً. شحن مجاني لكافة محافظات مصر ومعاينة العبوة قبل الدفع.',
    shortDescEn: 'German molecularly distilled ultra-pure marine Omega-3. Delivers 600 mg EPA/DHA with zero fishy regurgitation. Free shipping across Egypt with payment after inspection.',
    image: '/images/products/pure-3.jpg',
    price: '2000',
    inStock: true,
  },
  {
    id: 'collagen-1000',
    slug: 'collagen-1000-q10-biotin-complex',
    nameAr: 'Collagen 1000 — كولاجين هيدروليزات مع كوانزيم Q10 وبيوتين (Doppelherz)',
    nameEn: 'Collagen 1000 — Hydrolysed Collagen with CoQ10 & Biotin (Doppelherz)',
    shortDescAr: '1000 مجم كولاجين متحلل ألماني مدعم بإنزيم الطاقة الخلوية CoQ10 والبيوتين 500 ميكروجرام في قرص واحد يومياً لنضارة البشرة. شحن مجاني لكافة محافظات مصر والمعاينة قبل الدفع.',
    shortDescEn: '1,000 mg hydrolysed collagen boosted with cellular energizer CoQ10 and high-dose Biotin in one daily tablet. Free shipping across Egypt with COD inspection.',
    image: '/images/products/collagen-1000.jpg',
    price: '2000',
    inStock: true,
  },
  {
    id: 'belle-hairnakin',
    slug: 'belle-hairnakin-silicon-biotin-beauty-matrix',
    nameAr: 'Belle Hairnakin — مصفوفة السيليكون والبيوتين للشعر والبشرة والأظافر (Doppelherz)',
    nameEn: 'Belle Hairnakin — Advanced Silicon & Biotin Structural Matrix (Doppelherz)',
    shortDescAr: '205 مجم سيليكون نقي مع 14 عنصراً غذائياً معلناً لقوة بصيلات الشعر وصلابة الأظافر بدون تساقط. جودة ألمانية صيدلانية معتمدة من THG 4 Pharma مع شحن مجاني ومعاينة.',
    shortDescEn: '205 mg elemental bio-silicon with 14 active nutrients engineered for follicle density and nail resilience. Free express shipping across Egypt with inspection.',
    image: '/images/products/belle-hairnakin.jpg',
    price: '2000',
    inStock: true,
  },
  {
    id: 'iron-direct',
    slug: 'iron-direct-micro-pellets-wild-berry',
    nameAr: 'Iron DIRECT — حديد مباشر ميكروبيليتس بطعم التوت البري (Doppelherz)',
    nameEn: 'Iron DIRECT — Fast-Melt Wild Berry Iron Micropellets (Doppelherz)',
    shortDescAr: 'علاج نقص الحديد والأنيميا بدون أي إمساك أو آلام معدة. حبيبات ميكروبيليتس ألمانية تذوب على اللسان بدون ماء بطعم التوت البري 16 مجم حديد مع فيتامين C. شحن مجاني بمصر.',
    shortDescEn: 'Effectively combats iron deficiency with zero constipation or stomach upset. Fast-melt micropellets dissolve on tongue without water in wild berry flavor. Free shipping.',
    image: '/images/products/iron-direct.jpg',
    price: '2000',
    inStock: true,
  },
  {
    id: 'vital-materna-plus',
    slug: 'vital-materna-plus-maternal-nutrition',
    nameAr: 'Vital Materna PLUS — تغذية الأم والتخطيط للحمل والرضاعة (Doppelherz)',
    nameEn: 'Vital Materna PLUS — Complete Maternal & Nursing Nutrition (Doppelherz)',
    shortDescAr: 'التركيبة الألمانية الذهبية للأمهات: 20 عنصراً معلناً تشمل 252 مجم DHA وحمض الفوليك والحديد واليود لدعم الأم وجنينها. احجز في قائمة الانتظار للشحنة المبردة القادمة.',
    shortDescEn: '20 comprehensive declared micronutrients including DHA, Folic Acid, Iron & Iodine for pre-conception, pregnancy, and lactation. Join the priority waitlist.',
    image: '/images/products/vital-materna-plus.jpg',
    price: '1300',
    inStock: false,
  },
  {
    id: 'diavit',
    slug: 'diavit-metabolic-vitality-micronutrients',
    nameAr: 'DiaVit — فيتامينات ومعادن التوازن الأيضي والحيوية اليومية (Doppelherz)',
    nameEn: 'DiaVit — Metabolic Vitality & Cellular Balance Micronutrients (Doppelherz)',
    shortDescAr: '14 عنصراً غذائياً معلناً تشمل 200 مجم ماغنيسيوم وكروميوم وسيلينيوم لدعم التمثيل الغذائي والحيوية ومقاومة الإجهاد. احجز في قائمة الانتظار للشحنة المبردة القادمة.',
    shortDescEn: '14 declared metabolic micronutrients featuring Magnesium, Chromium & Selenium for sustained vitality and metabolic equilibrium. Join the waitlist.',
    image: '/images/products/diavit.jpg',
    price: '1650',
    inStock: false,
  },
];

function generateProductHtml(product, targetUrl) {
  const pageTitle = `${product.nameAr} | مكملات دوبيل هيرز الألمانية — THG 4 Pharma مصر`;
  const productImageUrl = `${BASE_URL}${product.image}`;
  const availability = product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const ogAvailability = product.inStock ? 'instock' : 'outofstock';

  let html = templateHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${pageTitle}" />`);

  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${product.shortDescAr}" />`);

  // Replace Canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${targetUrl}" />`);

  // Replace Open Graph / Facebook tags
  html = html.replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="product" />\n    <meta property="product:price:amount" content="${product.price}" />\n    <meta property="product:price:currency" content="EGP" />\n    <meta property="product:availability" content="${ogAvailability}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${targetUrl}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${pageTitle}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${product.shortDescAr}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${productImageUrl}" />`);
  html = html.replace(/<meta property="og:image:alt" content=".*?" \/>/, `<meta property="og:image:alt" content="${product.nameAr}" />`);

  // Replace Twitter tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${pageTitle}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${product.shortDescAr}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${productImageUrl}" />`);

  // Inject Specific Product JSON-LD Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameAr,
    alternateName: product.nameEn,
    image: productImageUrl,
    description: product.shortDescAr,
    brand: {
      '@type': 'Brand',
      name: 'Doppelherz aktiv (THG 4 Pharma)',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Queisser Pharma GmbH & Co. KG Germany',
    },
    offers: {
      '@type': 'Offer',
      url: targetUrl,
      priceCurrency: 'EGP',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: availability,
      seller: {
        '@type': 'Organization',
        name: 'THG 4 Pharma (True Health Goals)',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EGP',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'EG',
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
    },
  };

  const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(productSchema, null, 2)}\n</script>`;
  html = html.replace('</head>', `  ${schemaScript}\n</head>`);

  return html;
}

let generatedCount = 0;

for (const product of products) {
  // URLs to generate:
  // 1. /product/:id (e.g. /product/pure-3)
  // 2. /product/:slug (e.g. /product/pure-3-high-potency-omega-3)
  // 3. /products/:id (e.g. /products/pure-3)
  // 4. /products/:slug (e.g. /products/pure-3-high-potency-omega-3)
  const paths = [
    { dir: path.join(distDir, 'product', product.id), url: `${BASE_URL}/product/${product.id}` },
    { dir: path.join(distDir, 'product', product.slug), url: `${BASE_URL}/product/${product.slug}` },
    { dir: path.join(distDir, 'products', product.id), url: `${BASE_URL}/products/${product.id}` },
    { dir: path.join(distDir, 'products', product.slug), url: `${BASE_URL}/products/${product.slug}` },
  ];

  for (const { dir, url } of paths) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const html = generateProductHtml(product, url);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    generatedCount++;
  }
}

console.log(`[Prerender] Successfully generated ${generatedCount} static product HTML entry points for Facebook & SEO!`);
