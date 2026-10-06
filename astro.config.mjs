import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://boopity.com",
  output: "static",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Boopity",
      description: "Practical guides for your pet-care business.",
      favicon: "/favicon.svg",
      customCss: ["./src/styles/docs.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/artwork-not-final/boopity",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/artwork-not-final/boopity-website/edit/main/",
      },
      sidebar: [
        { label: "Documentation home", slug: "docs" },
        {
          label: "Getting started",
          items: [
            { slug: "docs/getting-started/installation" },
            { slug: "docs/getting-started/setup" },
            { slug: "docs/getting-started/first-booking" },
          ],
        },
        {
          label: "Everyday tasks",
          items: [{ slug: "docs/guides/client-portal" }],
        },
        {
          label: "Looking after your installation",
          items: [
            { slug: "docs/help/troubleshooting" },
            { slug: "docs/help/backups-and-updates" },
          ],
        },
        { label: "Back to the website", link: "/" },
      ],
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
