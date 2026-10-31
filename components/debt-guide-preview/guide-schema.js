const { getGuideCopy } = require('./guide-copy');
const { getDebtDeficitCopy } = require('../debt-guide/debt-deficit-copy');

const GUIDE_REVIEW_DATE = '2026-10-31';
const SITE = 'https://www.eudebtmap.com';

function getGuideSchemas(lang = 'en') {
  const copy = getGuideCopy(lang);
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const url = `${SITE}${prefix}/debt`;
  const faqs = [...copy.faqs, getDebtDeficitCopy(lang).ratioFAQ];
  return [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: copy.title, description: copy.definition, inLanguage: lang,
      dateModified: GUIDE_REVIEW_DATE, isAccessibleForFree: true,
      author: { '@type': 'Organization', name: 'EU Debt Map', url: SITE },
      publisher: { '@type': 'Organization', name: 'EU Debt Map', url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/eu_favicon_512.png` } },
      mainEntityOfPage: url, about: copy.nav,
    },
    { '@context': 'https://schema.org', '@type': 'WebPage', name: copy.title,
      url, description: copy.definition, inLanguage: lang },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: { en: 'Home', nl: 'Home', de: 'Startseite', fr: 'Accueil' }[lang], item: `${SITE}${prefix}` },
      { '@type': 'ListItem', position: 2, name: copy.title, item: url },
    ] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer },
    })) },
  ];
}

module.exports = { getGuideSchemas, GUIDE_REVIEW_DATE };
