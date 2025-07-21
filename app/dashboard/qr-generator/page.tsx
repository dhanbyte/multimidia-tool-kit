
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "QR Code Generator - MultiTool by Dhanbyte",
  description: "Generate custom QR codes instantly for free. Easy to use, fast download, no login required.",
  keywords: [
    "QR code generator",
    "free QR code tool",
    "create QR codes",
    "adobe qr code generator",
    "qr code generator canva",
    "generate qr code for url",
    "qr code generator monkey",
    "generate qr code for wifi",
    "QR code maker",
    "custom QR codes",
    "online QR code maker"
  ],
  openGraph: {
    title: "QR Code Generator - MultiTool",
    description: "Create QR codes in seconds. Free, fast, and customizable.",
    url: "https://dhanbyte.me/dashboard/qr-generator",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "QR Code Generator - MultiTool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator",
    description: "Free tool to create QR codes for links, messages, and more.",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me/dashboard/qr-generator",
  },
  metadataBase: new URL("https://dhanbyte.me")
}


const QRGeneratorPages = dynamic(() => import("../../../components/qr-genrator"), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin h-6 w-6 text-primary" />
      <span className="ml-2">Loading PDF Tool...</span>
    </div>
  ),
});

export default function QRGeneratorPage() {
 return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Free QR Code Generator</h1>
      <p className="text-muted-foreground mb-8 text-base">
        Instantly generate custom QR codes for URLs, text, contact info, and more. Fast, free, and no sign-up required.
      </p>


      <QRGeneratorPages />
    </div>
  );
}
