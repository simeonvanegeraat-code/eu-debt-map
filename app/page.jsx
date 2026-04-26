import LocalizedHomePage, { generateLocalizedHomeMetadata } from "@/components/LocalizedHomePage";

export async function generateMetadata() {
  return generateLocalizedHomeMetadata("en");
}

export default function HomePage() {
  return <LocalizedHomePage lang="en" />;
}