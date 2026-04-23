import Link from "next/link";

type MessagePanelProps = Readonly<{
  eyebrow: string;
  title: string;
  body: string;
  detail?: string;
  actionLabel?: string;
  actionHref?: string;
}>;

export function EmptySearchState() {
  return (
    <MessagePanel
      eyebrow="No Matches Yet"
      title="No partner hospitals are available for this search right now."
      body="This shortlist fills automatically when hospital, doctor, and pricing records are present in Supabase."
      detail="Seed the database, then return here to compare options."
      actionLabel="Back To Search"
      actionHref="/"
    />
  );
}

export function SearchErrorState({ message }: Readonly<{ message: string }>) {
  return (
    <MessagePanel
      eyebrow="Temporary Issue"
      title="The shortlist could not be loaded."
      body={message}
      detail="Check the Supabase runtime and try again."
      actionLabel="Retry Search"
      actionHref="/"
    />
  );
}

export function SearchUnconfiguredState({ missingKeys }: Readonly<{ missingKeys: string[] }>) {
  return (
    <MessagePanel
      eyebrow="Backend Setup Needed"
      title="Supabase is not configured for the app yet."
      body="Add the missing environment variables in `.env.local`, then restart the app to load live hospital data."
      detail={`Missing: ${missingKeys.join(", ")}`}
    />
  );
}

function MessagePanel({
  eyebrow,
  title,
  body,
  detail,
  actionLabel,
  actionHref,
}: MessagePanelProps) {
  return (
    <section className="panel-soft p-6 sm:p-8">
      <p className="type-label text-ink/45">{eyebrow}</p>
      <h2 className="mt-3 type-heading-l text-ink">{title}</h2>
      <p className="mt-3 max-w-2xl type-body-m text-ink/65">{body}</p>
      {detail ? (
        <p className="mt-5 rounded-control border border-border/60 bg-bg/40 px-4 py-3 type-body-s text-ink/60">
          {detail}
        </p>
      ) : null}
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="btn-secondary mt-6 inline-flex items-center justify-center gap-1.5"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="opacity-60"
          >
            <path
              d="M9 3L5 7l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
