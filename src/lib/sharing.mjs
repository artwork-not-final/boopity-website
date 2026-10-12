const images = {
  website: {
    url: "https://boopity.com/social/boopity.png",
    alt: "Boopity. More time for the pets. Free, open-source pet-sitting software.",
  },
  guides: {
    url: "https://boopity.com/social/boopity-guides.png",
    alt: "The Boopity guide. From your first setup to your next booking.",
  },
};

/** @param {keyof typeof images} kind */
export function sharingMetadata(kind) {
  const image = images[kind];
  return [
    { property: "og:site_name", content: "Boopity" },
    { property: "og:image", content: image.url },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image.url },
    { name: "twitter:image:alt", content: image.alt },
  ];
}
