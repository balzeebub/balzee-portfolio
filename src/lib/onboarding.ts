/**
 * The onboarding questionnaire, as data.
 *
 * This is the single source of truth for the whole flow: the wizard renders
 * from it, and the API route validates and formats the notification email from
 * it. Add, remove or reword a question here and both sides follow — there is
 * no second list to keep in sync.
 */

import { site } from "@/lib/site";

export type FieldType =
  "text" | "email" | "url" | "textarea" | "choice" | "multi";

export type Answers = Record<string, string | string[]>;

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  /** Sub-label under the question. Use it to explain, not to repeat. */
  help?: string;
  placeholder?: string;
  required?: boolean;
  options?: readonly string[];
  maxLength?: number;
  /**
   * Conditional visibility. A hidden field is never rendered and never
   * validated — both client and server run this same predicate, so a required
   * field that is hidden can't silently block submission.
   */
  showIf?: (answers: Answers) => boolean;
};

export type Step = {
  id: string;
  title: string;
  blurb: string;
  fields: Field[];
};

const SERVICES = [
  "Social Media Management",
  "Video Editing",
  "Content Strategy",
  "Graphic Design",
  "Administrative Support",
  "AI Workflow Support",
  "Not sure yet — help me figure it out",
] as const;

export const steps: Step[] = [
  {
    id: "you",
    title: "First, who am I talking to?",
    blurb:
      "The quick part. Your links matter more than anything else here — I'd rather look at your actual feed than have you describe it.",
    fields: [
      {
        name: "fullName",
        label: "Your name",
        type: "text",
        required: true,
        placeholder: "Jane Dela Cruz",
        maxLength: 120,
      },
      {
        name: "businessName",
        label: "Business or brand name",
        type: "text",
        required: true,
        placeholder: "Dela Cruz Realty",
        maxLength: 160,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "you@company.com",
        maxLength: 200,
      },
      {
        name: "website",
        label: "Website",
        type: "url",
        placeholder: "https://",
        help: "Leave blank if you don't have one — plenty of good businesses don't.",
        maxLength: 300,
      },
      {
        name: "socials",
        label: "Social profiles",
        type: "textarea",
        placeholder:
          "instagram.com/yourhandle\ntiktok.com/@yourhandle\nfacebook.com/yourpage",
        help: "One per line. This is the first thing I'll look at before our call.",
        maxLength: 800,
      },
      {
        name: "role",
        label: "What's your role?",
        type: "choice",
        required: true,
        options: [
          "Owner / founder",
          "Agent or broker",
          "Marketing lead",
          "Agency owner",
          "Other",
        ],
      },
    ],
  },

  {
    id: "business",
    title: "How does the business actually run?",
    blurb: "Context so the call starts at the strategy, not at the basics.",
    fields: [
      {
        name: "whatYouSell",
        label: "What do you sell, and who buys it?",
        type: "textarea",
        required: true,
        placeholder:
          "Residential listings in Quezon City — mostly first-time buyers in their 30s.",
        maxLength: 1200,
      },
      {
        name: "industry",
        label: "Which of these fits best?",
        type: "choice",
        required: true,
        options: [
          "Real estate",
          "Small business",
          "Home services",
          "Agency / white-label",
          "Something else",
        ],
      },
      {
        name: "leadSources",
        label: "Where do clients come from today?",
        type: "multi",
        required: true,
        help: "Pick everything that's actually working, not everything you've tried.",
        options: [
          "Referrals",
          "Paid ads",
          "Organic social",
          "Cold outreach",
          "Walk-ins / foot traffic",
          "Email list",
          "Honestly not sure",
        ],
      },
      {
        name: "marketingOwner",
        label: "Who handles marketing right now?",
        type: "choice",
        required: true,
        options: [
          "Nobody — it's whenever I get to it",
          "Me, personally",
          "Someone in-house",
          "Another VA or agency",
        ],
      },
      {
        name: "biggestTimeSink",
        label: "What's the one thing you'd hand off tomorrow if you could?",
        type: "textarea",
        required: true,
        help: "Be specific. This is usually the most useful answer on the form.",
        placeholder:
          "Editing listing walkthroughs. It eats a full evening every week.",
        maxLength: 1000,
      },
    ],
  },

  {
    id: "needs",
    title: "What do you need help with?",
    blurb: "Rough is fine. We'll sharpen it on the call.",
    fields: [
      {
        name: "services",
        label: "Which services are you after?",
        type: "multi",
        required: true,
        options: SERVICES,
      },
      {
        name: "platforms",
        label: "Which platforms matter to you?",
        type: "multi",
        required: true,
        options: [
          "Instagram",
          "TikTok",
          "Facebook",
          "YouTube",
          "LinkedIn",
          "Google Business Profile",
          "Pinterest",
        ],
      },
      {
        name: "postVolume",
        label: "Roughly how many posts a week?",
        type: "choice",
        required: true,
        options: ["1–2", "3–4", "5–7", "Daily or more", "No idea yet"],
      },
      {
        name: "videoVolume",
        label: "And how many videos a week?",
        type: "choice",
        required: true,
        options: ["None for now", "1–2", "3–5", "6 or more", "No idea yet"],
      },
      {
        name: "assetSource",
        label: "Where does the raw material come from?",
        type: "choice",
        required: true,
        help: "This is the difference between editing your footage and creating it from scratch — it changes the scope more than anything else on this form.",
        options: [
          "I have plenty of footage and photos already",
          "Some, but not enough to post consistently",
          "Almost nothing — it needs creating",
          "I'm happy to film, I just need telling what to shoot",
        ],
      },
    ],
  },

  {
    id: "taste",
    title: "Now the important part — taste",
    blurb:
      "Most intake forms skip this and it's why so much VA content ends up generic. Two minutes here saves a month of guessing.",
    fields: [
      {
        name: "creatorsYouLove",
        label: "Two or three accounts whose content you love",
        type: "textarea",
        required: true,
        help: "Any niche at all. Add one line on what you like about each — the 'why' is worth more than the link.",
        placeholder:
          "@somecreator — the editing pace, never a dull second\n@another — they explain things without being condescending",
        maxLength: 1500,
      },
      {
        name: "nicheCreators",
        label: "Who's doing this well in your niche?",
        type: "textarea",
        required: true,
        help: "Competitors count. This is the benchmark we'd be measured against, which is a different question from the one above.",
        placeholder: "@localagent, @competitorbrand",
        maxLength: 1000,
      },
      {
        name: "dislikes",
        label: "What do you not want your content to feel like?",
        type: "multi",
        help: "Constraints are faster to give than direction, and usually more useful.",
        options: [
          "Hard-sell captions",
          "Dancing / trending audio",
          "AI voiceover",
          "Meme-heavy",
          "Overly corporate",
          "Clickbait hooks",
          "Long talking-head videos",
          "Stock-photo look",
        ],
      },
      {
        name: "dislikeNotes",
        label: "Anything else that makes you cringe?",
        type: "textarea",
        placeholder: "Links to specific posts are welcome.",
        maxLength: 800,
      },
      {
        name: "cameraComfort",
        label: "How do you feel about being on camera?",
        type: "choice",
        required: true,
        options: [
          "Happy on camera, point and shoot",
          "Fine, but I need a script",
          "Voiceover only",
          "No face at all",
          "Someone else on the team is the face",
        ],
      },
      {
        name: "brandAssets",
        label: "Do you have brand assets?",
        type: "choice",
        required: true,
        options: [
          "Full brand guidelines",
          "Logo and colours, nothing formal",
          "Nothing yet",
          "Not sure what I have",
        ],
      },
    ],
  },

  {
    id: "arrangement",
    title: "How would we work together?",
    blurb:
      "The practical side. Nothing here is binding — it just means the call starts from something real.",
    fields: [
      {
        name: "engagement",
        label: "What kind of arrangement are you thinking?",
        type: "choice",
        required: true,
        options: ["Full-time", "Part-time", "Project-based", "Not sure yet"],
      },
      {
        name: "hoursPerWeek",
        label: "Roughly how many hours a week?",
        type: "choice",
        required: true,
        options: ["Under 10", "10–20", "20–30", "30–40", "Not sure"],
        showIf: (a) =>
          a.engagement === "Part-time" || a.engagement === "Project-based",
      },
      {
        name: "timezone",
        label: "What timezone are you in?",
        type: "text",
        required: true,
        placeholder: "EST, PST, GMT+8…",
        help: `I'm on ${site.timezone} — worth knowing how far apart we are.`,
        maxLength: 80,
      },
      {
        name: "workingHours",
        label: "Do you need specific working hours?",
        type: "choice",
        required: true,
        options: [
          "Yes — set hours, with live overlap",
          "Set hours, but async is fine",
          "Flexible — deadlines matter more than hours",
          "Not sure yet",
        ],
      },
      {
        name: "workingHoursDetail",
        label: "Which hours, specifically?",
        type: "text",
        placeholder: "9am–1pm EST, Mon–Fri",
        maxLength: 200,
        showIf: (a) =>
          a.workingHours === "Yes — set hours, with live overlap" ||
          a.workingHours === "Set hours, but async is fine",
      },
      {
        name: "budget",
        label: "What monthly budget are you working with?",
        type: "choice",
        required: true,
        help: "A range is fine. Nobody's holding you to it — it just stops us designing something that was never going to fit.",
        options: [
          "Under $500",
          "$500 – $1,000",
          "$1,000 – $2,000",
          "$2,000 – $3,500",
          "$3,500+",
          "Not sure — tell me what's realistic",
        ],
      },
      {
        name: "approvals",
        label: "Who signs off on content, and how fast?",
        type: "choice",
        required: true,
        options: [
          "Me, usually same day",
          "Me, but it might sit a few days",
          "Someone else has to approve it",
          "Nobody — once we're set, just post",
        ],
      },
      {
        name: "startDate",
        label: "When would you want to start?",
        type: "choice",
        required: true,
        options: [
          "As soon as possible",
          "Within two weeks",
          "Within a month",
          "Just exploring for now",
        ],
      },
      {
        name: "tools",
        label: "What are you already using?",
        type: "multi",
        options: [
          "Canva",
          "CapCut",
          "Adobe Creative Cloud",
          "Meta Business Suite",
          "Later / Buffer / Hootsuite",
          "Google Drive",
          "Notion",
          "Slack",
          "A CRM",
          "Nothing yet",
        ],
      },
    ],
  },

  {
    id: "final",
    title: "Anything I should know?",
    blurb: "Last one. Then you pick a time.",
    fields: [
      {
        name: "anythingElse",
        label: "Anything else before we talk?",
        type: "textarea",
        help: "Your biggest worry about hiring a VA is fair game — I'd rather hear it now than dance around it on the call.",
        placeholder:
          "I've been burned by a VA who needed managing more than the work did.",
        maxLength: 2000,
      },
    ],
  },
];

/** Every field across every step, in order. */
export const allFields: Field[] = steps.flatMap((step) => step.fields);

export function isVisible(field: Field, answers: Answers): boolean {
  return field.showIf ? field.showIf(answers) : true;
}

function isBlank(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.length === 0;
  return !value || value.trim().length === 0;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates one step. Returns a map of field name → message; an empty object
 * means the step is good. Used by the wizard before advancing and by the API
 * route before sending, so the two can never disagree.
 */
export function validateStep(
  step: Step,
  answers: Answers,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of step.fields) {
    if (!isVisible(field, answers)) continue;

    const value = answers[field.name];

    if (field.required && isBlank(value)) {
      errors[field.name] =
        field.type === "multi"
          ? "Pick at least one."
          : field.type === "choice"
            ? "Pick one to continue."
            : "This one's required.";
      continue;
    }

    if (field.type === "email" && typeof value === "string" && value.trim()) {
      if (!EMAIL_RE.test(value.trim())) {
        errors[field.name] = "That doesn't look like an email address.";
      }
    }
  }

  return errors;
}

export function validateAll(answers: Answers): Record<string, string> {
  return steps.reduce<Record<string, string>>(
    (acc, step) => ({ ...acc, ...validateStep(step, answers) }),
    {},
  );
}
