export const runtime = "nodejs";

import { generateEUDebtMetadata } from "@/components/LocalizedEUDebtPage";
import EUDebtPageExperience from "@/components/eu-debt-preview/EUDebtPageExperience";

export function generateMetadata() {
  return generateEUDebtMetadata("de");
}

export default function EUDebtPageDE() {
  return <EUDebtPageExperience lang="de" />;
}
