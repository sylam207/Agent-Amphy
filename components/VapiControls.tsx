"use client";
import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import BookHeader from "@/components/BookHeader";
import Transcript from "@/components/Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
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

  return (
    <div className="vapi-transcript-wrapper">
      <BookHeader book={book} status={status} isActive={isActive} onToggleMic={handleMicToggle} />
      <Transcript
        messages={messages}
        currentMessage={currentMessage}
        currentUserMessage={currentUserMessage}
      />
    </div>
  );
};

export default VapiControls;
