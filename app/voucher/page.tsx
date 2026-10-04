"use client";

import { useState } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import storeSettings from "@/store-settings.json";

export default function VoucherPage() {
    const [nickname, setNickname] = useState("");
    const [code, setCode] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleRedeem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname.trim() || !code.trim()) {
            setStatus("error");
            setMessage("Please enter both your nickname and voucher code.");
            return;
        }

        setStatus("loading");
        setMessage("");

        setTimeout(() => {
            if (code.length < 5) {
                setStatus("error");
                setMessage("Invalid voucher code. Please check and try again.");
            } else {
                setStatus("success");
                setMessage(`Voucher successfully redeemed for ${nickname.toUpperCase()}! Your items will be delivered shortly.`);
                setCode("");
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 pb-24">
                <section className="pt-20 pb-10 relative">
                    {/* FIX: Changed main background card box from hot pink to premium RX Dark Indigo (#1E1B4B) */}
                    <div className="relative w-full bg-[#1E1B4B] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-10 md:p-16 overflow-visible">

                        {/* Preserved your exact custom voucher.png asset image positioning placement markers */}
                        <div className="hidden md:flex absolute left-86 bottom-0 w-80 md:w-[1100px] lg:w-[1100px] pointer-events-none z-20 overflow-visible items-end justify-end">
                            <img
                                src="/voucher.png"
                                alt="Voucher Reward Claim Render"
                                className="max-w-none w-full h-auto drop-shadow-[15px_15px_0px_rgba(0,0,0,0.2)]"
                                style={{ marginBottom: '1px' }}
                            />
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                            <span className="text-white text-[100px] md:text-[220px] font-black opacity-5 tracking-tighter">
                                VOUCHER
                            </span>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left max-w-2xl w-full">

                                <h2 className="text-white text-4xl md:text-[50px] font-black uppercase tracking-[0.1em] mb-4 [text-shadow:5px_5px_0px_#000] leading-tight md:leading-[0.55]">
                                    REDEEM VOUCHER
                               </h2>

                                <p className="text-[#22D3EE] text-xl font-bold uppercase opacity-100 leading-tight max-w-md tracking-wider mb-8 [text-shadow:2px_2px_0px_#000]">
                                    ENTER YOUR USERNAME AND CODE TO CLAIM YOUR IN-GAME REWARD!
                                </p>

                                <form onSubmit={handleRedeem} className="flex flex-col gap-4 max-w-md mx-auto md:mx-0">
                                    {/* FIX: Aligned inputs background system style colors to match RX Dark Indigo */}
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="MINECRAFT USERNAME"
                                        className="w-full bg-[#1E1B4B] border-4 border-black p-4 text-lg md:text-xl font-bold uppercase outline-none placeholder:text-gray-400 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    />

                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="VOUCHER CODE"
                                        className="w-full bg-[#1E1B4B] border-4 border-black p-4 text-lg md:text-xl font-bold uppercase outline-none placeholder:text-gray-400 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    />

                                    {status === "success" && (
                                        <div className="bg-[#4EFF8E] border-4 border-black p-3 text-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            {message}
                                        </div>
                                    )}

                                    {status === "error" && (
                                        <div className="bg-[#FF4E4E] border-4 border-black p-3 text-white font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            {message}
                                        </div>
                                    )}

                                    {/* FIX: Aligned button styles to match your signature Cyan hover theme coloring properties */}
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-[#22D3EE] text-black border-4 border-black px-12 py-5 font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-[#22D3EE] transition-colors text-center mt-2 active:translate-y-0 active:shadow-none disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {status === "loading" ? "PROCESSING..." : "REDEEM"}
                                    </button>
                                </form>
                            </div>

                            <div className="hidden lg:block w-[450px]"></div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    );
}
