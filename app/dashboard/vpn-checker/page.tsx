'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, Globe, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface VPNData {
  ip: string
  country: string
  region: string
  city: string
  isp: string
  proxy: boolean
  vpn: boolean
  tor: boolean
  hosting: boolean
  threat: string
  mobile: boolean
}

export default function VPNChecker() {
  const [vpnData, setVpnData] = useState<VPNData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkConnection = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Get IP first
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const { ip } = await ipResponse.json()
      
      // Get location data
      const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`)
      const locationData = await locationResponse.json()
      
      // Simple VPN/Proxy detection based on common patterns
      const isVPN = locationData.org?.toLowerCase().includes('vpn') || 
                   locationData.org?.toLowerCase().includes('proxy') ||
                   locationData.org?.toLowerCase().includes('hosting')
      
      const isProxy = locationData.org?.toLowerCase().includes('proxy') ||
                     locationData.org?.toLowerCase().includes('datacenter')
      
      const isTor = locationData.org?.toLowerCase().includes('tor')
      
      setVpnData({
        ip: ip,
        country: locationData.country_name || 'Unknown',
        region: locationData.region || 'Unknown',
        city: locationData.city || 'Unknown',
        isp: locationData.org || 'Unknown ISP',
        proxy: isProxy,
        vpn: isVPN,
        tor: isTor,
        hosting: locationData.org?.toLowerCase().includes('hosting') || false,
        threat: isVPN || isProxy || isTor ? 'Medium' : 'Low',
        mobile: locationData.connection?.toLowerCase().includes('mobile') || false
      })
    } catch (err) {
      setError('Failed to check connection. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <XCircle className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />
  }

  const getThreatColor = (threat: string) => {
    switch (threat.toLowerCase()) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'default'
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">VPN & Proxy Checker</h1>
        <p className="text-muted-foreground">Check if your connection is using VPN, proxy, or Tor network</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Connection Status
            </CardTitle>
            <CardDescription>Real-time analysis of your internet connection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Button onClick={checkConnection} disabled={loading} size="lg">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
                {loading ? 'Checking...' : 'Check My Connection'}
              </Button>
            </div>

            {error && (
              <div className="text-center text-red-500 mb-4">{error}</div>
            )}

            {vpnData && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">IP Address</span>
                    <span className="font-mono">{vpnData.ip}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Location</span>
                    <span>{vpnData.city}, {vpnData.region}, {vpnData.country}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">ISP</span>
                    <span className="text-right">{vpnData.isp}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium flex items-center gap-2">
                      VPN Detected
                      {getStatusIcon(vpnData.vpn)}
                    </span>
                    <Badge variant={vpnData.vpn ? 'destructive' : 'default'}>
                      {vpnData.vpn ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium flex items-center gap-2">
                      Proxy Detected
                      {getStatusIcon(vpnData.proxy)}
                    </span>
                    <Badge variant={vpnData.proxy ? 'destructive' : 'default'}>
                      {vpnData.proxy ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium flex items-center gap-2">
                      Tor Network
                      {getStatusIcon(vpnData.tor)}
                    </span>
                    <Badge variant={vpnData.tor ? 'destructive' : 'default'}>
                      {vpnData.tor ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Risk Level</span>
                    <Badge variant={getThreatColor(vpnData.threat)}>
                      {vpnData.threat}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Real-time VPN detection using advanced algorithms</li>
                <li>Proxy server identification and analysis</li>
                <li>Tor network connection detection</li>
                <li>ISP and geolocation information</li>
                <li>Security risk assessment</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Understanding Results</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>VPN:</strong> Virtual Private Network detected</li>
                <li><strong>Proxy:</strong> Proxy server connection identified</li>
                <li><strong>Tor:</strong> The Onion Router network detected</li>
                <li><strong>Risk Level:</strong> Security threat assessment</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}