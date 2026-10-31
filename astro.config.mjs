// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Customer manual for Operon (design: Operon repo docs/architecture/customer-manual-design.md, ADR-0546).
// English is the primary version; Simplified Chinese is kept in sync. Both locales live in sub-directories
// (no root locale), so "/" redirects to "/en/".
// `astro dev` runs without the Cloudflare adapter, on Node. Keystatic's local mode reads and writes files on disk and
// its API routes are CommonJS; neither works inside workerd. `astro build` always uses the adapter.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://docs.example.invalid',
  redirects: { '/': '/en/' },
  // Pages are prerendered and served as static assets; only the Keystatic routes run on the Worker. Images are optimised
  // at build time, so the Worker needs no Images binding, and sessions are off, so it needs no KV (design §5.1).
  // Prerendering runs in Node: Astro 7's Markdown engine (satteri) cannot prerender inside workerd (WASI not implemented).
  adapter: isDev ? undefined : cloudflare({ imageService: { build: 'compile', runtime: 'passthrough' }, prerenderEnvironment: 'node' }),
  session: false,
  integrations: [
    starlight({
      title: { en: 'Operon Manual', 'zh-CN': 'Operon 操作手册' },
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/AI-First-PTE-LTD/operon-manual' }],
      editLink: { baseUrl: 'https://github.com/AI-First-PTE-LTD/operon-manual/edit/main/' },
      sidebar: [
        {
          label: 'Bookkeeping workbench',
          translations: { 'zh-CN': '记账工作台' },
          items: [{ autogenerate: { directory: 'bookkeeping' } }],
        },
        {
          label: 'CRM · Contracts',
          translations: { 'zh-CN': 'CRM · 合同管理' },
          items: [{ autogenerate: { directory: 'crm' } }],
        },
        {
          label: 'Invoices',
          translations: { 'zh-CN': '发票' },
          items: [{ autogenerate: { directory: 'invoices' } }],
        },
        {
          label: 'Case templates',
          translations: { 'zh-CN': '案子模板' },
          items: [{ autogenerate: { directory: 'case-templates' } }],
        },
      ],
    }),
    markdoc(),
    react(),
    keystatic(),
  ],
});
