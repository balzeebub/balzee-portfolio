"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
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

export function Hero() {
  const reduced = useReducedMotion();
  const animate = reduced ? undefined : "visible";
  const initial = reduced ? false : "hidden";

  return (
    <section
      id="top"
      className="relative flex min-h-[min(94svh,54rem)] items-center overflow-hidden pt-36 pb-28 md:pt-40 lg:pb-32"
    >
      <HeroBackdrop />

      <Container className="relative">
        <div className="max-w-5xl">
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
            // The lower bound is set so "Marketing that runs" still fits on one
            // line at 320px — below that the forced break leaves an orphan.
            className="mt-10 max-w-4xl text-[clamp(2rem,6.6vw,4.75rem)] leading-[1.01] sm:leading-[0.99]"
          >
            <span className="text-gradient">Marketing that runs</span>
            <br />
            <span className="text-gradient">without you</span>{" "}
            <span className="text-accent">running it.</span>
          </motion.h1>

          <motion.p
            variants={rise}
            initial={initial}
            animate={animate}
            custom={2}
            className="mt-9 max-w-2xl type-lede text-fg-muted"
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
            className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center"
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
            className="mt-20 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:mt-24"
          >
            {credentials.map((item) => (
              <div
                key={item.k}
                className="group relative border-t border-line pt-6 transition-colors duration-500 hover:border-line-strong"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-10"
                />
                <dt
                  className="text-[1.625rem] font-semibold leading-none tracking-[-0.03em] text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.k}
                </dt>
                <dd className="mt-2.5 text-[0.8125rem] leading-relaxed text-fg-subtle">
                  {item.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>

      <ScrollCue reduced={Boolean(reduced)} />
    </section>
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

function ScrollCue({ reduced }: { reduced: boolean }) {
  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-9 left-1/2 hidden -translate-x-1/2 lg:block"
    >
      <span className="relative flex h-11 w-6 items-start justify-center overflow-hidden rounded-full border border-line-strong">
        <span className="animate-scroll-cue mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
    </div>
  );
}
