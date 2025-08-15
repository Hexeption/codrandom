import { NextRequest } from "next/server";
import { randomLoadout } from "@codrandom/randomizer";
import type { Game } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameParam = searchParams.get("game") as Game | null;
  try {
    // Wildcard behavior is fully random inside the library; mask it in API response
    const loadout = await randomLoadout({ game: gameParam ?? undefined });
    const payload: any = { ...loadout, wildcard: null };
    return new Response(
      JSON.stringify(payload, (_k, v) =>
        typeof v === "bigint" ? v.toString() : v,
      ),
      {
        headers: { "content-type": "application/json" },
        status: 200,
      },
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message ?? "Unknown error" }),
      { status: 500 },
    );
  }
}
