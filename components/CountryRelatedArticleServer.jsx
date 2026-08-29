import { listArticles } from "@/lib/articles";
import relatedArticlesCore from "@/lib/relatedArticlesCore.cjs";
import CountryRelatedArticle from "@/components/CountryRelatedArticle";
import { countryName } from "@/lib/countries";

const { selectCountryRelatedArticle } = relatedArticlesCore;

export default function CountryRelatedArticleServer({
  code,
  lang = "en",
  preferredSlug = null,
}) {
  const allArticles = listArticles({ lang });
  const primary = selectCountryRelatedArticle({
    articles: allArticles,
    lang,
    countryCode: code,
    preferredSlug,
  });
  const fallback = selectCountryRelatedArticle({
    articles: allArticles.filter((article) => article.countryPageFallback === true),
    lang,
    countryCode: code,
  });
  const articles = [primary];

  if (fallback && fallback.slug !== primary?.slug) articles.push(fallback);

  return (
    <CountryRelatedArticle
      articles={articles.filter(Boolean)}
      countryName={countryName(code, lang)}
      lang={lang}
    />
  );
}
