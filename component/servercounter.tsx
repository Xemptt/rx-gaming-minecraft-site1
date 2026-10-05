"use client";

import { useEffect, useState } from "react";

interface ServerCounterProps {
  serverIp: string;
  serverName: string;
}

export default function ServerCounter({ serverIp, serverName }: ServerCounterProps) {
  const [playersOnline, setPlayersOnline] = useState<number>(0);
  const [maxPlayers, setMaxPlayers] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!serverIp) return;

    async function fetchServerStatus() {
      try {
        // Parse host and port values cleanly to align with the direct tracker syntax
        const [host, portStr] = serverIp.split(":");
        const port = portStr || "25565";

        // Query the high-performance xdefcon cluster securely via standard HTTPS routes
        const response = await fetch(`https://xdefcon.com{host}/${port}/full`);
        
        if (!response.ok) {
          throw new Error(`Cloud handshake dropped for ${host}:${port}`);
        }

        const data = await response.json();

        // xdefcon processes active variables directly inside data.players and data.max
        if (data && data.success) {
          setPlayersOnline(data.players ?? 0);
          setMaxPlayers(data.max ?? 20);
        }
      } catch (error) {
        console.error("Direct browser socket query failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Pull fresh counters every 30 seconds
    return () => clearInterval(interval);
  }, [serverIp]);

  if (loading) {
    return <span className="text-stone-400 text-xs tracking-wider animate-pulse uppercase">Pinging...</span>;
  }

  return (
    <span className="text-stone-800 text-sm font-bold tracking-wide flex items-center gap-1.5">
      {/* Active Pulse Animation Dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      {playersOnline}/{maxPlayers} <span className="text-[10px] text-stone-400 uppercase ml-0.5">Players</span>
    </span>
  );
}
