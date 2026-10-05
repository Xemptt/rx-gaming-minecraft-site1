import Navbar from "../component/navbar";
import Image from "next/image";
import Footer from "../component/footer";
import storeSettings from "../store-settings.json";
import ServerCounter from "../component/servercounter";

// Forces Vercel to fetch live server statistics dynamically on every page refresh
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getServerData(ip: string) {
  try {
    const res = await fetch(`https://mcstatus.io{ip}`, {
      cache: "no-store",
    });
    if (!res.ok) return { playersOnline: 0, maxPlayers: 20 };
    const data = await res.json();
    return {
      playersOnline: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 20,
    };
  } catch {
    return { playersOnline: 0, maxPlayers: 20 };
  }
}

export default async function Page() {
  // Live native server-to-server data lookups
  const insaneData = await getServerData("mc.biccys.uk:25550");
  const rlcraftData = await getServerData("play.rx-gaming.online:25565");

  const networkServers = [
    {
      name: "Insanecraft",
      tag: "Modded Java",
      tagColor: "bg-purple-100 text-purple-800 border-purple-300",
      ...insaneData,
    },
    {
      name: "RLCraft",
      tag: "Modded Java",
      tagColor: "bg-purple-100 text-purple-800 border-purple-300",
      ...rlcraftData,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-wider text-stone-800 uppercase flex items-center gap-2">
            <span className="w-1.5 h-5 bg-purple-600 inline-block rounded-sm"></span>
            Network Live Feed
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {networkServers.map((server) => (
            <div
              key={server.name}
              className="bg-white border-2 border-stone-900 rounded-sm p-5 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center justify-between transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-stone-900 tracking-wide uppercase text-base">
                  {server.name}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${server.tagColor} uppercase tracking-wider`}>
                  {server.tag}
                </span>
              </div>
              <ServerCounter playersOnline={server.playersOnline} maxPlayers={server.maxPlayers} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
