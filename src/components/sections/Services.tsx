import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        layout="split"
        index="02"
        eyebrow="Services"
        title="Everything your marketing needs, under one roof."
        description="Hire for one service or hand over the whole function. Each engagement is scoped to your priorities and reviewed monthly against what it actually produced."
      />

      {/* Hairline grid: a 1px gap over a line-coloured background gives clean
          dividers that never double up at the seams. */}
      <Stagger
        spotlight
        className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
      >
        {services.map(({ title, summary, deliverables, icon: Icon }, i) => (
          <StaggerItem
            key={title}
            as="article"
            spotlight
            className="group relative flex flex-col bg-ink p-8 transition-colors duration-500 hover:bg-ink-raised lg:p-9"
          >
            {/* Accent hairline that draws in from the centre on hover. */}
            <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-[transform,scale,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-hover:opacity-70" />

            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white/[0.03] text-white transition-[color,border-color,background-color,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:bg-accent/[0.07] group-hover:text-accent">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span
                aria-hidden
                className="text-[0.75rem] tabular-nums text-fg-subtle/70 transition-colors duration-500 group-hover:text-fg-subtle"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mt-7 text-[1.3125rem] text-white">{title}</h3>

            <p className="mt-3.5 type-body text-fg-muted">{summary}</p>

            <ul className="mt-7 flex flex-col gap-2.5 border-t border-line pt-7">
              {deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-fg-subtle transition-colors duration-500 group-hover:text-fg-muted"
                >
                  <span
                    aria-hidden
                    className="mt-[0.4375rem] h-1 w-1 shrink-0 rounded-full bg-accent/70"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-col items-start gap-5 rounded-2xl border border-line bg-ink-raised px-8 py-7 transition-colors duration-500 hover:border-line-strong sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="type-lede text-fg-muted">
            Not sure which of these you need?{" "}
            <span className="text-white">
              Let&apos;s figure it out on a call.
            </span>
          </p>
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex shrink-0 items-center gap-2 text-[0.9375rem] font-medium text-accent transition-colors duration-300 hover:text-accent-soft"
          >
            {site.cta.primary}
            <ArrowUpRight
              className="h-4 w-4 transition-[transform,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              strokeWidth={2}
            />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
