import { experienceVisuals } from "@/lib/experience-visuals";

export function BookingReviewHero() {
  const bookingVisual = experienceVisuals.bookingReview;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border bg-paper">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,109,104,0.07),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(162,103,34,0.08),transparent_36%)]" />

      <div className="relative grid lg:grid-cols-12">
        <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
          <p className="type-label text-brass/75">Booking Review</p>
          <h1 className="mt-3 type-heading-xl max-w-[16ch] text-ink">
            Review the selected treatment with the wallet impact made explicit.
          </h1>
          <p className="mt-4 max-w-[56ch] type-body-m text-ink/68">
            This route is a proof step, not a flourish. The quote is checked again on the server,
            the balance movement stays visible, and the same record flows directly into vendor
            coordination.
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

        <div className="relative min-h-[260px] border-t border-border lg:col-span-5 lg:border-l lg:border-t-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bookingVisual.imageSrc}')` }}
          />
          <div className={`absolute inset-0 ${bookingVisual.toneClass}`} />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="rounded-control border border-white/12 bg-[rgba(18,57,54,0.58)] px-4 py-4 text-white backdrop-blur-xl">
              <p className="type-label text-white/56">Same Source Of Truth</p>
              <p className="mt-2 text-[14px] leading-6 text-white/84">
                After confirmation, the vendor workspace sees this same booking and the first travel
                task without any manual sync step.
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
    <div className="rounded-control border border-border/80 bg-paper/76 px-4 py-4">
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
