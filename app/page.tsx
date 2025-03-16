/**
 * Homepage component that displays the main content of the website
 * Includes hero section, banner, and editorial content
 */
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { NavBar } from "./components/nav-bar"
import { cache } from 'react'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Get the CMS API URL from environment variables
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Define Post interface
interface Post {
  id: string | number;
  title: string;
  excerpt?: string;
  description?: string;
  content?: {
    root: {
      children: any[];
      [key: string]: any;
    };
    [key: string]: any;
  };
  image?: { url: string; alt?: string };
  heroImage?: {
    url: string;
    alt?: string;
    sizes?: {
      medium?: { url: string };
      large?: { url: string };
      og?: { url: string };
      [key: string]: any;
    };
    [key: string]: any;
  };
  category?: { 
    title?: string; 
    name?: string;
    slug?: string;
  };
  categories?: Array<{ 
    title?: string; 
    name?: string;
    slug?: string;
  }>;
  author?: { name: string };
  authors?: Array<{ id: number | string; name: string; email?: string }>;
  populatedAuthors?: Array<{ id: number | string; name: string }>;
  publishedAt: string;
  slug: string;
  _status?: string;
  featured?: boolean;
  isSpotlight?: boolean;
}

// Define Page interface
interface Page {
  id: string;
  title: string;
  slug: string;
  hero?: {
    title?: string;
    description?: string;
    image?: { url: string; alt?: string };
  };
  bannerText?: string;
}

// Define Category interface
interface Category {
  id: string | number;
  title: string;
  slug: string;
  parent?: any;
  breadcrumbs?: Array<{
    id: string;
    doc: number;
    url: string;
    label: string;
  }>;
  updatedAt?: string;
  createdAt?: string;
}

// Helper function to get full URL
function getFullUrl(url: string): string {
  return url && url.startsWith('/api') ? `${CMS_API_URL}${url}` : url;
}

// Helper function to get author names from post
function getAuthorNames(post: Post): string[] {
  if (post.populatedAuthors && post.populatedAuthors.length > 0) {
    return post.populatedAuthors.map(author => author.name);
  }
  
  if (post.authors && post.authors.length > 0) {
    return post.authors.map(author => author.name);
  }
  
  if (post.author && post.author.name) {
    return [post.author.name];
  }
  
  return [];
}

// Create a reusable function to fetch posts
const getPosts = cache(async (categorySlug?: string) => {
  try {
    // Build the URL with optional category filter
    let url = `${CMS_API_URL}/api/posts?limit=6&sort=-publishedAt`;
    
    // Add category filter if provided
    if (categorySlug) {
      // Filter by category relationship - this format depends on how your relationships are set up in Payload
      url += `&where[categories.slug][equals]=${categorySlug}`;
    }
    
    console.log('Fetching posts with URL:', url);
    
    // Fetch posts from the CMS
    const response = await fetch(url, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      return { error: `Failed to fetch posts: ${response.status} ${response.statusText}`, docs: [] }
    }
    
    const data = await response.json()
    
    // Check if we got any posts back
    if (!data.docs) {
      return { error: 'Invalid response format from API', docs: [] }
    }
    
    console.log(`Fetched ${data.docs.length} posts`);
    return { docs: data.docs, error: null } // PayloadCMS returns paginated results with a 'docs' array
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { error: 'Failed to fetch posts. Please try again later.', docs: [] }
  }
})

// Get featured post for hero section
const getFeaturedPost = cache(async () => {
  try {
    // First try to get a post with isSpotlight=true
    let response = await fetch(`${CMS_API_URL}/api/posts?where[isSpotlight][equals]=true&limit=1`, {
      next: { revalidate: 60 }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.docs && data.docs.length > 0) {
        console.log('Found spotlight post:', data.docs[0].title)
        return { post: data.docs[0], error: null }
      }
    }
    
    console.warn(`Spotlight post query failed or returned no results. Falling back to featured post.`)
    
    // Try to get a post with featured=true
    response = await fetch(`${CMS_API_URL}/api/posts?where[featured][equals]=true&limit=1`, {
      next: { revalidate: 60 }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.docs && data.docs.length > 0) {
        console.log('Found featured post:', data.docs[0].title)
        return { post: data.docs[0], error: null }
      }
    }
    
    console.warn(`Featured post query failed or returned no results. Falling back to latest post.`)
    
    // Try to get the most recent post instead
    response = await fetch(`${CMS_API_URL}/api/posts?sort=-publishedAt&limit=1`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) {
      return { error: `Failed to fetch any posts: ${response.status} ${response.statusText}`, post: null }
    }
    
    const data = await response.json()
    
    // Check if we got any posts back
    if (!data.docs || data.docs.length === 0) {
      return { error: 'No posts found', post: null }
    }
    
    console.log('Using latest post as fallback:', data.docs[0].title)
    return { post: data.docs[0], error: null } // Return the first post
  } catch (error) {
    console.error('Error fetching featured post:', error)
    return { error: 'Failed to fetch featured post. Please try again later.', post: null }
  }
})

// Get homepage data from Pages collection
const getHomepage = cache(async () => {
  try {
    // Try to get the homepage from the Pages collection
    const response = await fetch(`${CMS_API_URL}/api/pages?where[slug][equals]=home`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) {
      console.warn(`Homepage fetch failed: ${response.status} ${response.statusText}. Falling back to featured post.`);
      return { page: null, error: null }; // We'll fall back to featured post
    }
    
    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      return { page: null, error: null };
    }
    
    return { page: data.docs[0], error: null };
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return { page: null, error: 'Failed to fetch homepage data' };
  }
})

// Function to fetch all categories
const getCategories = cache(async () => {
  try {
    const response = await fetch(`${CMS_API_URL}/api/categories?limit=100`, {
      next: { revalidate: 60 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      return { categories: [], error: `Failed to fetch categories: ${response.status} ${response.statusText}` };
    }
    
    const data = await response.json();
    
    if (!data.docs) {
      return { categories: [], error: 'Invalid response format from API' };
    }
    
    console.log('Categories fetched:', data.docs);
    return { categories: data.docs as Category[], error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [], error: 'Failed to fetch categories' };
  }
});

export default async function Home({ searchParams }: { searchParams: { category?: string } }) {
  // Get the selected category from URL params
  const selectedCategory = (await Promise.resolve(searchParams.category)) || 'all';
  
  // Fetch categories first to get the slug if needed
  const categoriesResult = await getCategories();
  const { categories, error: categoriesError } = categoriesResult;
  
  // Find the matching category to get its slug
  const matchingCategory = categories.find(cat => cat.title === selectedCategory);
  const categorySlug = selectedCategory !== 'all' ? matchingCategory?.slug : undefined;
  
  // Fetch posts, featured post, and homepage in parallel
  const [postsResult, featuredResult, homepageResult] = await Promise.all([
    getPosts(categorySlug),
    getFeaturedPost(),
    getHomepage()
  ]);
  
  const { docs: posts, error: postsError } = postsResult;
  const { post: featuredPost, error: featuredError } = featuredResult;
  const { page: homepage, error: homepageError } = homepageResult;
  
  console.log('Categories in Home component:', categories);
  console.log('Selected category:', selectedCategory);
  console.log('Category slug:', categorySlug);
  console.log('Posts count:', posts?.length || 0);
  
  // Filter posts by category if a category is selected and we didn't filter at the API level
  const filteredPosts = selectedCategory === 'all' || !categorySlug
    ? posts 
    : posts;
  
  // Use homepage hero if available, otherwise fall back to featured post
  const heroContent = homepage?.hero ? {
    title: homepage.hero.title || homepage.title,
    description: homepage.hero.description || 'Explore our latest featured content and stay updated with the newest trends and insights.',
    image: homepage.hero.image?.url,
    imageAlt: homepage.hero.image?.alt || homepage.title,
    slug: 'about', // Link to about page or another appropriate page
    isSpotlight: false // Homepage hero is not a spotlight
  } : featuredPost ? {
    title: featuredPost.title,
    description: featuredPost.description || featuredPost.excerpt || 'Read our featured article to discover the latest insights and trends in the industry.',
    image: featuredPost.heroImage?.url || featuredPost.image?.url,
    imageAlt: featuredPost.heroImage?.alt || featuredPost.title,
    slug: featuredPost.slug,
    isSpotlight: featuredPost.isSpotlight || false // Use the isSpotlight flag from the post
  } : null;

  // Get the full image URL if it's a relative path
  const heroImageUrl = heroContent?.image ? getFullUrl(heroContent.image) : "/placeholder.svg?height=500&width=1200";
  
  return (
    <main className="min-h-screen bg-[#000000] text-[#ffffff]">
      {/* Navigation bar component */}
      <NavBar />

      {/* Error messages */}
      {(postsError || featuredError || homepageError || categoriesError) && (
        <div className="bg-red-500 text-white p-4 m-4">
          {postsError && <p>{postsError}</p>}
          {featuredError && <p>{featuredError}</p>}
          {homepageError && <p>{homepageError}</p>}
          {categoriesError && <p>{categoriesError}</p>}
        </div>
      )}

      {/* Hero Section - Featured article with large image */}
      {heroContent ? (
      <section className="relative mx-2 sm:mx-4 my-2 sm:my-4 border border-[#69696a]/50">
          <Link href={`/article/${heroContent.slug}`} className="block group cursor-pointer">
          {/* Hero image with hover zoom effect */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
              <Image
                src={heroImageUrl}
                alt={heroContent.imageAlt}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent"></div>
          </div>

          {/* Hero content */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  {heroContent.title}
              </h2>
              <p className="text-sm sm:text-base text-[#8d8d8d] mb-4 sm:mb-6 font-ptserif">
                  {heroContent.description}
              </p>
            </div>
          </div>

          {/* Article metadata footer */}
          <div className="mt-auto border-t border-[#69696a]/50 flex items-center">
            <div className="bg-[#ffffff] px-3 sm:px-4 py-1">
              <span className="text-xs text-[#1e1e1e] leading-none">
                {heroContent.isSpotlight ? "Spotlight" : "Featured"}
              </span>
            </div>
            <div className="px-3 sm:px-4 py-1 ml-auto">
                <span className="text-xs text-[#8d8d8d] leading-none">
                  {featuredPost ? 
                    `${getAuthorNames(featuredPost).join(', ') || 'Editorial'} | ${new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "2-digit" })}` : 
                    'Editorial | ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "2-digit" })
                  }
                </span>
            </div>
          </div>
        </Link>
      </section>
      ) : null}

      {/* Banner - Animated marquee text with Base logo */}
      <section className="border-t border-b border-[#69696a]/50">
        <div className="py-3 sm:py-4 overflow-hidden bg-[#2151f5]">
          <div className="whitespace-nowrap text-xl sm:text-2xl md:text-4xl font-bold text-[#ffffff]">
            <div className="inline-block animate-marquee">
              {homepage?.bannerText || "indie media that tracks and boosts real businesses on"}{" "}
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
              — {homepage?.bannerText || "indie media that tracks and boosts real businesses on"}{" "}
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
              — {homepage?.bannerText || "indie media that tracks and boosts real businesses on"}{" "}
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
              <Link 
                href="/"
                className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'all' ? 'bg-[#ffffff] text-[#1e1e1e]' : 'bg-transparent border border-[#69696a]/50 text-[#ffffff]'} rounded-none text-sm`}
              >
                All
              </Link>
              
              {categories && categories.length > 0 && (
                <>
                  {categories.map((category: Category) => (
                    <Link
                      key={category.id}
                      href={`/?category=${encodeURIComponent(category.title)}`}
                      className={`px-3 sm:px-4 py-1.5 ${selectedCategory === category.title ? 'bg-[#ffffff] text-[#1e1e1e]' : 'bg-transparent border border-[#69696a]/50 text-[#ffffff]'} rounded-none text-sm`}
                    >
                      {category.title}
                    </Link>
                  ))}
                </>
              )}
              
              {/* Fallback categories if API fails */}
              {(!categories || categories.length === 0) && (
                <>
                  <Link 
                    href="/?category=Consumer"
                    className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'Consumer' ? 'bg-[#ffffff] text-[#1e1e1e]' : 'bg-transparent border border-[#69696a]/50 text-[#ffffff]'} rounded-none text-sm`}
                  >
                Consumer
                  </Link>
                  <Link 
                    href="/?category=Onchain"
                    className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'Onchain' ? 'bg-[#ffffff] text-[#1e1e1e]' : 'bg-transparent border border-[#69696a]/50 text-[#ffffff]'} rounded-none text-sm`}
                  >
                Onchain
                  </Link>
                  <Link 
                    href="/?category=Builder"
                    className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'Builder' ? 'bg-[#ffffff] text-[#1e1e1e]' : 'bg-transparent border border-[#69696a]/50 text-[#ffffff]'} rounded-none text-sm`}
                  >
                Builder
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Grid of article cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post: Post) => {
                // Get image URL - first try heroImage, then check all possible sizes
                let postImageUrl;
                
                if (post.heroImage) {
                  // First try the main URL
                  if (post.heroImage.url) {
                    postImageUrl = post.heroImage.url;
                  } 
                  // Then check sizes in order of preference
                  else if (post.heroImage.sizes) {
                    const sizes = post.heroImage.sizes;
                    postImageUrl = sizes.medium?.url || sizes.small?.url || 
                                  sizes.thumbnail?.url || sizes.og?.url || 
                                  sizes.large?.url || sizes.xlarge?.url;
                  }
                }
                
                // If no heroImage, try regular image
                if (!postImageUrl && post.image?.url) {
                  postImageUrl = post.image.url;
                }
                
                // Fallback to placeholder
                if (!postImageUrl) {
                  postImageUrl = "/placeholder.svg?height=300&width=400";
                }
                
                // Get full URL with domain if needed
                const fullPostImageUrl = getFullUrl(postImageUrl);
                
                console.log(`Post ${post.title} image URL: ${fullPostImageUrl}`);
                
                // Get category name with fallback
                let postCategoryName = 'Article';
                if (post.category?.title) {
                  postCategoryName = post.category.title;
                } else if (post.category?.name) {
                  postCategoryName = post.category.name;
                } else if (post.categories && post.categories.length > 0) {
                  if (post.categories[0].title) {
                    postCategoryName = post.categories[0].title;
                  } else if (post.categories[0].name) {
                    postCategoryName = post.categories[0].name;
                  }
                }
                
                // Get author names
                const postAuthorNames = getAuthorNames(post);
                const postAuthorDisplay = postAuthorNames.length > 0 ? postAuthorNames.join(', ') : 'Anonymous';
                
                return (
                  <ArticleCard 
                    key={post.id}
                    title={post.title}
                    description={post.description || post.excerpt || 'Read more about this article...'}
                    image={fullPostImageUrl}
                    category={postCategoryName}
                    author={postAuthorDisplay}
                    date={new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "2-digit" })}
                    slug={post.slug}
                  />
                );
              })
            ) : !postsError ? (
              <div className="col-span-full text-center py-10">
                <p>No articles found{selectedCategory !== 'all' ? ` in category "${selectedCategory}"` : ''}.</p>
              </div>
            ) : null}
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
            src={image}
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
          <p className="text-sm sm:text-base text-[#8d8d8d] leading-relaxed font-ptserif line-clamp-1 min-h-[1.5rem]">{description}</p>
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

