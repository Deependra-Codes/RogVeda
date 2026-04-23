import Link from "next/link";

type SearchRouteIntroProps = Readonly<{
  hospitalCount?: number;
}>;

export function SearchRouteIntro({ hospitalCount }: SearchRouteIntroProps) {
  const title = hospitalCount
    ? `${hospitalCount} partner hospitals ready for a clean side-by-side decision.`
    : "Shortlist hospitals with clarity before you commit.";

  return (
    <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <p className="type-label text-brass/80">Treatment Shortlist</p>
        <h2 className="mt-3 type-display-l max-w-[13ch] text-ink">{title}</h2>
        <p className="mt-5 max-w-[56ch] type-body-l text-ink/68">
          Every option keeps the same decision frame in view: surgeon, room, transparent estimate,
          and the travel support context patients usually have to ask for separately.
        </p>
      </div>

      <div className="panel-soft overflow-hidden p-0 lg:col-span-7">
        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <RouteProofBlock
            eyebrow="01"
            title="Guest-friendly browsing"
            body="Search stays open. The route only asks for commitment once the quote and wallet impact are visible."
          />
          <RouteProofBlock
            eyebrow="02"
            title="Server-checked quote"
            body="Doctor and room changes update instantly here, then the final selection is revalidated before booking."
          />
          <RouteProofBlock
            eyebrow="03"
            title="Travel workflow connected"
            body="Booking and vendor coordination use the same persisted record, so the next step is not hand-waved."
          />
        </div>
      </div>
    </section>
  );
}

export function SearchRouteFooter() {
  return (
    <section className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="panel-soft overflow-hidden bg-[linear-gradient(180deg,rgba(255,250,242,0.92),rgba(241,228,209,0.42))] p-6 sm:p-8 lg:col-span-8">
        <p className="type-label text-brass/78">What Happens Next</p>
        <h2 className="mt-3 type-heading-xl max-w-[18ch] text-ink">
          Once you choose, the booking route becomes a calm proof step.
        </h2>
        <p className="mt-4 max-w-[58ch] type-body-m text-ink/68">
          The selected package is rechecked on the server, the wallet impact is shown before saving,
          and the first vendor task is created from the same record after confirmation.
        </p>
        <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
          <FooterStep
            title="Quote revalidated"
            body="No stale browser-only estimate is allowed through to booking."
          />
          <FooterStep
            title="Wallet stays visible"
            body="The demo allows a negative balance, but the exact before and after values stay explicit."
          />
          <FooterStep
            title="Vendor handoff ready"
            body="The operations route sees the same booking and can complete the first coordination task."
          />
        </div>
      </div>

      <aside className="panel-operational flex flex-col justify-between gap-5 bg-[rgba(228,236,232,0.54)] p-6 sm:p-8 lg:col-span-4">
        <div>
          <p className="type-label text-accent/72">Connected Demo</p>
          <h3 className="mt-3 type-heading-l max-w-[12ch] text-ink">
            Patient and vendor views stay on one source of truth.
          </h3>
          <p className="mt-4 type-body-s text-ink/62">
            The vendor route is intentionally quieter and operational, but it reads the same saved
            booking state you create from the patient flow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="#hospital-compare" className="btn-secondary inline-flex items-center gap-2">
            Compare Options
          </Link>
          <Link href="/vendor/login" className="btn-tertiary inline-flex items-center gap-2">
            View Vendor Route
          </Link>
        </div>
      </aside>
    </section>
  );
}

function RouteProofBlock({
  eyebrow,
  title,
  body,
}: Readonly<{ eyebrow: string; title: string; body: string }>) {
  return (
    <div className="p-6 sm:p-7">
      <p className="type-label text-ink/38">{eyebrow}</p>
      <h3 className="mt-3 text-[17px] font-semibold leading-6 text-ink">{title}</h3>
      <p className="mt-3 type-body-s text-ink/62">{body}</p>
    </div>
  );
}

function FooterStep({ title, body }: Readonly<{ title: string; body: string }>) {
  return (
    <div>
      <p className="text-[15px] font-semibold leading-6 text-ink">{title}</p>
      <p className="mt-2 type-body-s text-ink/62">{body}</p>
    </div>
  );
}
