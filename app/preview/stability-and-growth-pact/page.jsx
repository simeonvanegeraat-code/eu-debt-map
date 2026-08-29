import StabilityPactPreviewPage from "@/components/stability-pact-preview/StabilityPactPreviewPage";
import { editorialDisplay } from "@/lib/editorial-font";

export const metadata = {
  title: "EU Stability and Growth Pact Design Preview | EU Debt Map",
  description:
    "Isolated design and content preview explaining the reformed EU Stability and Growth Pact.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function StabilityPactPreview() {
  return (
    <div className={editorialDisplay.variable}>
      <StabilityPactPreviewPage preview />
    </div>
  );
}
