import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Download, // Download icon is still imported as it's used in the header and stats
  QrCode,
  Upload,
  ImageIcon, // For Text to Image
  FileText,
  FileImage,
  Zap, // For Social Media Bio Generator and features
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Image as LucideImage, // For Image Compressor
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const tools = [
  // --- NEW TOOLS YOU WANT TO KEEP ---
  {
    name: "Image Compressor",
    description: "Compress multiple images at once for web optimization",
    icon: LucideImage, // Using Lucide 'Image' icon
    href: "/dashboard/image-compressor",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    new: true,
    popular: true,
  },
  {
    name: "Social Media Bio Generator",
    description: "Generate creative and catchy social media bios using AI",
    icon: Zap, // Using Lucide 'Zap' icon
    href: "/dashboard/social-bio-generator",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    new: true,
    popular: true,
  },
  // --- OTHER EXISTING TOOLS (from your provided code) ---
  {
    name: "QR Generator",
    description: "Generate custom QR codes for any text, URL, or data",
    icon: QrCode,
    href: "/dashboard/qr-generator",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Image Hosting",
    description: "Upload images and get shareable URLs instantly",
    icon: Upload,
    href: "/dashboard/image-hosting",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Text to Image",
    description: "Generate stunning images from text descriptions using AI",
    icon: ImageIcon,
    href: "/dashboard/text-to-image",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "PDF to Text",
    description: "Extract text content from PDF documents instantly",
    icon: FileText,
    href: "/dashboard/pdf-to-text",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages to high-quality JPG images",
    icon: FileImage,
    href: "/dashboard/pdf-to-jpg",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
  },
]

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process your files and downloads in seconds with our optimized servers and advanced algorithms.",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your files are processed securely with end-to-end encryption and automatically deleted after use.",
  },
  {
    icon: Users,
    title: "No Registration",
    description: "Use all tools instantly without creating an account or providing any personal information.",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Our platform is available round the clock with 99.9% uptime guarantee for your convenience.",
  },
]

const stats = [
  { label: "Files Processed", value: "10M+", icon: Download }, // Changed label from Downloads to Files Processed
  { label: "Happy Users", value: "500K+", icon: Users },
  { label: "Tools Available", value: `${tools.length}+`, icon: Zap }, // Dynamically get tool count
  { label: "Success Rate", value: "99.9%", icon: CheckCircle },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediaTools Pro
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-10 md:py-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Star className="mr-1 h-3 w-3" />
            Trusted by 500K+ users worldwide
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            All-in-One{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Media Toolkit
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Generate QR codes, convert files, compress images, and more - all in one powerful platform. Fast, secure,
            and completely free to use.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                <Zap className="mr-2 h-5 w-5" />
                Start Using Tools
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              View All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}


      {/* Tools Grid */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Powerful Tools at Your Fingertips</h2>
          <p className="text-lg text-muted-foreground">
            Choose from our comprehensive suite of media tools designed to make your life easier
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />
              <CardHeader className="relative">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.bgColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="mb-4 text-muted-foreground">{tool.description}</CardDescription>
                <Link href={tool.href}>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                  >
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Choose MediaTools Pro?</h2>
            <p className="text-lg text-muted-foreground">
              Built with cutting-edge technology to provide the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who trust MediaTools Pro for their daily media needs
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              <Zap className="mr-2 h-5 w-5" />
              Access All Tools Free
            </Button>
          </Link>
        </div>
      </section>
            <section className="border-y bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Download className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">MediaTools Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 MediaTools Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}