"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import storeSettings from "@/store-settings.json";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [useCustomCursor, setUseCustomCursor] = useState(true);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const itemCount = useCartStore((s) => s.getItemCount());

    const marqueeTexts = Array(15).fill(storeSettings.marqueeText);

    // Toggles global system cursor visibility on the HTML document layer to prevent system bleed-through
    useEffect(() => {
        if (typeof document !== "undefined") {
            if (useCustomCursor) {
                document.documentElement.classList.add("custom-cursor-hidden-active");
            } else {
                document.documentElement.classList.remove("custom-cursor-hidden-active");
            }
        }
    }, [useCustomCursor]);

    // Hardware Vector Tracking Hook: Tracks coordinates smoothly with zero performance lag
    useEffect(() => {
        if (!useCustomCursor) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.closest('[role="button"]')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [useCustomCursor]);

    const navLinkClass = "relative px-3 py-1.5 rounded-md text-black font-bold text-xs tracking-widest uppercase transition-all duration-200 hover:text-[#C084FC] hover:bg-[#C084FC]/10 hover:[text-shadow:0_0_12px_rgba(192,132,252,0.9),0_0_4px_rgba(192,132,252,0.6)] hover:shadow-[0_0_15px_rgba(192,132,252,0.25)]";

    return (
        <div className="w-full flex flex-col relative z-50">
            {/* React Vector Overlay Rendering Node Layer */}
            {useCustomCursor && (
                <div 
                    /* FIX: Upgraded z-index property ranking from z-50 to z-[9999] so your pickaxe floats flawlessly on top of the navigation bars, menus, and text nodes! */
                    className="fixed pointer-events-none z-[9999] select-none will-change-transform hidden md:block"
                    style={{
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                        transform: "translate(30px, -22px) scaleX(-1)",
                        transformOrigin: "0% 0%"
                    }}
                >
                    {isHovering ? (
                        <img src="/pickaxe-hover.png" alt="Mining" className="w-9 h-9 object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)]" />
                    ) : (
                        <img src="/pickaxe.png" alt="Pickaxe" className="w-9 h-9 object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)]" />
                    )}
                </div>
            )}

            {/* Top Sliding Announcement Marquee Bar */}
            <div className="w-full bg-[#1E1B4B] border-b-[3px] border-[#2E1065] overflow-hidden py-1.5 relative text-white flex select-none whitespace-nowrap">
                <div className="flex w-max animate-marquee-custom hover:[animation-play-state:paused]">
                    <div className="flex shrink-0 gap-8 px-4 items-center justify-center">
                        {marqueeTexts.map((text, i) => (
                            <span key={`first-${i}`} className="font-bold tracking-widest text-xs md:text-sm uppercase text-white">
                                {text}
                            </span>
                        ))}
                    </div>
                    <div className="flex shrink-0 gap-8 px-4 items-center justify-center">
                        {marqueeTexts.map((text, i) => (
                            <span key={`second-${i}`} className="font-bold tracking-widest text-xs md:text-sm uppercase text-white">
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Menu Header Row Container */}
            <header className="w-full bg-white border-b-[3px] border-gray-200 relative h-24 flex items-center px-4 md:px-8">
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between">

                    {/* Left Side Links Split Grid */}
                    <div className="hidden md:flex flex-1 justify-end items-center gap-4 pr-8">
                        <Link href="/voucher" className={navLinkClass}>
                            Voucher
                        </Link>
                        <Link href="/store/main" className={navLinkClass}>
                            Store
                        </Link>
                        <Link href="/careers" className={navLinkClass}>
                            Careers
                        </Link>
                    </div>

                    {/* Center Network Voxel Transparent Logo */}
                    <div className="flex-shrink-0 flex items-center justify-center relative select-none cursor-pointer">
                        <Link href="/" className="block">
                            <Image
                                src={storeSettings.logoImage}
                                alt={`${storeSettings.serverName} Logo`}
                                width={1200}
                                height={1200}
                                className="w-auto h-22 md:h-26 object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Side Links & Toggle Slider Switch */}
                    <div className="hidden md:flex flex-1 justify-start items-center gap-4 pl-8 relative">
                        <Link href="/changelog" className={navLinkClass}>
                            Changelog
                        </Link>
                        <Link href="/documents" className={navLinkClass}>
                            Documents
                        </Link>
                        <Link href="/server-details" className={navLinkClass}>
                            Details
                        </Link>
                        
                        {/* Shopping Cart Tracker */}
                        <Link href="/cart" className="ml-4 flex items-center gap-3 border-4 px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 border-black/20 hover:border-[#C084FC] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] bg-white hover:shadow-[4px_4px_0px_0px_rgba(192,132,252,1)] hover:bg-purple-50/20 relative group">
                            <svg xmlns="http://w3.org" className="w-5 h-5 transition-colors group-hover:text-[#C084FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-2.5 -right-2.5 bg-[#ffcc00] text-black border-2 border-black font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Interactive Retro Slider Switch Component */}
                        <div className="ml-4 flex items-center gap-2 border-2 border-dashed border-gray-200 p-1.5 rounded-md select-none relative z-50 pointer-events-auto">
                            <span className="font-bold text-[9px] tracking-widest text-gray-400 uppercase">CURSOR</span>
                            <button
                                onClick={() => setUseCustomCursor((prev) => !prev)}
                                type="button"
                                className={`w-10 h-6 border-2 border-black relative transition-colors duration-200 outline-none flex items-center cursor-pointer pointer-events-auto ${useCustomCursor ? 'bg-[#22D3EE]' : 'bg-gray-200'}`}
                                aria-label="Toggle Custom Cursor"
                            >
                                <div className={`w-4 h-4 border-2 border-black bg-white absolute transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)] pointer-events-none ${useCustomCursor ? 'left-4' : 'left-0.5'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Action Hamburger Toggle Trigger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-black p-2 focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Responsive Menu Dropdown Box View Layout */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-[3px] border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,0.1)] flex flex-col px-6 py-4 gap-2 z-50">
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/voucher" className="text-black font-bold text-base tracking-widest uppercase py-3 border-b-2 border-gray-100 hover:text-[#C084FC]">
                            Voucher
                        </Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/store/main" className="text-black font-bold text-base tracking-widest uppercase py-3 border-b-2 border-gray-100 hover:text-[#C084FC]">
                            Store
                        </Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/careers" className="text-black font-bold text-base tracking-widest uppercase py-3 border-b-2 border-gray-100 hover:text-[#C084FC]">
                            Careers
                        </Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/changelog" className="text-black font-bold text-base tracking-widest uppercase py-3 border-b-2 border-gray-100 hover:text-[#C084FC]">
                            Changelog
                        </Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/documents" className="text-black font-bold text-base tracking-widest uppercase py-3 border-b-2 border-gray-100 hover:text-[#C084FC]">
                            Documents
                        </Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/server-details" className="text-black font-bold text-base tracking-widest uppercase py-3 border-b-2 border-gray-100 hover:text-[#C084FC]">
                            Details
                        </Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/cart" className="flex items-center justify-between text-black font-bold text-base tracking-widest uppercase py-3">
                            <span>Cart</span>
                            {itemCount > 0 && <span className="bg-[#ffcc00] border-2 border-black px-2 text-xs font-black">{itemCount} ITEMS</span>}
                        </Link>
                    </div>
                )}
            </header>
        </div>
    );
}
