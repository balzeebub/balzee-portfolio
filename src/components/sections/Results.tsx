import { Check } from "lucide-react";
import { highlights, stats } from "@/content/results";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

export function Results() {
  return (
    <Section id="results" className="bg-ink-sunken/45">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-80 w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.115)_0%,rgba(34,197,94,0)_70%)] blur-2xl" />
      </div>

      <div className="relative">
        <SectionHeading
          layout="centered"
          index="04"
          eyebrow="Results"
          title="Numbers the work actually moved."
          description="Figures below are indicative of typical engagements and are easy to update as your own results come in."
        />

        <Stagger
          spotlight
          className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StaggerItem
              key={stat.label}
              spotlight
              className="surface group bg-ink px-7 py-12 text-center transition-colors duration-500 hover:bg-ink-raised"
            >
              <p
                className="text-[clamp(2.5rem,4.6vw,3.5rem)] font-semibold leading-none tracking-[-0.045em] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.prefix ?? ""}
                <Counter value={stat.value} decimals={stat.decimals ?? 0} />
                {stat.suffix ? (
                  <span
                    className={
                      stat.suffix.startsWith("/")
                        ? "text-fg-subtle"
                        : "text-accent"
                    }
                  >
                    {stat.suffix}
                  </span>
                ) : null}
              </p>
              <p className="mt-5 text-[0.9375rem] font-medium text-white">
                {stat.label}
              </p>
              <p className="mx-auto mt-2 max-w-[16rem] text-[0.8125rem] leading-relaxed text-fg-subtle">
                {stat.detail}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.12}>
          <ul className="mx-auto mt-14 grid max-w-4xl gap-x-12 gap-y-5 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3.5 text-[0.9375rem] leading-relaxed text-fg-muted"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/14">
                  <Check className="h-3 w-3 text-accent" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
