import InArticleAd from "@/components/InArticleAd";
import articlePageCore from "@/lib/articlePageCore.cjs";

const { splitArticleBody } = articlePageCore;

export default function ArticleBody({ body = "" }) {
  const { bodyBeforeAd, bodyAfterAd, hasMidArticleAd } = splitArticleBody(body);

  return (
    <div className="articleProse">
      <div dangerouslySetInnerHTML={{ __html: bodyBeforeAd }} />
      {hasMidArticleAd && <InArticleAd />}
      {bodyAfterAd && (
        <div dangerouslySetInnerHTML={{ __html: bodyAfterAd }} />
      )}
    </div>
  );
}
