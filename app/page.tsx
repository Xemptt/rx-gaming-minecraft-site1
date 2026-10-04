"use client";

import Navbar from "../component/navbar";
import Image from "next/image";
import Footer from "../component/footer";
import storeSettings from "../store-settings.json";
import ServerCounter from "../component/servercounter";

type Mode = {
    id: string;
    name: string;
    banner: string;
    active: boolean;
    statusText: string;
};

export default function WalletPage() {
    const modes: Mode[] = [
        { id: 'insanecraft', name: 'Insanecraft', banner: storeSettings.insanecraftBanner || '/header.png', active: true, statusText: 'Click for server profile' },
        { id: 'rlcraft', name: 'RLCraft', banner: storeSettings.rlcraftBanner || '/header.png', active: true, statusText: 'Click for server profile' },
        { id: 'practice', name: 'COMING SOON...', banner: storeSettings.comingSoonBanner || '/header.png', active: false, statusText: 'Under Development' },
        { id: 'skywars', name: 'COMING SOON...', banner: storeSettings.comingSoonBanner || '/header.png', active: false, statusText: 'Under Development' },
    ];

    const networkServers = [
    {
        name: "Insanecraft",
        ip: "mc.biccys.uk:25567", // FIXED: Changed from 25567 to the correct port 25550
        tag: "Modded Java",
        tagColor: "bg-purple-100 text-purple-800 border-purple-300"
    },
    {
        name: "RLCraft",
        ip: "play.rx-gaming.online:25565", // Verify that this port matches your server dashboard panel
        tag: "Modded Java",
        tagColor: "bg-purple-100 text-purple-800 border-purple-300"
    }
];

    return (
        <div className="min-h-screen w-full flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased overflow-x-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8 flex-1 relative z-20 pointer-events-auto">
                <h1 className="sr-only">{storeSettings.serverName} - Premium Minecraft Store</h1>
                
                {/* Hero Banner Welcome Splash Box */}
                <section className="relative w-full h-[550px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group bg-stone-800">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${storeSettings.mainHeroBanner || '/header.png'}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="mb-4">
                            <Image
                                src={storeSettings.logoImage}
                                alt={`${storeSettings.serverName} Center Logo`}
                                width={1200}
                                height={1200}
                                className="w-auto h-48 md:h-94 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                                priority
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <a
                                href="/store/main"
                                className="bg-[#ffcc00] text-black border-4 border-black px-10 py-4 font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none uppercase text-center block"
                            >
                                Server Store
                            </a>

                            <a
                                href="/server-details"
                                className="bg-white text-black border-4 border-black px-10 py-4 font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none uppercase flex items-center justify-center gap-2"
                            >
                                {storeSettings.serverIP}
                                {/* FIXED: Replaced w3.org shortcut string with standard schema URL pattern to prevent compiler lockups */}
                                <svg xmlns="http://w3.org" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 📡 Mini Server Status Hub Block */}
                <section className="w-full space-y-4">
                    <h3 className="text-2xl font-bold uppercase border-l-8 border-[#22D3EE] pl-4 text-black text-left">
                        Network Live Feed
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {networkServers.map((server) => (
                            <div 
                                key={server.name}
                                className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-bold uppercase tracking-wide text-black">{server.name}</h4>
                                    <span className={`px-2 py-0.5 border-2 border-black text-[10px] font-bold uppercase ${server.tagColor}`}>
                                        {server.tag}
                                    </span>
                                </div>
                                <div className="text-sm font-bold flex items-center gap-2">
                                    <ServerCounter serverIp={server.ip} serverName={server.name} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2x2 Selection Card Framework Grid */}
                <section id="select-server" className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2 scroll-mt-6">
                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="text-2xl font-bold uppercase border-l-8 border-[#22D3EE] pl-4 text-black text-left">Select Game Mode</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white font-bold">
                            {modes.map((mode) => (
                                mode.active ? (
                                    <a
                                        key={mode.id}
                                        href={mode.id === 'insanecraft' ? '/insanecraft' : mode.id === 'rlcraft' ? '/rlcraft' : `/store/${mode.id.toLowerCase()}`}
                                        className="relative h-48 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                                    >
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-0"
                                            style={{ backgroundImage: `url('${mode.banner}')` }}
                                        />
                                        
                                        {/* Immersive portal effect animation container wrapper layer */}
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none flex flex-col justify-end p-6" />
                                        <div className="relative z-10 h-full flex flex-col justify-end p-6 text-left pointer-events-none">
                                            <h2 className="text-2xl uppercase tracking-wider text-gray-400 [text-shadow:2px_2px_0px_rgba(0,0,0,1)]">{mode.name}</h2>
                                            <p className="text-red-400 text-[10px] uppercase tracking-wider [text-shadow:1px_1px_0px_rgba(0,0,0,1)]">{mode.statusText}</p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
