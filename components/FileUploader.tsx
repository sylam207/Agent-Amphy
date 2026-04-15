"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { parsePDFFile } from "@/lib/utils";

interface FileUploaderProps {
  id: string;
  label: string;
  accept: string;
  file: File | undefined;
  onChange: (file: File | undefined) => void;
  onRemove: () => void;
  error?: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  validatePdf?: boolean;
  onPdfParsed?: (data: { content: any[]; cover: string }) => void;
}

export const FileUploader = ({
  id,
  label,
  accept,
  file,
  onChange,
  onRemove,
  error,
  hint,
  icon: Icon = UploadCloud,
  validatePdf = false,
  onPdfParsed,
}: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string>();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setValidationError(undefined);

    if (!selectedFile) {
      onChange(undefined);
      return;
    }

    if (accept === "application/pdf" && selectedFile.type !== "application/pdf") {
      setValidationError("Please upload a valid PDF file.");
      return;
    }

    if (accept.startsWith("image/") && !selectedFile.type.startsWith("image/")) {
      setValidationError("Please upload a valid image file.");
      return;
    }

    if (validatePdf && selectedFile.type === "application/pdf") {
      setIsValidating(true);
      try {
        const parsedData = await parsePDFFile(selectedFile);
        if (parsedData.content.length === 0) {
          setValidationError("PDF appears to be empty or unreadable.");
          return;
        }
        onPdfParsed?.(parsedData);
      } catch (err) {
        setValidationError(err instanceof Error ? err.message : "Failed to parse PDF");
        return;
      } finally {
        setIsValidating(false);
      }
    }

    onChange(selectedFile);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove();
    setValidationError(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayError = error || validationError;

  return (
    <div className="space-y-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div
        className={cn(
          "upload-dropzone border border-dashed border-[#a9865d] bg-[#fff8f1]",
          file ? "upload-dropzone-uploaded" : "",
          "relative cursor-pointer",
          isValidating && "opacity-50 cursor-not-allowed"
        )}
        onClick={isValidating ? undefined : handleClick}
      >
        {isValidating ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#663820] border-t-transparent" />
            <span className="text-sm text-[#5a5560]">Validating PDF...</span>
          </div>
        ) : file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {accept === "application/pdf" ? (
                <FileText className="h-8 w-8 text-[#663820]" />
              ) : (
                <ImageIcon className="h-8 w-8 text-[#663820]" />
              )}
              <div>
                <p className="upload-dropzone-text">{file.name}</p>
                <p className="upload-dropzone-hint">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              className="upload-dropzone-remove"
              onClick={handleRemove}
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Icon className="upload-dropzone-icon" />
            <p className="upload-dropzone-text">Click to upload {accept === "application/pdf" ? "PDF" : "image"}</p>
            <p className="upload-dropzone-hint">{hint}</p>
          </>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={isValidating}
        />
      </div>
      {displayError && <p className="text-sm text-red-600">{displayError}</p>}
    </div>
  );
};