/**
 * Image pipeline: drop originals into assets-src/<set>/ and run `npm run images`.
 *
 *   assets-src/projects/<slug>.png  -> client/src/assets/projects/<slug>.webp (1280w) + <slug>@640.webp
 *   assets-src/skills/<key>.png     -> client/src/assets/skills/<key>.webp   (1280w) + <key>@640.webp
 *   assets-src/hero/<name>.jpg      -> client/src/assets/hero/<name>.webp    (960w)  + <name>@480.webp
 *   assets-src/og.png|jpg           -> client/public/og.jpg (1200x630, cover)
 *
 * Output is committed; sharp is only needed at authoring time. Re-running is idempotent.
 */
import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const SOURCE_EXT = /\.(png|jpe?g|webp|avif)$/i;

const sets = [
  { src: "assets-src/projects", out: "client/src/assets/projects", widths: [1280, 640] },
  { src: "assets-src/skills", out: "client/src/assets/skills", widths: [1280, 640] },
  { src: "assets-src/hero", out: "client/src/assets/hero", widths: [960, 480] },
];

async function listImages(dir) {
  try {
    const entries = await readdir(dir);
    return entries.filter((f) => SOURCE_EXT.test(f));
  } catch {
    return [];
  }
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function processSet({ src, out, widths }) {
  const srcDir = path.join(root, src);
  const outDir = path.join(root, out);
  const files = await listImages(srcDir);
  if (files.length === 0) {
    console.log(`  (no images in ${src})`);
    return;
  }
  await mkdir(outDir, { recursive: true });

  for (const file of files) {
    const name = file.replace(SOURCE_EXT, "");
    const input = path.join(srcDir, file);
    const inputSize = (await stat(input)).size;

    for (const [i, width] of widths.entries()) {
      const outName = i === 0 ? `${name}.webp` : `${name}@${width}.webp`;
      const output = path.join(outDir, outName);
      await sharp(input)
        .rotate() // respect EXIF orientation
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      const outSize = (await stat(output)).size;
      console.log(`  ${src}/${file} (${kb(inputSize)}) -> ${out}/${outName} (${kb(outSize)})`);
    }
  }
}

async function processOg() {
  const candidates = ["assets-src/og.png", "assets-src/og.jpg", "assets-src/og.jpeg"];
  for (const rel of candidates) {
    const input = path.join(root, rel);
    try {
      await stat(input);
    } catch {
      continue;
    }
    const output = path.join(root, "client/public/og.jpg");
    await sharp(input).rotate().resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80 }).toFile(output);
    console.log(`  ${rel} -> client/public/og.jpg (${kb((await stat(output)).size)})`);
    return;
  }
  console.log("  (no assets-src/og.png; skipping Open Graph image)");
}

console.log("Optimizing images…");
for (const set of sets) {
  await processSet(set);
}
await processOg();
console.log("Done.");
