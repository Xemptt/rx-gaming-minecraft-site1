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
    async function fetchServerStatus() {
      try {
        // We separate the IP and Port to cleanly query Minetools' API route
        const [host, port] = serverIp.split(":");
        const queryPort = port || "25565";

        const response = await fetch(`https://minetools.im{host}/${queryPort}`);
        const data = await response.json();

        if (data.status === "OK") {
          setPlayersOnline(data.Players ?? 0);
          setMaxPlayers(data.MaxPlayers ?? 20);
        } else {
          // If query protocol fails, pull from their ultra-fast backup ping engine
          const backupRes = await fetch(`https://minetools.im{host}/${queryPort}`);
          const backupData = await backupRes.json();
          
          if (!backupData.error) {
            setPlayersOnline(backupData.players?.online ?? 0);
            setMaxPlayers(backupData.players?.max ?? 20);
          }
        }
      } catch (error) {
        console.error("Failed to query raw live stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Checks for raw updates every 30 seconds
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
