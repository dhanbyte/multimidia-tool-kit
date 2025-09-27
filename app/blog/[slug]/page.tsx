import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, User, ArrowLeft, ExternalLink, Share2 } from "lucide-react"
import { getBlogPostBySlug, blogPosts, getTrendingPosts } from "../posts/blog-data"
import { BannerAd, SquareAd } from "@/components/GoogleAds"

function getUnsplashImage(category: string) {
  const images = {
    'PDF Tools': '1586953208448-b95a79798f07',
    'Image Tools': '1611224923853-80b023f02d71', 
    'Text Tools': '1486312338219-ce68d2c6f44d',
    'Security Tools': '1563013544824ae1b704d3',
    'Developer Tools': '1461749280684-dccba630e2f6',
    'AI Tools': '1677442136019-21780ecad995',
    'Design Tools': '1581291518857-4e27b48ff24e',
    'Utility Tools': '1518709268805-4e9042af9f23'
  }
  return images[category as keyof typeof images] || '1581291518857-4e27b48ff24e'
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found."
    }
  }

  return {
    title: `${post.title} | MultiTool Blog by Dhanbyte`,
    description: post.excerpt,
    keywords: post.keywords.join(", "),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getTrendingPosts().filter(p => p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            {post.toolUrl && (
              <Link href={post.toolUrl}>
                <Button size="lg" className="mb-6">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Try This Tool Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Top Banner Ad */}
      <section className="py-4 bg-muted/10">
        <div className="container mx-auto px-4">
          <BannerAd />
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-lg max-w-none">
              <div 
                className="content"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
              />
            </article>

            {/* Middle Ad */}
            <div className="my-8 flex justify-center">
              <SquareAd />
            </div>

            {/* Share Section */}
            <div className="mt-12 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share this article
              </h3>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  Copy Link
                </Button>
              </div>
            </div>

            {/* Tool CTA */}
            {post.toolUrl && (
              <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
                <p className="text-muted-foreground mb-4">
                  Try our {post.category.toLowerCase()} tool and experience the benefits mentioned in this article.
                </p>
                <Link href={post.toolUrl}>
                  <Button size="lg">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Use {post.category} Tool
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Sidebar Ad */}
              <div className="flex justify-center">
                <SquareAd />
              </div>

              {/* Related Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <div className="group cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {relatedPost.category}
                          </Badge>
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                  <CardDescription>
                    Get the latest tips and tutorials delivered to your inbox.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <Button size="sm" className="w-full">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <section className="py-4 bg-muted/10">
        <div className="container mx-auto px-4">
          <BannerAd />
        </div>
      </section>

      {/* Structured Data for Blog Post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
            "author": {
              "@type": "Person",
              "name": post.author,
              "url": "https://dhanbyte.me"
            },
            "publisher": {
              "@type": "Organization",
              "name": "MultiTool by Dhanbyte",
              "logo": {
                "@type": "ImageObject",
                "url": "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"
              }
            },
            "datePublished": post.date,
            "dateModified": post.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://dhanbyte.me/blog/${post.slug}`
            },
            "keywords": post.keywords.join(", "),
            "articleSection": post.category,
            "wordCount": post.content.split(' ').length,
            "timeRequired": post.readTime,
            "url": `https://dhanbyte.me/blog/${post.slug}`
          })
        }}
      />
    </div>
  )
}