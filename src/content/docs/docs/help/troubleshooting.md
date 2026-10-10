---
title: When something doesn’t work
description: Help with sign-in codes, missing booking times, invitations, and setup access.
---

## My sign-in code hasn’t arrived

Check the email address and your spam folder. Wait for the resend timer, then request another code and use the newest one.

If nobody receives codes, check your approved sending address and provider credentials in **Settings → Email delivery**. If you’re rate-limited, wait for the time shown before trying again.

## Google sign-in uses the wrong account

Choose the Google account matching your Boopity email or client invitation.

For a redirect-address error, ask your installer to check the [Google configuration](https://github.com/artwork-not-final/boopity/blob/v1.0.1/docs/guides/self-hosting.md).

## There are no booking times

The sitter should check:

- The service is offered in the portal.
- Opening hours are set for the chosen day.
- The visit fits within an opening window.
- The date meets the advance-notice and booking-window rules.
- The day isn’t blocked and the slot isn’t already reserved.

Boopity supports one booking at a time, not separate staff schedules or multiple boarding spaces. Clients should contact the sitter for exceptions.

## An invitation no longer works

Ask the sitter for a new link and use the invited email address.

## I can’t get back into setup

Return in the same browser. If you’ve verified your owner account, try the normal sign-in page.

Otherwise, rerun the local Docker start script or ask your installer for a new **Finish setup** link. **Don’t delete your data to restart setup.**

## I need more help

See [how to get help](/about/#support). Include your version, what you tried, and what happened. Remove client details, credentials, private links, and codes from anything you share. Never share database backups publicly.
