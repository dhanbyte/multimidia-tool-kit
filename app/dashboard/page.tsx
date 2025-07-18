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
  Image as LucideImage, // For Image Compressor (renamed to avoid conflict with ImageIcon)
} from "lucide-react"

// Removed unused icons: Download, Users, Clock, TrendingUp as stats are removed
// Removed unused imports due to stats removal: Download, Users, Clock, TrendingUp

const tools = [
  // --- NEW TOOLS ---
  {
    name: "Image Compressor",
    description: "Compress multiple images at once for web optimization",
    icon: LucideImage, // Using Lucide 'Image' icon
    href: "/dashboard/image-compressor",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    new: true, // Mark as new
    popular: true, // Mark as popular
  },
  {
    name: "Social Media Bio Generator",
    description: "Generate creative and catchy social media bios using AI",
    icon: Zap, // Using Lucide 'Zap' icon (good for AI tools)
    href: "/dashboard/social-bio-generator",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    new: true, // Mark as new
    popular: true, // Also popular if desired
  },
  // --- OTHER EXISTING TOOLS ---
  {
    name: "QR Generator",
    description: "Generate QR codes for any content",
    icon: QrCode,
    href: "/dashboard/qr-generator",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
  },
  {
    name: "Image Hosting",
    description: "Upload and host images with URLs",
    icon: Upload,
    href: "/dashboard/image-hosting",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    popular: true,
  },
  {
    name: "Text to Image",
    description: "Generate images from text using AI",
    icon: ImageIcon,
    href: "/dashboard/text-to-image",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    new: true,
    popular: true,
  },
  {
    name: "PDF to Text",
    description: "Extract text from PDF documents",
    icon: FileText,
    href: "/dashboard/pdf-to-text",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages to images",
    icon: FileImage,
    href: "/dashboard/pdf-to-jpg",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
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

      {/* Quick Access Tools */}
      {/* This section is moved up to replace the stats cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Quick Access Tools
              </CardTitle>
              <CardDescription>Click on any tool to get started instantly</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-3 right-3 flex space-x-1">
                    {tool.popular && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="mr-1 h-3 w-3" />
                        Popular
                      </Badge>
                    )}
                    {tool.new && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.bgColor} transition-transform duration-200 group-hover:scale-110`}
                      >
                        <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

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