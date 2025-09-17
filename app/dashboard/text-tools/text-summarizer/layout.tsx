import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['text-summarizer']);

export default function TextSummarizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}