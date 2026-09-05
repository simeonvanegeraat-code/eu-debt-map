import DutchGovernmentBondGuide from "@/components/government-bonds/DutchGovernmentBondGuide";
import { countries } from "@/lib/data";

export const metadata = {
  title: "Preview Nederlandse staatsobligatiegids | EU Debt Map",
  description:
    "Niet-gepubliceerde ontwerp-preview van de Nederlandse gids voor staatsobligaties.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const dynamic = "error";

export default function DutchGovernmentBondGuidePreview() {
  const netherlands = countries.find((country) => country.code === "NL");

  return <DutchGovernmentBondGuide country={netherlands} preview />;
}
