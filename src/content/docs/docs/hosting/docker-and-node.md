---
title: Install with Docker or Node
description: Run Boopity with persistent storage, the right public address, and a private setup link.
---

This page is for whoever manages the server. For a browser-based installation, follow the [Railway walkthrough](/docs/getting-started/railway/) instead.

## What the host needs

- One always-running Docker container or Node process, with no overlapping replicas during updates.
- Persistent local storage for the database, uploads, and installation keys.
- HTTPS for public access, with the application behind the host’s proxy.
- Outbound access to your email provider and any optional Google or Stripe services.

Static-only hosts, serverless functions, scale-to-zero services, and shared/NFS storage aren’t supported. Use Docker rather than native Node on Windows.

Boopity creates its SQLite database automatically. **There is no database connection string to enter.** PostgreSQL and MySQL aren’t available database options.

## Docker: use the published image

Download and extract `boopity-1.0.2-source.tar.gz` from the [release downloads](https://github.com/artwork-not-final/boopity/releases/tag/v1.0.2). The archive includes `compose.image.yaml`; you don’t need Node installed on the host.

In that folder, create a `.env` file containing:

```dotenv
BOOPITY_IMAGE=ghcr.io/artwork-not-final/boopity:1.0.2
APP_URL=http://localhost:3000
```

Then run with Docker Compose v2:

```sh
docker compose -f compose.image.yaml up -d
docker compose -f compose.image.yaml logs boopity
```

Open the private **Finish setup** link in the startup output. On macOS or Linux, `sh scripts/start-docker.sh --image` starts the same configuration and can open the browser for you.

The named `boopity-data` volume is mounted at `/data`. Keep it when replacing the container. Keep using the same Compose folder/project name too: changing projects can create a different empty volume.

The supplied configuration binds to `127.0.0.1:3000`, suitable for local use or a proxy on the same host. Keep its non-root user, read-only application filesystem, and other security settings. Do not expose the Docker socket or run the container privileged.

## Node: build from the release source

Use Node **24.21.0**, matching the release’s `.nvmrc`. From the extracted source folder:

```sh
npm ci
npm run build
npm start
```

The local defaults are `http://localhost:3000` and a `.boopity` data directory. Open **Finish setup** from the terminal. Keep the process running while using the site; on a server, use a process supervisor.

For custom settings, copy `.env.self-hosted.example` to `.env.self-hosted` and edit it before starting. A hosted Node installation might use:

```dotenv
APP_URL=https://care.example.com
HOST=127.0.0.1
PORT=3000
DATA_DIR=/var/lib/boopity
```

Create that data directory for the dedicated application user with private permissions. `.env.self-hosted` is a Node configuration file; Docker Compose does not read it automatically.

## Put a hosted installation behind HTTPS

Set `APP_URL` to the exact public origin, for example `https://care.example.com`, with no path or query. Restart after changing it. Don’t leave it as localhost on a public installation.

Have the proxy forward to Boopity’s private port, preserve the public host, and replace forwarded client-address headers rather than trusting values supplied by visitors. Set `TRUSTED_PROXY_IPS` only to the actual trusted proxy’s socket-peer IP. Multi-proxy or CDN setups need their own trust configuration; copying `127.0.0.1` into a Docker deployment is not a general solution.

Use the hosting platform’s HTTPS/domain controls or your server’s existing reverse proxy. Boopity doesn’t obtain a certificate itself. Check the public `/api/health` endpoint, sign-in cookies, email codes, and any enabled Google callbacks or Stripe webhooks before admitting clients.

## Where private data lives

`DATA_DIR` contains the database, uploads, generated `auth-secret`, and `settings-key` used to protect saved provider credentials. Preserve the whole directory. Never publish it or put it in source control.

The Railway template uses `/data/boopity` inside its persistent `/data` volume. The supplied Docker Compose file uses `/data`. Native Node defaults to `.boopity`.

Configure email and optional Google/Stripe connections in the setup UI. Don’t put private keys in variables starting with `VITE_`: those can become public browser code.

**Next:** [Set up the business](/docs/getting-started/setup/), then arrange [backups](/docs/help/backups-and-updates/).
