// app/api/text-to-image/route.ts
// This code is for Next.js App Router (version 13+)
import { type NextRequest, NextResponse } from "next/server";
// If you're using axios for internal calls, you'd import it here:
// import axios from 'axios'; // Make sure axios is installed if you use it

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = "realistic", size = "512x512" } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

    if (!STABILITY_API_KEY) {
      console.error("STABILITY_API_KEY is not set in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error: API key missing." },
        { status: 500 }
      );
    }

    // --- Placeholder/Development Response (Optional, but good for local dev) ---
    // Uncomment this block if you want to test the UI without consuming Stability AI credits
    // during development, or if your API key isn't ready.
    /*
    if (process.env.NODE_ENV === "development") {
        console.warn("Using placeholder response for text-to-image API in development mode.");
        const [widthPlaceholder, heightPlaceholder] = size.split('x').map(Number);
        const placeholderWidth = isNaN(widthPlaceholder) ? 512 : widthPlaceholder;
        const placeholderHeight = isNaN(placeholderHeight) ? 512 : heightPlaceholder;
        return NextResponse.json({
            success: true,
            data: {
                imageUrl: `/placeholder.svg?height=${placeholderHeight}&width=${placeholderWidth}&text=${encodeURIComponent("AI Generated: " + prompt.substring(0, 30) + "...")}`,
                prompt: prompt,
                style: style,
                size: size,
                generatedAt: new Date().toISOString(),
            },
        });
    }
    */
    // --- End Placeholder/Development Response ---

    const API_HOST = 'https://api.stability.ai'; // This is the standard host
    const ENGINE_ID = 'stable-diffusion-v1-6'; // Ensure this matches your desired engine

    const [widthStr, heightStr] = size.split('x');
    const width = Number.parseInt(widthStr);
    const height = Number.parseInt(heightStr);

    if (isNaN(width) || isNaN(height)) {
        return NextResponse.json({ error: "Invalid size format. Please use 'WIDTHxHEIGHT' (e.g., '512x512')." }, { status: 400 });
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Important: We're asking for JSON response containing base64 data
        "Authorization": `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          { text: prompt, weight: 1 },
        ],
        cfg_scale: 7,
        height: height,
        width: width,
        steps: 30,
        samples: 1, // Number of images to generate
        seed: 0,
      }),
    };

    const response = await fetch(
      `${API_HOST}/v1/generation/${ENGINE_ID}/text-to-image`,
      options
    );

    // Stability AI often returns a JSON object with 'artifacts' array on success.
    // If it returns an error, it might still be JSON.
    if (!response.ok) {
        const errorText = await response.text(); // Get raw text first
        let errorData;
        try {
            errorData = JSON.parse(errorText); // Try parsing as JSON
        } catch (parseError) {
            errorData = { message: errorText || "Unknown error from Stability AI" }; // Fallback to raw text
        }
        console.error("Stability AI API error (backend):", errorData);
        return NextResponse.json(
            { error: "Failed to generate image from AI service", details: errorData.message || JSON.stringify(errorData) },
            { status: response.status || 500 }
        );
    }

    const data = await response.json(); // Parse the response as JSON

    if (!data.artifacts || data.artifacts.length === 0) {
      console.error("Stability AI response missing artifacts array or empty:", data);
      return NextResponse.json(
          { error: "AI service did not return an image. No artifacts found." },
          { status: 500 }
      );
    }

    const base64Image = data.artifacts[0].base64;

    if (!base64Image) {
        console.error("Stability AI artifact missing base64 data:", data.artifacts[0]);
        return NextResponse.json(
            { error: "AI service returned an artifact but no base64 image data." },
            { status: 500 }
        );
    }
     


    
    // Construct the data URL expected by your frontend
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: imageUrl, // This is the full data URL
        prompt: prompt,
        style: style,
        size: size,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Text to image API handler caught an error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}