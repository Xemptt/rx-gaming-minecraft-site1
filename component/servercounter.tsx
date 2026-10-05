"use client";

interface ServerCounterProps {
  playersOnline: number;
  maxPlayers: number;
}

export default function ServerCounter({ playersOnline, maxPlayers }: ServerCounterProps) {
  return (
    <span className="text-stone-800 text-sm font-bold tracking-wide flex items-center gap-1.5">
      {/* Active Pulse Animation Radar Dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      {playersOnline}/{maxPlayers} <span className="text-[10px] text-stone-400 uppercase ml-0.5">Players</span>
    </span>
  );
}
