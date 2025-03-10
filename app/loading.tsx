/**
 * Loading component that displays while page content is loading
 * Shows a spinner animation centered on the screen
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000000]">
      <div className="w-16 h-16 border-4 border-[#8d8d8d]/20 border-t-[#ffffff] rounded-full animate-spin"></div>
    </div>
  )
}

