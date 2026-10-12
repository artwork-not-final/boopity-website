---
title: When something doesn’t work
description: Help with sign-in codes, missing booking times, invitations, and setup access.
---

## My sign-in code hasn’t arrived

Check the email address and your spam folder. Wait for the resend timer, then request one new code. Use the newest message; earlier codes stop working when a replacement is sent.

If nobody receives codes, follow the [email delivery checks](/docs/guides/email/#if-a-code-doesnt-arrive). If you’re rate-limited, wait for the time shown before trying again. If the owner is completely locked out, the host can [repair email through recovery](/docs/hosting/recover-access/#email-is-broken-and-the-owner-cant-sign-in).

## Google sign-in uses the wrong account

Choose the Google account matching your Boopity email or client invitation.

For **redirect_uri_mismatch**, compare the addresses in Google Cloud with the exact values shown in Boopity. [Google sign-in help](/docs/guides/google-sign-in/#redirect_uri_mismatch) walks through the fix.

## There are no booking times

The sitter should check:

- The service is offered in the portal.
- Opening hours are set for the chosen day.
- The visit fits within an opening window.
- The date meets the advance-notice and booking-window rules.
- The day isn’t blocked and the slot isn’t already reserved.

Boopity supports one booking at a time, not separate staff schedules or multiple boarding spaces. Clients should contact the sitter for exceptions. [Booking hours & rules](/docs/guides/booking-rules/) explains each setting.

## A client can’t see a service

Open the service and check **Offer in the client portal**. New services start hidden from clients. Also check that the service, client, and their pets are active, and that the portal is enabled.

## An invitation no longer works

Invitations expire after seven days and work once. If the client already accepted it, use the normal sign-in page instead.

Otherwise, the sitter can open **Clients & pets → the client → Portal access**, create a replacement, and send it privately. Check the saved client email first. [Invitation help](/docs/guides/client-portal/) covers access changes and disabled buttons.

## I can’t get back into setup

Return in the same browser. If an email-code option is offered, use it. If you’ve verified your owner account, try the normal sign-in page.

On a local Docker installation, rerun the start script from the original folder. On Railway, if a link expired before setup began, restart the deployment and open the new **Finish setup** link from its logs. If setup was already in progress, use [the replacement-link instructions](/docs/hosting/recover-access/#setup-isnt-finished).

**Don’t delete your data to restart setup.** A new link preserves saved details.

## A payment is still processing

Open the booking’s **Payments** tab and select **Refresh payments** or **Reconcile with provider**. Check the result in Stripe too. Bank payments can take time to settle; returning to Boopity from checkout doesn’t prove payment succeeded.

Don’t add a manual payment or start another charge to make the pending status disappear. [Payment help](/docs/guides/payments/) explains uncertain outcomes and refunds.

## The page says “Failed to fetch”

Check your internet connection and whether the installation is still running. If it’s local, Docker or the Node process must be running. If it’s hosted, check the hosting dashboard for a stopped service or failed deployment.

Reload once the service is available. If you were submitting a booking or payment when the connection dropped, check whether it was saved before submitting it again.

## My records disappeared after restarting

Stop before completing a new setup. The application may be pointing at an empty data directory or a new Docker volume rather than the original one.

Ask the host administrator to check `DATA_DIR`, the mounted volume, and the Compose project name against the previous configuration. [Storage locations](/docs/hosting/docker-and-node/#where-private-data-lives) and [backup recovery](/docs/hosting/backup-and-restore/) can help. Don’t delete either copy while investigating.

## I need more help

See [how to get help](/about/#support). Include your version, what you tried, and what happened. Remove client details, credentials, private links, and codes from anything you share. Never share database backups publicly.
