export const runtime = "nodejs";

import { generateEUDebtMetadata } from "@/components/LocalizedEUDebtPage";
import EUDebtPageExperience from "@/components/eu-debt-preview/EUDebtPageExperience";

export function generateMetadata() {
  return generateEUDebtMetadata("fr");
}

export default function EUDebtPageFR() {
  return <EUDebtPageExperience lang="fr" />;
}
