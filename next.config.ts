import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 디렉터리의 다른 lockfile로 인한 워크스페이스 루트 추론 경고 방지.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      {
        // Supabase Storage(storige 프로젝트) 업로드 이미지
        protocol: "https",
        hostname: "uobbgxwuukwptqtywxxj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
