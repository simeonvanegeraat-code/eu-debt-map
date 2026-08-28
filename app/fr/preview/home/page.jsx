import HomePageExperience from "@/components/HomePageExperience";

export const metadata = {
  title: "Aperçu de la carte d’accueil | EU Debt Map",
  description: "Aperçu isolé en français de la carte de la page d’accueil.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function FrenchHomepagePreview() {
  return <HomePageExperience lang="fr" preview />;
}
