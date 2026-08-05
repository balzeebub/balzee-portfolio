"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, delay: 0.09 * i, ease: EASE },
  }),
};

const credentials = [
  { k: "5+ years", v: "Marketing & content experience" },
  { k: "500+", v: "Assets designed, edited and shipped" },
  { k: "24h", v: "Typical turnaround on requests" },
];

/* ── Showcase ──────────────────────────────────────────────────────────────
   Images live in /public/hero. Videos are YouTube ids — only the iframe for
   the slide that is currently on screen is ever mounted, so the hero doesn't
   pay for three players on first load. `dwell` is how long a slide holds, in
   ms; videos linger so you actually see some footage.                       */
type Slide =
  | {
      kind: "image";
      src: string;
      width: number;
      height: number;
      alt: string;
      label: string;
      dwell?: number;
    }
  | { kind: "video"; id: string; label: string; dwell?: number };

const SLIDES: Slide[] = [
  {
    kind: "image",
    src: "/hero/reach-overview.png",
    width: 505,
    height: 352,
    alt: "Facebook post insights showing 275,533 accounts reached",
    label: "275,533 reached on a single post",
  },
  { kind: "video", id: "YqXlh7RhfYs", label: "Listing walkthrough", dwell: 9000 },
  {
    kind: "image",
    src: "/hero/engagement.png",
    width: 595,
    height: 186,
    alt: "Post interactions: 4,310 reactions, 464 comments, 342 shares",
    label: "4,310 reactions · 464 comments",
  },
  { kind: "video", id: "4LmOGRxOos0", label: "Agent authority short", dwell: 9000 },
  {
    kind: "image",
    src: "/hero/instagram-insights.png",
    width: 341,
    height: 274,
    alt: "Instagram insights showing accounts reached up 151 percent",
    label: "+151% accounts reached in a week",
  },
  { kind: "video", id: "qQBcT8dVGic", label: "Talking-head edit", dwell: 9000 },
  {
    kind: "image",
    src: "/hero/before-after.png",
    width: 492,
    height: 390,
    alt: "Feed before and after: plain thumbnails replaced with hooked, captioned covers",
    label: "Same account, rebuilt covers",
  },
];

const DEFAULT_DWELL = 4600;

export function Hero() {
  const reduced = useReducedMotion();
  const animate = reduced ? undefined : "visible";
  const initial = reduced ? false : "hidden";

  return (
    <section
      id="top"
      className="relative flex min-h-[min(94svh,54rem)] items-center overflow-hidden pt-32 pb-24 md:pt-36 lg:pb-28"
    >
      <HeroBackdrop />

      <Container className="relative">
        {/*
          Explicit placement rather than plain source order: on a phone the
          grid collapses to one column and the reading order becomes copy →
          showcase → stats, so the visuals sit right under the buttons instead
          of below a wall of numbers. On desktop the copy and stats stack in
          column one while the showcase spans both rows in column two.
        */}
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[1.15fr_1fr]">
          <div className="lg:col-start-1 lg:row-start-1">
            <motion.div variants={rise} initial={initial} animate={animate} custom={0}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.035] py-1.5 pl-2.5 pr-4 text-[0.8125rem] text-fg-muted backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Available for new clients — {site.timezone}
              </span>
            </motion.div>

            <motion.h1
              variants={rise}
              initial={initial}
              animate={animate}
              custom={1}
              // No forced break here: the column is narrower now that the
              // showcase sits beside it, so the balance algorithm does a
              // better job than a hard-coded one ever could.
              className="mt-9 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.04]"
            >
              <span className="text-gradient">Marketing that runs without you</span>{" "}
              <span className="text-accent">running it.</span>
            </motion.h1>

            <motion.p
              variants={rise}
              initial={initial}
              animate={animate}
              custom={2}
              className="mt-7 max-w-xl type-lede text-fg-muted"
            >
              I&apos;m {site.shortName} — a marketing virtual assistant for real
              estate teams, agencies and growing businesses. Social media, video,
              design and the admin behind it, handled end to end so you can stay
              on the work only you can do.
            </motion.p>

            <motion.div
              variants={rise}
              initial={initial}
              animate={animate}
              custom={3}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <ButtonLink href={site.calendly} external size="lg">
                {site.cta.primary}
                <ArrowUpRight
                  className="h-4.5 w-4.5 transition-[transform,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  strokeWidth={2}
                />
              </ButtonLink>
              <ButtonLink href="#work" variant="secondary" size="lg">
                {site.cta.secondary}
                <ArrowRight
                  className="h-4.5 w-4.5 transition-[transform,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-1"
                  strokeWidth={1.75}
                />
              </ButtonLink>
            </motion.div>
          </div>

          <motion.div
            variants={rise}
            initial={initial}
            animate={animate}
            custom={2}
            className="mx-auto w-full max-w-[22rem] sm:max-w-[24rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-none lg:self-center"
          >
            <Showcase reduced={Boolean(reduced)} />
          </motion.div>

          <motion.dl
            variants={rise}
            initial={initial}
            animate={animate}
            custom={4}
            className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:col-start-1 lg:row-start-2"
          >
            {credentials.map((item) => (
              <div
                key={item.k}
                className="group relative border-t border-line pt-5 transition-colors duration-500 hover:border-line-strong"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-10"
                />
                <dt
                  className="text-[1.5rem] font-semibold leading-none tracking-[-0.03em] text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.k}
                </dt>
                <dd className="mt-2 text-[0.8125rem] leading-relaxed text-fg-subtle">
                  {item.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}

function Showcase({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;
  const timer = useRef<number | null>(null);

  const advance = useCallback(
    () => setActive((i) => (i + 1) % count),
    [count],
  );

  useEffect(() => {
    if (reduced || paused) return;
    const dwell = SLIDES[active].dwell ?? DEFAULT_DWELL;
    timer.current = window.setTimeout(advance, dwell);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [active, advance, paused, reduced]);

  const current = SLIDES[active];

  return (
    <div
      className="group/show relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/*
        The frame is a fixed 4:5 so the hero never changes height as slides
        swap — mixed portrait video and landscape screenshots would otherwise
        resize it on every tick.
      */}
      <div className="relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]"
        />

        {/* Stage and caption are separate rows rather than the caption floating
            over the art — otherwise the artwork centres against the whole
            frame and drifts behind the label. */}
        <div className="relative flex-1">
          {SLIDES.map((slide, i) => {
            const isActive = i === active;

            return (
              <div
                key={slide.kind === "image" ? slide.src : slide.id}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 flex items-center justify-center p-5 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-6",
                  isActive ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                {slide.kind === "image" ? (
                  // The wrapper carries the slide's own aspect ratio and grows
                  // to the stage, so it hugs the artwork exactly and the ring
                  // frames the screenshot rather than an empty box.
                  //
                  // Sizing it this way rather than letting the image size
                  // itself is deliberate: with `width:auto` the layout falls
                  // back to whichever srcset candidate the browser picked,
                  // which is neither predictable nor the size you asked for.
                  <div
                    className="relative max-h-full w-full rounded-xl ring-1 ring-white/10 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)]"
                    style={{ aspectRatio: `${slide.width} / ${slide.height}` }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      // Only the first slide is above the fold on load; the
                      // rest can wait rather than competing for bandwidth.
                      priority={i === 0}
                      loading={i === 0 ? undefined : "lazy"}
                      sizes="(max-width: 1024px) 88vw, 440px"
                      className="rounded-xl object-contain"
                    />
                  </div>
                ) : isActive ? (
                  // Mounted only while active: three permanent players would
                  // add megabytes to the hero for no benefit.
                  <iframe
                    key={slide.id}
                    src={`https://www.youtube-nocookie.com/embed/${slide.id}?autoplay=1&mute=1&loop=1&playlist=${slide.id}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`}
                    title={slide.label}
                    tabIndex={-1}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    // Decorative: the same clips are playable properly in the
                    // work section, so this one shouldn't trap clicks.
                    className="pointer-events-none aspect-[9/16] h-full w-auto rounded-xl border-0"
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="relative flex items-center gap-3 border-t border-line px-5 py-4 sm:px-6">
          {current.kind === "video" ? (
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
              <Play className="h-3 w-3 fill-accent" strokeWidth={0} />
            </span>
          ) : null}
          <p className="min-w-0 flex-1 truncate text-[0.8125rem] text-fg-muted">
            {current.label}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 lg:justify-start">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.kind === "image" ? slide.src : slide.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show item ${i + 1} of ${count}`}
            aria-current={i === active ? "true" : undefined}
            className="group/dot grid h-5 cursor-pointer place-items-center px-0.5"
          >
            <span
              className={cn(
                "h-1 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                i === active
                  ? "w-5 bg-accent"
                  : "w-1 bg-white/20 group-hover/dot:bg-white/45",
              )}
            />
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {current.label} — {active + 1} of {count}
      </p>
    </div>
  );
}

/**
 * Layered, low-cost background: a masked grid, a slow drifting accent bloom, a
 * cool counter-light on the right, and a vignette that hands off to the next
 * section. All decorative, all `pointer-events-none`.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 bg-grid"
        style={{
          maskImage:
            "radial-gradient(82% 66% at 28% 20%, #000 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(82% 66% at 28% 20%, #000 0%, transparent 100%)",
        }}
      />

      <div className="animate-drift absolute -left-[14%] top-[-20%] h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.19)_0%,rgba(34,197,94,0.05)_38%,rgba(34,197,94,0)_68%)] blur-[46px]" />
      <div className="absolute right-[-16%] top-[2%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_66%)] blur-[34px]" />
      <div className="absolute bottom-[-24%] left-[42%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,rgba(34,197,94,0)_70%)] blur-[52px]" />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink via-ink/72 to-transparent" />
      <div className="rule-fade absolute inset-x-0 bottom-0" />
    </div>
  );
}
