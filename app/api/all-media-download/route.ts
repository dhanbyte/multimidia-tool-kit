// app/api/all-media-download/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

// **आपका yt-dlp.exe का विशिष्ट पाथ यहाँ है।**
// आपने पुष्टि की है कि यह 'C:\Tools\yt-dlp.exe' है।
// Windows पाथ में बैकस्लैश को डबल करना सुनिश्चित करें (\\)
// या फॉरवर्ड स्लैश का उपयोग करें (/) जो Windows पर भी काम करता है।
const YTDLP_PATH = "C:\\Tools\\yt-dlp.exe";

export async function POST(request: NextRequest) {
  try {
    const { url, formatId, action } = await request.json(); // 'action' can be 'getInfo' or 'download'

    if (!url) {
      console.error("API Error: URL is required.");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Determine the temporary directory for downloads
    const tempDir = path.join(os.tmpdir(), "yt-dlp-downloads");
    await fs.mkdir(tempDir, { recursive: true });

    if (action === "download" && formatId) {
      // --- Action: Download the specific file ---
      // एक अस्थायी फ़ाइल नाम बनाएँ
      // ध्यान दें: yt-dlp स्वचालित रूप से सही एक्सटेंशन का पता लगाता है, लेकिन हम एक अनुमानित नाम दे रहे हैं।
      const filename = `media-${Date.now()}.${formatId.split('.').pop() || 'mp4'}`;
      const outputPath = path.join(tempDir, filename);

      console.log(`[API] Initiating download for URL: ${url}, Format ID: ${formatId}`);
      console.log(`[API] Temporary output path: ${outputPath}`);

      return new Promise((resolve) => {
        // कमांड को डबल कोट्स के साथ `YTDLP_PATH` और `outputPath` के लिए चलाएं
        const command = `"${YTDLP_PATH}" -f "${formatId}" -o "${outputPath}" --no-playlist "${url}"`;
        console.log(`[API] Executing download command: ${command}`);

        exec(command, { maxBuffer: 1024 * 1024 * 100 }, async (error, stdout, stderr) => { // Increased maxBuffer to 100MB
          if (error) {
            console.error(`[API ERROR] Download exec error: ${error.message}`);
            console.error(`[API ERROR] Download stderr: ${stderr}`);
            // यदि डाउनलोड विफल रहता है तो अस्थायी फ़ाइल को साफ करने का प्रयास करें
            try { await fs.unlink(outputPath); } catch (e) { /* ignore cleanup error */ }
            resolve(NextResponse.json({ error: stderr || "Failed to download media" }, { status: 500 }));
            return;
          }

          try {
            // सुनिश्चित करें कि फ़ाइल वास्तव में मौजूद है
            await fs.access(outputPath);
            const fileBuffer = await fs.readFile(outputPath);
            console.log(`[API] File read successfully: ${outputPath}, size: ${fileBuffer.length} bytes`);

            const headers = new Headers();
            headers.set("Content-Type", "application/octet-stream"); // Generic binary stream for download
            headers.set("Content-Disposition", `attachment; filename="${filename}"`); // ब्राउज़र को फ़ाइल डाउनलोड करने के लिए कहता है

            await fs.unlink(outputPath); // फ़ाइल भेजने के बाद अस्थायी फ़ाइल को साफ करें
            console.log(`[API] Temporary file deleted: ${outputPath}`);

            resolve(new NextResponse(fileBuffer, { headers }));
          } catch (fileError: any) {
            console.error(`[API ERROR] File read/delete error: ${fileError.message}`);
            resolve(NextResponse.json({ error: "Failed to read or send file" }, { status: 500 }));
          }
        });
      });
    } else {
      // --- Default Action: Get Video Information ---
      console.log(`[API] Initiating getInfo for URL: ${url}`);
      return new Promise((resolve) => {
        // `YTDLP_PATH` को डबल कोट्स के साथ कमांड चलाएं
        const command = `"${YTDLP_PATH}" --dump-json --no-playlist "${url}"`;
        console.log(`[API] Executing info command: ${command}`);

        exec(command, { maxBuffer: 1024 * 1024 * 20 }, async (error, stdout, stderr) => { // Increased maxBuffer to 20MB for info
          if (error) {
            console.error(`[API ERROR] Info exec error: ${error.message}`);
            console.error(`[API ERROR] Info stderr: ${stderr}`);
            resolve(NextResponse.json({ error: stderr || "Failed to get video info" }, { status: 500 }));
            return;
          }
          try {
            const data = JSON.parse(stdout);
            console.log("[API] yt-dlp info command successful, parsing data.");

            // Filter and map formats to a more usable structure for the frontend
            const formats = data.formats
              .filter((f: any) => f.format_id && f.ext && (f.vcodec !== "none" || f.acodec !== "none") && f.filesize) // Only include valid formats with size
              .map((f: any) => ({
                type: f.vcodec !== "none" ? "video" : "audio",
                quality: f.format_note || f.format_id,
                format: f.ext,
                size: f.filesize ? (f.filesize / (1024 * 1024)).toFixed(2) + " MB" : "N/A",
                formatId: f.format_id, // Crucial for specific downloads
              }))
              .sort((a: any, b: any) => { // Sort formats for better presentation (e.g., higher quality first)
                  if (a.type !== b.type) return a.type === 'video' ? -1 : 1; // Video before audio
                  // Attempt to sort by quality (e.g., 1080p > 720p)
                  const qualityA = parseFloat(a.quality);
                  const qualityB = parseFloat(b.quality);
                  if (!isNaN(qualityA) && !isNaN(qualityB)) {
                      return qualityB - qualityA; // Descending for video quality
                  }
                  return 0;
              });

            resolve(NextResponse.json({
              success: true,
              data: {
                title: data.title,
                platform: data.extractor_key || data.extractor, // e.g., "Youtube", "TikTok"
                author: data.uploader,
                thumbnail: data.thumbnail,
                duration: data.duration ? new Date(data.duration * 1000).toISOString().substr(11, 8) : "N/A",
                views: data.view_count ? data.view_count.toLocaleString() : "N/A",
                likes: data.like_count ? data.like_count.toLocaleString() : "N/A",
                uploadDate: data.upload_date ? `${data.upload_date.substring(0, 4)}-${data.upload_date.substring(4, 6)}-${data.upload_date.substring(6, 8)}` : "N/A",
                formats: formats,
              },
            }));
          } catch (parseError: any) {
            console.error(`[API ERROR] JSON parse error: ${parseError.message}`);
            console.error(`[API ERROR] stdout received: ${stdout.substring(0, 500)}...`); // Log part of stdout
            resolve(NextResponse.json({ error: "Failed to parse video info from yt-dlp" }, { status: 500 }));
          }
        });
      });
    }
  } catch (outerError: any) {
    console.error(`[API ERROR] Universal download (outer) error: ${outerError.message}`);
    return NextResponse.json({ error: "Failed to process media request" }, { status: 500 });
  }
}