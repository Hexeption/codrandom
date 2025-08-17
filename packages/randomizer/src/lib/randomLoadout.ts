import {
  getWeapons,
  getAttachmentsForWeapon,
  getPerksBySlot,
  getEquipmentByType,
  getWiledCards,
  getMeleeWeapons,
} from "@codrandom/data";
import type { Weapon, Attachment, Perk, Equipment, Game } from "@prisma/client";

const rand = <T>(arr: T[]): T => {
  if (!arr.length) throw new Error("rand() called with empty array");
  return arr[Math.floor(Math.random() * arr.length)] as T;
};
const shuffle = <T>(arr: T[]) => arr.slice().sort(() => Math.random() - 0.5);

export type Loadout = {
  primary: Weapon | null;
  primaryAttachments: Attachment[];
  secondary: Weapon | null;
  secondaryAttachments: Attachment[];
  melee: Weapon | null;
  perks: Record<string, Perk>;
  wildcard: WiledCard | null;
  lethal?: Equipment;
  tactical?: Equipment;
};

export type WiledCard = { id: bigint; name: string };

type GameCode = Game;
export type RandomLoadoutOptions = {
  game?: GameCode;
  applyWildcard?: boolean;
  wildcardChance?: number; // 0..1; used if applyWildcard is undefined
};

function idToBigInt(id: unknown): bigint {
  if (typeof id === "bigint") return id;
  if (typeof id === "number") return BigInt(id);
  if (typeof id === "string") return BigInt(id);
  throw new Error("Unsupported id type");
}

export async function randomLoadout(
  opts: RandomLoadoutOptions = {},
): Promise<Loadout> {
  const { game, applyWildcard, wildcardChance } = opts;

  const wildcardPool = await getWiledCards();
  const prob =
    typeof wildcardChance === "number" &&
    wildcardChance >= 0 &&
    wildcardChance <= 1
      ? wildcardChance
      : 0.5;
  const useWildcard = applyWildcard ?? Math.random() < prob;
  const wildcard: WiledCard | null =
    useWildcard && wildcardPool.length
      ? (rand(wildcardPool) as WiledCard)
      : null;

  const primaryCandidates = await getWeapons({ primary: true, game });
  if (!primaryCandidates.length) throw new Error("No primary weapons in DB");
  const primary = rand(primaryCandidates) as Weapon;

  const primAttachPool = await getAttachmentsForWeapon(idToBigInt(primary.id));
  const chosenPrimaryAttachments: Attachment[] = [];
  const slotsUsed = new Set<string>();
  const basePrimaryCap = 5;
  const gunfighter =
    wildcard?.name === "Gunfighter" && primary.game === ("BO6" as Game);
  const primaryCap = gunfighter ? basePrimaryCap + 3 : basePrimaryCap;
  for (const a of shuffle(primAttachPool)) {
    if (slotsUsed.has(a.slot)) continue;
    chosenPrimaryAttachments.push(a);
    slotsUsed.add(a.slot);
    if (chosenPrimaryAttachments.length >= primaryCap) break;
  }

  const overkill = wildcard?.name === "Overkill";
  let secondary: Weapon | null = null;
  if (overkill) {
    const otherPrimaries = primaryCandidates.filter((w) => w.id !== primary.id);
    if (otherPrimaries.length) {
      secondary = rand(otherPrimaries) as Weapon;
    } else {
      const secondaryCandidates = await getWeapons({ secondary: true, game });
      secondary = secondaryCandidates.length
        ? (rand(secondaryCandidates) as Weapon)
        : null;
    }
  } else {
    const secondaryCandidates = await getWeapons({ secondary: true, game });
    secondary = secondaryCandidates.length
      ? (rand(secondaryCandidates) as Weapon)
      : null;
  }

  const chosenSecondaryAttachments: Attachment[] = [];
  if (secondary) {
    const secPool = await getAttachmentsForWeapon(idToBigInt(secondary.id));
    const secSlots = new Set<string>();
    for (const a of shuffle(secPool)) {
      if (secSlots.has(a.slot)) continue;
      chosenSecondaryAttachments.push(a);
      secSlots.add(a.slot);
      if (chosenSecondaryAttachments.length >= 5) break;
    }
  }

  const perkSlots = ["Perk 1", "Perk 2", "Perk 3"];
  const perks: Record<string, Perk> = {};
  for (const slot of perkSlots) {
    const pool = await getPerksBySlot(slot);
    if (pool.length) perks[slot] = rand(pool) as Perk;
  }

  const lethalPool = await getEquipmentByType("lethal");
  const tacticalPool = await getEquipmentByType("tactical");
  const meleePool = await getMeleeWeapons({ game });

  return {
    primary,
    primaryAttachments: chosenPrimaryAttachments,
    secondary,
    secondaryAttachments: chosenSecondaryAttachments,
    melee: meleePool.length ? (rand(meleePool) as Weapon) : null,
    perks,
    wildcard,
    lethal: lethalPool.length ? rand(lethalPool) : undefined,
    tactical: tacticalPool.length ? rand(tacticalPool) : undefined,
  };
}
