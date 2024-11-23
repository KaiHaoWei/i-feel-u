import Chatroom from "./chatroom";
import "regenerator-runtime/runtime";

type PageProps = {
  params: Promise<{
    display_id: string;
  }>;
};

async function Page({ params }: PageProps) {
  // 等待 params 的解析
  const { display_id } = await params;

  // 驗證 display_id 是否為有效 UUID 格式
  const isValidUUID = (id: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  if (!isValidUUID(display_id)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Invalid display_id format</h1>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* 將 display_id 傳遞給 Chatroom */}
      <Chatroom displayId={display_id} />
    </div>
  );
}

export default Page;
