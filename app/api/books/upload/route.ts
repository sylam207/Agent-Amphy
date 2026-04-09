import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Configure timeout for this route (in seconds)
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfBase64 = formData.get('pdfBase64') as string;
    const filename = formData.get('filename') as string;
    const coverImageBase64 = formData.get('coverImageBase64') as string;

    if (!pdfBase64 || !filename) {
      return NextResponse.json(
        { error: "Missing required fields: pdfBase64, filename" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Create GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "pdfs",
    });

    // Convert base64 to Buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Upload PDF file
    const uploadStream = bucket.openUploadStream(`${Date.now()}-${filename}`, {
      metadata: { uploadedAt: new Date() },
    });

    // Capture the file ID from the stream
    const fileId = uploadStream.id;

    return new Promise((resolve) => {
      uploadStream.on("finish", () => {
        resolve(
          NextResponse.json({
            success: true,
            data: {
              pdfFileId: String(fileId),
              coverImageBase64,
            },
          })
        );
      });

      uploadStream.on("error", (err: any) => {
        console.error("Error uploading PDF to GridFS:", err);
        resolve(
          NextResponse.json(
            { error: "Failed to upload PDF" },
            { status: 500 }
          )
        );
      });

      uploadStream.end(pdfBuffer);
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload PDF" },
      { status: 500 }
    );
  }
}
