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
        // FIXED: Dynamically isolates the domain/IP from the trailing colon port number
        const splitTarget = serverIp.split(":");
        const cleanHost = splitTarget[0];
        const targetPort = splitTarget[1] || "25565";

        // Querying the specific status payload directly 
        const response = await fetch(`https://minetools.im{cleanHost}/${targetPort}`);
        const data = await response.json();

        if (data && !data.error && data.players) {
          setPlayersOnline(data.players.online ?? 0);
          setMaxPlayers(data.players.max ?? 20);
        }
      } catch (error) {
        console.error("Failed to query raw live stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Polls fresh numbers every 30 seconds
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
