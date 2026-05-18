import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/speaking", destination: "/practice/speaking/topics", permanent: false },
      { source: "/writing", destination: "/practice/writing/topics", permanent: false },
    ];
  },
};

export default nextConfig;
