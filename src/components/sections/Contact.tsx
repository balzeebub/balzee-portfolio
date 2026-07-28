import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { ContactForm } from "./ContactForm";

const channels = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: Mail,
  },
  {
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phoneHref}`,
    icon: Phone,
  },
  {
    label: "Instagram",
    value: "@balzeebubb",
    href: site.instagram,
    icon: InstagramIcon,
  },
  {
    label: "Based in",
    value: `${site.location} · ${site.timezone}`,
    icon: MapPin,
  },
];

export function Contact() {
  return (
    <Section id="contact" className="overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-grid"
          style={{
            maskImage:
              "radial-gradient(74% 62% at 50% 0%, #000 0%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(74% 62% at 50% 0%, #000 0%, transparent 100%)",
          }}
        />
        <div className="absolute left-1/2 top-[-12%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.17)_0%,rgba(34,197,94,0.04)_40%,rgba(34,197,94,0)_70%)] blur-2xl" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow index="08">Contact</Eyebrow>
          </Reveal>
          <Reveal delay={0.07}>
            <h2 className="mt-7 text-[clamp(2.375rem,5.6vw,4.25rem)] leading-[1.02] text-gradient">
              Let&apos;s get your marketing
              <br className="hidden sm:block" /> off your plate.
            </h2>
          </Reveal>
          <Reveal delay={0.13}>
            <p className="mx-auto mt-7 max-w-xl type-lede text-fg-muted">
              Book a free 30-minute discovery call and we&apos;ll walk through
              where you are, what&apos;s slowing you down, and whether I&apos;m
              the right fit. No pitch deck, no pressure.
            </p>
          </Reveal>
          <Reveal delay={0.19}>
            <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href={site.calendly} external size="lg">
                {site.cta.primary}
                <ArrowUpRight
                  className="h-4.5 w-4.5 transition-[transform,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  strokeWidth={2}
                />
              </ButtonLink>
              <ButtonLink
                href={`mailto:${site.email}`}
                variant="secondary"
                size="lg"
              >
                <Mail className="h-4.5 w-4.5" strokeWidth={1.75} />
                Email me
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <Reveal>
            <div className="flex flex-col gap-9">
              <div>
                <h3 className="text-xl text-white">Prefer to write first?</h3>
                <p className="mt-3.5 type-body text-fg-muted">
                  Send a few details about your business and I&apos;ll come back
                  with an honest read on what I&apos;d do first — whether or not
                  we end up working together.
                </p>
              </div>

              <ul className="flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {channels.map(({ label, value, href, icon: Icon }) => {
                  const content = (
                    <>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-accent transition-[border-color,background-color] duration-500 group-hover/row:border-accent/40 group-hover/row:bg-accent/[0.07]">
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                          {label}
                        </span>
                        <span className="mt-1 block break-words text-[0.9375rem] text-white">
                          {value}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={label} className="bg-ink-raised">
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={
                            href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="group/row flex min-w-0 items-center gap-4 p-5 transition-colors duration-400 hover:bg-white/[0.035]"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="group/row flex min-w-0 items-center gap-4 p-5">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
