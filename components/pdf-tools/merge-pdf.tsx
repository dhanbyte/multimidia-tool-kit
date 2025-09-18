"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Upload, X, Eye, RefreshCw, CheckCircle, Plus } from "lucide-react"
import { PDFDocument } from "pdf-lib"
import { useDropzone } from "react-dropzone"

interface PdfFile {
  file: File
  pages: number
  preview?: string
}

export default function MergePdf() {
  const [pdf1, setPdf1] = useState<PdfFile | null>(null)
  const [pdf2, setPdf2] = useState<PdfFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mergedPdf, setMergedPdf] = useState<Blob | null>(null)
  const { toast } = useToast()

  const getPdfInfo = async (file: File): Promise<PdfFile> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    return {
      file,
      pages: pdf.getPageCount()
    }
  }

  const onDrop1 = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || file.type !== "application/pdf") {
      toast({ title: "Invalid File", description: "Please select a PDF file", variant: "destructive" })
      return
    }
    try {
      const pdfInfo = await getPdfInfo(file)
      setPdf1(pdfInfo)
      setMergedPdf(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load PDF", variant: "destructive" })
    }
  }, [])

  const onDrop2 = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || file.type !== "application/pdf") {
      toast({ title: "Invalid File", description: "Please select a PDF file", variant: "destructive" })
      return
    }
    try {
      const pdfInfo = await getPdfInfo(file)
      setPdf2(pdfInfo)
      setMergedPdf(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load PDF", variant: "destructive" })
    }
  }, [])

  const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive: isDragActive1 } = useDropzone({
    onDrop: onDrop1,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  const { getRootProps: getRootProps2, getInputProps: getInputProps2, isDragActive: isDragActive2 } = useDropzone({
    onDrop: onDrop2,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  const mergePdfs = async () => {
    if (!pdf1 || !pdf2) {
      toast({ title: "Error", description: "Please select both PDF files", variant: "destructive" })
      return
    }
    
    setLoading(true)
    setProgress(0)
    
    try {
      const mergedPdf = await PDFDocument.create()
      setProgress(20)
      
      // Load first PDF
      const arrayBuffer1 = await pdf1.file.arrayBuffer()
      const pdfDoc1 = await PDFDocument.load(arrayBuffer1)
      setProgress(40)
      
      // Load second PDF
      const arrayBuffer2 = await pdf2.file.arrayBuffer()
      const pdfDoc2 = await PDFDocument.load(arrayBuffer2)
      setProgress(60)
      
      // Copy pages from first PDF
      const pages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices())
      pages1.forEach((page) => mergedPdf.addPage(page))
      setProgress(80)
      
      // Copy pages from second PDF
      const pages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices())
      pages2.forEach((page) => mergedPdf.addPage(page))
      setProgress(90)
      
      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      setMergedPdf(blob)
      setProgress(100)
      
      toast({ title: "Success!", description: `PDFs merged successfully! Total pages: ${pdf1.pages + pdf2.pages}` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to merge PDFs", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const downloadMerged = () => {
    if (!mergedPdf) return
    const url = URL.createObjectURL(mergedPdf)
    const link = document.createElement("a")
    link.href = url
    link.download = `merged-${pdf1?.file.name.replace('.pdf', '')}-${pdf2?.file.name.replace('.pdf', '')}.pdf`
    link.click()
    URL.revokeObjectURL(url)
    toast({ title: "Downloaded!", description: "Merged PDF saved to your device" })
  }

  const reset = () => {
    setPdf1(null)
    setPdf2(null)
    setMergedPdf(null)
    setProgress(0)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Merge PDF Files</h1>
        <p className="text-muted-foreground">Combine two PDF files into one document</p>
      </div>

      {/* Upload Boxes */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* First PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-950/20 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              First PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!pdf1 ? (
              <div
                {...getRootProps1()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive1 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-muted-foreground/25 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps1()} />
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Drop PDF here</p>
                <p className="text-sm text-muted-foreground mb-3">or click to select</p>
                <Button variant="outline" size="sm">
                  Select PDF
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{pdf1.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(pdf1.file.size / (1024 * 1024)).toFixed(2)} MB • {pdf1.pages} pages
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setPdf1(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Second PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="bg-green-100 dark:bg-green-950/20 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">2</span>
              </div>
              Second PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!pdf2 ? (
              <div
                {...getRootProps2()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive2 ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-muted-foreground/25 hover:border-green-400'
                }`}
              >
                <input {...getInputProps2()} />
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Drop PDF here</p>
                <p className="text-sm text-muted-foreground mb-3">or click to select</p>
                <Button variant="outline" size="sm">
                  Select PDF
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{pdf2.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(pdf2.file.size / (1024 * 1024)).toFixed(2)} MB • {pdf2.pages} pages
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setPdf2(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Merge Section */}
      {pdf1 && pdf2 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ready to Merge
            </CardTitle>
            <CardDescription>
              Combine {pdf1.file.name} ({pdf1.pages} pages) + {pdf2.file.name} ({pdf2.pages} pages)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-950/20 rounded-full w-10 h-10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Merged Document</p>
                  <p className="text-sm text-muted-foreground">
                    Total: {pdf1.pages + pdf2.pages} pages
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={mergePdfs} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Merge PDFs
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={reset}>
                  Reset
                </Button>
              </div>
            </div>
            
            {loading && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Merging PDFs...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Download Section */}
      {mergedPdf && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Merge Complete!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your PDFs have been successfully merged
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-950/20 rounded-full w-10 h-10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    merged-{pdf1?.file.name.replace('.pdf', '')}-{pdf2?.file.name.replace('.pdf', '')}.pdf
                  </p>
                  <p className="text-sm text-green-600">
                    {pdf1 && pdf2 ? pdf1.pages + pdf2.pages : 0} pages combined
                  </p>
                </div>
              </div>
              <Button onClick={downloadMerged} className="bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}