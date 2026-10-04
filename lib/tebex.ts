import { Product, ProductMode, ProductCategory, products, getProductsByMode, mappings } from "./products";

const TEBEX_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;

export interface TebexPackage {
    id: number;
    name: string;
    description: string;
    image: string | null;
    base_price: number;
    sales_tax: number;
    total_price: number;
    currency: string;
    discount: number;
    disable_quantity: boolean;
    disable_gifting: boolean;
}

export interface TebexCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    packages: TebexPackage[];
    order: number;
    display_type: string;
    parent: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

function normalizeName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

// Global layout helper to assign custom sub-store front names
export function getServerModeLabel(mode: string): string {
    switch (mode) {
        case "anarchy": return "Insanecraft";
        case "survival": return "RLCraft";
        case "skywars":
        case "practice":
        default: 
            return "COMING SOON...";
    }
}

export async function fetchTebexProducts(mode: string): Promise<Product[]> {
    const targetMode = mode === "anarchia" ? "anarchy" : mode;

    // Handle locked placeholders gracefully 
    if (targetMode === "skywars" || targetMode === "practice") {
        return [];
    }

    if (!TEBEX_PUBLIC_TOKEN) {
        console.info("[Tebex Headless] No public token configured. Operating in simulated DEMO mode.");
        return getProductsByMode(targetMode);
    }

    try {
        // FIX: Fixed missing route paths, forward slashes, and added the correct '\$' variable caller structure 
        const url = `https://tebex.io{TEBEX_PUBLIC_TOKEN}/categories?includePackages=1`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            next: { revalidate: 60 },
        });

        if (!res.ok) throw new Error(`Failed to fetch from Tebex API (status: ${res.status})`);

        const json = await res.json();
        const tebexCategories: TebexCategory[] = json.data || [];
        const mappedProducts: Product[] = [];

        const localProductMap = new Map<string, Product>();
        products.forEach((lp) => { localProductMap.set(normalizeName(lp.name), lp); });

        const seenIds = new Set<string>();

        tebexCategories.forEach((cat) => {
            const catName = cat.name.toLowerCase();
            const catSlug = cat.slug.toLowerCase();
            const parentName = cat.parent?.name?.toLowerCase() || "";
            const parentSlug = cat.parent?.slug?.toLowerCase() || "";

            let detectedCategory: ProductCategory = "other";
            for (const map of mappings.categories) {
                if (map.keywords.some((kw) => catName.includes(kw) || catSlug.includes(kw))) {
                    detectedCategory = map.category;
                    break;
                }
            }

            const checkModeKeyword = (text: string): ProductMode | null => {
                for (const map of mappings.modes) {
                    if (map.keywords.some((kw) => text.includes(kw))) return map.mode;
                }
                return null;
            };

            const parentMode = checkModeKeyword(parentName) || checkModeKeyword(parentSlug);
            const catMode = checkModeKeyword(catName) || checkModeKeyword(catSlug);

            (cat.packages || []).forEach((pkg, index) => {
                const pkgIdStr = pkg.id.toString();
                if (seenIds.has(pkgIdStr)) return;
                seenIds.add(pkgIdStr);

                const normalizedPkgName = normalizeName(pkg.name);
                const localMatch = localProductMap.get(normalizedPkgName);

                const isPromo = pkg.discount > 0 || pkg.base_price > pkg.total_price;
                const originalPrice = isPromo ? pkg.base_price : undefined;

                const pkgMode = checkModeKeyword(pkg.name.toLowerCase());
                const finalDetectedMode = pkgMode || parentMode || catMode || (targetMode as ProductMode);

                if (localMatch) {
                    mappedProducts.push({
                        ...localMatch,
                        id: pkgIdStr,
                        name: pkg.name,
                        price: pkg.total_price,
                        originalPrice,
                        isPromo,
                        img: pkg.image || localMatch.img,
                    });
                } else {
                    let color = "#4EFF8E";
                    let shadowColor = "#16A34A";
                    let fallbackImg = "/box.png";

                    if (detectedCategory === "ranks") {
                        color = "#C084FC";
                        shadowColor = "#7C3AED";
                        fallbackImg = index % 3 === 0 ? "/1.png" : index % 3 === 1 ? "/2.png" : "/3.png";
                    } else if (detectedCategory === "packages") {
                        color = "#22D3EE";
                        shadowColor = "#0891B2";
                        fallbackImg = index % 2 === 0 ? "/1.png" : "/2.png";
                    }

                    mappedProducts.push({
                        id: pkgIdStr,
                        name: pkg.name,
                        price: pkg.total_price,
                        originalPrice,
                        isPromo,
                        color,
                        shadowColor,
                        img: pkg.image || fallbackImg,
                        category: detectedCategory,
                        mode: finalDetectedMode,
                    });
                }
            });
        });

        const filtered = mappedProducts.filter((p) => {
            if (p.isUpsell || p.isReward) return false;
            if (Array.isArray(p.mode)) return p.mode.includes(targetMode as ProductMode);
            return p.mode === targetMode || p.mode === "all";
        });

        if (filtered.length === 0) return getProductsByMode(targetMode);
        return filtered;
    } catch (err) {
        console.error("[Tebex Headless] API Fallback error:", err);
        return getProductsByMode(targetMode);
    }
}
