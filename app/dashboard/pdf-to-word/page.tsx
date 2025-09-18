import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import PdfToWord from "@/components/pdf-tools/pdf-to-word"

export const metadata: Metadata = {
  title: "PDF to Word Converter - Free Online Tool | MediaTools Pro",
  description: "Convert PDF files to editable Word documents online. Extract text from PDF and download as DOC file. Fast, secure, and completely free.",
  keywords: "pdf to word, pdf to doc, convert pdf to word, pdf converter, extract text from pdf, pdf to docx",
}

export default function PdfToWordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">PDF to Word Converter</h1>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <PdfToWord />
      </main>
    </div>
  )
}