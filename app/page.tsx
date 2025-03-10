/**
 * Homepage component that displays the main content of the website
 * Includes hero section, banner, and editorial content
 */
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { NavBar } from "./components/nav-bar"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#ffffff]">
      {/* Navigation bar component */}
      <NavBar />

      {/* Hero Section - Featured article with large image */}
      <section className="relative mx-2 sm:mx-4 my-2 sm:my-4 border border-[#69696a]/50">
        <Link href="/article/mars-starships" className="block group cursor-pointer">
          {/* Hero image with hover zoom effect */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src="/placeholder.svg?height=500&width=1200"
              alt="Rocket engines with smoke"
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent">
              <Image
                src="https://cdn.sanity.io/images/cjtc1tnd/production/4900e256795093623c174c3530a75147f168b5b0-3200x2134.png?auto=format&w=1800&q=100"
                alt="Temporary hero image"
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Hero content */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                What can we sent to mars on the first starship?
              </h2>
              <p className="text-sm sm:text-base text-[#8d8d8d] mb-4 sm:mb-6 font-ptserif">
                TLDR: We're introducing new building blocks that make it faster, simpler, and more powerful to build on
                Base: Flashblocks...
              </p>
            </div>
          </div>

          {/* Article metadata footer */}
          <div className="mt-auto border-t border-[#69696a]/50 flex items-center">
            <div className="bg-[#ffffff] px-3 sm:px-4 py-1">
              <span className="text-xs text-[#1e1e1e] leading-none">Spotlight</span>
            </div>
            <div className="px-3 sm:px-4 py-1 ml-auto">
              <span className="text-xs text-[#8d8d8d] leading-none">Jihad | Mar 3, '25</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Banner - Animated marquee text with Base logo */}
      <section className="border-t border-b border-[#69696a]/50">
        <div className="py-3 sm:py-4 overflow-hidden bg-[#2151f5]">
          <div className="whitespace-nowrap text-xl sm:text-2xl md:text-4xl font-bold text-[#ffffff]">
            <div className="inline-block animate-marquee">
              indie media that tracks and boosts real businesses on{" "}
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 111 111"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block align-middle -mt-1"
              >
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" />
              </svg>{" "}
              — indie media that tracks and boosts real businesses on{" "}
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 111 111"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block align-middle -mt-1"
              >
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" />
              </svg>{" "}
              — indie media that tracks and boosts real businesses on{" "}
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 111 111"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block align-middle -mt-1"
              >
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" />
              </svg>{" "}
              —{" "}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Section - Grid of article cards */}
      <section className="mx-2 sm:mx-4 my-4">
        <div className="py-4 sm:py-6 md:py-8 px-0">
          {/* Section header with category filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <h3 className="text-xl sm:text-2xl font-bold flex items-center">
              Editorial <ArrowRight className="ml-2 h-5 w-5" />
            </h3>

            <div className="flex flex-wrap gap-2">
              <button className="px-3 sm:px-4 py-1.5 bg-[#ffffff] text-[#1e1e1e] rounded-none text-sm">All</button>
              <button className="px-3 sm:px-4 py-1.5 bg-transparent border border-[#69696a]/50 rounded-none text-sm">
                Consumer
              </button>
              <button className="px-3 sm:px-4 py-1.5 bg-transparent border border-[#69696a]/50 rounded-none text-sm">
                Onchain
              </button>
              <button className="px-3 sm:px-4 py-1.5 bg-transparent border border-[#69696a]/50 rounded-none text-sm">
                Builder
              </button>
            </div>
          </div>

          {/* Grid of article cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

/**
 * ArticleCard component for displaying article previews in a grid
 * Includes image, title, description, and metadata
 */
function ArticleCard({ image, title, description, category, author, date, slug }: { image: string, title: string, description: string, category: string, author: string, date: string, slug: string }) {
  return (
    <article className="group bg-[#000000]">
      {/* Article link wrapper */}
      <Link href={`/article/${slug}`} className="block">
        {/* Article image with hover zoom effect */}
        <div className="relative h-[180px] sm:h-[220px] md:h-[240px] overflow-hidden">
          <Image
            src="https://cdn.sanity.io/images/cjtc1tnd/production/8b4d9e121eb3c5761840bed620877324602715dd-1200x800.jpg?auto=format&w=1800&q=100"
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>
        {/* Article content */}
        <div className="p-3 sm:p-4 md:p-6 border-l border-r border-[#69696a]/50">
          <h4 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 sm:mb-3 leading-tight line-clamp-2">
            {title}
          </h4>
          <p className="text-sm sm:text-base text-[#8d8d8d] leading-relaxed font-ptserif line-clamp-3">{description}</p>
        </div>
      </Link>
      {/* Article metadata footer */}
      <div className="mt-auto border border-[#69696a]/50 flex items-center">
        <div className="bg-[#ffffff] px-3 sm:px-4 py-1">
          <span className="text-xs text-[#1e1e1e] leading-none">{category}</span>
        </div>
        <div className="px-3 sm:px-4 py-1 ml-auto">
          <span className="text-xs text-[#8d8d8d] leading-none">
            {author} | {date}
          </span>
        </div>
      </div>
    </article>
  )
}

// Sample article data for the editorial section
const articles = [
  {
    title: "What Can We Send to Mars on the First Starships?",
    description: "everything we need to build the first base on mars...",
    image: "/placeholder.svg?height=300&width=400",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    slug: "mars-starships",
  },
  {
    title: "How Tech Created the Online Fact-Checking Industry",
    description: "interviews with trust and safety workers at meta...",
    image: "/placeholder.svg?height=300&width=400",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    slug: "fact-checking-industry",
  },
  {
    title: "The Terrorist Propaganda to Reddit Pipeline",
    description: "how an ultra-leftist network hijacked some of the...",
    image: "/placeholder.svg?height=300&width=400",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    slug: "reddit-pipeline",
  },
  {
    title: "What Can We Send to Mars on the First Starships?",
    description: "everything we need to build the first base on mars...",
    image: "/placeholder.svg?height=300&width=400",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    slug: "mars-starships-2",
  },
  {
    title: "How Tech Created the Online Fact-Checking Industry",
    description: "interviews with trust and safety workers at meta...",
    image: "/placeholder.svg?height=300&width=400",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    slug: "fact-checking-industry-2",
  },
  {
    title: "The Terrorist Propaganda to Reddit Pipeline",
    description: "how an ultra-leftist network hijacked some of the...",
    image: "/placeholder.svg?height=300&width=400",
    category: "Consumer",
    author: "Jihad",
    date: "Mar 3, '25",
    slug: "reddit-pipeline-2",
  },
]

