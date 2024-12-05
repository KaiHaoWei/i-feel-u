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
import { Snackbar, Alert } from "@mui/material"; // Error Message

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

  const [errorMessage, setErrorMessage] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

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
      setIsSignUpMode(false);
      setErrorMessage("Registration successful!"); // Feedback for success
      setIsSnackbarOpen(true);
    } catch (error) {
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          setErrorMessage(
            `Registration failed: ${errorData.error || "Unknown error"}`
          );
          setIsSnackbarOpen(true);
        } catch {
          setErrorMessage("Registration failed: Unable to parse server error.");
          setIsSnackbarOpen(true);
        }
      } else if (error instanceof Error) {
        setErrorMessage(`Registration failed: ${error.message}`);
        setIsSnackbarOpen(true);
      } else {
        setErrorMessage("Registration failed: An unknown error occurred.");
        setIsSnackbarOpen(true);
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
        setErrorMessage("Login failed: No token received.");
        setIsSnackbarOpen(true);
      }
    } catch (error) {
      setErrorMessage(`Login failed: ${error}`);
      setIsSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <motion.div
      className="flex bg-gradient-to-r from-[#ffefba] to-[#d9a77d] items-center min-h-screen gap-16 sm:px-20 sm:py-0 w-full"
      initial={{ opacity: 0, x: -100 }} // Start with opacity 0 and from the left
      animate={{ opacity: 1, x: 0 }} // Animate to full opacity and default x position
      transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition
    >
      <div className="flex flex-col w-full h-fit justify-between sm:flex-row">
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
        <div className="flex flex-col m-[2vw] my-[4vw] sm:m-10 sm:p-20 sm:w-full">
          {/* Animated Input Fields */}
          <motion.div
            className="flex flex-col items-center px-[15vw] sm:px-0"
            initial={{ opacity: 0, y: 50 }} // Start below and hidden
            animate={{ opacity: 1, y: 0 }} // Animate to original position and full opacity
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} // Smooth transition for inputs
          >
            <Input
              className="w-full bg-white rounded-full my-[4vw] sm:my-[2.5vw] text-black"
              placeholder="E-mail"
              type="text"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
            />

            <Input
              className="w-full bg-white rounded-full my-[4vw] sm:my-[2.5vw] text-black"
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
            <div className="flex flex-row justify-around">
              <Button
                className="m-[6vw] p-[5vw] sm:m-10 sm:p-10 sm:py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] sm:text-lg font-bold"
                onClick={isSignUpMode ? handleRegister : handleLogin}
              >
                <h1 className="text-white font-semibold sm:text-lg">
                  {isSignUpMode ? "Sign Up" : "Sign In"}
                </h1>
              </Button>

              {/* Back to Home Button */}
              <Link href="/">
                <Button
                  className="m-[6vw] p-[5vw] sm:m-10 sm:p-10 sm:py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] sm:text-lg font-bold
                "
                >
                  {`回到首頁`}
                </Button>
              </Link>
            </div>

            {/* Toggle text to switch between Sign In and Sign Up */}
            <p className="text-black font-semibold text-lg my-4">
              {isSignUpMode
                ? "Already have an account?"
                : "Don't have an account?"}
              <span
                className="text-[#6d5b47] cursor-pointer ml-2 hover:underline"
                onClick={() => setIsSignUpMode(!isSignUpMode)} // Toggle between Sign In and Sign Up
              >
                {isSignUpMode ? "Sign In" : "Sign Up"}
              </span>
            </p>

            <Link
              className="no-underline hover:underline text-black"
              href="/main/Chatroom"
            >
              {`Continue without signing in (no records will be saved)`}
            </Link>
          </motion.div>
        </div>
      </div>
      <>
        {/* Snackbar for error messages */}
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={4000} // Automatically hide after 4 seconds
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position on the screen
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="info"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </>
    </motion.div>
  );
};

export default Page;
