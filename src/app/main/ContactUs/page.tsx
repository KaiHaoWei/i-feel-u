'use client'
import Image from "next/image";
import IFeelULogo from "@/../public/IFEELU_Logo_transparent.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Page = () => {

  const fadeUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="flex bg-[#dfd6ce] items-center min-h-screen sm:gap-16 sm:p-15 w-full"
      initial="initial"
      animate="animate"
      exit="initial"
    >
      <motion.div
        className="flex flex-col w-full h-fit"
        variants={fadeInVariants}
      >
        {/* Title Section */}
        <motion.div
          className="flex flex-col mx-[10vw] p-[3vw] sm:pt-[5vw]"
          variants={fadeUpVariants}
        >
          <h1 className="text-[8vw] sm:text-[5vw] text-[#6d5b47] bevan-regular">
            Contact Us
          </h1>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="flex justify-between pr-[20vw] pl-[8vw]"
          variants={fadeInVariants}
        >
          {/* Logo Section */}
          <motion.div variants={fadeUpVariants}>
            <Link href={`/`}>
              <Image
                src={IFeelULogo}
                className="object-contain max-w-[35vw]" // Maintain aspect ratio
                alt="I FEEL U 團隊"
              />
            </Link>
          </motion.div>

          {/* Information Section */}
          <motion.div
            className="flex flex-col"
            variants={fadeUpVariants}
          >
            <div className="flex flex-col h-fit my-[2vw]">
              <h1 className="font-semibold text-[3.8vw] sm:text-[2vw] mb-5 text-[#6d5b47]">
                Phone
              </h1>
              <h1 className="font-medium text-[2.5vw] sm:text-[1.3vw] text-black underline">
                0900-000-000
              </h1>
            </div>

            <div className="flex flex-col h-fit my-[3vw]">
              <h1 className="font-semibold text-[3.8vw] sm:text-[2vw] mb-5 text-[#6d5b47]">
                E-mail
              </h1>
              <h1 className="font-medium text-[2.5vw] sm:text-[1.3vw] text-black underline">
                ifeelusupport@gmail.com
              </h1>
            </div>

            <motion.div
              className="flex flex-col h-fit"
              variants={fadeUpVariants}
            >
              <Link href={`/`}>
                <Button className="p-[3.5vw] py-[3.5vw] sm:p-[2.5vw] sm:py-[1.8vw] w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                  <h1 className="text-white font-semibold text-[2.5vw] sm:text-[1.2vw]">
                    {`<< 回到首頁`}
                  </h1>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Page;
