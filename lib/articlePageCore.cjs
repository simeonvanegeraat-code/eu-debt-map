const ARTICLE_AD_MARKER = "<!-- MID_ARTICLE_AD -->";

const DEFAULT_SITE = "https://www.eudebtmap.com";
const DEFAULT_ROUTE_PREFIXES = {
  en: "",
  nl: "/nl",
  de: "/de",
  fr: "/fr",
};

function cleanSite(site = DEFAULT_SITE) {
  return String(site || DEFAULT_SITE).replace(/\/$/, "");
}

function absoluteUrl(site, value) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;

  const base = cleanSite(site);
  return `${base}${String(value).startsWith("/") ? value : `/${value}`}`;
}

function safeIsoDate(value) {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString();
}

function articleImageDimensions(article) {
  const width = Number(article?.imageWidth);
  const height = Number(article?.imageHeight);

  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return {};
  }

  return { width, height };
}

function openGraphImage(article, url) {
  if (!url) return undefined;
  return { url, ...articleImageDimensions(article) };
}

function schemaImage(article, url) {
  if (!url) return undefined;
  return {
    "@type": "ImageObject",
    url,
    ...articleImageDimensions(article),
  };
}

function schemaPersonOrOrganization(value, site = DEFAULT_SITE) {
  const base = cleanSite(site);

  if (!value) {
    return {
      "@type": "Organization",
      name: "EU Debt Map",
      url: base,
    };
  }

  if (typeof value === "string") {
    const isOrganization = value.toLowerCase().includes("debt map");
    return {
      "@type": isOrganization ? "Organization" : "Person",
      name: value,
    };
  }

  const name = value.name || "EU Debt Map";
  const isOrganization = name.toLowerCase().includes("debt map");

  return {
    "@type": value.type || (isOrganization ? "Organization" : "Person"),
    name,
    url: value.url || undefined,
  };
}

function splitArticleBody(body = "") {
  const rawBody = typeof body === "string" ? body : "";
  const markerIndex = rawBody.indexOf(ARTICLE_AD_MARKER);

  if (markerIndex < 0) {
    return {
      bodyBeforeAd: rawBody,
      bodyAfterAd: "",
      hasMidArticleAd: false,
    };
  }

  return {
    bodyBeforeAd: rawBody.slice(0, markerIndex),
    bodyAfterAd: rawBody.slice(markerIndex + ARTICLE_AD_MARKER.length),
    hasMidArticleAd: true,
  };
}

function buildArticleMetadata({
  article,
  translations = [],
  slug,
  lang = "en",
  site = DEFAULT_SITE,
  routePrefixes = DEFAULT_ROUTE_PREFIXES,
  missingTitle = "Article • EU Debt Map",
  ogImage,
} = {}) {
  const base = cleanSite(site);
  const prefix = routePrefixes[lang] || "";
  const url = `${base}${prefix}/articles/${slug || ""}`;

  if (!article) {
    return {
      title: missingTitle,
      alternates: { canonical: url },
      openGraph: { url },
      robots: { index: false },
    };
  }

  const languages = Object.fromEntries(
    translations
      .filter((translation) => translation?.lang && translation?.slug)
      .map((translation) => {
        const translationPrefix = routePrefixes[translation.lang] || "";
        return [
          translation.lang,
          `${base}${translationPrefix}/articles/${translation.slug}`,
        ];
      })
  );
  languages["x-default"] =
    languages.en || languages.nl || languages.de || languages.fr || url;

  const title = article.seoTitle || article.title;
  const description = article.summary || article.excerpt || undefined;
  const image = absoluteUrl(base, ogImage || article.image);
  const authorName =
    typeof article.author === "string"
      ? article.author
      : article.author?.name || "EU Debt Map";

  return {
    title: `${title} • EU Debt Map`,
    description,
    alternates: { canonical: url, languages },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: article.title,
      description,
      url,
      siteName: "EU Debt Map",
      type: "article",
      publishedTime: article.datePublished || article.date,
      modifiedTime: article.dateModified || article.date,
      authors: [authorName],
      images: image ? [openGraphImage(article, image)] : undefined,
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function buildArticleJsonLd({
  article,
  url,
  lang = "en",
  site = DEFAULT_SITE,
  imageUrl,
} = {}) {
  if (!article) return null;

  const base = cleanSite(site);
  const publishDate = article.datePublished || article.date;
  const modifyDate = article.dateModified || publishDate;
  const image = absoluteUrl(base, imageUrl || article.image);
  const reviewedBy = article.reviewedBy
    ? schemaPersonOrOrganization(article.reviewedBy, base)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": article.articleType === "news" ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.summary || article.excerpt || undefined,
    datePublished: safeIsoDate(publishDate),
    dateModified: safeIsoDate(modifyDate),
    dateReviewed: safeIsoDate(article.dateReviewed),
    inLanguage: article.lang || lang,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: schemaPersonOrOrganization(article.author, base),
    reviewedBy,
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: `${base}/eu_favicon_512.png`,
        width: 512,
        height: 512,
      },
    },
    image: image ? [schemaImage(article, image)] : undefined,
    articleSection:
      article.primaryTopic || article.tags?.[0] || "EU government debt",
    keywords: Array.isArray(article.tags) ? article.tags.join(", ") : undefined,
  };
}

module.exports = {
  ARTICLE_AD_MARKER,
  articleImageDimensions,
  buildArticleJsonLd,
  buildArticleMetadata,
  safeIsoDate,
  schemaPersonOrOrganization,
  splitArticleBody,
};
