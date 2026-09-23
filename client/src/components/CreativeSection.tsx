import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Play } from "lucide-react";

import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/ui/animated-gallery";
import { CreativeLightbox } from "@/components/CreativeLightbox";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { creativeWall, packColumns, type CreativePiece } from "@/data/creativeData";
import { cn } from "@/lib/utils";

/**
 * How far the wall runs past the top and bottom of its frame. The columns have to
 * overflow, or the drift uncovers empty space at one edge or the other.
 */
const OVERFLOW = 1.35;

/** Fallback packing target before the frame has been measured, in column widths. */
const FALLBACK_UNITS = 2.2;

/**
 * The tallest a tile may be, as a share of the frame. A piece taller than the frame
 * can never be seen whole however far the wall drifts, so its tile is capped here and
 * the piece is fitted inside it rather than cropped — a story or a poster keeps its
 * whole composition, with the tile's own dark gutter either side.
 */
const TALLEST_TILE = 0.88;

/** Fallback cap before the frame has been measured (roughly a 2:3 portrait). */
const FALLBACK_MIN_RATIO = 0.66;

/** Tailwind needs the whole class name in the source, so these cannot be built up. */
const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

/** A column starts this far down, so its first tile clears the frame's top fade. */
const EDGE_PAD = 3;

/**
 * Extra travel per column, so the columns do not move in lockstep and a set of pieces
 * that are all the same shape does not line up into plain rows.
 */
const STAGGER = [0, 3.5, 1.2, 4.6];

/**
 * How far a column drifts, as a share of its own height.
 *
 * The travel is what reveals the part of a column that starts below the frame, so it
 * is derived from that column's actual packed height rather than fixed: whatever it
 * ended up holding, it moves exactly far enough for its last tile to come into frame.
 */
function driftFor(columnUnits: number, frameUnits: number, index: number): string[] {
  const overflow = Math.max(columnUnits - frameUnits, 0);
  const travel = (overflow / columnUnits) * 100 + EDGE_PAD + STAGGER[index % STAGGER.length];
  return [`${EDGE_PAD}%`, `-${travel.toFixed(1)}%`];
}

/**
 * The drift finishes before the section does, so the wall holds still at the end with
 * its last pieces in frame instead of sliding past them as it unsticks.
 */
const DRIFT_RANGE: [number, number] = [0.45, 0.85];

/**
 * Narrower columns fit more work on the one screen the wall gets, and keep a square
 * social post from towering over a banner beside it. Four is as far as it goes before
 * the pieces stop being readable.
 */
const COLUMN_BREAKPOINTS: [query: string, columns: number][] = [
  ["(min-width: 1280px)", 4],
  ["(min-width: 768px)", 3],
];

function useColumnCount() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const lists = COLUMN_BREAKPOINTS.map(([query]) => window.matchMedia(query));
    const update = () => {
      const match = COLUMN_BREAKPOINTS.findIndex((_, i) => lists[i].matches);
      setCount(match === -1 ? 2 : COLUMN_BREAKPOINTS[match][1]);
    };
    update();
    lists.forEach((list) => list.addEventListener("change", update));
    return () => lists.forEach((list) => list.removeEventListener("change", update));
  }, []);

  return count;
}

/**
 * How tall a column should be packed, expressed in multiples of its own width, so the
 * same number works at any screen size. Measured from the rendered frame rather than
 * assumed, because the frame is a viewport height minus whatever padding is in force.
 */
function useFrameMetrics(columnCount: number, gapPx: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    units: FALLBACK_UNITS,
    minRatio: FALLBACK_MIN_RATIO,
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      // offsetWidth/Height are the untransformed box, which is what we want: the
      // wall is measured as it is laid out, not as the 3D reveal currently shows it.
      const { offsetWidth, offsetHeight } = element;
      const columnWidth = (offsetWidth - gapPx * (columnCount - 1)) / columnCount;
      if (columnWidth > 0 && offsetHeight > 0) {
        setMetrics({
          units: (offsetHeight * OVERFLOW) / columnWidth,
          minRatio: columnWidth / (offsetHeight * TALLEST_TILE),
        });
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [columnCount, gapPx]);

  return { ref, ...metrics };
}

/**
 * Plays only while the tile is on screen, and only if the visitor has not asked for
 * less motion — a wall of looping video is exactly the thing that setting is for.
 * `preload="none"` keeps every clip off the wire until it is actually going to play.
 */
function VideoTile({
  piece,
  reduce,
  fitClass,
  sizes,
}: {
  piece: CreativePiece;
  reduce: boolean;
  fitClass: string;
  sizes: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (power saving, data saver); the poster stays.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  if (reduce && !started) {
    return <PosterButton piece={piece} fitClass={fitClass} sizes={sizes} onPlay={() => setStarted(true)} />;
  }

  return (
    <video
      ref={ref}
      src={piece.video}
      poster={piece.src}
      muted
      loop
      playsInline
      preload="none"
      controls={reduce}
      autoPlay={reduce && started}
      aria-label={piece.alt}
      className={cn("block size-full", fitClass)}
    />
  );
}

/** A still of the piece with a play badge over it, which is all a tile shows until asked. */
function PosterButton({
  piece,
  fitClass,
  sizes,
  onPlay,
}: {
  piece: CreativePiece;
  fitClass: string;
  sizes: string;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
    >
      <ResponsiveImage
        src={piece.src!}
        small={piece.small}
        widths={[480, 900]}
        sizes={sizes}
        alt={piece.alt}
        className={cn("block size-full", fitClass)}
        loading="lazy"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-200 can-hover:group-hover:bg-black/50">
        <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-black transition-transform duration-200 ease-out-strong can-hover:group-hover:scale-110">
          <Play className="size-5 translate-x-[1px] fill-current" aria-hidden="true" />
        </span>
      </span>
      <span className="sr-only">נגן את הסרטון: {piece.alt}</span>
    </button>
  );
}

type WallPiece = CreativePiece & {
  /** The tile's shape: the piece's own, unless that would not fit the frame. */
  displayRatio: number;
  fit: "cover" | "contain";
};

function Piece({
  piece,
  index,
  reduce,
  sizes,
  onOpen,
}: {
  piece: WallPiece;
  index: number;
  reduce: boolean;
  sizes: string;
  onOpen: (piece: WallPiece) => void;
}) {
  const fitClass = piece.fit === "contain" ? "object-contain" : "object-cover";
  return (
    // Every tile is the shape of its own piece, so a banner, a square post and a story
    // each keep their proportions instead of being cropped to a common tile.
    <div
      className="w-full flex-none overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] shadow-lg shadow-black/40"
      style={{ aspectRatio: piece.displayRatio }}
    >
      {piece.kind === "youtube" ? (
        <PosterButton piece={piece} fitClass={fitClass} sizes={sizes} onPlay={() => onOpen(piece)} />
      ) : piece.kind === "video" && piece.video ? (
        <VideoTile piece={piece} reduce={reduce} fitClass={fitClass} sizes={sizes} />
      ) : piece.src ? (
        <ResponsiveImage
          src={piece.src}
          small={piece.small}
          widths={[480, 900]}
          sizes={sizes}
          alt={piece.alt}
          className={cn("block size-full", fitClass)}
          // The wall sits well below the fold; nothing in it is worth preloading.
          loading="lazy"
        />
      ) : (
        // Placeholder tiles alternate so an empty wall still reads as designed.
        <div
          aria-hidden="true"
          className={cn("size-full", index % 3 === 0 ? "media-placeholder" : "media-placeholder--panel")}
        />
      )}
    </div>
  );
}

export function CreativeSection() {
  const [playing, setPlaying] = useState<WallPiece | null>(null);
  const columnCount = useColumnCount();
  const reduce = useReducedMotion() ?? false;
  const gapPx = columnCount === 2 ? 8 : 12; // matches gap-2 / sm:gap-3

  const { ref: gridRef, units, minRatio } = useFrameMetrics(columnCount, gapPx);

  const wall: WallPiece[] = creativeWall.map((piece) => {
    // Flat there is no frame, so nothing needs capping and nothing needs fitting.
    const displayRatio = reduce ? piece.ratio : Math.max(piece.ratio, minRatio);
    return {
      ...piece,
      displayRatio,
      fit: displayRatio > piece.ratio ? "contain" : "cover",
    };
  });

  // Flat, there is no frame to fill, so everything is shown rather than packed to fit.
  const { columns, heights } = packColumns(
    wall,
    columnCount,
    reduce ? Infinity : units,
    (piece) => piece.displayRatio,
  );
  const frameUnits = units / OVERFLOW;
  // A tile is one column wide, and the grid stops growing at max-w-7xl (1280px).
  const sizes = `(min-width: 1344px) ${Math.round(1280 / columnCount)}px, ${Math.round(100 / columnCount)}vw`;

  return (
    // No `overflow-hidden` here: a clipping ancestor turns the sticky frame below into a
    // normal block, and the whole reveal scrolls away instead of holding.
    <section id="creative" dir="rtl" className="relative bg-black">
      {/* The same red wash the hero uses, so the wall belongs to the site rather than sitting on it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background: "radial-gradient(60% 60% at 50% 0%, rgb(var(--accent) / 0.28), transparent 70%)",
        }}
      />

      <ContainerStagger className="relative z-10 mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 md:pt-24 lg:px-8">
        <ContainerAnimated>
          <p className="section-eyebrow">קריאייטיב</p>
        </ContainerAnimated>
        <ContainerAnimated>
          <h2 className="mt-4 text-4xl font-light leading-tight tracking-tight text-white md:text-6xl">
            עבודות קריאייטיב
          </h2>
        </ContainerAnimated>
        <ContainerAnimated>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            מעבר לקוד יש את החלק שרואים קודם: קריאייטיב לרשתות, באנרים לקמפיינים,
            סרטונים ונכסים ויזואליים שליוו את המותגים שעבדתי איתם. זה מבחר מהם.
          </p>
        </ContainerAnimated>
      </ContainerStagger>

      <ContainerScroll className={reduce ? "relative" : "h-[300vh]"}>
        <ContainerSticky className={cn("px-4 pb-16 pt-10 sm:px-6 md:pb-24 lg:px-8", reduce ? "" : "h-svh")}>
          <GalleryContainer
            ref={gridRef}
            className={cn(
              "mx-auto max-w-7xl items-start gap-2 sm:gap-3",
              GRID_COLS[columnCount],
            )}
          >
            {columns.map((column, columnIndex) => (
              <GalleryCol
                key={columnIndex}
                yRange={driftFor(heights[columnIndex], frameUnits, columnIndex)}
                scrollRange={DRIFT_RANGE}
                className="gap-2 sm:gap-3"
              >
                {column.map((piece, i) => (
                  <Piece
                    key={piece.id}
                    piece={piece}
                    index={columnIndex * 5 + i}
                    reduce={reduce}
                    sizes={sizes}
                    onOpen={setPlaying}
                  />
                ))}
              </GalleryCol>
            ))}
          </GalleryContainer>

          {/* The frame clips the wall mid-tile at both edges; these dissolve the cut instead. */}
          {!reduce && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent"
              />
            </>
          )}
        </ContainerSticky>
      </ContainerScroll>

      <CreativeLightbox piece={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
