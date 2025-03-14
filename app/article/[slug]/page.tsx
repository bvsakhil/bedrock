/**
 * Article page component that displays a single article
 * Uses dynamic routing with [slug] parameter to determine which article to display
 */
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NavBar } from "@/app/components/nav-bar"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Get the CMS API URL from environment variables
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Define Post interface
interface Post {
  id: string | number;
  title: string;
  excerpt?: string;
  content: {
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
  category?: { name: string };
  categories?: Array<{ name: string }>;
  author?: { name: string };
  authors?: Array<{ id: number | string; name: string; email?: string }>;
  populatedAuthors?: Array<{ id: number | string; name: string }>;
  publishedAt: string;
  slug: string;
  _status?: string;
}

/**
 * Fetch a post by slug from the CMS
 */
async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${CMS_API_URL}/api/posts?where[slug][equals]=${slug}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      return null;
    }

    // Log the post data to debug
    console.log('Post data:', JSON.stringify(data.docs[0], null, 2));
    
    return data.docs[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

/**
 * Generate dynamic metadata for each article based on its content
 * This improves SEO by providing article-specific metadata
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  // Handle case where article doesn't exist
  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    }
  }

  // Get author names
  const authorNames = getAuthorNames(post);

  // Return article-specific metadata
  return {
    title: post.title,
    description: post.excerpt,
    authors: authorNames.length > 0 ? authorNames.map(name => ({ name })) : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: authorNames.length > 0 ? authorNames : undefined,
      images: post.heroImage?.url ? [
        {
          url: getFullUrl(post.heroImage.url),
          width: 1200,
          height: 630,
          alt: post.heroImage.alt || post.title,
        },
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.heroImage?.url ? [getFullUrl(post.heroImage.url)] : undefined,
    },
    alternates: {
      canonical: `https://bedrock.media/article/${params.slug}`,
    },
  }
}

/**
 * Helper function to get full URL
 */
function getFullUrl(url: string): string {
  return url && url.startsWith('/api') ? `${CMS_API_URL}${url}` : url;
}

/**
 * Helper function to get author names from post
 */
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

/**
 * Article page component that displays a single article based on the slug parameter
 * Includes navigation, article content, and metadata
 */
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  // If post not found, show 404 page
  if (!post) {
    notFound();
  }

  // Extract the image URL correctly - check heroImage first, then fallback
  const imageUrl = post.heroImage?.url || 
                  (post.heroImage?.sizes?.large?.url || 
                   post.heroImage?.sizes?.medium?.url || 
                   post.heroImage?.sizes?.og?.url) ||
                  post.image?.url || 
                  "/placeholder.svg?height=600&width=1200";
  
  // Get the full image URL if it's a relative path
  const fullImageUrl = getFullUrl(imageUrl);

  // Get category name
  const categoryName = post.category?.name || 
                      (post.categories && post.categories.length > 0 ? post.categories[0].name : 'Article');

  // Get author names
  const authorNames = getAuthorNames(post);
  const authorDisplay = authorNames.length > 0 ? authorNames.join(', ') : 'Anonymous';

  // Convert Lexical content to HTML
  const renderLexicalContent = (content: any) => {
    if (!content || !content.root || !content.root.children) {
      return '<p>No content available</p>';
    }

    let html = '';
    
    // Process each node in the Lexical structure
    content.root.children.forEach((node: any) => {
      if (node.type === 'paragraph') {
        // Handle paragraph nodes
        let paragraphContent = '';
        if (node.children && node.children.length > 0) {
          node.children.forEach((textNode: any) => {
            if (textNode.text) {
              // Apply formatting
              let text = textNode.text;
              if (textNode.format === 1) { // Bold
                text = `<strong>${text}</strong>`;
              } else if (textNode.format === 2) { // Italic
                text = `<em>${text}</em>`;
              } else if (textNode.format === 3) { // Bold + Italic
                text = `<strong><em>${text}</em></strong>`;
              }
              paragraphContent += text;
            }
          });
        }
        html += `<p>${paragraphContent}</p>`;
      } else if (node.type === 'horizontalrule') {
        // Handle horizontal rule
        html += '<hr />';
      } else if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') {
        // Handle media blocks
        const media = node.fields.media;
        if (media && media.url) {
          const mediaUrl = media.url.startsWith('/api') 
            ? `${CMS_API_URL}${media.url}` 
            : media.url;
          html += `<figure class="my-8">
            <img src="${mediaUrl}" alt="${media.alt || ''}" class="w-full h-auto" />
            ${media.caption ? `<figcaption class="text-sm text-gray-400 mt-2">${media.caption}</figcaption>` : ''}
          </figure>`;
        }
      }
    });
    
    return html;
  };

  // Generate HTML from the Lexical content
  const contentHtml = renderLexicalContent(post.content);

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            {/* Article metadata header - category, author, date */}
            <div className="border border-[#69696a]/50 flex items-center mb-6">
              <div className="bg-[#ffffff] px-3 sm:px-4 py-1">
                <span className="text-xs text-[#1e1e1e] leading-none">{categoryName}</span>
              </div>
              <div className="px-3 sm:px-4 py-1 ml-auto">
                <span className="text-xs text-[#8d8d8d] leading-none">
                  {authorDisplay} | {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Article featured image */}
            <div className="relative h-[200px] sm:h-[300px] md:h-[400px] mb-6 sm:mb-8 overflow-hidden">
              <Image
                src={fullImageUrl}
                alt={post.heroImage?.alt || post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            {/* Article content */}
            <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
              {/* Article description/summary */}
              {post.excerpt && (
                <p className="text-base sm:text-lg text-[#8d8d8d] mb-4 sm:mb-6 font-ptserif">{post.excerpt}</p>
              )}
              
              {/* Article body content */}
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}

