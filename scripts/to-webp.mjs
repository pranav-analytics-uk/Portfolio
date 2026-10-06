// Convert an image to WebP for the site.
// Usage (sharp is installed only for this run, not added to the project):
//   npm i --no-save sharp && node scripts/to-webp.mjs <input> <output.webp> [quality=86] [width]
import sharp from 'sharp';
const [, , input, output, q = '86', width] = process.argv;
let img = sharp(input);
if (width) img = img.resize({ width: Number(width) });
await img.webp({ quality: Number(q), effort: 6 }).toFile(output);
console.log(`wrote ${output}`);
