'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShareButton } from "@/components/share-button"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface MobileToolLayoutProps {
  title: string
  description: string
  icon?: ReactNode
  children: ReactNode
  result?: string
  showShare?: boolean
}

export function MobileToolLayout({ 
  title, 
  description, 
  icon, 
  children, 
  result, 
  showShare = true 
}: MobileToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {icon && <div className="flex h-6 w-6 items-center justify-center">{icon}</div>}
              <h1 className="text-sm font-semibold truncate max-w-[150px] sm:max-w-none">
                {title}
              </h1>
            </div>
          </div>
          {showShare && (
            <ShareButton 
              title={title} 
              description={description}
              result={result}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-4 sm:py-6 max-w-4xl">
        {/* Tool Description - Hidden on mobile to save space */}
        <div className="hidden sm:block mb-6">
          <div className="flex items-center gap-3 mb-2">
            {icon && <div className="flex h-8 w-8 items-center justify-center">{icon}</div>}
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Compact card component for mobile tools
export function MobileCard({ 
  title, 
  children, 
  className = "" 
}: { 
  title?: string
  children: ReactNode
  className?: string 
}) {
  return (
    <Card className={`${className}`}>
      {title && (
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-0 space-y-3 sm:space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}