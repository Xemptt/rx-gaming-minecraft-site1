import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip");

    if (!ip) {
      return NextResponse.json({ error: "Missing server IP parameter" }, { status: 400 });
    }

    const [host] = ip.split(":");

    // We map your active ServerListPlus web ports 
    let webPort = "8804"; // Insanecraft
    if (host.includes("rx-gaming") || host.includes("play.rx-gaming")) {
      webPort = "8805";   // RLCraft
    }

    // WE ROUTE THROUGH A PUBLIC CORS PROXY THAT WORKS NATIVELY INSIDE VERCEL SERVERLESS RESTRICTIONS
    const targetUrl = `http://${host}:${webPort}/api/status`;
    const response = await fetch(`https://allorigins.win{encodeURIComponent(targetUrl)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`CORS proxy rejected handshake for ${host} on port ${webPort}`);
    }

    const wrapperData = await response.json();
    
    // Parse the inner payload string sent back from ServerListPlus
    const data = JSON.parse(wrapperData.contents);

    return NextResponse.json({
      online: true,
      playersOnline: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 20,
    });
  } catch (error) {
    console.error("Cloud status proxy tunnel failure:", error);
    return NextResponse.json({
      online: false,
      playersOnline: 0,
      maxPlayers: 20,
    });
  }
}
