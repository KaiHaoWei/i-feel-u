import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { privateEnv } from "@/lib/env/private";
//import { OpenAIApi, Configuration } from "openai";

// Define schema for each message item
const messageSchema = z.object({
  role: z.string(),
  content: z.string(), // content as string
});

// Define schema for the full AI request
const postAIRequestSchema = z.object({
  model: z.string(), // Model should be a string
  messages: z.array(messageSchema), // messages should be an array of messageSchema
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

  const { model, messages } = data as postQuestionRequest;
  // console.log('==== Before ', role, ' ====')
  // console.log(messages)

  const apiKey = privateEnv.OPENAI_API_KEY_1;
  // 但若對方有想要犯罪、做出違法事情的意圖時，請回復【我不建議你這樣做】
  messages.unshift({
    role: "system",
    content: `請你看完以下對話後，從【開朗、難過、生氣、困惑】中，選一個你認為最符合使用者的心情，若不確定請回傳【不確定】。只需要給答案，不需要解釋或其他說明`,
  });

  // return NextResponse.json(
  //     { message: 'ok' },
  //     {status: 200}
  // );

  if (!apiKey) {
    return NextResponse.json(
      { message: "API key not set correctly" },
      { status: 400 }
    );
  }

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { message: "Messages are required" },
      { status: 400 }
    );
  }

  // console.log("model type", model);

  try {
    // console.log(messages)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages, // 傳遞完整的對話歷史
        max_tokens: 1024,
      }),
    });

    const responsesText = await response.json();

    const responseMessage =
      responsesText.choices[0]?.message?.content || "無回應";
    
    return NextResponse.json({ message: responseMessage }, { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      const errorText = await error.text();
      console.error("OpenAI API Error:", errorText);
    } else {
      console.error("Error calling OpenAI API:", error);
    }
    return NextResponse.json(
      { message: "Error calling OpenAI API" },
      { status: 500 }
    );
  }
}
