import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const loginUserSchema = z.object({
  userEmail: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  userPassword: z.string({
    required_error: "Password is required",
  }),
});

type LoginUserRequest = z.infer<typeof loginUserSchema>;

export async function POST(request: NextRequest) {
  let data;

  // 驗證輸入資料
  try {
    data = await request.json();
    loginUserSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { userEmail, userPassword } = data as LoginUserRequest;

  try {
    // 從數據庫查詢用戶
    const [user] = await db
      .select({
        display_id: userTable.displayId,
        userEmail: userTable.userEmail,
        userPassword: userTable.userPassword,
      })
      .from(userTable)
      .where(eq(userTable.userEmail, userEmail));

    if (!user) {
      return NextResponse.json(
        { error: "User not found or invalid credentials" },
        { status: 401 }
      );
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 登入成功，生成 JWT 並返回
    const token = jwt.sign(
      { display_id: user.display_id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" } // 設置過期時間（例如1小時）
    );

    // 返回用戶的 display_id 和 JWT
    return NextResponse.json(
      { message: user.display_id, token: token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
