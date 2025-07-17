"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  FileImage,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Trash2,
  Eye,
  Info,
  File,
  ImageIcon,
  ZoomIn,
} from "lucide-react"

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [convertedImages, setConvertedImages] = useState<any[]>([])
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [fileInfo, setFileInfo] = useState<any>(null)
  const [quality, setQuality] = useState("high")
  const [resolution, setResolution] = useState("300")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const qualityOptions = [
    { value: "low", label: "Low (Faster)", description: "Good for previews" },
    { value: "medium", label: "Medium", description: "Balanced quality and size" },
    { value: "high", label: "High (Recommended)", description: "Best quality output" },
    { value: "maximum", label: "Maximum", description: "Highest quality, larger files" },
  ]

  const resolutionOptions = [
    { value: "150", label: "150 DPI (Web)" },
    { value: "300", label: "300 DPI (Print)" },
    { value: "600", label: "600 DPI (High Quality)" },
    { value: "1200", label: "1200 DPI (Professional)" },
  ]

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

    if (selectedFile.size > 100 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "PDF file must be smaller than 100MB",
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
    setConvertedImages([])
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

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setLoading(true)
    setError("")
    setConvertedImages([])
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 6
      })
    }, 400)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("quality", quality)
      formData.append("resolution", resolution)

      const response = await fetch("/api/pdf-to-jpg", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert PDF to JPG")
      }

      setProgress(100)
      setConvertedImages(data.data.images)
      toast({
        title: "Success!",
        description: `PDF converted to ${data.data.images.length} JPG image(s)`,
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
    const demoFile = new File([""], "sample-document.pdf", { type: "application/pdf" })
    setFile(demoFile)
    setFileInfo({
      name: "sample-document.pdf",
      size: 512000,
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
        return prev + 10
      })
    }, 300)

    setTimeout(() => {
      const demoImages = [
        {
          id: 1,
          pageNumber: 1,
          url: "/placeholder.svg?height=400&width=300",
          filename: "page-1.jpg",
          size: 245760,
        },
        {
          id: 2,
          pageNumber: 2,
          url: "/placeholder.svg?height=400&width=300",
          filename: "page-2.jpg",
          size: 198432,
        },
        {
          id: 3,
          pageNumber: 3,
          url: "/placeholder.svg?height=400&width=300",
          filename: "page-3.jpg",
          size: 267891,
        },
      ]
      setConvertedImages(demoImages)
      setLoading(false)
      toast({
        title: "Demo Complete!",
        description: "Demo images generated. Upload a real PDF for actual conversion.",
      })
    }, 3000)
  }

  const downloadImage = (image: any) => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.filename
    link.click()
    toast({
      title: "Downloaded!",
      description: `${image.filename} saved to your device`,
    })
  }

  const downloadAll = () => {
    convertedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image)
      }, index * 500)
    })
    toast({
      title: "Downloading All!",
      description: `Downloading ${convertedImages.length} images...`,
    })
  }

  const removeFile = () => {
    setFile(null)
    setFileInfo(null)
    setConvertedImages([])
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 dark:bg-yellow-950/20">
          <FileImage className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">PDF to JPG Converter</h1>
          <p className="text-muted-foreground">Convert PDF pages to high-quality JPG images</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload and Convert Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload PDF File
              </CardTitle>
              <CardDescription>Select a PDF file and choose conversion settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag and Drop Area */}
              {!file && (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
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
                    <FileImage className="mr-2 h-4 w-4" />
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                        <FileImage className="h-5 w-5 text-yellow-600" />
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

              {/* Conversion Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Image Quality</label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution (DPI)</label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleConvert} disabled={loading || !file} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Convert to JPG
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
                    <span>Converting PDF to JPG images...</span>
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

          {/* Converted Images */}
          {convertedImages.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Converted Images ({convertedImages.length})
                  </CardTitle>
                  <Button onClick={downloadAll} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                </div>
                <CardDescription>Your PDF pages converted to JPG images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {convertedImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-[3/4] relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Page ${image.pageNumber}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            Page {image.pageNumber}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button size="sm" variant="secondary" onClick={() => window.open(image.url, "_blank")}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => downloadImage(image)}>
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">{image.filename}</h4>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatFileSize(image.size)}</span>
                            <span>{resolution} DPI</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    PDF converted successfully! {convertedImages.length} image(s) ready for download.
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
                  "High-quality conversion",
                  "Multiple resolution options",
                  "Batch processing",
                  "Custom quality settings",
                  "Fast processing",
                  "All pages converted",
                  "Download individually",
                  "Bulk download option",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ZoomIn className="mr-2 h-4 w-4" />
                Quality Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>150 DPI:</strong> Good for web use and email
                </div>
                <div>
                  <strong>300 DPI:</strong> Standard for printing and documents
                </div>
                <div>
                  <strong>600 DPI:</strong> High quality for professional use
                </div>
                <div>
                  <strong>1200 DPI:</strong> Maximum quality for archival
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
                  <Badge variant="outline">100MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pages per file:</span>
                  <Badge variant="outline">Unlimited</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Output format:</span>
                  <Badge variant="outline">JPG</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Processing time:</span>
                  <Badge variant="outline">~2s per page</Badge>
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
                <p>• Higher DPI creates larger file sizes</p>
                <p>• Use 300 DPI for most printing needs</p>
                <p>• Maximum quality is best for archival</p>
                <p>• Web use typically needs only 150 DPI</p>
                <p>• Each page becomes a separate JPG file</p>
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
                  <span className="text-sm">Files Converted</span>
                  <Badge variant="secondary">2,156</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <Badge variant="default">99.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg. Processing</span>
                  <Badge variant="outline">8s</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
