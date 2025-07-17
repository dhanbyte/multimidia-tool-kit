"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Music,
  Video,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Clock,
  Eye,
  ThumbsUp,
  User,
  Info,
} from "lucide-react"

export default function YouTubeDownloaderPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [downloadType, setDownloadType] = useState("video")
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!url) {
      setError("Please enter a YouTube URL")
      return
    }

    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      setError("Please enter a valid YouTube URL")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 15
      })
    }, 300)

    try {
      const response = await fetch("/api/youtube-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, type: downloadType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to download")
      }

      setProgress(100)
      setResult(data.data)
      toast({
        title: "Success!",
        description: `YouTube ${downloadType} processed successfully`,
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
        return prev + 25
      })
    }, 400)

    setTimeout(() => {
      setResult({
        title: downloadType === "video" ? "Amazing Tutorial - Learn Web Development" : "Relaxing Music for Coding",
        downloadUrl: "/placeholder.svg?height=200&width=300",
        thumbnail: "/placeholder.svg?height=200&width=300",
        duration: downloadType === "video" ? "15:42" : "3:28",
        views: "1.2M",
        likes: "45K",
        channel: downloadType === "video" ? "CodeMaster" : "ChillBeats",
        type: downloadType,
        quality: downloadType === "video" ? "1080p" : "320kbps",
      })
      setLoading(false)
      toast({
        title: "Demo Complete!",
        description: "This is a demo result. Use real YouTube URLs for actual downloads.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20">
          <Music className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">YouTube Downloader</h1>
          <p className="text-muted-foreground">Download YouTube videos and audio in multiple formats</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Tool */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Download YouTube Content
              </CardTitle>
              <CardDescription>Choose between video or audio download and paste your YouTube URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={downloadType} onValueChange={setDownloadType}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="video" className="flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center">
                    <Music className="mr-2 h-4 w-4" />
                    Audio Only
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleDownload} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download {downloadType === "video" ? "Video" : "Audio"}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                  </div>

                  <Button variant="outline" onClick={handleDemo} disabled={loading} className="w-full bg-transparent">
                    <Play className="mr-2 h-4 w-4" />
                    Try Demo ({downloadType === "video" ? "Video" : "Audio"})
                  </Button>
                </div>
              </Tabs>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing {downloadType}...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={result.thumbnail || "/placeholder.svg"}
                        alt="Video thumbnail"
                        className="h-20 w-28 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{result.title}</h3>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {result.channel}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {result.duration}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {result.quality}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center text-blue-500">
                            <Eye className="mr-1 h-3 w-3" />
                            {result.views}
                          </div>
                          <div className="flex items-center text-green-500">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            {result.likes}
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          <Download className="mr-2 h-3 w-3" />
                          Download {result.type === "video" ? "Video" : "Audio"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Choose Format",
                    description: "Select whether you want to download video or audio only from the tabs above",
                  },
                  {
                    step: "2",
                    title: "Copy YouTube URL",
                    description: "Go to YouTube and copy the video URL you want to download",
                  },
                  {
                    step: "3",
                    title: "Paste and Download",
                    description: "Paste the URL in the input field and click the download button",
                  },
                  {
                    step: "4",
                    title: "Save File",
                    description: "Wait for processing to complete, then save your file to your device",
                  },
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      {instruction.step}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-sm">{instruction.title}</h4>
                      <p className="text-sm text-muted-foreground">{instruction.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supported Formats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 flex items-center text-sm">
                    <Video className="mr-2 h-4 w-4" />
                    Video Formats
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">MP4 (1080p)</Badge>
                    <Badge variant="secondary">MP4 (720p)</Badge>
                    <Badge variant="secondary">MP4 (480p)</Badge>
                    <Badge variant="secondary">WEBM</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center text-sm">
                    <Music className="mr-2 h-4 w-4" />
                    Audio Formats
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">MP3 (320kbps)</Badge>
                    <Badge variant="secondary">MP3 (128kbps)</Badge>
                    <Badge variant="secondary">M4A</Badge>
                    <Badge variant="secondary">WEBM Audio</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Multiple quality options",
                  "Video and audio downloads",
                  "Fast processing speed",
                  "No registration required",
                  "Supports all YouTube URLs",
                  "High-quality output",
                  "Mobile friendly",
                  "Completely free",
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
                <p>• Works with both youtube.com and youtu.be links</p>
                <p>• Higher quality videos take longer to process</p>
                <p>• Audio downloads are faster than video</p>
                <p>• Supports playlists and live streams</p>
                <p>• No length restrictions on videos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
