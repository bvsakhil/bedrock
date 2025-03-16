/**
 * Navigation bar component for the website
 * Includes logo, date, search, subscribe button, and mobile menu
 * Has scroll-aware behavior that changes appearance on scroll
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Menu, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { debounce } from "lodash"

// Define Post interface for search results
interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  publishedAt: string;
  image?: { url: string; alt?: string };
  heroImage?: {
    url: string;
    alt?: string;
    sizes?: {
      medium?: { url: string };
      [key: string]: any;
    };
    [key: string]: any;
  };
  category?: { name: string; title?: string };
  categories?: Array<{ title: string }>;
}

export function NavBar() {
  // State for tracking scroll position and UI states
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  
  // Search states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  // Get the CMS API URL from environment variables
  const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

  // Helper function to get full URL
  const getFullUrl = (url: string): string => {
    return url && url.startsWith('/api') ? `${CMS_API_URL}${url}` : url;
  };

  // Function to fetch search results
  const fetchSearchResults = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      // Build the search URL - search in both title and content with increased limit
      const searchUrl = `${CMS_API_URL}/api/posts?where[or][0][title][like]=${encodeURIComponent(query)}&where[or][1][content.root.children.text][like]=${encodeURIComponent(query)}&limit=20`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.docs) {
        setSearchResults(data.docs);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError("Failed to perform search. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Create a debounced version of the search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchSearchResults(query);
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Effect to track scroll position and update navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // Effect to add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      
      // Close search on Escape
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen]);

  // Format date for search results
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: "2-digit" 
    });
  };

  // Get image URL for search result
  const getResultImageUrl = (result: SearchResult) => {
    let imageUrl = "/placeholder.svg?height=80&width=120";
    
    if (result.heroImage?.url) {
      imageUrl = result.heroImage.url;
    } else if (result.heroImage?.sizes?.medium?.url) {
      imageUrl = result.heroImage.sizes.medium.url;
    } else if (result.image?.url) {
      imageUrl = result.image.url;
    }
    
    return getFullUrl(imageUrl);
  };

  // Get category for search result
  const getResultCategory = (result: SearchResult) => {
    if (result.categories && result.categories.length > 0) {
      return result.categories[0].title;
    }
    
    if (result.category?.title) {
      return result.category.title;
    }
    
    if (result.category?.name) {
      return result.category.name;
    }
    
    return "Article";
  };

  return (
    <header className="bg-[#1A1A1A] text-[#FFFFFF] sticky top-0 z-50">
      {/* Main navbar container with responsive padding and border */}
      <div
        className={`flex items-center justify-between px-4 sm:px-6 mx-2 sm:mx-4 mt-2 sm:mt-4 border-b border-[#333333]/50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3 sm:py-4"
        }`}
      >
        {/* Left section: Logo and date */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="font-black text-lg sm:text-xl tracking-wide text-[#FFFFFF] font-barlow italic">
            BE
          </Link>
          <span className="text-xs sm:text-sm text-[#E0E0E0]/90 hidden xs:inline">
            {new Date()
              .toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })
              .replace(",", " -")}
          </span>
        </div>

        {/* Center section: Main logo that fades out on scroll */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-300 sm:pr-0 pr-16 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        >
          <Link href="/" className="font-black italic text-2xl sm:text-4xl tracking-wide text-[#FFFFFF] font-barlow">
            BEDROCK
          </Link>
        </div>

        {/* Mobile view controls */}
        <div className="flex items-center gap-3 sm:hidden">
          {/* Search button */}
          <button
            className="p-2 hover:bg-[#FFFFFF]/5 rounded-none transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Search (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>
          {/* Subscribe button */}
          <button
            className="inline-flex px-3 py-1 rounded-none border border-[#333333]/50 text-xs text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#1A1A1A] transition-colors"
            onClick={() => setSubscribeOpen(true)}
          >
            Subscribe
          </button>
          {/* Mobile menu sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-[#FFFFFF]/5 rounded-none transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] bg-[#1A1A1A] border-l border-[#333333]/50 p-0">
              <div className="flex flex-col py-8 px-4 gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#E0E0E0]/90">New York : -4.9°C</span>
                </div>
                {/* Mobile links */}
                <nav className="flex flex-col gap-4 mt-4">
                  <Link
                    href="/builders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-3 text-[#E0E0E0]/90 hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5 transition-colors border-b border-[#333333]/50"
                  >
                    Builders
                  </Link>
                  <Link
                    href="/consumer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-3 text-[#E0E0E0]/90 hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5 transition-colors border-b border-[#333333]/50"
                  >
                    Consumer
                  </Link>
                  <Link
                    href="/onchain"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-3 text-[#E0E0E0]/90 hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5 transition-colors"
                  >
                    Onchain
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-6">
          <span className="text-sm text-[#E0E0E0]/90">New York : -4.9°C</span>
          {/* Desktop search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-[#FFFFFF]/5 rounded-none transition-colors"
            aria-label="Search (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>
          {/* Desktop subscribe button */}
          <button
            onClick={() => setSubscribeOpen(true)}
            className="inline-flex px-5 py-1.5 rounded-none border border-[#333333]/50 text-sm text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#1A1A1A] transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Search Overlay - Appears when search is clicked */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm z-50 flex items-start justify-center pt-10 sm:pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#1A1A1A] border border-[#333333]/50 p-4 animate-in fade-in duration-300 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input field */}
            <div className="flex items-center gap-4 sticky top-0 bg-[#1A1A1A] py-2">
              <Search className="w-5 h-5 text-[#E0E0E0]/90" />
              <input
                type="text"
                placeholder="Search articles..."
                className="flex-1 bg-transparent border-none outline-none text-[#FFFFFF] placeholder:text-[#E0E0E0]/90 text-lg"
                autoFocus
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-[#FFFFFF]/5 rounded-none transition-colors"
              >
                <span className="text-[#E0E0E0]/90 hover:text-[#FFFFFF]">ESC</span>
              </button>
            </div>
            
            {/* Search results section */}
            <div className="mt-6 border-t border-[#333333]/50 pt-4 overflow-y-auto">
              {/* Loading indicator */}
              {isSearching && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 text-[#E0E0E0]/90 animate-spin" />
                </div>
              )}
              
              {/* Error message */}
              {searchError && (
                <div className="text-red-400 text-sm py-2">{searchError}</div>
              )}
              
              {/* Search results */}
              {!isSearching && searchQuery.length >= 2 && (
                <>
                  <p className="text-[#E0E0E0]/90 text-sm mb-4 sticky top-0 bg-[#1A1A1A] py-2">
                    {searchResults.length > 0 
                      ? `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
                      : 'No results found'}
                  </p>
                  
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((result) => (
                        <Link 
                          key={result.id} 
                          href={`/article/${result.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex gap-4 hover:bg-[#FFFFFF]/5 p-3 transition-colors"
                        >
                          {/* Result thumbnail */}
                          <div className="relative w-20 h-16 flex-shrink-0 bg-[#333333]">
                            <Image
                              src={getResultImageUrl(result)}
                              alt={result.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          
                          {/* Result content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[#FFFFFF] font-medium text-base mb-1 truncate">{result.title}</h4>
                            {(result.excerpt || result.description) && (
                              <p className="text-xs text-[#E0E0E0]/90 mb-2 line-clamp-1">
                                {result.excerpt || result.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-[#FFFFFF] text-[#1A1A1A] px-2 py-0.5">
                                {getResultCategory(result)}
                              </span>
                              <span className="text-xs text-[#E0E0E0]/90">
                                {formatDate(result.publishedAt)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Search className="w-12 h-12 text-[#333333] mb-4" />
                      <h3 className="text-[#FFFFFF] text-lg font-medium mb-2">No results found</h3>
                      <p className="text-[#E0E0E0]/90 text-sm max-w-md">
                        We couldn't find any articles matching "{searchQuery}". 
                        Try different keywords or check for typos.
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {/* Initial state or short query */}
              {!isSearching && searchQuery.length < 2 && (
                <p className="text-[#E0E0E0]/90 text-sm py-4">
                  Type at least 2 characters to search
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Bottom Sheet - Appears when subscribe is clicked */}
      <Sheet open={subscribeOpen} onOpenChange={setSubscribeOpen}>
        <SheetContent
          side="bottom"
          className="bg-[#1A1A1A] border-t border-[#333333]/50 rounded-t-xl max-w-full sm:max-w-lg sm:mx-auto"
        >
          <div className="py-6 px-4 sm:px-6">
            {/* Visual handle for bottom sheet */}
            <div className="w-12 h-1 bg-[#FFFFFF]/20 rounded-full mx-auto mb-6 sm:mb-8"></div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Join BEDROCK</h2>
            <p className="text-[#E0E0E0]/90 mb-6 text-sm sm:text-base">
              Subscribe to our newsletter to receive the latest updates on builders, consumer tech, and onchain
              developments.
            </p>
            {/* Subscribe form */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent border border-[#333333]/50 p-3 text-[#FFFFFF] placeholder:text-[#E0E0E0]/90 focus:outline-none focus:border-[#FFFFFF]/50"
              />
              <button className="w-full bg-[#FFFFFF] text-[#1A1A1A] py-3 hover:bg-[#FFFFFF]/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

