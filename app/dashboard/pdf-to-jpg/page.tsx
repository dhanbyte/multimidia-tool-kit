
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Metadata } from "next"

export const metadata = {
  title: "PDF to JPG Converter | Convert PDF Pages to Images",
  description: "Easily convert PDF files to high-quality JPG images. Fast, free, and works directly in your browser.",
  keywords: [
    "PDF to JPG",
    "Convert PDF to image",
    "convert tiff image to pdf",
    "how to convert image to pdf on...",
    "convert a pdf to an image",
    "how to convert pdf in image",
    "PDF to JPG converter online",
    "PDF to image free",
    "Online PDF to JPG tool",
  ],
  openGraph: {
    title: "PDF to JPG Converter Online",
    description: "Convert your PDF documents into individual JPG images instantly. No signup required.",
    url: "https://dhanbyte.me/dashboard/pdf-to-jpg",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "PDF to JPG - MultiTool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to JPG Converter",
    description: "Convert PDF pages to JPG images in seconds. High quality, free, and online.",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me/dashboard/pdf-to-jpg",
  },
  metadataBase: new URL("https://dhanbyte.me"),
};

const DynamicPdfToJpgConvert = dynamic(() => import("../../../components/PdfToJpgConverterClient"), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin h-6 w-6 text-primary" />
      <span className="ml-2">Loading PDF Tool...</span>
    </div>
  ),
});

export default function PdfToJpgPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Free PDF to JPG Converter</h1>
      <p className="text-muted-foreground mb-8 text-base">
        Instantly convert your PDF files into high-quality JPG images. No sign-up required  fast, secure, and 100% free.
      </p>

      <DynamicPdfToJpgConvert />
    </div>
  );
}
