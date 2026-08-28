import { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";
import HomePageExperience from "@/components/HomePageExperience";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("nl");
}

export default function HomePageNL() {
  return <HomePageExperience lang="nl" />;
}
