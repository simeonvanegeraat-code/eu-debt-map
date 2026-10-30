export const runtime = "nodejs";

import { generateEUDebtMetadata } from "@/components/LocalizedEUDebtPage";
import EUDebtPageExperience from "@/components/eu-debt-preview/EUDebtPageExperience";

export function generateMetadata() {
  return generateEUDebtMetadata("nl");
}

export default function EUDebtPageNL() {
  return <EUDebtPageExperience />;
}
