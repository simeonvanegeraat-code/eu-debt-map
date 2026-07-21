export const runtime = "nodejs";

import LocalizedEUDebtPage, {
  generateEUDebtMetadata,
} from "@/components/LocalizedEUDebtPage";

export function generateMetadata() {
  return generateEUDebtMetadata("fr");
}

export default function EUDebtPageFR() {
  return <LocalizedEUDebtPage lang="fr" />;
}
