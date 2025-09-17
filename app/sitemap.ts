import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dhanbyte.me'
  
  const pages = [
    // Main pages
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/help', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/dashboard', priority: 0.9, changeFrequency: 'weekly' as const },
    
    // Popular Tools (High Priority)
    { url: '/dashboard/typing-master', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/dashboard/qr-generator', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-compress', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/image-compressor', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/text-summarizer', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/password-generator', priority: 0.9, changeFrequency: 'weekly' as const },
    
    // PDF Tools
    { url: '/dashboard/pdf-tools/pdf-to-jpg', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-split', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-merge', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-rotate', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Image Tools
    { url: '/dashboard/image-tools/image-format-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/background-remover', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/image-watermark', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/image-filter', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Text Tools
    { url: '/dashboard/text-tools/markdown-editor', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/text-translator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/word-counter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/text-diff-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Security Tools
    { url: '/dashboard/security-tools/hash-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/password-strength-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/encryption-tool', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/network-scanner', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Developer Tools
    { url: '/dashboard/developer-tools/color-picker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/code-formatter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/json-formatter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/css-minifier', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/html-validator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/api-tester', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Design Tools
    { url: '/dashboard/design-tools/gradient-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/design-tools/logo-maker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/design-tools/favicon-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/design-tools/color-contrast-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // AI Tools
    { url: '/dashboard/ai-tools/ai-content-writer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-tools/ai-code-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-tools/ai-chatbot', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-tools/ai-image-enhancer', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Utility Tools
    { url: '/dashboard/utility-tools/timestamp-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/random-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/wifi-qr', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/expense-tracker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/stopwatch', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/todo-list', priority: 0.8, changeFrequency: 'weekly' as const }
  ]

  return pages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}