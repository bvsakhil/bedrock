/**
 * Footer component for the website
 * Displays the BEDROCK logo, social links, and copyright information
 */
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#000000] text-[#ffffff] border-t border-[#69696a]/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col space-y-8">
          {/* Large BEDROCK logo */}
          <div className="text-center overflow-hidden">
            <h1 className="font-black italic text-[80px] sm:text-[150px] md:text-[200px] leading-[0.9] tracking-tight text-[#ffffff] font-barlow w-full">
              BEDROCK
            </h1>
          </div>

          {/* Footer bottom section with links and copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 pt-8 border-t border-[#69696a]/50">
            {/* Social media links */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm order-first sm:order-none">
              <Link href="https://twitter.com" className="text-[#8d8d8d] hover:text-[#ffffff] transition-colors">
                Twitter
              </Link>
              <Link href="https://facebook.com" className="text-[#8d8d8d] hover:text-[#ffffff] transition-colors">
                Warpcast
              </Link>
            </div>

            {/* Copyright information */}
            <div className="text-xs sm:text-sm text-[#8d8d8d]">All rights reserved. © 2025 Bedrock</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

