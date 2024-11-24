'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import IFeelULogo from "@/../public/IFEELU_Logo_transparent.png";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="flex flex-col items-center min-h-screen gap-16 sm:p-10 bg-[#F0E7DA]"
      initial={{ opacity: 0, y: 50 }} // Start off-screen and faded out
      animate={{ opacity: 1, y: 0 }} // Fade in and slide up
      exit={{ opacity: 0, y: 50 }} // Slide down and fade out on exit
      transition={{ duration: 0.8, ease: "easeInOut" }} // Smooth transition
    >
      {/* Title box */}
      <motion.div
        className="flex items-center bg-white rounded-3xl px-20 py-40 shadow-lg w-full min-w-fit min-h-fit"
        initial={{ scale: 0.8, opacity: 0 }} // Scale down and fade out initially
        animate={{ scale: 1, opacity: 1 }} // Scale up and fade in
        transition={{ duration: 1, ease: "easeOut" }} // Longer, smoother transition
      >
        <div className="flex flex-col w-1/3 items-start">
          <h1 className="text-8xl text-[#9a8980] bevan-regular">NEVER</h1>
          <h1 className="text-8xl text-[#9a8980] bevan-regular">BEEN</h1>
          <h1 className="text-8xl text-[#9a8980] bevan-regular">FELT?</h1>
        </div>
        <div className="flex w-2/3 justify-end">
          <h1 className="mr-20 text-9xl text-[#292628] bevan-regular">I</h1>
          <h1 className="mr-20 text-9xl text-[#6d5b47] bevan-regular">FEEL</h1>
          <h1 className="text-9xl text-[#9a8980] bevan-regular">U</h1>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        className="flex justify-between items-center px-20 w-full min-w-fit min-h-fit"
        initial={{ x: -100, opacity: 0 }} // Slide in from left
        animate={{ x: 0, opacity: 1 }} // Slide into view
        transition={{ duration: 1, ease: "easeInOut" }} // Smooth transition
      >
        <div className="flex flex-col">
          <h1 className="font-medium text-2xl my-10 text-amber-900">
            你是否有過無法被理解，卻沒有可以傾訴的對象呢? 又或者，你遇到某件事情，但沒有可以分享的對象呢?
          </h1>
          <h1 className="font-semibold text-2xl my-10 text-amber-900">
            那就來使用【I FEEL U】來抒發你內心的任何心情吧！
          </h1>
          <motion.div
            className="flex"
            initial={{ opacity: 0, scale: 0.8 }} // Start smaller and faded
            animate={{ opacity: 1, scale: 1 }} // Grow and fade in
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} // Delay for emphasis
          >
            <Link href="/main/Login">
              <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <h1 className="text-white font-semibold text-lg">進入聊天室</h1>
              </Button>
            </Link>

            <Link href="/main/About">
              <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <h1 className="text-white font-semibold text-lg">關於 I Feel U</h1>
              </Button>
            </Link>

            <Link href="/main/ContactUs">
              <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <h1 className="text-white font-semibold text-lg">聯絡我們</h1>
              </Button>
            </Link>
          </motion.div>

        </div>

        <motion.div
          className="w-full max-w-xl"
          initial={{ scale: 0.5, opacity: 0 }} // Shrink and fade out
          animate={{ scale: 1, opacity: 1 }} // Grow and fade in
          transition={{ duration: 1, ease: "easeOut" }} // Smooth transition
        >
          <Image
            src={IFeelULogo}
            width={1000}
            height={1000}
            alt="I FEEL U 團隊"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
