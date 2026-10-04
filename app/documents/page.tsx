"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import { useState } from "react";
import storeSettings from "@/store-settings.json";

export default function DocumentsPage() {
    // Extended tab state engine to handle terms, privacy, game rules, and discord guidelines
    const [activeTab, setActiveTab] = useState<"tos" | "privacy" | "rules" | "discord">("tos");

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased relative">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8 flex-1">
                <div className="bg-[#1E1B4B] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 md:p-14 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                        <span className="text-white text-[90px] md:text-[180px] font-black opacity-5 tracking-tighter">
                            LEGAL
                        </span>
                    </div>

                    <div className="relative z-10 max-w-2xl w-full">
                        <h1 className="text-5xl md:text-6xl font-black uppercase text-white [text-shadow:4px_4px_0px_#000] tracking-wider mb-4 leading-tight">
                            DOCUMENTS
                        </h1>
                        <p className="text-[#22D3EE] text-lg font-bold uppercase tracking-widest leading-tight">
                            LEGAL DOCUMENTS & POLICIES FOR {storeSettings.serverName.toUpperCase()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start pt-4 w-full">
                    {/* Left Sidebar Menu Selector Tabs */}
                    <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0">
                        <h3 className="text-xl font-bold uppercase border-l-8 border-[#22D3EE] pl-4 text-black text-left mb-2 tracking-wider">
                            Document List
                        </h3>
                        
                        <button
                            onClick={() => setActiveTab("tos")}
                            className={`w-full text-left border-4 border-black p-4 font-black uppercase tracking-wider text-sm transition-all flex items-center gap-3 ${
                                activeTab === "tos"
                                    ? "bg-[#ffcc00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                                    : "bg-white text-gray-500 hover:text-black border-black/20 hover:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                            }`}
                        >
                            📄 Terms of Service
                        </button>

                        <button
                            onClick={() => setActiveTab("privacy")}
                            className={`w-full text-left border-4 border-black p-4 font-black uppercase tracking-wider text-sm transition-all flex items-center gap-3 ${
                                activeTab === "privacy"
                                    ? "bg-[#ffcc00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                                    : "bg-white text-gray-500 hover:text-black border-black/20 hover:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                            }`}
                        >
                            🔒 Privacy Policy
                        </button>

                        <button
                            onClick={() => setActiveTab("rules")}
                            className={`w-full text-left border-4 border-black p-4 font-black uppercase tracking-wider text-sm transition-all flex items-center gap-3 ${
                                activeTab === "rules"
                                    ? "bg-[#ffcc00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                                    : "bg-white text-gray-500 hover:text-black border-black/20 hover:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                            }`}
                        >
                            🛡️ Server Rules
                        </button>

                        {/* NEW: Discord Rules Tab Trigger Selector Button */}
                        <button
                            onClick={() => setActiveTab("discord")}
                            className={`w-full text-left border-4 border-black p-4 font-black uppercase tracking-wider text-sm transition-all flex items-center gap-3 ${
                                activeTab === "discord"
                                    ? "bg-[#ffcc00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                                    : "bg-white text-gray-500 hover:text-black border-black/20 hover:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                            }`}
                        >
                            💬 Discord Rules
                        </button>
                    </div>

                    {/* Right Main Text Content Render Box */}
                    <div className="flex-1 w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 min-h-[450px] text-left">
                        <h2 className="text-2xl font-black uppercase text-black border-b-4 border-black pb-4 mb-6 tracking-wide">
                            {activeTab === "tos" && "Terms of Service"}
                            {activeTab === "privacy" && "Privacy Policy"}
                            {activeTab === "rules" && "Server Rules"}
                            {activeTab === "discord" && "Discord Rules"}
                        </h2>
                        
                        <div className="font-bold text-gray-700 text-sm uppercase leading-relaxed tracking-wide whitespace-pre-line space-y-4">
                            {activeTab === "tos" && storeSettings.tosText}
                            {activeTab === "privacy" && storeSettings.privacyText}
                            {activeTab === "rules" && storeSettings.rulesText}
                            {activeTab === "discord" && storeSettings.discordRulesText}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
