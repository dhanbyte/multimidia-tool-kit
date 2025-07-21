import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Text to Image Generator | Create Art from Words",
  description: "Generate stunning AI images from text descriptions using our powerful Text to Image tool. Choose styles, resolutions, and download high-quality artwork instantly.",
  keywords: [
    "AI image generator",
    "text to image",
    "perchance text to image",
    "chương trình text to image ...",
    "image to text ai",
    "generate images from text",
    "AI image generator online",
    "free image compressor",
    "images to text ai"
  ],
  openGraph: {
    title: "AI Text to Image Generator",
    description: "Turn your ideas into AI-generated art. Choose styles like realistic, anime, or abstract. Download high-res images instantly.",
    url: "https://dhanbyte.me/dashboard/text-to-image",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "AI Text to Image - MultiTool,images to text ai",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Text to Image Generator",
    description: "Create stunning images with AI using your text prompts. Multiple styles and HD resolutions supported.",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me/dashboard/text-to-image",
  },
  metadataBase: new URL("https://dhanbyte.me"),
};

// ✅ Use correct client component
const TextToImageClient = dynamic(() => import("../../../components/text-to-image"), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin h-6 w-6 text-primary" />
      <span className="ml-2">Loading Text-to-Image Tool...</span>
    </div>
  ),
});

export default function TextToImagePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Text to Image Generator</h1>
      <p className="text-muted-foreground mb-8 text-base">
        Type any prompt and generate stunning AI images instantly. Choose styles like realistic, anime, or abstract — all for free!
      </p>

      <TextToImageClient />
    </div>
  );
}
