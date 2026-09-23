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
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);

/** Facebook serves its embed page differently to a client that does not look like one. */
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const root = path.resolve(import.meta.dirname, "..");
const SOURCE_EXT = /\.(png|jpe?g|webp|avif)$/i;
const VIDEO_EXT = /\.(mp4|mov|m4v|webm|avi)$/i;
/** Listing files for work that lives on a video platform rather than in the folder. */
const VIDEO_LISTS = ["videos.txt", "youtube.txt"];

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
  // `<name>.poster.jpg` is the still for a video, not a piece of its own.
  const images = (await listFiles(srcDir, SOURCE_EXT)).filter((f) => !/\.poster\./i.test(f));
  const videos = video ? await listFiles(srcDir, VIDEO_EXT) : [];
  const hosted = video ? await readVideoList(srcDir) : [];

  if (images.length === 0 && videos.length === 0 && hosted.length === 0) {
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

  for (const entry of hosted) {
    const [posterWidth, posterSmall] = widths;
    const poster = await hostedPoster(entry, srcDir, outDir, posterWidth, posterSmall);
    pieces[entry.name] = {
      type: entry.kind,
      ...(entry.kind === "youtube" ? { videoId: entry.id } : { videoUrl: entry.url }),
      // The declared shape, not the thumbnail's: a vertical video's thumbnail is often
      // a 16:9 frame with the video sitting inside it. The long side is the one pinned
      // to 900, so the numbers describe the shape whichever way round it is.
      width: Math.round(entry.ratio >= 1 ? 900 : 900 * entry.ratio),
      height: Math.round(entry.ratio >= 1 ? 900 / entry.ratio : 900),
      poster,
    };
    const note = poster
      ? ""
      : entry.kind === "youtube"
        ? "(no poster; the page falls back to YouTube's own thumbnail)"
        : `(NO POSTER - add a file named ${entry.name}.poster.jpg beside the listing)`;
    console.log(`  ${entry.kind} ${entry.name} -> ${out}/${entry.name}.poster.webp ${note}`);
  }

  if (manifest) await writeManifest(outDir, out, pieces);
}

/**
 * `01-name = https://...` per line, `#` for comments, and an optional `| 4:5` to
 * declare a shape the link does not imply. YouTube and Facebook links both work.
 */
async function readVideoList(srcDir) {
  let text = null;
  let listName = null;
  for (const candidate of VIDEO_LISTS) {
    try {
      text = await readFile(path.join(srcDir, candidate), "utf8");
      listName = candidate;
      break;
    } catch {
      // try the next name
    }
  }
  if (text === null) return [];

  const entries = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const [left, ...rest] = line.split("=");
    if (rest.length === 0) {
      console.log(`  ${listName}: skipped, no "=" -> ${line.slice(0, 60)}`);
      continue;
    }
    const [urlPart, shapePart] = rest.join("=").split("|");
    const url = urlPart.trim();
    const id = youtubeId(url);
    const facebook = !id && FACEBOOK_HOST.test(url);
    if (!id && !facebook) {
      console.log(`  ${listName}: skipped, not a YouTube or Facebook link -> ${url.slice(0, 60)}`);
      continue;
    }

    // Vertical unless the link or the tag says otherwise: a Short and a Reel are
    // both vertical formats, and everything else defaults to widescreen.
    let ratio = VERTICAL_PATH.test(url) ? 9 / 16 : 16 / 9;
    if (shapePart) {
      const [w, h] = shapePart.trim().split(/[:/]/).map(Number);
      if (w > 0 && h > 0) ratio = w / h;
    }
    entries.push(
      id
        ? { name: left.trim(), kind: "youtube", id, ratio }
        : { name: left.trim(), kind: "facebook", url, ratio },
    );
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

const FACEBOOK_HOST = /facebook\.com|fb\.watch/i;
const VERTICAL_PATH = /\/shorts\/|\/reels?\//i;
const YOUTUBE_HOST = /youtube\.com|youtu\.be/i;

function youtubeId(url) {
  if (!YOUTUBE_HOST.test(url)) return null;
  const match = url.match(/(?:v=|\/shorts\/|\/embed\/|youtu\.be\/|\/live\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : null;
}

export function facebookEmbed(url) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
}

/**
 * Facebook publishes no thumbnail URL the way YouTube does, but its embed page carries
 * one. That image is signed and expires, so it is downloaded here rather than linked to.
 */
async function facebookThumbnail(url) {
  const response = await fetch(facebookEmbed(url), {
    headers: { "user-agent": BROWSER_UA },
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) return null;

  const html = await response.text();
  // t15.5256-10 is Facebook's path for a video's own still; the other scontent images
  // on the page are the posting page's avatar and chrome.
  const marker = html.indexOf("t15.5256-10");
  if (marker === -1) return null;
  const start = html.lastIndexOf("https", marker);
  if (start === -1) return null;
  let end = start;
  while (end < html.length && !'"\'\\ '.includes(html[end])) end += 1;
  const image = html.slice(start, end).replace(/&amp;/g, "&");

  const file = await fetch(image, {
    headers: { "user-agent": BROWSER_UA },
    signal: AbortSignal.timeout(25000),
  });
  return file.ok ? Buffer.from(await file.arrayBuffer()) : null;
}

/**
 * The poster comes from a file beside the listing if there is one, and otherwise from
 * the platform. Fetching is best effort: if it fails the entry is still written, and a
 * YouTube piece falls back to YouTube's own thumbnail at runtime.
 */
async function hostedPoster(entry, srcDir, outDir, width, small) {
  let input = null;

  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const candidate = path.join(srcDir, `${entry.name}.poster.${ext}`);
    try {
      await stat(candidate);
      input = candidate;
      break;
    } catch {
      // keep looking
    }
  }

  if (!input && entry.kind === "youtube") {
    for (const quality of ["maxresdefault", "sddefault", "hqdefault"]) {
      try {
        const response = await fetch(`https://i.ytimg.com/vi/${entry.id}/${quality}.jpg`, {
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) continue;
        input = Buffer.from(await response.arrayBuffer());
        break;
      } catch {
        // offline, blocked, or no such thumbnail: try the next size, then give up
      }
    }
  }

  if (!input && entry.kind === "facebook") {
    try {
      input = await facebookThumbnail(entry.url);
    } catch {
      // offline, or the post is not public: the caller reports the missing poster
    }
  }

  if (!input) return false;

  for (const [i, w] of [width, small].entries()) {
    const outName = i === 0 ? `${entry.name}.poster.webp` : `${entry.name}.poster@${w}.webp`;
    await sharp(input)
      // Cropped to the declared shape, so a vertical video does not show as a
      // letterboxed 16:9 frame inside a vertical tile.
      .resize({ width: w, height: Math.round(w / entry.ratio), fit: "cover" })
      .webp({ quality: 80 })
      .toFile(path.join(outDir, outName));
  }
  return true;
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
