/**
 * Placeholder metrics — swap the numbers for your real figures.
 * `value` is animated as a count-up, `prefix`/`suffix` are rendered as-is.
 */
export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  detail: string;
};

export const stats: Stat[] = [
  {
    value: 214,
    prefix: "+",
    suffix: "%",
    label: "Average reach growth",
    detail: "Across managed accounts in the first 90 days",
  },
  {
    value: 500,
    suffix: "+",
    label: "Assets delivered",
    detail: "Videos, carousels, graphics and landing pages",
  },
  {
    value: 20,
    suffix: "+",
    label: "Hours returned weekly",
    detail: "Time handed back to founders and agents",
  },
  {
    value: 4.9,
    decimals: 1,
    suffix: "/5",
    label: "Client satisfaction",
    detail: "Based on post-engagement feedback",
  },
];

export const highlights: string[] = [
  "Same-day turnaround on priority requests",
  "Weekly reporting you can forward to a client",
  "Documented SOPs so nothing depends on memory",
  "Overlap with US business hours as standard",
];
