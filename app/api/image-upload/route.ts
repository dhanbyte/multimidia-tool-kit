import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // API expects image as base64 in x-www-form-urlencoded format
    const params = new URLSearchParams();
    params.append("image", base64Image);

    const response = await fetch("https://upload-images-hosting-get-url.p.rapidapi.com/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "aa6e53de16msh79dc702fe84431bp17a1ccjsn5e96fc3dae68",
        "X-RapidAPI-Host": "upload-images-hosting-get-url.p.rapidapi.com",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        url: data?.data?.url || data?.data?.display_url,
        filename: data?.data?.image?.filename || file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
