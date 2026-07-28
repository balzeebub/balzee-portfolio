import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/**
 * Small caps label. An optional index turns it into an editorial section
 * marker ("03 — Selected work") which gives the page a sense of running order.
 */
export function Eyebrow({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 type-label text-fg-subtle",
        className,
      )}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
      {index ? (
        <>
          <span className="text-fg-muted tabular-nums">{index}</span>
          <span aria-hidden className="h-px w-5 bg-line-strong" />
        </>
      ) : null}
      {children}
    </span>
  );
}

/**
 * Section header.
 *
 * `stacked`  — headline and standfirst in a single left column.
 * `split`    — headline left, standfirst right, baselines aligned. Reads more
 *              like a magazine spread and stops every section opening the
 *              same way.
 * `centered` — for the two sections that earn a symmetrical opening.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  layout = "stacked",
  className,
}: {
  eyebrow: string;
  index?: string;
  title: React.ReactNode;
  description?: string;
  layout?: "stacked" | "split" | "centered";
  className?: string;
}) {
  const centered = layout === "centered";

  const heading = (
    <>
      <Reveal>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.07}>
        <h2
          className={cn(
            "mt-7 type-display text-gradient",
            centered ? "mx-auto max-w-3xl" : "max-w-2xl",
            layout === "split" && "lg:mt-8",
          )}
        >
          {title}
        </h2>
      </Reveal>
    </>
  );

  const lede = description ? (
    <Reveal delay={0.13}>
      <p
        className={cn(
          "type-lede text-fg-muted",
          centered ? "mx-auto max-w-2xl" : "max-w-xl",
          layout === "split" ? "lg:pb-1.5" : "mt-7",
        )}
      >
        {description}
      </p>
    </Reveal>
  ) : null;

  if (layout === "split") {
    return (
      <div
        className={cn(
          "grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-20",
          className,
        )}
      >
        <div>{heading}</div>
        {lede}
      </div>
    );
  }

  return (
    <div className={cn(centered && "text-center", className)}>
      {heading}
      {lede}
    </div>
  );
}
