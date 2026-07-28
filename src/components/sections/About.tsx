import { Check, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const principles = [
  {
    icon: Clock,
    title: "Reliable by default",
    body: "Deadlines held, requests acknowledged the same day, and a weekly rhythm you can plan around.",
  },
  {
    icon: MessageSquare,
    title: "Proactive, not reactive",
    body: "I bring ideas to the table instead of waiting for a brief — and flag what isn't working before you notice.",
  },
  {
    icon: ShieldCheck,
    title: "Documented, not improvised",
    body: "Every workflow lives in an SOP, so your marketing keeps running whether or not I'm online.",
  },
];

export function About() {
  return (
    <Section id="about" divided={false}>
      <div className="grid gap-16 lg:grid-cols-[1.12fr_1fr] lg:gap-24">
        <div>
          <Reveal>
            <Eyebrow index="01">About</Eyebrow>
          </Reveal>

          <Reveal delay={0.07}>
            <h2 className="mt-7 max-w-xl type-display text-gradient">
              A marketing partner who operates like part of the team.
            </h2>
          </Reveal>

          <div className="mt-9 flex max-w-xl flex-col gap-6 type-lede text-fg-muted">
            <Reveal delay={0.13}>
              <p>
                I&apos;m {site.name} — most people call me {site.shortName}. I
                work with real estate professionals, agencies and small business
                owners who know their marketing needs to be consistent, but
                don&apos;t have the hours or the headcount to make it happen.
              </p>
            </Reveal>
            <Reveal delay={0.17}>
              <p>
                My background sits at the intersection of creative and
                operations: I edit the video, design the graphics, plan the
                calendar — and then build the systems that keep all of it moving
                without constant check-ins. That combination is why clients tend
                to start with one service and end up handing over the whole
                function.
              </p>
            </Reveal>
            <Reveal delay={0.21}>
              <p>
                I use AI where it earns its place — research, first drafts,
                repurposing — with a human editing pass on everything that
                ships. The tools speed up the work. The judgement stays mine.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.27}>
            <ul className="mt-11 flex flex-wrap gap-x-8 gap-y-3.5 border-t border-line pt-8">
              {[
                "Based in the Philippines",
                "US-hours overlap",
                "Long-term retainers",
              ].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2.5 text-sm text-fg-muted"
                >
                  <Check className="h-4 w-4 text-accent" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Stagger spotlight className="flex flex-col gap-4 lg:pt-3">
          {principles.map(({ icon: Icon, title, body }) => (
            <StaggerItem
              key={title}
              spotlight
              className="surface group rounded-2xl border border-line bg-ink-raised p-8 transition-[border-color,translate,scale,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] motion-reduce:hover:translate-y-0"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white/[0.04] text-accent transition-[border-color,background-color] duration-500 group-hover:border-accent/40 group-hover:bg-accent/[0.07]">
                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.6} />
              </span>
              <h3 className="mt-6 text-[1.1875rem] text-white">{title}</h3>
              <p className="mt-3 type-body text-fg-muted">{body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
