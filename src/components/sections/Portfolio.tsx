"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  portfolioCategories,
  projects,
  type PortfolioCategory,
  type Project,
} from "@/content/portfolio";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectPlaceholder } from "@/components/ui/ProjectPlaceholder";
import { VideoModal, parseYouTubeUrl } from "@/components/ui/VideoModal";

type Filter = "All" | PortfolioCategory;

const filters: Filter[] = ["All", ...portfolioCategories];

const ratioClass = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
} as const;

type ThumbnailQuality = "maxresdefault" | "hqdefault";

/**
 * Poster frame for a project that has a video but no uploaded image.
 *
 * YouTube only publishes `maxresdefault` for some uploads — when it's missing
 * the request 404s, so the error handler drops to `hqdefault`, which always
 * exists. That fallback has to happen at runtime; there's no way to know which
 * one is available up front.
 *
 * This uses a plain <img> rather than next/image deliberately: next/image would
 * need `img.youtube.com` added to `images.remotePatterns` in next.config.ts,
 * and this keeps the change to a single file. The classes below reproduce what
 * `<Image fill>` emits, so it renders pixel-for-pixel the same.
 *
 * Rendered with `key={source.id}` so a change of video remounts it and retries
 * maxres, rather than inheriting a previous card's fallback.
 */
function YouTubeThumbnail({
  videoId,
  alt,
}: {
  videoId: string;
  alt: string;
}) {
  const [quality, setQuality] = useState<ThumbnailQuality>("maxresdefault");

  const downgrade = () =>
    setQuality((current) =>
      current === "maxresdefault" ? "hqdefault" : current,
    );

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see note above
    <img
      ref={(node) => {
        // The markup is server-rendered, so the browser can finish (and fail)
        // the request before React attaches onError. An image that is already
        // complete with no intrinsic width has errored — catch that here, or
        // the fallback silently never fires.
        if (node?.complete && node.naturalWidth === 0) downgrade();
      }}
      src={`https://img.youtube.com/vi/${videoId}/${quality}.jpg`}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={downgrade}
      className="absolute inset-0 h-full w-full object-cover transition-[transform,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
    />
  );
}

export function Portfolio() {
  const [active, setActive] = useState<Filter>("All");
  const [playing, setPlaying] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  const visible = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active),
    [active],
  );

  // Shorts are vertical; so are portrait tiles. Everything else plays 16:9.
  const playingSource = useMemo(
    () => parseYouTubeUrl(playing?.video),
    [playing],
  );
  const playingIsVertical =
    playingSource?.kind === "shorts" || playing?.ratio === "portrait";

  return (
    <Section id="work">
      <SectionHeading
        layout="split"
        index="03"
        eyebrow="Selected work"
        title="Work built to be looked at twice."
        description="A sample of recent projects across video, social, design and landing pages. Client names shown with permission; some assets are represented rather than reproduced."
      />

      {/* Category filter */}
      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-wrap items-center gap-2 border-t border-line pt-8 lg:mt-20">
          <span className="mr-2 hidden type-label text-fg-subtle sm:inline">
            Filter
          </span>
          <div role="tablist" aria-label="Filter work by category" className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = active === filter;
              return (
                <button
                  key={filter}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActive(filter)}
                  className={cn(
                    "relative rounded-full border px-4 py-2 text-[0.875rem] transition-[color,border-color,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px motion-reduce:hover:translate-y-0",
                    isActive
                      ? "border-accent/45 text-ink"
                      : "border-line text-fg-muted hover:border-line-strong hover:text-white",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="portfolio-filter"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative font-medium">{filter}</span>
                </button>
              );
            })}
          </div>
          <span
            aria-live="polite"
            className="ml-auto hidden text-[0.8125rem] tabular-nums text-fg-subtle md:block"
          >
            {visible.length} {visible.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </Reveal>

      {/* Grid */}
      <motion.div
        layout={!reduced}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => {
            // Parsed once and reused: it decides both whether the card is
            // clickable and, when there's no uploaded image, which video the
            // poster frame comes from. A malformed link resolves to null, so
            // the card degrades to the plain, unclickable placeholder version.
            const source = parseYouTubeUrl(project.video);
            const playable = source !== null;

            return (
              <motion.article
                key={project.title}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.98, y: -8 }}
                transition={{
                  duration: 0.5,
                  delay: reduced ? 0 : Math.min(i * 0.04, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised transition-[border-color,translate,scale,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_30px_70px_-38px_rgba(0,0,0,1)] motion-reduce:hover:translate-y-0"
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden",
                    ratioClass[project.ratio],
                  )}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.title} — ${project.category} work for ${project.client}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-[transform,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  ) : source ? (
                    <YouTubeThumbnail
                      key={source.id}
                      videoId={source.id}
                      alt={`${project.title} — ${project.category} work for ${project.client}`}
                    />
                  ) : (
                    <div className="absolute inset-0 transition-[transform,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
                      <ProjectPlaceholder
                        category={project.category}
                        seed={i + project.title.length}
                      />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full border border-white/12 bg-ink/70 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/70 backdrop-blur-md transition-colors duration-500 group-hover:border-white/20 group-hover:text-white/90">
                    {project.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[1.1875rem] leading-snug text-white">
                        {playable ? (
                          /* The button carries the title so it keeps an
                             accessible name; the span stretches its hit area
                             over the whole card without adding any visuals. */
                          <button
                            type="button"
                            onClick={() => setPlaying(project)}
                            aria-label={`Play video — ${project.title}`}
                            aria-haspopup="dialog"
                            className="cursor-pointer text-left"
                          >
                            <span
                              aria-hidden
                              className="absolute inset-0 z-10 rounded-2xl"
                            />
                            {project.title}
                          </button>
                        ) : (
                          project.title
                        )}
                      </h3>
                      <p className="mt-1.5 text-[0.8125rem] text-fg-subtle">
                        {project.client}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-4.5 w-4.5 shrink-0 text-fg-subtle transition-[color,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      strokeWidth={1.75}
                    />
                  </div>

                  <p className="mt-4 type-body text-fg-muted">
                    {project.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
                    <span className="rounded-full bg-accent/12 px-2.5 py-1 text-[0.75rem] font-medium text-accent transition-colors duration-500 group-hover:bg-accent/18">
                      {project.metric}
                    </span>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-fg-subtle transition-colors duration-500 group-hover:border-line-strong"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <VideoModal
        open={playing !== null}
        onClose={() => setPlaying(null)}
        url={playing?.video}
        title={playing?.title}
        subtitle={playing?.client}
        vertical={playingIsVertical}
      />
    </Section>
  );
}
