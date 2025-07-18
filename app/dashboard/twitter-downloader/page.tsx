// app/twitter-downloader/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Twitter,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Clock,
  User,
  Heart,
  MessageCircle,
  Repeat,
  Share,
  Info,
  Video,
  ImageIcon,
} from "lucide-react";

// Result Data Interface (यह सुनिश्चित करता है कि डेटा का प्रकार सही है)
interface TwitterResult {
  title: string;
  author: string;
  username: string;
  downloadUrl: string;
  thumbnail: string;
  type: "video" | "photo" | "animated_gif" | "unknown"; // RapidAPI से मिलने वाले प्रकार
  duration?: string | null; // वीडियो/GIF के लिए
  likes: string;
  retweets: string;
  comments: string;
  createdAt: string;
  verified: boolean;
}

export default function TwitterDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TwitterResult | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!url) {
      setError("Please enter a Twitter/X URL");
      toast({ title: "Error", description: "Please enter a Twitter/X URL", variant: "destructive" });
      return;
    }

    if (!url.includes("twitter.com") && !url.includes("x.com")) {
      setError("Please enter a valid Twitter/X URL");
      toast({ title: "Error", description: "Please enter a valid Twitter/X URL", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 12;
      });
    }, 250);

    try {
      const response = await fetch("/api/twitter-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to download Twitter content");
      }

      setProgress(100);
      setResult(data.data);
      toast({
        title: "Success!",
        description: "Twitter content processed successfully",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
    }
  };

  const handleDemo = () => {
    setLoading(true);
    setError("");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 300);

    setTimeout(() => {
      setResult({
        title: "Amazing tech announcement! 🚀 The future is here with our new AI-powered platform...",
        author: "TechInnovator",
        username: "@techinnovator",
        downloadUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4", // एक वास्तविक MP4 डेमो URL
        thumbnail: "https://placehold.co/600x400/png?text=Demo+Video",
        type: "video",
        duration: "0:45",
        likes: "2.4K",
        retweets: "856",
        comments: "342",
        createdAt: "2024-01-15T10:30:00Z",
        verified: true,
      });
      setLoading(false);
      toast({
        title: "Demo Complete!",
        description: "This is a demo result. Use real Twitter/X URLs for actual downloads.",
      });
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/20">
          <Twitter className="h-6 w-6 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Twitter Downloader</h1>
          <p className="text-muted-foreground">Download Twitter/X videos, GIFs, and images easily</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Tool */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Download Twitter/X Content
              </CardTitle>
              <CardDescription>Paste the Twitter/X post URL to download videos, GIFs, or images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="https://twitter.com/username/status/... or https://x.com/username/status/..."
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
                      Download
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
                Try Demo
              </Button>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing Twitter content...</span>
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
                <Card className="border-sky-200 bg-sky-50 dark:bg-sky-950/20">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Tweet Header */}
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-sky-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-sm">{result.author}</h3>
                            {result.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                            <span className="text-sm text-muted-foreground">{result.username}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{formatDate(result.createdAt)}</span>
                          </div>
                          <p className="text-sm mt-1 line-clamp-3">{result.title}</p>
                        </div>
                      </div>

                      {/* Media Preview */}
                      <div className="relative">
                        {result.type === "video" || result.type === "animated_gif" ? (
                          <video
                            src={result.downloadUrl}
                            poster={result.thumbnail || ""}
                            controls
                            className="w-full h-auto max-h-96 object-contain rounded-lg bg-black"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : result.type === "photo" ? (
                          <img
                            src={result.downloadUrl} // इमेज के लिए downloadUrl का उपयोग करें
                            alt="Twitter media"
                            className="w-full h-auto max-h-96 object-contain rounded-lg"
                          />
                        ) : (
                          <img
                            src={result.thumbnail || "/placeholder.svg"}
                            alt="Twitter media"
                            className="w-full h-auto max-h-96 object-contain rounded-lg"
                          />
                        )}

                        <div className="absolute top-2 left-2 flex space-x-1">
                          <Badge variant="secondary" className="text-xs">
                            {result.type === "video" || result.type === "animated_gif" ? (
                              <>
                                <Video className="mr-1 h-3 w-3" />
                                Video/GIF
                              </>
                            ) : result.type === "photo" ? (
                              <>
                                <ImageIcon className="mr-1 h-3 w-3" />
                                Image
                              </>
                            ) : (
                              <>
                                <Info className="mr-1 h-3 w-3" />
                                Media
                              </>
                            )}
                          </Badge>
                          {result.duration && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {result.duration}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-red-500">
                            <Heart className="mr-1 h-4 w-4" />
                            {result.likes}
                          </div>
                          <div className="flex items-center text-green-500">
                            <Repeat className="mr-1 h-4 w-4" />
                            {result.retweets}
                          </div>
                          <div className="flex items-center text-blue-500">
                            <MessageCircle className="mr-1 h-4 w-4" />
                            {result.comments}
                          </div>
                        </div>
                      </div>

                      {/* Download Button */}
                      <a href={result.downloadUrl} download target="_blank" rel="noopener noreferrer">
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download {result.type === "photo" ? "Image" : "Video"}
                        </Button>
                      </a>
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
                    title: "Find Twitter/X Post",
                    description: "Go to Twitter/X and find the post with video, GIF, or image you want to download",
                  },
                  {
                    step: "2",
                    title: "Copy URL",
                    description: "Click the share button on the tweet and copy the link to the post",
                  },
                  {
                    step: "3",
                    title: "Paste and Download",
                    description: "Paste the URL in the input field above and click the download button",
                  },
                  {
                    step: "4",
                    title: "Save Media",
                    description: "Wait for processing to complete, then save the media file to your device",
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
          {/* Supported Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-sky-600" />
                  <span className="text-sm">Videos (MP4)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-sky-600" />
                  <span className="text-sm">Images (JPG, PNG)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-sky-600" />
                  <span className="text-sm">GIFs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Share className="h-4 w-4 text-sky-600" />
                  <span className="text-sm">Multiple media posts</span>
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
                  "High quality downloads",
                  "Original resolution",
                  "Fast processing",
                  "No watermarks",
                  "Supports both Twitter & X",
                  "Multiple media formats",
                  "No registration required",
                  "Mobile friendly",
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
                <p>• Works with both twitter.com and x.com URLs</p>
                <p>• Supports tweets with multiple images</p>
                <p>• Downloads preserve original quality</p>
                <p>• Private accounts require public access</p>
                <p>• Works with quoted tweets and replies</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Downloads Today</span>
                  <Badge variant="secondary">1,847</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <Badge variant="default">98.7%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg. Processing</span>
                  <Badge variant="outline">1.8s</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}