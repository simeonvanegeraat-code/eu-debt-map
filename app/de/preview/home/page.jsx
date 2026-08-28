import HomePageExperience from "@/components/HomePageExperience";

export const metadata = {
  title: "Homepage-Kartenentwurf | EU Debt Map",
  description: "Isolierte deutsche Designvorschau der Homepage-Karte.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function GermanHomepagePreview() {
  return <HomePageExperience lang="de" preview />;
}
