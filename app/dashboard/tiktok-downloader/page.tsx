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
  Video, // TikTok icon के लिए Video आइकन का उपयोग
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
  Eye, // Views के लिए Eye icon
} from "lucide-react";

// Updated Result Data Interface to match yt-dlp's output structure
interface VideoFormat {
  type: "video" | "audio";
  quality: string; // e.g., "1080p", "320kbps", "best"
  format: string; // e.g., "mp4", "webm", "mp3"
  size: string; // e.g., "45.2 MB"
  formatId: string; // yt-dlp का format_id, डाउनलोड के लिए उपयोग किया जाएगा
}

interface TikTokInfo {
  title: string;
  platform: string;
  author: string;
  thumbnail: string;
  duration: string;
  views: string; // yt-dlp से सीधे मिल सकता है
  likes: string; // yt-dlp से सीधे मिल सकता है
  comments?: string; // yt-dlp से हमेशा उपलब्ध नहीं हो सकता
  shares?: string; // yt-dlp से हमेशा उपलब्ध नहीं हो सकता
  uploadDate: string;
  formats: VideoFormat[];
}

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<TikTokInfo | null>(null); // Stores video info and formats
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0); // Progress for the API call
  const [selectedFormatId, setSelectedFormatId] = useState<string>(""); // yt-dlp formatId stored here
  const { toast } = useToast();

  const handleGetInfo = async () => {
    if (!url) {
      setError("Please enter a TikTok video URL.");
      toast({ title: "Error", description: "Please enter a TikTok video URL.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError("");
    setInfo(null); // Clear previous info
    setProgress(0); // Reset progress
    setSelectedFormatId(""); // Reset selected format

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const apiResponse = await fetch("/api/tiktok-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, action: "getInfo" }), // 'action: "getInfo"' भेजें
      });

      const apiResult = await apiResponse.json();
      clearInterval(progressInterval);

      if (!apiResponse.ok || !apiResult.success) {
        throw new Error(apiResult.error || "Failed to fetch video details.");
      }

      setInfo(apiResult.data); // yt-dlp API response 'data' कुंजी के अंदर आती है
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
    if (!info || !selectedFormatId) {
      setError("Please get video info and select a format first.");
      toast({ title: "Error", description: "Please select a format to download.", variant: "destructive" });
      return;
    }

    const selectedFormat = info.formats.find(f => f.formatId === selectedFormatId);

    if (!selectedFormat) {
      setError("Selected format not found.");
      toast({ title: "Error", description: "Selected format not found.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);

    // यह अंतराल अब मुख्य रूप से "डाउनलोड का अनुरोध" चरण को इंगित करता है,
    // क्योंकि वास्तविक फ़ाइल स्ट्रीम सीधे ब्राउज़र द्वारा संभाली जाएगी।
    const downloadProgressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 5 : prev)); // पहल प्रगति का अनुकरण करें
    }, 500);

    try {
      // बैकएंड रूट को ट्रिगर करें जो डाउनलोड को प्रॉक्सी करता है
      const downloadResponse = await fetch("/api/tiktok-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, formatId: selectedFormatId, action: "download" }), // 'action: "download"' भेजें
      });

      clearInterval(downloadProgressInterval); // एक बार प्रतिक्रिया प्राप्त होने पर प्रगति का अनुकरण करना बंद करें

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json(); // त्रुटि बॉडी API से अपेक्षित है
        throw new Error(errorData.error || "Failed to initiate download.");
      }

      // फ़ाइल डाउनलोड को संभालें
      const blob = await downloadResponse.blob();
      const contentDisposition = downloadResponse.headers.get('Content-Disposition');
      let filename = `tiktok_download.${selectedFormat.format}`; // डिफ़ॉल्ट फ़ाइल नाम

      if (contentDisposition) {
        // Content-Disposition हेडर से फ़ाइल नाम पार्स करने का प्रयास करें
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      } else if (info?.title) {
        // यदि Content-Disposition गायब है तो शीर्षक पर वापस जाएं
        filename = `${info.title.replace(/[^a-z0-9_.-]/gi, '_')}.${selectedFormat.format}`; // फ़ाइल नाम के लिए शीर्षक को सैनिटाइज करें
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename; // डाउनलोड के लिए फ़ाइल नाम सेट करें
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setProgress(100);
      toast({
        title: "Download Started!",
        description: "Your TikTok video is downloading...",
      });

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
    setSelectedFormatId("");

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
        duration: "00:25",
        views: "1.5M",
        likes: "99.8K",
        comments: "5.1K",
        shares: "10.3K",
        uploadDate: "2025-07-18",
        formats: [
          { type: "video", quality: "1080p", format: "mp4", size: "45.2 MB", formatId: "best_video_1080p" },
          { type: "video", quality: "720p", format: "mp4", size: "28.7 MB", formatId: "best_video_720p" },
          { type: "audio", quality: "320kbps", format: "mp3", size: "8.1 MB", formatId: "best_audio_320kbps" },
        ],
      });
      setSelectedFormatId("best_video_1080p"); // Demo के लिए एक फ़ॉर्मेट प्री-सेलेक्ट करें
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
            Download TikTok videos without watermark in HD quality using yt-dlp
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
                    setSelectedFormatId("");
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
                          {info.views && (
                            <div className="flex items-center text-blue-500">
                                <Eye className="mr-1 h-4 w-4" />
                                {info.views}
                            </div>
                          )}
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
                          onValueChange={setSelectedFormatId}
                          value={selectedFormatId}
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
                              <SelectItem key={format.formatId || index} value={format.formatId}>
                                {format.quality} ({format.format}) {format.size ? ` - ${format.size}` : ''}
                                {format.type === 'audio' ? ' (Audio Only)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button onClick={handleDownloadFile} disabled={loading || !selectedFormatId}>
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

                    {/* Preview logic (yt-dlp से सीधे URL आमतौर पर CORS के कारण काम नहीं करते हैं,
                        इसलिए यह भाग केवल डेमो के लिए या यदि आपके पास एक प्रॉक्सी है तो काम करेगा) */}
                    {/* <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            src={info.formats.find(f => f.formatId === selectedFormatId)?.url} // यह URL काम नहीं कर सकता है
                            poster={info.thumbnail || ""}
                            controls
                            className="w-full h-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                        <p className="text-muted-foreground text-xs mt-2 flex items-center justify-center">
                            <Info className="h-3 w-3 mr-1" /> Preview might not show for all formats or due to CORS.
                        </p>
                    </div> */}


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
                  "No watermark removal (often automatic with yt-dlp)",
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