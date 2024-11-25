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
      // console.log(messag
      setMessages([...newMessages, { role: "assistant", content: message }]);

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
    <div className="flex bg-gradient-to-r from-[#f4eee8] via-[#fff2c9] to-[#fde1c2] items-center
     min-h-screen px-[6vw] py-[8vw] sm:py-10 sm:px-20 w-full">
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col">
          <Switch
            defaultSelected
            size="lg"
            isSelected={audioOutput}
            onValueChange={setAudioOutput}
            className="self-end pb-3"
          >
            <span className="text-gray-800">{audioOutput ? "Audio on" : "Audio off"}</span>
          </Switch>

          <ChatBox
            messages={messages}
            isPlaying={isPlaying}
            audioUrl={audioUrl}
            handlePlayAudio={handlePlayAudio}
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
    </div>



  );
};

export default Chatroom;
