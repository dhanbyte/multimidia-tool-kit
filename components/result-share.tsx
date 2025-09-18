'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Share2, Copy, Twitter, Facebook, Linkedin, Mail, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface ResultShareProps {
  title: string;
  result: any;
  resultType: 'text' | 'image' | 'file' | 'qr' | 'password' | 'note';
  toolName: string;
}

export function ResultShare({ title, result, resultType, toolName }: ResultShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const encodedResult = encodeURIComponent(JSON.stringify(result));
    return `${baseUrl}/shared/${toolName}?data=${encodedResult}`;
  };

  const copyResult = () => {
    let textToCopy = '';
    
    // For PDF to Word, just share a simple message about the tool
    if (toolName === 'PDF to Word Converter') {
      textToCopy = `Check out this amazing PDF to Word Converter tool! Convert your PDF files to editable Word documents instantly. Try it now: ${window.location.origin}/dashboard/pdf-to-word`;
    } else {
      // Keep original logic for other tools
      switch (resultType) {
        case 'text':
          textToCopy = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
          break;
        case 'password':
          textToCopy = result;
          break;
        case 'note':
          textToCopy = `${result.title}\n\n${result.content}`;
          break;
        case 'qr':
          textToCopy = `QR Code generated for: ${result}`;
          break;
        default:
          textToCopy = JSON.stringify(result, null, 2);
      }
    }
    
    navigator.clipboard.writeText(textToCopy);
    toast.success('Text copied to clipboard!');
  };

  const copyShareLink = () => {
    let shareLink = '';
    
    // For PDF to Word, share the tool page instead of result
    if (toolName === 'PDF to Word Converter') {
      shareLink = `${window.location.origin}/dashboard/pdf-to-word`;
    } else {
      shareLink = generateShareableLink();
    }
    
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied!');
  };

  const shareToSocial = (platform: string) => {
    let shareText = '';
    let shareLink = '';
    
    // For PDF to Word, share the tool page instead of result
    if (toolName === 'PDF to Word Converter') {
      shareText = `Check out this amazing PDF to Word Converter! Convert your PDF files to editable Word documents instantly.`;
      shareLink = `${window.location.origin}/dashboard/pdf-to-word`;
    } else {
      shareText = `Check out my ${title} result from ${toolName}!`;
      shareLink = generateShareableLink();
    }
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareLink)}`;
        break;
    }
    
    if (url) window.open(url, '_blank');
  };

  const downloadResult = () => {
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    switch (resultType) {
      case 'image':
      case 'qr':
        if (typeof result === 'string' && result.startsWith('data:')) {
          const link = document.createElement('a');
          link.href = result;
          link.download = `${toolName}-result-${Date.now()}.png`;
          link.click();
          toast.success('Image downloaded!');
          return;
        }
        break;
      case 'text':
      case 'password':
        content = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        filename = `${toolName}-result-${Date.now()}.txt`;
        break;
      case 'note':
        content = `${result.title}\n\n${result.content}`;
        filename = `${toolName}-note-${Date.now()}.txt`;
        break;
      default:
        content = JSON.stringify(result, null, 2);
        filename = `${toolName}-result-${Date.now()}.json`;
        mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Result downloaded!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Result
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Result Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Share Preview:</h4>
            {toolName === 'PDF to Word Converter' ? (
              <div className="text-sm p-3 bg-background rounded border">
                <p className="font-medium text-blue-600">🔄 PDF to Word Converter</p>
                <p className="text-muted-foreground mt-1">
                  Convert your PDF files to editable Word documents instantly. Fast, secure, and completely free!
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  📄 Supports text-based PDFs • ⚡ Instant conversion • 💾 Download as .doc
                </p>
              </div>
            ) : resultType === 'image' || resultType === 'qr' ? (
              <img src={result} alt="Result" className="max-w-full h-32 object-contain mx-auto" />
            ) : (
              <pre className="text-sm overflow-auto max-h-32">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={copyResult} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Result
            </Button>
            <Button variant="outline" onClick={downloadResult} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Share Options */}
          <div className="space-y-2">
            <h4 className="font-medium">Share with others:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={copyShareLink} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Social
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareToSocial('linkedin')}>
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareToSocial('email')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}