'use client';

import { useState, FormEvent, useEffect, useRef } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

// Video Details इंटरफेस (Backend से प्राप्त होने वाली जानकारी)
interface VideoDetails {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  channel: string;
}

// Format इंटरफेस (Backend से प्राप्त होने वाली क्वालिटी की लिस्ट)
interface Format {
  format_id: string;
  ext: string;
  quality: number; // Sorting के लिए: वीडियो के लिए height, ऑडियो के लिए abr
  type: 'video' | 'audio';
  label: string; // जैसे "Video 1080p (MP4)" या "Audio Only 320kbps (MP3)"
  filesize?: number;
  protocol?: string;
  vcodec?: string;
  acodec?: string;
}

export default function YouTubeDownloaderPage() {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null); // वीडियो की डिटेल्स
  const [formats, setFormats] = useState<Format[]>([]); // सभी उपलब्ध क्वालिटी
  const [selectedFormatId, setSelectedFormatId] = useState<string>(''); // चुनी हुई क्वालिटी की ID
  const [selectedMediaType, setSelectedMediaType] = useState<'video' | 'audio'>('video'); // UI टैब्स के लिए
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const playerRef = useRef<HTMLVideoElement | HTMLAudioElement>(null); // प्लेयर कंट्रोल करने के लिए

  // URL वैलिडेशन
  const isValidYouTubeUrl = (inputUrl: string) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    return youtubeRegex.test(inputUrl);
  };

  // Step 1: URL डालने पर फॉर्मेट्स प्राप्त करें
  const handleGetFormats = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      toast({ title: "Error", description: "Please enter a YouTube URL", variant: "destructive" });
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)");
      toast({ title: "Error", description: "Please enter a valid YouTube URL", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError(null);
    setVideoDetails(null); // पुरानी डिटेल्स हटाएँ
    setFormats([]); // पुरानी फ़ॉर्मेट लिस्ट क्लियर करें
    setDownloadUrl(null); // पुराना डाउनलोड URL क्लियर करें
    setSelectedFormatId(''); // पुरानी सेलेक्टेड फ़ॉर्मेट ID क्लियर करें
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      const response = await fetch('/api/youtube-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }), // केवल URL भेजें, formatId या type नहीं
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVideoDetails(data.videoDetails); // वीडियो डिटेल्स सेट करें
        setFormats(data.formats); // सभी फॉर्मेट्स सेट करें

        // डिफ़ॉल्ट रूप से सबसे अच्छी क्वालिटी चुनें जो टैब के प्रकार से मेल खाती हो
        const defaultFormatForTab = data.formats.find((f: Format) => f.type === selectedMediaType);
        if (defaultFormatForTab) {
          setSelectedFormatId(defaultFormatForTab.format_id);
        } else if (data.formats.length > 0) {
            // अगर वर्तमान टैब के लिए कोई फॉर्मेट नहीं है, तो पहली उपलब्ध क्वालिटी चुनें
            setSelectedFormatId(data.formats[0].format_id);
            setSelectedMediaType(data.formats[0].type); // टैब को भी अपडेट करें
        }

        toast({ title: "Success!", description: "Available formats fetched." });
      } else {
        setError(data.error || 'Failed to fetch formats.');
        toast({ title: "Error", description: data.error || 'Failed to fetch formats.', variant: "destructive" });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({ title: "Error", description: err.message || 'An unexpected error occurred.', variant: "destructive" });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setLoading(false);
    }
  };

  // Step 2: चुनी हुई क्वालिटी का डाउनलोड लिंक प्राप्त करें
  const handleDownload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFormatId) {
      setError('Please select a quality/format.');
      toast({ title: "Error", description: "Please select a quality/format.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadUrl(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const response = await fetch('/api/youtube-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // type: selectedMediaType भेजें ताकि backend को पता चले कि वीडियो या ऑडियो का लिंक चाहिए
        body: JSON.stringify({ url, type: selectedMediaType, formatId: selectedFormatId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDownloadUrl(data.downloadUrl);
        toast({ title: "Success!", description: "Download link ready!" });
      } else {
        setError(data.error || 'Failed to get download link.');
        toast({ title: "Error", description: data.error || 'Failed to get download link.', variant: "destructive" });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during download.');
      toast({ title: "Error", description: err.message || 'An unexpected error occurred during download.', variant: "destructive" });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setLoading(false);
    }
  };

  // जब टैब बदलता है (वीडियो/ऑडियो)
  const handleTabChange = (value: string) => {
    setSelectedMediaType(value as 'video' | 'audio');
    // जब टैब बदले, तो formats में से उस टाइप का पहला या सबसे अच्छा फॉर्मेट चुनें
    const newDefaultFormat = formats.find(f => f.type === value);
    if (newDefaultFormat) {
      setSelectedFormatId(newDefaultFormat.format_id);
    } else {
      setSelectedFormatId(''); // अगर कोई फॉर्मेट नहीं मिला, तो खाली कर दें
    }
    setDownloadUrl(null); // टैब बदलने पर पुराना डाउनलोड URL हटा दें
    setError(null); // एरर हटा दें
  };

  // जब select में चुना हुआ फॉर्मेट बदलता है, तो सुनिश्चित करें कि selectedMediaType भी सही हो
  useEffect(() => {
    const currentFormat = formats.find(f => f.format_id === selectedFormatId);
    if (currentFormat && currentFormat.type !== selectedMediaType) {
      // अगर चुना हुआ फॉर्मेट वर्तमान टैब से मेल नहीं खाता, तो टैब को अपडेट करें
      setSelectedMediaType(currentFormat.type);
    }
  }, [selectedFormatId, formats, selectedMediaType]);

  // जब downloadUrl सेट होता है, तो प्लेयर को अपडेट करें
  useEffect(() => {
    if (playerRef.current && downloadUrl) {
      playerRef.current.load(); // नया सोर्स लोड करें
      // playerRef.current.play(); // ऑटो-प्ले के लिए, लेकिन यह यूजर एक्सपीरियंस के लिए खराब हो सकता है
    }
  }, [downloadUrl]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20">
          <Music className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">YouTube Downloader</h1>
          <p className="text-muted-foreground">Download YouTube videos and audio with quality selection and preview</p>
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
              <CardDescription>Enter YouTube URL to get available formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL इनपुट और Get Formats बटन */}
              <form onSubmit={handleGetFormats} className="flex space-x-2">
                <Input
                  placeholder="e.g., https://www.youtube.com/watch?v=VIDEO_ID"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={loading || !url.trim()}>
                  {loading && !videoDetails ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Formats
                    </>
                  ) : (
                    <>
                      <Info className="mr-2 h-4 w-4" />
                      Get Formats
                    </>
                  )}
                </Button>
              </form>

              {/* प्रोग्रेस बार */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{videoDetails === null ? 'Fetching video information and formats...' : 'Getting download link...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* एरर मैसेज */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* वीडियो डिटेल्स और फॉर्मेट सिलेक्शन */}
              {videoDetails && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={videoDetails.thumbnail || "/placeholder.svg"}
                        alt="Video thumbnail"
                        className="h-20 w-28 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-sm line-clamp-2">{videoDetails.title}</h3>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {videoDetails.channel}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {videoDetails.duration}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center text-blue-500">
                            <Eye className="mr-1 h-3 w-3" />
                            {videoDetails.views}
                          </div>
                          <div className="flex items-center text-green-500">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            {videoDetails.likes}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* वीडियो/ऑडियो टैब */}
                    <Tabs value={selectedMediaType} onValueChange={handleTabChange} className="w-full">
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
                    </Tabs>

                    {/* क्वालिटी चयन ड्रॉपडाउन */}
                    <form onSubmit={handleDownload} className="flex flex-col gap-3">
                      <Select value={selectedFormatId} onValueChange={setSelectedFormatId} disabled={loading}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select a ${selectedMediaType} quality...`} />
                        </SelectTrigger>
                        <SelectContent>
                          {formats
                            .filter(f => f.type === selectedMediaType) // केवल चुने हुए टैब के अनुसार फ़ॉर्मेट दिखाएँ
                            .map((format) => (
                              <SelectItem key={format.format_id} value={format.format_id}>
                                {format.label} {format.filesize ? `(${Math.round(format.filesize / (1024 * 1024))}MB)` : ''}
                                {/* Optional: Add more details for combined/only formats */}
                                {format.type === 'video' && format.vcodec && format.acodec && format.vcodec !== 'none' && format.acodec !== 'none' && ` (Combined)`}
                                {format.type === 'video' && format.vcodec && format.acodec === 'none' && ` (Video Only)`}
                                {format.type === 'audio' && format.acodec && format.vcodec === 'none' && ` (Audio Only)`}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <Button type="submit" disabled={loading || !selectedFormatId}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Getting Link
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download Selected
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* डाउनलोड और प्ले विकल्प */}
              {downloadUrl && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-base">Content Ready!</h3>
                    {selectedMediaType === 'video' && (
                      <div className="w-full">
                        <video ref={playerRef as React.RefObject<HTMLVideoElement>} controls src={downloadUrl} className="w-full h-auto rounded-md bg-black">
                          Your browser does not support the video tag.
                        </video>
                        <p className="text-xs text-muted-foreground mt-2">
                          नोट: कुछ वीडियो फॉर्मेट सीधे ब्राउज़र में प्ले नहीं हो सकते हैं (विशेषकर DASH स्ट्रीम)। अगर यह प्ले नहीं होता है, तो कृपया इसे डाउनलोड करें।
                        </p>
                      </div>
                    )}
                    {selectedMediaType === 'audio' && (
                      <div className="w-full">
                        <audio ref={playerRef as React.RefObject<HTMLAudioElement>} controls src={downloadUrl} className="w-full h-auto rounded-md bg-black">
                          Your browser does not support the audio tag.
                        </audio>
                        <p className="text-xs text-muted-foreground mt-2">
                          नोट: कुछ ऑडियो फॉर्मेट सीधे ब्राउज़र में प्ले नहीं हो सकते हैं। अगर यह प्ले नहीं होता है, तो कृपया इसे डाउनलोड करें।
                        </p>
                      </div>
                    )}
                    <Separator />
                    <div className="text-center">
                      <a
                        href={downloadUrl}
                        download // यह ब्राउज़र को फ़ाइल डाउनलोड करने के लिए कहेगा
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download File
                        </Button>
                      </a>
                      <p className="text-xs text-muted-foreground mt-2">
                        अगर डाउनलोड तुरंत शुरू नहीं होता है, तो लिंक पर राइट-क्लिक करके "Save link as..." चुनें।
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Enter YouTube URL",
                    description: "Paste the URL of the YouTube video you want to download and click 'Get Formats'.",
                  },
                  {
                    step: "2",
                    title: "View Details & Select Quality",
                    description: "Once details appear, switch between Video/Audio tabs and choose your desired quality from the dropdown.",
                  },
                  {
                    step: "3",
                    title: "Preview & Download",
                    description: "Click 'Download Selected' to get the direct link. You can then preview the content or download the file.",
                  },
                  {
                    step: "4",
                    title: "Save File",
                    description: "If playback fails or you wish to save, right-click the preview and 'Save video/audio as...'.",
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

        {/* Sidebar (Includes Supported Formats, Features, and Pro Tips) */}
        <div className="space-y-6">
          {/* Supported Formats Card */}
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
                    <Badge variant="secondary">MP3 (Best)</Badge>
                    <Badge variant="secondary">M4A (Best)</Badge>
                    <Badge variant="secondary">WEBM Audio</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Multiple quality options (via yt-dlp)",
                  "Video and audio downloads",
                  "Preview before download",
                  "Fast processing speed",
                  "No registration required",
                  "Supports almost all YouTube URLs",
                  "High-quality output",
                  "Mobile friendly",
                  "Completely free (excluding hosting costs)",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Ensure `yt-dlp` and `FFmpeg` are installed on your server for this tool to work.</p>
                <p>• Higher quality videos take longer to process.</p>
                <p>• Audio downloads are generally faster than video.</p>
                <p>• `yt-dlp` supports playlists and live streams (if available for download).</p>
                <p>• No length restrictions on videos.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}