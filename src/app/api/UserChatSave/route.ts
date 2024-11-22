import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { chatMessagesTable } from "@/db/schema";

const postContentRequestSchema = z.object({
  user_id: z.string().uuid(),
  chat: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

type postContentRequest = z.infer<typeof postContentRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();

  try {
    postContentRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Content" }, { status: 400 });
  }

  const { user_id, chat } = data as postContentRequest;

  try {
    if (chat.length != 0 && user_id) {
      await db.transaction(async (trx) => {
        const [uploadedContent] = await trx
          .insert(chatMessagesTable)
          .values({ userId: user_id, chat })
          .returning();
      });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong when uploading chat" },
      { status: 500 }
    );
  }
}
