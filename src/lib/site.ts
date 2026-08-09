/**
 * Single source of truth for identity, contact details and navigation.
 * Edit this file to update the site — nothing else hardcodes these values.
 */

export const site = {
  brand: "Balzee",
  name: 'Jhen Mer "Bal" Balderama',
  shortName: "Bal",
  role: "Marketing Virtual Assistant",
  location: "Philippines",
  timezone: "PHT (GMT+8)",

  email: "jmbalderama019@gmail.com",
  phone: "+63 991 105 0131",
  phoneHref: "+639911050131",

  /**
   * Where every "Book a Discovery Call" button on the site points.
   *
   * It goes to the onboarding page rather than straight to Calendly, so a call
   * is never booked without context. The name is kept as `calendly` on purpose
   * — six components already read this key, and repointing it here means none
   * of them had to change. To go back to booking directly, set this to the
   * value of `calendlyUrl` below.
   */
  calendly: "/book",

  /** The real Calendly link. Embedded on the last step of /book. */
  calendlyUrl: "https://calendly.com/jmbalderama019/book-your-discovery-call",

  instagram: "https://www.instagram.com/balzeebubb/",

  // Update this to your live domain before deploying — it drives canonical
  // URLs, sitemap.xml and Open Graph tags.
  url: "https://workwithbalzee.com",

  tagline: "Marketing Virtual Assistant",
  description:
    "Balzee is a marketing virtual assistant for real estate teams, agencies and small businesses — social media management, video editing, content strategy, design and AI-assisted workflows.",

  cta: {
    primary: "Book a Discovery Call",
    secondary: "View My Work",
  },
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

/** Section ids tracked by the navbar's scroll-spy, in document order. */
export const sectionIds = [
  "about",
  "services",
  "work",
  "results",
  "industries",
  "tools",
  "testimonials",
  "contact",
] as const;
