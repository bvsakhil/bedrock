"use client"

import { Share2 } from "lucide-react"

export function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: title,
        text: `Check out "${title}" on BEDROCK`,
        url: url,
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${title}" on BEDROCK`)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="w-full py-4 flex items-center justify-center gap-2 text-[#EBECEB]/90 hover:text-[#EBECEB] transition-colors"
    >
      <Share2 className="w-5 h-5 mr-2" />
      <span>Share this article</span>
    </button>
  );
} 