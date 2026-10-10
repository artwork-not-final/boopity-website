import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Cloudflare publishes only static output without claiming a domain", async () => {
  const config = JSON.parse(
    await readFile(new URL("../wrangler.json", import.meta.url), "utf8"),
  );
  assert.equal(config.name, "boopity-website");
  assert.equal(config.workers_dev, true);
  assert.deepEqual(config.assets, {
    directory: "./dist",
    html_handling: "force-trailing-slash",
    not_found_handling: "404-page",
  });
  // No server entry point, application bindings, or production DNS routes.
  assert.deepEqual(Object.keys(config).sort(), [
    "$schema",
    "assets",
    "compatibility_date",
    "name",
    "workers_dev",
  ]);
});
