import { NextResponse } from "next/server";
import net from "net";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip");

  if (!ip) {
    return NextResponse.json({ error: "Missing server IP" }, { status: 400 });
  }

  const [host, portStr] = ip.split(":");
  const port = portStr ? parseInt(portStr, 10) : 25565;

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let dataReceived = "";

    socket.setTimeout(3500); // 3.5 second network cutoff timeout limit

    socket.connect(port, host, () => {
      // Send standard Minecraft Handshake + Status Request packet bytes
      const handshakePacket = Buffer.from([
        0x00, // Packet ID (Handshake)
        0xf2, 0x05, // Protocol Version
        host.length, // Host string length
        ...Buffer.from(host), // Server domain string
        (port >> 8) & 0xff, port & 0xff, // Port short bytes
        0x01 // Next state (Status)
      ]);

      const requestPacket = Buffer.from([0x00]); // Request packet ID

      // Prepend lengths to packets
      const sendBuffer = Buffer.concat([
        Buffer.from([handshakePacket.length]), handshakePacket,
        Buffer.from([requestPacket.length]), requestPacket
      ]);

      socket.write(sendBuffer);
    });

    socket.on("data", (chunk) => {
      dataReceived += chunk.toString("utf-8", 2); // Strip packet headers
      socket.destroy(); // Break socket connection safely
    });

    socket.on("end", () => {
      try {
        const startJson = dataReceived.indexOf("{");
        if (startJson !== -1) {
          const rawJson = dataReceived.substring(startJson);
          const parsed = JSON.parse(rawJson);

          resolve(NextResponse.json({
            online: true,
            playersOnline: parsed.players?.online ?? 0,
            maxPlayers: parsed.players?.max ?? 20
          }));
          return;
        }
      } catch (e) {
        console.error("Failed parsing raw socket payload", e);
      }
      resolve(NextResponse.json({ online: false, playersOnline: 0, maxPlayers: 20 }));
    });

    socket.on("error", () => {
      socket.destroy();
      resolve(NextResponse.json({ online: false, playersOnline: 0, maxPlayers: 20 }));
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(NextResponse.json({ online: false, playersOnline: 0, maxPlayers: 20 }));
    });
  });
}
