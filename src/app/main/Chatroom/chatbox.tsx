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
    <div className=" p-4 mt-4 bg-[#f4eee8]/50 rounded-3xl max-h-[50vh] overflow-y-auto w-full">
      {displayedMessages.map((message, index) => (
        <div
          key={index}
          className={`mb-3 p-3 rounded-full  max-w-[50%] w-auto h-fit ${
            message.role === "user"
              ? "bg-[#decdbb] font-semibold justify-self-end"
              : "bg-[#decdbb] font-semibold justify-self-start"
          }`}
        >
          <span className="m-2 p-2">{message.content}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
