import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Our own UI strings (src/content/i18n/<lang>.json); Starlight's built-in strings already cover both languages.
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema({ extend: z.object({ 'manual.screenshot.pending': z.string().optional() }) }),
  }),
};
