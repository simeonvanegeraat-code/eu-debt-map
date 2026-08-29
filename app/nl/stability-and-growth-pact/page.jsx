import StabilityPactPage from "@/components/stability-pact-preview/StabilityPactPreviewPage";
import { generateStabilityPactMetadata } from "@/components/stability-pact-preview/stability-pact-copy";

export const dynamic = "force-static";
export const revalidate = false;
export const metadata = generateStabilityPactMetadata("nl");

export default function Page() {
  return <StabilityPactPage lang="nl" />;
}
