"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useRegister from "@/hooks/useRegistration";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  display_id: string;
  iat: number;
  exp: number;
}

const Page = () => {
  const { registerLoading, registerUser } = useRegister();
  const { loginLoading, loginUser } = useLogin();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // 解碼 token，並提取 display_id
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const displayId = decoded.display_id;
        router.push(`/main/PersonalChatroom/${displayId}`);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleRegister = async () => {
    try {
      // 使用註冊 API 發送註冊請求
      const body = await registerUser({
        userEmail: userEmail,
        userPassword: userPassword,
      });

      // 假設註冊成功後顯示提示訊息
      alert("註冊成功！");
    } catch (error) {
      if (error instanceof Response) {
        // 如果是 fetch 的 Response 物件
        try {
          const errorData = await error.json();
          alert(`註冊失敗: ${errorData.error || "未知的錯誤"}`);
        } catch {
          alert("註冊失敗: 無法解析伺服器錯誤信息");
        }
      } else if (error instanceof Error) {
        alert(`註冊失敗: ${error.message}`);
      } else {
        alert("註冊失敗: 發生未知錯誤");
      }

      console.error("Error during registration:", error);
    } finally {
      // 清空輸入框
      setUserEmail("");
      setUserPassword("");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        userEmail: userEmail,
        userPassword: userPassword,
      });

      if (response && response.token) {
        const token = response.token;
        localStorage.setItem("authToken", token);
        router.push(`/main/PersonalChatroom/${response.message}`);
      } else {
        alert("Login failed: No token received.");
      }
    } catch (error) {
      alert(`Login failed: ${error}`);
    }
  };

  return (
    <div className="flex bg-[#dfd6ce] items-center min-h-screen gap-16 sm:p-20 w-full">
      <div className="flex w-full h-fit justify-between">
        <div className="flex flex-col m-10 p-20 items-center justify-center">
          <h1 className="text-9xl text-[#6d5b47] bevan-regular">Sign In</h1>
        </div>
        <div className="flex flex-col m-10 p-20 w-1/2">
          <Input
            className="w-full bg-white rounded-full my-10 text-black"
            placeholder="E-mail"
            type="text"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
          ></Input>
          <Input
            className="w-full bg-white rounded-full my-10 text-black"
            placeholder="Password (8-20 characters)"
            type="password"
            value={userPassword}
            onChange={(e) => {
              setUserPassword(e.target.value);
            }}
          ></Input>
          <div className="flex">
            <Button
              className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 mr-10"
              onClick={handleLogin}
            >
              <h1 className="text-white font-semibold text-lg">Sign In</h1>
            </Button>
            <Button
              className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10"
              onClick={handleRegister}
            >
              <h1 className="text-white font-semibold text-lg">Sign Up</h1>
            </Button>
          </div>
          <Link className="no-underline hover:underline" href="/main/Chatroom">
            {`Continue without signing in (no records will be saved)`}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
