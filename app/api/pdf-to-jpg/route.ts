import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import FormData from "form-data";
import https from "https";
import { writeFile, unlink } from "fs/promises";

// POST /api/doc-to-pdf
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuidv4()}-${file.name}`;
    const tempPath = path.join("/tmp", fileName);

    await writeFile(tempPath, buffer); // Save temp file

    const form = new FormData();
    form.append("file", fs.createReadStream(tempPath));

    const options = {
      method: "POST",
      hostname: "universal-document-to-pdf-converter.p.rapidapi.com",
      path: "/convert",
      headers: {
        ...form.getHeaders(),
        "X-RapidAPI-Key": "aa6e53de16msh79dc702fe84431bp17a1ccjsn5e96fc3dae68",
        "X-RapidAPI-Host": "universal-document-to-pdf-converter.p.rapidapi.com",
      },
    };

    const apiRes = await new Promise<string>((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks: any[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString();
          resolve(body);
        });
      });

      req.on("error", (err) => reject(err));
      form.pipe(req);
    });

    await unlink(tempPath); // Cleanup

    return NextResponse.json({ success: true, data: JSON.parse(apiRes) });
  } catch (err) {
    console.error("Conversion failed:", err);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
