import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://api:8000/api/:path*", // your backend server
      },
    ];
  },
};

export default nextConfig;
