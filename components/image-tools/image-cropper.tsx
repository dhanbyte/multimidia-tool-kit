"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { 
  Crop, Download, Upload, Square, Circle, Maximize2, Smartphone, 
  Monitor, Camera, RotateCw, RotateCcw, FlipHorizontal, FlipVertical,
  ZoomIn, ZoomOut, Move, RefreshCw, Eye, Scissors, Grid3X3
} from "lucide-react"
import { useDropzone } from "react-dropzone"

interface CropPreset {
  name: string
  ratio: number | null
  icon: any
  description: string
}

const cropPresets: CropPreset[] = [
  { name: "Free", ratio: null, icon: Maximize2, description: "Any ratio" },
  { name: "Square", ratio: 1, icon: Square, description: "1:1" },
  { name: "Portrait", ratio: 3/4, icon: Smartphone, description: "3:4" },
  { name: "Landscape", ratio: 4/3, icon: Monitor, description: "4:3" },
  { name: "Widescreen", ratio: 16/9, icon: Monitor, description: "16:9" },
  { name: "Photo", ratio: 3/2, icon: Camera, description: "3:2" },
]

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null)
  const [cropping, setCropping] = useState(false)
  
  // Crop area state
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null)
  const [finalCroppedImage, setFinalCroppedImage] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  
  // Transform states
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  
  // UI states
  const [showGrid, setShowGrid] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

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
      setPreview(e.target?.result as string)
      // Reset all states
      setCropArea({ x: 0, y: 0, width: 0, height: 0 })
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
      setZoom(1)
      setBrightness(100)
      setContrast(100)
      setSaturation(100)
    }
    reader.readAsDataURL(selectedFile)
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  const updateCroppedPreview = useCallback(() => {
    if (!preview || !previewCanvasRef.current || cropArea.width === 0) {
      setCroppedPreview(null)
      return
    }
    
    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = new Image()
    img.onload = () => {
      const scaleX = img.naturalWidth / img.width
      const scaleY = img.naturalHeight / img.height
      
      canvas.width = cropArea.width * scaleX
      canvas.height = cropArea.height * scaleY
      
      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      
      // Apply transformations
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.scale(zoom, zoom)
      
      ctx.drawImage(
        img,
        (cropArea.x * scaleX) - (canvas.width / 2),
        (cropArea.y * scaleY) - (canvas.height / 2),
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      )
      
      ctx.restore()
      setCroppedPreview(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.src = preview
  }, [preview, cropArea, rotation, flipH, flipV, zoom, brightness, contrast, saturation])

  useEffect(() => {
    updateCroppedPreview()
  }, [updateCroppedPreview])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return
    e.preventDefault()
    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if clicking on resize handles
    const handleSize = 8
    const handles = {
      'nw': { x: cropArea.x - handleSize, y: cropArea.y - handleSize },
      'ne': { x: cropArea.x + cropArea.width - handleSize, y: cropArea.y - handleSize },
      'sw': { x: cropArea.x - handleSize, y: cropArea.y + cropArea.height - handleSize },
      'se': { x: cropArea.x + cropArea.width - handleSize, y: cropArea.y + cropArea.height - handleSize },
      'n': { x: cropArea.x + cropArea.width/2 - handleSize, y: cropArea.y - handleSize },
      's': { x: cropArea.x + cropArea.width/2 - handleSize, y: cropArea.y + cropArea.height - handleSize },
      'w': { x: cropArea.x - handleSize, y: cropArea.y + cropArea.height/2 - handleSize },
      'e': { x: cropArea.x + cropArea.width - handleSize, y: cropArea.y + cropArea.height/2 - handleSize }
    }
    
    for (const [direction, handle] of Object.entries(handles)) {
      if (x >= handle.x && x <= handle.x + handleSize * 2 && 
          y >= handle.y && y <= handle.y + handleSize * 2) {
        setIsResizing(direction)
        setStartPoint({ x, y })
        return
      }
    }
    
    // Check if clicking inside existing crop area for dragging
    if (cropArea.width > 0 && 
        x >= cropArea.x && x <= cropArea.x + cropArea.width &&
        y >= cropArea.y && y <= cropArea.y + cropArea.height) {
      setIsDragging(true)
      setStartPoint({ x: x - cropArea.x, y: y - cropArea.y })
      return
    }
    
    // Start new selection
    setStartPoint({ x, y })
    setIsSelecting(true)
    setCropArea({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (isDragging) {
      // Drag existing crop area
      const newX = Math.max(0, Math.min(x - startPoint.x, rect.width - cropArea.width))
      const newY = Math.max(0, Math.min(y - startPoint.y, rect.height - cropArea.height))
      setCropArea(prev => ({ ...prev, x: newX, y: newY }))
      return
    }
    
    if (isResizing) {
      const deltaX = x - startPoint.x
      const deltaY = y - startPoint.y
      let newCrop = { ...cropArea }
      
      switch (isResizing) {
        case 'nw':
          newCrop.x = Math.max(0, cropArea.x + deltaX)
          newCrop.y = Math.max(0, cropArea.y + deltaY)
          newCrop.width = Math.max(10, cropArea.width - deltaX)
          newCrop.height = Math.max(10, cropArea.height - deltaY)
          break
        case 'ne':
          newCrop.y = Math.max(0, cropArea.y + deltaY)
          newCrop.width = Math.max(10, cropArea.width + deltaX)
          newCrop.height = Math.max(10, cropArea.height - deltaY)
          break
        case 'sw':
          newCrop.x = Math.max(0, cropArea.x + deltaX)
          newCrop.width = Math.max(10, cropArea.width - deltaX)
          newCrop.height = Math.max(10, cropArea.height + deltaY)
          break
        case 'se':
          newCrop.width = Math.max(10, cropArea.width + deltaX)
          newCrop.height = Math.max(10, cropArea.height + deltaY)
          break
        case 'n':
          newCrop.y = Math.max(0, cropArea.y + deltaY)
          newCrop.height = Math.max(10, cropArea.height - deltaY)
          break
        case 's':
          newCrop.height = Math.max(10, cropArea.height + deltaY)
          break
        case 'w':
          newCrop.x = Math.max(0, cropArea.x + deltaX)
          newCrop.width = Math.max(10, cropArea.width - deltaX)
          break
        case 'e':
          newCrop.width = Math.max(10, cropArea.width + deltaX)
          break
      }
      
      // Apply aspect ratio constraint if set
      if (selectedRatio && (isResizing === 'nw' || isResizing === 'ne' || isResizing === 'sw' || isResizing === 'se')) {
        if (newCrop.width / newCrop.height > selectedRatio) {
          newCrop.width = newCrop.height * selectedRatio
        } else {
          newCrop.height = newCrop.width / selectedRatio
        }
      }
      
      // Keep within bounds
      newCrop.x = Math.max(0, Math.min(newCrop.x, rect.width - newCrop.width))
      newCrop.y = Math.max(0, Math.min(newCrop.y, rect.height - newCrop.height))
      newCrop.width = Math.min(newCrop.width, rect.width - newCrop.x)
      newCrop.height = Math.min(newCrop.height, rect.height - newCrop.y)
      
      setCropArea(newCrop)
      return
    }
    
    if (!isSelecting) return
    
    let width = Math.abs(x - startPoint.x)
    let height = Math.abs(y - startPoint.y)
    
    // Apply aspect ratio constraint
    if (selectedRatio) {
      if (width / height > selectedRatio) {
        width = height * selectedRatio
      } else {
        height = width / selectedRatio
      }
    }
    
    setCropArea({
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width,
      height
    })
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
    setIsDragging(false)
    setIsResizing(null)
  }

  const applyPreset = (preset: CropPreset) => {
    setSelectedRatio(preset.ratio)
    if (preset.ratio && imageRef.current) {
      const img = imageRef.current
      const maxWidth = img.width * 0.8
      const maxHeight = img.height * 0.8
      
      let width = maxWidth
      let height = width / preset.ratio
      
      if (height > maxHeight) {
        height = maxHeight
        width = height * preset.ratio
      }
      
      setCropArea({
        x: (img.width - width) / 2,
        y: (img.height - height) / 2,
        width,
        height
      })
    }
  }

  const resetCrop = () => {
    setCropArea({ x: 0, y: 0, width: 0, height: 0 })
    setSelectedRatio(null)
  }

  const cropImage = () => {
    if (!file || !imageRef.current || !canvasRef.current || cropArea.width === 0) return
    
    setCropping(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imageRef.current
    
    if (!ctx) return
    
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    
    canvas.width = cropArea.width * scaleX
    canvas.height = cropArea.height * scaleY
    
    // Apply filters and transformations
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.scale(zoom, zoom)
    
    ctx.drawImage(
      img,
      (cropArea.x * scaleX) - (canvas.width / 2),
      (cropArea.y * scaleY) - (canvas.height / 2),
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    )
    
    ctx.restore()
    
    // Show result instead of downloading immediately
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setFinalCroppedImage(croppedDataUrl)
    setShowResult(true)
    setCropping(false)
    
    toast({ 
      title: "Crop Complete!", 
      description: `Image cropped to ${Math.round(cropArea.width * scaleX)}×${Math.round(cropArea.height * scaleY)} pixels` 
    })
  }
  
  const downloadCroppedImage = () => {
    if (!finalCroppedImage || !file) return
    
    const link = document.createElement("a")
    link.href = finalCroppedImage
    link.download = `cropped-${Math.round(cropArea.width)}x${Math.round(cropArea.height)}-${file.name}`
    link.click()
    
    toast({ title: "Downloaded!", description: "Cropped image saved to your device" })
  }
  
  const goBackToEdit = () => {
    setShowResult(false)
    setFinalCroppedImage(null)
  }
  
  const startNewCrop = () => {
    setShowResult(false)
    setFinalCroppedImage(null)
    setCropArea({ x: 0, y: 0, width: 0, height: 0 })
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    setZoom(1)
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
  }

  const getImageStyle = () => {
    return {
      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1}) scale(${zoom})`,
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
      transition: 'transform 0.2s ease, filter 0.2s ease'
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Image Cropper</h1>
        <p className="text-muted-foreground">Crop, rotate, flip and enhance your images with professional tools</p>
      </div>

      {/* Upload Section */}
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Image
          </CardTitle>
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
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Crop className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Ready for cropping and editing
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setFile(null); setPreview(null) }}>
                Change
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {file && preview && !showResult && (
        <>
          {/* Crop Presets */}
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scissors className="h-4 w-4" />
                Presets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {cropPresets.map((preset) => {
                  const Icon = preset.icon
                  return (
                    <Button
                      key={preset.name}
                      variant={selectedRatio === preset.ratio ? 'default' : 'outline'}
                      className="h-auto p-2 flex flex-col items-center gap-1 text-xs"
                      onClick={() => applyPreset(preset)}
                    >
                      <Icon className="h-3 w-3" />
                      <div className="text-center">
                        <div className="font-medium text-xs">{preset.name}</div>
                        <div className="text-xs text-muted-foreground opacity-75">{preset.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main Editor */}
          <div className="space-y-4 max-w-6xl mx-auto">
            {/* Image Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Crop className="h-4 w-4" />
                    Editor
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)} className="h-8 px-2">
                      <Grid3X3 className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetCrop} className="h-8 px-2">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative inline-block w-full max-w-full overflow-hidden border rounded-lg">
                  <img
                    ref={imageRef}
                    src={preview}
                    alt="Editor"
                    className="w-full max-w-full max-h-64 sm:max-h-80 object-contain cursor-crosshair"
                    style={getImageStyle()}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                    
                    {/* Crop Overlay */}
                    {cropArea.width > 0 && cropArea.height > 0 && (
                      <>
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />
                        
                        {/* Crop area */}
                        <div
                          className="absolute border-2 border-white shadow-lg cursor-move"
                          style={{
                            left: cropArea.x,
                            top: cropArea.y,
                            width: cropArea.width,
                            height: cropArea.height,
                            backgroundColor: 'transparent'
                          }}
                        >
                          {/* Grid lines */}
                          {showGrid && (
                            <>
                              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                                {Array.from({ length: 9 }).map((_, i) => (
                                  <div key={i} className="border border-white border-opacity-30" />
                                ))}
                              </div>
                            </>
                          )}
                          
                          {/* Draggable corner handles */}
                          <div 
                            className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('nw')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                          <div 
                            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('ne')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                          <div 
                            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('sw')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                          <div 
                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('se')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                          
                          {/* Edge handles */}
                          <div 
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-n-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('n')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                          <div 
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-s-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('s')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                          <div 
                            className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-w-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('w')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                          <div 
                            className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-e-resize shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setIsResizing('e')
                              setStartPoint({ x: e.clientX - imageRef.current!.getBoundingClientRect().left, y: e.clientY - imageRef.current!.getBoundingClientRect().top })
                            }}
                          />
                        </div>
                        
                        {/* Crop info */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                        </div>
                      </>
                    )}
                  </div>
                  
                <div className="mt-2 space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Drag to select • Move crop box • Use handles to resize
                  </p>
                  {cropArea.width > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>📐 {Math.round(cropArea.width)} × {Math.round(cropArea.height)}</span>
                      <span>📍 ({Math.round(cropArea.x)}, {Math.round(cropArea.y)})</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mobile-Friendly Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Transform Controls */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <RotateCw className="h-4 w-4" />
                    Transform
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <Button variant="outline" size="sm" onClick={() => setRotation(r => r - 90)} className="h-8 px-2 text-xs">
                      <RotateCcw className="h-3 w-3 mr-1" />↺
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setRotation(r => r + 90)} className="h-8 px-2 text-xs">
                      <RotateCw className="h-3 w-3 mr-1" />↻
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setFlipH(!flipH)} className="h-8 px-2 text-xs">
                      <FlipHorizontal className="h-3 w-3 mr-1" />↔
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setFlipV(!flipV)} className="h-8 px-2 text-xs">
                      <FlipVertical className="h-3 w-3 mr-1" />↕
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1 block">Zoom: {zoom.toFixed(1)}x</label>
                    <Slider
                      value={[zoom]}
                      onValueChange={([value]) => setZoom(value)}
                      min={0.5}
                      max={3}
                      step={0.1}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Brightness: {brightness}%</label>
                    <Slider
                      value={[brightness]}
                      onValueChange={([value]) => setBrightness(value)}
                      min={50}
                      max={150}
                      step={5}
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1 block">Contrast: {contrast}%</label>
                    <Slider
                      value={[contrast]}
                      onValueChange={([value]) => setContrast(value)}
                      min={50}
                      max={150}
                      step={5}
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1 block">Saturation: {saturation}%</label>
                    <Slider
                      value={[saturation]}
                      onValueChange={([value]) => setSaturation(value)}
                      min={0}
                      max={200}
                      step={10}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preview & Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scissors className="h-4 w-4" />
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {showPreview && croppedPreview && (
                    <div className="border rounded p-2 bg-muted/20">
                      <img
                        src={croppedPreview}
                        alt="Preview"
                        className="w-full max-h-24 object-contain rounded"
                      />
                    </div>
                  )}
                  
                  <Button 
                    onClick={cropImage} 
                    disabled={cropping || cropArea.width === 0} 
                    className="w-full h-10 text-sm bg-blue-600 hover:bg-blue-700"
                  >
                    {cropping ? (
                      <>
                        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Scissors className="mr-1 h-3 w-3" />
                        Crop Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
      
      {/* Cropped Result View */}
      {showResult && finalCroppedImage && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crop className="h-5 w-5 text-green-500" />
                Cropped Result
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={goBackToEdit} className="h-8 px-3 text-xs">
                  ← Edit
                </Button>
                <Button variant="outline" size="sm" onClick={startNewCrop} className="h-8 px-3 text-xs">
                  🔄 New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original vs Cropped */}
              <div className="space-y-4">
                <h3 className="font-medium text-center">Original Image</h3>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <img
                    src={preview}
                    alt="Original"
                    className="w-full max-h-64 object-contain rounded"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-center text-green-600">Cropped Result</h3>
                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                  <img
                    src={finalCroppedImage}
                    alt="Cropped Result"
                    className="w-full max-h-64 object-contain rounded"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                onClick={downloadCroppedImage}
                className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-sm"
              >
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
              <Button 
                variant="outline" 
                onClick={goBackToEdit}
                className="flex-1 h-10 text-sm"
              >
                ← Edit
              </Button>
              <Button 
                variant="outline" 
                onClick={startNewCrop}
                className="flex-1 h-10 text-sm"
              >
                🔄 New
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={previewCanvasRef} className="hidden" />
    </div>
  )
}