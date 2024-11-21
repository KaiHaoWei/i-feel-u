import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import IFeelULogo from "/home/remi/桌面/i-feel-u/public/IFEELU_Logo_transparent.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen  gap-16 sm:p-10 bg-[#F0E7DA]">
      {/* title box */}
      <div className="flex items-center bg-white rounded-3xl px-20 py-40 shadow-lg w-full min-w-fit min-h-fit">
        <div className="flex flex-col w-1/3 items-start">
          <h1 className="text-8xl text-[#9a8980] bevan-regular">NEVER</h1>
          <h1 className="text-8xl text-[#9a8980] bevan-regular">BEEN</h1>
          <h1 className="text-8xl text-[#9a8980] bevan-regular">FELT?</h1>
        </div>
        <div className="flex w-2/3 justify-end">
          <h1 className="mr-20 text-9xl text-[#292628] bevan-regular ">I</h1>
          <h1 className="mr-20 text-9xl text-[#6d5b47] bevan-regular ">FEEL</h1>
          <h1 className="text-9xl text-[#9a8980] bevan-regular">U</h1>
        </div>
      </div>
      {/* introduction */}
      <div className="flex justify-between items-center px-20 w-full min-w-fit min-h-fit">
        <div className="flex flex-col">
          <h1 className="font-medium text-2xl my-10">
            你是否有過無法被理解，卻沒有可以傾訴的對象呢?
            又或者，你遇到某件事情，但沒有可以分享的對象呢?
          </h1>
          <h1 className="font-semibold text-2xl my-10">
            那就來使用【I FEEL U】來抒發你內心的任何心情吧！
          </h1>
          <div className="flex">
            <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
              <h1 className="text-white font-semibold text-lg">開始試用</h1>
            </Button>
            <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
              <h1 className="text-white font-semibold text-lg">
                <Link href={`/main/About`}>關於 I Feel U</Link>
              </h1>
            </Button>
            <Button className="mr-10 p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
              <h1 className="text-white font-semibold text-lg">
                <Link href={`/main/ContactUs`}>聯絡我們</Link>
              </h1>
            </Button>
          </div>
        </div>
        <div className="w-full max-w-xl">
          <Image
            src={IFeelULogo}
            // layout="responsive"
            width={1000}
            height={1000}
            alt="I FEEL U 團隊"
          />
        </div>
      </div>
    </div>
  );
}
