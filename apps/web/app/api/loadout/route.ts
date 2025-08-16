import { NextRequest } from "next/server";
import { randomLoadout } from "@codrandom/randomizer";
import type { Game } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameParam = searchParams.get("game") as Game | null;
  try {
    const loadout = await randomLoadout({ game: gameParam ?? undefined });
    const payload: any = { ...loadout };
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
