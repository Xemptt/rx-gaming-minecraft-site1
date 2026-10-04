"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { getUpsellsByMode, rewardProduct, REWARD_THRESHOLD, Product } from "@/lib/products";

export default function CheckoutPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, addItem, clearCart } = useCartStore();
    const router = useRouter();

    const [nick, setNick] = useState("");
    const [email, setEmail] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [agreedRefunds, setAgreedRefunds] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rewardUnlocked, setRewardUnlocked] = useState(false);
    const prevTotalRef = useRef(0);

    const cartMode = items.find(i => !i.product.isReward && !i.product.isUpsell)?.product.mode;
    const modeStr = Array.isArray(cartMode) ? cartMode[0] : (cartMode ?? 'anarchy');
    const paidTotal = items
        .filter((i) => !i.product.isReward)
        .reduce((s, i) => s + i.product.price * i.quantity, 0);

    const currentTotal = getTotalPrice();
    const progressPercent = Math.min((paidTotal / REWARD_THRESHOLD) * 100, 100);
    const remaining = Math.max(REWARD_THRESHOLD - paidTotal, 0);
    const hasReward = items.some((i) => i.product.id === rewardProduct.id);


    useEffect(() => {
        if (paidTotal < REWARD_THRESHOLD && hasReward) {
            removeItem(rewardProduct.id);
        }
    }, []);

    useEffect(() => {
        if (paidTotal >= REWARD_THRESHOLD && !hasReward) {
            addItem(rewardProduct);
            setRewardUnlocked(true);
        } else if (paidTotal < REWARD_THRESHOLD && hasReward) {
            removeItem(rewardProduct.id);
            setRewardUnlocked(false);
        }
        prevTotalRef.current = paidTotal;
    }, [paidTotal, hasReward]);

    useEffect(() => {
        if (!rewardUnlocked) return;
        const t = setTimeout(() => setRewardUnlocked(false), 3000);
        return () => clearTimeout(t);
    }, [rewardUnlocked]);

    const cartProductIds = new Set(items.map((i) => i.product.id));
    const upsellsToShow = getUpsellsByMode(modeStr).filter((u) => !cartProductIds.has(u.id));

    const handleCheckoutClick = () => {
        processPayment();
    };

    const handleAddUpsell = (item: Product) => {
        addItem(item);
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const processPayment = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        try {
            const res = await fetch("/api/tebex/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: nick,
                    email,
                    items: items.map((ci) => ({
                        packageId: ci.product.id,
                        quantity: ci.quantity,
                    })),
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to initiate Tebex checkout.");
            }

            const data = await res.json();
            if (data.checkoutUrl) {
                clearCart();
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("No checkout URL received from server.");
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            alert(err.message || "Wystąpił błąd podczas przygotowywania płatności. Spróbuj ponownie.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased relative">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-12 flex-1">

                <div className="bg-[#FFCC00] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 md:p-12 text-center md:text-left relative overflow-visible flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="hidden md:flex absolute right-0 bottom-0 w-80 md:w-[450px] lg:w-[500px] pointer-events-none z-20 overflow-visible items-end justify-end">
                        <img src="/rekru.png" alt="Rekrutacja Render" className="max-w-none w-full h-auto drop-shadow-[10px_10px_0px_rgba(0,0,0,0.2)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                        <span className="text-white text-[90px] md:text-[200px] font-black opacity-30 tracking-tighter">CART</span>
                    </div>
                    <div className="relative z-10 max-w-2xl w-full">
                        <h1 className="text-5xl md:text-7xl font-black uppercase text-white [text-shadow:4px_4px_0px_#000] tracking-wider mb-4 leading-tight">CART</h1>
                        <p className="text-black text-xl font-bold uppercase tracking-widest leading-tight">COMPLETE YOUR ORDER</p>
                    </div>
                    <div className="hidden lg:block w-[400px]"></div>
                </div>

                {items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-10 w-full">

                            <section>
                                <h3 className="text-2xl font-bold uppercase border-l-8 border-[#FFD700] pl-4 mb-6 tracking-wider">Your items</h3>
                                <div className="space-y-4">
                                    {items.map((ci) => (
                                        <CartItemRow
                                            key={ci.product.id}
                                            name={ci.product.name}
                                            price={ci.product.price}
                                            img={ci.product.img}
                                            color={ci.product.color}
                                            quantity={ci.quantity}
                                            isReward={!!ci.product.isReward}
                                            onRemove={() => removeItem(ci.product.id)}
                                            onQtyChange={(q) => updateQuantity(ci.product.id, q)}
                                        />
                                    ))}
                                </div>
                            </section>


                            {upsellsToShow.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-bold uppercase border-l-8 border-[#C084FC] pl-4 mb-4 tracking-wider ">Add premium extras?</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {upsellsToShow.map((item) => (
                                            <div key={item.id} className="bg-white border-2 border-black/20 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all p-4 flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 bg-gray-100 border-2 border-black/20 bg-cover bg-center flex-shrink-0"
                                                        style={{ backgroundImage: `url(${item.img})`, borderColor: item.color }}
                                                    />
                                                    <div>
                                                        <p className="font-black uppercase tracking-wider text-xs leading-tight">{item.name}</p>
                                                        <p className="font-black text-sm mt-0.5" style={{ color: item.color }}>{item.price.toFixed(2)} USD</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddUpsell(item)}
                                                    className="w-full border-2 border-black/30 hover:border-black bg-gray-50 hover:bg-black hover:text-white text-black px-4 py-2 font-black text-xs uppercase tracking-widest transition-all"
                                                >
                                                    + ADD
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section>
                                <h3 className="text-2xl font-bold uppercase border-l-8 border-[#FF8C00] pl-4 mb-6 tracking-wider">1. Enter your details</h3>
                                <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 space-y-6">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest mb-3 text-gray-700">Minecraft Nickname</label>
                                        <input
                                            type="text"
                                            value={nick}
                                            onChange={(e) => setNick(e.target.value)}
                                            placeholder="Enter here..."
                                            className="w-full border-4 border-black p-4 text-xl font-bold tracking-wider outline-none focus:ring-4 focus:ring-[#FF8C00]/50 transition-all bg-[#FAFAFA]"
                                        />
                                        <p className="text-xs font-bold uppercase tracking-wider mt-3 text-gray-500">Ensure your nickname is correct. Items will be assigned to this account.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest mb-3 text-gray-700">E-mail Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full border-4 border-black p-4 text-xl font-bold tracking-wider outline-none focus:ring-4 focus:ring-[#FF8C00]/50 transition-all bg-[#FAFAFA]"
                                        />
                                        <p className="text-xs font-bold uppercase tracking-wider mt-3 text-gray-500">We will send your purchase confirmation to this address.</p>
                                    </div>
                                </div>
                            </section>
                        </div>


                        <aside className="w-full lg:w-[400px]">
                            <div className={`border-4 p-5 mb-8 transition-all duration-500 ${remaining === 0 ? 'bg-[#4EFF8E] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}`}>
                                <div className="flex justify-between items-center mb-3 gap-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/szpontbox.png"
                                            alt="SZPONTBOX"
                                            className="w-10 h-10 object-contain border-2 border-black flex-shrink-0 bg-black/5"
                                        />
                                        <span className="font-black uppercase tracking-wider text-sm">x3 SZPONTBOX</span>
                                    </div>
                                    {remaining > 0 ? (
                                        <span className="font-bold text-xs text-gray-500 uppercase whitespace-nowrap">{remaining.toFixed(2)} USD remaining</span>
                                    ) : (
                                        <span className="font-black text-xs text-black uppercase animate-pulse">Unlocked!</span>
                                    )}
                                </div>
                                <div className="w-full h-4 bg-gray-100 border-2 border-black overflow-hidden relative">
                                    <div
                                        className="h-full bg-[#4EFF8E] transition-all duration-700 ease-out border-r-2 border-black"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                {remaining > 0 ? (
                                    <p className="text-[10px] uppercase font-bold text-gray-500 mt-2 text-center tracking-wider">
                                        Spend at least {REWARD_THRESHOLD.toFixed(2)} USD to unlock this reward!
                                    </p>
                                ) : (
                                    <p className="text-[10px] uppercase font-black text-black mt-2 text-center tracking-wider animate-pulse">
                                        ✓ Bonus reward added to cart for free!
                                    </p>
                                )}
                            </div>
 
                            <h3 className="text-2xl font-bold uppercase border-l-8 border-[#FFD700] pl-4 mb-6 tracking-wider">Order Summary</h3>

                            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">

                                <div className="p-4 border-b-4 border-black bg-[#111] text-white space-y-3 relative overflow-hidden">
                                    <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
                                        <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] animate-spin-slow bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url('/beam.svg')` }} />
                                    </div>
                                    {items.map((ci) => (
                                        <div key={ci.product.id} className="relative z-10 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-black/50 border-2 flex-shrink-0 bg-cover bg-center" style={{ borderColor: ci.product.color, backgroundImage: `url('${ci.product.img}')` }} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black uppercase tracking-widest text-xs truncate" style={{ color: ci.product.color }}>{ci.product.name}</h4>
                                                <p className="text-[10px] font-bold tracking-wider text-white/60 uppercase">Quantity: {ci.quantity}</p>
                                            </div>
                                            <span className="font-black text-white text-sm flex-shrink-0">
                                                {ci.product.isReward ? (
                                                    <span className="text-[#4EFF8E]">FREE</span>
                                                ) : (
                                                    `${(ci.product.price * ci.quantity).toFixed(2)} USD`
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 space-y-6">

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-700">Promo Code</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="ENTER CODE"
                                                className="w-full border-4 border-black p-3 text-sm font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#FF8C00]/50 bg-[#FAFAFA]"
                                            />
                                            <button className="bg-black text-white px-4 font-black uppercase tracking-widest text-sm hover:bg-[#FF8C00] transition-colors border-4 border-black border-l-0">APPLY</button>
                                        </div>
                                    </div>

                                    <div className="h-1 bg-black w-full"></div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span className="font-bold uppercase tracking-wider">Subtotal</span>
                                            <span className="font-bold">{paidTotal.toFixed(2)} USD</span>
                                        </div>
                                        {hasReward && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold uppercase tracking-wider text-[#4EFF8E]">x3 SZPONTBOX (Reward)</span>
                                                <span className="font-black text-[#4EFF8E]">0.00 USD</span>
                                            </div>
                                        )}
                                        <div className="pt-2 border-t-2 border-black flex justify-between items-end">
                                            <span className="font-black uppercase tracking-widest">Total</span>
                                            <span className="font-black text-3xl text-[#FF8C00]">{paidTotal.toFixed(2)} USD</span>
                                        </div>
                                    </div>


                                    <div className="pt-4 space-y-3">
                                        <CheckboxLabel checked={agreedTerms} onChange={setAgreedTerms} label="I accept the store terms of service and privacy policy." />
                                        <CheckboxLabel checked={agreedRefunds} onChange={setAgreedRefunds} label="I acknowledge the virtual item refund policy and waive my right to withdrawal." />
                                    </div>

                                    <button
                                        disabled={!nick || !email || !agreedTerms || !agreedRefunds || isProcessing}
                                        onClick={handleCheckoutClick}
                                        className={`w-full mt-6 px-8 py-5 text-xl font-black uppercase tracking-widest border-4 border-black transition-all ${nick && email && agreedTerms && agreedRefunds && !isProcessing
                                            ? "bg-[#4EFF8E] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-[#4EFF8E] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        {isProcessing ? "PROCESSING..." : "Purchase & Pay"}
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">

            <h2 className="text-3xl font-black uppercase tracking-widest">Your cart is empty :(</h2>
            <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">Add something from our store to continue</p>
            <a
                href="/store/anarchy"
                className="bg-[#FFCC00] text-black font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-[#FFCC00] transition-colors active:shadow-none active:translate-x-1 active:translate-y-1 text-lg"
            >
                GO TO STORE →
            </a>
        </div>
    );
}

function CartItemRow({ name, price, img, color, quantity, isReward, onRemove, onQtyChange }: {
    name: string;
    price: number;
    img: string;
    color: string;
    quantity: number;
    isReward: boolean;
    onRemove: () => void;
    onQtyChange: (q: number) => void;
}) {
    return (
        <div className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 p-4 ${isReward ? 'bg-[#f0fff7]' : 'bg-white'}`}>
            <div className="w-16 h-16 bg-gray-100 border-2 border-black bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url('${img}')`, borderColor: color }} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black uppercase tracking-widest text-sm truncate" style={{ color }}>{name}</h4>
                    {isReward && <span className="text-[10px] font-black uppercase bg-[#4EFF8E] text-black px-2 py-0.5 border border-black flex-shrink-0">FREE</span>}
                </div>
                {isReward ? (
                    <p className="text-[#4EFF8E] font-black text-lg">0.00 USD</p>
                ) : (
                    <>
                        <p className="text-[#FF8C00] font-black text-lg">{(price * quantity).toFixed(2)} USD</p>
                        {quantity > 1 && <p className="text-xs text-gray-400 font-bold uppercase">{price.toFixed(2)} USD / pc</p>}
                    </>
                )}
            </div>
            {!isReward && (
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => onQtyChange(quantity - 1)} className="w-8 h-8 border-2 border-black font-black text-lg leading-none flex items-center justify-center hover:bg-gray-100 transition-colors">−</button>
                    <span className="w-8 text-center font-black text-lg">{quantity}</span>
                    <button onClick={() => onQtyChange(quantity + 1)} className="w-8 h-8 border-2 border-black font-black text-lg leading-none flex items-center justify-center hover:bg-gray-100 transition-colors">+</button>
                </div>
            )}
            {!isReward && (
                <button onClick={onRemove} className="flex-shrink-0 w-10 h-10 border-4 border-black flex items-center justify-center text-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors font-black" title="Remove">✕</button>
            )}
        </div>
    );
}

function CheckboxLabel({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-1">
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
                <div className="w-6 h-6 border-4 border-black bg-white peer-checked:bg-[#FF8C00] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-600 leading-relaxed">{label}</span>
        </label>
    );
}