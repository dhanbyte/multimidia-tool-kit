"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { VoiceSearch } from "@/components/voice-search"

import {
  Download,
  QrCode,
  Upload,
  ImageIcon,
  FileText,
  FileImage,
  Search,
  Menu,
  Home,
  Sparkles,
  Image as LucideImage,
  Link as LinkIcon,
  Shield,
  Palette,
  ArrowUpDown,
  Hash,
  Calculator,
  Type,
  Crop,
  Scissors,
  AlignLeft,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

const tools = [
  // PDF TOOLS
  {
    name: "PDF to Word",
    href: "/dashboard/pdf-to-word",
    icon: FileText,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    keywords: ["pdf", "word", "doc", "convert", "document"],
  },
  {
    name: "Merge PDF",
    href: "/dashboard/merge-pdf",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    keywords: ["pdf", "merge", "combine", "join", "multiple"],
  },
  {
    name: "PDF to JPG",
    href: "/dashboard/pdf-to-jpg",
    icon: FileImage,
    color: "text-yellow-600 dark:text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    keywords: ["pdf", "jpg", "image", "convert", "extract", "photo"],
  },
  {
    name: "PDF to Text",
    href: "/dashboard/pdf-to-text",
    icon: FileText,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    keywords: ["pdf", "text", "extract", "convert", "file"],
  },
  // IMAGE TOOLS
  {
    name: "Image Compressor",
    href: "/dashboard/image-compressor",
    icon: LucideImage,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    keywords: ["compress", "image", "photo", "jpg", "png", "reduce", "resize"],
  },
  {
    name: "Image Resizer",
    href: "/dashboard/image-resizer",
    icon: LucideImage,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    keywords: ["resize", "image", "photo", "dimensions", "scale"],
  },
  {
    name: "Image Cropper",
    href: "/dashboard/image-cropper",
    icon: Crop,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    keywords: ["crop", "image", "photo", "cut", "trim"],
  },
  // TEXT TOOLS
  {
    name: "Word Counter",
    href: "/dashboard/word-counter",
    icon: AlignLeft,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    keywords: ["word", "count", "character", "text", "analyze"],
  },
  {
    name: "Case Converter",
    href: "/dashboard/case-converter",
    icon: Type,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    keywords: ["case", "convert", "uppercase", "lowercase", "text"],
  },
  {
    name: "Lorem Ipsum Generator",
    href: "/dashboard/lorem-generator",
    icon: Type,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    keywords: ["lorem", "ipsum", "placeholder", "text", "dummy"],
  },
  // UTILITY TOOLS
  {
    name: "QR Generator",
    href: "/dashboard/qr-generator",
    icon: QrCode,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    keywords: ["qr", "barcode", "code", "scan", "generate"],
  },
  {
    name: "URL Shortener",
    href: "/dashboard/url-shortener",
    icon: LinkIcon,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    keywords: ["url", "shorten", "link", "short", "tiny"],
  },
  {
    name: "Unit Converter",
    href: "/dashboard/unit-converter",
    icon: Calculator,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-950/20",
    keywords: ["unit", "convert", "measurement", "length", "weight"],
  },
  // SECURITY TOOLS
  {
    name: "Password Generator",
    href: "/dashboard/password-generator",
    icon: Shield,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    keywords: ["password", "generate", "secure", "random", "strong"],
  },
  {
    name: "Hash Generator",
    href: "/dashboard/hash-generator",
    icon: Hash,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    keywords: ["hash", "md5", "sha1", "sha256", "encrypt"],
  },
  // DESIGN TOOLS
  {
    name: "Color Palette Generator",
    href: "/dashboard/color-palette",
    icon: Palette,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    keywords: ["color", "palette", "scheme", "design", "hex"],
  },
  // DEVELOPER TOOLS
  {
    name: "Base64 Converter",
    href: "/dashboard/base64-converter",
    icon: ArrowUpDown,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
    keywords: ["base64", "encode", "decode", "convert"],
  },
  {
    name: "JSON Formatter",
    href: "/dashboard/json-formatter",
    icon: FileText,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    keywords: ["json", "format", "validate", "minify", "pretty"],
  },
  // AI TOOLS
  {
    name: "Text to Image",
    href: "/dashboard/text-to-image",
    icon: ImageIcon,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    keywords: ["text", "to", "image", "ai", "generate", "photo"],
  },
  {
    name: "Social Bio Generator",
    href: "/dashboard/social-bio-generator",
    icon: Sparkles,
    color: "text-yellow-600 dark:text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    keywords: ["bio", "social", "profile", "twitter", "instagram", "facebook", "linkedin"],
  },
  // OTHER TOOLS
  {
    name: "Image Hosting",
    href: "/dashboard/image-hosting",
    icon: Upload,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    keywords: ["image", "hosting", "upload", "share", "photo"],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTools, setFilteredTools] = useState(tools)
  const pathname = usePathname()

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    if (query) {
      const filtered = tools.filter((tool) => {
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.keywords?.some((keyword) => keyword.toLowerCase().includes(query))
        )
      })
      setFilteredTools(filtered)
    } else {
      setFilteredTools(tools)
    }
  }, [searchQuery])

  const handleVoiceResult = (text: string) => {
    setSearchQuery(text)
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex h-full flex-col", mobile && "w-full")}>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Download className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MediaTools Pro
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-2 px-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-4",
              pathname === "/dashboard"
                ? "bg-muted text-foreground shadow-sm border-l-2 border-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard Home</span>
          </Link>
          <div className="border-t pt-4 mt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2">Tools</p>
            {filteredTools.map((tool) => {
              const isActive = pathname === tool.href
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? `${tool.bgColor} ${tool.color} shadow-sm border-l-2 border-current`
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <tool.icon className="h-5 w-5" />
                  <span>{tool.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hidden w-64 border-r bg-card lg:block">
          <Sidebar />
        </div>
      </Suspense>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tools or ask AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Suspense fallback={null}>
                  <VoiceSearch onResult={handleVoiceResult} />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
