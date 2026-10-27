# Operon Manual

The customer manual for [Operon](https://app.staffonai.com): step-by-step instructions for the accountants, company secretaries and other professional staff who use Operon. English is the primary version; Simplified Chinese is kept in sync.

Built with [Starlight](https://starlight.astro.build) (Astro) and edited with [Keystatic](https://keystatic.com). The first edition covers the bookkeeping workbench.

> This repository is **public**. Draft branches and pull requests can be seen by anyone. Never put real client data — company names, people, UENs, amounts, account numbers, e-mail addresses or screenshots of real books — in any file, commit, branch or pull request. All examples use fictional data (the example company is *ABC PTE. LTD.*).

## Run locally

Requirements: Node.js 22.23.4 or later and pnpm 9 (`corepack enable`). pnpm downloads the pinned Node version (`.npmrc`) by itself.

```sh
pnpm install
pnpm dev          # http://localhost:4321/en/ , /zh-cn/ and /keystatic
pnpm build        # production build into dist/
pnpm check        # type check
pnpm check:manual # manual consistency checks (screenshots, missing translations)
```

`pnpm dev` runs Keystatic in **local mode**: changes made at `/keystatic` are written straight to the files in `src/content/docs/`. Commit them with git as usual.

## Content layout

```
src/content/docs/en/...       English pages (primary)
src/content/docs/zh-cn/...    Chinese pages; same file names as en/
src/assets/screenshots/       written only by the screenshot pipeline (see below)
```

A page in `zh-cn/` with the same path as a page in `en/` is the translation of that page; the language menu switches between them. A page that has not been translated yet is shown in English with a notice.

Pages are written in [Markdoc](https://markdoc.dev) (`.mdoc`). Besides ordinary Markdown, these tags are available:

| Tag | Use |
|---|---|
| `{% screenshot id="bookkeeping/documents-overview" caption="..." /%}` | A screenshot. The id is `<chapter>/<topic>-<state>` in lower-case kebab-case. |
| `{% aside type="note" title="..." %}...{% /aside %}` | A note, tip, caution or danger box. |
| `{% steps %}` + a numbered list + `{% /steps %}` | Numbered steps. |
| `{% tabs %}{% tabitem label="..." %}...{% /tabitem %}{% /tabs %}` | Tabs. |

Writing rules: formal written English; button, tab and field names exactly as they appear in the English interface of Operon, in **bold**. In the Chinese version, professional terms such as GST, F5, UEN, CPF, IRAS and Form C-S stay in English.

## Edit with Keystatic

Pre-sales staff and other editors use the visual editor at `/keystatic` on the published site:

1. Sign in with your GitHub account. You need `write` access to this repository only; ask a maintainer for an invitation.
2. Create a branch. Its name must start with `edit/` (for example `edit/bank-recon-wording`). `main` is protected and cannot be edited directly.
3. Edit and save. Each save is a commit under your own name.
4. Select **Create pull request**.

Free image uploads are disabled. Pictures can only be screenshots from the pipeline, chosen by id.

### Storage modes

| `PUBLIC_KEYSTATIC_STORAGE` | Mode | Where changes go |
|---|---|---|
| `local` (default) | Local development | Files on disk |
| `github` | Published site | Commits on `edit/*` branches through the Keystatic GitHub App |

GitHub mode needs the Keystatic GitHub App. It is created once by an organisation owner from the setup wizard at `/keystatic` (with `PUBLIC_KEYSTATIC_STORAGE=github` set locally); the wizard writes the values below into `.env`. Keep the values in the team's secret store and as Worker secrets; never commit them. See `.env.example`.

- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

## Review and publishing

- Every change to `main` goes through a pull request and needs at least one approval from a code owner (`.github/CODEOWNERS`). Force pushes to `main` are blocked.
- CI (`.github/workflows/check.yml`) runs `check:manual`, the type check and the build on every pull request.
- Reviewers check the wording against the current Operon interface, check that both languages say the same thing, and check that no real client data appears anywhere in the change.
- Merging to `main` does not publish the site yet; a maintainer deploys by hand (see **Deploy**).

## Deploy

The site is a Cloudflare Worker named `operon-manual` in the Cloudflare account that holds the `staffonai.com` zone (`a47ffc5bfe27f103c0bb382311fbd48b`). Starlight pages are static assets; only `/keystatic` and `/api/keystatic` run on the Worker. The Worker has no D1, R2 or KV bindings.

- Preview URL: <https://operon-manual.operon-staffon.workers.dev>
- Public URL (planned): <https://docs.staffonai.com>, bound as a Workers Custom Domain.

Always pass the account id and an API token explicitly. A wrangler OAuth login on a developer machine can point at another account.

```sh
export CLOUDFLARE_ACCOUNT_ID=a47ffc5bfe27f103c0bb382311fbd48b
export CLOUDFLARE_API_TOKEN=...            # from the team's secret store; never commit it
npx wrangler whoami                         # check the account before you deploy

# Build. The PUBLIC_* values are compiled into the client bundle.
SITE_URL=https://docs.staffonai.com \
PUBLIC_KEYSTATIC_STORAGE=github \
PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=<app slug> \
pnpm build

# Deploy the generated config (it merges wrangler.jsonc).
npx wrangler deploy --config dist/server/wrangler.json
```

Worker secrets for GitHub mode (set once per value, through stdin so the value is not in shell history):

```sh
printf %s "$VALUE" | npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_ID --name operon-manual
printf %s "$VALUE" | npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_SECRET --name operon-manual
printf %s "$VALUE" | npx wrangler secret put KEYSTATIC_SECRET --name operon-manual
```

The same values are kept in the team's secret store with the prefix `MANUAL_KEYSTATIC_`.

## Screenshots

Screenshots are **not taken by hand**. They are produced by the screenshot pipeline in the Operon repository: an automated browser test walks through the product in a throw-away tenant that holds only fictional companies and people, and captures each screenshot point in English and in Chinese. The pipeline opens a pull request in this repository that changes only `src/assets/screenshots/**` (the images and `manifest.json`); a maintainer reviews the before-and-after images and merges it.

Until the pipeline has produced an image, a page shows a labelled placeholder for each `{% screenshot %}` tag, and `pnpm check:manual` lists the missing images as warnings. `MANUAL_STRICT_SCREENSHOTS=1` turns missing images into errors (for `check:manual` and for the build).

Never add a screenshot by hand, and never paste an image from a real client's books.
