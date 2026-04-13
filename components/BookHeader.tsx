"use client";
import { Mic, MicOff } from "lucide-react";
import { IBook } from "@/types";
import { CallStatus } from "@/hooks/useVapi";

interface BookHeaderProps {
  book: IBook;
  status: CallStatus;
  isActive: boolean;
  onToggleMic: () => void;
}

const BookHeader = ({ book, status, isActive, onToggleMic }: BookHeaderProps) => {
  const { title, author, coverURL, coverImageBase64, persona } = book;
  const coverSource = coverImageBase64 || coverURL || "";
  const voiceName = persona ?? "Narrator";

  const isSpeakingOrThinking = status === "speaking" || status === "thinking";

  return (
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
          <button
            type="button"
            className={`vapi-mic-btn ${isActive && isSpeakingOrThinking ? "relative" : ""}`}
            aria-label="Toggle microphone"
            onClick={onToggleMic}
          >
            {isActive && isSpeakingOrThinking && (
              <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75"></div>
            )}
            {isActive ? (
              <Mic size={24} className="text-[#766d64] relative z-10" />
            ) : (
              <MicOff size={24} className="text-[#766d64]" />
            )}
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
  );
};

export default BookHeader;