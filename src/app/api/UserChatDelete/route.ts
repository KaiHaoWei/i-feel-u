import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { chatMessagesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const putUserSaveRequestSchema = z.object({
  display_id: z.string(),
});

type putUserSaveRequest = z.infer<typeof putUserSaveRequestSchema>;

export async function PUT(request: NextRequest) {
  let data = await request.json();
  //console.log(data);
  try {
    putUserSaveRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { display_id } = data as putUserSaveRequest;

  try {
    if (!display_id) {
      return NextResponse.json(
        { error: "No displayId provided" },
        { status: 400 }
      );
    }
    const result = await db
      .delete(chatMessagesTable)
      .where(eq(chatMessagesTable.displayId, display_id));
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No chat message found with the given displayId" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Chat message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting chat messages:", error);
    return NextResponse.json(
      { error: "Something went wrong when deleting chat" },
      { status: 500 }
    );
  }
}
