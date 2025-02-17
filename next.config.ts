import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")], // ✅ SCSS에서 @/styles 사용 가능
  },
  webpack: (config) => {
    config.resolve.modules = [path.resolve(__dirname, "src"), "node_modules"];
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"), // ✅ JavaScript에서 @ alias 사용 가능
      "@/styles": path.resolve(__dirname, "src/styles"), // ✅ SCSS에서도 @ alias 사용 가능
    };

    return config;
  },
};

export default nextConfig;