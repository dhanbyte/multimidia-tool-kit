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
    keywords: ['typing test', 'typing speed', 'typing practice', 'wpm test', 'keyboard skills', 'typing master', 'speed typing'],
    path: '/dashboard/typing-master'
  },
  'qr-generator': {
    title: 'QR Code Generator',
    description: 'Generate QR codes instantly for text, URLs, WiFi, and more. Free, fast, and customizable QR code maker.',
    keywords: ['qr code generator', 'qr maker', 'free qr code', 'qr code creator', 'barcode generator'],
    path: '/dashboard/qr-generator'
  },
  'pdf-compress': {
    title: 'PDF Compressor',
    description: 'Compress PDF files online for free. Reduce PDF size while maintaining quality. Fast and secure PDF compression.',
    keywords: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'pdf optimizer', 'shrink pdf'],
    path: '/dashboard/pdf-tools/pdf-compress'
  },
  'image-compressor': {
    title: 'Image Compressor',
    description: 'Compress images online without losing quality. Support for JPG, PNG, WebP. Free image optimization tool.',
    keywords: ['image compressor', 'compress image', 'image optimizer', 'reduce image size', 'photo compressor'],
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
    keywords: ['text summarizer', 'ai summarizer', 'summarize text', 'text summary', 'article summarizer'],
    path: '/dashboard/text-tools/text-summarizer'
  },
  'password-generator': {
    title: 'Password Generator',
    description: 'Generate strong, secure passwords online. Customizable length and character sets for maximum security.',
    keywords: ['password generator', 'strong password', 'secure password', 'random password', 'password maker'],
    path: '/dashboard/security-tools/password-generator'
  },
  'color-picker': {
    title: 'Color Picker Tool',
    description: 'Pick colors from images or generate color palettes. Get HEX, RGB, HSL values instantly.',
    keywords: ['color picker', 'color tool', 'hex color', 'rgb color', 'color palette'],
    path: '/dashboard/developer-tools/color-picker'
  },
  'code-formatter': {
    title: 'Code Formatter',
    description: 'Format and beautify your code online. Support for JavaScript, HTML, CSS, JSON, and more.',
    keywords: ['code formatter', 'code beautifier', 'format code', 'pretty print', 'code indenter'],
    path: '/dashboard/developer-tools/code-formatter'
  },
  'gradient-generator': {
    title: 'CSS Gradient Generator',
    description: 'Create beautiful CSS gradients with live preview. Linear and radial gradients with custom colors.',
    keywords: ['gradient generator', 'css gradient', 'linear gradient', 'radial gradient', 'gradient maker'],
    path: '/dashboard/design-tools/gradient-generator'
  },
  'ai-content-writer': {
    title: 'AI Content Writer',
    description: 'Generate high-quality content with AI. Create articles, blogs, and marketing copy instantly.',
    keywords: ['ai content writer', 'ai writing', 'content generator', 'ai copywriter', 'auto writer'],
    path: '/dashboard/ai-tools/ai-content-writer'
  },
  'timestamp-converter': {
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Support for multiple formats.',
    keywords: ['timestamp converter', 'unix timestamp', 'epoch converter', 'date converter', 'time converter'],
    path: '/dashboard/utility-tools/timestamp-converter'
  }
};