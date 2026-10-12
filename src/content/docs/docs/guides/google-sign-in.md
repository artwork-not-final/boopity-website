---
title: Add Google sign-in
description: Set up Google sign-in for Boopity, including the Google project, consent screen, website addresses, credentials, and first sign-in test.
---

Google sign-in adds **Continue with Google** to your Boopity sign-in page. Email codes keep working, and clients still need an invitation to join.

You’ll do most of this in Google Cloud, then copy two values into Boopity. There’s no code to write, and you won’t be moving your website to Google.

## Before you start

- Have Boopity running at the website address you plan to keep, with `https://` working.
- Know the email address you use to sign in to Boopity. Your first Google sign-in test must use that same address.
- Use a Google account you’ll keep access to for managing the connection. It can be a Gmail or Google Workspace account.
- Keep your current Boopity session open while you work. You’ll test in a separate private window later.

If you’re still setting up Boopity and would rather do this later, choose **Continue without Google**. You can return through **Settings → Google sign-in**.

## Get your website’s two addresses

1. In Boopity, open **Google sign-in** in setup or Settings.
2. Select **Enable Google sign-in** to show the connection fields.
3. Find **Authorized JavaScript origin** and **Authorized redirect URI**. Keep this tab open so you can copy them into Google shortly. Don’t save an incomplete connection yet.

For a Boopity website at `https://care.example.com`, the two addresses would be:

| Google field                  | Example                                             |
| ----------------------------- | --------------------------------------------------- |
| Authorized JavaScript origins | `https://care.example.com`                          |
| Authorized redirect URIs      | `https://care.example.com/api/auth/callback/google` |

Use the values from **your installation**, not these examples. The origin is just your website address. The redirect URI includes `/api/auth/callback/google`—it’s where Google sends you back after sign-in.

If Boopity shows the wrong address, correct the installation’s `APP_URL` in your hosting settings and restart it first, or ask your installer to do that. Changing only the Google fields won’t fix an incorrect Boopity address.

## Create a Google project

If you already have a project specifically for this installation, select it and skip to the next section.

1. Sign in to [Google Cloud](https://console.cloud.google.com/).
2. Open [Manage resources](https://console.cloud.google.com/cloud-resource-manager) and choose **Create project**.
3. For the project name, use something recognizable, such as `Maple Paws sign-in`. You can leave the generated project ID as it is.
4. If Google asks for an organization or parent, choose your business organization. For a personal account, choose **No organization** if offered.
5. Select **Create**. When it finishes, use the project selector at the top of the console to select your new project.

The project is where Google keeps this connection’s settings. If your work account won’t let you create one, ask its administrator for access. [Google’s project instructions](https://docs.cloud.google.com/resource-manager/docs/creating-managing-projects).

## Set up the Google sign-in screen

In Google Cloud’s search box, search for **Google Auth Platform** and open it. Check the project name at the top before changing anything.

For a new project, select **Get started** and work through these sections:

| Section             | What to enter                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| App information     | Use your business name, such as `Maple Paws`. Choose a support email you check from the dropdown. |
| Audience            | Choose **External**, so clients outside your Google organization can sign in.                     |
| Contact information | Enter an email where Google can reach you about this connection.                                  |
| Finish              | Read Google’s policy, accept it if you agree, then continue and create the configuration.         |

Choose **Next** between sections. If you already see **Branding**, **Audience**, and **Clients** in the menu, the initial configuration exists; review those pages instead of starting over.

The support-email dropdown doesn’t accept just any address. Your signed-in Google address is normally available; a Google Group you manage may be available too. [Google’s account and audience setup](https://support.google.com/cloud/answer/15544987?hl=en).

Choosing External does **not** open your Boopity installation to strangers. Boopity still checks whether the email belongs to you or an invited client.

## Check the requested information

Open **Data Access** in Google Auth Platform, then **Add or Remove Scopes**. A scope is simply a permission Google asks the person to approve.

For Boopity, select only these basic sign-in permissions:

| Scope                                              | What Boopity needs it for                                |
| -------------------------------------------------- | -------------------------------------------------------- |
| `openid`                                           | Confirm the person’s Google identity                     |
| `https://www.googleapis.com/auth/userinfo.email`   | Match their email to their Boopity account or invitation |
| `https://www.googleapis.com/auth/userinfo.profile` | Basic profile information, such as their name            |

Use the search in the scope selector to find them, select them, then choose **Update** and **Save**. If they’re already selected, leave them in place. [Google’s scope settings](https://support.google.com/cloud/answer/15549135?hl=en).

If one isn’t listed, use **Manually add scopes** and enter its exact value from the table. Don’t select a similarly named Gmail or Calendar permission instead.

Boopity doesn’t need access to Gmail messages, Drive files, or Calendar. You don’t need to enable those APIs. Use a separate project if an existing one has unrelated permissions you need for another application.

## Create the website connection

Google calls this an “OAuth client.” It’s the connection for your website, not one of your pet-sitting clients.

1. In Google Auth Platform, open **Clients** and select **Create client**.
2. Choose **Web application** for the application type—even if you installed Boopity with Docker.
3. Name the connection `Boopity website`. This label helps you find it in Google Cloud.
4. Under **Authorized JavaScript origins**, select **Add URI**. Paste Boopity’s **Authorized JavaScript origin**.
5. Under **Authorized redirect URIs**, select **Add URI**. Paste Boopity’s **Authorized redirect URI**, including the callback path.
6. Select **Create**.

If Google asks you to register an authorized domain first, [add your business domain under Branding](#add-your-businesss-website-details), then return to this form.

Copy the client ID and client secret from the result. Save the secret in your password manager before closing the window; Google only shows the full secret when it’s created. Keep it out of screenshots and support messages. [Google’s explanation of saved secrets](https://developers.googleblog.com/usability-and-safety-updates-to-google-auth-platform/).

Don’t use a Google API key, project ID, or your Google password. The client ID normally ends in `.apps.googleusercontent.com`; the client secret is a separate value.

## Save the connection in Boopity

Return to the Boopity tab you left open:

1. Check that **Enable Google sign-in** is selected.
2. Paste the client ID into **Google client ID**.
3. Paste the matching secret into **Google client secret**, without quotation marks or surrounding spaces.
4. Select **Save and continue** in setup, or **Save changes** in Settings.

If you’re in the wizard, finish **Review & finish** before testing sign-in. If you return to Settings later, a blank secret field can mean the existing secret is saved. Leave it blank to keep that secret.

## Test without signing yourself out

Open a private or incognito browser window while keeping your existing Boopity session open:

1. Go to your Boopity website and open the sign-in page.
2. Choose **Continue with Google**.
3. Select the Google account whose email matches your Boopity owner email. If the wrong account is shown, choose another account.
4. Complete Google’s sign-in prompts.
5. Check that you return to **Bookings** in your sitter workspace.

For a client, the Google email must match the invitation. They should follow their invitation first; after joining, they should reach **My bookings**, not your sitter workspace.

### Do I need to add test users?

With only the three basic permissions above, Google makes an exception to its usual testing restrictions: people don’t have to be listed as test users, and the usual seven-day authorization expiry doesn’t apply. [Google’s testing rules](https://support.google.com/cloud/answer/15549945?hl=en).

If you need to manage a test-user list, open **Audience → Test users → Add users**, enter the Google email addresses you’ll test, then save. Boopity doesn’t need broader permissions just to sign people in.

## Prepare Google sign-in for clients

Before offering it to clients, finish the public-facing details in Google Cloud. This is separate from successfully testing your own account.

### Add your business’s website details

Open **Branding**. Enter your business homepage, privacy-policy link, and terms-of-service link. These should be real pages for **your business**, not Boopity’s marketing website. The homepage should explain your service and link to the privacy policy; a sign-in page alone isn’t enough for Google’s branding review.

Under **Authorized domains**, add the main domain you control. For `care.example.com`, that’s `example.com`, without `https://` or a page path. Add any other domains used by your public links. Save the changes.

Google requires these public links for external production apps and may ask you to verify domain ownership. It also reviews branding before showing your chosen app name or logo. [Google’s branding requirements](https://support.google.com/cloud/answer/15549049?hl=en).

If you’re still using only a hosting address, such as a Railway-provided address, don’t claim the hosting company’s domain as your own. You can keep email-code sign-in available while you arrange your own domain and business pages. Boopity doesn’t create those policy pages for you.

### If Google asks you to verify the domain

1. Open [Google Search Console](https://search.google.com/search-console/) using the same Google account that manages your project.
2. Choose **Add property**, then **Domain**. Enter your main domain, such as `example.com`, and continue.
3. Copy the TXT verification record Google provides.
4. In your domain’s DNS dashboard, add a TXT record at the root: use `@` or a blank name, as your DNS provider requires. Paste Google’s full verification value and save. Leave existing records untouched.
5. Return to Search Console and select **Verify**. If it hasn’t appeared yet, allow time for DNS to update and try again.

Keep that record after verification succeeds. If Google offers an automatic connection to your DNS provider, you can follow that instead. Then return to Google Auth Platform to continue the review. [Google’s domain verification instructions](https://support.google.com/webmasters/answer/9008080?hl=en#domain_name_verification).

### Publish the connection

1. Open **Audience** in Google Auth Platform.
2. Under **Publishing status**, select **Publish app** and confirm when you’re ready to offer it to clients. If it already says **In production**, this step is done.
3. Open **Verification Center** and complete any checks Google requests. Publishing and verification are separate; selecting Publish doesn’t mean every review has passed.
4. Test again with your owner account, then an invited client account before relying on it.

Google’s [audience and publishing guide](https://support.google.com/cloud/answer/15549945?hl=en) explains the difference. Don’t ask clients to bypass an unverified-app warning; check the project’s permissions and verification status instead.

## If something doesn’t work

### “redirect_uri_mismatch”

1. Open **Google Auth Platform → Clients** and select `Boopity website`.
2. Compare its redirect URI with the one displayed in Boopity.
3. Check `https://`, the hostname, any port, and the complete `/api/auth/callback/google` path. Don’t add a slash after `google`.
4. Save any correction. Check that Boopity’s client ID belongs to this same Google client.

The addresses must match exactly; `www.example.com` and `example.com` aren’t interchangeable. Google changes can also take time to apply. [Google’s redirect rules](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation).

### “This account cannot join this installation”

Google recognized the account, but Boopity didn’t recognize its email as an allowed user. Try again with your owner email or the email on the client’s invitation. Don’t create another installation to fix this.

To use a different owner address, [change your email in Settings](/docs/guides/business-and-account/#change-your-sign-in-email) first. For a client, [update their email and send a new invitation](/docs/guides/client-portal/#change-a-clients-sign-in-email).

### Google says access is blocked or the app is internal

Check **Audience**. An Internal connection is limited to its Google organization; use External for clients outside it. A client’s workplace can also restrict third-party sign-in. In that case, they should ask their administrator or use Boopity’s email-code option.

### The client ID or secret is rejected

Check that you copied both values from the same **Web application** client. A masked secret containing dots or asterisks isn’t the original value.

If you lost the secret, open the client in Google Cloud and use **Add Secret**. Save the new value in Boopity and test it before disabling the old one. Google’s [secret-management instructions](https://support.google.com/cloud/answer/15549257?hl=en) explain how to identify the two secrets. If two already exist, don’t delete one until you know which applications use it.

### You changed your website address

Update the installation’s `APP_URL` and restart it. Then copy the newly displayed origin and redirect URI into the existing Google client. Keep an email-code sign-in available while you make the change.

For a local trial, Google permits `http://localhost` addresses. Copy the exact values Boopity displays, including the port; `localhost` and `127.0.0.1` are different addresses. Don’t use a local address for a public installation.

## Turn Google sign-in off

Clear **Enable Google sign-in** and save. You can still sign in with an email code. If the connection is marked as managed by your host, ask your installer to change that configuration instead.
