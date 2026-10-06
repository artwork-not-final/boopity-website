import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  inspectHtml,
  localReference,
  checkSite,
} from "../scripts/check-site.mjs";

test("local references preserve routes and decode fragment IDs", () => {
  assert.deepEqual(localReference("../setup/#your%20name", "/docs/install/"), {
    pathname: "/docs/setup/",
    fragment: "your name",
  });
  assert.deepEqual(
    localReference("https://boopity.com/docs/?q=book#start", "/"),
    { pathname: "/docs/", fragment: "start" },
  );
  assert.equal(localReference("https://demo.boopity.com/", "/"), null);
  assert.equal(localReference("mailto:hello@example.test", "/"), null);
});

test("HTML inspection handles escaped links and decorative images", () => {
  const page = inspectHtml(
    '<title>Example</title><h1 id="a">Hello</h1><a href="/docs/?a=1&amp;b=2">Docs</a><img src="/b.svg" alt="" width="36" height="36">',
  );
  assert.equal(page.headings, 1);
  assert.equal(page.titles, 1);
  assert.ok(page.ids.has("a"));
  assert.deepEqual(page.links, ["/docs/?a=1&b=2"]);
  assert.equal(page.images[0].alt, "");
});

test("built-site checks detect broken links, anchors, and image metadata", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "boopity-site-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, "docs"));
  await writeFile(
    join(root, "index.html"),
    '<title>Home</title><h1>Home</h1><a href="/docs/#start">Good</a><a href="/missing/">Missing</a><a href="/docs/#absent">Anchor</a><img src="/missing.png">',
  );
  await writeFile(
    join(root, "docs/index.html"),
    '<title>Docs</title><h1 id="start">Docs</h1>',
  );
  const result = await checkSite(root);
  assert.equal(result.pages, 2);
  assert.equal(result.errors.length, 5);
  assert.ok(
    result.errors.some((error) => error.includes("missing link target")),
  );
  assert.ok(result.errors.some((error) => error.includes("missing anchor")));
  assert.ok(result.errors.some((error) => error.includes("missing alt")));
});
