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
    name: "PDF Compress",
    description: "Reduce PDF file size",
    icon: FileText,
    href: "/dashboard/pdf-compress",
    category: "PDF Tools",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    popular: true,
  },
  // IMAGE TOOLS
  {
    name: "Image Compressor",
    description: "Compress images for web",
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
  // UTILITY TOOLS
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
    name: "Password Generator",
    description: "Generate secure passwords",
    icon: Shield,
    href: "/dashboard/password-generator",
    category: "Security",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    popular: true,
  },
  {
    name: "Color Picker",
    description: "Pick and convert colors",
    icon: Palette,
    href: "/dashboard/color-picker",
    category: "Design",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    popular: true,
  },
  {
    name: "Typing Master",
    description: "Practice typing speed",
    icon: Type,
    href: "/dashboard/typing-master",
    category: "Text Tools",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "Text Translator",
    description: "Translate text between languages",
    icon: FileText,
    href: "/dashboard/text-translator",
    category: "Text Tools",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    popular: true,
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
    name: "URL Shortener",
    description: "Shorten long URLs",
    icon: LinkIcon,
    href: "/dashboard/url-shortener",
    category: "Utility",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "IP Lookup",
    description: "Get IP address information",
    icon: Calculator,
    href: "/dashboard/ip-lookup",
    category: "Utility",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
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
    name: "VPN Checker",
    description: "Detect VPN connections",
    icon: Shield,
    href: "/dashboard/vpn-checker",
    category: "Security",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Two-Factor Auth",
    description: "Generate 2FA codes",
    icon: Shield,
    href: "/dashboard/two-factor-auth",
    category: "Security",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Network Scanner",
    description: "Scan network devices",
    icon: Shield,
    href: "/dashboard/network-scanner",
    category: "Security",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "File Hash Checker",
    description: "Generate file hashes",
    icon: Shield,
    href: "/dashboard/file-hash-checker",
    category: "Security",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    name: "Secure File Delete",
    description: "Securely delete files",
    icon: Shield,
    href: "/dashboard/secure-file-delete",
    category: "Security",
    bgColor: "bg-gray-50 dark:bg-gray-950/20",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">MultiTool by Dhanbyte</h1>
        <p className="text-sm sm:text-base text-muted-foreground">100+ free online tools for all your needs</p>
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
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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

      {/* All Tools */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            All Tools
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Browse all available tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {tools.map((tool, index) => (
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
                      <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                        {tool.description.length > 20 ? tool.description.substring(0, 20) + '...' : tool.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">100+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Tools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">500K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">10M+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Files</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">99.9%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}