import { Film, Images, LayoutTemplate, Shapes } from "lucide-react";
import type { PortfolioCategory } from "@/content/portfolio";
import { cn } from "@/lib/utils";

const icons: Record<PortfolioCategory, typeof Film> = {
  "Video Editing": Film,
  "Social Media": Images,
  "Graphic Design": Shapes,
  "Landing Pages": LayoutTemplate,
};

/**
 * Generated artwork used in place of real project imagery. Each category gets a
 * distinct abstract composition so the grid reads as intentional rather than
 * as a wall of empty boxes. Swap in real images via `Project.image`.
 */
export function ProjectPlaceholder({
  category,
  seed,
  className,
}: {
  category: PortfolioCategory;
  seed: number;
  className?: string;
}) {
  const Icon = icons[category];

  return (
    <div
      aria-hidden
      className={cn(
        "relative h-full w-full overflow-hidden bg-ink-sunken",
        className,
      )}
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_60%)]" />

      {/* category-specific geometry */}
      {category === "Video Editing" ? <VideoArt seed={seed} /> : null}
      {category === "Social Media" ? <SocialArt seed={seed} /> : null}
      {category === "Graphic Design" ? <DesignArt seed={seed} /> : null}
      {category === "Landing Pages" ? <LandingArt seed={seed} /> : null}

      {/* accent glow, kept faint */}
      <div className="absolute -bottom-16 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-accent/12 blur-3xl" />

      {/* centre icon */}
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-white/12 bg-white/[0.06] backdrop-blur-md transition-[transform,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
          <Icon className="h-5 w-5 text-white/80" strokeWidth={1.5} />
        </span>
      </div>

      {/* vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.85)_0%,rgba(10,10,10,0)_55%)]" />
    </div>
  );
}

function VideoArt({ seed }: { seed: number }) {
  const offset = (seed % 3) * 8;
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* timeline bars */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x={30 + i * 40}
          y={200 - ((i * 37 + offset) % 70) - 20}
          width={14}
          height={((i * 37 + offset) % 70) + 40}
          rx={7}
          fill="rgba(255,255,255,0.07)"
        />
      ))}
      <rect
        x={30}
        y={250}
        width={340}
        height={1}
        fill="rgba(255,255,255,0.12)"
      />
      <rect
        x={30 + offset * 4}
        y={236}
        width={2}
        height={28}
        fill="#22c55e"
        opacity={0.75}
      />
    </svg>
  );
}

function SocialArt({ seed }: { seed: number }) {
  const cols = 3;
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 40 + (i % cols) * 110;
        const y = 40 + Math.floor(i / cols) * 110;
        const isAccent = (i + seed) % 7 === 0;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={90}
            height={90}
            rx={10}
            fill={
              isAccent ? "rgba(34,197,94,0.14)" : "rgba(255,255,255,0.055)"
            }
            stroke="rgba(255,255,255,0.07)"
          />
        );
      })}
    </svg>
  );
}

function DesignArt({ seed }: { seed: number }) {
  const r = 60 + (seed % 3) * 14;
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <circle
        cx={150}
        cy={190}
        r={r}
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={1}
      />
      <circle
        cx={250}
        cy={190}
        r={r}
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={1}
      />
      <rect
        x={200 - r}
        y={190 - r}
        width={r * 2}
        height={r * 2}
        stroke="rgba(34,197,94,0.28)"
        strokeWidth={1}
      />
      <line
        x1={0}
        y1={190}
        x2={400}
        y2={190}
        stroke="rgba(255,255,255,0.06)"
      />
      <line
        x1={200}
        y1={0}
        x2={200}
        y2={400}
        stroke="rgba(255,255,255,0.06)"
      />
    </svg>
  );
}

function LandingArt({ seed }: { seed: number }) {
  const w = 200 + (seed % 3) * 30;
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <rect
        x={60}
        y={60}
        width={280}
        height={280}
        rx={14}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.08)"
      />
      <rect x={84} y={92} width={w} height={12} rx={6} fill="rgba(255,255,255,0.14)" />
      <rect x={84} y={116} width={w - 60} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
      <rect x={84} y={136} width={w - 100} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
      <rect x={84} y={170} width={96} height={26} rx={13} fill="rgba(34,197,94,0.35)" />
      <rect x={84} y={222} width={232} height={90} rx={10} fill="rgba(255,255,255,0.035)" />
    </svg>
  );
}
