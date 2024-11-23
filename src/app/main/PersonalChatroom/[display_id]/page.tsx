import Chatroom from "./chatroom";
import "regenerator-runtime/runtime";

type PageProps = {
  params: {
    display_id: string;
  };
};

async function Page({ params }: PageProps) {
  const { display_id } = params;

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

export async function generateStaticParams() {
  // 如果需要靜態生成頁面，請提供預設的 display_id 列表
  return [
    { display_id: "123e4567-e89b-12d3-a456-426614174000" },
    { display_id: "987e6543-e21c-32d1-b654-326614174999" },
  ];
}
