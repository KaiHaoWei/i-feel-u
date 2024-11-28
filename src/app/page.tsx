'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import IFeelULogo from "@/../public/IFEELU_Logo_transparent.png";

import { motion } from "framer-motion";

export default function Home() {
  // Animation Variants
  const fadeUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen gap-1 pt-10 px-[10vw] bg-[#F0E7DA]"
      initial="initial"
      animate="animate"
      exit="animate"
      variants={fadeInVariants} // Apply fadeIn effect to the entire container
    >
      {/* Title box */}
      <motion.div
        className="flex justify-around items-center bg-white rounded-3xl px-[2.5vw] py-[2.5vw] shadow-lg w-full min-w-fit min-h-fit"
        variants={fadeUpVariants} // Apply fadeUp effect to the title box
      >
        <div className="flex flex-col w-2/5 items-start">
          <h1 className="text-[4.5vw] text-[#9a8980] bevan-regular sm:text-[3.5vw]">NEVER</h1>
          <h1 className="text-[4.5vw] text-[#9a8980] bevan-regular sm:text-[3.5vw]">BEEN</h1>
          <h1 className="text-[4.5vw] text-[#9a8980] bevan-regular sm:text-[3.5vw]">FELT?</h1>
        </div>
        <div className="flex w-3/5 justify-end">
          <h1 className="mr-[5vw] text-[8vw] text-[#292628] bevan-regular">I</h1>
          <h1 className="mr-[5vw] text-[8vw] text-[#6d5b47] bevan-regular">FEEL</h1>
          <h1 className="text-[8vw] text-[#9a8980] bevan-regular">U</h1>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center px-[1.5vw] w-full min-w-fit min-h-fit"
        variants={fadeUpVariants} // Apply fadeUp effect to the introduction section
      >
        <div className="flex flex-col mx-[1.5vw]">
          <motion.div
            className="font-medium text-[2.5vw] my-5 text-amber-900 sm:text-[1.5vw]"
            variants={fadeInVariants} // Apply fadeIn to the text
          >
            你是否有過無法被理解，卻沒有可以傾訴的對象呢? 又或者，你遇到某件事情，但沒有可以分享的對象呢?
          </motion.div>
          <motion.div
            className="font-semibold text-[2.5vw] my-1 sm:my-5 text-amber-900 sm:text-[1.5vw]"
            variants={fadeInVariants} // Apply fadeIn to the second text block
          >
            那就來使用【I FEEL U】來抒發你內心的任何心情吧！
          </motion.div>
          <motion.div
            className="flex"
            variants={fadeUpVariants} // Apply fadeUp to the button group
          >
            <Link href="/main/Login">
              <Button className="mr-10 p-[3vw] py-[3.5vw] w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 sm:p-8 sm:py-10">
                <h1 className="text-white font-semibold text-[2.5vw] sm:text-[1.5vw]">進入聊天室</h1>
              </Button>
            </Link>

            <Link href="/main/About">
              <Button className="mr-10 p-[3vw] py-[3.5vw] w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 sm:p-8 sm:py-10">
                <h1 className="text-white font-semibold text-[2.5vw] sm:text-[1.5vw]">關於 I Feel U</h1>
              </Button>
            </Link>

            <Link href="/main/ContactUs">
              <Button className="mr-10 p-[3vw] py-[3.5vw] w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10 sm:p-8 sm:py-10">
                <h1 className="text-white font-semibold text-[2.5vw] sm:text-[1.5vw]">聯絡我們</h1>
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="w-[25vw]"
          variants={fadeUpVariants} // Apply fadeUp effect to the image
        >
          <Image
            src={IFeelULogo}
            alt="I FEEL U 團隊"
            className="w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
