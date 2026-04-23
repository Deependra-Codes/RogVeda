import { PatientSearchExperience } from "../client/patient-search-experience";
import { listPatientSearchResults } from "../server/list-search-results";
import { HospitalResultCard } from "../ui/hospital-result-card";
import { SearchRouteFooter, SearchRouteIntro } from "../ui/patient-search-route-sections";
import { SearchHero } from "../ui/search-hero";
import {
  EmptySearchState,
  SearchErrorState,
  SearchUnconfiguredState,
} from "../ui/search-state-panels";

export async function PatientSearchPage() {
  const state = await listPatientSearchResults();
  const hospitalCount = state.kind === "ok" ? state.hospitals.length : undefined;

  return (
    <main className="min-h-screen pb-20">
      <SearchHero />
      <section className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:gap-16 lg:px-8 lg:py-16">
        <SearchRouteIntro hospitalCount={hospitalCount} />
        <div
          id="hospital-compare"
          className="scroll-mt-24 rounded-[30px] bg-[linear-gradient(180deg,rgba(255,250,242,0.78),rgba(255,250,242,0.24))] p-1"
        >
          <SearchBody state={state} />
        </div>
        <SearchRouteFooter />
      </section>
    </main>
  );
}

function SearchBody({
  state,
}: Readonly<{ state: Awaited<ReturnType<typeof listPatientSearchResults>> }>) {
  if (state.kind === "ok") {
    return (
      <PatientSearchExperience hospitalCount={state.hospitals.length}>
        <div className="space-y-5">
          {state.hospitals.map((hospital) => (
            <HospitalResultCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </PatientSearchExperience>
    );
  }

  if (state.kind === "empty") {
    return <EmptySearchState />;
  }

  if (state.kind === "unconfigured") {
    return <SearchUnconfiguredState missingKeys={state.missingKeys} />;
  }

  return <SearchErrorState message={state.message} />;
}
