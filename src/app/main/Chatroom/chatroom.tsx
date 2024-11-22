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

const gptModel =
  "ft:gpt-4o-mini-2024-07-18:national-taiwan-university:1020qa:AKRgW64h";

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
      // console.log(message);
      setMessages([...newMessages, { role: "assistant", content: message }]);

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

  return (
    <div className="flex bg-gradient-to-r from-[#f4eee8] via-[#fff2c9] to-[#fde1c2] items-center min-h-screen  gap-16 py-40 px-20 w-full">
      <div className="flex flex-col w-full h-full justify-between">
        <Switch
          defaultSelected
          size="lg"
          isSelected={audioOutput}
          onValueChange={setAudioOutput}
          className="self-end"
        >
          {audioOutput ? "Audio on" : "Audio off"}
        </Switch>
        <ChatBox
          messages={messages}
          isPlaying={isPlaying}
          audioUrl={audioUrl}
          handlePlayAudio={handlePlayAudio}
        />
        <div className="flex flex-col">
          <Input
            className="rounded-full w-full my-10 bg-[#f4eee8] py-8"
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
  );
};

export default Chatroom;
