import { LoadoutGenerator } from "@/components/loadout-generator";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-warzone">WARZONE</span>{" "}
            <span className="text-warzone">LOADOUT</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate the perfect loadout for your next drop into Verdansk
          </p>
        </div>
        <LoadoutGenerator />
      </div>
    </main>
  );
}
