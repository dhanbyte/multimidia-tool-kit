import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - MultiTool by Dhanbyte | Your Data Protection",
  description: "Read MultiTool's privacy policy. Learn how we protect your data, what information we collect, and your rights. All file processing happens in your browser for maximum privacy.",
  keywords: "privacy policy, data protection, multitool privacy, dhanbyte privacy, user data security, file privacy",
  alternates: {
    canonical: "https://dhanbyte.me/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Introduction</h2>
        <p>
          At MultiTool by Dhanbyte, we protect your privacy. All file processing happens in your browser - we never store your files.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Contact information when you reach out to us</li>
          <li>Basic analytics data (IP, browser, pages visited)</li>
          <li>No files or personal documents are stored</li>
        </ul>

        <h2>File Processing</h2>
        <p>
          <strong>Important:</strong> All tools process files directly in your browser. Your files never leave your device and are never uploaded to our servers.
        </p>

        <h2>Contact Us</h2>
        <p>Questions about privacy? Email: support@dhanbyte.me</p>
      </div>
    </div>
  )
}