/**
 * Robots.txt generator for the website
 * Controls search engine crawling behavior
 */
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://bedrock.media/sitemap.xml",
  }
}

