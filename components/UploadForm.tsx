"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, ImagePlus } from "lucide-react";
import { newBookFormSchema, type NewBookFormValues } from "@/lib/zod";
import { FileUploader } from "./FileUploader";
import { voiceCategories, voiceOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createBook, saveBookSegments, checkBookExists, createBookWithMongoDBStorage } from "@/lib/actions/books.actions";
import { useRouter } from "next/navigation";

interface UploadFormProps {
  clerkId: string;
  onSubmittingChange?: (submitting: boolean) => void;
}

// Helper function to safely convert large files to base64 without stack overflow
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present and just get the base64 part
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};

export const UploadForm = ({ clerkId, onSubmittingChange }: UploadFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parsedPdfData, setParsedPdfData] = useState<{ content: any[]; cover: string } | null>(null);
  const [bookExists, setBookExists] = useState(false);
  const [checkingBook, setCheckingBook] = useState(false);

  const updateSubmitting = (submitting: boolean) => {
    setIsSubmitting(submitting);
    onSubmittingChange?.(submitting);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewBookFormValues>({
    resolver: zodResolver(newBookFormSchema),
    defaultValues: {
      pdfFile: undefined,
      coverImage: undefined,
      title: "",
      author: "",
      voice: "Rachel",
    },
    mode: "onTouched",
  });

  const pdfFile = watch("pdfFile");
  const coverFile = watch("coverImage");
  const selectedVoice = watch("voice");

  const handlePdfChange = (file: File | undefined) => {
    setValue("pdfFile", file, { shouldValidate: true, shouldTouch: true });
  };

  const handleCoverChange = (file: File | undefined) => {
    setValue("coverImage", file, { shouldValidate: true, shouldTouch: true });
  };

  const handlePdfParsed = (data: { content: any[]; cover: string }) => {
    setParsedPdfData(data);
  };

  const handleTitleChange = async (title: string) => {
    if (!title.trim()) {
      setBookExists(false);
      return;
    }

    setCheckingBook(true);
    try {
      const result = await checkBookExists(title);
      setBookExists(result.exists);
    } catch (error) {
      console.error("Error checking book existence:", error);
    } finally {
      setCheckingBook(false);
    }
  };

  const onSubmit = async (values: NewBookFormValues) => {
    if (!values.pdfFile || !parsedPdfData) return;

    updateSubmitting(true);
    try {
      // Convert PDF file to base64 using FileReader (handles large files safely)
      const pdfBase64 = await fileToBase64(values.pdfFile);

      // Get cover image (either provided or generated from PDF)
      let coverImageBase64: string;
      if (values.coverImage) {
        // Convert provided cover image to base64
        const coverBase64 = await fileToBase64(values.coverImage);
        coverImageBase64 = `data:${values.coverImage.type};base64,${coverBase64}`;
      } else {
        // Use PDF-generated cover
        coverImageBase64 = parsedPdfData.cover;
      }

      // Upload PDF to MongoDB GridFS via API route
      const formData = new FormData();
      formData.append('pdfBase64', pdfBase64);
      formData.append('filename', values.pdfFile.name);
      formData.append('coverImageBase64', coverImageBase64);

      const uploadResponse = await fetch('/api/books/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload PDF");
      }

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success && uploadResult.data) {
        throw new Error(uploadResult.error || "Failed to upload PDF");
      }

      const { pdfFileId } = uploadResult.data;

      // Create book in database with MongoDB storage
      const bookData = {
        clerkId,
        title: values.title,
        author: values.author,
        persona: values.voice,
        fileBinaryId: pdfFileId,
        coverImageBase64,
        fileSize: values.pdfFile.size,
      };

      const bookResult = await createBookWithMongoDBStorage(bookData);

      if (!bookResult.success) {
        if (bookResult.alreadyExists) {
          throw new Error("A book with this title already exists");
        }
        throw new Error(bookResult.error || "Failed to create book");
      }

      // Save book segments
      const segmentsResult = await saveBookSegments(
        bookResult.data._id,
        clerkId,
        parsedPdfData.content
      );

      if (!segmentsResult.success) {
        throw new Error(segmentsResult.error || "Failed to save book segments");
      }

      // Redirect to book page
      router.push(`/books/${bookResult.data.slug}`);

    } catch (error) {
      console.error("Error creating book:", error);
      alert(error instanceof Error ? error.message : "An error occurred while creating the book");
    } finally {
      updateSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FileUploader
        id="pdf-upload"
        label="Book PDF File"
        accept="application/pdf"
        file={pdfFile}
        onChange={handlePdfChange}
        onRemove={() => handlePdfChange(undefined)}
        error={errors.pdfFile?.message}
        hint="PDF file (max 50MB)"
        icon={UploadCloud}
        validatePdf={true}
        onPdfParsed={handlePdfParsed}
      />

      <FileUploader
        id="cover-upload"
        label="Cover Image (Optional)"
        accept="image/*"
        file={coverFile}
        onChange={handleCoverChange}
        onRemove={() => handleCoverChange(undefined)}
        error={errors.coverImage?.message}
        hint="Leave empty to auto-generate from PDF"
        icon={ImagePlus}
      />

      <div className="space-y-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="ex: Rich Dad Poor Dad"
          className="form-input"
          {...register("title", {
            onChange: (e) => handleTitleChange(e.target.value)
          })}
        />
        {checkingBook && <p className="text-sm text-[#5a5560]">Checking availability...</p>}
        {bookExists && !checkingBook && <p className="text-sm text-red-600">A book with this title already exists</p>}
        {errors.title?.message && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-3">
        <label htmlFor="author" className="form-label">
          Author Name
        </label>
        <input
          id="author"
          type="text"
          placeholder="ex: Robert Kiyosaki"
          className="form-input"
          {...register("author")}
        />
        {errors.author?.message && <p className="text-sm text-red-600">{errors.author.message}</p>}
      </div>

      <div className="space-y-4">
        <p className="form-label">Choose Assistant Voice</p>
        {Object.entries(voiceCategories).map(([category, voices]) => (
          <div key={category} className="space-y-3">
            <p className="font-semibold text-base text-[#5a5560] capitalize">{category} Voices</p>
            <div className="voice-selector-options flex flex-wrap gap-3">
              {voices.map((voiceKey) => {
                const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
                const selected = selectedVoice === voice.name;
                return (
                  <label
                    key={voiceKey}
                    htmlFor={`voice-${voiceKey}`}
                    className={cn(
                      "voice-selector-option min-w-45",
                      selected ? "voice-selector-option-selected" : "voice-selector-option-default"
                    )}
                  >
                    <input
                      id={`voice-${voiceKey}`}
                      type="radio"
                      value={voice.name}
                      className="sr-only"
                      {...register("voice")}
                    />
                    <div>
                      <p className="font-semibold">{voice.name}</p>
                      <p className="text-sm text-[#5a5560]">{voice.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        {errors.voice?.message && <p className="text-sm text-red-600">{errors.voice.message}</p>}
      </div>

      <button
        type="submit"
        className="form-btn w-full bg-[#663820] text-white font-serif"
        disabled={isSubmitting || !parsedPdfData || bookExists}
      >
        {isSubmitting ? "Beginning Synthesis..." : "Begin Synthesis"}
      </button>
    </form>
  );
};