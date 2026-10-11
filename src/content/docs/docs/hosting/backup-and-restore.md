---
title: Back up and restore the data
description: Make a complete stopped backup and check a restore without overwriting the working installation.
---

These instructions are for the person managing the host. If you use Railway’s dashboard backups, start with [Backups and updates](/docs/help/backups-and-updates/#backups-on-railway).

## Before copying anything

Stop every process that can write to the installation, including background application processes and management commands. Copy the **whole `DATA_DIR`**, not just the database file: uploads, SQLite sidecar files, `auth-secret`, and `settings-key` belong together.

Also keep the matching image/version, hosting configuration, and any externally managed secrets. Environment variables aren’t included in a volume backup. Without the original keys, saved credentials may be unusable.

The commands below create new, private directories without overwriting previous backups. They produce **unencrypted local copies**. Encrypt them before storing them off the host, and keep the encryption key somewhere independently recoverable.

## Back up native Node

Stop Boopity through its process supervisor, or stop the terminal process if that is how you run it. Confirm that `.boopity` is your actual data directory, then run from the installation folder:

```sh
umask 077
mkdir -p backups
BOOPITY_BACKUP_DIR=$(mktemp -d "$PWD/backups/snapshot.XXXXXX")
cp -a .boopity "$BOOPITY_BACKUP_DIR/data"
```

If you configured a different `DATA_DIR`, replace `.boopity` with that exact path. Check that the copy succeeded and contains the database, uploads, and keys before restarting the original.

## Back up the Docker volume

Run from the existing Compose project folder. These examples use `compose.image.yaml`; if you installed with `compose.yaml`, omit the `-f compose.image.yaml` option consistently.

First identify the running container:

```sh
docker compose -f compose.image.yaml ps
BOOPITY_CONTAINER=$(docker compose -f compose.image.yaml ps -q boopity)
BOOPITY_IMAGE=$(docker inspect --format '{{.Image}}' "$BOOPITY_CONTAINER")
```

Stop if there is no container, more than one match, or an inspection error. Don’t guess a volume or continue with an empty value.

Then stop the application and copy its mounted `/data` directory:

```sh
docker compose -f compose.image.yaml stop boopity
umask 077
mkdir -p backups
BOOPITY_BACKUP_DIR=$(mktemp -d "$PWD/backups/snapshot.XXXXXX")
docker run --rm --network none --volumes-from "$BOOPITY_CONTAINER:ro" \
  --entrypoint tar "$BOOPITY_IMAGE" -C /data -cf - . \
  > "$BOOPITY_BACKUP_DIR/data.tar"
```

Check that the archive command completed successfully and inspect its contents with `tar -tf "$BOOPITY_BACKUP_DIR/data.tar"`. Keep the original stopped if the copy failed. After a successful copy, restart it with:

```sh
docker compose -f compose.image.yaml start boopity
```

The helper container runs `tar`, not Boopity, and has no network access. Docker documents this [volume backup pattern](https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes).

## Check a Docker restore in a separate volume

Use only an archive you trust, and the **same image** that made the backup. The variables below refer to the backup just created; for an older backup, set them to its recorded image and directory first.

Create a unique test-volume name and confirm it is unused:

```sh
BOOPITY_RESTORE_VOLUME="boopity-restore-$(date +%Y%m%d%H%M%S)"
docker volume inspect "$BOOPITY_RESTORE_VOLUME"
```

The expected result is “no such volume.” If it exists, choose another name. Only then create and populate it:

```sh
docker volume create "$BOOPITY_RESTORE_VOLUME"
docker run --rm -i --network none \
  --mount "source=$BOOPITY_RESTORE_VOLUME,target=/data" \
  --entrypoint tar "$BOOPITY_IMAGE" -C /data -xf - \
  < "$BOOPITY_BACKUP_DIR/data.tar"
docker run --rm --network none \
  --mount "source=$BOOPITY_RESTORE_VOLUME,target=/data" \
  "$BOOPITY_IMAGE" node dist/server/manage.mjs status
```

If you use host-managed secrets or a non-default `DATA_DIR`, supply the matching private configuration to the restore check. Never put secret values directly into a command you’ll share. A status command may apply migrations, which is why using the saved image matters.

For native Node, copy the backup’s `data` directory into a new private location and use the matching release with `DATA_DIR` pointing there. Keep that clone isolated from external providers too.

## Before trusting a restored installation

A successful status command is only a first check. In the isolated copy, verify database integrity, the owner and client records, booking counts, branding and logo, readable saved provider settings, and payment history. Have your installer check SQLite’s `quick_check` and `foreign_key_check` as part of this rehearsal.

Don’t expose the copy publicly, send real emails, or forward payment webhooks to both copies. Keep the original data untouched until you’ve accepted the restore.

**Restoring data does not undo payments.** Compare Stripe and manual receipts with the restored history before reopening checkout. Money collected or refunded since the backup still moved, even if the old snapshot has no record of it.
