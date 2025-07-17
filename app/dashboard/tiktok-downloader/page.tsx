"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Video,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Clock,
  User,
  Heart,
  MessageCircle,
  Share,
  Info,
} from "lucide-react";

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0); // Progress for the API call
  const { toast } = useToast();

  const handleFetchAndDownload = async () => {
    if (!url) {
      setError("Please enter a TikTok video URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null); // Clear previous results
    setProgress(0); // Reset progress

    try {
      // Step 1: Call your Next.js API route to get video information
      const apiResponse = await fetch("/api/tiktok-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "Failed to fetch video details from API.");
      }

      const apiResult = await apiResponse.json();

      if (!apiResult.success || !apiResult.data?.downloadUrl) {
        throw new Error("Could not retrieve download URL from TikTok.");
      }

      setResult(apiResult.data);
      setProgress(50); // Simulate progress after fetching info

      // Step 2: Download the video using the downloadUrl from the API response
      const videoDownloadResponse = await fetch(apiResult.data.downloadUrl);

      if (!videoDownloadResponse.ok) {
        throw new Error("Failed to download the video file.");
      }

      const blob = await videoDownloadResponse.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${apiResult.data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`; // Sanitize title for filename
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(objectUrl);
      setProgress(100); // Simulate completion
      toast({
        title: "Download Complete!",
        description: "Your TikTok video has been downloaded.",
      });

    } catch (err: any) {
      console.error("Download process failed:", err);
      setError(err.message || "An unexpected error occurred during download.");
      setProgress(0); // Reset progress on error
      toast({
        title: "Download Failed",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setLoading(true);
    setError("");
    setProgress(0);
    setResult(null); // Clear any previous real results

    // Simulate demo download
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
        title: "Amazing Dance Video 🔥",
        author: "dance_queen_2024",
        downloadUrl: "/placeholder.mp4", // A more appropriate placeholder for a video
        thumbnail: "/placeholder.svg?height=400&width=300",
        duration: "00:15",
        likes: "125.4K",
        comments: "8.2K",
        shares: "15.6K",
      });
      setLoading(false);
      toast({
        title: "Demo Complete!",
        description:
          "This is a demo result. Use real TikTok URLs for actual downloads.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-950/20">
          <Video className="h-6 w-6 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">TikTok Video Downloader</h1>
          <p className="text-muted-foreground">
            Download TikTok videos without watermark in HD quality
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Tool */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Download TikTok Video
              </CardTitle>
              <CardDescription>
                Paste the TikTok video URL below to download without watermark
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="https://www.tiktok.com/@username/video/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                {/* Modified button to call handleFetchAndDownload */}
                <Button onClick={handleFetchAndDownload} disabled={loading}>
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

              <Button
                variant="outline"
                onClick={handleDemo}
                disabled={loading}
                className="w-full bg-transparent"
              >
                <Play className="mr-2 h-4 w-4" />
                Try Demo
              </Button>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing video...</span>
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
                        className="h-20 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-sm">
                          {result.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />@{result.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {result.duration}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center text-red-500">
                            <Heart className="mr-1 h-3 w-3" />
                            {result.likes}
                          </div>
                          <div className="flex items-center text-blue-500">
                            <MessageCircle className="mr-1 h-3 w-3" />
                            {result.comments}
                          </div>
                          <div className="flex items-center text-green-500">
                            <Share className="mr-1 h-3 w-3" />
                            {result.shares}
                          </div>
                        </div>
                        {/* This button will trigger the client-side download if `result.downloadUrl` exists */}
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            // This button should directly initiate download if result is already there
                            // For simplicity, we can just use the downloadUrl from 'result'
                            if (result.downloadUrl) {
                              const a = document.createElement("a");
                              a.href = result.downloadUrl;
                              a.download = `${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                            }
                          }}
                        >
                          <Download className="mr-2 h-3 w-3" />
                          Download HD Video
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
                    title: "Copy TikTok URL",
                    description:
                      "Go to TikTok, find the video you want to download, and copy its URL from the share menu",
                  },
                  {
                    step: "2",
                    title: "Paste URL",
                    description:
                      "Paste the copied URL in the input field above and click the download button",
                  },
                  {
                    step: "3",
                    title: "Download Video",
                    description:
                      "Wait for processing to complete, then download your watermark-free video",
                  },
                  {
                    step: "4",
                    title: "Enjoy",
                    description:
                      "Your video is ready! Share it or save it to your device without any watermarks",
                  },
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Badge
                      variant="outline"
                      className="mt-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                    >
                      {instruction.step}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-sm">
                        {instruction.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {instruction.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "No watermark removal",
                  "HD quality downloads",
                  "Fast processing",
                  "No registration required",
                  "Mobile & desktop support",
                  "Unlimited downloads",
                  "Safe & secure",
                  "Free forever",
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
                <p>• Works with all TikTok video URLs</p>
                <p>• Supports both mobile and desktop TikTok links</p>
                <p>• Downloads preserve original video quality</p>
                <p>• No software installation required</p>
                <p>• Works on all devices and browsers</p>
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
                  <Badge variant="secondary">2,847</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <Badge variant="default">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg. Processing</span>
                  <Badge variant="outline">2.3s</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}