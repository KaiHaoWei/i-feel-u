import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { chatMessagesTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const getChatRequestSchema = z.object({
  user_id: z.string().uuid(),
});

type getChatRequest = z.infer<typeof getChatRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();

  try {
    getChatRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Content" }, { status: 400 });
  }

  const { user_id } = data as getChatRequest;

  try {
    const result = await db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.userId, user_id))
      .orderBy(desc(chatMessagesTable.createdAt))
      .execute();

    // if (result.length === 0) {
    //   return NextResponse.json(
    //     { message: "No records found" },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json({ result: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
