import growthSnapshot from "@/lib/fiscal/growth.gen.json";
import { fiveYearOverview } from "@/lib/fiscal/growth";
import typography from "@/components/typography/typography.module.css";
import HomePreviewExperience from "@/components/home-preview/HomePreviewExperience";
import { getHomeArticles } from "@/components/home-preview/home-preview-data";

export default function HomePageExperience({ lang = "en", preview = false }) {
  const overview = fiveYearOverview(growthSnapshot);
  return (
    <div className={typography.page}>
      <HomePreviewExperience
        lang={lang}
        articles={getHomeArticles(lang)}
        historyRows={overview.quarters}
        historyProvisional={overview.provisional}
        preview={preview}
      />
    </div>
  );
}
