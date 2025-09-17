import { generateToolMetadata, toolsSEO } from '@/lib/seo';

export const metadata = generateToolMetadata(toolsSEO['gradient-generator']);

export default function GradientGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}