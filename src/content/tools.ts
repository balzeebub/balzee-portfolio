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
    logo: "/tools/capcut.svg",
  },
  {
    name: "Adobe Photoshop",
    category: "Design",
    logo: "/tools/photoshop.svg",
  },
  {
    name: "ChatGPT",
    category: "AI",
    logo: "/tools/chatgpt.svg",
  },
  {
    name: "Claude",
    category: "AI",
    logo: "/tools/claude.svg",
  },
  {
    name: "Notion",
    category: "Ops",
    logo: "/tools/notion.svg",
  },
  {
    name: "Google Workspace",
    category: "Ops",
    logo: "/tools/google.svg",
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
    logo: "/tools/crm.svg",
  },
  {
    name: "Trello / Asana",
    category: "Ops",
    logo: "/tools/trello.svg",
  },
];

/**
 * Logos shown in the "Trusted by" section.
 */
export type Client = {
  name: string;
  logo?: {
    src: string;
    width: number;
    height: number;
    scale?: number;
  };
};

export const clients: Client[] = [
  {
    name: "eXp Realty",
    logo: {
      src: "/logos/exp-realty.svg",
      width: 512,
      height: 128,
    },
  },
  {
    name: "Pacific Realty Group",
    logo: {
      src: "/logos/pacific-realty-group.svg",
      width: 512,
      height: 128,
    },
  },
  {
    name: "Realty of America",
    logo: {
      src: "/logos/realty-of-america.svg",
      width: 512,
      height: 128,
    },
  },
  {
    name: "Everyday Order",
    logo: {
      src: "/logos/everyday-order.svg",
      width: 512,
      height: 128,
    },
  },
];
