/**
 * Sitemap generator for the website
 * Creates a sitemap.xml file for search engine indexing
 */
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bedrock.media"

  // Main pages
  const routes = ["", "/builders", "/consumer", "/onchain"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Article pages
  const articles = ["mars-starships", "fact-checking-industry", "reddit-pipeline"].map((slug) => ({
    url: `${baseUrl}/article/${slug}`,
    lastModified: new Date("2025-03-03"),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...routes, ...articles]
}

