import { getHospitalVisual } from "@/lib/experience-visuals";

import type { SearchDoctor, SearchHospitalResult } from "../types/search";

export function HospitalMediaPanel({ hospital }: Readonly<{ hospital: SearchHospitalResult }>) {
  const media = getHospitalVisual(hospital.imageToken);

  return (
    <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden p-6 text-white lg:col-span-3 lg:min-h-full lg:p-7">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${media.imageSrc}')` }}
      />
      <div className={`absolute inset-0 ${media.toneClass}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),linear-gradient(180deg,rgba(10,19,18,0.08),rgba(10,19,18,0.54)_100%)]" />

      <div className="relative flex items-start justify-between gap-2">
        <span className="rounded-pill border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
          {hospital.locationLabel}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/84">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M10.5 3.5L4.5 9.5L1.5 6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Verified Partner
        </span>
      </div>

      <div className="relative mt-auto pt-12">
        <p className="type-label text-white/58">{hospital.city}</p>
        <h2 className="mt-3 line-clamp-2 text-[28px] font-semibold leading-[32px] tracking-tight">
          {hospital.name}
        </h2>
        <p className="mt-3 max-w-[24ch] text-[13px] leading-[21px] text-white/78">
          {media.caption}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {media.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-pill border border-white/18 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/84 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HospitalFactsPanel({
  hospital,
  selectedDoctor,
}: Readonly<{ hospital: SearchHospitalResult; selectedDoctor?: SearchDoctor }>) {
  return (
    <div className="flex flex-col justify-center border-t border-border bg-[rgba(255,250,242,0.74)] p-5 lg:col-span-4 lg:border-r lg:border-t-0 lg:p-7">
      <p className="type-label text-brass/80">{hospital.procedureName}</p>
      <h3 className="mt-3 text-[24px] font-semibold leading-[31px] tracking-tight text-ink">
        Built for treatment planning with clear travel context, not generic listing noise.
      </h3>
      <p className="mt-4 type-body-s leading-relaxed text-ink/70">{hospital.summary}</p>

      <div className="mt-6 grid gap-3 border-t border-border pt-5">
        {hospital.trustSignals.map((signal) => (
          <div key={signal} className="flex items-start gap-2.5 text-[14px] leading-6 text-ink/66">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{signal}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <FactStat label="Region" value={hospital.locationLabel} />
        <FactStat
          label="Selected surgeon"
          value={
            selectedDoctor
              ? `${selectedDoctor.name} / ${selectedDoctor.yearsExperience} yrs`
              : "Choose a surgeon"
          }
        />
      </div>
    </div>
  );
}

function FactStat({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-control border border-border/80 bg-paper/80 px-4 py-3">
      <p className="type-label text-ink/38">{label}</p>
      <p className="mt-1.5 text-[14px] font-semibold leading-5 text-ink/84">{value}</p>
    </div>
  );
}
