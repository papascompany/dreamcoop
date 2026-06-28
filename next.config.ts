import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 디렉터리의 다른 lockfile로 인한 워크스페이스 루트 추론 경고 방지.
  turbopack: { root: __dirname },
};

export default nextConfig;
