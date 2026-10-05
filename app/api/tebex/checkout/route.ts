import { NextResponse } from "next/server";

// Forces Vercel to look up fresh stats at runtime instead of caching defaults at build time
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip");

    if (!ip) {
      return NextResponse.json({ error: "Missing server IP parameter" }, { status: 400 });
    }

    // Connect directly to the high-performance MCAPI.eu status cluster
    const response = await fetch(`https://mcapi.eu{ip}/status`, {
      cache: "no-store", // Prevents regional web browser caching issues
    });

    if (!response.ok) {
      throw new Error(`Cloud socket node rejected handshake for ${ip} (Status: ${response.status})`);
    }

    const data = await response.json();

    return NextResponse.json({
      online: data.status ?? false,
      playersOnline: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 20,
    });
  } catch (error) {
    console.error("Cloud tracking query failed:", error);
    // Graceful default protects your front cards from breaking if the game servers are offline
    return NextResponse.json({
      online: false,
      playersOnline: 0,
      maxPlayers: 20,
    });
  }
}
