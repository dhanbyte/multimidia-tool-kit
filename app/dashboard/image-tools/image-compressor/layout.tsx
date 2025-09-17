import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['image-compressor']);

export default function ImageCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}