import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Demo response - replace with actual RapidAPI integration
    if (process.env.NODE_ENV === "development" || !process.env.RAPIDAPI_KEY) {
      // Return demo data
      return NextResponse.json({
        success: true,
        data: {
          title: "Amazing Dance Video 🔥",
          author: "dance_queen_2024",
          downloadUrl: "/placeholder.svg?height=400&width=300",
          thumbnail: "/placeholder.svg?height=400&width=300",
          duration: "00:15",
          likes: "125.4K",
          comments: "8.2K",
          shares: "15.6K",
        },
      })
    }

    // RapidAPI TikTok Downloader Integration
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "tiktok-video-no-watermark2.p.rapidapi.com",
      },
    }

    const response = await fetch(
      `https://tiktok-video-no-watermark2.p.rapidapi.com/?url=${encodeURIComponent(url)}&hd=1`,
      options,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch video data")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        title: data.data?.title || "TikTok Video",
        author: data.data?.author?.unique_id || "Unknown",
        downloadUrl: data.data?.hdplay || data.data?.play,
        thumbnail: data.data?.cover,
        duration: data.data?.duration,
        likes: data.data?.statistics?.like_count || "0",
        comments: data.data?.statistics?.comment_count || "0",
        shares: data.data?.statistics?.share_count || "0",
      },
    })
  } catch (error: any) {
    console.error("TikTok download error:", error)
    return NextResponse.json({ error: "Failed to process TikTok video" }, { status: 500 })
  }
}
