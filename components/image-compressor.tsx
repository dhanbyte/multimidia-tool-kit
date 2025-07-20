// app/dashboard/image-compressor/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react"; // Added useEffect for cleanup
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { Loader2, Download, Image as ImageIconLucide, XCircle, Trash2, UploadCloud } from "lucide-react"; // Added UploadCloud

interface ExtendedFile extends File {
  preview: string;
}

interface CompressedFile extends ExtendedFile {
  compressedSize: number;
  originalSize: number;
  id: string; // Unique ID for each file for easier management
}


export default function ImageCompressorPages() {
  const [files, setFiles] = useState<ExtendedFile[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));

    if (newImageFiles.length === 0) {
      toast({
        title: "Invalid File Type",
        description: "Please upload image files (e.g., JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    setFiles((prevFiles) => {
      const uniqueNewFiles = newImageFiles.filter(
        (newFile) => !prevFiles.some((prevFile) => prevFile.name === newFile.name && prevFile.size === newFile.size)
      );

      return [
        ...prevFiles,
        ...uniqueNewFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ];
      
    });
  




    toast({
      title: "Images Added",
      description: `${newImageFiles.length} image(s) ready for compression.`,
      variant: "default",
    });
  }, [toast]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
    multiple: true,
    noClick: true, // Disable click to open file dialog, so we can use a custom button
  });

  // Cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
      compressedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files, compressedFiles]);


  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No Images to Compress",
        description: "Please drag and drop or select images first.",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setCompressedFiles([]); // Clear previous compressed files
    setProgress(0);

    const compressed: CompressedFile[] = [];
    let completed = 0;

    for (const file of files) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (p: number) => {
            setProgress(Math.round(((completed + (p / 100)) / files.length) * 100));
          },
        };

        const compressedFileBlob = await imageCompression(file, options);
        const compressedFileWithPreview = Object.assign(compressedFileBlob, {
          preview: URL.createObjectURL(compressedFileBlob),
          compressedSize: compressedFileBlob.size,
          originalSize: file.size,
          name: file.name, // Ensure original name is carried over
          id: `${file.name}-${file.size}-${Date.now()}`, // Unique ID
        });
        compressed.push(compressedFileWithPreview as CompressedFile);
        completed++;
        setProgress(Math.round((completed / files.length) * 100));

      } catch (error) {
        console.error("Image compression error:", error);
        toast({
          title: "Compression Failed",
          description: `Failed to compress ${file.name}. Please try again.`,
          variant: "destructive",
        });
      }
    }

    setCompressedFiles(compressed);
    setIsCompressing(false);
    setProgress(100);

    if (compressed.length > 0) {
      toast({
        title: "Compression Complete",
        description: `${compressed.length} image(s) compressed successfully!`,
        variant: "default",
      });
    } else {
      toast({
        title: "No Images Compressed",
        description: "Please ensure you've uploaded valid image files.",
        variant: "default",
      });
    }
  };

  const handleDownloadAll = async () => {
    if (compressedFiles.length === 0) {
      toast({
        title: "No Files to Download",
        description: "Please compress images first.",
        variant: "default",
      });
      return;
    }

    if (compressedFiles.length === 1) {
      saveAs(compressedFiles[0], `compressed_${compressedFiles[0].name}`);
      toast({
        title: "Download Initiated",
        description: "Your compressed image is downloading.",
      });
      return;
    }

    const zip = new JSZip();
    compressedFiles.forEach((file) => {
      // Ensure the file is added with a unique name in case of duplicates
      zip.file(`compressed_${file.name}`, file);
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "compressed_images.zip");
      toast({
        title: "Download Initiated",
        description: "Your compressed images are downloading as a ZIP.",
      });
    } catch (error) {
      console.error("ZIP generation error:", error);
      toast({
        title: "Download Failed",
        description: "Could not create ZIP file for download.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => {
        if (file.name === fileName) {
            URL.revokeObjectURL(file.preview); // Revoke URL for the removed original file
            return false;
        }
        return true;
    }));
    setCompressedFiles(prev => prev.filter(file => {
        if (file.name === fileName) {
            URL.revokeObjectURL(file.preview); // Revoke URL for the removed compressed file
            return false;
        }
        return true;
    }));
    toast({
        title: "File Removed",
        description: `${fileName} has been removed.`,
    });
  };

  const handleReset = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    compressedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
    setCompressedFiles([]);
    setIsCompressing(false);
    setProgress(0);
    toast({
      title: "Reset Complete",
      description: "All files cleared.",
    });
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ImageIconLucide className="h-6 w-6 text-purple-600" /> Multi-Image Compressor
          </CardTitle>
          <CardDescription>Drag & Drop multiple images to compress them directly in your browser. Fast, free, and private!</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors duration-200 bg-muted/20"
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
            {files.length > 0 ? (
                <>
                    <p className="text-lg text-primary font-semibold">{files.length} file(s) selected.</p>
                    <p className="text-sm text-muted-foreground mt-1">Drag more files here or click to add more.</p>
                </>
            ) : (
                <>
                    <p className="text-lg text-muted-foreground font-semibold">Drag 'n' drop images here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click the button below to select files</p>
                </>
            )}

            <Button onClick={open} className="mt-6">
                Select Files
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Supports JPG, PNG, WebP, GIF. Max size ~20MB per image.</p>
          </div>

          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Selected Images ({files.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map((file, index) => {
                  const matchingCompressedFile = compressedFiles.find(cf => cf.name === file.name && cf.originalSize === file.size);
                  const savings = matchingCompressedFile ? (((file.size - matchingCompressedFile.compressedSize) / file.size) * 100).toFixed(1) : null;

                  return (
                    <Card key={index} className="relative p-4 flex flex-col items-center text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-red-500 hover:bg-red-500/10 z-10"
                        onClick={(e) => { e.stopPropagation(); handleRemoveFile(file.name); }}
                        title="Remove file"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                      
                      <div className="w-full flex justify-center mb-4">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-32 object-contain rounded-md border" // Use object-contain to fit, not crop
                          onLoad={() => URL.revokeObjectURL(file.preview)}
                        />
                      </div>
                      <p className="text-sm font-medium truncate w-full px-2">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Original: {formatBytes(file.size)}</p>

                      {matchingCompressedFile && (
                        <div className="mt-3 w-full">
                          <p className="text-xs text-muted-foreground">Compressed:</p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatBytes(matchingCompressedFile.compressedSize)}
                          </p>
                          {savings && savings !== "NaN" && (
                            <p className="text-xs font-bold text-blue-500 dark:text-blue-400 mt-1">
                              Saved: {savings}%
                            </p>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={handleCompress}
                  disabled={isCompressing || files.length === 0}
                  className="w-full sm:w-auto px-6 py-3 text-base"
                >
                  {isCompressing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isCompressing ? `Compressing (${progress}%)` : "Compress Images"}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isCompressing}
                  className="w-full sm:w-auto px-6 py-3 text-base"
                >
                  <Trash2 className="mr-2 h-5 w-5" /> Clear All
                </Button>
              </div>

              {isCompressing && files.length > 0 && (
                <div className="mt-6">
                  <Progress value={progress} className="w-full h-3" />
                  <p className="text-center text-sm text-muted-foreground mt-2">{progress}% Complete</p>
                </div>
              )}
            </div>
          )}

          {compressedFiles.length > 0 && !isCompressing && (
            <div className="mt-10 pt-6 border-t border-dashed">
              <h3 className="text-lg font-semibold mb-4">Download Compressed Images</h3>
              <div className="text-center">
                <Button onClick={handleDownloadAll} className="w-full sm:w-auto px-8 py-4 text-base">
                  <Download className="mr-2 h-5 w-5" /> Download All ({compressedFiles.length === 1 ? compressedFiles[0].name.split('.').pop()?.toUpperCase() || "File" : "ZIP"})
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Use Section */}
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Click the "Select Files" button or drag and drop your image files onto the designated area.</li>
            <li>Review your selected images. You can remove individual images if needed.</li>
            <li>Click the "Compress Images" button to start the optimization process.</li>
            <li>Observe the real-time progress.</li>
            <li>Once complete, compare the original and compressed sizes.</li>
            <li>Click "Download All" to save your optimized images (as a ZIP file if multiple, or individually).</li>
            <li>Use "Clear All" to reset the tool and start fresh.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}