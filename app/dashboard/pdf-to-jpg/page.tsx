// app/dashboard/pdf-to-jpg/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  FileUp, // Upload icon
  FileImage, // Main icon for PDF to JPG
  Loader2, // Loading spinner
  Download, // Download icon
  ChevronRight, ChevronLeft, // Pagination icons
  RotateCcw, // Reset/Clear icon
  PanelTopClose, // To collapse pages (toggle all pages preview)
  Info, // For general info, also used for toggle text
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { Separator } from "@/components/ui/separator";

// Set the workerSrc for pdf.js
// Ensure pdf.worker.min.js is in your public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PdfToJpgConverterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<HTMLCanvasElement[]>([]); // Array of canvas elements
  const [currentPage, setCurrentPage] = useState(0); // For single page preview (0-indexed)
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // For initial PDF loading
  const [isConverting, setIsConverting] = useState(false); // For JPG conversion process
  const [quality, setQuality] = useState(0.9); // JPG Quality (0.1 - 1.0)
  const [dpi, setDpi] = useState(150); // DPI for rendering
  const [conversionStatus, setConversionStatus] = useState("");
  const [conversionProgress, setConversionProgress] = useState(0); // 0-100
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // Pages selected for conversion (1-indexed)
  const [showAllPagesPreview, setShowAllPagesPreview] = useState(false); // Toggle for all pages preview
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  // Handle file selection (from input or drag-drop)
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

  // Handle Drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow drop
  };

  // Load and render PDF pages onto canvases
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
        // Calculate viewport scale based on desired DPI (72 DPI is PDF's default)
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
        pagesToRender.push(canvas); // Store the rendered canvas
      }
      setPdfPages(pagesToRender);
      // Select all pages by default for conversion
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
      setSelectedFile(null); // Clear selected file on error
    } finally {
      setIsLoading(false);
    }
  }, [dpi, toast]); // Depend on dpi to re-render if DPI changes

  // Reload PDF if DPI or selectedFile changes
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
        : [...prev, pageNumber].sort((a, b) => a - b) // Keep pages sorted
    );
  };

  const handleSelectAllPages = () => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]); // Deselect all
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1)); // Select all
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

        // Use the pre-rendered canvas from pdfPages state
        const canvas = pdfPages[pageNumber - 1]; // Page numbers are 1-based, array is 0-based
        if (!canvas) {
            console.warn(`Canvas not found for page ${pageNumber}. Skipping.`);
            convertedCount++;
            continue;
        }

        const dataUrl = canvas.toDataURL("image/jpeg", quality); // Convert canvas to JPEG

        // Convert Data URL to Blob for JSZip
        const blob = await fetch(dataUrl).then(res => res.blob());

        zip.file(`${selectedFile.name.replace(/\.pdf$/, '')}_page_${pageNumber}.jpg`, blob);
        convertedCount++;
      }

      setConversionProgress(100);
      setConversionStatus("Creating zip file...");

      const content = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
      saveAs(content, `${selectedFile.name.replace(/\.pdf$/, '')}_converted_images.zip`);

      toast({
        title: "Conversion Complete!",
        description: "Your JPG images have been downloaded in a ZIP file.",
      });

    } catch (error) {
      console.error("Error converting PDF to JPG:", error);
      toast({
        title: "Conversion Failed",
        description: "An error occurred during conversion. Please try again. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setConversionStatus("");
    }
  };

  // Reset all states
  const handleClear = () => {
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
      fileInputRef.current.value = ""; // Clear file input
    }
    toast({
      title: "Cleared",
      description: "Converter has been reset.",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
            <FileImage className="h-8 w-8 text-blue-500" /> PDF to JPG Converter
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground mt-2">
            Convert your PDF documents into high-quality JPG images directly in your browser.
            All processing is done client-side, ensuring your privacy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* File Upload Section */}
          <div
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all dark:border-gray-700 dark:hover:bg-gray-800"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Drag & drop your PDF here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              ref={fileInputRef}
              className="hidden"
              disabled={isLoading || isConverting}
            />
          </div>

          {selectedFile && (
            <div className="flex justify-between items-center bg-muted p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <FileImage className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleClear} disabled={isLoading || isConverting}>
                <RotateCcw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-lg text-muted-foreground">Loading PDF pages...</p>
            </div>
          )}

          {pdfPages.length > 0 && !isLoading && (
            <>
              <Separator />
              {/* Conversion Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="quality" className="text-base font-semibold">JPG Quality (0.1 - 1.0)</Label>
                  <Input
                    id="quality"
                    type="number"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    disabled={isConverting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dpi" className="text-base font-semibold">Resolution / DPI</Label>
                  <select
                    id="dpi"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={dpi}
                    onChange={(e) => setDpi(parseInt(e.target.value))}
                    disabled={isConverting}
                  >
                    <option value={72}>72 DPI (Low)</option>
                    <option value={150}>150 DPI (Medium - Recommended)</option>
                    <option value={300}>300 DPI (High)</option>
                    <option value={600}>600 DPI (Very High)</option>
                  </select>
                </div>
              </div>

              {/* Page Selection */}
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Select Pages for Conversion</Label>
                  <Button
                    variant="outline"
                    onClick={handleSelectAllPages}
                    disabled={isConverting}
                    size="sm"
                  >
                    {selectedPages.length === totalPages ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-md bg-muted/20">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={selectedPages.includes(pageNumber) ? "default" : "outline"}
                      onClick={() => handlePageSelection(pageNumber)}
                      disabled={isConverting}
                      className={cn(
                        "w-12 h-10",
                        selectedPages.includes(pageNumber) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* PDF Preview */}
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                PDF Preview ({totalPages} pages)
                {totalPages > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAllPagesPreview(!showAllPagesPreview)}
                    className="ml-auto"
                    title={showAllPagesPreview ? "Show Single Page Preview" : "Show All Pages Preview"}
                  >
                    {showAllPagesPreview ? <PanelTopClose className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                  </Button>
                )}
              </h3>
              <div className="flex flex-col items-center space-y-4">
                {showAllPagesPreview ? (
                  // All pages preview
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full p-4 border rounded-lg bg-card shadow-inner max-h-[600px] overflow-y-auto">
                    {pdfPages.map((canvas, index) => (
                      <div key={index} className="border rounded-md p-2 shadow-sm bg-background flex flex-col items-center">
                        <span className="text-sm text-muted-foreground mb-2">Page {index + 1}</span>
                        {/* Render directly to an img tag for simplicity in all pages preview */}
                        {/* For better performance in large PDFs, consider lazy loading or virtualized lists */}
                        <img
                            src={canvas.toDataURL()}
                            alt={`PDF Page ${index + 1}`}
                            className="max-w-full h-auto border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single page preview
                  <>
                    {pdfPages[currentPage] && (
                        <img
                            src={pdfPages[currentPage].toDataURL()}
                            alt={`PDF Page ${currentPage + 1}`}
                            className="max-w-full h-auto border border-gray-200 dark:border-gray-700 shadow-lg rounded-md"
                        />
                    )}

                    {totalPages > 1 && (
                      <div className="flex items-center space-x-4 mt-4">
                        <Button
                          variant="outline"
                          onClick={handlePrevPage}
                          disabled={currentPage === 0 || isLoading || isConverting}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                        <span className="font-medium text-lg">
                          Page {currentPage + 1} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages - 1 || isLoading || isConverting}
                        >
                          Next <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Convert Button */}
              <Button
                onClick={convertPdfToJpg}
                className="w-full text-lg py-7 rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                disabled={isConverting || isLoading || selectedPages.length === 0}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" /> {conversionStatus} ({conversionProgress}%)
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-6 w-6" /> Convert & Download JPGs
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* How to Use Section */}
      <Card className="max-w-5xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">How to Use the PDF to JPG Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
            <li>
              **Upload Your PDF:** Click on the "Drag & drop your PDF here" area or drag your PDF file onto it.
            </li>
            <li>
              **PDF Preview:** Once uploaded, you'll see a preview of your PDF pages. You can navigate through pages or toggle to see all pages.
            </li>
            <li>
              **Adjust Settings (Optional):**
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>**JPG Quality:** Set the quality of the output JPG images (0.1 to 1.0, where 1.0 is highest).</li>
                <li>**Resolution / DPI:** Choose the DPI (Dots Per Inch) for the rendered images. Higher DPI means larger, higher-quality images.</li>
              </ul>
            </li>
            <li>
              **Select Pages:** By default, all pages are selected. Click on page numbers to select/deselect specific pages for conversion.
              You can also use "Select All" / "Deselect All" button.
            </li>
            <li>
              **Convert & Download:** Click the "<Download className="inline-block h-4 w-4 relative top-0.5" /> Convert & Download JPGs" button.
              The converted JPG images will be bundled into a `.zip` file and downloaded to your device.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// Label component (Assuming you have this in your shadcn setup or create it)
const Label = ({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>
      {children}
    </label>
  );