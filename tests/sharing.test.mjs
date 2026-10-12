import { test } from "node:test";
import assert from "node:assert/strict";
import { sharingMetadata } from "../src/lib/sharing.mjs";
import { inspectHtml, inspectSharing } from "../scripts/check-site.mjs";

function pageMeta(kind) {
  return [
    { property: "og:title", content: "A page-specific title" },
    { property: "og:description", content: "A page-specific description" },
    { property: "og:url", content: "https://boopity.com/docs/guides/stripe/" },
    ...sharingMetadata(kind),
  ];
}

test("marketing and docs cards share metadata without overriding page titles", () => {
  for (const kind of ["website", "guides"]) {
    const meta = pageMeta(kind);
    assert.deepEqual(inspectSharing({ meta }), []);
    assert.equal(meta.filter((item) => item.property === "og:title").length, 1);
    assert.ok(
      meta
        .find((item) => item.property === "og:image")
        .content.endsWith(
          kind === "guides" ? "/boopity-guides.png" : "/boopity.png",
        ),
    );
  }
});

test("sharing checks reject missing, duplicate, relative, or mismatched metadata", () => {
  const meta = pageMeta("website");
  assert.ok(inspectSharing({ meta: [] }).length > 0);
  assert.ok(
    inspectSharing({
      meta: [...meta, { property: "og:image", content: "duplicate" }],
    }).some((error) => error.includes("one nonempty og:image")),
  );
  const relative = meta.map((item) =>
    item.property === "og:image" ? { ...item, content: "/relative.png" } : item,
  );
  assert.ok(
    inspectSharing({ meta: relative }).some((error) =>
      error.includes("absolute production HTTPS URL"),
    ),
  );
  assert.ok(
    inspectSharing({ meta: relative }).some((error) =>
      error.includes("images must match"),
    ),
  );
});

test("HTML inspection reads sharing tags from server-rendered markup", () => {
  const page = inspectHtml(
    '<meta property="og:title" content="Pets &amp; clients"><meta name="twitter:card" content="summary_large_image">',
  );
  assert.deepEqual(page.meta, [
    { property: "og:title", content: "Pets & clients" },
    { name: "twitter:card", content: "summary_large_image" },
  ]);
});
