"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Crop, Download, Upload } from "lucide-react"

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [cropping, setCropping] = useState(false)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" })
      return
    }
    
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setStartPoint({ x, y })
    setIsSelecting(true)
    setCropArea({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setCropArea({
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y)
    })
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const cropImage = () => {
    if (!file || !imageRef.current || !canvasRef.current) return
    
    setCropping(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imageRef.current
    
    if (!ctx) return
    
    // Calculate scale factors
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    
    // Set canvas size to crop area
    canvas.width = cropArea.width * scaleX
    canvas.height = cropArea.height * scaleY
    
    // Draw cropped image
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `cropped-${file.name}`
        link.click()
        toast({ title: "Success!", description: "Image cropped and downloaded" })
      }
      setCropping(false)
    }, file.type)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crop className="h-5 w-5" />
          Image Cropper
        </CardTitle>
        <CardDescription>Crop images by selecting an area</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Drop image here</p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Select Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />
        </div>
        
        {preview && (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={preview}
                alt="Preview"
                className="max-w-full h-auto border rounded cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              {cropArea.width > 0 && cropArea.height > 0 && (
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                  }}
                />
              )}
            </div>
            
            <p className="text-sm text-gray-600">
              Click and drag to select the area you want to crop
            </p>
            
            <Button 
              onClick={cropImage} 
              disabled={cropping || cropArea.width === 0} 
              className="w-full"
            >
              {cropping ? "Cropping..." : "Crop & Download"}
            </Button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}