/**
 * Article page component that displays a single article
 * Uses dynamic routing with [slug] parameter to determine which article to display
 */
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NavBar } from "@/app/components/nav-bar"
import type { Metadata } from "next"

/**
 * Generate static paths for pre-rendering specific article pages
 * In a production app, this would fetch from a CMS or API
 */
export async function generateStaticParams() {
  // In a real app, this would fetch from an API or CMS
  return [{ slug: "mars-starships" }, { slug: "fact-checking-industry" }, { slug: "reddit-pipeline" }]
}

/**
 * Mock article data - would be replaced with actual data from a CMS or API in production
 * Each article contains all necessary information for display and metadata
 */
const articles = {
  "mars-starships": {
    title: "What Can We Send to Mars on the First Starships?",
    description:
      "Everything we need to build the first base on mars requires careful planning and resource allocation.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/placeholder.svg?height=600&width=1200",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    publishedAt: "2025-03-03T12:00:00Z",
    tags: ["mars", "space", "starship", "colonization"],
  },
  "fact-checking-industry": {
    title: "How Tech Created the Online Fact-Checking Industry",
    description: "Interviews with trust and safety workers at Meta reveal the challenges of modern fact-checking.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/placeholder.svg?height=600&width=1200",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    publishedAt: "2025-03-03T10:00:00Z",
    tags: ["fact-checking", "meta", "social-media", "trust"],
  },
  "reddit-pipeline": {
    title: "The Terrorist Propaganda to Reddit Pipeline",
    description: "How an ultra-leftist network hijacked some of the most popular subreddits.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/placeholder.svg?height=600&width=1200",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    publishedAt: "2025-03-03T08:00:00Z",
    tags: ["reddit", "social-media", "propaganda", "moderation"],
  },
}

/**
 * Generate dynamic metadata for each article based on its content
 * This improves SEO by providing article-specific metadata
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = articles[params.slug as keyof typeof articles]

  // Handle case where article doesn't exist
  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    }
  }

  // Return article-specific metadata
  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: article.image.startsWith("http") ? article.image : `https://bedrock.media${article.image}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image.startsWith("http") ? article.image : `https://bedrock.media${article.image}`],
    },
    alternates: {
      canonical: `https://bedrock.media/article/${params.slug}`,
    },
  }
}

/**
 * Article page component that displays a single article based on the slug parameter
 * Includes navigation, article content, and metadata
 */
export default function ArticlePage({ params }: { params: { slug: string } }) {
  // Get the article data based on the slug, or use fallback data if not found
  const article = articles[params.slug as keyof typeof articles] || {
    title: "Article Not Found",
    description: "The requested article could not be found.",
    content: "This article does not exist or has been removed.",
    image: "/placeholder.svg?height=600&width=1200",
    category: "Error",
    author: "System",
    date: "N/A",
  }

  return (
    <main className="min-h-screen bg-[#000000] text-[#ffffff]">
      {/* Navigation bar component */}
      <NavBar />

      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto">
          {/* Back navigation link */}
          <Link
            href="/"
            className="inline-flex items-center text-[#8d8d8d] hover:text-[#ffffff] mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back</span>
          </Link>

          <article>
            {/* Article title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

            {/* Article metadata header - category, author, date */}
            <div className="border border-[#69696a]/50 flex items-center mb-6">
              <div className="bg-[#ffffff] px-3 sm:px-4 py-1">
                <span className="text-xs text-[#1e1e1e] leading-none">{article.category}</span>
              </div>
              <div className="px-3 sm:px-4 py-1 ml-auto">
                <span className="text-xs text-[#8d8d8d] leading-none">
                  {article.author} | {article.date}
                </span>
              </div>
            </div>

            {/* Article featured image */}
            <div className="relative h-[200px] sm:h-[300px] md:h-[400px] mb-6 sm:mb-8 overflow-hidden">
              <Image
                src="https://cdn.sanity.io/images/cjtc1tnd/production/4900e256795093623c174c3530a75147f168b5b0-3200x2134.png?auto=format&w=1800&q=100"
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            {/* Article content */}
            <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
              {/* Article description/summary */}
              <p className="text-base sm:text-lg text-[#8d8d8d] mb-4 sm:mb-6 font-ptserif">{article.description}</p>
              {/* Article body paragraphs */}
              <p className="mb-4">{article.content}</p>
              <p className="mb-4">{article.content}</p>
              <p className="mb-4">{article.content}</p>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}

