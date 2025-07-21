import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Free Image Hosting | Upload & Share Images Instantly",
  description: "Upload and share images with permanent links. No signup required. Fast, reliable, and free image hosting.",
  keywords: [
    "web hosting images",
    "Free image upload",
    "	temporary image hosting",
    "hosta images",
    "	anon image hosting",
    "hh image host",
    "Permanent image links",
    "anonymous image host",
    "Image hosting without signup",
  ],
  openGraph: {
    title: "Image Hosting Platform",
    description: "Upload and share your images online for free with permanent URLs and instant access.",
    url: "https://dhanbyte.me/dashboard/image-hosting",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "Free Image Hosting - MultiTool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Hosting | Upload Now",
    description: "Upload images and get shareable links instantly. Fast and secure image hosting service.",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me/dashboard/image-hosting",
  },
  metadataBase: new URL("https://dhanbyte.me"),
};

const ImageHostingPages = dynamic(() => import("../../../components/image-hosting"), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin h-6 w-6 text-primary" />
      <span className="ml-2">Loading Image Hosting Tool...</span>
    </div>
  ),
});

export default function ImageHostingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Free Image Hosting Tool</h1>
      <p className="text-muted-foreground mb-8 text-base">
        Instantly upload your images and get permanent shareable links. No sign-up, no hassle — just fast and reliable hosting.
      </p>

      <ImageHostingPages />
    </div>
  );
}
