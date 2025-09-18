'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Share2, Copy, MessageCircle, Send, Link2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
  description?: string
  url?: string
  result?: string
}

export function ShareButton({ title, description, url, result }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = result 
    ? `Check out my result from ${title}:\n\n${result}\n\nTry it yourself at ${currentUrl}`
    : `Check out this amazing tool: ${title}${description ? ` - ${description}` : ''}\n\n${currentUrl}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      toast.success('Copied to clipboard!')
      setIsOpen(false)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const shareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  const shareTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(telegramUrl, '_blank')
    setIsOpen(false)
  }

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, '_blank')
    setIsOpen(false)
  }

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: currentUrl
        })
        setIsOpen(false)
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={copyToClipboard} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareWhatsApp} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareTelegram} className="gap-2">
          <Send className="h-4 w-4" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareTwitter} className="gap-2">
          <Link2 className="h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <DropdownMenuItem onClick={shareNative} className="gap-2">
            <Share2 className="h-4 w-4" />
            More Options
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}