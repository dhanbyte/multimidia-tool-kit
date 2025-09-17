export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MediaTools Pro",
    "description": "Free online tools for PDF compression, image optimization, QR code generation, typing tests, and more.",
    "url": "https://dhanbyte.me",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "dhanbyte",
      "url": "https://dhanbyte.me"
    },
    "featureList": [
      "PDF Compression",
      "Image Compression", 
      "QR Code Generation",
      "Typing Speed Test",
      "Text Summarization",
      "Password Generation",
      "Color Picker",
      "Code Formatting",
      "Gradient Generation",
      "AI Content Writing"
    ],
    "screenshot": "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}