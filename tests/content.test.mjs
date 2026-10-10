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
