import { UUID } from "crypto";
import Chatroom from "./chatroom";
import "regenerator-runtime/runtime";
import { useRouter } from "next/router";

type Props = {
  params: {
    display_id: UUID;
  };
};

async function Page({ params: { display_id } }: Props) {
  return (
    <div className="flex">
      <Chatroom displayId={display_id as string} />
    </div>
  );
}

export default Page;
