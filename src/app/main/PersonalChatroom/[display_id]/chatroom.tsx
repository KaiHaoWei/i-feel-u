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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { motion, AnimatePresence } from "framer-motion";

interface ChatroomProps {
  displayId: string; // 接收父组件传递的 displayId
}

const gptModel =
  "ft:gpt-4o-mini-2024-07-18:national-taiwan-university:1020qa-1106gptcon:AQUthpnV";

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

  // User Mood
  const [userMood, setUserMood] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string>(""); // 新增背景圖片狀態
  // Background animation control
  const [displayedBackground, setDisplayedBackground] = useState<string>("");

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

  // 動態背景圖片更新
  useEffect(() => {
    switch (userMood) {
      case "開朗":
        setBackgroundImage("/happy.jpg");
        break;
      case "難過":
        setBackgroundImage("/sad.jpg");
        break;
      case "生氣":
        setBackgroundImage("/angry.jpg");
        break;
      case "困惑":
        setBackgroundImage("/confuse.jpg");
        break;
      case "不確定":
        setBackgroundImage("");
        break;
      default:
        setBackgroundImage(""); // 保持原始背景
    }
  }, [userMood]);

  // Animate the background change every 10 seconds
  useEffect(() => {

    const interval = setTimeout(() => {
      setDisplayedBackground(backgroundImage);
    }, 5000);

    return () => clearTimeout(interval);
  }, [backgroundImage]);

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

  const handleDeleteChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/UserChatDelete", {
        method: "PUT",
        body: JSON.stringify({
          display_id: currentChatId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }
      const result = await response.json();
      window.location.reload();
    } catch (error) {
      console.error("Failed to get delete chat", error);
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

      // Mood
      const responseMood = await fetch("/api/GPTGetMood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: newMessages,
        }),
      });

      const dataMood = await responseMood.json();
      const mood = dataMood.message;

      setUserMood(mood);

      // Audio
      if (audioOutput) {
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      {/* Sidebar Content */}
      <div
        className={`sm:bg-[#decdbb] ${isSidebarOpen ? "bg-[#decdbb] fixed w-[60vw] h-full sm:h-auto sm:w-64" : "fixed w-20 sm:w-28"
          } transition-all duration-300 flex flex-col py-4 px-2 shadow-lg
          top-0 left-0 z-50 sm:static`}
      >
        {/* Toggle Sidebar Button */}
        <Button
          className={`text-white font-bold bg-[#6d5b47] hover:bg-[#f4eee8] hover:text-[#292628] rounded-md 
            p-2 mb-10 
            transition-all duration-300`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "<<" : ">>"}
        </Button>

        <>
          {/* Sidebar Content */}
          <div className={`
            ${isSidebarOpen ? 'block' : 'hidden sm:block'}
            flex-grow flex flex-col space-y-4 overflow-y-auto py-4
          `}>
            {/* New Chat Button */}
            <Button
              className={`text-white font-bold bg-[#6d5b47] hover:bg-[#f4eee8] hover:text-[#292628] p-2 rounded-md 
            transition-all duration-300 w-full`}
              onClick={startNewChatroom}
            >
              {isSidebarOpen ? "+ New Chat" : "+"}
            </Button>

            {/* Chat Groups */}
            {chatGroups.map((group) => (
              <div key={group.displayId}>
                <Button
                  key={group.displayId}
                  className={`text-white font-bold bg-[#6d5b47] hover:bg-[#f4eee8] hover:text-[#292628] rounded-md 
                  transition-all duration-300 truncate w-full h-auto`}
                  onClick={() => {
                    setMessages(group.chat);
                    setCurrentChatId(group.displayId);
                  }}
                >
                  <div className="flex justify-start text-center truncate">
                    {isSidebarOpen ? (
                      <>
                        <div className="flex flex-col">
                          <span className="text-sm">{group.title}</span>
                          <span className="text-sm">
                            {formatDate(group.createdAt)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm">{group.title}</span>
                    )}
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className={`
            ${isSidebarOpen ? 'block' : 'hidden sm:block'}
            space-y-2`}>
            <Link href={"/"}>
              <Button
                className={`text-white font-bold bg-[#6d5b47] hover:bg-[#f4eee8] hover:text-[#292628] p-2 rounded-md 
              transition-all duration-300 w-full`}
              >
                {isSidebarOpen ? "Home" : "🏠"}
              </Button>
            </Link>
            <Button
              className={`text-white font-bold bg-[#6d5b47] hover:bg-[#f4eee8] hover:text-[#292628] p-2 rounded-md 
            transition-all duration-300 w-full`}
              onClick={handleLogout}
            >
              {isSidebarOpen ? "Sign Out" : "🚪"}
            </Button>
          </div>
        </>


      </div>

      {/* Chatroom範圍 */}
      <motion.div
        className="flex bg-gradient-to-r from-[#f4eee8] via-[#fff2c9] to-[#fde1c2] 
        items-center min-h-screen px-[6vw] py-[8vw] sm:py-10 sm:px-20 w-full"
        initial={{
          opacity: 0,
          scale: 0.8, // Start smaller for the "center-out" effect
        }}
        animate={{
          opacity: 1,
          scale: 1, // Scale to full size
        }}
        transition={{
          duration: 0.5, // Adjust duration for slower emergence
          ease: [0.25, 0.8, 0.25, 1], // Easing for smooth scaling
        }}
      // style={{
      //   backgroundImage: displayedBackground ?
      //     `linear-gradient(to right, rgba(244, 238, 232, 0.6), rgba(250, 240, 218, 0.75), rgba(255, 242, 201, 0.95), rgba(250, 240, 218, 0.75), rgba(253, 225, 194, 0.6)), url(${displayedBackground})` :
      //     `linear-gradient(to right, #E7C890, #f4eee8, #fff2c9, #fde1c2, #E7C890)`,
      //   backgroundSize: displayedBackground ? "cover" : "initial",
      //   backgroundPosition: "center",
      // }}
      >
        {/* Background image transition */}
        <AnimatePresence>
          <motion.div
            key={displayedBackground}
            style={{
              backgroundImage: displayedBackground
                ? `linear-gradient(to right, rgba(253, 2225, 194, 0.45), rgba(250, 240, 218, 0.75), rgba(255, 242, 201, 0.95), rgba(250, 240, 218, 0.75), rgba(253, 225, 194, 0.45)), url(${displayedBackground})`
                : `linear-gradient(to right, #E7C890, #f4eee8, #fff2c9, #fde1c2, #E7C890)`,
              backgroundSize: displayedBackground ? "cover" : "initial",
              backgroundPosition: "center",
            }}
            className="absolute top-0 left-0 w-screen h-screen z-0"
            initial={{
              opacity: 0.75,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0.75, // Fade out to 75% opacity on exit
            }}
            transition={{
              duration: displayedBackground ? 4 : 0.5, // Adjust this duration for the background transition
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>

        <div className="flex flex-col w-full h-full sm:justify-between z-10">
          <div className="flex flex-col">
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
            <ChatBox messages={messages} isLoading={isLoading} />
          </div>

          <div className="flex flex-col">
            <Input
              className="rounded-full w-full my-[3.5vw] sm:mt-10 sm:mb-3 bg-[#f4eee8] p-[5.5vw] sm:py-8 sm:px-5 text-black text-[3.5vw] sm:text-[1vw]
              border border-[#d4bba0] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d4bba0]" // Added border and shadow
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

            <div className="flex w-full justify-center my-[2.5vw] sm:my-0">
              <Button
                onClick={listening ? stopRecording : startRecording}
                disabled={listening && speechRecognitionSupported}
                title="Start talking"
                className="p-[5.5vw] mx-[8.5vw] sm:p-10 sm:py-8 sm:mx-10 sm:my-7 w-fit rounded-full hover:bg-[#b69c83] bg-[#9a7b5d] transition-all duration-300"
              >
                {listening ? <MicOff className="text-[3.5vw] sm:text-[1.8vw]" /> : <Mic className="text-[3.5vw] sm:text-[1.8vw]" />}
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                title="Send"
                className="p-[5.5vw] mx-[8.5vw] sm:p-10 sm:py-8 sm:mx-10 sm:my-7 w-fit rounded-full hover:bg-[#b69c83] bg-[#9a7b5d] transition-all duration-300"
              >
                {<SendIcon className="text-[3.5vw] sm:text-[1.8vw]" />}
              </Button>
              <Button
                onClick={handleDeleteChat}
                disabled={isLoading}
                title="Delete the whole chat (permanantly)"
                className="p-[5.5vw] mx-[8.5vw] sm:p-10 sm:py-8 sm:mx-10 sm:my-7 w-fit rounded-full hover:bg-[#e67764] bg-[#f05c41] transition-all duration-300"
              >
                <DeleteForeverIcon className="text-[3.5vw] sm:text-[1.8vw]" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatroom;
