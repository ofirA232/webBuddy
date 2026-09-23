/**
 * Asset pipeline: drop originals into assets-src/<set>/ and run `npm run images`.
 *
 *   assets-src/projects/<slug>.png  -> client/src/assets/projects/<slug>.webp (1280w) + <slug>@640.webp
 *   assets-src/skills/<key>.png     -> client/src/assets/skills/<key>.webp   (1280w) + <key>@640.webp
 *   assets-src/hero/<name>.jpg      -> client/src/assets/hero/<name>.webp    (960w)  + <name>@480.webp
 *   assets-src/creative/<name>.png  -> client/src/assets/creative/<name>.webp (900w) + <name>@480.webp
 *   assets-src/creative/<name>.mp4  -> client/src/assets/creative/<name>.mp4  (900w, muted)
 *                                      + <name>.poster.webp / .poster@480.webp
 *                                      plus manifest.json describing every piece
 *   assets-src/og.png|jpg           -> client/public/og.jpg (1200x630, cover)
 *
 * The creative set is read by folder: whatever is in it shows up on the site, in
 * filename order. Nothing else needs editing to add a piece.
 *
 * Video needs ffmpeg on PATH. Without it the images are still processed and the
 * videos are listed as skipped, rather than the whole run failing.
 *
 * Output is committed; sharp and ffmpeg are only needed at authoring time.
 * Re-running is idempotent.
 */
import sharp from "sharp";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);

const root = path.resolve(import.meta.dirname, "..");
const SOURCE_EXT = /\.(png|jpe?g|webp|avif)$/i;
const VIDEO_EXT = /\.(mp4|mov|m4v|webm|avi)$/i;

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
    video: true,
  },
];

async function listFiles(dir, pattern) {
  try {
    const entries = await readdir(dir);
    return entries.filter((f) => pattern.test(f)).sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

let ffmpegChecked;
/** ffmpeg is optional: the run degrades to images-only rather than failing. */
async function hasFfmpeg() {
  if (ffmpegChecked === undefined) {
    ffmpegChecked = await run("ffprobe", ["-version"]).then(
      () => true,
      () => false,
    );
  }
  return ffmpegChecked;
}

async function probeVideo(input) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json",
    input,
  ]);
  const data = JSON.parse(stdout);
  const stream = data.streams?.[0] ?? {};
  return {
    width: Number(stream.width) || 0,
    height: Number(stream.height) || 0,
    duration: Math.round((Number(data.format?.duration) || 0) * 10) / 10,
  };
}

async function processSet({ src, out, widths, manifest, video }) {
  const srcDir = path.join(root, src);
  const outDir = path.join(root, out);
  const images = await listFiles(srcDir, SOURCE_EXT);
  const videos = video ? await listFiles(srcDir, VIDEO_EXT) : [];

  if (images.length === 0 && videos.length === 0) {
    console.log(`  (nothing in ${src})`);
    // An empty manifest still has to exist, or the module that imports it fails to build.
    if (manifest) await writeManifest(outDir, out, {});
    return;
  }
  await mkdir(outDir, { recursive: true });

  const pieces = {};

  for (const file of images) {
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
      if (i === 0) pieces[name] = { type: "image", width: info.width, height: info.height };
      const outSize = (await stat(output)).size;
      console.log(`  ${src}/${file} (${kb(inputSize)}) -> ${out}/${outName} (${kb(outSize)})`);
    }
  }

  for (const file of videos) {
    const name = file.replace(VIDEO_EXT, "");
    const input = path.join(srcDir, file);

    if (!(await hasFfmpeg())) {
      console.log(`  ${src}/${file} -> SKIPPED (ffmpeg not on PATH)`);
      continue;
    }

    const inputSize = (await stat(input)).size;
    const source = await probeVideo(input);
    const [posterWidth, posterSmall] = widths;

    // Capped at the width a tile is ever shown at, and stripped of audio: the wall
    // plays these muted on a loop, so the audio track is bytes nobody will ever hear.
    const output = path.join(outDir, `${name}.mp4`);
    await run("ffmpeg", [
      "-y", "-loglevel", "error",
      "-i", input,
      "-an",
      "-vf", `scale='min(${posterWidth},iw)':-2`,
      "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p",
      "-crf", "26", "-preset", "slow",
      "-movflags", "+faststart",
      output,
    ]);
    const outSize = (await stat(output)).size;
    console.log(`  ${src}/${file} (${kb(inputSize)}) -> ${out}/${name}.mp4 (${kb(outSize)})`);

    // A poster means the tile shows the piece before a byte of video is fetched.
    // One second in, because frame zero is so often black.
    const frame = path.join(outDir, `${name}.poster.png`);
    await run("ffmpeg", [
      "-y", "-loglevel", "error",
      "-ss", String(Math.min(1, (source.duration || 1) / 2)),
      "-i", output,
      "-frames:v", "1",
      frame,
    ]);
    for (const [i, width] of [posterWidth, posterSmall].entries()) {
      const posterName = i === 0 ? `${name}.poster.webp` : `${name}.poster@${width}.webp`;
      const info = await sharp(frame)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(outDir, posterName));
      if (i === 0) {
        pieces[name] = {
          type: "video",
          width: info.width,
          height: info.height,
          duration: source.duration,
        };
      }
    }
    await rm(frame, { force: true }); // the full-size frame was only a staging file
    console.log(`  ${src}/${file} -> ${out}/${name}.poster.webp (+@${posterSmall})`);
  }

  if (manifest) await writeManifest(outDir, out, pieces);
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
