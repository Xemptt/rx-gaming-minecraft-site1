"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import Link from "next/link";

export default function SuccessPage() {
    const clearCart = useCartStore((s) => s.clearCart);

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased">
            <Navbar />

            <main className="max-w-4xl mx-auto w-full px-4 py-16 flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(78,255,142,1)] p-8 md:p-12 space-y-6 max-w-2xl w-full">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter [text-shadow:4px_4px_0px_#eee] leading-tight">
                        Purchase Success!
                    </h1>
                    
                    <div className="h-2 bg-black w-full" />
                    
                    <p className="text-xl font-bold uppercase tracking-widest text-gray-700 leading-relaxed">
                        Thank you for shopping on <span className="text-[#FF8C00]">SZPONT.GG</span>! Your virtual items will be delivered inside the game within a few minutes.
                    </p>

                    <div className="bg-[#f0fff7] border-2 border-[#4EFF8E] p-4 flex items-center justify-center gap-3">
                        <p className="font-black uppercase tracking-widest text-sm text-[#16A34A]">
                            Order has been successfully processed
                        </p>
                    </div>

                    <div className="pt-6 flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="bg-black text-white px-10 py-5 font-black text-xl uppercase shadow-[6px_6px_0px_0px_rgba(78,255,142,1)] hover:bg-[#4EFF8E] hover:text-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                <p className="mt-12 text-gray-400 font-bold uppercase tracking-widest text-xs">
                    If you encounter any issues, please contact support on our Discord server.
                </p>
            </main>

            <Footer />
        </div>
    );
}
