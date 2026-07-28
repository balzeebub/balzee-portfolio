export type Tool = {
  name: string;
  category: string;
  /** Short mark rendered inside the icon tile. */
  mark: string;
};

export const tools: Tool[] = [
  { name: "Canva", category: "Design", mark: "Cv" },
  { name: "Adobe Premiere Pro", category: "Video", mark: "Pr" },
  { name: "CapCut", category: "Video", mark: "Cc" },
  { name: "Adobe Photoshop", category: "Design", mark: "Ps" },
  { name: "ChatGPT", category: "AI", mark: "GPT" },
  { name: "Claude", category: "AI", mark: "Cl" },
  { name: "Notion", category: "Ops", mark: "N" },
  { name: "Google Workspace", category: "Ops", mark: "G" },
  { name: "Meta Business Suite", category: "Social", mark: "Meta" },
  { name: "Slack", category: "Ops", mark: "Sl" },
  { name: "CRM Platforms", category: "Sales", mark: "CRM" },
  { name: "Trello / Asana", category: "Ops", mark: "Tr" },
];

/**
 * Logos shown in the "Trusted by" strip.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A LOGO
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Save the official asset to `public/logos/` (SVG preferred; otherwise a
 *    high-resolution PNG with a transparent background).
 * 2. Fill in the `logo` field below with its path and intrinsic pixel size.
 *    The intrinsic size is only used to reserve space and preserve the aspect
 *    ratio — display height is normalised in the component, so logos of
 *    different proportions still line up.
 *
 *      logo: { src: "/logos/exp-realty.svg", width: 512, height: 128 }
 *
 * Do not redraw or recolour the artwork. Use the brand's own monochrome-white
 * version if they publish one; otherwise supply the official colour version.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ASSETS STILL NEEDED  (all four currently render as text placeholders)
 * ─────────────────────────────────────────────────────────────────────────────
 * See README.md → "Trusted By logos" for where to obtain each one and which
 * company names are ambiguous and need confirming first.
 */
export type Client = {
  name: string;
  /** Official artwork. Omit to fall back to the text wordmark placeholder. */
  logo?: {
    src: string;
    /** Intrinsic dimensions of the file, used to preserve aspect ratio. */
    width: number;
    height: number;
    /** Optional per-logo tweak when one mark reads optically larger or smaller. */
    scale?: number;
  };
};

export const clients: Client[] = [
  { name: "eXp Realty" },
  { name: "Pacific Realty Group" },
  { name: "Realty of America" },
  { name: "Everyday Order" },
];
