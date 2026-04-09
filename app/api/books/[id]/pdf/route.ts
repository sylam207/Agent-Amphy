import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid book ID" },
        { status: 400 }
      );
    }

    // Create GridFS bucket for PDFs
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "pdfs",
    });

    // Open download stream
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(id)
    );

    // Handle stream errors
    downloadStream.on("error", (error: any) => {
      console.error("GridFS download error:", error);
    });

    // Return PDF as response
    return new Response(downloadStream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="document.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error downloading PDF:", error);
    return NextResponse.json(
      { error: "Failed to download PDF" },
      { status: 500 }
    );
  }
}
