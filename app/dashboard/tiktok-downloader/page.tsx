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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Updated Result Data Interface to match RapidAPI's response structure
interface RapidApiVideoFormat {
  type: "video" | "audio"; // e.g., "video", "audio"
  quality: string; // e.g., "1080p", "320kbps"
  format: string; // e.g., "MP4", "MP3"
  size: string; // e.g., "45.2 MB"
  downloadUrl?: string; // The URL to directly download from RapidAPI if provided
  // RapidAPI might provide a format_id or similar, but we'll use a combination of quality+format for selection
}

interface TikTokInfo {
  shares: any;
  comments: any;
  title: string;
  platform: string;
  author: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadDate: string;
  formats: RapidApiVideoFormat[]; // Use the updated format interface
}

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<TikTokInfo | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  // selectedFormatKey will be a string like "1080p_MP4" to uniquely identify a format
  const [selectedFormatKey, setSelectedFormatKey] = useState<string>("");
  const { toast } = useToast();

  const handleGetInfo = async () => {
    if (!url) {
      setError("Please enter a TikTok video URL.");
      toast({ title: "Error", description: "Please enter a TikTok video URL.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError("");
    setInfo(null);
    setProgress(0);
    setSelectedFormatKey("");

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const apiResponse = await fetch("/api/tiktok-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }), // No formatId sent for info
      });

      const apiResult = await apiResponse.json();
      clearInterval(progressInterval);

      if (!apiResponse.ok || !apiResult.success) {
        throw new Error(apiResult.error || "Failed to fetch video details.");
      }

      setInfo(apiResult.data); // RapidAPI response uses 'data' key
      setProgress(100);
      toast({
        title: "Video Info Loaded!",
        description: "Select a format and download your TikTok video.",
      });

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error("Info fetching failed:", err);
      setError(err.message || "An unexpected error occurred while fetching info.");
      setProgress(0);
      toast({
        title: "Error",
        description: err.message || "Failed to get video info. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!info || !selectedFormatKey) {
      setError("Please get video info and select a format first.");
      toast({ title: "Error", description: "Please select a format to download.", variant: "destructive" });
      return;
    }

    const [quality, format] = selectedFormatKey.split("_");
    const selectedFormat = info.formats.find(
      (f) => f.quality === quality && f.format === format
    );

    if (!selectedFormat) {
      setError("Selected format not found.");
      toast({ title: "Error", description: "Selected format not found.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);

    const downloadProgressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 5 : prev)); // Simulate download progress
    }, 500);

    try {
      // If RapidAPI provides a direct download URL, use it
      if (selectedFormat.downloadUrl) {
        window.open(selectedFormat.downloadUrl, '_blank');
        toast({
          title: "Download Started!",
          description: "Your TikTok video is downloading...",
        });
      } else {
        // Otherwise, make another API call to your backend to trigger the download stream
        // Here, we're assuming the backend will use the 'formatId' to fetch the actual download
        // In your rapidapi backend, you might need a common 'formatId' or pass quality/format
        // For simplicity, let's pass a combined formatId like "QUALITY_FORMAT"
        const downloadResponse = await fetch("/api/tiktok-download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, formatId: selectedFormatKey }), // Pass selectedFormatKey as formatId
        });

        if (!downloadResponse.ok) {
          const errorText = await downloadResponse.text();
          throw new Error(`Failed to download video: ${errorText}`);
        }

        const blob = await downloadResponse.blob();
        const filename = `${info.title.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase()}_${selectedFormat.quality}.${selectedFormat.format.toLowerCase()}`;
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        toast({
          title: "Download Started!",
          description: "Your TikTok video is downloading...",
        });
      }

      clearInterval(downloadProgressInterval);
      setProgress(100);

    } catch (err: any) {
      clearInterval(downloadProgressInterval);
      console.error("Download failed:", err);
      setError(err.message || "An unexpected error occurred during download.");
      setProgress(0);
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
    setInfo(null);
    setSelectedFormatKey("");

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    setTimeout(() => {
      clearInterval(progressInterval);
      setInfo({
        title: "Demo TikTok - Awesome Dance Move",
        platform: "TikTok",
        author: "demo_user_123",
        thumbnail: "https://placehold.co/600x400/png?text=TikTok+Demo",
        duration: "0:25",
        views: "1.5M", // Added for demo consistency
        likes: "99.8K",
        comments: "5.1K",
        uploadDate: "2025-07-18", // Added for demo consistency
        shares: "10.3K",
        formats: [
          { type: "video", quality: "1080p", format: "MP4", size: "45.2 MB", downloadUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" },
          { type: "video", quality: "720p", format: "MP4", size: "28.7 MB", downloadUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" },
          { type: "audio", quality: "320kbps", format: "MP3", size: "8.1 MB", downloadUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        ],
      });
      setSelectedFormatKey("1080p_MP4"); // Pre-select a format for demo
      setProgress(100);
      setLoading(false);
      toast({
        title: "Demo Info Loaded!",
        description: "This is a demo result. Paste a real TikTok URL for actual downloads.",
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
            Download TikTok videos without watermark in HD quality using Universal Media Downloader
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
                Paste the TikTok video URL below to get details and download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="https://www.tiktok.com/@username/video/..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                    setInfo(null);
                    setProgress(0);
                    setSelectedFormatKey("");
                  }}
                  className="flex-1"
                />
                <Button onClick={handleGetInfo} disabled={loading}>
                  {loading && progress < 100 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Info
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Get Video Info
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
                    <span>{progress < 100 ? "Processing video info..." : "Info ready!"}</span>
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

              {info && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                      {info.thumbnail && (
                        <img
                          src={info.thumbnail}
                          alt="Video thumbnail"
                          className="w-full md:w-32 h-auto md:h-24 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {info.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="mr-1 h-4 w-4" />@{info.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {info.duration}
                          </div>
                          {/* Display views/likes/comments/shares if available from API */}
                          {info.likes && (
                            <div className="flex items-center text-red-500">
                              <Heart className="mr-1 h-4 w-4" />
                              {info.likes}
                            </div>
                          )}
                          {info.comments && (
                            <div className="flex items-center text-blue-500">
                              <MessageCircle className="mr-1 h-4 w-4" />
                              {info.comments}
                            </div>
                          )}
                          {info.shares && (
                            <div className="flex items-center text-green-500">
                              <Share className="mr-1 h-4 w-4" />
                              {info.shares}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Select Download Quality:</p>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Select
                          onValueChange={setSelectedFormatKey}
                          value={selectedFormatKey}
                          disabled={loading || info.formats.length === 0}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a quality..." />
                          </SelectTrigger>
                          <SelectContent>
                            {info.formats.length === 0 && (
                              <SelectItem value="no-formats" disabled>
                                No downloadable formats found
                              </SelectItem>
                            )}
                            {info.formats.map((format, index) => (
                              <SelectItem
                                key={`${format.quality}_${format.format}_${index}`} // Use a unique key
                                value={`${format.quality}_${format.format}`} // Value for selection
                              >
                                {format.quality} ({format.format}) {format.size ? ` - ${format.size}` : ''}
                                {format.type === 'audio' ? ' (Audio Only)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button onClick={handleDownloadFile} disabled={loading || !selectedFormatKey}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download Selected
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Preview logic (only if RapidAPI provides direct download URLs for preview) */}
                    {selectedFormatKey && info.formats.find(f => `${f.quality}_${f.format}` === selectedFormatKey)?.downloadUrl && (
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                            {info.formats.find(f => `${f.quality}_${f.format}` === selectedFormatKey)?.type === 'video' ? (
                                <video
                                    src={info.formats.find(f => `${f.quality}_${f.format}` === selectedFormatKey)?.downloadUrl}
                                    poster={info.thumbnail || ""}
                                    controls
                                    className="w-full h-full object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <audio
                                    src={info.formats.find(f => `${f.quality}_${f.format}` === selectedFormatKey)?.downloadUrl}
                                    controls
                                    className="w-full mt-4"
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                            <p className="text-muted-foreground text-xs mt-2 flex items-center justify-center">
                                <Info className="h-3 w-3 mr-1" /> Preview might not show for all formats or due to CORS.
                            </p>
                        </div>
                    )}


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
                    title: "Get Video Info",
                    description:
                      "Paste the copied URL in the input field above and click 'Get Video Info' to see available qualities.",
                  },
                  {
                    step: "3",
                    title: "Select Quality & Download",
                    description:
                      "Choose your desired video or audio quality from the dropdown, then click 'Download Selected'.",
                  },
                  {
                    step: "4",
                    title: "Enjoy",
                    description:
                      "Your video will start downloading shortly. Enjoy your watermark-free content!",
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
                  "No watermark removal (depends on RapidAPI)", // Changed
                  "Multiple quality options (HD, SD, Audio Only)",
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
                <p>• Works with all public TikTok video URLs</p>
                <p>• Supports both mobile and desktop TikTok links</p>
                <p>• Downloads preserve original video quality</p>
                <p>• No software installation required on your device</p>
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