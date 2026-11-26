export const languages = { fr: 'Français', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

/** Localised path segment of each section, so URLs read naturally in each language. */
export const sections = {
  prices: { fr: 'prix', en: 'prices' },
  darija: { fr: 'darija', en: 'darija' },
  budget: { fr: 'budget', en: 'budget' },
} as const;
export type Section = keyof typeof sections;

export const ui = {
  fr: {
    'site.name': 'Bchhal ?',
    'site.tagline': 'Le compagnon de voyage au Maroc : juste prix, budget et darija',
    'nav.home': 'Accueil',
    'nav.prices': 'Juste prix',
    'nav.darija': 'Darija',
    'nav.budget': 'Budget',
    'common.updated': 'Mis à jour le',
    'common.faq': 'Questions fréquentes',
    'common.related': 'Voir aussi',
    'common.unverified':
      'Fourchette indicative, pas encore vérifiée sur le terrain. Les relevés dans les souks sont en cours.',
    'common.source': 'Source',
    'prices.range': 'Fourchette juste',
    'prices.quality': 'Qualité',
    'prices.city': 'Ville',
    'prices.tips': 'Conseils pour négocier',
    'prices.phrase': 'La phrase à dire',
    'darija.listen': 'Écouter',
    'darija.audioSoon': 'Enregistrement audio à venir (voix de Marrakech).',
    'darija.show': "Montrer l'écran",
    'darija.close': 'Fermer',
    'darija.meaning': 'Sens',
    'darija.when': 'Quand l’utiliser',
    'budget.title': 'Budget voyage Maroc',
    'footer.legal': 'Aucune donnée personnelle collectée sur ce site.',
  },
  en: {
    'site.name': 'Bchhal?',
    'site.tagline': 'Your Morocco travel companion: fair prices, budget and Darija',
    'nav.home': 'Home',
    'nav.prices': 'Fair prices',
    'nav.darija': 'Darija',
    'nav.budget': 'Budget',
    'common.updated': 'Updated on',
    'common.faq': 'Frequently asked questions',
    'common.related': 'See also',
    'common.unverified':
      'Indicative range, not yet verified on the ground. Souk price surveys are in progress.',
    'common.source': 'Source',
    'prices.range': 'Fair range',
    'prices.quality': 'Quality',
    'prices.city': 'City',
    'prices.tips': 'Bargaining tips',
    'prices.phrase': 'What to say',
    'darija.listen': 'Listen',
    'darija.audioSoon': 'Audio recording coming soon (Marrakech voices).',
    'darija.show': 'Show the screen',
    'darija.close': 'Close',
    'darija.meaning': 'Meaning',
    'darija.when': 'When to use it',
    'budget.title': 'Morocco travel budget',
    'footer.legal': 'No personal data is collected on this site.',
  },
} as const;

export type UIKey = keyof (typeof ui)['fr'];

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key] ?? ui[defaultLang][key];
}

export const otherLang = (lang: Lang): Lang => (lang === 'fr' ? 'en' : 'fr');

/** Builds a localised path: path('fr', 'prices', 'tapis') -> /fr/prix/tapis/ */
export function path(lang: Lang, section?: Section, slug?: string): string {
  const parts = [lang, section && sections[section][lang], slug].filter(Boolean);
  return `/${parts.join('/')}/`;
}

export function formatDate(lang: Lang, iso: string): string {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { dateStyle: 'long' }).format(
    new Date(iso),
  );
}
