import { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";
import HomePageExperience from "@/components/HomePageExperience";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("de");
}

export default function HomePageDE() {
  return <HomePageExperience lang="de" />;
}
