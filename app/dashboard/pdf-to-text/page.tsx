import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PDF to Text Converter | Extract Text from PDF Files",
  description: "Convert your PDF documents to plain text with high accuracy. Works fast online in your browser.",
  keywords: [
    "PDF to text",
    "Extract text from PDF",
    "PDF text converter",
    "Convert PDF to TXT",
    "how to convert a text file to ...",
    "how to convert a text file to ...",
    "convert text messages to pdf",
    "Online PDF text extraction",
    "convert from rich text to pdf"
  ],
  openGraph: {
    title: "PDF to Text Converter Online",
    description: "Extract text from any PDF file easily. Free, fast, and secure conversion in your browser.",
    url: "https://dhanbyte.me/dashboard/pdf-to-text",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "PDF to Text - MultiTool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Text from PDF | Free PDF to Text Tool",
    description: "Easily convert PDF files into plain text. Accurate and instant conversion with no sign up.",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me/dashboard/pdf-to-text",
  },
  metadataBase: new URL("https://dhanbyte.me"),
};

const PDFToTextPages = dynamic(() => import("../../../components/pdf-to-text"), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin h-6 w-6 text-primary" />
      <span className="ml-2">Loading PDF to Text Tool...</span>
    </div>
  ),
});

export default function PDFToTextPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Free PDF to Text Converter</h1>
      <p className="text-muted-foreground mb-8 text-base">
        Easily extract text from your PDF files right in your browser. No sign-up needed — fast, secure, and completely free.
      </p>

      <PDFToTextPages />
    </div>
  );
}
