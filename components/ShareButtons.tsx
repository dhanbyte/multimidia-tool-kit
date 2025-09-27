'use client'

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="mt-12 p-6 bg-muted/30 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Share2 className="w-5 h-5 mr-2" />
        Share this article
      </h3>
      <div className="flex gap-4">
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            Twitter
          </Button>
        </a>
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            LinkedIn
          </Button>
        </a>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            Facebook
          </Button>
        </a>
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          Copy Link
        </Button>
      </div>
    </div>
  )
}