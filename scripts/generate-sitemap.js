import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://thg4pharma.com';
const today = new Date().toISOString().split('T')[0];

// Complete product dataset for XML Sitemap, Google Indexing & Image SEO
const products = [
  {
    id: 'pure-3',
    slug: 'pure-3-high-potency-omega-3',
    nameAr: 'دوبيل هيرز بيور 3 أوميجا 3 عالي التركيز',
    nameEn: 'Doppelherz aktiv Pure-3 High Potency Omega-3 Egypt',
    caption: 'أوميجا 3 ألماني نقي من إنتاج كويسر فارما Queisser Pharma بدون رائحة سمك 600 مجم EPA و DHA مستورد حصرياً بواسطة THG 4 Pharma مصر',
    image: '/images/products/pure-3.jpg',
  },
  {
    id: 'collagen-1000',
    slug: 'collagen-1000-q10-biotin-complex',
    nameAr: 'كولاجين 1000 دوبيل هيرز مع كيو 10 وبيوتين',
    nameEn: 'Doppelherz aktiv Collagen 1000 with CoQ10 & Biotin Egypt',
    caption: '1000 مجم كولاجين متحلل ألماني مع كوانزيم CoQ10 وبيوتين 500 ميكروجرام لنضارة البشرة من مستورد دوبيل هيرز المعتمد THG 4 Pharma',
    image: '/images/products/collagen-1000.jpg',
  },
  {
    id: 'belle-hairnakin',
    slug: 'belle-hairnakin-silicon-biotin-beauty-matrix',
    nameAr: 'دوبيل هيرز بيل هيرناكن للشعر والبشرة والأظافر',
    nameEn: 'Doppelherz aktiv Belle Hairnakin Silicon & Biotin Matrix Egypt',
    caption: '205 مجم سيليكون نقي مع 14 عنصراً غذائياً معلناً تشمل البيوتين والزنك والسيلينيوم والكولاجين لتقوية بصيلات الشعر ومقاومة التساقط',
    image: '/images/products/belle-hairnakin.jpg',
  },
  {
    id: 'iron-direct',
    slug: 'iron-direct-micro-pellets-wild-berry',
    nameAr: 'حديد دايركت ميكروبيليتس دوبيل هيرز بالتوت البري',
    nameEn: 'Doppelherz aktiv Iron DIRECT Fast-Melt Wild Berry Egypt',
    caption: 'أكياس حديد ألماني تذوب على اللسان بدون ماء وبدون إمساك أو آلام معدة 16 مجم حديد مع فيتامين C للامتصاص الأقصى',
    image: '/images/products/iron-direct.jpg',
  },
  {
    id: 'vital-materna-plus',
    slug: 'vital-materna-plus-maternal-nutrition',
    nameAr: 'دوبيل هيرز فايتال ماترنا بلس للحمل والرضاعة',
    nameEn: 'Doppelherz aktiv Vital Materna PLUS Maternal Nutrition Egypt',
    caption: '20 عنصراً ميكروياً معلناً تشمل 252 مجم DHA أوميجا 3 و 800 ميكروجرام حمض فوليك وحديد ويود لصحة الأم والجنين',
    image: '/images/products/vital-materna-plus.jpg',
  },
  {
    id: 'diavit',
    slug: 'diavit-metabolic-vitality-micronutrients',
    nameAr: 'دوبيل هيرز ديافيت فيتامينات ومعادن التوازن الأيضي',
    nameEn: 'Doppelherz aktiv DiaVit Metabolic Vitality Egypt',
    caption: '14 عنصراً غذائياً معلناً تشمل 200 مجم ماغنيسيوم وكروميوم وسيلينيوم وفيتامينات B المركبة لدعم التمثيل الغذائي والحيوية اليومية',
    image: '/images/products/diavit.jpg',
  },
];

function generateSitemapXml() {
  const homeImagesXml = products
    .map(
      (p) => `    <image:image>
      <image:loc>${BASE_URL}${p.image}</image:loc>
      <image:title>${p.nameEn} | ${p.nameAr}</image:title>
      <image:caption>${p.caption}</image:caption>
    </image:image>`
    )
    .join('\n');

  const productUrlsXml = products
    .map((p) => {
      return `  <!-- Product: ${p.id} -->
  <url>
    <loc>${BASE_URL}/product/${p.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="ar-EG" href="${BASE_URL}/product/${p.id}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/product/${p.id}?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/product/${p.id}" />
    <image:image>
      <image:loc>${BASE_URL}${p.image}</image:loc>
      <image:title>${p.nameEn} | ${p.nameAr}</image:title>
      <image:caption>${p.caption}</image:caption>
    </image:image>
  </url>
  <url>
    <loc>${BASE_URL}/product/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Main Storefront (Covering THG 4 Pharma & Doppelherz Egypt) -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ar-EG" href="${BASE_URL}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />
${homeImagesXml}
  </url>

${productUrlsXml}

</urlset>
`;
}

const targetPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const xmlContent = generateSitemapXml();

fs.writeFileSync(targetPath, xmlContent, 'utf8');
console.log(`[Sitemap] Generated ${targetPath} successfully on ${today} with dedicated product URLs`);
