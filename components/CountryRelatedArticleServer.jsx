import { listArticles } from "@/lib/articles";
import relatedArticlesCore from "@/lib/relatedArticlesCore.cjs";
import CountryRelatedArticle from "@/components/CountryRelatedArticle";

const { selectCountryRelatedArticle } = relatedArticlesCore;

export default function CountryRelatedArticleServer({ code, lang = "en" }) {
  const article = selectCountryRelatedArticle({
    articles: listArticles({ lang }),
    lang,
    countryCode: code,
  });

  return <CountryRelatedArticle article={article} lang={lang} />;
}
