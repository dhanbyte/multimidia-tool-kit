'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Type, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

export default function PDFWatermark() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [position, setPosition] = useState('center');
  const [opacity, setOpacity] = useState([50]);
  const [fontSize, setFontSize] = useState([24]);
  const [rotation, setRotation] = useState([0]);
  const [processing, setProcessing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setWatermarkImage(file);
    } else {
      toast.error('Please select an image file');
    }
  };

  const getPositionCoordinates = (pageWidth: number, pageHeight: number, watermarkWidth: number, watermarkHeight: number) => {
    const margin = 20;
    switch (position) {
      case 'top-left':
        return { x: margin, y: pageHeight - watermarkHeight - margin };
      case 'top-center':
        return { x: (pageWidth - watermarkWidth) / 2, y: pageHeight - watermarkHeight - margin };
      case 'top-right':
        return { x: pageWidth - watermarkWidth - margin, y: pageHeight - watermarkHeight - margin };
      case 'center-left':
        return { x: margin, y: (pageHeight - watermarkHeight) / 2 };
      case 'center':
        return { x: (pageWidth - watermarkWidth) / 2, y: (pageHeight - watermarkHeight) / 2 };
      case 'center-right':
        return { x: pageWidth - watermarkWidth - margin, y: (pageHeight - watermarkHeight) / 2 };
      case 'bottom-left':
        return { x: margin, y: margin };
      case 'bottom-center':
        return { x: (pageWidth - watermarkWidth) / 2, y: margin };
      case 'bottom-right':
        return { x: pageWidth - watermarkWidth - margin, y: margin };
      default:
        return { x: (pageWidth - watermarkWidth) / 2, y: (pageHeight - watermarkHeight) / 2 };
    }
  };

  const addWatermark = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      toast.error('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      toast.error('Please select a watermark image');
      return;
    }

    setProcessing(true);
    try {
      const pdfBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      let imageBytes: Uint8Array | undefined;
      let embeddedImage: any;

      if (watermarkType === 'image' && watermarkImage) {
        imageBytes = new Uint8Array(await watermarkImage.arrayBuffer());
        if (watermarkImage.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else if (watermarkImage.type === 'image/jpeg' || watermarkImage.type === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else {
          toast.error('Unsupported image format. Please use PNG or JPEG.');
          return;
        }
      }

      pages.forEach((page) => {
        const { width, height } = page.getSize();

        if (watermarkType === 'text') {
          const textWidth = watermarkText.length * (fontSize[0] * 0.6);
          const textHeight = fontSize[0];
          const coords = getPositionCoordinates(width, height, textWidth, textHeight);

          page.drawText(watermarkText, {
            x: coords.x,
            y: coords.y,
            size: fontSize[0],
            color: rgb(0.5, 0.5, 0.5),
            opacity: opacity[0] / 100,
            rotate: degrees(rotation[0]),
          });
        } else if (watermarkType === 'image' && embeddedImage) {
          const imageWidth = Math.min(width * 0.3, 200);
          const imageHeight = (embeddedImage.height / embeddedImage.width) * imageWidth;
          const coords = getPositionCoordinates(width, height, imageWidth, imageHeight);

          page.drawImage(embeddedImage, {
            x: coords.x,
            y: coords.y,
            width: imageWidth,
            height: imageHeight,
            opacity: opacity[0] / 100,
            rotate: degrees(rotation[0]),
          });
        }
      });

      const watermarkedPdfBytes = await pdfDoc.save();
      const blob = new Blob([watermarkedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name.replace('.pdf', '_watermarked.pdf');
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Watermark added successfully!');
    } catch (error) {
      console.error('Error adding watermark:', error);
      toast.error('Failed to add watermark');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Watermark Tool</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add Watermark to PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PDF Upload */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{selectedFile ? selectedFile.name : 'Upload PDF file'}</p>
            </label>
          </div>

          {/* Watermark Type Selection */}
          <Tabs value={watermarkType} onValueChange={(value) => setWatermarkType(value as 'text' | 'image')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text Watermark
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image/Logo Watermark
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Watermark Text</label>
                <Input
                  placeholder="Enter watermark text..."
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Font Size: {fontSize[0]}px</label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={72}
                  min={8}
                  step={1}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  <Image className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">{watermarkImage ? watermarkImage.name : 'Upload Logo/Image'}</p>
                </label>
              </div>
            </TabsContent>
          </Tabs>

          {/* Position Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Position</label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-center">Top Center</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="center-left">Center Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="center-right">Center Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Opacity: {opacity[0]}%</label>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rotation: {rotation[0]}°</label>
              <Slider
                value={rotation}
                onValueChange={setRotation}
                max={360}
                min={0}
                step={15}
                className="w-full"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Preview</div>
            <div className="relative w-full h-40 bg-white border rounded overflow-hidden">
              {watermarkType === 'text' && watermarkText && (
                <div 
                  className={`absolute text-gray-400 font-bold select-none pointer-events-none whitespace-nowrap
                    ${position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
                    ${position === 'top-left' ? 'top-2 left-2' : ''}
                    ${position === 'top-center' ? 'top-2 left-1/2 transform -translate-x-1/2' : ''}
                    ${position === 'top-right' ? 'top-2 right-2' : ''}
                    ${position === 'center-left' ? 'top-1/2 left-2 transform -translate-y-1/2' : ''}
                    ${position === 'center-right' ? 'top-1/2 right-2 transform -translate-y-1/2' : ''}
                    ${position === 'bottom-left' ? 'bottom-2 left-2' : ''}
                    ${position === 'bottom-center' ? 'bottom-2 left-1/2 transform -translate-x-1/2' : ''}
                    ${position === 'bottom-right' ? 'bottom-2 right-2' : ''}
                  `}
                  style={{ 
                    opacity: opacity[0] / 100,
                    fontSize: `${Math.min(fontSize[0] / 2, 16)}px`,
                    transform: `${position.includes('center') ? (position === 'center' ? 'translate(-50%, -50%)' : position === 'top-center' || position === 'bottom-center' ? 'translateX(-50%)' : 'translateY(-50%)') : ''} rotate(${rotation[0]}deg)`
                  }}
                >
                  {watermarkText}
                </div>
              )}
              {watermarkType === 'image' && watermarkImage && (
                <div 
                  className={`absolute select-none pointer-events-none
                    ${position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
                    ${position === 'top-left' ? 'top-2 left-2' : ''}
                    ${position === 'top-center' ? 'top-2 left-1/2 transform -translate-x-1/2' : ''}
                    ${position === 'top-right' ? 'top-2 right-2' : ''}
                    ${position === 'center-left' ? 'top-1/2 left-2 transform -translate-y-1/2' : ''}
                    ${position === 'center-right' ? 'top-1/2 right-2 transform -translate-y-1/2' : ''}
                    ${position === 'bottom-left' ? 'bottom-2 left-2' : ''}
                    ${position === 'bottom-center' ? 'bottom-2 left-1/2 transform -translate-x-1/2' : ''}
                    ${position === 'bottom-right' ? 'bottom-2 right-2' : ''}
                  `}
                  style={{ 
                    opacity: opacity[0] / 100,
                    transform: `${position.includes('center') ? (position === 'center' ? 'translate(-50%, -50%)' : position === 'top-center' || position === 'bottom-center' ? 'translateX(-50%)' : 'translateY(-50%)') : ''} rotate(${rotation[0]}deg)`
                  }}
                >
                  <img 
                    src={URL.createObjectURL(watermarkImage)} 
                    alt="Watermark preview" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={addWatermark} 
            className="w-full" 
            disabled={processing || !selectedFile || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !watermarkImage)}
          >
            {processing ? 'Adding Watermark...' : 'Add Watermark & Download'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}