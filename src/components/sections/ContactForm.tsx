"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const serviceOptions = [
  "Social Media Management",
  "Video Editing",
  "Content Strategy",
  "Graphic Design",
  "Administrative Support",
  "AI Workflow Support",
  "Not sure yet",
];

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const fieldClass =
  "w-full rounded-xl border border-line bg-white/[0.02] px-4 py-3.5 text-[0.9375rem] text-white placeholder:text-fg-subtle transition-[border-color,background-color,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-line-strong focus:border-accent/60 focus:bg-white/[0.04] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.09)] focus:outline-none";

const labelClass =
  "mb-2.5 block text-[0.8125rem] font-medium text-fg-muted";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json().catch(() => ({}))) as {
        errors?: FieldErrors;
        error?: string;
      };

      if (response.status === 422 && result.errors) {
        setErrors(result.errors);
        setStatus("idle");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Network error. Please email me directly instead.");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[26rem] flex-col items-center justify-center rounded-2xl border border-accent/25 bg-accent/[0.05] p-10 text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/15">
              <Check className="h-6 w-6 text-accent" strokeWidth={2.25} />
            </span>
            <h3 className="mt-6 text-2xl tracking-tight text-white">
              Message sent
            </h3>
            <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
              Thanks for reaching out — I&apos;ll get back to you within one
              business day. If it&apos;s urgent, book a call directly.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-accent-soft"
              >
                {site.cta.primary}
              </a>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-[0.9375rem] text-fg-muted underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Send another message
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-line bg-ink-raised p-7 transition-colors duration-500 hover:border-line-strong sm:p-9"
          >
            {/* Honeypot */}
            <div className="absolute left-[-9999px]" aria-hidden>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name <span className="text-accent">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Cooper"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={cn(fieldClass, errors.name && "border-red-500/60")}
                />
                {errors.name ? (
                  <p id="name-error" className="mt-2 text-[0.8125rem] text-red-400">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@company.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={cn(fieldClass, errors.email && "border-red-500/60")}
                />
                {errors.email ? (
                  <p id="email-error" className="mt-2 text-[0.8125rem] text-red-400">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="company" className={labelClass}>
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Cooper Realty"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="service" className={labelClass}>
                  What do you need help with?
                </label>
                <select
                  id="service"
                  name="service"
                  defaultValue={serviceOptions[0]}
                  className={cn(fieldClass, "appearance-none bg-ink-raised")}
                >
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className={labelClass}>
                Project details <span className="text-accent">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="A little about your business, what you're currently doing for marketing, and where you're stuck."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={cn(
                  fieldClass,
                  "resize-y",
                  errors.message && "border-red-500/60",
                )}
              />
              {errors.message ? (
                <p id="message-error" className="mt-2 text-[0.8125rem] text-red-400">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group/btn relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-7 text-[0.9375rem] font-medium text-ink shadow-[0_1px_0_0_rgba(255,255,255,0.28)_inset] transition-[translate,scale,background-color,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-accent-soft hover:shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset,0_14px_44px_-10px_rgba(34,197,94,0.62)] active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60 motion-reduce:hover:translate-y-0"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/3 -translate-x-[140%] skew-x-[-16deg] bg-white/28 transition-[transform,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[420%] motion-reduce:hidden"
                />
                <span className="relative inline-flex items-center gap-2">
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight
                        className="h-4 w-4 transition-[transform,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-1"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </span>
              </button>

              <p className="text-[0.8125rem] text-fg-subtle">
                Typical reply time: within one business day.
              </p>
            </div>

            {status === "error" && message ? (
              <p role="alert" className="mt-4 text-[0.875rem] text-red-400">
                {message}
              </p>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
