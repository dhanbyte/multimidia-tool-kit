'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Network, Shield, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"

interface ScanResult {
  ip: string
  hostname: string
  status: 'online' | 'offline'
  ports: { port: number; status: 'open' | 'closed'; service: string }[]
  os: string
  responseTime: number
}

export default function NetworkScanner() {
  const [target, setTarget] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<ScanResult | null>(null)

  const simulateScan = async () => {
    if (!target.trim()) return
    
    setScanning(true)
    setResults(null)
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate simulated results
    const commonPorts = [
      { port: 22, service: 'SSH' },
      { port: 80, service: 'HTTP' },
      { port: 443, service: 'HTTPS' },
      { port: 21, service: 'FTP' },
      { port: 25, service: 'SMTP' },
      { port: 53, service: 'DNS' },
      { port: 110, service: 'POP3' },
      { port: 143, service: 'IMAP' },
      { port: 993, service: 'IMAPS' },
      { port: 995, service: 'POP3S' }
    ]
    
    const mockResult: ScanResult = {
      ip: target.includes('.') ? target : '192.168.1.1',
      hostname: target.includes('.') ? target : 'example.local',
      status: Math.random() > 0.3 ? 'online' : 'offline',
      ports: commonPorts.map(p => ({
        ...p,
        status: Math.random() > 0.7 ? 'open' : 'closed'
      })),
      os: ['Windows 10', 'Ubuntu Linux', 'macOS', 'Unknown'][Math.floor(Math.random() * 4)],
      responseTime: Math.floor(Math.random() * 100) + 10
    }
    
    setResults(mockResult)
    setScanning(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Network Scanner</h1>
        <p className="text-muted-foreground">Educational network scanning tool with simulated results</p>
      </div>

      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Important:</strong> This is a demonstration tool with simulated results. 
          Real network scanning requires proper authorization and should only be performed on networks you own or have explicit permission to test.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Scan Target
          </CardTitle>
          <CardDescription>Enter an IP address or hostname to simulate scanning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="target">IP Address or Hostname</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="192.168.1.1 or example.com"
                disabled={scanning}
              />
              <Button onClick={simulateScan} disabled={scanning || !target.trim()}>
                {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Network className="w-4 h-4 mr-2" />}
                {scanning ? 'Scanning...' : 'Scan'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Scan Results
              </CardTitle>
              <CardDescription>Simulated network scan results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Target IP</span>
                    <span className="font-mono">{results.ip}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Hostname</span>
                    <span>{results.hostname}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Status</span>
                    <Badge variant={results.status === 'online' ? 'default' : 'destructive'}>
                      {results.status === 'online' ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Operating System</span>
                    <span>{results.os}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Response Time</span>
                    <span>{results.responseTime}ms</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Open Ports</span>
                    <span>{results.ports.filter(p => p.status === 'open').length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Port Scan Results</CardTitle>
              <CardDescription>Common ports and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.ports.map((port) => (
                  <div key={port.port} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {port.status === 'open' ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-red-500" />
                      }
                      <span className="font-mono">Port {port.port}</span>
                      <span className="text-muted-foreground">({port.service})</span>
                    </div>
                    <Badge variant={port.status === 'open' ? 'default' : 'secondary'}>
                      {port.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Educational Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What is Network Scanning?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Network scanning is the process of identifying active devices, open ports, and services on a network. 
              It's commonly used for network administration, security auditing, and troubleshooting.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Common Scan Types</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Ping Scan:</strong> Checks if hosts are alive</li>
              <li><strong>Port Scan:</strong> Identifies open ports and services</li>
              <li><strong>OS Detection:</strong> Attempts to identify operating systems</li>
              <li><strong>Service Detection:</strong> Identifies running services and versions</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Legal and Ethical Considerations</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Only scan networks you own or have explicit permission to test</li>
              <li>Unauthorized scanning may violate laws and terms of service</li>
              <li>Always follow responsible disclosure for any vulnerabilities found</li>
              <li>Use scanning tools for legitimate security and administrative purposes only</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}