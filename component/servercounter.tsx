"use client";

import { useEffect, useState } from "react";

interface ServerCounterProps {
  serverIp: string;
  serverName: string;
}

// FIXED: Explicitly declares the exact capitalized "ServerCounter" default export name TypeScript expects
export default function ServerCounter({ serverIp, serverName }: ServerCounterProps) {
  const [playersOnline, setPlayersOnline] = useState<number>(0);
  const [maxPlayers, setMaxPlayers] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!serverIp) return;

    async function fetchServerStatus() {
      try {
        // Queries your flatter backend route route file at /api
        const response = await fetch(`/api?ip=${encodeURIComponent(serverIp)}`);
        const data = await response.json();
        
        setPlayersOnline(data.playersOnline ?? 0);
        setMaxPlayers(data.maxPlayers ?? 20);
      } catch (error) {
        console.error("Internal API endpoint connection failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Checks for updates every 30 seconds
    return () => clearInterval(interval);
  }, [serverIp]);

  if (loading) {
    return <span className="text-stone-400 text-xs tracking-wider animate-pulse uppercase">Pinging...</span>;
  }

  return (
    <span className="text-stone-800 text-sm font-bold tracking-wide flex items-center gap-1.5">
      {/* Active Pulse Animation Radar Light */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      {playersOnline}/{maxPlayers} <span className="text-[10px] text-stone-400 uppercase ml-0.5">Players</span>
    </span>
  );
}
