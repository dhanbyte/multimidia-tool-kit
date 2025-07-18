"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { ReloadIcon, DownloadIcon } from "@radix-ui/react-icons"; // Ensure you have this icon library installed

// If not installed, install: npm install @radix-ui/react-icons
// Or use a custom SVG icon

interface CompressedFile extends File {
  preview: string;
  compressedSize: number;
  originalSize: number;
}

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter out non-image files if any
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid File Type",
        description: "Please upload image files (e.g., JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    setFiles((prevFiles) => [
      ...prevFiles,
      ...imageFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [], // Optional: add GIF if you want to support it, though compression options might be limited
    },
    multiple: true,
  });

  const handleCompress = async () => {
    setIsCompressing(true);
    setCompressedFiles([]);
    setProgress(0);

    const compressed: CompressedFile[] = [];
    let completed = 0;

    for (const file of files) {
      try {
        const options = {
          maxSizeMB: 1, // (max file size in MB)
          maxWidthOrHeight: 1920, // max width or height in pixels
          useWebWorker: true, // Recommended for better performance
          onProgress: (p: number) => {
            // Update overall progress for all files
            setProgress(Math.round(((completed + (p / 100)) / files.length) * 100));
          },
          // mimeType: 'image/webp' // Optional: convert to WebP for better compression
        };

        const compressedFile = await imageCompression(file, options);
        Object.assign(compressedFile, {
          preview: URL.createObjectURL(compressedFile),
          compressedSize: compressedFile.size,
          originalSize: file.size,
        });
        compressed.push(compressedFile as CompressedFile);
        completed++;
        setProgress(Math.round((completed / files.length) * 100)); // Ensure progress reaches 100% for each file completion

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
        description: `${compressed.length} images compressed successfully!`,
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
        // If only one file, download directly
        saveAs(compressedFiles[0], `compressed_${compressedFiles[0].name}`);
        toast({
            title: "Download Initiated",
            description: "Your compressed image is downloading.",
        });
        return;
    }

    // If multiple, create a ZIP file
    const zip = new JSZip();
    compressedFiles.forEach((file) => {
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

  const handleReset = () => {
    files.forEach(file => URL.revokeObjectURL((file as any).preview));
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

  // Helper function to format file size
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
          <CardTitle className="text-2xl font-bold">Multi-Image Compressor</CardTitle>
          <CardDescription>Drag & Drop multiple images to compress them directly in your browser. Fast, free, and private!</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors duration-200"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-lg text-primary">Drop the images here ...</p>
            ) : (
              <p className="text-lg text-muted-foreground">Drag 'n' drop some images here, or click to select files</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">Supports JPG, PNG, WebP, GIF</p>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Files to Compress ({files.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <Card key={index} className="flex flex-col items-center p-2 text-center">
                    <img
                      src={(file as any).preview}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-md mb-2"
                      onLoad={() => URL.revokeObjectURL((file as any).preview)}
                    />
                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={handleCompress}
                  disabled={isCompressing || files.length === 0}
                  className="w-full sm:w-auto"
                >
                  {isCompressing && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  {isCompressing ? `Compressing (${progress}%)` : "Compress Images"}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isCompressing && progress < 100}
                  className="w-full sm:w-auto"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {isCompressing && files.length > 0 && (
            <div className="mt-6">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground mt-2">{progress}% Complete</p>
            </div>
          )}

          {compressedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Compressed Files ({compressedFiles.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {compressedFiles.map((file, index) => (
                  <Card key={index} className="flex flex-col items-center p-2 text-center">
                    <img
                      src={file.preview}
                      alt={`Compressed ${file.name}`}
                      className="w-full h-24 object-cover rounded-md mb-2"
                      onLoad={() => URL.revokeObjectURL(file.preview)}
                    />
                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Original: {formatBytes(file.originalSize)}
                    </p>
                    <p className="text-xs text-green-600 font-semibold">
                      Compressed: {formatBytes(file.compressedSize)}
                    </p>
                    <p className="text-xs text-blue-500">
                      Savings: {(((file.originalSize - file.compressedSize) / file.originalSize) * 100).toFixed(1)}%
                    </p>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button onClick={handleDownloadAll} className="w-full sm:w-auto">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download All ({compressedFiles.length === 1 ? compressedFiles[0].name : "ZIP"})
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}