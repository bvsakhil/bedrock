"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-[#ffffff]/5 rounded-none transition-colors md:hidden">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-[#000000] border-r border-[#69696a]/50 p-0">
        <nav className="flex flex-col py-4">
          <Link
            href="/builders"
            onClick={() => setOpen(false)}
            className="px-6 py-4 text-[#8d8d8d] hover:text-[#ffffff] hover:bg-[#ffffff]/5 transition-colors border-b border-[#69696a]/50"
          >
            Builders
          </Link>
          <Link
            href="/consumer"
            onClick={() => setOpen(false)}
            className="px-6 py-4 text-[#8d8d8d] hover:text-[#ffffff] hover:bg-[#ffffff]/5 transition-colors border-b border-[#69696a]/50"
          >
            Consumer
          </Link>
          <Link
            href="/onchain"
            onClick={() => setOpen(false)}
            className="px-6 py-4 text-[#8d8d8d] hover:text-[#ffffff] hover:bg-[#ffffff]/5 transition-colors"
          >
            Onchain
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

