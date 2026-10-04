"use client";

import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import { useState } from "react";
import storeSettings from "../../store-settings.json";

type PackageCard = {
    name: string;
    price: string;
    features: string[];
    buyUrl: string;
};

export default function StandaloneInsanecraftProfile() {
    // State to toggle the custom interactive mods dropdown menu block
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Curated list of prominent core mods featured within the Insanecraft layout modpack
    const modpackList = [
        "Avaritia (Infinity Armor & Weapons)",
        "Draconic Evolution (High-tier Energy & Tools)",
        "Industrial Foregoing (Tech & Automation)",
        "Applied Energistics 2 (Digital Storage Networks)",
        "The Twilight Forest (Magical Dimensions & Bosses)",
        "Biomes O' Plenty (Enchanted World Generation)",
        "Tinkers' Construct (Custom Forged Weaponry)",
        "Mekanism (Advanced Processing Machinery)"
    ];

    // Curated Insanecraft rank package list mapping directly to your live Tebex setup
    const packages: PackageCard[] = [
        {
            name: "Extreme Rank",
            price: "£5.00",
            features: [
                "PREMIUM EXTREME CHAT TAG & COLOR",
                "ACCESS TO /FLY IN LOBBIES",
                "3x MONTHLY VAULT KEYS",
                "EXCLUSIVE EXT-KIT STARTER PACK"
            ],
            buyUrl: storeSettings.tebexInsanecraft || "https://tebex.store"
        },
        {
            name: "Mental Rank",
            price: "£10.00",
            features: [
                "ULTIMATE MENTAL CHAT TAG & GLOW EFFECT",
                "ACCESS TO /FLY EVERYWHERE & /FEED",
                "7x MONTHLY VAULT KEYS",
                "EXCLUSIVE MNT-KIT STARTER PACK",
                "PRIORITY QUEUE SERVER JOIN PASS"
            ],
            buyUrl: storeSettings.tebexInsanecraft || "https://tebex.store"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased relative z-10">
            <Navbar />

            <main className="max-w-4xl mx-auto w-full px-4 py-12 flex-1 space-y-8 pointer-events-auto relative z-20">
                
                {/* Header Profile Title Module */}
                <div className="border-4 border-black bg-stone-900 text-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-center md:text-left">
                    <div className="relative z-10 space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-[#ffcc00] [text-shadow:3px_3px_0px_#000]">
                            Insanecraft Profile
                        </h1>
                        <p className="text-[#22D3EE] text-sm font-bold uppercase tracking-widest">
                            Official Standalone Realm Information Hub
                        </p>
                    </div>
                </div>

                {/* Main 2-Column Core Info Split */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Column Box Details Grid */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left">
                            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4 text-black">
                                About Insanecraft
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm font-pixel">
                                Welcome to the ultimate survival challenge! Insanecraft is heavily modified to feature insane weaponry, powerful custom boss encounters, magical dimensions, and high-tier tech automation tracking trees. Form massive factions, conquer realms, and dominate the leaderboard grid map!
                            </p>
                        </div>

                        {/* Dropdown Component */}
                        <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left overflow-hidden">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                type="button"
                                className="w-full p-6 flex items-center justify-between font-black text-xl uppercase bg-white border-b-4 border-black transition-all hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                            >
                                <span>Featured Mods List</span>
                                <svg 
                                    className={`w-6 h-6 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="3" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {/* Slide-out item panel containing the list of mods */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isDropdownOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                                <div className="p-6 bg-gray-50/50 space-y-3 font-bold text-xs uppercase text-gray-600 border-t-0">
                                    {modpackList.map((mod, index) => (
                                        <div key={index} className="flex items-center gap-2 py-1 border-b border-dashed border-gray-200 last:border-0">
                                            <span className="text-[#22D3EE] font-black text-sm">▶</span>
                                            <span className="text-black tracking-wide">{mod}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column Quick-Action Navigation Hub Panels */}
                    <div className="space-y-6">
                        {/* Direct Connection Address Node Box */}
                        <div className="border-4 border-black bg-[#22D3EE]/10 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
                            <h4 className="font-black uppercase text-xs text-gray-500 mb-1">Server Address IP</h4>
                            <p className="font-black text-sm uppercase text-black bg-white border-2 border-black py-2 tracking-wide select-all">
                                MC.BICCYS.UK:25567
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">
                                Click text block to highlight and copy
                            </p>
                        </div>

                        {/* Modpack Client Download Anchor Button Slot */}
                        <a 
                            href="https://www.curseforge.com/minecraft/modpacks/insanecraft-modpack" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="border-4 border-black bg-[#FF8000] text-white p-5 font-black text-lg uppercase tracking-wider block text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                        >
                            CurseForge Link
                        </a>

                        {/* Return Navigation Anchor Link */}
                        <a 
                            href="/" 
                            className="border-4 border-black bg-[#ffcc00] text-black p-4 font-black text-sm uppercase tracking-wider block text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                        >
                            Back to Home
                        </a>
                    </div>
                </div>

                {/* FIX: Injected the active Tebex Package Selection Section right here inside the layout container wrapper grid */}
                <div className="space-y-6 pt-6">
                    <div className="flex items-center gap-3 text-left">
                        <span className="w-2 h-6 bg-[#22D3EE] inline-block" />
                        <h4 className="text-lg font-black uppercase tracking-wide">AVAILABLE STORE PACKAGES</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {packages.map((pkg, i) => (
                            <div 
                                key={i}
                                className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between gap-6 text-left relative overflow-hidden"
                            >
                                {/* Card Header Details */}
                                <div className="flex items-start justify-between w-full border-b-2 border-dashed border-gray-200 pb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black uppercase tracking-wide text-black leading-tight">
                                            {pkg.name}
                                        </h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                                            IN-GAME PERK PACK
                                        </span>
                                    </div>
                                    
                                    {/* Cost Price Badge */}
                                    <span className="border-4 border-black bg-black text-white px-3 py-1.5 text-base font-black tracking-wider uppercase select-none shadow-[2px_2px_0px_#000]">
                                        {pkg.price}
                                    </span>
                                </div>

                                {/* Features List Bullet Points */}
                                <div className="flex-1 space-y-2.5 font-bold text-xs uppercase my-2">
                                    {pkg.features.map((feat, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5">
                                            <span className="text-[#C084FC] font-black text-sm">»</span>
                                            <p className="text-black/80 tracking-wide pt-0.5 leading-relaxed">{feat}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Checkout CTA Buy Trigger Button */}
                                <a
                                    href={pkg.buyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#ffcc00] text-black border-4 border-black py-3 font-black text-sm tracking-widest text-center block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none uppercase"
                                >
                                    BUY PACKAGE
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
