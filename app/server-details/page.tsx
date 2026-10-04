"use client";

/* FIX: Upgraded directory steps from '../' to '../../' to cleanly step out of the nested folder level and satisfy Next.js Turbopack path rules! */
import Navbar from "../../component/navbar";
import Footer from "../../component/footer";
import { useState } from "react";
import storeSettings from "../../store-settings.json";

type ServerRealm = {
    id: string;
    name: string;
    version: string;
    ip: string;
    status: string;
};

export default function ServerDetailsPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Curated server list array module configuration
    const realms: ServerRealm[] = [
        {
            id: "insanecraft",
            name: "INSANECRAFT SERVER",
            version: "1.12.2",
            ip: "MC.BICCYS.UK:25567",
            status: "ONLINE - CLICK TO COPY IP"
        },
        {
            id: "rlcraft",
            name: "RLCRAFT SERVER",
            version: "1.12.2",
            ip: "PLAY.RX-GAMING.ONLINE:25565",
            status: "ONLINE - CLICK TO COPY IP"
        }
    ];

    const copyToClipboard = (text: string, id: string) => {
        if (typeof navigator !== "undefined") {
            navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased relative z-10">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8 flex-1 relative z-20 pointer-events-auto">
                {/* Section Title Banner Header */}
                <div className="flex items-center gap-3 text-left">
                    <span className="w-2 h-8 bg-[#22D3EE] inline-block" />
                    <h2 className="text-2xl font-black uppercase tracking-wide">SERVER REALMS</h2>
                </div>

                {/* 2-Column Responsive Flex Grid Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                    {realms.map((realm) => (
                        <div 
                            key={realm.id}
                            className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between gap-6 text-left relative overflow-hidden"
                        >
                            {/* Card Top Row Header Details */}
                            <div className="flex items-start justify-between w-full border-b border-gray-100 pb-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase tracking-wide text-black leading-tight">
                                        {realm.name}
                                    </h3>
                                    <p className="text-[#22D3EE] text-[10px] font-black uppercase tracking-widest animate-pulse">
                                        {copiedId === realm.id ? "COPIED SUCCESSFULLY!" : realm.status}
                                    </p>
                                </div>
                                
                                {/* Minecraft Game Client Version Tag Badge */}
                                <span className="bg-black text-white px-2 py-1 text-[10px] font-black border-2 border-black tracking-wider uppercase select-none">
                                    {realm.version}
                                </span>
                            </div>

                            {/* Card Bottom Row IP Action Interface */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">
                                        SERVER ADDRESS IP
                                    </span>
                                    <p className="font-black text-sm uppercase text-black tracking-wide select-all bg-gray-50 border-2 border-dashed border-gray-200 px-3 py-1.5 inline-block">
                                        {realm.ip}
                                    </p>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(realm.ip, realm.id)}
                                    type="button"
                                    className="bg-[#ffcc00] text-black border-4 border-black px-6 py-2.5 font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none uppercase flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>📋</span>
                                    <span>{copiedId === realm.id ? "COPIED!" : "COPY IP"}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
