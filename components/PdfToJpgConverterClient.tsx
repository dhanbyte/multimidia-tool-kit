// components/PdfToJpgConverterClient.tsx
"use client"; // यह आवश्यक है!

import { Loader2, FileUp, FileImage, Download, ChevronRight, ChevronLeft, RotateCcw, PanelTopClose, Info, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import * as pdfjsLib from "pdfjs-dist"; // *** pdfjs-dist अब यहाँ इम्पोर्ट किया जाएगा! ***
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { Separator } from "@/components/ui/separator";

// Set the workerSrc for pdf.js - इसे अब useEffect में रहने दें
// क्योंकि यह फ़ाइल पूरी तरह से क्लाइंट-साइड पर लोड होगी
// फिर भी सुरक्षा के लिए useEffect में रखना बेहतर है।

export default function PdfToJpgConverterClient() { // कंपोनेंट को डिफ़ॉल्ट रूप से एक्सपोर्ट करें
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<HTMLCanvasElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(0.9);
  const [dpi, setDpi] = useState(150);
  const [conversionStatus, setConversionStatus] = useState("");
  const [conversionProgress, setConversionProgress] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [showAllPagesPreview, setShowAllPagesPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  // workerSrc कॉन्फ़िगरेशन को useEffect में रखना जारी रखें
  useEffect(() => {
    if (typeof window !== 'undefined') { // यह सिर्फ अतिरिक्त सुरक्षा के लिए है
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }
  }, []);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (file.type === "application/pdf") {
      setSelectedFile(file);
      await loadPdf(file);
    } else {
      setSelectedFile(null);
      setPdfPages([]);
      setTotalPages(0);
      setCurrentPage(0);
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const loadPdf = useCallback(async (file: File) => {
    setIsLoading(true);
    setPdfPages([]);
    setCurrentPage(0);
    setTotalPages(0);
    setSelectedPages([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);

      const pagesToRender: HTMLCanvasElement[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: dpi / 72 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get 2D context from canvas");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
        pagesToRender.push(canvas);
      }
      setPdfPages(pagesToRender);
      setSelectedPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
      toast({
        title: "PDF Loaded",
        description: `${pdf.numPages} pages loaded successfully.`,
      });
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast({
        title: "Error Loading PDF",
        description: "Could not load the PDF file. Please ensure it's a valid PDF.",
        variant: "destructive",
      });
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  }, [dpi, toast]);

  useEffect(() => {
    if (selectedFile) {
      loadPdf(selectedFile);
    }
  }, [dpi, selectedFile, loadPdf]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handlePageSelection = (pageNumber: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  const handleSelectAllPages = () => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]);
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  };

  const convertPdfToJpg = async () => {
    if (!selectedFile || pdfPages.length === 0 || selectedPages.length === 0) {
      toast({
        title: "No PDF or Pages Selected",
        description: "Please load a PDF and select at least one page for conversion.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setConversionStatus("Starting conversion...");

    const zip = new JSZip();
    let convertedCount = 0;

    try {
      for (const pageNumber of selectedPages) {
        setConversionStatus(`Converting page ${pageNumber} of ${selectedPages.length}...`);
        setConversionProgress(Math.round((convertedCount / selectedPages.length) * 100));

        const canvas = pdfPages[pageNumber - 1];
        if (!canvas) {
            console.warn(`Canvas not found for page ${pageNumber}. Skipping.`);
            convertedCount++;
            continue;
        }

        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Convert base64 Data URL to Blob
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        zip.file(`${selectedFile.name.replace(/\.pdf$/, '')}_page_${pageNumber}.jpg`, blob);
        convertedCount++;
      }

      setConversionStatus("Generating ZIP file...");
      setConversionProgress(100);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${selectedFile.name.replace(/\.pdf$/, '')}_converted_images.zip`);

      toast({
        title: "Conversion Complete",
        description: `${convertedCount} pages converted to JPG and zipped.`,
      });

    } catch (error) {
      console.error("Error during JPG conversion:", error);
      toast({
        title: "Conversion Failed",
        description: "An error occurred during JPG conversion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setConversionStatus("");
      setConversionProgress(0);
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPdfPages([]);
    setCurrentPage(0);
    setTotalPages(0);
    setIsLoading(false);
    setIsConverting(false);
    setConversionStatus("");
    setConversionProgress(0);
    setSelectedPages([]);
    setShowAllPagesPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Cleared",
      description: "All loaded files and settings cleared.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 p-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary-foreground">PDF to JPG Converter</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Convert your PDF files into high-quality JPG images. Select pages, adjust quality and DPI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload/Drop Zone */}
        {!selectedFile ? (
          <div
            className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 dark:bg-gray-800 hover:border-blue-500 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drag & Drop your PDF here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <FileImage className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalPages} pages detected.
                </p>
              </div>
            </div>
            <Button onClick={clearAll} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-blue-500">Loading PDF... Please wait.</span>
          </div>
        )}

        {pdfPages.length > 0 && (
          <div className="space-y-6">
            <Separator />
            {/* Conversion Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quality" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  JPG Quality ({Math.round(quality * 100)}%)
                </label>
                <Input
                  id="quality"
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="dpi" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  DPI ({dpi})
                </label>
                <Input
                  id="dpi"
                  type="number"
                  min="50"
                  max="600"
                  step="50"
                  value={dpi}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setDpi(isNaN(val) ? 150 : Math.max(50, Math.min(600, val)));
                  }}
                  className="w-full"
                />
              </div>
            </div>

            {/* Page Selection */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Select Pages ({selectedPages.length}/{totalPages} selected)
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAllPages}
                            className={cn(
                                "text-xs",
                                selectedPages.length === totalPages && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            )}
                        >
                            {selectedPages.length === totalPages ? "Deselect All" : "Select All"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAllPagesPreview(prev => !prev)}
                            className="text-xs"
                        >
                            {showAllPagesPreview ? (
                                <>
                                    <PanelTopClose className="h-4 w-4 mr-1" /> Hide All Previews
                                </>
                            ) : (
                                <>
                                    <Info className="h-4 w-4 mr-1" /> Show All Previews
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Page Number Chips */}
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <Button
                            key={pageNumber}
                            variant={selectedPages.includes(pageNumber) ? "default" : "outline"}
                            size="sm"
                            className={cn(
                                "min-w-[40px] px-2 py-1 text-sm",
                                selectedPages.includes(pageNumber) ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100 dark:hover:bg-700"
                            )}
                            onClick={() => handlePageSelection(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Single Page Preview (if not showing all) */}
            {!showAllPagesPreview && (
                <div className="flex flex-col items-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Page Preview: {currentPage + 1} / {totalPages}</h3>
                <div className="flex items-center space-x-2">
                    <Button onClick={handlePrevPage} disabled={currentPage === 0 || isConverting}>
                    <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
                        {pdfPages[currentPage] && (
                            <img
                                src={pdfPages[currentPage].toDataURL("image/jpeg", 0.8)} // Lower quality for preview
                                alt={`Page ${currentPage + 1} preview`}
                                className="max-w-full h-auto max-h-[400px] object-contain"
                            />
                        )}
                    </div>
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1 || isConverting}>
                    <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
                </div>
            )}

            {/* All Pages Preview (if toggled) */}
            {showAllPagesPreview && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                    {pdfPages.map((canvas, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative border-2 rounded-md overflow-hidden cursor-pointer",
                                selectedPages.includes(index + 1) ? "border-blue-500 shadow-lg" : "border-gray-200 dark:border-gray-700"
                            )}
                            onClick={() => handlePageSelection(index + 1)}
                        >
                            <img
                                src={canvas.toDataURL("image/jpeg", 0.6)} // Even lower quality for thumbnails
                                alt={`Page ${index + 1} thumbnail`}
                                className="w-full h-auto object-contain"
                            />
                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {index + 1}
                            </div>
                            {selectedPages.includes(index + 1) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-30">
                                    <CheckCircle className="h-10 w-10 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}


            <Button
              onClick={convertPdfToJpg}
              disabled={isConverting || pdfPages.length === 0 || selectedPages.length === 0}
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-200"
            >
              {isConverting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Converting... ({conversionProgress}%)</span>
                </div>
              ) : (
                <>
                  <Download className="w-6 h-6 mr-2" /> Convert & Download JPGs
                </>
              )}
            </Button>
            {isConverting && conversionStatus && (
              <p className="text-center text-sm text-muted-foreground mt-2">{conversionStatus}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}