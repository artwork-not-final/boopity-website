import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

const origin = "https://boopity.com";

export function localReference(value, pagePath) {
  const url = new URL(value, new URL(pagePath, origin));
  if (url.origin !== origin) return null;
  return {
    pathname: decodeURIComponent(url.pathname),
    fragment: decodeURIComponent(url.hash.slice(1)),
  };
}

export function inspectHtml(html) {
  const result = {
    links: [],
    images: [],
    ids: new Set(),
    headings: 0,
    titles: 0,
    meta: [],
  };
  function visit(node) {
    const attrs = Object.fromEntries(
      (node.attrs ?? []).map(({ name, value }) => [name, value]),
    );
    if (attrs.id) result.ids.add(attrs.id);
    if (node.tagName === "a" && attrs.name) result.ids.add(attrs.name);
    if (node.tagName === "h1") result.headings++;
    if (node.tagName === "title") result.titles++;
    if (node.tagName === "a" && attrs.href) result.links.push(attrs.href);
    if (node.tagName === "img") result.images.push(attrs);
    if (node.tagName === "meta") result.meta.push(attrs);
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  return result;
}

export function inspectSharing(page) {
  const errors = [];
  const values = {};
  for (const key of [
    "og:title",
    "og:description",
    "og:url",
    "og:site_name",
    "og:image",
    "og:image:type",
    "og:image:width",
    "og:image:height",
    "og:image:alt",
    "twitter:card",
    "twitter:image",
    "twitter:image:alt",
  ]) {
    const matches = page.meta.filter(
      (meta) => (meta.property ?? meta.name) === key,
    );
    if (matches.length !== 1 || !matches[0].content?.trim()) {
      errors.push(`expected one nonempty ${key}`);
    }
    values[key] = matches[0]?.content;
  }
  for (const key of ["og:url", "og:image", "twitter:image"]) {
    try {
      if (new URL(values[key]).origin !== origin)
        throw new Error("Wrong origin");
    } catch {
      errors.push(`${key} must be an absolute production HTTPS URL`);
    }
  }
  if (values["og:image"] !== values["twitter:image"])
    errors.push("sharing images must match");
  if (values["og:image:type"] !== "image/png")
    errors.push("sharing image must be PNG");
  if (
    values["og:image:width"] !== "1200" ||
    values["og:image:height"] !== "630"
  )
    errors.push("sharing image dimensions must be 1200 × 630");
  if (values["twitter:card"] !== "summary_large_image")
    errors.push("expected a large-image sharing card");
  return errors;
}

export async function checkSite(directory, { sharing = false } = {}) {
  const root = resolve(directory);
  const errors = [];
  const pages = new Map();
  async function walk(folder) {
    for (const item of await readdir(folder, { withFileTypes: true })) {
      const file = resolve(folder, item.name);
      if (item.isDirectory()) await walk(file);
      else if (item.name.endsWith(".html"))
        pages.set(file, inspectHtml(await readFile(file, "utf8")));
    }
  }
  await walk(root);
  if (!pages.size)
    throw new Error("No built HTML found. Run npm run build first.");
  async function targetFile(pathname) {
    const candidate = resolve(root, `.${pathname}`);
    if (candidate !== root && !candidate.startsWith(`${root}${sep}`))
      return null;
    try {
      if ((await stat(candidate)).isDirectory())
        return resolve(candidate, "index.html");
      return candidate;
    } catch {
      return null;
    }
  }
  for (const [file, page] of pages) {
    const route = `/${relative(root, file)
      .split(sep)
      .join("/")
      .replace(/index\.html$/, "")}`;
    if (page.headings !== 1)
      errors.push(`${route}: expected one h1, got ${page.headings}`);
    if (page.titles !== 1) errors.push(`${route}: expected one page title`);
    if (sharing) {
      errors.push(...inspectSharing(page).map((error) => `${route}: ${error}`));
      const value = page.meta.find(
        (meta) => meta.property === "og:image",
      )?.content;
      if (value) {
        let ref;
        try {
          ref = localReference(value, route);
        } catch {
          // inspectSharing already reports the invalid URL.
        }
        const imageFile = ref && (await targetFile(ref.pathname));
        if (!imageFile) errors.push(`${route}: missing sharing image ${value}`);
        else {
          const png = await readFile(imageFile);
          if (
            png.length < 24 ||
            png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
            png.readUInt32BE(16) !== 1200 ||
            png.readUInt32BE(20) !== 630
          ) {
            errors.push(`${route}: sharing image is not a 1200 × 630 PNG`);
          }
        }
      }
    }
    for (const value of page.links) {
      try {
        const ref = localReference(value, route);
        if (!ref) continue;
        const target = await targetFile(ref.pathname);
        if (!target || (extname(target) === ".html" && !pages.has(target))) {
          errors.push(`${route}: missing link target ${value}`);
        } else if (
          ref.fragment &&
          pages.has(target) &&
          !pages.get(target).ids.has(ref.fragment)
        ) {
          errors.push(`${route}: missing anchor ${value}`);
        }
      } catch {
        errors.push(`${route}: invalid link ${value}`);
      }
    }
    for (const image of page.images) {
      if (!("alt" in image)) errors.push(`${route}: image missing alt text`);
      if (!image.width || !image.height)
        errors.push(`${route}: image missing dimensions`);
      if (!image.src) errors.push(`${route}: image missing source`);
      else {
        const ref = localReference(image.src, route);
        if (ref && !(await targetFile(ref.pathname)))
          errors.push(`${route}: missing image ${image.src}`);
      }
    }
  }
  return { pages: pages.size, errors };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = await checkSite("dist", { sharing: true });
  if (result.errors.length) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `Checked ${result.pages} pages: local links, anchors, headings, images, and sharing previews pass.`,
    );
}
