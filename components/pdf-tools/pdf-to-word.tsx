"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Upload, Eye, FileDown, Share2, Copy, Trash2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import * as pdfjsLib from "pdfjs-dist"
import { ResultShare } from "@/components/result-share"

// Set PDF.js worker with proper error handling
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  } catch (error) {
    console.warn('PDF.js worker setup failed:', error)
  }
}

interface ConversionResult {
  text: string
  wordBlob: Blob
  fileName: string
  pageCount: number
  wordCount: number
}

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return
    
    if (selectedFile.type !== "application/pdf") {
      toast({ 
        title: "Invalid File Type", 
        description: "Please select a PDF file only", 
        variant: "destructive" 
      })
      return
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      toast({ 
        title: "File Too Large", 
        description: "Please select a PDF file smaller than 50MB", 
        variant: "destructive" 
      })
      return
    }
    
    setFile(selectedFile)
    setResult(null)
    setProgress(0)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const convertToWord = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (!file) return
    
    setLoading(true)
    setProgress(0)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      setProgress(10)
      
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      }).promise
      setProgress(20)
      
      let fullText = ""
      const totalPages = pdf.numPages
      
      for (let i = 1; i <= totalPages; i++) {
        try {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          
          // Better text extraction with formatting
          const pageText = textContent.items
            .map((item: any) => {
              if (item.str && item.str.trim()) {
                return item.str.trim()
              }
              return ''
            })
            .filter(text => text.length > 0)
            .join(' ')
          
          if (pageText.trim()) {
            fullText += `Page ${i}\n\n${pageText}\n\n`
          }
          
          setProgress(20 + (i / totalPages) * 60)
        } catch (pageError) {
          console.warn(`Error processing page ${i}:`, pageError)
          fullText += `Page ${i}\n\n[Error extracting text from this page]\n\n`
        }
      }
      
      if (!fullText.trim()) {
        toast({ 
          title: "No Text Found", 
          description: "This PDF appears to contain only images or no extractable text", 
          variant: "destructive" 
        })
        setLoading(false)
        return
      }
      
      setProgress(85)
      
      // Create proper Word document format
      const cleanText = fullText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      const wordContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Converted from PDF - ${file.name}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotPromptForConvert/>
      <w:DoNotShowInsertionsAndDeletions/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 1in; }
    p { margin: 0 0 12pt 0; text-align: justify; }
    h1, h2, h3 { margin: 12pt 0; font-weight: bold; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
${cleanText.split('\n').map((line, index) => {
  const trimmedLine = line.trim()
  if (!trimmedLine) return '<p>&nbsp;</p>'
  if (trimmedLine.startsWith('Page ') && index > 0) {
    return `<div class="page-break"><h3>${trimmedLine}</h3></div>`
  }
  return `<p>${trimmedLine.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
}).join('\n')}
</body>
</html>`
      
      const wordBlob = new Blob([wordContent], { 
        type: 'application/msword'
      })
      
      const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length
      
      setResult({
        text: cleanText,
        wordBlob,
        fileName: file.name.replace(/\.pdf$/i, '.doc'),
        pageCount: totalPages,
        wordCount
      })
      
      setProgress(100)
      
      toast({ 
        title: "Conversion Successful!", 
        description: `PDF converted to Word document with ${wordCount} words from ${totalPages} pages` 
      })
      
    } catch (error) {
      console.error('Conversion error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast({ 
        title: "Conversion Failed", 
        description: `Error: ${errorMessage}. Please try with a different PDF file.`, 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadWord = (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (!result) return
    
    try {
      const url = URL.createObjectURL(result.wordBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = result.fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({ 
        title: "Downloaded Successfully!", 
        description: `${result.fileName} saved to your device` 
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({ 
        title: "Download Failed", 
        description: "Failed to download the Word document", 
        variant: "destructive" 
      })
    }
  }

  const copyText = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (!result) return
    
    try {
      await navigator.clipboard.writeText(result.text)
      toast({ 
        title: "Copied Successfully!", 
        description: "Text copied to clipboard" 
      })
    } catch (error) {
      console.error('Copy error:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = result.text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      toast({ 
        title: "Copied!", 
        description: "Text copied to clipboard" 
      })
    }
  }

  const resetConverter = (e?: React.MouseEvent) => {
    e?.preventDefault()
    setFile(null)
    setResult(null)
    setProgress(0)
    setShowPreview(false)
    toast({ 
      title: "Reset Complete", 
      description: "Converter has been reset" 
    })
  }

  const togglePreview = (e?: React.MouseEvent) => {
    e?.preventDefault()
    setShowPreview(!showPreview)
  }

  // Initialize PDF.js worker on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
    }
  }, [])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">PDF to Word Converter</h1>
        <p className="text-muted-foreground">Convert PDF files to editable Word documents with text extraction</p>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Select a PDF file to convert to Word format. Supports text-based PDFs up to 50MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium text-primary">Drop the PDF file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag & drop PDF file here</p>
                <p className="text-muted-foreground mb-4">or click to select file</p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Select PDF File
                </Button>
              </div>
            )}
          </div>

          {/* Selected File Info */}
          {file && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        convertToWord(e)
                      }} 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <FileDown className="mr-2 h-4 w-4" />
                          Convert to Word
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.preventDefault()
                        resetConverter(e)
                      }}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {loading && (
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {progress < 20 ? 'Loading PDF...' : 
                         progress < 80 ? 'Extracting text...' : 
                         progress < 95 ? 'Creating Word document...' : 
                         'Finalizing...'}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Please wait while we convert your PDF to Word format
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Conversion Result */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Conversion Complete
                  </span>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {result.pageCount} pages
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {result.wordCount} words
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription className="text-green-600">
                  Your PDF has been successfully converted to Word format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault()
                      downloadWord(e)
                    }} 
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Word
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.preventDefault()
                      togglePreview(e)
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.preventDefault()
                      copyText(e)
                    }} 
                    className="flex-1 sm:flex-none"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Text
                  </Button>
                </div>

                {/* Share Component */}
                <div className="border-t pt-4">
                  <ResultShare 
                    title="PDF to Word Conversion"
                    result={result.text}
                    resultType="text"
                    toolName="PDF to Word Converter"
                  />
                </div>

                {/* Text Preview */}
                {showPreview && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Text Preview
                      </h4>
                      <Badge variant="outline">
                        {result.text.length > 2000 ? '2000' : result.text.length} / {result.text.length} characters
                      </Badge>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <Textarea
                        value={result.text.substring(0, 2000) + (result.text.length > 2000 ? '\n\n... (text truncated)' : '')}
                        readOnly
                        className="min-h-[400px] font-mono text-sm bg-background border-0 resize-none"
                        placeholder="Extracted text will appear here..."
                      />
                    </div>
                    {result.text.length > 2000 && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Showing first 2000 characters only. Download the Word document for complete text ({result.text.length.toLocaleString()} total characters).
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="bg-blue-100 dark:bg-blue-950/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">Smart Text Extraction</h3>
            <p className="text-sm text-muted-foreground">Advanced PDF parsing to extract text with proper formatting and structure</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="bg-green-100 dark:bg-green-950/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Download className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium mb-2">Word Compatible</h3>
            <p className="text-sm text-muted-foreground">Generate .doc files that open perfectly in Microsoft Word and other editors</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="bg-purple-100 dark:bg-purple-950/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Live Preview</h3>
            <p className="text-sm text-muted-foreground">Preview extracted text before downloading to ensure quality</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-950/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium mb-1">Upload PDF</p>
                <p className="text-muted-foreground">Select or drag your PDF file (max 50MB)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-950/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium mb-1">Convert</p>
                <p className="text-muted-foreground">Click convert and wait for processing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-950/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium mb-1">Preview</p>
                <p className="text-muted-foreground">Check extracted text quality</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 dark:bg-orange-950/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-semibold">4</span>
              </div>
              <div>
                <p className="font-medium mb-1">Download</p>
                <p className="text-muted-foreground">Save as editable Word document</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}