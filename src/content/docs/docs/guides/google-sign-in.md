---
title: Add Google sign-in
description: Create a Google sign-in connection for your own Boopity website and test the right account.
---

Google sign-in is optional. Email codes keep working when you enable it, and clients still need an invitation to join.

You’ll create a connection in Google Cloud, then copy two values into **Settings → Google sign-in**. The same fields are available in the setup wizard.

## Get your website’s two addresses

Select **Enable Google sign-in** in Boopity. Copy the **Authorized JavaScript origin** and **Authorized redirect URI** shown on the page.

For a website at `https://care.example.com`, they would be:

| Google field                  | Example                                             |
| ----------------------------- | --------------------------------------------------- |
| Authorized JavaScript origins | `https://care.example.com`                          |
| Authorized redirect URIs      | `https://care.example.com/api/auth/callback/google` |

Use the values from **your** installation, not these examples. If Boopity shows the wrong website address, your installer needs to correct `APP_URL` and restart it first.

## Create the Google connection

1. Open [Google Cloud](https://console.cloud.google.com/) and choose or create a project for your business.
2. Open **Google Auth Platform**. Complete its branding and contact details. Choose an external audience if clients outside your Google organization will sign in.
3. Under **Clients**, create a client with application type **Web application**.
4. Add the origin and redirect URI copied from Boopity to their matching fields. Save the client.
5. Copy its client ID and client secret into **Google client ID** and **Google client secret** in Boopity. Save the connection.

Google’s labels and onboarding screens can change; its [web-client instructions](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) cover the current process. If your Google project is in testing, add the accounts you’ll test with. Complete Google’s publishing requirements before offering sign-in to all your clients.

## Test without signing yourself out

Keep your current Boopity session open and use a private browser window:

1. Open your Boopity sign-in page.
2. Choose **Continue with Google**.
3. Select the Google account whose email matches your Boopity owner email.
4. Check that you reach **Bookings**.

A successful Google login proves who you are; it doesn’t give a different email permission to access your installation.

## “redirect_uri_mismatch”

Open the client you created in Google Cloud and compare its redirect URI with Boopity’s displayed value. The protocol, hostname, path, and trailing slash must match exactly. Also check that Boopity contains the client ID for that same Google client.

If you change your website’s domain, update both Boopity’s `APP_URL` and the Google connection. [Google’s redirect requirements](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation) describe the matching rules.

## “This account cannot join this installation”

Try again with your owner email or the email on the client’s invitation. Don’t create another installation to fix an account mismatch.

To use a different owner address, [change your email in Settings](/docs/guides/business-and-account/#change-your-sign-in-email) first. For a client, [update their email and send a new invitation](/docs/guides/client-portal/#change-a-clients-sign-in-email).

## Turn Google sign-in off

Clear **Enable Google sign-in** and save. You can still sign in with an email code. If the connection is marked as managed by your host, ask your installer to change that configuration instead.
