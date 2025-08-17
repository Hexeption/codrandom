import { LoadoutGenerator } from "@/components/loadout-generator";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-warzone">Warzone</span>{" "}
            <span className="text-warzone">Loadout</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate a complete, ready‑to‑use loadout for Call of Duty: Warzone in seconds.
          </p>
        </div>
        <LoadoutGenerator />
      </div>
    </main>
  );
}
