export type PortfolioCategory =
  | "Video Editing"
  | "Social Media"
  | "Graphic Design"
  | "Landing Pages";

export const portfolioCategories: PortfolioCategory[] = [
  "Video Editing",
  "Social Media",
  "Graphic Design",
  "Landing Pages",
];

export type Project = {
  title: string;
  client: string;
  category: PortfolioCategory;
  description: string;
  tags: string[];
  metric: string;
  /** Aspect ratio of the preview tile. */
  ratio: "portrait" | "landscape" | "square";
  /**
   * Optional path to a real image in /public. Leave undefined to render the
   * generated placeholder artwork instead.
   */
 image?: string;
video?: string;
};

export const projects: Project[] = [
  // ---------------------------------------------------------------- video --
  {
    title: "Luxury Listing Walkthroughs",
    client: "eXp Realty",
    category: "Video Editing",
    description:
      "A repeatable reel format for high-value listings — cold open on the best room, beat-matched cuts, on-screen specs and an agent sign-off.",
    tags: ["Premiere Pro", "Reels", "Real Estate"],
    metric: "38s avg. watch time",
    ratio: "portrait",
    video: "https://youtube.com/shorts/YqXlh7RhfYs?feature=share",
  },
  {
    title: "Agent Authority Series",
    client: "Pacific Realty Group",
    category: "Video Editing",
    description:
      "Weekly talking-head shorts turning market updates into scroll-stopping clips with dynamic captions and B-roll overlays.",
    tags: ["CapCut", "Shorts", "Captions"],
    metric: "12 videos / month",
    ratio: "portrait",
    video: "https://youtube.com/shorts/4LmOGRxOos0?feature=share",
  },
  {
    title: "Talking head sales",
    client: "Falcon Storage",
    category: "Video Editing",
    description:
      "An educational talking-head video explaining storage options, pricing, and best practices, edited with dynamic captions and clean visuals to keep viewers engaged.",
    tags: ["Colour grade", "Audio clean-up"],
    metric: "4.1x saves vs. baseline",
    ratio: "landscape",
    video: "https://youtube.com/shorts/qQBcT8dVGic",
  },

  // --------------------------------------------------------------- social --
  {
    title: "Full-Channel Management",
    client: "Everyday Order",
    category: "Social Media",
    description:
      "End-to-end management across Instagram and Facebook — calendar, publishing, community replies and a monthly performance readout.",
    tags: ["Instagram", "Meta Suite", "Reporting"],
    metric: "+214% reach in 90 days",
    ratio: "square",
  },
  {
    title: "30-Day Content Calendar",
    client: "Pacific Realty Group",
    category: "Social Media",
    description:
      "A pillar-based calendar mixing listings, market insight, testimonials and behind-the-scenes so the feed never reads as one long ad.",
    tags: ["Strategy", "Calendar", "Notion"],
    metric: "5 posts / week sustained",
    ratio: "landscape",
  },
  {
    title: "Engagement Sprint",
    client: "eXp Realty",
    category: "Social Media",
    description:
      "A two-week comment and DM push targeting local buyer conversations, with saved-reply templates handed over to the team.",
    tags: ["Community", "DM funnel"],
    metric: "63 qualified DMs",
    ratio: "square",
  },

  // --------------------------------------------------------------- design --
  {
    title: "Listing Graphics System",
    client: "Realty of America",
    category: "Graphic Design",
    description:
      "A locked template kit — just-listed, open house, price drop and sold — so any agent can produce on-brand assets in minutes.",
    tags: ["Canva", "Templates", "Brand system"],
    metric: "18 reusable templates",
    ratio: "square",
  },
  {
    title: "Educational Carousels",
    client: "Everyday Order",
    category: "Graphic Design",
    description:
      "Ten-slide carousels breaking down buyer questions into plain language, designed for saves and shares rather than likes.",
    tags: ["Carousel", "Editorial layout"],
    metric: "2.8x avg. saves",
    ratio: "portrait",
  },
  {
    title: "Paid Ad Creative Set",
    client: "Pacific Realty Group",
    category: "Graphic Design",
    description:
      "Six creative variants built for split-testing — hook, colour and proof rotated while the layout system stays consistent.",
    tags: ["Meta Ads", "A/B variants"],
    metric: "-31% cost per lead",
    ratio: "landscape",
  },

  // -------------------------------------------------------------- landing --
  {
    title: "Buyer Lead Capture Page",
    client: "eXp Realty",
    category: "Landing Pages",
    description:
      "A single-purpose page pairing a neighbourhood guide offer with a short form — built to load fast and convert cold traffic.",
    tags: ["Lead magnet", "Copy", "Design"],
    metric: "11.4% conversion rate",
    ratio: "landscape",
  },
  {
    title: "Service Booking Page",
    client: "Everyday Order",
    category: "Landing Pages",
    description:
      "Clear offer, transparent pricing tiers and one obvious call to action, wired straight into the client's booking calendar.",
    tags: ["Booking flow", "Pricing"],
    metric: "2.3x calls booked",
    ratio: "landscape",
  },
  {
    title: "Open House Registration",
    client: "Realty of America",
    category: "Landing Pages",
    description:
      "A mobile-first RSVP page with automated reminder emails, replacing the clipboard-at-the-door sign-in sheet.",
    tags: ["Mobile-first", "Automation"],
    metric: "94% mobile completion",
    ratio: "square",
  },
];
