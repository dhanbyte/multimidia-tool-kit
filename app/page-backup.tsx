'use client';

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Download,
  QrCode,
  Upload,
  ImageIcon,
  FileText,
  FileImage,
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
  Palette
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const allTools = [
  {
    name: "QR Generator",
    description: "Generate custom QR codes for any text, URL, or data",
    icon: QrCode,
    href: "/dashboard/qr-generator",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
    keywords: ["qr", "code", "generator", "barcode", "scan"]
  },
  {
    name: "Image Compressor",
    description: "Compress multiple images at once for web optimization",
    icon: LucideImage,
    href: "/dashboard/image-tools/image-compressor",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    popular: true,
    keywords: ["image", "compress", "optimize", "reduce", "size"]
  },
  {
    name: "PDF Compress",
    description: "Reduce PDF file size while maintaining quality",
    icon: FileText,
    href: "/dashboard/pdf-tools/pdf-compress",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    popular: true,
    keywords: ["pdf", "compress", "reduce", "size", "optimize"]
  },
  {
    name: "Typing Master",
    description: "Improve your typing speed and accuracy with practice tests",
    icon: Keyboard,
    href: "/dashboard/typing-master",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    popular: true,
    keywords: ["typing", "speed", "test", "practice", "wpm", "keyboard"]
  },
  {
    name: "Text Summarizer",
    description: "Summarize long text instantly with AI technology",
    icon: FileType,
    href: "/dashboard/text-tools/text-summarizer",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    keywords: ["text", "summarize", "ai", "summary", "article"]
  },
  {
    name: "Password Generator",
    description: "Generate strong, secure passwords with custom options",
    icon: Shield,
    href: "/dashboard/security-tools/password-generator",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    keywords: ["password", "generator", "secure", "strong", "random"]
  },
  {
    name: "Color Picker",
    description: "Pick colors from images and get HEX, RGB values",
    icon: Palette,
    href: "/dashboard/developer-tools/color-picker",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    keywords: ["color", "picker", "hex", "rgb", "palette"]
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes for text and files",
    icon: Hash,
    href: "/dashboard/security-tools/hash-generator",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    keywords: ["hash", "md5", "sha1", "sha256", "checksum"]
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages to high-quality JPG images",
    icon: FileImage,
    href: "/dashboard/pdf-tools/pdf-to-jpg",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    keywords: ["pdf", "jpg", "convert", "image", "pages"]
  }
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
  { label: "Tools Available", value: `${allTools.length}+`, icon: Zap },
  { label: "Success Rate", value: "99.9%", icon: CheckCircle },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(allTools.slice(0, 6));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTools(allTools.slice(0, 6));
      return;
    }

    const filtered = allTools.filter(tool => 
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.keywords?.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredTools(filtered.slice(0, 9));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
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
              <Button>
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
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Star className="mr-2 h-4 w-4 fill-current" />
              Trusted by 500K+ users worldwide
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              All-in-One{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Media Toolkit
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Generate QR codes, convert files, compress images, and more - all in one powerful platform. Fast, secure,
              and completely free to use.
            </p>
            <div className="flex flex-col gap-8 sm:items-center">
              <div className="relative max-w-lg mx-auto w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search tools... (e.g., 'typing test', 'pdf compress')"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base border-2 rounded-xl shadow-lg focus:shadow-xl transition-all"
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Using Tools
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-2 hover:bg-muted/50 transition-all">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
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

        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              {filteredTools.length > 0 
                ? `Found ${filteredTools.length} tool${filteredTools.length === 1 ? '' : 's'} for "${searchQuery}"`
                : `No tools found for "${searchQuery}". Try different keywords.`
              }
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, index) => (
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
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {tool.name}
                      {tool.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                    </CardTitle>
                  </div>
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