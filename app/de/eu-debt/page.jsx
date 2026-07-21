export const runtime = "nodejs";

import LocalizedEUDebtPage, {
  generateEUDebtMetadata,
} from "@/components/LocalizedEUDebtPage";

export function generateMetadata() {
  return generateEUDebtMetadata("de");
}

export default function EUDebtPageDE() {
  return <LocalizedEUDebtPage lang="de" />;
}
