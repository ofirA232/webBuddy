import manifest from "@/assets/creative/manifest.json";

/**
 * The creative wall reads its own folder, because it is meant to hold a lot of pieces
 * and editing a list by hand for each one would not survive the first batch.
 *
 * To add work:
 *   1. drop the files into `assets-src/creative/` — stills or video, any shape
 *   2. run `npm run images`
 *
 * Filename order is display order, so a `01-`, `02-` prefix controls the layout.
 * The filename is also the default alt text; add an entry to OVERRIDES below for
 * anything that deserves a real description.
 */

export type CreativePiece = {
  id: string;
  kind: "image" | "video" | "youtube" | "facebook";
  /** Description for screen readers. The wall itself is captionless, like the design. */
  alt: string;
  /** Still, or the poster frame of a video. */
  src?: string;
  small?: string;
  /** The video file itself, for `kind: "video"`. */
  video?: string;
  /** The YouTube video id, for `kind: "youtube"`. */
  youtubeId?: string;
  /** The original post URL, for `kind: "facebook"`. */
  videoUrl?: string;
  /** width / height, from the manifest, so a tile is the shape of its own piece. */
  ratio: number;
};

/**
 * Per-piece overrides, keyed by filename without the extension:
 *
 *   "summer-banner": { alt: "באנר קמפיין קיץ" },
 */
const OVERRIDES: Record<string, { alt?: string }> = {};

const DEFAULT_RATIO = 4 / 5;

type ManifestEntry = {
  type?: "image" | "video" | "youtube" | "facebook";
  width: number;
  height: number;
  /** For a hosted video: how to address it, and whether a poster was written locally. */
  videoId?: string;
  videoUrl?: string;
  poster?: boolean;
};

const HOSTED = ["youtube", "facebook"] as const;

const assets = import.meta.glob("../assets/creative/*.{webp,mp4}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const byName: Record<string, string> = {};
for (const [path, url] of Object.entries(assets)) {
  byName[path.split("/").pop()!] = url;
}

/** `summer-campaign_v2` -> `Summer campaign v2`; Hebrew filenames pass through as written. */
function titleFromName(name: string) {
  const words = name.replace(/^\d+[-_.]/, "").replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function build(): CreativePiece[] {
  const entries = Object.entries(manifest as Record<string, ManifestEntry>);

  const pieces: CreativePiece[] = entries.map(([name, entry]) => {
    const kind: CreativePiece["kind"] =
      entry.type === "video" || entry.type === "youtube" || entry.type === "facebook"
        ? entry.type
        : "image";
    // Anything with a moving picture is represented by a poster frame; a still is itself.
    const stem = kind === "image" ? name : `${name}.poster`;
    return {
      id: name,
      kind,
      alt: OVERRIDES[name]?.alt ?? titleFromName(name),
      // A YouTube entry whose poster could not be fetched falls back to YouTube's own
      // thumbnail, so the wall still shows the piece rather than an empty tile.
      src:
        byName[`${stem}.webp`] ??
        (kind === "youtube" && entry.videoId ? youtubeThumbnail(entry.videoId) : undefined),
      small: byName[`${stem}@480.webp`],
      video: kind === "video" ? byName[`${name}.mp4`] : undefined,
      youtubeId: kind === "youtube" ? entry.videoId : undefined,
      videoUrl: kind === "facebook" ? entry.videoUrl : undefined,
      ratio: entry.height ? entry.width / entry.height : DEFAULT_RATIO,
    };
  });

  // Anything the manifest lists but the folder no longer holds is a stale entry.
  return pieces.filter((p) => p.src).sort((a, b) => a.id.localeCompare(b.id, "he"));
}

const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/** True for anything the lightbox can play, which is everything not hosted here. */
export const isHosted = (piece: CreativePiece) =>
  (HOSTED as readonly string[]).includes(piece.kind);

/** The player URL for a piece, or null if it is not a hosted video. */
export function embedUrl(piece: CreativePiece): string | null {
  if (piece.kind === "youtube" && piece.youtubeId) {
    // nocookie, and no related videos from other channels at the end.
    return `https://www.youtube-nocookie.com/embed/${piece.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (piece.kind === "facebook" && piece.videoUrl) {
    const href = encodeURIComponent(piece.videoUrl);
    return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=true`;
  }
  return null;
}

/**
 * Shown until the folder has real work in it, so the section can be designed and
 * reviewed now. Mixed shapes on purpose: the wall has to hold a banner next to a
 * square post without either looking wrong.
 */
const PLACEHOLDERS: CreativePiece[] = [
  16 / 9, 1, 4 / 5, 3 / 4, 16 / 9, 9 / 16, 1, 4 / 5, 16 / 9, 1, 3 / 4, 4 / 5, 16 / 9, 1, 9 / 16,
].map((ratio, i) => ({
  id: `placeholder-${i + 1}`,
  kind: "image" as const,
  alt: "",
  ratio,
}));

export const creativePieces = build();

export const creativeWall = creativePieces.length > 0 ? creativePieces : PLACEHOLDERS;

export const hasCreativeWork = creativePieces.length > 0;

/**
 * Fills `count` columns to roughly `targetUnits` tall, where one unit is the column's
 * own width — so the packing is the same whatever the screen size.
 *
 * Each piece goes to whichever column is currently shortest, which is what keeps the
 * columns level when the pieces are all different shapes. Filename order is kept
 * within a column, which is as much of it as a masonry layout can honour.
 */
export function packColumns<T>(
  pieces: T[],
  count: number,
  targetUnits: number,
  /** The shape each piece is actually laid out at, which may be capped to fit the frame. */
  ratioOf: (piece: T) => number,
): { columns: T[][]; heights: number[] } {
  const columns: T[][] = Array.from({ length: count }, () => []);
  const heights = new Array(count).fill(0);
  // Some slack past the target, or a tall piece could never be placed at all.
  const limit = targetUnits * 1.2;

  for (const piece of pieces) {
    if (heights.every((h) => h >= targetUnits)) break; // the wall is full
    const height = 1 / ratioOf(piece); // tile height, as a share of column width
    const shortest = heights.indexOf(Math.min(...heights));
    // A piece that would push its column well past the others is left out rather than
    // making one column tower over the rest.
    if (heights[shortest] + height > limit) continue;
    columns[shortest].push(piece);
    heights[shortest] += height;
  }

  return { columns, heights };
}
