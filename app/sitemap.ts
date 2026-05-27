import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: new URL("/", SITE_ORIGIN).toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/register", SITE_ORIGIN).toString(),
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
