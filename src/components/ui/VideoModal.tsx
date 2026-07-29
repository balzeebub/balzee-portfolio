"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Embeds are served from the no-cookie host; postMessage must target it too. */
const YT_ORIGIN = "https://www.youtube-nocookie.com";

const VIDEO_ID = /^[\w-]{11}$/;

export type YouTubeSource = {
  id: string;
  /** Shorts are vertical, so the player frame flips to 9:16. */
  kind: "video" | "shorts";
  /** Start offset in seconds, from `?t=` or `?start=`. */
  start?: number;
};

/** Accepts `1m30s`, `90s` and plain `90`. */
function readStart(params: URLSearchParams): number | undefined {
  const raw = params.get("start") ?? params.get("t");
  if (!raw) return undefined;

  if (/^\d+$/.test(raw)) return Number(raw) || undefined;

  const parts = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!parts) return undefined;

  const [, h, m, s] = parts;
  const total =
    (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
  return total || undefined;
}

/**
 * Resolve a YouTube URL to an embeddable source.
 *
 * Handles `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, plus
 * `/embed/`, `/v/` and `/live/`, with or without a protocol, on `www.` or `m.`
 * subdomains, and ignores trailing params like `?feature=share`.
 * Returns null for anything it can't resolve, so callers can degrade quietly.
 */
export function parseYouTubeUrl(input?: string | null): YouTubeSource | null {
  if (!input) return null;

  const raw = input.trim();
  if (!raw) return null;

  // A bare video id is also accepted.
  if (VIDEO_ID.test(raw)) return { id: raw, kind: "video" };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www\.|m\.)/i, "").toLowerCase();
  const segments = url.pathname.split("/").filter(Boolean);
  const start = readStart(url.searchParams);

  const resolve = (
    candidate: string | null | undefined,
    kind: YouTubeSource["kind"] = "video",
  ): YouTubeSource | null =>
    candidate && VIDEO_ID.test(candidate) ? { id: candidate, kind, start } : null;

  if (host === "youtu.be") return resolve(segments[0]);

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const [first, second] = segments;

    if (first === "shorts") return resolve(second, "shorts");
    if (first === "embed" || first === "v" || first === "live") {
      return resolve(second);
    }
    // /watch?v=… and any other path that still carries ?v=
    return resolve(url.searchParams.get("v"));
  }

  return null;
}

function embedSrc(source: YouTubeSource): string {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    playsinline: "1",
    modestbranding: "1",
    // Required so the modal can pause playback the instant it closes.
    enablejsapi: "1",
  });

  if (source.start) params.set("start", String(source.start));
  if (typeof window !== "undefined") {
    params.set("origin", window.location.origin);
  }

  return `${YT_ORIGIN}/embed/${source.id}?${params.toString()}`;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

export function VideoModal({
  open,
  onClose,
  url,
  title,
  subtitle,
  vertical = false,
}: {
  open: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
  subtitle?: string;
  /** Render a 9:16 frame instead of 16:9. */
  vertical?: boolean;
}) {
  const reduced = useReducedMotion();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<Element | null>(null);

  const source = useMemo(() => parseYouTubeUrl(url), [url]);

  /**
   * Silence the player immediately. The iframe unmounts a beat later when the
   * exit animation finishes; without this the audio would outlive the close.
   */
  const stopPlayback = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
      YT_ORIGIN,
    );
  }, []);

  const requestClose = useCallback(() => {
    stopPlayback();
    onClose();
  }, [onClose, stopPlayback]);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable =
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Lock the page, padding out the width the scrollbar leaves behind so the
    // layout underneath doesn't jump.
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    // preventScroll matters here: focusing would otherwise scroll the locked
    // page underneath, so the card sits somewhere new once the modal closes.
    const focusTimer = window.setTimeout(
      () => closeRef.current?.focus({ preventScroll: true }),
      40,
    );

    return () => {
      stopPlayback();
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;

      const target = returnFocusRef.current;
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    };
  }, [open, requestClose, stopPlayback]);

  return (
    <AnimatePresence>
      {open && source ? (
        <motion.div
          key="video-modal"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: EASE }}
        >
          <div
            aria-hidden
            onClick={requestClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ? `${title} — video` : "Video"}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.38, ease: EASE }}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-ink shadow-[0_40px_120px_-40px_rgba(0,0,0,1)]",
              // Cap by viewport height as well as width so the frame always
              // fits, whatever the screen. 4.75rem covers the header row.
              vertical
                ? "max-w-[min(92vw,24rem,calc((88vh_-_4.75rem)*9/16))]"
                : "max-w-[min(94vw,64rem,calc((88vh_-_4.75rem)*16/9))]",
            )}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0">
                {title ? (
                  <p className="truncate text-[0.9375rem] font-medium text-white">
                    {title}
                  </p>
                ) : null}
                {subtitle ? (
                  <p className="mt-0.5 truncate text-[0.8125rem] text-fg-subtle">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={requestClose}
                aria-label="Close video"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong text-white transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.06]"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div
              className={cn(
                "relative w-full bg-black",
                vertical ? "aspect-[9/16]" : "aspect-video",
              )}
            >
              <iframe
                ref={iframeRef}
                src={embedSrc(source)}
                title={title ?? "Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

