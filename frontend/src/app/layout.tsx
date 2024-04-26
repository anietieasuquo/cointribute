import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});
const appName = "Cointribute";

export const metadata: Metadata = {
    title: appName,
    description: "A blockchain based crowdfunding platform for open-source projects.",
    applicationName: appName,
    authors: {
        name: appName,
        url: "https://cointribute.com",
    },
    keywords: ["blockchain", "crowdfunding", "open-source", "projects"],
    viewport: "width=device-width, initial-scale=1",
    creator: appName,
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
    );
}
