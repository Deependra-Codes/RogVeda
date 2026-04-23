"use client";

type RootErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function RootError({ error: _error, reset }: RootErrorProps) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-6 shadow-[0_24px_70px_rgba(40,24,5,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:rgba(30,27,22,0.56)]">
          Unexpected Error
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Something went wrong while loading the current page.
        </h1>
        <p className="mt-3 text-sm leading-7 text-[color:rgba(30,27,22,0.74)]">
          The app caught the failure safely. You can retry the route without leaving the session.
        </p>
        <button
          type="button"
          className="mt-5 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          onClick={reset}
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
