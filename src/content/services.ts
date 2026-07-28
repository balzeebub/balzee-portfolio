import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Clapperboard,
  ClipboardList,
  PenTool,
  Share2,
  Sparkles,
} from "lucide-react";

export type Service = {
  title: string;
  summary: string;
  deliverables: string[];
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "Social Media Management",
    summary:
      "Full ownership of your channels — planning, publishing, engagement and reporting — so your brand stays consistently visible without you touching the scheduler.",
    deliverables: [
      "Monthly content calendars",
      "Scheduling & publishing",
      "Community management",
      "Performance reporting",
    ],
    icon: Share2,
  },
  {
    title: "Video Editing",
    summary:
      "Short-form video built for retention. Property tours, talking heads and promos cut with pacing, captions and sound design that hold attention past the first three seconds.",
    deliverables: [
      "Reels, TikToks & Shorts",
      "Property walkthroughs",
      "Captions & subtitles",
      "Thumbnails & hooks",
    ],
    icon: Clapperboard,
  },
  {
    title: "Content Strategy",
    summary:
      "A clear plan behind every post. I map your offers to content pillars, hooks and formats so the calendar serves the pipeline instead of filling space.",
    deliverables: [
      "Content pillars & positioning",
      "Hook & caption frameworks",
      "Posting cadence",
      "Monthly review & iteration",
    ],
    icon: BarChart3,
  },
  {
    title: "Graphic Design",
    summary:
      "On-brand visuals that look like they came from an agency. Listing graphics, carousels, ads and templates your whole team can reuse without breaking the system.",
    deliverables: [
      "Carousels & static posts",
      "Listing & event graphics",
      "Ad creative variants",
      "Reusable brand templates",
    ],
    icon: PenTool,
  },
  {
    title: "Administrative Support",
    summary:
      "The operational layer that keeps the marketing running — inboxes triaged, CRM current, leads followed up and nothing quietly falling through.",
    deliverables: [
      "Inbox & calendar management",
      "CRM updates & data entry",
      "Lead follow-up sequences",
      "Reporting & documentation",
    ],
    icon: ClipboardList,
  },
  {
    title: "AI Workflow Support",
    summary:
      "AI used properly — as leverage, not as a shortcut. I build repeatable systems for research, drafting and repurposing, with a human editing pass on everything that ships.",
    deliverables: [
      "Prompt libraries & SOPs",
      "Content repurposing systems",
      "Research & summarization",
      "Workflow automation",
    ],
    icon: Sparkles,
  },
];
