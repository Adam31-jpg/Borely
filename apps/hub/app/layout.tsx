import type { Metadata, Viewport } from "next";
import { Syne, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell";
import { Providers } from "@/components/providers";
import { siteConfig } from "@borecore/core";

const syne = Syne({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-syne",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    display: "swap",
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: {
        default: `${siteConfig.name} — ${siteConfig.tagline}`,
        template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: siteConfig.name,
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#050507" },
        { media: "(prefers-color-scheme: light)", color: "#FAFAFC" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="fr"
            data-theme="dark"
            suppressHydrationWarning
        >
            <body className={`${syne.variable} ${geistMono.variable} font-mono antialiased`}>
                <Providers>
                    <Shell>{children}</Shell>
                </Providers>
            </body>
        </html>
    );
}
