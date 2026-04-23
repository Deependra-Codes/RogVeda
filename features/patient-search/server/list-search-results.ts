import { unstable_cache } from "next/cache";

import { getSupabaseReadEnvIssues } from "@/lib/env";
import { getSupabaseReadClient } from "@/supabase/clients/server";

import type { SearchDataState } from "../types/search";
import { type RawHospitalRow, mapHospitalRowsToSearchResults } from "./search-model";

const patientSearchResultsTag = "patient-search-results";
const targetProcedure = "Total Knee Replacement";

export async function listPatientSearchResults(): Promise<SearchDataState> {
  const missingKeys = getSupabaseReadEnvIssues();
  if (missingKeys.length) {
    return { kind: "unconfigured", missingKeys };
  }

  const result = await readPatientSearchRows();
  if (result.kind === "unconfigured") {
    return { kind: "unconfigured", missingKeys: getSupabaseReadEnvIssues() };
  }

  if (result.kind === "error") {
    console.error("Failed to load patient search results", result.error);
    return {
      kind: "error",
      message: "We could not load partner hospitals right now. Please try again in a moment.",
    };
  }

  const hospitals = mapHospitalRowsToSearchResults(result.rows);
  return hospitals.length ? { kind: "ok", hospitals } : { kind: "empty" };
}

const readPatientSearchRows = unstable_cache(
  async () => {
    const client = getSupabaseReadClient();
    if (!client) {
      return { kind: "unconfigured" as const };
    }

    const { data, error } = await client
      .from("hospitals")
      .select(
        `
          id,
          name,
          city,
          region_label,
          procedure_name,
          summary,
          image_token,
          trust_signal_one,
          trust_signal_two,
          trust_signal_three,
          doctors (
            id,
            name,
            years_experience,
            pricing (
              room_type,
              amount_usd_cents
            )
          )
        `,
      )
      .eq("procedure_name", targetProcedure)
      .order("name")
      .limit(3);

    if (error) {
      return {
        kind: "error" as const,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }

    return {
      kind: "ok" as const,
      rows: (data ?? []) as RawHospitalRow[],
    };
  },
  [patientSearchResultsTag],
  { tags: [patientSearchResultsTag] },
);
