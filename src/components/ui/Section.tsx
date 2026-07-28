import { cn } from "@/lib/utils";
import { Container } from "./Container";

/**
 * Standard section shell.
 *
 * `divided` draws a hairline that fades out at both edges rather than a rule
 * running wall to wall — the seam between sections reads as a soft transition
 * instead of a hard cut.
 */
export function Section({
  id,
  className,
  containerClassName,
  divided = true,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  divided?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-28 py-20 sm:py-24 md:py-32 lg:py-40",
        className,
      )}
    >
      {divided ? (
        <div aria-hidden className="rule-fade absolute inset-x-0 top-0" />
      ) : null}
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
