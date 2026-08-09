"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import {
  isVisible,
  steps,
  validateStep,
  type Answers,
  type Field,
} from "@/lib/onboarding";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Bump this if the questions change enough that old drafts would be wrong. */
const STORAGE_KEY = "balzee-onboarding-v1";

const fieldClass =
  "w-full rounded-xl border border-line bg-white/[0.02] px-4 py-3.5 text-[0.9375rem] text-white placeholder:text-fg-subtle transition-[border-color,background-color,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-line-strong focus:border-accent/60 focus:bg-white/[0.04] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.09)] focus:outline-none";

type Status = "idle" | "submitting" | "error" | "success";

type Draft = { answers: Answers; index: number };

/* ── Saved draft ──────────────────────────────────────────────────────────────
   localStorage is read through `useSyncExternalStore` rather than an effect.
   That gives a proper server snapshot (null), so there is no hydration
   mismatch and no state written during an effect — and the parsed result is
   cached against the raw string, because `getSnapshot` must be referentially
   stable or React re-renders forever.                                        */

let cachedRaw: string | null = null;
let cachedDraft: Draft | null = null;

function readDraft(): Draft | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // Private mode or blocked storage.
  }

  if (raw === cachedRaw) return cachedDraft;
  cachedRaw = raw;

  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<Draft>) : null;
    cachedDraft =
      parsed && parsed.answers && typeof parsed.answers === "object"
        ? {
            answers: parsed.answers,
            index: Math.min(Math.max(parsed.index ?? 0, 0), steps.length - 1),
          }
        : null;
  } catch {
    cachedDraft = null; // Corrupt JSON — a lost draft isn't worth an error.
  }

  return cachedDraft;
}

function subscribeToDraft(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function writeDraft(draft: Draft) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* Storage full or blocked — the form still works, it just won't survive a reload. */
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function countAnswered(answers: Answers): number {
  return Object.values(answers).filter((v) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v && v.trim()),
  ).length;
}

export function BookingWizard() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [draftDismissed, setDraftDismissed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const firstRender = useRef(true);

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const progress =
    ((index + (status === "success" ? 1 : 0)) / steps.length) * 100;

  const draft = useSyncExternalStore(subscribeToDraft, readDraft, () => null);
  /* Offered rather than applied silently. Having a form fill itself in behind
     your back is disconcerting, and it makes "start over" impossible to find. */
  const offerDraft =
    !draftDismissed &&
    status === "idle" &&
    draft !== null &&
    countAnswered(answers) === 0;

  // Autosave. Skipped while the resume prompt is up, so an untouched form can't
  // overwrite the very draft it is offering to restore.
  useEffect(() => {
    if (status === "success" || offerDraft) return;
    if (countAnswered(answers) === 0) return;
    writeDraft({ answers, index });
  }, [answers, index, offerDraft, status]);

  /* Move focus to the new step's heading. Without this a keyboard or screen
     reader user stays parked on the Continue button while the questions
     change out from under them. `preventScroll` because we handle the scroll
     ourselves and the browser's version jumps. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [index, reduced]);

  const setValue = useCallback((name: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  function goBack() {
    setErrors({});
    setIndex((i) => Math.max(0, i - 1));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const stepErrors = validateStep(step, answers);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }

    setStatus("submitting");
    setServerError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        errors?: Record<string, string>;
        error?: string;
      };

      if (response.status === 422 && result.errors) {
        // Send them back to the first step that actually has a problem rather
        // than showing an error they can't see the cause of.
        const firstBad = steps.findIndex((s) =>
          s.fields.some((f) => result.errors?.[f.name]),
        );
        setErrors(result.errors);
        setStatus("idle");
        if (firstBad >= 0) setIndex(firstBad);
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setServerError(
          result.error ?? "Something went wrong on my end. Please try again.",
        );
        return;
      }

      clearDraft();
      setStatus("success");
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    } catch {
      setStatus("error");
      setServerError(
        `Couldn't reach the server. Please email me at ${site.email} instead.`,
      );
    }
  }

  if (status === "success") {
    return <BookingStep answers={answers} />;
  }

  return (
    <div>
      <Progress index={index} percent={progress} />

      {offerDraft && draft ? (
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.875rem] text-white">
            You started this before — {countAnswered(draft.answers)} answers
            saved on this device.
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAnswers(draft.answers);
                setIndex(draft.index);
                setDraftDismissed(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-4 text-[0.875rem] font-medium text-ink transition-colors duration-300 hover:bg-accent-soft"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Pick up where I left off
            </button>
            <button
              type="button"
              onClick={() => {
                clearDraft();
                setDraftDismissed(true);
              }}
              aria-label="Start over"
              className="grid h-9 w-9 place-items-center rounded-full text-fg-muted transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="mt-12">
        {/* Honeypot. Real people never see it, bots fill everything. */}
        <div
          aria-hidden
          className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
        >
          <label htmlFor="company-website">Company website</label>
          <input
            id="company-website"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={(answers.companyWebsite as string) ?? ""}
            onChange={(e) => setValue("companyWebsite", e.target.value)}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] text-gradient outline-none"
            >
              {step.title}
            </h2>
            <p className="mt-4 max-w-xl type-body text-fg-muted">
              {step.blurb}
            </p>

            <div className="mt-11 space-y-10">
              {step.fields
                .filter((field) => isVisible(field, answers))
                .map((field) => (
                  <FieldRow
                    key={field.name}
                    field={field}
                    value={answers[field.name]}
                    error={errors[field.name]}
                    onChange={setValue}
                  />
                ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {status === "error" ? (
          <p
            role="alert"
            className="mt-10 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3.5 text-[0.9375rem] text-red-300"
          >
            {serverError}
          </p>
        ) : null}

        <div className="mt-14 flex flex-col-reverse items-stretch gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          {index > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] text-fg-muted transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group/btn relative inline-flex h-[3.375rem] items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-accent px-8 text-base font-medium text-ink shadow-[0_1px_0_0_rgba(255,255,255,0.28)_inset] transition-[translate,scale,background-color,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-accent-soft hover:shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset,0_14px_44px_-10px_rgba(34,197,94,0.62)] active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60 motion-reduce:hover:translate-y-0"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-[140%] skew-x-[-16deg] bg-white/28 transition-[transform,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[420%] motion-reduce:hidden"
            />
            <span className="relative inline-flex items-center gap-2">
              {status === "submitting" ? (
                <>
                  <Loader2
                    className="h-4.5 w-4.5 animate-spin"
                    strokeWidth={2}
                  />
                  Sending
                </>
              ) : isLast ? (
                <>
                  Send and pick a time
                  <Send className="h-4.5 w-4.5" strokeWidth={2} />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight
                    className="h-4.5 w-4.5 transition-[transform,translate,scale] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-1"
                    strokeWidth={2}
                  />
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Progress ─────────────────────────────────────────────────────────────── */

function Progress({ index, percent }: { index: number; percent: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="type-label text-fg-subtle">
          Step {index + 1} of {steps.length}
        </p>
        <p className="text-[0.8125rem] text-fg-subtle">
          About {Math.max(1, 6 - index)} min left
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={index + 1}
        aria-label="Onboarding progress"
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]"
      >
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={false}
          animate={{ width: `${Math.max(percent, 4)}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>
    </div>
  );
}

/* ── Fields ───────────────────────────────────────────────────────────────── */

function FieldRow({
  field,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: string | string[] | undefined;
  error?: string;
  onChange: (name: string, value: string | string[]) => void;
}) {
  const id = useId();
  const describedBy = [
    field.help ? `${id}-help` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const isGroup = field.type === "choice" || field.type === "multi";
  const Wrapper = isGroup ? "fieldset" : "div";
  const Label = isGroup ? "legend" : "label";

  return (
    <Wrapper className="min-w-0">
      <Label
        {...(isGroup ? {} : { htmlFor: id })}
        className="block text-[0.9375rem] font-medium text-white"
      >
        {field.label}
        {!field.required ? (
          <span className="ml-2 text-[0.8125rem] font-normal text-fg-subtle">
            optional
          </span>
        ) : null}
      </Label>

      {field.help ? (
        <p
          id={`${id}-help`}
          className="mt-2 max-w-xl text-[0.8125rem] leading-relaxed text-fg-subtle"
        >
          {field.help}
        </p>
      ) : null}

      <div className="mt-4">
        {field.type === "textarea" ? (
          <textarea
            id={id}
            rows={4}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={cn(fieldClass, "resize-y leading-relaxed")}
          />
        ) : isGroup ? (
          <ChoiceGroup
            field={field}
            value={value}
            describedBy={describedBy || undefined}
            onChange={onChange}
          />
        ) : (
          <input
            id={id}
            type={
              field.type === "email"
                ? "email"
                : field.type === "url"
                  ? "url"
                  : "text"
            }
            inputMode={field.type === "email" ? "email" : undefined}
            autoComplete={
              field.type === "email"
                ? "email"
                : field.name === "fullName"
                  ? "name"
                  : field.name === "businessName"
                    ? "organization"
                    : "off"
            }
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={fieldClass}
          />
        )}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2.5 text-[0.8125rem] text-red-400"
        >
          {error}
        </p>
      ) : null}
    </Wrapper>
  );
}

/**
 * Chips backed by real radio / checkbox inputs rather than buttons with
 * `aria-pressed`. Native inputs give keyboard arrow-key navigation, form
 * semantics and screen-reader grouping for free; the visible chip is just a
 * sibling span styled off `peer-checked`.
 */
function ChoiceGroup({
  field,
  value,
  describedBy,
  onChange,
}: {
  field: Field;
  value: string | string[] | undefined;
  describedBy?: string;
  onChange: (name: string, value: string | string[]) => void;
}) {
  const multi = field.type === "multi";
  const selected = multi
    ? ((value as string[]) ?? [])
    : value
      ? [value as string]
      : [];

  function toggle(option: string) {
    if (!multi) {
      onChange(field.name, option);
      return;
    }
    onChange(
      field.name,
      selected.includes(option)
        ? selected.filter((v) => v !== option)
        : [...selected, option],
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5" aria-describedby={describedBy}>
      {field.options?.map((option) => {
        const checked = selected.includes(option);

        return (
          <label key={option} className="cursor-pointer">
            <input
              type={multi ? "checkbox" : "radio"}
              name={field.name}
              value={option}
              checked={checked}
              onChange={() => toggle(option)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.9375rem] transition-[border-color,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                checked
                  ? "border-accent/50 bg-accent/[0.12] text-white"
                  : "border-line bg-white/[0.02] text-fg-muted hover:border-line-strong hover:text-white",
              )}
            >
              {checked ? (
                <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
              ) : null}
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ── Success + booking ────────────────────────────────────────────────────── */

function BookingStep({ answers }: { answers: Answers }) {
  const name = encodeURIComponent((answers.fullName as string) ?? "");
  const email = encodeURIComponent((answers.email as string) ?? "");
  /* Calendly wants the embedding host. This component only ever mounts after a
     successful client-side submit, so there is no server render to mismatch
     against and the value can be read straight in the initialiser. */
  const [domain] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hostname,
  );

  const src =
    `${site.calendlyUrl}?embed_type=Inline&hide_gdpr_banner=1` +
    `&background_color=0f0f0f&text_color=ffffff&primary_color=22c55e` +
    `&name=${name}&email=${email}` +
    (domain ? `&embed_domain=${domain}` : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15">
          <Check className="h-6 w-6 text-accent" strokeWidth={2.25} />
        </span>
        <div>
          <h2 className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] text-gradient">
            Got it — that&apos;s everything I need
          </h2>
        </div>
      </div>

      <p className="mt-5 max-w-xl type-body text-fg-muted">
        I&apos;ll read through your answers and have a look at your accounts
        before we speak, so we can skip the background and get straight to what
        would actually move the needle. Pick a time that suits you.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-ink-raised">
        <iframe
          src={src}
          title="Book a discovery call"
          loading="lazy"
          className="h-[44rem] w-full border-0 sm:h-[46rem]"
        />
      </div>

      <p className="mt-6 text-[0.8125rem] text-fg-subtle">
        Calendar not loading? Email me directly at{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-fg-muted underline underline-offset-4 transition-colors hover:text-white"
        >
          {site.email}
        </a>
        .
      </p>
    </motion.div>
  );
}
