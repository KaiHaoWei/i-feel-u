"use client";
import React, { useState, useEffect } from "react";
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

import Link from 'next/link';

import { motion, AnimatePresence } from "framer-motion";

const gptModel =
  "ft:gpt-4o-mini-2024-07-18:national-taiwan-university:1020qa-1106gptcon:AQUthpnV";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatroom = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(
    browserSupportsSpeechRecognition,
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
    // console.log(newMessages);
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

      setMessages([...newMessages, { role: "assistant", content: message }]);

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

  return (

    <motion.div
      className={`flex items-center min-h-screen px-[6vw] py-[8vw] sm:py-10 sm:px-40 w-full`}
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
          className="absolute top-0 left-0 w-full h-full z-0"
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

      <div className="flex flex-col w-full h-full justify-between z-10">
        {/* <div className="text-black">aa{userMood}aa</div> */}
        <div className="flex flex-col">
          <Switch
            defaultSelected
            size="lg"
            isSelected={audioOutput}
            onValueChange={setAudioOutput}
            className="self-end pb-3"
          >
            <span className="text-gray-800">
              {audioOutput ? "Audio on" : "Audio off"}
            </span>
          </Switch>

          <ChatBox
            messages={messages}
            isLoading={isLoading}
          />
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
              className="p-[5.5vw] mx-[8.5vw] sm:p-10 sm:py-8 sm:mx-10 sm:my-7 w-fit rounded-full hover:bg-[#b69c83] bg-[#9a7b5d] transition-all duration-300"
            >
              {listening ? <MicOff /> : <Mic />}
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-[5.5vw] mx-[8.5vw] sm:p-10 sm:py-8 sm:mx-10 sm:my-7 w-fit rounded-full hover:bg-[#b69c83] bg-[#9a7b5d] transition-all duration-300"
            >
              <SendIcon />
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <Link href="/main/Login">
              <span className="text-[#9a7b5d] hover:text-[#b69c83] transition-all duration-300 ease-in-out">
                Already have an account? Sign In
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>

  );
};

export default Chatroom;
