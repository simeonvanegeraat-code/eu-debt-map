import CountryPreviewExperience from "@/components/country-preview/CountryPreviewExperience";
import CountryAd from "@/components/country/CountryAd";
import ShareBar from "@/components/ShareBar";
import { countryName } from "@/lib/countries";
import { localeBase } from "./country-copy";

const SHARE_TITLES = {
  en: (name) => `${name} public debt`,
  nl: (name) => `Staatsschuld ${name}`,
  de: (name) => `Staatsschulden ${name}`,
  fr: (name) => `Dette publique ${name}`,
};

function pageTitleFor(lang, name) {
  if (lang === "nl") return `Staatsschuld ${name} (live)`;
  if (lang === "de") return `${name} Schuldenuhr (live)`;
  if (lang === "fr") return `Dette publique ${name} (en direct)`;
  return `${name} public debt (live)`;
}

export default function CountryPublicPage({
  country,
  lang = "en",
  introSlot = null,
  relatedArticleSlot = null,
  breadcrumbSlot = null,
  titleOverride = null,
}) {
  const safeLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const displayName = countryName(country.code, safeLang);
  const title = titleOverride || pageTitleFor(safeLang, displayName);
  const url = `https://www.eudebtmap.com${localeBase(safeLang)}/country/${country.code.toLowerCase()}`;

  return (
    <CountryPreviewExperience
      country={country}
      lang={safeLang}
      title={title}
      displayName={displayName}
      breadcrumbSlot={breadcrumbSlot}
      introSlot={introSlot}
      relatedArticleSlot={relatedArticleSlot}
      adSlot={<CountryAd lang={safeLang} />}
      shareSlot={
        <ShareBar
          url={url}
          title={SHARE_TITLES[safeLang](displayName)}
          summary={title}
          lang={safeLang}
          variant="country"
        />
      }
    />
  );
}
