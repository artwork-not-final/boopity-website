---
title: Backups and updates
description: Keep your business records safe and plan application updates.
---

Agree with your installer who will manage backups and updates.

## What to keep

- The **whole data directory**: database, uploads, and installation keys.
- A separate secure copy of any secrets stored in your hosting settings.
- Your application version and hosting configuration.

Stop all application writers before copying files. Test the restore in a separate, isolated installation. Keep an encrypted copy off the host; backups contain private client information and credentials.

## Before an update

1. Read the release notes.
2. Make and verify a complete backup.
3. Follow the upgrade instructions, keeping the existing data directory or Docker volume.
4. Check sign-in, bookings, email, and payments afterward.

:::caution[Do not delete your data volume]
Deleting the volume removes your records and keys. Do not use `docker compose down --volumes` when updating.
:::

Your installer can follow the [backup, restore, and upgrade instructions](https://github.com/artwork-not-final/boopity/blob/v1.0.1/docs/guides/operations.md).
