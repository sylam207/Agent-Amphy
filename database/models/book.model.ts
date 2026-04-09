import { model, models, Schema } from "mongoose";
import { IBook } from "@/types";


const BookSchema = new Schema<IBook>(
  {
    clerkId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    author: { type: String, required: true },
    persona: { type: String },
    fileBinaryId: { type: Schema.Types.ObjectId }, // GridFS file ID for PDF
    fileBlobKey: { type: String }, // Legacy: Vercel Blob key
    coverImageBase64: { type: String }, // Base64 encoded cover image
    coverURL: { type: String }, // Legacy: Vercel URL
    coverBlobKey: { type: String }, // Legacy: Vercel Blob key
    fileSize: { type: Number, required: true },
    totalSegments: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Book = models.Book || model<IBook>("Book", BookSchema);

export default Book;