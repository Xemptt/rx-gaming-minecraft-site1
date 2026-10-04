import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { username, email, items } = body;

        if (!username || !email || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Invalid request. Nickname, email, and items are required." },
                { status: 400 }
            );
        }

        const TEBEX_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;
        const TEBEX_PRIVATE_KEY = process.env.TEBEX_PRIVATE_KEY;

        if (!TEBEX_PUBLIC_TOKEN || !TEBEX_PRIVATE_KEY) {
            console.info("[Tebex API Checkout] Creator credentials not fully set. Processing in simulated DEMO mode.");
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const { origin } = new URL(req.url);
            return NextResponse.json({
                success: true,
                isDemo: true,
                // FIX: Translated destination from Polish 'sukces' to English 'success'
                checkoutUrl: `${origin}/store/success`,
            });
        }

        const { origin } = new URL(req.url);
        const basicAuth = Buffer.from(`${TEBEX_PUBLIC_TOKEN}:${TEBEX_PRIVATE_KEY}`).toString("base64");
        const authHeader = `Basic ${basicAuth}`;

        const basketResponse = await fetch(`https://tebex.io{TEBEX_PUBLIC_TOKEN}/baskets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify({
                username,
                // FIX: Translated payment completion landing point redirect link path to English
                complete_url: `${origin}/store/success`,
                cancel_url: `${origin}/cart`,
                complete_auto_redirect: true,
                custom: {
                    email,
                },
            }),
        });

        if (!basketResponse.ok) {
            const errText = await basketResponse.text();
            console.error("[Tebex API] Basket creation failed:", errText);
            throw new Error(`Failed to create basket on Tebex (status: ${basketResponse.status})`);
        }

        const basketJson = await basketResponse.json();
        const basketIdent = basketJson.data?.ident;

        if (!basketIdent) {
            throw new Error("Basket identifier not found in Tebex response.");
        }

        let lastBasketData = basketJson;
        for (const item of items) {
            const pkgIdNum = parseInt(item.packageId, 10);
            if (isNaN(pkgIdNum)) {
                console.warn(`[Tebex API] Skipping non-numeric package ID: "${item.packageId}"`);
                continue;
            }

            const addPkgResponse = await fetch(`https://tebex.io{basketIdent}/packages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader,
                },
                body: JSON.stringify({
                    package_id: pkgIdNum,
                    quantity: item.quantity,
                }),
            });

            if (!addPkgResponse.ok) {
                const errText = await addPkgResponse.text();
                console.error(`[Tebex API] Failed to add package ${pkgIdNum} to basket:`, errText);
                throw new Error(`Failed to add package ${pkgIdNum} to Tebex basket`);
            }

            lastBasketData = await addPkgResponse.json();
        }

        const checkoutUrl =
            lastBasketData.data?.links?.checkout ||
            lastBasketData.links?.checkout ||
            `https://tebex.io{basketIdent}`;

        return NextResponse.json({
            success: true,
            checkoutUrl,
        });
    } catch (err: any) {
        console.error("[Tebex API Checkout Route Error]:", err);
        return NextResponse.json(
            { error: err.message || "An error occurred while preparing your checkout." },
            { status: 500 }
        );
    }
}
