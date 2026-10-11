---
title: Backups and updates
description: Keep your business records safe and plan application updates.
---

Boopity doesn’t make automatic backups or install updates for you. Decide who will handle both before entering real client records.

For a small business, a daily backup is a useful starting point. Keep a separate copy off the hosting account too, so losing that account doesn’t also mean losing every backup.

## Backups on Railway

Open the Boopity service’s **Backups** tab in Railway. Create a backup and set a recurring schedule; deploying the template doesn’t turn this on automatically. Check that subsequent backups appear and review the storage cost.

Railway offers daily, weekly, and monthly schedules. A restore is limited to the same project and environment, and replacing the mounted volume requires deploying the staged change. Wiping a volume removes its backups too. Review [Railway’s backup instructions](https://docs.railway.com/volumes/backups) before restoring.

Dashboard snapshots are useful, but keep a separately recoverable copy of the full data and any host-managed secrets. Ask whoever manages your host to test recovery and arrange an encrypted off-host copy.

## What to keep

- The **whole data directory**: database, uploads, and installation keys.
- A separate secure copy of any secrets stored in your hosting settings.
- Your application version and hosting configuration.

If you or your installer copy files directly, stop the application first. [Complete backup and restore commands](/docs/hosting/backup-and-restore/) are available here for Docker and Node.

Test a restore before you need one. Being able to download a file is not the same as knowing it will reopen with your records, uploads, and keys intact.

## Before an update

1. Read the [release notes](https://github.com/artwork-not-final/boopity/releases) and keep the version you currently run.
2. Make and verify a complete backup.
3. Follow the upgrade instructions, keeping the existing data directory or Docker volume.
4. Check sign-in, branding, clients, bookings, email, and payments afterward.

## Update a published Docker image

After making the backup, change `BOOPITY_IMAGE` in your Compose `.env` file to the new release tag or digest from the release notes. From that same Compose project folder:

```sh
docker compose -f compose.image.yaml pull
docker compose -f compose.image.yaml stop boopity
docker compose -f compose.image.yaml up -d
```

This replaces the application container while keeping its named volume. Don’t change the project name or volume mapping. The startup process applies required database changes; watch the logs for errors.

If you build from source with `compose.yaml`, use the new release’s source and build a replacement image instead of pulling. For native Node, stop the process, install and build the new release, then restart with the same `DATA_DIR` and configuration.

## Update Railway

The template is pinned to a release. Installing it does not subscribe your business to automatic Boopity updates.

After a verified backup, change the service’s source image to the published tag or digest named in the new release notes and deploy it. Keep its existing volume, variables, and public domain. Use one running instance with no overlapping old and new processes writing to the volume.

If the release notes call for extra steps, follow those before reopening bookings.

:::caution[Do not delete your data volume]
Deleting the volume removes your records and keys. Do not use `docker compose down --volumes` when updating.
:::

## If an update fails

Stop and keep the failed installation’s data for investigation. Don’t run an older application image against the newly upgraded database.

A rollback needs the **old image and its matching full backup**. Before reopening payments, account for any money collected or refunded since that backup. Ask your installer to use the [restore checks](/docs/hosting/backup-and-restore/#before-trusting-a-restored-installation).
