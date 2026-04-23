import Link from "next/link";

type BookingStatePanelProps = Readonly<{
  eyebrow?: string;
  title: string;
  body: string;
}>;

export function BookingStatePanel({
  eyebrow = "Booking Could Not Continue",
  title,
  body,
}: BookingStatePanelProps) {
  return (
    <section className="panel-soft p-6 sm:p-8">
      <p className="type-label text-ink/45">{eyebrow}</p>
      <h1 className="mt-3 type-heading-xl text-ink">{title}</h1>
      <p className="mt-3 max-w-2xl type-body-m text-ink/65">{body}</p>
      <Link href="/" className="btn-secondary mt-6 inline-flex items-center justify-center gap-1.5">
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
        Back To Search
      </Link>
    </section>
  );
}
