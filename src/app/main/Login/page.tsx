"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useRegister from "@/hooks/useRegistration";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { registerLoading, registerUser } = useRegister();
  const { loginLoading, loginUser } = useLogin();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleRegister = async () => {
    try {
      const body = await registerUser({
        userEmail: userEmail,
        userPassword: userPassword,
      });

      // 假设成功后会有一个 message 提示
      alert("註冊成功！");
    } catch (error) {
      if (error instanceof Response) {
        // 检查是否是 fetch 的 Response 对象
        try {
          const errorData = await error.json();
          alert(`註冊失敗: ${errorData.error || "未知的錯誤"}`);
        } catch {
          alert("註冊失敗: 無法解析伺服器錯誤信息");
        }
      } else if (error instanceof Error) {
        // 如果是普通的 JavaScript Error 对象
        alert(`註冊失敗: ${error.message}`);
      } else {
        // 无法识别的错误
        alert("註冊失敗: 發生未知錯誤");
      }

      console.error("Error during registration:", error);
    } finally {
      // 清空输入框
      setUserEmail("");
      setUserPassword("");
    }
  };

  const handleLogin = async () => {
    try {
      const body = await loginUser({
        userEmail: userEmail,
        userPassword: userPassword,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-[#dfd6ce] items-center min-h-screen  gap-16 sm:p-20 w-full">
      <div className="flex  w-full h-fit justify-between">
        <div className=" flex flex-col m-10 p-20 items-center justify-center">
          <h1 className="text-9xl text-[#6d5b47] bevan-regular">Sign In</h1>
        </div>
        <div className="flex flex-col  m-10 p-20 w-1/2">
          <Input
            className="w-full bg-white rounded-full my-10"
            placeholder="E-mail"
            type="text"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
          ></Input>
          <Input
            className="w-full bg-white rounded-full my-10"
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
