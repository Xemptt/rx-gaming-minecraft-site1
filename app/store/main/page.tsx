"use client";

/* FIX: Added an extra segment jump level ('../../../') so the compiler locates your component files perfectly! */
import Navbar from "../../../component/navbar";
import Footer from "../../../component/footer";
import { useState, useEffect } from "react";
import storeSettings from "../../../store-settings.json";

type Mode = {
    name: string;
    banner: string;
    active: boolean;
    id: string;
    statusText: string;
};

export default function StoreMarketplacePage() {
    const [modes, setModes] = useState<Mode[]>([]);
    const [loading, setLoading] = useState(true);

    const mockModes: Mode[] = [
        { id: 'insanecraft', name: 'Insanecraft', banner: storeSettings.insanecraftBanner || '/header.png', active: true, statusText: 'Click to enter store' },
        { id: 'rlcraft', name: 'RLCraft', banner: storeSettings.rlcraftBanner || '/header.png', active: true, statusText: 'Click to enter store' },
        { id: 'practice', name: 'COMING SOON...', banner: '/practice_bg.png', active: false, statusText: 'Under Development' },
        { id: 'skywars', name: 'COMING SOON...', banner: '/skywars_bg.png', active: false, statusText: 'Under Development' },
    ];

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setModes(mockModes);
            setLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased relative z-10">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8 flex-1 relative z-20 pointer-events-auto">
                <div className="bg-[#1E1B4B] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 md:p-14 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                        <span className="text-white text-[90px] md:text-[180px] font-black opacity-5 tracking-tighter">SHOP</span>
                    </div>

                    <div className="relative z-10 max-w-2xl w-full">
                        <h1 className="text-5xl md:text-6xl font-black uppercase text-white [text-shadow:4px_4px_0px_#000] tracking-wider mb-4 leading-tight">SERVER STORE</h1>
                        <p className="text-[#22D3EE] text-lg font-bold uppercase tracking-widest leading-tight">SELECT A REALM REGION BELOW TO BROWSE AVAILABLE RANKS & BUNDLES</p>
                    </div>
                </div>

                <h3 className="text-2xl font-bold uppercase border-l-8 border-[#22D3EE] pl-4 text-black text-left tracking-wide">REALM REGIONS</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white font-bold pb-6">
                    {modes.map((mode) => (
                        mode.active ? (
                            <a
                                key={mode.id}
                                href={`/store/${mode.id.toLowerCase()}`}
                                className="relative h-48 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-0"
                                    style={{ backgroundImage: `url('${mode.banner}')` }}
                                />
                                
                                <div className="absolute inset-0 bg-[#2b0c47] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center overflow-hidden">
                                    <div 
                                        className="absolute inset-[-50%] bg-cover opacity-70 mix-blend-screen bg-center pointer-events-none animate-[spin_40s_linear_infinite]"
                                        style={{ backgroundImage: `url('https://imgur.com')` }} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b0530] via-transparent to-[#1b0530] opacity-90" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.4)_0%,transparent_70%)] animate-pulse" />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                                
                                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-left pointer-events-none">
                                    <h2 className="text-2xl uppercase tracking-wider text-white [text-shadow:2px_2px_0px_rgba(0,0,0,1)] group-hover:text-[#C084FC] transition-colors duration-300">{mode.name}</h2>
                                    <p className="text-[#22D3EE] text-[10px] uppercase tracking-wider [text-shadow:1px_1px_0px_rgba(0,0,0,1)] group-hover:animate-pulse">{mode.statusText}</p>
                                </div>
                            </a>
                        ) : (
                            <div
                                key={mode.id}
                                className="relative h-48 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden group cursor-not-allowed text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${mode.banner}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                            </div>
                        )
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
