import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, User, ArrowRight, TrendingUp, ExternalLink } from "lucide-react"
import { blogPosts, getAllCategories } from "./posts/blog-data"
import { BannerAd, SquareAd } from "@/components/GoogleAds"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              MultiTool Blog
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Tips, tutorials, and insights about online tools, productivity, and digital workflows
            </p>
          </div>
        </div>
      </section>

      {/* Top Banner Ad */}
      <section className="py-4 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <BannerAd />
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <div key={post.id}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                      <div className="aspect-video rounded-t-lg overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${post.category === 'PDF Tools' ? '1586953208448-b95a79798f07' : post.category === 'Image Tools' ? '1611224923853-80b023f02d71' : post.category === 'Text Tools' ? '1486312338219-ce68d2c6f44d' : post.category === 'Security Tools' ? '1563013544-824ae1b704d3' : post.category === 'Developer Tools' ? '1461749280684-dccba630e2f6' : post.category === 'AI Tools' ? '1677442136019-21780ecad995' : '1581291518857-4e27b48ff24e'}?w=400&h=225&fit=crop&auto=format`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.trending && (
                            <Badge variant="default" className="bg-orange-500">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </div>
                        </div>
                        {post.toolUrl && (
                          <Link href={post.toolUrl}>
                            <Button variant="outline" size="sm" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Try This Tool
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                  
                  {/* Square Ad after every 2nd post */}
                  {(index + 1) % 2 === 0 && (
                    <div className="mt-6 flex justify-center">
                      <SquareAd />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Sidebar Ad */}
              <SquareAd />

              {/* Popular Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blogPosts.filter(post => post.trending).slice(0, 3).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <div className="group cursor-pointer">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{post.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}