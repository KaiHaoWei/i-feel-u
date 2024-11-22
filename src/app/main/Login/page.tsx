"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { loading, registerUser } = useUser();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const body = await registerUser({
        userEmail: userEmail,
        userPassword: userPassword,
      });
    } catch (error) {
      console.log(error);
    }

    setUserEmail("");
    setUserPassword("");
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
            placeholder="Password"
            type="password"
            value={userPassword}
            onChange={(e) => {
              setUserPassword(e.target.value);
            }}
          ></Input>
          <div className="flex">
            <Button className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 mr-10">
              <h1 className="text-white font-semibold text-lg">Sign In</h1>
            </Button>
            <Button
              className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10"
              onClick={handleSubmit}
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
