// app/api/tiktok-download/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      console.error("API Error: URL is missing.");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const rapidApiKey = process.env.RAPIDAPI_TIKTOK_KEY;
    const rapidApiHost = process.env.RAPIDAPI_TIKTOK_HOST;

    // IMPORTANT: Log environment variables to check if they are loaded
    console.log("RAPIDAPI_TIKTOK_KEY loaded:", !!rapidApiKey); // Should be true
    console.log("RAPIDAPI_TIKTOK_HOST loaded:", !!rapidApiHost); // Should be true

    if (!rapidApiKey || !rapidApiHost) {
      console.error("API Error: RapidAPI key or host is not configured.");
      return NextResponse.json(
        { error: "Server configuration error: RapidAPI credentials missing." },
        { status: 500 }
      );
    }

    const apiUrl = `https://${rapidApiHost}/media?videoUrl=${encodeURIComponent(url)}`;
    console.log("Attempting to fetch from RapidAPI URL:", apiUrl);

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": rapidApiHost,
      },
    };

    const response = await fetch(apiUrl, options);

    // Log the raw response status and headers *before* checking response.ok
    console.log("RapidAPI Response Status:", response.status);
    console.log("RapidAPI Response Headers:", Object.fromEntries(response.headers.entries()));


    if (!response.ok) {
      const errorText = await response.text(); // Get raw error response
      console.error("RapidAPI Error Response Text:", errorText);
      // Attempt to parse as JSON if it looks like JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.error("RapidAPI Error Response JSON:", errorJson);
        throw new Error(errorJson.message || `RapidAPI responded with status ${response.status}`);
      } catch (e) {
        // Not JSON, just throw the text
        throw new Error(`RapidAPI responded with status ${response.status}: ${errorText}`);
      }
    }

    // Define 'data' *after* checking if the response was OK, and before logging it
    const data = await response.json();
    console.log("RapidAPI Successful Data Response:", data); // Log the full successful response here

    // Verify expected data structure
    if (!data || (!data.video?.no_watermark && !data.video?.watermark)) {
        console.error("RapidAPI response missing expected video download URL:", data);
        throw new Error("RapidAPI did not return a valid video download URL.");
    }

    return NextResponse.json({
      success: true,
      data: {
        title: data?.title || "TikTok Video",
        author: data?.author || "Unknown",
        downloadUrl: data?.video?.no_watermark || data?.video?.watermark,
        thumbnail: data?.thumbnail,
        duration: data?.duration || "00:00",
        likes: data?.likes || "0",
        comments: data?.comments || "0",
        shares: data?.shares || "0",
      },
    });
  } catch (error: any) {
    console.error("TikTok download API route error:", error); // Log the full error object
    return NextResponse.json(
      { error: error.message || "Failed to process TikTok video" },
      { status: 500 }
    );
  }
}