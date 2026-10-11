---
title: Recover setup or owner access
description: Replace an expired setup link, repair email delivery, or recover an owner who has lost their inbox.
---

Try the [sign-in and setup checks](/docs/help/troubleshooting/) first. The commands here are for the person with access to the running server, not a client trying to sign in.

Run them against the existing installation’s data and configuration. Starting in a new folder or with an empty volume won’t recover the original business.

## Setup isn’t finished

Return in the same browser. If an email-code option is available, use it to continue. Once the owner has been verified, try the normal sign-in page instead.

To replace a private setup link from the server:

**Node**, from the installation folder:

```sh
npm run setup
```

**Docker with the published-image Compose file:**

```sh
docker compose -f compose.image.yaml exec boopity node dist/server/manage.mjs setup-link
```

**A hosting dashboard with a service shell**, from `/app`:

```sh
node dist/server/manage.mjs setup-link
```

Open the new **Finish setup** link. It works once and expires after 30 minutes. Replacing it ends earlier setup links and sessions, but keeps saved details.

If you started a local source build with `scripts/start-docker.sh`, rerun that script instead. If using `compose.yaml` directly, omit `-f compose.image.yaml` from Docker commands.

## Email is broken and the owner can’t sign in

On an installation that already has an owner, generate a temporary recovery token:

```sh
# Node
npm run manage -- recovery-token
```

```sh
# Published-image Docker Compose
docker compose -f compose.image.yaml exec boopity node dist/server/manage.mjs recovery-token
```

In a hosted service shell, use `node dist/server/manage.mjs recovery-token`.

Open `/setup/recovery` on your own website and enter the token privately. It expires after 30 minutes. Recovery opens a limited settings session so you can repair email delivery; it does **not** sign you in as the owner or reveal business records.

Fix and test the [email connection](/docs/guides/email/), then use the normal sign-in page to request a fresh code.

## The owner has lost access to their inbox

If both inboxes still work, use [Settings → Your account](/docs/guides/business-and-account/#change-your-sign-in-email) instead.

Otherwise, the person controlling the host can replace the owner address. First confirm the replacement address belongs to the owner, and repair email delivery if necessary. Substitute their real address for the example:

```sh
# Node
npm run manage -- set-owner-email replacement@example.com
```

```sh
# Published-image Docker Compose
docker compose -f compose.image.yaml exec boopity node dist/server/manage.mjs set-owner-email replacement@example.com
```

In a hosted shell, use `node dist/server/manage.mjs set-owner-email replacement@example.com`.

This preserves the business records, ends existing sessions, removes the old Google connection, and requires the replacement inbox to be verified. Open your site’s setup page, verify the new inbox, and finish setup again with the saved business details. The command refuses an address already attached to a conflicting account.

## Keep recovery private

Don’t paste setup links, tokens, credentials, database files, or complete startup logs into support messages. Use only your own website’s recovery page. If someone else hosts the installation, ask them to perform the relevant step above—there is no central Boopity account that can reset it for you.
