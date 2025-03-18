import { Metadata } from 'next'
import { NavBar } from '../components/nav-bar'
import { searchPosts } from '../page'
import Link from 'next/link'
import Image from 'next/image'

// Import the Post interface from page.tsx
import type { Post } from '../page'

// Define search page props
interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export const generateMetadata = ({ searchParams }: SearchPageProps): Metadata => {
  const query = searchParams.q || '';
  return {
    title: query ? `Search results for "${query}" | BEDROCK` : 'Search | BEDROCK',
    description: 'Search for articles on BEDROCK.',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  
  // Only search if we have a query
  const { docs: results, error } = query ? await searchPosts(query) : { docs: [], error: null };

  return (
    <main className="min-h-screen bg-[#171717] text-[#EBECEB]">
      <NavBar />
      
      <div className="container mx-auto pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {query ? `Search results for "${query}"` : 'Search'}
          </h1>
          
          <p className="text-[#EBECEB]/90 mb-8">
            {query && !error
              ? `Found ${results.length} result${results.length === 1 ? '' : 's'}`
              : 'Start typing in the search bar above to find articles'}
          </p>
          
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-none mb-8">
              <h3 className="font-medium mb-1">Error</h3>
              <p>{error}</p>
              <p className="mt-2 text-sm">
                Please try again or refine your search query. If the problem persists, contact support.
              </p>
            </div>
          )}
          
          {/* Search Results - only show if no error */}
          {!error && results.length > 0 ? (
            <div className="grid gap-6">
              {results.map((post: Post) => {
                // Get image URL
                let postImageUrl = '/placeholder.svg?height=300&width=400';
                
                if (post.heroImage) {
                  if (post.heroImage.url) {
                    postImageUrl = post.heroImage.url;
                  } else if (post.heroImage.sizes) {
                    const sizes = post.heroImage.sizes;
                    postImageUrl = sizes.medium?.url || sizes.small?.url || 
                                  sizes.thumbnail?.url || sizes.og?.url || 
                                  sizes.large?.url || sizes.xlarge?.url;
                  }
                } else if (post.image?.url) {
                  postImageUrl = post.image.url;
                }
                
                // Calculate author display
                let authorDisplay = 'Anonymous';
                if (post.populatedAuthors && post.populatedAuthors.length > 0) {
                  authorDisplay = post.populatedAuthors.map((a: { name: string }) => a.name).join(', ');
                } else if (post.authors && post.authors.length > 0) {
                  authorDisplay = post.authors.map((a: { name: string }) => a.name).join(', ');
                } else if (post.author?.name) {
                  authorDisplay = post.author.name;
                }
                
                // Get category display
                let categoryDisplay = 'Article';
                if (post.category?.title) {
                  categoryDisplay = post.category.title;
                } else if (post.category?.name) {
                  categoryDisplay = post.category.name;
                } else if (post.categories && post.categories.length > 0) {
                  if (post.categories[0].title) {
                    categoryDisplay = post.categories[0].title;
                  } else if (post.categories[0].name) {
                    categoryDisplay = post.categories[0].name;
                  }
                }
                
                return (
                  <article key={post.id} className="group border border-[#333333]/50 bg-[#171717] flex flex-col sm:flex-row">
                    <Link href={`/article/${post.slug}`} className="sm:w-1/3 relative h-40 sm:h-auto">
                      <Image
                        src={postImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </Link>
                    <div className="p-4 sm:p-6 flex flex-col sm:w-2/3">
                      <Link href={`/article/${post.slug}`} className="block mb-auto">
                        <h2 className="text-xl sm:text-2xl font-medium mb-2 leading-tight text-[#EBECEB] hover:underline">
                          {post.title}
                        </h2>
                        <p className="text-sm text-[#EBECEB]/90 mb-4 font-ptserif line-clamp-2">
                          {post.description || post.excerpt || ""}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between mt-4 text-sm">
                        <span className="bg-[#EBECEB] text-[#171717] px-2 py-1 text-xs">
                          {categoryDisplay}
                        </span>
                        <span className="text-xs text-[#EBECEB]/90">
                          {authorDisplay} | {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : query ? (
            <div className="text-center py-12 bg-[#1c1c1c] border border-[#333333]/50">
              <Search className="w-16 h-16 text-[#333333] mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-[#EBECEB]/90 max-w-lg mx-auto">
                We couldn't find any articles matching "{query}". Try different keywords or check for typos.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

// Search icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
} 