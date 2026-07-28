import { Quote, Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <Section id="testimonials" className="bg-ink-sunken/45">
      <SectionHeading
        layout="centered"
        index="07"
        eyebrow="Testimonials"
        title="What it's like to work together."
        description="Placeholder quotes for now — swap them for your own client feedback as it comes in."
      />

      <Stagger
        spotlight
        className="mt-20 grid gap-5 md:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-6"
      >
        {testimonials.map((t) => (
          <StaggerItem
            key={t.name}
            as="article"
            spotlight
            className="surface group flex flex-col rounded-2xl border border-line bg-ink-raised p-8 transition-[border-color,translate,scale,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_28px_64px_-36px_rgba(0,0,0,0.95)] motion-reduce:hover:translate-y-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5" aria-label="5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
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

            <blockquote className="mt-7 flex-1 type-body text-fg-muted">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <figcaption className="mt-8 flex min-w-0 items-center gap-3.5 border-t border-line pt-7">
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white/[0.04] text-[0.8125rem] font-semibold text-white/75 transition-colors duration-500 group-hover:border-line-strong"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-medium text-white">
                  {t.name}
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-fg-subtle">
                  {t.title}, {t.company}
                </span>
              </span>
            </figcaption>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
