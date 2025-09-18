import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/*?*',
        '/dashboard/*?*',
        '/*.backup',
        '/temp/',
        '/test/'
      ]
    },
    sitemap: 'https://dhanbyte.me/sitemap.xml',
    host: 'https://dhanbyte.me'
  }
}