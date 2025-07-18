// app/api/twitter-download/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // RapidAPI key का पर्यावरण वेरिएबल से प्राप्त करें
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    // यदि विकास मोड में है या RAPIDAPI_KEY सेट नहीं है, तो डेमो रिस्पांस दें
    if (process.env.NODE_ENV === "development" || !rapidApiKey) {
      console.warn("Using demo response for Twitter download. Set RAPIDAPI_KEY in .env.local for live functionality.");
      return NextResponse.json({
        success: true,
        data: {
          title: "Demo Tweet Title! Check out this amazing content...",
          author: "DemoUser",
          username: "@demouser",
          downloadUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4", // एक वास्तविक MP4 डेमो URL
          thumbnail: "https://placehold.co/600x400/png?text=Demo+Video",
          type: "video",
          duration: "0:30",
          likes: "1.2K",
          retweets: "450",
          comments: "120",
          createdAt: "2024-07-18T10:00:00Z",
          verified: true,
        },
      });
    }

    // RapidAPI Twitter Video Downloader Integration
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": "twitter-video-downloader-download-twitter-videos1.p.rapidapi.com",
      },
    };

    const response = await fetch(
      `https://twitter-video-downloader-download-twitter-videos1.p.rapidapi.com/status?url=${encodeURIComponent(url)}`,
      options,
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("RapidAPI Twitter download failed:", errorData);
      throw new Error(errorData.message || "Failed to fetch Twitter video data from RapidAPI");
    }

    const data = await response.json();

    // RapidAPI रिस्पांस के आधार पर डेटा को मैप करें
    const mediaType = data.media?.[0]?.type || "unknown"; // video, photo, animated_gif

    let downloadUrl = null;
    if (mediaType === "video" || mediaType === "animated_gif") {
        // वीडियो और GIF के लिए, सबसे अच्छी क्वालिटी वाला MP4 URL ढूंढें
        const videoVariant = data.media?.[0]?.video_info?.variants
            .filter((v: any) => v.content_type === "video/mp4")
            .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))
            ?.[0];
        downloadUrl = videoVariant?.url;
    } else if (mediaType === "photo") {
        // इमेज के लिए, सीधे इमेज URL उपयोग करें
        downloadUrl = data.media?.[0]?.url;
    }

    if (!downloadUrl) {
        throw new Error("No downloadable media found for the given Twitter URL.");
    }

    return NextResponse.json({
      success: true,
      data: {
        title: data.text || data.full_text || "Twitter Post", // ट्वीट का टेक्स्ट ही टाइटल होगा
        author: data.user?.name || "Unknown",
        username: `@${data.user?.screen_name || "unknown"}`,
        downloadUrl: downloadUrl,
        thumbnail: data.media?.[0]?.thumbnail_url || data.user?.profile_image_url_https, // मीडिया का थंबनेल या यूजर का प्रोफाइल इमेज
        type: mediaType, // mediaType को सीधे पास करें
        duration: data.media?.[0]?.video_info?.duration_millis ? `${Math.floor(data.media[0].video_info.duration_millis / 1000)}s` : null,
        likes: data.favorite_count?.toLocaleString() || "0",
        retweets: data.retweet_count?.toLocaleString() || "0",
        comments: data.reply_count?.toLocaleString() || "0", // RapidAPI से reply_count नहीं मिलता, तो 0 डिफ़ॉल्ट
        createdAt: data.created_at,
        verified: data.user?.verified || false,
      },
    });
  } catch (error: any) {
    console.error("Twitter download error:", error);
    return NextResponse.json({ error: error.message || "Failed to process Twitter content" }, { status: 500 });
  }
}