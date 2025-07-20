"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  Trash2,
  Eye,
  Info,
  FileImage,
  Cloud,
} from "lucide-react"



export default function ImageHostingPages() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const validFiles = Array.from(selectedFiles).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    setFiles((prev) => [...prev, ...validFiles])
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
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
  if (files.length === 0) {
    setError("Please select at least one image");
    return;
  }

  setLoading(true);
  setError("");
  setProgress(0);

  try {
    const uploadPromises = files.map(async (file, index) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      return {
        id: Date.now() + index,
        name: file.name,
        url: data.data?.url || "/placeholder.svg",
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      };
    });

    const results = await Promise.all(uploadPromises);
    setUploadedImages((prev) => [...prev, ...results]);
    setFiles([]);
    setProgress(100);

    toast({
      title: "Upload Complete",
      description: `${results.length} image(s) uploaded successfully`,
    });
  } catch (err: any) {
    setError(err.message || "Something went wrong");
    toast({
      title: "Upload Failed",
      description: err.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const handleDemo = () => {
    const demoImages = [
      {
        id: Date.now(),
        name: "demo-image-1.jpg",
        url: "/placeholder.svg?height=200&width=300",
        size: 245760,
        type: "image/jpeg",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: Date.now() + 1,
        name: "demo-image-2.png",
        url: "/placeholder.svg?height=200&width=300",
        size: 512000,
        type: "image/png",
        uploadedAt: new Date().toISOString(),
      },
    ]

    setUploadedImages((prev) => [...prev, ...demoImages])
    toast({
      title: "Demo Complete!",
      description: "Demo images added. Use real images for actual hosting.",
    })
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "Image URL copied to clipboard",
    })
  }

  const deleteImage = (id: number) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id))
    toast({
      title: "Deleted",
      description: "Image removed from hosting",
    })
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/20">
          <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Image Hosting</h1>
          <p className="text-muted-foreground">Upload images and get shareable URLs instantly</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="mr-2 h-5 w-5" />
                Upload Images
              </CardTitle>
              <CardDescription>Drag and drop images or click to select files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop images here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent">
                  <FileImage className="mr-2 h-4 w-4" />
                  Select Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files ({files.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {formatFileSize(file.size)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleUpload} disabled={loading || files.length === 0} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images ({files.length})
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
                    <span>Uploading images...</span>
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

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Hosted Images ({uploadedImages.length})
                </CardTitle>
                <CardDescription>Your uploaded images with shareable URLs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {uploadedImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button size="sm" variant="secondary" onClick={() => window.open(image.url, "_blank")}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => deleteImage(image.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{image.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {formatFileSize(image.size)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input value={image.url} readOnly className="text-xs h-8" />
                            <Button size="sm" onClick={() => copyToClipboard(image.url)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                  "Instant URL generation",
                  "Multiple format support",
                  "Drag & drop upload",
                  "Bulk image upload",
                  "Direct link sharing",
                  "No registration required",
                  "Fast CDN delivery",
                  "Secure hosting",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Supported Formats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">GIF</Badge>
                <Badge variant="secondary">WEBP</Badge>
                <Badge variant="secondary">BMP</Badge>
                <Badge variant="secondary">SVG</Badge>
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
                  <Badge variant="outline">10MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Files per upload:</span>
                  <Badge variant="outline">50</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Storage duration:</span>
                  <Badge variant="outline">Permanent</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Bandwidth:</span>
                  <Badge variant="outline">Unlimited</Badge>
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
                <p>• Optimize images before upload for faster loading</p>
                <p>• Use descriptive filenames for better organization</p>
                <p>• PNG for graphics, JPG for photos</p>
                <p>• Keep backup copies of important images</p>
                <p>• URLs are permanent and shareable</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
