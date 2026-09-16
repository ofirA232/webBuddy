import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "srcSet" | "src" | "alt"> & {
  src: string;
  /** Smaller variant emitted by scripts/optimize-images.mjs (e.g. `<name>@640.webp`). */
  small?: string;
  /** Intrinsic widths of [small, src]; must match the pipeline output. */
  widths?: [number, number];
  alt: string;
  /** Marks the LCP image: eager loading and high fetch priority. */
  priority?: boolean;
};

export function ResponsiveImage({
  src,
  small,
  widths = [640, 1280],
  sizes = "100vw",
  alt,
  priority = false,
  loading,
  decoding = "async",
  ...rest
}: Props) {
  const priorityAttrs = priority ? { fetchpriority: "high" } : {};
  return (
    <img
      src={src}
      srcSet={small ? `${small} ${widths[0]}w, ${src} ${widths[1]}w` : undefined}
      sizes={small ? sizes : undefined}
      alt={alt}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding}
      {...priorityAttrs}
      {...rest}
    />
  );
}
