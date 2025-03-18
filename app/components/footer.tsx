/**
 * Footer component for the website
 * Displays the BEDROCK logo, social links, and copyright information
 */
"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#171717] text-[#EBECEB]">
      
      {/* Full width border */}
      <div className="border-t border-[#333333]/50">
        <div className="container mx-auto">
          {/* Copyright and Social Links */}
          <div className="p-6 flex flex-col md:flex-row justify-between items-center">
            {/* Social Media Links */}
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="https://x.com/bedrockonchain" className="hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Image src="/twitter_icon.svg" alt="Twitter" width={20} height={20} className="filter invert" />
              </Link>
              <Link href="https://warpcast.com/~/channel/bedrock" className="hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Image src="/warpcast_icon.svg" alt="Warpcast" width={20} height={20} />
              </Link>
            </div>
            
            {/* Copyright Text */}
            <p className="text-[#EBECEB]/70 text-xs text-center md:text-right max-w-md md:max-w-sm font-archivo">
              © Copyright {new Date().getFullYear()} Bedrock.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

