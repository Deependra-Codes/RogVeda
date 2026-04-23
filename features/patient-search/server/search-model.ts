import type { RoomType } from "@/supabase/types";

import type { SearchHospitalResult, SearchPriceOption } from "../types/search";

type RawPricingRow = {
  room_type: RoomType | null;
  amount_usd_cents: number | null;
};

type RawDoctorRow = {
  id: string;
  name: string;
  years_experience: number | null;
  pricing: RawPricingRow[] | null;
};

export type RawHospitalRow = {
  id: string;
  name: string;
  city: string;
  region_label: string;
  procedure_name: string;
  summary: string;
  image_token: string;
  trust_signal_one: string;
  trust_signal_two: string;
  trust_signal_three: string;
  doctors: RawDoctorRow[] | null;
};

const roomTypeOrder: Record<RoomType, number> = {
  "General Ward": 0,
  "Semi-Private": 1,
  Private: 2,
  Suite: 3,
};

export function mapHospitalRowsToSearchResults(rows: RawHospitalRow[]) {
  return rows.flatMap((row) => {
    const mapped = mapHospitalRow(row);
    return mapped ? [mapped] : [];
  });
}

function mapHospitalRow(row: RawHospitalRow): SearchHospitalResult | null {
  const doctors = sortDoctors(row.doctors ?? []);
  const pricing = sortPricing(flattenPricing(doctors));
  const defaultSelection = findLowestPrice(pricing);
  if (!defaultSelection) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    city: row.city,
    locationLabel: row.region_label,
    procedureName: row.procedure_name,
    summary: row.summary,
    imageToken: row.image_token,
    trustSignals: [row.trust_signal_one, row.trust_signal_two, row.trust_signal_three],
    doctors: doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      yearsExperience: doctor.years_experience ?? 0,
    })),
    roomTypes: collectRoomTypes(pricing),
    pricing,
    defaultDoctorId: defaultSelection.doctorId,
    defaultRoomType: defaultSelection.roomType,
    lowestPriceUsdCents: defaultSelection.amountUsdCents,
  };
}

function sortDoctors(doctors: RawDoctorRow[]) {
  return [...doctors].sort((left, right) => {
    const experienceGap = (right.years_experience ?? 0) - (left.years_experience ?? 0);
    return experienceGap || left.name.localeCompare(right.name);
  });
}

function flattenPricing(doctors: RawDoctorRow[]) {
  return doctors.flatMap((doctor) =>
    (doctor.pricing ?? []).flatMap((row) =>
      row.room_type && row.amount_usd_cents
        ? [
            {
              doctorId: doctor.id,
              roomType: row.room_type,
              amountUsdCents: row.amount_usd_cents,
            },
          ]
        : [],
    ),
  );
}

function sortPricing(pricing: SearchPriceOption[]) {
  return [...pricing].sort((left, right) => {
    const priceGap = left.amountUsdCents - right.amountUsdCents;
    return priceGap || roomTypeOrder[left.roomType] - roomTypeOrder[right.roomType];
  });
}

function findLowestPrice(pricing: SearchPriceOption[]) {
  return pricing[0] ?? null;
}

function collectRoomTypes(pricing: SearchPriceOption[]) {
  return [...new Set(pricing.map((option) => option.roomType))].sort(
    (left, right) => roomTypeOrder[left] - roomTypeOrder[right],
  );
}
