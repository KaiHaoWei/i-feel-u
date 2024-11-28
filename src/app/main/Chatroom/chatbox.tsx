import React, { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";

interface ChatBoxProps {
  messages: { role: "user" | "assistant"; content: string }[];
  isLoading: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  const [displayedMessages, setDisplayedMessages] =
    useState<{ role: "user" | "assistant"; content: string }[]>(messages);

  const containerRef = useRef<HTMLDivElement>(null);

  // 滾動到底部函數
  const scrollToBottom = () => {
    if (containerRef.current) {
      const lastMessageElement = containerRef.current.lastElementChild;
      if (lastMessageElement) {
        lastMessageElement.scrollIntoView({
          behavior: "smooth", // 平滑滾動效果
          block: "end", // 確保滾動到元素的底部
        });
      }
    }
  };

  // delay the message sent so that the scroll animation have time
  // Used when No animation 
  useEffect(() => {
    setDisplayedMessages(messages); // 更新顯示的訊息
    setTimeout(() => {
      scrollToBottom();
    }, 100); // 100 毫秒的延遲，可以調整這個數值
  }, [messages]);

  return (
    <div
      ref={containerRef} // 綁定容器參考
      className="p-4 bg-[#f4eee8]/10 border-1 border-[#d4bba0] rounded-3xl 
    max-h-[50vh] overflow-y-auto w-full shadow-lg">
      {displayedMessages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 p-4 rounded-xl max-w-[60%] sm:max-w-[40%] w-auto h-fit ${message.role === "user"
            ? "bg-[#decdbb] text-black font-semibold self-end ml-auto"  // User message: Right-aligned
            : "bg-[#6d5b47] text-white font-semibold self-start mr-auto"  // Assistant message: Left-aligned
            }`}
        >
            <span className="m-2 p-2">{message.content}</span>
        </div>
      ))}

      {/* Loading animation when isLoading is true */}
      {isLoading && (
        <div className="flex justify-center items-center mt-2">
          <div className="w-6 h-6 border-4 border-t-[#6d5b47] border-[#d4bba0] rounded-full animate-spin"></div>
          <span className="ml-2 text-[#6d5b47]">Loading...</span>
        </div>
      )}

      {/* 在最後增加一個不可見的空 div */}
      <div className="h-[1vw]"></div>
    </div>

  );
};

export default ChatBox;
