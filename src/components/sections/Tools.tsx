import { tools } from "@/content/tools";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Tools() {
  return (
    <Section id="tools">
      <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            index="06"
            eyebrow="Toolkit"
            title="Fluent in the stack you already use."
            description="No onboarding tax. I plug into your existing tools on day one — and if you don't have a stack yet, I'll set one up that your team can actually maintain."
          />
          <Reveal delay={0.19}>
            <p className="mt-9 border-l border-accent/50 pl-6 type-body text-fg-subtle">
              Using something not listed here? Send it over — picking up a new
              platform usually takes a day, not a week.
            </p>
          </Reveal>
        </div>

        <Stagger
          spotlight
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
        >
          {tools.map((tool) => (
            <StaggerItem
              key={tool.name}
              spotlight
              className="group flex flex-col items-start justify-between gap-6 bg-ink p-6 transition-colors duration-500 hover:bg-ink-raised lg:p-7"
            >
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white/[0.03] text-[0.8125rem] font-semibold tracking-tight text-white/70 transition-[color,border-color,background-color,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:bg-accent/[0.07] group-hover:text-accent"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tool.mark}
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium leading-snug text-white">
                  {tool.name}
                </p>
                <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                  {tool.category}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
