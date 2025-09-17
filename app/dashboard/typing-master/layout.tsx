import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['typing-master']);

export default function TypingMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}