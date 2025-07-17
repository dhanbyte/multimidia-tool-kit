import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = "realistic", size = "512x512" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Demo response - replace with actual RapidAPI integration
    if (process.env.NODE_ENV === "development" || !process.env.RAPIDAPI_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          imageUrl: `/placeholder.svg?height=${size.split("x")[1]}&width=${size.split("x")[0]}&text=${encodeURIComponent("AI Generated: " + prompt.substring(0, 30) + "...")}`,
          prompt: prompt,
          style: style,
          size: size,
          generatedAt: new Date().toISOString(),
        },
      })
    }

    // RapidAPI Text to Image Integration
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "ai-text-to-image-generator-api.p.rapidapi.com",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 50,
          width: Number.parseInt(size.split("x")[0]),
          height: Number.parseInt(size.split("x")[1]),
          style: style,
        },
      }),
    }

    const response = await fetch("https://ai-text-to-image-generator-api.p.rapidapi.com/generate", options)

    if (!response.ok) {
      throw new Error("Failed to generate image")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: data.url || data.image || data.generated_image,
        prompt: prompt,
        style: style,
        size: size,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Text to image error:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
