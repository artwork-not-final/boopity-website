import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("visitor pages offer a screenshot tour, not a public demo", async () => {
  for (const folder of ["../src/pages/", "../src/content/docs/"]) {
    const root = fileURLToPath(new URL(folder, import.meta.url));
    for (const file of await readdir(root, { recursive: true })) {
      if (!/\.(astro|md|mdx)$/.test(file)) continue;
      const source = await readFile(join(root, file), "utf8");
      assert.doesNotMatch(source, /\bdemo(?:nstration)?\b/i, file);
    }
  }
  const links = await readFile(
    new URL("../src/lib/site.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(links, /demo\.boopity\.com/);
});

test("Railway walkthrough links the public template and explains operator responsibilities", async () => {
  const guide = await readFile(
    new URL(
      "../src/content/docs/docs/getting-started/railway.mdx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(guide, /href="https:\/\/railway\.com\/new\/template\/boopity"/);
  const referralLink =
    "[Create your Railway account](https://railway.com?referralCode=oH-G_8)";
  assert.ok(guide.includes(referralLink));
  assert.ok(guide.indexOf(referralLink) < guide.indexOf("## Deploy Boopity"));
  assert.match(
    guide,
    /sign up through the link below or deploy through this template/,
  );
  assert.match(guide, /https:\/\/railway\.com\/pricing/);
  assert.match(guide, /referral credit or commission/i);
  assert.match(guide, /minimum, not a spending cap/i);
  assert.match(guide, /Keep this link private/);
  assert.match(guide, /Automatic backups are not included/);
  assert.match(guide, /updates are your choice, not automatic/i);
  assert.equal((guide.match(/<GuideImage\b/g) || []).length, 4);
  assert.doesNotMatch(
    guide,
    /boopity-production-2c3f|owner@example\.test|setup_token=/,
  );
});

test("sitter guides stay on the website instead of handing off to repository Markdown", async () => {
  const root = fileURLToPath(
    new URL("../src/content/docs/docs/", import.meta.url),
  );
  for (const file of await readdir(root, { recursive: true })) {
    if (!/\.mdx?$/.test(file)) continue;
    const source = await readFile(join(root, file), "utf8");
    assert.doesNotMatch(
      source,
      /github\.com\/artwork-not-final\/boopity\/blob\/[^)\s]+\.md\b/,
      file,
    );
    assert.doesNotMatch(source, /^##\s+\d+[.)]\s/gm, file);
  }
});

test("task guides are discoverable from the docs home and sidebar", async () => {
  const home = await readFile(
    new URL("../src/content/docs/docs/index.mdx", import.meta.url),
    "utf8",
  );
  const config = await readFile(
    new URL("../astro.config.mjs", import.meta.url),
    "utf8",
  );
  for (const route of [
    "guides/services",
    "guides/clients-and-pets",
    "guides/bookings",
    "guides/booking-rules",
    "guides/client-portal",
    "guides/payments",
    "guides/business-and-account",
    "guides/email",
    "guides/resend",
    "guides/google-sign-in",
    "guides/stripe",
    "hosting/docker-and-node",
    "hosting/backup-and-restore",
    "hosting/recover-access",
  ]) {
    assert.ok(home.includes(`/docs/${route}/`), `Missing home link: ${route}`);
    assert.ok(
      config.includes(`slug: "docs/${route}"`),
      `Missing sidebar entry: ${route}`,
    );
  }
});

test("provider walkthroughs cover setup and verification without requiring repository instructions", async () => {
  const guide = async (path) =>
    readFile(
      new URL(`../src/content/docs/docs/${path}`, import.meta.url),
      "utf8",
    );
  const resend = await guide("guides/resend.mdx");
  for (const phrase of [
    "Sending access",
    "DNS only",
    "Keep your existing inbox working",
    "Verify inbox & create owner",
    "Verify email delivery",
    "same Resend team",
    "recipient’s mail server accepted it, not that it reached the inbox",
  ]) {
    assert.ok(resend.includes(phrase), `Resend guide missing: ${phrase}`);
  }
  assert.match(resend, /<GuideImage\b/);
  assert.match(await guide("guides/email.md"), /\/docs\/guides\/resend\//);
  assert.match(
    await guide("getting-started/setup.md"),
    /\/docs\/guides\/resend\//,
  );

  const google = await guide("guides/google-sign-in.md");
  for (const phrase of [
    "Create project",
    "Google Auth Platform",
    "External",
    "Web application",
    "Authorized JavaScript origins",
    "Authorized redirect URIs",
    "/api/auth/callback/google",
    "Google client ID",
    "Google client secret",
    "owner email",
    "Publish app",
    "Verification Center",
    "privacy-policy link",
    "seven-day authorization expiry doesn’t apply",
  ]) {
    assert.ok(google.includes(phrase), `Google guide missing: ${phrase}`);
  }
  assert.match(google, /https:\/\/www\.googleapis\.com\/auth\/userinfo\.email/);
  assert.match(
    google,
    /https:\/\/www\.googleapis\.com\/auth\/userinfo\.profile/,
  );
  assert.match(google, /Boopity doesn’t create those policy pages for you/);
  assert.doesNotMatch(google, /https:\/\/demo\.boopity\.com/);
});

test("Stripe walkthrough covers a no-charge connection check before checkout and separates live payments", async () => {
  const stripe = await readFile(
    new URL("../src/content/docs/docs/guides/stripe.md", import.meta.url),
    "utf8",
  );
  for (const phrase of [
    "Create sandbox",
    "Create restricted key",
    "View request logs",
    "**Snapshot**, not Thin",
    "Connection instructions",
    "Stripe test restricted API key",
    "Stripe test webhook signing secret",
    "Verify account (read-only)",
    "product.created",
    "Archive product",
    "don’t make a payment link, invoice, subscription, or payment",
    "Signed webhook: Received",
    "Open sandbox checkout",
    "4242 4242 4242 4242",
    "**Received**",
    "Sandbox balance due",
    "I confirm this sandbox refund",
    "Stripe live restricted API key",
    "Stripe live webhook signing secret",
    "A sandbox test event cannot verify the live connection",
    "I understand live mode lets clients make real payments",
    "Use live mode",
    "real client and booking records",
    "Don’t use a real card just to run another test",
    "doesn’t add tax to Boopity bookings",
    "doesn’t currently support Stripe custom checkout domains",
  ]) {
    assert.ok(stripe.includes(phrase), `Stripe guide missing: ${phrase}`);
  }
  const events = stripe
    .match(/```text\n(checkout\.session\.completed[\s\S]*?)\n```/)?.[1]
    .split("\n");
  assert.deepEqual(events, [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
    "refund.created",
    "refund.updated",
    "refund.failed",
    "charge.refunded",
    "charge.dispute.created",
    "charge.dispute.updated",
    "charge.dispute.closed",
  ]);
  assert.ok(
    stripe.indexOf("## Check the webhook without taking a payment") <
      stripe.indexOf("## Enable practice checkout"),
  );
  assert.match(stripe, /not a tested permission preset/);
  assert.doesNotMatch(stripe, /(?:rk|sk)_(?:test|live)_[A-Za-z0-9]{10,}/);
});

test("guides retain important distinctions about money, access, and storage", async () => {
  const guide = async (path) =>
    readFile(
      new URL(`../src/content/docs/docs/${path}`, import.meta.url),
      "utf8",
    );
  assert.match(
    await guide("guides/services.mdx"),
    /does \*\*not\*\* mean extra pets are free/,
  );
  const payments = await guide("guides/payments.mdx");
  assert.match(
    payments,
    /always count as actual money received, even when Stripe is in sandbox mode/,
  );
  assert.match(
    payments,
    /Cancelling a booking does not waive its charge or refund its payments/,
  );
  assert.match(
    await guide("guides/client-portal.md"),
    /does not send invitations automatically/,
  );
  assert.match(
    await guide("hosting/backup-and-restore.md"),
    /Restoring data does not undo payments/,
  );
  assert.match(
    await guide("hosting/docker-and-node.md"),
    /no database connection string to enter/,
  );
});
