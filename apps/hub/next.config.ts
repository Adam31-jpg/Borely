import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: ["@borecore/ui", "@borecore/core", "@borecore/app-mail"],
};

export default nextConfig;
