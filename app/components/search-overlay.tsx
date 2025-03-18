"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Loader2 } from "lucide-react"
import { debounce } from "lodash"

// Define Post interface for search results
interface SearchResult {
  id: string | number;
  title: string;
  slug: string;
  publishedAt: string;
  category?: { name: string; title?: string };
}

// Mock data for search results
const MOCK_ARTICLES: SearchResult[] = [
  {
    id: "1",
    title: "The Future of Blockchain Technology",
    slug: "future-of-blockchain",
    publishedAt: "2023-11-15T12:00:00Z",
    category: { name: "Onchain" }
  },
  {
    id: "2",
    title: "Web3 Development Best Practices",
    slug: "web3-development-best-practices",
    publishedAt: "2023-12-01T12:00:00Z",
    category: { name: "Builder" }
  },
  {
    id: "3",
    title: "NFT Market Trends in 2023",
    slug: "nft-market-trends-2023",
    publishedAt: "2023-10-20T12:00:00Z",
    category: { name: "Consumer" }
  },
  {
    id: "4",
    title: "Decentralized Finance Revolution",
    slug: "defi-revolution",
    publishedAt: "2023-09-05T12:00:00Z",
    category: { name: "Onchain" }
  },
  {
    id: "5",
    title: "Building Community in Web3",
    slug: "building-community-web3",
    publishedAt: "2023-08-12T12:00:00Z",
    category: { name: "Builder" }
  }
];

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Filter mock data based on title
      const filteredResults = MOCK_ARTICLES.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      
      console.log("Search query:", query);
      console.log("Filtered results:", filteredResults);
      
      setSearchResults(filteredResults);
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
    if (result.category?.title) {
      return result.category.title;
    }
    
    if (result.category?.name) {
      return result.category.name;
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
        <div className="mt-6 border-t border-[#333333]/50 pt-4 overflow-y-auto">
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
              <p className="text-[#EBECEB]/90 text-sm mb-4 sticky top-0 bg-[#171717] py-2">
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
                      onClick={onClose}
                      className="flex gap-4 hover:bg-[#EBECEB]/5 p-3 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* Result content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#EBECEB] font-medium text-base mb-1">{result.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-[#EBECEB] text-[#171717] px-2 py-0.5">
                            {getResultCategory(result)}
                          </span>
                          <span className="text-xs text-[#EBECEB]/90">
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
                  <h3 className="text-[#EBECEB] text-lg font-medium mb-2">No results found</h3>
                  <p className="text-[#EBECEB]/90 text-sm max-w-md">
                    We couldn't find any articles matching "{searchQuery}". 
                    Try different keywords or check for typos.
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* Initial state or short query */}
          {!isSearching && searchQuery.length < 2 && (
            <p className="text-[#EBECEB]/90 text-sm py-4">
              Type at least 2 characters to search
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 