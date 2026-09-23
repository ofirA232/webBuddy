/**
 * Image pipeline: drop originals into assets-src/<set>/ and run `npm run images`.
 *
 *   assets-src/projects/<slug>.png  -> client/src/assets/projects/<slug>.webp (1280w) + <slug>@640.webp
 *   assets-src/skills/<key>.png     -> client/src/assets/skills/<key>.webp   (1280w) + <key>@640.webp
 *   assets-src/hero/<name>.jpg      -> client/src/assets/hero/<name>.webp    (960w)  + <name>@480.webp
 *   assets-src/creative/<name>.png  -> client/src/assets/creative/<name>.webp (900w) + <name>@480.webp
 *                                      plus manifest.json with each piece's dimensions
 *   assets-src/og.png|jpg           -> client/public/og.jpg (1200x630, cover)
 *
 * The creative set is read by folder: whatever is in it shows up on the site, in
 * filename order. Nothing else needs editing to add a piece.
 *
 * Output is committed; sharp is only needed at authoring time. Re-running is idempotent.
 */
import sharp from "sharp";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const SOURCE_EXT = /\.(png|jpe?g|webp|avif)$/i;

const sets = [
  { src: "assets-src/projects", out: "client/src/assets/projects", widths: [1280, 640] },
  { src: "assets-src/skills", out: "client/src/assets/skills", widths: [1280, 640] },
  { src: "assets-src/hero", out: "client/src/assets/hero", widths: [960, 480] },
  // The creative wall is picked up by folder, not by hand, so the manifest carries the
  // aspect ratio of every piece: the columns can reserve the right space before the
  // images load, which a parallax wall of lazy images otherwise jitters through.
  {
    src: "assets-src/creative",
    out: "client/src/assets/creative",
    widths: [900, 480],
    manifest: true,
  },
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

async function processSet({ src, out, widths, manifest }) {
  const srcDir = path.join(root, src);
  const outDir = path.join(root, out);
  const files = await listImages(srcDir);
  if (files.length === 0) {
    console.log(`  (no images in ${src})`);
    // An empty manifest still has to exist, or the module that imports it fails to build.
    if (manifest) await writeManifest(outDir, out, {});
    return;
  }
  await mkdir(outDir, { recursive: true });

  const dimensions = {};

  for (const file of files) {
    const name = file.replace(SOURCE_EXT, "");
    const input = path.join(srcDir, file);
    const inputSize = (await stat(input)).size;

    for (const [i, width] of widths.entries()) {
      const outName = i === 0 ? `${name}.webp` : `${name}@${width}.webp`;
      const output = path.join(outDir, outName);
      const info = await sharp(input)
        .rotate() // respect EXIF orientation
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      // The first width is the one the manifest describes; `info` is post-rotate, so a
      // portrait photo shot sideways reports the shape it will actually render at.
      if (i === 0) dimensions[name] = { width: info.width, height: info.height };
      const outSize = (await stat(output)).size;
      console.log(`  ${src}/${file} (${kb(inputSize)}) -> ${out}/${outName} (${kb(outSize)})`);
    }
  }

  if (manifest) await writeManifest(outDir, out, dimensions);
}

async function writeManifest(outDir, out, dimensions) {
  await mkdir(outDir, { recursive: true });
  const output = path.join(outDir, "manifest.json");
  // Sorted keys so re-running produces a byte-identical file and a clean diff.
  const sorted = Object.fromEntries(Object.entries(dimensions).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(output, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
  console.log(`  ${out}/manifest.json (${Object.keys(sorted).length} entries)`);
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
