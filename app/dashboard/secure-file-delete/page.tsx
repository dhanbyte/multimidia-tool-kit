'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, Trash2, Shield, AlertTriangle, CheckCircle, FileX, Info } from "lucide-react"

interface FileItem {
  name: string
  size: number
  type: string
  status: 'pending' | 'deleting' | 'deleted'
  progress: number
}

const DELETION_METHODS = [
  { name: 'DoD 5220.22-M', passes: 3, description: 'US Department of Defense standard' },
  { name: 'Gutmann', passes: 35, description: 'Most thorough, 35-pass overwrite' },
  { name: 'Random', passes: 1, description: 'Single pass with random data' },
  { name: 'Zero Fill', passes: 1, description: 'Single pass with zeros' }
]

export default function SecureFileDelete() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedMethod, setSelectedMethod] = useState(DELETION_METHODS[0])
  const [isDeleting, setIsDeleting] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: FileItem[] = Array.from(selectedFiles).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown',
      status: 'pending',
      progress: 0
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const simulateSecureDeletion = async () => {
    if (files.length === 0) return
    
    setIsDeleting(true)
    setOverallProgress(0)
    
    // Update all files to deleting status
    setFiles(prev => prev.map(file => ({ ...file, status: 'deleting' as const, progress: 0 })))
    
    const totalPasses = selectedMethod.passes
    const totalFiles = files.length
    
    for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
      for (let pass = 1; pass <= totalPasses; pass++) {
        // Simulate each pass
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50))
          
          setFiles(prev => prev.map((file, i) => 
            i === fileIndex 
              ? { ...file, progress: Math.floor((pass - 1) / totalPasses * 100 + progress / totalPasses) }
              : file
          ))
          
          const overallPercent = Math.floor(
            ((fileIndex * totalPasses + pass - 1) * 100 + progress) / (totalFiles * totalPasses)
          )
          setOverallProgress(overallPercent)
        }
      }
      
      // Mark file as deleted
      setFiles(prev => prev.map((file, i) => 
        i === fileIndex 
          ? { ...file, status: 'deleted' as const, progress: 100 }
          : file
      ))
    }
    
    setOverallProgress(100)
    setIsDeleting(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const clearAll = () => {
    setFiles([])
    setOverallProgress(0)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Secure File Deletion</h1>
        <p className="text-muted-foreground">Educational tool demonstrating secure file deletion methods</p>
      </div>

      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Educational Demo:</strong> This tool simulates secure deletion for learning purposes. 
          No files are actually deleted from your system. Real secure deletion requires specialized software and system-level access.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="delete" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="delete">Secure Delete</TabsTrigger>
          <TabsTrigger value="learn">Learn More</TabsTrigger>
        </TabsList>

        <TabsContent value="delete" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Select Files
              </CardTitle>
              <CardDescription>Choose files to demonstrate secure deletion</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Click to select files</p>
                <p className="text-sm text-muted-foreground">Multiple files supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                />
              </div>
            </CardContent>
          </Card>

          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileX className="w-5 h-5" />
                  Selected Files ({files.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={clearAll} variant="outline" size="sm" disabled={isDeleting}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {file.status === 'deleted' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : file.status === 'deleting' ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        ) : (
                          <FileX className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          file.status === 'deleted' ? 'default' :
                          file.status === 'deleting' ? 'secondary' : 'outline'
                        }>
                          {file.status === 'deleted' ? 'Deleted' :
                           file.status === 'deleting' ? `${file.progress}%` : 'Pending'}
                        </Badge>
                        {file.status === 'pending' && (
                          <Button
                            onClick={() => removeFile(index)}
                            variant="ghost"
                            size="sm"
                            disabled={isDeleting}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Deletion Method
              </CardTitle>
              <CardDescription>Choose secure deletion algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {DELETION_METHODS.map((method) => (
                  <div
                    key={method.name}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod.name === method.name
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedMethod(method)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{method.name}</h3>
                      <Badge variant="outline">{method.passes} pass{method.passes > 1 ? 'es' : ''}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Secure Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Method: {selectedMethod.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMethod.passes} pass{selectedMethod.passes > 1 ? 'es' : ''} per file
                    </p>
                  </div>
                  <Button
                    onClick={simulateSecureDeletion}
                    disabled={isDeleting || files.every(f => f.status === 'deleted')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Start Secure Deletion
                      </>
                    )}
                  </Button>
                </div>

                {isDeleting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="learn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                About Secure File Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Why Secure Deletion?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  When you delete a file normally, only the file system reference is removed. 
                  The actual data remains on the storage device and can be recovered using specialized tools.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Deletion Methods</h3>
                <div className="space-y-3">
                  {DELETION_METHODS.map((method) => (
                    <div key={method.name} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{method.name}</h4>
                        <Badge variant="outline">{method.passes} pass{method.passes > 1 ? 'es' : ''}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Important Considerations</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>SSDs use wear leveling, making traditional overwriting less effective</li>
                  <li>Modern SSDs support secure erase commands (ATA Secure Erase)</li>
                  <li>Full disk encryption makes secure deletion less critical</li>
                  <li>Physical destruction is the most secure method for sensitive data</li>
                  <li>Cloud storage may have additional considerations for data residency</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Real-World Tools</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>DBAN:</strong> Darik's Boot and Nuke for full disk wiping</li>
                  <li><strong>sdelete:</strong> Microsoft's secure delete utility</li>
                  <li><strong>shred:</strong> Linux command-line secure deletion tool</li>
                  <li><strong>BleachBit:</strong> Cross-platform system cleaner with secure deletion</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}