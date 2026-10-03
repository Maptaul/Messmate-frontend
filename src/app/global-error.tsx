"use client";

import { ServerCrashIcon } from "lucide-react";
import "./globals.css";

/** "What you can do" - both languages, since there is no dictionary here. */
const TIPS = [
  [
    "Try again. Most hiccups pass in a moment.",
    "আবার চেষ্টা করুন। বেশিরভাগ সমস্যা একটু পরেই কেটে যায়।",
  ],
  [
    "Your meals, bills and payments are safe.",
    "আপনার মিল, বিল আর পেমেন্ট নিরাপদ আছে।",
  ],
  [
    "Still stuck? Write to us with the reference below.",
    "তবুও আটকে থাকলে নিচের রেফারেন্সসহ আমাদের লিখুন।",
  ],
];

// Replaces the root layout when it crashes, so there is no dictionary or
// theme here - both languages are spelled out and styles stay minimal.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center bg-background p-6 font-sans text-foreground">
        <main className="flex w-full max-w-md flex-col items-center gap-3.5 text-center">
          <span className="tone-r grid size-14 place-items-center rounded-2xl border">
            <ServerCrashIcon className="size-6" aria-hidden />
          </span>
          <h1 className="text-[28px] leading-tight font-semibold tracking-tight">
            MessMate hit a problem
          </h1>
          <p lang="bn" className="text-lg">
            MessMate-এ একটা সমস্যা হয়েছে
          </p>
          <p className="max-w-100 leading-relaxed text-muted-foreground">
            Something failed on our side while loading this page. It’s been
            logged and we’re looking at it.
          </p>
          {error.digest && (
            <code className="rounded border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
              Reference: {error.digest}
            </code>
          )}
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => retry()}
              className="h-10 rounded-lg bg-primary px-4 font-medium text-primary-foreground"
            >
              Try again · আবার চেষ্টা করুন
            </button>
            <a
              href="/"
              className="grid h-10 place-items-center rounded-lg border bg-card px-4 font-medium"
            >
              Go home · হোমে যান
            </a>
          </div>
          <div className="mt-2.5 flex w-full max-w-100 flex-col gap-1.5 rounded-xl border bg-card p-3.5 text-left text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground">
              What you can do · আপনি যা করতে পারেন
            </span>
            {TIPS.map(([en, bn]) => (
              <span key={en} className="flex gap-2">
                <span aria-hidden className="text-(--tone-g-fg)">
                  ✓
                </span>
                <span>
                  {en} <span lang="bn">{bn}</span>
                </span>
              </span>
            ))}
          </div>
          <a
            href="mailto:support@messmate.app"
            className="text-[13px] text-primary hover:underline"
          >
            support@messmate.app
          </a>
        </main>
      </body>
    </html>
  );
}
