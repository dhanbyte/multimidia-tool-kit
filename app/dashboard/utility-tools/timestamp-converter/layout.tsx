import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['timestamp-converter']);

export default function TimestampConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}