import { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";
import HomePageExperience from "@/components/HomePageExperience";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("en");
}

export default function HomePage() {
  return <HomePageExperience lang="en" />;
}
