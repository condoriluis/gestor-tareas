import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3000'],
    },
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  }
};

export default nextConfig;