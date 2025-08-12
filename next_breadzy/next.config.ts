import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: ['localhost'], 
  },
    eslint: {
    ignoreDuringBuilds: true, // Bỏ qua lỗi ESLint khi build
  },
};

export default nextConfig;
