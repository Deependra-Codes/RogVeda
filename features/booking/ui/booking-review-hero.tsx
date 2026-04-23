export function BookingReviewHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border bg-paper">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.08),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(180,83,9,0.08),transparent_34%)]" />

      <div className="relative grid lg:grid-cols-12">
        <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
          <p className="type-label text-accent/70">Booking Review</p>
          <h1 className="mt-3 type-heading-xl max-w-[16ch] text-ink">
            Review the exact treatment and wallet impact before confirming.
          </h1>
          <p className="mt-4 max-w-[56ch] type-body-m text-ink/68">
            This step stays deliberately calm: the final quote is rechecked on the server, the
            wallet movement is made explicit, and the vendor handoff remains part of the same
            connected workflow.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <IntroProof
              title="Quote rechecked"
              body="The selected package is validated again before anything is written."
            />
            <IntroProof
              title="Wallet visible"
              body="The before and after balance stays visible, even when it goes negative."
            />
            <IntroProof
              title="Vendor connected"
              body="The first coordination task is created from the same booking record."
            />
          </div>
        </div>

        <div className="relative min-h-[240px] border-t border-border lg:col-span-5 lg:border-l lg:border-t-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,27,22,0.08),rgba(30,27,22,0.62))]" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="rounded-control border border-white/15 bg-ink/55 px-4 py-4 backdrop-blur-xl">
              <p className="type-label text-white/55">Same Source Of Truth</p>
              <p className="mt-2 text-[14px] leading-6 text-white/84">
                After confirmation, the vendor operations route sees this same booking and the first
                travel task without any manual sync step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BookingReviewSupportStrip() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <SupportItem
        title="Server-owned validation"
        body="Pricing authority stays on the server, even if the UI mirrors the quote live."
      />
      <SupportItem
        title="Wallet consequence made explicit"
        body="The balance change is visible before confirmation instead of hidden after success."
      />
      <SupportItem
        title="Vendor handoff stays real"
        body="The next coordination task is created from the saved booking, not mocked in the UI."
      />
    </section>
  );
}

function IntroProof({ title, body }: Readonly<{ title: string; body: string }>) {
  return (
    <div className="rounded-control border border-border/80 bg-paper/72 px-4 py-4">
      <p className="text-[15px] font-semibold leading-6 text-ink">{title}</p>
      <p className="mt-2 type-body-s text-ink/62">{body}</p>
    </div>
  );
}

function SupportItem({ title, body }: Readonly<{ title: string; body: string }>) {
  return (
    <div className="panel-operational p-5 sm:p-6">
      <p className="text-[15px] font-semibold leading-6 text-ink">{title}</p>
      <p className="mt-2 type-body-s text-ink/62">{body}</p>
    </div>
  );
}
