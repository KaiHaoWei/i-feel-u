import Chatroom from "./chatroom";
import "regenerator-runtime/runtime";

async function Page() {
  return (
    <div className="flex">
      <Chatroom />
    </div>
  );
}

export default Page;
