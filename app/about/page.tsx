import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Code, Video, Award, Target, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "About MultiTool by Dhanbyte - Meet the Creator | Free Online Tools",
  description: "Learn about Dhananjay (Dhanbyte), Full Stack Developer & Video Editor who created MultiTool - your ultimate collection of 100+ free online tools. Discover our mission to make digital tools accessible to everyone.",
  keywords: "about dhanbyte, dhananjay developer, multitool creator, full stack developer, video editor, free online tools developer, web developer portfolio",
  openGraph: {
    title: "About MultiTool by Dhanbyte - Meet the Creator",
    description: "Meet Dhananjay (Dhanbyte), the Full Stack Developer & Video Editor behind MultiTool - 100+ free online tools for everyone.",
    url: "https://dhanbyte.me/about",
    siteName: "MultiTool by Dhanbyte",
    type: "website",
  },
  alternates: {
    canonical: "https://dhanbyte.me/about",
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">About MultiTool by Dhanbyte</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the story behind your favorite collection of free online tools and meet the developer who made it all possible.
          </p>
        </div>

        {/* Creator Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meet the Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-semibold">Dhananjay (Dhanbyte)</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    Full Stack Developer
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video Editor
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Tool Creator
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Hi! I'm Dhananjay, better known as Dhanbyte in the digital world. As a passionate Full Stack Developer and Video Editor, 
                  I created MultiTool to solve everyday digital challenges that people face. With years of experience in web development 
                  and content creation, I understand the need for reliable, fast, and free online tools.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  My journey started when I realized how scattered and often expensive online tools were. I wanted to create a 
                  one-stop solution where anyone could access professional-grade tools without paying hefty subscription fees or 
                  dealing with complicated interfaces.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              MultiTool by Dhanbyte exists to democratize access to digital tools. We believe that everyone should have access to 
              professional-grade utilities without breaking the bank or compromising on quality.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">🚀 Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Constantly adding new tools and improving existing ones based on user feedback and emerging needs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">🔒 Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  All processing happens in your browser. We don't store your files or personal data on our servers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">⚡ Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized for speed and efficiency, ensuring you get results quickly without compromising quality.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">🌍 Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Free for everyone, everywhere. No hidden fees, no premium tiers, just pure functionality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why MultiTool */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Why Choose MultiTool?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">100+ Tools in One Place</h3>
                  <p className="text-sm text-muted-foreground">
                    From PDF converters to image editors, password generators to typing tests - everything you need is here.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">No Registration Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Start using any tool immediately. No sign-ups, no email verification, no hassle.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Mobile-First Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized for all devices. Use our tools seamlessly on your phone, tablet, or desktop.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold">Regular Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    New tools and features added regularly based on user requests and industry trends.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">Have Questions or Suggestions?</h2>
            <p className="text-muted-foreground mb-6">
              I'd love to hear from you! Whether you have feedback, feature requests, or just want to say hello.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </a>
              <a 
                href="/dashboard" 
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Explore Tools
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}