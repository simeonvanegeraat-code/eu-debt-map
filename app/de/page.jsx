import LocalizedHomePage, { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("de");
}

export default function HomePageDE() {
  return <LocalizedHomePage lang="de" />;
}