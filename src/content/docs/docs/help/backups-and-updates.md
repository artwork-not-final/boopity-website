---
title: Backups and updates
description: Keep your business records safe and plan application updates.
---

Your records live in your installation, not on a central Boopity service. Decide who will look after backups before relying on it for your business.

## What to keep

A backup needs the **whole installation data directory**: the database, uploaded files, and encryption and authentication keys. Secrets supplied through your host’s settings need their own secure backup too.

Copying just the database while Boopity is running is not a reliable backup. Your installer should stop all application writers before taking a file-level copy, then check that it can be restored into a separate, isolated installation.

Keep a protected copy away from the running host. Backups contain private client information and credentials; don’t upload them to a public repository or support message.

## Before an update

1. Read the release notes for the version you plan to install.
2. Make and verify a complete backup.
3. Record the current application version and hosting configuration without exposing secrets.
4. Follow the upgrade instructions and keep the existing data directory or Docker volume.
5. Check sign-in, bookings, and any email or payment integrations afterward.

An application update and a data backup are different things. Downloading a newer image does not back up your business records.

:::caution[Do not delete your data volume]
Replacing a Docker container can preserve your records. Deleting its data volume removes the installation’s records and keys. Avoid commands such as `docker compose down --volumes` unless you deliberately want to erase that installation and have a verified backup.
:::

## Instructions for your installer

Use the [operations guide](https://github.com/artwork-not-final/boopity/blob/v1.0.1/docs/guides/operations.md) for backup, restore, and upgrade steps. A host’s automatic snapshots may help, but they do not replace checking that your particular installation can be recovered.
