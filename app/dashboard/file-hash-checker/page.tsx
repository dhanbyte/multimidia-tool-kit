'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, FileText, Copy, CheckCircle, XCircle, Shield } from "lucide-react"

interface HashResult {
  md5: string
  sha1: string
  sha256: string
  sha512: string
  fileName: string
  fileSize: number
}

export default function FileHashChecker() {
  const [file, setFile] = useState<File | null>(null)
  const [hashes, setHashes] = useState<HashResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifyHash, setVerifyHash] = useState('')
  const [verifyResult, setVerifyResult] = useState<'match' | 'no-match' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const calculateHashes = async (file: File) => {
    const buffer = await file.arrayBuffer()
    
    const [md5, sha1, sha256, sha512] = await Promise.all([
      crypto.subtle.digest('MD5', buffer).catch(() => null),
      crypto.subtle.digest('SHA-1', buffer),
      crypto.subtle.digest('SHA-256', buffer),
      crypto.subtle.digest('SHA-512', buffer)
    ])

    const hashToHex = (hash: ArrayBuffer | null) => {
      if (!hash) return 'Not supported'
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    }

    return {
      md5: hashToHex(md5),
      sha1: hashToHex(sha1),
      sha256: hashToHex(sha256),
      sha512: hashToHex(sha512),
      fileName: file.name,
      fileSize: file.size
    }
  }

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setLoading(true)
    setVerifyResult(null)
    
    try {
      const result = await calculateHashes(selectedFile)
      setHashes(result)
    } catch (error) {
      console.error('Error calculating hashes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  const verifyHashValue = () => {
    if (!hashes || !verifyHash.trim()) return
    
    const cleanHash = verifyHash.trim().toLowerCase()
    const hashValues = [
      hashes.md5.toLowerCase(),
      hashes.sha1.toLowerCase(),
      hashes.sha256.toLowerCase(),
      hashes.sha512.toLowerCase()
    ]
    
    setVerifyResult(hashValues.includes(cleanHash) ? 'match' : 'no-match')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">File Hash Checker</h1>
        <p className="text-muted-foreground">Generate and verify file hashes for integrity checking</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Hashes</TabsTrigger>
          <TabsTrigger value="verify">Verify Hash</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload File
              </CardTitle>
              <CardDescription>Select a file to generate its hash values</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {file ? file.name : 'Drop file here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {file ? formatFileSize(file.size) : 'Any file type supported'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            </CardContent>
          </Card>

          {loading && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Calculating hashes...</span>
              </CardContent>
            </Card>
          )}

          {hashes && !loading && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Hash Results
                </CardTitle>
                <CardDescription>Generated hash values for {hashes.fileName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {[
                    { label: 'MD5', value: hashes.md5, color: 'bg-blue-50 text-blue-700' },
                    { label: 'SHA-1', value: hashes.sha1, color: 'bg-green-50 text-green-700' },
                    { label: 'SHA-256', value: hashes.sha256, color: 'bg-purple-50 text-purple-700' },
                    { label: 'SHA-512', value: hashes.sha512, color: 'bg-orange-50 text-orange-700' }
                  ].map((hash) => (
                    <div key={hash.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold">{hash.label}</Label>
                        <Badge variant="outline" className={hash.color}>
                          {hash.label}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={hash.value}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          onClick={() => copyHash(hash.value)}
                          variant="outline"
                          size="icon"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verify Hash
              </CardTitle>
              <CardDescription>Compare a hash value with your file's generated hashes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verify-hash">Enter hash value to verify</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="verify-hash"
                    value={verifyHash}
                    onChange={(e) => setVerifyHash(e.target.value)}
                    placeholder="Enter MD5, SHA-1, SHA-256, or SHA-512 hash"
                    className="font-mono"
                  />
                  <Button
                    onClick={verifyHashValue}
                    disabled={!hashes || !verifyHash.trim()}
                  >
                    Verify
                  </Button>
                </div>
              </div>

              {verifyResult && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  verifyResult === 'match' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {verifyResult === 'match' ? 
                    <CheckCircle className="w-5 h-5" /> : 
                    <XCircle className="w-5 h-5" />
                  }
                  <span className="font-medium">
                    {verifyResult === 'match' 
                      ? 'Hash matches! File integrity verified.' 
                      : 'Hash does not match. File may be corrupted or modified.'
                    }
                  </span>
                </div>
              )}

              {!hashes && (
                <p className="text-sm text-muted-foreground">
                  Please generate hashes for a file first using the "Generate Hashes" tab.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>About File Hashing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What are File Hashes?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              File hashes are unique digital fingerprints that verify file integrity. 
              Even a single bit change in a file will produce a completely different hash.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Hash Types</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>MD5:</strong> 128-bit hash, fast but cryptographically broken</li>
              <li><strong>SHA-1:</strong> 160-bit hash, deprecated for security applications</li>
              <li><strong>SHA-256:</strong> 256-bit hash, current security standard</li>
              <li><strong>SHA-512:</strong> 512-bit hash, highest security level</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Common Use Cases</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Verify file downloads haven't been corrupted</li>
              <li>Detect unauthorized file modifications</li>
              <li>Ensure data integrity during transfers</li>
              <li>Digital forensics and evidence verification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}