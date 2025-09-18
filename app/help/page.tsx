import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Book, Shield, Zap, Users, Star } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help Center - MultiTool by Dhanbyte | How to Use Free Online Tools",
  description: "Get help using MultiTool's 100+ free online tools. Find tutorials, FAQs, troubleshooting guides, and tips for PDF converters, image tools, text utilities, and more.",
  keywords: "multitool help, how to use online tools, pdf converter help, image compressor guide, free tools tutorial, dhanbyte help center",
  openGraph: {
    title: "Help Center - MultiTool by Dhanbyte",
    description: "Get help and learn how to use our 100+ free online tools effectively.",
    url: "https://dhanbyte.me/help",
    siteName: "MultiTool by Dhanbyte",
    type: "website",
  },
  alternates: {
    canonical: "https://dhanbyte.me/help",
  },
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Help Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about using MultiTool's free online tools effectively and safely.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Book className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-lg">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                New to MultiTool? Learn the basics and start using our tools in minutes.
              </p>
              <Link href="#getting-started" className="text-sm text-blue-600 hover:underline">
                Read Guide →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-lg">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Learn how we protect your data and ensure your files remain private.
              </p>
              <Link href="#privacy" className="text-sm text-green-600 hover:underline">
                Learn More →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <CardTitle className="text-lg">Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Having issues? Find solutions to common problems and error messages.
              </p>
              <Link href="#troubleshooting" className="text-sm text-orange-600 hover:underline">
                Get Help →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Find answers to the most common questions about MultiTool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Are all tools completely free to use?</AccordionTrigger>
                <AccordionContent>
                  Yes! All 100+ tools on MultiTool are completely free with no hidden charges, premium tiers, or subscription fees. 
                  You can use any tool as many times as you want without any limitations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Do I need to create an account to use the tools?</AccordionTrigger>
                <AccordionContent>
                  No account required! You can start using any tool immediately without signing up, providing email addresses, 
                  or going through any registration process. Just visit the tool and start working.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Are my files stored on your servers?</AccordionTrigger>
                <AccordionContent>
                  No, we don't store any of your files. All processing happens directly in your browser using client-side JavaScript. 
                  Your files never leave your device, ensuring complete privacy and security.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What file formats are supported?</AccordionTrigger>
                <AccordionContent>
                  We support a wide range of formats including PDF, JPG, PNG, WebP, GIF, DOCX, TXT, CSV, JSON, and many more. 
                  Each tool page lists the specific formats it supports. If you need support for a new format, let us know!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Is there a file size limit?</AccordionTrigger>
                <AccordionContent>
                  File size limits vary by tool and are primarily determined by your browser's capabilities and available memory. 
                  Most tools can handle files up to 100MB, with some supporting larger files. The tool will notify you if a file is too large.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I use these tools on mobile devices?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! All our tools are designed to work seamlessly on mobile phones, tablets, and desktop computers. 
                  The interface automatically adapts to your screen size for the best user experience.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>How can I report bugs or request new features?</AccordionTrigger>
                <AccordionContent>
                  We love hearing from our users! You can report bugs or request new features by visiting our contact page or 
                  emailing us directly at support@dhanbyte.me. We regularly add new tools based on user feedback.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Why are some tools not working in my browser?</AccordionTrigger>
                <AccordionContent>
                  Our tools require modern browser features. Please ensure you're using an updated version of Chrome, Firefox, Safari, 
                  or Edge. If you're still having issues, try clearing your browser cache or disabling ad blockers temporarily.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Tool Categories Help */}
        <Card>
          <CardHeader>
            <CardTitle>Tool Categories Guide</CardTitle>
            <CardDescription>Learn about our different tool categories and their uses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    📄 PDF Tools
                    <Badge variant="secondary">12+ Tools</Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Convert, merge, split, compress, and edit PDF files. Perfect for document management and sharing.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    🖼️ Image Tools
                    <Badge variant="secondary">15+ Tools</Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Compress, resize, crop, convert, and edit images. Optimize photos for web or print use.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    📝 Text Tools
                    <Badge variant="secondary">20+ Tools</Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Count words, translate languages, format text, and analyze content. Essential for writers and editors.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    🔒 Security Tools
                    <Badge variant="secondary">10+ Tools</Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Generate passwords, encrypt data, check security, and protect your digital privacy.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    💻 Developer Tools
                    <Badge variant="secondary">15+ Tools</Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Format code, validate HTML, generate APIs, and streamline your development workflow.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    🎨 Design Tools
                    <Badge variant="secondary">12+ Tools</Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Create colors, gradients, logos, and design elements. Perfect for designers and creatives.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Our support team is here to help you get the most out of MultiTool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Browse Tools
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}