import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.join(__dirname, '..', 'images', 'logo.jpg');

const { data, info } = await sharp(logoPath)
  .resize(800, 800, { fit: 'inside' })
  .raw()
  .toBuffer({ resolveWithObject: true });

// Let's do a flood-fill from the 4 corners to only make the OUTER background transparent!
// This guarantees that any white text or white accents inside the logo are 100% preserved!
const width = info.width;
const height = info.height;
const isOuterBackground = new Uint8Array(width * height); // 0 or 1
const queue = [];

function isWhite(x, y) {
  const idx = (y * width + x) * 3;
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  return r >= 235 && g >= 235 && b >= 235;
}

// Push 4 corners
const corners = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];
for (const [cx, cy] of corners) {
  if (isWhite(cx, cy)) {
    isOuterBackground[cy * width + cx] = 1;
    queue.push(cx, cy);
  }
}

// Flood fill
let head = 0;
while (head < queue.length) {
  const x = queue[head++];
  const y = queue[head++];

  const neighbors = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];

  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const nIdx = ny * width + nx;
      if (!isOuterBackground[nIdx] && isWhite(nx, ny)) {
        isOuterBackground[nIdx] = 1;
        queue.push(nx, ny);
      }
    }
  }
}

console.log(`Flood fill marked ${queue.length / 2} pixels as outer background out of ${width * height} (${((queue.length / 2) / (width * height) * 100).toFixed(1)}%)`);

// Build RGBA buffer with preserved internal white elements
const rgba = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pIdx = y * width + x;
    const srcIdx = pIdx * 3;
    const dstIdx = pIdx * 4;

    rgba[dstIdx] = data[srcIdx];
    rgba[dstIdx + 1] = data[srcIdx + 1];
    rgba[dstIdx + 2] = data[srcIdx + 2];

    if (isOuterBackground[pIdx]) {
      rgba[dstIdx + 3] = 0; // Outer background transparent!
    } else {
      rgba[dstIdx + 3] = 255; // Inner elements 100% solid!
    }
  }
}

// Save clean logo
await sharp(rgba, { raw: { width, height, channels: 4 } })
  .trim()
  .png({ compressionLevel: 9 })
  .toFile(path.join(__dirname, '..', 'public', 'thg-logo.png'));

console.log('Saved perfect flood-filled public/thg-logo.png!');
