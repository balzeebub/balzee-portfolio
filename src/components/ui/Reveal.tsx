"use client";

import { useCallback, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Fade-up on scroll into view. Animates once, respects reduced-motion, and
 * never changes layout size — so it cannot cause a layout shift.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "li" | "section" | "header" | "article";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

/**
 * Parent that staggers any `<StaggerItem>` descendants as they enter view.
 *
 * With `spotlight`, it also runs a single rAF-throttled pointer listener for
 * the whole grid and writes cursor coordinates onto whichever card is under
 * the pointer. One listener per grid rather than one per card, and it opts out
 * entirely on touch devices where there is no hover to track.
 */
export function Stagger({
  children,
  className,
  as = "div",
  spotlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  spotlight?: boolean;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];
  const frame = useRef<number | null>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
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
    },
    [],
  );

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      onPointerMove={spotlight ? handlePointerMove : undefined}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
  spotlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  spotlight?: boolean;
}) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(spotlight && "spotlight", className)}
      variants={itemVariants}
      {...(spotlight ? { "data-spotlight": "" } : {})}
    >
      {children}
    </MotionTag>
  );
}
