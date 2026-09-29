"use client";

import "./globals.css";

// Replaces the root layout when it crashes, so there is no dictionary or
// theme here — both languages are spelled out and styles stay minimal.
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
        <main className="max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold">MessMate hit a problem</h1>
          <p lang="bn" className="text-lg">
            MessMate-এ একটি সমস্যা হয়েছে
          </p>
          <p className="text-sm text-muted-foreground">
            Your data is safe. Try again, or come back in a minute.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again · আবার চেষ্টা করুন
          </button>
        </main>
      </body>
    </html>
  );
}
