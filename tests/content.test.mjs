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
