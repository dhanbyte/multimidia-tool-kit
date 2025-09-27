import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </Link>
        </div>
        
        <div className="pt-8">
          <h3 className="text-lg font-semibold mb-4">Popular Tools</h3>
          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
            <Link href="/dashboard/qr-generator" className="text-sm text-muted-foreground hover:text-primary">
              QR Generator
            </Link>
            <Link href="/dashboard/image-compressor" className="text-sm text-muted-foreground hover:text-primary">
              Image Compressor
            </Link>
            <Link href="/dashboard/pdf-compress" className="text-sm text-muted-foreground hover:text-primary">
              PDF Compressor
            </Link>
            <Link href="/dashboard/password-generator" className="text-sm text-muted-foreground hover:text-primary">
              Password Generator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}