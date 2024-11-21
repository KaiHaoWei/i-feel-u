import Image from "next/image";
import IFeelULogo from "/home/remi/桌面/i-feel-u/public/IFEELU_Logo_transparent.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="flex bg-[#dfd6ce] items-center min-h-screen  gap-16 sm:p-20 w-full">
      <div>
        <Image
          src={IFeelULogo}
          // layout="responsive"
          width={800}
          height={800}
          alt="I FEEL U 團隊"
        />
      </div>
      <div className="flex flex-col w-lvh h-full">
        <div className="flex flex-col m-10 p-20">
          <h1 className="text-9xl text-[#6d5b47] bevan-regular">ABOUT</h1>
          <h1 className="text-9xl text-[#6d5b47] bevan-regular">I FEEL U</h1>
        </div>
        <div className="flex flex-col m-10 p-20">
          <h1 className="font-semibold text-4xl my-10 text-[#6d5b47]">
            I Feel U
            是一款人性化聊天AI，可以透過文字輸入或者語音輸入來與其互動。
          </h1>
        </div>
        <div className="flex ml-10 pl-20">
          <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
            <h1 className="text-white font-semibold text-lg">
              <Link href={`/`}>{`<< 回到首頁`}</Link>
            </h1>
          </Button>
          <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
            <h1 className="text-white font-semibold text-lg">
              <Link href={`/main/Login`}>{`開始試用 >>`}</Link>
            </h1>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
