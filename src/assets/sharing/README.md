# Sharing cards

Editable 1200 × 630 SVG masters for the website and documentation cards. The PNG exports in `public/social/` are served directly for crawlers that do not support SVG preview images. They contain no client data or third-party photos.

The designs reuse the website palette and Lucide paw mark from `public/favicon.svg`. Its ISC notice is retained in each SVG; the same notice below also covers the PNG exports. The cards use locally rendered Avenir Next and Georgia text; font files are not distributed. Export at the original dimensions and inspect the result after editing. The checked-in PNGs keep the deployed output independent of build-machine fonts.

`src/lib/sharing.mjs` supplies shared image metadata. Marketing pages keep their own title and description; Starlight does the same for each guide. No page needs client-side JavaScript to expose its preview. Changing a card substantially should use a new filename to avoid stale social-platform caches.

`npm run check:site` checks the built pages for complete, nonduplicated metadata, absolute production URLs, matching Open Graph/Twitter images, and existing 1200 × 630 PNGs. Link previews may be cached or cropped differently by each service.

## Lucide notice

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
