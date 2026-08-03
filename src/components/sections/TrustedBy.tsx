/* eslint-disable @next/next/no-img-element -- Brand logos are supplied as
   pre-optimised SVG/PNG and must render at their exact original proportions,
   so they bypass next/image (which would also require dangerouslyAllowSVG). */

import { clients, type Client, type LogoTreatment } from "@/content/tools";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/*
 * Every logo is fitted into this one box with object-contain, so no file can
 * render wider or taller than any other regardless of its own dimensions.
 * Change these two numbers to resize the whole strip at once.
 */
const BOX = "h-9 w-[120px] sm:h-10 sm:w-[142px] lg:h-11 lg:w-[164px]";

/*
 * CSS can only knock out a background that is essentially pure white or pure
 * black — anything grey, coloured or photographic has to be re-exported with
 * real transparency.
 *
 *   white           brightness(0) invert(1) paints every opaque pixel white,
 *                   so mixed-colour logos all match. Needs a transparent file.
 *   knockout-light  invert turns the white box dark and the dark artwork
 *                   light; screen then drops the now-dark box out against the
 *                   dark section.
 *   knockout-dark   the box is already dark, so screen alone removes it.
 */
const TREATMENT: Record<LogoTreatment, string> = {
  white: "[filter:brightness(0)_invert(1)]",
  "knockout-light": "[filter:invert(1)_grayscale(1)] mix-blend-screen",
  "knockout-dark": "[filter:grayscale(1)] mix-blend-screen",
  none: "",
};

/**
 * Client logo strip.
 *
 * Logos are normalised into an identical box, held at 70% opacity and brought
 * to full opacity with a slight scale on hover. Any client without artwork
 * falls back to a clean text wordmark — see `src/content/tools.ts` for how to
 * drop real files in and how `scale` / `treatment` work.
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

/*
 * `transition` (rather than an explicit property list) is deliberate:
 * Tailwind v4's `scale-*` animates the CSS `scale` property, not `transform`.
 */
const INTERACTION =
  "opacity-70 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:opacity-100 group-hover/logo:scale-105 motion-reduce:transition-none motion-reduce:group-hover/logo:scale-100";

function ClientLogo({ client }: { client: Client }) {
  if (client.logo) {
    const { src, width, height, scale = 1, treatment = "white" } = client.logo;

    return (
      /*
       * The wrapper deliberately carries no opacity and no transform. Either
       * one would create a stacking context, and mix-blend-mode only blends
       * against the backdrop *inside* its own stacking context — an isolated
       * group would leave the knocked-out box plainly visible. So opacity and
       * the hover scale live on the image, which is the element doing the
       * blending.
       */
      <span
        className={cn("group/logo flex items-center justify-center", BOX)}
      >
        <img
          src={src}
          alt={`${client.name} logo`}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          style={{ transform: scale === 1 ? undefined : `scale(${scale})` }}
          // h-full w-full (not max-*) means object-contain does all the
          // fitting from the file's real intrinsic size, so a wrong `width` /
          // `height` in the data can't distort the layout.
          className={cn(
            "h-full w-full object-contain",
            INTERACTION,
            TREATMENT[treatment],
          )}
        />
      </span>
    );
  }

  return <LogoPlaceholder name={client.name} />;
}

/**
 * Text stand-in used until official artwork is supplied. Renders as a clean
 * wordmark in production; in development it carries a dashed outline so
 * missing assets are obvious while you work.
 */
function LogoPlaceholder({ name }: { name: string }) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <span
      title={isDev ? `Placeholder — official ${name} logo not yet supplied` : undefined}
      data-logo-placeholder={name}
      className={cn(
        "group/logo flex items-center justify-center text-center text-[0.9375rem] font-medium leading-tight tracking-[-0.022em] text-white sm:text-lg lg:text-xl",
        BOX,
        isDev && "rounded-sm outline outline-1 outline-dashed outline-white/25",
        INTERACTION,
      )}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {name}
    </span>
  );
}
