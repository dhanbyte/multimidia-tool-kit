"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Upload } from "lucide-react"
import * as pdfjsLib from "pdfjs-dist"

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return
    if (selectedFile.type !== "application/pdf") {
      toast({ title: "Error", description: "Please select a PDF file", variant: "destructive" })
      return
    }
    setFile(selectedFile)
  }

  const convertToWord = async () => {
    if (!file) return
    
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")
        fullText += pageText + "\n\n"
      }
      
      setExtractedText(fullText)
      
      // Create Word-like document
      const blob = new Blob([fullText], { type: "application/msword" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${file.name.replace('.pdf', '')}.doc`
      link.click()
      
      toast({ title: "Success!", description: "PDF converted to Word document" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to convert PDF", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF to Word Converter
        </CardTitle>
        <CardDescription>Convert PDF files to Word documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Drop PDF file here</p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Select PDF File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />
        </div>
        
        {file && (
          <div className="flex items-center justify-between p-4 border rounded">
            <span>{file.name}</span>
            <Button onClick={convertToWord} disabled={loading}>
              {loading ? "Converting..." : "Convert to Word"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}