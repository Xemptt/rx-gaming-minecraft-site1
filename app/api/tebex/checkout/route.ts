import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip");

    if (!ip) {
      return NextResponse.json({ error: "Missing server IP parameter" }, { status: 400 });
    }

    const [host, portStr] = ip.split(":");
    const port = portStr ? parseInt(portStr, 10) : 25565;

    // Use mcstatus.io's clean API structure
    const response = await fetch(`https://mcstatus.io{host}:${port}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Target tracking server rejected connection (Status: ${response.status})`);
    }

    const data = await response.json();

    return NextResponse.json({
      online: data.online ?? false,
      playersOnline: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 20,
    });
  } catch (error) {
    console.error("Internal API tracker exception:", error);
    return NextResponse.json({
      online: false,
      playersOnline: 0,
      maxPlayers: 20,
    });
  }
}
