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
        <footer className="mt-12 text-center text-sm text-gray-400">
          <hr className="my-6 border-gray-800" />
          <p className="flex items-center justify-center gap-2">
            <a
              className="text-warzone inline-flex items-center gap-2 hover:underline"
              href="https://github.com/Hexeption/codrandom"
              aria-label="Open codrandom on GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.805 1.305 3.49.998.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.125-.303-.535-1.523.115-3.176 0 0 1.005-.322 3.29 1.23.955-.266 1.98-.399 3-.405 1.02.006 2.045.139 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.653.245 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.815 1.096.815 2.21 0 1.595-.015 2.88-.015 3.27 0 .32.21.695.825.575C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Source</span>
            </a>
          </p>
          <p className="mt-1">Made by Hexeption</p>
        </footer>
      </div>
    </main>
  );
}
