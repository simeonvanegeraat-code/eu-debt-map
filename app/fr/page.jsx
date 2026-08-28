import { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";
import HomePageExperience from "@/components/HomePageExperience";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("fr");
}

export default function HomePageFR() {
  return <HomePageExperience lang="fr" />;
}
