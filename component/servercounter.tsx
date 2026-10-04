"use client";

import { useEffect, useState } from "react";

interface ServerCounterProps {
  serverIp: string;
  serverName: string;
}

export default function ServerCounter({ serverIp, serverName }: ServerCounterProps) {
  // We initialize straight to player counters instead of an offline string
  const [playersOnline, setPlayersOnline] = useState<number>(0);
  const [maxPlayers, setMaxPlayers] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchServerStatus() {
      try {
        const response = await fetch(`https://mcsrvstat.us{serverIp}`);
        const data = await response.json();

        // If the server returns active player numbers, pull them in
        if (data.players) {
          setPlayersOnline(data.players.online ?? 0);
          setMaxPlayers(data.players.max ?? 20);
        } else if (data.debug?.query === false) {
          console.warn(`${serverName} UDP query is blocked by hosting firewall.`);
        }
      } catch (error) {
        console.error("Failed to query Minecraft status API:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 45000); // Refreshes numbers every 45s
    return () => clearInterval(interval);
  }, [serverIp, serverName]);

  if (loading) {
    return <span className="text-stone-400 text-xs tracking-wider animate-pulse uppercase">Pinging...</span>;
  }

  return (
    <span className="text-stone-800 text-sm font-bold tracking-wide">
      {playersOnline}/{maxPlayers} <span className="text-[10px] text-stone-400 uppercase ml-0.5">Players</span>
    </span>
  );
}
