import { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { youtubeEmbedUrl, type CreativePiece } from "@/data/creativeData";

/**
 * The player for a piece that lives on YouTube.
 *
 * The wall shows a poster and nothing else: a YouTube embed pulls in around a megabyte
 * of player before it shows a single frame, and a wall of a dozen of them would cost
 * more than the whole rest of the page. The iframe is only created once someone asks
 * for it, and is destroyed again on close, which also stops playback.
 */
export function CreativeLightbox({
  piece,
  onClose,
}: {
  piece: CreativePiece | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = piece !== null && Boolean(piece.youtubeId);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 focus:outline-none sm:p-8"
        >
          <Dialog.Title className="sr-only">{piece?.alt ?? "סרטון"}</Dialog.Title>

          {piece?.youtubeId && (
            <div
              // Fits the viewport whichever way round the video is: a vertical short is
              // bounded by the height, a 16:9 by the width.
              className="max-h-full max-w-full overflow-hidden rounded-xl bg-black shadow-2xl"
              style={{ aspectRatio: piece.ratio, width: `min(100%, calc((100vh - 8rem) * ${piece.ratio}))` }}
            >
              <iframe
                // Keyed by id so switching pieces mounts a fresh player rather than
                // leaving the previous video loaded behind the new one.
                key={piece.youtubeId}
                src={youtubeEmbedUrl(piece.youtubeId)}
                title={piece.alt}
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
