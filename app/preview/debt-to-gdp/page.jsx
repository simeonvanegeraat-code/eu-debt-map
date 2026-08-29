import DebtToGDPPreviewPage from "@/components/debt-to-gdp-preview/DebtToGDPPreviewPage";
import { editorialDisplay } from "@/lib/editorial-font";

export const metadata = {
  title: "EU Debt-to-GDP Ranking Design Preview | EU Debt Map",
  description: "Isolated design and SEO content preview for the EU debt-to-GDP ranking.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function DebtToGDPPreview() {
  return (
    <div className={editorialDisplay.variable}>
      <DebtToGDPPreviewPage preview />
    </div>
  );
}
