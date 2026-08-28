import HomePageExperience from "@/components/HomePageExperience";

export const metadata = {
  title: "Homepage Map Design Preview | EU Debt Map",
  description: "Isolated homepage map design preview.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function HomepagePreview() {
  return <HomePageExperience lang="en" preview />;
}
