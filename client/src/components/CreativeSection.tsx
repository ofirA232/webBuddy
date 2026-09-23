import { useReducedMotion } from "motion/react";

import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/ui/animated-gallery";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { useIsMobile } from "@/hooks/use-mobile";
import { creativeWall, splitIntoColumns, type CreativePiece } from "@/data/creativeData";
import { cn } from "@/lib/utils";

/**
 * Four tiles is what fits a column at roughly 16/9 each, which is the shape the wall
 * is built around. More than this and the pieces are too small to read.
 */
const MAX_PER_COLUMN = 4;

/**
 * Each column's vertical offset, as a share of its own height: the first value holds
 * until the wall is upright, the second is where it drifts to. The middle column sits
 * higher throughout, which is what stops the wall reading as a flat table.
 */
const COLUMN_DRIFT: string[][] = [
  ["-8%", "0%"],
  ["-18%", "-10%"],
  ["-8%", "0%"],
];

function Piece({ piece, index, flat }: { piece: CreativePiece; index: number; flat: boolean }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] shadow-lg shadow-black/40",
        flat ? "w-full" : "min-h-0 flex-none",
      )}
      // In the wall every tile takes the same fixed share of the column, so a column
      // holding two pieces shows two normal tiles rather than two stretched slabs.
      // Flat (reduced motion) there is no frame to fill, so each tile keeps its own shape.
      style={flat ? { aspectRatio: piece.ratio } : { height: `${100 / MAX_PER_COLUMN}%` }}
    >
      {piece.src ? (
        <ResponsiveImage
          src={piece.src}
          small={piece.small}
          widths={[480, 900]}
          sizes="(min-width: 768px) 30vw, 45vw"
          alt={piece.alt}
          className={cn("block size-full", piece.fit === "contain" ? "object-contain p-2" : "object-cover")}
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
  const isMobile = useIsMobile();
  const reduce = useReducedMotion() ?? false;
  const columnCount = isMobile ? 2 : 3;
  const columns = splitIntoColumns(creativeWall.slice(0, columnCount * MAX_PER_COLUMN), columnCount);

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
            מעבר לקוד יש את החלק שרואים קודם: באנרים, קריאייטיב לקמפיינים, חומרים לרשתות
            ונכסים ויזואליים שליוו את הפרויקטים. זה מבחר מהם.
          </p>
        </ContainerAnimated>
      </ContainerStagger>

      <ContainerScroll className={reduce ? "relative" : "h-[300vh]"}>
        <ContainerSticky
          className={cn(
            "px-4 pb-16 pt-10 sm:px-6 md:pb-24 lg:px-8",
            reduce ? "" : "h-svh",
          )}
        >
          <GalleryContainer
            className={cn(
              "mx-auto max-w-7xl gap-2 sm:gap-3",
              columnCount === 2 ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            {columns.map((column, columnIndex) => (
              <GalleryCol
                key={columnIndex}
                yRange={COLUMN_DRIFT[columnIndex % COLUMN_DRIFT.length]}
                // Taller than the frame on purpose: the wall runs past the top and bottom
                // edges, so the drift never uncovers empty space.
                // justify-center keeps a part-filled column sitting in the middle of the frame.
                className={cn("gap-2 sm:gap-3", reduce ? "h-auto" : "h-[130%] justify-center")}
              >
                {column.map((piece, i) => (
                  <Piece
                    key={piece.id}
                    piece={piece}
                    index={columnIndex * MAX_PER_COLUMN + i}
                    flat={reduce}
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
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"
              />
            </>
          )}
        </ContainerSticky>
      </ContainerScroll>
    </section>
  );
}
