import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  flyWireImages,
  FLYWIRE_MEDIA_PICKS,
  type FlyWireImage,
} from "../data/flywire";
import { Pic } from "../components/Pic";

// ── Lightbox ─────────────────────────────────────────────────────────────

function Lightbox({ image, onClose }: { image: FlyWireImage; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(4,6,12,0.95)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Pic
          filename={image.filename}
          alt={image.title}
          sizes="(max-width: 1024px) 100vw, 70vw"
          fallbackWidth={3840}
          loading="eager"
          fetchPriority="high"
          className="w-full max-h-[85vh] object-contain rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Video data ────────────────────────────────────────────────────────────

const VIDEOS = [
  {
    id: "lumH8QTm1AE",
    title: "The Complete Fly Brain",
    description:
      "A sweeping tour of the entire FlyWire connectome, 139,255 neurons, traced synapse by synapse. This is what a complete animal brain looks like.",
    featured: true,
  },
  {
    id: "J2xTkMsZchs",
    title: "Fly Connectome",
    description:
      "An overview of the FlyWire project and the scientific questions a complete connectome can answer, from sensory processing to behavior.",
    featured: false,
  },
  {
    id: "o1qjC5OI9mc",
    title: "The BANC",
    description:
      "The Brain And Nerve Cord connectome, extending the map beyond the brain into the fly's ventral nerve cord, the equivalent of its spinal cord.",
    featured: false,
  },
];

const PLAYLIST_ID = "PLMV_0fBMo6jcDNai6YY74-zixrPBemzRy";

// ── Page ──────────────────────────────────────────────────────────────────

const mediaImages = FLYWIRE_MEDIA_PICKS.map(
  (fn) => flyWireImages.find((img) => img.filename === fn)!
).filter(Boolean);

export default function FlyWireMedia() {
  const [selected, setSelected] = useState<FlyWireImage | null>(null);

  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 0%, rgba(20,35,65,0.6) 0%, rgba(4,6,12,1) 60%)",
        }}
      />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 z-[5] bg-gradient-to-b from-[var(--color-ink-950)] to-transparent" />

      <main className="relative z-10 min-h-screen pt-32 pb-32 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl mx-auto mb-24"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/40 mb-5">
            For Media
          </p>
          <h1
            style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
            className="font-display font-light leading-[1.1] mb-7"
          >
            FlyWire Connectome Images
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed mb-4">
            The FlyWire project produced the first complete connectome of an adult
            animal brain, mapping every one of the 139,255 neurons in a fruit fly
            and tracing more than 50 million synaptic connections between them.
          </p>
          <p className="text-[15px] text-white/60 leading-relaxed">
            These visualizations are available for press, education, and research
            use. Full-resolution versions are available via the{" "}
            <a
              href="https://flywire.ai/gallery"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition"
            >
              FlyWire gallery
            </a>
            .
          </p>
        </motion.div>

        {/* Featured images — one per block */}
        <div className="max-w-4xl mx-auto space-y-28">
          {mediaImages.map((img, i) => (
            <motion.article
              key={img.filename}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Image */}
              <button
                onClick={() => setSelected(img)}
                className="block w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl overflow-hidden"
                aria-label={`Open full view: ${img.title}`}
              >
                <div className="relative overflow-hidden rounded-xl bg-white/[0.03]">
                  <Pic
                    filename={img.filename}
                    alt={img.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    fallbackWidth={1920}
                    className="w-full object-cover group-hover:scale-[1.015] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-300 pointer-events-none rounded-xl" />
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/60 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      View full size
                    </span>
                  </div>
                </div>
              </button>

              {/* Caption block */}
              <div className="mt-7 max-w-2xl">
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 mb-3">
                  {img.group}
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-light leading-snug mb-4">
                  {img.title}
                </h2>
                <p className="text-[15px] text-white/60 leading-relaxed">
                  {img.caption}
                </p>
              </div>

              {/* Divider */}
              {i < mediaImages.length - 1 && (
                <div
                  className="mt-20"
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)",
                  }}
                />
              )}
            </motion.article>
          ))}
        </div>

        {/* Videos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="mt-32 max-w-4xl mx-auto"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/35 mb-5">
            Videos
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-light mb-12">
            In Motion
          </h2>

          {/* Hero video */}
          {VIDEOS.filter((v) => v.featured).map((v) => (
            <div key={v.id} className="mb-16">
              <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-display text-xl font-light mb-2">{v.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}

          {/* Secondary videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {VIDEOS.filter((v) => !v.featured).map((v) => (
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
                  <p className="text-sm text-white/50 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Playlist */}
          <div className="mb-4">
            <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&rel=0&modestbranding=1`}
                title="Neuron Animations Playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-lg font-light mb-1.5">Neuron Animations</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                A playlist of individual neuron and circuit animations from the FlyWire connectome.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-32 max-w-2xl mx-auto">
          <div
            className="mb-10"
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.12) 60%, transparent)",
            }}
          />
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/30 mb-4">
            Credit
          </p>
          <p className="text-sm text-white/55 leading-relaxed mb-8">
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
            {" "}for per-image captions and credits. FlyWire is an open connectomics platform developed at Princeton University for mapping neural circuits in the adult <em>Drosophila</em> brain.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition group"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="group-hover:-translate-x-0.5 transition-transform"
            >
              <path d="M9 2L3 7l6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to full gallery
          </Link>
        </div>
      </main>

      <AnimatePresence>
        {selected && <Lightbox image={selected} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
