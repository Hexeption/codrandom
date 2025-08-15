/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from "@prisma/client";
import {
  ensureEquipment,
  ensurePerk,
  ensureWiledCard,
  ensureWeapon,
} from "../seed-utils";

export async function seed_core_loadout(prisma: PrismaClient) {
  await ensureEquipment(prisma, "Flashbang", "tactical");
  await ensureEquipment(prisma, "Concussion", "tactical");
  await ensureEquipment(prisma, "Smoke Grenade", "tactical");
  await ensureEquipment(prisma, "Experimental Gas", "tactical");
  await ensureEquipment(prisma, "Snapshot Grenade", "tactical");
  await ensureEquipment(prisma, "Shock Charge", "tactical");
  await ensureEquipment(prisma, "Decoy", "tactical");
  await ensureEquipment(prisma, "Neurogas", "tactical");
  await ensureEquipment(prisma, "Stim Shot", "tactical");
  await ensureEquipment(prisma, "Spy Camera", "tactical");
  await ensureEquipment(prisma, "Frag", "lethal");
  await ensureEquipment(prisma, "Semtex", "lethal");
  await ensureEquipment(prisma, "Impact Grenade", "lethal");
  await ensureEquipment(prisma, "Thermobaric", "lethal");
  await ensureEquipment(prisma, "Molotov Cocktail", "lethal");
  await ensureEquipment(prisma, "Drill Charge", "lethal");
  await ensureEquipment(prisma, "C4", "lethal");
  await ensureEquipment(prisma, "Blast Trap", "lethal");
  await ensureEquipment(prisma, "Spring Mine", "lethal");
  await ensureEquipment(prisma, "Throwing Knife", "lethal");
  await ensureEquipment(prisma, "Combat Axe", "lethal");
  await ensureEquipment(prisma, "Thermite", "lethal");
  await ensureWeapon(prisma, {
    name: "Knife",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Baseball Bat",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Power Drill",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Cleaver",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Skateboard",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Katanas",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Bo Staff",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Sai",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Nunchaku",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Kali Sticks",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Pickaxe",
    category: "melee",
    game: "BO6",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Sledgehammer",
    category: "melee",
    game: "MW3",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Gutter Knife",
    category: "melee",
    game: "MW3",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Gladiator",
    category: "melee",
    game: "MW3",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Karambit",
    category: "melee",
    game: "MW3",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Soulrender",
    category: "melee",
    game: "MW3",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Tonfa",
    category: "melee",
    game: "MW2",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Combat Knife",
    category: "melee",
    game: "MW2",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Dual Kodachis",
    category: "melee",
    game: "MW2",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Dual Kamas",
    category: "melee",
    game: "MW2",
    primary: false,
    secondary: false,
  });
  await ensureWeapon(prisma, {
    name: "Pickaxe",
    category: "melee",
    game: "MW2",
    primary: false,
    secondary: false,
  });
  await ensureWiledCard(prisma, "Overkill");
  await ensureWiledCard(prisma, "Battle Ready");
  await ensureWiledCard(prisma, "Gunfighter");
  await ensurePerk(prisma, "Veteran", "Perk 1");
  await ensurePerk(prisma, "Reflexes", "Perk 1");
  await ensurePerk(prisma, "Low Profile", "Perk 1");
  await ensurePerk(prisma, "Grenadier", "Perk 1");
  await ensurePerk(prisma, "Mountaineer", "Perk 1");
  await ensurePerk(prisma, "Scavenger", "Perk 1");
  await ensurePerk(prisma, "Survivor", "Perk 1");
  await ensurePerk(prisma, "Reactive Armor", "Perk 2");
  await ensurePerk(prisma, "Quartermaster", "Perk 2");
  await ensurePerk(prisma, "Bomb Squad", "Perk 2");
  await ensurePerk(prisma, "Tracker", "Perk 2");
  await ensurePerk(prisma, "Sprinter", "Perk 2");
  await ensurePerk(prisma, "Cold-Blooded", "Perk 2");
  await ensurePerk(prisma, "Quick Fix", "Perk 2");
  await ensurePerk(prisma, "Gung-Ho", "Perk 3");
  await ensurePerk(prisma, "Resolute", "Perk 3");
  await ensurePerk(prisma, "Ghost", "Perk 3");
  await ensurePerk(prisma, "Birdseye", "Perk 3");
  await ensurePerk(prisma, "Tempered", "Perk 3");
  await ensurePerk(prisma, "Alertness", "Perk 3");
}
