import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";

/**
 * Self-hosted variable fonts. `next/font` fingerprints and preloads the files
 * and — importantly — emits a metric-adjusted fallback face, so the swap from
 * fallback to real font doesn't reflow the page.
 */
const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-Variable.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-space-grotesk",
});

import { site } from "@/lib/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const title = `${site.brand} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "marketing virtual assistant",
    "social media manager",
    "video editor",
    "real estate virtual assistant",
    "content strategy",
    "graphic design",
    "AI workflows",
    "Philippines VA",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/branding/favicon.svg", type: "image/svg+xml" },
      { url: "/branding/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/branding/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/branding/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.brand,
    title,
    description: site.description,
    locale: "en_US",
    images: [
      {
        url: "/branding/og-image.png",
        width: 1200,
        height: 630,
        alt: `${site.brand} — ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/branding/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  colorScheme: "dark",
};

/** Structured data so search engines understand the business. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.brand,
  description: site.description,
  url: site.url,
  logo: `${site.url}/branding/balzee-mark-dark.png`,
  image: `${site.url}/branding/og-image.png`,
  email: site.email,
  telephone: site.phone,
  areaServed: "Worldwide",
  address: { "@type": "PostalAddress", addressCountry: "PH" },
  sameAs: [site.instagram],
  founder: { "@type": "Person", name: site.name, jobTitle: site.role },
  serviceType: [
    "Social Media Management",
    "Video Editing",
    "Content Strategy",
    "Graphic Design",
    "Administrative Support",
    "AI Workflow Support",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Clash Display is served by Fontshare. Space Grotesk (bundled) is the
            fallback, so the site renders correctly even if this fails. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-fg antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
