import type { SearchDoctor, SearchHospitalResult } from "../types/search";

export function HospitalMediaPanel({ hospital }: Readonly<{ hospital: SearchHospitalResult }>) {
  const media = resolveHospitalMedia(hospital.imageToken);

  return (
    <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden p-6 text-white lg:col-span-3 lg:min-h-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${media.imageUrl}')`,
        }}
      />
      <div className={`absolute inset-0 ${media.toneClass}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_36%),linear-gradient(180deg,rgba(10,10,10,0.12)_5%,rgba(10,10,10,0.48)_100%)]" />

      <div className="relative flex items-start justify-between gap-2">
        <span className="rounded-pill border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
          {hospital.locationLabel}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
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

      <div className="relative mt-auto pt-10">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
          {hospital.city}
        </p>
        <h2 className="line-clamp-2 text-[26px] font-semibold leading-[32px] tracking-tight drop-shadow-[0_1px_6px_rgba(0,0,0,0.2)]">
          {hospital.name}
        </h2>
        <p className="mt-3 max-w-[24ch] text-[13px] leading-[21px] text-white/78">
          {media.caption}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {media.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-pill border border-white/18 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/82 backdrop-blur-sm"
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
    <div className="flex flex-col justify-center border-t border-border p-5 lg:col-span-4 lg:border-r lg:border-t-0 lg:p-7">
      <p className="type-label mb-2 text-ink/48">{hospital.procedureName}</p>
      <p className="text-[22px] font-semibold leading-[30px] tracking-tight text-ink">
        Built for international treatment planning, not a generic hospital directory.
      </p>
      <p className="mb-5 mt-3 type-body-s leading-relaxed text-ink/70">{hospital.summary}</p>

      <div className="space-y-2.5 border-t border-border pt-5">
        {hospital.trustSignals.map((signal) => (
          <div key={signal} className="flex items-center gap-2.5 type-body-s text-ink/65">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{signal}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
    <div className="rounded-control border border-border/80 bg-paper/70 px-4 py-3">
      <p className="type-label text-ink/40">{label}</p>
      <p className="mt-1 text-[14px] font-semibold leading-5 text-ink/84">{value}</p>
    </div>
  );
}

function resolveHospitalMedia(imageToken: string) {
  const media: Record<
    string,
    {
      imageUrl: string;
      caption: string;
      tags: [string, string];
      toneClass: string;
    }
  > = {
    "apollo-spectra": {
      imageUrl:
        "https://images.unsplash.com/photo-1580281657527-47d6d8c7e3f4?q=80&w=1200&auto=format&fit=crop",
      caption: "Consult-first arrival flow with a coordinator-led international desk.",
      tags: ["Patient Desk", "Airport Help"],
      toneClass: "bg-[linear-gradient(150deg,rgba(15,118,110,0.6),rgba(5,150,105,0.26))]",
    },
    "max-saket": {
      imageUrl:
        "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=1200&auto=format&fit=crop",
      caption: "Higher-capacity center with room to coordinate stay and caregiver plans.",
      tags: ["Stay Support", "24h Review"],
      toneClass: "bg-[linear-gradient(150deg,rgba(180,83,9,0.58),rgba(245,158,11,0.22))]",
    },
    "fortis-gurgaon": {
      imageUrl:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
      caption: "Delhi NCR option suited to patients comparing nearby partner centers.",
      tags: ["NCR Access", "Senior Review"],
      toneClass: "bg-[linear-gradient(150deg,rgba(22,78,99,0.62),rgba(14,116,144,0.22))]",
    },
  };

  return media[imageToken] ?? media["apollo-spectra"];
}
