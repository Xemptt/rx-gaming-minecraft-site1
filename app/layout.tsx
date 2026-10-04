import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Title from "../component/title";
import storeSettings from "../store-settings.json";

const minecraftFont = localFont({
    src: "./fonts/Minecraft.ttf",
    weight: "400"
});

export const metadata: Metadata = {
    title: {
        default: `${storeSettings.serverName.toUpperCase()} | Official Store`,
        template: `%s | ${storeSettings.serverName}`,
    },
    description: `Welcome to the official ${storeSettings.serverName} Network rank and item shop. Join our amazing community realms today!`,
    keywords: ["minecraft", "minecraft server", "store", "ranks", "addons", "community"],
    authors: [{ name: storeSettings.serverName }],
    creator: storeSettings.serverName,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: `https://${storeSettings.serverIP}`,
        siteName: storeSettings.serverName,
        title: `${storeSettings.serverName} | Official Store`,
        description: `Welcome to the official ${storeSettings.serverName} Network rank and item shop. Join our amazing community realms today!`,
        images: [
            {
                url: "/header.png",
                width: 1200,
                height: 630,
                alt: storeSettings.serverName,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${storeSettings.serverName} | Minecraft Store`,
        description: `Welcome to the official ${storeSettings.serverName} Network rank and item shop. Join our amazing community realms today!`,
        images: ["/header.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${minecraftFont.className} antialiased bg-[#E5E5E5] text-black flex flex-col min-h-screen`}
            >
                <Title />
                {children}
            </body>
        </html>
    );
}
