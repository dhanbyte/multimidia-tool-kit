'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Download,
  QrCode,
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Image as LucideImage,
  Search,
  Keyboard,
  FileType,
  Hash,
  Palette,
  FileText,
  FileImage,
  Menu,
  X
} from "lucide-react"

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
import { ThemeToggle } from "@/components/theme-toggle"
import { BannerAd, SquareAd } from "@/components/GoogleAds"

const allTools = [
  // Popular Tools
  {
    name: "QR Code Generator Free",
    description: "Generate custom QR codes for any text, URL, or data instantly",
    icon: QrCode,
    href: "/dashboard/qr-generator",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
    keywords: ["qr code generator free", "create qr code", "qr maker", "barcode generator", "wifi qr code"]
  },
  {
    name: "Image Compressor Without Losing Quality",
    description: "Compress images online without losing quality - JPG, PNG, WebP",
    icon: LucideImage,
    href: "/dashboard/image-tools/image-compressor",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    popular: true,
    keywords: ["image compressor without losing quality", "compress image online", "photo optimizer", "reduce image size"]
  },
  {
    name: "Free PDF Compressor Online",
    description: "Reduce PDF file size while maintaining quality - 100% free",
    icon: FileText,
    href: "/dashboard/pdf-tools/pdf-compress",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    popular: true,
    keywords: ["free pdf compressor online", "compress pdf", "reduce pdf size", "pdf optimizer"]
  },
  {
    name: "Typing Speed Test WPM",
    description: "Test your typing speed and accuracy - WPM calculator with practice",
    icon: Keyboard,
    href: "/dashboard/typing-master",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    popular: true,
    keywords: ["typing speed test wpm", "typing test", "wpm calculator", "typing practice", "keyboard speed test"]
  },
  {
    name: "Password Generator Strong Secure",
    description: "Generate strong, secure passwords with custom options",
    icon: Shield,
    href: "/dashboard/security-tools/password-generator",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    popular: true,
    keywords: ["password generator strong secure", "strong password generator", "secure password maker", "random password"]
  },
  {
    name: "Color Picker Hex RGB",
    description: "Pick colors from images and get HEX, RGB, HSL values instantly",
    icon: Palette,
    href: "/dashboard/developer-tools/color-picker",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    popular: true,
    keywords: ["color picker hex rgb", "hex color picker", "rgb color picker", "color tool", "eyedropper"]
  },
  {
    name: "AI Content Writer Free",
    description: "Generate high-quality content with AI - articles, blogs, marketing copy",
    icon: FileType,
    href: "/dashboard/ai-tools/ai-content-writer",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    popular: true,
    keywords: ["ai content writer free", "ai writing tool", "content generator", "ai copywriter", "auto writer"]
  },
  // PDF Tools
  {
    name: "PDF to JPG Converter",
    description: "Convert PDF pages to high-quality JPG images online",
    icon: FileImage,
    href: "/dashboard/pdf-tools/pdf-to-jpg",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf", "pdf converter"]
  },
  {
    name: "PDF Splitter",
    description: "Split PDF files into separate pages or extract specific pages",
    icon: FileText,
    href: "/dashboard/pdf-tools/pdf-split",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    keywords: ["pdf split", "pdf splitter", "split pdf pages", "extract pdf pages"]
  },
  // Text Tools
  {
    name: "Text Summarizer AI",
    description: "Summarize long text instantly with AI technology",
    icon: FileType,
    href: "/dashboard/text-tools/text-summarizer",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    keywords: ["text summarizer ai", "ai summarizer", "summarize text", "article summarizer"]
  },
  {
    name: "Markdown Editor",
    description: "Write and preview Markdown with live preview",
    icon: FileText,
    href: "/dashboard/text-tools/markdown-editor",
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    keywords: ["markdown editor", "md editor", "markdown preview", "markdown to html"]
  },
  {
    name: "Word Counter",
    description: "Count words, characters, paragraphs in your text",
    icon: FileType,
    href: "/dashboard/text-tools/word-counter",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    keywords: ["word counter", "character counter", "text counter", "word count"]
  },
  {
    name: "Text Translator",
    description: "Translate text between multiple languages instantly",
    icon: FileType,
    href: "/dashboard/text-tools/text-translator",
    color: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-50 dark:bg-sky-950/20",
    iconColor: "text-sky-600 dark:text-sky-400",
    keywords: ["text translator", "language translator", "translate text", "multilingual"]
  },
  // Developer Tools
  {
    name: "Code Formatter",
    description: "Format and beautify your code - JavaScript, HTML, CSS, JSON",
    icon: Hash,
    href: "/dashboard/developer-tools/code-formatter",
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    iconColor: "text-gray-600 dark:text-gray-400",
    keywords: ["code formatter", "code beautifier", "format code", "javascript formatter"]
  },
  {
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data online",
    icon: Hash,
    href: "/dashboard/developer-tools/json-formatter",
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    keywords: ["json formatter", "json validator", "json beautifier", "format json"]
  },
  // Design Tools
  {
    name: "CSS Gradient Generator",
    description: "Create beautiful CSS gradients with live preview",
    icon: Palette,
    href: "/dashboard/design-tools/gradient-generator",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    iconColor: "text-rose-600 dark:text-rose-400",
    keywords: ["css gradient generator", "gradient maker", "linear gradient", "radial gradient"]
  },
  {
    name: "Logo Maker",
    description: "Create professional logos with customizable templates",
    icon: Star,
    href: "/dashboard/design-tools/logo-maker",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    keywords: ["logo maker", "logo creator", "logo generator", "design logo"]
  },
  // Utility Tools
  {
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to human-readable dates",
    icon: Clock,
    href: "/dashboard/utility-tools/timestamp-converter",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    keywords: ["timestamp converter", "unix timestamp", "epoch converter", "date converter"]
  },
  {
    name: "Random Generator",
    description: "Generate random numbers, strings, passwords, and data",
    icon: Zap,
    href: "/dashboard/utility-tools/random-generator",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    keywords: ["random generator", "random number", "random string", "random data"]
  },
  // Security Tools
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes for text and files",
    icon: Hash,
    href: "/dashboard/security-tools/hash-generator",
    color: "from-slate-500 to-gray-500",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
    iconColor: "text-slate-600 dark:text-slate-400",
    keywords: ["hash generator", "md5", "sha1", "sha256", "checksum"]
  },
  {
    name: "Encryption Tool",
    description: "Encrypt and decrypt text with various algorithms",
    icon: Shield,
    href: "/dashboard/security-tools/encryption-tool",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    keywords: ["encryption tool", "encrypt text", "decrypt text", "text encryption"]
  },
  // Image Tools
  {
    name: "Image Format Converter",
    description: "Convert images between JPG, PNG, WebP, GIF formats",
    icon: LucideImage,
    href: "/dashboard/image-tools/image-format-converter",
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    keywords: ["image converter", "format converter", "jpg to png", "png to jpg"]
  },
  {
    name: "Background Remover",
    description: "Remove backgrounds from images using AI technology",
    icon: LucideImage,
    href: "/dashboard/image-tools/background-remover",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    keywords: ["background remover", "remove background", "transparent background", "ai background"]
  },
  // Developer Tools
  {
    name: "CSS Minifier",
    description: "Minify CSS code to reduce file size for faster loading",
    icon: Hash,
    href: "/dashboard/developer-tools/css-minifier",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    keywords: ["css minifier", "minify css", "css compressor", "css optimizer"]
  },
  {
    name: "HTML Validator",
    description: "Validate HTML code for errors and compliance",
    icon: Hash,
    href: "/dashboard/developer-tools/html-validator",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    keywords: ["html validator", "validate html", "html checker", "html errors"]
  },
  // Design Tools
  {
    name: "Favicon Generator",
    description: "Generate favicons from images for your website",
    icon: Star,
    href: "/dashboard/design-tools/favicon-generator",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    keywords: ["favicon generator", "favicon creator", "ico generator", "website icon"]
  },
  {
    name: "Color Contrast Checker",
    description: "Check color contrast for accessibility compliance",
    icon: Palette,
    href: "/dashboard/design-tools/color-contrast-checker",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    keywords: ["color contrast", "accessibility checker", "wcag compliance", "contrast ratio"]
  },
  // AI Tools
  {
    name: "AI Code Generator",
    description: "Generate code snippets with AI assistance",
    icon: Hash,
    href: "/dashboard/ai-tools/ai-code-generator",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    keywords: ["ai code generator", "code generator", "ai programming", "generate code"]
  },
  {
    name: "AI Chatbot",
    description: "Chat with AI assistant for help and information",
    icon: FileType,
    href: "/dashboard/ai-tools/ai-chatbot",
    color: "from-teal-500 to-green-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    keywords: ["ai chatbot", "ai assistant", "chat ai", "ai help"]
  },
  // Utility Tools
  {
    name: "WiFi QR Generator",
    description: "Generate QR codes for WiFi network sharing",
    icon: QrCode,
    href: "/dashboard/utility-tools/wifi-qr",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    keywords: ["wifi qr", "wifi qr code", "share wifi", "wifi password qr"]
  },
  {
    name: "Expense Tracker",
    description: "Track your expenses and manage your budget",
    icon: Clock,
    href: "/dashboard/utility-tools/expense-tracker",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    keywords: ["expense tracker", "budget tracker", "money tracker", "expense manager"]
  },
  {
    name: "Stopwatch Timer",
    description: "Online stopwatch and timer for time tracking",
    icon: Clock,
    href: "/dashboard/utility-tools/stopwatch",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    keywords: ["stopwatch", "timer", "online stopwatch", "time tracker"]
  },
  {
    name: "Todo List Manager",
    description: "Organize your tasks with a simple todo list",
    icon: CheckCircle,
    href: "/dashboard/utility-tools/todo-list",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    keywords: ["todo list", "task manager", "todo app", "task organizer"]
  }
]

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process your files in seconds with optimized algorithms."
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your files are encrypted and automatically deleted after use."
  },
  {
    icon: Users,
    title: "No Registration",
    description: "Use all tools instantly without creating an account."
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Our platform is available round the clock with 99.9% uptime."
  }
]

const stats = [
  { label: "Files Processed", value: "10M+", icon: Download },
  { label: "Happy Users", value: "500K+", icon: Users },
  { label: "Tools Available", value: "80+", icon: Zap },
  { label: "Success Rate", value: "99.9%", icon: CheckCircle }
]

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const categories = [
    {
      name: "PDF Tools",
      icon: FileText,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      iconColor: "text-red-600 dark:text-red-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('pdf')))
    },
    {
      name: "Image Tools", 
      icon: LucideImage,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('image') || k.includes('photo') || k.includes('background')))
    },
    {
      name: "Text Tools",
      icon: FileType,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      iconColor: "text-green-600 dark:text-green-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('text') || k.includes('word') || k.includes('typing')))
    },
    {
      name: "Security Tools",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('password') || k.includes('security') || k.includes('encrypt')))
    },
    {
      name: "Developer Tools",
      icon: Hash,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('code') || k.includes('json') || k.includes('css') || k.includes('html')))
    },
    {
      name: "Design Tools",
      icon: Palette,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
      iconColor: "text-pink-600 dark:text-pink-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('color') || k.includes('gradient') || k.includes('logo') || k.includes('design')))
    },
    {
      name: "AI Tools",
      icon: Star,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('ai')))
    },
    {
      name: "Utility Tools",
      icon: Zap,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      tools: allTools.filter(tool => tool.keywords?.some(k => k.includes('qr') || k.includes('wifi') || k.includes('random') || k.includes('converter')))
    }
  ];
  
  useEffect(() => {
    setMounted(true);
    // Initialize AdSense
    if (typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse">
                <Download className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MultiTool
                </h1>
                <p className="text-xs text-muted-foreground">by Dhanbyte</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/help" className="text-sm font-medium hover:text-primary transition-colors">
                Help
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button size="sm" className="hover:scale-105 transition-transform">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/blog"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/help"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Help
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="px-3 py-2">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-72 h-32 sm:h-72 bg-blue-400/10 rounded-full blur-2xl sm:blur-3xl animate-float" />
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-purple-400/10 rounded-full blur-2xl sm:blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-pink-400/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
          
          {/* Floating Particles - Hidden on mobile */}
          <div className="hidden sm:block absolute top-32 left-1/4 w-4 h-4 bg-blue-400/20 rounded-full animate-particle-float" />
          <div className="hidden sm:block absolute top-40 right-1/3 w-3 h-3 bg-purple-400/20 rounded-full animate-particle-float delay-1000" />
          <div className="hidden sm:block absolute bottom-32 left-1/3 w-5 h-5 bg-pink-400/20 rounded-full animate-particle-float delay-2000" />
          <div className="hidden sm:block absolute bottom-40 right-1/4 w-2 h-2 bg-indigo-400/20 rounded-full animate-particle-float delay-1500" />
        </div>
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative py-8 sm:py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-3 sm:mb-6 px-2 sm:px-4 py-1 sm:py-2 animate-fade-in text-xs">
              <Star className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 fill-current animate-spin-slow" />
              Trusted by 500K+ users
            </Badge>
            <h1 className="mb-3 sm:mb-4 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight animate-fade-in-up leading-tight">
              <span className="animate-text-shimmer">MultiTool</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                by Dhanbyte
              </span>
            </h1>
            <p className="mx-auto mb-4 sm:mb-8 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed animate-fade-in-up delay-200 px-2 sm:px-0">
              100+ free online tools - PDF, image, text, developer tools & more.
              <br className="hidden sm:block" />
              <span className="animate-fade-in delay-1000 text-xs sm:text-sm opacity-80">By Dhananjay - Full Stack Developer. Fast, secure, no signup!</span>
            </p>
            <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:justify-center animate-fade-in-up delay-300 px-3 sm:px-0">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">Start Using Tools</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Google Ads - Top Banner */}
      <section className="bg-muted/20 border-y">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="flex justify-center">
            <BannerAd />
          </div>
        </div>
      </section>

      {/* Tools by Category */}
      <section className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="space-y-8 sm:space-y-12">
          {categories.map((category, categoryIndex) => (
            category.tools.length > 0 && (
              <div key={category.name} className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                <div className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className={`flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl ${category.bgColor}`}>
                        <category.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${category.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-2xl font-bold">{category.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{category.tools.length} tools</p>
                      </div>
                    </div>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3 py-1 sm:py-2">
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">All</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>

                  {/* Tools Grid */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                    {category.tools.map((tool, toolIndex) => (
                      <Link key={toolIndex} href={tool.href} className="block">
                        <Card className="group relative overflow-hidden border bg-gradient-to-br from-background to-muted/20 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer h-full">
                          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                          <CardHeader className="relative p-3 sm:p-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className={`flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${tool.bgColor} transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
                                <tool.icon className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${tool.iconColor} transition-all duration-300`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-xs sm:text-sm font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                  {tool.name}
                                  {tool.popular && <Badge variant="secondary" className="text-xs ml-1 mt-0.5 px-1 py-0">Hot</Badge>}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="relative p-3 pt-0 sm:p-4 sm:pt-0">
                            <CardDescription className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors line-clamp-2 mb-2 sm:mb-3">
                              {tool.description}
                            </CardDescription>
                            <Button variant="outline" size="sm" className="w-full text-xs py-1.5 sm:py-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 bg-transparent">
                              Try Now
                              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Google Ads - Between Categories */}
                {(categoryIndex === 2 || categoryIndex === 5) && (
                  <div className="my-8 sm:my-12">
                    <div className="flex justify-center">
                      <SquareAd />
                    </div>
                  </div>
                )}


              </div>
            )
          ))}
        </div>
        
        {/* Google Ads - Bottom */}
        <div className="my-8 sm:my-12">
          <div className="flex justify-center">
            <BannerAd />
          </div>
        </div>
        
        {/* View All Tools Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link href="/dashboard">
            <Button size="lg" className="text-sm sm:text-lg px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
              Explore All {allTools.length} Tools
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="hidden sm:block absolute top-10 right-20 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl animate-float" />
          <div className="hidden sm:block absolute bottom-10 left-20 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl animate-float-delayed" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 animate-fade-in-up">Why Choose MultiTool by Dhanbyte?</h2>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-in-up delay-100 px-4 sm:px-0">
              Built with cutting-edge technology to provide the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary transition-all duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors px-2 sm:px-0">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10 rounded-3xl" />
        <div className="mx-auto max-w-2xl text-center relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 animate-fade-in-up">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 animate-fade-in-up delay-100 px-4 sm:px-0">
            Join thousands of users who trust MultiTool by Dhanbyte for their daily productivity needs
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 animate-fade-in-up delay-200 hover:scale-105 transition-all duration-300 group w-full sm:w-auto">
              <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
              Access All Tools Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-base sm:text-lg">MultiTool by Dhanbyte</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md">
                Your ultimate toolkit with 100+ free online tools. Created by Dhananjay (Dhanbyte) - Full Stack Developer & Video Editor.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Tools
                </Link>
                <Link href="/about" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link href="/help" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">Support</h3>
              <div className="space-y-2">
                <Link href="/contact" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
                <Link href="/help" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
                <a href="mailto:support@dhanbyte.me" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                  Email Support
                </a>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">© 2024 MultiTool by Dhananjay (Dhanbyte) - Full Stack Developer & Video Editor. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}