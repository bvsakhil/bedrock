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

export function NavBar() {
  // State for tracking scroll position and UI states
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)

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

  return (
    <header className="bg-[#000000] text-[#ffffff] sticky top-0 z-50">
      {/* Main navbar container with responsive padding and border */}
      <div
        className={`flex items-center justify-between px-4 sm:px-6 mx-2 sm:mx-4 mt-2 sm:mt-4 border-b border-[#69696a]/50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3 sm:py-4"
        }`}
      >
        {/* Left section: Logo and date */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="font-black text-lg sm:text-xl tracking-wide text-[#ffffff] font-barlow italic">
            BE
          </Link>
          <span className="text-xs sm:text-sm text-[#8d8d8d] hidden xs:inline">
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
          <Link href="/" className="font-black italic text-2xl sm:text-4xl tracking-wide text-[#ffffff] font-barlow">
            BEDROCK
          </Link>
        </div>

        {/* Mobile view controls */}
        <div className="flex items-center gap-3 sm:hidden">
          {/* Search button */}
          <button
            className="p-2 hover:bg-[#ffffff]/5 rounded-none transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>
          {/* Subscribe button */}
          <button
            className="inline-flex px-3 py-1 rounded-none border border-[#69696a]/50 text-xs text-[#ffffff] hover:bg-[#ffffff] hover:text-[#000000] transition-colors"
            onClick={() => setSubscribeOpen(true)}
          >
            Subscribe
          </button>
          {/* Mobile menu sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-[#ffffff]/5 rounded-none transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] bg-[#000000] border-l border-[#69696a]/50 p-0">
              <div className="flex flex-col py-8 px-4 gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#8d8d8d]">New York : -4.9°C</span>
                </div>
                {/* Mobile links */}
                <nav className="flex flex-col gap-4 mt-4">
                  <Link
                    href="/builders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-3 text-[#8d8d8d] hover:text-[#ffffff] hover:bg-[#ffffff]/5 transition-colors border-b border-[#69696a]/50"
                  >
                    Builders
                  </Link>
                  <Link
                    href="/consumer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-3 text-[#8d8d8d] hover:text-[#ffffff] hover:bg-[#ffffff]/5 transition-colors border-b border-[#69696a]/50"
                  >
                    Consumer
                  </Link>
                  <Link
                    href="/onchain"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-3 text-[#8d8d8d] hover:text-[#ffffff] hover:bg-[#ffffff]/5 transition-colors"
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
          <span className="text-sm text-[#8d8d8d]">New York : -4.9°C</span>
          {/* Desktop search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-[#ffffff]/5 rounded-none transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          {/* Desktop subscribe button */}
          <button
            onClick={() => setSubscribeOpen(true)}
            className="inline-flex px-5 py-1.5 rounded-none border border-[#69696a]/50 text-sm text-[#ffffff] hover:bg-[#ffffff] hover:text-[#000000] transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Search Overlay - Appears when search is clicked */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 sm:pt-32 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#000000] border border-[#69696a]/50 p-4 animate-in fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input field */}
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5 text-[#8d8d8d]" />
              <input
                type="text"
                placeholder="Search articles..."
                className="flex-1 bg-transparent border-none outline-none text-[#ffffff] placeholder:text-[#8d8d8d] text-lg"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-[#ffffff]/5 rounded-none transition-colors"
              >
                <span className="text-[#8d8d8d] hover:text-[#ffffff]">ESC</span>
              </button>
            </div>
            {/* Recent searches section */}
            <div className="mt-6 border-t border-[#69696a]/50 pt-4">
              <p className="text-[#8d8d8d] text-sm">Recent searches</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between hover:bg-[#ffffff]/5 p-2 cursor-pointer">
                  <span className="text-[#ffffff]">Mars colonization</span>
                  <span className="text-xs text-[#8d8d8d]">3 days ago</span>
                </div>
                <div className="flex items-center justify-between hover:bg-[#ffffff]/5 p-2 cursor-pointer">
                  <span className="text-[#ffffff]">Blockchain technology</span>
                  <span className="text-xs text-[#8d8d8d]">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Bottom Sheet - Appears when subscribe is clicked */}
      <Sheet open={subscribeOpen} onOpenChange={setSubscribeOpen}>
        <SheetContent
          side="bottom"
          className="bg-[#000000] border-t border-[#69696a]/50 rounded-t-xl max-w-full sm:max-w-lg sm:mx-auto"
        >
          <div className="py-6 px-4 sm:px-6">
            {/* Visual handle for bottom sheet */}
            <div className="w-12 h-1 bg-[#ffffff]/20 rounded-full mx-auto mb-6 sm:mb-8"></div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Join BEDROCK</h2>
            <p className="text-[#8d8d8d] mb-6 text-sm sm:text-base">
              Subscribe to our newsletter to receive the latest updates on builders, consumer tech, and onchain
              developments.
            </p>
            {/* Subscribe form */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent border border-[#69696a]/50 p-3 text-[#ffffff] placeholder:text-[#8d8d8d] focus:outline-none focus:border-[#ffffff]/50"
              />
              <button className="w-full bg-[#ffffff] text-[#000000] py-3 hover:bg-[#ffffff]/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

