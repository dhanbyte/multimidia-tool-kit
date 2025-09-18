import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect duplicate routes to canonical URLs
  const redirects: { [key: string]: string } = {
    // PDF Tools - redirect nested to individual
    '/dashboard/pdf-tools/pdf-compress': '/dashboard/pdf-compress',
    '/dashboard/pdf-tools/pdf-to-jpg': '/dashboard/pdf-to-jpg',
    '/dashboard/pdf-tools/pdf-split': '/dashboard/pdf-split',
    
    // Image Tools - redirect nested to individual  
    '/dashboard/image-tools/image-compressor': '/dashboard/image-compressor',
    '/dashboard/image-tools/background-remover': '/dashboard/background-remover',
    '/dashboard/image-tools/image-watermark': '/dashboard/image-watermark',
    
    // Text Tools - redirect nested to individual
    '/dashboard/text-tools/text-summarizer': '/dashboard/text-summarizer',
    '/dashboard/text-tools/word-counter': '/dashboard/word-counter',
    '/dashboard/text-tools/markdown-editor': '/dashboard/markdown-editor',
    
    // Security Tools - redirect nested to individual
    '/dashboard/security-tools/password-generator': '/dashboard/password-generator',
    '/dashboard/security-tools/hash-generator': '/dashboard/hash-generator',
    '/dashboard/security-tools/encryption-tool': '/dashboard/encryption-tool',
    
    // Developer Tools - redirect nested to individual
    '/dashboard/developer-tools/color-picker': '/dashboard/color-picker',
    '/dashboard/developer-tools/code-formatter': '/dashboard/code-formatter',
    '/dashboard/developer-tools/json-formatter': '/dashboard/json-formatter',
    
    // Design Tools - redirect nested to individual
    '/dashboard/design-tools/gradient-generator': '/dashboard/gradient-generator',
    '/dashboard/design-tools/logo-maker': '/dashboard/logo-maker',
    '/dashboard/design-tools/favicon-generator': '/dashboard/favicon-generator',
    
    // AI Tools - redirect nested to individual
    '/dashboard/ai-tools/ai-content-writer': '/dashboard/ai-content-writer',
    '/dashboard/ai-tools/ai-code-generator': '/dashboard/ai-code-generator',
    '/dashboard/ai-tools/ai-chatbot': '/dashboard/ai-chatbot',
    
    // Utility Tools - redirect nested to individual
    '/dashboard/utility-tools/timestamp-converter': '/dashboard/timestamp-converter',
    '/dashboard/utility-tools/random-generator': '/dashboard/random-generator',
    '/dashboard/utility-tools/wifi-qr': '/dashboard/wifi-qr',
  };

  // Check if current path should be redirected
  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url), 301);
  }

  // Block access to backup and temp files
  if (pathname.includes('.backup') || 
      pathname.includes('/temp/') || 
      pathname.includes('/test/') ||
      pathname.includes('/_next/') ||
      pathname.includes('/api/') && !pathname.startsWith('/api/sitemap')) {
    return NextResponse.redirect(new URL('/404', request.url), 404);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};