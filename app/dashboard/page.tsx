import { cn } from "@/lib/utils"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  QrCode,
  Upload,
  ImageIcon,
  FileText,
  FileImage,
  Star,
  ArrowRight,
  Zap,
  Image as LucideImage,
  Link as LinkIcon,
  Shield,
  Palette,
  ArrowUpDown,
  Hash,
  Calculator,
  Type,
  BarChart3,
  Crop,
  Sparkles,
  Scissors
} from "lucide-react"

// Removed unused icons: Download, Users, Clock, TrendingUp as stats are removed
// Removed unused imports due to stats removal: Download, Users, Clock, TrendingUp

const tools = [
  // PDF TOOLS
  {
    name: "PDF to Word",
    description: "Convert PDF files to Word documents",
    icon: FileText,
    href: "/dashboard/pdf-to-word",
    category: "PDF Tools",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    popular: true,
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    icon: FileText,
    href: "/dashboard/merge-pdf",
    category: "PDF Tools",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages to images",
    icon: FileImage,
    href: "/dashboard/pdf-to-jpg",
    category: "PDF Tools",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    popular: true,
  },
  {
    name: "PDF to Text",
    description: "Extract text from PDF documents",
    icon: FileText,
    href: "/dashboard/pdf-to-text",
    category: "PDF Tools",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "PDF Split",
    description: "Split PDF into separate pages",
    icon: FileText,
    href: "/dashboard/pdf-split",
    category: "PDF Tools",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "PDF Compress",
    description: "Reduce PDF file size",
    icon: FileText,
    href: "/dashboard/pdf-compress",
    category: "PDF Tools",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    popular: true,
  },
  {
    name: "PDF Rotate",
    description: "Rotate PDF pages",
    icon: FileText,
    href: "/dashboard/pdf-rotate",
    category: "PDF Tools",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    name: "PDF Watermark",
    description: "Add watermarks to PDF",
    icon: FileText,
    href: "/dashboard/pdf-watermark",
    category: "PDF Tools",
    bgColor: "bg-sky-50 dark:bg-sky-950/20",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    name: "PDF Password",
    description: "Protect or unlock PDF files",
    icon: FileText,
    href: "/dashboard/pdf-password",
    category: "PDF Tools",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "PDF Metadata Editor",
    description: "Edit PDF document properties",
    icon: FileText,
    href: "/dashboard/pdf-metadata",
    category: "PDF Tools",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
    iconColor: "text-slate-600 dark:text-slate-400",
  },
  {
    name: "PDF Signature",
    description: "Add digital signatures to PDF",
    icon: FileText,
    href: "/dashboard/pdf-signature",
    category: "PDF Tools",
    bgColor: "bg-lime-50 dark:bg-lime-950/20",
    iconColor: "text-lime-600 dark:text-lime-400",
  },
  {
    name: "PDF OCR",
    description: "Extract text from scanned PDFs",
    icon: FileText,
    href: "/dashboard/pdf-ocr",
    category: "PDF Tools",
    bgColor: "bg-fuchsia-50 dark:bg-fuchsia-950/20",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
  },
  // IMAGE TOOLS
  {
    name: "Image Compressor",
    description: "Compress multiple images for web optimization",
    icon: LucideImage,
    href: "/dashboard/image-compressor",
    category: "Image Tools",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    popular: true,
  },
  {
    name: "Image Resizer",
    description: "Resize images to custom dimensions",
    icon: LucideImage,
    href: "/dashboard/image-resizer",
    category: "Image Tools",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    popular: true,
  },
  {
    name: "Image Cropper",
    description: "Crop images by selecting areas",
    icon: LucideImage,
    href: "/dashboard/image-cropper",
    category: "Image Tools",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Image Format Converter",
    description: "Convert between image formats",
    icon: ArrowUpDown,
    href: "/dashboard/image-format-converter",
    category: "Image Tools",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    name: "Background Remover",
    description: "Remove backgrounds from images",
    icon: LucideImage,
    href: "/dashboard/background-remover",
    category: "Image Tools",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Image Watermark",
    description: "Add watermarks to images",
    icon: LucideImage,
    href: "/dashboard/image-watermark",
    category: "Image Tools",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Image Filter",
    description: "Apply filters to images",
    icon: LucideImage,
    href: "/dashboard/image-filter",
    category: "Image Tools",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    name: "Image Rotate",
    description: "Rotate images by degrees",
    icon: LucideImage,
    href: "/dashboard/image-rotate",
    category: "Image Tools",
    bgColor: "bg-lime-50 dark:bg-lime-950/20",
    iconColor: "text-lime-600 dark:text-lime-400",
  },
  // TEXT TOOLS
  {
    name: "Word Counter",
    description: "Count words, characters and analyze text",
    icon: FileText,
    href: "/dashboard/word-counter",
    category: "Text Tools",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    popular: true,
  },
  {
    name: "Case Converter",
    description: "Convert text between different cases",
    icon: FileText,
    href: "/dashboard/case-converter",
    category: "Text Tools",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  // EXISTING TOOLS
  {
    name: "QR Generator",
    description: "Generate QR codes for any content",
    icon: QrCode,
    href: "/dashboard/qr-generator",
    category: "Utility",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "Text to Image",
    description: "Generate images from text using AI",
    icon: ImageIcon,
    href: "/dashboard/text-to-image",
    category: "AI Tools",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    new: true,
  },
  {
    name: "Social Bio Generator",
    description: "Generate creative social media bios",
    icon: Zap,
    href: "/dashboard/social-bio-generator",
    category: "AI Tools",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    new: true,
  },
  {
    name: "AI Content Writer",
    description: "Generate content with AI",
    icon: Sparkles,
    href: "/dashboard/ai-content-writer",
    category: "AI Tools",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "AI Code Generator",
    description: "Generate code with AI",
    icon: Sparkles,
    href: "/dashboard/ai-code-generator",
    category: "AI Tools",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "AI Chatbot",
    description: "Chat with AI assistant",
    icon: Sparkles,
    href: "/dashboard/ai-chatbot",
    category: "AI Tools",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    popular: true,
  },
  {
    name: "AI Image Enhancer",
    description: "Enhance images with AI",
    icon: Sparkles,
    href: "/dashboard/ai-image-enhancer",
    category: "AI Tools",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "AI Name Generator",
    description: "Generate names with AI",
    icon: Sparkles,
    href: "/dashboard/ai-name-generator",
    category: "AI Tools",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "AI Story Generator",
    description: "Create stories with AI",
    icon: Sparkles,
    href: "/dashboard/ai-story-generator",
    category: "AI Tools",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "AI Email Writer",
    description: "Write emails with AI",
    icon: Sparkles,
    href: "/dashboard/ai-email-writer",
    category: "AI Tools",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  // NEW UTILITY TOOLS
  {
    name: "URL Shortener",
    description: "Shorten long URLs for easy sharing",
    icon: LinkIcon,
    href: "/dashboard/url-shortener",
    category: "Utility",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    popular: true,
  },
  {
    name: "Password Generator",
    description: "Generate secure passwords with custom options",
    icon: Shield,
    href: "/dashboard/password-generator",
    category: "Security",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    popular: true,
  },
  {
    name: "Color Palette Generator",
    description: "Generate beautiful color palettes",
    icon: Palette,
    href: "/dashboard/color-palette",
    category: "Design",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    name: "Gradient Generator",
    description: "Create CSS gradients easily",
    icon: Palette,
    href: "/dashboard/gradient-generator",
    category: "Design",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "Logo Maker",
    description: "Create simple text-based logos",
    icon: Palette,
    href: "/dashboard/logo-maker",
    category: "Design",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Favicon Generator",
    description: "Generate favicons for websites",
    icon: Palette,
    href: "/dashboard/favicon-generator",
    category: "Design",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "CSS Gradient Builder",
    description: "Build multi-color CSS gradients",
    icon: Palette,
    href: "/dashboard/css-gradient",
    category: "Design",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Color Contrast Checker",
    description: "Check color accessibility compliance",
    icon: Palette,
    href: "/dashboard/color-contrast",
    category: "Design",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "Font Pairing Tool",
    description: "Discover perfect font combinations",
    icon: Type,
    href: "/dashboard/font-pairing",
    category: "Design",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Mockup Generator",
    description: "Create device mockups",
    icon: Palette,
    href: "/dashboard/mockup-generator",
    category: "Design",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    name: "Icon Generator",
    description: "Generate custom icons",
    icon: Palette,
    href: "/dashboard/icon-generator",
    category: "Design",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    name: "Banner Maker",
    description: "Create social media banners",
    icon: Palette,
    href: "/dashboard/banner-maker",
    category: "Design",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    name: "Base64 Converter",
    description: "Encode and decode Base64 text",
    icon: ArrowUpDown,
    href: "/dashboard/base64-converter",
    category: "Developer",
    bgColor: "bg-slate-50 dark:bg-slate-950/20",
    iconColor: "text-slate-600 dark:text-slate-400",
  },
  {
    name: "JSON Formatter",
    description: "Format, validate and minify JSON data",
    icon: FileText,
    href: "/dashboard/json-formatter",
    category: "Developer",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    popular: true,
  },
  {
    name: "Code Formatter",
    description: "Format JavaScript, CSS, HTML code",
    icon: FileText,
    href: "/dashboard/code-formatter",
    category: "Developer",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "API Tester",
    description: "Test REST API endpoints",
    icon: FileText,
    href: "/dashboard/api-tester",
    category: "Developer",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    popular: true,
  },
  {
    name: "SQL Formatter",
    description: "Format and minify SQL queries",
    icon: FileText,
    href: "/dashboard/sql-formatter",
    category: "Developer",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "CSS Minifier",
    description: "Minify CSS code for production",
    icon: FileText,
    href: "/dashboard/css-minifier",
    category: "Developer",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "JavaScript Minifier",
    description: "Minify JavaScript code",
    icon: FileText,
    href: "/dashboard/js-minifier",
    category: "Developer",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    name: "HTML Validator",
    description: "Validate HTML markup",
    icon: FileText,
    href: "/dashboard/html-validator",
    category: "Developer",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "Color Picker",
    description: "Pick and convert colors",
    icon: Palette,
    href: "/dashboard/color-picker",
    category: "Developer",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    name: "Git Ignore Generator",
    description: "Generate .gitignore files",
    icon: FileText,
    href: "/dashboard/git-ignore",
    category: "Developer",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
  {
    name: "Cron Generator",
    description: "Generate cron expressions",
    icon: FileText,
    href: "/dashboard/cron-generator",
    category: "Developer",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Lorem Code Generator",
    description: "Generate sample code snippets",
    icon: FileText,
    href: "/dashboard/lorem-code",
    category: "Developer",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes",
    icon: Hash,
    href: "/dashboard/hash-generator",
    category: "Security",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    name: "Password Strength Checker",
    description: "Check password security strength",
    icon: Shield,
    href: "/dashboard/password-strength",
    category: "Security",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "Encryption Tool",
    description: "Encrypt and decrypt text",
    icon: Shield,
    href: "/dashboard/encryption-tool",
    category: "Security",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Secure Notes",
    description: "Store encrypted notes securely",
    icon: Shield,
    href: "/dashboard/secure-notes",
    category: "Security",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Two-Factor Auth",
    description: "Generate 2FA codes and secrets",
    icon: Shield,
    href: "/dashboard/two-factor-auth",
    category: "Security",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Password Leak Check",
    description: "Check if password was breached",
    icon: Shield,
    href: "/dashboard/password-leak-check",
    category: "Security",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "SSL Certificate Checker",
    description: "Verify website SSL certificates",
    icon: Shield,
    href: "/dashboard/ssl-checker",
    category: "Security",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "VPN Checker",
    description: "Detect VPN and proxy connections",
    icon: Shield,
    href: "/dashboard/vpn-checker",
    category: "Security",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Secure File Delete",
    description: "Securely delete files permanently",
    icon: Shield,
    href: "/dashboard/secure-file-delete",
    category: "Security",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
  {
    name: "Network Scanner",
    description: "Scan network for devices and ports",
    icon: Shield,
    href: "/dashboard/network-scanner",
    category: "Security",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "File Hash Checker",
    description: "Generate and verify file hashes",
    icon: Shield,
    href: "/dashboard/file-hash-checker",
    category: "Security",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    name: "Unit Converter",
    description: "Convert between different units",
    icon: Calculator,
    href: "/dashboard/unit-converter",
    category: "Utility",
    bgColor: "bg-sky-50 dark:bg-sky-950/20",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to dates",
    icon: Calculator,
    href: "/dashboard/timestamp-converter",
    category: "Utility",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    name: "Random Generator",
    description: "Generate random numbers and strings",
    icon: Calculator,
    href: "/dashboard/random-generator",
    category: "Utility",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    name: "WiFi QR Generator",
    description: "Generate QR codes for WiFi networks",
    icon: QrCode,
    href: "/dashboard/wifi-qr",
    category: "Utility",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Stopwatch",
    description: "Timer with lap functionality",
    icon: Calculator,
    href: "/dashboard/stopwatch",
    category: "Utility",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Todo List",
    description: "Manage your daily tasks",
    icon: Calculator,
    href: "/dashboard/todo-list",
    category: "Utility",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    popular: true,
  },
  {
    name: "Expense Tracker",
    description: "Track your daily expenses",
    icon: Calculator,
    href: "/dashboard/expense-tracker",
    category: "Utility",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "IP Lookup",
    description: "Get information about IP addresses",
    icon: Calculator,
    href: "/dashboard/ip-lookup",
    category: "Utility",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs",
    icon: Type,
    href: "/dashboard/lorem-generator",
    category: "Text Tools",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    name: "Typing Master",
    description: "Practice and improve typing speed",
    icon: Type,
    href: "/dashboard/typing-master",
    category: "Text Tools",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "Text Summarizer",
    description: "Summarize long text automatically",
    icon: FileText,
    href: "/dashboard/text-summarizer",
    category: "Text Tools",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Text Translator",
    description: "Translate text between languages",
    icon: FileText,
    href: "/dashboard/text-translator",
    category: "Text Tools",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Text Diff Checker",
    description: "Compare two texts for differences",
    icon: FileText,
    href: "/dashboard/text-diff",
    category: "Text Tools",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Markdown Editor",
    description: "Edit and preview Markdown",
    icon: FileText,
    href: "/dashboard/markdown-editor",
    category: "Text Tools",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
  {
    name: "Duplicate Remover",
    description: "Remove duplicate lines from text",
    icon: FileText,
    href: "/dashboard/duplicate-remover",
    category: "Text Tools",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "Text Reverser",
    description: "Reverse text or words",
    icon: FileText,
    href: "/dashboard/text-reverser",
    category: "Text Tools",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Text Encoder",
    description: "Encode/decode URL and HTML text",
    icon: FileText,
    href: "/dashboard/text-encoder",
    category: "Text Tools",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    name: "Regex Tester",
    description: "Test regular expressions",
    icon: FileText,
    href: "/dashboard/regex-tester",
    category: "Text Tools",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    name: "Text Extractor",
    description: "Extract emails, URLs, numbers from text",
    icon: FileText,
    href: "/dashboard/text-extractor",
    category: "Text Tools",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Text to Speech",
    description: "Convert text to speech audio",
    icon: FileText,
    href: "/dashboard/text-to-speech",
    category: "Text Tools",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    name: "Text Password Generator",
    description: "Generate passwords from text",
    icon: FileText,
    href: "/dashboard/text-password-gen",
    category: "Text Tools",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Text Statistics",
    description: "Analyze text statistics and frequency",
    icon: BarChart3,
    href: "/dashboard/text-statistics",
    category: "Text Tools",
    bgColor: "bg-sky-50 dark:bg-sky-950/20",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
]

// Stats data is removed as per request
// const stats = [...]

const recentActivity = [
  { tool: "QR Generator", time: "5 minutes ago", status: "Completed", user: "Anonymous" },
  { tool: "Text to Image", time: "12 minutes ago", status: "Processing", user: "Anonymous" },
  { tool: "PDF to Text", time: "15 minutes ago", status: "Completed", user: "Anonymous" },
  { tool: "Image Compressor", time: "20 minutes ago", status: "Completed", user: "Anonymous" },
  { tool: "Social Media Bio Generator", time: "25 minutes ago", status: "Completed", user: "Anonymous" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to MediaTools Pro</h1>
        <p className="text-muted-foreground">Your all-in-one platform for media processing and conversion tools</p>
      </div>

      {/* Tools by Category */}
      <div className="space-y-8">
        {/* PDF Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              PDF Tools
            </CardTitle>
            <CardDescription>Convert, merge, and extract from PDF files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter(tool => tool.category === "PDF Tools").map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    {tool.popular && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-1 h-3 w-3" />Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                          <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                        </div>
                        <h3 className="font-medium text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Image Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LucideImage className="mr-2 h-5 w-5" />
              Image Tools
            </CardTitle>
            <CardDescription>Compress, resize, and edit images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter(tool => tool.category === "Image Tools").map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    {tool.popular && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-1 h-3 w-3" />Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                          <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                        </div>
                        <h3 className="font-medium text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Text Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="mr-2 h-5 w-5" />
              Text Tools
            </CardTitle>
            <CardDescription>Analyze, convert, and generate text</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter(tool => tool.category === "Text Tools").map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    {tool.popular && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-1 h-3 w-3" />Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                          <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                        </div>
                        <h3 className="font-medium text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Utility Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Utility Tools
            </CardTitle>
            <CardDescription>Helpful everyday tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter(tool => tool.category === "Utility").map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    {tool.popular && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-1 h-3 w-3" />Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                          <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                        </div>
                        <h3 className="font-medium text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Developer Tools */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Tools
              </CardTitle>
              <CardDescription>Security and encryption utilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {tools.filter(tool => tool.category === "Security").map((tool, index) => (
                  <Link key={index} href={tool.href}>
                    <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      {tool.popular && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />Popular
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                            <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                          </div>
                          <h3 className="font-medium text-sm">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Developer Tools
              </CardTitle>
              <CardDescription>Development and coding utilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {tools.filter(tool => tool.category === "Developer").map((tool, index) => (
                  <Link key={index} href={tool.href}>
                    <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      {tool.popular && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />Popular
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                            <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                          </div>
                          <h3 className="font-medium text-sm">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Design Tools
            </CardTitle>
            <CardDescription>Design and creative utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter(tool => tool.category === "Design").map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                          <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                        </div>
                        <h3 className="font-medium text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              AI Tools
            </CardTitle>
            <CardDescription>AI-powered creative tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.filter(tool => tool.category === "AI Tools").map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    {tool.new && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="text-xs">New</Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor}`}>
                          <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                        </div>
                        <h3 className="font-medium text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest tool usage across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.tool}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === "Completed" ? "default" : "secondary"} className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Tools Today</CardTitle>
            <CardDescription>Most used tools in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tools
                .filter((tool) => tool.popular)
                .map((tool, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tool.bgColor}`}>
                      <tool.icon className={`h-4 w-4 ${tool.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 500) + 100} uses today
                      </p>
                    </div>
                    <Link href={tool.href}>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}