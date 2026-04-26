import LocalizedHomePage, { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("nl");
}

export default function HomePageNL() {
  return <LocalizedHomePage lang="nl" />;
}