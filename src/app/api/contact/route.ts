import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  service?: unknown;
  message?: unknown;
  /** Honeypot — real users never fill this in. */
  website?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Silently accept bot submissions so they don't retry.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const company = str(body.company, 160);
  const service = str(body.service, 80);
  const message = str(body.message, 4000);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Tell me a little more (10+ characters).";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const submission = {
    name,
    email,
    company,
    service,
    message,
    receivedAt: new Date().toISOString(),
  };

  /**
   * Set CONTACT_WEBHOOK_URL in your environment to forward submissions to an
   * email service, form backend or automation (Formspree, Zapier, Make, n8n…).
   * Without it, submissions are only logged on the server.
   */
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        console.error("[contact] webhook responded", response.status);
        return NextResponse.json(
          { error: "Message could not be delivered. Please email me directly." },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("[contact] webhook failed", error);
      return NextResponse.json(
        { error: "Message could not be delivered. Please email me directly." },
        { status: 502 },
      );
    }
  } else {
    console.info("[contact] submission received (no webhook configured)", submission);
  }

  return NextResponse.json({ ok: true });
}
