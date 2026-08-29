import DebtToGDPPage from "@/components/debt-to-gdp-preview/DebtToGDPPreviewPage";
import { generateDebtToGDPMetadata } from "@/components/debt-to-gdp-preview/debt-to-gdp-copy";

export const dynamic = "force-static";
export const revalidate = false;
export const metadata = generateDebtToGDPMetadata("de");

export default function Page() {
  return <DebtToGDPPage lang="de" />;
}
