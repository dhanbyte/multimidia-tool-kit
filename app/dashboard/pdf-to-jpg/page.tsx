"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PDF to JPG Converter - MediaTools Pro",
  description: "Convert PDF pages into high-quality JPG images quickly and easily using MediaTools Pro.",
  keywords: ["PDF to JPG", "Convert PDF to Image", "PDF Image Extractor", "Online PDF Tools"],
  openGraph: {
    title: "PDF to JPG Converter",
    description: "Free online tool to convert PDF documents into JPG images.",
    url: "https://dhananjay.me/dashboard/pdf-to-jpg",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to JPG Converter",
    description: "Convert PDF to JPG online — no installation needed.",
    images: ["/og-image.png"],
  },
};


const DynamicPdfToJpgConverter = dynamic(
  () => import('@/components/PdfToJpgConverterClient'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading PDF Converter...</span>
      </div>
    ),
  }
);

export default function PdfToJpgPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Free PDF to JPG Converter</h1>
      <p className="text-muted-foreground mb-8 text-base">
        Instantly convert your PDF files into high-quality JPG images. No sign-up required – fast, secure, and 100% free.
      </p>

      <DynamicPdfToJpgConverter />
    </div>
  );
}
