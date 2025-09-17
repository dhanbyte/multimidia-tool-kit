"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Upload, X } from "lucide-react"
import { PDFDocument } from "pdf-lib"

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    const pdfFiles = Array.from(selectedFiles).filter(file => file.type === "application/pdf")
    setFiles(prev => [...prev, ...pdfFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast({ title: "Error", description: "Please select at least 2 PDF files", variant: "destructive" })
      return
    }
    
    setLoading(true)
    try {
      const mergedPdf = await PDFDocument.create()
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
      
      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "merged-document.pdf"
      link.click()
      
      toast({ title: "Success!", description: "PDFs merged successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to merge PDFs", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Merge PDF Files
        </CardTitle>
        <CardDescription>Combine multiple PDF files into one</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Drop PDF files here</p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Select PDF Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Selected Files ({files.length})</h3>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <span className="text-sm">{file.name}</span>
                <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={mergePdfs} disabled={loading || files.length < 2} className="w-full">
              {loading ? "Merging..." : `Merge ${files.length} PDFs`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}