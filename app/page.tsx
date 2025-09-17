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
  FileImage
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(allTools.slice(0, 24));
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<typeof allTools>([]);
  
  const animatedTexts = [
    "Search tools... (e.g., 'typing test', 'pdf compress')",
    "Try 'qr code generator free' for QR tools",
    "Search 'image compressor' for photo tools",
    "Find 'password generator' for security",
    "Look for 'ai content writer' for AI tools",
    "Search 'color picker' for design tools"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTools(allTools.slice(0, 24));
      setShowSuggestions(false);
      setSearchSuggestions([]);
      return;
    }

    const filtered = allTools.filter(tool => 
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.keywords?.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredTools(filtered);
    
    // Show top 5 suggestions
    const suggestions = filtered.slice(0, 5);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && query.length > 0);
  };

  const handleSuggestionClick = (tool: typeof allTools[0]) => {
    setShowSuggestions(false);
    router.push(tool.href);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSuggestions.length > 0) {
      setShowSuggestions(false);
      router.push(searchSuggestions[0].href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediaTools Pro
              </h1>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
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
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button className="hover:scale-105 transition-transform">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" />
          
          {/* Floating Particles */}
          <div className="absolute top-32 left-1/4 w-4 h-4 bg-blue-400/20 rounded-full animate-particle-float" />
          <div className="absolute top-40 right-1/3 w-3 h-3 bg-purple-400/20 rounded-full animate-particle-float delay-1000" />
          <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-pink-400/20 rounded-full animate-particle-float delay-2000" />
          <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-indigo-400/20 rounded-full animate-particle-float delay-1500" />
        </div>
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 animate-fade-in">
              <Star className="mr-2 h-4 w-4 fill-current animate-spin-slow" />
              Trusted by 500K+ users worldwide
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl animate-fade-in-up">
              <span className="animate-text-shimmer">All-in-One</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Media Toolkit
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed animate-fade-in-up delay-200">
              <span className="animate-typewriter inline-block">
                Generate QR codes, convert files, compress images, and more - all in one powerful platform.
              </span>
              <br />
              <span className="animate-fade-in delay-1000">Fast, secure, and completely free to use.</span>
            </p>
            <div className="flex flex-col gap-8 sm:items-center animate-fade-in-up delay-300">
              <div className="relative max-w-lg mx-auto w-full group">
                {/* Enhanced Search Container */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl animate-search-glow" />
                  <div className="relative bg-background/80 backdrop-blur-sm rounded-xl border-2 border-primary/20 shadow-2xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                    <Input
                      type="text"
                      placeholder={animatedTexts[currentTextIndex]}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-12 pr-4 py-4 text-base bg-transparent border-0 rounded-xl focus:ring-0 focus:outline-none placeholder:transition-all placeholder:duration-500"
                    />
                  </div>
                </form>
                
                {/* Live Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-[9999] animate-fade-in">
                    <div className="bg-background/98 backdrop-blur-md border border-primary/20 rounded-lg shadow-2xl overflow-hidden">
                      <div className="p-3 border-b border-primary/10">
                        <div className="text-xs text-muted-foreground">Found {searchSuggestions.length} matching tools:</div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {searchSuggestions.map((tool, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(tool)}
                            className="w-full p-3 text-left hover:bg-primary/10 transition-colors border-b border-primary/5 last:border-b-0 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tool.bgColor} group-hover:scale-110 transition-transform`}>
                                <tool.icon className={`h-4 w-4 ${tool.iconColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">{tool.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-2 bg-muted/30 border-t border-primary/10">
                        <div className="text-xs text-muted-foreground text-center">
                          Press Enter to go to first result or click any tool above
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Popular Search Terms (when no search query) */}
                {!searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-[9998] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                    <div className="bg-background/98 backdrop-blur-md border border-primary/20 rounded-lg shadow-2xl p-3">
                      <div className="text-xs text-muted-foreground mb-2">Popular searches:</div>
                      <div className="flex flex-wrap gap-2">
                        {['pdf compress', 'qr generator', 'typing test', 'image compress', 'password generator'].map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Buttons - Move down when suggestions are visible */}
              <div className={`flex flex-col gap-4 sm:flex-row sm:justify-center transition-all duration-300 ${
                showSuggestions && searchSuggestions.length > 0 ? 'mt-80' : 'mt-0'
              }`}>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                    <span className="relative z-10">Start Using Tools</span>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:border-primary/50">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        <div className="container py-16 relative">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg">
                  <stat.icon className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="text-3xl font-bold group-hover:text-primary transition-colors animate-counter">{stat.value}</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 animate-fade-in-up">
            Powerful Tools at Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fingertips
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up delay-100">
            Choose from our comprehensive suite of media tools designed to make your life easier
          </p>
        </div>

        {searchQuery && (
          <div className="mb-6 text-center animate-fade-in">
            <p className="text-muted-foreground">
              {filteredTools.length > 0 
                ? `Found ${filteredTools.length} tool${filteredTools.length === 1 ? '' : 's'} for "${searchQuery}"`
                : `No tools found for "${searchQuery}". Try different keywords.`
              }
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, index) => (
            <Link key={index} href={tool.href} className="block">
              <Card
                className="group relative overflow-hidden border-2 bg-gradient-to-br from-background to-muted/20 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:border-primary/20 animate-fade-in-up cursor-pointer h-full"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <CardHeader className="relative">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.bgColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <tool.icon className={`h-6 w-6 ${tool.iconColor} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                        {tool.name}
                        {tool.popular && <Badge variant="secondary" className="text-xs animate-pulse">Popular</Badge>}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="mb-4 text-muted-foreground group-hover:text-foreground/80 transition-colors">{tool.description}</CardDescription>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 bg-transparent hover:scale-105"
                  >
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* View All Tools Button */}
        {!searchQuery && filteredTools.length < allTools.length && (
          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">
                View All {allTools.length} Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-10 left-20 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl animate-float-delayed" />
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 animate-fade-in-up">Why Choose MediaTools Pro?</h2>
            <p className="text-lg text-muted-foreground animate-fade-in-up delay-100">
              Built with cutting-edge technology to provide the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                  <feature.icon className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10 rounded-3xl" />
        <div className="mx-auto max-w-2xl text-center relative">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 animate-fade-in-up">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up delay-100">
            Join thousands of users who trust MediaTools Pro for their daily media needs
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6 animate-fade-in-up delay-200 hover:scale-105 transition-all duration-300 group">
              <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Access All Tools Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-lg">MediaTools Pro</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Your one-stop solution for all media tools. Fast, secure, and completely free to use.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Tools
                </Link>
                <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
                <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
                <a href="mailto:support@dhanbyte.me" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Email Support
                </a>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2024 MediaTools Pro by dhanbyte. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}