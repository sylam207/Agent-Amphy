"use client";
import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { Messages } from "@/types";

interface TranscriptProps {
  messages: Messages[];
  currentMessage: string;
  currentUserMessage: string;
}

const Transcript = ({ messages, currentMessage, currentUserMessage }: TranscriptProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasContent = messages.length > 0 || currentMessage.length > 0 || currentUserMessage.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, currentMessage, currentUserMessage]);

  if (!hasContent) {
    return (
      <div className="transcript-container min-h-100 p-8">
        <div className="transcript-empty">
          <Mic size={48} className="text-[#c3b299]" />
          <p className="transcript-empty-text mt-4">No conversation yet</p>
          <p className="transcript-empty-hint">Click the mic button above to start talking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-container min-h-100 p-8">
      <div className="transcript-messages">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${message.role}-${index}`}
              className={`transcript-message ${isUser ? "transcript-message-user" : "transcript-message-assistant"}`}
            >
              <div
                className={`transcript-bubble ${isUser ? "transcript-bubble-user" : "transcript-bubble-assistant"}`}
              >
                {message.content}
              </div>
            </div>
          );
        })}

        {currentUserMessage ? (
          <div className="transcript-message transcript-message-user">
            <div className="transcript-bubble transcript-bubble-user">
              {currentUserMessage}
              <span className="transcript-cursor" />
            </div>
          </div>
        ) : null}

        {currentMessage ? (
          <div className="transcript-message transcript-message-assistant">
            <div className="transcript-bubble transcript-bubble-assistant">
              {currentMessage}
              <span className="transcript-cursor" />
            </div>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Transcript;
