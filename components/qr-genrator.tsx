"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"
import {
  QrCode,
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Wifi,
  Mail,
  Phone,
  Link,
  FileText,
  Info,
} from "lucide-react"
import { ShareButton } from '@/components/share-button'
import { ResultShare } from '@/components/result-share'





export default function QRGeneratorPages() {
  const [text, setText] = useState("")
  const [qrType, setQrType] = useState("text")
  const [size, setSize] = useState("256")
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [error, setError] = useState("")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [margin, setMargin] = useState(2)
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoSize, setLogoSize] = useState(20)
  const [cornerStyle, setCornerStyle] = useState("square")
  const [dotStyle, setDotStyle] = useState("square")
  const { toast } = useToast()

  const qrTypes = [
    { value: "text", label: "Plain Text", icon: FileText, placeholder: "Enter your text here..." },
    { value: "url", label: "Website URL", icon: Link, placeholder: "https://example.com" },
    { value: "email", label: "Email Address", icon: Mail, placeholder: "user@example.com" },
    { value: "phone", label: "Phone Number", icon: Phone, placeholder: "+1234567890" },
    { value: "wifi", label: "WiFi Password", icon: Wifi, placeholder: "WIFI:T:WPA;S:NetworkName;P:Password;H:false;;" },
  ]

  const handleGenerate = async () => {
    if (!text) {
      setError("Please enter content to generate QR code.")
      return
    }

    setLoading(true)
    setError("")
    setQrCode("")

    try {
      let qrText = text
      
      // Format text based on type
      if (qrType === "email" && !text.startsWith("mailto:")) {
        qrText = `mailto:${text}`
      } else if (qrType === "phone" && !text.startsWith("tel:")) {
        qrText = `tel:${text}`
      } else if (qrType === "url" && !text.startsWith("http")) {
        qrText = `https://${text}`
      }

      const qrCodeDataURL = await QRCode.toDataURL(qrText, {
        width: Number.parseInt(size),
        margin: margin,
        errorCorrectionLevel: errorCorrectionLevel as any,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        rendererOpts: {
          quality: 1
        }
      })

      setQrCode(qrCodeDataURL)
      toast({ title: "Success!", description: "QR code generated successfully." })
    } catch (err: any) {
      console.error("QR generation error:", err)
      setError("Failed to generate QR code")
      toast({ title: "Error", description: "Failed to generate QR code", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    setError("")
    setText("https://example.com")
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL("https://example.com", {
        width: Number.parseInt(size),
        margin: margin,
        errorCorrectionLevel: errorCorrectionLevel as any,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        rendererOpts: {
          quality: 1
        }
      })
      
      setQrCode(qrCodeDataURL)
      toast({ title: "Demo Complete!", description: "Demo QR code generated successfully." })
    } catch (err) {
      setQrCode(`/placeholder.svg?height=${size}&width=${size}`)
      toast({ title: "Demo Complete!", description: "This is a demo QR code." })
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (qrCode) {
      const link = document.createElement("a")
      link.href = qrCode
      const fileExtension = qrCode.startsWith("data:image/png") ? "png" : "jpg"
      link.download = `qrcode-${Date.now()}.${fileExtension}`
      link.click()
      toast({ title: "Downloaded!", description: "QR code saved to your device." })
    }
  }

  const currentType = qrTypes.find((type) => type.value === qrType)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/20">
          <QrCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
          <p className="text-muted-foreground">Generate custom QR codes for any text, URL, or data</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Generate QR Code
            </CardTitle>
            <CardDescription>Enter your content and customize the QR code settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">QR Code Type</label>
              <Select value={qrType} onValueChange={setQrType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qrTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <type.icon className="mr-2 h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              {qrType === "text" || qrType === "wifi" ? (
                <Textarea placeholder={currentType?.placeholder} value={text} onChange={(e) => setText(e.target.value)} rows={3} />
              ) : (
                <Input placeholder={currentType?.placeholder} value={text} onChange={(e) => setText(e.target.value)} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Size</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128x128 (Small)</SelectItem>
                    <SelectItem value="256">256x256 (Medium)</SelectItem>
                    <SelectItem value="512">512x512 (Large)</SelectItem>
                    <SelectItem value="1024">1024x1024 (Extra Large)</SelectItem>
                    <SelectItem value="2048">2048x2048 (Print Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Error Correction</label>
                <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color Customization */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Foreground Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Background Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Margin Control */}
            <div>
              <label className="text-sm font-medium mb-2 block">Margin: {margin} modules</label>
              <input
                type="range"
                min="0"
                max="10"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Style Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Corner Style</label>
                <Select value={cornerStyle} onValueChange={setCornerStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Dot Style</label>
                <Select value={dotStyle} onValueChange={setDotStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Logo (Optional)</label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                {logoFile && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Logo Size: {logoSize}%</label>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={logoSize}
                      onChange={(e) => setLogoSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10%</span>
                      <span>25%</span>
                      <span>40%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
                </>
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button variant="outline" onClick={handleDemo} disabled={loading} className="w-full bg-transparent">
              <Play className="mr-2 h-4 w-4" /> Try Demo
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview & Download</CardTitle>
            <CardDescription>Your generated QR code will appear here</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {qrCode ? (
              <>
                <div className="border rounded-lg p-6 bg-white dark:bg-gray-50">
                  <img
                    src={qrCode || "/placeholder.svg"}
                    alt="Generated QR Code"
                    className="max-w-full h-auto"
                    style={{ width: `${size}px`, height: `${size}px` }}
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Size: {size}x{size} pixels</p>
                  <p className="text-sm text-muted-foreground">Type: {currentType?.label}</p>
                  <p className="text-sm text-muted-foreground">Error Correction: {errorCorrectionLevel}</p>
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{backgroundColor: foregroundColor}}></div>
                      <span>Foreground</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded border" style={{backgroundColor: backgroundColor}}></div>
                      <span>Background</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  <Button onClick={downloadQR} className="flex-1">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <ResultShare 
                    title="QR Code"
                    result={qrCode}
                    resultType="qr"
                    toolName="qr-generator"
                  />
                </div>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>QR code generated successfully!</AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center w-full">
                <QrCode className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">QR code will appear here</p>
                <p className="text-sm text-gray-400">Enter content and click generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Choose Type", "Enter Content", "Customize Size", "Generate & Download"].map((title, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Badge variant="outline" className="mt-1 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    {i + 1}
                  </Badge>
                  <div>
                    <h4 className="font-medium text-sm">{title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {title === "Choose Type"
                        ? "Select the type of content you want to encode (text, URL, email, etc.)"
                        : title === "Enter Content"
                        ? "Type or paste your text, URL, or other content in the input field"
                        : title === "Customize Size"
                        ? "Choose the size that fits your needs (larger for printing, smaller for digital)"
                        : "Click generate to create your QR code, then download it to your device"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-4 w-4" /> Examples & Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">WiFi QR Code Format:</h4>
                <code className="text-xs bg-muted p-2 rounded block">WIFI:T:WPA;S:NetworkName;P:Password;H:false;;</code>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Email Format:</h4>
                <code className="text-xs bg-muted p-2 rounded block">user@example.com</code>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Phone Format:</h4>
                <code className="text-xs bg-muted p-2 rounded block">+1234567890</code>
              </div>
              <Separator />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Use larger sizes for printing (512px+)</p>
                <p>• Smaller sizes work better for digital use</p>
                <p>• Test your QR codes before using them</p>
                <p>• Keep content concise for better scanning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}