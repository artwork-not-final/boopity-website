---
title: Set up Stripe payments
description: Connect your Stripe account to Boopity, test a payment and refund, and switch on real payments when you’re ready.
---

Stripe lets clients pay a booking’s balance from their portal. They enter their card details on Stripe’s checkout page, and the payment goes to **your Stripe account**.

You’ll first make a practice payment, then connect real payments. You can keep [recording cash and other payments manually](/docs/guides/payments/) whether or not you use Stripe.

## Before you start

- Finish Boopity’s setup and sign in as the owner.
- Use a hosted Boopity website with a working `https://` address. Stripe must be able to reach it; a `localhost` address won’t work for this walkthrough.
- Have access to the Stripe account for your pet-care business, or create one below.
- Keep two tabs open: your Boopity website and Stripe. You’ll copy a few values between them.

Do this before inviting real clients to pay. Boopity has one active online-payment mode for the whole installation, so clients would also see practice checkout while sandbox mode is on. If you already take online payments, use a separate test installation instead of switching your working site to sandbox mode.

## Create or open your Stripe account

1. Open the [Stripe Dashboard](https://dashboard.stripe.com/). Sign in, or choose the account-registration option if you’re new to Stripe.
2. Register using an email you’ll keep access to, verify it, and follow Stripe’s account prompts. Read and accept Stripe’s terms only if you agree to them.
3. Set up two-step sign-in when prompted. A passkey or authenticator app is a good choice.
4. If you manage more than one business in Stripe, use the account picker near the top-left to select the correct business.

You can start testing before activating real payments. Later, Stripe will ask for business, identity, and bank details. Enter those directly in Stripe—not in Boopity or a support message. The exact questions depend on your country and business type. [Stripe’s account activation guide](https://docs.stripe.com/get-started/account/activate).

Boopity doesn’t take a cut of payments. Stripe’s own processing fees apply; check [Stripe’s pricing for your country](https://stripe.com/pricing) before going live. Hosting costs are separate.

## Open a practice environment

Stripe calls a separate practice environment a **sandbox**. Payments there don’t move real money.

1. In Stripe, open the account picker and choose **Sandboxes** or **Switch to sandbox**.
2. Choose **Create sandbox** and name it `Boopity practice`.
3. If asked, use **Copying your account** to start with your business’s existing settings. This copies settings into the sandbox, not live payments.
4. Select **Create sandbox**, then open it. If you already have a sandbox dedicated to this installation, open that one instead.
5. Check the sandbox name or banner at the top before continuing.

In your Boopity tab, open **Settings → Payments**. The top card should say **Sandbox · no real money**. If it doesn’t, select **Use sandbox mode**. Leave the **Stripe · live** card alone for now.

Stay in this same Stripe sandbox while creating its key and webhook. Different sandboxes can both have keys beginning with `rk_test_`; that doesn’t make them interchangeable. [Stripe’s sandbox instructions](https://docs.stripe.com/sandboxes/dashboard/manage).

## Create a restricted key

An API key lets your installation talk to Stripe. A **restricted** key limits what it can do. Boopity requires this kind of key; it won’t accept a full-access secret key.

1. In your Stripe sandbox, open [API keys](https://dashboard.stripe.com/apikeys). Check the sandbox name again after following the link.
2. Under **Restricted keys**, select **Create restricted key**.
3. Choose to start with no permissions if Stripe offers a choice of presets.
4. Name the key `Boopity sandbox`.
5. Set the permissions below for **your account**. Leave any connected-account permissions at **None**.

| Resource Boopity uses    | Access | Why it’s needed                                                     |
| ------------------------ | ------ | ------------------------------------------------------------------- |
| Your own account details | Read   | Check which account is connected and whether it can accept payments |
| Balance                  | Read   | Confirm whether the key belongs to sandbox or live mode             |
| Checkout Sessions        | Write  | Open, check, and expire a checkout                                  |
| Payment Intents          | Read   | Check the result of a payment                                       |
| Charges                  | Read   | Read the payment receipt and whether it has been disputed           |
| Refunds                  | Write  | Request refunds and check their results                             |

**Write** includes Read. Leave unrelated permissions off, including payouts, transfers, subscriptions, and connected accounts. This is a starting list based on what Boopity calls, not a tested permission preset for every Stripe account. If Stripe reports a missing permission during the practice payment, use the [permission-error steps below](#stripe-reports-a-missing-permission).

Select **Create key**, complete any verification Stripe requests, and copy the full value. It should start with `rk_test_`. Save it in your password manager before closing the window; Stripe may not show it again. [Stripe’s restricted-key instructions](https://docs.stripe.com/keys/restricted-api-keys).

Don’t use a `pk_` publishable key, an `sk_` secret key, or your Stripe password. Keep the restricted key out of screenshots, email, chat, and source code.

## Tell Stripe where to send payment updates

A **webhook** is the connection Stripe uses to tell Boopity that a payment or refund changed. You need it even if clients normally return to Boopity after paying.

### Copy the address from Boopity

1. In **Settings → Payments**, find **Stripe · sandbox**.
2. Copy **Stripe test webhook URL**, including the full `/api/payments/webhooks/stripe/test` path.
3. Open **Connection instructions** and note the API version shown there. You’ll choose that version in Stripe.

For a site at `https://care.example.com`, the address would be:

```text
https://care.example.com/api/payments/webhooks/stripe/test
```

Copy yours from Boopity rather than using this example. If it shows the wrong website or `http://`, correct the installation’s `APP_URL` in your hosting settings and restart Boopity first, or ask your installer to do that.

### Create the destination in Stripe

1. Still in the same Stripe sandbox, open **Workbench → Webhooks**. You can also use Stripe’s [Webhooks page](https://dashboard.stripe.com/webhooks).
2. Select **Create an event destination**, **Create new destination**, or **Add destination**, depending on the screen shown.
3. Choose **Your account** or **Events on your account**, not connected accounts.
4. If asked for a payload format, choose **Snapshot**, not Thin. Boopity uses snapshot events. Choose the API version you noted in Boopity’s Connection instructions.
5. Use the event search to select each exact event name below, not all events.

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
refund.created
refund.updated
refund.failed
charge.refunded
charge.dispute.created
charge.dispute.updated
charge.dispute.closed
```

Also select **`product.created`** temporarily. We’ll use it to check the connection without taking a payment, then remove it.

Continue through the remaining screens:

1. Choose **Webhook endpoint** as the destination type.
2. Paste Boopity’s full address into **Endpoint URL**.
3. If there’s a name or description field, enter `Boopity sandbox`.
4. Select **Create destination**.
5. Open the new destination’s details. Find **Signing secret**, choose **Reveal secret**, and copy the value beginning with `whsec_`.

The signing secret is a second, different value—not the restricted key. It lets Boopity check that updates really came from this Stripe destination. [Stripe’s webhook setup instructions](https://docs.stripe.com/webhooks).

If the required API version isn’t offered, don’t change your account-wide version just to match. Ask your installer to check the destination and installed Boopity version before continuing.

## Save the connection in Boopity

Return to **Settings → Payments → Stripe · sandbox**:

| Boopity field                      | What to paste                                                           |
| ---------------------------------- | ----------------------------------------------------------------------- |
| Stripe test restricted API key     | The full `rk_test_` value from this sandbox’s API keys page             |
| Stripe test webhook signing secret | The full `whsec_` value from this sandbox’s Boopity webhook destination |

1. Select **Save Stripe credentials**.
2. The fields clear after saving. **Saved — blank keeps it** means the value is stored; you don’t need to enter it again.
3. Select **Verify account (read-only)**.
4. Look for **Account verification: Passed**, followed by the Stripe account ID.

This checks the account without moving money. **Signed webhook: Not received yet** is expected until the next step. Checkout stays disabled for now.

Boopity encrypts values saved through this form. If your installer uses the hosting platform’s secrets vault instead, the card says **Host-managed credentials** and the fields are disabled. Ask that installer to supply the matching pair; don’t put keys in website code.

## Check the webhook without taking a payment

We’ll create one unused catalog item in Stripe. That sends the temporary `product.created` event to Boopity. It doesn’t create a Boopity service, book a visit, or charge anyone. You do this in the Dashboard; you don’t need to give Boopity’s key extra product permissions for this check.

1. Check that you’re still in **Boopity practice** in Stripe and have saved the signing secret in Boopity.
2. In Stripe, open **More → Product catalog** and select **Add product**.
3. Name it `Boopity connection check`.
4. Stripe’s product form requires a price. Choose **One time**, enter `1.00` in your usual currency, and leave other optional fields alone.
5. Select **Add product** to save it. Stop there: don’t make a payment link, invoice, subscription, or payment. A catalog price by itself does not collect money.
6. Return to **Workbench → Webhooks**, open `Boopity sandbox`, then **Event deliveries**.
7. Find the new **product.created** event. Open it and look for **Delivered** with a successful `2xx` response, such as `200`.
8. In Boopity, select **Refresh payment setup**. The sandbox card should now say **Signed webhook: Received**.

If delivery failed, fix the [webhook issue](#the-signed-webhook-stays-not-received-yet), then use **Resend** on that event’s delivery. Don’t keep creating more products.

After it succeeds, return to **Product catalog**, open the three-dot menu beside **Boopity connection check**, and choose **Archive product**. Then edit the webhook destination’s selected events, remove only `product.created`, and save. Keep all eleven payment, refund, and dispute events.

The catalog steps follow [Stripe’s product instructions](https://docs.stripe.com/products-prices/manage-prices); the delivery check uses its [event-delivery log](https://docs.stripe.com/workbench/event-destinations). This checks that updates can reach Boopity. The practice payment below checks the payment itself.

## Enable practice checkout

In Boopity’s **Stripe · sandbox** card, check both lines:

- **Account verification: Passed**
- **Signed webhook: Received**

Select **Enable checkout**. The card should change to **Checkout enabled**. At the top of Payment settings, confirm **Sandbox · no real money** is still the active mode.

There are two separate controls: the Stripe card enables a connection, and the top card chooses which mode clients use. Enabling the sandbox connection alone doesn’t change the active mode.

## Try a payment as a client

### Prepare a practice booking

1. Create a client named `Practice Client` using a second email address you control—not your owner email. Add a pet and [give that client portal access](/docs/guides/client-portal/).
2. Create a booking for that client using one of your services. A small, recognizable amount such as $5 or $10 works well for a USD booking.
3. Confirm the booking. It must be **Confirmed** or **Completed** and have an outstanding balance for online payment to be available.
4. Keep your owner session open. In a separate private or incognito window, follow the invitation and sign in as Practice Client.

These are real client and booking records in your installation; only the Stripe payment is simulated. Use a practice slot that won’t block a real visit, and cancel the practice booking and archive the practice client when you’re done.

### Complete Stripe’s practice checkout

1. In the client portal, open the booking from **My bookings**, then its **Payments** tab.
2. Check that the page says **Test checkout: no real money**. Select **Open sandbox checkout**.
3. On Stripe’s checkout page, confirm that it shows a test/sandbox indicator and the expected amount and currency.
4. Choose card payment and enter these [Stripe test details](https://docs.stripe.com/testing):

| Field                    | Practice value                                    |
| ------------------------ | ------------------------------------------------- |
| Card number              | `4242 4242 4242 4242`                             |
| Expiry                   | Any future month and year                         |
| CVC                      | Any three digits, such as `123`                   |
| Name and billing address | Fictional details in the format the form requests |
| Email                    | Your practice client email                        |

Complete the payment and return to Boopity.

:::caution[Use test details only in the sandbox]
Don’t enter a real card for this practice payment. Don’t try the test card in live mode, or make a real charge merely to test the connection.
:::

### Check the result in both places

1. In Boopity, select **Refresh payments**. The payment record should show **Received**. For a full payment, **Sandbox balance due** should be zero and marked **Paid**.
2. If it hasn’t updated, use **Check payment status** on that payment. Don’t add a manual payment to make the balance disappear.
3. In Stripe’s same sandbox, open **Payments** or **Transactions**, find the amount you just paid, and confirm that it succeeded.
4. In your sitter workspace, open **Payments** and select **Sandbox** to find the practice payment across all bookings.

Returning from Stripe isn’t proof of payment. A sandbox payment does **not** settle the booking’s actual balance, so the separate real balance can still show an amount due.

## Try a refund

In your owner session, open that practice booking’s **Payments** tab:

1. Find the successful Stripe payment marked **Sandbox** and select **Refund payment**.
2. Under **Issue a sandbox refund**, enter the full amount of the practice payment.
3. Enter `Practice refund` in **Private refund / correction reason**.
4. Check **I confirm this sandbox refund**, then select **Confirm refund**.
5. Use **Check payment status** or **Refresh payments** and check the refund’s final result. Also open the original payment in Stripe to confirm the refund there.

**Pending** does not mean refunded. If the result is uncertain, check the existing payment/refund first. **Retry same refund**, when offered, retries the saved request; starting a second refund could return money twice.

Refunding returns the payment but doesn’t waive the booking’s charge, so its balance can become due again. No real money moves in this exercise. [More about refunds, credits, and corrections](/docs/guides/payments/#refunds-credits-and-corrections).

## Prepare your real Stripe account

After the practice payment and refund both work:

1. Use Stripe’s account picker to leave the sandbox and return to your business’s live account.
2. Finish **Activate payments**, **Activate account**, or any outstanding setup tasks. Provide the business, representative, and identity details Stripe requests.
3. Add the bank account where Stripe should send payouts and review the payout schedule shown for your account. A client payment and a bank payout are separate events; money may not reach your bank immediately.
4. Check your public business name, support contact details, and statement descriptor so clients can recognize the charge.
5. Complete any remaining verification or account restrictions. A saved bank account alone doesn’t mean payments are enabled.

Stripe manages account approval and payouts. [Its activation guide](https://docs.stripe.com/get-started/account/activate) explains the requirements; follow the tasks shown for your own account.

## Enable real payments

Keep Boopity in sandbox mode while you prepare the separate live connection. Don’t overwrite the sandbox fields.

| Setting                    | Sandbox                              | Live                                        |
| -------------------------- | ------------------------------------ | ------------------------------------------- |
| Boopity card               | Stripe · sandbox                     | Stripe · live                               |
| Restricted key starts with | `rk_test_`                           | `rk_live_`                                  |
| Webhook address ends with  | `/stripe/test`                       | `/stripe/live`                              |
| Signing secret             | Sandbox destination’s `whsec_` value | Live destination’s different `whsec_` value |

### Connect the live account

1. In Stripe’s **live account → API keys**, create a restricted key named `Boopity live`. Use the permissions that worked during your sandbox payment and refund. Copy its `rk_live_` value securely.
2. In **Boopity → Settings → Payments → Stripe · live**, copy **Stripe live webhook URL** and note the API version in Connection instructions.
3. In Stripe’s live **Workbench → Webhooks**, create a new destination named `Boopity live`: **Your account**, **Snapshot**, the matching API version, and the same eleven events. Also select `product.created` temporarily.
4. Choose **Webhook endpoint**, paste the **live** URL, create the destination, and copy its own signing secret.
5. In Boopity’s **Stripe · live** card, fill in **Stripe live restricted API key** and **Stripe live webhook signing secret**. Select **Save Stripe credentials**, then **Verify account (read-only)**. Check for **Passed**.
6. Repeat the [no-charge webhook check](#check-the-webhook-without-taking-a-payment), this time in the **live Stripe account** and checking the **Stripe · live** card. Create only the unused catalog item and its one-time price—do not charge a card. After **Signed webhook: Received**, archive that item and remove `product.created` from the live destination.
7. In **Stripe · live**, select **Enable checkout**.

The live check must come from your live account. A sandbox test event cannot verify the live connection, and the two signing secrets are not interchangeable.

### Switch what clients use

1. Finish and clean up your practice booking before inviting anyone to pay.
2. At the top of Boopity’s Payment settings, check **I understand live mode lets clients make real payments**.
3. Select **Use live mode**.
4. Confirm **Online payments: Live · real payments** and **Checkout enabled** in the live card.

Clients with a confirmed or completed booking and an unpaid balance will now see **Pay outstanding balance**. Monitor the first genuine client payment in both Boopity and Stripe. Don’t use a real card just to run another test.

## Choose payment methods and checkout appearance

In Stripe’s live **Settings**, open **Payment methods** to review the methods you offer. Stripe shows eligible methods based on your account, currency, and the client’s checkout. An enabled method may not appear for every client. [Stripe’s payment-method settings](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods).

Search Stripe Settings for **Branding** to add your business logo and colors. This controls Stripe’s checkout appearance; Boopity’s own colors don’t change it. Keep the default `checkout.stripe.com` address—Boopity doesn’t currently support Stripe custom checkout domains.

Bank payments may stay **Processing** while the bank confirms them. Wait for the final result; don’t record a second manual payment. If you offer bank debit, review Stripe’s authorization and verification messages for that method too.

Boopity doesn’t calculate tax, manage subscriptions, add tips, or issue invoices. Enabling Stripe Tax in the Dashboard doesn’t add tax to Boopity bookings. Manage fees, payouts, and disputes in Stripe or your accounting tools.

## If something doesn’t work

### Stripe reports a missing permission

1. In the correct sandbox, open **API keys**, find your Boopity restricted key, and open its three-dot menu.
2. Choose **View request logs**. Open the failed request and read which permission Stripe says is missing.
3. Return to the key’s menu, choose **Edit key**, and add only the permission needed by that request.
4. Repeat the failed practice step, then check the payment and refund again before copying these permissions to your live key.

Checkout creates product and price details from the booking rather than using a saved catalog. Stripe may report an additional permission for that operation. Don’t enable every permission or switch to a full-access key. If it’s unclear, ask for help with the error text and request ID—never the key. [Stripe’s permission troubleshooting](https://docs.stripe.com/keys/restricted-api-keys#assign-permissions).

### The key won’t save, or account verification fails

Check the prefix: `rk_test_` belongs in the sandbox card and `rk_live_` in the live card. Copy the whole key and matching `whsec_` secret without spaces or quotation marks. A masked value containing dots or asterisks isn’t the key.

If Stripe says the account cannot accept charges, complete its outstanding Dashboard requirements. For a permission error, use the steps above.

Each Boopity mode stays tied to the Stripe account first verified for it. You can replace a key from that account, but you can’t swap in another business’s account or a newly created sandbox: old payments and refunds still belong to the original.

### The signed webhook stays “Not received yet”

Open the destination’s **Event deliveries** in Stripe:

| What you see                            | What to check                                                                                                                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No event listed                         | Was `product.created` selected before you saved the connection-check product? Are both in the same account and mode?                                                             |
| `400` or a signature/mode error         | Recopy this destination’s signing secret into the matching Boopity card. Don’t mix sandbox, live, or local-forwarding secrets.                                                   |
| `404` or a redirect                     | Compare the entire endpoint URL with Boopity’s value. It must point to your app, not boopity.com or its sign-in page.                                                            |
| Connection, certificate, or `5xx` error | Check that your hosted installation is running over HTTPS. Ask your host or installer to resolve server, certificate, or access-filter problems. Don’t disable signature checks. |
| Delivered, but Boopity hasn’t changed   | Select **Refresh payment setup** and check the correct card. If you replaced the signing secret, resend the event after saving it.                                               |

After fixing the cause, resend the failed event from its delivery page. Opening the webhook URL in a browser won’t verify it; Stripe must send a signed event.

### The client can’t see a pay button

Check the active mode at the top of Payment settings and **Checkout enabled** in that mode’s card. Then check that the client opened their own confirmed or completed booking and has an outstanding balance in that mode.

If a previous checkout is still open or processing, use **Check payment status** before asking them to pay again. An unpaid, abandoned checkout can be closed with **Expire checkout** from the sitter’s payment record; it doesn’t refund or cancel a submitted payment.

### A payment is missing from the Payments page

Practice payments appear under **Sandbox**, not **Actual payments**. Clear search and date filters, then open the booking’s Payments tab and use **Check payment status**. Compare the amount and status with Stripe before making any correction.

### Checkout stopped after I changed a key

Saving credentials disables new checkout. Verify the account again; if the signing secret changed, receive another signed event too. Then select **Enable checkout** for that mode.

For a planned replacement, test the new restricted key from the same account before retiring the old one. If a key was exposed, rotate it promptly in Stripe and review its activity rather than leaving it active to avoid downtime. [Stripe’s key-safety guidance](https://docs.stripe.com/keys-best-practices).

### I changed my Boopity website address

Update `APP_URL` in your hosting settings and restart the app. Copy the newly displayed sandbox and live webhook URLs into the corresponding Stripe destinations. If you create new destinations instead of editing them, save their new signing secrets in Boopity and repeat verification. Ask your installer for help if credentials are host-managed.

## Pause online payments

In **Settings → Payments**, select **Disable checkout** in the active Stripe card. This stops new checkouts; it doesn’t cancel a payment already submitted or refund anyone. Keep the connection and webhook in place so existing payment and refund results can still update.

You can continue [recording payments manually](/docs/guides/payments/). Cancelling a booking never automatically refunds a Stripe payment.
