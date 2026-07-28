import type { LucideIcon } from "lucide-react";
import { Building2, Megaphone, Store, Wrench } from "lucide-react";

export type Industry = {
  name: string;
  description: string;
  points: string[];
  icon: LucideIcon;
};

export const industries: Industry[] = [
  {
    name: "Real Estate",
    description:
      "Agents, teams and brokerages who need listings to look premium and leads to stop going cold.",
    points: ["Listing content", "Agent branding", "Lead follow-up"],
    icon: Building2,
  },
  {
    name: "Small Businesses",
    description:
      "Owner-operated businesses that need a consistent presence without hiring a full marketing team.",
    points: ["Always-on posting", "Local visibility", "Offer campaigns"],
    icon: Store,
  },
  {
    name: "Home Services",
    description:
      "Contractors and service providers turning finished jobs into proof that books the next one.",
    points: ["Before & after content", "Review generation", "Service pages"],
    icon: Wrench,
  },
  {
    name: "Marketing",
    description:
      "Agencies and consultants who need reliable white-label execution behind the client-facing work.",
    points: ["White-label delivery", "Overflow capacity", "Client reporting"],
    icon: Megaphone,
  },
];
