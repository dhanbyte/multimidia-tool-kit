/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // Autoprefixer को यहां जोड़ना महत्वपूर्ण है ताकि CSS आउटपुट में वेंडर प्रीफिक्स स्वचालित रूप से जुड़ सकें।
    // यह विभिन्न ब्राउज़रों में संगतता सुनिश्चित करता है, जो SEO के लिए अच्छा है।
    autoprefixer: {},
  },
};

export default config;