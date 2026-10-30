export const runtime = "nodejs";

import { generateEUDebtMetadata } from "@/components/LocalizedEUDebtPage";
import EUDebtPageExperience from "@/components/eu-debt-preview/EUDebtPageExperience";

export function generateMetadata() {
  return generateEUDebtMetadata("en");
}

export default function EUDebtPage() {
  return <EUDebtPageExperience lang="en" />;
}
