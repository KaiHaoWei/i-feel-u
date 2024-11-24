'use client';
import Image from "next/image";
import IFeelULogo from "@/../public/IFEELU_Logo_transparent.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const About = () => {
  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  const pageTransition = {
    duration: 0.6,
    ease: "easeInOut",
  };

  // Pop-out animation variants
  const elementVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Start smaller and invisible
    visible: {
      opacity: 1,
      scale: 1, // Scale to normal size
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // Button hover animation
  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "transparent",
      transition: { duration: 0.3 },
    },
  };

  // Link hover animation
  const linkVariants = {
    hover: {
      color: "#ffffff",
      scale: 1.1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="flex bg-[#dfd6ce] items-center min-h-screen gap-16 sm:p-20 w-full"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <motion.div
        variants={elementVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Image
          src={IFeelULogo}
          width={800}
          height={800}
          alt="I FEEL U 團隊"
        />
      </motion.div>

      <div className="flex flex-col w-lvh h-full">
        <motion.div
          className="flex flex-col m-10 p-20"
          variants={elementVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-9xl text-[#6d5b47] bevan-regular">ABOUT</h1>
          <h1 className="text-9xl text-[#6d5b47] bevan-regular">I FEEL U</h1>
        </motion.div>

        <motion.div
          className="flex flex-col m-10 p-20"
          variants={elementVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <h1 className="font-semibold text-4xl my-10 text-[#6d5b47]">
            I Feel U
            是一款人性化聊天AI，可以透過文字輸入或者語音輸入來與其互動。
          </h1>
        </motion.div>

        <motion.div
          className="flex ml-10 pl-20"
          variants={elementVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link href={`/`}>
              <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <motion.h1
                  className="text-white font-semibold text-lg"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  {`<< 回到首頁`}
                </motion.h1>
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover">
            <Link href={`/main/Login`}>
              <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <motion.h1
                  className="text-white font-semibold text-lg"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  {`開始試用 >>`}
                </motion.h1>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
