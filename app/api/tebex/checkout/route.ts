import { NextResponse } from "next/server";

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

    // DYNAMIC PORT LOOKUP: Maps the correct Plan web port depending on which host domain is being pinged
    let planWebPort = "8804"; // Default port for Insanecraft (mc.biccys.uk)
    
    if (host.includes("rx-gaming") || host.includes("play.rx-gaming")) {
      planWebPort = "8805";   // Triggers Port 8805 for your RLCraft server!
    }

    // Connect to Plan's legacy JSON data node
    const response = await fetch(`http://${host}:${planWebPort}/api/v1/status`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Plan webserver rejected connection for ${host} on port ${planWebPort}`);
    }

    const data = await response.json();

    return NextResponse.json({
      online: true,
      playersOnline: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 20,
    });
  } catch (error) {
    console.error("Internal Plan API backend fetch failure:", error);
    // Prevents UI crashes by falling back safely to 0/20 if firewalls drop traffic
    return NextResponse.json({
      online: false,
      playersOnline: 0,
      maxPlayers: 20,
    });
  }
}
