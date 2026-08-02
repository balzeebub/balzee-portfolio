"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Size knobs ────────────────────────────────────────────────────────────
   CARD_MAX   how wide a card can get, in px
   CARD_VW    how much of the carousel width a card may take on small screens
   GAP        space between cards
   Shrink CARD_MAX to make every card smaller.                              */
const CARD_MAX = 340;
const CARD_VW = 0.86;
const GAP = 22;

/** Height of the dots row, so the edge arrows centre on the track alone. */
const CONTROLS_HEIGHT = "3.75rem";

/** Drag distance (or flick velocity) past which a swipe changes slide. */
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 300;

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const count = testimonials.length;
  const ready = cardWidth > 0;

  // Card width is measured rather than set in CSS: the sideways offsets are
  // plain numbers, so Framer can interpolate them instead of fighting calc().
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () =>
      setCardWidth(Math.min(CARD_MAX, el.clientWidth * CARD_VW));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (next: number) => setActive(((next % count) + count) % count),
    [count],
  );

  /** Shortest signed distance from the active card — this is what makes the
   *  row wrap around seamlessly instead of running out at either end. */
  const offsetOf = (index: number) => {
    const forward = (index - active + count) % count;
    return forward > count / 2 ? forward - count : forward;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(active + 1);
    }
  };

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const card = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-spotlight]",
    );
    if (!card) return;

    const { clientX, clientY } = event;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    });
  }, []);

  return (
    <Section id="testimonials" className="bg-ink-sunken/45">
      <SectionHeading
        layout="centered"
        index="07"
        eyebrow="Testimonials"
        title="What it's like to work together."
        description="Placeholder quotes for now — swap them for your own client feedback as it comes in."
      />

      <Reveal delay={0.1}>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerMove={onPointerMove}
          className="relative mt-20 focus-visible:outline-none lg:mt-24"
        >
          {/*
            Every card sits in the same grid cell and is pushed sideways from
            there. The cell is as tall as the longest quote, so the row never
            changes height as you page through, and `overflow-x-clip` trims the
            cards that travel past the edges without clipping their shadow.
          */}
          <div
            ref={viewportRef}
            className="grid overflow-x-clip transition-opacity duration-500"
            style={{ opacity: ready ? 1 : 0 }}
          >
            {testimonials.map((t, i) => {
              const offset = offsetOf(i);
              const isActive = offset === 0;
              const isNeighbour = Math.abs(offset) === 1;

              return (
                <motion.article
                  key={t.name}
                  data-spotlight=""
                  aria-hidden={!isActive}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  onClick={() => !isActive && setActive(i)}
                  drag={isActive && !reduced ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    const { offset: o, velocity: v } = info;
                    if (o.x < -SWIPE_DISTANCE || v.x < -SWIPE_VELOCITY) {
                      go(active + 1);
                    } else if (o.x > SWIPE_DISTANCE || v.x > SWIPE_VELOCITY) {
                      go(active - 1);
                    }
                  }}
                  initial={false}
                  animate={{
                    x: offset * (cardWidth + GAP),
                    scale: isActive ? 1 : 0.92,
                    opacity: isActive ? 1 : isNeighbour ? 0.5 : 0,
                    filter: isActive
                      ? "blur(0px)"
                      : isNeighbour
                        ? "blur(3px)"
                        : "blur(6px)",
                  }}
                  transition={{
                    duration: reduced ? 0 : 0.55,
                    ease: EASE,
                  }}
                  style={{ width: cardWidth, zIndex: isActive ? 30 : 20 }}
                  className={cn(
                    "spotlight surface group col-start-1 row-start-1 flex flex-col justify-self-center rounded-2xl border bg-ink-raised p-7 transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8",
                    isActive
                      ? "cursor-grab border-line-strong shadow-[0_28px_64px_-36px_rgba(0,0,0,0.95)] active:cursor-grabbing"
                      : "border-line",
                    // Far cards are invisible, so they must not swallow clicks.
                    !isActive && (isNeighbour ? "cursor-pointer" : "pointer-events-none"),
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1" aria-label="5 out of 5">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star
                          key={star}
                          className="h-3.5 w-3.5 fill-accent text-accent"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <Quote
                      aria-hidden
                      className="h-6 w-6 text-white/10 transition-colors duration-500 group-hover:text-accent/30"
                      strokeWidth={1.5}
                    />
                  </div>

                  <blockquote className="mt-6 flex-1 type-body text-fg-muted">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-7 flex min-w-0 items-center gap-3.5 border-t border-line pt-6">
                    <span
                      aria-hidden
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white/[0.04] text-[0.8125rem] font-semibold text-white/75 transition-colors duration-500 group-hover:border-line-strong"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-medium text-white">
                        {t.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.8125rem] text-fg-subtle">
                        {t.title}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </motion.article>
              );
            })}
          </div>

          {/* One arrow pair, pinned to the edges of the track at every size.
              On narrow screens they overlap the card's padding, never its text.
              Duplicating them for a mobile layout would put two identically
              labelled buttons in the accessibility tree. */}
          <div
            className="pointer-events-none absolute inset-x-0 z-40 flex items-center justify-between"
            style={{ top: 0, bottom: CONTROLS_HEIGHT }}
          >
            <CarouselButton
              label="Previous testimonial"
              onClick={() => go(active - 1)}
              className="pointer-events-auto"
            >
              <ChevronLeft className="h-4.5 w-4.5" strokeWidth={1.75} />
            </CarouselButton>
            <CarouselButton
              label="Next testimonial"
              onClick={() => go(active + 1)}
              className="pointer-events-auto"
            >
              <ChevronRight className="h-4.5 w-4.5" strokeWidth={1.75} />
            </CarouselButton>
          </div>

          <div className="mt-9 flex items-center justify-center">
            <div className="flex items-center gap-2.5">
              {testimonials.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to testimonial ${i + 1} of ${count}`}
                    aria-current={isActive ? "true" : undefined}
                    className="group/dot grid h-6 cursor-pointer place-items-center px-0.5"
                  >
                    <span
                      className={cn(
                        "h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive
                          ? "w-6 bg-accent"
                          : "w-1.5 bg-white/20 group-hover/dot:bg-white/45",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            Testimonial {active + 1} of {count}: {testimonials[active].name}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

function CarouselButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong bg-ink/70 text-white backdrop-blur-sm transition-[color,border-color,background-color,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.08] active:translate-y-0 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {children}
    </button>
  );
}
