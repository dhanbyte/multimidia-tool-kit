import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Bio Generator | Create Engaging Bios Instantly",
  description: "Generate creative bios for Instagram, Twitter, LinkedIn, and more. Powered by AI to match your vibe and audience.",
  keywords: [
    "Bio generator",
    "ai bio generator",
    "Social media bio creator",
    "instagram bio generator",
    "bio rad automated droplet gene...",
    "bio rad automated droplet gene...",
    "bio rad automated droplet gene...",
    "dating bio generator	",
    "Twitter bio ideas",
    "AI bio generator",
  ],
  openGraph: {
    title: "AI Social Media Bio Generator",
    description: "Generate engaging bios for all your profiles. Quick, creative, and free.",
    url: "https://dhanbyte.me/dashboard/social-bio-generator",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "Social Media Bio Generator - MultiTool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Social Bio Generator",
    description: "Stand out online with personalized, AI-powered social media bios. Generate now!",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me/dashboard/social-bio-generator",
  },
  metadataBase: new URL("https://dhanbyte.me"),
};

const SocialBioGeneratorClient = dynamic(() => import("../../../components/social-bio-generator"), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin h-6 w-6 text-primary" />
      <span className="ml-2">Loading Bio Generator...</span>
    </div>
  ),
});

export default function SocialBioGeneratorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Social Media Bio Generator</h1>
      <p className="text-muted-foreground mb-8 text-base">
        Instantly generate creative and personalized bios for your social media profiles. Perfect for Instagram, Twitter, LinkedIn, and more!
      </p>

      <SocialBioGeneratorClient />
    </div>
  );
}
