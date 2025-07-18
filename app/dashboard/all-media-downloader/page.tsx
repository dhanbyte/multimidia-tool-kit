// AllMediaDownloaderPage.tsx
"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Video,
  Music,
  ImageIcon,
  Info,
  Star,
  Clock,
  Eye,
  Heart,
} from "lucide-react";

export default function AllMediaDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [detectedPlatform, setDetectedPlatform] = useState("");
  const { toast } = useToast();

  const supportedPlatforms = [
    // yt-dlp often reports platform names like 'Youtube', 'Tiktok' etc.
    // domains भी yt-dlp के सपोर्टेड साइट्स के हिसाब से बढ़ाए जा सकते हैं
    { name: "YouTube", icon: Music, color: "text-red-600", domains: ["youtube.com", "youtu.be", "m.youtube.com", "music.youtube.com"] },
    { name: "TikTok", icon: Video, color: "text-pink-600", domains: ["tiktok.com", "www.tiktok.com"] },
    { name: "Twitter", icon: Video, color: "text-sky-600", domains: ["twitter.com", "x.com"] },
    { name: "Instagram", icon: ImageIcon, color: "text-purple-600", domains: ["instagram.com", "www.instagram.com"] },
    { name: "Facebook", icon: Video, color: "text-blue-600", domains: ["facebook.com", "fb.watch", "www.facebook.com"] },
    { name: "Vimeo", icon: Play, color: "text-indigo-600", domains: ["vimeo.com", "www.vimeo.com"] },
    { name: "Dailymotion", icon: Video, color: "text-orange-600", domains: ["dailymotion.com", "www.dailymotion.com"] },
    { name: "Reddit", icon: Video, color: "text-orange-500", domains: ["reddit.com", "www.reddit.com", "old.reddit.com"] },
    // आप यहां और प्लेटफॉर्म जोड़ सकते हैं जिन्हें yt-dlp सपोर्ट करता है
  ];

  const detectPlatform = (inputUrl: string) => {
    try {
      const parsedUrl = new URL(inputUrl);
      const hostname = parsedUrl.hostname;
      const platform = supportedPlatforms.find((p) =>
        p.domains.some((domain) => hostname.includes(domain.replace(/^(www\.)?/, ''))) // 'www.' को हटाकर मैच करें
      );
      return platform?.name || "";
    } catch (e) {
      return ""; // Invalid URL
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const platform = detectPlatform(value);
    setDetectedPlatform(platform);
    setError(""); // Clear error on URL change
    setResult(null); // Clear previous result
  };

  // Function to get media information (first step)
  const handleGetMediaInfo = async () => {
    if (!url) {
      setError("Please enter a media URL");
      return;
    }

    if (!detectedPlatform) {
      setError("Unsupported platform. Please check supported platforms list. (Note: yt-dlp supports many more platforms than listed, try anyway!)");
      // return; // Don't return here, let the backend try, as yt-dlp might support it even if our list doesn't
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
        return prev + 8;
      });
    }, 300);

    try {
      const response = await fetch("/api/all-media-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, action: "getInfo" }), // Explicitly request info
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch media information");
      }

      setProgress(100);
      setResult(data.data);
      toast({
        title: "Success!",
        description: `${data.data.platform || 'Media'} information fetched successfully.`,
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

  // Function to handle actual format download
  const handleFormatDownload = async (formatId: string, formatQuality: string, formatExt: string) => {
    if (!url || !formatId) {
      toast({
        title: "Error",
        description: "Missing URL or format information for download.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Starting Download",
      description: `Preparing to download ${formatQuality} (${formatExt})... This might take a moment.`,
    });

    try {
      const response = await fetch("/api/all-media-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, formatId, action: "download" }), // Explicitly request download
      });

      if (!response.ok) {
        const errorData = await response.json(); // Error body expected from API
        throw new Error(errorData.error || "Failed to initiate download.");
      }

      // Handle the file download
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `media_download.${formatExt}`; // Default filename

      if (contentDisposition) {
        // Try to parse filename from Content-Disposition header
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      } else if (result?.title) {
        // Fallback to title if Content-Disposition is missing
        filename = `${result.title.replace(/[^a-z0-9_.-]/gi, '_')}.${formatExt}`; // Sanitize title for filename
      }


      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename; // Set the filename for download
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Download Complete!",
        description: `${filename} has been downloaded.`,
        variant: "default", // Default variant for toast
      });
    } catch (err: any) {
      console.error("Download error:", err);
      toast({
        title: "Download Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };


  const handleDemo = () => {
    setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); // A famous YouTube URL for demo
    setDetectedPlatform("YouTube");
    setLoading(true);
    setError("");
    setResult(null); // Clear previous result for demo
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 15;
      });
    }, 250);

    // Simulate fetching data from yt-dlp
    setTimeout(() => {
      setResult({
        title: "Rick Astley - Never Gonna Give You Up (Official Video)",
        platform: "YouTube",
        author: "Rick Astley",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg", // A real thumbnail URL
        duration: "3:33",
        views: "1,400,000,000", // Example large number
        likes: "15,000,000", // Example large number
        uploadDate: "2009-10-25",
        formats: [
          { type: "video", quality: "1080p", format: "mp4", size: "45.2 MB", formatId: "248+251" }, // Example formatId
          { type: "video", quality: "720p", format: "mp4", size: "28.7 MB", formatId: "247+251" },
          { type: "video", quality: "480p", format: "mp4", size: "18.3 MB", formatId: "135+251" },
          { type: "audio", quality: "320kbps", format: "mp3", size: "8.1 MB", formatId: "251" },
          { type: "audio", quality: "128kbps", format: "mp3", size: "3.2 MB", formatId: "140" },
        ],
      });
      setLoading(false);
      toast({
        title: "Demo Complete!",
        description: "This is a demo result. Use real URLs for actual downloads.",
      });
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString; // Return as is if parsing fails
    }
  };

  const getPlatformIcon = (platformName: string) => {
    const platform = supportedPlatforms.find((p) => p.name.toLowerCase() === platformName.toLowerCase());
    return platform ? platform.icon : Globe;
  };

  const getPlatformColor = (platformName: string) => {
    const platform = supportedPlatforms.find((p) => p.name.toLowerCase() === platformName.toLowerCase());
    return platform ? platform.color : "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/20">
          <Download className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Universal Media Downloader</h1>
          <p className="text-muted-foreground">Download videos, audio, and images from any supported platform</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Tool */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Universal Media Downloader
              </CardTitle>
              <CardDescription>Paste any media URL from supported platforms to download content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Paste any media URL here (YouTube, TikTok, Twitter, Instagram, etc.)"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="pr-20"
                    />
                    {detectedPlatform && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Badge variant="secondary" className="text-xs">
                          {detectedPlatform}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleGetMediaInfo} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Get Info
                      </>
                    )}
                  </Button>
                </div>
                {detectedPlatform && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Platform detected: {detectedPlatform}</span>
                  </div>
                )}
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
                    <span>Processing {detectedPlatform || "media"} content...</span>
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
                <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Media Info */}
                      <div className="flex items-start space-x-4">
                        <img
                          src={result.thumbnail || "/placeholder.svg"}
                          alt="Media thumbnail"
                          className="w-24 h-18 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            {React.createElement(getPlatformIcon(result.platform), {
                              className: `h-4 w-4 ${getPlatformColor(result.platform)}`,
                            })}
                            <Badge variant="outline" className="text-xs">
                              {result.platform}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-2">{result.title}</h3>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>By {result.author}</span>
                            {result.duration && (
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {result.duration}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            {result.views && (
                              <div className="flex items-center text-blue-500">
                                <Eye className="mr-1 h-3 w-3" />
                                {result.views}
                              </div>
                            )}
                            {result.likes && (
                              <div className="flex items-center text-red-500">
                                <Heart className="mr-1 h-3 w-3" />
                                {result.likes}
                              </div>
                            )}
                            {result.uploadDate && (
                              <span className="text-muted-foreground">{formatDate(result.uploadDate)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Download Options */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Available Formats:</h4>
                        <Tabs defaultValue="video" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="video">Video</TabsTrigger>
                            <TabsTrigger value="audio">Audio</TabsTrigger>
                          </TabsList>
                          <TabsContent value="video" className="space-y-2">
                            {result.formats
                              ?.filter((format: any) => format.type === "video")
                              .map((format: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-background rounded border"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Video className="h-4 w-4 text-indigo-600" />
                                    <span className="text-sm font-medium">{format.quality}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {format.format}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{format.size}</span>
                                  </div>
                                  <Button size="sm" onClick={() => handleFormatDownload(format.formatId, format.quality, format.format)}>
                                    <Download className="mr-1 h-3 w-3" />
                                    Download
                                  </Button>
                                </div>
                              ))}
                              {result.formats?.filter((format: any) => format.type === "video").length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No video formats available.</p>
                              )}
                          </TabsContent>
                          <TabsContent value="audio" className="space-y-2">
                            {result.formats
                              ?.filter((format: any) => format.type === "audio")
                              .map((format: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-background rounded border"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Music className="h-4 w-4 text-indigo-600" />
                                    <span className="text-sm font-medium">{format.quality}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {format.format}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{format.size}</span>
                                  </div>
                                  <Button size="sm" onClick={() => handleFormatDownload(format.formatId, format.quality, format.format)}>
                                    <Download className="mr-1 h-3 w-3" />
                                    Download
                                  </Button>
                                </div>
                              ))}
                              {result.formats?.filter((format: any) => format.type === "audio").length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No audio formats available.</p>
                              )}
                          </TabsContent>
                        </Tabs>
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
                    title: "Copy Media URL",
                    description:
                      "Go to any supported platform and copy the URL of the video, audio, or image you want to download",
                  },
                  {
                    step: "2",
                    title: "Paste URL & Get Info",
                    description: "Paste the URL in the input field above and click 'Get Info'. The platform will be automatically detected, and available formats will be displayed.",
                  },
                  {
                    step: "3",
                    title: "Choose Format & Download",
                    description: "Select your preferred format and quality from the available options and click the 'Download' button next to it.",
                  },
                  {
                    step: "4",
                    title: "Save File",
                    description: "The media file will be downloaded to your device.",
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
          {/* Supported Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Supported Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportedPlatforms.map((platform, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <platform.icon className={`h-4 w-4 ${platform.color}`} />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                ))}
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
                  "Universal platform support",
                  "Multiple format options",
                  "Various quality settings",
                  "Fast processing",
                  "Auto platform detection",
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
                <p>• Works with most major social media platforms</p>
                <p>• Higher quality files take longer to process</p>
                <p>• Some platforms may have restrictions (e.g., age-gated content)</p>
                <p>• Private content cannot be downloaded without proper authentication (not supported here)</p>
                <p>• Always check platform terms before downloading content.</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Downloads (Placeholder/Example) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { platform: "YouTube", count: "45%" },
                  { platform: "TikTok", count: "28%" },
                  { platform: "Twitter", count: "15%" },
                  { platform: "Instagram", count: "12%" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.platform}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats (Placeholder/Example) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Downloads Today</span>
                  <Badge variant="secondary">5,847</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <Badge variant="default">96.8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg. Processing</span>
                  <Badge variant="outline">3.2s</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}