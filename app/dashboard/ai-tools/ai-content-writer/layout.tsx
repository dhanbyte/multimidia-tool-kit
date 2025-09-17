import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['ai-content-writer']);

export default function AIContentWriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}