import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-medium transition-[translate,scale,background-color,border-color,box-shadow,color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink shadow-[0_1px_0_0_rgba(255,255,255,0.28)_inset] hover:bg-accent-soft hover:shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset,0_14px_44px_-10px_rgba(34,197,94,0.62)]",
  secondary:
    "border border-line-strong bg-white/[0.035] text-white backdrop-blur-sm hover:border-white/32 hover:bg-white/[0.075] hover:shadow-[0_12px_38px_-14px_rgba(0,0,0,0.9)]",
  ghost: "text-fg-muted hover:text-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.375rem] px-8 text-base",
};

/**
 * A light sweep that crosses the button once on hover. Sits above the fill and
 * below the label, and is hidden from pointer events entirely.
 */
function Sheen({ variant }: { variant: Variant }) {
  if (variant === "ghost") return null;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
    >
      <span
        className={cn(
          "absolute inset-y-0 -left-1/3 w-1/3 -translate-x-[140%] skew-x-[-16deg] transition-[transform,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[420%] motion-reduce:hidden",
          variant === "primary" ? "bg-white/28" : "bg-white/[0.09]",
        )}
      />
    </span>
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <Sheen variant={variant} />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  children,
  ...props
}: CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      <Sheen variant={variant} />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {inner}
    </Link>
  );
}
