import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['qr-generator']);

export default function QRGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}