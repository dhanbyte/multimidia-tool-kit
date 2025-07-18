// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/main-nav"; // सुनिश्चित करें कि यह इंपोर्ट हो
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediaTools Pro - All-in-One Media Toolkit",
  description: "Download videos, generate QR codes, convert files, and more - all in one powerful platform",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader /> {/* सुनिश्चित करें कि यह यहां रेंडर हो रहा है */}
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