import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3000', 'https://gestor-tareas-luis.vercel.app'],
    },
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  }
};

export default nextConfig;