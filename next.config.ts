import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // 開啟 React 嚴格模式，協助排查錯誤
  images: {
    domains: ["your-image-domain.com"], // 如果你的項目需要從外部域名載入圖片，請在這裡添加
  },
  env: {
    NEXTAUTH_URL: "http://localhost:3000", // 設定 NEXTAUTH_URL 環境變數
  },
  // 如果需要，你也可以為 next-auth 設置更多自訂配置
  // 注意，確保你已經在 `.env.local` 文件中設置好這些變數
};

export default nextConfig;
