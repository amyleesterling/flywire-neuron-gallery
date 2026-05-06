import { Fragment, useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import {
  referencesFor,
  viewReferencesFor,
  type Reference,
} from "../data/flywireReferences";
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

// ── Reference list (lightbox sidebar + interactive views) ────────────────

function ReferenceList({ refs }: { refs: Reference[] }) {
  if (refs.length === 0) return null;
  return (
    <div className="mt-6 pt-5 border-t border-white/10">
      <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-3">References</p>

      {/* Mobile: compact numbered pill row */}
      <ul className="flex flex-wrap gap-2 sm:hidden">
        {refs.map((r, i) => (
          <li key={r.id}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              title={`${r.authors} ${r.year}, ${r.journal} — ${r.title}`}
              className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded font-mono text-[11px] tracking-tight text-cyan-300/65 bg-cyan-300/10 hover:bg-cyan-300/20 hover:text-cyan-300/95 transition"
            >
              {i + 1}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop: full bibliographic list */}
      <ul className="hidden sm:block space-y-1.5">
        {refs.map((r) => (
          <li key={r.id}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              title={r.title}
              className="group/ref flex items-baseline gap-2 text-[11px] leading-snug text-white/45 hover:text-white/85 transition"
            >
              <span className="font-mono text-cyan-300/55 group-hover/ref:text-cyan-300/90 shrink-0 tracking-tight">
                {r.id}
              </span>
              <span className="truncate">
                {r.authors} {r.year}, <em>{r.journal}</em>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
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
        className="holo-panel relative flex flex-col lg:flex-row gap-0 max-w-6xl w-full max-h-[90vh] glass-strong rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="holo-trace" aria-hidden="true" />
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
            {/* Centered FlyWire icon header with hairlines on either side */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-10 bg-gradient-to-l from-white/20 to-transparent" />
              <img
                src={imgSrc("flywire-icon-white.png")}
                alt=""
                className="w-4 h-4 opacity-55"
                aria-hidden="true"
              />
              <span className="h-px w-10 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/50 text-center mb-5">
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
            <ReferenceList refs={referencesFor(image.title)} />
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
  aspectClass,
}: {
  image: FlyWireImage;
  index: number;
  onClick: () => void;
  objectFit?: "cover" | "contain";
  onHover?: (filename: string) => void;
  onHoverEnd?: () => void;
  aspectClass?: string;
}) {
  const aspect = aspectClass ?? image.aspectClass ?? "aspect-video";
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.04 * (index % 12), ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseEnter={() => onHover?.(image.filename)}
      onMouseLeave={() => onHoverEnd?.()}
      className="holo-card group text-left rounded-xl overflow-hidden glass hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <span className="holo-trace" aria-hidden="true" />
      <div className={`${aspect} overflow-hidden relative`}>
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

  // Drifting "neurotransmitter" particles — computed once so they don't
  // resnap on every re-render. ~26 particles is enough for ambient texture
  // without becoming visually busy.
  const particles = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 22,
        duration: 18 + Math.random() * 14,
        size: 1.3 + Math.random() * 1.7,
      })),
    [],
  );

  // Click-stars + sonar ring — every click anywhere on the page bursts
  // ~10 sparkles outward from the click point AND a single concentric
  // ring expanding outward (Halo/Apex reticle confirm). Skipped on
  // canvas clicks so 3D rotation doesn't trigger sparkles.
  type Sparkle = {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    rot: number;
    color: "" | "magenta" | "warm";
  };
  type Ring = { id: number; x: number; y: number };
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [rings, setRings] = useState<Ring[]>([]);
  // Track modal-open state via a ref so the document-level click handler
  // (registered once) can read the latest value without re-binding.
  const modalOpenRef = useRef(false);
  useEffect(() => {
    modalOpenRef.current = !!selected || !!hazardView;
  }, [selected, hazardView]);
  useEffect(() => {
    let counter = 0;
    function onClick(e: MouseEvent) {
      // Skip the burst when a lightbox or hazard modal is open — clicking
      // the backdrop to close the modal should feel like a normal click,
      // not trigger sparkles + sonar.
      if (modalOpenRef.current) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("canvas")) return;
      const palette: Sparkle["color"][] = ["", "", "", "magenta", "warm"];
      const N = 11;
      const burst: Sparkle[] = Array.from({ length: N }, (_, i) => {
        const angle = (i / N) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 48 + Math.random() * 38;
        return {
          id: counter++,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          rot: Math.random() * 360,
          color: palette[Math.floor(Math.random() * palette.length)],
        };
      });
      const ringId = counter++;
      setSparkles((s) => [...s, ...burst]);
      setRings((r) => [...r, { id: ringId, x: e.clientX, y: e.clientY }]);
      const sparkIds = new Set(burst.map((b) => b.id));
      window.setTimeout(() => {
        setSparkles((s) => s.filter((sp) => !sparkIds.has(sp.id)));
      }, 800);
      window.setTimeout(() => {
        setRings((r) => r.filter((rg) => rg.id !== ringId));
      }, 800);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Mobile-only: hide the top HUD + share pill until the user has scrolled
  // past the hero. The buttons sit right where the title eyeline lands and
  // make the landing feel cluttered on phones; on desktop there's plenty of
  // room so they stay visible from the start.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scroll-position HUD: which section is currently in the viewport.
  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("main section[id]")) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Section boot-in tags: which sections have been initialized once.
  const [initedSections, setInitedSections] = useState<Set<string>>(new Set());
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("main section[id]")) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInitedSections((prev) => {
              if (prev.has(entry.target.id)) return prev;
              const next = new Set(prev);
              next.add(entry.target.id);
              return next;
            });
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Section sub-dot tooltip state — hover on desktop, tap-and-hold on mobile.
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressFiredRef = useRef(false);

  // Dismiss the rail tooltip the moment the user scrolls — without this, a
  // tap that latched the tooltip (or a touch that started as a press and
  // turned into a scroll) leaves the label hanging on screen long after the
  // user has moved on.
  useEffect(() => {
    if (tooltipIdx === null) return;
    const dismiss = () => setTooltipIdx(null);
    window.addEventListener("scroll", dismiss, { passive: true });
    return () => window.removeEventListener("scroll", dismiss);
  }, [tooltipIdx]);

  // Periodic holographic flicker — every ~25s, pick a random card and
  // briefly flicker its brightness. Suggests the whole UI is projected.
  useEffect(() => {
    const tick = () => {
      const cards = document.querySelectorAll(".holo-card");
      if (cards.length > 0) {
        const card = cards[Math.floor(Math.random() * cards.length)] as HTMLElement;
        card.classList.add("holo-flicker");
        window.setTimeout(() => card.classList.remove("holo-flicker"), 750);
      }
    };
    const interval = window.setInterval(tick, 22000);
    return () => window.clearInterval(interval);
  }, []);


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

      {/* ── Holographic ambient layers ──────────────────────────────── */}
      {/* Slow drifting gradient field, very subtle */}
      <div className="holo-bg" />
      {/* Tactical dot lattice — alien-architecture undertone */}
      <div className="holo-grid" />
      {/* Hand-drawn circuit traces — synaptic chip-board feel. Faded
          at the top + bottom of the viewport so they don't compete
          with the hero video or the page footer. Dots removed (the
          path strokes alone read better as ambient texture). */}
      <svg
        className="fixed inset-0 z-0 pointer-events-none w-full h-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 12%, black 32%, black 75%, transparent 95%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 12%, black 32%, black 75%, transparent 95%)",
        }}
      >
        <g
          stroke="rgba(126, 224, 255, 0.10)"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="square"
        >
          <path d="M40 80 H180 V160 H280 V100 H400" />
          <path d="M40 240 H140 V340 H260 V280 H380 V360" />
          <path d="M120 480 H320 V560 H440" />
          <path d="M60 700 H200 V780 H340 V720 H460" />
          <path d="M40 880 H260 V940" />
          <path d="M520 60 V200 H680 V120 H820" />
          <path d="M540 320 H760 V440 H900" />
          <path d="M520 580 V720 H680" />
          <path d="M540 820 H720 V900 H860" />
          <path d="M960 80 H1140 V200" />
          <path d="M980 280 H1180 V380 H1300 V440" />
          <path d="M960 540 V680 H1100 V620 H1240" />
          <path d="M980 800 H1140 V900 H1260" />
          <path d="M1340 80 V220 H1500" />
          <path d="M1340 360 H1500" />
          <path d="M1380 480 V620 H1540 V700" />
          <path d="M1340 820 H1480 V940" />
        </g>
      </svg>
      {/* Drifting neurotransmitter particles */}
      <div className="holo-particles" aria-hidden="true">
        {particles.map((p) => (
          <i
            key={p.id}
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      {/* Faint CRT-hologram scan lines (subtle, never obtrusive) */}
      <div className="holo-scanlines" />

      {/* ── Scroll-position HUD: counter + vertical progress rail ──── */}
      <div
        className={`fixed top-6 left-6 bottom-6 z-30 flex flex-col items-start gap-4 pointer-events-none transition-opacity duration-500 ${
          pastHero ? "opacity-100" : "opacity-0 md:opacity-100"
        }`}
      >
        <div className="holo-counter">
          <b>{String(activeSection + 1).padStart(2, "0")}</b>
          {" / "}
          {String(FLYWIRE_GROUPS.length).padStart(2, "0")}
        </div>
        <div className="relative flex-1" style={{ width: "1px" }}>
          <div className="absolute inset-0 bg-white/10" />
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-cyan-300/80 via-cyan-300/55 to-cyan-300/25 transition-[height] duration-700 ease-out"
            style={{ height: `${((activeSection + 1) / FLYWIRE_GROUPS.length) * 100}%` }}
          />
          <span
            className="absolute rounded-full bg-cyan-200 transition-[top] duration-700 ease-out pointer-events-none"
            style={{
              width: "7px",
              height: "7px",
              left: "-3px",
              top: `calc(${((activeSection + 1) / FLYWIRE_GROUPS.length) * 100}% - 3.5px)`,
              boxShadow:
                "0 0 8px rgba(126, 224, 255, 0.95), 0 0 18px rgba(126, 224, 255, 0.5)",
            }}
          />
          {/* Section sub-dots — hover (desktop) or tap-hold (mobile) reveals title */}
          {FLYWIRE_GROUPS.map((group, i) => {
            const t = ((i + 1) / FLYWIRE_GROUPS.length) * 100;
            const isPassedOrActive = i <= activeSection;
            const showTooltip = tooltipIdx === i;
            return (
              <a
                key={group}
                href={`#${slugify(group)}`}
                aria-label={group}
                className="group pointer-events-auto absolute block"
                style={{
                  top: `calc(${t}% - 9px)`,
                  left: "-9px",
                  width: "19px",
                  height: "19px",
                }}
                onMouseEnter={() => setTooltipIdx(i)}
                onMouseLeave={() => setTooltipIdx((cur) => (cur === i ? null : cur))}
                onTouchStart={() => {
                  longPressFiredRef.current = false;
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                  }
                  longPressTimerRef.current = window.setTimeout(() => {
                    setTooltipIdx(i);
                    longPressFiredRef.current = true;
                  }, 350);
                }}
                onTouchMove={() => {
                  // Touch turned into a scroll — abandon the long-press so
                  // the tooltip never appears for a swipe.
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                    longPressTimerRef.current = null;
                  }
                }}
                onTouchEnd={() => {
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                    longPressTimerRef.current = null;
                  }
                  if (longPressFiredRef.current) {
                    window.setTimeout(() => {
                      setTooltipIdx((cur) => (cur === i ? null : cur));
                    }, 1500);
                  }
                }}
                onTouchCancel={() => {
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                    longPressTimerRef.current = null;
                  }
                }}
                onClick={(e) => {
                  if (longPressFiredRef.current) {
                    e.preventDefault();
                    longPressFiredRef.current = false;
                  }
                }}
              >
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block rounded-full transition-all duration-300 group-hover:scale-150"
                  style={{
                    width: "3px",
                    height: "3px",
                    background: isPassedOrActive
                      ? "rgba(126, 224, 255, 0.55)"
                      : "rgba(255, 255, 255, 0.28)",
                    boxShadow: isPassedOrActive
                      ? "0 0 4px rgba(126, 224, 255, 0.45)"
                      : "none",
                  }}
                />
                <span
                  className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-white/90 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded border border-white/10 transition-opacity duration-200 pointer-events-none"
                  style={{ opacity: showTooltip ? 1 : 0 }}
                >
                  {group}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Share button (fixed, top-right) + dropdown ─────────────── */}
      <ShareMenu copied={copied} setCopied={setCopied} pastHero={pastHero} />

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

        {/* ── Overview / About the connectome ──────────────────── */}
        <section className="px-6 pt-24 pb-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/35 mb-5">Overview</p>
            <h2 className="holo-text font-display text-2xl md:text-3xl font-light mb-6 max-w-3xl">
              What is the FlyWire Connectome?
            </h2>
            <p className="text-sm md:text-[15px] text-white/55 font-light leading-relaxed max-w-3xl">
              The FlyWire connectome was published in a special edition of <em>Nature</em>{" "}
              in October 2024, presenting the first complete synapse-resolution wiring diagram
              of a centralized brain. It contains ~140,000 neurons and ~50 million synaptic
              connections. This landmark connectomics dataset was reconstructed via volumetric
              electron microscopy with AI segmentation, community and expert proofreading, and
              annotation contributions from the global <em>Drosophila</em> scientific
              community. The publication package includes the core wiring diagram, a whole
              brain cell type atlas, a brain simulation, network analyses, visual system
              studies, and experiments showing how connectome data can generate new
              hypotheses about behavior. Since release, the dataset has been driving an
              expanding wave of new research, from circuit level dissections of vision and
              navigation to whole brain models of behavior, with new findings published
              regularly.
            </p>
          </div>
        </section>

        {/* ── Gallery sections ──────────────────────────────────────── */}
        {/* Larger left padding on mobile so headings clear the fixed
            progress rail at left-6; restore symmetric padding from md+ */}
        <div className="pl-12 pr-6 pt-20 md:px-6">

        {/* Sections */}
        <div className="max-w-7xl mx-auto space-y-24 px-0">
          {FLYWIRE_GROUPS.map((group) => {
            const images = flyWireImages.filter((img) => img.group === group);
            return (
              <Fragment key={group}>
              <section id={slugify(group)} className="scroll-mt-24">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="holo-text font-display text-2xl md:text-3xl font-light mb-2">
                      {group}
                      {initedSections.has(slugify(group)) && (
                        <span key={slugify(group)} className="holo-init">[ INITIALIZED ]</span>
                      )}
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
                          Fly brain regions. Hover an image to highlight neuropil.
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
                ) : group === "The Whole Connectome" ? (
                  // Two flagship renders take the full content width side-by-side.
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {images.map((img, i) => (
                      <ImageCard
                        key={img.filename}
                        image={img}
                        index={i}
                        onClick={() => openImage(img)}
                      />
                    ))}
                  </div>
                ) : group === "Infographics & Posters" ? (
                  // Custom Infographics layout: vertical posters paired side-
                  // by-side at portrait aspect (no black bars), landscape
                  // pieces in a separate row beneath.
                  (() => {
                    const portraits = images.filter((i) => i.aspectClass === "aspect-[2/3]");
                    const others = images.filter((i) => i.aspectClass !== "aspect-[2/3]");
                    return (
                      <div className="space-y-8">
                        {portraits.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-start">
                            {portraits.map((img, i) => (
                              <ImageCard
                                key={img.filename}
                                image={img}
                                index={i}
                                onClick={() => openImage(img)}
                                objectFit="contain"
                              />
                            ))}
                          </div>
                        )}
                        {others.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                            {others.map((img, i) => (
                              <ImageCard
                                key={img.filename}
                                image={img}
                                index={portraits.length + i}
                                onClick={() => openImage(img)}
                                objectFit="contain"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {images.map((img, i) => (
                      <ImageCard
                        key={img.filename}
                        image={img}
                        index={i}
                        onClick={() => openImage(img)}
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
                    <h2 className="holo-text font-display text-2xl md:text-3xl font-light mb-3">
                      Explore Living Circuits
                    </h2>
                    <p className="text-sm text-white/45 font-light max-w-2xl leading-relaxed">
                      Each card opens a curated set of neurons in Codex, where you can explore
                      their connections and function.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {INTERACTIVE_VIEWS.map((view, i) => (
                      <motion.div
                        key={view.thumbnail}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                        className="holo-card rounded-xl overflow-hidden glass hover:bg-white/[0.05] transition-colors duration-400 flex flex-col"
                      >
                        <span className="holo-trace" aria-hidden="true" />
                        {view.circuit ? (
                          <CircuitViewer
                            circuitId={view.circuit.id}
                            cells={view.circuit.cells}
                            height={300}
                          />
                        ) : view.hazard ? (
                          <button
                            onClick={() => setHazardView(view)}
                            className="block w-full text-left group"
                          >
                            <div className="aspect-video overflow-hidden relative">
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
                            <div className="aspect-video overflow-hidden relative">
                              <img
                                src={imgSrc(view.thumbnail)}
                                alt={view.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              />
                            </div>
                          </a>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
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
                          <p className="text-[12.5px] text-white/55 leading-relaxed mb-3 flex-1">
                            {view.description}
                          </p>
                          {(() => {
                            const refs = viewReferencesFor(view.title);
                            if (refs.length === 0) return null;
                            return (
                              <div className="flex items-center flex-wrap gap-1.5 mb-4">
                                <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">Refs</span>
                                {refs.map((r) => (
                                  <a
                                    key={r.id}
                                    href={r.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={`${r.authors} ${r.year} — ${r.title}`}
                                    className="text-[10px] font-mono tracking-tight text-cyan-300/55 hover:text-cyan-300/90 px-1.5 py-0.5 rounded bg-cyan-300/5 hover:bg-cyan-300/15 transition"
                                  >
                                    {r.id}
                                  </a>
                                ))}
                              </div>
                            );
                          })()}
                          {view.hazard ? (
                            <button
                              onClick={() => setHazardView(view)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-yellow-300/10 hover:bg-yellow-300/20 border border-yellow-200/30 hover:border-yellow-200/55 text-[10px] uppercase tracking-[0.25em] text-yellow-50 transition self-start group/btn"
                            >
                              ☣ Open in Codex
                              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="group-hover/btn:translate-x-0.5 transition-transform">
                                <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          ) : (
                            <a
                              href={view.codexUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-cyan-300/10 hover:bg-cyan-300/20 border border-cyan-200/30 hover:border-cyan-200/55 text-[10px] uppercase tracking-[0.25em] text-cyan-50 hover:text-white transition self-start group/btn"
                            >
                              Open in Codex
                              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="group-hover/btn:translate-x-0.5 transition-transform">
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
          <h2 className="holo-text font-display text-2xl md:text-3xl font-light mb-12">In Motion</h2>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                id: "J2xTkMsZchs",
                title: "The FlyWire Connectome",
                desc: "Every one of the 139,255 neurons in the adult Drosophila brain, followed by a tour of superclasses.",
                linkLabel: "Nature, 2024",
                linkUrl: "https://www.nature.com/articles/s41586-024-07558-y",
              },
              {
                id: "OSKunbBWAq8",
                title: "The BANC",
                desc: "The Brain And Nerve Cord connectome, the first dataset linking the fly's brain to the body it controls.",
                linkLabel: "Read the preprint",
                linkUrl: "https://www.biorxiv.org/content/10.1101/2025.07.31.667571v3",
              },
              {
                id: "RQuYaMDc1d0",
                title: "Flytastic Voyage",
                desc: "Zoom from Mala Murthy and Sebastian Seung's meeting into the brain of a fly to see how the FlyWire connectome was created.",
              },
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
                  {v.linkUrl && (
                    <a
                      href={v.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-cyan-200/70 hover:text-cyan-100 transition group/link"
                    >
                      {v.linkLabel}
                      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="group-hover/link:translate-x-0.5 transition-transform">
                        <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
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
          <h2 className="holo-text font-display text-2xl md:text-3xl font-light mb-10">The Science Behind It</h2>
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

          {/* Codex + FlyWire Academy — keep-exploring spotlight */}
          <div className="mt-12 pt-10 border-t border-white/10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/35 mb-5">Keep Exploring</p>
            <p className="text-sm md:text-[15px] text-white/55 font-light leading-relaxed max-w-3xl">
              To keep exploring, visit{" "}
              <a
                href="https://codex.flywire.ai"
                target="_blank"
                rel="noreferrer"
                className="text-white/80 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition"
              >Codex</a>, the FlyWire Connectome Data Explorer, or{" "}
              <a
                href="https://codex.flywire.ai/academy_home"
                target="_blank"
                rel="noreferrer"
                className="text-white/80 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition"
              >FlyWire Academy</a> for classroom-ready lessons, videos, and hands-on
              connectomics activities.
            </p>
            <p className="mt-4 text-sm text-white/55 font-light leading-relaxed max-w-3xl">
              Codex is a web-based set of tools for searching, visualizing, and analyzing
              FlyWire datasets, including FAFB v783 with 139,255 neurons; FlyWire Academy
              offers educational videos, worksheets, and lesson plans for high school,
              college, and outreach use.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <a
                href="https://codex.flywire.ai"
                target="_blank"
                rel="noreferrer"
                className="group glass rounded-xl p-5 hover:bg-white/[0.07] hover:ring-1 hover:ring-white/15 transition-all duration-300 flex flex-col gap-3"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Tool</p>
                <p className="text-sm font-light text-white/80 leading-snug group-hover:text-white transition">Codex — FlyWire Connectome Data Explorer</p>
                <p className="text-[11px] text-white/35 mt-auto">codex.flywire.ai</p>
              </a>
              <a
                href="https://codex.flywire.ai/academy_home"
                target="_blank"
                rel="noreferrer"
                className="group glass rounded-xl p-5 hover:bg-white/[0.07] hover:ring-1 hover:ring-white/15 transition-all duration-300 flex flex-col gap-3"
              >
                <div className="flex items-center justify-center h-36 -mx-3 -mt-3 mb-2 rounded-lg overflow-hidden">
                  <img
                    src="https://codex.flywire.ai/asset/academy/title.png"
                    alt="FlyWire Academy"
                    className="max-h-full max-w-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Education</p>
                <p className="text-sm font-light text-white/80 leading-snug group-hover:text-white transition">FlyWire Academy — Lessons &amp; Activities</p>
                <p className="text-[11px] text-white/35 mt-auto">codex.flywire.ai/academy_home</p>
              </a>
            </div>
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

      {/* Click sparkles — burst from every click on the page */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={`click-spark ${s.color}`}
          style={
            {
              left: `${s.x}px`,
              top: `${s.y}px`,
              "--dx": `${s.dx}px`,
              "--dy": `${s.dy}px`,
              "--rot": `${s.rot}deg`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      {/* Sonar rings — concentric ring expanding outward from each click */}
      {rings.map((r) => (
        <span
          key={r.id}
          className="click-ring"
          style={{ left: `${r.x}px`, top: `${r.y}px` }}
          aria-hidden="true"
        />
      ))}

    </>
  );
}

// ── Share Menu ───────────────────────────────────────────────────────────

function ShareMenu({
  copied,
  setCopied,
  pastHero,
}: {
  copied: boolean;
  setCopied: (b: boolean) => void;
  pastHero: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = "FlyWire Neuron Gallery — every neuron in the adult Drosophila brain, traced and connected.";
  const subject = "FlyWire Neuron Gallery";
  const targets = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z" />
        </svg>
      ),
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }

  function shareEmail() {
    // mailto: through `<a href>` is flaky — works reliably when triggered
    // by direct window navigation. Also: copy the formatted message to
    // clipboard as a fallback, so the user can paste even if no mail
    // client is registered (silent failures otherwise).
    const body = `${text}\n\n${url}`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      navigator.clipboard.writeText(`${subject}\n\n${body}`);
    } catch {}
    window.location.href = mailto;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }

  return (
    <div
      ref={wrapRef}
      className={`fixed bottom-5 right-5 z-30 transition-opacity duration-500 ${
        pastHero ? "opacity-100" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-cyan-200/40 text-[11px] uppercase tracking-[0.25em] text-white/75 hover:text-white transition"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="opacity-90">
          <path
            d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3M9 1h4v4M13 1 6 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 bottom-full mb-2 w-48 glass rounded-xl overflow-hidden border border-white/10 shadow-xl"
          >
            {targets.map((t) => {
              const isMailto = t.href.startsWith("mailto:");
              return (
                <a
                  key={t.label}
                  href={t.href}
                  // mailto: links must not use target="_blank" — that opens
                  // a blank tab and never triggers the email client.
                  {...(isMailto
                    ? {}
                    : { target: "_blank", rel: "noreferrer" })}
                  className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/75 hover:text-white hover:bg-white/[0.06] transition"
                  onClick={() => setOpen(false)}
                >
                  <span className="opacity-80">{t.icon}</span>
                  {t.label}
                </a>
              );
            })}
            <button
              onClick={shareEmail}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/75 hover:text-white hover:bg-white/[0.06] transition border-t border-white/8"
            >
              <span className="opacity-80">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 7 9-7" />
                </svg>
              </span>
              Email
            </button>
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/75 hover:text-white hover:bg-white/[0.06] transition border-t border-white/8"
            >
              <span className="opacity-80">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                  <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
                </svg>
              </span>
              {copied ? "Link copied" : "Copy link"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
