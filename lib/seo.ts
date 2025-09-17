import { Metadata } from 'next';

interface ToolSEO {
  title: string;
  description: string;
  keywords: string[];
  path: string;
}

export function generateToolMetadata(tool: ToolSEO): Metadata {
  const baseUrl = 'https://dhanbyte.me';
  const fullUrl = `${baseUrl}${tool.path}`;
  
  return {
    title: `${tool.title} - Free Online Tool | MediaTools Pro`,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    openGraph: {
      title: `${tool.title} - Free Online Tool`,
      description: tool.description,
      url: fullUrl,
      siteName: 'MediaTools Pro',
      images: [{
        url: 'https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819',
        width: 1200,
        height: 630,
        alt: `${tool.title} by dhanbyte`,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.title} - Free Online Tool`,
      description: tool.description,
      images: ['https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819'],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export const toolsSEO = {
  'typing-master': {
    title: 'Typing Master - Speed Test & Practice',
    description: 'Improve your typing speed and accuracy with our advanced typing master tool. Multiple difficulty levels, real-time stats, and detailed analytics.',
    keywords: ['typing test', 'typing speed', 'typing practice', 'wpm test', 'keyboard skills', 'typing master', 'speed typing', 'typing game', 'typing tutor', 'learn typing', 'typing lessons', 'keyboard practice', 'typing accuracy', 'words per minute', 'typing skills', 'online typing test', 'free typing test', 'typing speed test', 'typing trainer'],
    path: '/dashboard/typing-master'
  },
  'qr-generator': {
    title: 'QR Code Generator',
    description: 'Generate QR codes instantly for text, URLs, WiFi, and more. Free, fast, and customizable QR code maker.',
    keywords: ['qr code generator', 'qr maker', 'free qr code', 'qr code creator', 'barcode generator', 'qr generator online', 'create qr code', 'qr code maker free', 'generate qr code', 'qr scanner', 'qr code online', 'custom qr code', 'qr code for url', 'qr code for text', 'wifi qr code', 'vcard qr code', 'business qr code'],
    path: '/dashboard/qr-generator'
  },
  'pdf-compress': {
    title: 'PDF Compressor',
    description: 'Compress PDF files online for free. Reduce PDF size while maintaining quality. Fast and secure PDF compression.',
    keywords: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'pdf optimizer', 'shrink pdf', 'pdf compression online', 'compress pdf online free', 'pdf size reducer', 'make pdf smaller', 'pdf file compressor', 'reduce pdf file size', 'pdf optimizer online', 'compress large pdf', 'pdf compression tool', 'small pdf', 'pdf minimizer'],
    path: '/dashboard/pdf-tools/pdf-compress'
  },
  'image-compressor': {
    title: 'Image Compressor',
    description: 'Compress images online without losing quality. Support for JPG, PNG, WebP. Free image optimization tool.',
    keywords: ['image compressor', 'compress image', 'image optimizer', 'reduce image size', 'photo compressor', 'compress jpg', 'compress png', 'image compression online', 'optimize images', 'reduce photo size', 'image size reducer', 'compress images online free', 'photo optimizer', 'image file compressor', 'bulk image compressor', 'resize image', 'compress picture'],
    path: '/dashboard/image-tools/image-compressor'
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter',
    description: 'Convert PDF pages to JPG images online. Free PDF to image converter with high quality output.',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf', 'pdf converter', 'pdf to jpeg'],
    path: '/dashboard/pdf-tools/pdf-to-jpg'
  },
  'text-summarizer': {
    title: 'Text Summarizer',
    description: 'Summarize long text instantly with AI. Extract key points and create concise summaries from articles and documents.',
    keywords: ['text summarizer', 'ai summarizer', 'summarize text', 'text summary', 'article summarizer', 'auto summarizer', 'document summarizer', 'paragraph summarizer', 'summary generator', 'text shortener', 'content summarizer', 'ai text summary', 'automatic summarization', 'extract key points', 'summarize article online', 'free text summarizer'],
    path: '/dashboard/text-tools/text-summarizer'
  },
  'password-generator': {
    title: 'Password Generator',
    description: 'Generate strong, secure passwords online. Customizable length and character sets for maximum security.',
    keywords: ['password generator', 'strong password', 'secure password', 'random password', 'password maker', 'generate password online', 'password creator', 'safe password generator', 'complex password generator', 'password generator free', 'create strong password', 'password tool', 'secure password maker', 'random password generator', 'password strength', 'unique password generator'],
    path: '/dashboard/security-tools/password-generator'
  },
  'color-picker': {
    title: 'Color Picker Tool',
    description: 'Pick colors from images or generate color palettes. Get HEX, RGB, HSL values instantly.',
    keywords: ['color picker', 'color tool', 'hex color', 'rgb color', 'color palette', 'color picker online', 'hex color picker', 'rgb color picker', 'color code picker', 'eyedropper tool', 'color selector', 'color finder', 'color extractor', 'color palette generator', 'color scheme generator', 'web color picker', 'html color picker'],
    path: '/dashboard/developer-tools/color-picker'
  },
  'code-formatter': {
    title: 'Code Formatter',
    description: 'Format and beautify your code online. Support for JavaScript, HTML, CSS, JSON, and more.',
    keywords: ['code formatter', 'code beautifier', 'format code', 'pretty print', 'code indenter', 'javascript formatter', 'html formatter', 'css formatter', 'json formatter', 'code prettifier', 'format javascript', 'format html', 'format css', 'beautify code', 'code organizer', 'online code formatter', 'free code formatter'],
    path: '/dashboard/developer-tools/code-formatter'
  },
  'gradient-generator': {
    title: 'CSS Gradient Generator',
    description: 'Create beautiful CSS gradients with live preview. Linear and radial gradients with custom colors.',
    keywords: ['gradient generator', 'css gradient', 'linear gradient', 'radial gradient', 'gradient maker', 'css gradient generator', 'gradient creator', 'background gradient', 'gradient tool', 'color gradient', 'gradient background generator', 'css gradient maker', 'online gradient generator', 'gradient code generator', 'web gradient generator'],
    path: '/dashboard/design-tools/gradient-generator'
  },
  'ai-content-writer': {
    title: 'AI Content Writer',
    description: 'Generate high-quality content with AI. Create articles, blogs, and marketing copy instantly.',
    keywords: ['ai content writer', 'ai writing', 'content generator', 'ai copywriter', 'auto writer', 'ai article writer', 'ai blog writer', 'content creation ai', 'ai writing assistant', 'automatic content generator', 'ai text generator', 'content writing ai', 'ai marketing copy', 'ai content creation', 'write with ai', 'ai writing tool'],
    path: '/dashboard/ai-tools/ai-content-writer'
  },
  'timestamp-converter': {
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Support for multiple formats.',
    keywords: ['timestamp converter', 'unix timestamp', 'epoch converter', 'date converter', 'time converter'],
    path: '/dashboard/utility-tools/timestamp-converter'
  },
  'pdf-split': {
    title: 'PDF Splitter',
    description: 'Split PDF files into separate pages or extract specific pages. Free online PDF splitting tool.',
    keywords: ['pdf split', 'pdf splitter', 'split pdf pages', 'extract pdf pages', 'pdf separator'],
    path: '/dashboard/pdf-tools/pdf-split'
  },
  'image-format-converter': {
    title: 'Image Format Converter',
    description: 'Convert images between different formats: JPG, PNG, WebP, GIF, BMP. Free online image converter.',
    keywords: ['image converter', 'format converter', 'jpg to png', 'png to jpg', 'webp converter'],
    path: '/dashboard/image-tools/image-format-converter'
  },
  'background-remover': {
    title: 'Background Remover',
    description: 'Remove backgrounds from images automatically using AI. Create transparent PNG images instantly.',
    keywords: ['background remover', 'remove background', 'transparent background', 'ai background removal'],
    path: '/dashboard/image-tools/background-remover'
  },
  'markdown-editor': {
    title: 'Markdown Editor',
    description: 'Write and preview Markdown with live preview. Export to HTML or download as MD file.',
    keywords: ['markdown editor', 'md editor', 'markdown preview', 'markdown to html', 'live preview'],
    path: '/dashboard/text-tools/markdown-editor'
  },
  'json-formatter': {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data. Minify JSON or convert to other formats.',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'format json'],
    path: '/dashboard/developer-tools/json-formatter'
  },
  'css-minifier': {
    title: 'CSS Minifier',
    description: 'Minify CSS code to reduce file size. Compress CSS for faster website loading.',
    keywords: ['css minifier', 'css compressor', 'minify css', 'compress css', 'css optimizer'],
    path: '/dashboard/developer-tools/css-minifier'
  },
  'html-validator': {
    title: 'HTML Validator',
    description: 'Validate HTML code for errors and compliance. Check HTML syntax and structure.',
    keywords: ['html validator', 'html checker', 'validate html', 'html syntax checker', 'html errors'],
    path: '/dashboard/developer-tools/html-validator'
  },
  'logo-maker': {
    title: 'Logo Maker',
    description: 'Create professional logos with customizable templates. Design logos for your brand.',
    keywords: ['logo maker', 'logo creator', 'logo generator', 'design logo', 'brand logo'],
    path: '/dashboard/design-tools/logo-maker'
  },
  'favicon-generator': {
    title: 'Favicon Generator',
    description: 'Generate favicons from images. Create ICO files and all favicon sizes for websites.',
    keywords: ['favicon generator', 'favicon creator', 'ico generator', 'website icon', 'favicon maker'],
    path: '/dashboard/design-tools/favicon-generator'
  },
  'ai-code-generator': {
    title: 'AI Code Generator',
    description: 'Generate code snippets with AI. Create functions, classes, and complete programs instantly.',
    keywords: ['ai code generator', 'code generator', 'ai programming', 'generate code', 'ai coding assistant'],
    path: '/dashboard/ai-tools/ai-code-generator'
  },
  'random-generator': {
    title: 'Random Generator',
    description: 'Generate random numbers, strings, passwords, and data. Customizable random data generator.',
    keywords: ['random generator', 'random number', 'random string', 'random data', 'number generator'],
    path: '/dashboard/utility-tools/random-generator'
  },
  'wifi-qr': {
    title: 'WiFi QR Code Generator',
    description: 'Generate QR codes for WiFi networks. Share WiFi passwords easily with QR codes.',
    keywords: ['wifi qr code', 'wifi qr generator', 'wifi password qr', 'share wifi', 'wifi qr'],
    path: '/dashboard/utility-tools/wifi-qr'
  },
  'expense-tracker': {
    title: 'Expense Tracker',
    description: 'Track your expenses and manage budget. Simple expense tracking tool with categories.',
    keywords: ['expense tracker', 'budget tracker', 'expense manager', 'money tracker', 'spending tracker'],
    path: '/dashboard/utility-tools/expense-tracker'
  },
  'network-scanner': {
    title: 'Network Scanner',
    description: 'Scan network for security vulnerabilities. Check open ports and network security.',
    keywords: ['network scanner', 'port scanner', 'security scanner', 'network security', 'vulnerability scanner'],
    path: '/dashboard/security-tools/network-scanner'
  }
};