import HomePageExperience from "@/components/HomePageExperience";

export const metadata = {
  title: "Open atlas · homepagevoorbeeld | EU Debt Map",
  description: "Lokaal ontwerpvoorbeeld met een directe ingang naar de Europese schuldenkaart.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function HomeAtlasPreviewPage() {
  return <HomePageExperience lang="nl" preview />;
}
