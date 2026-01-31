import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInit } from "@/.flowbite-react/init";
import "./globals.css";

import AppNavbar from "@/components/AppNavbar";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Student health manager 🏥",
    description: "A simple student health management system built with Next.js and Flowbite React.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            {/*<head>*/}
            {/*    <ThemeModeScript />*/}
            {/*</head>*/}
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                style={{
                    backgroundColor: "#f9fafb",
                }}
            >
                <div className="flex flex-col">
                    <ThemeInit />
                    <AppNavbar />
                    {children}
                </div>
            </body>
        </html>
    );
}
