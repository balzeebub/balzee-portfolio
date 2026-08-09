import { NextResponse } from "next/server";
import {
  allFields,
  isVisible,
  steps,
  validateAll,
  type Answers,
} from "@/lib/onboarding";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/*
 * Resend is called over plain HTTP rather than through the `resend` npm
 * package. That keeps package.json and package-lock.json untouched — adding a
 * dependency by hand on GitHub desynchronises the lockfile and `npm ci` on
 * Vercel then fails the build. One fetch call is all the SDK does here anyway.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *
 *   RESEND_API_KEY   required for delivery. Without it the submission is
 *                    accepted and logged, so the page keeps working while you
 *                    finish setting the account up.
 *   ONBOARDING_TO    optional. Defaults to the address in lib/site.ts.
 *   ONBOARDING_FROM  optional. Defaults to Resend's shared sending address,
 *                    which can only deliver to your own account email. Point
 *                    it at your own verified domain once you have one.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "Balzee Onboarding <onboarding@resend.dev>";

/** Hard ceiling on the raw body, before any parsing. */
const MAX_BODY_BYTES = 64 * 1024;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Rebuilds the payload from the schema rather than trusting its shape: only
 * known field names survive, strings are capped at the length the question
 * declares, and multi-selects are filtered down to options that actually
 * exist. A crafted request can't inject extra rows into the email.
 */
function normalise(raw: unknown): Answers {
  const input = (raw ?? {}) as Record<string, unknown>;
  const answers: Answers = {};

  for (const field of allFields) {
    const value = input[field.name];
    const max = field.maxLength ?? 400;

    if (field.type === "multi") {
      if (!Array.isArray(value)) continue;
      const allowed = new Set(field.options ?? []);
      const picked = value
        .filter((v): v is string => typeof v === "string")
        .filter((v) => allowed.has(v))
        .slice(0, 40);
      if (picked.length) answers[field.name] = picked;
      continue;
    }

    if (field.type === "choice") {
      const picked = clean(value, 200);
      if (picked && (field.options ?? []).includes(picked)) {
        answers[field.name] = picked;
      }
      continue;
    }

    const text = clean(value, max);
    if (text) answers[field.name] = text;
  }

  return answers;
}

function render(answers: Answers) {
  const rows: { label: string; value: string }[] = [];

  for (const step of steps) {
    for (const field of step.fields) {
      if (!isVisible(field, answers)) continue;
      const value = answers[field.name];
      if (!value || (Array.isArray(value) && value.length === 0)) continue;
      rows.push({
        label: field.label,
        value: Array.isArray(value) ? value.join(", ") : value,
      });
    }
  }

  const text = rows
    .map(({ label, value }) => `${label}\n${value}`)
    .join("\n\n");

  /* The charset declaration is not optional. Without it, clients fall back to
     latin-1 and every em dash in the questions arrives as "â€"". */
  const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>New onboarding submission</title>
</head><body style="margin:0;background:#0f0f0f;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#141414;border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden">
<tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,.08)">
<div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#22c55e;font-weight:600">New onboarding submission</div>
<div style="margin-top:10px;font-size:22px;font-weight:600;color:#fff">${escapeHtml(
    (answers.businessName as string) ||
      (answers.fullName as string) ||
      "Unnamed",
  )}</div>
</td></tr>
${steps
  .map((step) => {
    const stepRows = step.fields
      .filter((f) => isVisible(f, answers))
      .filter((f) => {
        const v = answers[f.name];
        return v && (!Array.isArray(v) || v.length > 0);
      });
    if (!stepRows.length) return "";

    return `<tr><td style="padding:26px 32px 4px">
<div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7c7c7c;font-weight:600">${escapeHtml(
      step.title,
    )}</div></td></tr>
${stepRows
  .map((f) => {
    const v = answers[f.name];
    const shown = Array.isArray(v) ? v.join(" · ") : (v as string);
    return `<tr><td style="padding:14px 32px 0">
<div style="font-size:13px;color:#a8a8a8">${escapeHtml(f.label)}</div>
<div style="margin-top:5px;font-size:15px;line-height:1.6;color:#fff;white-space:pre-wrap">${escapeHtml(
      shown,
    )}</div></td></tr>`;
  })
  .join("")}
<tr><td style="padding:0 32px"><div style="height:22px"></div></td></tr>`;
  })
  .join("")}
<tr><td style="padding:20px 32px 30px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#7c7c7c">
Sent from ${escapeHtml(site.url)}/book
</td></tr></table></body></html>`;

  return { text, html, rows };
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "That submission is too large." },
      { status: 413 },
    );
  }

  let body: { answers?: unknown };
  try {
    body = (await request.json()) as { answers?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const raw = (body.answers ?? {}) as Record<string, unknown>;

  // Bots fill every field they find, including the hidden one. Accept the
  // request so they don't retry, then drop it.
  if (clean(raw.companyWebsite, 200)) {
    return NextResponse.json({ ok: true });
  }

  const answers = normalise(raw);
  const errors = validateAll(answers);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const { text, html } = render(answers);
  const name = answers.fullName as string;
  const business = answers.businessName as string;
  const replyTo = answers.email as string;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(
      "[onboarding] submission received (RESEND_API_KEY not set)\n",
      text,
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ONBOARDING_FROM || DEFAULT_FROM,
        to: [process.env.ONBOARDING_TO || site.email],
        reply_to: replyTo,
        subject: `Onboarding — ${business} (${name})`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[onboarding] resend responded", response.status, detail);
      return NextResponse.json(
        {
          error: `Your answers couldn't be delivered. Please email me at ${site.email} instead.`,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[onboarding] resend request failed", error);
    return NextResponse.json(
      {
        error: `Your answers couldn't be delivered. Please email me at ${site.email} instead.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
