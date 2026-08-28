import HomePageExperience from "@/components/HomePageExperience";

export const metadata = {
  title: "Homepage-kaart ontwerpvoorbeeld | EU Debt Map",
  description: "Geïsoleerde Nederlandse ontwerp-preview van de homepagekaart.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function DutchHomepagePreview() {
  return <HomePageExperience lang="nl" preview />;
}
