"use client";

import { useState } from "react";
import { UploadForm } from "@/components/UploadForm";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="wrapper container">
        <div className="new-book-wrapper mx-auto max-w-3xl rounded-[32px] border border-[#d6c3ac] bg-[#fcf3ea] p-10 shadow-soft">
          <p className="text-center text-lg text-[#5a5560]">Please sign in to create a book.</p>
        </div>
      </div>
    );
  }

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

        <UploadForm clerkId={user.id} onSubmittingChange={setIsSubmitting} />
      </div>
    </div>
  );
};

export default Page;
