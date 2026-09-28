// One-off maintenance tool: downloads the photos listed in
// product-data/image-sources.json and writes them to product-data/images/ as
// 800x800 WebP with metadata stripped. The output is committed. The seed,
// Docker and CI never run this (see docs/design-direction.md, "Product images").
//
//   npm run images:fetch            fetch files that don't exist yet
//   npm run images:fetch -- --force re-fetch everything
//
// A manifest entry may carry `crop`: a sharp gravity name such as "north", or
// { left, top } fractions (0-1) placing the square crop inside the photo.

const fs = require("fs");
const path = require("path");

const sharp = require("sharp");

const MANIFEST_PATH = path.join(__dirname, "..", "product-data", "image-sources.json");
const IMAGES_DIR = path.join(__dirname, "..", "product-data", "images");
const SIZE = 800;
const QUALITY = 80;

const force = process.argv.includes("--force");

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function toSquareWebp(source, crop) {
  const { width, height } = await sharp(source).metadata();
  if (Math.min(width, height) < SIZE * 1.5) {
    console.warn(`  source is only ${width}x${height}; the square crop needs ~${SIZE * 1.5}px on the short side`);
  }

  let pipeline = sharp(source);
  if (crop && typeof crop === "object") {
    const side = Math.min(width, height);
    pipeline = pipeline.extract({
      left: Math.round((width - side) * crop.left),
      top: Math.round((height - side) * crop.top),
      width: side,
      height: side,
    });
    pipeline = pipeline.resize(SIZE, SIZE);
  } else {
    pipeline = pipeline.resize(SIZE, SIZE, { fit: "cover", position: crop || "centre" });
  }

  // sharp drops EXIF/ICC metadata unless withMetadata() is called.
  return pipeline.webp({ quality: QUALITY }).toBuffer();
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  let fetched = 0;
  for (const entry of manifest) {
    const target = path.join(IMAGES_DIR, entry.file);
    if (!force && fs.existsSync(target)) {
      console.log(`skip   ${entry.file}`);
      continue;
    }

    const source = await download(entry.downloadUrl);
    const output = await toSquareWebp(source, entry.crop);
    fs.writeFileSync(target, output);
    fetched += 1;
    console.log(`fetch  ${entry.file} (${Math.round(output.length / 1024)} KB)`);
  }

  console.log(`Done: ${fetched} fetched, ${manifest.length - fetched} skipped.`);
}

main().catch((error) => {
  console.error("Image fetch failed:", error);
  process.exit(1);
});
