---
title: When something doesn’t work
description: Help with sign-in codes, missing booking times, invitations, and setup access.
---

## My sign-in code hasn’t arrived

Check the email address and your spam folder. Wait for the resend timer, then request another code and use the newest one.

If nobody receives codes, the owner should check **Settings → Email delivery**, including the sending address and email-service credentials. Your email provider must allow that sending address. Repeated attempts can trigger a temporary limit; wait for the time shown rather than repeatedly resending.

## Google sign-in uses the wrong account

Choose the Google account with the same email address as your owner account or client invitation. Signing in with Google does not automatically create an account in a business’s installation.

If Google reports a redirect-address error, the installer needs to check the exact website address and callback in the [Google configuration instructions](https://github.com/artwork-not-final/boopity/blob/v1.0.1/docs/guides/self-hosting.md).

## There are no booking times

The sitter should check:

- The service is offered in the portal.
- Opening hours are set for the chosen day.
- The visit fits within an opening window.
- The date meets the advance-notice and booking-window rules.
- The day isn’t blocked and the slot isn’t already reserved.

Boopity currently reserves one booking at a time for the business. It does not schedule separate members of staff or multiple boarding spaces. Clients should contact the sitter when they need an exception.

## An invitation no longer works

Ask the sitter for a new link and use the email address they invited. Invitation links expire, work once, and stop working when replaced or revoked.

## I can’t get back into setup

Try the same browser and website address you used before. If you have already verified your owner account, use the normal sign-in page.

For a local Docker installation started with the supplied script, run that script again to obtain a new **Finish setup** link. On a hosted installation, ask the installer for a replacement. **Do not delete the database or data volume to restart setup.**

## I need more help

Boopity is community-supported; a response or fix is not guaranteed. For a reproducible problem, see the [support policy](https://github.com/artwork-not-final/boopity/blob/main/SUPPORT.md).

Include your Boopity version, what you expected, and what happened. Use fictional examples and remove personal details from screenshots. Never post passwords, sign-in codes, setup or invitation links, API keys, or database backups.

Report security concerns privately using the [security policy](https://github.com/artwork-not-final/boopity/security/policy), not a public issue.
