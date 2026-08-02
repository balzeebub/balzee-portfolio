"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Drag distance (or flick velocity) past which a swipe changes slide. */
const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 320;

export function Testimonials() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const frame = useRef<number | null>(null);
  const count = testimonials.length;

  const go = useCallback(
    (next: number) => setActive(((next % count) + count) % count),
    [count],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(active + 1);
    }
  };

  // Same cursor spotlight the other card grids use, scoped to this one card.
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
          className="mt-20 focus-visible:outline-none lg:mt-24"
        >
          {/*
            Every slide sits in the same grid cell. The track is therefore as
            tall as the longest quote and never resizes between slides — which
            is what stops the controls jumping around as you page through.
          */}
          {/*
            `overflow-x-clip` rather than `overflow-hidden`: it contains the
            off-screen slides (and a drag in progress) without also clipping the
            card's shadow vertically, and without adding a scroll container.
          */}
          <div className="mx-auto grid max-w-3xl overflow-x-clip">
            {testimonials.map((t, i) => {
              const offset = i - active;
              const isActive = offset === 0;

              return (
                <motion.article
                  key={t.name}
                  data-spotlight=""
                  aria-hidden={!isActive}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
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
                    opacity: isActive ? 1 : 0,
                    // Slides sit to the side they'd travel from, so the motion
                    // reads correctly in both directions without tracking one.
                    x: reduced ? 0 : isActive ? 0 : offset < 0 ? -40 : 40,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={cn(
                    "spotlight surface group col-start-1 row-start-1 flex flex-col rounded-2xl border border-line bg-ink-raised p-8 transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-line-strong hover:shadow-[0_28px_64px_-36px_rgba(0,0,0,0.95)] sm:p-12 lg:p-14",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "pointer-events-none",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1" aria-label="5 out of 5">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-accent text-accent"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <Quote
                      aria-hidden
                      className="h-8 w-8 text-white/10 transition-colors duration-500 group-hover:text-accent/30"
                      strokeWidth={1.5}
                    />
                  </div>

                  <blockquote className="mt-9 flex-1 text-[clamp(1.125rem,1.8vw,1.4375rem)] leading-[1.62] tracking-[-0.014em] text-fg-muted">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-10 flex min-w-0 items-center gap-4 border-t border-line pt-8">
                    <span
                      aria-hidden
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-white/[0.04] text-[0.875rem] font-semibold text-white/75 transition-colors duration-500 group-hover:border-line-strong"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {t.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1rem] font-medium text-white">
                        {t.name}
                      </span>
                      <span className="mt-0.5 block text-[0.8125rem] text-fg-subtle">
                        {t.title}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </motion.article>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <CarouselButton
              label="Previous testimonial"
              onClick={() => go(active - 1)}
            >
              <ChevronLeft className="h-4.5 w-4.5" strokeWidth={1.75} />
            </CarouselButton>

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
                    className="group/dot grid h-6 place-items-center px-0.5"
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

            <CarouselButton
              label="Next testimonial"
              onClick={() => go(active + 1)}
            >
              <ChevronRight className="h-4.5 w-4.5" strokeWidth={1.75} />
            </CarouselButton>
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
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong text-white transition-[color,border-color,background-color,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.06] active:translate-y-0 motion-reduce:hover:translate-y-0"
    >
      {children}
    </button>
  );
}
