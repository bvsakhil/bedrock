/**
 * Navigation bar component for the website
 * Includes logo, date, search, subscribe button, and mobile menu
 * Has scroll-aware behavior that changes appearance on scroll
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchOverlay } from "./search-overlay"
import { toast } from "sonner";

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

export function NavBar() {
  // State for tracking scroll position and UI states
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState("");

  // Handle search button click
  const handleSearchButtonClick = () => {
    console.log("Search button clicked, opening search overlay");
    setSearchOpen(true);
  };

  // Handle search close
  const handleSearchClose = () => {
    console.log("Closing search overlay");
    setSearchOpen(false);
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
        console.log("Keyboard shortcut detected, opening search overlay");
        setSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch(`${CMS_API_URL}api/subscribers/subscribe`, {
        method: "POST",
        body: JSON.stringify({ maile:email } )
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Subscription failed.");
      }

      const data = await res.json();
      if(data.message == "Subscribed!"){
        toast.success("You're subscribed! 🎉");
      }
      else{
        toast.info(data.message);
      }
  
      
      setEmail("");
      setSubscribeOpen(false); // Optional: close the bottom sheet
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <header className="bg-[#171717] text-[#EBECEB] sticky top-0 z-50">
      {/* Main navbar container without border */}
      <div className="container mx-auto">
        <div
          className={`flex items-center justify-between px-4 sm:px-6 mt-2 sm:mt-4 transition-all duration-300 ${
            scrolled ? "py-2" : "py-3 sm:py-4"
          }`}
        >
          {/* Left section: Logo and date */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center">
              <svg width="36" height="30" viewBox="0 0 36 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_166_2)">
                  <path d="M6.7356 8.92181L16.3213 1.82408L22.2347 6.24206L12.3124 13.2674L6.7356 8.92181Z" fill="white"/>
                  <path d="M22.2348 6.24209L35.706 16.1644L31.6502 19.2063L18.2514 9.06664L22.2348 6.24209Z" fill="white"/>
                  <path d="M29.0669 21.3727L19.4812 28.4705L13.5678 24.0525L23.4901 17.0272L29.0669 21.3727Z" fill="white"/>
                  <path d="M13.5677 24.0525L0.0964789 14.1302L4.15233 11.0883L17.5511 21.228L13.5677 24.0525Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_166_2">
                    <rect width="35.8025" height="29" fill="white" transform="translate(0 0.5)"/>
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <span className="text-xs sm:text-sm text-[#EBECEB]/90 hidden xs:inline">
              {new Date()
                .toLocaleString("en-US", {
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(" at ", " - ")}
            </span>
          </div>

          {/* Center section: Main logo that fades out on scroll */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-300 sm:pr-0 pr-16 ${
              scrolled ? "opacity-0" : "opacity-100"
            } hidden sm:block`}
          >
            <Link href="/" className="font-black italic text-2xl sm:text-4xl tracking-wide text-[#EBECEB] font-barlow">
              BEDROCK
            </Link>
          </div>

          {/* Mobile view controls */}
          <div className="flex items-center gap-3 sm:hidden">
            {/* Search button */}
            <button
              className="p-2 hover:bg-[#EBECEB]/5 rounded-none transition-colors"
              onClick={handleSearchButtonClick}
              aria-label="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>
            {/* Subscribe button */}
            <button
              className="inline-flex px-3 py-1 rounded-none border border-[#333333]/50 text-xs text-[#EBECEB] hover:bg-[#EBECEB] hover:text-[#171717] transition-colors"
              onClick={() => setSubscribeOpen(true)}
            >
              Subscribe
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-sm text-[#EBECEB]/90">New York : -4.9°C</span>
            {/* Desktop search button */}
            <button
              onClick={handleSearchButtonClick}
              className="p-2 hover:bg-[#EBECEB]/5 rounded-none transition-colors"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>
            {/* Desktop subscribe button */}
            <button
              onClick={() => setSubscribeOpen(true)}
              className="inline-flex px-5 py-1.5 rounded-none border border-[#333333]/50 text-sm text-[#EBECEB] hover:bg-[#EBECEB] hover:text-[#171717] transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      {/* Full width border */}
      <div className="border-b border-[#333333]/50"></div>

      {/* Search Overlay Component */}
      <SearchOverlay isOpen={searchOpen} onClose={handleSearchClose} />

      {/* Subscribe Bottom Sheet - Appears when subscribe is clicked */}
      <Sheet open={subscribeOpen} onOpenChange={setSubscribeOpen}>
        <SheetContent
          side="bottom"
          className="bg-[#171717] border-t border-[#333333]/50 rounded-t-xl max-w-full sm:max-w-lg sm:mx-auto"
        >
          <div className="py-6 px-4 sm:px-6">
            {/* Visual handle for bottom sheet */}
            <div className="w-12 h-1 bg-[#EBECEB]/20 rounded-full mx-auto mb-6 sm:mb-8"></div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Join BEDROCK</h2>
            <p className="text-[#EBECEB]/90 mb-6 text-sm sm:text-base">
              Subscribe to our newsletter to receive the latest updates on builders, consumer tech, and onchain
              developments.
            </p>
            {/* Subscribe form */}
            <div className="space-y-4">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-[#333333]/50 p-3 text-[#EBECEB] placeholder:text-[#EBECEB]/90 focus:outline-none focus:border-[#EBECEB]/50"
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-[#EBECEB] text-[#171717] py-3 hover:bg-[#EBECEB]/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>

            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

