import Link from "next/link";

import { experienceVisuals } from "@/lib/experience-visuals";

const heroTrustPoints = [
  {
    title: "Transparent estimate",
    body: "Doctor and room changes update instantly, with no hidden coordination fee.",
  },
  {
    title: "Travel coordination",
    body: "Visa invite, pickup, and stay planning are visible before the booking step.",
  },
  {
    title: "Verified partner shortlist",
    body: "Delhi and nearby NCR centers stay in one calm comparison flow.",
  },
] as const;

export function SearchHero() {
  const heroVisual = experienceVisuals.homeHero;

  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-anchor text-white sm:min-h-[88svh]">
      <HeroBackground imageSrc={heroVisual.imageSrc} toneClass={heroVisual.toneClass} />
      <div className="mx-auto flex min-h-[inherit] w-full max-w-[1280px] flex-col justify-between px-4 pb-5 pt-5 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8 lg:pb-10">
        <HeroTopBar />
        <HeroContent />
        <HeroTrustBand />
      </div>
    </section>
  );
}

function HeroBackground({
  imageSrc,
  toneClass,
}: Readonly<{ imageSrc: string; toneClass: string }>) {
  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${imageSrc}')`, backgroundPosition: "84% center" }}
      />
      <div className={`absolute inset-0 ${toneClass}`} />
      <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(7,30,28,0.94)_6%,rgba(7,30,28,0.68)_34%,rgba(7,30,28,0.2)_66%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,24,23,0.08),rgba(8,24,23,0.12)_28%,rgba(8,24,23,0.72)_100%)]" />
    </div>
  );
}

function HeroTopBar() {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="type-label text-white/74">Rogveda Medical Travel</p>
      <span className="rounded-pill border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/88 backdrop-blur-sm">
        Guest Search
      </span>
    </div>
  );
}

function HeroContent() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="max-w-[520px] animate-rv-fade-up lg:col-span-6 xl:max-w-[560px]">
        <p className="type-label text-white/58">Delhi knee replacement shortlist</p>
        <h1 className="mt-4 type-display-xl max-w-[8ch] text-white lg:max-w-[7.6ch]">
          Find trusted knee replacement care in Delhi.
        </h1>
        <p className="mt-5 max-w-[29ch] type-body-l text-white/82">
          Browse partner hospitals without logging in, switch surgeon and room choices instantly,
          and keep a transparent quote in view before booking.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="#hospital-compare"
            className="btn-primary inline-flex w-fit items-center gap-2.5 px-8 text-[15px]"
          >
            Compare Hospitals
            <ArrowDown />
          </Link>
          <Link
            href="/vendor/login"
            className="inline-flex h-12 w-fit items-center gap-2 rounded-pill border border-white/18 bg-white/8 px-7 text-white transition-colors duration-150 ease-out hover:bg-white/14"
          >
            View Vendor Route
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeroTrustBand() {
  return (
    <div className="animate-rv-fade-up rounded-[28px] border border-white/12 bg-[rgba(255,250,242,0.92)] p-1.5 text-ink shadow-elevated backdrop-blur-md">
      <div className="grid gap-px overflow-hidden rounded-[24px] bg-border/60 md:grid-cols-3">
        {heroTrustPoints.map((point) => (
          <div key={point.title} className="bg-[rgba(255,250,242,0.96)] px-4 py-4 sm:px-5 sm:py-5">
            <p className="type-label text-accent/72">Trust</p>
            <p className="mt-2 text-[15px] font-semibold leading-6 text-ink">{point.title}</p>
            <p className="mt-2 text-[13px] leading-[21px] text-ink/66">{point.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3v10M4 9l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
