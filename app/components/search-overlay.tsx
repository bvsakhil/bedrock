"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Loader2 } from "lucide-react"
import { debounce } from "lodash"
import { searchPosts } from "../page"

// Define Post interface for search results
interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  publishedAt: string;
  category?: { 
    name?: string; 
    title?: string;
    slug?: string;
  };
  categories?: Array<{ 
    title?: string; 
    name?: string;
    slug?: string;
  }>;
  description?: string;
  excerpt?: string;
  meta?: {
    title?: string;
    description?: string;
  };
  author?: { name: string };
  authors?: Array<{ id: number | string; name: string; email?: string }>;
  populatedAuthors?: Array<{ id: number | string; name: string }>;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  // Search states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  // Function to fetch search results
  const fetchSearchResults = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      // Use the centralized searchPosts function
      const { docs, error } = await searchPosts(query, 10);
      
      if (error) {
        throw new Error(error);
      }
      
      setSearchResults(docs);
    } catch (error) {
      console.error('Search error:', error);
      let errorMessage = "Failed to perform search. Please try again.";
      
      // If we have a more specific error message, display it
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSearchError(errorMessage);
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
    console.log("Search input changed:", query);
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Effect to add keyboard shortcut for closing search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close search on Escape
      if (e.key === 'Escape' && isOpen) {
        console.log("Escape key pressed, closing search overlay");
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Helper function to get author names from post
  function getAuthorNames(post: SearchResult): string[] {
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

  // Format date for search results
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: "2-digit" 
    });
  };

  // Get category for search result
  const getResultCategory = (result: SearchResult) => {
    // First check for category.title
    if (result.category?.title) {
      return result.category.title;
    }
    
    // Then check for category.name
    if (result.category?.name) {
      return result.category.name;
    }
    
    // Check for categories array - use th/api/posts?where[title][contains]=keywordst one
    if (result.categories && result.categories.length > 0) {
      if (result.categories[0].title) {
        return result.categories[0].title;
      }
      if (result.categories[0].name) {
        return result.categories[0].name;
      }
    }
    
    return "Article";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#171717]/80 backdrop-blur-sm z-50 flex items-start justify-center pt-10 sm:pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#171717] border border-[#333333]/50 p-4 animate-in fade-in duration-300 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input field */}
        <div className="flex items-center gap-4 sticky top-0 bg-[#171717] py-2">
          <Search className="w-5 h-5 text-[#EBECEB]/90" />
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 bg-transparent border-none outline-none text-[#EBECEB] placeholder:text-[#EBECEB]/90 text-lg"
            autoFocus
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#EBECEB]/5 rounded-none transition-colors"
          >
            <span className="text-[#EBECEB]/90 hover:text-[#EBECEB]">ESC</span>
          </button>
        </div>
        
        {/* Search results section */}
        <div className="mt-2 pt-2 overflow-y-auto">
          {/* Loading indicator */}
          {isSearching && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 text-[#EBECEB]/90 animate-spin" />
            </div>
          )}
          
          {/* Error message */}
          {searchError && (
            <div className="text-red-400 text-sm py-2">{searchError}</div>
          )}
          
          {/* Search results */}
          {!isSearching && searchQuery.length >= 2 && (
            <>
              <p className="text-[#EBECEB]/90 text-sm mb-2 sticky top-0 bg-[#171717] py-1">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
                  : 'No results found'}
              </p>
              
              {searchResults.length > 0 ? (
                <div className="divide-y divide-[#333333]/50">
                  {searchResults.map((result) => (
                    <Link 
                      key={result.id} 
                      href={`/article/${result.slug}`}
                      onClick={onClose}
                      className="flex gap-4 hover:bg-[#EBECEB]/5 p-3 transition-colors block"
                    >
                      {/* Result content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#EBECEB] font-medium text-base mb-1">{result.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-[#EBECEB] text-[#171717] px-2 py-0.5">
                            {getResultCategory(result)}
                          </span>
                          <span className="text-xs text-[#EBECEB]/90">
                            {getAuthorNames(result).join(', ') || 'Anonymous'} | {formatDate(result.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Search className="w-12 h-12 text-[#333333] mb-4" />
                  <h3 className="text-[#EBECEB] text-lg font-medium mb-2">No results found</h3>
                  <p className="text-[#EBECEB]/90 text-sm max-w-md">
                    We couldn't find any articles matching "{searchQuery}".
                  </p>
                </div>
              )}
            </>
          )}
          
         
        </div>
      </div>
    </div>
  )
} 