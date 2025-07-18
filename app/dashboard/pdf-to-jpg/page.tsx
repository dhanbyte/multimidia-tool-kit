// app/dashboard/pdf-to-jpg/page.tsx
"use client"; // यह आवश्यक है!

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react'; // केवल Loader2 की आवश्यकता है

// Dynamic import for the PdfToJpgConverterClient component
// ssr: false का मतलब है कि यह कंपोनेंट सर्वर-साइड रेंडर नहीं होगा।
const DynamicPdfToJpgConverter = dynamic(
  () => import('@/components/PdfToJpgConverterClient'), // नई क्लाइंट-साइड फ़ाइल को इम्पोर्ट करें
  {
    ssr: false, // यह key है!
    loading: () => (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading PDF Converter...</span>
      </div>
    ),
  }
);

// डिफ़ॉल्ट एक्सपोर्ट जो dynamically लोडेड कंपोनेंट को रेंडर करता है
export default function PdfToJpgPage() {
  return <DynamicPdfToJpgConverter />;
}