'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AIEmailWriter() {
  const [emailType, setEmailType] = useState('business');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const emailTypes = [
    { value: 'business', label: 'Business Email' },
    { value: 'follow-up', label: 'Follow-up Email' },
    { value: 'thank-you', label: 'Thank You Email' },
    { value: 'apology', label: 'Apology Email' },
    { value: 'invitation', label: 'Invitation Email' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' }
  ];

  const generateEmail = async () => {
    if (!purpose.trim()) {
      toast.error('Please describe the purpose of your email');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const email = `Subject: ${purpose}

Dear ${recipient || 'Recipient'},

I hope this email finds you well.

${purpose}. I wanted to reach out regarding this matter as it's important for our ${emailType === 'business' ? 'business relationship' : 'collaboration'}.

${tone === 'professional' ? 'I would appreciate your prompt attention to this matter.' : 'I look forward to hearing from you soon.'}

${tone === 'formal' ? 'Thank you for your time and consideration.' : 'Thanks for your help!'}

Best regards,
[Your Name]

---
This email was generated using AI. Please review and customize as needed.`;

      setGeneratedEmail(email);
      setIsGenerating(false);
      toast.success('Email generated!');
    }, 2000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">AI Email Writer</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Generate Emails with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Type</label>
                <Select value={emailType} onValueChange={setEmailType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Name (Optional)</label>
              <Input
                placeholder="e.g., John Smith"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Purpose/Topic</label>
              <Textarea
                placeholder="Describe what this email is about..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={generateEmail} disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generating Email...' : 'Generate Email'}
            </Button>
          </CardContent>
        </Card>

        {generatedEmail && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Email</CardTitle>
                <Button onClick={copyEmail} size="sm">
                  <Copy className="h-4 w-4 mr-2" />Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={generatedEmail} readOnly rows={12} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}