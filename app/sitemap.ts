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
    { url: '/dashboard/password-generator', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-compressor', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-compress', priority: 0.9, changeFrequency: 'weekly' as const },
    
    // PDF Tools (Nested)
    { url: '/dashboard/pdf-tools/pdf-compress', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-to-jpg', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-split', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-merge', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-tools/pdf-rotate', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // PDF Tools (Individual)
    { url: '/dashboard/pdf-to-jpg', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-to-text', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-to-word', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/merge-pdf', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-split', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-rotate', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-watermark', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-password', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-metadata', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-signature', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/pdf-ocr', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Image Tools (Nested)
    { url: '/dashboard/image-tools/image-compressor', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/image-format-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/background-remover', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/image-watermark', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-tools/image-filter', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Image Tools (Individual)
    { url: '/dashboard/image-format-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/background-remover', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-watermark', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-filter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-rotate', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-resizer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-cropper', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/image-hosting', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Text Tools (Nested)
    { url: '/dashboard/text-tools/text-summarizer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/markdown-editor', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/text-translator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/word-counter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-tools/text-diff-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Text Tools (Individual)
    { url: '/dashboard/text-summarizer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/markdown-editor', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-translator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/word-counter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-diff', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-encoder', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-extractor', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-password-gen', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-reverser', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-statistics', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-to-image', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/text-to-speech', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/case-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/duplicate-remover', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/lorem-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/lorem-code', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Security Tools (Nested)
    { url: '/dashboard/security-tools/password-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/hash-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/password-strength-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/encryption-tool', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/security-tools/network-scanner', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Security Tools (Individual)
    { url: '/dashboard/hash-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/encryption-tool', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/secure-notes', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/password-strength', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/password-leak-check', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/two-factor-auth', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/network-scanner', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/file-hash-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/secure-file-delete', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ssl-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/vpn-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Developer Tools (Nested)
    { url: '/dashboard/developer-tools/color-picker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/code-formatter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/json-formatter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/css-minifier', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/html-validator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/developer-tools/api-tester', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Developer Tools (Individual)
    { url: '/dashboard/color-picker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/code-formatter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/json-formatter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/css-minifier', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/html-validator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/api-tester', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/js-minifier', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/sql-formatter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/regex-tester', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/base64-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/url-shortener', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/cron-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/git-ignore', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ip-lookup', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Design Tools (Nested)
    { url: '/dashboard/design-tools/gradient-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/design-tools/logo-maker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/design-tools/favicon-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/design-tools/color-contrast-checker', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Design Tools (Individual)
    { url: '/dashboard/color-palette', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/css-gradient', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/gradient-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/logo-maker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/favicon-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/color-contrast', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/mockup-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/icon-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/banner-maker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/font-pairing', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // AI Tools (Nested)
    { url: '/dashboard/ai-tools/ai-content-writer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-tools/ai-code-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-tools/ai-chatbot', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-tools/ai-image-enhancer', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // AI Tools (Individual)
    { url: '/dashboard/ai-content-writer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-code-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-chatbot', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-email-writer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-image-enhancer', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-name-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/ai-story-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Utility Tools (Nested)
    { url: '/dashboard/utility-tools/timestamp-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/random-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/wifi-qr', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/expense-tracker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/stopwatch', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/utility-tools/todo-list', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Utility Tools (Individual)
    { url: '/dashboard/timestamp-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/random-generator', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/wifi-qr', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/expense-tracker', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/stopwatch', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/todo-list', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/unit-converter', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/dashboard/social-bio-generator', priority: 0.8, changeFrequency: 'weekly' as const }
  ]

  return pages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}