"use client";

import { useEffect, useState } from "react";

interface ServerCounterProps {
  serverIp: string;
  serverName: string;
}

export default function ServerCounter({ serverIp, serverName }: ServerCounterProps) {
  const [playersOnline, setPlayersOnline] = useState<number | null>(null);
  const [maxPlayers, setMaxPlayers] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchServerStatus() {
      try {
        // We use the mcsrvstat.us API to safely query your ports
        const response = await fetch(`https://mcsrvstat.us{serverIp}`);
        const data = await response.json();

        if (data.online) {
          setIsOnline(true);
          setPlayersOnline(data.players?.online ?? 0);
          setMaxPlayers(data.players?.max ?? 20);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.error("Failed to query Minecraft server status:", error);
        setIsOnline(false);
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    // Optional: Refresh status every 60 seconds
    const interval = setInterval(fetchServerStatus, 60000);
    return () => clearInterval(interval);
  }, [serverIp]);

  if (loading) {
    return <span className="text-gray-500 animate-pulse">Pinging...</span>;
  }

  if (!isOnline) {
    return <span className="text-red-500 font-bold">Offline</span>;
  }

  return (
    <span className="text-green-600 font-bold">
      {playersOnline} / {maxPlayers} Players Online
    </span>
  );
}
