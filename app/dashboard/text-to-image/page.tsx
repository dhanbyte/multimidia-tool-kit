"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  ImageIcon,
  Wand2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Sparkles,
  Palette,
  Settings,
  Info,
  Zap,
  Eye,
} from "lucide-react"

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [size, setSize] = useState("512x512")
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<any>(null)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const styles = [
    { value: "realistic", label: "Realistic", description: "Photorealistic images" },
    { value: "artistic", label: "Artistic", description: "Artistic and creative style" },
    { value: "anime", label: "Anime", description: "Japanese anime style" },
    { value: "cartoon", label: "Cartoon", description: "Cartoon and illustration style" },
    { value: "abstract", label: "Abstract", description: "Abstract and surreal art" },
    { value: "vintage", label: "Vintage", description: "Retro and vintage style" },
  ]

  const sizes = [
    { value: "256x256", label: "256×256 (Small)" },
    { value: "512x512", label: "512×512 (Medium)" },
    { value: "768x768", label: "768×768 (Large)" },
    { value: "1024x1024", label: "1024×1024 (HD)" },
  ]

  const examplePrompts = [
    "A majestic mountain landscape at sunset with golden clouds",
    "A futuristic city with flying cars and neon lights",
    "A cute robot playing with a kitten in a garden",
    "An underwater palace with colorful coral and fish",
    "A magical forest with glowing mushrooms and fireflies",
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your image")
      return
    }

    if (prompt.length < 10) {
      setError("Please provide a more detailed description (at least 10 characters)")
      return
    }

    setLoading(true)
    setError("")
    setGeneratedImage(null)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 400)

    try {
      const response = await fetch("/api/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, size }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      setProgress(100)
      setGeneratedImage(data.data)
      toast({
        title: "Success!",
        description: "Image generated successfully",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      clearInterval(progressInterval)
    }
  }

  const handleDemo = () => {
    setLoading(true)
    setError("")
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    setTimeout(() => {
      setGeneratedImage({
        imageUrl: "/placeholder.svg?height=512&width=512",
        prompt: "A beautiful sunset over a calm lake with mountains in the background",
        style: style,
        size: size,
        generatedAt: new Date().toISOString(),
      })
      setLoading(false)
      toast({
        title: "Demo Complete!",
        description: "This is a demo result. Use real prompts for actual AI generation.",
      })
    }, 3000)
  }

  const downloadImage = () => {
    if (generatedImage?.imageUrl) {
      const link = document.createElement("a")
      link.href = generatedImage.imageUrl
      link.download = `ai-generated-${Date.now()}.png`
      link.click()
      toast({
        title: "Downloaded!",
        description: "Image saved to your device",
      })
    }
  }

  const useExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20">
          <Wand2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Text to Image</h1>
          <p className="text-muted-foreground">Generate stunning images from text descriptions using AI</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Generator */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Image
              </CardTitle>
              <CardDescription>Describe what you want to see and let AI create it for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Image Description</label>
                <Textarea
                  placeholder="Describe the image you want to generate... Be creative and detailed!"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{prompt.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Art Style</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((styleOption) => (
                        <SelectItem key={styleOption.value} value={styleOption.value}>
                          <div>
                            <div className="font-medium">{styleOption.label}</div>
                            <div className="text-xs text-muted-foreground">{styleOption.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Image Size</label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((sizeOption) => (
                        <SelectItem key={sizeOption.value} value={sizeOption.value}>
                          {sizeOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>

              <Button variant="outline" onClick={handleDemo} disabled={loading} className="w-full bg-transparent">
                <Zap className="mr-2 h-4 w-4" />
                Try Demo
              </Button>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating your image...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground text-center">
                    This may take 30-60 seconds depending on complexity
                  </p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Example Prompts</CardTitle>
              <CardDescription>Click on any example to use it as your prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 bg-transparent"
                    onClick={() => setPrompt(example)}
                  >
                    <div className="text-sm">{example}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Sidebar */}
        <div className="space-y-6">
          {/* Generated Image */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              <CardDescription>Your AI-generated artwork will appear here</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {generatedImage ? (
                <>
                  <div className="w-full aspect-square border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={generatedImage.imageUrl || "/placeholder.svg"}
                      alt="Generated image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <div className="text-sm">
                      <strong>Prompt:</strong> {generatedImage.prompt}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Style: {generatedImage.style}</span>
                      <span>Size: {generatedImage.size}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full">
                    <Button onClick={downloadImage} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(generatedImage.imageUrl, "_blank")}
                      className="bg-transparent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Image generated successfully!</AlertDescription>
                  </Alert>
                </>
              ) : (
                <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-8">
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">Generated image will appear here</p>
                  <p className="text-sm text-gray-400">Enter a prompt and click generate</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "AI-powered generation",
                  "Multiple art styles",
                  "High-resolution output",
                  "Fast processing",
                  "Commercial use allowed",
                  "No watermarks",
                  "Unlimited generations",
                  "Download in PNG format",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Be specific and detailed in your descriptions</p>
                <p>• Include lighting, colors, and mood</p>
                <p>• Mention camera angles or perspectives</p>
                <p>• Use artistic terms like "oil painting" or "digital art"</p>
                <p>• Experiment with different styles for variety</p>
              </div>
            </CardContent>
          </Card>

          {/* Popular Styles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                Popular Styles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {styles.map((styleOption) => (
                  <Badge
                    key={styleOption.value}
                    variant={style === styleOption.value ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setStyle(styleOption.value)}
                  >
                    {styleOption.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
