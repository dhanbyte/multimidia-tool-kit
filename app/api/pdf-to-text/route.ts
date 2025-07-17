import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
    }

    // Demo response - replace with actual RapidAPI integration
    if (process.env.NODE_ENV === "development" || !process.env.RAPIDAPI_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          text: `Sample Document Title

This is a sample text extracted from a PDF document. This demonstrates how the PDF to text conversion works.

Key Features:
• Accurate text extraction
• Preserves formatting where possible
• Handles multiple pages
• Supports various PDF types

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Conclusion:
This tool can extract text from any PDF document quickly and accurately. Perfect for digitizing documents, creating searchable content, or converting PDFs to editable text.`,
          pages: 3,
          filename: file.name,
        },
      })
    }

    // RapidAPI PDF to Text Integration
    const pdfFormData = new FormData()
    pdfFormData.append("file", file)

    const options = {
      method: "POST",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "pdf-to-text-converter-api.p.rapidapi.com",
      },
      body: pdfFormData,
    }

    const response = await fetch("https://pdf-to-text-converter-api.p.rapidapi.com/convert", options)

    if (!response.ok) {
      throw new Error("Failed to convert PDF to text")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        text: data.text || data.content,
        pages: data.pages || 1,
        filename: file.name,
      },
    })
  } catch (error: any) {
    console.error("PDF to text error:", error)
    return NextResponse.json({ error: "Failed to convert PDF to text" }, { status: 500 })
  }
}
