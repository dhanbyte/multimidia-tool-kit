import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    // Demo response - replace with actual RapidAPI integration
    if (process.env.NODE_ENV === "development" || !process.env.RAPIDAPI_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          url: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(file.name)}`,
          filename: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        },
      })
    }

    // RapidAPI Image Hosting Integration
    const imageFormData = new FormData()
    imageFormData.append("image", file)

    const options = {
      method: "POST",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "image-hosting-api.p.rapidapi.com",
      },
      body: imageFormData,
    }

    const response = await fetch("https://image-hosting-api.p.rapidapi.com/upload", options)

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        url: data.url || data.image_url,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Image upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
