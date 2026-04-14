import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

const UPLOAD_CHUNKS_COLLECTION = "uploadChunks";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ success: false, error: "Database connection not established" }, { status: 500 });
    }

    const col = db.collection(UPLOAD_CHUNKS_COLLECTION);

    if (action === "start") {
      const { filename, totalChunks } = body;
      const uploadId = new mongoose.Types.ObjectId().toString();
      await col.insertOne({
        uploadId,
        filename,
        totalChunks,
        receivedChunks: 0,
        createdAt: new Date(),
      });
      return NextResponse.json({ success: true, uploadId });
    }

    if (action === "chunk") {
      const { uploadId, chunkIndex, data } = body;
      await col.insertOne({ uploadId, chunkIndex, data, createdAt: new Date() });
      await col.updateOne(
        { uploadId, totalChunks: { $exists: true } },
        { $inc: { receivedChunks: 1 } }
      );
      return NextResponse.json({ success: true });
    }

    if (action === "complete") {
      const { uploadId } = body;

      const session = await col.findOne({ uploadId, totalChunks: { $exists: true } });
      if (!session) {
        return NextResponse.json({ success: false, error: "Upload session not found" }, { status: 404 });
      }

      const chunks = await col
        .find({ uploadId, chunkIndex: { $exists: true } })
        .sort({ chunkIndex: 1 })
        .toArray();

      if (chunks.length !== session.totalChunks) {
        return NextResponse.json({
          success: false,
          error: `Expected ${session.totalChunks} chunks but got ${chunks.length}`,
        }, { status: 400 });
      }

      const fullBase64 = chunks.map((c) => c.data).join("");
      const pdfBuffer = Buffer.from(fullBase64, "base64");

      const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "pdfs" });
      const uploadStream = bucket.openUploadStream(
        `${Date.now()}-${session.filename}`,
        { metadata: { uploadedAt: new Date() } }
      );
      const fileId = uploadStream.id;

      const result = await new Promise<{ pdfFileId: string }>((resolve, reject) => {
        uploadStream.on("finish", () => resolve({ pdfFileId: String(fileId) }));
        uploadStream.on("error", (err: unknown) => reject(err));
        uploadStream.end(pdfBuffer);
      });

      // Clean up temp chunks
      await col.deleteMany({ uploadId });

      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Chunked upload error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, { status: 500 });
  }
}
