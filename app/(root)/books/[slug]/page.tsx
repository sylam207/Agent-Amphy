import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/books.actions";

interface PageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

const Page = async (props: PageProps) => {
  const { params } = await props;
  const { slug } = await params;

  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const bookResult = await getBookBySlug(slug);
  if (!bookResult.success || !bookResult.data) {
    redirect("/");
  }

  const { title, author, coverURL, coverImageBase64, persona } = bookResult.data;
  const coverSource = coverImageBase64 || coverURL || "";
  const voiceName = persona ?? "Narrator";

  return (
    <div className="back-page-container">
      <Link href="/" aria-label="Go back" className="back-btn-floating">
        <ArrowLeft size={20} />
      </Link>

      <div className="mx-auto max-w-4xl space-y-8 px-4 pt-10 pb-8 sm:px-6">
        <div className="vapi-header-card mt-6 rounded-[32px] border border-[#e3cfab] shadow-soft overflow-hidden">
          <div className="vapi-cover-wrapper">
            {coverSource ? (
              <img
                src={coverSource}
                alt={`${title} cover`}
                className="vapi-cover-image"
              />
            ) : (
              <div className="vapi-cover-image flex items-center justify-center bg-[#e4d8bf] text-sm text-[#7a6a5c] rounded-lg">
                No cover image
              </div>
            )}
            <div className="vapi-mic-wrapper">
              <button type="button" className="vapi-mic-btn" aria-label="Toggle microphone">
                <MicOff size={24} className="text-[#766d64]" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#212a3b] leading-tight">
                {title}
              </h1>
              <p className="mt-3 text-sm text-[#5b4f40]">by {author}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">Ready</span>
              </div>
              <div className="vapi-status-indicator">
                <span className="vapi-status-text">Voice: {voiceName}</span>
              </div>
              <div className="vapi-status-indicator">
                <span className="vapi-status-text">0:00/15:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="transcript-container min-h-100 p-8">
          <div className="transcript-empty">
            <Mic size={48} className="text-[#c3b299]" />
            <p className="transcript-empty-text mt-4">No conversation yet</p>
            <p className="transcript-empty-hint">Click the mic button above to start talking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
