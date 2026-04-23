import Link from "next/link";

export function SearchHero() {
  return (
    <section className="relative isolate flex w-full flex-col justify-end overflow-hidden bg-ink min-h-[620px] sm:min-h-[84svh] lg:min-h-[90svh]">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2200&auto=format&fit=crop')",
          }}
        />
        {/* Scrim layers for text safety */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(30,27,22,0.92)] via-[rgba(30,27,22,0.45)] to-[rgba(30,27,22,0.15)]
          sm:bg-gradient-to-r sm:from-[rgba(30,27,22,0.92)] sm:via-[rgba(30,27,22,0.55)] sm:to-[rgba(30,27,22,0.08)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(30,27,22,0.3)] via-transparent to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-16 lg:px-8 lg:pb-24">
        <div className="max-w-[640px] animate-rv-fade-up">
          <HeroLead />
          <div className="hidden sm:block mt-10">
            <HeroTrustStrip />
          </div>
        </div>
      </div>

      {/* Mobile trust strip */}
      <div className="relative z-10 border-t border-white/10 bg-ink/80 px-4 py-5 backdrop-blur-lg sm:hidden">
        <HeroTrustStrip mobile />
      </div>
    </section>
  );
}

function HeroLead() {
  return (
    <div className="space-y-6 text-white">
      {/* Brand + Guest badge */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-pill border border-white/25 bg-white/12 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
          Guest Browsing
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">
          No login required
        </span>
      </div>

      {/* Headline block */}
      <div className="space-y-5">
        <p className="type-label text-white/55">Rogveda Medical Travel</p>
        <h1 className="type-display-xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
          Compare trusted knee replacement options in Delhi.
        </h1>
        <p className="max-w-[540px] type-body-l text-white/85">
          Browse hospitals without logging in. Change doctor and room choices and see transparent
          pricing before booking.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="#hospital-compare"
        className="btn-primary inline-flex w-fit items-center gap-2.5 px-8 text-[15px]"
      >
        Compare Hospitals
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="opacity-80"
        >
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}

function HeroTrustStrip({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`grid gap-4 ${mobile ? "grid-cols-1 gap-3" : "sm:grid-cols-3 gap-5"}`}>
      <TrustCallout
        title="Transparent estimate"
        body="Room and surgeon changes update instantly, with no hidden coordination fee."
        mobile={mobile}
      />
      <TrustCallout
        title="Travel coordination"
        body="Visa invite, pickup, and stay planning are surfaced up front."
        mobile={mobile}
      />
      <TrustCallout
        title="NCR partner coverage"
        body="Gurgaon partner options can appear for Delhi searches when travel time stays practical."
        mobile={mobile}
      />
    </div>
  );
}

type TrustCalloutProps = Readonly<{
  title: string;
  body: string;
  mobile?: boolean;
}>;

function TrustCallout({ title, body, mobile }: TrustCalloutProps) {
  return (
    <div
      className={`border-l-2 pl-4 ${mobile ? "border-accent/50 py-1.5" : "border-white/25 py-0.5"}`}
    >
      <p className={`text-[14px] font-bold leading-5 ${mobile ? "text-ink" : "text-white/95"}`}>
        {title}
      </p>
      <p className={`mt-1 text-[13px] leading-[22px] ${mobile ? "text-ink/65" : "text-white/70"}`}>
        {body}
      </p>
    </div>
  );
}
