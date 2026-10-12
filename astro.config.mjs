import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { sharingMetadata } from "./src/lib/sharing.mjs";

export default defineConfig({
  site: "https://boopity.com",
  output: "static",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Boopity",
      description: "Practical guides for your pet-care business.",
      favicon: "/favicon.svg",
      head: sharingMetadata("guides").map((attrs) => ({ tag: "meta", attrs })),
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
            { slug: "docs/getting-started/railway" },
            { slug: "docs/getting-started/setup" },
            { slug: "docs/getting-started/first-booking" },
          ],
        },
        {
          label: "Everyday tasks",
          items: [
            { slug: "docs/guides/services" },
            { slug: "docs/guides/clients-and-pets" },
            { slug: "docs/guides/bookings" },
            { slug: "docs/guides/booking-rules" },
            { slug: "docs/guides/client-portal" },
            { slug: "docs/guides/payments" },
          ],
        },
        {
          label: "Your settings",
          items: [
            { slug: "docs/guides/business-and-account" },
            { slug: "docs/guides/email" },
            { slug: "docs/guides/resend" },
            { slug: "docs/guides/google-sign-in" },
            { slug: "docs/guides/stripe" },
          ],
        },
        {
          label: "Help & maintenance",
          items: [
            { slug: "docs/help/troubleshooting" },
            { slug: "docs/help/backups-and-updates" },
          ],
        },
        {
          label: "Hosting help",
          collapsed: true,
          items: [
            { slug: "docs/hosting/docker-and-node" },
            { slug: "docs/hosting/backup-and-restore" },
            { slug: "docs/hosting/recover-access" },
          ],
        },
        { label: "Back to the website", link: "/" },
      ],
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
