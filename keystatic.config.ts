import { config, collection, fields } from '@keystatic/core';
import { block, repeating, wrapper } from '@keystatic/core/content-components';
import manifest from './src/assets/screenshots/manifest.json';

/**
 * Keystatic editor for the customer manual (design §2.4).
 *
 * Storage is switched by PUBLIC_KEYSTATIC_STORAGE:
 * - "local" (default): edits files on disk; for local development only.
 * - "github": commits through the Keystatic GitHub App to branches named edit/*. main is protected, so every change is
 *   reviewed in a pull request (design §2.5). The App is created by the owner from the /keystatic setup wizard.
 */
const storage =
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? ({ kind: 'github', repo: 'AI-First-PTE-LTD/operon-manual', branchPrefix: 'edit/' } as const)
    : ({ kind: 'local' } as const);

type ManifestEntry = { id: string; locale: string };

// Screenshot ids come from the manifest written by the screenshot pipeline, so an editor can pick only an existing
// screenshot. Until the first pipeline run the manifest is empty and the id is typed in by hand; scripts/check-manual.mjs
// reports every id that has no image yet.
const shotIds = [...new Set((manifest as ManifestEntry[]).map((m) => m.id))].sort();
const shotIdField =
  shotIds.length > 0
    ? fields.select({ label: 'Screenshot', options: shotIds.map((id) => ({ label: id, value: id })), defaultValue: shotIds[0]! })
    : fields.text({ label: 'Screenshot id', description: 'For example bookkeeping/documents-overview', validation: { length: { min: 1 } } });

const components = {
  screenshot: block({
    label: 'Screenshot',
    description: 'A screenshot from the screenshot pipeline. Free image uploads are disabled.',
    schema: { id: shotIdField, caption: fields.text({ label: 'Caption' }) },
  }),
  aside: wrapper({
    label: 'Aside',
    schema: {
      type: fields.select({
        label: 'Type',
        options: [
          { label: 'Note', value: 'note' },
          { label: 'Tip', value: 'tip' },
          { label: 'Caution', value: 'caution' },
          { label: 'Danger', value: 'danger' },
        ],
        defaultValue: 'note',
      }),
      title: fields.text({ label: 'Title' }),
    },
  }),
  steps: wrapper({ label: 'Steps', schema: {} }),
  tabs: repeating({ label: 'Tabs', children: ['tabitem'], schema: {} }),
  tabitem: wrapper({ label: 'Tab', forSpecificLocations: true, schema: { label: fields.text({ label: 'Label' }) } }),
};

const docsSchema = {
  title: fields.slug({ name: { label: 'Title' } }),
  description: fields.text({ label: 'Description', multiline: true }),
  sidebar: fields.object(
    {
      order: fields.integer({ label: 'Order in the sidebar', defaultValue: 100 }),
      label: fields.text({ label: 'Sidebar label (optional)' }),
    },
    { label: 'Sidebar' },
  ),
  content: fields.markdoc({ label: 'Content', extension: 'mdoc', options: { image: false }, components }),
};

export default config({
  storage,
  ui: { brand: { name: 'Operon Manual' } },
  collections: {
    docsEn: collection({
      label: 'Pages (English)',
      path: 'src/content/docs/en/**',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: docsSchema,
    }),
    docsZh: collection({
      label: 'Pages (简体中文)',
      path: 'src/content/docs/zh-cn/**',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: docsSchema,
    }),
  },
});
