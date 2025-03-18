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

// Static articles data
const STATIC_ARTICLES: SearchResult[] = [
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
  },
  {
    id: "6",
    title: "Understanding Zero-Knowledge Proofs",
    slug: "understanding-zero-knowledge-proofs",
    publishedAt: "2023-10-10T12:00:00Z",
    category: { name: "Onchain" }
  },
  {
    id: "7",
    title: "The Rise of Decentralized Autonomous Organizations",
    slug: "rise-of-daos",
    publishedAt: "2023-11-22T12:00:00Z",
    category: { name: "Builder" }
  },
  {
    id: "8",
    title: "Blockchain Interoperability Solutions",
    slug: "blockchain-interoperability",
    publishedAt: "2023-12-05T12:00:00Z",
    category: { name: "Onchain" }
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

  // Function to filter results based on search query
  const filterResults = (query: string) => {
    if (!query || query.trim().length === 0) {
      return STATIC_ARTICLES.slice(0, 5); // Show 5 most recent articles by default
    }
    
    setIsSearching(true);
    
    // Simple filtering logic based on title match
    const filtered = STATIC_ARTICLES.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase())
    );
    
    setIsSearching(false);
    return filtered;
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchResults(filterResults(query));
  };

  // Initialize with default results
  useEffect(() => {
    setSearchResults(filterResults(""));
  }, []);

  // Effect to add keyboard shortcut for closing search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close search on Escape
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
          
          {/* Results count */}
          <p className="text-[#EBECEB]/90 text-sm mb-4 sticky top-0 bg-[#171717] py-2">
            {searchQuery ? 
              `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}` : 
              'Recent articles'}
          </p>
          
          {/* Simple list UI with titles */}
          {searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((article) => (
                <li key={article.id}>
                  <Link 
                    href={`/article/${article.slug}`}
                    onClick={onClose}
                    className="block p-3 hover:bg-[#EBECEB]/5 transition-colors"
                  >
                    <div className="text-[#EBECEB] font-medium">{article.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
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
        </div>
      </div>
    </div>
  );
} 