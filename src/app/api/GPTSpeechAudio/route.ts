import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { privateEnv } from "@/lib/env/private";
//import { OpenAIApi, Configuration } from "openai";

// Define schema for the full AI request
const postAIRequestSchema = z.object({
  message: z.string(), // message for TTS should be a string
});

type postQuestionRequest = z.infer<typeof postAIRequestSchema>;

export async function POST(req: NextRequest) {
  let data = await req.json();

  // console.log(data);

  try {
    postAIRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { message } = data as postQuestionRequest;
  // console.log('==== Before ', role, ' ====')
  // console.log(messages)

  const apiKey = privateEnv.OPENAI_API_KEY_1;

  if (!apiKey) {
    return NextResponse.json(
      { message: "API key not set correctly" },
      { status: 400 },
    );
  }

  if (!message || message.length === 0) {
    return NextResponse.json(
      { message: "Messages are required" },
      { status: 400 },
    );
  }

  // console.log("model type", model);

  try {
    // console.log(messages)

    // console.log('==== After ====');
    // console.log(responseMessage);

    // ==== Text To Speech ====
    const responseAudio = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${privateEnv.OPENAI_API_KEY_1}`,
        },
        // alloy, echo, fable, onyx, nova, and shimmer
        body: JSON.stringify({
          input: message,
          model: "tts-1",
          voice: "nova",
          speed: 1.0,
        }),
      },
    );

    if (!responseAudio.ok) {
      throw new Error("Failed to generate speech");
    }

    const audioBuffer = await responseAudio.arrayBuffer(); // Correctly read the audio buffer

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="audio.mp3"',
      },
      status: 200,
    });
  } catch (error) {
    if (error instanceof Response) {
      const errorText = await error.text();
      console.error("OpenAI API Error:", errorText);
    } else {
      console.error("Error calling OpenAI API:", error);
    }
    return NextResponse.json(
      { message: "Error calling OpenAI API" },
      { status: 500 },
    );
  }
}
