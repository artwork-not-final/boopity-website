---
title: Connect Stripe
description: Connect your own Stripe account, test checkout and refunds, then enable real payments.
---

Stripe is optional. You can keep [recording payments manually](/docs/guides/payments/) without it. Online payments go to your Stripe account; Stripe’s fees and account requirements apply.

This guide is for an installation already reachable over HTTPS. Start in a separate Stripe sandbox, where no real money moves. Keep real clients out of checkout until you’ve finished testing and switched to live mode.

## Create a restricted key

Open your sandbox’s **API keys** in Stripe and create a **restricted** key for Boopity. It starts with `rk_test_`. Boopity does not use a publishable key, full-access secret key, or a saved subscription price. [Stripe’s key guide](https://docs.stripe.com/keys) explains these key types.

The application needs access to these resources:

| Resource                     | Access                |
| ---------------------------- | --------------------- |
| Your own account and balance | Read                  |
| Checkout Sessions            | Write, including read |
| Payment Intents and Charges  | Read                  |
| Refunds                      | Write, including read |

This list describes the operations Boopity uses, not a certified Stripe permission preset. Check the sandbox’s request logs if Stripe reports a missing permission, including for Checkout’s inline product and price data. Grant the missing scope only after checking the failed operation; don’t replace the key with a full-access key. Boopity doesn’t need permission to create payouts, transfers, subscriptions, or connected accounts.

## Add the webhook

A webhook lets Stripe tell Boopity whether a payment or refund succeeded, even if the client closes the browser.

1. In **Boopity → Settings → Payments**, find **Stripe · sandbox** and copy **Stripe test webhook URL**.
2. In Stripe’s **Workbench → Webhooks**, create a destination for **your account**, not connected accounts. Use the API version shown in Boopity’s **Connection instructions**.
3. Choose the events below, enter the copied URL as a webhook endpoint, and save. [Stripe’s destination instructions](https://docs.stripe.com/workbench/event-destinations) cover the current dashboard screens.

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

Copy that destination’s signing secret, which starts with `whsec_`. It is different from the API key and must belong to the same sandbox.

## Verify the connection

1. Paste the restricted key and signing secret into their matching fields in **Stripe · sandbox**. Select **Save Stripe credentials**.
2. Select **Verify account (read-only)**. Check that account verification passes.
3. Send a signed test event from Stripe to the destination. In Boopity, select **Refresh payment setup** and look for **Signed webhook: Received**.
4. Select **Enable checkout** for the sandbox. Make sure the active payment mode is sandbox too.

Saving new credentials disables checkout until you verify and enable it again. Account verification alone doesn’t test every payment permission.

If the signed event isn’t received, check Stripe’s destination delivery log, the exact URL, and the matching signing secret. A browser opening the webhook URL is not a webhook test.

## Try a payment and refund

Create a test client and confirmed booking, sign into its portal, and pay using [Stripe’s sandbox test payment details](https://docs.stripe.com/testing). Don’t use a real card in the sandbox or test card details in live mode.

Check the result in both Stripe and the booking’s **Payments** tab. Returning from checkout isn’t enough: the payment must show as succeeded. Then [issue a sandbox refund](/docs/guides/payments/#refund-a-stripe-payment) and check its final status in both places.

## Enable real payments

Complete Stripe’s account activation requirements, then repeat the connection steps in live mode with a **separate** `rk_live_` key, live webhook destination, and its signing secret. Copy **Stripe live webhook URL** from Boopity; don’t reuse the test URL or secret.

Verify the live account and signed webhook, then enable its checkout. Check **I understand live mode lets clients make real payments** and select **Use live mode**.

Each mode stays tied to its original Stripe account. You can replace keys from that account, but don’t swap in another business’s account: older payments and refunds still belong to the original.

## After connecting

Clients pay the remaining booking balance. Configure offered payment methods and checkout branding in Stripe. Bank payments may remain processing while Stripe verifies or settles them; don’t record them as received early.

Boopity doesn’t calculate tax, manage subscriptions, add tips, or issue invoices. Handle Stripe fees, payouts, and disputes in Stripe or your accounting tools. [Day-to-day payment help](/docs/guides/payments/) explains refunds, credits, and uncertain results.
