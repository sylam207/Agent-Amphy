'use server'

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { escapeRegex, generateSlug, serializeData } from "@/lib/utils";
import Book from "@/database/models/book.model";
import { getUserPlan } from "@/lib/getUserPlan";
import BookSegment from "@/database/models/bookSegment.model";
import mongoose from "mongoose";

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(title);
    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        exists: true,
        book: serializeData,
      };
    }
    return {
      exists: false,
    }
  } catch (e) {
    console.error("Error checking if book exists:", e);
    return {
      exists: false,
      error: e,
    };
  }
};


export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(data.title);

    // Plan enforcement: book upload limit
    const plan = await getUserPlan(data.clerkId);
    const bookCount = await Book.countDocuments({ clerkId: data.clerkId });
    if (bookCount >= plan.maxBooks) {
      return { success: false, error: "Book limit reached for your plan." };
    }

    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        success: false,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    const book = await Book.create({ ...data, slug, totalSegments: 0 });
    return {
      success: true,
      data: serializeData(book),
    };
  } catch (e) {
    console.error("Error creating book:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error occurred",
    };
  }
};

export const deleteBookById = async (id: string) => {
  try {
    await connectToDatabase();
    const deletedBook = await Book.findByIdAndDelete(id);
    await BookSegment.deleteMany({ bookId: id });
    return {
      success: !!deletedBook,
      data: deletedBook ? serializeData(deletedBook) : null,
    };
  } catch (e) {
    console.error("[deleteBookById] Error:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error occurred",
    };
  }
};


export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();
    console.log("Saving book segments");

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);
    await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
    console.log("Finished saving book segments");

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    };
  } catch (e) {
    console.error("Error saving book segments:", e);

    // Rollback: delete segments and reset book totalSegments
    try {
      await BookSegment.deleteMany({ bookId });
      await Book.findByIdAndUpdate(bookId, { totalSegments: 0 });
      console.log("Rolled back book and segments due to error");
    } catch (rollbackError) {
      console.error("Error during rollback:", rollbackError);
    }

    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error occurred",
    };
  }
};

export const uploadPdfToDatabase = async (
  pdfBase64: string,
  filename: string,
  coverImageBase64: string
): Promise<{
  success: boolean;
  data?: { pdfFileId: string; coverImageBase64: string };
  error?: string;
}> => {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection not established");
    }

    // Create GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "pdfs" });

    // Convert base64 to Buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Upload PDF file
    const uploadStream = bucket.openUploadStream(`${Date.now()}-${filename}`, {
      metadata: { uploadedAt: new Date() },
    });

    // Capture the file ID from the stream
    const fileId = uploadStream.id;

    return await new Promise<{
      success: boolean;
      data?: { pdfFileId: string; coverImageBase64: string };
      error?: string;
    }>((resolve, reject) => {
      uploadStream.on("finish", () => {
        resolve({
          success: true,
          data: {
            pdfFileId: String(fileId),
            coverImageBase64,
          },
        });
      });

      uploadStream.on("error", (err: any) => {
        console.error("Error uploading PDF to GridFS:", err);
        reject(err);
      });

      uploadStream.end(pdfBuffer);
    }).catch((error) => {
      console.error("Error uploading PDF to database:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload PDF",
      };
    });
  } catch (error) {
    console.error("Error uploading PDF to database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload PDF",
    };
  }
};

export const createBookWithMongoDBStorage = async (
  data: Omit<CreateBook, 'fileURL' | 'fileBlobKey'> & {
    fileBinaryId: string;
    coverImageBase64: string;
  }
) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(data.title);

    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        success: false,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    const bookData = {
      clerkId: data.clerkId,
      title: data.title,
      author: data.author,
      persona: data.persona,
      slug,
      fileBinaryId: data.fileBinaryId,
      coverImageBase64: data.coverImageBase64,
      fileSize: data.fileSize,
      totalSegments: 0,
    };

    const book = await Book.create(bookData);
    return {
      success: true,
      data: serializeData(book),
    };
  } catch (e) {
    console.error("Error creating book with MongoDB storage:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error occurred",
    };
  }
};

export const getBooks = async (clerkId?: string) => {
  try {
    await connectToDatabase();

    let query: any = {};
    if (clerkId) {
      query.clerkId = clerkId;
    }

    const books = await Book.find(query)
      .select("_id clerkId title slug author persona coverImageBase64 fileSize totalSegments createdAt")
      .lean()
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: serializeData(books),
    };
  } catch (e) {
    console.error("Error fetching books:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error occurred",
    };
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    const book = await Book.findOne({ slug })
      .lean();

    if (!book) {
      return {
        success: false,
        error: "Book not found",
      };
    }

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (e) {
    console.error("Error fetching book:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error occurred",
    };
  }
};

// Searches book segments using MongoDB text search with regex fallback
export const searchBookSegments = async (bookId: string, query: string, limit: number = 5) => {
    try {
        await connectToDatabase();

        console.log(`Searching for: "${query}" in book ${bookId}`);

        const bookObjectId = new mongoose.Types.ObjectId(bookId);

        // Try MongoDB text search first (requires text index)
        let segments: Record<string, unknown>[] = [];
        try {
            segments = await BookSegment.find({
                bookId: bookObjectId,
                $text: { $search: query },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .lean();
        } catch {
            // Text index may not exist — fall through to regex fallback
            segments = [];
        }

        // Fallback: regex search matching ANY keyword
        if (segments.length === 0) {
            const keywords = query.split(/\s+/).filter((k) => k.length > 2);
            const pattern = keywords.map(escapeRegex).join('|');

            segments = await BookSegment.find({
                bookId: bookObjectId,
                content: { $regex: pattern, $options: 'i' },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ segmentIndex: 1 })
                .limit(limit)
                .lean();
        }

        console.log(`Search complete. Found ${segments.length} results`);

        return {
            success: true,
            data: serializeData(segments),
        };
    } catch (error) {
        console.error('Error searching segments:', error);
        return {
            success: false,
            error: (error as Error).message,
            data: [],
        };
    }
};