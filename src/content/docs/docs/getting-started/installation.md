---
title: Install Boopity
description: Choose a suitable host or try Boopity locally, then open the setup wizard.
---

Boopity runs on your own hosting account or computer. The software is free to use; your host, email service, and payment processor may charge separately.

## What you’ll need

- A host that supports Docker or Node, one always-running instance, and persistent local storage.
- An email service to deliver sign-in codes. You’ll connect it in the setup wizard.
- A domain with HTTPS before you invite clients to a hosted installation.

There is **no database connection string**. Boopity creates its SQLite database automatically. Its database, uploaded files, and private keys must stay together on persistent storage.

## Have someone helping with hosting?

Share the [technical installation guide](https://github.com/artwork-not-final/boopity/blob/v1.0.1/docs/guides/self-hosting.md) with them. Ask them to install the tagged release, connect HTTPS, and give you the private **Finish setup** link. That link opens the wizard; you don’t need to create a setup password.

They should use one running instance, mount persistent storage at `/data` for Docker, and set `APP_URL` to your exact HTTPS website address. Temporary storage and hosts that stop the application when idle are not suitable.

## Try it on your own computer

These steps are for macOS or Linux with Docker and Docker Compose already installed and running. They start a local installation, not a public website.

1. Download `boopity-1.0.1-source.tar.gz` from the [Boopity 1.0.1 release](https://github.com/artwork-not-final/boopity/releases/tag/v1.0.1).
2. Extract the archive and open Terminal in the extracted folder.
3. Run:

   ```sh
   sh scripts/start-docker.sh
   ```

4. Wait for the app to start. Your browser should open the private setup link. If it doesn’t, use **Finish setup** in the terminal output.

The supplied Compose configuration keeps the installation in a persistent Docker volume and only exposes the app on your computer. Keep Docker running while using it. Don’t delete the volume when replacing the container.

For Windows, prebuilt images, or Node without Docker, use the [additional installation instructions](https://github.com/artwork-not-final/boopity/blob/v1.0.1/docs/guides/self-hosting.md).

:::caution[Keep the setup link private]
It grants initial setup access. Don’t put it in a screenshot, public issue, or support message. If it expires, rerun the local start command or ask your installer for a replacement. Your saved details remain.
:::

## Next: make it yours

Once the wizard opens, [set up your business](/docs/getting-started/setup/).
