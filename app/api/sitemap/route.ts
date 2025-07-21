// app/api/sitemap/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://dhanbyte.me";

  const routes = [
    "/", // Homepage
    "/dashboard/image-compressor",
    "/dashboard/social-media-bio-generator",
    "/dashboard/text-to-image",
    "/dashboard/image-hosting",
    "/dashboard/pdf-to-jpg",
    "/dashboard/pdf-to-text",
    "/dashboard/qr-generator",
    "/dashboard/voice-cleaner",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    routes.map((route) => {
      return `<url><loc>${baseUrl}${route}</loc></url>`;
    }).join("") +
    `</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
