// app/api/qr-generate/route.ts
import { type NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const { text, size = 256, type = "text" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    let valueToEncode = text;

    // Format content based on type
    switch (type) {
      case "url":
        if (!/^https?:\/\//i.test(valueToEncode)) {
          valueToEncode = `https://${valueToEncode}`;
        }
        break;
      case "email":
        valueToEncode = `mailto:${valueToEncode}`;
        break;
      case "phone":
        valueToEncode = `tel:${valueToEncode}`;
        break;
      case "wifi":
        // Assume text is already in proper WIFI format
        break;
      case "text":
      default:
        // No change
        break;
    }

    const qrCodeDataUrl = await QRCode.toDataURL(valueToEncode, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "H",
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
    });
  } catch (error: any) {
    console.error("QR code generation error:", error);
    return NextResponse.json({ error: "Failed to generate QR code." }, { status: 500 });
  }
}
