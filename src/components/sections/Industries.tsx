import { industries } from "@/content/industries";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Industries() {
  return (
    <Section id="industries">
      <SectionHeading
        layout="split"
        index="05"
        eyebrow="Industries"
        title="Where I already know the playbook."
        description="No ramp-up time explaining your market. These are the spaces I work in every week, with the content formats and follow-up systems each one rewards."
      />

      <Stagger
        spotlight
        className="mt-20 grid gap-5 sm:grid-cols-2 lg:mt-24 lg:gap-6"
      >
        {industries.map(({ name, description, points, icon: Icon }) => (
          <StaggerItem
            key={name}
            as="article"
            spotlight
            className="surface group relative overflow-hidden rounded-2xl border border-line bg-ink-raised p-8 transition-[border-color,translate,scale,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_28px_64px_-36px_rgba(0,0,0,0.95)] motion-reduce:hover:translate-y-0 lg:p-10"
          >
            <div className="relative flex items-start justify-between gap-6">
              <div>
                <h3 className="text-[1.5rem] text-white">{name}</h3>
                <p className="mt-3.5 max-w-md type-body text-fg-muted">
                  {description}
                </p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-white transition-[color,border-color,background-color,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:bg-accent/[0.07] group-hover:text-accent">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
            </div>

            <ul className="relative mt-8 flex flex-wrap gap-2 border-t border-line pt-7">
              {points.map((point) => (
                <li
                  key={point}
                  className="rounded-full border border-line px-3 py-1.5 text-[0.8125rem] text-fg-subtle transition-colors duration-500 group-hover:border-line-strong group-hover:text-fg-muted"
                >
                  {point}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
