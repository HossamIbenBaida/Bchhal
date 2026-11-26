import type { Lang } from '@/i18n/ui';

export type Crumb = { name: string; href: string };
export type Faq = { q: Record<Lang, string>; a: Record<Lang, string> }[];

/** schema.org BreadcrumbList from a list of crumbs (absolute URLs required). */
export function breadcrumbLd(crumbs: Crumb[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.href, site).href,
    })),
  };
}

/** schema.org FAQPage; returns null when there is no question. */
export function faqLd(faq: Faq, lang: Lang) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q[lang],
      acceptedAnswer: { '@type': 'Answer', text: f.a[lang] },
    })),
  };
}
