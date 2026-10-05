import { NextResponse } from "next/server";

// Forces Vercel to bypass build cache states and execute live lookups at runtime
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip");

    if (!ip) {
      return NextResponse.json({ error: "Missing server IP parameter" }, { status: 400 });
    }

    const [host] = ip.split(":");

    // We map your custom ServerListPlus web configuration ports 
    let webPort = "8804"; // Default port allocation for your Insanecraft server
    if (host.includes("rx-gaming") || host.includes("play.rx-gaming")) {
      webPort = "8805";   // Triggers Port 8805 for your RLCraft server instance
    }

    // We query your ServerListPlus HTTP endpoint using a secure HTTPS proxy reverse tunnel
    const targetUrl = `http://${host}:${webPort}/api/status`;
    const response = await fetch(`https://allorigins.win{encodeURIComponent(targetUrl)}`, {
      cache: "no-store", // Prevents data caching blocks
    });

    if (!response.ok) {
      throw new Error(`Webserver proxy tunnel rejected query for ${host} on port ${webPort}`);
    }

    const wrapperData = await response.json();
    
    // Parse the inner text string sent back natively from ServerListPlus's web server engine
    const data = JSON.parse(wrapperData.contents);

    return NextResponse.json({
      online: true,
      playersOnline: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 20,
    });
  } catch (error) {
    console.error("Internal ServerListPlus tracker routing failure exception:", error);
    // Graceful baseline metrics fallback protects the UI layout look if your backend ports go offline
    return NextResponse.json({
      online: false,
      playersOnline: 0,
      maxPlayers: 20,
    });
  }
}
