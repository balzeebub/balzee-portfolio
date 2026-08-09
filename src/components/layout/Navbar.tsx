"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, sectionIds, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { BalzeeLogo } from "@/components/brand/Logo";

export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  /*
   * The nav is all in-page anchors, which only resolve on the home page. From
   * anywhere else (/book, say) they have to become "/#about" so the browser
   * navigates home first — otherwise every link is a no-op. The scroll-spy
   * still keys off the bare hash, so highlighting is unaffected.
   */
  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  // Elevate the bar once the user leaves the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for the active nav item. There are no tracked sections on any
  // page but the home page, so it simply finds nothing and stays inert.
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "border-b border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        <Container>
          <nav
            aria-label="Primary"
            // Height is deliberately constant. Collapsing the bar on scroll
            // looks good but reflows its contents, and that reflow is counted
            // as layout shift — the docked state is signalled by the backdrop,
            // hairline and progress rule instead.
            className="flex h-20 items-center justify-between md:h-[5.5rem]"
          >
            <a
              href={hrefFor("#top")}
              aria-label={`${site.brand} — home`}
              className="group -m-2 rounded-lg p-2 transition-opacity duration-300 hover:opacity-80"
            >
              <BalzeeLogo
                className="flex items-center gap-3 text-white"
                markClassName="h-[1.625rem] w-auto transition-[transform,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-px motion-reduce:group-hover:translate-y-0"
                wordmarkClassName="h-[11.5px] w-auto"
              />
            </a>

            <ul className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = active === id;
                return (
                  <li key={link.href}>
                    <a
                      href={hrefFor(link.href)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                        isActive
                          ? "text-accent"
                          : "text-fg-muted hover:text-white",
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full border border-line bg-white/[0.055]"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 34,
                          }}
                        />
                      ) : null}
                      <span className="relative">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative hidden h-10 items-center gap-1.5 overflow-hidden rounded-full bg-accent px-5 text-sm font-medium text-ink transition-[translate,scale,background-color,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-accent-soft hover:shadow-[0_12px_36px_-12px_rgba(34,197,94,0.75)] sm:inline-flex"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/3 -translate-x-[140%] skew-x-[-16deg] bg-white/28 transition-[transform,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[420%] motion-reduce:hidden"
                />
                <span className="relative inline-flex items-center gap-1.5">
                  {site.cta.primary}
                  <ArrowUpRight
                    className="h-4 w-4 transition-[transform,translate,scale] duration-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </span>
              </a>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-white transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.06] lg:hidden"
              >
                {open ? (
                  <X className="h-4.5 w-4.5" strokeWidth={1.75} />
                ) : (
                  <Menu className="h-4.5 w-4.5" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </nav>
        </Container>

        {/* Reading progress — a single hairline, only once the bar is docked. */}
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left bg-accent/70 transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink/97 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-center px-8">
              <ul className="flex flex-col">
                {[...navLinks, { label: "Contact", href: "#contact" }].map(
                  (link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.07 + i * 0.055,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <a
                        href={hrefFor(link.href)}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between border-b border-line py-5 text-[1.75rem] tracking-[-0.03em] text-white transition-colors duration-300 hover:text-accent"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {link.label}
                        <ArrowUpRight
                          className="h-5 w-5 text-fg-subtle transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                          strokeWidth={1.5}
                        />
                      </a>
                    </motion.li>
                  ),
                )}
              </ul>

              <motion.a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.55 }}
                className="mt-12 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent text-base font-medium text-ink"
              >
                {site.cta.primary}
                <ArrowUpRight className="h-4.5 w-4.5" strokeWidth={2} />
              </motion.a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
