import React, { useState, useEffect } from "react";
import "regenerator-runtime/runtime";

interface ChatBoxProps {
  messages: { role: "user" | "assistant"; content: string }[];
  handlePlayAudio?: () => void;
  audioUrl: string | null;
  isPlaying: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const [displayedMessages, setDisplayedMessages] =
    useState<{ role: "user" | "assistant"; content: string }[]>(messages);

  useEffect(() => {
    setDisplayedMessages(messages);
  }, [messages]);

  return (
    <div className="p-4 mt-4 bg-[#f4eee8]/80 rounded-3xl max-h-[50vh] overflow-y-auto w-full shadow-lg">
      {displayedMessages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 p-4 rounded-xl max-w-[40%] w-auto h-fit ${message.role === "user"
              ? "bg-[#decdbb] text-black font-semibold self-end ml-auto"  // User message: Right-aligned
              : "bg-[#6d5b47] text-white font-semibold self-start mr-auto"  // Assistant message: Left-aligned
            }`}
        >
          <span className="m-2 p-2">{message.content}</span>
        </div>
      ))}
    </div>


  );
};

export default ChatBox;
