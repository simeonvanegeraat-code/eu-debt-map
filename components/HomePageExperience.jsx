import { editorialDisplay } from "@/lib/editorial-font";
import HomePreviewExperience from "@/components/home-preview/HomePreviewExperience";
import { getHomeArticles } from "@/components/home-preview/home-preview-data";

export default function HomePageExperience({ lang = "en", preview = false }) {
  return (
    <div className={editorialDisplay.variable}>
      <HomePreviewExperience
        lang={lang}
        articles={getHomeArticles(lang)}
        preview={preview}
      />
    </div>
  );
}
