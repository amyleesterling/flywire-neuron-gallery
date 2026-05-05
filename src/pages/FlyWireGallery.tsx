import { Fragment, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  flyWireImages,
  FLYWIRE_GROUPS,
  FLYWIRE_GROUP_BLURBS,
  INTERACTIVE_VIEWS,
  creditFor,
  type FlyWireImage,
  type InteractiveView,
} from "../data/flywire";
import NeuropilBrain from "../components/NeuropilBrain";
import CircuitViewer from "../components/CircuitViewer";
import { FILENAME_TO_NEUROPILS, NEUROPILS } from "../data/neuropilMap";

const BASE = import.meta.env.BASE_URL;

function imgSrc(filename: string) {
  return `${BASE}flywire/${encodeURIComponent(filename)}`;
}

// ── Slug maps for shareable URLs ─────────────────────────────────────────
// Each image gets a stable slug derived from its title (with collision suffixing).
// URLs look like /?image=mushroom-body-output-neurons-central — back/forward
// buttons close and reopen the lightbox naturally.

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const SLUG_BY_FILENAME = new Map<string, string>();
const IMAGE_BY_SLUG = new Map<string, FlyWireImage>();
{
  const used = new Set<string>();
  for (const img of flyWireImages) {
    let slug = slugify(img.title) || "image";
    if (used.has(slug)) {
      let n = 2;
      while (used.has(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    used.add(slug);
    SLUG_BY_FILENAME.set(img.filename, slug);
    IMAGE_BY_SLUG.set(slug, img);
  }
}

// ── Lightbox ─────────────────────────────────────────────────────────────

function Lightbox({
  image,
  onClose,
  onPrev,
  onNext,
}: {
  image: FlyWireImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <motion.div
      key="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(4,6,12,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        key={image.filename}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col lg:flex-row gap-0 max-w-6xl w-full max-h-[90vh] glass-strong rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 min-h-0 flex items-center justify-center bg-black/30">
          <img
            src={imgSrc(image.filename)}
            alt={image.title}
            className="max-w-full max-h-[60vh] lg:max-h-[85vh] object-contain"
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0 p-6 lg:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 mb-3">
              {image.group}
            </p>
            <h2 className="font-display text-xl font-light leading-snug mb-5">
              {image.title}
            </h2>
            <p className="text-sm text-white/65 leading-relaxed">{image.caption}</p>
            {creditFor(image) && (
              <p className="mt-5 text-[11px] text-white/35 leading-relaxed italic">
                {creditFor(image)}
              </p>
            )}
            <button
              onClick={copyLink}
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/45 hover:text-white/80 transition group"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="opacity-70 group-hover:opacity-100 transition">
                <path d="M5.5 8.5l3-3M6 4l1.5-1.5a2.121 2.121 0 013 3L9 7M8 10l-1.5 1.5a2.121 2.121 0 01-3-3L5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {linkCopied ? "Link copied" : "Copy link to image"}
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 text-white/60 hover:text-white transition"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Prev / Next */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 text-white/60 hover:text-white transition"
          aria-label="Previous"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L3 7l6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-[336px] lg:right-[332px] top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 text-white/60 hover:text-white transition"
          aria-label="Next"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Image Card ────────────────────────────────────────────────────────────

function ImageCard({
  image,
  index,
  onClick,
  objectFit = "cover",
  onHover,
  onHoverEnd,
}: {
  image: FlyWireImage;
  index: number;
  onClick: () => void;
  objectFit?: "cover" | "contain";
  onHover?: (filename: string) => void;
  onHoverEnd?: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.04 * (index % 12), ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseEnter={() => onHover?.(image.filename)}
      onMouseLeave={() => onHoverEnd?.()}
      className="group text-left rounded-xl overflow-hidden glass hover:bg-white/[0.07] hover:ring-1 hover:ring-white/15 hover:-translate-y-0.5 transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <div className="aspect-video bg-white/[0.03] overflow-hidden relative">
        <img
          src={imgSrc(image.filename)}
          alt={image.title}
          loading="lazy"
          className={`w-full h-full ${objectFit === "contain" ? "object-contain" : "object-cover group-hover:scale-[1.03]"} transition-transform duration-500`}
        />
      </div>
      <div className="p-4">
        <p className="text-[11px] font-light leading-snug text-white/80 line-clamp-2">
          {image.title}
        </p>
        {image.neuronCount !== undefined && (
          <p className="text-[10px] text-white/40 mt-1.5 font-light">
            {image.neuronCount.toLocaleString()} neurons
          </p>
        )}
      </div>
    </motion.button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function FlyWireGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const imageParam = searchParams.get("image");
  const selected = imageParam ? IMAGE_BY_SLUG.get(imageParam) ?? null : null;

  const [copied, setCopied] = useState(false);
  const [hoveredNeuropils, setHoveredNeuropils] = useState<string[]>([]);
  const [hazardView, setHazardView] = useState<InteractiveView | null>(null);

  const selectedIndex = selected
    ? flyWireImages.findIndex((img) => img.filename === selected.filename)
    : -1;

  const openImage = useCallback(
    (img: FlyWireImage) => {
      const slug = SLUG_BY_FILENAME.get(img.filename);
      if (slug) setSearchParams({ image: slug });
    },
    [setSearchParams],
  );

  const closeImage = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const openNext = useCallback(() => {
    if (selectedIndex < flyWireImages.length - 1)
      openImage(flyWireImages[selectedIndex + 1]);
  }, [selectedIndex, openImage]);

  const openPrev = useCallback(() => {
    if (selectedIndex > 0) openImage(flyWireImages[selectedIndex - 1]);
  }, [selectedIndex, openImage]);

  return (
    <>
      {/* Background — only shows below the hero */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "rgba(4,6,12,1)" }}
      />

      <main className="relative z-10 min-h-screen pb-32">

        {/* ── Hero video banner ─────────────────────────────────────── */}
        <div className="relative w-full overflow-hidden" style={{ height: "100svh" }}>
          <video
            src={`${import.meta.env.BASE_URL}flywire/flywire-poster.mp4`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark vignette — edges + bottom fade into page */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(4,6,12,0.55) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "45%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(4,6,12,0.85) 70%, rgba(4,6,12,1) 100%)",
            }}
          />
          {/* Top fade so nav stays readable */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              height: "160px",
              background:
                "linear-gradient(to bottom, rgba(4,6,12,0.7) 0%, transparent 100%)",
            }}
          />

          {/* Title overlaid on the video */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 px-8 pb-20 text-center"
          >
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/50 mb-5">
              FlyWire Connectome
            </p>
            <h1
              style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
              className="font-display font-light leading-[1.05] text-balance drop-shadow-lg"
            >
              The Fly Brain, Mapped.
            </h1>
            <p
              style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)" }}
              className="mt-5 text-white/60 font-light leading-relaxed text-balance max-w-xl mx-auto"
            >
              Every neuron in the adult <em>Drosophila melanogaster</em> brain,
              traced and connected. Ready to explore?
            </p>
            {/* Scroll cue */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-10 flex justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/30">
                <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/20">
              sic parvis magna
            </p>
          </motion.div>
        </div>

        {/* ── Gallery sections ──────────────────────────────────────── */}
        <div className="px-6 pt-20">

        {/* Sections */}
        <div className="max-w-7xl mx-auto space-y-24 px-0">
          {FLYWIRE_GROUPS.map((group) => {
            const images = flyWireImages.filter((img) => img.group === group);
            return (
              <Fragment key={group}>
              <section id={slugify(group)} className="scroll-mt-24">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-light mb-2">
                      {group}
                    </h2>
                    <p className="text-sm text-white/45 font-light max-w-2xl leading-relaxed">
                      {FLYWIRE_GROUP_BLURBS[group]}
                    </p>
                  </div>
                  {group === "Sex & Courtship Circuits" && (
                    <img
                      src={imgSrc("love-flywire.png")}
                      alt="Love, FlyWire"
                      className="w-20 h-20 object-contain opacity-80 shrink-0 mt-1"
                    />
                  )}
                </div>
                {group === "Brain-Wide Connectivity" ? (
                  <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                        {images.map((img, i) => (
                          <ImageCard
                            key={img.filename}
                            image={img}
                            index={i}
                            onClick={() => openImage(img)}
                            onHover={(fn) => setHoveredNeuropils(FILENAME_TO_NEUROPILS[fn] ?? [])}
                            onHoverEnd={() => setHoveredNeuropils([])}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="xl:w-96 shrink-0">
                      <div className="xl:sticky xl:top-28">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-2">
                          Neuropil Atlas
                        </p>
                        <p className="text-sm text-white/60 font-light mb-4 leading-relaxed">
                          Fly brain regions, hover an image to highlight.
                        </p>
                        <NeuropilBrain highlighted={hoveredNeuropils} />
                        <div className="mt-3 min-h-[2rem]">
                          {hoveredNeuropils.length > 0 && (
                            <p className="text-[11px] text-white/45 leading-relaxed text-center">
                              {hoveredNeuropils
                                .map((id) => NEUROPILS.find((n) => n.id === id)?.label)
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={group === "Infographics & Posters"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"}>
                    {images.map((img, i) => (
                      <ImageCard
                        key={img.filename}
                        image={img}
                        index={i}
                        onClick={() => openImage(img)}
                        objectFit={group === "Infographics & Posters" ? "contain" : "cover"}
                      />
                    ))}
                  </div>
                )}
              </section>
              {group === "Infographics & Posters" && (
                <div>
                  <div className="mb-8">
                    <p className="text-[11px] uppercase tracking-[0.4em] text-white/35 mb-3">
                      Interactive 3D Views
                    </p>
                    <h2 className="font-display text-2xl md:text-3xl font-light mb-3">
                      Explore Living Circuits
                    </h2>
                    <p className="text-sm text-white/45 font-light max-w-2xl leading-relaxed">
                      Each card opens a curated set of neurons in Codex, where you can rotate,
                      slice, and trace the wiring synapse by synapse in your browser.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {INTERACTIVE_VIEWS.map((view, i) => (
                      <motion.div
                        key={view.thumbnail}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-xl overflow-hidden glass hover:bg-white/[0.05] transition-colors duration-400"
                      >
                        {view.circuit ? (
                          <CircuitViewer
                            circuitId={view.circuit.id}
                            cells={view.circuit.cells}
                            height={240}
                          />
                        ) : view.hazard ? (
                          <button
                            onClick={() => setHazardView(view)}
                            className="block w-full text-left group"
                          >
                            <div className="aspect-video bg-white/[0.03] overflow-hidden relative">
                              <img
                                src={imgSrc(view.thumbnail)}
                                alt={view.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-yellow-300/15 border border-yellow-200/25 text-yellow-100 text-[9px] uppercase tracking-[0.2em] backdrop-blur-sm">
                                ☣ {view.hazard.cellCount} cells
                              </div>
                            </div>
                          </button>
                        ) : (
                          <a
                            href={view.codexUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block group"
                          >
                            <div className="aspect-video bg-white/[0.03] overflow-hidden relative">
                              <img
                                src={imgSrc(view.thumbnail)}
                                alt={view.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              />
                            </div>
                          </a>
                        )}
                        <div className="p-5">
                          <div className="flex items-baseline justify-between gap-3 mb-2">
                            <h3 className="font-display text-base font-light leading-snug">
                              {view.title}
                            </h3>
                            {view.circuit && (
                              <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 shrink-0">
                                {view.circuit.cells.length} cells
                              </span>
                            )}
                          </div>
                          <p className="text-[12.5px] text-white/55 leading-relaxed mb-3">
                            {view.description}
                          </p>
                          {view.hazard ? (
                            <button
                              onClick={() => setHazardView(view)}
                              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-yellow-100/70 hover:text-yellow-100 transition group/link"
                            >
                              ☣ Open in Codex
                              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="group-hover/link:translate-x-0.5 transition-transform">
                                <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          ) : (
                            <a
                              href={view.codexUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white/80 transition group/link"
                            >
                              Open in Codex
                              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="group-hover/link:translate-x-0.5 transition-transform">
                                <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              </Fragment>
            );
          })}
        </div>

        {/* ── Videos ─────────────────────────────────────────────────── */}
        <div className="mt-32 max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/35 mb-5">Videos</p>
          <h2 className="font-display text-2xl md:text-3xl font-light mb-12">In Motion</h2>

          {/* Hero video */}
          <div className="mb-10">
            <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="https://www.youtube.com/embed/lumH8QTm1AE?rel=0&modestbranding=1"
                title="The Complete Fly Brain"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="mt-5">
              <h3 className="font-display text-xl font-light mb-2">The Complete Fly Brain</h3>
              <p className="text-sm text-white/55 leading-relaxed">A sweeping tour of the entire FlyWire connectome, 139,255 neurons, traced synapse by synapse.</p>
            </div>
          </div>

          {/* Secondary videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {[
              { id: "J2xTkMsZchs", title: "Fly Connectome", desc: "An overview of the FlyWire project and the scientific questions a complete connectome can answer." },
              { id: "o1qjC5OI9mc", title: "The BANC", desc: "The Brain And Nerve Cord connectome, extending the map beyond the brain into the fly's ventral nerve cord." },
            ].map((v) => (
              <div key={v.id}>
                <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-lg font-light mb-1.5">{v.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe + Share */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/watch?v=lumH8QTm1AE"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 hover:bg-white/15 ring-1 ring-white/12 text-sm text-white/80 hover:text-white transition"
            >
              <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
                <path d="M15.67.94A2 2 0 0 0 14.28.5C13.01.16 8 .16 8 .16S2.99.16 1.72.5A2 2 0 0 0 .33.94C0 2.22 0 5.5 0 5.5s0 3.28.33 4.56a2 2 0 0 0 1.39.44C2.99 10.84 8 10.84 8 10.84s5.01 0 6.28-.34a2 2 0 0 0 1.39-.44C16 8.78 16 5.5 16 5.5S16 2.22 15.67.94zM6.4 7.86V3.14L10.55 5.5 6.4 7.86z"/>
              </svg>
              Subscribe on YouTube
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 hover:bg-white/15 ring-1 ring-white/12 text-sm text-white/80 hover:text-white transition"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3M9 1h4v4M13 1 6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* ── Papers ──────────────────────────────────────────────────── */}
        <div className="mt-32 max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/35 mb-5">Research</p>
          <h2 className="font-display text-2xl md:text-3xl font-light mb-10">The Science Behind It</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                label: "Nature, 2024",
                title: "Neuronal wiring diagram of an adult brain",
                authors: "Dorkenwald et al.",
                href: "https://www.nature.com/articles/s41586-024-07558-y",
              },
              {
                label: "Nature, 2024",
                title: "Whole-brain annotation and multi-connectome cell typing of Drosophila",
                authors: "Schlegel et al.",
                href: "https://www.nature.com/articles/s41586-024-07686-5",
              },
              {
                label: "Nature — Full Collection",
                title: "All FlyWire connectome papers",
                authors: "nature.com/collections/hgcfafejia",
                href: "https://www.nature.com/collections/hgcfafejia",
              },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group glass rounded-xl p-5 hover:bg-white/[0.07] hover:ring-1 hover:ring-white/15 transition-all duration-300 flex flex-col gap-3"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">{p.label}</p>
                <p className="text-sm font-light text-white/80 leading-snug group-hover:text-white transition">{p.title}</p>
                <p className="text-[11px] text-white/35 mt-auto">{p.authors}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Footer credit */}
        <div className="mt-32 max-w-2xl mx-auto text-center">
          <div
            className="inline-block w-12 mb-8"
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
            }}
          />
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/30 mb-4">
            Credit
          </p>
          <p className="text-sm text-white/55 leading-relaxed">
            Visualizations by{" "}
            <a
              href="https://flywire.ai"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition"
            >
              Tyler Sloan and Amy Sterling for FlyWire
            </a>
            . Please contact{" "}
            <a
              href="mailto:flywire@princeton.edu"
              className="text-white/80 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition"
            >
              flywire@princeton.edu
            </a>
            {" "}for per-image captions and credits.
          </p>
          <p className="mt-4 text-sm text-white/40 leading-relaxed">
            Explore the dataset:{" "}
            <a
              href="https://flywire.ai"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 underline underline-offset-4 decoration-white/20 hover:decoration-white/55 transition"
            >
              flywire.ai
            </a>
          </p>
          <div className="mt-8">
            <Link
              to="/media"
              className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white/75 transition group"
            >
              Press &amp; media assets
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 2l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
        </div> {/* /px-6 pt-20 gallery sections wrapper */}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <Lightbox
            image={selected}
            onClose={closeImage}
            onPrev={openPrev}
            onNext={openNext}
          />
        )}
      </AnimatePresence>

      {/* Hazard confirm modal — for views with too many cells to render inline */}
      <AnimatePresence>
        {hazardView && (
          <HazardConfirm
            view={hazardView}
            onCancel={() => setHazardView(null)}
            onProceed={() => {
              window.open(hazardView.codexUrl, "_blank", "noopener,noreferrer");
              setHazardView(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hazard Confirm Modal ─────────────────────────────────────────────────

function HazardConfirm({
  view,
  onCancel,
  onProceed,
}: {
  view: InteractiveView;
  onCancel: () => void;
  onProceed: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onProceed();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, onProceed]);

  const count = view.hazard?.cellCount ?? 0;

  return (
    <motion.div
      key="hazard-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(4,6,12,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full glass-strong rounded-2xl overflow-hidden p-7 sm:p-9"
        style={{
          borderTop: "2px solid rgba(254, 240, 138, 0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="text-3xl leading-none translate-y-[-2px] text-yellow-200/90 select-none">
            ☣
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-200/80 mb-2">
              Biological Hazard
            </p>
            <h3 className="font-display text-xl font-light leading-snug">
              {count.toLocaleString()} neurons incoming
            </h3>
          </div>
        </div>
        <p className="text-sm text-white/65 leading-relaxed mb-7">
          {view.title} loads {count.toLocaleString()} cells in Codex. May cause
          fan noise, mild awe, and a temporary spike in synaptic envy. Open in
          a new tab?
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white/55 hover:text-white/85 transition"
          >
            Nope
          </button>
          <button
            onClick={onProceed}
            className="px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.25em] bg-yellow-200/15 hover:bg-yellow-200/25 text-yellow-50 border border-yellow-200/30 transition"
          >
            Bring it on
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
