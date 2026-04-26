import LocalizedHomePage, { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("fr");
}

export default function HomePageFR() {
  return <LocalizedHomePage lang="fr" />;
}