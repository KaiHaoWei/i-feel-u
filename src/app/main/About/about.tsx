'use client';
import Image from "next/image";
import IFeelULogo from "@/../public/IFEELU_Logo_transparent.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const About = () => {

  const fadeUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
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
      className="flex flex-column bg-[#dfd6ce] items-center h-screen sm:gap-16 sm:p-10 w-full"
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      exit="animate"
    >
      <motion.div
        variants={fadeUpVariants}
      // initial="initial"
      // animate="animate"
      >
        <Image
          src={IFeelULogo}
          width={800}
          height={800}
          alt="I FEEL U 團隊"
        />
      </motion.div>

      <div className="flex flex-col h-full">
        <motion.div
          className="flex flex-col p-5"
          variants={fadeUpVariants}
        >
          <h1 className="text-[6.5vw] text-[#6d5b47] bevan-regular">ABOUT</h1>
          <h1 className="text-[6.5vw] text-[#6d5b47] bevan-regular">I FEEL U</h1>
        </motion.div>

        <motion.div
          className="flex flex-col p-5"
          variants={fadeUpVariants}
        >
          <h1 className="font-semibold text-[3.5vw] sm:text-[2vw] my-5 text-[#6d5b47]">
            I Feel U
            是一款人性化聊天AI，可以透過文字輸入或者語音輸入來與其互動。
          </h1>
        </motion.div>

        <motion.div
          className="flex ml-[1vw] pl-[1vw]"
          variants={fadeUpVariants}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
          >
            <Link href={`/`}>
              <Button className="mr-[5vw] p-[3.5vw] py-[2.5vw] w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <motion.h1
                  className="text-white font-semibold text-[2.8vw] sm:text-[1.5vw]"
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
              <Button className="mr-[5vw] p-[3.5vw] py-[2.5vw] sm:p-[2.5vw] w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <motion.h1
                  className="text-white font-semibold text-[2.8vw] sm:text-[1.5vw]"
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
