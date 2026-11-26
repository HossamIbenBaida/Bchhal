import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/ui';

/** getStaticPaths helper: one page per entry, slug in the requested language. */
export async function objetPaths(lang: Lang) {
  const items = await getCollection('objets');
  return items.map((entry) => ({ params: { slug: entry.data.slug[lang] }, props: { entry } }));
}

export async function phrasePaths(lang: Lang) {
  const items = await getCollection('phrases');
  return items.map((entry) => ({ params: { slug: entry.data.slug[lang] }, props: { entry } }));
}

export type Objet = CollectionEntry<'objets'>;
export type Phrase = CollectionEntry<'phrases'>;
