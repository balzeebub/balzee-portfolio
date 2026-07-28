import { Mail, Phone } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons";
import { BalzeeLogo } from "@/components/brand/Logo";

const socials = [
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
  { label: "Phone", href: `tel:${site.phoneHref}`, icon: Phone },
  { label: "Instagram", href: site.instagram, icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="relative bg-ink-sunken">
      <div aria-hidden className="rule-fade absolute inset-x-0 top-0" />

      <Container className="py-20">
        <div className="flex flex-col gap-14 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a
              href="#top"
              aria-label={`${site.brand} — back to top`}
              className="group -m-2 inline-block rounded-lg p-2 transition-opacity duration-300 hover:opacity-80"
            >
              <BalzeeLogo
                className="flex items-center gap-3.5 text-white"
                markClassName="h-7 w-auto"
                wordmarkClassName="h-3 w-auto"
              />
            </a>
            <p className="mt-5 type-body text-fg-muted">
              {site.role} partnering with real estate teams, agencies and
              growing businesses. Based in {site.location}, working across{" "}
              {site.timezone} and US hours.
            </p>
          </div>

          <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
            <nav aria-label="Footer">
              <h3 className="type-label text-fg-subtle">Navigate</h3>
              <ul className="mt-6 flex flex-col gap-3">
                {[...navLinks, { label: "Contact", href: "#contact" }].map(
                  (link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors duration-300 hover:text-white"
                      >
                        <span
                          aria-hidden
                          className="h-px w-0 bg-accent transition-[width] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-4"
                        />
                        {link.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div>
              <h3 className="type-label text-fg-subtle">Get in touch</h3>
              <ul className="mt-6 flex flex-col gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group inline-flex items-center gap-2.5 text-sm text-fg-muted transition-colors duration-300 hover:text-white"
                    >
                      <Icon
                        className="h-4 w-4 transition-colors duration-300 group-hover:text-accent"
                        strokeWidth={1.5}
                      />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.brand}. All rights reserved.
          </p>
          <p>{site.name}</p>
        </div>
      </Container>
    </footer>
  );
}
