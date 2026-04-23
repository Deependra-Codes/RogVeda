import { HospitalResultInteractivePanel } from "../client/hospital-result-interactive-panel";
import type { SearchHospitalResult } from "../types/search";

type HospitalResultCardProps = Readonly<{
  hospital: SearchHospitalResult;
}>;

export function HospitalResultCard({ hospital }: HospitalResultCardProps) {
  return <HospitalResultInteractivePanel hospital={hospital} />;
}
