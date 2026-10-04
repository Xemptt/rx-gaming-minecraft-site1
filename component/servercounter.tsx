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
        // Strip the port out for fallback verification paths
        const [host] = serverIp.split(":");

        // Query the mc-api.net network using a cache-busting timestamp
        const response = await fetch(`https://mc-api.net{host}?t=${Date.now()}`);
        const data = await response.json();

        if (data && data.online) {
          setPlayersOnline(data.players?.online ?? 0);
          setMaxPlayers(data.players?.max ?? 20);
        } else {
          // Alternative emergency endpoint fallback
          const altRes = await fetch(`https://gstatus.eu{host}`);
          const altData = await altRes.json();
          if (altData.online) {
            setPlayersOnline(altData.players.online ?? 0);
            setMaxPlayers(altData.players.max ?? 20);
          }
        }
      } catch (error) {
        console.error("Direct connection stream failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Check numbers every 30 seconds
    return () => clearInterval(interval);
  }, [serverIp]);

  if (loading) {
    return <span className="text-stone-400 text-xs tracking-wider animate-pulse uppercase">Pinging...</span>;
  }

  return (
    <span className="text-stone-800 text-sm font-bold tracking-wide flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      {playersOnline}/{maxPlayers} <span className="text-[10px] text-stone-400 uppercase ml-0.5">Players</span>
    </span>
  );
}
