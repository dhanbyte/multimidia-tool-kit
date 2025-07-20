// app/dashboard/social-bio-generator/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Sparkles, // Main icon for AI generation
  Twitter, // Social Icons
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Globe, // For Website/Blog
  Copy, // Copy icon
  Check, // Checkmark for copy feedback
  Loader2, // Loading spinner
  Info, // For tooltip
  Mic, // Microphone icon for voice input
  X, // Clear input icon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // For copy tooltip

// Import useSpeechRecognition and SpeechRecognition for voice input
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// app/dashboard/social-bio-generator/page.tsx



// Placeholder for AI generation (replace with actual API call)
const generateBioWithAIs = async (data: {
  keywords: string;
  tone: string;
  platform: string;
  length: string;
}): Promise<string> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      let bio = ``;
      let platformSpecific = "";

      switch (data.platform) {
        case "Twitter":
          platformSpecific = "#TwitterBio";
          break;
        case "Instagram":
          platformSpecific = "📸 InstaCreator";
          break;
        case "LinkedIn":
          platformSpecific = "🔗 Professional";
          break;
        case "TikTok":
          platformSpecific = "🎵 TikTokVibes";
          break;
        default:
          platformSpecific = "";
      }

      bio = `👋 ${data.platform} Bio: ${data.keywords.split(',').map(k => `#${k.trim()}`).join(' ')}. ${data.tone === 'Formal' ? 'Dedicated professional' : 'Passionate creator'} ${platformSpecific}. ${data.length === 'Short' ? 'Brief & impactful.' : 'Crafting my journey.'}`;

      resolve(bio);
    }, 2000); // Simulate network delay
  });
};

export default function SocialBioGeneratorPage() {
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Casual"); // Default tone
  const [platform, setPlatform] = useState("Instagram"); // Default platform
  const [length, setLength] = useState("Medium"); // Default length
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedBio, setCopiedBio] = useState(false); // State for bio copy feedback
  const [copiedLink, setCopiedLink] = useState<string | null>(null); // State for link copy feedback

  const { toast } = useToast();

  // Speech recognition hooks
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Update keywords when transcript changes
  useEffect(() => {
    if (transcript) {
      setKeywords(transcript);
    }
  }, [transcript]);

  // Handle voice input start/stop
  const handleVoiceInputToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Clear previous transcript
      SpeechRecognition.startListening({ continuous: false, language: 'en-IN' }); // Using Indian English
    }
  };

  const handleGenerateBio = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide some keywords or interests to generate a bio.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedBio(null);
    setCopiedBio(false); // Reset copy status

    try {
      const bio = await generateBioWithAIs({ keywords, tone, platform, length });
      setGeneratedBio(bio);
      toast({
        title: "Bio Generated!",
        description: "Your new social media bio is ready.",
      });
    } catch (error) {
      console.error("Bio generation failed:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate bio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyBioToClipboard = () => {
    if (generatedBio) {
      navigator.clipboard.writeText(generatedBio);
      setCopiedBio(true);
      toast({
        title: "Copied!",
        description: "Bio copied to clipboard.",
      });
      setTimeout(() => setCopiedBio(false), 2000); // Reset after 2 seconds
    }
  };

  const copyLinkToClipboard = (link: string, socialName: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(socialName);
    toast({
      title: "Link Copied!",
      description: `${socialName} link copied to clipboard.`,
    });
    setTimeout(() => setCopiedLink(null), 2000); // Reset after 2 seconds
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, placeholder: "@yourhandle", example: "https://x.com/yourhandle" },
    { name: "Instagram", icon: Instagram, placeholder: "@yourhandle", example: "https://instagram.com/yourhandle" },
    { name: "LinkedIn", icon: Linkedin, placeholder: "your_profile_url", example: "https://linkedin.com/in/yourname" },
    { name: "GitHub", icon: Github, placeholder: "your_username", example: "https://github.com/yourusername" },
    { name: "YouTube", icon: Youtube, placeholder: "your_channel_link", example: "https://youtube.com/yourchannel" },
    { name: "Website/Blog", icon: Globe, placeholder: "yourwebsite.com", example: "https://yourwebsite.com" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="h-8 w-8 text-yellow-500" /> AI Social Media Bio Generator
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground mt-2">
            Craft compelling and unique social media bios instantly. Powered by AI to reflect your personality and goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Keywords Input with Mic */}
          <div className="grid gap-4">
            <Label htmlFor="keywords" className="flex items-center justify-between text-base font-semibold">
              Keywords / Interests
              <span className="text-sm text-muted-foreground font-normal">(e.g., tech, art, travel, entrepreneur)</span>
            </Label>
            <div className="relative">
              {/* Clear button on the left */}
              {keywords && !listening && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setKeywords("")}
                  disabled={isLoading}
                  title="Clear input"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Input
                id="keywords"
                placeholder={listening ? "Listening..." : "Separate with commas (e.g., coding, coffee, hiking)"}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                disabled={isLoading || listening}
                className={cn("pr-12", keywords && "pl-10")} // Adjust padding based on clear button presence
              />
              {/* Microphone button on the right */}
              {browserSupportsSpeechRecognition && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
                  onClick={handleVoiceInputToggle}
                  disabled={isLoading}
                  title={listening ? "Stop listening" : "Start voice input"}
                >
                  <Mic className={cn("h-5 w-5", listening ? "text-red-500 animate-pulse" : "text-primary")} />
                </Button>
              )}
            </div>
            {!browserSupportsSpeechRecognition && (
              <p className="text-sm text-red-500">
                Your browser does not support speech recognition.
              </p>
            )}
            {listening && (
              <p className="text-sm text-blue-500 animate-fade-in-out">
                Speak now...
              </p>
            )}
          </div>

          {/* Platform, Tone, Length */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="platform" className="text-base font-semibold">Platform</Label>
              <select
                id="platform"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                disabled={isLoading}
              >
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter / X</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="Personal">Personal/General</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tone" className="text-base font-semibold">Tone</Label>
              <select
                id="tone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={isLoading}
              >
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Witty">Witty/Humorous</option>
                <option value="Professional">Professional</option>
                <option value="Creative">Creative</option>
                <option value="Empowering">Empowering</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="length" className="text-base font-semibold">Length</Label>
              <select
                id="length"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                disabled={isLoading}
              >
                <option value="Short">Short (1-2 lines)</option>
                <option value="Medium">Medium (3-4 lines)</option>
                <option value="Long">Long (5+ lines)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerateBio} className="w-full text-lg py-7 rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300" disabled={isLoading || listening}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Generating Bio...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-6 w-6" /> Generate Bio
              </>
            )}
          </Button>

          {/* Generated Bio Display */}
          {generatedBio && (
            <div className="mt-8 pt-4 border-t border-dashed">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
                Your New Bio <Info className="h-5 w-5 text-muted-foreground" />
              </h3>
              <div className="relative p-6 border rounded-lg bg-card shadow-md">
                <Textarea
                  value={generatedBio}
                  readOnly
                  className="w-full h-auto min-h-[120px] text-lg font-medium resize-none border-none focus-visible:ring-0 bg-transparent pr-12"
                />
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-10 w-10 text-muted-foreground hover:bg-muted hover:text-primary"
                        onClick={copyBioToClipboard}
                        title="Copy Bio"
                      >
                        {copiedBio ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copiedBio ? "Copied!" : "Copy Bio"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* Social Media Links Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
              Social Media Links <span className="text-base text-muted-foreground font-normal">(optional)</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Quickly add and copy example social media handles/links.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TooltipProvider>
                {socialLinks.map((social, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg bg-background">
                    <div className="flex-shrink-0">
                      <social.icon className="h-7 w-7 text-primary" />
                    </div>
                    <Input
                      placeholder={social.placeholder}
                      className="flex-grow text-base"
                      defaultValue={social.example} // Pre-fill with example link
                    />
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyLinkToClipboard(social.example, social.name)}
                          title={`Copy example ${social.name} link`}
                        >
                          {copiedLink === social.name ? (
                            <Check className="h-6 w-6 text-green-500" />
                          ) : (
                            <Copy className="h-6 w-6 text-muted-foreground hover:text-primary" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiedLink === social.name ? "Copied!" : `Copy example ${social.name} link`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use Section */}
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">How to Use the Bio Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
            <li>
              Enter keywords or interests that describe you or your brand in the input box.
              <span className="ml-1 text-primary-foreground">(You can also click the <Mic className="inline-block h-4 w-4 relative top-0.5" /> icon to speak your input!)</span>
            </li>
            <li>Select your target social media platform (e.g., Instagram, Twitter).</li>
            <li>Choose the desired tone (e.g., Casual, Professional, Witty).</li>
            <li>Select the preferred length for your bio.</li>
            <li>Click the "<Sparkles className="inline-block h-4 w-4 relative top-0.5" /> Generate Bio" button and watch the AI craft your perfect bio.</li>
            <li>Copy the generated bio to your clipboard using the <Copy className="inline-block h-4 w-4 relative top-0.5" /> button and update your profile!</li>
            <li>Optionally, use the "Social Media Links" section to quickly copy example links for your profiles.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// Label component (Assuming you have this in your shadcn setup or create it)
const Label = ({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>
      {children}
    </label>
  );