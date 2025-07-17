import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, size = 256, type = "text" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Demo response - replace with actual RapidAPI integration
    if (process.env.NODE_ENV === "development" || !process.env.RAPIDAPI_KEY) {
      // Return a placeholder QR code
      return NextResponse.json({
        success: true,
        qrCode: `/placeholder.svg?height=${size}&width=${size}`,
      })
    }

    // RapidAPI QR Code Generator Integration
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "qr-code-generator26.p.rapidapi.com",
      },
    }

    const encodedText = encodeURIComponent(text)
    const apiUrl = `https://qr-code-generator26.p.rapidapi.com/qr?data=${encodedText}&size=${size}x${size}&format=png`

    const response = await fetch(apiUrl, options)

    if (!response.ok) {
      throw new Error("Failed to generate QR code")
    }

    // If the API returns an image directly
    if (response.headers.get("content-type")?.includes("image")) {
      const imageBuffer = await response.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString("base64")
      const dataUrl = `data:image/png;base64,${base64Image}`

      return NextResponse.json({
        success: true,
        qrCode: dataUrl,
      })
    }

    // If the API returns JSON with image URL
    const data = await response.json()

    return NextResponse.json({
      success: true,
      qrCode: data.qr_code || data.url || data.image,
    })
  } catch (error: any) {
    console.error("QR generation error:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
