import Image from "next/image";
import IFeelULogo from "@/../public/IFEELU_Logo_transparent.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="flex bg-[#dfd6ce] items-center min-h-screen  gap-16 sm:p-20 w-full">
      <div className="flex flex-col w-full h-fit">
        <div className="flex flex-col m-10 p-20">
          <h1 className="text-9xl text-[#6d5b47] bevan-regular">Contact Us</h1>
        </div>
        <div className="flex justify-between pr-20">
          <div>
            <Link href={`/`}>
              <Image
                src={IFeelULogo}
                // layout="responsive"
                width={700}
                height={700}
                alt="I FEEL U 團隊"
              />
            </Link>
          </div>
          <div className="flex flex-col">
            {" "}
            <div className="flex flex-col h-fit my-20 ">
              <h1 className="font-semibold text-4xl my-5 text-[#6d5b47]">
                Phone
              </h1>
              <h1 className="font-medium text-2xl">0900-000-000</h1>
            </div>
            <div className="flex flex-col h-fit mb-20">
              <h1 className="font-semibold text-4xl my-5 text-[#6d5b47]">
                E-mail
              </h1>
              <h1 className="font-medium text-2xl">ifeelusupport@gmail.com</h1>
            </div>
            <div className="flex flex-col h-fit mb-20">
              <Button className="p-10 py-8 w-fit rounded-full hover:bg-[#6d5b47] bg-[#9a8980] my-10">
                <h1 className="text-white font-semibold text-lg">
                  <Link href={`/`}>{`<< 回到首頁`}</Link>
                </h1>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
