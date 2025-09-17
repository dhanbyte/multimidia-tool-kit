import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Download, 
  ArrowRight, 
  HelpCircle,
  Search,
  Shield,
  Zap,
  FileText,
  Image,
  QrCode,
  Keyboard
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "Help Center - MediaTools Pro | FAQ & Support",
  description: "Get help with MediaTools Pro. Find answers to common questions, tutorials, and support for all our free online tools.",
}

const faqs = [
  {
    question: "Are all tools completely free to use?",
    answer: "Yes! All our tools are 100% free with no hidden charges, subscriptions, or premium features. We believe powerful tools should be accessible to everyone."
  },
  {
    question: "Do I need to create an account to use the tools?",
    answer: "No account required! You can use all our tools instantly without registration, sign-up, or providing any personal information."
  },
  {
    question: "Is my data safe and secure?",
    answer: "Absolutely. All files are processed securely with encryption, and we automatically delete them from our servers after processing. We never store or access your personal data."
  },
  {
    question: "What file formats are supported?",
    answer: "We support all major file formats including PDF, JPG, PNG, WebP, MP3, MP4, DOC, TXT, and many more. Each tool specifies its supported formats."
  },
  {
    question: "Is there a file size limit?",
    answer: "Most tools support files up to 100MB. For larger files, the tool will display a warning. We're constantly working to increase these limits."
  },
  {
    question: "Can I use these tools on mobile devices?",
    answer: "Yes! All our tools are fully responsive and work perfectly on smartphones, tablets, and desktop computers."
  },
  {
    question: "How fast are the tools?",
    answer: "Our tools are optimized for speed. Most operations complete in seconds thanks to our advanced algorithms and fast servers."
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes! You can contact us through our contact page or email support@dhanbyte.me. We typically respond within 24 hours."
  }
]

const toolGuides = [
  {
    icon: QrCode,
    title: "QR Code Generator",
    description: "Create QR codes for text, URLs, WiFi, and more",
    steps: ["Enter your text or URL", "Customize size and style", "Download your QR code"]
  },
  {
    icon: Image,
    title: "Image Compressor",
    description: "Reduce image file sizes without quality loss",
    steps: ["Upload your images", "Choose compression level", "Download compressed files"]
  },
  {
    icon: FileText,
    title: "PDF Tools",
    description: "Compress, convert, and edit PDF files",
    steps: ["Select your PDF file", "Choose the operation", "Process and download"]
  },
  {
    icon: Keyboard,
    title: "Typing Master",
    description: "Improve your typing speed and accuracy",
    steps: ["Select difficulty level", "Start typing the text", "View your results and progress"]
  }
]

export default function HelpPage() {
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
            <Link href="/help" className="text-sm font-medium text-primary">
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
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              How can we{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                help you?
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Find answers to common questions, learn how to use our tools, and get the support you need.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Tool Guides */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Popular Tool Guides</h2>
          <p className="text-lg text-muted-foreground">
            Quick guides for our most popular tools
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {toolGuides.map((guide, index) => (
            <Card key={index} className="border-2 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <guide.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">{guide.description}</p>
                <div className="space-y-2">
                  {guide.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-2 text-sm">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                        {stepIndex + 1}
                      </div>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Find answers to the most common questions about our tools
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-background">
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Choose Our Tools?</h2>
          <p className="text-lg text-muted-foreground">
            Built with your needs in mind
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Card className="text-center border-2 shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Process files in seconds with our optimized algorithms</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>100% Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your files are encrypted and automatically deleted after use</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Simple interface that works on all devices</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Still Need Help?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is here to help
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-4 rounded-xl">
                <HelpCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl">
                Try Our Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}