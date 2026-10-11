---
title: Connect your email service
description: Set up Resend or SMTP, test sign-in codes, and find out why a message hasn’t arrived.
---

Boopity needs an email service to send sign-in codes. Connect it during setup or under **Settings → Email delivery**.

There are two different addresses involved:

- **Your email** is the inbox you use to sign in. A personal Gmail address is fine.
- **Sender email** is the address Boopity sends messages _from_. Your email service must approve it. Connecting it doesn’t create an inbox.

Choose one of the options below. You don’t need both.

## Connect Resend

You’ll need a domain you own, such as `example.com`.

1. In Resend, open **Domains** and add your domain. Resend gives you DNS records to add where you manage the domain. Keep existing records for your usual inbox; don’t replace them with these. Wait until Resend shows the domain as verified. [Resend’s domain instructions](https://resend.com/docs/dashboard/domains/introduction) explain the records.
2. Open **API Keys** and create a key with **Sending access**, restricted to that domain. Copy the key when it appears; Resend won’t show it again. [Resend’s key instructions](https://resend.com/docs/dashboard/api-keys/introduction).
3. In Boopity, choose **Resend**. Enter a **Sender email** on the verified domain, such as `hello@example.com`, and paste the key into **Resend API key**.
4. Select **Save and continue** in setup, or **Save changes** in Settings.

Keep the key private. It belongs in your own Boopity settings, not in a support message or screenshot.

## Connect SMTP

Use the outgoing-mail settings supplied by your email provider. Check that it permits automated messages, not just mail sent from its own app.

| Boopity field       | What to enter                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Sender email        | An address your provider allows you to send from                                                  |
| SMTP host           | The server name, such as `smtp.example.com`, without `https://`                                   |
| Port                | The port from your provider, commonly `587` or `465`                                              |
| Connection security | Usually **STARTTLS** for port `587`, or **Direct TLS** for `465`; follow your provider’s settings |
| SMTP username       | The username supplied by your provider, often an email address                                    |
| SMTP password       | Its SMTP password or app password—not necessarily your normal inbox password                      |

Select **Save and continue** or **Save changes**. Boopity uses username-and-password SMTP; it doesn’t offer an OAuth “connect mailbox” flow.

## Check that it works

During setup, continue to **Verify your inbox** and request a sign-in code. Enter it to finish creating your owner account.

In Settings, use **Test email delivery**. Keep your current browser signed in until the test succeeds so you don’t lock yourself out while changing providers.

Saving a connection alone doesn’t prove it can deliver mail. You should receive and verify a code before relying on it.

## If a code doesn’t arrive

1. Check the sign-in address for a typo, then check spam and junk folders.
2. Look at your email provider’s delivery log. A rejected sender usually means the domain or sender address isn’t verified. A limit or billing error needs attention in the provider’s account.
3. Wait for Boopity’s resend countdown, then request one new code. Codes expire after five minutes; a new request replaces the old code.
4. For SMTP, recheck the host, port, security, and password together. If the connection times out, ask your hosting provider whether it blocks outbound SMTP. Don’t turn off encryption to work around it.

“Too many code requests or attempts” is temporary. Wait for the retry time shown rather than repeatedly requesting codes.

## Change or replace credentials

An empty key or password field can mean the existing secret is saved, not missing. Check the saved-credentials indicator. Leave the field blank to keep it, or enter the replacement and save.

If the page says email is managed by your host, change those values in the hosting configuration instead. If you can no longer sign in at all, [recover access](/docs/hosting/recover-access/).
