/** @type {import('next').NextConfig} */
const nextConfig = {
  // `trailingSlash: true` कुछ मामलों में उपयोगी हो सकता है, लेकिन
  // आधुनिक SEO के लिए, यह आमतौर पर अनावश्यक होता है और डुप्लिकेट सामग्री
  // से बचने के लिए इसे हटा देना या `false` पर सेट करना बेहतर होता है।
  // मैं इसे आपके कोड में नहीं बदल रहा हूँ, लेकिन आपको ध्यान रखना चाहिए।
  // trailingSlash: true,

  // ESLint और TypeScript त्रुटियों को बिल्ड के दौरान अनदेखा करना
  // डेवलपमेंट के लिए ठीक है, लेकिन प्रोडक्शन में इन्हें ठीक करना चाहिए।
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 'images.unoptimized: true' का उपयोग अक्सर डेवलपमेंट या
  // जब Next.js की इमेज ऑप्टिमाइजेशन की आवश्यकता न हो तब किया जाता है।
  // प्रोडक्शन में, इमेज ऑप्टिमाइजेशन को इनेबल रखना SEO के लिए बेहतर है।
  // इसे हटाने से Next.js की ऑप्टिमाइजेशन स्वतः इनेबल हो जाएगी।
  // चूंकि आपका टूल JPGs उत्पन्न करता है, यह सेटिंग शायद सीधे
  // कनवर्टर आउटपुट को प्रभावित नहीं करती है, लेकिन वेबसाइट पर अन्य इमेज के लिए महत्वपूर्ण है।
  images: {
    unoptimized: true,
  },
  // Webpack कॉन्फ़िगरेशन कुछ लाइब्रेरियों, जैसे pdfjs-dist,
  // के साथ संगतता समस्याओं को हल करने में मदद कर सकता है।
  webpack: (config, { isServer }) => {
    // ब्राउज़र वातावरण में अनावश्यक Node.js मॉड्यूल को छोड़ दें
    if (!isServer) {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
    }
    return config;
  },
};

export default nextConfig;