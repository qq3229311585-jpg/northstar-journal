import type { MetadataRoute } from "next";
import { staticPosts as posts, site } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/writing",
    "/diary",
    "/about",
    ...posts.map((post) => `/posts/${post.slug}`),
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date("2026-06-11T00:00:00Z"),
  }));
}
