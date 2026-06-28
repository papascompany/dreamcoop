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
  experimental: {
    // 관리자 이미지 업로드(서버 액션) 본문 한도 상향. 기본 1MB로는 사진 업로드가 막힘.
    // 업로드 전 브라우저에서 리사이즈하므로 실제 전송 용량은 훨씬 작다.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
