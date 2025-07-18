// app/api/tiktok-download/route.ts
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
    // 'action' फ्रंटएंड से आएगा: 'getInfo' या 'download'
    // 'formatId' केवल 'download' एक्शन के लिए आएगा
    const { url, formatId, action } = await request.json();

    if (!url) {
      console.error("API Error: URL is required.");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // अस्थायी फ़ाइलों के लिए एक डायरेक्टरी निर्धारित करें
    const tempDir = path.join(os.tmpdir(), "tiktok-yt-dlp-downloads");
    await fs.mkdir(tempDir, { recursive: true });

    if (action === "download" && formatId) {
      // --- एक्शन: विशिष्ट फ़ाइल डाउनलोड करें ---
      // yt-dlp स्वचालित रूप से सही एक्सटेंशन का पता लगाता है, लेकिन हम एक अनुमानित नाम दे रहे हैं।
      const filename = `tiktok_video-${Date.now()}.${formatId.split('.').pop() || 'mp4'}`;
      const outputPath = path.join(tempDir, filename);

      console.log(`[TikTok API] Initiating download for URL: ${url}, Format ID: ${formatId}`);
      console.log(`[TikTok API] Temporary output path: ${outputPath}`);

      return new Promise((resolve) => {
        // कमांड को डबल कोट्स के साथ `YTDLP_PATH` और `outputPath` के लिए चलाएं
        // --no-playlist: सुनिश्चित करता है कि केवल सिंगल वीडियो डाउनलोड हो
        const command = `"${YTDLP_PATH}" -f "${formatId}" -o "${outputPath}" --no-playlist "${url}"`;
        console.log(`[TikTok API] Executing download command: ${command}`);

        // maxBuffer को 100MB तक बढ़ाया गया है ताकि बड़ी फ़ाइलों को संभाला जा सके
        exec(command, { maxBuffer: 1024 * 1024 * 100 }, async (error, stdout, stderr) => {
          if (error) {
            console.error(`[TikTok API ERROR] Download exec error: ${error.message}`);
            console.error(`[TikTok API ERROR] Download stderr: ${stderr}`);
            // यदि डाउनलोड विफल रहता है तो अस्थायी फ़ाइल को साफ करने का प्रयास करें
            try { await fs.unlink(outputPath); } catch (e) { /* ignore cleanup error */ }
            resolve(NextResponse.json({ error: stderr || "Failed to download TikTok media" }, { status: 500 }));
            return;
          }

          try {
            // सुनिश्चित करें कि फ़ाइल वास्तव में मौजूद है
            await fs.access(outputPath);
            const fileBuffer = await fs.readFile(outputPath);
            console.log(`[TikTok API] File read successfully: ${outputPath}, size: ${fileBuffer.length} bytes`);

            const headers = new Headers();
            headers.set("Content-Type", "application/octet-stream"); // Generic binary stream for download
            headers.set("Content-Disposition", `attachment; filename="${filename}"`); // ब्राउज़र को फ़ाइल डाउनलोड करने के लिए कहता है

            await fs.unlink(outputPath); // फ़ाइल भेजने के बाद अस्थायी फ़ाइल को साफ करें
            console.log(`[TikTok API] Temporary file deleted: ${outputPath}`);

            resolve(new NextResponse(fileBuffer, { headers }));
          } catch (fileError: any) {
            console.error(`[TikTok API ERROR] File read/delete error: ${fileError.message}`);
            resolve(NextResponse.json({ error: "Failed to read or send file" }, { status: 500 }));
          }
        });
      });
    } else {
      // --- डिफ़ॉल्ट एक्शन: वीडियो जानकारी प्राप्त करें ---
      console.log(`[TikTok API] Initiating getInfo for URL: ${url}`);
      return new Promise((resolve) => {
        // `YTDLP_PATH` को डबल कोट्स के साथ कमांड चलाएं
        const command = `"${YTDLP_PATH}" --dump-json --no-playlist "${url}"`;
        console.log(`[TikTok API] Executing info command: ${command}`);

        // maxBuffer को 20MB तक बढ़ाया गया है ताकि बड़ी जानकारी को संभाला जा सके
        exec(command, { maxBuffer: 1024 * 1024 * 20 }, async (error, stdout, stderr) => {
          if (error) {
            console.error(`[TikTok API ERROR] Info exec error: ${error.message}`);
            console.error(`[TikTok API ERROR] Info stderr: ${stderr}`);
            resolve(NextResponse.json({ error: stderr || "Failed to get TikTok video info" }, { status: 500 }));
            return;
          }
          try {
            const data = JSON.parse(stdout);
            console.log("[TikTok API] yt-dlp info command successful, parsing data.");

            // फ़ॉर्मेट्स को फ़िल्टर और मैप करें ताकि फ्रंटएंड के लिए अधिक उपयोगी संरचना बन सके
            const formats = data.formats
              .filter((f: any) => f.format_id && f.ext && (f.vcodec !== "none" || f.acodec !== "none") && f.filesize) // केवल वैध फ़ॉर्मेट्स को शामिल करें
              .map((f: any) => ({
                type: f.vcodec !== "none" ? "video" : "audio",
                quality: f.format_note || f.format_id,
                format: f.ext,
                size: f.filesize ? (f.filesize / (1024 * 1024)).toFixed(2) + " MB" : "N/A",
                formatId: f.format_id, // विशिष्ट डाउनलोड के लिए महत्वपूर्ण
                // yt-dlp से सीधे डाउनलोड URL आमतौर पर CORS समस्याओं के कारण फ्रंटएंड पर काम नहीं करते हैं।
                // इसलिए, हम इसे यहां शामिल नहीं कर रहे हैं।
              }))
              .sort((a: any, b: any) => { // बेहतर प्रस्तुति के लिए फ़ॉर्मेट्स को सॉर्ट करें (उदाहरण के लिए, उच्च गुणवत्ता पहले)
                  if (a.type !== b.type) return a.type === 'video' ? -1 : 1; // वीडियो ऑडियो से पहले
                  // गुणवत्ता के आधार पर सॉर्ट करने का प्रयास करें (उदाहरण के लिए, 1080p > 720p)
                  const qualityA = parseFloat(a.quality);
                  const qualityB = parseFloat(b.quality);
                  if (!isNaN(qualityA) && !isNaN(qualityB)) {
                      return qualityB - qualityA; // वीडियो गुणवत्ता के लिए अवरोही
                  }
                  return 0;
              });

            resolve(NextResponse.json({
              success: true,
              data: { // 'data' कुंजी का उपयोग करें ताकि यह फ्रंटएंड के अपेक्षित संरचना से मेल खाए
                title: data.title,
                platform: data.extractor_key || data.extractor, // e.g., "Youtube", "TikTok"
                author: data.uploader,
                thumbnail: data.thumbnail,
                duration: data.duration ? new Date(data.duration * 1000).toISOString().substr(11, 8) : "N/A",
                views: data.view_count ? data.view_count.toLocaleString() : "N/A",
                likes: data.like_count ? data.like_count.toLocaleString() : "N/A",
                // TikTok के लिए comments और shares yt-dlp से सीधे उपलब्ध नहीं हो सकते हैं, इसलिए वैकल्पिक रखें
                comments: data.comment_count ? data.comment_count.toLocaleString() : "N/A",
                shares: data.webpage_url_basename || "N/A", // yt-dlp से सीधे शेयर काउंट नहीं मिलता
                uploadDate: data.upload_date ? `${data.upload_date.substring(0, 4)}-${data.upload_date.substring(4, 6)}-${data.upload_date.substring(6, 8)}` : "N/A",
                formats: formats,
              },
            }));
          } catch (parseError: any) {
            console.error(`[TikTok API ERROR] JSON parse error: ${parseError.message}`);
            console.error(`[TikTok API ERROR] stdout received: ${stdout.substring(0, 500)}...`); // stdout का हिस्सा लॉग करें
            resolve(NextResponse.json({ error: "Failed to parse video info from yt-dlp" }, { status: 500 }));
          }
        });
      });
    }
  } catch (outerError: any) {
    console.error(`[TikTok API ERROR] Universal download (outer) error: ${outerError.message}`);
    return NextResponse.json({ error: "Failed to process media request" }, { status: 500 });
  }
}