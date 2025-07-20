// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/main-nav";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediaTools Pro - All-in-One Media Toolkit",
  description:
    "Download videos, generate QR codes, convert files, and more — all in one powerful platform.",
  generator: "v0.dev",
  metadataBase: new URL("https://multi-tool-website.dhanbyte.me"),
  openGraph: {
    title: "MediaTools Pro - All-in-One Media Toolkit",
    description:
      "Compress images, convert media, and generate content — fast, free & powerful.",
    url: "https://multi-tool-website.dhanbyte.me",
    siteName: "MediaTools Pro",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "MediaTools Pro",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaTools Pro - All-in-One Media Toolkit",
    description: "Convert files, compress media, and more — with one powerful tool.",
    images: [
      "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google Analytics script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CSRTEPL9GN"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CSRTEPL9GN');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          <main className="flex-1">
            {children}
            <Analytics />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
