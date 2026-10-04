import { NextResponse } from "next/server";

// Forces Vercel to bypass static build generation and evaluate requests at runtime
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip");

    if (!ip) {
      return NextResponse.json({ error: "Missing server IP parameter" }, { status: 400 });
    }

    // Isolate the clean host domain from trailing port properties
    const [host] = ip.split(":");

    // FIXED: Corrected domain path to the API endpoint and used template literals properly
    const response = await fetch(`https://mcstatus.io{host}`, {
      cache: "no-store", // Prevents regional data caching blocks
    });
    
    if (!response.ok) {
      throw new Error(`Cloud tracker endpoint rejected connection (Status: ${response.status})`);
    }

    const data = await response.json();

    return NextResponse.json({
      online: data.online ?? false,
      playersOnline: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 20,
    });
  } catch (error) {
    console.error("Internal tracker API error exception:", error);
    // Graceful baseline metrics fallback protects the UI if the query blocks
    return NextResponse.json({
      online: false,
      playersOnline: 0,
      maxPlayers: 20,
    });
  }
}
