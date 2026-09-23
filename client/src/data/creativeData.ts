import dimensions from "@/assets/creative/manifest.json";

/**
 * The creative wall reads its own folder, because it is meant to hold a lot of pieces
 * and editing a list by hand for each one would not survive the first batch.
 *
 * To add work:
 *   1. drop the files into `assets-src/creative/` (png / jpg / webp, any shape)
 *   2. run `npm run images`
 *
 * Filename order is display order, so a `01-`, `02-` prefix controls the layout.
 * The filename is also the default alt text; add an entry to ALT below for anything
 * that deserves a real description.
 */

export type CreativePiece = {
  id: string;
  /** Description for screen readers. The wall itself is captionless, like the design. */
  alt: string;
  src?: string;
  small?: string;
  /** width / height, from the manifest. Drives the fallback layout and the crop choice. */
  ratio: number;
  /** "cover" fills the tile and crops; "contain" letterboxes a piece a crop would ruin. */
  fit: "cover" | "contain";
};

/**
 * Per-piece overrides, keyed by filename without the extension. Everything is optional:
 *
 *   "summer-banner": { alt: "באנר קמפיין קיץ", fit: "contain" },
 */
const OVERRIDES: Record<string, { alt?: string; fit?: "cover" | "contain" }> = {};

const DEFAULT_RATIO = 4 / 5;

/** Below this the piece is portrait enough that a landscape tile would cut its head off. */
const CONTAIN_BELOW_RATIO = 0.9;

type Manifest = Record<string, { width: number; height: number }>;

const full = import.meta.glob("../assets/creative/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const nameOf = (path: string) => path.split("/").pop()!.replace(/\.webp$/, "");

/** `summer-campaign_v2` -> `Summer campaign v2`; Hebrew filenames pass through as written. */
function titleFromName(name: string) {
  const words = name.replace(/^\d+[-_.]/, "").replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function build(): CreativePiece[] {
  const manifest = dimensions as Manifest;
  const pieces: CreativePiece[] = [];

  for (const [path, url] of Object.entries(full)) {
    const name = nameOf(path);
    if (name.includes("@")) continue; // the @480 variant is the small source, not a piece

    const size = manifest[name];
    const ratio = size && size.height ? size.width / size.height : DEFAULT_RATIO;
    const override = OVERRIDES[name];
    pieces.push({
      id: name,
      alt: override?.alt ?? titleFromName(name),
      src: url,
      small: full[path.replace(/\.webp$/, "@480.webp")],
      ratio,
      fit: override?.fit ?? (ratio < CONTAIN_BELOW_RATIO ? "contain" : "cover"),
    });
  }

  return pieces.sort((a, b) => a.id.localeCompare(b.id, "he"));
}

/**
 * Shown until the folder has real work in it, so the section can be designed and
 * reviewed now. Mixed shapes on purpose: the wall has to hold a banner next to a
 * square post without either looking wrong.
 */
const PLACEHOLDERS: CreativePiece[] = [
  16 / 9, 1, 4 / 5, 3 / 4, 16 / 9, 1, 4 / 5, 16 / 9, 1, 3 / 4, 16 / 9, 4 / 5,
].map((ratio, i) => ({
  id: `placeholder-${i + 1}`,
  alt: "",
  ratio,
  fit: "cover" as const,
}));

export const creativePieces = build();

export const creativeWall = creativePieces.length > 0 ? creativePieces : PLACEHOLDERS;

export const hasCreativeWork = creativePieces.length > 0;

/** Round-robin, so the columns stay close in height whatever shapes come in. */
export function splitIntoColumns(pieces: CreativePiece[], count: number): CreativePiece[][] {
  const columns: CreativePiece[][] = Array.from({ length: count }, () => []);
  pieces.forEach((piece, i) => columns[i % count].push(piece));
  return columns;
}
