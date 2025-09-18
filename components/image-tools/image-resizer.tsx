"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Image as ImageIcon, Download, Upload, Smartphone, Monitor, Camera, Instagram, Facebook, Twitter, Youtube, RefreshCw, Link2, Unlink2, Maximize2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface PresetSize {
  name: string
  width: number
  height: number
  icon: any
  category: string
  description: string
}

const presetSizes: PresetSize[] = [
  // Social Media
  { name: "Instagram Post", width: 1080, height: 1080, icon: Instagram, category: "Social", description: "Square post" },
  { name: "Instagram Story", width: 1080, height: 1920, icon: Instagram, category: "Social", description: "Vertical story" },
  { name: "Facebook Cover", width: 1200, height: 630, icon: Facebook, category: "Social", description: "Cover photo" },
  { name: "Twitter Header", width: 1500, height: 500, icon: Twitter, category: "Social", description: "Profile banner" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, icon: Youtube, category: "Social", description: "Video thumbnail" },
  
  // Common Sizes
  { name: "HD (720p)", width: 1280, height: 720, icon: Monitor, category: "Standard", description: "High definition" },
  { name: "Full HD (1080p)", width: 1920, height: 1080, icon: Monitor, category: "Standard", description: "Full HD" },
  { name: "4K UHD", width: 3840, height: 2160, icon: Monitor, category: "Standard", description: "Ultra HD" },
  
  // Mobile
  { name: "iPhone 14", width: 1179, height: 2556, icon: Smartphone, category: "Mobile", description: "iPhone screen" },
  { name: "Android HD", width: 1080, height: 1920, icon: Smartphone, category: "Mobile", description: "Android screen" },
  
  // Print
  { name: "A4 (300 DPI)", width: 2480, height: 3508, icon: Camera, category: "Print", description: "Print quality" },
  { name: "Letter (300 DPI)", width: 2550, height: 3300, icon: Camera, category: "Print", description: "US Letter" },
]

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [resizedPreview, setResizedPreview] = useState<string | null>(null)
  const [originalWidth, setOriginalWidth] = useState<number>(0)
  const [originalHeight, setOriginalHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [maintainRatio, setMaintainRatio] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("Social")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const updatePreview = useCallback(() => {
    if (!preview || !previewCanvasRef.current) return
    
    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = new Image()
    img.onload = () => {
      const maxPreviewSize = 300
      let previewWidth = width
      let previewHeight = height
      
      if (width > maxPreviewSize || height > maxPreviewSize) {
        const ratio = Math.min(maxPreviewSize / width, maxPreviewSize / height)
        previewWidth = width * ratio
        previewHeight = height * ratio
      }
      
      canvas.width = previewWidth
      canvas.height = previewHeight
      
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, previewWidth, previewHeight)
      
      setResizedPreview(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.src = preview
  }, [preview, width, height])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return
    
    if (!selectedFile.type.startsWith('image/')) {
      toast({ title: "Invalid File", description: "Please select an image file", variant: "destructive" })
      return
    }
    
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      
      const img = new Image()
      img.onload = () => {
        setOriginalWidth(img.width)
        setOriginalHeight(img.height)
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = result
    }
    reader.readAsDataURL(selectedFile)
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainRatio && originalWidth && originalHeight) {
      const ratio = originalHeight / originalWidth
      setHeight(Math.round(newWidth * ratio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainRatio && originalWidth && originalHeight) {
      const ratio = originalWidth / originalHeight
      setWidth(Math.round(newHeight * ratio))
    }
  }

  // Update preview when dimensions change
  useEffect(() => {
    updatePreview()
  }, [width, height, updatePreview])

  const applyPreset = (preset: PresetSize) => {
    setWidth(preset.width)
    setHeight(preset.height)
    setMaintainRatio(false) // Disable ratio when using presets
  }

  const resetToOriginal = () => {
    setWidth(originalWidth)
    setHeight(originalHeight)
  }

  const resizeImage = () => {
    if (!file || !canvasRef.current) return
    
    setLoading(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    const img = new Image()
    img.onload = () => {
      canvas.width = width
      canvas.height = height
      
      // High quality resize
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `resized-${width}x${height}-${file.name}`
          link.click()
          URL.revokeObjectURL(url)
          toast({ 
            title: "Success!", 
            description: `Image resized to ${width}×${height} and downloaded` 
          })
        }
        setLoading(false)
      }, 'image/jpeg', 0.9)
    }
    img.src = preview
  }

  const categories = [...new Set(presetSizes.map(p => p.category))]
  const filteredPresets = presetSizes.filter(p => p.category === selectedCategory)

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Resizer</h1>
        <p className="text-muted-foreground">Resize images to custom dimensions or use popular presets</p>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload Image
          </CardTitle>
          <CardDescription>Select an image to resize</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-muted-foreground/25 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop image here...' : 'Drag & drop image here'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Original: {originalWidth} × {originalHeight} px
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setFile(null); setPreview(null); setResizedPreview(null) }}>
                  Change
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h4 className="text-sm font-medium mb-2 text-center">Original</h4>
                  {preview && (
                    <img 
                      src={preview} 
                      alt="Original" 
                      className="max-w-full max-h-48 object-contain mx-auto border rounded" 
                    />
                  )}
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {originalWidth} × {originalHeight} px
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="text-sm font-medium mb-2 text-center text-blue-600">Resized Preview</h4>
                  {resizedPreview ? (
                    <img 
                      src={resizedPreview} 
                      alt="Resized Preview" 
                      className="max-w-full max-h-48 object-contain mx-auto border rounded" 
                    />
                  ) : preview ? (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      <RefreshCw className="h-8 w-8 animate-spin" />
                    </div>
                  ) : null}
                  <p className="text-xs text-center text-blue-600 mt-2">
                    {width} × {height} px
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {file && (
        <>
          {/* Preset Sizes */}
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Maximize2 className="h-5 w-5" />
                Popular Sizes
              </CardTitle>
              <CardDescription>Choose from common image dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPresets.map((preset) => {
                  const Icon = preset.icon
                  return (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto p-3 flex items-center gap-3 justify-start"
                      onClick={() => applyPreset(preset)}
                    >
                      <Icon className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {preset.width} × {preset.height}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {preset.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Custom Dimensions */}
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Custom Dimensions</CardTitle>
              <CardDescription>Set your own width and height</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width (pixels)</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      min="1"
                      max="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (pixels)</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      min="1"
                      max="10000"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Preview Size</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {width} × {height}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Aspect ratio: {(width / height).toFixed(2)}:1
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {maintainRatio ? <Link2 className="h-4 w-4" /> : <Unlink2 className="h-4 w-4" />}
                      <span className="text-sm font-medium">Maintain aspect ratio</span>
                    </div>
                    <Switch
                      checked={maintainRatio}
                      onCheckedChange={setMaintainRatio}
                    />
                  </div>
                  
                  <Button variant="outline" onClick={resetToOriginal} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset to Original
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={resizeImage} 
                disabled={loading} 
                className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Resizing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Resize & Download
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={previewCanvasRef} className="hidden" />
    </div>
  )
}