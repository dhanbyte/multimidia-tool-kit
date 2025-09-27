import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MultiTool by Dhanbyte - 100+ Free Online Tools',
    short_name: 'MultiTool',
    description: 'Your ultimate collection of 100+ free online tools. PDF converter, image compressor, QR generator, password tools, text utilities, developer tools & more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}