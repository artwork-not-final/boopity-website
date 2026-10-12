# Publishing the Boopity website

This deploys the marketing website, not the Boopity application. No application database, email keys, payment keys, or authentication secrets belong here.

## Validate locally

Use the Node version in `.nvmrc`, then run:

```sh
npm ci --ignore-scripts
npm run verify
npm run preview:cloudflare
```

Open `http://127.0.0.1:4326`. The last command serves the built `dist/` files through Cloudflare's local runtime; it does not publish them. Stop it with Ctrl+C. Rebuild after changing the site.

Check the home page, `/tour/`, `/docs/`, a nested guide, and documentation search. `/tour` should redirect to `/tour/`; an unknown URL should show the 404 page with HTTP status 404. Check that screenshots load and links work at desktop and mobile sizes.

## Connect Cloudflare after PR approval

In Cloudflare's **Workers & Pages**, create an application and import `artwork-not-final/boopity-website` from GitHub. Limit repository access to this repository when possible.

Use these settings:

| Setting           | Value                                          |
| ----------------- | ---------------------------------------------- |
| Worker name       | `boopity-website` (must match `wrangler.json`) |
| Production branch | `main`                                         |
| Root directory    | Repository root                                |
| Build command     | `npm run verify`                               |
| Deploy command    | `npx wrangler deploy`                          |
| Preview command   | `npx wrangler preview`                         |
| Node version      | `24.21.0`, as pinned in `.nvmrc`               |

Enable branch previews. Set the build variables `ASTRO_TELEMETRY_DISABLED=1` and `WRANGLER_SEND_METRICS=false`. Wrangler is pinned in `package.json` and the lockfile. Cloudflare's Git integration manages deployment authentication; do not add credentials to Git or the public site.

Keep the empty `previews` block in `wrangler.json`: [`wrangler preview` requires it](https://developers.cloudflare.com/workers/previews/configuration/#wrangler-configuration-file). Static assets stay at the top level. This website has no production or preview data bindings or application secrets.

The first deploy publishes to the assigned `workers.dev` address. It does not move `boopity.com`. Verify the deployed site before connecting a custom domain, including HTTPS, headers, redirects, the 404 response, images, and documentation search. Preview links should not be treated as private; restrict access or prevent search indexing before sharing them widely.

GitHub CI validates pull requests without deployment credentials. Once connected, Cloudflare runs the same validation before deploying `main`, and uses the preview command for other enabled branches.

## Connect the production domain

Only after preview approval, inspect existing DNS records and Worker routes for `boopity.com` and `www.boopity.com`. Replace only the entries intended for the marketing website. Leave email records and application subdomains unchanged.

Attach `boopity.com` as the Worker's custom domain. Configure `www.boopity.com` to redirect to `https://boopity.com`, preserving the path and query string. Confirm certificates are active and test both names before announcing publication.

### Current www redirect

Cloudflare manages this separately from the static website deployment:

- Proxied `A` record: `www` → `192.0.2.1`, Cloudflare's placeholder for an originless redirect. This is not an application server.
- Single Redirect named **Boopity website — www to canonical**.
- Match: `(http.host eq "www.boopity.com")`.
- Dynamic target: `concat("https://boopity.com", http.request.uri.path)`.
- Status: **301**. **Preserve query string** enabled.

The exact hostname match covers HTTP and HTTPS without changing the existing apex HTTPS rule or other subdomains. Keep the DNS record proxied. Verify `/` and `/docs/guides/stripe/?source=share` from both schemes; the resulting URL must keep its path and query on `https://boopity.com`. A local DNS resolver may briefly cache an earlier missing-record response.

See Cloudflare's [www redirect guidance](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/) for the underlying redirect behavior.

To undo only this addition, disable the named www rule and remove only the new www record. Do not change the Worker custom domain, email records, or application subdomains.

The deployment uses trailing-slash URLs to match Astro, a real 404 response instead of a single-page-app fallback, and basic security headers. Only hashed files under `/_astro/` receive a year-long immutable cache policy; HTML and documentation search files use Cloudflare's default revalidation behavior.

## Manual deployment and rollback

For an intentional manual release after authenticating Wrangler:

```sh
npm run deploy
```

This runs the complete verification, rebuilds, and then publishes. To undo a bad release, restore a known-good deployment in Cloudflare and revert the responsible commit through a PR so the next deployment does not reintroduce it.

References: [static Astro deployment](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#if-you-have-a-static-site), [Git builds and previews](https://developers.cloudflare.com/workers/ci-cd/builds/), [build settings](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), and [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
