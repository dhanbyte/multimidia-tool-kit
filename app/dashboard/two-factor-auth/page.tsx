'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, RefreshCw, Shield, Smartphone, CheckCircle, XCircle, QrCode } from "lucide-react"

// Simple TOTP implementation
function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)]
  }
  return secret
}

function base32Decode(encoded: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (const char of encoded) {
    const val = alphabet.indexOf(char.toUpperCase())
    if (val === -1) continue
    bits += val.toString(2).padStart(5, '0')
  }
  
  const bytes = []
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8)
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2))
    }
  }
  return new Uint8Array(bytes)
}

async function generateTOTP(secret: string, timeStep = 30) {
  const time = Math.floor(Date.now() / 1000 / timeStep)
  const timeBytes = new ArrayBuffer(8)
  const timeView = new DataView(timeBytes)
  timeView.setUint32(4, time, false)
  
  const key = base32Decode(secret)
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes)
  const signatureArray = new Uint8Array(signature)
  
  const offset = signatureArray[19] & 0xf
  const code = (
    ((signatureArray[offset] & 0x7f) << 24) |
    ((signatureArray[offset + 1] & 0xff) << 16) |
    ((signatureArray[offset + 2] & 0xff) << 8) |
    (signatureArray[offset + 3] & 0xff)
  ) % 1000000
  
  return code.toString().padStart(6, '0')
}

export default function TwoFactorAuth() {
  const [secret, setSecret] = useState('')
  const [currentCode, setCurrentCode] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [qrUrl, setQrUrl] = useState('')

  const generateNewSecret = () => {
    const newSecret = generateSecret()
    setSecret(newSecret)
    setIsValid(null)
    setVerifyCode('')
    
    // Generate QR code URL for authenticator apps
    const issuer = 'MultiTool by Dhanbyte'
    const accountName = 'user@example.com'
    const otpUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${newSecret}&issuer=${encodeURIComponent(issuer)}`
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpUrl)}`)
  }

  const updateCode = async () => {
    if (secret) {
      const code = await generateTOTP(secret)
      setCurrentCode(code)
    }
  }

  const verifyToken = async () => {
    if (!secret || !verifyCode) return
    
    const currentTime = Math.floor(Date.now() / 1000 / 30)
    
    // Check current and previous time windows for clock drift
    for (let i = -1; i <= 1; i++) {
      const testTime = currentTime + i
      const timeBytes = new ArrayBuffer(8)
      const timeView = new DataView(timeBytes)
      timeView.setUint32(4, testTime, false)
      
      const key = base32Decode(secret)
      const cryptoKey = await crypto.subtle.importKey(
        'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
      )
      
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes)
      const signatureArray = new Uint8Array(signature)
      
      const offset = signatureArray[19] & 0xf
      const code = (
        ((signatureArray[offset] & 0x7f) << 24) |
        ((signatureArray[offset + 1] & 0xff) << 16) |
        ((signatureArray[offset + 2] & 0xff) << 8) |
        (signatureArray[offset + 3] & 0xff)
      ) % 1000000
      
      if (code.toString().padStart(6, '0') === verifyCode) {
        setIsValid(true)
        return
      }
    }
    
    setIsValid(false)
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
  }

  useEffect(() => {
    generateNewSecret()
  }, [])

  useEffect(() => {
    updateCode()
    const interval = setInterval(updateCode, 1000)
    return () => clearInterval(interval)
  }, [secret])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const remaining = 30 - (now % 30)
      setTimeLeft(remaining)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Two-Factor Authentication</h1>
        <p className="text-muted-foreground">Generate and verify TOTP codes for enhanced security</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate 2FA</TabsTrigger>
          <TabsTrigger value="verify">Verify Token</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Generate 2FA Secret
              </CardTitle>
              <CardDescription>Create a new secret key for your authenticator app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button onClick={generateNewSecret} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Generate New Secret
                </Button>
              </div>

              {secret && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="secret">Secret Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="secret"
                        value={secret}
                        readOnly
                        className="font-mono"
                      />
                      <Button onClick={copySecret} variant="outline" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter this secret in your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>QR Code</Label>
                      <div className="mt-2 p-4 bg-white rounded-lg border inline-block">
                        <img src={qrUrl} alt="2FA QR Code" className="w-48 h-48" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Scan with your authenticator app
                      </p>
                    </div>

                    <div>
                      <Label>Current TOTP Code</Label>
                      <div className="mt-2 p-6 bg-muted rounded-lg text-center">
                        <div className="text-3xl font-mono font-bold mb-2">{currentCode}</div>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <div className="w-32 bg-background rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${(timeLeft / 30) * 100}%` }}
                            />
                          </div>
                          <span>{timeLeft}s</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          This code changes every 30 seconds
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Verify Token
              </CardTitle>
              <CardDescription>Test your authenticator app token</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verify">Enter 6-digit code from your authenticator app</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="verify"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="font-mono text-center text-lg"
                    maxLength={6}
                  />
                  <Button onClick={verifyToken} disabled={verifyCode.length !== 6}>
                    Verify
                  </Button>
                </div>
              </div>

              {isValid !== null && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {isValid ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="font-medium">
                    {isValid ? 'Token is valid!' : 'Invalid token. Please try again.'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Setup Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Generate a new secret key using the button above</li>
              <li>Scan the QR code with your authenticator app or manually enter the secret</li>
              <li>Your app will start generating 6-digit codes every 30 seconds</li>
              <li>Use the verify tab to test your setup</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Compatible Apps</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Google Authenticator</Badge>
              <Badge variant="outline">Authy</Badge>
              <Badge variant="outline">Microsoft Authenticator</Badge>
              <Badge variant="outline">1Password</Badge>
              <Badge variant="outline">LastPass Authenticator</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}