export type Tool = {
  name: string;
  category: string;
  /** Logo stored in /public/tools */
  logo: string;
};

export const tools: Tool[] = [
  {
    name: "Canva",
    category: "Design",
    logo: "/tools/canva.svg",
  },
  {
    name: "Adobe Premiere Pro",
    category: "Video",
    logo: "/tools/premiere.svg",
  },
  {
    name: "CapCut",
    category: "Video",
    logo: "/tools/capcut.png",
  },
  {
    name: "Adobe Photoshop",
    category: "Design",
    logo: "/tools/photoshop.svg",
  },
  {
    name: "ChatGPT",
    category: "AI",
    logo: "/tools/chatgpt.png",
  },
  {
    name: "Claude",
    category: "AI",
    logo: "/tools/claude.png",
  },
  {
    name: "Notion",
    category: "Ops",
    logo: "/tools/notion.webp",
  },
  {
    name: "Google Workspace",
    category: "Ops",
    logo: "/tools/google.webp",
  },
  {
    name: "Meta Business Suite",
    category: "Social",
    logo: "/tools/meta.svg",
  },
  {
    name: "Slack",
    category: "Ops",
    logo: "/tools/slack.svg",
  },
  {
    name: "CRM Platforms",
    category: "Sales",
    logo: "/tools/crm.jpg",
  },
  {
    name: "Trello",
    category: "Ops",
    logo: "/tools/trello.svg",
  },
  {
    name: "Asana",
    category: "Ops",
    logo: "/tools/asana.png",
  },
];

/* ───────────────────────────────────────────────────────────────────────────
   "Trusted by" strip

   Two things decide how a logo looks, and they are separate problems:

   SIZE      Every logo is fitted into one identical box (set in TrustedBy.tsx)
             using object-contain, so nothing can be wider or taller than
             anything else. Optical weight still varies — a circular mark
             reads smaller than a wide wordmark at the same box size — so
             `scale` nudges an individual logo. Square marks usually want
             1.15–1.3; wordmarks with lots of built-in padding want 1.1–1.2.

   BACKGROUND  `treatment` picks a CSS filter/blend combination. CSS can only
             knock out a background that is essentially pure white or pure
             black. A grey, coloured, gradient or photographic background
             cannot be removed in code — that file has to be re-exported with
             real transparency. See README notes below the type.
   ─────────────────────────────────────────────────────────────────────────── */

export type LogoTreatment =
  /** Source already has transparency. Forces a flat white silhouette so every
   *  logo matches, whatever colour the original artwork is. Default. */
  | "white"
  /** Artwork sits on a WHITE / near-white box. Inverts, then screens the box
   *  away against the dark section. */
  | "knockout-light"
  /** Artwork sits on a BLACK / near-black box. Screens the box away. */
  | "knockout-dark"
  /** Leave the file exactly as supplied — use for full-colour logos you want
   *  to keep in brand colours. */
  | "none";

export type Client = {
  name: string;
  logo?: {
    src: string;
    /** Advisory only — the box and object-contain decide the rendered size,
     *  so these do not need to match the file exactly. */
    width: number;
    height: number;
    /** Optical nudge, applied after the box fit. 1 = no change. Values above
     *  1 deliberately spill outside the box; the column gap absorbs it. */
    scale?: number;
    /** Defaults to "white". */
    treatment?: LogoTreatment;
  };
};

export const clients: Client[] = [
  {
    name: "eXp Realty",
    logo: {
      src: "/logos/exp-realty.png",
      width: 512,
      height: 128,
      treatment: "white",
    },
  },
  {
    name: "Realty of America",
    logo: {
      src: "/logos/realty-of-america.png",
      width: 512,
      height: 128,
      treatment: "white",
    },
  },
  {
    // This one renders as a pale box in the strip, so its file still has a
    // white background baked in. `knockout-light` hides it; re-exporting the
    // file with transparency and switching to "white" is the proper fix.
    name: "Pacific Realty Group",
    logo: {
      src: "/logos/PRGSVG.svg",
      width: 512,
      height: 128,
      treatment: "knockout-light",
    },
  },
  {
    // Reads small because the artwork sits inside a lot of empty viewBox.
    // Scale compensates; trimming the SVG's viewBox is the better fix.
    name: "Everyday Order",
    logo: {
      src: "/logos/everydayordersvg.svg",
      width: 1300,
      height: 500,
      scale: 2.15,
      treatment: "white",
    },
  },
];
