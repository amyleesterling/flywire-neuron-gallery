import { type ImgHTMLAttributes } from "react";

const BASE = import.meta.env.BASE_URL;

type PicProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  /** Original filename, e.g. "50_largest_neurons.png" — without the flywire/ prefix. */
  filename: string;
  /** `sizes` attribute for the source srcsets. Default targets typical card layouts. */
  sizes?: string;
  /** Override the JPG fallback width (defaults to 1920). Use 960 for tiny thumbnails. */
  fallbackWidth?: 960 | 1920 | 3840;
};

/**
 * Renders a `<picture>` with AVIF + WebP + JPG fallback at 960/1920/3840 widths,
 * sourced from public/flywire/opt/. The bulk-encoded variants are produced by
 * scripts/optimize-images.mjs in the source repo (hidden-worlds).
 *
 * The wrapper picture uses `display: contents` so it doesn't disrupt the
 * surrounding flex/grid layout — the `<img>` inside receives all className,
 * sizing, and event props.
 */
export function Pic({
  filename,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading = "lazy",
  decoding = "async",
  fallbackWidth = 1920,
  ...rest
}: PicProps) {
  const base = filename.replace(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/, "");
  const enc = encodeURIComponent(base);
  const root = `${BASE}flywire/opt/`;

  const avifSrcSet = `${root}${enc}-960.avif 960w, ${root}${enc}-1920.avif 1920w, ${root}${enc}-3840.avif 3840w`;
  const webpSrcSet = `${root}${enc}-960.webp 960w, ${root}${enc}-1920.webp 1920w, ${root}${enc}-3840.webp 3840w`;
  const jpgFallback = `${root}${enc}-${fallbackWidth}.jpg`;

  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img src={jpgFallback} alt={alt} loading={loading} decoding={decoding} {...rest} />
    </picture>
  );
}
