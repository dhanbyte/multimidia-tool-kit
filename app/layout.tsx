import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Analytics } from "@/components/analytics";
import StructuredData from "@/components/structured-data";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MultiTool - All-in-One Online Tools by Dhanbyte | Free PDF, Image & Text Tools",
  description:
    "MultiTool by Dhanbyte - Your ultimate collection of 100+ free online tools. PDF converter, image compressor, QR generator, password tools, text utilities, developer tools & more. No signup required!",
  keywords: "MultiTool, Dhanbyte tools, free online tools, pdf converter, image compressor, qr code generator, password generator, text tools, developer tools, encryption tools, typing test, stopwatch, expense tracker, url shortener, ip lookup, all in one tools",
  authors: [{ name: "Dhananjay (Dhanbyte)", url: "https://dhanbyte.me" }],
  creator: "Dhananjay - Full Stack Developer",
  publisher: "MultiTool by Dhanbyte",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "MultiTool - 100+ Free Online Tools by Dhanbyte",
    description:
      "Discover MultiTool by Dhanbyte - Your one-stop destination for 100+ free online tools. PDF converters, image tools, text utilities, developer tools, security tools & more. Fast, secure, no signup!",
    url: "https://dhanbyte.me",
    siteName: "MultiTool by Dhanbyte",
    images: [
      {
        url: "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
        width: 1200,
        height: 630,
        alt: "MultiTool - All-in-One Online Tools by Dhanbyte",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiTool by Dhanbyte - 100+ Free Online Tools",
    description: "Your ultimate toolkit! 100+ free online tools for PDF, images, text, development, security & more. Created by Dhananjay (Dhanbyte).",
    images: ["https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"],
  },
  alternates: {
    canonical: "https://dhanbyte.me",
  },
  verification: {
    google: "google-site-verification-code-here",
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6246142348671168"
          crossOrigin="anonymous"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WMB2H955');`,
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LE6FGHJQ8G"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LE6FGHJQ8G');
            `,
          }}
        />
        <link rel="canonical" href="https://dhanbyte.me" />

        <link
          rel="icon"
          type="image/png"
          href="https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"
        />

        <meta
          name="keywords"
          content="MultiTool, Dhanbyte, Dhananjay, free online tools, pdf converter, image compressor, qr code generator, password generator, text tools, developer tools, encryption tools, typing master, stopwatch, expense tracker, url shortener, ip lookup, all in one toolkit"
        />
        <meta name="author" content="Dhananjay (Dhanbyte) - Full Stack Developer & Video Editor" />
        <meta name="application-name" content="MultiTool by Dhanbyte" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WMB2H955"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <StructuredData />
            <Analytics />
            {children}
            <Toaster />
            <SonnerToaster position="top-right" />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
