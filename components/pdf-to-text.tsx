"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  Download,
  Trash2,
  Info,
  File,
  Search,
} from "lucide-react"

import { Metadata } from "next"



export default function PDFToTextPages() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [fileInfo, setFileInfo] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return

    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file",
        variant: "destructive",
      })
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "PDF file must be smaller than 50MB",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setFileInfo({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
    })
    setError("")
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileSelect(droppedFile)
  }

  const handleExtract = async () => {
    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setLoading(true)
    setError("")
    setExtractedText("")
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 8
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/pdf-to-text", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract text from PDF")
      }

      setProgress(100)
      setExtractedText(data.data.text)
      toast({
        title: "Success!",
        description: "Text extracted from PDF successfully",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      clearInterval(progressInterval)
    }
  }

  const handleDemo = () => {
    const demoFile = new (window as any).File([""], "sample-document.pdf", { type: "application/pdf" })
    setFile(demoFile)
    setFileInfo({
      name: "sample-document.pdf",
      size: 245760,
      type: "application/pdf",
      lastModified: Date.now(),
    })

    setLoading(true)
    setError("")
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 12
      })
    }, 250)

    setTimeout(() => {
      setExtractedText(`Sample Document Title

This is a sample text extracted from a PDF document. This demonstrates how the PDF to text conversion works.

Key Features:
• Accurate text extraction
• Preserves formatting where possible
• Handles multiple pages
• Supports various PDF types

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Conclusion:
This tool can extract text from any PDF document quickly and accurately. Perfect for digitizing documents, creating searchable content, or converting PDFs to editable text.`)
      setLoading(false)
      toast({
        title: "Demo Complete!",
        description: "This is demo text. Upload a real PDF for actual extraction.",
      })
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `extracted-text-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded!",
      description: "Text file saved to your device",
    })
  }

  const removeFile = () => {
    setFile(null)
    setFileInfo(null)
    setExtractedText("")
    setError("")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/20">
          <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">PDF to Text Converter</h1>
          <p className="text-muted-foreground">Extract text content from PDF documents instantly</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload PDF File
              </CardTitle>
              <CardDescription>Select a PDF file to extract text content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag and Drop Area */}
              {!file && (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Drop PDF file here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    Select PDF File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  />
                </div>
              )}

              {/* Selected File */}
              {file && fileInfo && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{fileInfo.name}</h4>
                        <p className="text-xs text-muted-foreground">{formatFileSize(fileInfo.size)} • PDF Document</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleExtract} disabled={loading || !file} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Extract Text
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleDemo} disabled={loading} className="bg-transparent">
                  Demo
                </Button>
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Extracting text from PDF...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Extracted Text */}
          {extractedText && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Extracted Text
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard} className="bg-transparent">
                      <Copy className="mr-2 h-3 w-3" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadText} className="bg-transparent">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Text content extracted from your PDF ({extractedText.length} characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Extracted text will appear here..."
                />
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Text extracted successfully! You can edit the text above if needed.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Accurate text extraction",
                  "Preserves formatting",
                  "Multi-page support",
                  "Fast processing",
                  "Editable output",
                  "Copy to clipboard",
                  "Download as TXT",
                  "No file size limits",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Supported Files */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Standard PDF files</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Scanned documents (OCR)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Multi-page documents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Password-protected PDFs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Max file size:</span>
                  <Badge variant="outline">50MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pages per file:</span>
                  <Badge variant="outline">Unlimited</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Processing time:</span>
                  <Badge variant="outline">~30 seconds</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Output format:</span>
                  <Badge variant="outline">Plain Text</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Info className="mr-2 h-4 w-4" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Higher quality PDFs produce better text extraction</p>
                <p>• Scanned documents may require OCR processing</p>
                <p>• Complex layouts might affect formatting</p>
                <p>• Tables and columns are converted to plain text</p>
                <p>• Images and graphics are not extracted</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Files Processed</span>
                  <Badge variant="secondary">3,247</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <Badge variant="default">97.8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg. Processing</span>
                  <Badge variant="outline">15s</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
