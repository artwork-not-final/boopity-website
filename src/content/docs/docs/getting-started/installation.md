---
title: Install Boopity
description: Choose a suitable host or try Boopity locally, then open the setup wizard.
---

Run Boopity on your host or try it on your computer. The software is free; hosting, email, and payment-processing fees are separate.

## Install without Terminal

Follow the [Railway walkthrough](/docs/getting-started/railway/) to launch Boopity with persistent storage and an HTTPS address. You’ll still need to connect an email service in the setup wizard. Railway charges for hosting; the guide explains pricing before you deploy.

## Use your own host

- Hosting with Docker or Node, one always-running instance, and persistent local storage.
- An email service for sign-in codes.
- A domain with HTTPS for client access.

Boopity creates its database automatically. You or your installer look after hosting, updates, and [backups](/docs/help/backups-and-updates/).

## Have someone helping with hosting?

Share the [technical installation guide](https://github.com/artwork-not-final/boopity/blob/v1.0.2/docs/guides/self-hosting.md). Ask your installer to connect your domain and HTTPS, then send you the private **Finish setup** link.

## Try it on your own computer

On macOS or Linux, start Docker with Compose installed. This runs Boopity locally, not as a public website.

1. Download `boopity-1.0.2-source.tar.gz` from the [release downloads](https://github.com/artwork-not-final/boopity/releases/tag/v1.0.2).
2. Extract the archive and open Terminal in the extracted folder.
3. Run:

   ```sh
   sh scripts/start-docker.sh
   ```

4. Your browser should open setup. If it doesn’t, open **Finish setup** from the terminal output.

Keep Docker running while using Boopity. Your records are saved in its data volume—don’t delete that volume when updating.

For Windows, prebuilt images, or Node, see the [technical guide](https://github.com/artwork-not-final/boopity/blob/v1.0.2/docs/guides/self-hosting.md).

:::caution[Keep the setup link private]
Anyone with the link can access setup. If it expires, rerun the start command or ask your installer for a replacement. Saved details stay intact.
:::

**Next:** [Set up your business](/docs/getting-started/setup/).
