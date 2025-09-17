import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['code-formatter']);

export default function CodeFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}