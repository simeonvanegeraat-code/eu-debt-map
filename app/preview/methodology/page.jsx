import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const metadata = {
  title: "EU Debt Map Methodology Design Preview",
  description: "Isolated design and content preview for the EU Debt Map methodology page.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function MethodologyPreview() {
  return <MethodologyPreviewPage preview />;
}
