import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Demo response - replace with actual RapidAPI integration
    if (process.env.NODE_ENV === "development" || !process.env.RAPIDAPI_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          title: type === "video" ? "Amazing Tutorial - Learn Web Development" : "Relaxing Music for Coding",
          downloadUrl: "/placeholder.svg?height=200&width=300",
          thumbnail: "/placeholder.svg?height=200&width=300",
          duration: type === "video" ? "15:42" : "3:28",
          views: "1.2M",
          likes: "45K",
          channel: type === "video" ? "CodeMaster" : "ChillBeats",
          type: type,
          quality: type === "video" ? "1080p" : "320kbps",
        },
      })
    }

    // RapidAPI YouTube Downloader Integration
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": type === "audio" ? "youtube-mp36.p.rapidapi.com" : "youtube-video-download1.p.rapidapi.com",
      },
    }

    const videoId = extractVideoId(url)
    const apiUrl =
      type === "audio"
        ? `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`
        : `https://youtube-video-download1.p.rapidapi.com/dl?id=${videoId}`

    const response = await fetch(apiUrl, options)

    if (!response.ok) {
      throw new Error("Failed to fetch video data")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        title: data.title || "YouTube Video",
        downloadUrl: data.link || data.url,
        thumbnail: data.thumbnail,
        duration: data.duration,
        type: type,
        quality: type === "video" ? "1080p" : "320kbps",
      },
    })
  } catch (error: any) {
    console.error("YouTube download error:", error)
    return NextResponse.json({ error: "Failed to process YouTube video" }, { status: 500 })
  }
}

function extractVideoId(url: string): string {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : ""
}
