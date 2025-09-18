'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageFilter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Filter states
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturate, setSaturate] = useState([100]);
  const [blur, setBlur] = useState([0]);
  const [grayscale, setGrayscale] = useState([0]);
  const [sepia, setSepia] = useState([0]);
  const [hueRotate, setHueRotate] = useState([0]);
  const [invert, setInvert] = useState([0]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      resetFilters();
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturate([100]);
    setBlur([0]);
    setGrayscale([0]);
    setSepia([0]);
    setHueRotate([0]);
    setInvert([0]);
  };

  const applyFilters = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        const filterString = `
          brightness(${brightness[0]}%)
          contrast(${contrast[0]}%)
          saturate(${saturate[0]}%)
          blur(${blur[0]}px)
          grayscale(${grayscale[0]}%)
          sepia(${sepia[0]}%)
          hue-rotate(${hueRotate[0]}deg)
          invert(${invert[0]}%)
        `.replace(/\s+/g, ' ').trim();
        
        ctx.filter = filterString;
        ctx.drawImage(img, 0, 0);
      }
    };
    
    img.src = originalImage;
  };

  useEffect(() => {
    if (originalImage) {
      applyFilters();
    }
  }, [brightness, contrast, saturate, blur, grayscale, sepia, hueRotate, invert, originalImage]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `filtered-${selectedFile?.name || 'image'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Image downloaded successfully!');
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'vintage':
        setBrightness([110]);
        setContrast([120]);
        setSaturate([80]);
        setSepia([30]);
        break;
      case 'dramatic':
        setBrightness([90]);
        setContrast([150]);
        setSaturate([120]);
        setGrayscale([0]);
        break;
      case 'cool':
        setBrightness([105]);
        setContrast([110]);
        setSaturate([90]);
        setHueRotate([180]);
        break;
      case 'warm':
        setBrightness([110]);
        setContrast([105]);
        setSaturate([110]);
        setSepia([20]);
        break;
      case 'bw':
        setGrayscale([100]);
        setContrast([120]);
        break;
      default:
        resetFilters();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Image Filter Tool</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Filter Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{selectedFile ? selectedFile.name : 'Upload image'}</p>
              </label>
            </div>

            {selectedFile && (
              <>
                {/* Preset Filters */}
                <div className="space-y-3">
                  <h3 className="font-medium">Quick Presets</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => applyPreset('vintage')}>Vintage</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('dramatic')}>Dramatic</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('cool')}>Cool</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('warm')}>Warm</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('bw')}>B&W</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('reset')}>Reset</Button>
                  </div>
                </div>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    {/* Brightness */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Brightness: {brightness[0]}%</label>
                      <Slider
                        value={brightness}
                        onValueChange={setBrightness}
                        max={200}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contrast: {contrast[0]}%</label>
                      <Slider
                        value={contrast}
                        onValueChange={setContrast}
                        max={200}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Saturation: {saturate[0]}%</label>
                      <Slider
                        value={saturate}
                        onValueChange={setSaturate}
                        max={200}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Blur */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Blur: {blur[0]}px</label>
                      <Slider
                        value={blur}
                        onValueChange={setBlur}
                        max={20}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    {/* Grayscale */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grayscale: {grayscale[0]}%</label>
                      <Slider
                        value={grayscale}
                        onValueChange={setGrayscale}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Sepia */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sepia: {sepia[0]}%</label>
                      <Slider
                        value={sepia}
                        onValueChange={setSepia}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Hue Rotate */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hue Rotate: {hueRotate[0]}°</label>
                      <Slider
                        value={hueRotate}
                        onValueChange={setHueRotate}
                        max={360}
                        min={0}
                        step={15}
                        className="w-full"
                      />
                    </div>

                    {/* Invert */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Invert: {invert[0]}%</label>
                      <Slider
                        value={invert}
                        onValueChange={setInvert}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={resetFilters} variant="outline" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={downloadImage} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {originalImage ? (
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto border rounded-lg"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <p className="text-muted-foreground">Upload an image to see preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}