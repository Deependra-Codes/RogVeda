import type { RoomType } from "@/supabase/types";

export type SearchDoctor = {
  id: string;
  name: string;
  yearsExperience: number;
};

export type SearchPriceOption = {
  doctorId: string;
  roomType: RoomType;
  amountUsdCents: number;
};

export type SearchHospitalResult = {
  id: string;
  name: string;
  city: string;
  locationLabel: string;
  procedureName: string;
  summary: string;
  imageToken: string;
  trustSignals: [string, string, string];
  doctors: SearchDoctor[];
  roomTypes: RoomType[];
  pricing: SearchPriceOption[];
  defaultDoctorId: string;
  defaultRoomType: RoomType;
  lowestPriceUsdCents: number;
};

export type SearchDataState =
  | {
      kind: "ok";
      hospitals: SearchHospitalResult[];
    }
  | {
      kind: "empty";
    }
  | {
      kind: "unconfigured";
      missingKeys: string[];
    }
  | {
      kind: "error";
      message: string;
    };
