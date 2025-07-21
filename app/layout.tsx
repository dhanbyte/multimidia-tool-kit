// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
          crossorigin="anonymous"
        ></script>
        <link rel="canonical" href="https://dhanbyte.me" />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CSRTEPL9GN"
        ></script>
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

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TJBS3J62');
          `,
          }}
        />

        <link
          rel="icon"
          type="image/png"
          href="https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"
        />

        <title>MediaTools Pro – Free Online PDF, Image & Audio Tools</title>
        <meta
          name="description"
          content="All-in-one online toolset: PDF to JPG, Image Compressor, QR Generator, Voice Cleaner, and more – at dhanbyte.me"
        />
        <meta
          name="keywords"
          content="free pdf tools, image compressor, qr code generator, online tools, voice cleaner, text to image ai, pdf to jpg, compress image online, dhanbyte tools"
        />
        <meta
          property="og:image"
          content="https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"
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

        {children}
      </body>
    </html>
  );
}
