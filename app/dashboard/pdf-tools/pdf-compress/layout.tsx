import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['pdf-compress']);

export default function PDFCompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}