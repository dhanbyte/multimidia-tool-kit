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

const tools = [
  // PDF TOOLS
  { name: "PDF to Word", description: "Convert PDF files to Word documents", icon: FileText, href: "/dashboard/pdf-to-word", category: "PDF Tools", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400", popular: true },
  { name: "Merge PDF", description: "Combine multiple PDF files into one", icon: FileText, href: "/dashboard/merge-pdf", category: "PDF Tools", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400", popular: true },
  { name: "PDF to JPG", description: "Convert PDF pages to images", icon: FileImage, href: "/dashboard/pdf-to-jpg", category: "PDF Tools", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-500", popular: true },
  { name: "PDF Compress", description: "Reduce PDF file size", icon: FileText, href: "/dashboard/pdf-compress", category: "PDF Tools", bgColor: "bg-violet-50 dark:bg-violet-950/20", iconColor: "text-violet-600 dark:text-violet-400", popular: true },
  { name: "PDF to Text", description: "Extract text from PDF files", icon: FileText, href: "/dashboard/pdf-to-text", category: "PDF Tools", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400" },
  { name: "PDF Split", description: "Split PDF into multiple files", icon: Scissors, href: "/dashboard/pdf-split", category: "PDF Tools", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400" },
  { name: "PDF Rotate", description: "Rotate PDF pages", icon: ArrowUpDown, href: "/dashboard/pdf-rotate", category: "PDF Tools", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { name: "PDF Watermark", description: "Add watermark to PDF", icon: FileText, href: "/dashboard/pdf-watermark", category: "PDF Tools", bgColor: "bg-indigo-50 dark:bg-indigo-950/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
  { name: "PDF Password", description: "Add/remove PDF password", icon: Shield, href: "/dashboard/pdf-password", category: "PDF Tools", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400" },
  { name: "PDF Metadata", description: "Edit PDF metadata", icon: FileText, href: "/dashboard/pdf-metadata", category: "PDF Tools", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400" },
  { name: "PDF Signature", description: "Add digital signature", icon: FileText, href: "/dashboard/pdf-signature", category: "PDF Tools", bgColor: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { name: "PDF OCR", description: "Extract text from scanned PDF", icon: FileText, href: "/dashboard/pdf-ocr", category: "PDF Tools", bgColor: "bg-pink-50 dark:bg-pink-950/20", iconColor: "text-pink-600 dark:text-pink-400" },
  
  // IMAGE TOOLS
  { name: "Image Compressor", description: "Compress images for web", icon: LucideImage, href: "/dashboard/image-compressor", category: "Image Tools", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400", popular: true },
  { name: "Image Resizer", description: "Resize images to custom dimensions", icon: LucideImage, href: "/dashboard/image-resizer", category: "Image Tools", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400", popular: true },
  { name: "Image Cropper", description: "Crop images with precision", icon: Crop, href: "/dashboard/image-cropper", category: "Image Tools", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400" },
  { name: "Background Remover", description: "Remove image backgrounds", icon: LucideImage, href: "/dashboard/background-remover", category: "Image Tools", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400" },
  { name: "Image Format Converter", description: "Convert between image formats", icon: ArrowUpDown, href: "/dashboard/image-format-converter", category: "Image Tools", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-400" },
  { name: "Image Watermark", description: "Add watermark to images", icon: LucideImage, href: "/dashboard/image-watermark", category: "Image Tools", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { name: "Image Filter", description: "Apply filters to images", icon: Sparkles, href: "/dashboard/image-filter", category: "Image Tools", bgColor: "bg-violet-50 dark:bg-violet-950/20", iconColor: "text-violet-600 dark:text-violet-400" },
  { name: "Image Rotate", description: "Rotate and flip images", icon: ArrowUpDown, href: "/dashboard/image-rotate", category: "Image Tools", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400" },
  { name: "Image Hosting", description: "Host images online", icon: Upload, href: "/dashboard/image-hosting", category: "Image Tools", bgColor: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  
  // TEXT TOOLS
  { name: "Text Translator", description: "Translate text between languages", icon: FileText, href: "/dashboard/text-translator", category: "Text Tools", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400", popular: true },
  { name: "Typing Master", description: "Practice typing speed", icon: Type, href: "/dashboard/typing-master", category: "Text Tools", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400", popular: true },
  { name: "Word Counter", description: "Count words and characters", icon: BarChart3, href: "/dashboard/word-counter", category: "Text Tools", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400" },
  { name: "Text Summarizer", description: "Summarize long text", icon: FileText, href: "/dashboard/text-summarizer", category: "Text Tools", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400" },
  { name: "Case Converter", description: "Convert text case", icon: Type, href: "/dashboard/case-converter", category: "Text Tools", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-400" },
  { name: "Text Diff", description: "Compare text differences", icon: FileText, href: "/dashboard/text-diff", category: "Text Tools", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { name: "Text Encoder", description: "Encode/decode text", icon: Hash, href: "/dashboard/text-encoder", category: "Text Tools", bgColor: "bg-indigo-50 dark:bg-indigo-950/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
  { name: "Lorem Generator", description: "Generate placeholder text", icon: FileText, href: "/dashboard/lorem-generator", category: "Text Tools", bgColor: "bg-violet-50 dark:bg-violet-950/20", iconColor: "text-violet-600 dark:text-violet-400" },
  { name: "Text Reverser", description: "Reverse text strings", icon: ArrowUpDown, href: "/dashboard/text-reverser", category: "Text Tools", bgColor: "bg-pink-50 dark:bg-pink-950/20", iconColor: "text-pink-600 dark:text-pink-400" },
  { name: "Duplicate Remover", description: "Remove duplicate lines", icon: Scissors, href: "/dashboard/duplicate-remover", category: "Text Tools", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400" },
  { name: "Text Statistics", description: "Analyze text statistics", icon: BarChart3, href: "/dashboard/text-statistics", category: "Text Tools", bgColor: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { name: "Text to Image", description: "Convert text to image", icon: LucideImage, href: "/dashboard/text-to-image", category: "Text Tools", bgColor: "bg-gray-50 dark:bg-gray-950/20", iconColor: "text-gray-600 dark:text-gray-400" },
  { name: "Text to Speech", description: "Convert text to speech", icon: FileText, href: "/dashboard/text-to-speech", category: "Text Tools", bgColor: "bg-rose-50 dark:bg-rose-950/20", iconColor: "text-rose-600 dark:text-rose-400" },
  { name: "Markdown Editor", description: "Edit markdown files", icon: FileText, href: "/dashboard/markdown-editor", category: "Text Tools", bgColor: "bg-teal-50 dark:bg-teal-950/20", iconColor: "text-teal-600 dark:text-teal-400" },
  { name: "Text Extractor", description: "Extract text from files", icon: FileText, href: "/dashboard/text-extractor", category: "Text Tools", bgColor: "bg-amber-50 dark:bg-amber-950/20", iconColor: "text-amber-600 dark:text-amber-400" },
  
  // UTILITY TOOLS
  { name: "QR Generator", description: "Generate QR codes for any content", icon: QrCode, href: "/dashboard/qr-generator", category: "Utility", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400", popular: true },
  { name: "Stopwatch", description: "Timer with lap functionality", icon: Calculator, href: "/dashboard/stopwatch", category: "Utility", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400", popular: true },
  { name: "Todo List", description: "Manage your daily tasks", icon: Calculator, href: "/dashboard/todo-list", category: "Utility", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400", popular: true },
  { name: "Expense Tracker", description: "Track your daily expenses", icon: Calculator, href: "/dashboard/expense-tracker", category: "Utility", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400", popular: true },
  { name: "URL Shortener", description: "Shorten long URLs", icon: LinkIcon, href: "/dashboard/url-shortener", category: "Utility", bgColor: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "text-emerald-600 dark:text-emerald-400", popular: true },
  { name: "IP Lookup", description: "Get IP address information", icon: Calculator, href: "/dashboard/ip-lookup", category: "Utility", bgColor: "bg-indigo-50 dark:bg-indigo-950/20", iconColor: "text-indigo-600 dark:text-indigo-400", popular: true },
  { name: "Unit Converter", description: "Convert between units", icon: ArrowUpDown, href: "/dashboard/unit-converter", category: "Utility", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400" },
  { name: "Random Generator", description: "Generate random data", icon: Sparkles, href: "/dashboard/random-generator", category: "Utility", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { name: "Timestamp Converter", description: "Convert timestamps", icon: Calculator, href: "/dashboard/timestamp-converter", category: "Utility", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-400" },
  { name: "WiFi QR", description: "Generate WiFi QR codes", icon: QrCode, href: "/dashboard/wifi-qr", category: "Utility", bgColor: "bg-pink-50 dark:bg-pink-950/20", iconColor: "text-pink-600 dark:text-pink-400" },
  
  // SECURITY TOOLS
  { name: "Password Generator", description: "Generate secure passwords", icon: Shield, href: "/dashboard/password-generator", category: "Security", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400", popular: true },
  { name: "Encryption Tool", description: "Encrypt and decrypt text", icon: Shield, href: "/dashboard/encryption-tool", category: "Security", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400", popular: true },
  { name: "Hash Generator", description: "Generate hash values", icon: Hash, href: "/dashboard/hash-generator", category: "Security", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400" },
  { name: "Password Strength", description: "Check password strength", icon: Shield, href: "/dashboard/password-strength", category: "Security", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400" },
  { name: "Two-Factor Auth", description: "Generate 2FA codes", icon: Shield, href: "/dashboard/two-factor-auth", category: "Security", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400" },
  { name: "Secure Notes", description: "Store encrypted notes", icon: Shield, href: "/dashboard/secure-notes", category: "Security", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-400" },
  { name: "Password Leak Check", description: "Check if password is leaked", icon: Shield, href: "/dashboard/password-leak-check", category: "Security", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400" },
  { name: "Network Scanner", description: "Scan network devices", icon: Shield, href: "/dashboard/network-scanner", category: "Security", bgColor: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { name: "File Hash Checker", description: "Generate file hashes", icon: Shield, href: "/dashboard/file-hash-checker", category: "Security", bgColor: "bg-rose-50 dark:bg-rose-950/20", iconColor: "text-rose-600 dark:text-rose-400" },
  { name: "Secure File Delete", description: "Securely delete files", icon: Shield, href: "/dashboard/secure-file-delete", category: "Security", bgColor: "bg-gray-50 dark:bg-gray-950/20", iconColor: "text-gray-600 dark:text-gray-400" },
  { name: "SSL Checker", description: "Check SSL certificate", icon: Shield, href: "/dashboard/ssl-checker", category: "Security", bgColor: "bg-indigo-50 dark:bg-indigo-950/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
  { name: "VPN Checker", description: "Detect VPN connections", icon: Shield, href: "/dashboard/vpn-checker", category: "Security", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  
  // DEVELOPER TOOLS
  { name: "Color Picker", description: "Pick and convert colors", icon: Palette, href: "/dashboard/color-picker", category: "Design", bgColor: "bg-pink-50 dark:bg-pink-950/20", iconColor: "text-pink-600 dark:text-pink-400", popular: true },
  { name: "JSON Formatter", description: "Format and validate JSON", icon: FileText, href: "/dashboard/json-formatter", category: "Developer", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400" },
  { name: "Code Formatter", description: "Format code beautifully", icon: FileText, href: "/dashboard/code-formatter", category: "Developer", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400" },
  { name: "Base64 Converter", description: "Encode/decode Base64", icon: Hash, href: "/dashboard/base64-converter", category: "Developer", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400" },
  { name: "Regex Tester", description: "Test regular expressions", icon: FileText, href: "/dashboard/regex-tester", category: "Developer", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400" },
  { name: "CSS Minifier", description: "Minify CSS code", icon: FileText, href: "/dashboard/css-minifier", category: "Developer", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-400" },
  { name: "HTML Validator", description: "Validate HTML code", icon: FileText, href: "/dashboard/html-validator", category: "Developer", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400" },
  { name: "API Tester", description: "Test REST APIs", icon: FileText, href: "/dashboard/api-tester", category: "Developer", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { name: "SQL Formatter", description: "Format SQL queries", icon: FileText, href: "/dashboard/sql-formatter", category: "Developer", bgColor: "bg-indigo-50 dark:bg-indigo-950/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
  { name: "JS Minifier", description: "Minify JavaScript code", icon: FileText, href: "/dashboard/js-minifier", category: "Developer", bgColor: "bg-violet-50 dark:bg-violet-950/20", iconColor: "text-violet-600 dark:text-violet-400" },
  { name: "Cron Generator", description: "Generate cron expressions", icon: Calculator, href: "/dashboard/cron-generator", category: "Developer", bgColor: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { name: "Git Ignore", description: "Generate .gitignore files", icon: FileText, href: "/dashboard/git-ignore", category: "Developer", bgColor: "bg-pink-50 dark:bg-pink-950/20", iconColor: "text-pink-600 dark:text-pink-400" },
  
  // DESIGN TOOLS
  { name: "Color Palette", description: "Generate color palettes", icon: Palette, href: "/dashboard/color-palette", category: "Design", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400" },
  { name: "CSS Gradient", description: "Generate CSS gradients", icon: Palette, href: "/dashboard/css-gradient", category: "Design", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400" },
  { name: "Gradient Generator", description: "Create beautiful gradients", icon: Palette, href: "/dashboard/gradient-generator", category: "Design", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400" },
  { name: "Logo Maker", description: "Create simple logos", icon: Sparkles, href: "/dashboard/logo-maker", category: "Design", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400" },
  { name: "Favicon Generator", description: "Generate website favicons", icon: LucideImage, href: "/dashboard/favicon-generator", category: "Design", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-400" },
  { name: "Color Contrast", description: "Check color contrast", icon: Palette, href: "/dashboard/color-contrast", category: "Design", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400" },
  { name: "Mockup Generator", description: "Create device mockups", icon: LucideImage, href: "/dashboard/mockup-generator", category: "Design", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { name: "Icon Generator", description: "Generate custom icons", icon: Sparkles, href: "/dashboard/icon-generator", category: "Design", bgColor: "bg-indigo-50 dark:bg-indigo-950/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
  { name: "Banner Maker", description: "Create social media banners", icon: LucideImage, href: "/dashboard/banner-maker", category: "Design", bgColor: "bg-violet-50 dark:bg-violet-950/20", iconColor: "text-violet-600 dark:text-violet-400" },
  { name: "Font Pairing", description: "Find perfect font combinations", icon: Type, href: "/dashboard/font-pairing", category: "Design", bgColor: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  
  // AI TOOLS
  { name: "AI Content Writer", description: "Generate content with AI", icon: Sparkles, href: "/dashboard/ai-content-writer", category: "AI Tools", bgColor: "bg-purple-50 dark:bg-purple-950/20", iconColor: "text-purple-600 dark:text-purple-400" },
  { name: "AI Code Generator", description: "Generate code with AI", icon: FileText, href: "/dashboard/ai-code-generator", category: "AI Tools", bgColor: "bg-blue-50 dark:bg-blue-950/20", iconColor: "text-blue-600 dark:text-blue-400" },
  { name: "AI Chatbot", description: "Chat with AI assistant", icon: Sparkles, href: "/dashboard/ai-chatbot", category: "AI Tools", bgColor: "bg-green-50 dark:bg-green-950/20", iconColor: "text-green-600 dark:text-green-400" },
  { name: "AI Email Writer", description: "Write emails with AI", icon: FileText, href: "/dashboard/ai-email-writer", category: "AI Tools", bgColor: "bg-red-50 dark:bg-red-950/20", iconColor: "text-red-600 dark:text-red-400" },
  { name: "AI Image Enhancer", description: "Enhance images with AI", icon: LucideImage, href: "/dashboard/ai-image-enhancer", category: "AI Tools", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", iconColor: "text-yellow-600 dark:text-yellow-400" },
  { name: "AI Name Generator", description: "Generate names with AI", icon: Sparkles, href: "/dashboard/ai-name-generator", category: "AI Tools", bgColor: "bg-orange-50 dark:bg-orange-950/20", iconColor: "text-orange-600 dark:text-orange-400" },
  { name: "AI Story Generator", description: "Generate stories with AI", icon: FileText, href: "/dashboard/ai-story-generator", category: "AI Tools", bgColor: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  { name: "Social Bio Generator", description: "Generate social media bios", icon: FileText, href: "/dashboard/social-bio-generator", category: "AI Tools", bgColor: "bg-indigo-50 dark:bg-indigo-950/20", iconColor: "text-indigo-600 dark:text-indigo-400" },
]

export default function DashboardPage() {
  const categories = [
    { name: "PDF Tools", icon: FileText, color: "text-red-600" },
    { name: "Image Tools", icon: LucideImage, color: "text-blue-600" },
    { name: "Text Tools", icon: Type, color: "text-green-600" },
    { name: "Utility", icon: Calculator, color: "text-purple-600" },
    { name: "Security", icon: Shield, color: "text-orange-600" },
    { name: "Developer", icon: FileText, color: "text-cyan-600" },
    { name: "Design", icon: Palette, color: "text-pink-600" },
    { name: "AI Tools", icon: Sparkles, color: "text-violet-600" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">MultiTool by Dhanbyte</h1>
        <p className="text-sm sm:text-base text-muted-foreground">100+ free online tools organized by category</p>
      </div>

      {/* Popular Tools */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Star className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Popular Tools
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Most used tools by our community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {tools.filter(tool => tool.popular).map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-1 right-1">
                    <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                      <Star className="h-2 w-2" />
                    </Badge>
                  </div>
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex flex-col items-center text-center space-y-1">
                      <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg ${tool.bgColor}`}>
                        <tool.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${tool.iconColor}`} />
                      </div>
                      <h3 className="font-medium text-xs leading-tight line-clamp-2">
                        {tool.name.length > 12 ? tool.name.substring(0, 12) + '...' : tool.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools by Category */}
      {categories.map((category) => {
        const categoryTools = tools.filter(tool => tool.category === category.name)
        if (categoryTools.length === 0) return null
        
        return (
          <Card key={category.name}>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center">
                <category.icon className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${category.color}`} />
                {category.name} ({categoryTools.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                {categoryTools.map((tool, index) => (
                  <Link key={index} href={tool.href}>
                    <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      {tool.popular && (
                        <div className="absolute top-1 right-1">
                          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                            <Star className="h-2 w-2" />
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-2 sm:p-3">
                        <div className="flex flex-col items-center text-center space-y-1">
                          <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg ${tool.bgColor}`}>
                            <tool.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${tool.iconColor}`} />
                          </div>
                          <h3 className="font-medium text-xs leading-tight line-clamp-2">
                            {tool.name.length > 12 ? tool.name.substring(0, 12) + '...' : tool.name}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{tools.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Tools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">{categories.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">{tools.filter(t => t.popular).length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Popular</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">Free</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Always</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}