"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import BookHeader from "@/components/BookHeader";
import Transcript from "@/components/Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const router = useRouter();
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    maxSeconds,
    limitError,
    start,
    stop,
  } = useVapi(book);

  const handleMicToggle = () => {
    if (isActive) {
      stop();
    } else {
      start();
    }
  };

  // Redirect to homepage when session time limit is hit and call has ended
  useEffect(() => {
    if (limitError && !isActive && duration >= maxSeconds) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [limitError, isActive, duration, maxSeconds, router]);

  return (
    <div className="vapi-transcript-wrapper">
      <BookHeader
        book={book}
        status={status}
        isActive={isActive}
        duration={duration}
        maxSeconds={maxSeconds}
        limitError={limitError}
        onToggleMic={handleMicToggle}
      />
      <Transcript
        messages={messages}
        currentMessage={currentMessage}
        currentUserMessage={currentUserMessage}
      />
      {limitError && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-center text-sm text-red-700 shadow-lg">
            {limitError}
            {duration >= maxSeconds && <p className="mt-1 text-xs">Redirecting to homepage...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default VapiControls;
