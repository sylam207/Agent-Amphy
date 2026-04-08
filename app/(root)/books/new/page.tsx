"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { newBookFormSchema, type NewBookFormValues } from "@/lib/zod";

const voiceGroups = [
  {
    label: "Male Voices",
    options: [
      { value: "Dave", description: "Young male, British-Essex, casual & conversational" },
      { value: "Daniel", description: "Middle-aged male, British, authoritative but warm" },
      { value: "Chris", description: "Male, casual & easy-going" },
    ],
  },
  {
    label: "Female Voices",
    options: [
      { value: "Rachel", description: "Young female, American, calm & clear" },
      { value: "Sarah", description: "Young female, American, soft & approachable" },
    ],
  },
];

const Page = () => {
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
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

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValue("pdfFile", file, { shouldValidate: true, shouldTouch: true });
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValue("coverImage", file, { shouldValidate: true, shouldTouch: true });
  };

  const removePdf = () => {
    setValue("pdfFile", undefined, { shouldValidate: true, shouldTouch: true });
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const removeCover = () => {
    setValue("coverImage", undefined, { shouldValidate: true, shouldTouch: true });
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const onSubmit = async (values: NewBookFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log(values);
  };

  return (
    <div className="wrapper container">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#00000066] px-4 py-8">
          <div className="max-w-md rounded-[32px] border border-[#a9865d] bg-[#f7ece0] p-8 text-center shadow-[0_20px_80px_rgba(102,56,32,0.14)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#663820] border-t-transparent animate-spin" />
            <h2 className="mb-2 text-2xl font-semibold text-[#4b382e]">Preparing your synthesis</h2>
            <p className="mb-6 text-sm text-[#5a5560]">Your PDF is being reviewed, and your assistant voice is warming up.</p>
            <div className="space-y-3 text-left text-sm text-[#5a5560]">
              <div className="flex items-center justify-between rounded-2xl bg-[#fff7f0] px-4 py-3">
                <span>Uploading files</span>
                <span className="text-xs text-[#a57c61]">Waiting</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#fff7f0] px-4 py-3">
                <span>Analyzing text</span>
                <span className="text-xs text-[#a57c61]">In progress</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#fff7f0] px-4 py-3">
                <span>Generating voice</span>
                <span className="text-xs text-[#a57c61]">Almost ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="new-book-wrapper mx-auto max-w-3xl rounded-[32px] border border-[#d6c3ac] bg-[#fcf3ea] p-10 shadow-soft">
        <section className="space-y-3">
          <h1 className="page-title text-3xl font-bold">Add a New Book</h1>
          <p className="text-lg text-[#5a5560]">Upload a PDF to generate your interactive interview in a warm, literary style.</p>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-3">
            <label htmlFor="pdf-upload" className="form-label">
              Book PDF File
            </label>
            <div
              className={cn(
                "upload-dropzone border border-dashed border-[#a9865d] bg-[#fff8f1]",
                pdfFile ? "upload-dropzone-uploaded" : "",
                "relative cursor-pointer"
              )}
              onClick={() => pdfInputRef.current?.click()}
            >
              <UploadCloud className="upload-dropzone-icon" />
              {pdfFile ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="upload-dropzone-text">{pdfFile.name}</p>
                    <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                  </div>
                  <button
                    type="button"
                    className="upload-dropzone-remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      removePdf();
                    }}
                    aria-label="Remove PDF"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="upload-dropzone-text">Click to upload PDF</p>
                  <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                </>
              )}
              <input
                ref={pdfInputRef}
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfChange}
              />
            </div>
            {errors.pdfFile?.message && <p className="text-sm text-red-600">{errors.pdfFile.message}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="cover-upload" className="form-label">
              Cover Image (Optional)
            </label>
            <div
              className={cn(
                "upload-dropzone border border-dashed border-[#a9865d] bg-[#fff8f1]",
                coverFile ? "upload-dropzone-uploaded" : "",
                "relative cursor-pointer"
              )}
              onClick={() => coverInputRef.current?.click()}
            >
              <ImagePlus className="upload-dropzone-icon" />
              {coverFile ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="upload-dropzone-text">{coverFile.name}</p>
                    <p className="upload-dropzone-hint">Leave empty to auto-generate from PDF</p>
                  </div>
                  <button
                    type="button"
                    className="upload-dropzone-remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeCover();
                    }}
                    aria-label="Remove cover image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="upload-dropzone-text">Click to upload cover image</p>
                  <p className="upload-dropzone-hint">Leave empty to auto-generate from PDF</p>
                </>
              )}
              <input
                ref={coverInputRef}
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </div>
            {errors.coverImage?.message && <p className="text-sm text-red-600">{errors.coverImage.message}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="ex: Rich Dad Poor Dad"
              className="form-input"
              {...register("title")}
            />
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
            {voiceGroups.map((group) => (
              <div key={group.label} className="space-y-3">
                <p className="font-semibold text-base text-[#5a5560]">{group.label}</p>
                <div className="voice-selector-options flex flex-wrap gap-3">
                  {group.options.map((option) => {
                    const selected = selectedVoice === option.value;
                    return (
                      <label
                        key={option.value}
                        htmlFor={`voice-${option.value}`}
                        className={cn(
                          "voice-selector-option min-w-45",
                          selected ? "voice-selector-option-selected" : "voice-selector-option-default"
                        )}
                      >
                        <input
                          id={`voice-${option.value}`}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                          {...register("voice")}
                        />
                        <div>
                          <p className="font-semibold">{option.value}</p>
                          <p className="text-sm text-[#5a5560]">{option.description}</p>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Beginning Synthesis..." : "Begin Synthesis"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
