import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// yt-dlp का पूरा पाथ यहाँ दें
// सुनिश्चित करें कि यह वही पाथ है जहां आपने yt-dlp.exe रखा है
const YTDLP_PATH = "C:\\Tools\\yt-dlp.exe";

// FFmpeg का पाथ (अगर आपने इसे PATH में नहीं जोड़ा है)
// अगर आपने FFmpeg को PATH में जोड़ दिया है, तो इसकी आवश्यकता नहीं है।
// अगर नहीं जोड़ा, तो इसे 'ffmpeg' से बदलकर 'C:\\Path\\To\\ffmpeg\\bin\\ffmpeg.exe' करें।
// FFmpeg ऑडियो एक्सट्रैक्शन और कुछ वीडियो फॉर्मेट को मर्ज करने के लिए आवश्यक है।
const FFMPEG_PATH = "ffmpeg"; // 'ffmpeg' अगर PATH में है, वरना पूरा पाथ दें

// Helper function to format duration from seconds to HH:MM:SS or MM:SS
function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(String(hours).padStart(2, '0'));
  parts.push(String(minutes).padStart(2, '0'));
  parts.push(String(remainingSeconds).padStart(2, '0'));

  return parts.join(':');
}

export async function POST(req: NextRequest) {
  const { url, type, formatId } = await req.json(); // 'type' यहाँ Frontend से चुना गया video/audio टाइप है

  if (!url) {
    return NextResponse.json({ success: false, error: 'YouTube URL is required.' }, { status: 400 });
  }

  try {
    if (!formatId) {
      // Step 1: Fetch video info and available formats
      // --skip-download: डाउनलोड न करें, सिर्फ जानकारी दें
      // --dump-json: जानकारी को JSON फॉर्मेट में दें
      // --no-warnings: अनावश्यक चेतावनी हटाएँ
      const infoCommand = `"${YTDLP_PATH}" --dump-json --no-warnings "${url}"`;
      const { stdout: infoOutput, stderr: infoError } = await execPromise(infoCommand);

      if (infoError) {
          console.error("yt-dlp info command stderr:", infoError);
          if (infoError.includes("Private video") || infoError.includes("This video is unavailable")) {
              throw new Error("Video is private, age-restricted, or unavailable.");
          }
          throw new Error("Failed to get video information from YouTube.");
      }

      const videoInfo = JSON.parse(infoOutput);

      // Extract relevant video details
      const videoDetails = {
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        duration: formatDuration(videoInfo.duration),
        views: videoInfo.view_count ? videoInfo.view_count.toLocaleString() : "N/A",
        likes: videoInfo.like_count ? videoInfo.like_count.toLocaleString() : "N/A",
        channel: videoInfo.channel || videoInfo.uploader,
      };

      // Filter and map formats for display and selection
      const formats = videoInfo.formats
        .filter((f: any) => f.url && (f.vcodec !== 'none' || f.acodec !== 'none')) // Valid formats with URL
        .map((f: any) => {
          let label = '';
          let formatType: 'video' | 'audio' = 'video'; // Default to video

          if (f.vcodec !== 'none' && f.acodec !== 'none') {
            // Video with audio (merged streams)
            label = `${f.height ? f.height + 'p' : ''}${f.fps ? `@${f.fps}fps` : ''} ${f.ext} (Video+Audio)`;
            formatType = 'video';
          } else if (f.vcodec !== 'none') {
            // Video only stream
            label = `Video Only ${f.height ? f.height + 'p' : ''}${f.fps ? `@${f.fps}fps` : ''} (${f.ext})`;
            formatType = 'video';
          } else if (f.acodec !== 'none') {
            // Audio only stream
            label = `Audio Only ${f.abr ? f.abr + 'kbps' : ''} (${f.ext})`;
            formatType = 'audio';
          }

          return {
            format_id: f.format_id,
            ext: f.ext,
            quality: f.height || f.abr, // Use height for video, abr for audio (for sorting/display)
            type: formatType,
            label: label.trim(),
            filesize: f.filesize || f.filesize_approx,
            protocol: f.protocol, // Useful for debugging/determining direct playability
            vcodec: f.vcodec,
            acodec: f.acodec,
          };
        })
        .filter((f: any) => f.label.trim() !== ''); // Filter out any formats that ended up with empty labels

      // Sort formats for better display (e.g., higher quality first)
      // Prioritize video+audio, then video-only, then audio-only
      formats.sort((a: any, b: any) => {
        // Higher quality first (height for video, bitrate for audio)
        const qualityDiff = (b.quality || 0) - (a.quality || 0);

        // Prioritize combined video+audio over video-only or audio-only
        const aCombined = (a.vcodec !== 'none' && a.acodec !== 'none');
        const bCombined = (b.vcodec !== 'none' && b.acodec !== 'none');

        if (aCombined && !bCombined) return -1;
        if (!aCombined && bCombined) return 1;

        // Then prioritize video over audio if not combined
        if (a.type === 'video' && b.type === 'audio') return -1;
        if (a.type === 'audio' && b.type === 'video') return 1;

        return qualityDiff; // Apply quality sorting within categories
      });

      return NextResponse.json({ success: true, videoDetails, formats });

    } else {
      // Step 2: Get direct download URL for the specific formatId
      // --get-url: yt-dlp को सिर्फ डाउनलोड URL निकालने के लिए कहें
      // -f <format_id>: विशिष्ट फॉर्मेट ID चुनें
      const downloadUrlCommand = `"${YTDLP_PATH}" -f ${formatId} --get-url --no-warnings "${url}"`;
      const { stdout: downloadUrlOutput, stderr: downloadUrlError } = await execPromise(downloadUrlCommand);

      if (downloadUrlError) {
          console.error("yt-dlp download URL command stderr:", downloadUrlError);
          if (downloadUrlError.includes("no appropriate format found")) {
              throw new Error("No direct download link found for the selected format. It might require server-side processing (FFmpeg).");
          }
          throw new Error(`Failed to get direct download URL: ${downloadUrlError}`);
      }

      const downloadLink = downloadUrlOutput.trim();

      if (!downloadLink) {
        throw new Error("Could not determine a direct download link for the selected format.");
      }

      return NextResponse.json({ success: true, downloadUrl: downloadLink });
    }

  } catch (error: any) {
    console.error('YouTube download API error:', error.message);
    // FFmpeg not found error check
    if (error.message.includes('ffmpeg') && error.message.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: `FFmpeg is required for some formats (especially audio conversion or merging video/audio) but was not found. Please install FFmpeg and add it to your system's PATH. Current FFMPEG_PATH set to: '${FFMPEG_PATH}'`,
      }, { status: 500 });
    }
    // General error
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred while processing the request.',
    }, { status: 500 });
  }
}