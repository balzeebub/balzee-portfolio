"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

/* ── Media wall ────────────────────────────────────────────────────────────
   Purely decorative. Four columns of work drift past each other behind the
   hero copy: screenshots from /public/hero and the three shorts, muted and
   looping. Nothing here is interactive and nothing is announced to screen
   readers — it is texture, not content, so the copy has to carry the meaning
   on its own.                                                              */

type Tile =
  | { kind: "image"; src: string; width: number; height: number }
  | { kind: "video"; id: string };

const REACH: Tile = { kind: "image", src: "/hero/reach-overview.png", width: 505, height: 352 };
const ENGAGEMENT: Tile = { kind: "image", src: "/hero/engagement.png", width: 595, height: 186 };
const INSTAGRAM: Tile = { kind: "image", src: "/hero/instagram-insights.png", width: 341, height: 274 };
const BEFORE_AFTER: Tile = { kind: "image", src: "/hero/before-after.png", width: 492, height: 390 };

/*
 * Column order matters for cost, not just looks: columns three and four only
 * exist on wider screens, so a phone mounts exactly one player instead of
 * three. Videos never repeat across columns — a duplicated id would be a
 * second player streaming the same clip.
 */
const COLUMNS: { tiles: Tile[]; direction: 1 | -1; duration: number }[] = [
  {
    tiles: [REACH, { kind: "video", id: "YqXlh7RhfYs" }, BEFORE_AFTER],
    direction: -1,
    duration: 52,
  },
  {
    tiles: [ENGAGEMENT, INSTAGRAM, REACH],
    direction: 1,
    duration: 64,
  },
  {
    tiles: [{ kind: "video", id: "4LmOGRxOos0" }, ENGAGEMENT, BEFORE_AFTER],
    direction: -1,
    duration: 58,
  },
  {
    tiles: [INSTAGRAM, { kind: "video", id: "qQBcT8dVGic" }, ENGAGEMENT],
    direction: 1,
    duration: 46,
  },
];

/* Each column is rendered REPEATS times back to back and travels exactly one
   copy's worth, so the loop point is invisible. */
const REPEATS = 3;

export function Hero() {
  const reduced = useReducedMotion();
  const animate = reduced ? undefined : "visible";
  const initial = reduced ? false : "hidden";
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[min(94svh,52rem)] items-center overflow-hidden pt-32 pb-24 md:pt-36 lg:pb-28"
    >
      <MediaWall sectionRef={sectionRef} reduced={Boolean(reduced)} />
      <HeroBackdrop />

      <Container className="relative">
        <div className="max-w-2xl lg:max-w-3xl">
          <motion.div variants={rise} initial={initial} animate={animate} custom={0}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.045] py-1.5 pl-2.5 pr-4 text-[0.8125rem] text-fg-muted backdrop-blur-sm">
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
            className="mt-9 text-[clamp(2.4rem,5.6vw,4.25rem)] leading-[1.03]"
          >
            <span className="text-gradient">Marketing that runs</span>
            <br />
            <span className="text-gradient">without you </span>
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

          <motion.dl
            variants={rise}
            initial={initial}
            animate={animate}
            custom={4}
            className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3"
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

/**
 * How many columns are actually rendered at the current width.
 *
 * `useSyncExternalStore` rather than state-plus-effect: it gives a real server
 * snapshot (so the markup matches on hydration) and never writes state during
 * render or during an effect. Columns beyond this count are not rendered at
 * all — `hidden` would still mount and stream their players.
 *
 * The server snapshot is deliberately 0. Rendering a guessed two columns and
 * then widening to four on hydration relaid the whole wall out and cost 0.94
 * of layout shift; starting empty means the columns only ever appear, and
 * appearing absolutely-positioned decoration shifts nothing.
 */
function useColumnCount() {
  const subscribe = useCallback((onChange: () => void) => {
    const queries = [
      window.matchMedia("(min-width: 640px)"),
      window.matchMedia("(min-width: 1024px)"),
    ];
    queries.forEach((q) => q.addEventListener("change", onChange));
    return () => queries.forEach((q) => q.removeEventListener("change", onChange));
  }, []);

  return useSyncExternalStore(
    subscribe,
    () =>
      window.matchMedia("(min-width: 1024px)").matches
        ? 4
        : window.matchMedia("(min-width: 640px)").matches
          ? 3
          : 2,
    () => 0,
  );
}

function MediaWall({
  sectionRef,
  reduced,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  reduced: boolean;
}) {
  const columnCount = useColumnCount();
  // Players are created only once the hero is actually on screen, and torn
  // down when it scrolls away — no point streaming three clips to someone
  // reading the testimonials.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, sectionRef]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-out",
        columnCount > 0 ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute left-1/2 top-1/2 flex w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-[9deg] items-start gap-3 opacity-[0.62] sm:w-[128%] sm:gap-4 lg:w-[112%] lg:opacity-[0.72]">
        {COLUMNS.slice(0, columnCount).map((column, index) => (
          <MediaColumn
            key={index}
            column={column}
            playVideos={inView}
            reduced={reduced}
          />
        ))}
      </div>

      {/*
        Two scrims, not one. The flat wash keeps contrast on a phone where the
        copy sits over the middle of the wall; on a wide screen it steps aside
        for a left-to-right ramp so the text edge stays black while the right
        of the frame opens up. Then a vertical fade hands the section off to
        the navbar above and the clients strip below.
      */}
      <div className="absolute inset-0 bg-ink/76 sm:bg-ink/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-ink lg:from-26% lg:via-ink/84 lg:to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/15 to-ink" />
    </div>
  );
}

function MediaColumn({
  column,
  playVideos,
  reduced,
}: {
  column: (typeof COLUMNS)[number];
  playVideos: boolean;
  reduced: boolean;
}) {
  const { tiles, direction, duration } = column;
  const travel = `${direction * (100 / REPEATS)}%`;

  return (
    <div className="flex-1">
      <motion.div
        className="flex flex-col gap-3 sm:gap-4"
        // A single long linear loop rather than per-tile animation: one
        // composited transform per column instead of a dozen.
        initial={{ y: direction === 1 ? travel : "0%" }}
        animate={reduced ? undefined : { y: direction === 1 ? "0%" : travel }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: REPEATS }).flatMap((_, copy) =>
          tiles.map((tile, i) => (
            <MediaTile
              key={`${copy}-${i}`}
              tile={tile}
              // Only the first copy gets a live player; the repeats reuse the
              // poster frame, so looping the wall never multiplies the cost.
              live={copy === 0 && playVideos}
            />
          )),
        )}
      </motion.div>
    </div>
  );
}

function MediaTile({ tile, live }: { tile: Tile; live: boolean }) {
  if (tile.kind === "image") {
    return (
      <div
        className="relative overflow-hidden rounded-xl bg-ink-raised ring-1 ring-white/10"
        style={{ aspectRatio: `${tile.width} / ${tile.height}` }}
      >
        <Image
          src={tile.src}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 38vw, 26vw"
          className="object-cover blur-[1.5px]"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-ink-raised ring-1 ring-white/10">
      {live ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${tile.id}?autoplay=1&mute=1&loop=1&playlist=${tile.id}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`}
          title=""
          tabIndex={-1}
          aria-hidden
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0 blur-[1.5px]"
        />
      ) : null}
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
      <div className="absolute right-[-16%] top-[2%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_66%)] blur-[34px]" />
      <div className="absolute bottom-[-24%] left-[42%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,rgba(34,197,94,0)_70%)] blur-[52px]" />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink via-ink/72 to-transparent" />
      <div className="rule-fade absolute inset-x-0 bottom-0" />
    </div>
  );
}
