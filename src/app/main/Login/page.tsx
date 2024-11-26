"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useRegister from "@/hooks/useRegistration";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion"; // Importing framer-motion for animations

interface CustomJwtPayload {
  display_id: string;
  iat: number;
  exp: number;
}

const Page = () => {
  const { registerUser } = useRegister();
  const { loginUser } = useLogin();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false); // State to toggle between Sign In and Sign Up
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Decode the token and extract display_id
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const displayId = decoded.display_id;
        router.push(`/main/PersonalChatroom/${displayId}`);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [router]);

  const handleRegister = async () => {
    try {
      await registerUser({
        userEmail: userEmail,
        userPassword: userPassword,
      });
      alert("註冊成功！");
    } catch (error) {
      if (error instanceof Response) {
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
    } finally {
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
    <motion.div
      className="flex bg-[#dfd6ce] items-center min-h-screen gap-16 sm:px-20 sm:py-0 w-full"
      initial={{ opacity: 0, x: -100 }} // Start with opacity 0 and from the left
      animate={{ opacity: 1, x: 0 }} // Animate to full opacity and default x position
      transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition
    >
      <div className="flex w-full h-fit justify-between">
        <motion.div
          className="flex flex-col sm:m-10 sm:p-20 items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }} // Start with smaller size and hidden
          animate={{ scale: 1, opacity: 1 }} // Animate to normal size and full opacity
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition with delay
        >
          {/* Title animation */}
          <motion.h1
            className="text-[10vw] sm:text-9xl text-[#6d5b47] bevan-regular"
            initial={{ opacity: 0, x: -100 }} // Start with opacity 0 and slide in from left
            key={isSignUpMode ? "Sign Up" : "Sign In"} // Key to trigger re-render on mode change
            animate={{ opacity: 1, x: 0 }} // Animate to full opacity and default position
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition for the title
          >
            {isSignUpMode ? "Sign Up" : "Sign In"}
          </motion.h1>
        </motion.div>

        {/* Container for input fields and buttons */}
        <div className="flex flex-col sm:m-10 sm:p-20 w-1/2">
          {/* Animated Input Fields */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }} // Start below and hidden
            animate={{ opacity: 1, y: 0 }} // Animate to original position and full opacity
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} // Smooth transition for inputs
          >
            <Input
              className="w-full bg-white rounded-full my-10 text-black"
              placeholder="E-mail"
              type="text"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
            />

            <Input
              className="w-full bg-white rounded-full my-10 text-black"
              placeholder="Password (8-20 characters)"
              type="password"
              value={userPassword}
              onChange={(e) => {
                setUserPassword(e.target.value);
              }}
            />
          </motion.div>

          {/* Sign In / Sign Up Button */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ y: 50, opacity: 0 }} // Start below and hidden
            key={isSignUpMode ? "Sign Up" : "Sign In"} // Key to trigger re-render on mode change
            animate={{ y: 0, opacity: 1 }} // Animate to original position and full opacity
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} // Smooth transition for the button
          >
            <Button
              className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 mr-10"
              onClick={isSignUpMode ? handleRegister : handleLogin}
            >
              <h1 className="text-white font-semibold text-lg">
                {isSignUpMode ? "Sign Up" : "Sign In"}
              </h1>
            </Button>

            {/* Toggle text to switch between Sign In and Sign Up */}
            <motion.p
              className="text-black font-semibold text-lg my-4"
              initial={{ opacity: 0 }} // Start hidden
              key={isSignUpMode ? "Sign Up" : "Sign In"} // Key to trigger re-render on mode change
              animate={{ opacity: 1 }} // Fade in text
              transition={{ duration: 0.5 }}
            >
              {isSignUpMode ? "Already have an account?" : "Don't have an account?"}
              <span
                className="text-[#6d5b47] cursor-pointer ml-2"
                onClick={() => setIsSignUpMode(!isSignUpMode)} // Toggle between Sign In and Sign Up
              >
                {isSignUpMode ? "Sign In" : "Sign Up"}
              </span>
            </motion.p>

            <Link className="no-underline hover:underline text-black" href="/main/Chatroom">
              {`Continue without signing in (no records will be saved)`}
            </Link>

            {/* Back to Home Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }} // Start below and hidden
              animate={{ opacity: 1, y: 0 }} // Animate to original position and full opacity
              transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition for the button
            >
              <Link className="no-underline hover:underline text-black" href="/">
                <Button className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 mr-10 text-lg font-bold">
                  {`回到首頁`}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Page;
