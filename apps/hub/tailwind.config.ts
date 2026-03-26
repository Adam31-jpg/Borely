import type { Config } from "tailwindcss";
import sharedConfig from "@borecore/config/tailwind";

const config: Config = {
    ...sharedConfig,
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "../../packages/ui/src/**/*.{ts,tsx}",
        "../../packages/core/src/**/*.{ts,tsx}",
    ],
};

export default config;
