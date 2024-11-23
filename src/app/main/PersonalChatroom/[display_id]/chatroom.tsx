"use client";
import React, { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatBox from "./chatbox";
import { Mic, MicOff } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Switch } from "@nextui-org/switch";
import { useRouter } from "next/navigation";
import { UUID } from "crypto";
import Link from "next/link";

interface ChatroomProps {
  displayId: string; // 接收父组件传递的 displayId
}

const gptModel =
  "ft:gpt-4o-mini-2024-07-18:national-taiwan-university:1020qa:AKRgW64h";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatGroup {
  displayId: UUID;
  createdAt: string;
  chat: Message[];
  title: string;
}

const Chatroom = ({ displayId: display_id }: ChatroomProps) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const router = useRouter();
  const initialised = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(
    browserSupportsSpeechRecognition
  ); // null or boolean
  const [audioOutput, setAudioOutput] = useState(true);

  // TTS
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [saveNow, setSaveNow] = useState<boolean>(false);

  const handlePlayAudio = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleLogout = async () => {
    try {
      // 清除 localStorage 中的 JWT token
      localStorage.removeItem("authToken");

      const response = await fetch("/api/UserLogout", {
        method: "POST",
      });
      if (response.ok) {
        localStorage.removeItem("authToken");
        document.cookie = "authToken=; Max-Age=0"; // 清除 cookies
        router.push("/main/Login");
      } else {
        alert("登出失敗，請稍後再試！");
      }
    } catch (error) {
      console.error("Logout error: ", error);
      alert("登出失敗，請稍後再試！");
    }
  };

  const handleAutoSave = async () => {
    try {
      const response = await fetch("/api/UserChatSave", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_id: currentChatId || "",
          user_id: display_id,
          chat: messages,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save chat");
      }
      const result = await response.json();
      //console.log(result);
      if (result.display_id && !currentChatId) {
        setCurrentChatId(result.display_id);
      }
    } catch (error) {
      console.error("Error saving chat", error);
      alert("儲存失敗");
    }
    handleGetChats();
  };

  const handleGetChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/GetUserChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: display_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to get chat");
      }
      const result = await response.json();

      if (result.message != "No records found") {
        setChatGroups(result.result);
      }
    } catch (error) {
      console.error("Failed to get chat records", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (saveNow) {
      handleAutoSave();
    }

    setSaveNow(false);
  }, [saveNow]);

  useEffect(() => {
    if (!initialised.current) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/");
      }
      handleGetChats();
      initialised.current = true;
    }
  }, []);

  // Stop playing if New Voice is return
  useEffect(() => {
    if (audio) {
      audio.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl); // 清理 URL 資源
    };
  }, [audio, audioUrl]);

  // Speech Recognition
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!listening) {
      handleSendMessage();
    }
  }, [listening]);

  // useEffect(() => {
  //   handleAutoSave();
  // }, [messages]);

  const startRecording = () => {
    resetTranscript(); // 重置轉換文字
    SpeechRecognition.startListening({ continuous: false, language: "zh-TW" });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (inputValue == null) return;

    setIsLoading(true);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: inputValue },
    ];

    setMessages(newMessages);

    setInputValue("");
    try {
      const responseText = await fetch("/api/GPTSpeechText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: gptModel,
          messages: newMessages,
        }),
      });

      const dataText = await responseText.json();
      const message = dataText.message;
      // console.log(message);
      setMessages([...newMessages, { role: "assistant", content: message }]);

      setSaveNow(true);

      const responseAudio = await fetch("/api/GPTSpeechAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!responseAudio.ok) {
        throw new Error("Error generating text or speech");
      }

      if (audioOutput) {
        const audioBlob = await responseAudio.blob();
        const url = URL.createObjectURL(audioBlob);

        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);

        const newAudio = new Audio(url);
        setAudio(newAudio);
        setIsPlaying(true);

        newAudio.onended = () => setIsPlaying(false);
        newAudio.play();
      }

      // console.log(responseText);
      if (responseText == null) {
        throw new Error("Error getting text messages");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChatroom = async () => {
    setCurrentChatId("");
    setMessages([]);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "long", // 顯示完整月份名稱，例如「十一月」
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 使用 24 小時制
    }).format(date);
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar 内容 */}
      <div
        className={`transition-width duration-300 ease-in-out bg-[#decdbb] py-10 px-6 overflow-hidden`}
      >
        <Button
          className="w-full hover:bg-[#f4eee8] bg-[#6d5b47] text-[#292628]"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "<<" : ">>"}
        </Button>
        {isSidebarOpen && (
          <div className="flex flex-col h-full pb-20 ">
            <h2 className="text-[#6d5b47] text-xl font-semibold ">
              {display_id}
            </h2>
            <div className="flex-grow flex-col flex">
              <Button
                className="my-5  hover:bg-[#9a8980] bg-[#cbb9af] text-[#292628]"
                onClick={() => {
                  startNewChatroom();
                }}
              >
                +
              </Button>
              {!isLoading &&
                chatGroups.map((group) => (
                  <Button
                    key={group.displayId}
                    className="my-5  hover:bg-[#9a8980] bg-[#cbb9af] text-[#292628]"
                    onClick={() => {
                      setMessages(group.chat);
                      setCurrentChatId(group.displayId);
                    }}
                  >
                    <div className="flex flex-col">
                      <h1>{group.title}</h1>
                      <h1>{formatDate(group.createdAt)}</h1>
                    </div>
                  </Button>
                ))}
            </div>
            <Button className="w-full mb-10 hover:bg-[#f4eee8] bg-[#6d5b47] text-[#292628] self-end">
              <Link href={"/"}>Home</Link>
            </Button>
            <Button
              className="w-full hover:bg-[#f4eee8] bg-[#6d5b47] text-[#292628] self-end"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Chatroom範圍 */}
      <div className="flex bg-gradient-to-r from-[#f4eee8] via-[#fff2c9] to-[#fde1c2] items-center min-h-screen  gap-16 py-40 px-20 w-full">
        <div className="flex flex-col w-full h-full justify-between">
          <Switch
            defaultSelected
            size="lg"
            isSelected={audioOutput}
            onValueChange={setAudioOutput}
            className="self-end"
          >
            <span className=" text-[#6d5b47]">
              {audioOutput ? "Audio on" : "Audio off"}
            </span>
          </Switch>
          <ChatBox
            messages={messages}
            isPlaying={isPlaying}
            audioUrl={audioUrl}
            handlePlayAudio={handlePlayAudio}
          />
          <div className="flex flex-col">
            <Input
              className="rounded-full w-full my-10 bg-[#f4eee8] py-8 text-black"
              placeholder="anything you want to say..."
              disabled={listening || isLoading}
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            ></Input>
            <div className="flex w-full justify-center">
              <Button
                onClick={listening ? stopRecording : startRecording}
                disabled={listening && speechRecognitionSupported}
                className="p-10 py-8 mx-10 w-fit rounded-full hover:bg-[#f4eee8] bg-[#decdbb] my-10"
              >
                {listening ? <MicOff /> : <Mic />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-10 py-8 mx-10 w-fit rounded-full hover:bg-[#f4eee8] bg-[#decdbb] my-10"
              >
                {<SendIcon />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
