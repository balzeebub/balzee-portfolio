/* eslint-disable @next/next/no-img-element -- Brand logos are supplied as
   pre-optimised SVG/PNG and must render at their exact original proportions,
   so they bypass next/image (which would also require dangerouslyAllowSVG). */

import { clients, type Client } from "@/content/tools";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Client logo strip.
 *
 * Logos are normalised to a consistent visual height, laid out on an even
 * grid, held at 70% opacity and brought to full opacity with a slight scale on
 * hover. Any client without artwork falls back to a clean text wordmark — see
 * `src/content/tools.ts` for how to drop real files in.
 */
export function TrustedBy() {
  return (
    <section
      aria-label="Clients"
      className="relative bg-ink-sunken/70 py-14 md:py-16"
    >
      <div aria-hidden className="rule-fade absolute inset-x-0 top-0" />
      <div aria-hidden className="rule-fade absolute inset-x-0 bottom-0" />

      <Container>
        <Reveal>
          <p className="text-center type-label text-fg-subtle">
            Trusted by teams at
          </p>
        </Reveal>

        <Reveal delay={0.09}>
          <ul className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-10 md:mt-12 lg:gap-x-16">
            {clients.map((client) => (
              <li key={client.name} className="flex items-center justify-center">
                <ClientLogo client={client} />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

function ClientLogo({ client }: { client: Client }) {
  // Opacity, scale and timing are shared by both the image and the fallback so
  // a half-populated strip still behaves consistently. `transition` (rather
  // than an explicit property list) is deliberate: Tailwind v4's `scale-*`
  // animates the CSS `scale` property, not `transform`.
  const interaction =
    "opacity-70 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-100 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100";

  if (client.logo) {
    const { src, width, height, scale = 1 } = client.logo;

    return (
      <img
        src={src}
        alt={`${client.name} logo`}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={{ transform: scale === 1 ? undefined : `scale(${scale})` }}
        // Height is fixed and width follows the source ratio, so marks of very
        // different proportions still read as the same visual size.
        className={`h-6 w-auto max-w-full object-contain sm:h-7 lg:h-8 ${interaction}`}
      />
    );
  }

  return <LogoPlaceholder name={client.name} interaction={interaction} />;
}

/**
 * Text stand-in used until official artwork is supplied. Renders as a clean
 * wordmark in production; in development it carries a dashed outline so
 * missing assets are obvious while you work.
 */
function LogoPlaceholder({
  name,
  interaction,
}: {
  name: string;
  interaction: string;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <span
      title={isDev ? `Placeholder — official ${name} logo not yet supplied` : undefined}
      data-logo-placeholder={name}
      className={[
        "flex h-6 items-center justify-center text-center text-[0.9375rem] font-medium leading-tight tracking-[-0.022em] text-white sm:h-7 sm:text-lg lg:h-8 lg:text-xl",
        isDev ? "rounded-sm px-2 outline outline-1 outline-dashed outline-white/25" : "",
        interaction,
      ].join(" ")}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {name}
    </span>
  );
}
