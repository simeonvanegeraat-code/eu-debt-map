import growthSnapshot from "@/lib/fiscal/growth.gen.json";
import { fiveYearOverview } from "@/lib/fiscal/growth";
import typography from "@/components/typography/typography.module.css";
import HomeAtlasExperience from "@/components/home-atlas/HomeAtlasExperience";
import HomeAtlasContent from "@/components/home-atlas/HomeAtlasContent";
import { getHomeArticles } from "@/components/home-preview/home-preview-data";

export default function HomePageExperience({ lang = "en", preview = false }) {
  const overview = fiveYearOverview(growthSnapshot);
  return (
    <div className={typography.page}>
      <HomeAtlasExperience key={lang} lang={lang} preview={preview}>
        <HomeAtlasContent
          lang={lang}
          articles={getHomeArticles(lang)}
          historyRows={overview.quarters}
          historyProvisional={overview.provisional}
        />
      </HomeAtlasExperience>
    </div>
  );
}
