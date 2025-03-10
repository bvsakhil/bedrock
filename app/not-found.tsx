/**
 * 404 Not Found page component
 * Displayed when a user navigates to a non-existent route
 */
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000000] text-[#ffffff] p-4">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl mb-8 text-[#8d8d8d]">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2 rounded-full border border-[#69696a]/50 text-sm text-[#8d8d8d] hover:bg-[#ffffff] hover:text-[#1e1e1e] hover:border-[#ffffff] transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}

