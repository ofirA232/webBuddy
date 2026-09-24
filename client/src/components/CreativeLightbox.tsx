import { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { embedUrl, type CreativePiece } from "@/data/creativeData";

/**
 * The player for a piece that lives on YouTube or Facebook.
 *
 * The wall shows a poster and nothing else: either platform pulls in around a megabyte
 * of player before it shows a single frame, and a wall of a dozen of them would cost
 * more than the whole rest of the page. The iframe is only created once someone asks
 * for it, and is destroyed again on close, which also stops playback.
 *
 * Open and close are animated in index.css (.lightbox-*): Radix keeps the content mounted
 * until its exit animation ends, so the last piece is held on to for that moment rather
 * than the player emptying out while it fades.
 */
export function CreativeLightbox({
  piece,
  onClose,
}: {
  piece: CreativePiece | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastPiece = useRef(piece);
  if (piece) lastPiece.current = piece;
  const shown = piece ?? lastPiece.current;

  const open = piece !== null && embedUrl(piece) !== null;
  const src = shown ? embedUrl(shown) : null;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm" />
        <Dialog.Content
          dir="rtl"
          // Focus would otherwise land in the iframe, and a cross-origin player swallows
          // every key it gets — including the Escape that is meant to close this.
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            closeRef.current?.focus();
          }}
          // The content fills the screen so the player can be centred, which leaves Radix
          // with no "outside" to detect. Clicking the padding around the player is that.
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className="lightbox-content fixed inset-0 z-[100] flex items-center justify-center p-4 focus:outline-none sm:p-8"
        >
          <Dialog.Title className="sr-only">{shown?.alt ?? "סרטון"}</Dialog.Title>

          {shown && src && (
            <div
              // Fits the viewport whichever way round the video is: a vertical short is
              // bounded by the height, a 16:9 by the width. dvh, so a phone's address bar
              // does not push the bottom of the player off screen.
              className="lightbox-player max-h-full max-w-full overflow-hidden rounded-xl bg-black shadow-2xl"
              style={{ aspectRatio: shown.ratio, width: `min(100%, calc((100dvh - 8rem) * ${shown.ratio}))` }}
            >
              <iframe
                // Keyed by the URL so switching pieces mounts a fresh player rather
                // than leaving the previous video loaded behind the new one.
                key={src}
                src={src}
                title={shown.alt}
                className="block size-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <Dialog.Close
            ref={closeRef}
            className="pressable absolute left-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white can-hover:hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-8 sm:top-8"
            aria-label="סגור"
          >
            <X className="size-5" aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
