import { z } from "zod";

const assistantVoices = ["Dave", "Daniel", "Chris", "Rachel", "Sarah"] as const;
const optionalFile = z.instanceof(File).optional();

export const newBookFormSchema = z.object({
  pdfFile: optionalFile
    .refine((file) => file instanceof File, {
      message: "A PDF file is required.",
    })
    .refine((file) => file?.type === "application/pdf", {
      message: "Please upload a valid PDF file.",
    })
    .refine((file) => file?.size <= 50 * 1024 * 1024, {
      message: "PDF file must be 50MB or smaller.",
    }),
  coverImage: optionalFile.refine((file) => !file || file.type.startsWith("image/"), {
    message: "Cover image must be an image file.",
  }),
  title: z.string().trim().min(1, "Title is required."),
  author: z.string().trim().min(1, "Author name is required."),
  voice: z.enum(assistantVoices),
});

export type NewBookFormValues = {
  pdfFile?: File;
  coverImage?: File;
  title: string;
  author: string;
  voice: (typeof assistantVoices)[number];
};
export type AssistantVoice = (typeof assistantVoices)[number];
