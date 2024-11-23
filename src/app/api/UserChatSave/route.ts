import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { chatMessagesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { privateEnv } from "@/lib/env/private";

const putContentRequestSchema = z.object({
  display_id: z.string().optional(),
  user_id: z.string().uuid(),
  chat: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

type putContentRequest = z.infer<typeof putContentRequestSchema>;

export async function PUT(request: NextRequest) {
  let data = await request.json();
  //console.log(data);
  try {
    putContentRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Content" }, { status: 400 });
  }

  const { display_id, user_id, chat } = data as putContentRequest;

  try {
    if (chat.length !== 0 && user_id) {
      // 如果 display_id 是空字串或 undefined，生成新的 UUID
      const finalDisplayId =
        display_id && display_id.trim() !== ""
          ? display_id
          : crypto.randomUUID();
      await db.transaction(async (trx) => {
        // 查詢是否已有對應的記錄
        const existingRecord = await trx
          .select()
          .from(chatMessagesTable)
          .where(
            and(
              eq(chatMessagesTable.displayId, finalDisplayId),
              eq(chatMessagesTable.userId, user_id)
            )
          )
          .execute();

        if (existingRecord.length > 0) {
          // 更新記錄
          await trx
            .update(chatMessagesTable)
            .set({
              chat, // 更新 chat 的 JSONB 資料
            })
            .where(eq(chatMessagesTable.displayId, finalDisplayId))
            .execute();
        } else {
          // 插入新記錄
          const title = await generateTitle(chat);
          await trx
            .insert(chatMessagesTable)
            .values({
              displayId: finalDisplayId, // 使用生成的或原有的 display_id
              userId: user_id,
              chat, // 插入 chat 的 JSONB 資料
              title,
            })
            .execute();
        }
      });
      return NextResponse.json({ status: 200, display_id: finalDisplayId });
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error updating or inserting chat messages:", error);
    return NextResponse.json(
      { error: "Something went wrong when uploading chat" },
      { status: 500 }
    );
  }
}

const gptModel =
  "ft:gpt-4o-mini-2024-07-18:national-taiwan-university:1020qa:AKRgW64h";

async function generateTitle(
  chat: { role: string; content: string }[]
): Promise<string> {
  if (!chat || chat.length === 0) {
    return "新對話"; // 若無內容，返回預設標題
  }

  const apiKey = privateEnv.OPENAI_API_KEY_1;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: gptModel,
        messages: [
          { role: "system", content: "你是一個能為對話生成簡短標題的助手。" },
          ...chat,
          {
            role: "user",
            content: "請為這段對話生成一個能簡單表明對話主題的標題。",
          },
        ],
        max_tokens: 50, // 適合生成標題的 token 限制
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const responseData = await response.json();

    // 提取生成的標題
    const title = responseData.choices[0]?.message?.content.trim();
    //console.log(title);
    return title || "新對話"; // 若未返回有效內容，提供預設標題
  } catch (error) {
    console.error("Error generating title:", error);
    return "標題生成失敗";
  }
}
