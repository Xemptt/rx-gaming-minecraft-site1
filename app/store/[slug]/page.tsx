"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import storeSettings from "@/store-settings.json";

export default function StoreModePage() {
    const params = useParams();
    const rawRoute = params?.slug || "anarchia"; 
    const activeRoute = typeof rawRoute === "string" ? rawRoute.toLowerCase() : "anarchia";

    const [pageTitle, setPageTitle] = useState("STORE");
    const [pageBanner, setPageBanner] = useState("/header.png");

    useEffect(() => {
        if (activeRoute === "anarchia" || activeRoute === "anarchy" || activeRoute === "insanecraft") {
            setPageTitle("INSANECRAFT STORE");
            setPageBanner(storeSettings.insanecraftBanner || "/header.png");
        } else if (activeRoute === "survival" || activeRoute === "rlcraft") {
            setPageTitle("RLCRAFT STORE");
            setPageBanner(storeSettings.rlcraftBanner || "/header.png");
        } else {
            setPageTitle(`${storeSettings.serverName.toUpperCase()} STORE`);
            setPageBanner(storeSettings.mainHeroBanner || "/header.png");
        }
    }, [activeRoute]);

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased relative">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-12 flex-1">
                {/* FIX: Changed wrapper bg from purple to solid neutral dark charcoal (#111111) */}
                <div className="bg-[#111111] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 md:p-12 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                    
                    {/* FIX: Removed mix-blend-overlay and raised opacity to 100% to completely throw away the purple tint */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: `url('${pageBanner}')` }}
                    />
                    {/* Smooth bottom cinematic fade out contrast shadow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 max-w-2xl w-full">
                        <h1 className="text-4xl md:text-6xl font-black uppercase text-white [text-shadow:4px_4px_0px_#000] tracking-wider mb-4 leading-tight">
                            {pageTitle}
                        </h1>
                        <p className="text-[#22D3EE] text-lg font-bold uppercase tracking-widest leading-tight">
                            CHOOSE THE BEST ADD-ONS FOR YOUR GAMING EXPERIENCE
                        </p>
                    </div>
                </div>

                <div className="w-full text-center py-6 text-gray-400 font-bold uppercase text-xs tracking-wider">
                    Streaming items straight from the Tebex Headless network API...
                </div>
            </main>

            <Footer />
        </div>
    );
}
