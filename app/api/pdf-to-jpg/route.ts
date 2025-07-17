import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const quality = (formData.get("quality") as string) || "high"
    const resolution = (formData.get("resolution") as string) || "300"

    if (!file) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
    }

    // Demo response - replace with actual RapidAPI integration
    if (process.env.NODE_ENV === "development" || !process.env.RAPIDAPI_KEY) {
      const demoImages = [
        {
          id: 1,
          pageNumber: 1,
          url: "/placeholder.svg?height=400&width=300&text=Page 1",
          filename: "page-1.jpg",
          size: 245760,
        },
        {
          id: 2,
          pageNumber: 2,
          url: "/placeholder.svg?height=400&width=300&text=Page 2",
          filename: "page-2.jpg",
          size: 198432,
        },
        {
          id: 3,
          pageNumber: 3,
          url: "/placeholder.svg?height=400&width=300&text=Page 3",
          filename: "page-3.jpg",
          size: 267891,
        },
      ]

      return NextResponse.json({
        success: true,
        data: {
          images: demoImages,
          totalPages: demoImages.length,
          quality: quality,
          resolution: resolution,
        },
      })
    }

    // RapidAPI PDF to JPG Integration
    const pdfFormData = new FormData()
    pdfFormData.append("file", file)
    pdfFormData.append("quality", quality)
    pdfFormData.append("dpi", resolution)

    const options = {
      method: "POST",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "pdf-to-jpg-converter-api.p.rapidapi.com",
      },
      body: pdfFormData,
    }

    const response = await fetch("https://pdf-to-jpg-converter-api.p.rapidapi.com/convert", options)

    if (!response.ok) {
      throw new Error("Failed to convert PDF to JPG")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        images: data.images || [],
        totalPages: data.totalPages || 0,
        quality: quality,
        resolution: resolution,
      },
    })
  } catch (error: any) {
    console.error("PDF to JPG error:", error)
    return NextResponse.json({ error: "Failed to convert PDF to JPG" }, { status: 500 })
  }
}
