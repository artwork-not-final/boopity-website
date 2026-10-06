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
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  return result;
}

export async function checkSite(directory) {
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
  const result = await checkSite("dist");
  if (result.errors.length) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `Checked ${result.pages} pages: local links, anchors, headings, and images pass.`,
    );
}
