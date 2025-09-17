import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['color-picker']);

export default function ColorPickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}