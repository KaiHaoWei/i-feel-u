import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";
import bcrypt from "bcryptjs"; // 安装 bcryptjs 进行密码哈希处理

import { db } from "@/db";
import { userTable } from "@/db/schema";

const postUserRequestSchema = z.object({
  userEmail: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"), // 验证邮箱格式
  userPassword: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters") // 设置密码最小长度
    .max(20, "Password must be no more than 20 characters"), // 设置密码最大长度
});

type postUserRequest = z.infer<typeof postUserRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postUserRequestSchema.parse(data); // 验证输入
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

  try {
    // 使用 bcrypt 对密码进行加密
    const hashedPassword = await bcrypt.hash(userPassword, 10); // 10 是盐的复杂度

    // 插入用户数据到数据库
    const [userRegistration] = await db
      .insert(userTable)
      .values({
        userEmail,
        userPassword: hashedPassword, // 存储加密后的密码
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
