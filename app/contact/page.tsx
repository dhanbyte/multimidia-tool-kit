import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Clock, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact MultiTool by Dhanbyte - Get Support & Share Feedback",
  description: "Contact Dhananjay (Dhanbyte) for support, feature requests, or feedback about MultiTool. Get help with our 100+ free online tools or suggest new features.",
  keywords: "contact dhanbyte, multitool support, feature request, feedback, help, customer support, dhananjay contact",
  openGraph: {
    title: "Contact MultiTool by Dhanbyte - Get Support & Share Feedback",
    description: "Get in touch with the creator of MultiTool for support, suggestions, or just to say hello!",
    url: "https://dhanbyte.me/contact",
    siteName: "MultiTool by Dhanbyte",
    type: "website",
  },
  alternates: {
    canonical: "https://dhanbyte.me/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions, suggestions, or feedback? I'd love to hear from you! Let's make MultiTool even better together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and I'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Name *
                    </label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email *
                    </label>
                    <Input id="email" type="email" placeholder="your@email.com" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                    Subject *
                  </label>
                  <Input id="subject" placeholder="What's this about?" required />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-2 block">
                    Message *
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell me more about your question, suggestion, or feedback..."
                    rows={6}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">support@dhanbyte.me</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      For general inquiries, support, and feedback
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Response Time</h3>
                    <p className="text-sm text-muted-foreground">Usually within 24-48 hours</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      I personally read and respond to every message
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">India</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Serving users worldwide 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Are the tools really free?</h3>
                  <p className="text-xs text-muted-foreground">
                    Yes! All tools are completely free with no hidden charges or premium tiers.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Do you store my files?</h3>
                  <p className="text-xs text-muted-foreground">
                    No, all processing happens in your browser. Files are never uploaded to our servers.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Can I suggest new tools?</h3>
                  <p className="text-xs text-muted-foreground">
                    Absolutely! I love hearing feature requests and regularly add new tools based on user feedback.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">How can I report a bug?</h3>
                  <p className="text-xs text-muted-foreground">
                    Use the contact form above or email me directly. Please include details about the issue.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-6">
                <h3 className="font-semibold mb-2">Love MultiTool?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help others discover our free tools by sharing with friends and colleagues!
                </p>
                <Button variant="outline" asChild>
                  <a href="/">Share MultiTool</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}