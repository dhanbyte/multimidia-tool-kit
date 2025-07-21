// app/dashboard/pdf-to-text/page.tsx
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
export const metadata = {
  title: "Online Image Compressor | Reduce Image Size Instantly",
  description: "Compress images online without quality loss. Drag & drop JPEG, PNG, or WebP files and get optimized images fast.",
  keywords: [
    "Image compressor",
    "Compress image online",
    "image compressor sizer",
    "free image compressor",
    "image compressor to 50kb",
    "discord images compressor site",
    "image compressor tinify",
    "image compressor sizer",
    "discord images compressor site",
    "image compressor tinify",
  ],
  openGraph: {
    title: "Online Image Compressor",
    description: "Quickly compress your images without losing quality. Fast, secure, and free.",
    url: "https://dhanbyte.me/dashboard/image-compressor",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "Image Compressor - MultiTool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Compressor | Optimize JPEG, PNG, WebP",
    description: "Reduce file size of your images with our online image compressor tool.",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me/dashboard/image-compressor",
  },
  metadataBase: new URL("https://dhanbyte.me"),
};
const ImageCompressorPages = dynamic(() => import("../../../components/image-compressor"), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin h-6 w-6 text-primary" />
      <span className="ml-2">Loading PDF Tool...</span>
    </div>
  ),
});

export default function ImageCompressorPage() {
  return <ImageCompressorPages/>;
}
