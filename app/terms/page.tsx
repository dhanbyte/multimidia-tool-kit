import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - MultiTool by Dhanbyte | Usage Guidelines",
  description: "Read MultiTool's terms of service. Understand your rights and responsibilities when using our 100+ free online tools. Fair usage policy and guidelines.",
  keywords: "terms of service, usage policy, multitool terms, dhanbyte terms, user agreement, tool usage guidelines",
  alternates: {
    canonical: "https://dhanbyte.me/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By using MultiTool by Dhanbyte, you agree to these terms. If you don't agree, please don't use our services.
        </p>

        <h2>Service Description</h2>
        <p>
          MultiTool provides 100+ free online tools for PDF conversion, image editing, text processing, and more. All processing happens in your browser.
        </p>

        <h2>User Responsibilities</h2>
        <ul>
          <li>Use tools for lawful purposes only</li>
          <li>Don't attempt to harm or overload our systems</li>
          <li>Respect intellectual property rights</li>
          <li>Don't use tools for illegal content processing</li>
        </ul>

        <h2>Service Availability</h2>
        <p>
          We strive for 99.9% uptime but cannot guarantee uninterrupted service. Tools are provided "as is" without warranties.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          MultiTool by Dhanbyte is not liable for any damages arising from tool usage. Use at your own risk.
        </p>

        <h2>Contact</h2>
        <p>Questions about terms? Email: support@dhanbyte.me</p>
      </div>
    </div>
  )
}