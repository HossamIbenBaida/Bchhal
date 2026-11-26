import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The entry id is the file name (tapis.json -> "tapis"), not the `slug` field,
 * because `slug` holds the localised URL segment of each language.
 */
const fileId = ({ entry }: { entry: string }) => entry.replace(/\.(json|md)$/, '');

/** A string translated in every supported language. */
const i18n = z.object({ fr: z.string(), en: z.string() });

const faq = z.array(z.object({ q: i18n, a: i18n })).default([]);

/**
 * One JSON file = one souk item = one FR page + one EN page.
 * Prices are in MAD. `verified: false` means the range is a placeholder
 * until a field survey confirms it; it is then hidden from structured data.
 */
const objets = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/objets', generateId: fileId }),
  schema: z.object({
    slug: i18n,
    name: i18n,
    description: i18n,
    intro: i18n,
    updated: z.coerce.date(),
    prices: z.array(
      z.object({
        city: z.string(),
        quality: i18n,
        unit: i18n,
        min: z.number().nonnegative(),
        max: z.number().nonnegative(),
        verified: z.boolean().default(false),
        source: z.string().optional(),
        surveyedAt: z.coerce.date().optional(),
      }),
    ),
    tips: z.array(i18n).default([]),
    phrases: z.array(z.string()).default([]),
    cities: z.array(z.string()).default([]),
    faq,
  }),
});

/** One JSON file = one Darija phrase = one FR page + one EN page. */
const phrases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/phrases', generateId: fileId }),
  schema: z.object({
    slug: i18n,
    latin: z.string(),
    arabic: z.string(),
    meaning: i18n,
    description: i18n,
    situation: z.enum(['souk', 'taxi', 'restaurant', 'politesse']),
    usage: i18n,
    audio: z.string().optional(),
    audioRecorded: z.boolean().default(false),
    reviewedByNative: z.boolean().default(false),
    updated: z.coerce.date(),
    related: z.array(z.string()).default([]),
    objets: z.array(z.string()).default([]),
    faq,
  }),
});

/** Markdown city itineraries, used by the budget module later. */
const itineraires = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/itineraires', generateId: fileId }),
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    title: z.string(),
    description: z.string(),
    city: z.string(),
    days: z.number().int().positive(),
    updated: z.coerce.date(),
  }),
});

export const collections = { objets, phrases, itineraires };
