"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Image as ImageIcon, Download, Upload } from "lucide-react"

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [maintainRatio, setMaintainRatio] = useState(true)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
      
      // Get original dimensions
      const img = new Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainRatio && file) {
      const img = new Image()
      img.onload = () => {
        const ratio = img.height / img.width
        setHeight(Math.round(newWidth * ratio))
      }
      img.src = preview
    }
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
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `resized-${file.name}`
          link.click()
          toast({ title: "Success!", description: "Image resized and downloaded" })
        }
        setLoading(false)
      }, file.type)
    }
    img.src = preview
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Resizer
        </CardTitle>
        <CardDescription>Resize images to custom dimensions</CardDescription>
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
            <img src={preview} alt="Preview" className="max-w-full h-48 object-contain mx-auto border rounded" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Width (px)</label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (px)</label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="maintain-ratio"
                checked={maintainRatio}
                onChange={(e) => setMaintainRatio(e.target.checked)}
              />
              <label htmlFor="maintain-ratio" className="text-sm">Maintain aspect ratio</label>
            </div>
            
            <Button onClick={resizeImage} disabled={loading} className="w-full">
              {loading ? "Resizing..." : "Resize & Download"}
            </Button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}