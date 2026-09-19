import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '..', 'images');
const outDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const products = [
  { source: 'pure-3.jpg', id: 'pure-3' },
  { source: 'collagen.jpg', id: 'collagen-1000' },
  { source: 'belle.jpg', id: 'belle-hairnakin' },
  { source: 'iron-direct.jpg', id: 'iron-direct' },
  { source: 'vitalmaterna.jpg', id: 'vital-materna-plus' },
  { source: 'diavit.jpg', id: 'diavit' },
];

const TARGET_WIDTH = 960;
const TARGET_HEIGHT = 1200;
const THUMB_WIDTH = 320;
const THUMB_HEIGHT = 400;

for (const p of products) {
  const srcPath = path.join(imagesDir, p.source);
  if (!fs.existsSync(srcPath)) {
    console.error(`Missing source image: ${srcPath}`);
    continue;
  }

  console.log(`Processing ${p.id} from ${p.source}...`);

  // 1. High-Quality WebP
  await sharp(srcPath)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'center' })
    .webp({ quality: 90, effort: 5 })
    .toFile(path.join(outDir, `${p.id}.webp`));

  // 2. High-Quality JPG Fallback
  await sharp(srcPath)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 88, progressive: true })
    .toFile(path.join(outDir, `${p.id}.jpg`));

  // 3. Compact WebP Thumbnail
  await sharp(srcPath)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: 'cover', position: 'center' })
    .webp({ quality: 85, effort: 4 })
    .toFile(path.join(outDir, `${p.id}-thumb.webp`));

  console.log(`  -> Saved ${p.id}.webp, ${p.id}.jpg, ${p.id}-thumb.webp`);
}

console.log('All 6 product media files generated successfully in public/images/products/!');
