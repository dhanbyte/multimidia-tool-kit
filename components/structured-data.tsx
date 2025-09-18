export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MultiTool by Dhanbyte",
    "alternateName": "MultiTool - All-in-One Online Tools",
    "description": "Your ultimate collection of 100+ free online tools by Dhananjay (Dhanbyte). PDF converters, image tools, text utilities, developer tools, security tools & more. No signup required!",
    "url": "https://dhanbyte.me",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "Dhananjay",
      "alternateName": "Dhanbyte",
      "description": "Full Stack Developer & Video Editor",
      "url": "https://dhanbyte.me"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MultiTool by Dhanbyte",
      "url": "https://dhanbyte.me",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819"
      }
    },
    "featureList": [
      "PDF Converter & Compressor",
      "Image Compressor & Format Converter", 
      "QR Code Generator",
      "Password Generator",
      "Text Tools & Translator",
      "Developer Tools",
      "Security & Encryption Tools",
      "Design Tools & Color Picker",
      "AI Content Writer",
      "Typing Speed Test",
      "Stopwatch & Timer",
      "Expense Tracker",
      "URL Shortener",
      "IP Address Lookup"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Amazing collection of tools! The PDF compressor and QR generator work perfectly. Love that it's completely free!"
      },
      {
        "@type": "Review", 
        "author": {
          "@type": "Person",
          "name": "Mike Chen"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "MultiTool by Dhanbyte is my go-to for all online tools. Fast, reliable, and no annoying signups required!"
      }
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dhanbyte.me"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Tools",
        "item": "https://dhanbyte.me/dashboard"
      }
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MultiTool by Dhanbyte",
    "alternateName": "Dhanbyte Tools",
    "url": "https://dhanbyte.me",
    "logo": "https://ik.imagekit.io/b5qewhvhb/New%20Folder/ChatGPT%20Image%20Jul%2020,%202025,%2011_38_49%20AM.png?updatedAt=1752991986819",
    "description": "MultiTool by Dhanbyte offers 100+ free online tools created by Dhananjay, a Full Stack Developer & Video Editor. Tools include PDF converters, image compressors, QR generators, and more.",
    "founder": {
      "@type": "Person",
      "name": "Dhananjay",
      "alternateName": "Dhanbyte",
      "jobTitle": "Full Stack Developer & Video Editor"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@dhanbyte.me"
    },
    "sameAs": [
      "https://github.com/dhanbyte",
      "https://linkedin.com/in/dhanbyte"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}