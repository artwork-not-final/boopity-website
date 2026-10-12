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

`verify` checks types, formatting, tests, the static build, built-page links, anchors, heading structure, image descriptions/dimensions, and a Cloudflare deployment dry run. It does not publish anything or require Cloudflare credentials. CI also runs the dependency audit. Review keyboard navigation, search, and desktop/mobile layouts in a browser when changing the UI. External links are not fetched by the local link checker.

## Where things live

| Location                  | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `src/pages/`              | Custom marketing pages                                          |
| `src/content/docs/docs/`  | Sitter guides in Markdown or MDX, served under `/docs/`         |
| `src/components/`         | Shared brand, navigation, and guide-image components            |
| `src/layouts/`            | Marketing document shell and metadata                           |
| `src/styles/`             | Shared theme tokens and separate marketing/documentation styles |
| `src/assets/screenshots/` | Reviewed, fictional-data product screenshots                    |
| `src/assets/sharing/`     | Editable branded sharing cards and image provenance             |
| `public/social/`          | PNG sharing images for marketing pages and documentation        |
| `src/lib/site.ts`         | Shared site metadata and links                                  |
| `astro.config.mjs`        | Canonical origin, guide navigation, integrations                |
| `wrangler.json`           | Cloudflare static-asset routing and deployment name             |
| `public/_headers`         | Static response headers and caching for hashed assets           |
| `scripts/`, `tests/`      | Built-site checks and checker tests                             |

## Adding a walkthrough

1. Check the behavior against the documented Boopity version. Keep instructions short and use the actual button labels.
2. Add Markdown under `src/content/docs/docs/` and its navigation entry in `astro.config.mjs`.
3. For pictures, use an isolated installation with fictional clients and pets. Never capture real client details, invitations, setup links, sign-in codes, or credentials.
4. Store screenshots under `src/assets/screenshots/` and record their provenance in its README. Use `GuideImage.astro` in MDX for responsive image generation, descriptive alt text, and captions.
5. Run `npm run format` and `npm run verify`. Check the rendered guide at desktop and mobile widths.

The product tour screenshots describe Boopity 1.0.1; the Railway walkthrough was captured against the published 1.0.2 image. See screenshot provenance for validation boundaries. Update content and screenshots together when behavior changes. The product tour uses screenshots; there is no public demo.

Keep visitor copy brief and concrete. Say what people can do, use the actual UI labels in guides, and put technical details on the relevant help page. Keep essential safety instructions without repeating them across marketing pages.

The [content guide](docs/content-guide.md) records the editorial rules and source checks for the sitter manual. Routine tasks belong on this website, not behind links to Markdown files in the application repository.

## Publication

The repository is configured for [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#if-you-have-a-static-site). It publishes only `dist/`, with no server entry point, Astro server adapter, database, or application credentials. The output remains portable to other static hosts.

The website is live at [boopity.com](https://boopity.com). Cloudflare builds the connected repository’s `main` branch. Custom domains are managed in Cloudflare, not claimed by the repository configuration. See [the deployment guide](docs/deployment.md) for preview and publication settings.

## Dependency maintenance

Dependencies and CI actions are pinned. The scoped `postcss-selector-parser` override selects 7.1.6 to address [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) in Starlight's build-time CSS chain. Recheck whether it is still needed when upgrading Starlight/Expressive Code; run the full build before removing it.

## License and support

MIT, copyright Artwork Not Final LLC. Dependency licenses remain with their respective authors. The paw favicon reuses Boopity's Lucide geometry, with its ISC notice preserved in the SVG. Screenshots show the Boopity application, also MIT-licensed by Artwork Not Final LLC; no stock photos or third-party web fonts are bundled.

Report website issues in this repository. For application help or private security concerns, follow Boopity's [support](https://github.com/artwork-not-final/boopity/blob/main/SUPPORT.md) and [security](https://github.com/artwork-not-final/boopity/security/policy) policies. Never include sensitive installation or client information in public issues.
