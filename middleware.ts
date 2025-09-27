import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Handle redirects for old URLs
  const redirects: Record<string, string> = {
    '/pdf-tools': '/dashboard',
    '/image-tools': '/dashboard', 
    '/text-tools': '/dashboard',
    '/security-tools': '/dashboard',
    '/developer-tools': '/dashboard',
    '/design-tools': '/dashboard',
    '/ai-tools': '/dashboard',
    '/utility-tools': '/dashboard'
  }
  
  if (redirects[url.pathname]) {
    return NextResponse.redirect(new URL(redirects[url.pathname], request.url), 301)
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}