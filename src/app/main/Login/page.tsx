"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
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
          ></Input>
          <Input
            className="w-full bg-white rounded-full my-10"
            placeholder="Password"
            type="password"
          ></Input>
          <div className="flex">
            <Button className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 mr-10">
              <h1 className="text-white font-semibold text-lg">Sign In</h1>
            </Button>
            <Button className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
              <h1 className="text-white font-semibold text-lg">Sign Up</h1>
            </Button>
          </div>
          <Link className="no-underline hover:underline" href="/">
            {`Continue without signing in (no records will be saved)`}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
