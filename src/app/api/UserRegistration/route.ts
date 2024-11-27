import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const postUserRequestSchema = z.object({
  userEmail: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  userPassword: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be no more than 20 characters"),
});

type postUserRequest = z.infer<typeof postUserRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postUserRequestSchema.parse(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "email或密碼格式錯誤" }, { status: 400 });
  }

  const { userEmail, userPassword } = data as postUserRequest;

  if (!userEmail) {
    return NextResponse.json(
      { error: "Empty email not allowed" },
      { status: 400 }
    );
  }

  if (!userPassword) {
    return NextResponse.json(
      { error: "Empty password not allowed" },
      { status: 400 }
    );
  }

  const [user] = await db
      .select({
        userEmail: userTable.userEmail,
      })
      .from(userTable)
      .where(eq(userTable.userEmail, userEmail));

  if(user){
    return NextResponse.json({ error: "The E-mail already registered" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    await db
      .insert(userTable)
      .values({
        userEmail,
        userPassword: hashedPassword,
      })
      .returning();

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
