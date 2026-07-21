export const runtime = "nodejs";

import LocalizedEUDebtPage, {
  generateEUDebtMetadata,
} from "@/components/LocalizedEUDebtPage";

export function generateMetadata() {
  return generateEUDebtMetadata("nl");
}

export default function EUDebtPageNL() {
  return <LocalizedEUDebtPage lang="nl" />;
}
