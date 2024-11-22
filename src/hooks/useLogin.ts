import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useLogin() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const loginUser = async ({
    userEmail,
    userPassword,
  }: {
    userEmail: string;
    userPassword: string;
  }) => {
    setLoginLoading(true);
    const data = { userEmail, userPassword };

    try {
      const res = await fetch(`/api/UserLoginAuthentication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 確保傳送 JSON
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setErrorMessage(body.error);
        console.error("Login API error:", body.error); // 打印錯誤訊息
        throw new Error(body.error);
      }

      // 假設返回的 JSON 包含 token 或 display_id
      const responseBody = await res.json();
      return responseBody;
    } catch (error) {
      // 在這裡捕獲任何錯誤，並將錯誤訊息顯示出來
      console.error("Login failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      throw error; // 繼續拋出錯誤以便上層處理
    } finally {
      // 不管成功還是失敗，都應該關閉 loading 狀態
      setLoginLoading(false);
    }
  };

  return {
    loginLoading,
    loginUser,
    errorMessage, // 可以用來顯示錯誤訊息
  };
}
