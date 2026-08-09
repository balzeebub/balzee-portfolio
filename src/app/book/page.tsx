import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { BookingWizard } from "@/components/onboarding/BookingWizard";

const title = "Start here";
const description = `A few questions before we talk, so ${site.shortName} arrives at your discovery call already understanding your business, your taste and what you actually need.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/book" },
  openGraph: {
    type: "website",
    url: `${site.url}/book`,
    siteName: site.brand,
    title: `${title} — ${site.brand}`,
    description,
    images: ["/branding/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${site.brand}`,
    description,
    images: ["/branding/og-image.png"],
  },
};

export default function BookPage() {
  return (
    <div className="relative overflow-x-clip pt-32 pb-28 md:pt-40 md:pb-32">
      <Backdrop />

      <Container className="relative">
        {/* A narrow measure on purpose. A form this long reads as far shorter
            when the line length stays close to the body text elsewhere. */}
        <div className="mx-auto w-full max-w-[46rem]">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[0.8125rem] text-fg-subtle transition-colors duration-300 hover:text-white"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-[transform,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
            Back to {site.brand.toLowerCase()}.com
          </Link>

          <header className="mt-10">
            <p className="type-label text-accent">Before we talk</p>
            <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.04]">
              <span className="text-gradient">A few questions, </span>
              <span className="text-accent">then your call.</span>
            </h1>
            <p className="mt-6 max-w-xl type-lede text-fg-muted">
              Six short steps, mostly one tap each. It means I show up already
              knowing how your business runs and what good looks like to you —
              so the call is about the plan, not the paperwork.
            </p>
          </header>

          <div className="mt-16 rounded-3xl border border-line bg-ink-raised/60 p-7 backdrop-blur-sm sm:p-10 lg:p-12">
            <BookingWizard />
          </div>

          <p className="mt-8 text-center text-[0.8125rem] leading-relaxed text-fg-subtle">
            Your answers come straight to {site.shortName} and nowhere else.
            Nothing is shared, sold or added to a mailing list.
          </p>
        </div>
      </Container>
    </div>
  );
}

/** Quieter than the home page's — this is a page for concentrating on. */
function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-grid"
        style={{
          maskImage:
            "radial-gradient(70% 46% at 50% 0%, #000 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(70% 46% at 50% 0%, #000 0%, transparent 100%)",
        }}
      />
      <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.13)_0%,rgba(34,197,94,0)_66%)] blur-[46px]" />
    </div>
  );
}
