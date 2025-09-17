import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediaTools Pro – Free Online PDF, Image & Audio Tools",
  description:
    "Compress images, convert PDFs, scan documents, clean audio, and more. dhanbyte.me offers free, fast, and secure tools all in one place.",
  openGraph: {
    title: "MediaTools Pro – All-in-One Online Tools",
    description:
      "Try our free tools like PDF to JPG, QR Generator, Image Compressor & AI-based utilities at dhanbyte.me. 100% free and online.",
    url: "https://dhanbyte.me",
    siteName: "MediaTools Pro",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "MediaTools Pro by dhanbyte",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6246142348671168"
          crossOrigin="anonymous"
        ></script>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CSRTEPL9GN"
        ></script>
        <link rel="canonical" href="https://dhanbyte.me" />

        <link
          rel="icon"
          type="image/png"
          href="https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"
        />

        <meta
          name="keywords"
          content="free pdf tools, image compressor, qr code generator, online tools, voice cleaner, text to image ai, pdf to jpg, compress image online, dhanbyte tools"
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TJBS3J62"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <Analytics />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
