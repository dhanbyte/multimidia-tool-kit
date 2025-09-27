import { Metadata } from "next"
import { SiteHeader } from "@/components/main-nav"

export const metadata: Metadata = {
  title: "MultiTool Blog - Tips, Tutorials & Tool Guides by Dhanbyte",
  description: "Discover expert tips, tutorials, and comprehensive guides for all online tools. Learn how to use PDF converters, image compressors, text tools, security tools, and more.",
  keywords: "multitool blog, online tools tutorials, pdf converter guide, image compressor tips, password generator, qr code generator, text tools, developer tools, dhanbyte blog",
  authors: [{ name: "Dhananjay (Dhanbyte)", url: "https://dhanbyte.me" }],
  creator: "Dhananjay - Full Stack Developer",
  publisher: "MultiTool by Dhanbyte",
  openGraph: {
    title: "MultiTool Blog - Expert Tool Guides & Tutorials",
    description: "Master online tools with our comprehensive guides. PDF conversion, image optimization, text processing, security tools, and more.",
    url: "https://dhanbyte.me/blog",
    siteName: "MultiTool by Dhanbyte",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiTool Blog - Tool Guides & Tutorials",
    description: "Expert guides for PDF tools, image tools, text utilities, security tools, and more. Learn from Dhanbyte's experience.",
  },
  alternates: {
    canonical: "https://dhanbyte.me/blog",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>{children}</main>
      
      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "MultiTool Blog by Dhanbyte",
            "description": "Expert guides and tutorials for online tools including PDF converters, image compressors, text tools, security tools, and more.",
            "url": "https://dhanbyte.me/blog",
            "author": {
              "@type": "Person",
              "name": "Dhananjay (Dhanbyte)",
              "url": "https://dhanbyte.me",
              "sameAs": [
                "https://github.com/dhanbyte",
                "https://linkedin.com/in/dhanbyte"
              ]
            },
            "publisher": {
              "@type": "Organization",
              "name": "MultiTool by Dhanbyte",
              "url": "https://dhanbyte.me",
              "logo": {
                "@type": "ImageObject",
                "url": "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://dhanbyte.me/blog"
            }
          })
        }}
      />
    </div>
  )
}