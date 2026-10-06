# Boopity website

Marketing pages and illustrated sitter guides for [Boopity](https://github.com/artwork-not-final/boopity), maintained by Artwork Not Final LLC. This repository is separate from the application.

Built with Astro, Starlight, TypeScript, and Tailwind CSS. The output is static HTML, CSS, images, and browser-side documentation search. There is no application server, authentication, database, analytics, or contact form.

## Local development

Use the Node version in `.nvmrc` (Node 24.21.0), then:

```sh
npm ci --ignore-scripts
npm run dev
```

Open the localhost URL printed by Astro. For the production build, including working documentation search:

```sh
npm run verify
npm run preview
```

`verify` checks types, formatting, checker tests, the static build, and built-page links, anchors, heading structure, and image descriptions/dimensions. CI also runs the dependency audit. Review keyboard navigation, search, and desktop/mobile layouts in a browser when changing the UI. External links are not fetched by the local link checker.

## Where things live

| Location                  | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `src/pages/`              | Custom marketing pages                                          |
| `src/content/docs/docs/`  | Sitter guides in Markdown or MDX, served under `/docs/`         |
| `src/components/`         | Shared brand, navigation, and guide-image components            |
| `src/layouts/`            | Marketing document shell and metadata                           |
| `src/styles/`             | Shared theme tokens and separate marketing/documentation styles |
| `src/assets/screenshots/` | Reviewed, fictional-data product screenshots                    |
| `src/lib/site.ts`         | Product version and shared links                                |
| `astro.config.mjs`        | Canonical origin, guide navigation, integrations                |
| `scripts/`, `tests/`      | Built-site checks and checker tests                             |

## Adding a walkthrough

1. Check the behavior against the documented Boopity version. Keep instructions short and use the actual button labels.
2. Add Markdown under `src/content/docs/docs/` and its navigation entry in `astro.config.mjs`.
3. For pictures, use an isolated installation with fictional clients and pets. Never capture real client details, invitations, setup links, sign-in codes, or credentials.
4. Store screenshots under `src/assets/screenshots/` and record their provenance in its README. Use `GuideImage.astro` in MDX for responsive image generation, descriptive alt text, and captions.
5. Run `npm run format` and `npm run verify`. Check the rendered guide at desktop and mobile widths.

The first guides and screenshots describe Boopity 1.0.1. Hosting instructions link to that tagged application's technical guide. Update content and screenshots together when behavior changes; do not imply an invitation-only demo is an open playground.

## Publication

**Deployment is not configured.** `boopity.com` is the intended canonical domain in the build configuration, not evidence that this repository has been published there. Review the content and choose a static host before making DNS or production changes. Publish only `dist/`, never the repository or `node_modules/` directory. Verify HTTPS, cache behavior, headers, the 404 page, and documentation search on the chosen host.

## Dependency maintenance

Dependencies and CI actions are pinned. The scoped `postcss-selector-parser` override selects 7.1.6 to address [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) in Starlight's build-time CSS chain. Recheck whether it is still needed when upgrading Starlight/Expressive Code; run the full build before removing it.

## License and support

MIT, copyright Artwork Not Final LLC. Dependency licenses remain with their respective authors. The paw favicon reuses Boopity's Lucide geometry, with its ISC notice preserved in the SVG. Screenshots show the Boopity application, also MIT-licensed by Artwork Not Final LLC; no stock photos or third-party web fonts are bundled.

Report website issues in this repository. For application help or private security concerns, follow Boopity's [support](https://github.com/artwork-not-final/boopity/blob/main/SUPPORT.md) and [security](https://github.com/artwork-not-final/boopity/security/policy) policies. Never include sensitive installation or client information in public issues.
